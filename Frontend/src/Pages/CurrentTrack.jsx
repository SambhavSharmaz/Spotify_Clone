import { useEffect, useState } from "react";
import { useTrack } from "../Context/TrackContext";
import { usePlayback } from "../Context/PlaybackContext";
import Skeleton from "react-loading-skeleton";
import { FaPlay, FaPause } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";

const CurrentTrack = () => {
  const { currentItem, recentlyPlayed, normalizeTrack } = useTrack();
  const { playTrack, isPlaying, togglePlayPause } = usePlayback();
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      const artistUri = currentItem?.artists?.[0]?.uri || currentItem?.artists?.items?.[0]?.uri;
      if (!artistUri) return;

      const artistId = artistUri.split(":").pop();
      if (!artistId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://spotify81.p.rapidapi.com/artist_overview/?id=${artistId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "spotify81.p.rapidapi.com",
              "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY
            },
          }
        );
        const result = await response.json();
        setArtistInfo(result?.data?.artist);
      } catch (error) {
        console.error("Error fetching artist info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistInfo();
  }, [currentItem]);

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="mt-3 text-gray-400">Select a track or album to see details.</p>
      </div>
    );
  }

  const coverUrl =
    currentItem?.albumOfTrack?.coverArt?.sources?.[0]?.url ||
    currentItem?.coverArt?.sources?.[0]?.url ||
    currentItem?.images?.[0]?.url;

  const artistNames =
    currentItem?.artists?.items?.map((a) => a?.profile?.name).join(", ") ||
    currentItem?.artists?.map((a) => a?.name).join(", ") ||
    currentItem?.publisher?.name ||
    "Unknown Artist";

  const isAlbum = currentItem?.type === 'album' || 
                 !!currentItem?.tracks?.items ||
                 currentItem?.album_type === 'album';

  return (
    <div className="text-white p-6 space-y-12 overflow-y-auto scrollbar">
      <div className="flex justify-between items-start">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={currentItem.name}
            className="w-64 rounded-lg shadow aspect-square object-cover"
          />
        )}
        {!isAlbum && (
          <button 
            onClick={() => isPlaying ? togglePlayPause() : playTrack(currentItem)}
            className="bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg ml-4"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold">{currentItem.name}</h2>
        <p className="text-lg text-gray-400">{artistNames}</p>
      </div>

      {isAlbum && (
        <div className="bg-gray-900 p-4 rounded-lg shadow-md space-y-2">
          <h3 className="text-lg font-bold mb-3 text-green-400">Tracks in this Album</h3>
          <ul className="space-y-2">
            {currentItem.tracks?.items?.map((item, index) => {
              const track = normalizeTrack(item.data || item);
              return (
                <li
                  key={track.id || track.name + index}
                  className="flex justify-between items-center gap-4 hover:bg-gray-800 p-3 rounded cursor-pointer transition"
                  onClick={() => playTrack(track)}
                >
                  <div className="flex items-center gap-4 flex-grow overflow-hidden">
                    <span className="text-gray-400 w-6 text-right">{index + 1}</span>
                    <div className="flex flex-col overflow-hidden">
                      <p className="font-medium text-white truncate">
                        {track.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {track.artists.map(a => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <FaPlay className="text-green-400 min-w-5 hover:scale-110 transition shrink-0" />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton height={24} width="60%" baseColor="#333" highlightColor="#555" />
          <Skeleton height={16} count={3} baseColor="#333" highlightColor="#555" />
        </div>
      ) : artistInfo ? (
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2 text-green-400">
            About {artistInfo?.profile?.name}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {artistInfo?.profile?.biography?.text || "No biography available."}
          </p>
          {artistInfo?.visuals?.avatarImage?.sources?.[0]?.url && (
            <img
              src={artistInfo.visuals.avatarImage.sources[0].url}
              alt="Artist"
              className="w-24 h-24 mt-4 rounded-full object-cover shadow-md"
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export { CurrentTrack };