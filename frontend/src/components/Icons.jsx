// All SVG icon components for the F1 Assistant

export const X = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const MessageSquare = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const Search = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const Youtube = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" />
    <polygon points="10,8 16,12 10,16" fill="#fff" />
  </svg>
);

export const Cloud = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 17.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25" />
  </svg>
);

export const Trophy = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 3h8v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V3z" />
    <path d="M3 7h3" />
    <path d="M18 7h3" />
    <path d="M9 21h6" />
  </svg>
);

export const Calculator = ({ className = '', ...props }) => (
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

export const ChevronRight = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const Sparkles = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z" />
    <path d="M5 21l.8-1.8L7.6 18l-1.8-.8L5 15l-.8 1.8L2.4 18l1.8.8L5 21z" />
  </svg>
);

export const Zap = ({ className = '', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
  </svg>
);
