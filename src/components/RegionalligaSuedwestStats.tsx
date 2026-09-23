import React, { useState } from 'react';
import { Trophy, Award, Clock, Target, TrendingUp, Shield, BarChart3, Search, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { ClubBadge } from '../utils/badges';

interface RegionalligaSuedwestStatsProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const RegionalligaSuedwestStats: React.FC<RegionalligaSuedwestStatsProps> = ({ players, onSelectPlayer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tabelle' | 'torjaeger' | 'einsatz' | 'elfmeter'>('torjaeger');
  const [searchFilter, setSearchFilter] = useState('');

  // Regionalliga Südwest Tabelle nach 8. Spieltag (Kicker Ground Truth aus Screenshot)
  const leagueTableSuedwest = [
    { rank: 1, team: 'Offenbach', matches: 8, won: 6, draw: 1, lost: 1, goalsFor: 19, goalsAgainst: 8, points: 19, form: 'S S S U S' },
    { rank: 2, team: 'Heilbronn-Freiberg', matches: 8, won: 5, draw: 3, lost: 0, goalsFor: 22, goalsAgainst: 7, points: 18, form: 'S S U S S' },
    { rank: 3, team: 'Stg. Kickers', matches: 8, won: 5, draw: 1, lost: 2, goalsFor: 15, goalsAgainst: 11, points: 16, form: 'S U S S U' },
    { rank: 4, team: 'Homburg', matches: 8, won: 4, draw: 2, lost: 2, goalsFor: 12, goalsAgainst: 11, points: 14, form: 'S S U U S' },
    { rank: 5, team: 'Freiburg II', matches: 8, won: 3, draw: 4, lost: 1, goalsFor: 16, goalsAgainst: 11, points: 13, form: 'S U S S U' },
    { rank: 6, team: 'Trier', matches: 8, won: 4, draw: 1, lost: 3, goalsFor: 9, goalsAgainst: 7, points: 13, form: 'S N S S U' },
    { rank: 7, team: 'FSV Frankfurt', matches: 8, won: 3, draw: 3, lost: 2, goalsFor: 13, goalsAgainst: 9, points: 12, form: 'U S S U S' },
    { rank: 8, team: 'Aalen (N)', matches: 8, won: 3, draw: 3, lost: 2, goalsFor: 11, goalsAgainst: 9, points: 12, form: 'N S U S N' },
    { rank: 9, team: 'VfR Mannheim (N)', matches: 8, won: 2, draw: 5, lost: 1, goalsFor: 9, goalsAgainst: 8, points: 11, form: 'U U S N U' },
    { rank: 10, team: 'Kassel', matches: 8, won: 3, draw: 1, lost: 4, goalsFor: 14, goalsAgainst: 15, points: 10, form: 'S N S N S' },
    { rank: 11, team: 'E. Frankfurt II (N)', matches: 8, won: 3, draw: 1, lost: 4, goalsFor: 11, goalsAgainst: 12, points: 10, form: 'U U N S U' },
    { rank: 12, team: 'Steinbach', matches: 8, won: 2, draw: 3, lost: 3, goalsFor: 12, goalsAgainst: 13, points: 9, form: 'N U S N U' },
    { rank: 13, team: 'Sandhausen', matches: 8, won: 2, draw: 3, lost: 3, goalsFor: 13, goalsAgainst: 18, points: 9, form: 'N N S U N' },
    { rank: 14, team: "K'lautern II (N)", matches: 8, won: 2, draw: 2, lost: 4, goalsFor: 6, goalsAgainst: 17, points: 8, form: 'N U N N U' },
    { rank: 15, team: 'FCA Walldorf', matches: 8, won: 1, draw: 3, lost: 4, goalsFor: 10, goalsAgainst: 15, points: 6, form: 'N N U S N' },
    { rank: 16, team: 'Mainz 05 II', matches: 8, won: 2, draw: 0, lost: 6, goalsFor: 8, goalsAgainst: 18, points: 6, form: 'N N N U S' },
    { rank: 17, team: 'SG Barockstadt', matches: 8, won: 1, draw: 2, lost: 5, goalsFor: 12, goalsAgainst: 16, points: 5, form: 'N N N N N' },
    { rank: 18, team: 'Ulm (A)', matches: 8, won: 0, draw: 4, lost: 4, goalsFor: 11, goalsAgainst: 18, points: 4, form: 'N N N N N' },
  ];

  // Torjägerliste Südwest (Kicker Ground Truth aus Screenshot)
  const topScorersSuedwest = [
    { rank: 1, name: 'Fabian Rüdlin', club: 'Offenbach', matches: 8, minPerGoal: 90, penalties: '4/4', goals: 6, position: 'Mittelfeld / Sturm' },
    { rank: 2, name: 'Gwang-in Lee', club: 'Heilbronn-Freiberg', matches: 8, minPerGoal: 128, penalties: '1/1', goals: 5, position: 'Sturm' },
    { rank: 3, name: 'Maximilian Schmid', club: 'Freiburg II', matches: 8, minPerGoal: 135, penalties: '0/0', goals: 5, position: 'Sturm' },
  ];

  // Einsatzstatistik Südwest (Kicker Ground Truth aus Screenshot)
  const appearanceStatsSuedwest = [
    { rank: 1, name: 'Lucas Becker', club: 'Offenbach', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
    { rank: 2, name: 'Robin Becker', club: 'FSV Frankfurt', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
    { rank: 3, name: 'Adrian Bravo Sanchez', club: 'Stg. Kickers', start11: 8, subIn: 0, subOut: 0, minutes: 720, appearances: 8 },
  ];

  // Elfmeterstatistik Südwest (Kicker Ground Truth aus Screenshot)
  const penaltyStatsSuedwest = [
    { rank: 1, name: 'Fabian Rüdlin', club: 'Offenbach', matches: 8, count: 4, saved: 0, missed: 0, goals: 4 },
    { rank: 2, name: 'Birkan Celik', club: 'FCA Walldorf', matches: 7, count: 2, saved: 0, missed: 0, goals: 2 },
    { rank: 3, name: 'Dennis Chessa', club: 'Aalen (N)', matches: 8, count: 2, saved: 0, missed: 0, goals: 2 },
  ];

  const getPlayerObject = (name: string): Player | undefined => {
    return players.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
  };

  const filteredScorers = topScorersSuedwest.filter(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.club.toLowerCase().includes(searchFilter.toLowerCase()));
  const filteredTable = leagueTableSuedwest.filter(t => t.team.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 border border-emerald-900/40 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kicker Ground Truth • Saison 2026/27 • 8. Spieltag</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Regionalliga Südwest Tabelle & Statistiken
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Offizielle Live-Tabelle, Torjägerliste, Einsatz- und Elfmeter-Daten der Regionalliga Südwest nach dem 8. Spieltag (Stand: 21.09.2026), direkt verknüpft mit der signHim Moneyball-Scout-Datenbank.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>18 Teams • Stand: 8. Spieltag</span>
            </div>
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
            <span>Tabelle (8. Spieltag)</span>
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
            placeholder="Spieler oder Verein in der Südwest-Statistik suchen..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Kicker Ground Truth • 21.09. 03:38
        </div>
      </div>

      {/* Content based on Active Sub-Tab */}
      {activeSubTab === 'torjaeger' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Torjägerliste – Regionalliga Südwest (2026/27)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Stand nach 8. Spieltag</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Rang</th>
                  <th className="py-3 px-4">Spieler</th>
                  <th className="py-3 px-4">Verein</th>
                  <th className="py-3 px-4 text-center">Spiele</th>
                  <th className="py-3 px-4 text-center">Min / Tor</th>
                  <th className="py-3 px-4 text-center">Elfmeter</th>
                  <th className="py-3 px-4 text-right">Tore</th>
                  <th className="py-3 px-4 text-center">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredScorers.map((scorer) => {
                  const playerObj = getPlayerObject(scorer.name);
                  return (
                    <tr key={scorer.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">#{scorer.rank}</td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{scorer.name}</span>
                          {playerObj && (
                            <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full text-[10px] font-mono border border-emerald-500/30">
                              Moneyball Perle
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">{scorer.position}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <ClubBadge clubName={scorer.club} className="h-5 w-5 object-contain shrink-0" />
                          <span className="truncate max-w-[140px]">{scorer.club}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">{scorer.matches}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">{scorer.minPerGoal} min</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">{scorer.penalties}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-400 text-sm">{scorer.goals}</td>
                      <td className="py-3.5 px-4 text-center">
                        {playerObj ? (
                          <button
                            onClick={() => onSelectPlayer(playerObj)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
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
              <span>Offizielle Tabelle – Regionalliga Südwest (8. Spieltag)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Aufstieg in 3. Liga / 4 Absteiger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4 w-16 text-center">Platz</th>
                  <th className="py-3 px-4">Mannschaft</th>
                  <th className="py-3 px-4 text-center">Spiele</th>
                  <th className="py-3 px-4 text-center">S</th>
                  <th className="py-3 px-4 text-center">U</th>
                  <th className="py-3 px-4 text-center">N</th>
                  <th className="py-3 px-4 text-center">Tore</th>
                  <th className="py-3 px-4 text-center">Diff</th>
                  <th className="py-3 px-4 text-right">Punkte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredTable.map((t) => (
                  <tr key={t.team} className={`hover:bg-slate-800/40 transition-colors ${t.rank === 1 ? 'bg-emerald-950/20' : t.rank >= 15 ? 'bg-red-950/10' : ''}`}>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`inline-flex w-6 h-6 items-center justify-center rounded-lg ${
                        t.rank === 1 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 
                        t.rank >= 15 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <ClubBadge clubName={t.team} className="h-5 w-5 object-contain shrink-0" />
                      <span className="truncate">{t.team}</span>
                      {t.rank === 1 && <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[9px] font-mono">Aufstiegsplatz</span>}
                      {t.rank >= 15 && <span className="px-2 py-0.5 bg-red-500/15 text-red-400 rounded text-[9px] font-mono">Abstiegsplatz</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{t.matches}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-400">{t.won}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{t.draw}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-red-400">{t.lost}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{t.goalsFor}:{t.goalsAgainst}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                      {t.goalsFor - t.goalsAgainst > 0 ? `+${t.goalsFor - t.goalsAgainst}` : t.goalsFor - t.goalsAgainst}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-400 text-sm">{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Stand: Mo. 21.09. 03:38</span>
            <span>Der Meister steigt in die 3. Liga auf. Die letzten vier Teams steigen ab.</span>
          </div>
        </div>
      )}

      {activeSubTab === 'einsatz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Einsatzstatistik (Dauerbrenner mit 720 Minuten)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">8 Spiele volle Distanz</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Rang</th>
                  <th className="py-3 px-4">Spieler</th>
                  <th className="py-3 px-4">Verein</th>
                  <th className="py-3 px-4 text-center">Startelf</th>
                  <th className="py-3 px-4 text-center">Eingew.</th>
                  <th className="py-3 px-4 text-center">Ausgew.</th>
                  <th className="py-3 px-4 text-right">Minuten</th>
                  <th className="py-3 px-4 text-center">Einsätze</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {appearanceStatsSuedwest.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">#{item.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{item.club}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.start11}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{item.subIn}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{item.subOut}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{item.minutes} min</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.appearances}</td>
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
              <span>Elfmeterstatistik – Regionalliga Südwest</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Erfolgsquote & Strafstoßschützen</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Rang</th>
                  <th className="py-3 px-4">Spieler</th>
                  <th className="py-3 px-4">Verein</th>
                  <th className="py-3 px-4 text-center">Spiele</th>
                  <th className="py-3 px-4 text-center">Elfmeter (Anzahl)</th>
                  <th className="py-3 px-4 text-center">Gehalten / Vers.</th>
                  <th className="py-3 px-4 text-right">Tore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {penaltyStatsSuedwest.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">#{item.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{item.club}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.matches}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.count}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-400">{item.saved} / {item.missed}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{item.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
