import os
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
from .conversation import conversation  # Your custom function that preprocesses user input
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# Load environment variables from .env
load_dotenv()

# Set up Application Default Credentials explicitly
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client.chatbot_db
chat_collection = db.chat_history

# Initialize Gemini LLM via Langchain
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",  # or gemini-pro, or your chosen variant
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Memory buffer
memory = ConversationBufferMemory(k=3)
conversation_chain = ConversationChain(llm=llm, memory=memory, verbose=True)

def create_or_get_chat(chat_name):
    session_data = chat_collection.find_one({"chat_name": chat_name})
    if session_data:
        return session_data["session_id"]
    session_id = str(datetime.utcnow().timestamp())
    chat_collection.insert_one({
        "session_id": session_id,
        "chat_name": chat_name,
        "messages": [],
        "timestamp": datetime.utcnow(),
        "ended": False
    })
    return ("Chat Created Successfully", session_id)

def store_chat_in_mongo(chat_name, user_message, ai_message):
    chat_collection.update_one(
        {"chat_name": chat_name},
        {
            "$push": {
                "messages": {
                    "human": user_message,
                    "AI": ai_message,
                    "timestamp": datetime.utcnow()
                }
            },
            "$set": {"timestamp": datetime.utcnow()}
        },
        upsert=True
    )

def end_chat_session(chat_name):
    session_data = chat_collection.find_one({"chat_name": chat_name})
    if session_data and "messages" in session_data:
        chat_pairs = [{"human": msg["human"], "AI": msg["AI"]} for msg in session_data["messages"]]
        chat_collection.update_one(
            {"chat_name": chat_name},
            {
                "$set": {
                    "chat_pairs": chat_pairs,
                    "ended": True,
                    "timestamp": datetime.utcnow()
                }
            }
        )

def resume_chat_session(chat_name):
    session_data = chat_collection.find_one({"chat_name": chat_name})
    return session_data["messages"] if session_data and "messages" in session_data else []

def fetch_all_chat_names():
    return [chat["chat_name"] for chat in chat_collection.find({}, {"chat_name": 1, "_id": 0})]

def main(chat_name, user_message):
    """Process user message, run through LLM, store interaction."""
    
    # STEP 1: Run your logic that preprocesses the message
    transformed_prompt = conversation(user_message)
    
    # Ensure it's just a string (if conversation() returns more)
    if hasattr(transformed_prompt, 'content'):
        transformed_prompt = transformed_prompt.content
    elif isinstance(transformed_prompt, dict):
        transformed_prompt = transformed_prompt.get("content", str(transformed_prompt))
    
    # STEP 2: Run through the LLM
    ai_response = conversation_chain.run(transformed_prompt)
    
    # Also ensure AI response is string (strip metadata if any)
    if hasattr(ai_response, 'content'):
        ai_response = ai_response.content
    elif isinstance(ai_response, dict):
        ai_response = ai_response.get("content", str(ai_response))

    # STEP 3: Store raw user message and plain AI output
    store_chat_in_mongo(chat_name, user_message, ai_response)
    return ai_response
