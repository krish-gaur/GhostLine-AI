import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15
        if (next >= 100) { clearInterval(interval); return 100 }
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#050508] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(0,255,170,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,255,170,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Pulse rings */}
      {[0,1,2].map(i => (
        <div key={i} className="absolute rounded-full border border-cyan-500/20"
             style={{
               width: `${180 + i * 120}px`, height: `${180 + i * 120}px`,
               animation: `ring-pulse ${1.5 + i * 0.4}s ease-out ${i * 0.3}s infinite`
             }} />
      ))}

      {/* Logo */}
      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight" style={{ animation: 'fadeUp 0.8s ease forwards' }}>
          {'GhostLine'.split('').map((l, i) => (
            <span key={i} className="inline-block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
                  style={{ opacity: 0, animation: `fadeUp 0.6s ease ${i * 0.07 + 0.2}s forwards` }}>
              {l}
            </span>
          ))}
        </h1>
        <p className="text-gray-500 text-xs font-mono tracking-[0.3em] mt-2">AI THREAT DETECTION</p>
      </div>

      {/* Progress */}
      <div className="w-56 sm:w-72 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
             style={{ width: `${Math.min(progress, 100)}%`, boxShadow: '0 0 12px #00ffaa88' }} />
      </div>
      <p className="text-gray-500 mt-4 font-mono text-xs tracking-widest">
        INITIALIZING SYSTEM... {Math.min(Math.floor(progress), 100)}%
      </p>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ring-pulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.6); }
        }
      `}</style>
    </div>
  )
}
