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
        {isGenerating ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Generating your image...</p>
            <p className="loading-info">This may take a few seconds</p>
          </div>
        ) : currentImage ? (
          <div className="image-result">
            <div className="image-container" onClick={handleImageClick}>
              <img 
                src={currentImage.imageUrl} 
                alt={currentImage.prompt} 
                className="generated-image"
              />
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
          <img 
            src={enlargedImage.imageUrl} 
            alt={enlargedImage.prompt}
          />
          <p className="enlarged-prompt">{enlargedImage.prompt}</p>
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