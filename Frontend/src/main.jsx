import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { TrackProvider } from './Context/TrackContext';
import { PlaybackProvider } from './Context/PlaybackContext';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TrackProvider>
    <PlaybackProvider>
            <App />
    </PlaybackProvider>
    </TrackProvider>
  </React.StrictMode>
);
