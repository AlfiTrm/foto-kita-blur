export function PhotoPreview() {
  return (
    <div className="grid size-10 place-items-center rounded-full border border-[#e6e9f0] bg-white text-[#9ba3b6] shadow-[0_10px_24px_rgba(24,39,75,0.08)]">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <path
          d="M7.5 8.5h9A2.5 2.5 0 0 1 19 11v5.5A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5V11A2.5 2.5 0 0 1 7.5 8.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 15.5 10.5 13l2 2 2.5-3 2 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
