import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageUpload from './ImageUpload';
import './PromptInput.css';

function PromptInput({ onSubmit, onImageSelect, isGenerating, darkMode, generationType, shouldResetUploads }) {
  const [inputValue, setInputValue] = useState('');
  const [videoDuration, setVideoDuration] = useState(5); // Default to 5 seconds

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!inputValue.trim() || isGenerating) return;
      
      if (generationType === 'image') {
        handleGenerateImage(e);
      } else {
        handleGenerateVideo(e);
      }
    }
  };

  const handleGenerateImage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSubmit(inputValue.trim(), 'image');
    setInputValue('');
  };

  const handleGenerateVideo = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSubmit(inputValue.trim(), 'video', { duration: videoDuration });
    setInputValue('');
  };

  // Retail prompt examples
  const retailPrompts = [
    {
      title: "Epic Burger Joint",
      prompt: "A larger-than-life gourmet burger ad, towering burger with molten cheese, glowing neon flames in the background, hip diner vibe with graffiti walls and a bold street-food energy."
    },
    {
      title: "Dallas Skyline Ad",
      prompt: "The Dallas, Texas skyline at golden hour, Reunion Tower glowing, cowboy hats and boots subtly worked into a modern fashion ad style, with bold typography and warm cinematic lighting."
    },
    {
      title: "Hip-Hop Grocery Store",
      prompt: "A 90s hip-hop inspired grocery store ad, bold graffiti text splashed across the walls, colorful produce stacked like a rap album cover, golden chains hanging from price tags, and an urban street-style vibe."
    },
    {
      title: "Futuristic Car Dealership",
      prompt: "A high-tech car dealership at night, showroom glowing with neon blue lights, sleek electric cars lined up under holographic signs, glass walls reflecting city skyscrapers, cinematic and futuristic."
    }
  ];

  return (
    <div className="prompt-input-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="textarea-wrapper">
          <textarea
            className={`prompt-textarea ${darkMode ? 'dark' : ''}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to generate... (Press Enter to generate)"
            disabled={isGenerating}
          />
            <div className="button-group">
            {/* Show image generation section only when generationType is 'image' */}
            {generationType === 'image' && (
              <div className="image-section">
                <ImageUpload
                  onImageSelect={onImageSelect}
                  buttonText="Upload Reference Image"
                  showPreview={true}
                  disabled={true} /* Permanently disabled */
                  darkMode={darkMode}
                  shouldReset={shouldResetUploads}
                />
                
                <button 
                  type="button"
                  onClick={handleGenerateImage}
                  className={`generate-btn ${darkMode ? 'dark' : ''}`}
                  disabled={isGenerating || !inputValue.trim()}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner"></span>
                      Generating Image...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </button>
              </div>
            )}            {/* Show video generation button only when generationType is 'video' */}
            {generationType === 'video' && (
              <div className="video-section">
                <div className="duration-options">
                  <span className="duration-label">Duration:</span>
                  {[5, 10, 15, 20].map((seconds) => (
                    <button
                      key={seconds}
                      type="button"
                      className={`duration-btn ${videoDuration === seconds ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
                      onClick={() => setVideoDuration(seconds)}
                      disabled={isGenerating}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
                
                <button 
                  type="button"
                  onClick={handleGenerateVideo}
                  className={`generate-btn video ${darkMode ? 'dark' : ''}`}
                  disabled={isGenerating || !inputValue.trim()}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner"></span>
                      Generating Video...
                    </>
                  ) : (
                    'Generate Video'
                  )}
                </button>
              </div>
            )}
          </div>        </div>
        
        {/* Sample prompts - only show in image generation mode and hide on mobile */}
        {generationType === 'image' && (
          <div className="ad-prompts-section hide-on-mobile">
            <h3>📱 Sample Ad Prompts</h3>
            <div className="ad-prompts-grid">
              {retailPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  className={`ad-prompt-card ${darkMode ? 'dark' : ''}`}
                  onClick={() => setInputValue(prompt.prompt)}
                  disabled={isGenerating}
                >
                  <span className="ad-prompt-title">{prompt.title}</span>
                  <p className="ad-prompt-preview">{prompt.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

PromptInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onImageSelect: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool.isRequired,
  generationType: PropTypes.oneOf(['image', 'video']).isRequired,
  shouldResetUploads: PropTypes.bool
};

export default PromptInput;