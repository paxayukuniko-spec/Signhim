import React from 'react';
import { Player } from '../types';
import { calculateMoneyballRatings } from '../utils/moneyballRatings';
import { PlayerSilhouette } from './PlayerSilhouette';
import { getClubBadgeUrl } from '../utils/clubBadges';

interface PlayStationMoneyballCardProps {
  player?: Player;
  onSelect?: (player: Player) => void;
}

export const PlayStationMoneyballCard: React.FC<PlayStationMoneyballCardProps> = ({ player, onSelect }) => {
  const p = player || {
    id: 'kania-featured',
    name: 'J. Kania',
    club: "1. FC Nürnberg II ('23/24)",
    league: 'Regionalliga Bayern',
    position: 'MS',
    age: 21,
    marketValue: 50000,
    moneyballIndex: 8.8,
    stats: {
      goals: 18,
      assists: 4,
      appearances: 33,
      xgPer90: 0.85,
      xaPer90: 0.35,
      passCompletion: 78,
      progressiveCarries: 4.2,
      duelsWonPct: 74,
      pressuresPer90: 18.5
    }
  };

  const rawStats = {
    matches: p.stats.appearances || 33,
    goals: p.stats.goals || 15,
    assists: p.stats.assists || 4,
    xG: (p.stats.xgPer90 || 0.5) * (p.stats.appearances || 33),
    age: p.age || 22,
    duelsWonPercentage: p.stats.duelsWonPct || 60,
    passingAccuracy: p.stats.passCompletion || 75
  };

  const ratings = calculateMoneyballRatings(rawStats);
  const spieler = {
    name: p.name,
    club: p.club,
    league: p.league,
    age: p.age,
    ovr: ratings.ovr,
    pot: ratings.pot,
    stats: {
      tor: ratings.tor,
      eff: ratings.eff,
      pas: ratings.pas,
      xg: ratings.xg,
      phys: ratings.phys,
      pot: ratings.pot
    }
  };

  const clubBadge = getClubBadgeUrl(p.club);

  const handlePdfExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById(`card-container-${spieler.name.replace(/\s+/g, '-')}`);
    
    const options = {
      margin:       10,
      filename:     `signHim_Scouting_${spieler.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, backgroundColor: '#030712' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (typeof html2pdf !== 'undefined') {
      // @ts-ignore
      html2pdf().set(options).from(element).save();
    } else {
      alert("html2pdf-Bibliothek wird geladen...");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      
      {/* DER EXPORT-BEREICH */}
      <div 
        id={`card-container-${spieler.name.replace(/\s+/g, '-')}`} 
        onClick={() => onSelect && onSelect(p as Player)}
        className="cursor-pointer transition-all duration-300"
        style={{
          background: '#030712',
          padding: '20px',
          borderRadius: '20px',
          border: '1px solid #1e293b',
          width: '300px',
          fontFamily: 'sans-serif',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
        }}
      >
        
        {/* Offizieller Dokumenten-Kopf */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,229,255,0.2)', paddingBottom: '8px', marginBottom: '15px' }}>
          <span style={{ fontSize: '10px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>signHim SCOUTING REPORT</span>
          <span style={{ fontSize: '9px', color: '#94a3b8' }}>{new Date().toLocaleDateString('de-DE')}</span>
        </div>

        {/* DER FUT-KARTEN-SCHILD */}
        <div className="fut-card">
          
          {/* Oben links: Rating und Position */}
          <div className="fut-badge">
            <div className="fut-rating">{spieler.ovr}</div>
            <div className="fut-position">{p.position || 'MS'}</div>
          </div>

          {/* Oben Rechts: Club Wappen */}
          <div style={{ position: 'absolute', top: '25px', right: '25px', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', border: '1px solid rgba(0,229,255,0.3)', overflow: 'hidden' }}>
            {clubBadge ? (
              <img src={clubBadge} alt={p.club} style={{ width: '20px', height: '20px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
            ) : (
              <span style={{ fontSize: '10px', color: '#00e5ff', fontWeight: 'bold' }}>FC</span>
            )}
          </div>

          {/* Großes Spielerbild in eigener Box */}
          <div className="player-image-box">
            <PlayerSilhouette playerName={p.name} club={p.club} size={140} />
          </div>

          {/* Spielername im FUT-Style */}
          <div className="fut-player-name">{spieler.name}</div>

          {/* Die 6 Kern-Attribute */}
          <div className="fut-stats-grid">
            <div className="stat-item"><span className="stat-value">{spieler.stats.eff}</span><span className="stat-label">EFF</span></div>
            <div className="stat-item"><span className="stat-value">{spieler.stats.tor}</span><span className="stat-label">TOR</span></div>
            <div className="stat-item"><span className="stat-value">{spieler.stats.pas}</span><span className="stat-label">PAS</span></div>
            <div className="stat-item"><span className="stat-value">{spieler.stats.xg}</span><span className="stat-label">XG</span></div>
            <div className="stat-item"><span className="stat-value">{spieler.stats.phys}</span><span className="stat-label">PHYS</span></div>
            <div className="stat-item"><span className="stat-value">{spieler.stats.pot}</span><span className="stat-label">POT</span></div>
          </div>
        </div>

        {/* Info-Text unter der Karte */}
        <div style={{ marginTop: '12px', background: '#0f172a', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.4', border: '1px solid #1e293b' }}>
          <strong>KI-Analyse:</strong> Überdurchschnittlicher Effizienz-Index in den unteren Ligen. Hohes Wertsteigerungs-Potenzial identifiziert.
        </div>
      </div>

      {/* DOWNLOAD-BUTTON */}
      <button 
        onClick={handlePdfExport}
        style={{
          background: 'rgba(0, 229, 255, 0.1)',
          color: '#00e5ff',
          border: '1px solid #00e5ff',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          width: '300px'
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#00e5ff'; e.currentTarget.style.color = '#030712'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'; e.currentTarget.style.color = '#00e5ff'; }}
      >
        📥 PDF Scouting-Blatt downloaden
      </button>

    </div>
  );
};


