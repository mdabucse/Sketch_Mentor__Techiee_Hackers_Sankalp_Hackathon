# qwen_checker.py (Azure OpenAI Version)

import os
import tempfile
import subprocess
import re
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import AzureChatOpenAI

# Load environment variables
load_dotenv()

# Initialize Azure OpenAI model
llm = AzureChatOpenAI(
    deployment_name=os.getenv("AZURE_DEPLOYMENT_NAME"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-03-01-preview"),
)

def extract_code_blocks(text):
    pattern = r"```(?:python)?(.*?)```"
    matches = re.findall(pattern, text, re.DOTALL)
    return matches[0].strip() if matches else text.strip()

def check_manim_code(code):
    with tempfile.NamedTemporaryFile(suffix='.py', mode='w', delete=False) as temp_file:
        temp_file.write(code)
        temp_file_path = temp_file.name
    try:
        result = subprocess.run(
            ['python', '-m', 'py_compile', temp_file_path],
            capture_output=True,
            text=True
        )
        return (True, "") if result.returncode == 0 else (False, result.stderr)
    except Exception as e:
        return False, str(e)
    finally:
        os.unlink(temp_file_path)

def validate_and_fix_code(initial_code: str, max_iterations=3):
    prompt_intro = (
        "You are a Manim Community Edition code reviewer.\n"
        "Review the provided Python Manim code for syntax errors, layout issues, "
        "animation logic problems, and Manim-specific mistakes.\n\n"
        "- If the code is fully correct, return the original code unchanged, "
        "wrapped in a Python code block.\n"
        "- If the code has issues, return the corrected full version of the code, "
        "also wrapped in a Python code block.\n\n"
        "Always return the result like this:\n"
        "```python\n# corrected or original code\n```"
    )

    messages = [
        SystemMessage(content="You are a Manim code reviewer and fixer."),
        HumanMessage(content=f"{prompt_intro}\n\n```python\n{initial_code.strip()}\n```")
    ]

    for i in range(max_iterations):
        response = llm.invoke(messages).content
        code_block = extract_code_blocks(response)

        is_valid, error = check_manim_code(code_block)
        if is_valid:
            return f"```python\n{code_block}\n```"

        # Retry with feedback if invalid
        messages.append(HumanMessage(content=f"The code has the following errors:\n{error}\nPlease fix and regenerate."))
        messages.append(SystemMessage(content=response))

    return "❌ Failed to generate valid Manim code after multiple attempts."
# if __name__ == "__main__":
#     # Example usage
#     with open("manim.py", "r") as f:
#         code = f.read()
#     fixed_code = validate_and_fix_code(code)

#     print(fixed_code)