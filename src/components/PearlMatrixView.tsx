import React, { useState, useEffect } from 'react';
import { Player, getLeagueNameFromId } from '../types';
import { ClubBadge } from '../utils/badges';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Target, TrendingUp, Sparkles, Filter, Search, Award, Info, Building2 } from 'lucide-react';

interface PearlMatrixViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  activeLiga?: string;
  setActiveLiga?: (id: string) => void;
}

export const PearlMatrixView: React.FC<PearlMatrixViewProps> = ({ players, onSelectPlayer, activeLiga, setActiveLiga }) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'scatter' | 'grid'>('scatter');

  useEffect(() => {
    if (activeLiga && activeLiga !== 'ALL') {
      const leagueName = getLeagueNameFromId(activeLiga);
      if (leagueName) {
        setSelectedLeague(leagueName);
      }
    }
  }, [activeLiga]);

  // Search & Suggestions State (150ms debounce)
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [highlightedPlayerId, setHighlightedPlayerId] = useState<string | null>(null);
  const [selectedClubFilter, setSelectedClubFilter] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery.trim().length >= 2) {
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate Scorer efficiency per 90 min and process players for the matrix
  const processedPlayers = players.map((p) => {
    const stats = p.stats || {};
    const goals = stats.goals ?? 0;
    const assists = stats.assists ?? 0;
    const totalScorers = goals + assists;
    const minutes = stats.minutesPlayed ?? (stats.appearances ? stats.appearances * 90 : 850);
    
    let scorerPer90 = minutes > 0 ? (totalScorers / minutes) * 90 : ((stats.xgPer90 || 0) + (stats.xaPer90 || 0));
    if (isNaN(scorerPer90) || scorerPer90 === 0) {
      scorerPer90 = (stats.xgPer90 || 0) + (stats.xaPer90 || 0);
    }
    // Cap at 1.5 for the chart axis scale as requested
    const clampedScorerPer90 = Math.min(Math.max(scorerPer90, 0), 1.5);
    const clampedMarketValue = Math.min(Math.max(p.marketValue || 0, 0), 500000);

    // Top-Perle definition: U23 (age <= 23), high efficiency (scorerPer90 >= 0.35), low market value (marketValue <= 250000)
    const isTopPearl = p.age <= 23 && scorerPer90 >= 0.35 && p.marketValue <= 250000;

    return {
      ...p,
      scorerPer90: Number(clampedScorerPer90.toFixed(2)),
      rawScorerPer90: scorerPer90,
      chartX: clampedMarketValue,
      chartY: Number(clampedScorerPer90.toFixed(2)),
      isTopPearl,
    };
  });

  // Matching players and clubs for live suggestion dropdown
  const matchingPlayers = debouncedQuery.trim().length >= 2 ? processedPlayers.filter((p) => {
    const matchesLeague = selectedLeague === 'ALL' || p.league.toLowerCase().includes(selectedLeague.toLowerCase());
    const matchesQ = p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || p.position.toLowerCase().includes(debouncedQuery.toLowerCase()) || p.club.toLowerCase().includes(debouncedQuery.toLowerCase());
    return matchesLeague && matchesQ;
  }).slice(0, 5) : [];

  const allClubsMap = new Map<string, { name: string; league: string; count: number }>();
  processedPlayers.forEach((p) => {
    const existing = allClubsMap.get(p.club);
    if (existing) {
      existing.count++;
    } else {
      allClubsMap.set(p.club, { name: p.club, league: p.league, count: 1 });
    }
  });

  const matchingClubs = debouncedQuery.trim().length >= 2 ? Array.from(allClubsMap.values()).filter((c) => {
    const matchesLeague = selectedLeague === 'ALL' || c.league.toLowerCase().includes(selectedLeague.toLowerCase());
    const matchesQ = c.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    return matchesLeague && matchesQ;
  }).slice(0, 5) : [];

  const filteredPlayers = processedPlayers.filter((p) => {
    const matchesLeague = selectedLeague === 'ALL' || p.league.toLowerCase().includes(selectedLeague.toLowerCase());
    const matchesPos = selectedPosition === 'ALL' || p.position.toLowerCase().includes(selectedPosition.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClubFilter = !selectedClubFilter || p.club.toLowerCase() === selectedClubFilter.toLowerCase();
    return matchesLeague && matchesPos && matchesSearch && matchesClubFilter;
  });

  const topPearlsCount = processedPlayers.filter((p) => p.isTopPearl).length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-emerald-500/50 p-4 rounded-xl shadow-2xl max-w-xs space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">{data.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${data.isTopPearl ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
              {data.isTopPearl ? '★ Top-Perle U23' : `Alter: ${data.age}`}
            </span>
          </div>
          <div className="text-slate-300 font-medium">
            {data.position} • <span className="text-emerald-300">{data.club}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2 rounded-lg font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Marktwert</span>
              <span className="text-white font-bold">€{data.marketValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Scorer / 90m</span>
              <span className="text-emerald-400 font-bold">{data.scorerPer90}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2">{data.scoutSummary}</p>
          <div className="text-[10px] text-emerald-400 font-semibold pt-1 flex items-center gap-1">
            <span>Klicken, um Spieler-Dossier zu öffnen</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-900/40 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Moneyball Perlen-Matrix (Scatter-Plot)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Marktwert vs. Scorer-Effizienz (U23 Top-Perlen)
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Visuelles Koordinatensystem: Die X-Achse zeigt den Marktwert (0 bis 500.000 €), die Y-Achse zeigt die Scorer-Effizienz pro 90 Minuten (0.0 bis 1.5). U23-Talente mit hoher Effizienz und geringem Marktwert sind leuchtend grün hervorgehoben.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('scatter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'scatter'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Scatter-Plot</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Karten-Ansicht ({filteredPlayers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Matrix-Filter & Suche ({filteredPlayers.length} Spieler sichtbar)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{topPearlsCount} U23 Top-Perlen im Raster identifiziert</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input with Live Suggestions Dropdown */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Spieler oder Verein suchen..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedClubFilter && e.target.value === '') {
                  setSelectedClubFilter(null);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setIsDropdownOpen(true);
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            {/* Dropdown Suggestions */}
            {isDropdownOpen && (matchingPlayers.length > 0 || matchingClubs.length > 0) && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 backdrop-blur-md">
                {/* Spieler Section */}
                {matchingPlayers.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold px-3 py-1 uppercase tracking-wider flex items-center justify-between">
                      <span>Spieler Vorschläge</span>
                      <span className="text-slate-500 font-normal">players_germany.csv</span>
                    </div>
                    {matchingPlayers.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => {
                          onSelectPlayer(player);
                          setHighlightedPlayerId(player.id);
                          setIsDropdownOpen(false);
                          setSearchQuery(player.name);
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-900/90 flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <ClubBadge clubName={player.club} className="h-6 w-6 object-contain shrink-0" />
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                              <span>{player.name}</span>
                              {player.isTopPearl && (
                                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono border border-emerald-500/30">
                                  Top-Perle
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {player.position} • {player.club} • Alter: {player.age}
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[11px] text-emerald-400 font-bold">€{(player.marketValue || 0).toLocaleString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Vereine Section */}
                {matchingClubs.length > 0 && (
                  <div className="p-2 bg-slate-900/60">
                    <div className="text-[10px] font-mono text-amber-400 font-bold px-3 py-1 uppercase tracking-wider flex items-center justify-between">
                      <span>Vereine Vorschläge (Saison 2026/2027)</span>
                      <span className="text-slate-500 font-normal">clubs_germany.csv</span>
                    </div>
                    {matchingClubs.map((club) => (
                      <button
                        key={club.name}
                        type="button"
                        onClick={() => {
                          setSelectedClubFilter(club.name);
                          setSearchQuery(club.name);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-900/90 flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <ClubBadge clubName={club.name} className="h-6 w-6 object-contain shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">{club.name}</div>
                            <div className="text-[10px] text-slate-400">{club.league}</div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            {club.count} Spieler
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* League Filter */}
          <div>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">Alle Ligen (2. bis 5. Liga)</option>
              <option value="2. Bundesliga">2. Bundesliga</option>
              <option value="3. Liga">3. Liga</option>
              <option value="Regionalliga">Regionalliga (West, Nordost, Südwest, Nord, Bayern)</option>
            </select>
          </div>

          {/* Position Filter */}
          <div>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">Alle Positionen</option>
              <option value="Sturm">Stürmer / Flügel</option>
              <option value="Mittelfeld">Mittelfeld</option>
              <option value="Abwehr">Abwehr / Verteidigung</option>
              <option value="Torwart">Torwart</option>
            </select>
          </div>
        </div>

        {selectedClubFilter && (
          <div className="flex items-center justify-between bg-amber-500/15 border border-amber-500/40 px-4 py-2.5 rounded-2xl text-xs text-amber-300">
            <div className="flex items-center gap-2 font-medium">
              <span>Vereins-Filter aktiv: <strong className="text-white">{selectedClubFilter}</strong> ({filteredPlayers.length} Spieler im Kader)</span>
            </div>
            <button
              onClick={() => {
                setSelectedClubFilter(null);
                setSearchQuery('');
              }}
              className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors cursor-pointer text-xs"
            >
              Filter aufheben
            </button>
          </div>
        )}
      </div>

      {viewMode === 'scatter' ? (
        /* Scatter Plot View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>Perlen-Matrix: Marktwert (€) vs. Scorer-Effizienz pro 90 Min</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Klicke auf einen Punkt im Koordinatensystem, um das vollständige Dossier zu öffnen.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] inline-block"></span>
                <span className="text-emerald-300 font-bold">U23 Top-Perle (Leuchtend Grün)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 inline-block"></span>
                <span className="text-slate-300">Weitere Spieler</span>
              </div>
            </div>
          </div>

          {/* Recharts Scatter Chart */}
          <div className="w-full h-[520px] bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 relative">
            {filteredPlayers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">
                Keine Spieler für diese Filterkombination gefunden.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    type="number"
                    dataKey="chartX"
                    name="Marktwert"
                    domain={[0, 500000]}
                    ticks={[0, 100000, 200000, 300000, 400000, 500000]}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`}
                    label={{ value: 'Marktwert (€ 0 bis 500.000 €)', position: 'bottom', fill: '#94a3b8', fontSize: 12, offset: 10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="chartY"
                    name="Scorer-Effizienz / 90m"
                    domain={[0, 1.5]}
                    ticks={[0, 0.3, 0.6, 0.9, 1.2, 1.5]}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => val.toFixed(1)}
                    label={{ value: 'Scorer-Effizienz pro 90 Min (0.0 bis 1.5)', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 12 }}
                  />
                  {/* Reference quadrant lines for Top-Perlen */}
                  <ReferenceLine x={250000} stroke="#334155" strokeDasharray="4 4" label={{ value: 'Max Marktwert (€250k)', fill: '#64748b', fontSize: 10, position: 'top' }} />
                  <ReferenceLine y={0.35} stroke="#334155" strokeDasharray="4 4" label={{ value: 'Effizienz-Schwelle (0.35)', fill: '#64748b', fontSize: 10, position: 'right' }} />
                  
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    name="Spieler Matrix"
                    data={filteredPlayers}
                    cursor="pointer"
                    onClick={(nodeData: any) => {
                      if (nodeData && nodeData.payload) {
                        onSelectPlayer(nodeData.payload);
                      }
                    }}
                  >
                    {filteredPlayers.map((entry, index) => {
                      const isHighlighted = highlightedPlayerId === entry.id;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isHighlighted ? '#3b82f6' : (entry.isTopPearl ? '#22c55e' : '#38bdf8')}
                          stroke={isHighlighted ? '#93c5fd' : (entry.isTopPearl ? '#022c22' : '#020617')}
                          strokeWidth={isHighlighted ? 4 : (entry.isTopPearl ? 3 : 1.5)}
                          r={isHighlighted ? 14 : (entry.isTopPearl ? 10 : 6)}
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quadrant Legend & Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Top-Perlen Quadrant (Leuchtend Grün / U23)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Spieler links oben im Koordinatensystem vereinen ein Alter unter 23 Jahren, eine Scorer-Effizienz von über 0.35 pro 90 Minuten und einen Marktwert unter 250.000 €. Sie sind leuchtend grün hervorgehoben.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Info className="w-4 h-4 text-slate-400" />
                <span>Interaktive Bedienung</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bewege den Mauszeiger über einen Punkt, um die exakten Leistungsdaten zu sehen, oder klicke direkt auf den Punkt, um den Spieler zu verpflichten oder das Dossier zu öffnen.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className={`bg-slate-900/90 border rounded-2xl p-5 space-y-4 cursor-pointer hover:border-emerald-500/50 transition-all shadow-xl relative overflow-hidden group ${
                player.isTopPearl ? 'border-emerald-500/60 bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900' : 'border-slate-800'
              }`}
            >
              {player.isTopPearl && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-bold font-mono shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                  <span>★ U23 Top-Perle</span>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400">{player.position}</span>
                  <span className="text-[10px] font-mono text-slate-400">Alter: {player.age}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">{player.name}</h4>
                <p className="text-xs text-slate-400">{player.club} • {player.league}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Marktwert</span>
                  <span className="text-white font-bold">€{(player.marketValue || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Scorer / 90m</span>
                  <span className="text-emerald-400 font-bold">{(player as any).scorerPer90}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{player.scoutSummary}</p>

              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Dossier öffnen</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
