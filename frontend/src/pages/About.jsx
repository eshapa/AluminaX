import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Empowering the Next Generation of Leaders</h1>
          <p className="text-xl text-gray-400">Bridging the gap between ambitious students and experienced alumni to foster growth, innovation, and success.</p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="h-96 rounded-3xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-white/10 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0a0a0f] m-[1px] rounded-3xl bg-opacity-80 backdrop-blur-sm shadow-inner"></div>
            <div className="relative z-10 text-center">
              <span className="text-6xl mb-4 block">🚀</span>
              <p className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Our Mission</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-display font-bold mb-6">Why We Built AluminaX</h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            We realized that thousands of students graduate every year without proper career guidance, while thousands of successful alumni want to give back but lack a structured platform to do so.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            AluminaX was created to solve this disconnect. Using AI-driven matching and structured mentorship frameworks, we ensure that every student has the tools and guidance they need to succeed in their chosen field.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">The principles that guide everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4">Community First</h3>
              <p className="text-gray-400">We believe in the power of a strong, supportive network to elevate everyone involved.</p>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-4">Continuous Learning</h3>
              <p className="text-gray-400">Growth never stops. We foster an environment where knowledge flows in all directions.</p>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-4">Empowerment</h3>
              <p className="text-gray-400">Providing students with the confidence and tools to take charge of their careers.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
