import React, { useState } from 'react';

interface PlayerSilhouetteProps {
  className?: string;
  size?: number;
  playerName?: string;
  club?: string;
  imageUrl?: string;
}

const WIKIMEDIA_MAP: Record<string, string> = {
  "jannik mause": "/assets/jannik_mause.jpg",
  "christoph daferner": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Christoph_Daferner_%282021%29.jpg/300px-Christoph_Daferner_%282021%29.jpg",
  "timmy thiele": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Timmy_Thiele_%282018%29.jpg/300px-Timmy_Thiele_%282018%29.jpg",
};

const UNSPLASH_FALLBACKS = [
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=500&q=80"
];

export const PlayerSilhouette: React.FC<PlayerSilhouetteProps> = ({ 
  className = "", 
  size = 48, 
  playerName,
  club,
  imageUrl 
}) => {
  const normalizedName = playerName ? playerName.toLowerCase().trim() : "";
  const directWikiUrl = normalizedName ? WIKIMEDIA_MAP[normalizedName] : null;
  
  // Simple deterministic hash function for consistent Unsplash fallback selection per player
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  const defaultUnsplash = UNSPLASH_FALLBACKS[Math.abs(hashCode(normalizedName || "player")) % UNSPLASH_FALLBACKS.length];
  const primaryUrl = imageUrl || directWikiUrl || defaultUnsplash;

  const [currentSrc, setCurrentSrc] = useState<string>(primaryUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  return (
    <img 
      src={hasError ? defaultUnsplash : currentSrc} 
      alt={playerName || "Player"} 
      className={className}
      style={{
        height: '100%',
        width: 'auto',
        objectFit: 'contain'
      }}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(defaultUnsplash);
        }
      }}
    />
  );
};



