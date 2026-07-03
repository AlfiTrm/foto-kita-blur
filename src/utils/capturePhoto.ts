import type { FilterPresetId, FramePresetId } from '../types/visual'
import {
  getFilterStyle,
  getFrameOverlayScale,
  getStageAspectRatio,
} from './visualOptions'

type CapturePhotoParams = {
  canvas: HTMLCanvasElement
  frameImage?: CanvasImageSource | null
  frameId: FramePresetId
  photoFilterId: FilterPresetId
  isBlurred: boolean
  video: HTMLVideoElement
}

export function capturePhoto({
  canvas,
  frameImage,
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

  const targetAspectRatio = getStageAspectRatio(frameId)
  const crop = getCoverCropRect(width, height, targetAspectRatio)

  canvas.width = Math.round(crop.width)
  canvas.height = Math.round(crop.height)

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is not available.')
  }

  context.save()
  context.filter = getFilterStyle(photoFilterId, isBlurred)
  context.translate(canvas.width, 0)
  context.scale(-1, 1)
  context.drawImage(
    video,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  context.filter = 'none'
  context.restore()

  drawFrame(context, canvas.width, canvas.height, frameId, frameImage)

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
  frameImage?: CanvasImageSource | null,
) {
  if (frameId === 'none' || !frameImage) {
    return
  }
  const scale = getFrameOverlayScale(frameId)
  const drawWidth = width * scale
  const drawHeight = height * scale
  const offsetX = (width - drawWidth) / 2
  const offsetY = (height - drawHeight) / 2

  context.drawImage(frameImage, offsetX, offsetY, drawWidth, drawHeight)
}

function getCoverCropRect(
  sourceWidth: number,
  sourceHeight: number,
  targetAspectRatio: number,
) {
  const sourceAspectRatio = sourceWidth / sourceHeight

  if (sourceAspectRatio > targetAspectRatio) {
    const cropWidth = sourceHeight * targetAspectRatio

    return {
      height: sourceHeight,
      width: cropWidth,
      x: (sourceWidth - cropWidth) / 2,
      y: 0,
    }
  }

  const cropHeight = sourceWidth / targetAspectRatio

  return {
    height: cropHeight,
    width: sourceWidth,
    x: 0,
    y: (sourceHeight - cropHeight) / 2,
  }
}
