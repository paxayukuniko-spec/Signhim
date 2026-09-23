import React from 'react';
import { Player } from '../types';
import { TrendingUp, Shield, Zap, FileSignature, CheckCircle2, Award, Radar } from 'lucide-react';
import { PlayerSilhouette } from './PlayerSilhouette';
import { getClubBadgeUrl } from '../utils/clubBadges';

interface PlayerCardProps {
  player: Player;
  onSelect: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSelect }) => {
  const valueRatio = Math.round((player.signHimValue / player.marketValue) * 10) / 10;
  const risk = player.risk || { benchRate: 5.0, cardRisk: 14.0, matchScore: 95.0, injuryVulnerability: "Robust" };
  const injuryText = risk.injuryVulnerability || "Robust";
  const isRobust = injuryText.toLowerCase().includes('robust');
  const score = player.moneyballIndex;
  const isGreen = isRobust && score > 9.0;
  const dotColor = isGreen ? 'bg-emerald-400' : 'bg-amber-400';

  const clubBadge = getClubBadgeUrl(player.club);

  // Radar chart calculation (5 axes)
  const cx = 85;
  const cy = 75;
  const r = 48;
  const numAxes = 5;

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    return {
      x: cx + r * value * Math.cos(angle),
      y: cy + r * value * Math.sin(angle),
    };
  };

  const statValues = [
    Math.min(1, Math.max(0.2, player.stats.xgPer90 / 0.65)),
    Math.min(1, Math.max(0.2, player.stats.xaPer90 / 0.55)),
    Math.min(1, Math.max(0.2, player.stats.progressiveCarries / 7.5)),
    Math.min(1, Math.max(0.2, player.stats.duelsWonPct / 75)),
    Math.min(1, Math.max(0.2, player.stats.passCompletion / 95)),
  ];

  const profileBenchmark = [0.68, 0.68, 0.68, 0.68, 0.68]; // Scouting profile benchmark target

  const playerPoints = statValues.map((val, i) => {
    const pt = getCoordinates(i, val);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const benchmarkPoints = profileBenchmark.map((val, i) => {
    const pt = getCoordinates(i, val);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const axisLabels = ['xG', 'xA', 'Carries', 'Duell', 'Pass'];

  return (
    <div className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/40 hover:shadow-emerald-950/35 relative">
      <span className={`absolute top-3 left-3 w-2.5 h-2.5 rounded-full ${dotColor} inline-block shadow-sm`} title={`Verletzungsrisiko: ${injuryText} | Score: ${score}`}></span>
      <div>
        {/* Top bar: League & Moneyball Index */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700/60 flex items-center gap-1.5">
            {clubBadge && <img src={clubBadge} alt={player.club} className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />}
            <span>{player.league}</span>
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/30 font-mono text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>MB-Index: {player.moneyballIndex}</span>
          </div>
        </div>

        {/* Player Name & Info with Silhouette */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PlayerSilhouette playerName={player.name} club={player.club} size={36} className="w-10 h-10 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {player.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                  {clubBadge && <img src={clubBadge} alt={player.club} className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />}
                  <span>{player.position} • {player.age} J. • <span className="text-slate-300">{player.club}</span></span>
                </p>
              </div>
            </div>
            {player.signed && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded-full border border-amber-500/30 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Signiert
              </span>
            )}
          </div>
        </div>

        {/* Valuation Box */}
        <div className="bg-slate-950/60 rounded-xl p-3 mb-3 border border-slate-800/80 grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Marktwert</div>
            <div className="text-sm font-bold text-slate-300 font-mono">
              €{player.marketValue.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">signHim Wert</div>
            <div className="text-sm font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
              <span>€{player.signHimValue.toLocaleString()}</span>
              <span className="text-[10px] bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-300 font-sans">
                {valueRatio}x
              </span>
            </div>
          </div>
        </div>

        {/* Radar Chart & Matching-Matrix Visualisierung */}
        <div className="bg-slate-950/90 rounded-2xl p-3 mb-3 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-2">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Radar className="w-4 h-4 text-emerald-400" />
              <span>Profil-Radar & Matching</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-mono font-extrabold text-xs">
              {risk.matchScore}% Match
            </span>
          </div>

          {/* SVG Radar Chart */}
          <div className="relative flex justify-center py-1">
            <svg width="170" height="145" className="overflow-visible">
              {/* Background Web Polygons */}
              {[0.25, 0.5, 0.75, 1.0].map((level, idx) => {
                const pts = Array.from({ length: numAxes }).map((_, i) => {
                  const pt = getCoordinates(i, level);
                  return `${pt.x},${pt.y}`;
                }).join(' ');
                return (
                  <polygon
                    key={idx}
                    points={pts}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray={idx < 3 ? '2 2' : undefined}
                  />
                );
              })}

              {/* Axis Lines */}
              {Array.from({ length: numAxes }).map((_, i) => {
                const pt = getCoordinates(i, 1.0);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#334155"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Scouting Profile Benchmark Polygon */}
              <polygon
                points={benchmarkPoints}
                fill="#38bdf8"
                fillOpacity="0.1"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Player Radar Polygon */}
              <polygon
                points={playerPoints}
                fill="#10b981"
                fillOpacity="0.3"
                stroke="#10b981"
                strokeWidth="2"
              />

              {/* Data points */}
              {statValues.map((val, i) => {
                const pt = getCoordinates(i, val);
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="3"
                    fill="#34d399"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Axis Labels */}
              {axisLabels.map((lbl, i) => {
                const pt = getCoordinates(i, 1.22);
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                if (pt.x < cx - 10) textAnchor = 'end';
                if (pt.x > cx + 10) textAnchor = 'start';
                return (
                  <text
                    key={i}
                    x={pt.x}
                    y={pt.y + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor={textAnchor}
                    className="font-medium"
                  >
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Legend & Risk Footer */}
          <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-slate-800/80 text-[10px]">
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Bankdrücker-Quote</span>
              <span className="text-white font-mono font-bold">{risk.benchRate}% (Stamm)</span>
            </div>
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Karten-Risiko</span>
              <span className={`font-mono font-bold ${risk.cardRisk > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {risk.cardRisk}% (Gering)
              </span>
            </div>
          </div>
        </div>

        {/* Summary preview */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {player.scoutSummary}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect(player)}
        className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
      >
        <FileSignature className="w-4 h-4" />
        <span>Dossier & Vertrag prüfen</span>
      </button>
    </div>
  );
};


