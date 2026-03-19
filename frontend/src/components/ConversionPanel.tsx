// src/components/ConversionPanel.tsx
import React, { useState } from 'react';

interface ConversionPanelProps {
  file: File;
  onReset: () => void;
  onConvert: (targetFormat: string, quality: string) => void;
  isConverting: boolean;
  progress: number;
  progressMessage: string;
}

const videoFormats = ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'GIF'];
const audioFormats = ['MP3', 'AAC', 'WAV', 'OGG', 'FLAC', 'M4A'];

const ConversionPanel: React.FC<ConversionPanelProps> = ({
  file,
  onReset,
  onConvert,
  isConverting,
  progress,
  progressMessage,
}) => {
  const fileType = file.type.startsWith('audio') ? 'audio' : 'video';
  const ext = file.name.split('.').pop()?.toUpperCase() || '';

  const [targetFormat, setTargetFormat] = useState(
    fileType === 'audio' ? 'MP3' : 'MP4'
  );
  const [quality, setQuality] = useState<'high' | 'balanced' | 'compact'>('balanced');

  const formatOptions = fileType === 'audio'
    ? audioFormats.filter(f => f !== ext)
    : [...videoFormats, ...audioFormats].filter(f => f !== ext);



  return (
    <div className="convert-panel visible">
      <div className="file-info">
        <div className="file-thumb">{fileType === 'audio' ? '🎵' : '🎬'}</div>
        <div className="file-meta">
          <h4>{file.name}</h4>
          <p>{ext} · {(file.size / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
      </div>

      <div className="convert-row">
        <div>
          <label>from</label>
          <select value={ext} disabled>
            <option>{ext}</option>
          </select>
        </div>
        <div className="arrow-icon">→</div>
        <div>
          <label>to</label>
          <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
            {formatOptions.map(fmt => <option key={fmt}>{fmt}</option>)}
          </select>
        </div>
      </div>

      <div className="quality-row">
        <label>✨ how would you like it?</label>
        <div className="quality-options">
          <button
            className={`q-btn ${quality === 'high' ? 'active' : ''}`}
            onClick={() => setQuality('high')}
          >
            Luscious (max)
          </button>
          <button
            className={`q-btn ${quality === 'balanced' ? 'active' : ''}`}
            onClick={() => setQuality('balanced')}
          >
            Balanced
          </button>
          <button
            className={`q-btn ${quality === 'compact' ? 'active' : ''}`}
            onClick={() => setQuality('compact')}
          >
            Compact
          </button>
        </div>
      </div>

      {(isConverting || progress > 0) && (
        <div className="progress-wrap visible">
          <div className="progress-bar-bg">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">
            <span>{progressMessage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      <div className="convert-actions">
        <button
          className="btn-convert"
          onClick={() => onConvert(targetFormat, quality)}
          disabled={isConverting}
        >
          {isConverting ? 'Converting...' : '⚡ Convert Now'}
        </button>
        <button className="btn-reset" onClick={onReset} disabled={isConverting}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default ConversionPanel;