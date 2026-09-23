export interface PlayerStats {
  goals?: number;
  assists?: number;
  appearances?: number;
  minutesPlayed?: number;
  xgPer90: number;
  xaPer90: number;
  passCompletion: number;
  progressiveCarries: number;
  duelsWonPct: number;
  pressuresPer90: number;
}

export interface RiskStats {
  benchRate: number; // e.g. 8.5 (%)
  cardRisk: number; // e.g. 14.2 (%)
  matchScore: number; // e.g. 96.5 (%)
  injuryVulnerability?: string;
  consistencyIndex?: number;
  disciplineRating?: string;
  missedConsecutiveMatches?: number;
  outlierMatchNote?: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  club: string;
  league: string;
  marketValue: number;
  signHimValue: number;
  moneyballIndex: number;
  stats: PlayerStats;
  risk: RiskStats;
  scoutSummary: string;
  strengths: string[];
  weaknesses: string[];
  contractStatus: string;
  contractReady: boolean;
  signed?: boolean;
  signedAt?: string;
  signedByClub?: string;
  salary?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  players?: Player[];
}

export function getLeagueNameFromId(ligaId: string): string {
  const map: Record<string, string> = {
    '2_bl': '2. Bundesliga',
    '2BL': '2. Bundesliga',
    '3_liga': '3. Liga',
    '3BL': '3. Liga',
    'rl_west': 'Regionalliga West',
    'RLW4': 'Regionalliga West',
    'rl_nordost': 'Regionalliga Nordost',
    'RLNO4': 'Regionalliga Nordost',
    'rl_suedwest': 'Regionalliga Südwest',
    'RLS4': 'Regionalliga Südwest',
    'rl_bayern': 'Regionalliga Bayern',
    'RLB4': 'Regionalliga Bayern',
    'rl_nord': 'Regionalliga Nord',
    'RLN4': 'Regionalliga Nord',
    'ol_westfalen': 'Oberliga Westfalen',
    'OLW': 'Oberliga Westfalen',
    'ol_niederrhein': 'Oberliga Niederrhein',
    'OLN': 'Oberliga Niederrhein',
    'mittelrhein': 'Mittelrheinliga',
    'MR': 'Mittelrheinliga',
    'ol_nordost': 'Oberliga Nordost',
    'OLNO5': 'Oberliga Nordost',
  };
  return map[ligaId] || '';
}


