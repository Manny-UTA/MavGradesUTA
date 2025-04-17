console.log('Content script injected!');

let chatContainer = null;
let isChatbotVisible = false;

// Function to create the chatbot container with the iframe
function createChatbotContainer() {
  if (chatContainer) return; // Only create it once

  chatContainer = document.createElement('div');
  chatContainer.id = 'blaze-jr-chatbot-container';
  // ... (styling for the container: fixed position, size, etc.) ...

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('Chatbot-Structure/Frontend/index.html'); // ADJUST THIS PATH IF NEEDED
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  chatContainer.appendChild(iframe);
  document.body.appendChild(chatContainer);
  console.log('Chatbot container with iframe created.');
}

// Function to toggle the chatbot visibility
function toggleChatbot() {
  if (!chatContainer) {
    createChatbotContainer();
  }
  isChatbotVisible = !isChatbotVisible;
  chatContainer.style.display = isChatbotVisible ? 'block' : 'none';
  console.log('Chatbot visibility toggled:', isChatbotVisible);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'toggleChatbot') {
      toggleChatbot();
    }
  }
);

// Create the container when the content script is injected (optional - you can rely solely on the icon click)
createChatbotContainer();