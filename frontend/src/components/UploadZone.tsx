// src/components/UploadZone.tsx
import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      onFileSelected(file);
    } else {
      alert('Please select a video or audio file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
    >
      <div className="upload-icon">📂</div>
      <h3>Bring your file here</h3>
      <p>Any video or audio, up to 2GB. We’ll treat it with care.</p>
      <button className="btn-upload" onClick={(e) => e.stopPropagation()}>
        Choose from device
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="video/*,audio/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadZone;