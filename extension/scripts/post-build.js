const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load environment variables
require('dotenv').config();

// Paths
const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const manifestSrc = path.join(publicDir, 'manifest.json');
const manifestDest = path.join(buildDir, 'manifest.json');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy and modify manifest.json for build
console.log('Processing manifest.json for build...');

if (fs.existsSync(manifestSrc)) {
  let manifestContent = fs.readFileSync(manifestSrc, 'utf8');
  
  // Replace environment variables if needed
  if (process.env.MICROSOFT_CLIENT_ID) {
    manifestContent = manifestContent.replace('${MICROSOFT_CLIENT_ID}', process.env.MICROSOFT_CLIENT_ID);
  }
  
  // Write the modified manifest to build directory
  fs.writeFileSync(manifestDest, manifestContent);
  console.log('Manifest processed and copied to build directory');
} else {
  console.error('Error: manifest.json not found at', manifestSrc);
  process.exit(1);
}

// Process other files for Firefox extension
console.log('Processing build files for Firefox extension...');

// Use webpack to bundle the background and content scripts
try {
  console.log('Running webpack to bundle scripts...');
  exec('npx webpack --config webpack.config.js', (error, stdout, stderr) => {
    if (error) {
      console.error('Error running webpack:', error);
      console.error(stderr);
      return;
    }
    
    console.log(stdout);
    console.log('Scripts bundled successfully');
    
    // Copy icon files
    console.log('Copying icon files...');
    const iconSizes = [16, 48, 128];
    
    iconSizes.forEach(size => {
      const iconSrc = path.join(publicDir, `icon${size}.svg`);
      const iconDest = path.join(buildDir, `icon${size}.svg`);
      
      if (fs.existsSync(iconSrc)) {
        fs.copyFileSync(iconSrc, iconDest);
      } else {
        console.warn(`Warning: icon${size}.svg not found at ${iconSrc}`);
      }
    });
    
    console.log('Post-build processing completed successfully!');
  });
} catch (err) {
  console.error('Error in post-build process:', err);
  process.exit(1);
} 