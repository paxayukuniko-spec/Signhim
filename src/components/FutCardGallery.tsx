import React, { useState } from 'react';
import { Player } from '../types';
import { ScoutingCard } from './ScoutingCard';
import { PlayStationMoneyballCard } from './PlayStationMoneyballCard';
import { Search, Trophy, Sparkles, Filter, Gamepad2 } from 'lucide-react';

interface FutCardGalleryProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  activeLiga: string;
  setActiveLiga: (liga: string) => void;
}

export const FutCardGallery: React.FC<FutCardGalleryProps> = ({ players, onSelectPlayer, activeLiga, setActiveLiga }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('ALL');
  const [cardStyle, setCardStyle] = useState<'gold' | 'playstation'>('playstation');

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLeague = selectedLeague === 'ALL' || p.league.toLowerCase().includes(selectedLeague.toLowerCase());
    return matchesSearch && matchesLeague;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                PlayStation Moneyball Edition
              </span>
              <span className="text-xs text-slate-400 font-mono">EA FC / FUT Ultimate Team Stil</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              PlayStation Moneyball & FUT Scouting-Karten
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Exakte Umsetzung der PlayStation-Moneyball-Karte für J. Kania (1. FC Nürnberg II '23/24) und alle weiteren Entdeckungen der 2. bis 5. Liga mit den 6 Kern-Werten (EFF, TOR, PAS, XG, PHYS, POT).
            </p>
          </div>

          {/* Card Style Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setCardStyle('playstation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                cardStyle === 'playstation'
                  ? 'bg-[#00ffcc] text-slate-950 shadow-lg shadow-[#00ffcc]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>PlayStation Stil</span>
            </button>
            <button
              onClick={() => setCardStyle('gold')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                cardStyle === 'gold'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>EA Gold Stil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls / Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Spieler oder Verein suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ffcc]"
          />
        </div>

        {/* League Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-[#00ffcc] shrink-0" />
          {['ALL', 'Regionalliga Bayern', '2. Bundesliga', '3. Liga', 'Regionalliga', 'Oberliga'].map((lig) => (
            <button
              key={lig}
              onClick={() => setSelectedLeague(lig)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedLeague === lig
                  ? 'bg-[#00ffcc] text-slate-950 font-bold shadow-lg shadow-[#00ffcc]/20'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {lig === 'ALL' ? 'Alle Ligen' : lig === 'Regionalliga Bayern' ? '★ RL Bayern (Top 5 Stürmer)' : lig}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {filteredPlayers.map((player) => (
          cardStyle === 'playstation' ? (
            <PlayStationMoneyballCard key={player.id} player={player} onSelect={onSelectPlayer} />
          ) : (
            <ScoutingCard key={player.id} player={player} onSelect={onSelectPlayer} />
          )
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-sm font-mono">
          Keine Spieler gefunden für diese Filterkriterien.
        </div>
      )}
    </div>
  );
};

