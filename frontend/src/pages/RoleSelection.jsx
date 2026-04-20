import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function RoleSelection() {
  const roles = [
    {
      id: "student",
      title: "Student",
      icon: "🎓",
      description: "I want to find mentors, seek career guidance, and connect with alumni.",
      features: ["AI Mentor Matching", "Career Roadmaps", "Resume Reviews"],
      path: "/auth/student"
    },
    {
      id: "alumni",
      title: "Alumni",
      icon: "💼",
      description: "I want to give back, mentor students, and expand my professional network.",
      features: ["Mentorship Dashboard", "Give Referrals", "Alumni Directory"],
      path: "/auth/alumni"
    },
    {
      id: "admin",
      title: "Administrator",
      icon: "🛡️",
      description: "I manage the platform, oversee users, and track institutional analytics.",
      features: ["User Management", "Platform Analytics", "Content Moderation"],
      path: "/auth/admin"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-center relative overflow-hidden py-20 px-4">
      <Navbar />
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary-900/30 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full mt-16">
        <div className="text-center mb-16">
          <Link to="/" className="inline-block mb-8 text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Choose your path</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Select the role that best describes you to personalize your AluminaX experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {roles.map((role) => (
            <div key={role.id} className="group h-full">
              <div className="glass card-hover rounded-3xl p-8 flex flex-col h-full border border-white/10 hover:border-primary-500/50 transition-all duration-300 relative overflow-hidden">
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-accent-600/0 group-hover:from-primary-600/10 group-hover:to-accent-600/10 transition-colors duration-500"></div>

                <div className="text-5xl mb-6 relative z-10 bg-white/5 w-20 h-20 flex items-center justify-center rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {role.icon}
                </div>
                
                <h2 className="text-2xl font-bold mb-3 text-white relative z-10">{role.title}</h2>
                <p className="text-gray-400 mb-8 flex-grow relative z-10">{role.description}</p>
                
                <div className="space-y-3 mb-8 relative z-10">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  to={role.path}
                  className="w-full py-4 px-6 rounded-xl bg-white/5 border border-white/10 font-semibold text-center text-white hover:bg-primary-600 hover:border-primary-500 hover:shadow-glow transition-all duration-300 relative z-10 mt-auto"
                >
                  Continue as {role.title} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
