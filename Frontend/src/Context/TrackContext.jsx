import { createContext, useContext, useState } from "react";

const TrackContext = createContext();

export const TrackProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const normalizeTrack = (rawTrack) => {
    return {
      id: rawTrack.id || rawTrack.uri?.split(':')[2],
      name: rawTrack.name,
      artists: rawTrack.artists?.items 
        ? rawTrack.artists.items.map(a => ({ name: a.profile.name }))
        : rawTrack.artists || [],
      album: rawTrack.albumOfTrack || rawTrack.album || {
        name: rawTrack.album?.name || 'Unknown Album',
        images: rawTrack.album?.images || rawTrack.coverArt?.sources || []
      },
      duration_ms: rawTrack.duration?.totalMilliseconds || rawTrack.duration_ms,
      preview_url: rawTrack.preview_url || rawTrack.audioPreview?.url,
      type: 'track'
    };
  };

  const enhancedSetCurrentItem = (item) => {
    const normalized = item.type === 'track' ? normalizeTrack(item) : item;
    setCurrentItem(normalized);
    
    if (normalized.type === 'track') {
      setRecentlyPlayed(prev => [
        normalized,
        ...prev.filter(t => t.id !== normalized.id).slice(0, 7)
      ]);
    }
  };

  return (
    <TrackContext.Provider
      value={{
        query,
        setQuery,
        searchResults,
        setSearchResults,
        loading,
        setLoading,
        currentItem,
        setCurrentItem: enhancedSetCurrentItem,
        recentlyPlayed,
        normalizeTrack
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrack = () => useContext(TrackContext);