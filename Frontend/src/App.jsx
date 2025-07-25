import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { MainBody } from "./Pages/MainBody";
import { Library } from "./Pages/Library";
import { CurrentTrack } from "./Pages/CurrentTrack";
import { MusicChat } from "./Components/MusicChat";
import { useState } from "react";

const App = () => {
  const [showChat, setShowChat] = useState(true); 

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black relative">
      <Header />
      <div className="flex flex-1 overflow-hidden gap-2.5 px-4 py-2">
        <div className="w-[280px] min-w-[280px] bg-gray-950 text-white p-4 rounded-xl shadow-inner overflow-y-auto">
          <Library />
        </div>
        <div className="flex-1 bg-gray-950 text-white p-4 rounded-xl shadow-inner overflow-y-auto h-full scrollbar min-w-[400px]">
          <MainBody />
        </div>
        <div className="w-[400px] min-w-[400px] bg-gray-950 text-white p-4 rounded-xl shadow-inner overflow-y-auto">
          <CurrentTrack />
        </div>
      </div>
      <Footer />

      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 z-50"
        >
          Open Chat
        </button>
      )}

      {showChat && (
        <MusicChat onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default App;