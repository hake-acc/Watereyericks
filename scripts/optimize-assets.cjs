const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeThumbnails() {
  console.log('--- 1. OPTIMIZING SAMPLES & THUMBNAILS FOR GRID ---');
  const samplesDir = path.join(__dirname, '../public/samples');
  const samplesGridDir = path.join(__dirname, '../public/samples/grid');
  if (!fs.existsSync(samplesGridDir)) {
    fs.mkdirSync(samplesGridDir, { recursive: true });
  }

  const sampleFiles = fs.readdirSync(samplesDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
  let origTotalBytes = 0;
  let optTotalBytes = 0;

  for (const file of sampleFiles) {
    const srcPath = path.join(samplesDir, file);
    const stat = fs.statSync(srcPath);
    origTotalBytes += stat.size;

    const baseName = file.replace(/\.[^/.]+$/, '');
    const destPath = path.join(samplesGridDir, `${baseName}.webp`);

    await sharp(srcPath)
      .resize(720, 405, { fit: 'cover', kernel: 'lanczos3' })
      .webp({ quality: 80, effort: 5 })
      .toFile(destPath);

    const optStat = fs.statSync(destPath);
    optTotalBytes += optStat.size;
  }

  // Normal uploads
  const normalDir = path.join(__dirname, '../public/thumbnails/normal');
  const normalGridDir = path.join(__dirname, '../public/thumbnails/normal/grid');
  if (fs.existsSync(normalDir)) {
    if (!fs.existsSync(normalGridDir)) {
      fs.mkdirSync(normalGridDir, { recursive: true });
    }
    const normalFiles = fs.readdirSync(normalDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
    for (const file of normalFiles) {
      const srcPath = path.join(normalDir, file);
      const stat = fs.statSync(srcPath);
      origTotalBytes += stat.size;

      const baseName = file.replace(/\.[^/.]+$/, '');
      const destPath = path.join(normalGridDir, `${baseName}.webp`);

      await sharp(srcPath)
        .resize(720, 405, { fit: 'cover', kernel: 'lanczos3' })
        .webp({ quality: 80, effort: 5 })
        .toFile(destPath);

      const optStat = fs.statSync(destPath);
      optTotalBytes += optStat.size;
    }
  }

  console.log(`Thumbnail grid savings: ${(origTotalBytes / 1024 / 1024).toFixed(2)} MB -> ${(optTotalBytes / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - optTotalBytes / origTotalBytes) * 100)}% reduction)`);

  // Update portfolio.json
  const portfolioPath = path.join(__dirname, '../src/data/portfolio.json');
  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

  portfolio.thumbnails = (portfolio.thumbnails || []).map(t => {
    const imgPath = t.image || t.img || '';
    if (imgPath.startsWith('/samples/') && !imgPath.includes('/grid/')) {
      const baseName = path.basename(imgPath).replace(/\.[^/.]+$/, '');
      t.gridImage = `/samples/grid/${baseName}.webp`;
    } else if (imgPath.startsWith('/thumbnails/normal/') && !imgPath.includes('/grid/')) {
      const baseName = path.basename(imgPath).replace(/\.[^/.]+$/, '');
      t.gridImage = `/thumbnails/normal/grid/${baseName}.webp`;
    }
    return t;
  });

  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2), 'utf8');
  console.log('Updated portfolio.json with gridImage URLs.');
}

async function optimizeCreators() {
  console.log('\n--- 2. OPTIMIZING CREATOR ICONS ---');
  const creatorsDir = path.join(__dirname, '../public/creators');
  const files = fs.readdirSync(creatorsDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

  let origBytes = 0;
  let optBytes = 0;

  for (const file of files) {
    const srcPath = path.join(creatorsDir, file);
    const origBuf = fs.readFileSync(srcPath);
    origBytes += origBuf.length;

    // Resize to 148x148 (2x retina for 74px display size)
    const optBuf = await sharp(origBuf)
      .resize(148, 148, { fit: 'cover', kernel: 'lanczos3' })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();

    fs.writeFileSync(srcPath, optBuf);
    optBytes += optBuf.length;
  }

  console.log(`Creator icons savings: ${(origBytes / 1024).toFixed(1)} KB -> ${(optBytes / 1024).toFixed(1)} KB (${Math.round((1 - optBytes / origBytes) * 100)}% reduction)`);
}

async function optimizeComparisons() {
  console.log('\n--- 3. OPTIMIZING COMPARISON SLIDERS ---');
  const compDir = path.join(__dirname, '../public/comparisons');
  if (!fs.existsSync(compDir)) return;

  const files = fs.readdirSync(compDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
  for (const file of files) {
    const srcPath = path.join(compDir, file);
    const origBuf = fs.readFileSync(srcPath);
    // Resize down if larger than 1440w
    const optBuf = await sharp(origBuf)
      .resize({ width: 1440, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toBuffer();

    fs.writeFileSync(srcPath, optBuf);
  }
  console.log('Optimized comparison slider images.');
}

(async () => {
  try {
    await optimizeThumbnails();
    await optimizeCreators();
    await optimizeComparisons();
    console.log('\nALL ASSET OPTIMIZATIONS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Optimization failed:', err);
    process.exit(1);
  }
})();
