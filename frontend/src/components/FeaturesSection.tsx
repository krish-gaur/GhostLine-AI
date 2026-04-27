import { useEffect, useRef, useState } from 'react'
import { Network, Brain, Activity, BarChart3, Radar, Globe } from 'lucide-react'

const features = [
  { icon: Network,   title: 'Coordinated Behavior Detection', description: 'Identifies multiple accounts acting in sync across posts, timing, and activity patterns.',           color: 'cyan'    },
  { icon: Brain,     title: 'Semantic Pattern Analysis',      description: 'Detects repeated narratives and phrase variations used to bypass traditional detection.',            color: 'purple'  },
  { icon: Activity,  title: 'Real-Time Monitoring',           description: 'Tracks sudden spikes and synchronized posting behavior as they happen.',                            color: 'emerald' },
  { icon: BarChart3, title: 'Sentiment Tracking',             description: 'Analyzes emotional tone and messaging consistency across coordinated content.',                      color: 'orange'  },
  { icon: Radar,     title: 'Risk Scoring System',            description: 'Assigns threat scores to identify potential coordinated manipulation campaigns.',                    color: 'pink'    },
  { icon: Globe,     title: 'Cross-Platform Analysis',        description: 'Monitors coordination across multiple social media platforms simultaneously.',                       color: 'blue'    },
]

const colorMap = {
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    line: 'bg-cyan-500/30',    hover: 'hover:border-cyan-500/40 hover:shadow-cyan-500/15'    },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  line: 'bg-purple-500/30',  hover: 'hover:border-purple-500/40 hover:shadow-purple-500/15'  },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', line: 'bg-emerald-500/30', hover: 'hover:border-emerald-500/40 hover:shadow-emerald-500/15' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  line: 'bg-orange-500/30',  hover: 'hover:border-orange-500/40 hover:shadow-orange-500/15'  },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    text: 'text-pink-400',    line: 'bg-pink-500/30',    hover: 'hover:border-pink-500/40 hover:shadow-pink-500/15'    },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    line: 'bg-blue-500/30',    hover: 'hover:border-blue-500/40 hover:shadow-blue-500/15'    },
}

export default function FeaturesSection() {
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

  return (
    <section ref={sectionRef} id="features" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced AI capabilities to detect and analyze coordinated manipulation campaigns
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => {
            const c = colorMap[feature.color as keyof typeof colorMap]
            const Icon = feature.icon
            return (
              <div
                key={i}
                className={`group p-6 sm:p-8 rounded-2xl border ${c.border} bg-black/50 backdrop-blur-xl
                             cursor-pointer transition-all duration-500
                             hover:bg-black/70 hover:scale-[1.03] hover:shadow-2xl ${c.hover}
                             ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: visible ? `${i * 80}ms` : '0ms' }}
              >
                <div className={`w-13 h-13 w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-5
                                  group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2.5">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                <div className={`h-px w-0 group-hover:w-full ${c.line} mt-5 transition-all duration-500`} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  )
}
