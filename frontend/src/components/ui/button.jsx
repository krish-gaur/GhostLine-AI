import React from "react"

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}