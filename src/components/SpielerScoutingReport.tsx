import React, { useState } from 'react';
import { Player } from '../types';
import { Download, FileText, CheckCircle2, Award, TrendingUp, Sparkles } from 'lucide-react';

interface SpielerScoutingReportProps {
  players: Player[];
}

export const SpielerScoutingReport: React.FC<SpielerScoutingReportProps> = ({ players }) => {
  // Default to Jannik Mause if available, or first player
  const defaultPlayer = players.find(p => p.name.toLowerCase().includes('jannik mause')) || players[0];
  const [selectedId, setSelectedId] = useState<string>(defaultPlayer?.id || '');

  const currentPlayer = players.find(p => p.id === selectedId) || defaultPlayer;

  // Fallback data if no players loaded yet
  const spielerData = currentPlayer ? {
    name: currentPlayer.name,
    club: currentPlayer.club,
    league: currentPlayer.league || '3. Liga',
    age: currentPlayer.age,
    ovr: Math.round(currentPlayer.moneyballIndex || 75),
    pot: 99,
    stats: {
      tor: Math.round(Math.min(99, (currentPlayer.stats?.goals || 15) * 4.5 + 20)),
      eff: Math.round(currentPlayer.stats?.xgPer90 ? currentPlayer.stats.xgPer90 * 85 + 40 : 88),
      pas: Math.round(currentPlayer.stats?.passCompletion || 74),
      xg: Math.round((currentPlayer.stats?.xgPer90 || 0.6) * 100),
      phys: Math.round(currentPlayer.stats?.duelsWonPct || 78)
    },
    scoutSummary: currentPlayer.scoutSummary || "Der Spieler zeigt im mathematischen Modell eine extreme Überperformance im Abschlussbereich. Seine Torgefahr im Verhältnis zu den erwarteten Toren (xG) macht ihn zu einer hocheffizienten Verpflichtung für Vereine, die maximale Torausbeute bei minimalem finanziellem Risiko suchen."
  } : {
    name: "Jannik Mause",
    club: "FC Ingolstadt",
    league: "3. Liga ('23/24)",
    age: 25,
    ovr: 75,
    pot: 99,
    stats: { tor: 92, eff: 88, pas: 74, xg: 85, phys: 78 },
    scoutSummary: "Der Spieler zeigt im mathematischen Modell eine extreme Überperformance im Abschlussbereich..."
  };

  const exportiereAlsPDF = () => {
    const element = document.getElementById('scouting-pdf-content');
    if (!element) return;

    const options = {
      margin: 10,
      filename: `Moneyball_Scouting_${spielerData.name.replace(/\s+/g, "_")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#111a2e' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (typeof html2pdf !== 'undefined') {
      // @ts-ignore
      html2pdf().set(options).from(element).save();
    } else {
      alert('PDF-Bibliothek lädt noch oder nicht verfügbar. Bitte versuchen Sie es in wenigen Sekunden erneut.');
    }
  };

    return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top bar with player selector and export button */}
      <div className="bg-[#1a263e] border border-[#2d3748] rounded-2xl p-6 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#00ffcc] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00ffcc]" /> <span className="font-extrabold text-white">Sign</span><span className="font-extrabold text-[#00ffcc]">Him</span> Professional PDF Report Generator
          </div>
          <h2 className="text-xl font-bold text-white">Wählen Sie einen Spieler für den Report</h2>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-[#111a2e] border border-[#2d3748] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#00ffcc] transition-colors flex-grow md:w-64"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.club} - {p.league})
              </option>
            ))}
          </select>

          <button 
            onClick={exportiereAlsPDF} 
            className="bg-[#00ffcc] hover:bg-[#00ddbb] text-[#111a2e] border-none px-5 py-2.5 rounded-xl font-bold cursor-pointer shadow-lg shadow-[#00ffcc]/25 text-sm flex items-center gap-2 whitespace-nowrap transition-all"
          >
            <Download className="w-4 h-4" /> PDF generieren
          </button>
        </div>
      </div>

      {/* DIESER BEREICH WIRD IN DAS PDF GEDRUCKT */}
      <div id="scouting-pdf-content" style={{
        background: '#111a2e',
        color: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #2d3748',
        fontFamily: 'sans-serif',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* PDF-Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #00ffcc', paddingBottom: '15px', marginBottom: '25px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#00ffcc', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              signHim <span style={{fontSize: '11px', background: '#ff4444', color: '#fff', padding: '2px 6px', borderRadius: '4px'}}>MONEYBALL AI</span>
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#a0aec0', fontSize: '12px' }}>Offizielles KI-Scouting-Datenblatt // Unterhaus-Analyse & Hidden Gems</p>
          </div>
          <div style={{ textAlign: 'right', color: '#718096', fontSize: '11px' }}>
            Generiert am: {new Date().toLocaleDateString('de-DE')}
          </div>
        </div>

        {/* Hauptinhalt: Links die FUT-Karte, rechts die harten Fakten */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'start', flexWrap: 'wrap' }}>
          
          {/* Miniatur deiner PlayStation-Karte fürs Dokument */}
          <div style={{
            background: 'linear-gradient(135deg, #111a2e 0%, #1a263e 50%, #00ffcc 100%)',
            width: '200px',
            height: '300px',
            borderRadius: '12px',
            padding: '2px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            flexShrink: 0
          }}>
            <div style={{ background: '#111a2e', width: '100%', height: '100%', borderRadius: '10px', padding: '15px', boxSizing: 'border-box', position: 'relative' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ffcc', display: 'block' }}>{spielerData.ovr}</span>
              <span style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 'bold' }}>{currentPlayer?.position || 'ST'}</span>
              <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{spielerData.name}</div>
              <div style={{ textAlign: 'center', fontSize: '10px', color: '#a0aec0', marginBottom: '15px' }}>{spielerData.club}</div>
              <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #00ffcc, transparent)', margin: '10px 0' }}></div>
              <div style={{ fontSize: '11px', color: '#a0aec0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                <div>EFF: <span style={{color: '#00ffcc', fontWeight: 'bold'}}>{spielerData.stats.eff}</span></div>
                <div>TOR: <span style={{color: '#00ffcc', fontWeight: 'bold'}}>{spielerData.stats.tor}</span></div>
                <div>PAS: <span style={{color: '#00ffcc', fontWeight: 'bold'}}>{spielerData.stats.pas}</span></div>
                <div>XG: <span style={{color: '#00ffcc', fontWeight: 'bold'}}>{spielerData.stats.xg}</span></div>
              </div>
              <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', textAlign: 'center', background: 'rgba(0,255,204,0.1)', padding: '4px', borderRadius: '4px', fontSize: '11px', color: '#00ffcc', fontWeight: 'bold' }}>
                POT: {spielerData.pot} 🔥
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Detailanalyse für den Sportdirektor */}
          <div style={{ flexGrow: 1, minWidth: '280px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '22px' }}>{spielerData.name}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <td style={{ padding: '8px 0', color: '#a0aec0' }}>Basis-Verein & Liga:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{spielerData.club} ({spielerData.league})</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <td style={{ padding: '8px 0', color: '#a0aec0' }}>Alter:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{spielerData.age} Jahre</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <td style={{ padding: '8px 0', color: '#a0aec0' }}>Marktwert (geschätzt):</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#00ffcc' }}>
                    {currentPlayer?.marketValue ? `${currentPlayer.marketValue.toLocaleString()} €` : '~250.000 €'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <td style={{ padding: '8px 0', color: '#a0aec0' }}>Moneyball Effizienz-Index:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#00ffcc' }}>A+ Premium-Perle</td>
                </tr>
              </tbody>
            </table>

            <div style={{ background: '#1a263e', padding: '15px', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#00ffcc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💡 KI-Scout Empfehlung:
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0', lineHeight: '1.6' }}>
                {spielerData.scoutSummary} 
                <strong style={{ color: '#ffffff' }}> Absolute Kaufempfehlung für untere Profiligen.</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Fußzeile des PDFs */}
        <div style={{ borderTop: '1px solid #2d3748', marginTop: '40px', paddingTop: '15px', textAlign: 'center', fontSize: '11px', color: '#718096' }}>
          signHim - Deine Intuition sucht Stars. Unser Algorithmus findet Gewinner. (www.signhim.ai)
        </div>

      </div>
    </div>
  );
};
