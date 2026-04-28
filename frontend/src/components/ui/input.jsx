export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-md bg-black/40 border border-gray-600 text-white focus:outline-none focus:border-cyan-400 ${className}`}
      {...props}
    />
  )
}