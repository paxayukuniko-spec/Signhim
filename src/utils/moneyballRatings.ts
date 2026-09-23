export interface RawSeasonStats {
    matches: number;
    goals: number;
    assists: number;
    xG: number;
    age: number;
    duelsWonPercentage?: number;
    passingAccuracy?: number;
}

// Funktion zur automatischen Berechnung der 0-99 Ratings aus den Saison-Leistungsdaten
export function calculateMoneyballRatings(stats: RawSeasonStats) {
    const matches = stats.matches > 0 ? stats.matches : 1;
    // 1. TOR (Torgefahr): Basiert auf Toren pro Spiel und Schusseffizienz
    const goalsPerMatch = stats.goals / matches;
    let tor = Math.round((goalsPerMatch / 0.6) * 99); 
    
    // 2. PAS (Passen/Vorbereiten): Basiert auf Assists und kreierten Großchancen
    const assistsPerMatch = stats.assists / matches;
    let pas = Math.round((assistsPerMatch / 0.4) * 99 + (stats.passingAccuracy || 70));
    pas = Math.round(pas / 2); // Durchschnitt aus Vorlagen und Passquote

    // 3. EFF (Effizienz): Wie gut nutzt er seine Chancen (Tore im Verhältnis zu xG)
    let eff = 50; // Standardwert
    if (stats.xG > 0) {
        eff = Math.round((stats.goals / stats.xG) * 60); 
    }

    // 4. XG (Erwartete Tore pro 90 Min): Bildet den Riecher für Gefahrenzonen ab
    const xGPerMatch = stats.xG / matches;
    let xgRating = Math.round((xGPerMatch / 0.5) * 99);

    // 5. PHYS (Physis/Zweikampf): Basiert auf gewonnenen Duellen und Defensivaktionen
    let phys = stats.duelsWonPercentage || 55; // Nutzt echten Prozentsatz oder Standard

    // 6. POT (Gesamtpotenzial): Dein geheimer Moneyball-Faktor (Kombination aus Alter und Effizienz)
    let ageFactor = (35 - stats.age) * 2.5; // Jüngere Spieler bekommen einen Bonus
    let pot = Math.round((tor + eff + xgRating) / 3 + ageFactor);

    // Begrenzung: Kein Wert darf über 99 oder unter 10 steigen/fallen
    const clamp = (val: number) => Math.max(10, Math.min(99, Math.round(val)));

    // Gesamtrating (OVR): Der Durchschnitt der Kernwerte
    let ovr = Math.round((clamp(tor) + clamp(pas) + clamp(eff) + clamp(xgRating) + clamp(phys)) / 5);
    // Wenn das Potenzial extrem hoch ist, zieht es das Gesamtrating leicht mit hoch
    if (pot > ovr) ovr = Math.round(ovr * 0.7 + pot * 0.3);

    return {
        ovr: clamp(ovr),
        tor: clamp(tor),
        pas: clamp(pas),
        eff: clamp(eff),
        xg: clamp(xgRating),
        phys: clamp(phys),
        pot: clamp(pot)
    };
}

// BEISPIEL: So fütterst du die Funktion mit den echten Rohdaten aus 2023/24
const rawDataJannikMause: RawSeasonStats = {
    matches: 33,
    goals: 18,
    assists: 4,
    xG: 14.5,
    age: 25,
    duelsWonPercentage: 58,
    passingAccuracy: 74
};

// Berechnung ausführen
const mauseRatings = calculateMoneyballRatings(rawDataJannikMause);

// Test-Ausgabe in der Konsole: Schau nach, was dein System berechnet!
console.log("Berechnete Karten-Ratings für Jannik Mause:", mauseRatings);
