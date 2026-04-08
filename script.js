// Color Palette Initialization
const palettes = [
  ['#ffffff', '#7de2ff', '#6a4dff', '#ff5fb2'],
  ['#fdfcff', '#66d9ff', '#5b3dff', '#ff4fa3'],
  ['#ffffff', '#8be9ff', '#7a5cff', '#ff6ec7']
];
const chosen = palettes[Math.floor(Math.random() * palettes.length)];
const root = document.documentElement;
chosen.forEach((c, i) => root.style.setProperty(`--bg${i+1}`, c));

// DOM Elements
const input = document.getElementById('qrInput');
const generateBtn = document.getElementById('generateBtn');
const qrBox = document.getElementById('qrBox');
const qrCanvasWrap = document.getElementById('qrCanvasWrap');
const downloadBtn = document.getElementById('downloadBtn');
const themeToggle = document.getElementById('themeToggle');
const bubbleLayer = document.getElementById('bubbleLayer');
let currentQRValue = '';

// Generate QR Code
function buildQR(text) {
  qrCanvasWrap.innerHTML = '';
  new QRCode(qrCanvasWrap, {
    text,
    width: 240,
    height: 240,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

generateBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) return;
  
  currentQRValue = value;
  buildQR(value);
  createBubbles();
  
  qrBox.style.display = 'block';
  downloadBtn.style.display = 'inline-block';
});

// Download Functionality
downloadBtn.addEventListener('click', () => {
  const sourceCanvas = qrCanvasWrap.querySelector('canvas');
  const sourceImg = qrCanvasWrap.querySelector('img');
  const source = sourceCanvas || sourceImg;
  
  if (!source) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1080; 
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 240, 180, 600, 600);

  // Generate badge based on link
  const getBadge = (url) => {
    try {
      const host = new URL(url).hostname.replace('www.', '');
      if (host.includes('github')) return { text: 'GH', bg: '#111111' };
      if (host.includes('google')) return { text: 'G', bg: '#4285F4' };
      if (host.includes('youtube')) return { text: 'YT', bg: '#FF0000' };
      if (host.includes('instagram')) return { text: 'IG', bg: '#E1306C' };
      return { text: host.slice(0, 2).toUpperCase(), bg: '#6a4dff' };
    } catch {
      return { text: 'QR', bg: '#6a4dff' };
    }
  };

  const badge = getBadge(currentQRValue);
  
  ctx.fillStyle = badge.bg;
  ctx.beginPath();
  ctx.arc(540, 1380, 70, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 42px Poppins';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge.text, 540, 1380);

  const link = document.createElement('a');
  link.download = 'styled_qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Bubble Animation
function createBubbles() {
  for (let i = 0; i < 14; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = 10 + Math.random() * 28;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${10 + Math.random() * 80}%`;
    bubble.style.animationDuration = `${1.8 + Math.random() * 1.6}s`;
    
    bubbleLayer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 3500);
  }
}

// Theme Toggle
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

// Loader Screen Timeout
const loaderScreen = document.getElementById('loaderScreen');
setTimeout(() => {
  loaderScreen.classList.add('hide');
}, 2600);

// Basic test hook
window.__qr_test__ = () => !!document.getElementById('generateBtn');