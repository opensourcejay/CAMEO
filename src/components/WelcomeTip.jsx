import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './WelcomeTip.css';

function WelcomeTip({ darkMode, settingsOpen }) {
  const [showTip, setShowTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Hide tip when settings are opened
    if (settingsOpen && showTip) {
      handleDismiss();
    }
  }, [settingsOpen, showTip]);

  useEffect(() => {
    // Check if user has dismissed the tip before
    const tipDismissed = localStorage.getItem('welcomeTipDismissed');
    if (tipDismissed) {
      setDismissed(true);
      return;
    }

    // Check if user has any API configuration
    const imageConfig = localStorage.getItem('azure_image_config');
    const videoConfig = localStorage.getItem('azure_video_config');
    
    let hasValidConfig = false;
    
    try {
      if (imageConfig) {
        const parsed = JSON.parse(imageConfig);
        if (parsed.apiKey && parsed.endpoint) {
          hasValidConfig = true;
        }
      }
      if (videoConfig) {
        const parsed = JSON.parse(videoConfig);
        if (parsed.apiKey && parsed.endpoint) {
          hasValidConfig = true;
        }
      }
    } catch (e) {
      // Invalid config, show tip
    }

    // Show tip if no valid config and not dismissed
    if (!hasValidConfig && !tipDismissed) {
      setShowTip(true);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setShowTip(false);
    setDismissed(true);
    localStorage.setItem('welcomeTipDismissed', 'true');
  }, []);

  useEffect(() => {
    // Hide tip when settings are opened
    if (settingsOpen && showTip) {
      handleDismiss();
    }
  }, [settingsOpen, showTip, handleDismiss]);

  if (!showTip || dismissed) {
    return null;
  }

  return (
    <div className={`welcome-tip ${darkMode ? 'dark' : ''}`}>
      <div className="welcome-tip-content">
        <div className="welcome-tip-icon">💡</div>
        <div className="welcome-tip-text">
          <strong>Welcome to CAMEO!</strong>
          <p>Transform your ideas into stunning visuals and videos with AI. To get started, click the <strong>⚙️ Settings</strong> button in the sidebar and configure your Azure OpenAI credentials.</p>
        </div>
        <button 
          className="welcome-tip-close"
          onClick={handleDismiss}
          aria-label="Dismiss tip"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

WelcomeTip.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  settingsOpen: PropTypes.bool
};

export default WelcomeTip;
