/**
 * ThreadTracker Extension Deployment Script
 * 
 * This script automates the deployment process for the ThreadTracker Firefox extension.
 * It handles:
 * - Running the build process
 * - Creating a deployable package
 * - Packaging the extension for Firefox
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const skipZip = args.includes('--skip-zip');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const extensionDir = path.join(rootDir, 'extension');
const buildDir = path.join(extensionDir, 'build');
const readyToLoadDir = path.join(rootDir, 'extension_ready_to_load');
const deployDir = path.join(rootDir, 'deploy');
const logsDir = path.join(rootDir, 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create deploy directory if it doesn't exist
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// Current date for log files and versioning
const date = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
const versionDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

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
 * Run the setup script to build the extension
 */
function runSetup() {
  const logFile = `deploy-setup-${date}.log`;
  log(logFile, '=== Running setup script ===');
  
  if (skipBuild) {
    log(logFile, 'Build step skipped due to --skip-build flag');
    return true;
  }
  
  const setupScript = path.join(__dirname, 'setup.js');
  let setupCommand = `node ${setupScript}`;
  
  log(logFile, `Running setup script: ${setupCommand}`);
  const result = executeCommand(setupCommand, logFile);
  
  if (!result.success) {
    log(logFile, 'Setup failed. Check the log for details.');
    return false;
  }
  
  log(logFile, 'Setup completed successfully');
  return true;
}

/**
 * Create a ZIP archive of the extension files
 */
function createZipPackage() {
  const logFile = `deploy-zip-${date}.log`;
  log(logFile, '=== Creating ZIP package ===');
  
  if (skipZip) {
    log(logFile, 'ZIP creation skipped due to --skip-zip flag');
    return true;
  }
  
  // Check if ready-to-load directory exists
  if (!fs.existsSync(readyToLoadDir)) {
    log(logFile, `Ready-to-load directory not found at ${readyToLoadDir}`);
    return false;
  }
  
  // Get version from package.json or use date-based version
  let version = `${versionDate}`;
  try {
    const packageJsonPath = path.join(extensionDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.version) {
        version = packageJson.version;
      }
    }
  } catch (err) {
    log(logFile, `Warning: Failed to read package.json version: ${err.message}`);
    // Continue with date-based version
  }
  
  // Create deploy folder if it doesn't exist
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }
  
  // Create ZIP archive
  const zipFileName = `threadtracker-${version}.zip`;
  const zipFilePath = path.join(deployDir, zipFileName);
  
  // Remove existing zip file if it exists
  if (fs.existsSync(zipFilePath)) {
    try {
      fs.unlinkSync(zipFilePath);
      log(logFile, `Removed existing ZIP file: ${zipFilePath}`);
    } catch (err) {
      log(logFile, `Warning: Failed to remove existing ZIP file: ${err.message}`);
      // Continue anyway
    }
  }
  
  // Create ZIP file
  try {
    // Determine the ZIP command based on platform
    let zipCommand;
    if (process.platform === 'win32') {
      // Try to use PowerShell's Compress-Archive
      zipCommand = `powershell -Command "Compress-Archive -Path '${readyToLoadDir}\\*' -DestinationPath '${zipFilePath}'"`;
    } else {
      // Use zip command on Unix-like systems
      zipCommand = `zip -r "${zipFilePath}" "${readyToLoadDir}"/*`;
    }
    
    const result = executeCommand(zipCommand, logFile);
    if (!result.success) {
      log(logFile, 'Failed to create ZIP file. Check the log for details.');
      return false;
    }
    
    log(logFile, `Created ZIP file: ${zipFilePath}`);
  } catch (err) {
    log(logFile, `Failed to create ZIP file: ${err.message}`);
    return false;
  }
  
  // Create a summary file with version info
  const summaryPath = path.join(deployDir, 'deploy-summary.txt');
  try {
    const summary = `ThreadTracker Extension Deployment
Version: ${version}
Date: ${new Date().toISOString()}
Package: ${zipFileName}

This package contains the ready-to-load version of the ThreadTracker extension.
To load in Firefox:
1. Extract the ZIP file
2. Open Firefox and navigate to about:debugging
3. Click "This Firefox" and then "Load Temporary Add-on..."
4. Navigate to the extracted directory and select manifest.json
`;
    
    fs.writeFileSync(summaryPath, summary);
    log(logFile, `Created deployment summary at ${summaryPath}`);
  } catch (err) {
    log(logFile, `Warning: Failed to create summary file: ${err.message}`);
    // Continue despite this error
  }
  
  log(logFile, 'ZIP package created successfully');
  return true;
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log('=== ThreadTracker Firefox Extension Deployment ===');
  console.log('Options:');
  console.log(`  Skip build: ${skipBuild ? 'Yes' : 'No'}`);
  console.log(`  Skip ZIP creation: ${skipZip ? 'Yes' : 'No'}`);
  console.log('');
  
  // Step 1: Run setup
  if (!runSetup()) {
    console.log('❌ Setup failed. Deployment aborted.');
    return;
  }
  
  if (skipBuild) {
    console.log('⏩ Build step skipped as requested');
  } else {
    console.log('✅ Setup completed successfully');
  }
  
  // Step 2: Create ZIP package
  if (!createZipPackage()) {
    console.log('❌ ZIP package creation failed.');
    return;
  }
  
  if (skipZip) {
    console.log('⏩ ZIP creation skipped as requested');
  } else {
    console.log('✅ ZIP package created successfully');
  }
  
  // Deployment completed successfully
  console.log('\n=== Deployment Completed Successfully ===');
  console.log(`Your ThreadTracker Firefox extension is deployed to: ${deployDir}`);
  console.log('\nTo load the extension in Firefox:');
  console.log('1. Extract the ZIP file');
  console.log('2. Open Firefox and navigate to about:debugging');
  console.log('3. Click "This Firefox"');
  console.log('4. Click "Load Temporary Add-on..."');
  console.log('5. Navigate to the extracted directory and select manifest.json');
  console.log('\nUseful Commands:');
  console.log('- To skip the build step: node scripts/deploy.js --skip-build');
  console.log('- To skip ZIP creation: node scripts/deploy.js --skip-zip');
}

// Run the deployment
deploy().catch(err => {
  console.error('Deployment failed with error:', err);
  console.log('Please check logs directory for details');
}); 