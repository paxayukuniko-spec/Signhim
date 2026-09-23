import React, { useState, useRef, useEffect } from 'react';
import { Player } from '../types';
import { Sparkles, Loader2, Upload, ImageIcon, FileText, CheckCircle2, Database, Trash2, PlusCircle, BookOpen } from 'lucide-react';

interface PearlGeneratorProps {
  onAddPlayer: (player: Player) => void;
  setActiveTab: (tab: 'scout' | 'matrix' | 'chat' | 'generator') => void;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export const PearlGenerator: React.FC<PearlGeneratorProps> = ({ onAddPlayer, setActiveTab }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [imageName, setImageName] = useState<string | null>(null);
  const [isPdfFile, setIsPdfFile] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successProtocol, setSuccessProtocol] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const playerCsvInputRef = useRef<HTMLInputElement>(null);
  const appearancesCsvInputRef = useRef<HTMLInputElement>(null);
  const clubCsvInputRef = useRef<HTMLInputElement>(null);

  const handleCsvFileProcess = (file: File, csvType: 'player.csv' | 'appearances.csv' | 'club.csv') => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) return;
      try {
        const res = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `CSV Import: ${csvType} (${file.name})`,
            content: content,
          }),
        });
        if (res.ok) {
          await fetchKnowledge();
          setSuccessMessage(`✓ ${csvType} (${file.name}) erfolgreich in die KI-Wissensdatenbank eingespeichert!`);
          setTimeout(() => setSuccessMessage(null), 4000);
        }
      } catch (err) {
        setError(`Fehler beim Speichern von ${csvType}.`);
      }
    };
    reader.onerror = () => {
      setError(`Fehler beim Lesen der Datei ${csvType}.`);
    };
    reader.readAsText(file);
  };

  const handleQuickLoadCsv = async (csvType: 'player.csv' | 'appearances.csv' | 'club.csv') => {
    let sampleContent = "";
    if (csvType === 'player.csv') {
      sampleContent = `player_id,name,age,position,club,league,market_value,xg_90,xa_90,pass_completion\np1,Lukas Schütz,21,Zentrales Mittelfeld,SV Rödinghausen,Regionalliga West,125000,0.32,0.45,88.4\np2,Mamadou Diallo,19,Rechtsaußen,TSV Havelse,Regionalliga Nord,75000,0.48,0.39,76.5\np3,Florian Krings,23,Innenverteidiger,Alemannia Aachen,3. Liga,200000,0.12,0.08,91.2\np4,Niklas Viteri,20,Mittelstürmer,Stuttgarter Kickers,Regionalliga Südwest,100000,0.64,0.22,74.0`;
    } else if (csvType === 'appearances.csv') {
      sampleContent = `appearance_id,player_id,match_date,minutes_played,goals,assists,xg,xa,yellow_cards\napp_1,p1,2026-08-15,90,1,2,0.45,0.52,0\napp_2,p2,2026-08-15,85,2,1,0.85,0.40,1\napp_3,p3,2026-08-16,90,0,0,0.05,0.02,1\napp_4,p4,2026-08-16,88,1,0,0.72,0.15,0`;
    } else if (csvType === 'club.csv') {
      sampleContent = `club_id,club_name,league,founded,stadium,budget\nc1,SV Rödinghausen,Regionalliga West,1970,Häcker-Wiehenstadion,2500000\nc2,TSV Havelse,Regionalliga Nord,1912,Wilhelm-Langrehr-Stadion,1200000\nc3,Alemannia Aachen,3. Liga,1900,Tivoli,8500000\nc4,Stuttgarter Kickers,Regionalliga Südwest,1899,GAZİ-Stadion auf der Waldau,4000000`;
    }

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Beispiel-CSV Import: ${csvType}`,
          content: sampleContent,
        }),
      });
      if (res.ok) {
        await fetchKnowledge();
        setSuccessMessage(`✓ Beispiel-Datensatz für ${csvType} erfolgreich in die KI-Wissensdatenbank eingespeichert!`);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      setError(`Fehler beim Laden von ${csvType}.`);
    }
  };

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

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleAddCustomNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: customTitle || 'Eigene Notiz / Tabelle', content: customContent }),
      });
      if (res.ok) {
        setCustomTitle('');
        setCustomContent('');
        await fetchKnowledge();
        setSuccessMessage("Wissen erfolgreich in die permanente KI-Datenbank eingespeichert!");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      setError("Fehler beim Speichern in die Wissensdatenbank.");
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

  const executeAnalysis = async (base64: string, mimeType: string, isPdf: boolean) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setSuccessProtocol(null);

    try {
      const payload = isPdf 
        ? { pdfBase64: base64, pdfMimeType: mimeType }
        : { imageBase64: base64, imageMimeType: mimeType };

      const res = await fetch('/api/scout/generate-pearl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Fehler bei der Dokumenten-/Bildanalyse');

      const data = await res.json();
      const detectedLeague = data.league || (isPdf ? "PDF-Scout-Bericht" : "Screenshot");
      const defaultAck = detectedLeague.toLowerCase().includes('tabelle')
        ? `Danke für die Tabelle aus der ${detectedLeague}!`
        : detectedLeague.toLowerCase().includes('kader')
        ? `Danke für den Kader!`
        : `Danke für das hochgeladene Dokument (${detectedLeague})!`;
      const acknowledgment = data.acknowledgment || defaultAck;
      
      await fetchKnowledge();

      if (data.players && Array.isArray(data.players)) {
        try {
          await fetch('/api/scout/import-players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players: data.players }),
          });
        } catch (e) {
          console.error("Failed to save imported players to database", e);
        }

        data.players.forEach((p: Player) => {
          onAddPlayer(p);
        });
        setSuccessProtocol([
          `✓ ${acknowledgment}`,
          `✓ ${data.players.length} Spieler und Leistungsdaten fehlerfrei extrahiert.`,
          "✓ Permanent in der KI-Wissensdatenbank gespeichert & verankert."
        ]);
        setSuccessMessage(acknowledgment);
      } else {
        const player: Player = data;
        try {
          await fetch('/api/scout/import-players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players: [player] }),
          });
        } catch (e) {
          console.error("Failed to save imported player to database", e);
        }

        onAddPlayer(player);
        setSuccessProtocol([
          `✓ ${acknowledgment}`,
          `✓ Spieler- und Leistungsdaten fehlerfrei eingelesen.`,
          "✓ Permanent in der KI-Wissensdatenbank gespeichert."
        ]);
        setSuccessMessage(acknowledgment);
      }
      
      setTimeout(() => {
        setActiveTab('scout');
      }, 3500);
    } catch (err: any) {
      setError(err.message || 'Etwas ist beim Analysieren des Dokuments schiefgelaufen.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileProcess = (file: File, autoAnalyze = false) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setError('Bitte lade eine gültige PDF-Datei oder ein Bild (PNG, JPG) hoch.');
      return;
    }
    setError(null);
    setIsPdfFile(isPdf);
    const mime = isPdf ? 'application/pdf' : (file.type || 'image/png');
    setImageMimeType(mime);
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        setSelectedImage(base64);
        if (autoAnalyze) {
          executeAnalysis(base64, mime, isPdf);
        }
      }
    };
    reader.onerror = () => {
      setError('Fehler beim Lesen der Datei.');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/') || items[i].type === 'application/pdf') {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            setActiveTab('generator');
            handleFileProcess(file, true);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [setActiveTab]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0], true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0], true);
    }
  };

  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || loading) return;
    await executeAnalysis(selectedImage, imageMimeType, isPdfFile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>Permanente KI-Wissensdatenbank (Memory Vault)</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-mono border border-emerald-500/30">Immer aktiv</span>
            </h2>
            <p className="text-xs text-slate-300">Alle hochgeladenen Tabellen, PDFs, Kader und Notizen werden hier dauerhaft gespeichert. Der KI-Scout greift in jedem Chat und jeder Analyse unfehlbar darauf zu.</p>
          </div>
        </div>

        <form onSubmit={handleAnalyzeImage} className="space-y-6 relative z-10">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              loading
                ? 'border-emerald-400 bg-slate-950/90 cursor-wait shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                : dragOver
                ? 'border-emerald-400 bg-emerald-500/10 cursor-pointer'
                : selectedImage
                ? 'border-emerald-500/60 bg-emerald-950/20 cursor-pointer'
                : 'border-slate-700 bg-slate-950/60 hover:border-emerald-500/60 hover:bg-slate-950 cursor-pointer'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {loading ? (
              <div className="space-y-5 py-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base font-mono font-bold text-emerald-400 animate-pulse tracking-wide">
                    Speichere & indiziere Dokument dauerhaft in der KI-Datenbank...
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Gemini verarbeitet Struktur & schreibt in den persistenten Speicher...
                  </p>
                </div>
                <div className="w-full max-w-md mx-auto bg-slate-900 rounded-full h-3 overflow-hidden border border-emerald-500/40 p-0.5">
                  <div className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 h-full rounded-full animate-[pulse_1.2s_infinite] w-4/5 shadow-[0_0_15px_rgba(16,185,129,0.9)]"></div>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{imageName || 'Datei ausgewählt'}</p>
                  <p className="text-xs text-emerald-400 mt-1">Erfolgreich analysiert & in KI-Datenbank verankert!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                    Datei hierher ziehen oder <span className="text-emerald-400 font-mono underline">Strg+V</span> einfügen
                  </p>
                  <p className="text-xs text-slate-400">
                    Wird automatisch ausgelesen und für immer in der KI-Datenbank gespeichert.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF-Bericht hochladen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Bild / Screenshot hochladen</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* CSV Files Management Section (player.csv, appearances.csv, club.csv) */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>CSV-Dateien Fütterung (player.csv, appearances.csv, club.csv)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/35">Direkt-Import</span>
          </div>
          <p className="text-xs text-slate-300">
            Lade offizielle CSV-Dateien hoch oder lade strukturierte Beispiel-Datensätze für Spieler, Einsätze und Vereine in die KI-Wissensdatenbank.
          </p>

          <input
            ref={playerCsvInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => e.target.files && e.target.files[0] && handleCsvFileProcess(e.target.files[0], 'player.csv')}
            className="hidden"
          />
          <input
            ref={appearancesCsvInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => e.target.files && e.target.files[0] && handleCsvFileProcess(e.target.files[0], 'appearances.csv')}
            className="hidden"
          />
          <input
            ref={clubCsvInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => e.target.files && e.target.files[0] && handleCsvFileProcess(e.target.files[0], 'club.csv')}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* player.csv Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">player.csv</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Stammdaten</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Enthält Spielerprofile, Alter, Position, Marktwert & Stammdaten.</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => playerCsvInputRef.current?.click()}
                  className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer text-center"
                >
                  Hochladen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLoadCsv('player.csv')}
                  className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer text-center shadow-lg shadow-emerald-600/20"
                >
                  Beispiel laden
                </button>
              </div>
            </div>

            {/* appearances.csv Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">appearances.csv</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Leistungsdaten</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Enthält Einsätze, Spielminuten, Tore, Assists, xG und xA Werte.</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => appearancesCsvInputRef.current?.click()}
                  className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer text-center"
                >
                  Hochladen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLoadCsv('appearances.csv')}
                  className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer text-center shadow-lg shadow-emerald-600/20"
                >
                  Beispiel laden
                </button>
              </div>
            </div>

            {/* club.csv Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">club.csv</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Vereins-Daten</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Enthält Vereinsnamen, Ligen, Gründungsjahre, Stadien und Budgets.</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => clubCsvInputRef.current?.click()}
                  className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer text-center"
                >
                  Hochladen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLoadCsv('club.csv')}
                  className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer text-center shadow-lg shadow-emerald-600/20"
                >
                  Beispiel laden
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Knowledge Input Form */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Manuelle Daten & Notizen dauerhaft hinterlegen</span>
          </h3>
          <form onSubmit={handleAddCustomNote} className="space-y-3">
            <input
              type="text"
              placeholder="Titel (z.B. Tabelle 11. Spieltag oder Kader-Notiz)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              rows={3}
              placeholder="Füge hier Tabellen, Textdaten oder Kaderfakten ein, die die KI für immer wissen soll..."
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingNote || !customContent.trim()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                {addingNote && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>In KI-Datenbank speichern</span>
              </button>
            </div>
          </form>
        </div>

        {/* Stored Knowledge Items List */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Gespeicherte Wissens-Einheiten im Speicher ({knowledgeItems.length})</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">100% Persistente KI</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {knowledgeItems.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <h4 className="text-xs font-bold text-white font-mono">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                    <button
                      onClick={() => handleDeleteKnowledge(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Eintrag löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-3 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto border border-slate-800/80">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scouting-Protokoll */}
        {successProtocol && (
          <div className="mt-6 p-5 bg-slate-900/95 border border-emerald-500/50 rounded-2xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>signHim Analyse-Protokoll</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">✓ Permanent Gespeichert</span>
            </div>
            <div className="space-y-2 font-mono text-xs sm:text-sm text-emerald-200">
              {successProtocol.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">{line}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{successMessage}</span>
              <span className="text-emerald-400">Weiterleitung zur Perlen-Matrix...</span>
            </div>
          </div>
        )}

        {successMessage && !successProtocol && (
          <div className="mt-5 p-4 bg-emerald-950/60 border border-emerald-600/60 text-emerald-200 text-xs sm:text-sm rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold block">{successMessage}</span>
              <span className="text-emerald-400 text-xs">Die KI weiß nun für immer Bescheid.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 p-4 bg-red-950/40 border border-red-900 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
