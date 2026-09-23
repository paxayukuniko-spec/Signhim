import React, { useState, useEffect } from 'react';
import { Player } from './types';
import { Navbar, TabType } from './components/Navbar';
import { PlayerCard } from './components/PlayerCard';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { AiScoutChat } from './components/AiScoutChat';
import DatenFuetterungGeschuetzt from './components/DatenFuetterungGeschuetzt';
import { RiskMatrixView } from './components/RiskMatrixView';
import { LeagueStatsView } from './components/LeagueStatsView';
import { PearlMatrixView } from './components/PearlMatrixView';
import { MoneyballComparisonView } from './components/MoneyballComparisonView';
import { FutCardGallery } from './components/FutCardGallery';
import { KickerNewsView } from './components/KickerNewsView';
import { SpielerScoutingReport } from './components/SpielerScoutingReport';
import { KpiDashboard } from './components/KpiDashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('perlen-matrix');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeLiga, setActiveLiga] = useState<string>('3_liga');

  // Fetch initial players from server
  useEffect(() => {
    fetch('/api/scout/players')
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Fehler beim Laden der Spielerdaten.');
        setLoading(false);
      });
  }, []);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers((prev) => [newPlayer, ...prev]);
    setActiveTab('perlen-matrix');
  };

  const handleSignContract = (player: Player, signatureName: string, salary: string) => {
    const updatedPlayers = players.map((p) => {
      if (p.id === player.id) {
        return {
          ...p,
          signed: true,
          signedAt: new Date().toLocaleDateString('de-DE'),
          signedByClub: signatureName,
          salary,
        };
      }
      return p;
    });
    setPlayers(updatedPlayers);
    if (selectedPlayer && selectedPlayer.id === player.id) {
      setSelectedPlayer({
        ...selectedPlayer,
        signed: true,
        signedAt: new Date().toLocaleDateString('de-DE'),
        signedByClub: signatureName,
        salary,
      });
    }
  };

  return (
    <div className="app-layout bg-[#111a2e] text-white font-sans">
      {/* Vertical Sidebar Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
      {/* NEUER_SPIELER_CHECK Notification Banner */}
      <div className="max-w-7xl mx-auto px-0 pt-1 pb-1 space-y-2">
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs shrink-0">
              ✓
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                [NEUER_SPIELER_CHECK] erfolgreich verifiziert
              </div>
              <div className="text-xs font-bold text-white">
                Jannik Mause <span className="text-[11px] font-normal text-slate-300">(FC Ingolstadt • 3. Liga • ~250.000 € Marktwert damals)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const found = players.find(p => p.name.toLowerCase().includes('jannik mause'));
              if (found) {
                setSelectedPlayer(found);
              } else {
                setActiveTab('historie');
              }
            }}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            Dossier & Vergleich öffnen
          </button>
        </div>

        {/* Regionalliga Bayern Top 5 Stürmer Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-emerald-950/80 border border-cyan-500/50 rounded-xl p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0">
              ★
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                [WISSENSINHALT] Regionalliga Bayern 2026/27 • Top 5 Stürmer
              </div>
              <div className="text-xs font-bold text-white">
                F. Schwaninger, A. Jünger, T. Stoßberger, M. Eberwein, J. Krupa <span className="text-[11px] font-normal text-slate-300">(Kicker Ground Truth)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('fc-karten');
            }}
            className="px-3 py-1.5 bg-[#00ffcc] hover:bg-[#00ddbb] text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer shadow-md shadow-[#00ffcc]/20 whitespace-nowrap"
          >
            Top 5 Moneyball-Karten öffnen
          </button>
        </div>
      </div>

      {/* JAMIE VARDY SLOGAN */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        padding: '8px 0',
        margin: '10px 0 14px 0',
        background: 'linear-gradient(90deg, transparent, rgba(0, 255, 204, 0.04), transparent)',
        borderTop: '1px solid rgba(45, 55, 72, 0.4)',
        borderBottom: '1px solid rgba(45, 55, 72, 0.4)'
      }}>
        <p style={{
          margin: 0,
          fontSize: '13px',
          letterSpacing: '0.6px',
          color: '#a0aec0',
          fontWeight: 500,
          lineHeight: '1.4'
        }}>
          Deine Intuition sucht Stars. <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Unser Algorithmus findet Gewinner</span> ...oder vielleicht <span style={{ 
            color: '#00ffcc', 
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 204, 0.4)'
          }}>den nächsten Jamie Vardy.</span>
        </p>
      </div>

      {/* KPI DASHBOARD */}
      <KpiDashboard />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
          <p className="text-sm text-slate-400 font-mono">Lade Moneyball-Algorithmus & Kader-Datenbank (2.-5. Liga)...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-950/40 border border-red-900 rounded-2xl text-center text-red-300 text-sm">
          {error}
        </div>
      ) : (
        <main style={{ background: '#1a263e', borderRadius: '10px', padding: '20px', border: '1px solid #2d3748' }}>
          {(activeTab === 'perlen-matrix' || activeTab === 'scout') && (
            <PearlMatrixView players={players} onSelectPlayer={setSelectedPlayer} activeLiga={activeLiga} setActiveLiga={setActiveLiga} />
          )}

          {(activeTab === 'ligen-tabellen' || activeTab === 'league_stats') && (
            <LeagueStatsView players={players} onSelectPlayer={setSelectedPlayer} activeLiga={activeLiga} setActiveLiga={setActiveLiga} />
          )}

          {(activeTab === 'risiko-matrix' || activeTab === 'matrix') && (
            <RiskMatrixView players={players} onSelectPlayer={setSelectedPlayer} activeLiga={activeLiga} setActiveLiga={setActiveLiga} />
          )}

          {activeTab === 'chat' && <AiScoutChat />}

          {(activeTab === 'historie' || activeTab === 'comparison') && <MoneyballComparisonView />}

          {(activeTab === 'fc-karten' || activeTab === 'fut_card') && (
            <FutCardGallery players={players} onSelectPlayer={setSelectedPlayer} activeLiga={activeLiga} setActiveLiga={setActiveLiga} />
          )}

          {(activeTab === 'ticker' || activeTab === 'kicker_news') && <KickerNewsView />}

          {(activeTab === 'fuetterung' || activeTab === 'generator') && (
            <DatenFuetterungGeschuetzt onAddPlayer={handleAddPlayer} setActiveTab={(t) => setActiveTab(t as TabType)} />
          )}

          {(activeTab === 'pdf-report' || activeTab === 'report') && (
            <SpielerScoutingReport players={players} />
          )}
        </main>
      )}

      {/* Player Detail & Contract Signing Modal */}
      <PlayerDetailModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onSignContract={handleSignContract}
      />
      </div>
    </div>
  );
}


