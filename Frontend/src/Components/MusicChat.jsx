import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DummyData } from "../Data/DummyData";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GENAI_API_KEY);

const MusicChat = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = await response.text();

      const sections = getMatchedSections(input);
      setChat((prev) => [...prev, { user: input, bot: text, sections }]);
      setInput("");
    } catch (err) {
      console.error("AI Error:", err);
      alert("Something went wrong with AI response.");
    } finally {
      setLoading(false);
    }
  };

  const getMatchedSections = (input) => {
    const lower = input.toLowerCase();
    return {
      albums: /album|soundtrack|music/.test(lower) ? DummyData.albums.items.slice(0, 3) : [],
      artists: /artist|singer|band|lady gaga/.test(lower) ? DummyData.artists.items.slice(0, 3) : [],
      tracks: /song|track|top/i.test(lower) ? DummyData.topResults.items.slice(0, 3) : [],
      genres: /genre|style|type/.test(lower) ? DummyData.genres.items.slice(0, 3) : [],
      playlists: /playlist|top hits/.test(lower) ? DummyData.playlists.items.slice(0, 2) : [],
      podcasts: /podcast|show|call her daddy/.test(lower) ? DummyData.podcasts.items.slice(0, 2) : [],
      episodes: /episode|interview|bernie/.test(lower) ? DummyData.episodes.items.slice(0, 1) : [],
    };
  };

  return (
    <div
      ref={chatRef}
      className="fixed bg-zinc-900 text-white rounded-xl shadow-2xl w-[95vw] max-w-lg z-50 border border-gray-700"
      style={{ top: position.y + 40, left: position.x + 40 }}
    >
      <div
        className="bg-green-600 px-5 py-3 cursor-move rounded-t-xl flex justify-between items-center"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-lg font-bold tracking-wide">🎵 Music Assistant</h2>
        <button
          onClick={onClose}
          className="text-white text-2xl font-bold hover:text-red-400"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {chat.map((entry, index) => (
          <div key={index} className="space-y-4">
            <p className="text-green-400 font-semibold">You: {entry.user}</p>
            <p className="text-gray-200 whitespace-pre-line">🎧 AI: {entry.bot}</p>
            {entry.sections.albums.length > 0 && (
              <Section title="🎵 Albums" items={entry.sections.albums} renderItem={renderAlbum} />
            )}
            {entry.sections.artists.length > 0 && (
              <Section title="🎤 Artists" items={entry.sections.artists} renderItem={renderArtist} />
            )}
            {entry.sections.tracks.length > 0 && (
              <Section title="🔥 Top Tracks" items={entry.sections.tracks} renderItem={renderTrack} />
            )}
            {entry.sections.genres.length > 0 && (
              <Section title="🌍 Genres" items={entry.sections.genres} renderItem={renderGenre} />
            )}
            {entry.sections.playlists.length > 0 && (
              <Section title="🎶 Playlists" items={entry.sections.playlists} renderItem={renderPlaylist} />
            )}
            {entry.sections.podcasts.length > 0 && (
              <Section title="🎙️ Podcasts" items={entry.sections.podcasts} renderItem={renderPodcast} />
            )}
            {entry.sections.episodes.length > 0 && (
              <Section title="🗣️ Episodes" items={entry.sections.episodes} renderItem={renderEpisode} />
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500 italic">Thinking...</p>}
      </div>

      <div className="flex gap-2 p-4 border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me about artists, genres, albums..."
          className="flex-grow px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, items, renderItem }) => (
  <div>
    <p className="text-lg font-semibold mb-2">{title}</p>
    <div className="space-y-2">{items.map((item, idx) => renderItem(item, idx))}</div>
  </div>
);

const renderAlbum = (albumItem, idx) => {
  const a = albumItem?.data;
  if (!a || !a.coverArt?.sources?.length) return null;
  return (
    <div key={idx} className="flex items-center gap-4 bg-[#222] p-3 rounded">
      <img src={a.coverArt.sources[0].url} className="w-12 h-12 object-cover rounded" />
      <div>
        <p className="font-semibold text-sm">{a.name}</p>
        <p className="text-xs text-gray-400">
          {a.artists?.items?.map(i => i.profile.name)} · {a.date?.year}
        </p>
      </div>
    </div>
  );
};

const renderArtist = (artistItem, idx) => {
  const a = artistItem?.data;
  if (!a || !a.visuals?.avatarImage?.sources?.length) return null;
  return (
    <div key={idx} className="flex items-center gap-4 bg-[#222] p-3 rounded">
      <img src={a.visuals.avatarImage.sources[0].url} className="w-12 h-12 object-cover rounded-full" />
      <p className="text-sm font-semibold">{a.profile?.name}</p>
    </div>
  );
};

const renderTrack = (trackItem, idx) => {
  const t = trackItem?.data;
  const album = t?.albumOfTrack;
  if (!t || !album || !album.coverArt?.sources?.length) return null;
  return (
    <div key={idx} className="flex items-center gap-4 bg-[#222] p-3 rounded">
      <img src={album.coverArt.sources[0].url} className="w-12 h-12 object-cover rounded" />
      <div>
        <p className="text-sm font-semibold">{t.name}</p>
        <p className="text-xs text-gray-400">{album.name}</p>
      </div>
    </div>
  );
};

const renderGenre = (genreItem, idx) => {
  const g = genreItem?.data;
  if (!g || !g.image?.sources?.length) return null;
  return (
    <div key={idx} className="flex items-center gap-4 bg-[#222] p-3 rounded">
      <img src={g.image.sources[0].url} className="w-12 h-12 object-cover rounded" />
      <p className="text-sm font-semibold">{g.name}</p>
    </div>
  );
};

const renderPlaylist = (playlistItem, idx) => {
  const p = playlistItem?.data;
  if (!p || !p.images?.items?.[0]?.sources?.length) return null;
  return (
    <div key={idx} className="flex items-center gap-4 bg-[#222] p-3 rounded">
      <img src={p.images.items[0].sources[0].url} className="w-12 h-12 object-cover rounded" />
      <div>
        <p className="text-sm font-semibold">{p.name}</p>
        <p className="text-xs text-gray-400">{p.description}</p>
      </div>
    </div>
  );
};

const renderPodcast = (podcastItem, idx) => {
  const p = podcastItem?.data;
  if (!p || !p.coverArt?.sources?.length || !p.publisher) return null;
  return (
    <div key={idx} className="flex items-center gap-4 bg-[#222] p-3 rounded">
      <img src={p.coverArt.sources[0].url} className="w-12 h-12 object-cover rounded" />
      <div>
        <p className="text-sm font-semibold">{p.name}</p>
        <p className="text-xs text-gray-400">{p.publisher.name}</p>
      </div>
    </div>
  );
};

const renderEpisode = (episodeItem, idx) => {
  const e = episodeItem?.data;
  if (!e || !e.coverArt?.sources?.length) return null;
  return (
    <div key={idx} className="flex items-start gap-4 bg-[#222] p-3 rounded">
      <img src={e.coverArt.sources[0].url} className="w-12 h-12 object-cover rounded" />
      <div>
        <p className="text-sm font-semibold">{e.name}</p>
        <p className="text-xs text-gray-400">{e.releaseDate?.isoString?.slice(0, 10)}</p>
        <p className="text-xs mt-1 line-clamp-3 text-gray-300">{e.description}</p>
      </div>
    </div>
  );
};

export { MusicChat };
