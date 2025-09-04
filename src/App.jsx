import { useState, useEffect } from 'react'
import MediaGenerator from './components/MediaGenerator'
import Settings from './components/Settings'
import WelcomeTip from './components/WelcomeTip'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('mediaHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(true); // For mobile toggle

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('mediaHistory', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const addToHistory = (media) => {
    setHistory(prev => {
      const newHistory = [media, ...prev];
      // Limit history to prevent storage issues
      const limitedHistory = newHistory.slice(0, 50);
      
      // Safe localStorage handling with quota error protection
      try {
        localStorage.setItem('mediaHistory', JSON.stringify(limitedHistory));
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, keeping minimal history');
          // Keep only the last 10 items if storage is full
          const minimalHistory = newHistory.slice(0, 10);
          try {
            localStorage.setItem('mediaHistory', JSON.stringify(minimalHistory));
            return minimalHistory;
          } catch (innerError) {
            console.error('Failed to save even minimal history:', innerError);
            // Return at least the current item
            return [media];
          }
        }
        console.error('Failed to save history:', error);
      }
      
      return limitedHistory;
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all images? This cannot be undone.')) {
      setHistory([]);
      const savedTheme = localStorage.getItem('theme');
      localStorage.clear();
      if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
      }
    }
  };

  const deleteImage = (id) => {
    if (window.confirm('Delete this image?')) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (      
    <div className="app-container">
      <button 
        className="history-toggle-btn" 
        onClick={() => setHistoryVisible(!historyVisible)}
        aria-label={historyVisible ? "Hide History" : "Show History"}
      >
        <img 
          src={historyVisible ? "/icons/flaticon/close.svg" : "/icons/flaticon/menu.svg"} 
          alt={historyVisible ? "Hide History" : "Show History"} 
          className="flaticon-icon" 
        />
      </button>
      <main className="main-content">
        <MediaGenerator 
          darkMode={darkMode} 
          toggleTheme={toggleTheme}
          onMediaGenerated={addToHistory}
        />
      </main>
      <aside className={`history-sidebar ${historyVisible ? 'visible' : 'hidden'}`}>
        <div className="history-header">
          <h2>Generation History</h2>
          <div className="header-actions">
            {history.length > 0 && (
              <button className="clear-history" onClick={clearHistory}>
                <img src="/icons/flaticon/clear-all.svg" alt="Clear All" className="flaticon-icon" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
          
          {history.length > 0 ? (            <div className="history-grid">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-media-container">
                    {item.type === 'video' ? (
                      <video 
                        src={item.videoUrl} 
                        className="history-video"
                        preload="metadata"
                      />
                    ) : (
                      <img 
                        src={item.imageUrl} 
                        alt={item.prompt} 
                        className="history-image"
                      />
                    )}
                  </div>
                  <div className="history-content">
                    <div className="history-actions">
                      <button 
                        className="history-btn enlarge-btn"
                        onClick={() => setEnlargedImage(item)}
                        title="Enlarge"
                      >
                        <img src="/icons/flaticon/magnify.svg" alt="Enlarge" className="flaticon-icon" />
                      </button>
                      <button 
                        className="history-btn download-btn"
                        onClick={() => downloadImage(item.imageUrl || item.videoUrl)}
                        title="Download"
                      >
                        <img src="/icons/flaticon/download.svg" alt="Download" className="flaticon-icon" />
                      </button>
                      <button 
                        className="history-btn delete-btn"
                        onClick={() => deleteImage(item.id)}
                        title="Delete"
                      >
                        <img src="/icons/flaticon/trash.svg" alt="Delete" className="flaticon-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>          ) : (
            <div className="history-empty">
              <p>No media generated yet</p>
            </div>
          )}          <div className="sidebar-footer">
            <button 
              className="settings-btn"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              ⚙️ Settings
            </button>
            <div className="footer-text">
              Created by <a href="https://github.com/opensourcejay" target="_blank" rel="noopener noreferrer">@opensourcejay</a>
                          </div>
          </div>
        </aside>{enlargedImage && (
          <div className="enlarged-view" onClick={() => setEnlargedImage(null)}>
            <div className="close-enlarged">×</div>
            <div className="enlarged-media-container">
              {enlargedImage.type === 'video' ? (
                <video 
                  src={enlargedImage.videoUrl} 
                  controls
                  className="enlarged-video"
                  autoPlay
                />
              ) : (
                <img 
                  src={enlargedImage.imageUrl} 
                  alt={enlargedImage.prompt}
                />
              )}
              <div className="enlarged-prompt-overlay">
                <p>{enlargedImage.prompt}</p>
              </div>
            </div>
            <div className="enlarged-share-buttons">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent("I generated this using C.A.M.E.O")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-button facebook"
                onClick={(e) => e.stopPropagation()}
              >
                <img src="/icons/facebook.svg" alt="Share on Facebook" className="share-icon" />
                <span>Share</span>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I generated this using C.A.M.E.O")}&url=${encodeURIComponent(window.location.href)}`} 
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
        )}        <Settings 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />
        
        <WelcomeTip darkMode={darkMode} settingsOpen={settingsOpen} />
      </div>
  )
}

export default App