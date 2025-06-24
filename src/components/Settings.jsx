import { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose, darkMode, onToggleTheme }) => {
  const [imageConfig, setImageConfig] = useState({
    endpoint: '',
    apiKey: ''
  });
  
  const [videoConfig, setVideoConfig] = useState({
    endpoint: '',
    apiKey: ''
  });

  const [activeTab, setActiveTab] = useState('image');
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    const savedImageConfig = localStorage.getItem('azure_image_config');
    const savedVideoConfig = localStorage.getItem('azure_video_config');

    if (savedImageConfig) {
      try {
        const parsed = JSON.parse(savedImageConfig);
        if (parsed.apiKey && parsed.endpoint) {
          setImageConfig(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved image config');
      }
    }

    if (savedVideoConfig) {
      try {
        const parsed = JSON.parse(savedVideoConfig);
        if (parsed.apiKey && parsed.endpoint) {
          setVideoConfig(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved video config');
      }
    }
  }, []);

  const handleImageConfigChange = (field, value) => {
    setImageConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoConfigChange = (field, value) => {
    setVideoConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const saveSettings = () => {
    if (activeTab === 'image') {
      if (!imageConfig.apiKey || !imageConfig.endpoint) {
        alert('Please fill in both API Key and Endpoint for image generation.');
        return;
      }
      localStorage.setItem('azure_image_config', JSON.stringify(imageConfig));
    } else {
      if (!videoConfig.apiKey || !videoConfig.endpoint) {
        alert('Please fill in both API Key and Endpoint for video generation.');
        return;
      }
      localStorage.setItem('azure_video_config', JSON.stringify(videoConfig));
    }
    alert('Settings saved successfully!');
    onClose();
  };

  const clearData = () => {
    localStorage.clear();
    setImageConfig({ endpoint: '', apiKey: '' });
    setVideoConfig({ endpoint: '', apiKey: '' });
    alert('Data Cleared successfully!');
    onClose();
  };

  if (!isOpen) return null;

  const currentConfig = activeTab === 'image' ? imageConfig : videoConfig;
  const handleConfigChange = activeTab === 'image' ? handleImageConfigChange : handleVideoConfigChange;

  return (
    <div className="settings-overlay" onClick={onClose}>      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-header-left">
            <h2>Azure OpenAI Settings</h2>
            <button 
              className="header-theme-toggle"
              onClick={onToggleTheme}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            Image Generation
          </button>
          <button 
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            Video Generation
          </button>
        </div>        <div className="settings-modal-body">
          <div className="settings-content">
            <div className="form-group">
              <label htmlFor="endpoint">Base Endpoint URL *</label>
              <input
                type="text"
                id="endpoint"
                value={currentConfig.endpoint}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                placeholder={`Enter your Azure ${activeTab === 'image' ? 'image' : 'video'} generation endpoint`}
                className="settings-input"
              />
              <small>
                Base URL of your Azure endpoint (e.g., https://your-resource.openai.azure.com/ or https://your-endpoint.inference.ai.azure.com/)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="apiKey">API Key *</label>
              <div className="input-with-toggle">
                <input
                  type={showKeys ? 'text' : 'password'}
                  id="apiKey"
                  value={currentConfig.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="Enter your Azure OpenAI API key"
                  className="settings-input"
                />
                <button 
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowKeys(!showKeys)}
                >
                  {showKeys ? '🙈' : '👁️'}
                </button>
              </div>
              <small>Your API key for {activeTab === 'image' ? 'image' : 'video'} generation</small>
            </div>            <div className="settings-actions">
              <button className="btn btn-save" onClick={saveSettings}>
                Save {activeTab === 'image' ? 'Image' : 'Video'} Settings
              </button>
            </div>
            
            <div className="settings-actions">
              <button className="btn btn-danger" onClick={clearData}>
                🗑️ Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
