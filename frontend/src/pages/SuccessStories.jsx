import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function SuccessStories() {
  const stories = [
    {
      student: "Sarah Jenkins",
      alumni: "Michael Chang",
      studentRole: "Software Engineering Student",
      alumniRole: "Senior Engineer @ Google",
      content: "AluminaX completely changed my trajectory. Michael helped me refine my data structures knowledge and even referred me for an internship that turned into a full-time offer.",
      image: "👩‍💻"
    },
    {
      student: "David Otunga",
      alumni: "Elena Rodriguez",
      studentRole: "Business Major",
      alumniRole: "Product Manager @ Amazon",
      content: "I had no idea how to break into product management. Elena gave me a clear roadmap, reviewed my PM case studies, and connected me with incredible resources.",
      image: "👨‍💼"
    },
    {
      student: "Priya Patel",
      alumni: "James Wilson",
      studentRole: "Design Student",
      alumniRole: "UX Director @ Microsoft",
      content: "The portfolio review feature on AluminaX is gold. James left specific, actionable feedback on my mockups that helped me land my dream role right after graduation.",
      image: "👩‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />

      <div className="pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Real Connections.<br/><span className="text-gradient">Real Impact.</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Discover how AluminaX mentorships are shaping the careers of tomorrow's leaders.</p>
        </div>
      </div>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div key={i} className="glass rounded-3xl p-8 card-hover flex flex-col relative overflow-hidden">
               <div className="text-5xl mb-6 bg-white/5 w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10">
                 {story.image}
               </div>

               <div className="mb-6 flex-grow">
                 <svg className="w-10 h-10 text-primary-500/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                 </svg>
                 <p className="text-gray-300 text-lg italic leading-relaxed">"{story.content}"</p>
               </div>

               <div className="mt-auto border-t border-white/10 pt-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="font-bold text-white text-sm">{story.student}</p>
                     <p className="text-xs text-primary-400">{story.studentRole}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-white text-sm">{story.alumni}</p>
                     <p className="text-xs text-accent-400">{story.alumniRole}</p>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-gradient-to-r from-primary-900/20 to-accent-900/20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-16">The AluminaX Effect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2 stat-number">85%</div>
              <p className="text-gray-400 font-medium">Secured a job within 3 months of graduation</p>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2 stat-number">3x</div>
              <p className="text-gray-400 font-medium">Higher interview rate vs non-users</p>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2 stat-number">$15k</div>
              <p className="text-gray-400 font-medium">Average starting salary increase</p>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2 stat-number">92%</div>
              <p className="text-gray-400 font-medium">Mentors report high satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
