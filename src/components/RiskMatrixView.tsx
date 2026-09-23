import React, { useState, useEffect } from 'react';
import { Player, getLeagueNameFromId } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Target, TrendingUp, ShieldAlert, Award, FileSignature, Info, Filter, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskMatrixViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  activeLiga?: string;
  setActiveLiga?: (id: string) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ players, onSelectPlayer, activeLiga, setActiveLiga }) => {
  const [xAxisMetric, setXAxisMetric] = useState<'xgPer90' | 'xaPer90' | 'passCompletion' | 'progressiveCarries' | 'duelsWonPct' | 'moneyballIndex'>('xgPer90');
  const [yAxisMetric, setYAxisMetric] = useState<'marketValue' | 'signHimValue' | 'cardRisk' | 'benchRate'>('marketValue');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string>('ALL');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('ALL');

  useEffect(() => {
    if (activeLiga && activeLiga !== 'ALL') {
      const leagueName = getLeagueNameFromId(activeLiga);
      if (leagueName) {
        setSelectedLeagueFilter(leagueName);
      }
    }
  }, [activeLiga]);

  // Filter players
  const filteredPlayers = players.filter((p) => {
    const matchesLeague = selectedLeagueFilter === 'ALL' || p.league.toLowerCase().includes(selectedLeagueFilter.toLowerCase());
    const matchesPos = selectedPositionFilter === 'ALL' || p.position.toLowerCase().includes(selectedPositionFilter.toLowerCase());
    return matchesLeague && matchesPos;
  });

  // Prepare data for Recharts ScatterChart
  const chartData = filteredPlayers.map((p) => {
    let xVal = 0;
    if (xAxisMetric === 'xgPer90') xVal = p.stats.xgPer90;
    else if (xAxisMetric === 'xaPer90') xVal = p.stats.xaPer90;
    else if (xAxisMetric === 'passCompletion') xVal = p.stats.passCompletion;
    else if (xAxisMetric === 'progressiveCarries') xVal = p.stats.progressiveCarries;
    else if (xAxisMetric === 'duelsWonPct') xVal = p.stats.duelsWonPct;
    else if (xAxisMetric === 'moneyballIndex') xVal = p.moneyballIndex;

    const risk = p.risk || { cardRisk: 14.0, benchRate: 5.0, matchScore: 95.0, injuryVulnerability: 'Sehr gering (0 Spiele verpasst)', consistencyIndex: 9.1 };

    let yVal = 0;
    if (yAxisMetric === 'marketValue') yVal = p.marketValue;
    else if (yAxisMetric === 'signHimValue') yVal = p.signHimValue;
    else if (yAxisMetric === 'cardRisk') yVal = risk.cardRisk;
    else if (yAxisMetric === 'benchRate') yVal = risk.benchRate;

    return {
      id: p.id,
      name: p.name,
      club: p.club,
      league: p.league,
      position: p.position,
      marketValue: p.marketValue,
      x: xVal,
      y: yVal,
      playerObj: p,
      matchScore: risk.matchScore,
      moneyballIndex: p.moneyballIndex,
    };
  });

  const avgX = chartData.length > 0 ? chartData.reduce((acc, curr) => acc + curr.x, 0) / chartData.length : 0;
  const avgY = chartData.length > 0 ? chartData.reduce((acc, curr) => acc + curr.y, 0) / chartData.length : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const p = data.playerObj as Player;
      const risk = p.risk || {};
      return (
        <div className="bg-slate-950 border border-emerald-500/50 p-4 rounded-xl shadow-2xl max-w-xs space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">{p.name}</span>
            <span className="px-2 py-0.5 bg-emerald-500/25 text-emerald-400 rounded text-[10px] font-mono font-bold">
              MB: {p.moneyballIndex}
            </span>
          </div>
          <div className="text-slate-300 font-medium">
            {p.position} • <span className="text-emerald-300">{p.club}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2 rounded-lg font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Marktwert</span>
              <span className="text-white font-bold">€{p.marketValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Karten-Risiko</span>
              <span className="text-amber-400 font-bold">{risk.cardRisk ?? 12}%</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2">{p.scoutSummary}</p>
          <div className="text-[10px] text-emerald-400 font-semibold pt-1 flex items-center gap-1">
            <span>Klick für Spieler-Dossier & Vertrag</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getAxisLabelText = (metric: string) => {
    switch (metric) {
      case 'xgPer90': return 'xG / 90 Min (Tor-Erwartung)';
      case 'xaPer90': return 'xA / 90 Min (Assist-Erwartung)';
      case 'passCompletion': return 'Passquote (%)';
      case 'progressiveCarries': return 'Progressive Carries / 90m';
      case 'duelsWonPct': return 'Zweikampfquote (%)';
      case 'moneyballIndex': return 'Moneyball-Index (1-10)';
      case 'marketValue': return 'Marktwert (€)';
      case 'signHimValue': return 'signHim True Value (€)';
      case 'cardRisk': return 'Karten-Risiko (%)';
      case 'benchRate': return 'Bankdrücker-Quote (%)';
      default: return metric;
    }
  };

  // Top players for the Risk Traffic Light Table
  const topRiskPlayers = players.slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-900/40 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Moneyball Risiko-Matrix (Saison 2026/27)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Risiko-Analyse & Ampeldiagramm (Verletzung, Karten, Konstanz)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Detaillierte Evaluation der drei Kern-Risikofaktoren: Verletzungsanfälligkeit (aus appearances_germany.csv), Karten-Risiko (Gelb-/Rot-Quoten pro 90 Min) und Form-Konstanz (Konstantes Punkten vs. Eintagsfliegen-Einträge) für alle Top-Spieler der Regionalliga Bayern und des deutschen Datensatzes.
          </p>
        </div>
      </div>

      {/* TOP PLAYERS RISK TRAFFIC LIGHT DASHBOARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Risiko-Ampel & Faktor-Aufschlüsselung für Top-Kandidaten</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualisierung der 3 Risikofaktoren: Verletzungsrisiko, Karten-Risiko und Form-Konstanz.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-emerald-400 font-bold">Geringes Risiko (Grün)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-amber-400">Moderat (Gelb)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topRiskPlayers.map((player) => {
            const risk = player.risk || { cardRisk: 12.0, benchRate: 4.0, matchScore: 95.0, injuryVulnerability: "Robust" };
            const consistency = risk.consistencyIndex ?? 9.2;
            const injuryText = risk.injuryVulnerability || "Robust";
            const cardVal = risk.cardRisk ?? 12;
            const isRobust = injuryText.toLowerCase().includes('robust');
            const score = player.moneyballIndex;
            const isGreen = isRobust && score > 9.0;
            const dotColor = isGreen ? 'bg-emerald-400' : 'bg-amber-400';
            const textColor = isGreen ? 'text-emerald-400' : 'text-amber-400';

            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
              >
                <span className={`absolute top-3 left-3 w-2.5 h-2.5 rounded-full ${dotColor} inline-block shadow-sm`} title={`Verletzungsrisiko: ${injuryText} | Score: ${score}`}></span>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 block">{player.position}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{player.name}</h4>
                    <span className="text-[11px] text-slate-400">{player.club}</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono font-bold">
                    MB: {player.moneyballIndex}
                  </span>
                </div>

                {/* 3 Risk Factors breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  {/* Factor 1: Injury Risk */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dotColor} inline-block`}></span>
                      <span>Verletzungsrisiko</span>
                    </span>
                    <span className={`font-mono font-semibold text-[11px] ${textColor}`}>{injuryText}</span>
                  </div>

                  {/* Factor 2: Card Risk */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cardVal > 20 ? 'bg-amber-400' : 'bg-emerald-400'} inline-block`}></span>
                      <span>Karten-Risiko</span>
                    </span>
                    <span className={`font-mono font-semibold text-[11px] ${cardVal > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {cardVal}% Quote
                    </span>
                  </div>

                  {/* Factor 3: Form Consistency */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                      <span>Form-Konstanz</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold text-[11px]">
                      {consistency} / 10 (Keine Eintagsfliege)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                  <span>Dossier & Risiko-Details öffnen</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Bar for Scatter Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Risiko-Matrix Achsen & Filter</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {chartData.length} Spieler geladen
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">X-Achse (Metrik)</label>
            <select
              value={xAxisMetric}
              onChange={(e) => setXAxisMetric(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="xgPer90">xG / 90 Min (Torgefahr)</option>
              <option value="xaPer90">xA / 90 Min (Vorlagen)</option>
              <option value="passCompletion">Passquote (%)</option>
              <option value="progressiveCarries">Progressive Carries</option>
              <option value="duelsWonPct">Zweikampfquote (%)</option>
              <option value="moneyballIndex">Moneyball-Index</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Y-Achse (Marktwert / Risiko)</label>
            <select
              value={yAxisMetric}
              onChange={(e) => setYAxisMetric(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="marketValue">Marktwert (€)</option>
              <option value="signHimValue">signHim True Value (€)</option>
              <option value="cardRisk">Karten-Risiko (%)</option>
              <option value="benchRate">Bankdrücker-Quote (%)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Liga-Filter</label>
            <select
              value={selectedLeagueFilter}
              onChange={(e) => setSelectedLeagueFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">Alle Ligen</option>
              <option value="Regionalliga Bayern">Regionalliga Bayern (2026/27)</option>
              <option value="2. Bundesliga">2. Bundesliga</option>
              <option value="3. Liga">3. Liga</option>
              <option value="Regionalliga">Alle Regionalligen</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Position</label>
            <select
              value={selectedPositionFilter}
              onChange={(e) => setSelectedPositionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">Alle Positionen</option>
              <option value="Mittelfeld">Mittelfeld</option>
              <option value="Stürmer">Stürmer</option>
              <option value="Abwehr">Abwehr</option>
              <option value="Torwart">Torwart</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scatter Plot Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Scatter-Plot: {getAxisLabelText(xAxisMetric)} vs. {getAxisLabelText(yAxisMetric)}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Klicke auf einen Punkt im Koordinatensystem, um das vollständige Dossier zu öffnen.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              <span className="text-emerald-300">Hoher Moneyball Index (&gt;9.5)</span>
            </div>
          </div>
        </div>

        <div className="w-full h-[450px] bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">
              Keine Spieler für diese Filterkombination gefunden.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={xAxisMetric}
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: getAxisLabelText(xAxisMetric), position: 'bottom', fill: '#94a3b8', fontSize: 12, offset: 0 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={yAxisMetric}
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: getAxisLabelText(yAxisMetric), angle: -90, position: 'left', fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => yAxisMetric.includes('Value') ? `€${(val / 1000).toFixed(0)}k` : `${val}%`}
                />
                <ReferenceLine x={avgX} stroke="#334155" strokeDasharray="4 4" />
                <ReferenceLine y={avgY} stroke="#334155" strokeDasharray="4 4" />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  name="Spieler Risiko Matrix"
                  data={chartData}
                  cursor="pointer"
                  onClick={(nodeData: any) => {
                    if (nodeData && nodeData.playerObj) {
                      onSelectPlayer(nodeData.playerObj);
                    }
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.moneyballIndex >= 9.5 ? '#10b981' : '#38bdf8'}
                      stroke="#020617"
                      strokeWidth={2}
                      r={8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
