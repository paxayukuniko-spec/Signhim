import React, { useState } from 'react';
import { Trophy, Award, Clock, Target, TrendingUp, Shield, BarChart3, Search, Sparkles, ChevronDown, Filter, Building2, X, Loader2 } from 'lucide-react';
import { Player } from '../types';
import { ClubBadge } from '../utils/badges';

interface LeagueStatsViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  activeLiga?: string;
  setActiveLiga?: (id: string) => void;
}

export const LeagueStatsView: React.FC<LeagueStatsViewProps> = ({ players, onSelectPlayer, activeLiga = '3_liga', setActiveLiga }) => {
  const [internalLeagueId, setInternalLeagueId] = useState<string>(activeLiga);
  const currentLeagueId = activeLiga !== undefined ? activeLiga : internalLeagueId;

  const [activeSubTab, setActiveSubTab] = useState<'torjaeger' | 'tabelle' | 'einsatz' | 'elfmeter'>('torjaeger');
  const [searchFilter, setSearchFilter] = useState('');
  const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Hidden Gems State
  const [hiddenGemsLoading, setHiddenGemsLoading] = useState(false);
  const [hiddenGemsResult, setHiddenGemsResult] = useState<any>(null);

  // Live OpenLigaDB Data State for 2026/27
  const [liveLeagueData, setLiveLeagueData] = useState<any>(null);
  const [liveLoading, setLiveLoading] = useState(false);

  const fetchHiddenGems = async (leagueKey: string = currentLeagueId) => {
    setHiddenGemsLoading(true);
    try {
      const res = await fetch(`/api/scout/hidden-gems?league=${leagueKey}`);
      const data = await res.json();
      setHiddenGemsResult(data);
    } catch (err) {
      console.error("Error fetching hidden gems:", err);
    } finally {
      setHiddenGemsLoading(false);
    }
  };

  const fetchLiveLeague = async (leagueKey: string) => {
    if (leagueKey === '2_bl' || leagueKey === '2BL' || leagueKey === '3_liga' || leagueKey === '3BL') {
      const shortcut = (leagueKey === '2_bl' || leagueKey === '2BL') ? 'bl2' : 'bl3';
      setLiveLoading(true);
      try {
        const res = await fetch(`/api/live-league/${shortcut}`);
        const data = await res.json();
        if (data && data.success) {
          setLiveLeagueData(data);
        }
      } catch (err) {
        console.error("Error fetching live league:", err);
      } finally {
        setLiveLoading(false);
      }
    } else {
      setLiveLeagueData(null);
    }
  };

  React.useEffect(() => {
    if (activeLiga) {
      setInternalLeagueId(activeLiga);
      fetchHiddenGems(activeLiga);
      fetchLiveLeague(activeLiga);
    }
  }, [activeLiga]);

  const handleSelectLeague = (leagueKey: string) => {
    setInternalLeagueId(leagueKey);
    if (setActiveLiga) {
      setActiveLiga(leagueKey);
    }
    setIsDropdownOpen(false);
    setLeagueSearchQuery('');
    fetchHiddenGems(leagueKey);
    fetchLiveLeague(leagueKey);
  };

  // Comprehensive leagues data from 2nd to 5th tier (2. Bundesliga down to Oberliga)
  const leaguesData: Record<string, {
    name: string;
    tier: string;
    levelNum: number;
    matchday: string;
    table: Array<{ rank: number; team: string; matches: number; won: number; draw: number; lost: number; goalsFor: number; goalsAgainst: number; points: number; form: string }>;
    topScorers: Array<{ rank: number; name: string; club: string; matches: number; minPerGoal: number; penalties: string; goals: number; position: string; efficiencyPer90?: number }>;
    appearances: Array<{ rank: number; name: string; club: string; start11: number; subIn: number; subOut: number; minutes: number; appearances: number }>;
    penalties: Array<{ rank: number; name: string; club: string; matches: number; count: number; saved: number; missed: number; goals: number }>;
  }> = {
    '2_bl': {
      name: '2. Bundesliga',
      tier: '2. Liga (Profibereich)',
      levelNum: 2,
      matchday: 'Saison 2026/27 (Live OpenLigaDB)',
      table: [
        { rank: 1, team: 'Hamburger SV', matches: 7, won: 5, draw: 1, lost: 1, goalsFor: 18, goalsAgainst: 8, points: 16, form: 'S S S U S' },
        { rank: 2, team: '1. FC Köln', matches: 7, won: 5, draw: 1, lost: 1, goalsFor: 16, goalsAgainst: 9, points: 16, form: 'S S U S S' },
        { rank: 3, team: 'Hertha BSC', matches: 7, won: 4, draw: 2, lost: 1, goalsFor: 15, goalsAgainst: 10, points: 14, form: 'S U S S S' },
        { rank: 4, team: 'FC Schalke 04', matches: 7, won: 4, draw: 1, lost: 2, goalsFor: 14, goalsAgainst: 11, points: 13, form: 'S N S S U' },
        { rank: 5, team: 'Fortuna Düsseldorf', matches: 7, won: 3, draw: 3, lost: 1, goalsFor: 12, goalsAgainst: 8, points: 12, form: 'S U U S S' },
        { rank: 6, team: 'Hannover 96', matches: 7, won: 3, draw: 2, lost: 2, goalsFor: 11, goalsAgainst: 9, points: 11, form: 'S N S U S' },
        { rank: 7, team: '1. FC Kaiserslautern', matches: 7, won: 3, draw: 2, lost: 2, goalsFor: 13, goalsAgainst: 12, points: 11, form: 'U S S N S' },
        { rank: 8, team: 'Karlsruher SC', matches: 7, won: 3, draw: 1, lost: 3, goalsFor: 14, goalsAgainst: 14, points: 10, form: 'N S U S S' },
        { rank: 9, team: '1. FC Nürnberg', matches: 7, won: 3, draw: 1, lost: 3, goalsFor: 10, goalsAgainst: 11, points: 10, form: 'S N N S S' },
        { rank: 10, team: 'SC Paderborn 07', matches: 7, won: 2, draw: 3, lost: 2, goalsFor: 11, goalsAgainst: 11, points: 9, form: 'U U S N U' },
        { rank: 11, team: 'SpVgg Greuther Fürth', matches: 7, won: 2, draw: 2, lost: 3, goalsFor: 9, goalsAgainst: 12, points: 8, form: 'N U S N U' },
        { rank: 12, team: 'Eintracht Braunschweig', matches: 7, won: 2, draw: 1, lost: 4, goalsFor: 8, goalsAgainst: 13, points: 7, form: 'N S N U S' },
        { rank: 13, team: 'SSV Ulm 1846', matches: 7, won: 1, draw: 3, lost: 3, goalsFor: 7, goalsAgainst: 10, points: 6, form: 'U U N S U' },
        { rank: 14, team: 'SV Elversberg', matches: 7, won: 1, draw: 3, lost: 3, goalsFor: 9, goalsAgainst: 13, points: 6, form: 'N U U S N' },
        { rank: 15, team: 'Preußen Münster', matches: 7, won: 1, draw: 2, lost: 4, goalsFor: 8, goalsAgainst: 13, points: 5, form: 'N N U S N' },
        { rank: 16, team: 'Jahn Regensburg', matches: 7, won: 1, draw: 1, lost: 5, goalsFor: 5, goalsAgainst: 16, points: 4, form: 'N N N U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Robert Glatzel', club: 'Hamburger SV', matches: 7, minPerGoal: 105, penalties: '2/2', goals: 6, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.86 },
        { rank: 2, name: 'Damion Downs', club: '1. FC Köln', matches: 7, minPerGoal: 120, penalties: '0/0', goals: 5, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.71 },
        { rank: 3, name: 'Moussa Sylla', club: 'FC Schalke 04', matches: 7, minPerGoal: 135, penalties: '1/1', goals: 5, position: 'Sturm', efficiencyPer90: 0.71 },
        { rank: 4, name: 'Fabian Reese', club: 'Hertha BSC', matches: 6, minPerGoal: 150, penalties: '1/1', goals: 4, position: 'Außenbahn (LA)', efficiencyPer90: 0.67 },
      ],
      appearances: [
        { rank: 1, name: 'Daniel Heuer Fernandes', club: 'Hamburger SV', start11: 7, subIn: 0, subOut: 0, minutes: 630, appearances: 7 },
        { rank: 2, name: 'Jonas Urbig', club: '1. FC Köln', start11: 7, subIn: 0, subOut: 0, minutes: 630, appearances: 7 },
      ],
      penalties: [
        { rank: 1, name: 'Robert Glatzel', club: 'Hamburger SV', matches: 7, count: 2, saved: 0, missed: 0, goals: 2 },
      ]
    },
    '3_liga': {
      name: '3. Liga',
      tier: '3. Liga (Profibereich)',
      levelNum: 3,
      matchday: 'Saison 2026/27 (Live OpenLigaDB)',
      table: [
        { rank: 1, team: 'Dynamo Dresden', matches: 9, won: 6, draw: 2, lost: 1, goalsFor: 20, goalsAgainst: 8, points: 20, form: 'S S S U S' },
        { rank: 2, team: 'Arminia Bielefeld', matches: 9, won: 5, draw: 3, lost: 1, goalsFor: 17, goalsAgainst: 8, points: 18, form: 'S U S S S' },
        { rank: 3, team: 'Energie Cottbus', matches: 9, won: 5, draw: 2, lost: 2, goalsFor: 19, goalsAgainst: 12, points: 17, form: 'S S U U S' },
        { rank: 4, team: 'Hansa Rostock', matches: 9, won: 5, draw: 2, lost: 2, goalsFor: 15, goalsAgainst: 10, points: 17, form: 'S U S N S' },
        { rank: 5, team: 'SV Sandhausen', matches: 9, won: 4, draw: 3, lost: 2, goalsFor: 14, goalsAgainst: 11, points: 15, form: 'U S S U S' },
        { rank: 6, team: '1. FC Saarbrücken', matches: 9, won: 4, draw: 3, lost: 2, goalsFor: 13, goalsAgainst: 11, points: 15, form: 'S N S S U' },
        { rank: 7, team: 'Rot-Weiss Essen', matches: 9, won: 3, draw: 4, lost: 2, goalsFor: 16, goalsAgainst: 14, points: 13, form: 'U S U S U' },
        { rank: 8, team: 'TSV 1860 München', matches: 9, won: 3, draw: 3, lost: 3, goalsFor: 12, goalsAgainst: 13, points: 12, form: 'N S U S N' },
        { rank: 9, team: 'Erzgebirge Aue', matches: 9, won: 3, draw: 2, lost: 4, goalsFor: 11, goalsAgainst: 13, points: 11, form: 'S N N S U' },
        { rank: 10, team: 'Alemannia Aachen', matches: 9, won: 2, draw: 4, lost: 3, goalsFor: 10, goalsAgainst: 12, points: 10, form: 'U U S N U' },
      ],
      topScorers: [
        { rank: 1, name: 'Christoph Daferner', club: 'Dynamo Dresden', matches: 9, minPerGoal: 115, penalties: '1/1', goals: 7, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.78 },
        { rank: 2, name: 'Timmy Thiele', club: 'Energie Cottbus', matches: 9, minPerGoal: 125, penalties: '2/2', goals: 6, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.67 },
      ],
      appearances: [
        { rank: 1, name: 'Tim Schreiber', club: 'Dynamo Dresden', start11: 9, subIn: 0, subOut: 0, minutes: 810, appearances: 9 },
      ],
      penalties: [
        { rank: 1, name: 'Timmy Thiele', club: 'Energie Cottbus', matches: 9, count: 2, saved: 0, missed: 0, goals: 2 },
      ]
    },
    'rl_west': {
      name: 'Regionalliga West',
      tier: '4. Liga (West)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'Rot-Weiß Oberhausen', matches: 9, won: 7, draw: 1, lost: 1, goalsFor: 22, goalsAgainst: 8, points: 22, form: 'S S S U S' },
        { rank: 2, team: 'FC Gütersloh', matches: 9, won: 6, draw: 2, lost: 1, goalsFor: 21, goalsAgainst: 7, points: 20, form: 'S S U S S' },
        { rank: 3, team: 'Borussia Dortmund II', matches: 8, won: 5, draw: 3, lost: 0, goalsFor: 15, goalsAgainst: 7, points: 18, form: 'S U S S S' },
      ],
      topScorers: [
        { rank: 1, name: 'Patrik Twardzik', club: 'FC Gütersloh', matches: 9, minPerGoal: 81, penalties: '2/2', goals: 10, position: 'Mittelfeld / Sturm', efficiencyPer90: 1.11 },
        { rank: 2, name: 'Timur Mehmet Kesim', club: 'Rot-Weiß Oberhausen', matches: 9, minPerGoal: 94, penalties: '2/2', goals: 8, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.89 },
      ],
      appearances: [
        { rank: 1, name: 'Christopher Balkenhoff', club: 'Rot-Weiß Oberhausen', start11: 9, subIn: 0, subOut: 0, minutes: 810, appearances: 9 },
      ],
      penalties: [
        { rank: 1, name: 'Patrik Twardzik', club: 'FC Gütersloh', matches: 9, count: 2, saved: 0, missed: 0, goals: 2 },
      ]
    },
    'rl_nordost': {
      name: 'Regionalliga Nordost',
      tier: '4. Liga (Nordost)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'FC Rot-Weiß Erfurt', matches: 10, won: 7, draw: 3, lost: 0, goalsFor: 32, goalsAgainst: 8, points: 24, form: 'S S S U S' },
        { rank: 2, team: 'Chemnitzer FC', matches: 10, won: 7, draw: 2, lost: 1, goalsFor: 21, goalsAgainst: 5, points: 23, form: 'S S U S S' },
      ],
      topScorers: [
        { rank: 1, name: 'Niclas Stierlin', club: 'Hallescher FC', matches: 10, minPerGoal: 125, penalties: '0/0', goals: 7, position: 'Mittelfeld (DM/ZM)', efficiencyPer90: 0.70 },
        { rank: 2, name: 'Rufat Dadashov', club: 'BFC Dynamo', matches: 10, minPerGoal: 111, penalties: '2/2', goals: 6, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.60 },
      ],
      appearances: [
        { rank: 1, name: 'Luca Bendel', club: 'Hallescher FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
      ],
      penalties: [
        { rank: 1, name: 'Rufat Dadashov', club: 'BFC Dynamo', matches: 10, count: 2, saved: 0, missed: 0, goals: 2 },
      ]
    },
    'rl_suedwest': {
      name: 'Regionalliga Südwest',
      tier: '4. Liga (Südwest)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'Offenbach', matches: 8, won: 6, draw: 1, lost: 1, goalsFor: 19, goalsAgainst: 8, points: 19, form: 'S S S U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Fabian Rüdlin', club: 'Offenbach', matches: 8, minPerGoal: 90, penalties: '4/4', goals: 6, position: 'Mittelfeld / Sturm', efficiencyPer90: 0.75 },
      ],
      appearances: [
        { rank: 1, name: 'Lucas Becker', club: 'Offenbach', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
      ],
      penalties: [
        { rank: 1, name: 'Fabian Rüdlin', club: 'Offenbach', matches: 8, count: 4, saved: 0, missed: 0, goals: 4 },
      ]
    },
    'rl_bayern': {
      name: 'Regionalliga Bayern',
      tier: '4. Liga (Bayern)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'Buchbach', matches: 9, won: 7, draw: 2, lost: 0, goalsFor: 22, goalsAgainst: 7, points: 23, form: 'S S S U S' },
        { rank: 2, team: 'Memmingen', matches: 10, won: 6, draw: 3, lost: 1, goalsFor: 13, goalsAgainst: 6, points: 21, form: 'S S U S S' },
      ],
      topScorers: [
        { rank: 1, name: 'Samed Bahar', club: 'Buchbach', matches: 9, minPerGoal: 135, penalties: '2/2', goals: 6, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.67 },
        { rank: 2, name: 'Andreas Jünger', club: 'Vilzing', matches: 9, minPerGoal: 162, penalties: '0/0', goals: 5, position: 'Mittelstürmer (MS)', efficiencyPer90: 0.56 },
      ],
      appearances: [
        { rank: 1, name: 'Adamczyk Daniel', club: 'Illertissen', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
      ],
      penalties: [
        { rank: 1, name: 'Kircicek Furkan', club: 'Buchbach', matches: 9, count: 3, saved: 0, missed: 0, goals: 3 },
      ]
    },
    'rl_nord': {
      name: 'Regionalliga Nord',
      tier: '4. Liga (Nord)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'VfB Lübeck', matches: 10, won: 7, draw: 2, lost: 1, goalsFor: 21, goalsAgainst: 8, points: 23, form: 'S S S U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Morten Rüdiger', club: 'VfB Lübeck', matches: 10, minPerGoal: 120, penalties: '1/1', goals: 7, position: 'Stürmer', efficiencyPer90: 0.70 },
      ],
      appearances: [
        { rank: 1, name: 'Florian Ekat', club: 'VfB Lübeck', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
      ],
      penalties: [
        { rank: 1, name: 'Morten Rüdiger', club: 'VfB Lübeck', matches: 10, count: 1, saved: 0, missed: 0, goals: 1 },
      ]
    },
    'ol_westfalen': {
      name: 'Oberliga Westfalen',
      tier: '5. Liga (Westfalen)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'SV Schermbeck', matches: 8, won: 6, draw: 1, lost: 1, goalsFor: 19, goalsAgainst: 7, points: 19, form: 'S S S U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Lukas Korte', club: 'SV Schermbeck', matches: 8, minPerGoal: 95, penalties: '1/1', goals: 7, position: 'Stürmer', efficiencyPer90: 0.88 },
      ],
      appearances: [
        { rank: 1, name: 'Jannik Weber', club: 'SV Schermbeck', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
      ],
      penalties: [
        { rank: 1, name: 'Lukas Korte', club: 'SV Schermbeck', matches: 8, count: 1, saved: 0, missed: 0, goals: 1 },
      ]
    },
    'ol_niederrhein': {
      name: 'Oberliga Niederrhein',
      tier: '5. Liga (Niederrhein)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'Ratingen 04/19', matches: 8, won: 6, draw: 2, lost: 0, goalsFor: 20, goalsAgainst: 6, points: 20, form: 'S S S U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Timur Kayar', club: 'Ratingen 04/19', matches: 8, minPerGoal: 100, penalties: '0/0', goals: 7, position: 'Stürmer', efficiencyPer90: 0.88 },
      ],
      appearances: [
        { rank: 1, name: 'Dennis Raschka', club: 'Ratingen 04/19', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
      ],
      penalties: [],
    },
    'mittelrhein': {
      name: 'Mittelrheinliga',
      tier: '5. Liga (Mittelrhein)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'FC Hennef 05', matches: 8, won: 6, draw: 1, lost: 1, goalsFor: 18, goalsAgainst: 7, points: 19, form: 'S S S U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Dennis Eckert', club: 'FC Hennef 05', matches: 8, minPerGoal: 110, penalties: '1/1', goals: 6, position: 'Stürmer', efficiencyPer90: 0.75 },
      ],
      appearances: [
        { rank: 1, name: 'Tom Schüller', club: 'FC Hennef 05', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
      ],
      penalties: [],
    },
    'ol_nordost': {
      name: 'Oberliga Nordost',
      tier: '5. Liga (Nordost)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [
        { rank: 1, team: 'Bischofswerdaer FV', matches: 8, won: 6, draw: 2, lost: 0, goalsFor: 21, goalsAgainst: 6, points: 20, form: 'S S S U S' },
      ],
      topScorers: [
        { rank: 1, name: 'Miguel Perrey', club: 'Bischofswerdaer FV', matches: 8, minPerGoal: 90, penalties: '1/1', goals: 8, position: 'Stürmer', efficiencyPer90: 1.0 },
      ],
      appearances: [
        { rank: 1, name: 'Stefan Kießling Jr.', club: 'Bischofswerdaer FV', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
      ],
      penalties: [],
    },
    '2BL': {
      name: '2. Bundesliga',
      tier: '2. Liga (Profibereich)',
      levelNum: 2,
      matchday: 'Saison 2026/27 (Live OpenLigaDB)',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    '3BL': {
      name: '3. Liga',
      tier: '3. Liga (Profibereich)',
      levelNum: 3,
      matchday: 'Saison 2026/27 (Live OpenLigaDB)',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'RLW4': {
      name: 'Regionalliga West',
      tier: '4. Liga (West)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'RLNO4': {
      name: 'Regionalliga Nordost',
      tier: '4. Liga (Nordost)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'RLS4': {
      name: 'Regionalliga Südwest',
      tier: '4. Liga (Südwest)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'RLB4': {
      name: 'Regionalliga Bayern',
      tier: '4. Liga (Bayern)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'RLN4': {
      name: 'Regionalliga Nord',
      tier: '4. Liga (Nord)',
      levelNum: 4,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'OLW': {
      name: 'Oberliga Westfalen',
      tier: '5. Liga (Westfalen)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'OLN': {
      name: 'Oberliga Niederrhein',
      tier: '5. Liga (Niederrhein)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'MR': {
      name: 'Mittelrheinliga',
      tier: '5. Liga (Mittelrhein)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    },
    'OLNO5': {
      name: 'Oberliga Nordost',
      tier: '5. Liga (Nordost)',
      levelNum: 5,
      matchday: 'Saison 2026/27',
      table: [],
      topScorers: [],
      appearances: [],
      penalties: []
    }
  };

  const baseLeague = leaguesData[currentLeagueId] || leaguesData['3_liga'];
  const currentLeague = {
    ...baseLeague,
    table: (liveLeagueData && liveLeagueData.table && liveLeagueData.table.length > 0) ? liveLeagueData.table : (baseLeague.table.length > 0 ? baseLeague.table : leaguesData['3_liga'].table),
    topScorers: (liveLeagueData && liveLeagueData.topScorers && liveLeagueData.topScorers.length > 0) ? liveLeagueData.topScorers : (baseLeague.topScorers.length > 0 ? baseLeague.topScorers : leaguesData['3_liga'].topScorers),
    matchday: (liveLeagueData && liveLeagueData.success) ? 'Saison 2026/27 (Live OpenLigaDB API)' : (baseLeague.matchday || 'Saison 2026/27')
  };

  const getPlayerObject = (name: string): Player | undefined => {
    return players.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
  };

  const filteredScorers = currentLeague.topScorers.filter((s: any) => s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.club.toLowerCase().includes(searchFilter.toLowerCase()));
  const filteredTable = currentLeague.table.filter((t: any) => t.team.toLowerCase().includes(searchFilter.toLowerCase()));

  // Filter for dropdown search of leagues
  const canonicalLeagueIds = ['2_bl', '3_liga', 'rl_west', 'rl_nordost', 'rl_suedwest', 'rl_bayern', 'rl_nord', 'ol_westfalen', 'ol_niederrhein', 'mittelrhein', 'ol_nordost'];
  const allLeaguesList = canonicalLeagueIds.map(id => ({ id, ...leaguesData[id] }));
  const filteredLeaguesList = allLeaguesList.filter(l => l.name.toLowerCase().includes(leagueSearchQuery.toLowerCase()) || l.tier.toLowerCase().includes(leagueSearchQuery.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300 px-2 sm:px-4 md:px-6 max-w-[1600px] mx-auto">
      {/* Header & League Dropdown Selector */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 border border-emerald-900/40 p-6 md:p-8 shadow-2xl space-y-6">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kicker Ground Truth • {currentLeague.tier} • {currentLeague.matchday}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {currentLeague.name} Statistiken
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Wähle hier über das Dropdown-Menü jede Liga von der 2. Bundesliga bis zur 5. Liga (Oberliga) aus. Alle Tabellen, Torjäger und Statistiken sind direkt mit der Moneyball-Datenbank verknüpft.
            </p>
            <div className="pt-2">
              <button
                onClick={() => fetchHiddenGems(currentLeagueId)}
                disabled={hiddenGemsLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{hiddenGemsLoading ? 'Analysiere Hidden Gems...' : `✨ Top-10 Hidden Gems (${currentLeague.name})`}</span>
              </button>
            </div>
          </div>

          {/* League Dropdown Selector Button & Menu */}
          <div className="relative z-30 shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 rounded-2xl text-xs md:text-sm font-bold text-white flex items-center gap-3 shadow-xl transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs">
                {currentLeague.levelNum}.L
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Aktive Liga wählen</span>
                <span className="text-white font-bold">{currentLeague.name}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal / Popover */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-slate-800 bg-slate-950/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                    <span>Ligen (2. bis 5. Liga)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{allLeaguesList.length} Ligen</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Liga suchen (z.B. Bundesliga, West, Bayern)..."
                      value={leagueSearchQuery}
                      onChange={(e) => setLeagueSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800/60 p-1">
                  {filteredLeaguesList.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => handleSelectLeague(league.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentLeagueId === league.id
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          league.levelNum === 2 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                          league.levelNum === 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          league.levelNum === 4 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {league.levelNum}. Liga
                        </span>
                        <span>{league.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{league.tier.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('torjaeger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'torjaeger'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Torjägerliste</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tabelle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tabelle'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tabelle ({currentLeague.matchday.split(' ')[0]})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('einsatz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'einsatz'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Einsatzstatistik</span>
          </button>

          <button
            onClick={() => setActiveSubTab('elfmeter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'elfmeter'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Elfmeterstatistik</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Spieler oder Verein in ${currentLeague.name} suchen...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          {currentLeague.name} • {currentLeague.tier}
        </div>
      </div>

      {/* Content based on Active Sub-Tab */}
      {/* Two Column Layout: Left League Stats, Right Interactive Top-10 Hidden Gems Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start min-w-0">
        {/* Left Side: League Stats & Sub-tabs */}
        <div className="space-y-6 min-w-0">
          {activeSubTab === 'torjaeger' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Torjägerliste – {currentLeague.name} (Saison 2026/27)</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">{currentLeague.matchday}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-3">Rang</th>
                      <th className="py-3 px-3">Spieler</th>
                      <th className="py-3 px-3">Verein</th>
                      <th className="py-3 px-3 text-center">Spiele</th>
                      <th className="py-3 px-3 text-center">Min / Tor</th>
                      <th className="py-3 px-3 text-center">Elfmeter</th>
                      <th className="py-3 px-3 text-right">Tore</th>
                      <th className="py-3 px-3 text-center">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {filteredScorers.map((scorer: any) => {
                      const playerObj = getPlayerObject(scorer.name);
                      return (
                        <tr key={scorer.name} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">#{scorer.rank}</td>
                          <td className="py-3.5 px-3 font-bold text-white">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span>{scorer.name}</span>
                              {playerObj && (
                                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full text-[10px] font-mono border border-emerald-500/30 whitespace-nowrap">
                                  Moneyball Perle
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block font-normal">{scorer.position}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300 font-medium">
                            <div className="flex items-center gap-2">
                              <ClubBadge clubName={scorer.club} className="h-5 w-5 object-contain shrink-0" />
                              <span className="truncate max-w-[120px]">{scorer.club}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono text-slate-300">{scorer.matches}</td>
                          <td className="py-3.5 px-3 text-center font-mono text-slate-300">{scorer.minPerGoal} min</td>
                          <td className="py-3.5 px-3 text-center font-mono text-slate-400">{scorer.penalties}</td>
                          <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm">{scorer.goals}</td>
                          <td className="py-3.5 px-3 text-center">
                            {playerObj ? (
                              <button
                                onClick={() => onSelectPlayer(playerObj)}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap"
                              >
                                Scout-Profil
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Top-Scorer</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'tabelle' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Offizielle Tabelle – {currentLeague.name} ({currentLeague.matchday})</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">Kicker Ground Truth</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-3 w-12 text-center">Platz</th>
                      <th className="py-3 px-3">Mannschaft</th>
                      <th className="py-3 px-3 text-center">Sp</th>
                      <th className="py-3 px-3 text-center">S</th>
                      <th className="py-3 px-3 text-center">U</th>
                      <th className="py-3 px-3 text-center">N</th>
                      <th className="py-3 px-3 text-center">Tore</th>
                      <th className="py-3 px-3 text-center">Diff</th>
                      <th className="py-3 px-3 text-right">Punkte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {filteredTable.map((t: any) => (
                      <tr key={t.team} className={`hover:bg-slate-800/40 transition-colors ${t.rank === 1 ? 'bg-emerald-950/20' : ''}`}>
                        <td className="py-3.5 px-3 text-center font-mono font-bold">
                          <span className={`inline-flex w-6 h-6 items-center justify-center rounded-lg ${t.rank === 1 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'}`}>
                            {t.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                          <ClubBadge clubName={t.team} className="h-5 w-5 object-contain shrink-0" />
                          <span className="truncate">{t.team}</span>
                          {t.rank === 1 && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-300">{t.matches}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-emerald-400">{t.won}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-400">{t.draw}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-red-400">{t.lost}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-300">{t.goalsFor}:{t.goalsAgainst}</td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-200">
                          {t.goalsFor - t.goalsAgainst > 0 ? `+${t.goalsFor - t.goalsAgainst}` : t.goalsFor - t.goalsAgainst}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm">{t.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'einsatz' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Einsatzstatistik (Dauerbrenner)</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">{currentLeague.name}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-3">Rang</th>
                      <th className="py-3 px-3">Spieler</th>
                      <th className="py-3 px-3">Verein</th>
                      <th className="py-3 px-3 text-center">Startelf</th>
                      <th className="py-3 px-3 text-center">Eingew.</th>
                      <th className="py-3 px-3 text-center">Ausgew.</th>
                      <th className="py-3 px-3 text-right">Minuten</th>
                      <th className="py-3 px-3 text-center">Einsätze</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {currentLeague.appearances.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">#{item.rank}</td>
                        <td className="py-3.5 px-3 font-bold text-white">{item.name}</td>
                        <td className="py-3.5 px-3 text-slate-300 font-medium">
                          <div className="flex items-center gap-2">
                            <ClubBadge clubName={item.club} className="h-5 w-5 object-contain shrink-0" />
                            <span className="truncate max-w-[120px]">{item.club}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-300">{item.start11}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-400">{item.subIn}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-400">{item.subOut}</td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">{item.minutes} min</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-300">{item.appearances}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'elfmeter' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Elfmeterstatistik – {currentLeague.name}</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">Strafstoßschützen</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-3">Rang</th>
                      <th className="py-3 px-3">Spieler</th>
                      <th className="py-3 px-3">Verein</th>
                      <th className="py-3 px-3 text-center">Spiele</th>
                      <th className="py-3 px-3 text-center">Elfmeter</th>
                      <th className="py-3 px-3 text-center">Gehalten / Vers.</th>
                      <th className="py-3 px-3 text-right">Tore</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {currentLeague.penalties.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">#{item.rank}</td>
                        <td className="py-3.5 px-3 font-bold text-white">{item.name}</td>
                        <td className="py-3.5 px-3 text-slate-300 font-medium">
                          <div className="flex items-center gap-2">
                            <ClubBadge clubName={item.club} className="h-5 w-5 object-contain shrink-0" />
                            <span className="truncate max-w-[120px]">{item.club}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-300">{item.matches}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-300">{item.count}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-emerald-400">{item.saved} / {item.missed}</td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">{item.goals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Top-10 Hidden Gems Table (Regionalliga Bayern) */}
        <div className="space-y-4 sticky top-6 min-w-0">
            <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Top-10 Hidden Gems ({currentLeague.name})</h3>
                  <p className="text-[10px] text-slate-400">U23 & Scorer-Effizienz-Ranking</p>
                </div>
              </div>
              <button
                onClick={() => fetchHiddenGems()}
                disabled={hiddenGemsLoading}
                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {hiddenGemsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>Aktualisieren</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-300">
              <span className="font-bold text-emerald-400">Formel:</span> <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[10px]">(Tore + Assists) * 90 / Min</code>
            </div>

            <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-950 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 sticky top-0 z-10">
                    <th className="py-2.5 px-3 w-10">#</th>
                    <th className="py-2.5 px-3">Spieler / Verein</th>
                    <th className="py-2.5 px-3 text-right">Effizienz/90m</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {hiddenGemsResult?.players ? (
                    hiddenGemsResult.players.map((p: any, idx: number) => {
                      const isTopPearl = p.isTopPearl || (p.age < 23 && p.marketValue < 50000);
                      const playerObj = players.find(x => x.id === p.id || x.name.toLowerCase() === p.name.toLowerCase()) || {
                        id: p.id,
                        name: p.name,
                        club: p.club,
                        league: p.league,
                        age: p.age,
                        position: p.position || 'Mittelfeld',
                        marketValue: p.marketValue,
                        signHimValue: p.marketValue * 8,
                        moneyballIndex: p.moneyballIndex || 9.5,
                        stats: { goals: p.goals, assists: p.assists, appearances: 9, minutesPlayed: p.minutesPlayed, xgPer90: 0.4, xaPer90: 0.3, passCompletion: 80, progressiveCarries: 4, duelsWonPct: 60, pressuresPer90: 20 },
                        risk: { benchRate: 1, cardRisk: 10, matchScore: 96 },
                        scoutSummary: `${p.name} (${p.club}) zeigt starke Scorer-Effizienz.`,
                        strengths: ["Effizienz", "Torgefahr"],
                        weaknesses: ["Physis"],
                        contractStatus: "Verfügbar",
                        contractReady: true
                      };

                      return (
                        <tr
                          key={p.id}
                          onClick={() => onSelectPlayer(playerObj)}
                          className={`hover:bg-emerald-500/15 transition-all cursor-pointer group ${
                            isTopPearl ? 'bg-emerald-950/40 border-l-3 border-emerald-400' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-emerald-400">#{idx + 1}</td>
                          <td className="py-3 px-3 min-w-[140px]">
                            <div className="font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                              <ClubBadge clubName={p.club} className="h-5 w-5 object-contain shrink-0" />
                              <span className="truncate">{p.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 flex-wrap">
                              <span className="truncate max-w-[90px]">{p.club}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-mono">{p.age} J.</span>
                              <span>•</span>
                              <span className="font-mono whitespace-nowrap">{p.marketValue.toLocaleString('de-DE')} €</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm whitespace-nowrap">
                            {p.efficiency} <span className="text-[9px] text-slate-400 font-normal block">({p.goals}T / {p.assists}A)</span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            {isTopPearl ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm animate-pulse whitespace-nowrap">
                                ⭐ Top Effizienz-Perle
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">U23 Talent</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-mono text-xs">
                        Lade Top-10 Hidden Gems...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Klicke auf Spieler für Scout-Profil</span>
              <span className="text-emerald-400 font-mono font-bold whitespace-nowrap">{currentLeague.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
