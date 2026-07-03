import type { FilterPresetId, FramePresetId } from '../types/visual'
import { getFilterStyle } from './visualOptions'

type CapturePhotoParams = {
  canvas: HTMLCanvasElement
  frameId: FramePresetId
  photoFilterId: FilterPresetId
  isBlurred: boolean
  video: HTMLVideoElement
}

export function capturePhoto({
  canvas,
  frameId,
  photoFilterId,
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
  context.filter = getFilterStyle(photoFilterId, isBlurred)
  context.translate(width, 0)
  context.scale(-1, 1)
  context.drawImage(video, 0, 0, width, height)
  context.filter = 'none'
  context.restore()

  drawFrame(context, width, height, frameId)

  return canvas.toDataURL('image/jpeg', 0.92)
}

export function downloadPhoto(dataUrl: string, filename = 'foto-kita-blur.jpg') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

function drawFrame(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameId: FramePresetId,
) {
  if (frameId === 'none') {
    return
  }

  if (frameId === 'classic') {
    context.save()
    context.strokeStyle = '#fff3d2'
    context.lineWidth = 14
    context.strokeRect(7, 7, width - 14, height - 14)
    context.strokeStyle = '#bf9868'
    context.lineWidth = 2
    context.strokeRect(20, 20, width - 40, height - 40)
    context.restore()
    return
  }

  if (frameId === 'ribbon') {
    context.save()
    context.fillStyle = '#ffc4dd'
    context.fillRect(0, 0, width, 18)
    context.fillRect(0, height - 18, width, 18)
    context.fillStyle = '#ffd3e5'
    context.fillRect(0, 0, 18, height)
    context.fillRect(width - 18, 0, 18, height)
    context.restore()
    return
  }

  context.save()
  context.strokeStyle = 'rgba(255,255,255,0.8)'
  context.lineWidth = 2
  context.strokeRect(18, 18, width - 36, height - 36)
  context.fillStyle = 'rgba(255,255,255,0.92)'
  context.beginPath()
  context.arc(34, 34, 6, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = 'rgba(255,246,199,0.95)'
  context.beginPath()
  context.arc(width - 38, height - 38, 4, 0, Math.PI * 2)
  context.fill()
  context.restore()
}
