import type { ReactNode, RefObject } from 'react'
import type { CameraPermissionState } from '../types/camera'

type CameraViewProps = {
  error: string | null
  isBlurred: boolean
  isLoading: boolean
  onCapture: () => void
  onRetry: () => void
  permissionState: CameraPermissionState
  videoRef: RefObject<HTMLVideoElement | null>
}

function GhostButton({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      className={`grid size-12 place-items-center rounded-full border border-white/35 bg-white/12 text-white backdrop-blur-md transition hover:bg-white/18 ${className}`}
    >
      {children}
    </button>
  )
}

export function CameraView({
  error,
  isBlurred,
  isLoading,
  onCapture,
  onRetry,
  permissionState,
  videoRef,
}: CameraViewProps) {
  const showOverlay = isLoading || error !== null

  return (
    <section className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[28px] border border-[#e8e8ee] bg-[#dfe5ef] shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute inset-0 h-full w-full scale-x-[-1] object-cover transition-[filter] duration-300 ease-out ${
          isBlurred ? 'blur-md' : 'blur-0'
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,253,255,0.08)_0%,rgba(10,16,32,0.12)_100%)]" />
      <div
        className={`absolute inset-0 bg-white/8 transition-opacity duration-300 ease-out ${
          isBlurred ? 'opacity-100' : 'opacity-0'
        }`}
      />

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

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="h-2 w-2 rounded-full bg-white/70" />
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full bg-white/10 text-white/85 backdrop-blur-md"
        >
          <span className="flex flex-col gap-0.5">
            <span className="h-0.5 w-0.5 rounded-full bg-current" />
            <span className="h-0.5 w-0.5 rounded-full bg-current" />
            <span className="h-0.5 w-0.5 rounded-full bg-current" />
          </span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <GhostButton>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path
              d="M7 9.5v5c0 1.933 1.567 3.5 3.5 3.5S14 16.433 14 14.5v-5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M10.5 6.5A2.5 2.5 0 0 1 13 9v5.5a2.5 2.5 0 0 1-5 0V9a2.5 2.5 0 0 1 2.5-2.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        </GhostButton>

        <button
          type="button"
          onClick={onCapture}
          className="grid size-16 place-items-center rounded-full border border-white/55 bg-white/16 backdrop-blur-md transition hover:bg-white/22"
          aria-label="Capture photo"
        >
          <span className="grid size-12 place-items-center rounded-full border border-white/80 bg-white/92" />
        </button>

        <GhostButton>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path
              d="M12 7.5a4.5 4.5 0 1 0 4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M16.5 7.5H12V3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </GhostButton>
      </div>
    </section>
  )
}
