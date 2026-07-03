import { useRef, useState } from 'react'
import { CameraControls } from './components/CameraControls'
import { CameraView } from './components/CameraView'
import { useCamera } from './hooks/useCamera'
import { useGestureDetection } from './hooks/useGestureDetection'
import { useStablePeace } from './hooks/useStablePeace'
import { capturePhoto, downloadPhoto } from './utils/capturePhoto'

function App() {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<'camera' | 'filter' | 'frame'>(
    'camera',
  )
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
      isBlurred,
      video,
    })

    setPhotoDataUrl(nextPhotoDataUrl)
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-5 text-[#49516a] sm:px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-4">
        <CameraView
          captureDisabled={
            photoDataUrl !== null ||
            camera.permissionState !== 'granted' ||
            camera.isLoading
          }
          error={camera.error ?? gesture.gestureError}
          isBlurred={isBlurred}
          isLoading={camera.isLoading || gesture.isModelLoading}
          onCapture={handleCapture}
          onDownload={() => {
            if (photoDataUrl) {
              downloadPhoto(photoDataUrl)
            }
          }}
          onRetake={() => {
            setPhotoDataUrl(null)
          }}
          onRetry={() => {
            void camera.startCamera()
          }}
          permissionState={camera.permissionState}
          photoDataUrl={photoDataUrl}
          videoRef={videoRef}
        />
        <CameraControls
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
        />
      </div>
    </main>
  )
}

export default App
