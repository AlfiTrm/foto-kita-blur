type CapturePhotoParams = {
  canvas: HTMLCanvasElement
  isBlurred: boolean
  video: HTMLVideoElement
}

const CAPTURE_BLUR_FILTER = 'blur(14px)'

export function capturePhoto({
  canvas,
  isBlurred,
  video,
}: CapturePhotoParams) {
  const width = video.videoWidth
  const height = video.videoHeight

  if (width === 0 || height === 0) {
    throw new Error('Video frame is not ready for capture.')
  }

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is not available.')
  }

  context.save()
  context.filter = isBlurred ? CAPTURE_BLUR_FILTER : 'none'
  context.translate(width, 0)
  context.scale(-1, 1)
  context.drawImage(video, 0, 0, width, height)
  context.filter = 'none'
  context.restore()

  return canvas.toDataURL('image/jpeg', 0.92)
}

export function downloadPhoto(dataUrl: string, filename = 'foto-kita-blur.jpg') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
