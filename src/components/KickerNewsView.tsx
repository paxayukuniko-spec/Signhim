import React, { useState } from 'react';
import { Newspaper, ExternalLink, Flame, TrendingUp, Trophy, ArrowUpRight, Search, Clock, Tag } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: 'Transfermarkt' | '3. Liga' | 'Regionalliga' | 'Moneyball Analytics' | 'Exklusiv';
  time: string;
  source: string;
  url: string;
  summary: string;
  readingTime: string;
  hot?: boolean;
}

const KICKER_NEWS: NewsItem[] = [
  {
    id: 'k1',
    title: 'Sensation in der Regionalliga West: Warum Zweitligisten jetzt U23-Talente von SV Rödinghausen beobachten',
    category: 'Regionalliga',
    time: 'Vor 15 Min.',
    source: 'kicker.de / Scouting-Desk',
    url: 'https://www.kicker.de',
    summary: 'Analysen zeigen: Der xG-Output von zentralen Mittelfeldspielern in der RL West übertrifft in Umschaltmomenten teilweise den Schnitt der 3. Liga. Scouts stehen Schlange.',
    readingTime: '4 Min.',
    hot: true
  },
  {
    id: 'k2',
    title: 'Moneyball im deutschen Unterhaus: Wie datenbasierte Spielerbewertung den Abstiegskampf revolutioniert',
    category: 'Moneyball Analytics',
    time: 'Vor 1 Std.',
    source: 'kicker.de / Taktik & Analyse',
    url: 'https://www.kicker.de',
    summary: 'Nicht das Budget entscheidet, sondern Pressing-Resistenz und progressive Läufe: Experten erklären die Erfolgsformel für smarte Transfers unter 150.000 € Marktwert.',
    readingTime: '6 Min.',
    hot: true
  },
  {
    id: 'k3',
    title: 'Wechselbörse 3. Liga: Top-Scorer vor Sprung in die 2. Bundesliga im Winter',
    category: 'Transfermarkt',
    time: 'Vor 3 Std.',
    source: 'kicker.de / Transferticker',
    url: 'https://www.kicker.de',
    summary: 'Flügelstürmer mit über 0.45 xA/90 im Fokus von Zweitligisten. Ablösesummen im niedrigen Sechstelligen Bereich erwartet.',
    readingTime: '3 Min.'
  },
  {
    id: 'k4',
    title: 'Regionalliga Bayern: Titelrennen spitzt sich zu – Verfolger setzt auf datengestütztes Scouting',
    category: 'Regionalliga',
    time: 'Vor 5 Std.',
    source: 'kicker.de / Regionalliga',
    url: 'https://www.kicker.de',
    summary: 'Mit innovativen Metriken und Videoanalysen finden bayerische Amateurklubs Diamanten in den Landesligen.',
    readingTime: '5 Min.'
  },
  {
    id: 'k5',
    title: 'Regionalliga Nordost: Torfestival und Rekord-Zuschauerzahlen am Wochenende',
    category: 'Regionalliga',
    time: 'Gestern',
    source: 'kicker.de / Nordost',
    url: 'https://www.kicker.de',
    summary: 'Traditionsklubs vor ausverkauftem Haus: Der Abstiegskampf und Aufstiegskampf elektrisieren die Massen.',
    readingTime: '3 Min.'
  },
  {
    id: 'k6',
    title: 'Scouting-Trend 2026: Warum physische Pressing-Daten wichtiger sind als reine Torausbeute',
    category: 'Exklusiv',
    time: 'Gestern',
    source: 'kicker.de / Exklusiv',
    url: 'https://www.kicker.de',
    summary: 'Eine kicker-Datenanalyse in Zusammenarbeit mit Profi-Scouts entschlüsselt die Schlüsselmetriken moderner Spielertypen.',
    readingTime: '7 Min.'
  }
];

export const KickerNewsView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = KICKER_NEWS.filter((item) => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 p-6 md:p-8 border border-red-900/30 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Newspaper className="w-48 h-48 text-red-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                kicker.de Integration & Ticker
              </span>
              <span className="text-xs text-slate-400">Live-News & Transfergerüchte</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Kicker Live-Scout & Transfer-Ticker
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Aktuelle Nachrichten, Hintergründe und datenbasierte Analysen rund um die 2. Bundesliga, 3. Liga und die Regionalligen direkt im Blick.
            </p>
          </div>
          <a
            href="https://www.kicker.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/25 shrink-0"
          >
            <span>Zu kicker.de öffnen</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Regionalliga', 'Transfermarkt', '3. Liga', 'Moneyball Analytics', 'Exklusiv'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Alle Berichte' : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="News & Schlagzeilen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group hover:-translate-y-1"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 font-semibold border border-red-500/20 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
              </div>

              <div className="space-y-2">
                {item.hot && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Flame className="w-3 h-3" /> Ticker-Highlight
                  </div>
                )}
                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{item.source} • {item.readingTime} Lesezeit</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                <span>Lesen</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg">Keine Artikel gefunden</h3>
          <p className="text-slate-400 text-sm mt-1">Versuchen Sie einen anderen Suchbegriff oder Filter.</p>
        </div>
      )}
    </div>
  );
};
