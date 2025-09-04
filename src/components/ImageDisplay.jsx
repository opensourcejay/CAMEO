import { useState } from 'react';
import PropTypes from 'prop-types';
import './ImageDisplay.css';

function ImageDisplay({ currentImage, isGenerating }) {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setEnlargedImage(currentImage);
  };

  const closeEnlarged = () => {
    setEnlargedImage(null);
  };

  return (
    <>
      <div className="image-display">
        {isGenerating || (currentImage && currentImage.isProgress) ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Generating your image...</p>
            <p className="loading-info">This may take a few seconds</p>
            <div className="progress-details">
              <div className="progress-bar">
                <div className="progress-indicator"></div>
              </div>
            </div>
          </div>
        ) : currentImage ? (
          <div className="image-result">
            <div className="image-container" onClick={handleImageClick}>
              <img 
                src={currentImage.imageUrl} 
                alt={currentImage.prompt} 
                className="generated-image"
              />
              <div className="image-prompt-overlay">
                <p>{currentImage.prompt}</p>
              </div>
            </div>
            <div className="share-buttons">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent("I generated this image using C.A.M.E.O")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-button facebook"
                onClick={(e) => e.stopPropagation()}
              >
                <img src="/icons/facebook.svg" alt="Share on Facebook" className="share-icon" />
                <span>Share</span>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I generated this image using C.A.M.E.O")}&url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-button twitter"
                onClick={(e) => e.stopPropagation()}
              >
                <img src="/icons/twitter.svg" alt="Share on X" className="share-icon" />
                <span>Share</span>
              </a>
              <a 
                href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-button instagram"
                onClick={(e) => e.stopPropagation()}
              >
                <img src="/icons/instagram.svg" alt="Share on Instagram" className="share-icon" />
                <span>Share</span>
              </a>
              <a 
                href={`https://www.tiktok.com/upload?url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-button tiktok"
                onClick={(e) => e.stopPropagation()}
              >
                <img src="/icons/tiktok.svg" alt="Share on TikTok" className="share-icon" />
                <span>Share</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">🎨</div>
            <h2>Welcome to CAMEO</h2>
            <p>Enter a prompt below to transform your ideas into stunning visuals</p>
          </div>
        )}
      </div>

      {enlargedImage && (
        <div className="enlarged-view" onClick={closeEnlarged}>
          <div className="close-enlarged">×</div>
          <div className="enlarged-media-container">
            <img 
              src={enlargedImage.imageUrl} 
              alt={enlargedImage.prompt}
            />
            <div className="enlarged-prompt-overlay">
              <p>{enlargedImage.prompt}</p>
            </div>
          </div>
          <div className="enlarged-share-buttons">
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent("I generated this image using C.A.M.E.O")}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="share-button facebook"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/icons/facebook.svg" alt="Share on Facebook" className="share-icon" />
              <span>Share</span>
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I generated this image using C.A.M.E.O")}&url=${encodeURIComponent(window.location.href)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="share-button twitter"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/icons/twitter.svg" alt="Share on X" className="share-icon" />
              <span>Share</span>
            </a>
            <a 
              href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="share-button instagram"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/icons/instagram.svg" alt="Share on Instagram" className="share-icon" />
              <span>Share</span>
            </a>
            <a 
              href={`https://www.tiktok.com/upload?url=${encodeURIComponent(window.location.href)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="share-button tiktok"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/icons/tiktok.svg" alt="Share on TikTok" className="share-icon" />
              <span>Share</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

ImageDisplay.propTypes = {
  currentImage: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    prompt: PropTypes.string.isRequired
  }),
  isGenerating: PropTypes.bool.isRequired
};

export default ImageDisplay;