import { useState } from 'react';
import { generateImage, editImage, generateVideo } from '../services/apiService';
import PromptInput from './PromptInput';
import ImageDisplay from './ImageDisplay';
import VideoDisplay from './VideoDisplay';
import ImageUpload from './ImageUpload';
import ConfigWarningModal from './ConfigWarningModal';
import './MediaGenerator.css';

function MediaGenerator({ darkMode, toggleTheme, onMediaGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configModalMessage, setConfigModalMessage] = useState('');
  const [currentMedia, setCurrentMedia] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [shouldResetUploads, setShouldResetUploads] = useState(false);
  const [generationType, setGenerationType] = useState('image');

  const handleImageSelect = (file) => {
    setReferenceImage(file);
  };
  const clearUploads = () => {
    setReferenceImage(null);
    setShouldResetUploads(true);
    // Reset the flag after a brief delay to allow components to process the reset
    setTimeout(() => setShouldResetUploads(false), 100);
  };

const handleSubmit = async (promptText, type = 'image', options = {}) => {
  try {
    setError(null);
    setIsGenerating(true);    setPrompt(promptText);
    // Reset uploads immediately when generation starts
    setShouldResetUploads(true);
    // Reset the flag after a brief delay to allow components to process the reset
    setTimeout(() => setShouldResetUploads(false), 100);

    let result;
    if (type === 'video') {
      // Use video endpoint and model with duration from options
      const duration = options.duration || 5; // Default to 5 seconds
      result = await generateVideo(promptText, duration);
      if (!result || !result.videoUrl) {
        throw new Error('Invalid video response format from the server');
      }

      const newVideoItem = {
        id: Date.now(),
        prompt: promptText,
        videoUrl: result.videoUrl,
        timestamp: new Date().toISOString(),
        type: 'video'
      };
      setCurrentMedia(newVideoItem);
      onMediaGenerated(newVideoItem);
    } else {
      // Use image endpoint and model
      if (referenceImage) {
        result = await editImage(promptText, referenceImage, null);
      } else {
        result = await generateImage(promptText);
      }

      if (!result || !result.imageUrl) {
        throw new Error('Invalid image response format from the server');
      }

      const newImageItem = {
        id: Date.now(),
        prompt: promptText,
        imageUrl: result.imageUrl,
        timestamp: new Date().toISOString(),
        type: 'image'
      };      setCurrentMedia(newImageItem);
      onMediaGenerated(newImageItem);
    }  } catch (err) {
    console.error('Generation error:', err);
    
    // Check if this is a configuration error
    if (err.message.includes('API settings not configured') || 
        err.message.includes('API settings incomplete') || 
        err.message.includes('Invalid') && err.message.includes('API settings')) {
      // Show modal for configuration errors
      setConfigModalMessage(err.message);
      setShowConfigModal(true);
      setError(null); // Clear any existing error message
    } else {
      // Show detailed error for other issues
      const requestIdMatch = err.message.match(/request ID ([a-f0-9-]+)/i);
      const requestId = requestIdMatch ? requestIdMatch[1] : 'unknown';

      let endpointInfo = '';
      if (type === 'video') {
        const videoConfig = localStorage.getItem('azure_video_config');
        const config = videoConfig ? JSON.parse(videoConfig) : {};
        endpointInfo = `\nVideo Endpoint: ${config.endpoint || 'Not configured'}\nVideo Model: sora`;
      } else {
        const imageConfig = localStorage.getItem('azure_image_config');
        const config = imageConfig ? JSON.parse(imageConfig) : {};
        endpointInfo = `\nImage Endpoint: ${config.endpoint || 'Not configured'}\nImage Model: gpt-image-1`;
      }

      const errorMessage = 
        `Azure OpenAI Service Error (Request ID: ${requestId})${endpointInfo}\n\n` +
        `Error: ${err.message}\n\n` +
        'Please try the following troubleshooting steps:\n\n' +
        '1. Check Azure OpenAI Service Status:\n' +
        '   • Visit the Azure status page\n' +
        '   • Verify service availability in your region\n\n' +
        '2. Verify Your Configuration:\n' +
        '   • Confirm API key is valid and not expired\n' +
        '   • Check if model deployment is active\n' +
        '   • Verify resource group quotas\n' +
        '   • Ensure network/firewall allows Azure OpenAI access\n\n' +
        '3. Try Alternative Solutions:\n' +
        '   • Use a different prompt\n' +
        '   • Try another model deployment\n' +
        '   • Check if prompt violates content policy\n\n' +
        '4. If issues persist:\n' +
        '   • Contact support at oai-assistants@microsoft.com\n' +
        '   • Include this Request ID in your email\n';

      setError(errorMessage);
    }
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <div className={`media-generator ${darkMode ? 'dark' : 'light'}`}>
      <div className="title-section">
        <h1>CAMEO</h1>
        <h2>Creative AI Media Engine Orchestrator</h2>
      </div>
      
      <div className="generation-type-toggle">
        <button 
          className={`toggle-btn ${generationType === 'image' ? 'active' : ''}`}
          onClick={() => {
            setGenerationType('image');
            setCurrentMedia(null);
          }}
        >
          Image
        </button>
        <button 
          className={`toggle-btn ${generationType === 'video' ? 'active' : ''}`}
          onClick={() => {
            setGenerationType('video');
            setCurrentMedia(null);
            clearUploads();
          }}
        >
          Video        </button>
      </div>

      {generationType === 'image' && (
        <ImageUpload 
          onImageSelect={handleImageSelect}
          shouldReset={shouldResetUploads}
        />
      )}

      {currentMedia && (
        <div className="media-display">
          {currentMedia.type === 'image' ? (
            <ImageDisplay 
              currentImage={currentMedia}
              isGenerating={isGenerating}
            />
          ) : (
            <VideoDisplay 
              videoUrl={currentMedia.videoUrl}
              prompt={currentMedia.prompt}
              isGenerating={isGenerating}
            />          )}
        </div>
      )}

      <PromptInput
        onSubmit={handleSubmit}
        onImageSelect={handleImageSelect}
        isGenerating={isGenerating}
        darkMode={darkMode}
        generationType={generationType}
      />

      {error && (
        <div className="error-message">
          <pre>{error}</pre>
        </div>
      )}

      <ConfigWarningModal 
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        message={configModalMessage}
      />
    </div>
  );
}

export default MediaGenerator;
