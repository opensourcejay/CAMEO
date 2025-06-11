import { useState, useEffect } from 'react'
import MediaGenerator from './components/MediaGenerator'
import './App.css'

function App() {  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return false; // Default to light mode
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('mediaHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [enlargedImage, setEnlargedImage] = useState(null);

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
    setHistory(prev => [media, ...prev]);
  };
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all images? This cannot be undone.')) {
      setHistory([]);
      // Clear all items in localStorage except theme preference
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

  return (      <div className="app-container">
        <main className="main-content">
          <MediaGenerator 
            darkMode={darkMode} 
            toggleTheme={toggleTheme}
            onMediaGenerated={addToHistory}
          />
        </main>
        <aside className="history-sidebar">
          <div className="history-header">
            <h2>Generation History</h2>
            <div className="header-actions">
              <button 
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              {history.length > 0 && (
                <button className="clear-history" onClick={clearHistory}>
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {history.length > 0 ? (            <div className="history-grid">
              {history.map(item => (
                <div key={item.id} className="history-item">
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
                  <div className="history-content">
                    <p className="history-prompt">{item.prompt}</p>
                    <div className="history-actions">
                      <button 
                        className="history-btn enlarge-btn"
                        onClick={() => setEnlargedImage(item)}
                      >
                        Enlarge
                      </button>
                      <button 
                        className="history-btn download-btn"
                        onClick={() => downloadImage(item.imageUrl || item.videoUrl)}
                      >
                        Download
                      </button>
                      <button 
                        className="history-btn delete-btn"
                        onClick={() => deleteImage(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>          ) : (
            <div className="history-empty">
              <p>No media generated yet</p>
            </div>
          )}
          <div className="sidebar-footer">
            Created by <a href="https://github.com/opensourcejay" target="_blank" rel="noopener noreferrer">@opensourcejay</a>
          </div>
        </aside>{enlargedImage && (
          <div className="enlarged-view" onClick={() => setEnlargedImage(null)}>
            <div className="close-enlarged">×</div>
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
            <p className="enlarged-prompt">{enlargedImage.prompt}</p>
          </div>
        )}
      </div>
  )
}

export default App