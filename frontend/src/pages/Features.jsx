import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Features() {
  const features = [
    {
      title: "AI Mentor Matching",
      description: "Our proprietary algorithm analyzes skills, career goals, and interests to suggest the perfect mentor-mentee pairings, ensuring highly relevant connections.",
      icon: "🧠",
      tags: ["Machine Learning", "Smart Filters"]
    },
    {
      title: "Structured Mentorship Journeys",
      description: "Don't just chat. Use our structured milestones, goal-setting tools, and progress trackers to make every mentorship interaction count.",
      icon: "📈",
      tags: ["Goal Tracking", "Milestones"]
    },
    {
      title: "Integrated Video Calls",
      description: "Connect face-to-face without leaving the platform. Schedule, host, and record mentorship sessions seamlessly.",
      icon: "🎥",
      tags: ["WebRTC", "Scheduling"]
    },
    {
      title: "Career Board & Referrals",
      description: "Alumni can post exclusive job opportunities and refer top-performing students directly to their company's HR department.",
      icon: "💼",
      tags: ["Job Board", "Internal Referrals"]
    },
    {
      title: "Resume & Portfolio Reviews",
      description: "Dedicated workflows for submitting resumes and portfolios to mentors for inline feedback and industry-standard grading.",
      icon: "📝",
      tags: ["Feedback Loop", "Portfolio"]
    },
    {
      title: "Community Forums",
      description: "Ask questions, share resources, and participate in industry-specific discussions with the broader alumni and student community.",
      icon: "💬",
      tags: ["Discussions", "Knowledge Base"]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />

      <div className="pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 font-semibold text-sm mb-6">Platform Capabilities</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Everything you need to succeed.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">A comprehensive suite of tools designed to make networking, mentorship, and career growth frictionless.</p>
        </div>
      </div>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div key={i} className="glass card-hover rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-600/10 to-transparent blur-xl group-hover:from-primary-600/20 transition-all duration-300 pointer-events-none"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 mb-8 flex-grow">{item.description}</p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                {item.tags.map((tag, j) => (
                  <span key={j} className="text-xs font-medium px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
