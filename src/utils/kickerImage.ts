export async function getKickerPlayerImage(playerName: string, club?: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({ name: playerName });
    if (club) params.append('club', club);
    const response = await fetch(`/api/kicker-player-image?${params.toString()}`);
    const data = await response.json();
    if (data.success && data.imageUrl) {
      return data.imageUrl;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Kicker/Wiki-Bildes:", error);
  }
  return null;
}
