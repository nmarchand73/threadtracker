/**
 * ThreadTracker Extension Setup Script
 * 
 * This script automates the setup and build process for the ThreadTracker Firefox extension.
 * It handles:
 * - Installing dependencies
 * - Building the extension
 * - Copying files to the ready-to-load directory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const fastBuild = args.includes('--fast-build');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const extensionDir = path.join(rootDir, 'extension');
const buildDir = path.join(extensionDir, 'build');
const readyToLoadDir = path.join(rootDir, 'extension_ready_to_load');
const logsDir = path.join(rootDir, 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Current date for log files
const date = new Date().toISOString().replace(/:/g, '-').slice(0, 19);

/**
 * Log to console and file
 */
function log(logFile, message) {
  console.log(message);
  fs.appendFileSync(path.join(logsDir, logFile), `${message}\n`);
}

/**
 * Execute command with error handling
 */
function executeCommand(command, logFile, options = {}) {
  try {
    log(logFile, `Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8', ...options });
    log(logFile, output);
    return { success: true, output };
  } catch (error) {
    log(logFile, `Error: ${error.message}`);
    if (error.stdout) log(logFile, `stdout: ${error.stdout}`);
    if (error.stderr) log(logFile, `stderr: ${error.stderr}`);
    return { success: false, error };
  }
}

/**
 * Install dependencies
 */
function installDependencies() {
  const logFile = `install-dependencies-${date}.log`;
  log(logFile, '=== Installing dependencies ===');
  
  try {
    process.chdir(extensionDir);
  } catch (err) {
    log(logFile, `Failed to change to extension directory: ${err.message}`);
    return false;
  }
  
  // First try installing with legacy peer deps
  log(logFile, 'Installing dependencies with --legacy-peer-deps...');
  const result = executeCommand('npm install --legacy-peer-deps', logFile);
  
  if (!result.success) {
    log(logFile, 'Primary installation method failed. Trying with --force...');
    const forceResult = executeCommand('npm install --force', logFile);
    
    if (!forceResult.success) {
      log(logFile, 'All installation methods failed. Please try manually installing dependencies.');
      return false;
    }
  }
  
  log(logFile, 'Dependencies installed successfully');
  return true;
}

/**
 * Build the extension
 */
function buildExtension() {
  const logFile = `build-extension-${date}.log`;
  log(logFile, '=== Building Firefox extension ===');
  
  if (skipBuild) {
    log(logFile, 'Build step skipped due to --skip-build flag');
    log(logFile, 'Using existing files in build directory');
    return true;
  }
  
  try {
    process.chdir(extensionDir);
  } catch (err) {
    log(logFile, `Failed to change to extension directory: ${err.message}`);
    return false;
  }
  
  // Use fast build if requested
  const buildCommand = fastBuild ? 'npm run build:fast' : 'npm run build';
  log(logFile, `Running build with command: ${buildCommand}`);
  log(logFile, 'This may take some time...');
  
  const result = executeCommand(buildCommand, logFile);
  
  if (!result.success) {
    log(logFile, 'Build failed. Check the log for details.');
    return false;
  }
  
  log(logFile, 'Firefox extension built successfully');
  return true;
}

/**
 * Copy build files to ready-to-load directory
 */
function copyToReadyToLoad() {
  const logFile = `copy-to-ready-load-${date}.log`;
  log(logFile, '=== Copying to extension_ready_to_load directory ===');
  
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    log(logFile, `Build directory not found at ${buildDir}`);
    return false;
  }
  
  // Create or clear ready-to-load directory
  try {
    if (fs.existsSync(readyToLoadDir)) {
      log(logFile, `Clearing existing directory: ${readyToLoadDir}`);
      // Delete all files in the directory but keep the directory itself
      const files = fs.readdirSync(readyToLoadDir);
      for (const file of files) {
        const filePath = path.join(readyToLoadDir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          // Recursively delete directory contents
          fs.rmdirSync(filePath, { recursive: true });
          log(logFile, `Removed directory: ${filePath}`);
        } else {
          fs.unlinkSync(filePath);
          log(logFile, `Removed file: ${filePath}`);
        }
      }
    } else {
      fs.mkdirSync(readyToLoadDir, { recursive: true });
      log(logFile, `Created directory: ${readyToLoadDir}`);
    }
  } catch (err) {
    log(logFile, `Failed to prepare directory ${readyToLoadDir}: ${err.message}`);
    return false;
  }
  
  // Copy all files from build directory
  try {
    log(logFile, `Copying all files from ${buildDir} to ${readyToLoadDir}`);
    
    // Function to recursively copy directory contents
    function copyDir(src, dest) {
      // Create destination directory if it doesn't exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      // Read source directory contents
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      // Copy each entry
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively copy subdirectory
          copyDir(srcPath, destPath);
          log(logFile, `Copied directory: ${entry.name}`);
        } else {
          // Copy file
          fs.copyFileSync(srcPath, destPath);
          log(logFile, `Copied file: ${entry.name}`);
        }
      }
    }
    
    // Start the recursive copy
    copyDir(buildDir, readyToLoadDir);
  } catch (err) {
    log(logFile, `Failed to copy build content: ${err.message}`);
    return false;
  }
  
  // Fix index.html to ensure direct loading of JavaScript and CSS
  try {
    const indexHtmlPath = path.join(readyToLoadDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // First, directly replace all %PUBLIC_URL% placeholders
      indexHtml = indexHtml.replace(/%PUBLIC_URL%\//g, '');
      indexHtml = indexHtml.replace(/%PUBLIC_URL%/g, '');
      
      // Check if browser-polyfill.js script reference still contains any template variables
      if (indexHtml.includes('script src="%') || indexHtml.includes('script src="moz-extension:')) {
        // If there are any problematic script references, replace them directly
        indexHtml = indexHtml.replace(/<script[^>]*src="[^"]*%[^"]*"[^>]*>/g, '<script src="browser-polyfill.js"></script>');
        indexHtml = indexHtml.replace(/<script[^>]*src="moz-extension:[^"]*%[^"]*"[^>]*>/g, '<script src="browser-polyfill.js"></script>');
      }
      
      // Make sure browser-polyfill.js is properly included
      if (!indexHtml.includes('<script src="browser-polyfill.js"></script>')) {
        indexHtml = indexHtml.replace(
          '<head>',
          '<head>\n  <script src="browser-polyfill.js"></script>'
        );
      }
      
      // Fix other HTML references
      indexHtml = indexHtml.replace(/<link[^>]*href="[^"]*%[^"]*"[^>]*>/g, ''); // Remove problematic links
      indexHtml = indexHtml.replace(/<link[^>]*href="moz-extension:[^"]*%[^"]*"[^>]*>/g, ''); // Remove problematic extension URLs
      
      // Fix manifest reference
      indexHtml = indexHtml.replace(/<link[^>]*href="[^"]*manifest\.json"[^>]*>/g, '<link rel="manifest" href="manifest.json" />');
      
      // Remove any references to non-existent files
      indexHtml = indexHtml.replace(/<link[^>]*href="[^"]*\.(?:png|ico)"[^>]*>/g, '');
      
      // Add reference to static CSS and JS if they're missing
      if (!indexHtml.includes('static/css') && fs.existsSync(path.join(readyToLoadDir, 'static', 'css'))) {
        // Find CSS files in static/css directory
        const cssFiles = fs.readdirSync(path.join(readyToLoadDir, 'static', 'css'))
          .filter(file => file.endsWith('.css'));
        
        if (cssFiles.length > 0) {
          const cssFile = cssFiles[0]; // Get the first CSS file
          indexHtml = indexHtml.replace(
            '</head>',
            `  <link rel="stylesheet" href="static/css/${cssFile}">\n</head>`
          );
          log(logFile, `Added CSS link to index.html: ${cssFile}`);
        }
      }
      
      if (!indexHtml.includes('static/js') && fs.existsSync(path.join(readyToLoadDir, 'static', 'js'))) {
        // Find JS files in static/js directory
        const jsFiles = fs.readdirSync(path.join(readyToLoadDir, 'static', 'js'))
          .filter(file => file.endsWith('.js') && !file.endsWith('.LICENSE.txt'));
        
        if (jsFiles.length > 0) {
          const jsFile = jsFiles[0]; // Get the first JS file
          indexHtml = indexHtml.replace(
            '</body>',
            `  <script src="static/js/${jsFile}"></script>\n</body>`
          );
          log(logFile, `Added JS script to index.html: ${jsFile}`);
        }
      }
      
      // Double-check to ensure no %PUBLIC_URL% references remain
      if (indexHtml.includes('%PUBLIC_URL%')) {
        log(logFile, 'Warning: Some %PUBLIC_URL% references still found after processing, attempting final cleanup');
        indexHtml = indexHtml.replace(/%PUBLIC_URL%[^"]*\//g, '');
        indexHtml = indexHtml.replace(/%PUBLIC_URL%[^"]*"/g, '"');
      }
      
      fs.writeFileSync(indexHtmlPath, indexHtml);
      log(logFile, `Updated index.html at ${indexHtmlPath}`);
      
      // Double-check the output file
      const updatedHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      if (updatedHtml.includes('%PUBLIC_URL%')) {
        log(logFile, 'ERROR: %PUBLIC_URL% placeholders still exist in the final index.html');
      } else {
        log(logFile, 'Successfully removed all %PUBLIC_URL% placeholders from index.html');
      }
    }
  } catch (err) {
    log(logFile, `Warning: Failed to update index.html: ${err.message}`);
    // Continue despite this error as it's not critical
  }
  
  // Create README.md with instructions
  const readmePath = path.join(readyToLoadDir, 'README.md');
  const readmeContent = `# ThreadTracker Firefox Extension

A browser extension for tracking and managing email threads in Outlook Web.

## Loading the Extension in Firefox

To load this extension directly in Firefox without packaging it as an XPI file:

1. Open Firefox
2. Enter \`about:debugging\` in the URL bar
3. Click on "This Firefox" in the left sidebar
4. Click on "Load Temporary Add-on..."
5. Navigate to this directory and select the \`manifest.json\` file
6. The extension will now be loaded and you should see its icon in the toolbar

## Features

- Track email threads and identify stalled conversations
- Visual indicators for thread status (active/stalled)
- Simple and clean interface
- Works with Outlook Web (outlook.com, office365.com, office.com)

## Files in this Directory

This directory contains the built version of the ThreadTracker extension, ready to load directly into Firefox:

- \`manifest.json\` - Extension configuration
- \`index.html\` - Popup UI structure
- \`background.js\` - Background script for handling notifications and storage
- \`content.js\` - Content script for interacting with Outlook web pages
- \`browser-polyfill.js\` - Firefox/Chrome compatibility layer
- \`static/\` - Directory containing compiled CSS and JavaScript

## Version

Current version: 1.0.0`;
  
  try {
    fs.writeFileSync(readmePath, readmeContent);
    log(logFile, `Created README.md at ${readmePath}`);
  } catch (err) {
    log(logFile, `Warning: Failed to create README.md: ${err.message}`);
    // Continue despite this error
  }
  
  // Final check to ensure essential files are present
  const essentialFiles = ['manifest.json', 'browser-polyfill.js', 'index.html'];
  const missingFiles = essentialFiles.filter(file => !fs.existsSync(path.join(readyToLoadDir, file)));
  
  if (missingFiles.length > 0) {
    log(logFile, `Error: Essential files are missing: ${missingFiles.join(', ')}`);
    return false;
  }
  
  log(logFile, 'Files copied to ready-to-load directory successfully');
  return true;
}

/**
 * Main setup function
 */
async function setup() {
  console.log('=== ThreadTracker Firefox Extension Setup ===');
  console.log('Options:');
  console.log(`  Skip build: ${skipBuild ? 'Yes' : 'No'}`);
  console.log(`  Fast build: ${fastBuild ? 'Yes' : 'No'}`);
  console.log('');
  
  // Step 1: Install dependencies (if needed)
  if (!skipBuild) {
    if (!installDependencies()) {
      console.log('❌ Dependency installation failed. Check logs for details.');
      return;
    }
    console.log('✅ Dependencies installed successfully');
  } else {
    console.log('⏩ Dependency installation skipped (--skip-build)');
  }
  
  // Step 2: Build the extension
  if (!buildExtension()) {
    console.log('❌ Extension build failed.');
    if (!skipBuild) {
      console.log('You can run the setup with --skip-build to skip the build step.');
    }
    return;
  }
  
  if (skipBuild) {
    console.log('⏩ Build step skipped as requested');
  } else {
    console.log('✅ Extension built successfully');
  }
  
  // Step 3: Copy to ready-to-load directory
  if (!copyToReadyToLoad()) {
    console.log('❌ Copying to ready-to-load directory failed.');
    return;
  }
  console.log('✅ Files copied to ready-to-load directory successfully');
  
  // Setup completed successfully
  console.log('\n=== Setup Completed Successfully ===');
  console.log('Your ThreadTracker Firefox extension is ready!');
  console.log('\nTo load the extension in Firefox:');
  console.log('1. Open Firefox');
  console.log('2. Navigate to about:debugging');
  console.log('3. Click "This Firefox"');
  console.log('4. Click "Load Temporary Add-on..."');
  console.log('5. Navigate to the "extension_ready_to_load" folder and select the manifest.json file');
  console.log('\nFor troubleshooting, check the log files in the logs/ directory.');
  console.log('\nUseful Commands:');
  console.log('- To skip the build step: node scripts/setup.js --skip-build');
  console.log('- For a faster build: node scripts/setup.js --fast-build');
}

// Run the setup
setup().catch(err => {
  console.error('Setup failed with error:', err);
  console.log('Please check logs directory for details');
}); 