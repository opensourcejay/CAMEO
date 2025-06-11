import { useState, useEffect } from 'react';
import './PromptInput.css';

function PromptInput({ onSubmit, onImageSelect, isGenerating, darkMode, generationType }) {
  const [inputValue, setInputValue] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [videoDuration, setVideoDuration] = useState(5); // Default to 5 seconds

  // Cleanup URL when component unmounts or previewImage changes
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);
  const handleGenerateImage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSubmit(inputValue.trim(), 'image');
    setInputValue('');
    // Clear preview image when generating
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };
  const handleGenerateVideo = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSubmit(inputValue.trim(), 'video', { duration: videoDuration });
    setInputValue('');
  };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect?.(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Retail prompt examples
  const retailPrompts = [
    {
      title: "Food & Restaurant",
      prompt: "A mouthwatering gourmet burger with melted cheese dripping down, crispy bacon, fresh lettuce, and a brioche bun, captured in a trendy restaurant setting with soft bokeh lights and a marble table surface, in bold white letters it should say the words `Ready to eat` on top"
    },
    {
      title: "Gas Station",
      prompt: "A modern, sleek gas station at sunset with neon lights reflecting off a wet surface, luxury cars refueling, and a convenience store glowing invitingly in the background, clean aesthetic with dramatic lighting"
    },
    {
      title: "Mattress Store",
      prompt: "A luxurious bedroom setup with a premium mattress, crisp white bedding, and soft morning light streaming through sheer curtains"
    },
    {
      title: "Grocery Store",
      prompt: "A beautifully arranged display of fresh, colorful organic produce with morning dew drops, warm lighting, and a shallow depth of field, styled like a premium grocery store Instagram post"
    },
    {
      title: "Coffee Shop",
      prompt: "A perfectly crafted latte with intricate leaf art on a rustic wooden table, surrounded by fresh pastries and coffee beans, with warm, moody lighting and a cozy cafe atmosphere in the background"
    },
    {
      title: "Electronics Store",
      prompt: "The latest smartphones and tablets floating in space with dynamic light trails, holographic UI elements, and product specs appearing as sleek overlays, modern tech aesthetic with vibrant colors"
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
            placeholder="Describe what you want to generate..."
            disabled={isGenerating}
          />
            <div className="button-group">
            {/* Show image generation section only when generationType is 'image' */}
            {generationType === 'image' && (
              <div className="image-section">
                {previewImage && (
                  <div className="preview-container">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="preview-image"
                    />
                  </div>
                )}
                
                <input
                  id="referenceImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className={`upload-btn ${darkMode ? 'dark' : ''}`}
                  onClick={() => document.getElementById('referenceImage').click()}
                  disabled={isGenerating}
                >
                  <span className="upload-icon">📎</span>
                  {previewImage ? 'Change Image' : 'Upload Image'}
                </button>
                
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
        
        {/* Sample prompts - only show in image generation mode */}
        {generationType === 'image' && (
          <div className="ad-prompts-section">
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

export default PromptInput;