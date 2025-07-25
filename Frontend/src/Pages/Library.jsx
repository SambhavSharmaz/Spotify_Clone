import { useState } from "react";
import { useTrack } from "../Context/TrackContext";
import { usePlayback } from "../Context/PlaybackContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaClock, FaMusic, FaPodcast } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const Library = () => {
  const { recentlyPlayed, setCurrentItem } = useTrack();
  const { playTrack } = usePlayback();
  const [showRecent, setShowRecent] = useState(true);

  const toggleRecent = () => setShowRecent(prev => !prev);

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold text-white mb-4">Your Library</h2>

      <div className="space-y-2">
        <div
          onClick={toggleRecent}
          className="flex justify-between items-center cursor-pointer hover:text-green-400 transition"
        >
          <div className="flex items-center gap-2 text-sm text-white font-semibold">
            <FaClock />
            Recently Played
          </div>
          {showRecent ? (
            <MdExpandLess className="text-lg" />
          ) : (
            <MdExpandMore className="text-lg" />
          )}
        </div>

        <AnimatePresence>
          {showRecent && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 overflow-hidden"
            >
              {recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((track, idx) => (
                  <motion.li
                    key={track.id || idx}
                    onClick={() => {
                      setCurrentItem(track);
                      playTrack(track);
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition"
                  >
                    <img
                      src={
                        track?.album?.images?.[0]?.url ||
                        track?.album?.coverArt?.sources?.[0]?.url ||
                        "https://via.placeholder.com/40"
                      }
                      alt={track.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-white text-sm truncate">{track.name}</p>
                      <p className="text-gray-400 text-xs truncate">
                        {track.artists.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                  </motion.li>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-2 py-1">No recently played tracks yet.</p>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-gray-700 space-y-3 text-sm text-gray-300">
        <LibraryItem icon={<FaHeart />} label="Liked Songs" />
        <LibraryItem icon={<FaMusic />} label="Your Albums" />
        <LibraryItem icon={<FaMusic />} label="Playlists" />
        <LibraryItem icon={<FaPodcast />} label="Podcasts" />
      </div>
    </div>
  );
};

const LibraryItem = ({ icon, label }) => (
  <div className="flex items-center gap-2 hover:text-green-400 cursor-pointer transition">
    {icon}
    <span>{label}</span>
  </div>
);

export { Library };
