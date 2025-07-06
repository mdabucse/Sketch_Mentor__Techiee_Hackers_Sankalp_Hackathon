# goal_todo_features.py
import google.generativeai as genai
from flask import jsonify
import json

class GoalTodoManager:
    def __init__(self, api_key):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def get_goal_advice(self, goal_statement):
        try:
            context = """
            Effective goal-setting involves creating SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.
            Consider breaking larger goals into smaller, manageable tasks.
            Regular review and adjustment of goals is important for long-term success.
            ONLY provide advice on academic goals, related to Education, Career, or Personal Development.
            If it is not academic, respond with "I can only provide advice on academic goals."
            """
            
            prompt = f"""Context: {context}

            Goal Statement: {goal_statement}

            Analyze if this is an academic goal and if so, provide specific advice on making it SMART. Be concise."""
            
            response = self.model.generate_content(prompt)
            return {"advice": response.text}
        except Exception as e:
            return {"error": str(e)}

    def generate_todo_tasks(self, goal):
        try:
            prompt = f"""Based on this goal: {goal}
            Create a JSON object containing 2-5 specific, actionable tasks that will help achieve this goal.
            Return ONLY a valid JSON object with this format: {{"tasks": ["task1", "task2", ...]}}"""
            
            response = self.model.generate_content(prompt)
            
            try:
                tasks = json.loads(response.text)
                if not isinstance(tasks, dict) or 'tasks' not in tasks:
                    raise ValueError("Invalid response format")
            except (json.JSONDecodeError, ValueError):
                tasks = {"tasks": ["Error generating tasks. Please try again."]}
            
            return {"generated": tasks}
        except Exception as e:
            return {"error": str(e)}