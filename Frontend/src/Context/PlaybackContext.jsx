import { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [state, setState] = useState({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    queue: [],
    currentIndex: -1,
  });

  const playTrack = (track, queue = []) => {
    const index = queue.findIndex((t) => t.id === track.id);
    setState({
      currentTrack: track,
      isPlaying: true,
      progress: 0,
      queue,
      currentIndex: index !== -1 ? index : 0,
    });
  };

  const togglePlayPause = () => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const playNext = () => {
    setState((prev) => {
      if (!prev.queue.length) return prev;
      const nextIndex = (prev.currentIndex + 1) % prev.queue.length;
      return {
        ...prev,
        currentTrack: prev.queue[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
      };
    });
  };

  const playPrevious = () => {
    setState((prev) => {
      if (!prev.queue.length) return prev;
      const prevIndex = (prev.currentIndex - 1 + prev.queue.length) % prev.queue.length;
      return {
        ...prev,
        currentTrack: prev.queue[prevIndex],
        currentIndex: prevIndex,
        isPlaying: true,
      };
    });
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentTrack: state.currentTrack,
        isPlaying: state.isPlaying,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => useContext(PlaybackContext);
