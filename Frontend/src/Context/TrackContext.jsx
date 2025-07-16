// Inside TrackContext.js or wherever you manage context:
import { createContext, useContext, useState } from "react";

const TrackContext = createContext();

export const TrackProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // <-- New

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
        setCurrentItem, // <-- Provide setter
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrack = () => useContext(TrackContext);
