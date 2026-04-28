export function Badge({ children, className = "" }) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 ${className}`}
    >
      {children}
    </span>
  )
}