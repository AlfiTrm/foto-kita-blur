import type { ReactNode } from 'react'

type CameraViewProps = {
  onCapture: () => void
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

export function CameraView({ onCapture }: CameraViewProps) {
  return (
    <section className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[28px] border border-[#e8e8ee] bg-[#dfe5ef] shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,253,255,0.12)_0%,rgba(10,16,32,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_28%),linear-gradient(180deg,#cad8ec_0%,#b1c1d9_38%,#8ba0bb_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(115,141,115,0)_0%,rgba(95,120,97,0.42)_30%,rgba(68,89,72,0.78)_100%)]" />
      <div className="absolute inset-x-10 bottom-0 h-[26%] rounded-t-[50%] bg-[linear-gradient(180deg,rgba(58,83,64,0.35)_0%,rgba(42,61,47,0.82)_100%)] blur-[2px]" />

      <div className="absolute left-1/2 top-[54%] h-[58%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-[40px] bg-[radial-gradient(circle_at_50%_18%,#3a322e_0%,#1f1b1a_64%,#181516_100%)] shadow-[0_16px_50px_rgba(0,0,0,0.22)]" />
      <div className="absolute left-1/2 top-[61%] h-[36%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-[linear-gradient(180deg,#b6b2b3_0%,#a6a0a0_30%,#8a8586_100%)]" />
      <div className="absolute left-1/2 top-[42%] h-[26%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_34%,#f6dec5_0%,#e4bc97_58%,#c89467_100%)] shadow-[0_10px_20px_rgba(0,0,0,0.12)]" />
      <div className="absolute left-1/2 top-[41%] h-[19%] w-[9.5%] -translate-x-[108%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,#f4ddc5_0%,#dfb892_62%,#c79066_100%)]" />
      <div className="absolute left-1/2 top-[41%] h-[19%] w-[9.5%] translate-x-[8%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,#f4ddc5_0%,#dfb892_62%,#c79066_100%)]" />
      <div className="absolute left-1/2 top-[30%] h-[22%] w-[22%] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_38%,#272120_0%,#1b1718_75%,#161214_100%)]" />

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
