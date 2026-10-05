/**
 * Client-Side Image Optimizer for Owner Admin Panel
 *
 * Ensures thumbnail uploads never exceed Vercel Serverless Function payload limits (4.5MB),
 * drastically reduces upload time, and preserves crisp 1080p visual fidelity.
 */

export function optimizeImageForUpload(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.88,
    forceExact16x9 = false,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No image file provided.'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file from disk.'));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to decode image data. Please verify the file is a valid image.'));
      };

      img.onload = () => {
        try {
          const origW = img.naturalWidth || img.width;
          const origH = img.naturalHeight || img.height;
          const origRatio = origW / origH;

          let targetW = origW;
          let targetH = origH;

          // Scale down if larger than max bounds while preserving aspect ratio
          if (targetW > maxWidth) {
            targetW = maxWidth;
            targetH = Math.round(targetW / origRatio);
          }
          if (targetH > maxHeight) {
            targetH = maxHeight;
            targetW = Math.round(targetH * origRatio);
          }

          // Ensure minimums
          targetW = Math.max(320, targetW);
          targetH = Math.max(180, targetH);

          const canvas = document.createElement('canvas');

          if (forceExact16x9) {
            // Letterbox / Pillarbox onto exact 1920x1080 canvas
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Dark backdrop
            ctx.fillStyle = '#0a0d14';
            ctx.fillRect(0, 0, 1920, 1080);

            // Center image
            const scale = Math.min(1920 / origW, 1080 / origH);
            const drawW = Math.round(origW * scale);
            const drawH = Math.round(origH * scale);
            const drawX = Math.round((1920 - drawW) / 2);
            const drawY = Math.round((1080 - drawH) / 2);

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            targetW = 1920;
            targetH = 1080;
          } else {
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetW, targetH);
          }

          // Export as modern WebP, fall back to JPEG if browser lacks WebP canvas export
          let mimeType = 'image/webp';
          let dataUrl = canvas.toDataURL('image/webp', quality);

          if (!dataUrl.startsWith('data:image/webp')) {
            mimeType = 'image/jpeg';
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          const base64Clean = dataUrl.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
          const approxBytes = Math.round((base64Clean.length * 3) / 4);

          resolve({
            dataUrl,
            base64: base64Clean,
            width: targetW,
            height: targetH,
            ratio: targetW / targetH,
            mimeType,
            originalSize: file.size,
            optimizedSize: approxBytes,
            savedPercent: Math.max(0, Math.round(((file.size - approxBytes) / file.size) * 100)),
          });
        } catch (procErr) {
          reject(new Error('Canvas image processing failed: ' + procErr.message));
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
