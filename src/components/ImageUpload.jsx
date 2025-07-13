import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ImageUpload.css';

function ImageUpload({ 
  onImageSelect, 
  shouldReset = false,
  buttonText = "Upload Image",
  showPreview = true,
  disabled = false,
  darkMode = false
}) {
  const imageInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Reset previews when shouldReset changes to true
  useEffect(() => {
    if (shouldReset) {
      setPreviewImage(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }, [shouldReset]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageSelect(file);
      if (showPreview) {
        setPreviewImage(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    onImageSelect(null);
  };

  const triggerFileSelect = () => {
    imageInputRef.current?.click();
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="image-upload-container">
      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      
      {/* Preview (shown first for better layout) */}
      {showPreview && previewImage && (
        <div className="preview-container">
          <img 
            src={previewImage} 
            alt="Preview" 
            className="preview-image"
          />
          <button 
            className="remove-preview"
            onClick={handleRemoveImage}
            type="button"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Upload button */}
      <button
        type="button"
        className={`upload-btn ${darkMode ? 'dark' : ''}`}
        onClick={triggerFileSelect}
        disabled={disabled}
      >
        <span className="upload-icon">📎</span>
        {previewImage ? 'Change Image' : buttonText}
      </button>
    </div>
  );
}

ImageUpload.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
  shouldReset: PropTypes.bool,
  buttonText: PropTypes.string,
  showPreview: PropTypes.bool,
  disabled: PropTypes.bool,
  darkMode: PropTypes.bool
};

export default ImageUpload;
