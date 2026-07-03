import type { RefObject } from 'react'
import type { CameraPermissionState } from '../types/camera'
import type { FilterPresetId, FramePresetId } from '../types/visual'
import {
  getPreviewFilterStyle,
  renderFrameOverlay,
} from '../utils/visualOptions'

type CameraViewProps = {
  error: string | null
  frameId: FramePresetId
  isBlurred: boolean
  isLoading: boolean
  onRetry: () => void
  photoFilterId: FilterPresetId
  permissionState: CameraPermissionState
  photoDataUrl: string | null
  videoRef: RefObject<HTMLVideoElement | null>
}

export function CameraView({
  error,
  frameId,
  isBlurred,
  isLoading,
  onRetry,
  photoFilterId,
  permissionState,
  photoDataUrl,
  videoRef,
}: CameraViewProps) {
  const showOverlay = photoDataUrl === null && (isLoading || error !== null)

  return (
    <section className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[30px] border border-white/80 bg-[#dfe5ef] shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
      {photoDataUrl ? (
        <img
          src={photoDataUrl}
          alt="Captured result"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover transition-[filter] duration-300 ease-out"
          style={getPreviewFilterStyle(photoFilterId, isBlurred)}
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,253,255,0.08)_0%,rgba(10,16,32,0.12)_100%)]" />
      <div
        className={`absolute inset-0 bg-white/8 transition-opacity duration-300 ease-out ${
          isBlurred && photoDataUrl === null ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {renderFrameOverlay(frameId)}

      {showOverlay ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(25,31,43,0.24)] px-6">
          <div className="w-full max-w-xs rounded-[24px] bg-white/86 p-5 text-center text-[#4e5569] shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-md">
            <div className="mx-auto mb-4 h-2 w-10 rounded-full bg-[#d8ddeb]" />
            <p className="text-sm font-medium">
              {isLoading
                ? 'Opening camera...'
                : error ?? 'Camera is unavailable.'}
            </p>
            {permissionState === 'denied' || error ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-full bg-[#4d556c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3f465b]"
              >
                Retry
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
