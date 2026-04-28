import { useState } from "react"

export function Collapsible({ children }) {
  return <div>{children}</div>
}

export function CollapsibleTrigger({ children, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  )
}

export function CollapsibleContent({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div onClick={() => setOpen(!open)} />
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}