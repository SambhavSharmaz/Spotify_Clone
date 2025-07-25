import { useEffect, useRef, useState } from 'react';
import { usePlayback } from '../Context/PlaybackContext';
import {
  FaPlay, FaPause, FaForward, FaBackward,
  FaVolumeUp, FaVolumeDown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Footer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious
  } = usePlayback();

  const audioRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Fetch preview on track change
  useEffect(() => {
    const fetchPreview = async () => {
      if (!currentTrack?.id) return;
      try {
        const response = await fetch(
          `https://spotify81.p.rapidapi.com/tracks/?ids=${currentTrack.id}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "spotify81.p.rapidapi.com",
              "x-rapidapi-key": "f9fdee2ae8msh668e71d4425d67fp173620jsnadf405add104"
            }
          }
        );
        const data = await response.json();
        const fetchedPreview = data?.tracks?.[0]?.preview_url;
        setPreviewUrl(fetchedPreview || null);
      } catch (error) {
        console.error("Error fetching preview:", error);
        setPreviewUrl(null);
      }
    };

    fetchPreview();
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    isPlaying && previewUrl ? audio.play().catch(console.error) : audio.pause();
  }, [isPlaying, previewUrl]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (previewUrl) togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [previewUrl, togglePlayPause]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current?.duration) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!currentTrack) return null;

  const coverUrl =
    currentTrack?.albumOfTrack?.coverArt?.sources?.[0]?.url ||
    currentTrack?.coverArt?.sources?.[0]?.url ||
    currentTrack?.images?.[0]?.url ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQJktXxlcrhN3Avzb8ecmOVbApomORclqcxQ&s";

  const title = currentTrack?.name || "Unknown Title";
  const artist =
    currentTrack?.artists?.items?.map((a) => a?.profile?.name).join(", ") ||
    currentTrack?.artists?.map((a) => a?.name).join(", ") ||
    currentTrack?.publisher?.name || "Unknown Artist";

  return (
    <footer className="bg-black w-full h-28 px-6 py-2 flex items-center justify-between text-white shadow-inner z-40 select-none">
      {previewUrl && <audio ref={audioRef} src={previewUrl} />}

      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <motion.img
          src={coverUrl}
          alt={title}
          className={clsx("w-14 h-14 rounded-md object-cover shadow", {
            "animate-spin-slow": isPlaying
          })}
        />
        <div className="truncate max-w-[150px]">
          <p className="text-sm font-semibold truncate">{title}</p>
          <p className="text-xs text-gray-400 truncate">{artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-[40%] max-w-[420px]">
        <div className="flex gap-6 mb-1 items-center">
          <FaBackward
            className="text-xl hover:text-green-400 cursor-pointer"
            onClick={playPrevious}
            title="Previous Track"
          />
          {previewUrl ? (
            isPlaying ? (
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
            )
          ) : (
            <FaPlay className="text-2xl text-gray-600 cursor-not-allowed" title="No preview available" />
          )}
          <FaForward
            className="text-xl hover:text-green-400 cursor-pointer"
            onClick={playNext}
            title="Next Track"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 w-full">
          <span>{formatTime(currentTime)}</span>
          <div
            className="flex-grow h-1 bg-gray-700 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-[30%] min-w-[180px] flex justify-end items-center gap-2">
        <FaVolumeDown className="text-sm" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-green-500 cursor-pointer"
        />
        <FaVolumeUp className="text-sm" />
      </div>
    </footer>
  );
};

export { Footer };
