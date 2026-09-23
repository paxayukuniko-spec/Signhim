export async function getWikipediaPlayerImage(playerName: string): Promise<string | null> {
    const formattedName = encodeURIComponent(playerName.replace(/\s+/g, "_"));
    const wikiApiUrl = `https://de.wikipedia.org/w/api.php?action=query&titles=${formattedName}&prop=pageimages&format=json&pithumbsize=300&origin=*`;

    try {
        const response = await fetch(wikiApiUrl, {
            headers: {
                "User-Agent": "signHimScoutApp/1.0"
            }
        });
        if (!response.ok) return null;
        const text = await response.text();
        if (text.startsWith("<") || text.includes("You are")) return null;
        const data = JSON.parse(text);
        
        if (!data.query || !data.query.pages) {
            return null;
        }
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId !== "-1" && pages[pageId] && pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        }
    } catch (error) {
        console.error("Fehler beim Abrufen des Wiki-Bildes:", error);
    }
    
    return null;
}
