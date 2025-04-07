# ThreadTracker Firefox Extension

A browser extension for tracking and managing email threads in Outlook Web.

## Loading the Extension in Firefox

To load this extension directly in Firefox without packaging it as an XPI file:

1. Open Firefox
2. Enter `about:debugging` in the URL bar
3. Click on "This Firefox" in the left sidebar
4. Click on "Load Temporary Add-on..."
5. Navigate to this directory and select the `manifest.json` file
6. The extension will now be loaded and you should see its icon in the toolbar

## Features

- Track email threads and identify stalled conversations
- Visual indicators for thread status (active/stalled)
- Simple and clean interface
- Works with Outlook Web (outlook.com, office365.com, office.com)

## Files in this Directory

This directory contains the built version of the ThreadTracker extension, ready to load directly into Firefox:

- `manifest.json` - Extension configuration
- `index.html` - Popup UI structure
- `background.js` - Background script for handling notifications and storage
- `content.js` - Content script for interacting with Outlook web pages
- `browser-polyfill.js` - Firefox/Chrome compatibility layer
- `static/` - Directory containing compiled CSS and JavaScript

## Version

Current version: 1.0.0