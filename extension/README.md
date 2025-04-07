# ThreadTracker Chrome Extension

A Chrome extension for tracking and managing stalled email threads in Outlook Web.

## Features

- **Thread Detection:** Automatically identifies email threads without response for configured time periods
- **Status Visualization:** Color-coded indicators show thread status directly in your inbox
- **Reminder System:** Get notified when threads need attention
- **Follow-up Tools:** Create follow-up emails from templates with one click

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm
- Chrome browser

### Installation

1. Clone the repository
```
git clone <repository-url>
cd threadtracker
```

2. Install dependencies
```
cd extension
npm install
```

3. Generate icons (development only)
```
node scripts/create-icons.js
```

4. Get a Microsoft Client ID

To use this extension with Microsoft authentication, you'll need to:
- Register an application in the Azure Portal
- Create an OAuth 2.0 client ID
- Replace the placeholder in manifest.json with your client ID

### Development

Start the development server:
```
npm start
```

Load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension/build` directory

### Building for Production

Build the extension for production:
```
npm run build
```

This will create a production build in the `extension/build` directory that can be submitted to the Chrome Web Store.

## Project Structure

- `public/` - Static assets
- `src/` - Source code
  - `components/` - React components
  - `utils/` - Utility functions
  - `background/` - Background script
  - `content/` - Content script for Outlook Web integration
- `scripts/` - Build and utility scripts

## Current Status

This is an MVP (Minimum Viable Product) version focused on core functionality. See the PLAN.md file in the repository root for the development roadmap. 