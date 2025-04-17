console.log('MavBuddy content script injected on mavgrades.com');

// Function to inject the pop.js script into the page
function injectPopScript() {
  console.log('Injecting pop.js script into mavgrades.com...');
  
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('pop.js');
  script.onload = function() {
    console.log('pop.js script loaded successfully on mavgrades.com!');
  };
  script.onerror = function() {
    console.error('Failed to load pop.js script!');
  };
  
  document.head.appendChild(script);
}

// Check if we are on mavgrades.com
const currentUrl = window.location.href;
if (currentUrl.includes('mavgrades.com') || currentUrl.includes('mavgrades.uta.edu')) {
  // Automatically inject the script when the page is loaded
  if (document.readyState === 'loading') {
    // If document is still loading, wait for it to complete
    document.addEventListener('DOMContentLoaded', injectPopScript);
  } else {
    // Document is already loaded, inject immediately
    injectPopScript();
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'deployChatbot') {
      injectPopScript();
    }
  }
);