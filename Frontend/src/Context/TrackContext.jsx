import { createContext, useContext, useState } from "react";

const TrackContext = createContext();

export const TrackProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); 

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
        setCurrentItem,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrack = () => useContext(TrackContext);
