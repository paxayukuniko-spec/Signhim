import React, { useState } from 'react';
import { Player } from '../types';
import { X, FileSignature, Award, CheckCircle2, TrendingUp, Sparkles, Shield, Loader2, Download, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
  onSignContract: (player: Player, signatureName: string, salary: string) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose, onSignContract }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dossier' | 'contract'>('dossier');
  
  // Live Web Comparison state
  const [liveComparison, setLiveComparison] = useState<{ current_club?: string; current_league?: string; development_status?: string } | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);

  const handleFetchLiveComparison = async () => {
    if (!player) return;
    try {
      setLoadingLive(true);
      const res = await fetch(`/api/compare-player/${encodeURIComponent(player.name)}?team_23_24=${encodeURIComponent(player.club)}&market_value_23_24=${encodeURIComponent(player.marketValue + ' €')}`);
      const data = await res.json();
      setLiveComparison(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLive(false);
    }
  };
  
  // Contract signing state
  const [signName, setSignName] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [salaryChoice, setSalaryChoice] = useState('18.500 € / Monat + 5.000 € pro Tor');
  const [signedSuccess, setSignedSuccess] = useState(false);

  if (!player) return null;

  const handleFetchAiReport = async () => {
    try {
      setLoadingAi(true);
      const res = await fetch('/api/scout/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player.id }),
      });
      const data = await res.json();
      setAiReport(data.analysis || player.scoutSummary);
    } catch (err) {
      console.error(err);
      setAiReport(player.scoutSummary);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signName.trim() || !agreedTerms) return;

    // Trigger confetti celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#059669', '#f59e0b', '#ffffff']
    });

    setSignedSuccess(true);
    onSignContract(player, signName, salaryChoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{player.name}</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/30">
                  MB-Index: {player.moneyballIndex}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {player.position} • {player.club} ({player.league}) • Alter: {player.age}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'dossier'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Scout-Dossier & Metriken</span>
          </button>

          <button
            onClick={() => setActiveTab('contract')}
            className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'contract'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>Vertrags- & Unterschriften-Zentrale</span>
            {player.signed && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'dossier' ? (
            <>
              {/* Valuation Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Offizieller Marktwert (Transfermarkt)</div>
                  <div className="text-xl font-bold text-slate-200 font-mono">
                    €{player.marketValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Status: {player.contractStatus}</div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-slate-950 to-emerald-950/20">
                  <div className="text-xs text-emerald-400 font-medium mb-1">signHim True Value (Moneyball)</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-2">
                    <span>€{player.signHimValue.toLocaleString()}</span>
                    <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                      {(player.signHimValue / player.marketValue).toFixed(1)}x ROI
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300/70 mt-1">Massive Unterbewertung erkannt</div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Vertragssituation</div>
                    <div className="text-xs font-semibold text-white">{player.contractStatus}</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('contract')}
                    className="mt-2 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSignature className="w-4 h-4" />
                    <span>Jetzt Vertrag vorbereiten</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Erweiterte Performance-Metriken (Per 90 Min.)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {player.stats.goals !== undefined && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
                      <div className="text-xs text-slate-400">Tore</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{player.stats.goals}</div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">Saisontore</div>
                    </div>
                  )}
                  {player.stats.assists !== undefined && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
                      <div className="text-xs text-slate-400">Assists</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{player.stats.assists}</div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">Torvorlagen</div>
                    </div>
                  )}
                  {player.stats.appearances !== undefined && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Einsätze</div>
                      <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.appearances}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Spiele</div>
                    </div>
                  )}
                  {player.stats.minutesPlayed !== undefined && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Minuten</div>
                      <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.minutesPlayed}'</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Spielminuten</div>
                    </div>
                  )}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Expected Goals (xG)</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.xgPer90}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Pro 90 Min</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Expected Assists (xA)</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.xaPer90}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Überdurchschnittlich</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Passquote</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.passCompletion}%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Pressingresistent</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Progressive Läufe</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.progressiveCarries}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Raumgewinn</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Zweikampfquote</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.duelsWonPct}%</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Robust & Defensivstark</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Pressing-Aktionen</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{player.stats.pressuresPer90}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Gegenpressing-Intensiv</div>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Stärken (Key Attributes)</h4>
                  <ul className="space-y-2">
                    {player.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Entwicklungspotenzial / Schwächen</h4>
                  <ul className="space-y-2">
                    {player.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Deep Dive Section */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    signHim AI Scout-Analyse
                  </h3>
                  {!aiReport && (
                    <button
                      onClick={handleFetchAiReport}
                      disabled={loadingAi}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Deep-Dive generieren</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiReport || player.scoutSummary}
                </p>
              </div>

              {/* Live 2026 Real-World Web Comparison Section */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Live 2026 Web-Vergleich & Moneyball Grounding
                  </h3>
                  {!liveComparison && (
                    <button
                      onClick={handleFetchLiveComparison}
                      disabled={loadingLive}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {loadingLive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Live 2026 Web-Daten abfragen</span>
                    </button>
                  )}
                </div>
                {liveComparison ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Aktueller Verein (2026/27):</span>
                      <span className="text-emerald-400 font-bold">{liveComparison.current_club}</span>
                    </div>
                    <div className="flex justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Aktuelle Liga:</span>
                      <span className="text-white font-medium">{liveComparison.current_league}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold block mb-1">Entwicklungs-Status (Moneyball-Analyse):</span>
                      {liveComparison.development_status}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Klicken Sie auf den Button, um via Google Search Grounding die aktuellen Real-World-Daten des Spielers für das Jahr 2026 abzurufen und mit den historischen Werten abzugleichen.
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Contract Signing Ceremony Tab */
            <div className="space-y-6">
              {signedSuccess || player.signed ? (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-8 rounded-2xl text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Vertrag erfolgreich unterzeichnet!</h3>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto">
                    {player.name} wurde erfolgreich für Ihren Verein gesigned. Die Transferpapiere wurden an die DFL/DFB übermittelt.
                  </p>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-slate-400"><span>Spieler:</span> <span className="text-white">{player.name}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Gehalt:</span> <span className="text-emerald-400">{player.salary || salaryChoice}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Sportdirektor Unterschrift:</span> <span className="text-emerald-400">{player.signedByClub || signName}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Datum:</span> <span className="text-white">{player.signedAt || new Date().toLocaleDateString('de-DE')}</span></div>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Vertrag drucken / PDF</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Zurück zur Matrix
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Official Contract Header */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-serif space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-emerald-400 font-sans font-bold">signHim Official Employment & Transfer Agreement</div>
                        <h3 className="text-lg font-bold text-white font-sans mt-1">Profifußballer-Arbeitsvertrag (Moneyball Protocol)</h3>
                      </div>
                      <div className="text-right font-mono text-xs text-slate-400">
                        <div>Ref: SH-{player.id.toUpperCase()}-2026</div>
                        <div className="text-emerald-400">Status: BEREIT ZUM SIGNEN</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 font-sans space-y-3 leading-relaxed">
                      <p>
                        Zwischen dem aufnehmenden Fußballverein und dem Lizenzspieler <strong className="text-white">{player.name}</strong> (aktuell {player.club}, {player.league}) wird gemäß den datenbasierten Empfehlungen der signHim-Plattform folgender Vertrag geschlossen:
                      </p>
                      
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Vertragslaufzeit:</span>
                          <strong className="text-white">3 Jahre (bis 30.06.2029) + Option</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Ablösesumme (Marktwert):</span>
                          <strong className="text-emerald-400 font-mono">€{player.marketValue.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">signHim True Valuation:</span>
                          <strong className="text-emerald-400 font-mono">€{player.signHimValue.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Leistungsprämie:</span>
                          <strong className="text-white">xG/xA Bonus & Aufstiegsprämie inkl.</strong>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-1.5 font-sans">Gehaltsstufe & Prämienmodell wählen:</label>
                        <select
                          value={salaryChoice}
                          onChange={(e) => setSalaryChoice(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-sans focus:outline-none focus:border-emerald-500"
                        >
                          <option value="15.000 € / Monat + 4.000 € Torprämie">Stufe 1: 15.000 € / Monat + 4.000 € Torprämie (Moneyball Start)</option>
                          <option value="18.500 € / Monat + 5.000 € pro Tor / Assist">Stufe 2: 18.500 € / Monat + 5.000 € pro Tor / Assist (Empfohlen)</option>
                          <option value="25.000 € / Monat Fixgehalt (Top-Performer)">Stufe 3: 25.000 € / Monat Fixgehalt (Top-Performer)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Signature Form */}
                  <form onSubmit={handleSign} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Unterschrift des Sportdirektors / Managers</h4>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Vor- und Nachname (Vollmacht Sportdirektor):</label>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Horst Heldt / Ralf Rangnick"
                        value={signName}
                        onChange={(e) => setSignName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                      />
                      <label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer">
                        Ich bestätige hiermit als bevollmächtigter Sportdirektor, dass dieser Transfer auf Basis der signHim Moneyball-Analytik (Index {player.moneyballIndex}) durchgeführt und der Vertrag rechtsverbindlich geschlossen wird.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!signName.trim() || !agreedTerms}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
                    >
                      <FileSignature className="w-5 h-5" />
                      <span>Vertrag jetzt rechtsverbindlich signieren & Spieler verpflichten</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
