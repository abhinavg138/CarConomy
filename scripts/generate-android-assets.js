import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ANDROID_RES = path.resolve('android/app/src/main/res');

// SVG string for the Carconomy Launcher Icon (Adaptive & Standard)
function getLauncherIconSvg(size, isRound = false) {
  const pad = Math.round(size * 0.12);
  const badgeSize = size - pad * 2;
  const radius = isRound ? size / 2 : Math.round(badgeSize * 0.28);
  const center = size / 2;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#08090C" />
    <g transform="translate(${pad}, ${pad})">
      <defs>
        <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9FF33" />
          <stop offset="100%" stopColor="#99CC00" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="${badgeSize * 0.05}" flood-color="#CCFF00" flood-opacity="0.35"/>
        </filter>
      </defs>
      
      <!-- Rounded Badge -->
      <rect 
        x="0" 
        y="0" 
        width="${badgeSize}" 
        height="${badgeSize}" 
        rx="${radius}" 
        fill="url(#limeGrad)" 
        filter="url(#glow)" 
      />
      
      <!-- Inner Dark C -->
      <path 
        d="M ${badgeSize * 0.68} ${badgeSize * 0.30}
           C ${badgeSize * 0.60} ${badgeSize * 0.24}, ${badgeSize * 0.40} ${badgeSize * 0.24}, ${badgeSize * 0.32} ${badgeSize * 0.36}
           C ${badgeSize * 0.24} ${badgeSize * 0.48}, ${badgeSize * 0.24} ${badgeSize * 0.58}, ${badgeSize * 0.32} ${badgeSize * 0.68}
           C ${badgeSize * 0.40} ${badgeSize * 0.78}, ${badgeSize * 0.60} ${badgeSize * 0.78}, ${badgeSize * 0.68} ${badgeSize * 0.72}
           L ${badgeSize * 0.68} ${badgeSize * 0.60}
           C ${badgeSize * 0.60} ${badgeSize * 0.65}, ${badgeSize * 0.48} ${badgeSize * 0.65}, ${badgeSize * 0.43} ${badgeSize * 0.59}
           C ${badgeSize * 0.38} ${badgeSize * 0.53}, ${badgeSize * 0.38} ${badgeSize * 0.47}, ${badgeSize * 0.43} ${badgeSize * 0.41}
           C ${badgeSize * 0.48} ${badgeSize * 0.35}, ${badgeSize * 0.60} ${badgeSize * 0.35}, ${badgeSize * 0.68} ${badgeSize * 0.40}
           Z" 
        fill="#08090C" 
      />
      
      <!-- Small Pulse Indicator -->
      <circle cx="${badgeSize * 0.75}" cy="${badgeSize * 0.28}" r="${badgeSize * 0.055}" fill="#08090C" />
    </g>
  </svg>
  `;
}

// SVG string for the Adaptive Foreground (transparent background, logo centered)
function getForegroundIconSvg(size) {
  const badgeSize = Math.round(size * 0.52);
  const offset = Math.round((size - badgeSize) / 2);
  const radius = Math.round(badgeSize * 0.26);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(${offset}, ${offset})">
      <defs>
        <linearGradient id="limeGradFg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9FF33" />
          <stop offset="100%" stopColor="#99CC00" />
        </linearGradient>
      </defs>
      
      <rect 
        x="0" 
        y="0" 
        width="${badgeSize}" 
        height="${badgeSize}" 
        rx="${radius}" 
        fill="url(#limeGradFg)" 
      />
      
      <path 
        d="M ${badgeSize * 0.68} ${badgeSize * 0.30}
           C ${badgeSize * 0.60} ${badgeSize * 0.24}, ${badgeSize * 0.40} ${badgeSize * 0.24}, ${badgeSize * 0.32} ${badgeSize * 0.36}
           C ${badgeSize * 0.24} ${badgeSize * 0.48}, ${badgeSize * 0.24} ${badgeSize * 0.58}, ${badgeSize * 0.32} ${badgeSize * 0.68}
           C ${badgeSize * 0.40} ${badgeSize * 0.78}, ${badgeSize * 0.60} ${badgeSize * 0.78}, ${badgeSize * 0.68} ${badgeSize * 0.72}
           L ${badgeSize * 0.68} ${badgeSize * 0.60}
           C ${badgeSize * 0.60} ${badgeSize * 0.65}, ${badgeSize * 0.48} ${badgeSize * 0.65}, ${badgeSize * 0.43} ${badgeSize * 0.59}
           C ${badgeSize * 0.38} ${badgeSize * 0.53}, ${badgeSize * 0.38} ${badgeSize * 0.47}, ${badgeSize * 0.43} ${badgeSize * 0.41}
           C ${badgeSize * 0.48} ${badgeSize * 0.35}, ${badgeSize * 0.60} ${badgeSize * 0.35}, ${badgeSize * 0.68} ${badgeSize * 0.40}
           Z" 
        fill="#08090C" 
      />
      
      <circle cx="${badgeSize * 0.75}" cy="${badgeSize * 0.28}" r="${badgeSize * 0.055}" fill="#08090C" />
    </g>
  </svg>
  `;
}

// SVG string for the Splash Screen
function getSplashSvg(width, height) {
  const logoSize = Math.min(width, height) * 0.22;
  const logoX = (width - logoSize) / 2;
  const logoY = height * 0.40 - logoSize / 2;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Deep automotive background -->
    <rect width="${width}" height="${height}" fill="#08090C" />
    
    <!-- Ambient radial glow behind emblem -->
    <radialGradient id="ambGlow" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
    </radialGradient>
    <rect width="${width}" height="${height}" fill="url(#ambGlow)" />

    <!-- Centered Logo Emblem -->
    <g transform="translate(${logoX}, ${logoY})">
      <defs>
        <linearGradient id="splashLime" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9FF33" />
          <stop offset="100%" stopColor="#99CC00" />
        </linearGradient>
      </defs>
      <rect 
        x="0" 
        y="0" 
        width="${logoSize}" 
        height="${logoSize}" 
        rx="${logoSize * 0.28}" 
        fill="url(#splashLime)" 
      />
      
      <path 
        d="M ${logoSize * 0.68} ${logoSize * 0.30}
           C ${logoSize * 0.60} ${logoSize * 0.24}, ${logoSize * 0.40} ${logoSize * 0.24}, ${logoSize * 0.32} ${logoSize * 0.36}
           C ${logoSize * 0.24} ${logoSize * 0.48}, ${logoSize * 0.24} ${logoSize * 0.58}, ${logoSize * 0.32} ${logoSize * 0.68}
           C ${logoSize * 0.40} ${logoSize * 0.78}, ${logoSize * 0.60} ${logoSize * 0.78}, ${logoSize * 0.68} ${logoSize * 0.72}
           L ${logoSize * 0.68} ${logoSize * 0.60}
           C ${logoSize * 0.60} ${logoSize * 0.65}, ${logoSize * 0.48} ${logoSize * 0.65}, ${logoSize * 0.43} ${logoSize * 0.59}
           C ${logoSize * 0.38} ${logoSize * 0.53}, ${logoSize * 0.38} ${logoSize * 0.47}, ${logoSize * 0.43} ${logoSize * 0.41}
           C ${logoSize * 0.48} ${logoSize * 0.35}, ${logoSize * 0.60} ${logoSize * 0.35}, ${logoSize * 0.68} ${logoSize * 0.40}
           Z" 
        fill="#08090C" 
      />
      <circle cx="${logoSize * 0.75}" cy="${logoSize * 0.28}" r="${logoSize * 0.055}" fill="#08090C" />
    </g>

    <!-- Wordmark & Subtitle -->
    <text 
      x="${width / 2}" 
      y="${logoY + logoSize + 48}" 
      text-anchor="middle" 
      fill="#FFFFFF" 
      font-family="'Space Grotesk', system-ui, sans-serif" 
      font-size="${Math.max(22, Math.round(width * 0.065))}" 
      font-weight="800" 
      letter-spacing="3"
    >CARCONOMY</text>

    <text 
      x="${width / 2}" 
      y="${logoY + logoSize + 76}" 
      text-anchor="middle" 
      fill="#CCFF00" 
      font-family="'Geist', system-ui, sans-serif" 
      font-size="${Math.max(11, Math.round(width * 0.028))}" 
      font-weight="700" 
      letter-spacing="2"
    >AUTOMOTIVE FINANCIAL INTELLIGENCE</text>
  </svg>
  `;
}

async function generateAssets() {
  console.log('Generating Android icons and splash assets...');

  const mipmapDensities = [
    { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const { dir, size, fgSize } of mipmapDensities) {
    const targetDir = path.join(ANDROID_RES, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // ic_launcher.png
    await sharp(Buffer.from(getLauncherIconSvg(size, false)))
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // ic_launcher_round.png
    await sharp(Buffer.from(getLauncherIconSvg(size, true)))
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // ic_launcher_foreground.png
    await sharp(Buffer.from(getForegroundIconSvg(fgSize)))
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated ${dir} icons (${size}x${size}, fg ${fgSize}x${fgSize})`);
  }

  // Splash screens
  const splashConfigs = [
    { dir: 'drawable', w: 480, h: 800 },
    { dir: 'drawable-port-mdpi', w: 320, h: 480 },
    { dir: 'drawable-port-hdpi', w: 480, h: 800 },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
    { dir: 'drawable-land-mdpi', w: 480, h: 320 },
    { dir: 'drawable-land-hdpi', w: 800, h: 480 },
    { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
    { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
    { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
  ];

  for (const { dir, w, h } of splashConfigs) {
    const targetDir = path.join(ANDROID_RES, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    await sharp(Buffer.from(getSplashSvg(w, h)))
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`Generated ${dir}/splash.png (${w}x${h})`);
  }

  console.log('All Android assets generated successfully!');
}

generateAssets().catch((err) => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
