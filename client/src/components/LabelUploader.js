import React, { useState, useRef } from 'react';
import './LabelUploader.css';

function LabelUploader({ onUpload, loading }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload({ image: selectedFile });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="label-uploader">
      <div className="uploader-card">
        <h3>Upload Ingredient Label</h3>
        
        {!preview && !loading && (
          <div className="upload-area">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              ref={fileInputRef}
              id="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-icon">📷</div>
              <p>Take a photo or upload an image</p>
              <span className="upload-hint">of the ingredient label</span>
            </label>
          </div>
        )}

        {preview && !loading && (
          <div className="preview-section">
            <div className="image-preview">
              <img src={preview} alt="Label preview" />
            </div>
            <div className="preview-actions">
              <button className="analyze-btn" onClick={handleUpload}>
                ✓ Analyze Label
              </button>
              <button className="reset-btn" onClick={handleReset}>
                ✕ Choose Different Image
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing label...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LabelUploader;
