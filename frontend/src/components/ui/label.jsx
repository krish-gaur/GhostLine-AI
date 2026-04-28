export function Label({ children, className = "", ...props }) {
  return (
    <label className={`text-sm text-gray-300 ${className}`} {...props}>
      {children}
    </label>
  )
}