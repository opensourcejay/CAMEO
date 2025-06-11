import { useState } from 'react';
import './VideoDisplay.css';

function VideoDisplay({ videoUrl, prompt, isGenerating }) {
  const [enlargedVideo, setEnlargedVideo] = useState(null);

  const handleVideoClick = (e) => {
    e.stopPropagation();
    setEnlargedVideo({ videoUrl, prompt });
  };

  const closeEnlarged = () => {
    setEnlargedVideo(null);
  };

  return (
    <>
      <div className="video-display">
        {isGenerating ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Generating your video...</p>
            <p className="loading-info">This may take a few minutes</p>
          </div>
        ) : videoUrl ? (
          <div className="video-result">
            <div className="video-container" onClick={handleVideoClick}>
              <video 
                src={videoUrl} 
                controls
                className="generated-video"
                preload="metadata"
              />
            </div>
            <div className="video-info">
              <p className="video-prompt">{prompt}</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">🎬</div>
            <h2>Welcome to CAMEO Video</h2>
            <p>Enter a prompt below to create stunning videos</p>
          </div>
        )}
      </div>

      {enlargedVideo && (
        <div className="enlarged-view" onClick={closeEnlarged}>
          <div className="close-enlarged">×</div>
          <video 
            src={enlargedVideo.videoUrl} 
            controls
            className="enlarged-video"
            autoPlay
          />
          <p className="enlarged-prompt">{enlargedVideo.prompt}</p>
        </div>
      )}
    </>
  );
}

export default VideoDisplay;