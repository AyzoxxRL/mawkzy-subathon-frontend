import React from 'react';
import './TwitchClipEmbed.scss';

interface TwitchClipEmbedProps {
  clipId: string;
}

const TwitchClipEmbed: React.FC<TwitchClipEmbedProps> = ({ clipId }) => {
  if (!clipId) return null;
  
  return (
    <div className="twitch-clip-container">
      <iframe
        src={`https://clips.twitch.tv/embed?clip=${clipId}&parent=${window.location.hostname}`}
        height="360"
        width="640"
        allowFullScreen={true}
        title={`Twitch clip ${clipId}`}
      ></iframe>
    </div>
  );
};

export default TwitchClipEmbed; 