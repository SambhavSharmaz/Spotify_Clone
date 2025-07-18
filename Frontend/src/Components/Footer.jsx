import { useEffect, useRef, useState } from 'react';
import { usePlayback } from '../Context/PlaybackContext';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';

const Footer = () => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayback();
  const audioRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("/music.mp3"); // default fallback

  useEffect(() => {
    const fetchPreview = async () => {
      if (!currentTrack?.id) return;

      try {
        const response = await fetch(
          `https://spotify23.p.rapidapi.com/tracks/?ids=${currentTrack.id}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "spotify23.p.rapidapi.com",
              "x-rapidapi-key": "03b8091b43msh923e43b1c789f69p170609jsncd6c44c42923",
            },
          }
        );

        const data = await response.json();
        const fetchedPreview = data?.tracks?.[0]?.preview_url;

        setPreviewUrl(fetchedPreview || "/music.mp3"); // fallback if null
      } catch (error) {
        console.error("Error fetching preview:", error);
        setPreviewUrl("/music.mp3"); // fallback on error
      }
    };

    fetchPreview();
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.error("Play error:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    if (isPlaying) audioRef.current.play();
  }, [previewUrl]);

  if (!currentTrack) return null;

  const coverUrl =
    currentTrack?.albumOfTrack?.coverArt?.sources?.[0]?.url ||
    currentTrack?.coverArt?.sources?.[0]?.url;

  const title = currentTrack?.name || 'Unknown Title';
  const artist =
    currentTrack?.artists?.items?.map((a) => a?.profile?.name).join(', ') ||
    currentTrack?.publisher?.name ||
    'Unknown Artist';

  return (
    <footer className="bg-black w-full h-24 flex items-center justify-between text-white px-6 shadow-inner">
      <audio ref={audioRef} src={previewUrl} />

      <div className="flex items-center gap-4 w-[30%] min-w-[220px]">
        <img src={coverUrl} alt={title} className="w-14 h-14 rounded-md object-cover" />
        <div>
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          <p className="text-xs text-gray-400 truncate">{artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-[40%]">
        <div className="flex gap-6 mb-2">
          <FaBackward className="text-xl hover:text-green-400 cursor-pointer" />
          {isPlaying ? (
            <FaPause
              className="text-2xl hover:text-green-400 cursor-pointer"
              onClick={togglePlayPause}
              title="Pause"
            />
          ) : (
            <FaPlay
              className="text-2xl hover:text-green-400 cursor-pointer"
              onClick={togglePlayPause}
              title="Play"
            />
          )}
          <FaForward className="text-xl hover:text-green-400 cursor-pointer" />
        </div>

        <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${currentTrack?.progress || 0}%` }}
          ></div>
        </div>
      </div>

      <div className="w-[30%]"></div>
    </footer>
  );
};

export { Footer };
