# ThreadTracker

A Firefox extension to help track and manage email threads in Outlook Web.

## Features

- Track email threads and identify stalled conversations
- Visual indicators for thread status (active/stalled)
- Simple and clean interface
- Works with Outlook Web (outlook.com, office365.com, office.com)

## Installation

### Quick Setup

To quickly set up the ThreadTracker extension:

1. Clone this repository
2. Run the setup script:
   ```
   node scripts/setup.js
   ```
3. The script will:
   - Install required dependencies
   - Build the extension
   - Copy all necessary files to the `extension_ready_to_load` directory

### Loading in Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click on "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the `extension_ready_to_load` directory and select any file (like `manifest.json`)

The extension will now be loaded and available from the Firefox toolbar.

## Development

### Project Structure

- `extension/` - Main extension source files
  - `src/` - React source code
  - `public/` - Static files
  - `build/` - Built extension output
- `extension_ready_to_load/` - Ready-to-load Firefox extension
- `scripts/` - Utility scripts for building and deploying
  - `setup.js` - Sets up the extension for development and testing
  - `deploy.js` - Creates a distributable package
- `logs/` - Log files from build process

### Available Scripts

#### Setup Script

```
node scripts/setup.js [options]
```

Options:
- `--skip-build`: Skip the build step (uses existing files)
- `--fast-build`: Use faster build settings (development mode)

#### Deployment Script

```
node scripts/deploy.js [options]
```

Options:
- `--skip-build`: Skip the build step
- `--skip-zip`: Skip creating a ZIP archive

### Manual Setup

For detailed instructions on setting up the extension manually, please refer to [SETUP.md](SETUP.md).

## Troubleshooting

If you encounter issues during setup:

1. Check the log files in the `logs/` directory for error details
2. Ensure you have Node.js installed (v16 or later recommended)
3. Try the setup script with the `--skip-build` option if the build process fails
4. For dependency issues, you can manually run `npm install --legacy-peer-deps` in the `extension` directory

## License

MIT License 