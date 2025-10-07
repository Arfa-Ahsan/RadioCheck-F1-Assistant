
import { useState, useEffect } from 'react';

// Inline SVG icon components (small, dependency-free)
const MessageSquare = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Search = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const Youtube = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" />
    <polygon points="10,8 16,12 10,16" fill="#fff" />
  </svg>
);

const Cloud = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 17.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25" />
  </svg>
);

const Trophy = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 3h8v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V3z" />
    <path d="M3 7h3" />
    <path d="M18 7h3" />
    <path d="M9 21h6" />
  </svg>
);

const Calculator = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <path d="M7 7h10" />
    <path d="M7 12h2" />
    <path d="M11 12h2" />
    <path d="M15 12h2" />
    <path d="M7 16h2" />
    <path d="M11 16h2" />
  </svg>
);

const ChevronRight = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Sparkles = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z" />
    <path d="M5 21l.8-1.8L7.6 18l-1.8-.8L5 15l-.8 1.8L2.4 18l1.8.8L5 21z" />
  </svg>
);

const Zap = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
  </svg>
);

// radioCheckBot removed from landing hero; still available for chat avatar elsewhere
const sgPhoto = new URL('../assets/singapore grand prix.jpg', import.meta.url).href


const theme = {
  colors: {
    primary: '#E10600',
    dark: '#15151E',
    gray: '#1E1E2E',
    text: '#FFFFFF',
    subtext: '#A0A0B0'
  }
};

const TEAMS = [
  { name: 'Red Bull Racing', color: '#0600EF', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png' },
  { name: 'Mercedes', color: '#00D2BE', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png' },
  { name: 'Ferrari', color: '#DC0000', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png' },
  { name: 'McLaren', color: '#FF8700', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png' },
  { name: 'Aston Martin', color: '#006F62', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png' },
  { name: 'Alpine', color: '#0090FF', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png' },
  { name: 'Williams', color: '#005AFF', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png' },
  { name: 'RB', color: '#2B4562', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb.png' },
  { name: 'Kick Sauber', color: '#00E701', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png' },
  { name: 'Haas', color: '#FFFFFF', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png' }
];

const TOOLS = [
  { 
    icon: Search, 
    title: 'Web Search', 
    desc: 'Retrieve the latest F1 news, driver stats, and authoritative season data.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    icon: Youtube, 
    title: 'YouTube Highlights', 
    desc: 'Fetch official highlights for races — specify a year or get the latest.',
    gradient: 'from-red-500 to-pink-500'
  },
  { 
    icon: Cloud, 
    title: 'Live Weather', 
    desc: 'Circuit weather updates and race weekend conditions for any Grand Prix.',
    gradient: 'from-purple-500 to-indigo-500'
  },
  { 
    icon: Trophy, 
    title: 'Standings', 
    desc: 'Current driver and constructor standings from official F1 data.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    icon: Calculator, 
    title: 'Championship Odds', 
    desc: 'Statistical projections for championship outcomes using Monte Carlo simulations.',
    gradient: 'from-green-500 to-emerald-500'
  }
];

export default function Landing({ onOpenChat, radioCheckBot }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChatClick = () => {
    if (onOpenChat) onOpenChat();
  };

  return (
    <div className="min-h-screen" style={{ background: theme.colors.dark }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={sgPhoto}
            alt="F1 Background"
            className="w-full h-full object-cover"
            style={{ filter: 'blur(1.5px) brightness(0.55)', transition: 'filter 300ms ease' }}
          />
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(135deg, ${theme.colors.dark}cc 0%, ${theme.colors.dark}99 50%, ${theme.colors.dark}cc 100%)`
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse" 
               style={{ background: theme.colors.primary, opacity: 0.15 }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse" 
               style={{ background: theme.colors.primary, opacity: 0.15, animationDelay: '1s' }} />
        </div>

  <div className="relative z-10 w-full px-8 lg:px-20 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 backdrop-blur-md" 
                 style={{ 
                   background: `${theme.colors.primary}20`, 
                   border: `1px solid ${theme.colors.primary}60`,
                   boxShadow: `0 8px 32px ${theme.colors.primary}30`
                 }}>
              <Sparkles className="w-4 h-4 animate-pulse" style={{ color: theme.colors.primary }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: theme.colors.primary }}>
                AI-Powered Racing Intelligence
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-black mb-6 leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              <span className="block mb-3 animate-slide-down" style={{ color: theme.colors.text, fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}>
                RadioCheck
              </span>
              <span className="block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient-shift" 
                    style={{ backgroundSize: '200% 200%', fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
                F1 Assistant
              </span>
            </h1>

            <p className="mb-10 leading-relaxed w-full" 
               style={{ color: theme.colors.subtext, fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}>
              Latest race updates, driver stats, AI predictions, live weather, highlights and championship analysis — ask me anything about F1.
            </p>

            {/* CTA */}
            <button 
              onClick={handleChatClick}
              className="group px-10 py-5 rounded-full text-xl font-bold overflow-hidden transform transition-all duration-300 hover:scale-105 relative"
              style={{ 
                background: `linear-gradient(90deg, ${theme.colors.primary}, #ff6b6b)`,
                color: theme.colors.text,
                boxShadow: `0 20px 60px ${theme.colors.primary}60`
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                  Start Chatting Now
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                   style={{ transform: 'translateX(-100%)', animation: 'shimmer 2s infinite' }} />
            </button>
          </div>
        </div>

        {/* Scroll indicator removed */}
      </section>

      {/* Radio Check Bot Section */}
      {radioCheckBot && (
        <section className="relative py-20" style={{ background: theme.colors.dark }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left - Bot Image */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-3xl animate-pulse" 
                       style={{ background: `${theme.colors.primary}60` }} />
                  <img 
                    src={radioCheckBot} 
                    alt="Radio Check Assistant" 
                    className="relative z-10 w-80 h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Right - Info */}
              <div className="flex-1">
                <div className="inline-block px-4 py-2 rounded-full mb-4" 
                     style={{ background: `${theme.colors.primary}20`, border: `1px solid ${theme.colors.primary}` }}>
                  <span className="text-sm font-bold" style={{ color: theme.colors.primary }}>
                    Meet Your AI Companion
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black mb-6" style={{ color: theme.colors.text }}>
                  Always Ready,<br />
                  <span style={{ color: theme.colors.primary }}>Always Accurate</span>
                </h2>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: theme.colors.subtext }}>
                  Powered by advanced AI and real-time data sources, Radio Check delivers instant answers to all your Formula 1 questions. From live race updates to historical statistics, championship predictions to weather forecasts—I've got you covered 24/7.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: theme.colors.gray }}>
                    <div className="text-3xl font-black mb-1" style={{ color: theme.colors.primary }}>24/7</div>
                    <div className="text-sm" style={{ color: theme.colors.subtext }}>Always Available</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: theme.colors.gray }}>
                    <div className="text-3xl font-black mb-1" style={{ color: theme.colors.primary }}>&lt;1s</div>
                    <div className="text-sm" style={{ color: theme.colors.subtext }}>Response Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Legendary Teams Section */}
      <section className="relative py-24" style={{ background: `linear-gradient(180deg, ${theme.colors.dark}, ${theme.colors.gray})` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-black mb-4" style={{ color: theme.colors.text }}>
              <span style={{ color: theme.colors.primary }}>Legendary</span> Teams
            </h2>
            <p className="text-xl" style={{ color: theme.colors.subtext }}>
              Get insights on all 10 Formula 1 constructor teams
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {TEAMS.map((team, index) => (
              <div
                key={team.name}
                onMouseEnter={() => setActiveTeam(index)}
                onMouseLeave={() => setActiveTeam(null)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.gray}, ${theme.colors.dark})`,
                  border: `2px solid ${activeTeam === index ? team.color : 'transparent'}`,
                  boxShadow: activeTeam === index ? `0 20px 60px ${team.color}40` : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ background: `radial-gradient(circle at center, ${team.color}15, transparent 70%)` }} />
                
                {/* Content */}
                <div className="relative p-6 flex flex-col items-center">
                  <div className="w-full h-24 mb-4 flex items-center justify-center">
                    <img 
                      src={team.logo} 
                      alt={team.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-center font-bold text-sm mb-3 transition-colors duration-300" 
                      style={{ color: activeTeam === index ? team.color : theme.colors.text }}>
                    {team.name}
                  </h3>
                  {/* Color Bar */}
                  <div className="w-full h-1 rounded-full transition-all duration-500" 
                       style={{ 
                         background: team.color,
                         transform: activeTeam === index ? 'scaleX(1)' : 'scaleX(0.5)'
                       }} />
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ 
                       background: `linear-gradient(135deg, transparent 50%, ${team.color}20 50%)`,
                     }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="relative py-24" style={{ background: theme.colors.dark }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-black mb-4" style={{ color: theme.colors.text }}>
              Powered by <span style={{ color: theme.colors.primary }}>5 AI Tools</span>
            </h2>
            <p className="text-xl" style={{ color: theme.colors.subtext }}>
              Everything you need to dominate Formula 1 knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="group relative overflow-hidden rounded-3xl transform transition-all duration-500 hover:scale-105"
                  style={{ 
                    background: theme.colors.gray,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{ 
                         background: `linear-gradient(135deg, ${theme.colors.primary}40, transparent)`,
                         padding: '2px'
                       }} />
                  
                  <div className="relative p-8 rounded-3xl" style={{ background: theme.colors.gray }}>
                    {/* Icon with Gradient */}
                    <div className="mb-6 relative">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {/* Glow */}
                      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-br ${tool.gradient}`} />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-red-500" 
                        style={{ color: theme.colors.text }}>
                      {tool.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: theme.colors.subtext }}>
                      {tool.desc}
                    </p>

                    {/* Hover Arrow */}
                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-0 group-hover:translate-x-2"
                         style={{ color: theme.colors.primary }}>
                      <span className="text-sm font-bold">Learn More</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24" style={{ background: `linear-gradient(180deg, ${theme.colors.dark}, ${theme.colors.gray})` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ color: theme.colors.text }}>
              How It <span style={{ color: theme.colors.primary }}>Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Ask', desc: 'Type any F1 question—standings, highlights, weather, or odds.' },
              { num: '2', title: 'Tools', desc: 'The assistant selects the most relevant tool(s) to fetch up-to-date info.' },
              { num: '3', title: 'Answer', desc: 'Get a concise, sourced answer with links and data where applicable.' }
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-2xl group hover:transform hover:scale-105 transition-all duration-500"
                   style={{ background: theme.colors.dark, border: `1px solid ${theme.colors.primary}20` }}>
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl"
                     style={{ background: theme.colors.primary, color: theme.colors.text }}>
                  {step.num}
                </div>
                <h4 className="font-bold text-xl mb-3 mt-4" style={{ color: theme.colors.text }}>
                  {step.title}
                </h4>
                <p style={{ color: theme.colors.subtext }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24" style={{ background: theme.colors.dark }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            background: `radial-gradient(circle at center, ${theme.colors.primary} 0%, transparent 70%)`
          }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-black mb-6" style={{ color: theme.colors.text }}>
            Ready to Copy?<br />It's <span style={{ color: theme.colors.primary }}>Lights Out</span> and Away We Go!
          </h2>
          <p className="text-xl mb-10" style={{ color: theme.colors.subtext }}>
            Join thousands of F1 fans getting smarter racing insights every day
          </p>
          <button 
            onClick={handleChatClick}
            className="group px-12 py-6 rounded-full text-xl font-bold transform transition-all duration-300 hover:scale-105"
            style={{ 
              background: `linear-gradient(90deg, ${theme.colors.primary}, #ff6b6b)`,
              color: theme.colors.text,
              boxShadow: `0 20px 60px ${theme.colors.primary}60`
            }}
          >
            <span className="flex items-center gap-3">
              Get Started Free
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Fixed chat button removed intentionally */}

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-gradient-shift { animation: gradient-shift 4s ease infinite; }
        .animate-slide-down { animation: slide-down 1s ease; }
      `}</style>
    </div>
  );
}