import React, { useState } from 'react';

const CLUB_BADGES: Record<string, string> = {
  "Hamburger SV": "https://upload.wikimedia.org/wikipedia/commons/6/66/Hamburger_SV_Logo.svg",
  "1. FC Köln": "https://upload.wikimedia.org/wikipedia/commons/5/53/1._FC_K%C3%B6ln_Logo.svg",
  "FC Schalke 04": "https://upload.wikimedia.org/wikipedia/commons/6/6d/FC_Schalke_04_Logo.svg",
  "Hertha BSC": "https://upload.wikimedia.org/wikipedia/commons/8/81/Hertha_BSC_Logo_2012.svg",
  "Fortuna Düsseldorf": "https://upload.wikimedia.org/wikipedia/commons/9/94/Fortuna_D%C3%BCsseldorf_Logo.svg",
  "Hannover 96": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Hannover_96_Logo.svg",
  "1. FC Kaiserslautern": "https://upload.wikimedia.org/wikipedia/commons/7/7b/1._FC_Kaiserslautern_Logo.svg",
  "Karlsruher SC": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Karlsruher_SC_Logo.svg",
  "1. FC Nürnberg": "https://upload.wikimedia.org/wikipedia/commons/f/f3/1._FC_N%C3%BCrnberg_Logo.svg",
  "SC Paderborn 07": "https://upload.wikimedia.org/wikipedia/commons/1/1a/SC_Paderborn_07_Logo.svg",
  "SpVgg Greuther Fürth": "https://upload.wikimedia.org/wikipedia/commons/d/d4/SpVgg_Greuther_F%C3%BCrth_Logo.svg",
  "Eintracht Braunschweig": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Eintracht_Braunschweig_Logo.svg",
  "SSV Ulm 1846": "https://upload.wikimedia.org/wikipedia/commons/a/a2/SSV_Ulm_1846_Logo.svg",
  "SV Elversberg": "https://upload.wikimedia.org/wikipedia/commons/2/22/SV_07_Elversberg_Logo.svg",
  "Preußen Münster": "https://upload.wikimedia.org/wikipedia/commons/5/50/SC_Preu%C3%9Fen_M%C3%BCnster_Logo.svg",
  "Jahn Regensburg": "https://upload.wikimedia.org/wikipedia/commons/9/9c/SSV_Jahn_Regensburg_Logo.svg",
  "Dynamo Dresden": "https://upload.wikimedia.org/wikipedia/commons/1/1a/SG_Dynamo_Dresden_Logo.svg",
  "Arminia Bielefeld": "https://upload.wikimedia.org/wikipedia/commons/b/b8/DSC_Arminia_Bielefeld_Logo.svg",
  "Energie Cottbus": "https://upload.wikimedia.org/wikipedia/commons/a/a5/FC_Energie_Cottbus_Logo.svg",
  "Hansa Rostock": "https://upload.wikimedia.org/wikipedia/commons/c/c4/F.C._Hansa_Rostock_Logo.svg",
  "Rot-Weiss Essen": "https://upload.wikimedia.org/wikipedia/commons/2/27/Rot-Weiss_Essen_Logo.svg",
  "TSV 1860 München": "https://upload.wikimedia.org/wikipedia/commons/7/7c/TSV_1860_M%C3%BCnchen.svg",
  "Erzgebirge Aue": "https://upload.wikimedia.org/wikipedia/commons/7/72/FC_Erzgebirge_Aue_Logo.svg",
  "Alemannia Aachen": "https://upload.wikimedia.org/wikipedia/commons/3/36/Alemannia_Aachen_Logo.svg",
  "Rot-Weiß Oberhausen": "https://upload.wikimedia.org/wikipedia/commons/9/91/Rot-Weiß_Oberhausen_Logo.svg",
  "FC Gütersloh": "https://upload.wikimedia.org/wikipedia/commons/e/e9/FC_G%C3%BCtersloh_Logo.svg",
  "BFC Dynamo": "https://upload.wikimedia.org/wikipedia/commons/7/70/BFC_Dynamo_Logo.svg",
  "Chemnitzer FC": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Chemnitzer_FC_Logo.svg",
  "Greifswalder FC": "https://upload.wikimedia.org/wikipedia/commons/2/29/Greifswalder_FC_Logo.svg",
  "Hallescher FC": "https://upload.wikimedia.org/wikipedia/commons/7/70/Hallescher_FC_Logo.svg",
  "DJK Vilzing": "https://upload.wikimedia.org/wikipedia/commons/3/3a/DJK_Vilzing_Logo.svg",
  "FC Memmingen": "https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Memmingen_Logo.svg",
  "FV Illertissen": "https://upload.wikimedia.org/wikipedia/commons/6/68/FV_Illertissen_Logo.svg",
  "SpVgg Unterhaching": "https://upload.wikimedia.org/wikipedia/commons/4/4e/SpVgg_Unterhaching_Logo.svg",
  "Kickers Offenbach": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Kickers_Offenbach_Logo.svg",
  "Stuttgarter Kickers": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Stuttgarter_Kickers_Logo.svg",
  "SV Rödinghausen": "https://upload.wikimedia.org/wikipedia/commons/1/1a/SV_R%C3%B6dinghausen_Logo.svg",
  "TSV Havelse": "https://upload.wikimedia.org/wikipedia/commons/1/1a/TSV_Havelse_Logo.svg",
  "FC 08 Villingen": "https://upload.wikimedia.org/wikipedia/commons/7/70/FC_08_Villingen_Logo.svg",
  "FC Rot-Weiß Erfurt": "https://upload.wikimedia.org/wikipedia/commons/e/e3/FC_Rot-Wei%C3%9F_Erfurt_Logo.svg",
  "SV Sandhausen": "https://upload.wikimedia.org/wikipedia/commons/6/67/SV_Sandhausen_Logo.svg",
  "1. FC Saarbrücken": "https://upload.wikimedia.org/wikipedia/commons/e/e0/1._FC_Saarbr%C3%BCcken_Logo.svg"
};

export function getClubBadgeUrl(clubName: string): string {
  if (!clubName) return "";
  if (CLUB_BADGES[clubName]) return CLUB_BADGES[clubName];
  for (const [key, url] of Object.entries(CLUB_BADGES)) {
    if (clubName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clubName.toLowerCase())) {
      return url;
    }
  }
  return "";
}

interface ClubBadgeProps {
  clubName: string;
  className?: string;
}

export const ClubBadge: React.FC<ClubBadgeProps> = ({ clubName, className = "h-6 w-6 object-contain" }) => {
  const [imgError, setImgError] = useState(false);
  const badgeUrl = getClubBadgeUrl(clubName);

  if (!badgeUrl || imgError) {
    return React.createElement(
      'div',
      { className: `rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-[10px] uppercase font-mono shrink-0 ${className}` },
      clubName ? clubName.substring(0, 2) : "FC"
    );
  }

  return React.createElement('img', {
    src: badgeUrl,
    alt: clubName,
    className: className,
    onError: () => setImgError(true),
    referrerPolicy: "no-referrer"
  });
};
