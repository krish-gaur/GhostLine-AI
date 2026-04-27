import { Github, Twitter, Linkedin, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-800/60 relative bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                GhostLine AI
              </span>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              AI-powered coordination detection system that identifies hidden influence campaigns 
              across social media platforms.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/krish-gaur" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Dashboard', 'Pricing', 'API'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team Credits */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">Built by Team AlGloryThm</p>
            <div className="flex justify-center gap-8">
              <a 
                href="https://github.com/krish-gaur" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">Krish Gaur</span>
              </a>
              <a 
                href="https://github.com/Vagisha13" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">Vagisha Garg</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2026 GhostLine AI. All rights reserved.</p>
          <p className="mt-2">Nerds Room x TRAE</p>
        </div>
      </div>
    </footer>
  )
}
