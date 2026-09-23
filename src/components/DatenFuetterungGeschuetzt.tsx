import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { Shield, Lock, Unlock, Upload, Database, CheckCircle2, Trash2, PlusCircle, BookOpen, Loader2, FileText, ImageIcon, Sparkles } from 'lucide-react';

interface DatenFuetterungGeschuetztProps {
    onAddPlayer: (player: Player) => void;
    setActiveTab: (tab: any) => void;
}

export default function DatenFuetterungGeschuetzt({ onAddPlayer, setActiveTab }: DatenFuetterungGeschuetztProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);
    const [customTitle, setCustomTitle] = useState('');
    const [customContent, setCustomContent] = useState('');
    const [addingNote, setAddingNote] = useState(false);
    const [loading, setLoading] = useState(false);

    // DEIN GEHEIMES MASTER-PASSWORT (Ändere "DeinSuperGeheimesPasswort123!" in dein Wunschpasswort)
    const ADMIN_PASSWORD = "DeinSuperGeheimesPasswort123!";

    // Beim Laden der Seite prüfen, ob du dich schon mal eingeloggt hast
    useEffect(() => {
        const savedAuth = localStorage.getItem('signHim_admin_auth');
        if (savedAuth === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        }
        fetchKnowledge();
    }, []);

    const fetchKnowledge = async () => {
        try {
            const res = await fetch('/api/knowledge');
            const data = await res.json();
            if (data.knowledge) {
                setKnowledgeItems(data.knowledge);
            }
        } catch (err) {
            console.error("Failed to fetch knowledge vault", err);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            localStorage.setItem('signHim_admin_auth', ADMIN_PASSWORD);
            setIsAuthenticated(true);
            setErrorMsg('');
        } else {
            setErrorMsg('❌ Falsches Admin-Passwort! Zugriff verweigert.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('signHim_admin_auth');
        setIsAuthenticated(false);
        setPasswordInput('');
    };

    const handleCsvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;
            if (!content) return;
            try {
                const res = await fetch('/api/knowledge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: `CSV Massen-Upload: ${file.name}`,
                        content: content,
                    }),
                });
                if (res.ok) {
                    await fetchKnowledge();
                    setSuccessMessage(`✓ CSV-Datei (${file.name}) erfolgreich in die KI-Wissensdatenbank eingespeichert!`);
                    setTimeout(() => setSuccessMessage(null), 4000);
                }
            } catch (err) {
                setErrorMsg('Fehler beim Speichern der CSV-Datei.');
            }
        };
        reader.readAsText(file);
    };

    const handleAddCustomNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customContent.trim()) return;
        setAddingNote(true);
        try {
            const res = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: customTitle || 'Admin Notiz / Massen-Daten', content: customContent }),
            });
            if (res.ok) {
                setCustomTitle('');
                setCustomContent('');
                await fetchKnowledge();
                setSuccessMessage("Wissen erfolgreich in die permanente KI-Datenbank eingespeichert!");
                setTimeout(() => setSuccessMessage(null), 4000);
            }
        } catch (err) {
            setErrorMsg("Fehler beim Speichern in die Wissensdatenbank.");
        } finally {
            setAddingNote(false);
        }
    };

    const handleDeleteKnowledge = async (id: string) => {
        try {
            await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
            await fetchKnowledge();
        } catch (err) {
            console.error("Failed to delete knowledge item", err);
        }
    };

    // ─── 1. ANSICHT FÜR FREMDE (GESPERRT) ───
    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto my-12 bg-slate-900 border border-red-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Lock className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-white mb-2">Geschützter Admin-Bereich</h2>
                    <p className="text-xs text-slate-400">
                        Die Daten-Fütterung ist exklusiv für den signHim-Entwickler reserviert.
                    </p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Admin-Passwort eingeben..." 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 text-center focus:outline-none focus:border-red-500"
                    />
                    <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/30">
                        Einloggen & Freischalten
                    </button>
                </form>
                {errorMsg && <p className="text-red-400 text-xs font-mono">{errorMsg}</p>}
            </div>
        );
    }

    // ─── 2. ANSICHT FÜR DICH (FREIGESCHALTET) ───
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                            <Unlock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                                <span>Automatische Massen-Datenfütterung (Admin-Modus)</span>
                                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-mono border border-emerald-500/30">Freigeschaltet</span>
                            </h2>
                            <p className="text-xs text-emerald-300">🔓 Willkommen zurück! Deine KI-Schnittstelle ist bereit für neue Daten.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
                    >
                        Sperren (Logout)
                    </button>
                </div>
                
                {/* CSV Upload Dropzone */}
                <div className="border-2 border-dashed border-emerald-500/60 p-8 sm:p-10 rounded-2xl text-center bg-slate-950/80 cursor-pointer hover:bg-slate-950 transition-all">
                    <input type="file" accept=".csv,text/csv" onChange={handleCsvFileUpload} className="hidden" id="csv-upload-admin" />
                    <label htmlFor="csv-upload-admin" className="cursor-pointer block space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Klicke hier oder ziehe deine CSV-Datei hinein</p>
                            <p className="text-xs text-slate-400 mt-1">Erwartete Spalten: Name, Verein, Spiele, Tore, Vorlagen, xG, Alter</p>
                        </div>
                    </label>
                </div>

                {successMessage && (
                    <div className="mt-4 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Stored Knowledge Items */}
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>Gespeicherte Wissens-Einheiten ({knowledgeItems.length})</span>
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {knowledgeItems.map((item) => (
                            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-white font-mono">{item.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                                        <button onClick={() => handleDeleteKnowledge(item.id)} className="text-slate-500 hover:text-red-400 cursor-pointer">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-3 text-[11px] font-mono text-slate-300 max-h-28 overflow-y-auto">
                                    {item.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
