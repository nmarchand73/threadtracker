// Background script for ThreadTracker

import browserAPI from '../utils/browserAPI';

console.log('ThreadTracker background script loaded');

// Initialize on installation
browserAPI.runtime.onInstalled.addListener(() => {
  console.log('ThreadTracker extension installed');
  
  // Initialize storage with default settings
  browserAPI.storage.local.set({
    threads: [],
    settings: {
      notificationsEnabled: true,
      stalledThresholdDays: 5,
      scanFrequency: 'daily'
    }
  });
});

// Listen for messages from content script
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'THREADS_UPDATED') {
    console.log('Received updated thread data:', message.data);
    
    // Store updated thread data
    browserAPI.storage.local.set({ threads: message.data }, () => {
      console.log('Thread data stored successfully');
    });
    
    // Check for stalled threads
    const stalledThreads = message.data.filter(thread => thread.status === 'stalled');
    console.log('Stalled threads:', stalledThreads);
    
    // Get settings to check if notifications are enabled
    browserAPI.storage.local.get('settings', (result) => {
      const settings = result.settings || { notificationsEnabled: true };
      
      // Send notifications for stalled threads if enabled
      if (settings.notificationsEnabled && stalledThreads.length > 0) {
        stalledThreads.forEach(thread => {
          browserAPI.notifications.create(`thread-${thread.id}`, {
            type: 'basic',
            iconUrl: 'icon48.svg',
            title: 'Stalled Thread Reminder',
            message: `Thread "${thread.subject}" has been stalled for ${getDaysSinceLastActivity(thread.lastActivity)} days.`,
            priority: 2
          });
        });
      }
    });
    
    sendResponse({ success: true });
    return true;
  }
});

// Helper function to calculate days since last activity
function getDaysSinceLastActivity(lastActivityDate) {
  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const diffTime = Math.abs(now - lastActivity);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
} 