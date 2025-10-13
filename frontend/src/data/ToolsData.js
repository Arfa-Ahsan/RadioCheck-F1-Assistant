import { 
  Search, 
  Youtube, 
  Cloud, 
  Trophy, 
  Calculator 
} from '../components/Icons';

export const TOOLS = [
  { 
    icon: Search, 
    title: 'Web Search', 
    desc: 'Retrieve the latest F1 news, driver stats, and authoritative season data.',
    gradient: 'from-blue-500 to-cyan-500',
    details: {
      overview: 'The Web Search tool uses Tavily AI to scour the internet for the most current and reliable Formula 1 information from trusted sources.',
      features: [
        'Real-time news from Formula1.com, BBC Sport, Sky Sports, and Autosport',
        'Latest driver transfers and team announcements',
        'Current season statistics and race results',
        'Official FIA statements and technical regulations',
        'Cross-referenced data for maximum accuracy'
      ],
      useCases: [
        'Finding out which team a driver moved to this season',
        'Getting the latest race results and penalties',
        'Checking current driver and team lineups',
        'Reading official announcements and news'
      ]
    }
  },
  { 
    icon: Youtube, 
    title: 'YouTube Highlights', 
    desc: 'Fetch official highlights for races — specify a year or get the latest.',
    gradient: 'from-red-500 to-pink-500',
    details: {
      overview: 'Automatically searches and retrieves official Formula 1 race highlights from YouTube, allowing you to relive the best moments.',
      features: [
        'Official F1 YouTube channel highlights',
        'Specific year or season filtering',
        'Race-by-race highlight retrieval',
        'Key moments and overtakes',
        'Podium celebrations and post-race interviews'
      ],
      useCases: [
        'Watching highlights from a specific Grand Prix',
        'Finding the best moments from a particular season',
        'Catching up on races you missed',
        'Reliving classic racing moments'
      ]
    }
  },
  { 
    icon: Cloud, 
    title: 'Live Weather', 
    desc: 'Circuit weather updates and race weekend conditions for any Grand Prix.',
    gradient: 'from-purple-500 to-indigo-500',
    details: {
      overview: 'Provides real-time weather data for Formula 1 circuits around the world, crucial for understanding race strategy and conditions.',
      features: [
        'Live temperature and conditions at circuits',
        'Humidity and wind speed data',
        'Rain probability and forecasts',
        'Race weekend weather predictions',
        'Historical weather patterns for each circuit'
      ],
      useCases: [
        'Checking if rain is expected during a race weekend',
        'Understanding track conditions for strategy analysis',
        'Comparing weather across different Grand Prix locations',
        'Planning ahead for upcoming race conditions'
      ]
    }
  },
  { 
    icon: Trophy, 
    title: 'Standings', 
    desc: 'Current driver and constructor standings from official F1 data.',
    gradient: 'from-yellow-500 to-orange-500',
    details: {
      overview: 'Access up-to-date championship standings for both drivers and constructors, pulled directly from official Formula 1 data sources.',
      features: [
        'Real-time driver championship points',
        'Constructor (team) championship standings',
        'Points gaps between competitors',
        'Race-by-race progression tracking',
        'Historical standings comparison'
      ],
      useCases: [
        'Checking who leads the championship',
        'Seeing point differences between rivals',
        'Tracking team performance throughout the season',
        'Analyzing championship battle progression'
      ]
    }
  },
  { 
    icon: Calculator, 
    title: 'Championship Odds', 
    desc: 'Statistical projections for championship outcomes using Monte Carlo simulations.',
    gradient: 'from-green-500 to-emerald-500',
    details: {
      overview: 'Uses advanced Monte Carlo simulation algorithms to calculate the probability of each driver winning the championship based on current points and remaining races.',
      features: [
        'Monte Carlo statistical simulations',
        'Real-time probability calculations',
        'Factors in current points and form',
        'Considers remaining races in the season',
        'Mathematical championship possibility checks'
      ],
      useCases: [
        'Finding out a driver\'s chances of winning the championship',
        'Understanding if a driver is mathematically eliminated',
        'Analyzing championship battle scenarios',
        'Getting data-driven predictions for the title race'
      ]
    }
  }
];
