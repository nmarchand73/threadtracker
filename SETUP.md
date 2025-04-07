# ThreadTracker Firefox Extension Setup Guide

This document provides detailed instructions for setting up the ThreadTracker Firefox extension for development and testing.

## Quick Setup

For most users, the automated setup script is the easiest way to get started:

```bash
node setup.js
```

If the automated setup works for you, no need to read further. If you encounter issues, the detailed manual setup instructions below will help you troubleshoot.

## Manual Setup Steps

### Prerequisites

- **Node.js**: Version 16.x or 18.x recommended for best compatibility
- **npm**: Should be installed with Node.js
- **Firefox**: Latest version recommended (Developer Edition preferred for extension development)
- **Babel & Webpack**: For script transpilation and bundling

### 1. Firefox Developer Setup

Firefox Developer Edition provides additional tools for extension development:

1. Download [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
2. Enable addon debugging:
   - Navigate to `about:config`
   - Set `devtools.chrome.enabled` to `true`
   - Set `devtools.debugger.remote-enabled` to `true`

### 2. Install Dependencies

```bash
# Navigate to the extension directory
cd extension

# Standard installation (try this first)
npm install --legacy-peer-deps

# If that fails, try installing specific dependencies
npm install ajv@8.12.0 ajv-keywords@5.1.0 --save --legacy-peer-deps

# If still having issues, try with force flag
npm install --force

# Ensure the WebExtension polyfill is installed
npm install webextension-polyfill --save
```

The `--legacy-peer-deps` flag is used because some dependencies may have peer dependency conflicts with React and other libraries.

### 3. Generate Icons

The extension needs SVG icon files in different sizes. You can generate them using:

```bash
node scripts/create-icons.js
```

If this script fails or doesn't exist, you can manually create icons:

1. Create icon files named `icon16.svg`, `icon48.svg`, and `icon128.svg` in the `extension/public` directory
2. Firefox recommends SVG files for better scaling and rendering

### 4. Copy Browser Polyfill

Ensure the WebExtension polyfill is copied to the public directory:

```bash
# Create public directory if it doesn't exist
mkdir -p public

# Copy from node_modules to public
cp node_modules/webextension-polyfill/dist/browser-polyfill.js public/
```

### 5. Build the Extension

```bash
npm run build
```

This will:
1. Bundle background and content scripts using webpack
2. Copy static files and the browser polyfill
3. Process the manifest.json for Firefox
4. Create the built extension in the `extension/build` directory

### 6. Load the Extension in Firefox

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" 
4. Click "Load Temporary Add-on..."
5. Navigate to the `extension/build` directory
6. Select the `manifest.json` file

The extension should now be loaded and active in Firefox.

## Troubleshooting

### Firefox-Specific Issues

#### Extension Not Loading

- Ensure the `manifest.json` has the correct `browser_specific_settings` section:
  ```json
  "browser_specific_settings": {
    "gecko": {
      "id": "threadtracker@example.com",
      "strict_min_version": "57.0"
    }
  }
  ```
- Check Firefox console (F12) for any errors after loading the extension
- Make sure icons are in SVG format and properly referenced

#### Polyfill Issues

If you see errors about missing browser APIs:
- Ensure the browser-polyfill.js file is properly included in both the manifest.json and HTML files
- Check that it's loaded before any extension scripts
- Verify that the browserAPI utility is consistently used throughout your code

### Node.js Version Issues

If you're using a newer version of Node.js (like v20+), you might encounter compatibility issues with older packages. Consider using Node.js v16 or v18 for better compatibility.

You can use a Node version manager like [nvm](https://github.com/nvm-sh/nvm) to switch between Node.js versions:

```bash
# Install and use Node.js v18
nvm install 18
nvm use 18
```

### Dependency Errors

#### Missing ajv/dist/compile/codegen

If you see an error like:

```
Module not found: Can't resolve 'ajv/dist/compile/codegen'
```

Try installing specific versions of ajv:

```bash
npm install ajv@8.12.0 ajv-keywords@5.1.0 --save --legacy-peer-deps
```

#### Other Dependency Issues

Clear npm cache and try reinstalling:

```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### Build Errors

If the build fails:

1. Check the error messages for specific issues
2. Look at the logs in the `logs/` directory
3. Try building with verbose output:

```bash
npm run build -- --verbose
```

### Firefox Extension Testing

For better development workflow:

1. Install the [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool:
   ```bash
   npm install -g web-ext
   ```

2. Run your extension with automatic reloading:
   ```bash
   cd extension/build
   web-ext run
   ```

This provides a cleaner testing experience than using about:debugging.

## Development Workflow

Once set up, you can use the following workflow for development:

1. Make changes to the code
2. Run `npm run build` to rebuild the extension
3. In Firefox, go to `about:debugging` > "This Firefox" > find ThreadTracker and click "Reload"
4. Test your changes

For faster development, you can use:

```bash
npm run watch
```

This will automatically rebuild the extension when files change, though you'll still need to reload the extension in Firefox.

## Logs

The setup script and build process create logs in the `logs/` directory. If you encounter issues, check these logs for detailed error messages and debugging information. 