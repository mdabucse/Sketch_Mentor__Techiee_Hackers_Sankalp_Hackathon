# chatbot.py
import google.generativeai as genai
from typing import Dict

class Chatbot:
    def __init__(self):
        self.api_key = "AIzaSyDSRv_0xjtnd92cCnvuCAv7QB-1PJcVU1Y"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.chat = None
        self.content = None
        
    def start_chat(self, content: str) -> str:
        """Initialize a new chat session with content"""
        try:
            system_prompt = f"""You are a helpful assistant that answers questions based only on the provided content. 
            If the answer cannot be found in the content, politely say so. Here is the content:

            {content}"""
            
            self.chat = self.model.start_chat(history=[])
            self.chat.send_message(system_prompt)
            self.content = content
            return "Chat started successfully. You can now ask questions about the content."
        except Exception as e:
            return f"Error starting chat: {str(e)}"
    
    def get_response(self, message: str) -> str:
        """Get response for user message"""
        try:
            if not self.chat:
                return "Please send content first to start the chat."
            
            response = self.chat.send_message(message)
            return response.text
        except Exception as e:
            return f"Error generating response: {str(e)}"
    
    def clear_chat(self) -> str:
        """Clear current chat session"""
        self.chat = None
        self.content = None
        return "Chat cleared successfully."

# Create global chatbot instance
chatbot = Chatbot()