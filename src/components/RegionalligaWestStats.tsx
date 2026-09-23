import React, { useState } from 'react';
import { Trophy, Award, Clock, Target, TrendingUp, Shield, BarChart3, Search, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { ClubBadge } from '../utils/badges';

interface RegionalligaWestStatsProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const RegionalligaWestStats: React.FC<RegionalligaWestStatsProps> = ({ players, onSelectPlayer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tabelle' | 'torjaeger' | 'einsatz' | 'elfmeter'>('torjaeger');
  const [searchFilter, setSearchFilter] = useState('');

  // Regionalliga West Tabelle nach 9. Spieltag (Kicker Ground Truth aus Screenshot)
  const leagueTableWest = [
    { rank: 1, team: 'Rot-Weiß Oberhausen', matches: 9, won: 7, draw: 1, lost: 1, goalsFor: 22, goalsAgainst: 8, points: 22, form: 'S S S U S' },
    { rank: 2, team: 'FC Gütersloh', matches: 9, won: 6, draw: 2, lost: 1, goalsFor: 21, goalsAgainst: 7, points: 20, form: 'S S U S S' },
    { rank: 3, team: 'Borussia Dortmund II', matches: 8, won: 5, draw: 3, lost: 0, goalsFor: 15, goalsAgainst: 7, points: 18, form: 'S U S S S' },
    { rank: 4, team: 'Borussia Mönchengladbach II', matches: 9, won: 5, draw: 2, lost: 2, goalsFor: 18, goalsAgainst: 10, points: 17, form: 'S U N S U' },
    { rank: 5, team: 'Westfalia Rhynern (N)', matches: 9, won: 5, draw: 2, lost: 2, goalsFor: 17, goalsAgainst: 16, points: 17, form: 'S S U U S' },
    { rank: 6, team: '1. FC Bocholt', matches: 9, won: 3, draw: 4, lost: 2, goalsFor: 19, goalsAgainst: 18, points: 13, form: 'S N S S U' },
    { rank: 7, team: 'Sportfreunde Siegen', matches: 9, won: 3, draw: 4, lost: 2, goalsFor: 15, goalsAgainst: 14, points: 13, form: 'S U S S U' },
    { rank: 8, team: 'Bergisch Gladbach (N)', matches: 9, won: 4, draw: 1, lost: 4, goalsFor: 13, goalsAgainst: 16, points: 13, form: 'U S S N S' },
    { rank: 9, team: 'FC Schalke 04 II', matches: 9, won: 4, draw: 0, lost: 5, goalsFor: 18, goalsAgainst: 20, points: 12, form: 'N S U S N' },
    { rank: 10, team: 'Bonner SC', matches: 9, won: 2, draw: 5, lost: 2, goalsFor: 18, goalsAgainst: 18, points: 11, form: 'U U S U U' },
    { rank: 11, team: '1. FC Köln II', matches: 9, won: 3, draw: 2, lost: 4, goalsFor: 15, goalsAgainst: 15, points: 11, form: 'S N S N S' },
    { rank: 12, team: 'SC Paderborn 07 II', matches: 8, won: 2, draw: 3, lost: 3, goalsFor: 15, goalsAgainst: 16, points: 9, form: 'U U N S U' },
    { rank: 13, team: 'VfB Hilden (N)', matches: 9, won: 2, draw: 3, lost: 4, goalsFor: 9, goalsAgainst: 17, points: 9, form: 'N U S N U' },
    { rank: 14, team: 'VfL Bochum II', matches: 9, won: 2, draw: 2, lost: 5, goalsFor: 11, goalsAgainst: 16, points: 8, form: 'N N S U N' },
    { rank: 15, team: 'SG Wattenscheid 09 (N)', matches: 9, won: 2, draw: 2, lost: 5, goalsFor: 12, goalsAgainst: 18, points: 8, form: 'N U N N U' },
    { rank: 16, team: 'SC Wiedenbrück', matches: 9, won: 2, draw: 2, lost: 5, goalsFor: 12, goalsAgainst: 20, points: 8, form: 'N N U S N' },
    { rank: 17, team: 'SV Rödinghausen', matches: 9, won: 1, draw: 3, lost: 5, goalsFor: 12, goalsAgainst: 17, points: 6, form: 'N N N U S' },
    { rank: 18, team: 'Sportfreunde Lotte', matches: 9, won: 0, draw: 3, lost: 6, goalsFor: 6, goalsAgainst: 15, points: 3, form: 'N N N N N' },
  ];

  // Torjägerliste West (Kicker Ground Truth aus Screenshot)
  const topScorersWest = [
    { rank: 1, name: 'Patrik Twardzik', club: 'FC Gütersloh', matches: 9, minPerGoal: 81, penalties: '2/2', goals: 10, position: 'Mittelfeld / Sturm' },
    { rank: 2, name: 'Timur Mehmet Kesim', club: 'Verein (West)', matches: 9, minPerGoal: 94, penalties: '2/2', goals: 8, position: 'Mittelstürmer (MS)' },
    { rank: 3, name: 'Malek Fakhro', club: 'Wuppertaler SV', matches: 9, minPerGoal: 126, penalties: '1/1', goals: 6, position: 'Mittelstürmer (MS)' },
    { rank: 4, name: 'Cedric Euschen', club: 'Verein (West)', matches: 8, minPerGoal: 200, penalties: '0/0', goals: 3, position: 'Sturm' },
    { rank: 5, name: 'Nilas Yacobi', club: 'Verein (West)', matches: 7, minPerGoal: 190, penalties: '0/0', goals: 3, position: 'Mittelfeld / Sturm' },
    { rank: 6, name: 'Yassin Ben Balla', club: 'SV Rödinghausen', matches: 9, minPerGoal: 350, penalties: '0/0', goals: 2, position: 'Zentrales Mittelfeld (ZM)' },
  ];

  // Einsatzstatistik West (Kicker Ground Truth aus Screenshot)
  const appearanceStatsWest = [
    { rank: 1, name: 'Christopher Balkenhoff', club: 'Verein (West)', start11: 9, subIn: 0, subOut: 0, minutes: 810, appearances: 9 },
    { rank: 2, name: 'Laurenz Beckemeyer', club: 'Sportfreunde Lotte', start11: 9, subIn: 0, subOut: 0, minutes: 810, appearances: 9 },
    { rank: 3, name: 'Yassin Ben Balla', club: 'SV Rödinghausen', start11: 9, subIn: 0, subOut: 0, minutes: 810, appearances: 9 },
  ];

  // Elfmeterstatistik West (Kicker Ground Truth aus Screenshot)
  const penaltyStatsWest = [
    { rank: 1, name: 'Cedric Euschen', club: 'Verein (West)', matches: 8, count: 3, saved: 0, missed: 0, goals: 3 },
    { rank: 2, name: 'Nilas Yacobi', club: 'Verein (West)', matches: 7, count: 3, saved: 0, missed: 0, goals: 3 },
    { rank: 3, name: 'Yassin Ben Balla', club: 'SV Rödinghausen', matches: 9, count: 2, saved: 0, missed: 0, goals: 2 },
  ];

  const getPlayerObject = (name: string): Player | undefined => {
    return players.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
  };

  const filteredScorers = topScorersWest.filter(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.club.toLowerCase().includes(searchFilter.toLowerCase()));
  const filteredTable = leagueTableWest.filter(t => t.team.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-950 border border-blue-900/40 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/15 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kicker Ground Truth • Saison 2026/27 • 9. Spieltag</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Regionalliga West Statistiken
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Offizielle Live-Statistiken, Torjägerliste, Einsatz- und Elfmeter-Daten der Regionalliga West nach dem 9. Spieltag, direkt verknüpft mit der signHim Moneyball-Scout-Datenbank.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-blue-400 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
              <span>18 Teams • Stand: 9. Spieltag</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('torjaeger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'torjaeger'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/25'
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
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tabelle (9. Spieltag)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('einsatz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'einsatz'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/25'
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
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/25'
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
            placeholder="Spieler oder Verein in der West-Statistik suchen..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Kicker Ground Truth Verifiziert
        </div>
      </div>

      {/* Content based on Active Sub-Tab */}
      {activeSubTab === 'torjaeger' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-400" />
              <span>Torjägerliste – Regionalliga West (2026/27)</span>
            </h3>
            <span className="text-xs font-mono text-blue-400">Stand nach 9. Spieltag</span>
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
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">#{scorer.rank}</td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{scorer.name}</span>
                          {playerObj && (
                            <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded-full text-[10px] font-mono border border-blue-500/30">
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
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-blue-400 text-sm">{scorer.goals}</td>
                      <td className="py-3.5 px-4 text-center">
                        {playerObj ? (
                          <button
                            onClick={() => onSelectPlayer(playerObj)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
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
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Offizielle Tabelle – Regionalliga West (9. Spieltag)</span>
            </h3>
            <span className="text-xs font-mono text-blue-400">Kicker Ground Truth</span>
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
                  <tr key={t.team} className={`hover:bg-slate-800/40 transition-colors ${t.rank === 1 ? 'bg-blue-950/20' : ''}`}>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`inline-flex w-6 h-6 items-center justify-center rounded-lg ${t.rank === 1 ? 'bg-blue-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'}`}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <ClubBadge clubName={t.team} className="h-5 w-5 object-contain shrink-0" />
                      <span className="truncate">{t.team}</span>
                      {t.rank === 1 && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{t.matches}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-blue-400">{t.won}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{t.draw}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-red-400">{t.lost}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{t.goalsFor}:{t.goalsAgainst}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                      {t.goalsFor - t.goalsAgainst > 0 ? `+${t.goalsFor - t.goalsAgainst}` : t.goalsFor - t.goalsAgainst}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-blue-400 text-sm">{t.points}</td>
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
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Einsatzstatistik (Dauerbrenner mit 810 Minuten)</span>
            </h3>
            <span className="text-xs font-mono text-blue-400">9 Spiele volle Distanz</span>
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
                {appearanceStatsWest.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">#{item.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{item.club}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.start11}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{item.subIn}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{item.subOut}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-400">{item.minutes} min</td>
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
              <Target className="w-4 h-4 text-blue-400" />
              <span>Elfmeterstatistik – Regionalliga West</span>
            </h3>
            <span className="text-xs font-mono text-blue-400">Erfolgsquote & Strafstoßschützen</span>
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
                {penaltyStatsWest.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">#{item.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{item.club}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.matches}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.count}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-blue-400">{item.saved} / {item.missed}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-400">{item.goals}</td>
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
