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
  const frameOverlayRef = useRef<HTMLImageElement | null>(null)
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
      frameImage: frameOverlayRef.current,
      frameId,
      photoFilterId,
      isBlurred,
      video,
    })

    setPhotoDataUrl(nextPhotoDataUrl)
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-5 text-[#49516a] sm:px-6">
      <div className="mx-auto grid min-h-screen max-w-[1040px] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_8.5rem] lg:gap-14 xl:max-w-[970px] xl:grid-cols-[760px_9rem] xl:justify-center xl:gap-24">
        <div className="w-full xl:w-[760px]">
          <CameraView
            error={camera.error ?? gesture.gestureError}
            frameId={frameId}
            frameOverlayRef={frameOverlayRef}
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
        </div>
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
