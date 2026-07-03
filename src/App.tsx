import { useRef, useState } from 'react'
import { CameraControls } from './components/CameraControls'
import { CameraView } from './components/CameraView'
import { useCamera } from './hooks/useCamera'
import { useGestureDetection } from './hooks/useGestureDetection'
import { useStablePeace } from './hooks/useStablePeace'
import type { CameraTool, FilterPresetId, FramePresetId } from './types/visual'
import { capturePhoto, downloadPhoto } from './utils/capturePhoto'

function App() {
  const [photoFilterId, setPhotoFilterId] = useState<FilterPresetId>('clean')
  const [frameId, setFrameId] = useState<FramePresetId>('none')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<CameraTool>('filter')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const camera = useCamera(videoRef)
  const gesture = useGestureDetection(
    videoRef,
    photoDataUrl === null &&
      camera.permissionState === 'granted' &&
      camera.error === null,
  )
  const isBlurred = useStablePeace(gesture.isPeaceDetected)

  const handleCapture = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }

    const nextPhotoDataUrl = capturePhoto({
      canvas: canvasRef.current,
      frameId,
      photoFilterId,
      isBlurred,
      video,
    })

    setPhotoDataUrl(nextPhotoDataUrl)
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-5 text-[#49516a] sm:px-6">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(11rem,1fr)]">
        <CameraView
          error={camera.error ?? gesture.gestureError}
          frameId={frameId}
          isBlurred={isBlurred}
          isLoading={camera.isLoading || gesture.isModelLoading}
          onRetry={() => {
            void camera.startCamera()
          }}
          photoFilterId={photoFilterId}
          permissionState={camera.permissionState}
          photoDataUrl={photoDataUrl}
          videoRef={videoRef}
        />
        <CameraControls
          captureDisabled={
            photoDataUrl !== null ||
            camera.permissionState !== 'granted' ||
            camera.isLoading
          }
          hasPhoto={photoDataUrl !== null}
          onCapture={handleCapture}
          onDownload={() => {
            if (photoDataUrl) {
              downloadPhoto(photoDataUrl)
            }
          }}
          onRetake={() => {
            setPhotoDataUrl(null)
          }}
          selectedFilter={photoFilterId}
          selectedFrame={frameId}
          selectedTool={selectedTool}
          onSelectFilter={setPhotoFilterId}
          onSelectFrame={setFrameId}
          onSelectTool={setSelectedTool}
        />
      </div>
    </main>
  )
}

export default App
