// This script creates placeholder icon files for development
// In a production app, you would use actual designed icons

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create simple SVG icon with 'TT' text for ThreadTracker
const createSvgIcon = (size) => {
  const fontSize = size < 48 ? size/2 : size/3;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#0078D4"/>
    <text x="${size/2}" y="${size/2 + fontSize/4}" 
          font-family="Arial" font-size="${fontSize}" font-weight="bold" 
          fill="white" text-anchor="middle">TT</text>
  </svg>`;
};

// Create icons of different sizes needed for Firefox extension
const iconSizes = [16, 48, 128];

iconSizes.forEach(size => {
  const iconPath = path.join(publicDir, `icon${size}.svg`);
  fs.writeFileSync(iconPath, createSvgIcon(size));
  console.log(`Created icon: ${iconPath}`);
});

console.log('Icon generation complete!'); 