// Background script that supports the mavgrades.com content script

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is fully loaded and is a mavgrades.com URL
  if (changeInfo.status === 'complete' && 
     (tab.url.includes('mavgrades.com') || tab.url.includes('mavgrades.uta.edu'))) {
    
    console.log('MavGrades site detected:', tab.url);
    
    // Send message to content script to ensure pop.js is running
    chrome.tabs.sendMessage(tabId, { action: 'deployChatbot' })
      .catch(error => {
        // This is normal if the content script hasn't loaded yet
        console.log('Could not send message to content script yet:', error);
      });
  }
});

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log('MavBuddy extension installed or updated');
});