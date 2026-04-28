import { useState, useEffect } from 'react'
import { Shield, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Problem',      href: '#problem'   },
  { label: 'Features',     href: '#features'  },
  { label: 'How It Works', href: '#demo'      },
  { label: 'Dashboard',    href: '#dashboard' },

  { label: 'Use Cases',    href: '#usecases'  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                     ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 cursor-pointer">
          <div className="relative">
            <Shield className="w-7 h-7 text-cyan-400 relative z-10" />
            <Shield className="w-7 h-7 text-cyan-400 opacity-30 absolute inset-0 animate-ping" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            GhostLine AI
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map(({ label, href }) => (
            <a key={label} href={href}
               className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium relative
                          after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-cyan-400
                          after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
              {label}
            </a>
          ))}
          <a href="#demo"
             className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full text-black
                        font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/30
                        transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
            Get Started
          </a>
        </div>

        <button className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-black/95 backdrop-blur-xl border-t border-cyan-500/10 px-4 py-5 flex flex-col gap-2">
          {navItems.map(({ label, href }) => (
            <a key={label} href={href}
               className="text-gray-400 hover:text-cyan-400 transition-colors py-2.5 text-base font-medium border-b border-gray-800/50 last:border-0"
               onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <button className="mt-3 w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl text-black font-semibold text-sm">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}