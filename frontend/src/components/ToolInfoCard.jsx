import { X } from './Icons';

const theme = {
  colors: {
    primary: '#E10600',
    dark: '#15151E',
    gray: '#1E1E2E',
    text: '#FFFFFF',
    subtext: '#A0A0B0'
  }
};

export default function ToolInfoCard({ tool, onClose, onTryNow }) {
  if (!tool) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl transform transition-all duration-500 animate-scaleIn"
        style={{ background: theme.colors.gray, boxShadow: `0 25px 100px ${theme.colors.primary}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full transition-all duration-300 hover:rotate-90 z-10"
          style={{ background: theme.colors.dark, color: theme.colors.text }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Icon */}
        <div className="p-8 pb-6">
          <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${tool.gradient} mb-6`}>
            <tool.icon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-3" style={{ color: theme.colors.text }}>
            {tool.title}
          </h2>
          <p className="text-lg" style={{ color: theme.colors.subtext }}>
            {tool.desc}
          </p>
        </div>

        <div className="px-8 pb-8">
          {/* Overview */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3" style={{ color: theme.colors.primary }}>
              Overview
            </h3>
            <p className="leading-relaxed" style={{ color: theme.colors.subtext }}>
              {tool.details.overview}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
              Key Features
            </h3>
            <div className="space-y-3">
              {tool.details.features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:transform hover:translate-x-2"
                  style={{ background: theme.colors.dark }}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-br ${tool.gradient}`} />
                  <span style={{ color: theme.colors.text }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
              Use Cases
            </h3>
            <div className="grid gap-3">
              {tool.details.useCases.map((useCase, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:transform hover:translate-x-2"
                  style={{ background: theme.colors.dark }}
                >
                  <span className="font-bold" style={{ color: theme.colors.primary }}>
                    {idx + 1}.
                  </span>
                  <span style={{ color: theme.colors.text }}>{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => {
              onClose();
              if (onTryNow) onTryNow();
            }}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{ 
              background: `linear-gradient(90deg, ${theme.colors.primary}, #ff6b6b)`,
              color: theme.colors.text,
              boxShadow: `0 10px 30px ${theme.colors.primary}40`
            }}
          >
            Try It Now in Chat
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-scaleIn { animation: scaleIn 0.3s ease; }
      `}</style>
    </div>
  );
}
