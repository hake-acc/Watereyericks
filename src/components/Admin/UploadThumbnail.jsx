import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, X, Sparkles, Layers } from 'lucide-react';
import Tape from '../Tape.jsx';

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
  const [dimensions, setDimensions] = useState(null);
  const [ratioOk, setRatioOk] = useState(null);

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
    processFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    processFile(dropped);
  };

  const processFile = (fileObj) => {
    setError(null);
    setSuccessResult(null);

    // Validate type
    const validTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(fileObj.type.toLowerCase())) {
      setError('Please select a valid image file (.webp, .jpg, .jpeg, or .png).');
      return;
    }

    if (fileObj.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setFile(fileObj);

    // Read to base64 and create preview
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreviewUrl(dataUrl);
      setBase64(dataUrl);

      // Check dimensions and ratio
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const ratio = w / h;
        setDimensions({ width: w, height: h, ratio });
        // Ideal 16:9 is ~1.7778. Allow 1.55 to 1.95
        setRatioOk(ratio >= 1.55 && ratio <= 1.95);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(fileObj);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setBase64('');
    setDimensions(null);
    setRatioOk(null);
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
    setStatusMsg('1/3: Validating image and generating safe filename...');

    try {
      setStatusMsg('2/3: Committing asset and portfolio metadata to GitHub main...');
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
        <div className="admin-card-icon"><ImageIcon size={20} /></div>
        <div>
          <h2 className="admin-card-title">Upload Normal Thumbnail</h2>
          <p className="admin-card-desc">
            Directly upload 16:9 YouTube thumbnails to GitHub with automatic Vercel deployment.
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
              <UploadCloud size={36} />
            </div>
            <div className="dropzone-text">
              <span className="dropzone-primary">Click to select image or drag & drop</span>
              <span className="dropzone-sub">Supports WebP, JPG, PNG (16:9 recommended, up to 15MB)</span>
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

            {dimensions && (
              <div className="preview-meta-bar">
                <span className="dim-tag">
                  {dimensions.width} × {dimensions.height}px
                </span>
                <span className={`ratio-badge ${ratioOk ? 'ratio-ok' : 'ratio-warn'}`}>
                  {ratioOk ? (
                    <>
                      <CheckCircle size={13} />
                      <span>16:9 Format Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} />
                      <span>Aspect ratio: {dimensions.ratio.toFixed(2)}:1 (16:9 is ~1.78)</span>
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
