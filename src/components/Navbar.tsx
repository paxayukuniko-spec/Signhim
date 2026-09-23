import React from 'react';

const PAYPAL_SUPPORT_URL = "https://www.paypal.com/donate?business=frankorthmann@web.de&currency_code=EUR";

export type TabType = 'perlen-matrix' | 'ligen-tabellen' | 'risiko-matrix' | 'fc-karten' | 'historie' | 'ticker' | 'chat' | 'fuetterung' | 'scout' | 'matrix' | 'generator' | 'league_stats' | 'comparison' | 'fut_card' | 'kicker_news' | 'pdf-report' | 'report';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const isPerlenActive = activeTab === 'perlen-matrix' || activeTab === 'scout';
  const isRisikoActive = activeTab === 'risiko-matrix' || activeTab === 'matrix';
  const isLigenActive = activeTab === 'ligen-tabellen' || activeTab === 'league_stats';
  const isFutActive = activeTab === 'fc-karten' || activeTab === 'fut_card';
  const isTickerActive = activeTab === 'ticker' || activeTab === 'kicker_news';
  const isHistorieActive = activeTab === 'historie' || activeTab === 'comparison';
  const isChatActive = activeTab === 'chat';
  const isFuetterungActive = activeTab === 'fuetterung' || activeTab === 'generator';
  const isReportActive = activeTab === 'pdf-report' || activeTab === 'report';

  return (
    <aside className="w-full h-full bg-[#162032] border-r border-[#2d3748] flex flex-col z-40 overflow-y-auto select-none">
      {/* LOGO AT THE VERY TOP */}
      <div className="p-3 border-b border-[#2d3748] bg-[#1a263e] flex flex-col items-center">
        <div className="w-full bg-white rounded-lg p-1.5 border border-[#00ffcc]/40 shadow-md mb-2 flex items-center justify-center">
          <img 
            src="/logo_signhim.jpg" 
            alt="SignHim Logo" 
            className="w-full h-20 object-contain rounded"
          />
        </div>
        <div className="flex items-center justify-between w-full mb-0.5">
          <span className="font-extrabold text-base tracking-wider font-sans">
            <span className="text-white">Sign</span><span className="text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]">Him</span>
          </span>
          <span className="bg-[#ff4444] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shadow-sm">AI</span>
        </div>
        <div className="text-[#a0aec0] text-[10px] font-medium leading-tight w-full text-left">
          Datenbasiertes Scouting (2.-5. Liga)
        </div>
      </div>

      {/* NAVIGATION GROUPS */}
      <div className="flex-1 px-3 py-4 space-y-6">
        
        {/* Analytics Group */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#718096] px-2 mb-2">
            Analytics
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('perlen-matrix')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isPerlenActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>💎</span> Perlen-Matrix
            </button>
            <button 
              onClick={() => setActiveTab('risiko-matrix')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isRisikoActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>📈</span> Risiko-Matrix
            </button>
            <button 
              onClick={() => setActiveTab('ligen-tabellen')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isLigenActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>📊</span> Ligen & Tabellen
            </button>
          </div>
        </div>

        {/* Content Group */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#718096] px-2 mb-2">
            Content
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('fc-karten')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isFutActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>🎮</span> FUT-Karten
            </button>
            <button 
              onClick={() => setActiveTab('ticker')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isTickerActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>📰</span> kicker News
            </button>
          </div>
        </div>

        {/* Archiv Group */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#718096] px-2 mb-2">
            Archiv
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('historie')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isHistorieActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>⏳</span> Historischer Vergleich
            </button>
          </div>
        </div>

        {/* Tools Group */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#718096] px-2 mb-2">
            Tools & Management
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('chat')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isChatActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>🤖</span> KI-Scout
            </button>
            <button 
              onClick={() => setActiveTab('fuetterung')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isFuetterungActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>⚙️</span> Daten-Input
            </button>
            <button 
              onClick={() => setActiveTab('pdf-report')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isReportActive 
                  ? 'bg-[#00ffcc] text-[#111a2e] font-bold shadow-md shadow-[#00ffcc]/20' 
                  : 'text-[#a0aec0] hover:bg-[#1a263e] hover:text-white'
              }`}
            >
              <span>📄</span> Report
            </button>
            <a
              href={PAYPAL_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 text-[#a0aec0] hover:bg-[#1a263e] hover:text-white"
              title="SignHim unterstützen"
            >
              <span>☕</span> Support
            </a>
          </div>
        </div>

      </div>

      {/* Footer info in sidebar */}
      <div className="p-3 border-t border-[#2d3748] text-[10px] text-[#718096] text-center font-mono">
        SignHim v2.6 • Moneyball
      </div>
    </aside>
  );
};

