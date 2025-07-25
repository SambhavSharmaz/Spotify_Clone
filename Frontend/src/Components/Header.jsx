import { useState, useEffect, useCallback } from "react";
import {
  FaHome, FaUserFriends, FaBell, FaUser
} from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { useTrack } from "../Context/TrackContext";
import { usePlayback } from "../Context/PlaybackContext";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";

const Header = () => {
  const {
    query,
    setQuery,
    setSearchResults,
    setLoading,
    setCurrentItem,
    normalizeTrack,
    searchResults,
  } = useTrack();
  const { playTrack } = usePlayback();
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchResults = useCallback(
    debounce(async (q) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://spotify81.p.rapidapi.com/search?q=${encodeURIComponent(q)}&type=multi&offset=0&limit=10&numberOfTopResults=5`,
          {
            headers: {
              "x-rapidapi-host": "spotify81.p.rapidapi.com",
              "x-rapidapi-key": "f9fdee2ae8msh668e71d4425d67fp173620jsnadf405add104",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setSearchResults({
          tracks: data?.tracks?.items || [],
          albums: data?.albums?.items || [],
          artists: data?.artists?.items || [],
          topResults: data?.topResults?.items || [],
        });
        setShowDropdown(true);
      } catch (err) {
        console.error("Search API error:", err);
        setSearchResults({ tracks: [], albums: [], artists: [], topResults: [] });
      } finally {
        setLoading(false);
      }
    }, 600),
    []
  );

  useEffect(() => {
    if (query.length > 2) fetchResults(query);
    else {
      setSearchResults(null);
      setShowDropdown(false);
    }
    return () => fetchResults.cancel();
  }, [query, fetchResults]);

  const handleItemSelect = async (item, type) => {
    if (!item) return;

    if (type === "album") {
      try {
        const albumId = item.id || item.uri?.split(":").pop();
        const res = await fetch(`https://spotify81.p.rapidapi.com/albums?ids=${albumId}`, {
          headers: {
            "x-rapidapi-host": "spotify81.p.rapidapi.com",
            "x-rapidapi-key": "f9fdee2ae8msh668e71d4425d67fp173620jsnadf405add104",
          },
        });
        const data = await res.json();
        const fullAlbum = data?.albums?.[0];

        if (fullAlbum) {
          setCurrentItem({
            ...fullAlbum,
            type: "album",
            tracks: { items: fullAlbum.tracks?.items || [] },
          });
        }
      } catch (err) {
        console.error("Error fetching album:", err);
      }
    } else {
      const normalized = normalizeTrack ? normalizeTrack(item) : item;
      if (type === "track") playTrack(normalized);
      setCurrentItem(normalized);
    }

    setQuery("");
    setSearchResults(null);
    setShowDropdown(false);
  };

  const SearchItem = ({ item, type }) => {
    if (!item?.data) return null;

    const image =
      item.data?.albumOfTrack?.coverArt?.sources?.[0]?.url ||
      item.data?.album?.images?.[0]?.url ||
      item.data?.coverArt?.sources?.[0]?.url ||
      item.data?.images?.[0]?.url ||
      item.data?.visuals?.avatarImage?.sources?.[0]?.url ||
      "/default-image.png";

    const title = item.data?.name || "Unknown";
    const subtitle =
      (item.data?.artists?.items || item.data?.artists || []).map((a) =>
        a?.profile?.name || a?.name
      ).join(", ") || (type === "artist" ? "Artist" : "Unknown");

    return (
      <div
        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 cursor-pointer rounded transition"
        onClick={() => handleItemSelect(item.data, type)}
      >
        <img src={image} alt={title} className="w-10 h-10 rounded object-cover" />
        <div className="truncate">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-md text-white px-6 py-4 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-2xl font-extrabold text-green-400 tracking-tight">
          Groov<span className="text-white font-light">ify</span>
        </div>

        <div className="flex items-center gap-4 w-full max-w-3xl flex-grow relative">
          <FaHome title="Home" className="text-xl hover:text-green-400 cursor-pointer" />

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              className="w-full px-5 py-2 pr-10 bg-gray-800 text-white rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(query.length > 2)}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSearchResults(null);
                  setShowDropdown(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}

            <AnimatePresence>
              {showDropdown && searchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-2 bg-black border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-600"
                >
                  {["topResults", "tracks", "albums", "artists"].map((section) =>
                    searchResults[section]?.length ? (
                      <div key={section}>
                        <h3 className="text-green-400 text-sm font-bold px-4 pt-3 pb-1 capitalize">
                          {section.replace("topResults", "Top Results")}
                        </h3>
                        {searchResults[section].map((item, idx) => {
                          const type =
                            section === "topResults"
                              ? item.data?.uri?.split(":")[1]
                              : section.slice(0, -1); // e.g. tracks → track
                          return (
                            <SearchItem key={`${section}-${idx}`} item={item} type={type} />
                          );
                        })}
                      </div>
                    ) : null
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <MdLibraryMusic className="text-2xl hover:text-green-400 cursor-pointer" title="Library" />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-full text-sm shadow transition">
            Explore Premium
          </button>
          <FaUserFriends className="text-xl hover:text-green-400 cursor-pointer" title="Friends" />
          <FaBell className="text-xl hover:text-green-400 cursor-pointer" title="Notifications" />
          <FaUser className="text-xl hover:text-green-400 cursor-pointer" title="Profile" />
        </div>
      </div>
    </header>
  );
};

export { Header };
