import { useEffect, useState } from "react";
import { useTrack } from "../Context/TrackContext";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import musicSearchAnimation from "../Assets/loading.json";

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
const clonedAnimation = JSON.parse(JSON.stringify(musicSearchAnimation));

const MainBody = () => {
  const { setCurrentItem } = useTrack();
  const { query, searchResults: results, loading } = useTrack();
  const [randomData, setRandomData] = useState(null);
  const [loadingFallback, setLoadingFallback] = useState(false);

  useEffect(() => {
    const fetchRandom = async () => {
      setLoadingFallback(true);
      try {
        const response = await fetch(
          `https://spotify23.p.rapidapi.com/search/?q=top%20hits&type=multi&offset=0&limit=15&numberOfTopResults=5`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "spotify23.p.rapidapi.com",
              "x-rapidapi-key": "03b8091b43msh923e43b1c789f69p170609jsncd6c44c42923",
            },
          }
        );
        const data = await response.json();
        setRandomData({
          ...data,
          tracks: { items: shuffle(data?.tracks?.items || []) },
          albums: { items: shuffle(data?.albums?.items || []) },
          podcasts: { items: shuffle(data?.podcasts?.items || []) },
          genres: { items: shuffle(data?.genres?.items || []) },
        });
      } catch (err) {
        console.error("Random fetch error:", err);
      }
      setLoadingFallback(false);
    };

    if (!query) fetchRandom();
  }, [query]);

  const displayData = query && results ? results : randomData;
  const isLoading = loading || (!query && loadingFallback);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Lottie animationData={clonedAnimation} loop={true} className="w-72 h-72" />
        <p className="mt-4 text-gray-400 text-lg">Loading music content for you...</p>
      </div>
    );
  }


  if (!displayData) return <p className="text-white p-6">No data available.</p>;

  return (
  <div className="text-white p-6 space-y-12 overflow-y-auto scrollbar">
    {displayData?.tracks?.items?.length > 0 && (
      <Section title="Tracks">
        {displayData.tracks.items.slice(0, 6).map((track) => (
          <Card
            key={track?.data?.id}
            image={track?.data?.albumOfTrack?.coverArt?.sources?.[0]?.url}
            title={track?.data?.name}
            subtitle={track?.data?.artists?.items?.map((a) => a?.profile?.name).join(", ")}
            onClick={() => setCurrentItem(track?.data)}
          />
        ))}
      </Section>
    )}

    {displayData?.albums?.items?.length > 0 && (
      <Section title="Albums">
        {displayData.albums.items.slice(0, 6).map((album) => (
          <Card
            key={album?.data?.uri}
            image={album?.data?.coverArt?.sources?.[0]?.url}
            title={album?.data?.name}
            subtitle={album?.data?.artists?.items?.map((a) => a?.profile?.name).join(", ")}
            onClick={() => setCurrentItem(album?.data)}
          />
        ))}
      </Section>
    )}

    {displayData?.podcasts?.items?.length > 0 && (
      <Section title="Podcasts">
        {displayData.podcasts.items.slice(0, 6).map((pod) => (
          <Card
            key={pod?.data?.uri}
            image={pod?.data?.coverArt?.sources?.[0]?.url}
            title={pod?.data?.name}
            subtitle={pod?.data?.publisher?.name}
            onClick={() => setCurrentItem(pod?.data)}
          />
        ))}
      </Section>
    )}

    {displayData?.genres?.items?.length > 0 && (
      <div>
        <h2 className="text-xl font-semibold mb-4">Genres</h2>
        <div className="flex gap-3 flex-wrap">
          {displayData.genres.items.slice(0, 10).map((genre) => (
            <div
              key={genre?.data?.uri}
              className="bg-[#1db954] text-black px-4 py-1 rounded-full text-sm font-medium transition transform hover:scale-105 hover:bg-green-500 cursor-pointer shadow-sm"
            >
              {genre?.data?.name}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{children}</div>
  </div>
);

const Card = ({ image, title, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#0b0033] p-4 rounded-xl hover:bg-[#282828] hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
  >
    {image && (
      <img
        src={image}
        alt={title}
        className="w-full aspect-square object-cover rounded-lg mb-3 shadow-md group-hover:shadow-xl transition-all duration-300"
      />
    )}
    <p className="font-semibold text-sm truncate">{title}</p>
    <p className="text-xs text-gray-400 truncate">{subtitle}</p>
  </div>
);

export { MainBody };
