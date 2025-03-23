# Missing files
- prompt.txt
    - Should be shared in our channel whenever edits are made to it
- .env
    - Has an openai key in it, try not to use a lot of funds 
- debug.txt
    - Saves info about function calls

# How to run
- If you have python installed
    - `pip install -r requirements.txt`
    - `python main.py`
- If you don't
    - install python first

# API Reference
- Completions Endpoint
- Endpoint
- POST /v1/chat/completions
- Description
    - Generates chat completions with responses from the MavGrades assistant.
## Request Body (JSON)
```
{
  "messages": [
    {"role": "user", "content": "search for class CSE 1310"}
  ],
  "stream": false
}
```
- messages: List of messages containing role (user, assistant, or system) and content.
- stream: Boolean indicating if the response should be streamed (default: false).
## Response (Non-Streaming)
```
{
  "id": "chatcmpl-123456",
  "object": "chat.completion",
  "created": 1674653019,
  "model": "mavgrades-assistant",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Response text"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}
```
## Response (Streaming)
```
id: chatcmpl-123456
event: message
data: {
  "id": "chatcmpl-123456",
  "object": "chat.completion.chunk",
  "created": 1674653019,
  "model": "mavgrades-assistant",
  "choices": [{
    "index": 0,
    "delta": {
      "content": "Partial response text"
    },
    "finish_reason": null
  }]
}

id: [DONE]
event: close
```