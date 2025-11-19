import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SpeakerProfile from './人物内容.jsx'; // 文件名就是你说的“人物内容.jsx”

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpeakerProfile />
  </React.StrictMode>
);
