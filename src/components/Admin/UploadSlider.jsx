import React, { useState, useRef } from 'react';
import { Sliders, UploadCloud, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import Tape from '../Tape.jsx';

export default function UploadSlider({ onPublished }) {
  const [beforeFile, setBeforeFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [beforeBase64, setBeforeBase64] = useState('');

  const [afterFile, setAfterFile] = useState(null);
  const [afterPreview, setAfterPreview] = useState('');
  const [afterBase64, setAfterBase64] = useState('');

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

  const handleBeforeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadBefore(file);
  };

  const handleAfterFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadAfter(file);
  };

  const loadBefore = (file) => {
    setError(null);
    if (!['image/webp', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type.toLowerCase())) {
      setError('Before Image: Please choose a valid image (.webp, .jpg, .png).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setBeforePreview(reader.result);
      setBeforeBase64(reader.result);
      setBeforeFile(file);
    };
    reader.readAsDataURL(file);
  };

  const loadAfter = (file) => {
    setError(null);
    if (!['image/webp', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type.toLowerCase())) {
      setError('After Image: Please choose a valid image (.webp, .jpg, .png).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAfterPreview(reader.result);
      setAfterBase64(reader.result);
      setAfterFile(file);
    };
    reader.readAsDataURL(file);
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
    setStatusMsg('1/3: Validating both images and aspect ratios...');

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
      setAfterFile(null);
      setAfterPreview('');
      setAfterBase64('');
      setName('');
      setSubtitle('');
      setDescription('');

      if (onPublished) onPublished(data.item);
    } catch (err) {
      setError(err.message);
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
            <strong>Published slider successfully to GitHub!</strong>
            <p>"{successResult.title}" committed to main ({successResult.commitSha?.substring(0, 7)}).</p>
            <span className="deploy-pill">⟳ Vercel automatic deployment triggered</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Dual Upload Section */}
        <div className="slider-dual-upload">
          {/* BEFORE SLOT */}
          <div className="slider-upload-col">
            <span className="slider-slot-badge slider-slot-badge--before">BEFORE (Initial Concept)</span>
            {!beforePreview ? (
              <div
                className="admin-dropzone admin-dropzone--compact"
                onClick={() => beforeInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={beforeInputRef}
                  onChange={handleBeforeFile}
                  accept=".webp,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <UploadCloud size={28} />
                <span className="dropzone-slot-label">Select Before Image</span>
              </div>
            ) : (
              <div className="slot-preview-box">
                <img src={beforePreview} alt="Before preview" className="slot-preview-img" />
                <button
                  type="button"
                  className="preview-remove-btn"
                  onClick={() => {
                    setBeforePreview('');
                    setBeforeBase64('');
                    setBeforeFile(null);
                  }}
                  aria-label="Remove before image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* AFTER SLOT */}
          <div className="slider-upload-col">
            <span className="slider-slot-badge slider-slot-badge--after">AFTER (Final Polish)</span>
            {!afterPreview ? (
              <div
                className="admin-dropzone admin-dropzone--compact"
                onClick={() => afterInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={afterInputRef}
                  onChange={handleAfterFile}
                  accept=".webp,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <UploadCloud size={28} />
                <span className="dropzone-slot-label">Select After Image</span>
              </div>
            ) : (
              <div className="slot-preview-box">
                <img src={afterPreview} alt="After preview" className="slot-preview-img" />
                <button
                  type="button"
                  className="preview-remove-btn"
                  onClick={() => {
                    setAfterPreview('');
                    setAfterBase64('');
                    setAfterFile(null);
                  }}
                  aria-label="Remove after image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Interactive Slider Preview if both images are present */}
        {beforePreview && afterPreview && (
          <div className="slider-live-preview-wrap">
            <span className="preview-heading">Interactive Preview:</span>
            <div className="comparison-media-wrap comparison-media-wrap--preview">
              <img src={afterPreview} alt="After Preview" className="comparison-img comparison-img--after" />
              <div className="comparison-clip" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src={beforePreview} alt="Before Preview" className="comparison-img comparison-img--before" />
              </div>
              <div className="comparison-divider" style={{ left: `${sliderPos}%` }}>
                <div className="comparison-handle" aria-hidden="true">
                  <span className="comparison-arrows">⟨ ⟩</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="comparison-range"
                aria-label="Interactive comparison preview slider"
              />
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="slider-name">Project Title / Name *</label>
            <input
              id="slider-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minecraft Feudal: Demon Samurai & Dragon"
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
              placeholder="e.g. From initial concept rough to epic dragon showdown"
            />
          </div>

          <div className="admin-field admin-field--full">
            <label htmlFor="slider-desc">Transformation Notes / Description (Optional)</label>
            <textarea
              id="slider-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the improvements: lighting overhaul, contrast, atmosphere, rim lighting..."
            />
          </div>
        </div>

        <div className="admin-actions-bar">
          <button
            type="submit"
            className="paper-btn paper-btn--filled admin-publish-btn"
            disabled={loading || !beforeBase64 || !afterBase64 || !name.trim()}
          >
            {loading ? (
              <span>{statusMsg || 'Publishing Slider...'}</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Publish Slider to GitHub Portfolio</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
