import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Player } from '../types';
import { Bot, Send, Sparkles, User, Loader2, Target } from 'lucide-react';
import { PlayStationMoneyballCard } from './PlayStationMoneyballCard';

interface AiScoutChatProps {
  onSelectPlayer?: (player: Player) => void;
}

export const AiScoutChat: React.FC<AiScoutChatProps> = ({ onSelectPlayer }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hallo Sportdirektor! Ich bin das Herzstück von **signHim**. Als dein leitender Moneyball-Scout analysiere ich Spielerdaten aus den deutschen Ligen (2. bis 5. Liga). Du kannst Befehle wie `[GENERATION_REGIONAL_BAYERN]`, `[GENERATION_REGIONAL_NORDOST]`, `[GENERATION_REGIONAL_SUEDWEST]` oder `[GENERATION_REGIONAL_WEST]` eingeben, um automatisch Spieler aus der Wissensdatenbank zu generieren und als PlayStation Moneyball Cards anzuzeigen!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/scout/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Keine Antwort erhalten.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        players: data.players || undefined,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Verbindungsfehler zum signHim Server. Bitte versuche es erneut.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "[GENERATION_REGIONAL_BAYERN]",
    "[GENERATION_REGIONAL_NORDOST]",
    "[GENERATION_REGIONAL_SUEDWEST]",
    "[GENERATION_REGIONAL_WEST]",
    "[GENERATION_PLAYERS_GERMANY]",
    "Finde einen abschlussstarken Stürmer in der 3. Liga unter 250k €",
    "Welcher Regionalliga-Mittelfeldspieler hat die beste Passquote?"
  ];

  return (
    <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>signHim AI Core (Kicker Ground Truth Generator)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-400">Automatische Moneyball-Kartengenerierung & Scouting-Chat</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">Gemini 3.6 Flash</div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'user'
                  ? 'bg-slate-700 text-white'
                  : 'bg-emerald-500 text-slate-950 font-bold'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none w-full'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Render PlayStationMoneyballCard components if players array is attached */}
              {m.players && m.players.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                  {m.players.map((player) => (
                    <PlayStationMoneyballCard
                      key={player.id}
                      player={player}
                      onSelect={(p) => onSelectPlayer && onSelectPlayer(p)}
                    />
                  ))}
                </div>
              )}

              <div
                className={`text-[10px] mt-3 font-mono ${
                  m.role === 'user' ? 'text-emerald-200 text-right' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Extrahiere aus Kicker Ground Truth Speicher & berechne OVR, EFF, TOR, PAS, PHYS, POT...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800 flex gap-2 overflow-x-auto">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-lg text-xs font-mono whitespace-nowrap transition-colors border border-emerald-500/30 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-slate-950 p-4 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          placeholder="Gib z.B. [GENERATION_REGIONAL_BAYERN] oder [GENERATION_REGIONAL_NORDOST] ein..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <span>Senden</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
