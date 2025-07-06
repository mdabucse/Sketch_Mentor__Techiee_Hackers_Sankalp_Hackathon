from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import json
from dotenv import load_dotenv
from .rag import rag_main

load_dotenv()

def conversation(user_message):
    transcript_file = r"D:\Boom\backend\Sketch-Mentor-Lovable-Hack\backend\data\single.json"
    content = rag_main(user_message)
    print("The rag provided content is",content)
    if user_message.lower() in ["hi", "hii", "hello", "hey"]:
        print("If working")
        prompt = f"""
        You are an expert in problem-solving in Mathematics.
        When a user greets you, respond with:
        "Hello! What can I assist you with today? Here are some example questions you can ask me:"
        {content}
        """
    # if not content or "Sorry" in content:
    #     content = "Example questions are currently unavailable. Please ask your question directly."

    else:
        print("Else Working")
        prompt = f"""
        You are an expert in problem-solving in Mathematics.
        Based on the following extracted content, generate the most relevant answer to the user's question.

        User's question: "{user_message}"

        Relevant content:
        {content}

        Provide a concise and helpful response.
        """
    print("The prompt is",prompt)
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
    ai_response = llm.invoke(prompt)
    return ai_response
# res=conversation("Summarize the entire content")  # Example call to test the function
# print('The res is ',res)
