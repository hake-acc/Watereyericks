import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  RefreshCw,
  Crop,
} from 'lucide-react';
import Tape from '../Tape.jsx';
import { optimizeImageForUpload, formatBytes } from './imageOptimizer.js';

const DEFAULT_CATEGORIES = [
  'Minecraft',
  'Cobblemon',
  'Boss Battles',
  'SMP & Adventure',
  '3D & Cinema 4D',
];

const AVAILABLE_TOOLS = ['Photoshop', 'Cinema 4D', 'Blender', 'After Effects'];

export default function UploadThumbnail({ onPublished }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [base64, setBase64] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Minecraft');
  const [subcat, setSubcat] = useState('Boss Battles');
  const [selectedTools, setSelectedTools] = useState(['Photoshop', 'Cinema 4D']);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processFile(selected, false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    processFile(dropped, false);
  };

  const processFile = async (fileObj, force16x9 = false) => {
    setError(null);
    setSuccessResult(null);

    const validTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(fileObj.type.toLowerCase())) {
      setError('Please select a valid image file (.webp, .jpg, .jpeg, or .png).');
      return;
    }

    setProcessingImage(true);
    setFile(fileObj);

    try {
      const optimized = await optimizeImageForUpload(fileObj, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.88,
        forceExact16x9: force16x9,
      });

      setPreviewUrl(optimized.dataUrl);
      setBase64(optimized.base64);
      setImageMeta(optimized);
    } catch (err) {
      setError(`Failed to process image: ${err.message}`);
      clearFile();
    } finally {
      setProcessingImage(false);
    }
  };

  const handleForce16x9 = () => {
    if (file) {
      processFile(file, true);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setBase64('');
    setImageMeta(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleTool = (tool) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!base64) {
      setError('Please select an image file first.');
      return;
    }
    if (!name.trim()) {
      setError('Thumbnail title/name is required.');
      return;
    }

    setError(null);
    setSuccessResult(null);
    setLoading(true);
    setStatusMsg('1/3: Preparing optimized 1080p asset and metadata...');

    try {
      setStatusMsg('2/3: Committing directly to GitHub main branch...');
      const resp = await fetch('/api/admin/upload-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          subtitle: subtitle.trim(),
          category,
          subcat,
          tools: selectedTools,
          imageBase64: base64,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      setStatusMsg('3/3: Triggering automated Vercel production deployment...');
      setSuccessResult({
        title: data.item?.title || name,
        commitSha: data.commitSha,
        deployTriggered: data.deployTriggered,
      });

      // Clear form
      clearFile();
      setName('');
      setSubtitle('');

      if (onPublished) onPublished(data.item, data.portfolio);
    } catch (err) {
      setError(err.message || 'Failed to upload thumbnail.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const ratio = imageMeta?.ratio || 1.777;
  const isRatio16x9 = ratio >= 1.70 && ratio <= 1.85;

  return (
    <div className="admin-upload-card">
      <Tape position="tl" />
      <Tape position="tr" />

      <div className="admin-card-head">
        <div className="admin-card-icon"><ImageIcon size={20} /></div>
        <div>
          <h2 className="admin-card-title">Upload Normal Thumbnail</h2>
          <p className="admin-card-desc">
            Directly upload thumbnails to GitHub with automatic 1080p optimization and Vercel deployment.
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
            <strong>Published successfully to GitHub!</strong>
            <p>"{successResult.title}" committed to main ({successResult.commitSha?.substring(0, 7)}).</p>
            <span className="deploy-pill">⟳ Vercel automatic deployment triggered</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Dropzone */}
        {!previewUrl ? (
          <div
            className="admin-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".webp,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
            <div className="dropzone-icon">
              {processingImage ? <RefreshCw size={36} className="spin" /> : <UploadCloud size={36} />}
            </div>
            <div className="dropzone-text">
              <span className="dropzone-primary">
                {processingImage ? 'Optimizing image...' : 'Click to select image or drag & drop'}
              </span>
              <span className="dropzone-sub">
                Supports WebP, JPG, PNG • Automatically optimized to crisp 1080p WebP
              </span>
            </div>
          </div>
        ) : (
          <div className="admin-preview-wrap">
            <div className="preview-media-container">
              <img src={previewUrl} alt="Thumbnail preview" className="preview-image" />
              <button
                type="button"
                className="preview-remove-btn"
                onClick={clearFile}
                aria-label="Remove image"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>

            {imageMeta && (
              <div className="preview-meta-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                <span className="dim-tag" style={{ background: '#1e293b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  {imageMeta.width} × {imageMeta.height}px
                </span>
                <span className="size-tag" style={{ background: '#1e293b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#10b981' }}>
                  <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {formatBytes(imageMeta.optimizedSize)}
                  {imageMeta.savedPercent > 0 && ` (Saved ${imageMeta.savedPercent}%)`}
                </span>
                <span className={`ratio-badge ${isRatio16x9 ? 'ratio-ok' : 'ratio-warn'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isRatio16x9 ? (
                    <>
                      <CheckCircle size={13} />
                      <span>16:9 Format Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} />
                      <span>{imageMeta.ratio.toFixed(2)}:1</span>
                      <button
                        type="button"
                        onClick={handleForce16x9}
                        style={{ marginLeft: '6px', background: '#3b82f6', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        title="Auto-Fit onto 16:9 canvas"
                      >
                        <Crop size={11} /> Auto-Fit 16:9
                      </button>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Metadata Fields */}
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="thumb-name">Thumbnail Title / Name *</label>
            <input
              id="thumb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 100 Days Cobblemon: Mega Rayquaza"
              required
            />
          </div>

          <div className="admin-field admin-field--full">
            <label htmlFor="thumb-sub">Hook / Subtitle (Optional)</label>
            <input
              id="thumb-sub"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Fiery aura & explosive evolution showcase"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="thumb-cat">Category</label>
            <select
              id="thumb-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="thumb-subcat">Subcategory</label>
            <input
              id="thumb-subcat"
              type="text"
              value={subcat}
              onChange={(e) => setSubcat(e.target.value)}
              placeholder="e.g. Boss Battles, Cobblemon, SMP & Adventure"
            />
          </div>

          <div className="admin-field admin-field--full">
            <label>Primary Software / Tools</label>
            <div className="tools-selector">
              {AVAILABLE_TOOLS.map((tool) => {
                const isSelected = selectedTools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    className={`tool-chip-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleTool(tool)}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="admin-actions-bar">
          <button
            type="submit"
            className="paper-btn paper-btn--filled admin-publish-btn"
            disabled={loading || !base64 || !name.trim()}
          >
            {loading ? (
              <span>{statusMsg || 'Publishing...'}</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Publish to GitHub Portfolio</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
