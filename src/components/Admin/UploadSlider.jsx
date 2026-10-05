import React, { useState, useRef } from 'react';
import {
  Sliders,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react';
import Tape from '../Tape.jsx';
import { optimizeImageForUpload, formatBytes } from './imageOptimizer.js';

export default function UploadSlider({ onPublished }) {
  const [beforeFile, setBeforeFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [beforeBase64, setBeforeBase64] = useState('');
  const [beforeMeta, setBeforeMeta] = useState(null);
  const [processingBefore, setProcessingBefore] = useState(false);

  const [afterFile, setAfterFile] = useState(null);
  const [afterPreview, setAfterPreview] = useState('');
  const [afterBase64, setAfterBase64] = useState('');
  const [afterMeta, setAfterMeta] = useState(null);
  const [processingAfter, setProcessingAfter] = useState(false);

  const [sliderPos, setSliderPos] = useState(50);

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [beforeLabel, setBeforeLabel] = useState('BEFORE (Initial Concept)');
  const [afterLabel, setAfterLabel] = useState('AFTER (Final Polish)');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const handleBeforeFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProcessingBefore(true);
    try {
      const opt = await optimizeImageForUpload(file, { maxWidth: 1920, maxHeight: 1080 });
      setBeforePreview(opt.dataUrl);
      setBeforeBase64(opt.base64);
      setBeforeMeta(opt);
      setBeforeFile(file);
    } catch (err) {
      setError(`Before Image: ${err.message}`);
    } finally {
      setProcessingBefore(false);
    }
  };

  const handleAfterFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProcessingAfter(true);
    try {
      const opt = await optimizeImageForUpload(file, { maxWidth: 1920, maxHeight: 1080 });
      setAfterPreview(opt.dataUrl);
      setAfterBase64(opt.base64);
      setAfterMeta(opt);
      setAfterFile(file);
    } catch (err) {
      setError(`After Image: ${err.message}`);
    } finally {
      setProcessingAfter(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beforeBase64) {
      setError('Before Image is required.');
      return;
    }
    if (!afterBase64) {
      setError('After Image is required.');
      return;
    }
    if (!name.trim()) {
      setError('Comparison title/name is required.');
      return;
    }

    setError(null);
    setSuccessResult(null);
    setLoading(true);
    setStatusMsg('1/3: Preparing optimized comparison assets...');

    try {
      setStatusMsg('2/3: Creating Git tree with Before & After assets on GitHub...');
      const resp = await fetch('/api/admin/upload-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          subtitle: subtitle.trim() || 'Before & After Transformation',
          description: description.trim() || 'High-CTR YouTube thumbnail iteration and lighting overhaul.',
          beforeLabel: beforeLabel.trim(),
          afterLabel: afterLabel.trim(),
          beforeImageBase64: beforeBase64,
          afterImageBase64: afterBase64,
          tools: ['Photoshop', 'Cinema 4D'],
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to publish comparison slider.');
      }

      setStatusMsg('3/3: Triggering automated Vercel production deployment...');
      setSuccessResult({
        title: data.item?.title || name,
        commitSha: data.commitSha,
        deployTriggered: data.deployTriggered,
      });

      // Clear form
      setBeforeFile(null);
      setBeforePreview('');
      setBeforeBase64('');
      setBeforeMeta(null);
      setAfterFile(null);
      setAfterPreview('');
      setAfterBase64('');
      setAfterMeta(null);
      setName('');
      setSubtitle('');
      setDescription('');

      if (onPublished) onPublished(data.item, data.portfolio);
    } catch (err) {
      setError(err.message || 'Failed to upload comparison slider.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="admin-upload-card">
      <Tape position="tl" />
      <Tape position="tr" />

      <div className="admin-card-head">
        <div className="admin-card-icon"><Sliders size={20} /></div>
        <div>
          <h2 className="admin-card-title">Upload Before / After Comparison Slider</h2>
          <p className="admin-card-desc">
            Showcase concept-to-polish design iterations with an interactive split slider.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successResult && (
        <div className="admin-alert admin-alert--success" role="alert">
          <CheckCircle size={18} />
          <div className="success-content">
            <strong>Published slider successfully!</strong>
            <p>"{successResult.title}" committed to main ({successResult.commitSha?.substring(0, 7)}).</p>
            <span className="deploy-pill">⟳ Vercel automatic deployment triggered</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Dual Upload Grid */}
        <div className="slider-upload-grid">
          {/* Before Image */}
          <div className="slider-slot">
            <h4 className="slider-slot-title">1. Before (Original / Concept)</h4>
            {!beforePreview ? (
              <div
                className="admin-dropzone mini-dropzone"
                onClick={() => beforeInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={beforeInputRef}
                  onChange={handleBeforeFile}
                  accept=".webp,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <div className="dropzone-icon">
                  {processingBefore ? <RefreshCw size={24} className="spin" /> : <UploadCloud size={24} />}
                </div>
                <span className="dropzone-primary">
                  {processingBefore ? 'Optimizing...' : 'Select Before Image'}
                </span>
                <span className="dropzone-sub">WebP, JPG, PNG (1080p WebP auto-optimized)</span>
              </div>
            ) : (
              <div className="admin-preview-wrap mini-preview">
                <div className="preview-media-container">
                  <img src={beforePreview} alt="Before preview" className="preview-image" />
                  <button
                    type="button"
                    className="preview-remove-btn"
                    onClick={() => {
                      setBeforePreview('');
                      setBeforeBase64('');
                      setBeforeFile(null);
                      setBeforeMeta(null);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                {beforeMeta && (
                  <div className="meta-badge-row" style={{ fontSize: '11px', marginTop: '4px', color: '#10b981', display: 'flex', gap: '6px' }}>
                    <span>{beforeMeta.width}×{beforeMeta.height}</span>
                    <span>• {formatBytes(beforeMeta.optimizedSize)}</span>
                  </div>
                )}
              </div>
            )}
            <input
              type="text"
              value={beforeLabel}
              onChange={(e) => setBeforeLabel(e.target.value)}
              placeholder="e.g. BEFORE (Rough Draft)"
              className="slot-label-input"
            />
          </div>

          {/* After Image */}
          <div className="slider-slot">
            <h4 className="slider-slot-title">2. After (Final Polish)</h4>
            {!afterPreview ? (
              <div
                className="admin-dropzone mini-dropzone"
                onClick={() => afterInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={afterInputRef}
                  onChange={handleAfterFile}
                  accept=".webp,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <div className="dropzone-icon">
                  {processingAfter ? <RefreshCw size={24} className="spin" /> : <UploadCloud size={24} />}
                </div>
                <span className="dropzone-primary">
                  {processingAfter ? 'Optimizing...' : 'Select After Image'}
                </span>
                <span className="dropzone-sub">WebP, JPG, PNG (1080p WebP auto-optimized)</span>
              </div>
            ) : (
              <div className="admin-preview-wrap mini-preview">
                <div className="preview-media-container">
                  <img src={afterPreview} alt="After preview" className="preview-image" />
                  <button
                    type="button"
                    className="preview-remove-btn"
                    onClick={() => {
                      setAfterPreview('');
                      setAfterBase64('');
                      setAfterFile(null);
                      setAfterMeta(null);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                {afterMeta && (
                  <div className="meta-badge-row" style={{ fontSize: '11px', marginTop: '4px', color: '#10b981', display: 'flex', gap: '6px' }}>
                    <span>{afterMeta.width}×{afterMeta.height}</span>
                    <span>• {formatBytes(afterMeta.optimizedSize)}</span>
                  </div>
                )}
              </div>
            )}
            <input
              type="text"
              value={afterLabel}
              onChange={(e) => setAfterLabel(e.target.value)}
              placeholder="e.g. AFTER (Final Composition)"
              className="slot-label-input"
            />
          </div>
        </div>

        {/* Live Interactive Preview if both are loaded */}
        {beforePreview && afterPreview && (
          <div className="slider-interactive-preview">
            <h4 className="preview-heading">Interactive Split Preview</h4>
            <div className="mini-slider-wrap">
              <div className="mini-slider-container">
                <img src={afterPreview} alt="After" className="mini-slider-img" />
                <div
                  className="mini-slider-clipped"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <img src={beforePreview} alt="Before" className="mini-slider-img" />
                </div>
                <div className="mini-slider-line" style={{ left: `${sliderPos}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="mini-slider-range"
              />
            </div>
          </div>
        )}

        {/* Metadata Fields */}
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="slider-name">Comparison Title *</label>
            <input
              id="slider-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minecraft Feudal: Demon Samurai Transformation"
              required
            />
          </div>

          <div className="admin-field admin-field--full">
            <label htmlFor="slider-sub">Subtitle (Optional)</label>
            <input
              id="slider-sub"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Demon Samurai & Dragon Overhaul"
            />
          </div>

          <div className="admin-field admin-field--full">
            <label htmlFor="slider-desc">Work Process / Transformation Notes</label>
            <textarea
              id="slider-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain key visual enhancements: rim lighting, depth, atmospheric fog, color grading..."
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="admin-actions-bar">
          <button
            type="submit"
            className="paper-btn paper-btn--filled admin-publish-btn"
            disabled={loading || !beforeBase64 || !afterBase64 || !name.trim()}
          >
            {loading ? (
              <span>{statusMsg || 'Publishing...'}</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Publish Before & After Slider</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
