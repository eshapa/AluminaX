import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-dark-900 pt-20 pb-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-(200px) bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                AX
              </div>
              <span className="font-display font-bold text-xl text-white">
                AluminaX
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering students through intelligent alumni mentorship. Build your future with guidance from those who've walked the path.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Features</Link></li>
              <li><Link to="/stories" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Success Stories</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Mentorship Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="divider mb-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AluminaX. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
               <span className="sr-only">Twitter</span>
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
