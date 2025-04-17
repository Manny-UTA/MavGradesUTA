chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'deployChatbot') {
      try {
        const response = await fetch(chrome.runtime.getURL('Chatbot-Structure/Frontend/pop.js'));
        if (!response.ok) {
          console.error(`Failed to fetch pop.js: ${response.status} ${response.statusText}`);
          sendResponse({ success: false, error: `Failed to fetch pop.js: ${response.status} ${response.statusText}` });
          return true;
        }
        const scriptCode = await response.text();
  
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs.length > 0) {
          const activeTabId = tabs[0].id;
          try {
            await chrome.scripting.executeScript({
              target: { tabId: activeTabId },
              func: (code) => {
                console.log('Injecting MavBuddy chatbot...');
                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
              },
              args: [scriptCode],
            });
            console.log('MavBuddy chatbot deployment initiated on tab:', activeTabId);
            sendResponse({ success: true });
          } catch (scriptError) {
            console.error('Error injecting script:', scriptError);
            sendResponse({ success: false, error: `Error injecting script: ${scriptError.message}` });
          }
        } else {
          console.error('Could not get active tab to deploy chatbot.');
          sendResponse({ success: false, error: 'Could not get active tab.' });
        }
  
      } catch (error) {
        console.error('Failed to deploy MavBuddy chatbot (outer try):', error);
        sendResponse({ success: false, error: error.message });
      }
      return true; // Keep the message port open until sendResponse is called
    }
  });