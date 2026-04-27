import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle, Clock, Users, Activity, TrendingUp } from 'lucide-react'

interface ThreatItem {
  id: number
  type: string
  severity: 'high' | 'medium' | 'low'
  accounts: number
  message: string
  time: string
}

const mockThreats: ThreatItem[] = [
  { id: 1, type: 'Bot Network',           severity: 'high',   accounts: 247, message: 'Coordinated amplification detected',   time: '2 min ago' },
  { id: 2, type: 'Astroturfing',           severity: 'medium', accounts: 89,  message: 'Fake grassroots campaign identified',  time: '5 min ago' },
  { id: 3, type: 'Narrative Manipulation', severity: 'high',   accounts: 156, message: 'Synchronized messaging pattern',      time: '8 min ago' },
  { id: 4, type: 'Troll Farm',             severity: 'medium', accounts: 63,  message: 'Cross-platform coordination found',   time: '12 min ago' },
  { id: 5, type: 'Deepfake Distribution',  severity: 'low',    accounts: 31,  message: 'AI-generated content spreading',      time: '15 min ago' },
]

const severityColors = {
  high:   { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    dot: 'bg-red-500',    badge: 'bg-red-500/20'    },
  medium: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500', badge: 'bg-orange-500/20' },
  low:    { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-500', badge: 'bg-yellow-500/20' },
}

function ThreatCard({ threat }: { threat: ThreatItem }) {
  const c = severityColors[threat.severity]
  return (
    <div className={`p-4 rounded-xl border ${c.border} ${c.bg} backdrop-blur-sm
                     hover:scale-[1.02] hover:brightness-110 transition-all duration-300 cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${c.dot} animate-pulse mt-0.5`} />
          <span className="font-semibold text-white text-sm sm:text-base">{threat.type}</span>
        </div>
        <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${c.text} ${c.badge}`}>
          {threat.severity}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3 ml-5">{threat.message}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 ml-5">
        <span className="flex items-center gap-1.5"><Users className="w-3 h-3" />{threat.accounts} accounts</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{threat.time}</span>
      </div>
    </div>
  )
}

export default function ThreatDashboard() {
  const [activeThreats, setActiveThreats] = useState(mockThreats)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat: ThreatItem = {
        id: Date.now(),
        type: ['Bot Network', 'Astroturfing', 'Troll Farm', 'Narrative Manipulation'][Math.floor(Math.random() * 4)],
        severity: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)],
        accounts: Math.floor(Math.random() * 300) + 10,
        message: 'New coordinated activity detected',
        time: 'Just now'
      }
      setActiveThreats(prev => [newThreat, ...prev.slice(0, 4)])
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const sideStats = [
    { icon: AlertTriangle, value: '12',   label: 'Critical Threats', color: 'red'     as const },
    { icon: Activity,      value: '847',  label: 'Active Scans',     color: 'cyan'    as const },
    { icon: CheckCircle,   value: '3.2K', label: 'Resolved Today',   color: 'emerald' as const },
    { icon: TrendingUp,    value: '+24%', label: 'Detection Rate',   color: 'purple'  as const },
  ]
  const sideColors = {
    red:     { border: 'border-red-500/20',     bg: 'bg-red-500/5',     icon: 'bg-red-500/20',     text: 'text-red-400'     },
    cyan:    { border: 'border-cyan-500/20',    bg: 'bg-cyan-500/5',    icon: 'bg-cyan-500/20',    text: 'text-cyan-400'    },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', icon: 'bg-emerald-500/20', text: 'text-emerald-400' },
    purple:  { border: 'border-purple-500/20',  bg: 'bg-purple-500/5',  icon: 'bg-purple-500/20',  text: 'text-purple-400'  },
  }

  return (
    <section ref={sectionRef} id="dashboard" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Threat Dashboard
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time monitoring and alert system for coordinated manipulation campaigns
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Stats Sidebar */}
          <div className="space-y-4">
            {sideStats.map(({ icon: Icon, value, label, color }, i) => {
              const c = sideColors[color]
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border ${c.border} ${c.bg} backdrop-blur-xl
                               transition-all duration-500
                               ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: visible ? `${i * 100 + 500}ms` : '0ms' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${c.icon} flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                    <div>
                      <div className={`text-2xl sm:text-3xl font-bold ${c.text}`}>{value}</div>
                      <div className="text-gray-400 text-sm">{label}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Threat Feed */}
          <div className="lg:col-span-2">
            <div className="p-5 sm:p-6 rounded-2xl border border-gray-800 bg-black/60 backdrop-blur-xl h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Live Threat Feed</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Live</span>
                </div>
              </div>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1.5 custom-scroll">
                {activeThreats.map((threat) => (
                  <ThreatCard key={threat.id} threat={threat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]
                      bg-cyan-500/5 rounded-full blur-[200px] pointer-events-none" />
    </section>
  )
}
