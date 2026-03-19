// src/pages/Home.tsx
import React, { useState } from 'react';
import UploadZone from '../components/UploadZone';
import ConversionPanel from '../components/ConversionPanel';
import { uploadFile, startTranscoding } from '../services/api';
import { useWebSocket } from '../services/websocket';
import { useToast } from '../context/ToastContext';

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleConvert = async (targetFormat: string, quality: string) => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(0);
    setProgressMessage('Uploading...');

    try {
      // 1. Upload file
      const { task_id } = await uploadFile(selectedFile, (percent) => {
        setProgress(percent);
        setProgressMessage('Uploading...');
      });

      setProgressMessage('Initiating conversion...');

      // 2. Start transcoding job
      const { job_id } = await startTranscoding(task_id, targetFormat, quality);
      
      setTaskId(job_id);
      setProgressMessage('Queued for transcoding...');
    } catch (error) {
      showToast('Upload failed', (error as Error).message);
      setIsConverting(false);
    }
  };

  // WebSocket connection for real‑time progress
  useWebSocket(taskId, (data) => {
    setProgress(data.progress);
    setProgressMessage(data.message);
    if (data.progress >= 100) {
      setProgressMessage('✅ Ready!');
      setIsConverting(false);
      showToast('Your file is ready', 'Click Download to save it.');
    }
  });

  const handleReset = () => {
    setSelectedFile(null);
    setIsConverting(false);
    setProgress(0);
    setTaskId(null);
  };

  const triggerUpload = () => {
    document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };

  return (
    <>
      <div className="hero">
        <div className="hero-bg"></div>
      <div className="hero-noise"></div>
      <div className="hero-content">
        <h1>
          Convert <span>without the stress</span>
          <br />Media, made simple.
        </h1>
        <p>
          Video & audio conversion that respects your time and privacy. No sign‑up, just kindness.
        </p>

        {!selectedFile ? (
          <UploadZone onFileSelected={handleFileSelected} />
        ) : (
          <ConversionPanel
            file={selectedFile}
            onReset={handleReset}
            onConvert={handleConvert}
            isConverting={isConverting}
            progress={progress}
            progressMessage={progressMessage}
          />
        )}

        <div className="hero-formats">
          <span className="human-tag">everyday formats</span>
          <span className="format-tag">MP4</span>
          <span className="format-tag">MP3</span>
          <span className="format-tag">MOV</span>
          <span className="format-tag">WAV</span>
          <span className="format-tag">WEBM</span>
          <span className="format-tag">GIF</span>
        </div>
      </div>
    </div>

    {/* FEATURED CATEGORIES (gentle wording) */}
    <section>
      <h2>What would you like to do today?</h2>
      <div className="format-grid">
        <div className="format-card" tabIndex={0} role="button" onClick={triggerUpload}>
          <div className="fc-icon video">🎬</div>
          <h3>Video & movie magic</h3>
          <p>MP4, MKV, MOV, AVI… we’ll reshape them for any device.</p>
          <div className="fc-count">20+ formats, lovingly supported</div>
        </div>
        <div className="format-card" tabIndex={0} role="button" onClick={triggerUpload}>
          <div className="fc-icon audio">🎵</div>
          <h3>Audio, crisp & clear</h3>
          <p>MP3, FLAC, WAV, AAC — keep the soul or save space.</p>
          <div className="fc-count">16+ formats, lossless options</div>
        </div>
        <div className="format-card" tabIndex={0} role="button" onClick={triggerUpload}>
          <div className="fc-icon video">📦</div>
          <h3>Shrink a video</h3>
          <p>Make it email-friendly without turning it into a slideshow.</p>
          <div className="fc-count">up to 80% smaller</div>
        </div>
        <div className="format-card" tabIndex={0} role="button" onClick={triggerUpload}>
          <div className="fc-icon audio">🎙️</div>
          <h3>Tame audio size</h3>
          <p>Podcast too big? Dial in your bitrate, keep the warmth.</p>
          <div className="fc-count">32–320 kbps</div>
        </div>
      </div>
    </section>

    {/* FEATURE ROW (human-centric) */}
    <section style={{ paddingTop: 0 }}>
      <div className="feature-row">
        <div className="feature-card accent-card">
          <h3>🔒 private by design</h3>
          <p>Files never leave your browser unless you choose cloud. Deleted after 1 hour. We don’t peek.</p>
          <div className="big-num">❤️</div>
        </div>
        <div className="feature-card">
          <h3>⚡ speed without rush</h3>
          <p>Powered by WebAssembly — most files done in under 30 seconds. Time for tea.</p>
          <div className="big-num">☕</div>
        </div>
        <div className="feature-card">
          <h3>🌱 free & generous</h3>
          <p>Up to 2GB/file, unlimited. Pro is for teams and batch dreams.</p>
          <div className="big-num">∞</div>
        </div>
        <div className="feature-card">
          <h3>🌈 36 formats & counting</h3>
          <p>From retro AVI to futuristic AV1 — we speak many media languages.</p>
          <div className="big-num">36</div>
        </div>
      </div>
    </section>

    {/* CTA with softer ask */}
    <div className="cta-banner">
      <div>
        <h3>Need to convert a pile of files?</h3>
        <p>Pro gives you batch processing, API, and priority. But no pressure — free is mighty.</p>
      </div>
      <button className="btn-cta">✨ Explore Pro</button>
    </div>
    </>
  );
};

export default Home;