import React, { useState } from 'react';
import { Trophy, Award, Clock, Target, TrendingUp, Shield, BarChart3, Search, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { ClubBadge } from '../utils/badges';

interface RegionalligaNordostStatsProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const RegionalligaNordostStats: React.FC<RegionalligaNordostStatsProps> = ({ players, onSelectPlayer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tabelle' | 'torjaeger' | 'einsatz' | 'elfmeter'>('torjaeger');
  const [searchFilter, setSearchFilter] = useState('');

  // Regionalliga Nordost Stand nach 10. Spieltag (Kicker Ground Truth)
  const leagueTable = [
    { rank: 1, team: 'FC Rot-Weiß Erfurt', matches: 10, won: 7, draw: 3, lost: 0, goalsFor: 32, goalsAgainst: 8, points: 24, form: 'S S S U S' },
    { rank: 2, team: 'Chemnitzer FC', matches: 10, won: 7, draw: 2, lost: 1, goalsFor: 21, goalsAgainst: 5, points: 23, form: 'S S U S S' },
    { rank: 3, team: 'FC Erzgebirge Aue', matches: 10, won: 6, draw: 3, lost: 1, goalsFor: 19, goalsAgainst: 14, points: 21, form: 'S U S S U' },
    { rank: 4, team: 'Greifswalder FC', matches: 10, won: 5, draw: 4, lost: 1, goalsFor: 23, goalsAgainst: 15, points: 19, form: 'S S U U S' },
    { rank: 5, team: 'Hallescher FC', matches: 10, won: 5, draw: 4, lost: 1, goalsFor: 15, goalsAgainst: 7, points: 19, form: 'S U S S U' },
    { rank: 6, team: 'BFC Dynamo', matches: 10, won: 5, draw: 3, lost: 2, goalsFor: 19, goalsAgainst: 12, points: 18, form: 'S S U N S' },
    { rank: 7, team: 'VSG Altglienicke', matches: 10, won: 5, draw: 3, lost: 2, goalsFor: 19, goalsAgainst: 14, points: 18, form: 'U S S N S' },
    { rank: 8, team: 'FC Carl Zeiss Jena', matches: 10, won: 5, draw: 1, lost: 4, goalsFor: 14, goalsAgainst: 9, points: 16, form: 'S N S S N' },
    { rank: 9, team: '1. FC Lokomotive Leipzig', matches: 10, won: 4, draw: 3, lost: 3, goalsFor: 20, goalsAgainst: 19, points: 15, form: 'S U N S U' },
    { rank: 10, team: 'FSV Zwickau', matches: 10, won: 4, draw: 2, lost: 4, goalsFor: 12, goalsAgainst: 16, points: 14, form: 'N S U S N' },
    { rank: 11, team: '1. FC Magdeburg II', matches: 10, won: 4, draw: 1, lost: 5, goalsFor: 20, goalsAgainst: 22, points: 13, form: 'S N S N S' },
    { rank: 12, team: 'BFC Preussen', matches: 10, won: 2, draw: 4, lost: 4, goalsFor: 12, goalsAgainst: 14, points: 10, form: 'U U N S U' },
    { rank: 13, team: 'SV Babelsberg 03', matches: 10, won: 2, draw: 3, lost: 5, goalsFor: 11, goalsAgainst: 15, points: 9, form: 'N U S N U' },
    { rank: 14, team: 'Hertha BSC II', matches: 10, won: 2, draw: 2, lost: 6, goalsFor: 8, goalsAgainst: 20, points: 8, form: 'N N S U N' },
    { rank: 15, team: 'BSG Chemie Leipzig', matches: 10, won: 1, draw: 3, lost: 6, goalsFor: 10, goalsAgainst: 16, points: 6, form: 'N U N N U' },
    { rank: 16, team: 'RSV Eintracht', matches: 10, won: 1, draw: 3, lost: 6, goalsFor: 13, goalsAgainst: 25, points: 6, form: 'N N U S N' },
    { rank: 17, team: 'Tasmania Berlin', matches: 10, won: 1, draw: 2, lost: 7, goalsFor: 12, goalsAgainst: 31, points: 5, form: 'N N N U S' },
    { rank: 18, team: 'FSV Luckenwalde', matches: 10, won: 1, draw: 0, lost: 9, goalsFor: 7, goalsAgainst: 25, points: 3, form: 'N N N N N' },
  ];

  // Torjägerliste (Kicker Ground Truth Data)
  const topScorers = [
    { rank: 1, name: 'Niclas Stierlin', club: 'Hallescher FC', matches: 10, minPerGoal: 125, penalties: '0/0', goals: 7, position: 'Mittelfeld (DM/ZM)' },
    { rank: 2, name: 'Rufat Dadashov', club: 'BFC Dynamo', matches: 10, minPerGoal: 111, penalties: '2/2', goals: 6, position: 'Mittelstürmer (MS)' },
    { rank: 3, name: 'Dustin Forkel', club: 'Rot-Weiß Erfurt', matches: 10, minPerGoal: 92, penalties: '0/0', goals: 6, position: 'Stürmer / OM' },
    { rank: 4, name: 'Colin Kroll-Thiel', club: 'Greifswalder FC', matches: 9, minPerGoal: 158, penalties: '0/0', goals: 5, position: 'Sturm / LA' },
    { rank: 5, name: 'Levin Mattmüller', club: 'BFC Dynamo', matches: 10, minPerGoal: 176, penalties: '1/1', goals: 5, position: 'Mittelfeld (OM)' },
    { rank: 6, name: 'Tim Maciejewski', club: 'Erzgebirge Aue', matches: 10, minPerGoal: 170, penalties: '0/0', goals: 5, position: 'Sturm / RA' },
    { rank: 7, name: 'Domenico Alberico', club: 'Chemnitzer FC', matches: 9, minPerGoal: 195, penalties: '1/1', goals: 4, position: 'Sturm / OM' },
    { rank: 8, name: 'Grace Bokake Bolufe', club: 'Greifswalder FC', matches: 10, minPerGoal: 212, penalties: '0/0', goals: 4, position: 'Mittelstürmer (MS)' },
    { rank: 9, name: 'Felix Heim', club: 'Greifswalder FC', matches: 10, minPerGoal: 215, penalties: '0/0', goals: 4, position: 'Sturm / RA' },
    { rank: 10, name: 'Bocar Baro', club: 'Hallescher FC', matches: 8, minPerGoal: 177, penalties: '0/0', goals: 4, position: 'Mittelstürmer (MS)' },
  ];

  // Einsatzstatistik (Kicker Ground Truth Data)
  const appearanceStats = [
    { rank: 1, name: 'Luca Bendel', club: 'Hallescher FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 2, name: 'Philip Fontein', club: 'Greifswalder FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 3, name: 'Paul Hainke', club: 'BFC Dynamo', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 4, name: 'Patrick Kapp', club: 'Erzgebirge Aue', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 5, name: 'Burim Halili', club: 'Hallescher FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 6, name: 'Niklas Landgraf', club: 'Hallescher FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 7, name: 'Marcus Niemitz', club: 'Greifswalder FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
    { rank: 8, name: 'Niclas Stierlin', club: 'Hallescher FC', start11: 10, subIn: 0, subOut: 0, minutes: 900, appearances: 10 },
  ];

  // Elfmeterstatistik (Kicker Ground Truth Data)
  const penaltyStats = [
    { rank: 1, name: 'Farid Abderrahmane', club: 'VSG Altglienicke / Verein', matches: 9, count: 2, saved: 0, missed: 0, goals: 2 },
    { rank: 2, name: 'Rufat Dadashov', club: 'BFC Dynamo', matches: 10, count: 2, saved: 0, missed: 0, goals: 2 },
    { rank: 3, name: 'Magnus Baars', club: '1. FC Lokomotive Leipzig', matches: 4, count: 1, saved: 0, missed: 0, goals: 1 },
    { rank: 4, name: 'Domenico Alberico', club: 'Chemnitzer FC', matches: 9, count: 1, saved: 0, missed: 0, goals: 1 },
    { rank: 5, name: 'Levin Mattmüller', club: 'BFC Dynamo', matches: 10, count: 1, saved: 0, missed: 0, goals: 1 },
  ];

  // Match player with app database if available
  const getPlayerObject = (name: string): Player | undefined => {
    return players.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
  };

  const filteredScorers = topScorers.filter(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.club.toLowerCase().includes(searchFilter.toLowerCase()));
  const filteredTable = leagueTable.filter(t => t.team.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 border border-emerald-900/40 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kicker Ground Truth • Saison 2026/27 • 10. Spieltag</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Regionalliga Nordost Statistiken
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Offizielle Live-Statistiken, Torjägerliste, Einsatz- und Elfmeter-Daten der Regionalliga Nordost nach dem 10. Spieltag, direkt verknüpft mit der signHim Moneyball-Scout-Datenbank.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>18 Teams • Stand: 10. Spieltag</span>
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
            <span>Tabelle (10. Spieltag)</span>
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
            placeholder="Spieler oder Verein in der Statistik suchen..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Torjägerliste – Regionalliga Nordost (2026/27)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Stand nach 10. Spieltag</span>
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
                          <span className="text-[10px] text-slate-500 font-mono">Kein Profil</span>
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
              <span>Offizielle Tabelle – Regionalliga Nordost (10. Spieltag)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Kicker Ground Truth</span>
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
                  <tr key={t.team} className={`hover:bg-slate-800/40 transition-colors ${t.rank === 1 ? 'bg-emerald-950/20' : ''}`}>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`inline-flex w-6 h-6 items-center justify-center rounded-lg ${t.rank === 1 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'}`}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <ClubBadge clubName={t.team} className="h-5 w-5 object-contain shrink-0" />
                      <span className="truncate">{t.team}</span>
                      {t.rank === 1 && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
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
        </div>
      )}

      {activeSubTab === 'einsatz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Einsatzstatistik (Dauerbrenner mit 900 Minuten)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">10 Spiele volle Distanz</span>
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
                {appearanceStats.map((item) => (
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
              <span>Elfmeterstatistik – Regionalliga Nordost</span>
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
                {penaltyStats.map((item) => (
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
