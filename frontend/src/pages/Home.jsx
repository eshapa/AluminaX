import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Update path if necessary

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden text-white w-full font-sans">
      <Navbar />

      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 flex flex-col items-center">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Introducing AlumNetX 2.0</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8">
            Connect with Alumni.<br />
            <span className="text-gradient">Grow Your Career.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            The intelligent platform that connects ambitious students with experienced alumni for mentorship, career guidance, and powerful networking.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth/register" className="btn-primary py-4 px-10 text-lg">
              Get Started
            </Link>
            <Link to="/auth/login" className="btn-secondary py-4 px-10 text-lg">
              Login
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features Highlights ───────────────────────────────── */}
      <section className="section-pad max-w-7xl mx-auto border-t border-white/5 relative">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Smart UI. <span className="text-gradient">Smarter Mentorship.</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">Experience a beautifully crafted platform designed for meaningful professional relationships.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "AI Mentor Matching", desc: "Our algorithm connects you with the perfect alumni based on your skills.", icon: "🧠" },
            { title: "Visual Roadmaps", desc: "Discover success paths through visual timelines from experienced alumni.", icon: "🗺️" },
            { title: "Job Opportunities", desc: "Exclusive internships and jobs posted directly by the alumni network.", icon: "💼" },
          ].map((feature, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              key={i} className="glass-strong hover:scale-105 transition-transform duration-500 rounded-3xl p-8 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-primary-600/30 to-accent-600/30 blur-3xl rounded-full group-hover:scale-150 transition-all duration-700"></div>
              <div className="text-5xl mb-6 drop-shadow-xl">{feature.icon}</div>
              <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* ─── Testimonials ───────────────────────────────── */}
      <section className="section-pad max-w-7xl mx-auto">
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="glass-strong rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-hero-gradient opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-8">"AlumNetX completely changed my career trajectory. I found a mentor who works at my dream company!"</h2>
            <p className="text-primary-400 font-bold uppercase tracking-widest">— Sarah Jenkins, CS Student</p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}