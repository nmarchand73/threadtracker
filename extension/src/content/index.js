// Content script for ThreadTracker
import browserAPI from '../utils/browserAPI';

console.log('ThreadTracker content script loaded');

// Mock data for thread detection
const mockThreads = [
  {
    id: '1',
    subject: 'Project Status Update',
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'active',
    participants: ['john.doe@example.com', 'jane.smith@example.com']
  },
  {
    id: '2',
    subject: 'Budget Approval Request',
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'stalled',
    participants: ['finance@example.com', 'your.email@example.com']
  },
  {
    id: '3',
    subject: 'Meeting Schedule for Next Week',
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: 'stalled',
    participants: ['team@example.com', 'your.email@example.com']
  }
];

// Function to detect Outlook interface and initialize
function initializeThreadTracker() {
  // Check if we're in Outlook Web
  if (window.location.href.includes('outlook.office') || 
      window.location.href.includes('outlook.live')) {
    console.log('Outlook Web detected, initializing ThreadTracker');
    
    // In a real implementation, we'd scan the DOM for email threads
    // For now, we'll just use our mock data and simulate scanning
    
    setTimeout(() => {
      console.log('Scanning for email threads...');
      
      // Send mock data to background script
      browserAPI.runtime.sendMessage({
        type: 'THREADS_UPDATED',
        data: mockThreads
      }, (response) => {
        if (response && response.success) {
          console.log('Thread data successfully sent to background script');
          
          // In a real implementation, we would now add visual indicators to the UI
          addVisualIndicators();
        }
      });
    }, 2000); // Simulate a delay for scanning
  }
}

// Function to add visual indicators to the UI
function addVisualIndicators() {
  console.log('Adding visual indicators to Outlook UI');
  
  // In a real implementation, we would:
  // 1. Find all email threads in the DOM
  // 2. Match them with our tracked threads
  // 3. Add colored indicators based on status
  
  // For this MVP, we'll just log the concept
  console.log('Visual indicators would be added here in the actual implementation');
}

// Listen for messages from the background script
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCAN_THREADS') {
    // Trigger a new scan
    console.log('Received request to scan threads');
    
    // In a real implementation, we would scan the DOM again
    // For now, we'll just send our mock data again
    browserAPI.runtime.sendMessage({
      type: 'THREADS_UPDATED',
      data: mockThreads
    });
    
    sendResponse({ success: true });
  }
  
  // Return true to indicate we'll send the response asynchronously
  return true;
});

// Initialize ThreadTracker when the page is loaded
window.addEventListener('load', initializeThreadTracker);

// Also check when URL changes (for single-page apps like Outlook Web)
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (lastUrl !== window.location.href) {
    lastUrl = window.location.href;
    initializeThreadTracker();
  }
}).observe(document, { subtree: true, childList: true }); 