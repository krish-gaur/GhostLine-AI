import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface StatData {
  label: string
  value: number
  suffix: string
  color: string
}

const stats: StatData[] = [
  { label: 'Threats Detected', value: 142857, suffix: '', color: '#00ffaa' },
  { label: 'Networks Mapped',  value: 3241,   suffix: '', color: '#8b5cf6' },
  { label: 'Accuracy Rate',    value: 89.2,   suffix: '%', color: '#3b82f6' },
  { label: 'Active Monitors',  value: 24,     suffix: '/7', color: '#ff6b35' }
]

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease-out-expo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setDisplayValue(eased * value)
            if (progress < 1) rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
    if (n % 1 !== 0)    return n.toFixed(1)
    return Math.floor(n).toLocaleString()
  }

  return (
    <span ref={ref} className="font-mono">
      {fmt(displayValue)}{suffix}
    </span>
  )
}

function D3Chart() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = 400, H = 200
    const m = { top: 20, right: 20, bottom: 30, left: 40 }

    const data = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      threats: Math.floor(Math.random() * 100) + 20
    }))

    const x = d3.scaleLinear().domain([0, 23]).range([m.left, W - m.right])
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.threats)!]).range([H - m.bottom, m.top])

    const grad = svg.append('defs').append('linearGradient')
      .attr('id', 'areaGrad').attr('x1','0%').attr('y1','0%').attr('x2','0%').attr('y2','100%')
    grad.append('stop').attr('offset','0%').attr('stop-color','#00ffaa').attr('stop-opacity', 0.3)
    grad.append('stop').attr('offset','100%').attr('stop-color','#00ffaa').attr('stop-opacity', 0)

    const area = d3.area<typeof data[0]>()
      .x(d => x(d.hour)).y0(H - m.bottom).y1(d => y(d.threats)).curve(d3.curveMonotoneX)

    svg.append('path').datum(data).attr('fill','url(#areaGrad)').attr('d', area)
      .attr('opacity', 0).transition().duration(1500).attr('opacity', 1)

    const line = d3.line<typeof data[0]>()
      .x(d => x(d.hour)).y(d => y(d.threats)).curve(d3.curveMonotoneX)

    const path = svg.append('path').datum(data)
      .attr('fill','none').attr('stroke','#00ffaa').attr('stroke-width', 2).attr('d', line)

    const len = path.node()?.getTotalLength() ?? 0
    path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
      .transition().duration(2000).ease(d3.easeLinear).attr('stroke-dashoffset', 0)

    svg.selectAll('.dot').data(data).join('circle')
      .attr('cx', d => x(d.hour)).attr('cy', d => y(d.threats)).attr('r', 0).attr('fill','#00ffaa')
      .transition().delay((_, i) => i * 50).duration(500).attr('r', 3)

    svg.append('g').attr('transform',`translate(0,${H - m.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}h`))
      .attr('color','#4a5568').selectAll('text').attr('fill','#6b7280')

    svg.append('g').attr('transform',`translate(${m.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr('color','#4a5568').selectAll('text').attr('fill','#6b7280')
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <svg ref={svgRef} width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" />
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl border border-gray-800 bg-black/60 backdrop-blur-xl text-center
                         hover:border-cyan-500/40 hover:bg-black/80 transition-all duration-300
                         hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-5 sm:p-6 rounded-2xl border border-gray-800 bg-black/60 backdrop-blur-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Threat Activity (24h)</h3>
            <D3Chart />
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-gray-800 bg-black/60 backdrop-blur-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Active Threat Types</h3>
            <div className="space-y-4">
              {[
                { label: 'Bot Networks',          value: 45, color: '#00ffaa' },
                { label: 'Coordinated Accounts',  value: 32, color: '#8b5cf6' },
                { label: 'Fake News Spreaders',   value: 18, color: '#ff6b35' },
                { label: 'Astroturfing',          value:  5, color: '#3b82f6' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-mono font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
