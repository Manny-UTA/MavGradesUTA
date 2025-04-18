/** MavGrades Chat Widget with UTA-inspired gradient theme 

Paste this script into browser console */

(function() {
    const style = document.createElement('style');
    style.textContent = `
      /* Chat Widget Styles */
      #mavgrades-chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        transition: all 0.3s ease;
      }
  
      #mavgrades-chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(to bottom right, #004f94, #4b2600);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
      }
  
      #mavgrades-chat-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
  
      #mavgrades-chat-icon {
        width: 30px;
        height: 30px;
      }
  
      #mavgrades-chat-popup {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        min-width: 300px;
        min-height: 400px;
        background-color: #f7f7f8;
        border-radius: 12px;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        resize: none; /* Changed from 'both' to 'none' to remove the default resize handle */
      }
  
      #mavgrades-chat-widget.open #mavgrades-chat-popup {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }
  
      #mavgrades-chat-header {
        padding: 15px;
        background: linear-gradient(to right, #004f94, #4b2600);
        color: white;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
  
      #mavgrades-chat-title {
        font-size: 16px;
      }
  
      .mavgrades-header-buttons {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      #mavgrades-new-chat {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      #mavgrades-new-chat:hover {
        background: rgba(255, 255, 255, 0.3);
      }
  
      #mavgrades-resize-toggle,
      #mavgrades-chat-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
      }
  
      #mavgrades-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f5f5f7;
        display: flex;
        flex-direction: column;
      }
  
      .mavgrades-message {
        display: flex;
        margin-bottom: 15px;
        gap: 10px;
        max-width: 85%;
      }
  
      .mavgrades-user-message {
        margin-left: auto;
        flex-direction: row-reverse;
      }
  
      .mavgrades-message-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 14px;
      }
  
      .mavgrades-assistant-avatar {
        background-color: #004f94;
        color: white;
      }
  
      .mavgrades-user-avatar {
        background-color: #e1e1e6;
        color: #333;
      }
  
      .mavgrades-message-bubble {
        padding: 10px 14px;
        border-radius: 18px;
        line-height: 1.4;
        font-size: 14px;
      }
  
      .mavgrades-assistant-bubble {
        background-color: white;
        color: #333;
        border-top-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
  
      .mavgrades-user-bubble {
        background-color: #F58025;
        color: white;
        border-top-right-radius: 4px;
      }

  
      #mavgrades-chat-input-area {
        padding: 15px;
        border-top: 1px solid #e1e1e6;
        background-color: white;
        display: flex;
      }
  
      #mavgrades-chat-input {
        flex: 1;
        border: 1px solid #e1e1e6;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 14px;
        resize: none;
        height: 38px;
        min-height: 38px;
        max-height: 120px;
        outline: none;
        font-family: inherit;
      }
  
      #mavgrades-chat-input:focus {
        border-color: #004f94;
      }
  
      #mavgrades-chat-send {
        background-color: #004f94;
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-left: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
  
      #mavgrades-chat-send:hover {
        opacity: 1;
        background-color: #003366;
      }
  
      #mavgrades-chat-send:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
  
      #mavgrades-resize-handle {
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 16px;
        cursor: nwse-resize;
        background: rgba(0, 79, 148, 0.2);
        border-radius: 0 0 12px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: rgba(0, 79, 148, 0.8);
        user-select: none;
        z-index: 1;
      }
  
      #mavgrades-resize-handle:hover {
        background: rgba(0, 79, 148, 0.3);
      }
  
      .mavgrades-typing-indicator {
        display: flex;
        padding: 10px 14px;
        background: white;
        border-radius: 18px;
        border-top-left-radius: 4px;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        margin-bottom: 15px;
        max-width: 85%;
        width: max-content;
      }
  
      .mavgrades-typing-dot {
        width: 6px;
        height: 6px;
        background-color: #888;
        border-radius: 50%;
        margin: 0 2px;
        animation: mavgrades-typing 1.4s infinite ease-in-out both;
      }
  
      .mavgrades-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .mavgrades-typing-dot:nth-child(2) { animation-delay: -0.16s; }
  
      @keyframes mavgrades-typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
  
      .mavgrades-message-bubble a {
        color: #004f94;
        text-decoration: underline;
      }
  
      .mavgrades-message-bubble code {
        font-family: monospace;
        background-color: rgba(0, 0, 0, 0.07);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 13px;
      }
  
      .mavgrades-message-bubble pre {
        background-color: rgba(0, 0, 0, 0.07);
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
        margin: 5px 0;
      }
  
      .mavgrades-message-bubble pre code {
        background: none;
        padding: 0;
      }
  
      @media (max-width: 480px) {
        #mavgrades-chat-popup {
          width: 300px;
        }
      }
    `;
    document.head.appendChild(style);
  

    // Create HTML structure
    const widgetHTML = `
        <div id="mavgrades-chat-button">
            <svg id="mavgrades-chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </div>
        <div id="mavgrades-chat-popup">
            <div id="mavgrades-resize-handle">⬉</div>
            <div id="mavgrades-chat-header">
                <div id="mavgrades-chat-title">MavBuddy</div>
                <div class="mavgrades-header-buttons">
                    <button id="mavgrades-new-chat">New Chat</button>
                    <button id="mavgrades-resize-toggle" title="Toggle full size">⤢</button>
                    <button id="mavgrades-chat-close">✕</button>
                </div>
            </div>
            <div id="mavgrades-chat-messages"></div>
            <div id="mavgrades-chat-input-area">
                <textarea id="mavgrades-chat-input" placeholder="Type your question..." rows="1"></textarea>
                <button id="mavgrades-chat-send" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Create main container
    const widget = document.createElement('div');
    widget.id = 'mavgrades-chat-widget';
    widget.innerHTML = widgetHTML;
    document.body.appendChild(widget);

    // Cookie management functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) {
                try {
                    return JSON.parse(decodeURIComponent(c.substring(nameEQ.length)));
                } catch (e) {
                    console.error('Error parsing cookie:', e);
                    return null;
                }
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    // DOM references
    const chatButton = document.getElementById('mavgrades-chat-button');
    const chatPopup = document.getElementById('mavgrades-chat-popup');
    const closeButton = document.getElementById('mavgrades-chat-close');
    const newChatButton = document.getElementById('mavgrades-new-chat');
    const messagesContainer = document.getElementById('mavgrades-chat-messages');
    const inputField = document.getElementById('mavgrades-chat-input');
    const sendButton = document.getElementById('mavgrades-chat-send');
    const resizeHandle = document.getElementById('mavgrades-resize-handle');
    const resizeToggle = document.getElementById('mavgrades-resize-toggle');

    // Track if in fullscreen mode
    let isFullSize = false;
    let prevWidth, prevHeight, prevPosition;

    // Setup resize functionality
    let isResizing = false;
    let initialWidth, initialHeight, initialX, initialY;

    resizeHandle.addEventListener('mousedown', initResize);
    resizeToggle.addEventListener('click', toggleFullSize);

    function initResize(e) {
        e.preventDefault();

        isResizing = true;
        initialWidth = chatPopup.offsetWidth;
        initialHeight = chatPopup.offsetHeight;
        initialX = e.clientX;
        initialY = e.clientY;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    function resize(e) {
        if (!isResizing) return;

        const deltaX = initialX - e.clientX;
        const deltaY = initialY - e.clientY;
        
        const newWidth = initialWidth + deltaX;
        const newHeight = initialHeight + deltaY;

        // Apply size constraints
        if (newWidth >= 300) {
            chatPopup.style.width = newWidth + 'px';
        }

        if (newHeight >= 400) {
            chatPopup.style.height = newHeight + 'px';
        }

        // Store the size in localStorage for persistence
        localStorage.setItem('mavgrades-chat-width', chatPopup.style.width);
        localStorage.setItem('mavgrades-chat-height', chatPopup.style.height);
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    // Toggle fullscreen mode
    function toggleFullSize() {
        if (!isFullSize) {
            // Save current size and position
            prevWidth = chatPopup.style.width || '350px';
            prevHeight = chatPopup.style.height || '500px';

            // Expand to full window
            chatPopup.style.width = '90vw';
            chatPopup.style.height = '90vh';
            chatPopup.style.bottom = '5vh';
            chatPopup.style.right = '5vw';

            // Change icon
            resizeToggle.innerHTML = '⤓';
            resizeToggle.title = 'Restore size';

            isFullSize = true;
        } else {
            // Restore previous size and position
            chatPopup.style.width = prevWidth;
            chatPopup.style.height = prevHeight;
            chatPopup.style.bottom = '80px';
            chatPopup.style.right = '0';

            // Change icon back
            resizeToggle.innerHTML = '⤢';
            resizeToggle.title = 'Toggle full size';

            isFullSize = false;
        }

        // Make sure the chat is scrolled to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // State
    const state = {
        messages: [
            { role: 'system', content: 'You are MavGrades, a helpful assistant that provides information about classes and courses.' }
        ],
        isGenerating: false,
        apiUrl: 'https://mavbuddy-backend.vercel.app/v1/chat/completions',
        fallbackMode: false
    };

    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', closeChat);
    newChatButton.addEventListener('click', startNewChat);
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('input', () => {
        sendButton.disabled = inputField.value.trim() === '' || state.isGenerating;
        autoResizeInput();
    });
    inputField.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Initialize
    function init() {
        // Load saved window size
        const savedWidth = localStorage.getItem('mavgrades-chat-width');
        const savedHeight = localStorage.getItem('mavgrades-chat-height');

        if (savedWidth) {
            chatPopup.style.width = savedWidth;
        }

        if (savedHeight) {
            chatPopup.style.height = savedHeight;
        }

        // Load conversation history from cookie
        const savedMessages = getCookie('mavgrades-chat-history');
        if (savedMessages && savedMessages.length > 1) {
            state.messages = savedMessages;

            // Render saved messages
            messagesContainer.innerHTML = '';
            savedMessages.forEach(msg => {
                if (msg.role !== 'system') {
                    appendMessage(msg.role, msg.content);
                }
            });
        } else {
            // Show welcome message for new conversations
            appendMessage('assistant', 'Welcome to MavGrades! How may I help you with course information today?');
        }
    }

    // Start a new chat
    function startNewChat() {
        // Clear messages except the system message
        state.messages = [
            { role: 'system', content: 'You are MavGrades, a helpful assistant that provides information about classes and courses.' }
        ];

        // Clear the messages container
        messagesContainer.innerHTML = '';

        // Show welcome message
        appendMessage('assistant', 'Starting a new conversation. How may I help you today?');

        // Save to cookie
        setCookie('mavgrades-chat-history', state.messages, 7);
    }

    // Toggle chat visibility
    function toggleChat() {
        widget.classList.toggle('open');
        if (widget.classList.contains('open')) {
            inputField.focus();
        }
    }

    // Close chat
    function closeChat() {
        widget.classList.remove('open');
    }

    // Auto-resize input field
    function autoResizeInput() {
        inputField.style.height = 'auto';
        inputField.style.height = Math.min(inputField.scrollHeight, 120) + 'px';
    }

    // Append a message to the chat
    function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mavgrades-message ${role === 'user' ? 'mavgrades-user-message' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = `mavgrades-message-avatar ${role === 'user' ? 'mavgrades-user-avatar' : 'mavgrades-assistant-avatar'}`;

        if (role === 'user') {
            avatar.textContent = 'U';
        } else {
            avatar.textContent = 'M';
        }

        const messageBubble = document.createElement('div');
        messageBubble.className = `mavgrades-message-bubble ${role === 'user' ? 'mavgrades-user-bubble' : 'mavgrades-assistant-bubble'}`;

        // Format markdown
        messageBubble.innerHTML = formatMarkdown(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageBubble);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return messageBubble; // Return for streaming updates
    }

    // Add typing indicator
    function addTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'mavgrades-typing-indicator';
        indicator.id = 'mavgrades-typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'mavgrades-typing-dot';
            indicator.appendChild(dot);
        }

        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('mavgrades-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Format markdown text
    function formatMarkdown(text) {
        // Handle code blocks
        text = text.replace(/```(\w*)([\s\S]*?)```/g, (match, language, code) => {
            return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
        });

        // Handle inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Handle bold text
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Handle italic text
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Handle links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Handle line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    // Escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Allow user to change API endpoint
    function changeApiEndpoint() {
        const newEndpoint = prompt("Enter API endpoint URL:", state.apiUrl);
        if (newEndpoint && newEndpoint.trim() !== '') {
            state.apiUrl = newEndpoint.trim();
            state.fallbackMode = false;
            appendMessage('assistant', `API endpoint updated to: ${state.apiUrl}`);
        }
    }

    // Send message to API
    async function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '' || state.isGenerating) return;

        // Clear input and resize
        inputField.value = '';
        inputField.style.height = '38px';
        sendButton.disabled = true;

        // Add user message to chat
        appendMessage('user', userMessage);

        // Add to messages array
        state.messages.push({
            role: 'user',
            content: userMessage
        });
        
        // Save conversation to cookie
        setCookie('mavgrades-chat-history', state.messages, 7);

        // Show typing indicator
        addTypingIndicator();
        state.isGenerating = true;

        try {
            // Prepare API request
            const requestBody = {
                model: 'mavgrades-assistant',
                messages: state.messages,
                stream: true,
                temperature: 0.7
            };

            const response = await fetch(state.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // Remove typing indicator
            removeTypingIndicator();

            // Create message bubble for assistant response
            appendMessage('assistant', '');
            const aiMessageElement = messagesContainer.lastChild.querySelector('.mavgrades-message-bubble');

            let fullResponse = '';

            // Process streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Process complete JSON objects in the buffer
                let lastJSONEnd = 0;

                while (buffer.indexOf('\n', lastJSONEnd) !== -1) {
                    const lineEnd = buffer.indexOf('\n', lastJSONEnd);
                    const line = buffer.substring(lastJSONEnd, lineEnd).trim();
                    lastJSONEnd = lineEnd + 1;

                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6);

                        // Handle [DONE] signal
                        if (jsonStr === '[DONE]') continue;

                        try {
                            const json = JSON.parse(jsonStr);

                            // Extract content from the chunk
                            const content = json.choices?.[0]?.delta?.content || '';
                            if (content) {
                                fullResponse += content;

                                // Update the UI with the new content
                                aiMessageElement.innerHTML = formatMarkdown(fullResponse);

                                // Scroll to the bottom
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            }
                        } catch (e) {
                            console.error('Error parsing JSON from stream:', e);
                        }
                    }
                }

                // Keep any incomplete data in the buffer
                buffer = buffer.substring(lastJSONEnd);
            }

            // Add AI response to state
            state.messages.push({
                role: 'assistant',
                content: fullResponse
            });
            
            // Save updated conversation to cookie
            setCookie('mavgrades-chat-history', state.messages, 7);

        } catch (error) {
            console.error('Error sending message:', error);
            removeTypingIndicator();

            if (!state.fallbackMode) {
                // First time error - suggest fallback options
                const errorMsg = `Error, please try again.`;
                appendMessage('assistant', errorMsg);
                state.fallbackMode = true;
            } else {
                // Subsequent error - simple message
                appendMessage('assistant', 'Still unable to connect to the API. Please use the full chat interface in a separate browser tab.');
            }
            
            // Save error message to cookie
            setCookie('mavgrades-chat-history', state.messages, 7);
        } finally {
            state.isGenerating = false;
            sendButton.disabled = inputField.value.trim() === '';
            inputField.focus();
        }
    }

    // Initialize the chat
    init();

    // Expose functions to global scope for external use
    window.toggleMavGradesChat = toggleChat;
    window.changeApiEndpoint = changeApiEndpoint;
    window.startNewMavGradesChat = startNewChat;

    console.log('MavGrades Chat Widget initialized. Use window.toggleMavGradesChat() to toggle it programmatically.');
})();
