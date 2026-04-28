import React from "react"

export function ToggleGroup({ children, value, onValueChange }) {
  return (
    <div className="flex gap-2">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          active: child.props.value === value,
          onClick: () => onValueChange(child.props.value),
        })
      )}
    </div>
  )
}

export function ToggleGroupItem({ children, value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md border transition-all ${
        active
          ? "bg-cyan-500 text-white border-cyan-500"
          : "bg-transparent text-gray-300 border-gray-600 hover:border-cyan-400"
      }`}
    >
      {children}
    </button>
  )
}