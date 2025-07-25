import { useEffect, useState } from "react";
import { useTrack } from "../Context/TrackContext";
import { usePlayback } from "../Context/PlaybackContext";
import { FaPlay } from "react-icons/fa";

const API_HOST = "spotify81.p.rapidapi.com";
const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const HEADERS = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

const CATEGORY_LABELS = [
  "Made for You",
  "New Releases",
  "Recommended for Today",
  "India's Best",
  "Trending Tracks",
  "Global Pop",
  "Rock Legends",
  "Hip-Hop Hits",
  "EDM Essentials",
  "Bollywood Blockbusters"
];

const trackIds = [
  // Global Pop
  "7qiZfU4dY1lWllzX7mPBI3", // Blinding Lights - The Weeknd
  "6habFhsOp2NvshLv26DqMb", // Save Your Tears - The Weeknd
  "4WNcduiCmDNfmTEz7JvmLv", // Stay - The Kid LAROI, Justin Bieber
  "5CtI0qwDJkDQGwXD1H1cLb", // good 4 u - Olivia Rodrigo
  "3AJwUDP919kvQ9QcozQPxg", // Levitating - Dua Lipa

  // Rock Legends
  "3n3Ppam7vgaVa1iaRUc9Lp", // Sweet Child O' Mine - Guns N' Roses
  "0VjIjW4GlUZAMYd2vXMi3b", // Bohemian Rhapsody - Queen
  "2takcwOaAZWiXQijPHIx7B", // Hotel California - Eagles
  "4iV5W9uYEdYUVa79Axb7Rh", // Smells Like Teen Spirit - Nirvana
  "0eGsygTp906u18L0Oimnem", // Wonderwall - Oasis

  // Hip-Hop Hits
  "1ClQpnPU9HPaU3vcy7tGzf", // God's Plan - Drake
  "0A0FS04o6zMoto8OKPsDwY", // Sicko Mode - Travis Scott
  "4aWmUDTfIPGksMNLV2rQP2", // HUMBLE. - Kendrick Lamar
  "4ZtFanR9U6ndgddUvNcjcG", // Lucid Dreams - Juice WRLD
  "2BcMwX1MPV6ZHP4tUT9uq6", // Rockstar - Post Malone

  // EDM Essentials
  "5ChkMS8OtdzJeqyybCc9R5", // Titanium - David Guetta ft. Sia
  "2PzU4IB8Dr6mxV3lHuaG34", // Animals - Martin Garrix
  "0mKqtgI3pPYb0v2vODrT1S", // Wake Me Up - Avicii
  "6dGnYIeXmHdcikdzNNDMm2", // Clarity - Zedd ft. Foxes
  "1AhDOtG9vPSOmsWgNW0BEY", // Don't Let Me Down - The Chainsmokers

  // Bollywood Blockbusters
  "2nGFzvICaeEWjIrBrL2RAx", // Kesariya - Brahmāstra
  "3PQLYVskjUeRmRIfECsL0u", // Naatu Naatu - RRR
  "2X485T9Z5Ly0xyaghN73ed", // Channa Mereya - Ae Dil Hai Mushkil
  "0VgkVdmE4gld66l8iyGjgx", // Tum Hi Ho - Aashiqui 2
  "6rqhFgbbKwnb9MLmUQDhG6", // Gerua - Dilwale

  // More Pop & Indie
  "6UelLqGlWMcVH1E5c4H7lY", // therefore i am - Billie Eilish
  "7lPN2DXiMsVn7XUKtOW1CS", // Watermelon Sugar - Harry Styles
  "5nujrmhLynf4yMoMtj8AQF", // Peaches - Justin Bieber
  "2Fxmhks0bxGSBdJ92vM42m", // Bury a Friend - Billie Eilish
  "1rqqCSm0Qe4I9rUvWncaom", // Adore You - Harry Styles

  // 🎧 New Additions
  "0VjIjW4GlUZAMYd2vXMi3b", // Blinding Lights (duplicate but often used)
  "2b8fOow8UzyDFAE27YhOZM", // Heat Waves - Glass Animals
  "6I3mqTwhRpn34SLVafSH7G", // Believer - Imagine Dragons
  "2bgTy2Dv5xDCjk0vNWm2eC", // Let Me Down Slowly - Alec Benjamin
  "3UmaczJpikHgJFyBTAJVoz", // bad guy - Billie Eilish

  "3ZCTVFBt2Brf31RLEnCkWJ", // Sunflower - Post Malone, Swae Lee
  "2XU0oxnq2qxCpomAAuJY8K", // Someone You Loved - Lewis Capaldi
  "4y3OI86AEP6PQoDE6olYhO", // Blinding Lights Remix - The Weeknd, ROSALÍA
  "5nNmj1cLH3r4aA4XDJ2bgY", // Memories - Maroon 5
  "3KkXRkHbMCARz0aVfEt68P", // Circles - Post Malone

  "0u2P5u6lvoDfwTYjAADbn4", // lovely - Billie Eilish & Khalid
  "0e7ipj03S05BNilyu5bRzt", // Goosebumps - Travis Scott
  "3ZOEytgrvLwQaqXreDs2Jx", // Say So - Doja Cat
  "6zSpb8dQRaw0M1dK8PBwQz", // Ride It - Regard
  "6WrI0LAC5M1Rw2MnX2ZvEg",  // Say My Name - David Guetta, Bebe Rexha, J Balvin

  "0hVXuCcriWRGvwMV1r5Yn9", // Industry Baby - Lil Nas X, Jack Harlow  
  "0uAjBatvB3YkJbT0fB0fev", // Unholy - Sam Smith, Kim Petras  
  "3FAJ6O0NOHQV8Mc5Ri6ENp", // Easy On Me - Adele  
  "2LRoIwlKmHjgvigdNGBHNo", // Calm Down - Rema, Selena Gomez  
  "2YpeDb67231RjR0MgVLzsG", // Love Yourself - Justin Bieber  

  "6xGruZOHLs39ZbVccQTuPZ", // Shivers - Ed Sheeran  
  "5v5M9vR2oCmUGgDvHfu1oA", // What Was I Made For? - Billie Eilish  
  "6K4t31amVTZDgR3sKmwUJJ", // Anti-Hero - Taylor Swift  
  "6f3Slt0GbA2bPZlz0aIFXN", // Roses (Imanbek Remix) - SAINt JHN  
  "5HCyWlXZPP0y6Gqq8TgA20"  // Havana - Camila Cabello ft. Young Thug
].join(",");

const albumIds = [
  // Global Hits
  "3IBcauSj5M2A6lTeffJzdv", // After Hours - The Weeknd
  "6JWc4iAiJ9FjyK0B59ABb4", // Future Nostalgia - Dua Lipa
  "4aawyAB9vmqN3uQ7FjRGTy", // Divide - Ed Sheeran
  "0sNOF9WDwhWunNAHPD3Baj", // Scorpion - Drake
  "1ATL5GLyefJaxhQzSPVrLX", // folklore - Taylor Swift

  // Classics
  "382ObEPsp2rxGrnsizN5TX", // The Dark Side of the Moon - Pink Floyd
  "6Gjty3zP4NFgd2mQYjlbzY", // Thriller - Michael Jackson
  "3JfSxDfmwS5OeHPwLSkrfr", // Back in Black - AC/DC
  "2Kh43m04B1UkVcpcRa1Zug", // Nevermind - Nirvana
  "3oTpY8iX4nZVfihY3ugkDd", // Rumours - Fleetwood Mac

  // Indian Albums
  "5W1XY5ucNAT8TQX6wEU4O3", // Aashiqui 2
  "3PDL4WQW3YTsTbBdFad3yf", // Kabir Singh
  "2lYx7cAhSHuVrO0RhFBc7O", // Gully Boy
  "1vLoLT5F7q6KQzL2vqdI5x", // Rockstar
  "4e5TLezqKqQh7j0XQNQEb5", // Kalank

  // More New Releases / Variety
  "2ODvWsOgouMbaA5xf0RkJe", // 25 - Adele
  "6DEjYFkNZh67HP7R9PSZvv", // Thank U, Next - Ariana Grande
  "1zCNrbPpz5OLSr6mSpPdKm", // Born to Die - Lana Del Rey
  "4yP0hdKOZPNshxUOjY0cZj", // Happier Than Ever - Billie Eilish
  "4hDok0OAJd57SGIT8xuWJH"  // Midnights - Taylor Swift
].join(",");

const MainBody = () => {
  const { setCurrentItem, recentlyPlayed, setRecentlyPlayed } = useTrack();
  const { playTrack } = usePlayback();
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trackRes, albumRes] = await Promise.all([
          fetch(`https://${API_HOST}/tracks?ids=${trackIds}`, { headers: HEADERS }),
          fetch(`https://${API_HOST}/albums?ids=${albumIds}`, { headers: HEADERS }),
        ]);

        if (!trackRes.ok || !albumRes.ok) {
          throw new Error('Failed to fetch data from Spotify API');
        }

        const [trackData, albumData] = await Promise.all([
          trackRes.json(),
          albumRes.json(),
        ]);

        // Filter out null tracks and ensure they have required properties
        const filteredTracks = (trackData?.tracks || []).filter(track =>
          track && track.album && track.album.images && track.album.images.length > 0
        );

        const filteredAlbums = (albumData?.albums || []).filter(album =>
          album && album.images && album.images.length > 0
        );

        setTracks(filteredTracks);
        setAlbums(filteredAlbums);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load music data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleTrackClick = (track) => {
    if (!track) return;

    const normalizedTrack = {
      ...track,
      type: 'track',
      artists: track.artists || [],
      album: track.album || { images: [] }
    };

    setCurrentItem(normalizedTrack);
    playTrack(normalizedTrack);

    setRecentlyPlayed((prev) => {
      const existing = prev.filter(t => t?.id !== track?.id);
      return [normalizedTrack, ...existing.slice(0, 7)];
    });
  };

  const handleAlbumClick = (album) => {
    if (!album) return;

    setCurrentItem({
      ...album,
      type: 'album',
      tracks: { items: album.tracks?.items || [] }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="mt-4 text-gray-400 text-lg">Loading awesome music for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-white p-6 space-y-14 overflow-y-auto scrollbar">
      {recentlyPlayed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Recently Played</h2>
          <div className="flex gap-2 flex-wrap">
            {recentlyPlayed.map((track) => (
              track && (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className="px-3 py-1 text-sm rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:scale-105 cursor-pointer text-black font-medium transition shadow"
                >
                  {track.name || 'Unknown Track'}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {CATEGORY_LABELS.map((label, index) => (
        <Section key={label} title={label} variant={index % 2 === 0 ? "a" : "b"}>
          {tracks.slice(index * 5, index * 5 + 5).map((track) => (
            track && (
              <Card
                key={track.id}
                image={track.album?.images?.[0]?.url}
                title={track.name || 'Unknown Track'}
                subtitle={track.artists?.map(a => a?.name).join(", ") || 'Unknown Artist'}
                onClick={() => handleTrackClick(track)}
              />
            )
          ))}
        </Section>
      ))}

      <Section title="Trending Albums" variant="a">
        {albums.map((album) => (
          album && (
            <Card
              key={album.id}
              image={album.images?.[0]?.url}
              title={`${album.name || 'Unknown Album'} (${album.release_date?.slice(0, 4) || '----'})`}
              subtitle={album.artists?.map(a => a?.name).join(", ") || 'Unknown Artist'}
              onClick={() => handleAlbumClick(album)}
            />
          )
        ))}
      </Section>
    </div>
  );
};

const Section = ({ title, children, variant }) => (
  <div className={`space-y-4 ${variant === "b" ? "bg-[#121212] p-4 rounded-xl" : ""}`}>
    <h2 className="text-2xl font-bold tracking-tight text-green-400">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);

const Card = ({ image, title, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#0b0033] p-3 rounded-xl hover:bg-[#1f1f1f] hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03] cursor-pointer group relative"
  >
    {image && (
      <img
        src={image}
        alt={title}
        className="w-full aspect-square object-cover rounded-lg mb-3 shadow-md group-hover:shadow-xl transition-all duration-300"
      />
    )}
    <p className="font-semibold text-base truncate text-white">{title}</p>
    <p className="text-xs text-gray-400 truncate">{subtitle}</p>
    <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
      <FaPlay className="text-black" />
    </div>
  </div>
);

export { MainBody };