from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

def clean_response(text):
    """Remove Gemini's markdown formatting"""
    return text.replace('*', '')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        context = data.get('context') + "\nDo not use markdown formatting or asterisks (*) in your responses."

        # Create chat with context
        chat = model.start_chat(history=[])
        system_message = chat.send_message(context)
        response = chat.send_message(message)

        # Clean up the response
        cleaned_response = clean_response(response.text)
        return jsonify({"response": cleaned_response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)