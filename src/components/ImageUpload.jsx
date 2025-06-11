import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ImageUpload.css';

function ImageUpload({ 
  onImageSelect, 
  shouldReset = false 
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
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);return (
    <div>
      {previewImage && (
        <div className="preview-container">
          <img 
            src={previewImage} 
            alt="Preview" 
            className="preview-image"
          />
        </div>
      )}
    </div>
  );
}

ImageUpload.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
  shouldReset: PropTypes.bool
};

export default ImageUpload;
