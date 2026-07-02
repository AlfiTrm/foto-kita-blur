type GestureStatusProps = {
  gestureName: string | null
  isPeaceDetected: boolean
}

export function GestureStatus({
  gestureName,
  isPeaceDetected,
}: GestureStatusProps) {
  return (
    <div
      className={`flex min-h-10 items-center gap-2 rounded-full border px-3 ${
        isPeaceDetected
          ? 'border-[#d7f2eb] bg-[#effbf7] text-[#3e8f7f]'
          : 'border-[#e8ebf2] bg-white text-[#9ba3b6]'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isPeaceDetected ? 'bg-[#63d3bf]' : 'bg-[#c9cfdb]'
        }`}
      />
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
        {gestureName ?? 'Idle'}
      </span>
    </div>
  )
}
