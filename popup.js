
    document.addEventListener('DOMContentLoaded', () => {
      const deployButton = document.getElementById('deployButton');
      deployButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          chrome.runtime.sendMessage({ action: 'deployChatbot' }, (response) => {
            if (response && response.success) {
              console.log('Chatbot deployment message sent.');
              window.close(); // Close the popup after sending the message
            } else {
              console.error('Failed to send deployment message.');
            }
          });
        });
      });
    });