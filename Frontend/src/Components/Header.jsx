import { useState, useEffect, useCallback } from "react";
import { FaHome, FaUserFriends, FaBell, FaUser } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { useTrack } from "../Context/TrackContext";
import debounce from "lodash.debounce";

const Header = () => {
  const { query, setQuery, setSearchResults, setLoading } = useTrack();

  const fetchResults = useCallback(
    debounce(async (q) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://spotify23.p.rapidapi.com/search/?q=${q}&type=multi&offset=0&limit=10&numberOfTopResults=5`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "spotify23.p.rapidapi.com",
              "x-rapidapi-key": "03b8091b43msh923e43b1c789f69p170609jsncd6c44c42923",
            },
          }
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("API error:", err);
      }
      setLoading(false);
    }, 600),
    []
  );

  useEffect(() => {
    if (query.length > 2) {
      fetchResults(query);
    } else {
      setSearchResults(null);
    }

    return () => fetchResults.cancel(); 
  }, [query, fetchResults]);

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-green-500">
        Spotify<span className="text-white">Clone</span>
      </div>

      <div className="flex items-center gap-4  w-full max-w-4xl mx-6">
        <FaHome className="text-xl hover:text-green-400 cursor-pointer" title="Home" />

        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search songs, artists..."
            className="w-full px-4 py-2 pr-10 bg-gray-800 text-white rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.length > 0 && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none text-lg transition"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <MdLibraryMusic
          className="text-2xl hover:text-green-400 cursor-pointer"
          title="Library"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-1 rounded-full text-sm transition">
          Explore Premium
        </button>
        <FaUserFriends className="text-xl hover:text-green-400 cursor-pointer" title="Friends" />
        <FaBell className="text-xl hover:text-green-400 cursor-pointer" title="Notifications" />
        <FaUser className="text-xl hover:text-green-400 cursor-pointer" title="Profile" />
      </div>
    </header>
  );
};

export { Header };
