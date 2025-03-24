import os
import json
import time
import requests
from openai import OpenAI
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, request, Response, jsonify

app = Flask(__name__)
CORS(app) # to accept requests from a different origin

load_dotenv()
client = OpenAI()

def debug(var1, var2, var3):
    with open("debug.txt", "a") as f:
        f.write(var1+" | "+var2+" | "+var3 + "\n")

def search_class(search):
    req = requests.get(
        "https://www.mavgrades.com/api/courses/search?query=" + search
    )
    debug("search_class", search, req.text)
    return req.text

def get_class_info(class_code):
    req = requests.get(
        "https://www.mavgrades.com/api/courses/search?course=" + class_code,
        headers={'rsc': '1'}
    )
    debug("get_class_info", class_code, req.text)
    return req.text

def get_prof_info(prof_name):
    req = requests.get(
        "https://www.mavgrades.com/api/courses/search?professor=" + prof_name
    )
    debug("get_prof_info", prof_name, req.text)
    return req.text

# tools for assistant to use 
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_class",
            "description": "",
            "strict": True,
            "parameters": {
                "type": "object",
                "required": [
                    "search"
                ],
                "properties": {
                    "search": {
                        "type": "string",
                        "description": "Query string to search for classes or professors"
                    }
                },
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_class_info",
            "description": "",
            "strict": True,
            "parameters": {
                "type": "object",
                "required": [
                    "class_code"
                ],
                "properties": {
                    "class_code": {
                        "type": "string",
                        "description": "The class code in the format CSE 1111 or XXXX 0000"
                    }
                },
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_prof_info",
            "description": "",
            "strict": True,
            "parameters": {
                "type": "object",
                "required": [
                    "prof_name"
                ],
                "properties": {
                    "prof_name": {
                        "type": "string",
                        "description": "The professor's name. Has to be exact, from the search results."
                    }
                },
                "additionalProperties": False
            }
        }
    }
]

# if promot does not exist, use basic prompt
try:
    system_prompt = open("prompt.txt", "r").read()
except:
    system_prompt = "You are MavGrades, a helpful assistant that provides information about classes. You have access to tools to search for classes and get details about them."

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    try:
        data = request.json
        messages = data.get('messages', [])
        stream = data.get('stream', False)

        if len(messages) == 2:
            messages[0] = {"role": "system", "content": system_prompt}
        else:
            messages = [{"role": "system", "content": system_prompt}] + messages

        result_text = process_conversation(messages)

        if stream:
            
            def generate():
                
                chunks = [result_text[i:i+10] for i in range(0, len(result_text), 10)]

                for chunk in chunks:
                    
                    data = {
                        "id": f"chatcmpl-{time.time()}",
                        "object": "chat.completion.chunk",
                        "created": int(time.time()),
                        "model": "mavgrades-assistant",
                        "choices": [
                            {
                                "index": 0,
                                "delta": {
                                    "content": chunk
                                },
                                "finish_reason": None
                            }
                        ]
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                    time.sleep(0.01) 

                yield "data: [DONE]\n\n"

            return Response(generate(), mimetype='text/event-stream')
        else:
            
            completion_response = {
                "id": f"chatcmpl-{time.time()}",
                "object": "chat.completion",
                "created": int(time.time()),
                "model": "mavgrades-assistant",
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": result_text
                        },
                        "finish_reason": "stop"
                    }
                ],
                "usage": {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0
                }
            }
            return jsonify(completion_response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_conversation(messages):
    """Process the conversation with tool calls similar to the original code"""
    working_messages = messages.copy()

    done = False
    while not done:
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=working_messages,
                tools=tools,
            )

            if completion.choices[0].message.tool_calls:
                tool_call = completion.choices[0].message.tool_calls[0]
                args = json.loads(tool_call.function.arguments)

                if tool_call.function.name == "search_class":
                    result = search_class(args["search"])
                elif tool_call.function.name == "get_class_info":
                    result = get_class_info(args["class_code"])
                else:
                    result = get_prof_info(args['prof_name'])

                working_messages.append(completion.choices[0].message)
                working_messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })
            else:
                return completion.choices[0].message.content

        except Exception as e:
            return f"Error processing request: {str(e)}"

    return "Unable to generate a response"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=1234, debug=True)
