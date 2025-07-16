import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { MainBody } from "./Pages/MainBody";
import { Library } from "./Pages/Library";
import { CurrentTrack } from "./Pages/CurrentTrack";

const App = () => {

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black">
      <Header />

      <div className="flex flex-1 overflow-hidden gap-2.5 px-4 py-2">
        <div className="w-[350px] min-w-[350px] bg-gray-950 text-white p-4 rounded-xl shadow-inner overflow-y-auto">
          <Library />
        </div>

        <div className="flex-1 bg-gray-950 text-white p-4 rounded-xl shadow-inner overflow-y-auto h-full scrollbar">
          <MainBody />
        </div>

        <div className="w-[350px] min-w-[350px] bg-gray-950 text-white p-4 rounded-xl shadow-inner overflow-y-auto">
          <CurrentTrack />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
