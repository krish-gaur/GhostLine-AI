import { useEffect, useRef, useState } from 'react'
import { AlertOctagon, TrendingUp, Eye, MessageSquareWarning } from 'lucide-react'

const problems = [
  {
    icon: AlertOctagon,
    title: 'Invisible Coordination',
    body: 'Modern misinformation no longer depends on obvious spam. Coordinated networks spread manipulated narratives using synchronized posting and subtle phrase variations to appear organic.',
    accent: '#00ffaa',        // cyan-green — matches hero
    accentClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/20',
    bgClass: 'bg-cyan-500/5',
    iconBg: 'bg-cyan-500/10',
    glowColor: 'rgba(0,255,170,0.12)',
    tag: 'DETECTION GAP',
  },
  {
    icon: Eye,
    title: 'Blind Moderation Systems',
    body: 'Existing platforms focus on individual posts but completely fail to detect hidden coordination patterns operating silently across hundreds of linked accounts.',
    accent: '#8b5cf6',
    accentClass: 'text-violet-400',
    borderClass: 'border-violet-500/20',
    bgClass: 'bg-violet-500/5',
    iconBg: 'bg-violet-500/10',
    glowColor: 'rgba(139,92,246,0.12)',
    tag: 'BLIND SPOT',
  },
  {
    icon: TrendingUp,
    title: 'Massive Scale Impact',
    body: 'Social media now directly shapes politics, finance and public discourse. Coordinated manipulation campaigns can distort public opinion before any detection occurs.',
    accent: '#3b82f6',
    accentClass: 'text-blue-400',
    borderClass: 'border-blue-500/20',
    bgClass: 'bg-blue-500/5',
    iconBg: 'bg-blue-500/10',
    glowColor: 'rgba(59,130,246,0.12)',
    tag: 'SCALE RISK',
  },
  {
    icon: MessageSquareWarning,
    title: 'Eroding Public Trust',
    body: 'As artificial amplification goes undetected, trust in online platforms erodes. The damage is cumulative — and by the time it is noticed, the narrative has already spread.',
    accent: '#10b981',
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
    bgClass: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    glowColor: 'rgba(16,185,129,0.12)',
    tag: 'TRUST EROSION',
  },
]

function ProblemCard({
  problem, index, visible,
}: {
  problem: typeof problems[0]; index: number; visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const Icon = problem.icon

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-2xl border ${problem.borderClass} overflow-hidden cursor-pointer
                   transition-all duration-500
                   ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: visible ? `${index * 120 + 200}ms` : '0ms',
        transform: visible
          ? hovered
            ? `translateY(-6px) scale(1.02)`
            : 'translateY(0) scale(1)'
          : 'translateY(40px)',
        boxShadow: hovered
          ? `0 20px 60px -10px ${problem.glowColor}, 0 0 0 1px ${problem.accent}33`
          : '0 0 0 1px transparent',
      }}
    >
      {/* Dark base — matches site bg */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Mouse-tracked radial glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${mouse.x}% ${mouse.y}%, ${problem.glowColor}, transparent 70%)`,
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${problem.accent}44 1px, transparent 1px), linear-gradient(90deg, ${problem.accent}44 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Animated top border line */}
      <div
        className="absolute top-0 left-0 h-[2px] transition-all duration-500"
        style={{
          width: hovered ? '100%' : '0%',
          background: `linear-gradient(90deg, transparent, ${problem.accent}, transparent)`,
        }}
      />

      {/* Scan line sweep on hover */}
      <div
        className="absolute inset-x-0 h-[1px] pointer-events-none transition-all"
        style={{
          top: hovered ? '100%' : '-5%',
          opacity: hovered ? 0 : 0.4,
          background: `linear-gradient(90deg, transparent, ${problem.accent}88, transparent)`,
          transition: hovered ? 'top 0.6s ease-in' : 'none',
        }}
      />

      {/* Corner accent — top right */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-20"
        style={{
          background: `radial-gradient(circle at top right, ${problem.accent}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-7">
        {/* Tag + number row */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-[9px] font-black tracking-[0.2em] px-2.5 py-1 rounded-sm border"
            style={{
              color: problem.accent,
              borderColor: `${problem.accent}44`,
              backgroundColor: `${problem.accent}10`,
            }}
          >
            {problem.tag}
          </span>
          <span
            className="text-5xl font-black font-mono select-none leading-none"
            style={{ color: `${problem.accent}12` }}
          >
            0{index + 1}
          </span>
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl ${problem.iconBg} flex items-center justify-center mb-5
                       transition-all duration-300 group-hover:scale-110`}
          style={{
            boxShadow: hovered ? `0 0 20px ${problem.accent}30` : 'none',
            border: `1px solid ${problem.accent}25`,
          }}
        >
          <Icon className={`w-6 h-6 ${problem.accentClass}`} />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
          {problem.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">
          {problem.body}
        </p>

        {/* Bottom read-more hint */}
        <div
          className="flex items-center gap-2 mt-5 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${problem.accent}60, transparent)` }} />
          <span className="text-[10px] font-semibold tracking-widest" style={{ color: problem.accent }}>
            LEARN MORE
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ProblemStatement() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => { if (e[0].isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} id="problem" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background — matches site dark palette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-1/3 w-[700px] h-[700px] bg-cyan-500/4 rounded-full blur-[200px]" />
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-violet-500/4 rounded-full blur-[180px]" />
        {/* Horizontal grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,170,0.5) 1px, transparent 1px)',
            backgroundSize: '100% 80px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Header ─────────────────────────────── */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase">The Problem</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5">
            <span className="text-white">The Hidden Threat</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              on Social Media
            </span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Coordinated influence operations have evolved beyond simple bots. They now mimic
            organic human behavior so convincingly that traditional detection systems miss them entirely.
          </p>
        </div>

        {/* ── Cards 2×2 ──────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-14">
          {problems.map((p, i) => (
            <ProblemCard key={i} problem={p} index={i} visible={visible} />
          ))}
        </div>

        {/* ── Stats bar ──────────────────────────── */}
        <div
          className={`relative rounded-2xl border border-cyan-500/10 overflow-hidden
                       transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: visible ? '680ms' : '0ms' }}
        >
          {/* Dark bg matching site */}
          <div className="absolute inset-0 bg-[#0a0a0f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5" />
          {/* top border glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          <div className="relative z-10 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-800/60">
            {[
              { value: '96%',  sub: 'campaigns undetected',       label: 'of coordinated manipulation goes undetected by standard moderation tools',  color: '#00ffaa' },
              { value: '4.2B', sub: 'users exposed daily',        label: 'social media users are exposed to coordinated manipulation every single day', color: '#8b5cf6' },
              { value: '3×',   sub: 'faster false spread',        label: 'faster spread rate of false narratives compared to organic true content',    color: '#3b82f6' },
            ].map(({ value, sub, label, color }, i) => (
              <div key={i} className="group px-8 py-8 text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(180px circle at 50% 50%, ${color}10, transparent)` }}
                />
                <div
                  className="text-4xl sm:text-5xl font-black font-mono mb-1 relative z-10"
                  style={{ color }}
                >
                  {value}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase mb-2 relative z-10" style={{ color: `${color}80` }}>
                  {sub}
                </div>
                <div className="text-gray-500 text-xs leading-snug relative z-10 max-w-[180px] mx-auto">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


