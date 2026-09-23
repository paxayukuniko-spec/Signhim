import React from 'react';
import { Player } from '../types';
import { Sparkles } from 'lucide-react';
import { PlayerSilhouette } from './PlayerSilhouette';
import { getClubBadgeUrl } from '../utils/clubBadges';

interface ScoutingCardProps {
  player: Player;
  onSelect?: (player: Player) => void;
}

export const ScoutingCard: React.FC<ScoutingCardProps> = ({ player, onSelect }) => {
  const overallRating = Math.min(94, Math.max(72, Math.round(player.moneyballIndex * 9.5)));
  const stats = player.stats;
  
  const futStats = [
    { label: 'EFF', val: Math.min(99, Math.round(player.moneyballIndex * 10)) },
    { label: 'TOR', val: Math.min(99, Math.round((stats.goals || 5) * 4)) },
    { label: 'PAS', val: stats.passCompletion || 75 },
    { label: 'XG', val: Math.min(99, Math.round((stats.xgPer90 || 0.3) * 100)) },
    { label: 'PHYS', val: Math.min(99, Math.round((stats.duelsWonPct || 60) * 1.1)) },
    { label: 'POT', val: Math.min(99, overallRating + 4) },
  ];

  const clubBadge = getClubBadgeUrl(player.club);

  return (
    <div 
      onClick={() => onSelect && onSelect(player)}
      className="cursor-pointer transition-transform duration-300 hover:scale-105 flex flex-col items-center select-none"
    >
      <div className="fut-card">
        
        {/* Oben links: Rating und Position */}
        <div className="fut-badge">
          <div className="fut-rating">{overallRating}</div>
          <div className="fut-position">{player.position || 'MS'}</div>
        </div>

        {/* Oben Rechts: Club Wappen */}
        <div style={{ position: 'absolute', top: '25px', right: '25px', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', border: '1px solid rgba(0,229,255,0.3)', overflow: 'hidden' }}>
          {clubBadge ? (
            <img src={clubBadge} alt={player.club} style={{ width: '20px', height: '20px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
          ) : (
            <span style={{ fontSize: '10px', color: '#00e5ff', fontWeight: 'bold' }}>FC</span>
          )}
        </div>

        {/* Großes Spielerbild in eigener Box */}
        <div className="player-image-box">
          <PlayerSilhouette playerName={player.name} club={player.club} size={140} />
        </div>

        {/* Spielername im FUT-Style */}
        <div className="fut-player-name">{player.name}</div>

        {/* Die 6 Kern-Attribute im Grid */}
        <div className="fut-stats-grid">
          <div className="stat-item"><span className="stat-value">{futStats[0].val}</span><span className="stat-label">{futStats[0].label}</span></div>
          <div className="stat-item"><span className="stat-value">{futStats[1].val}</span><span className="stat-label">{futStats[1].label}</span></div>
          <div className="stat-item"><span className="stat-value">{futStats[2].val}</span><span className="stat-label">{futStats[2].label}</span></div>
          <div className="stat-item"><span className="stat-value">{futStats[3].val}</span><span className="stat-label">{futStats[3].label}</span></div>
          <div className="stat-item"><span className="stat-value">{futStats[4].val}</span><span className="stat-label">{futStats[4].label}</span></div>
          <div className="stat-item"><span className="stat-value">{futStats[5].val}</span><span className="stat-label">{futStats[5].label}</span></div>
        </div>
      </div>
    </div>
  );
};

