import { useEffect, useState } from "react";
import { useTrack } from "../Context/TrackContext";
import { usePlayback } from "../Context/PlaybackContext";
import Skeleton from "react-loading-skeleton";
import { FaPlay } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";

const CurrentTrack = () => {
	const { currentItem } = useTrack();
	const { playTrack } = usePlayback();
	const [artistInfo, setArtistInfo] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchArtistInfo = async () => {
			const artistUri = currentItem?.artists?.items?.[0]?.uri;
			if (!artistUri) return;

			const artistId = artistUri.split(":").pop();
			if (!artistId) return;

			setLoading(true);
			try {
				const response = await fetch(
					`https://spotify23.p.rapidapi.com/artist_overview/?id=${artistId}`,
					{
						method: "GET",
						headers: {
							"x-rapidapi-host": "spotify23.p.rapidapi.com",
							"x-rapidapi-key": "03b8091b43msh923e43b1c789f69p170609jsncd6c44c42923",
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
			<div className="text-gray-400 italic p-4">
				Select a track or podcast to view details.
			</div>
		);
	}

	const coverUrl =
		currentItem?.albumOfTrack?.coverArt?.sources?.[0]?.url ||
		currentItem?.coverArt?.sources?.[0]?.url;

	const artistNames =
		currentItem?.artists?.items?.map((a) => a?.profile?.name).join(", ") ||
		currentItem?.publisher?.name;

	const handlePlay = () => {
		playTrack(currentItem);
	};

	return (
		<div className="text-white p-6 space-y-12 overflow-y-auto scrollbar">
			{/* Image */}
			{coverUrl && (
				<img
					src={coverUrl}
					alt={currentItem.name}
					className="w-full rounded-lg shadow aspect-square object-cover"
				/>
			)}

			<div>
				<h2 className="text-xl font-semibold">{currentItem.name}</h2>
				<p className="text-sm text-gray-400">{artistNames}</p>

				{/* Play Button */}
				<button
					onClick={handlePlay}
					className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded shadow"
				>
					<FaPlay />
					Play
				</button>
			</div>

			{/* About the Artist */}
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
