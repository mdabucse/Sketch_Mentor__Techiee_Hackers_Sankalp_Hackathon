import re

def extract_code_and_voiceover(text):
    # Extract code block between ```python and ```
    code_match = re.search(r"```python\s*(.*?)\s*```", text, re.DOTALL)
    code = code_match.group(1).strip() if code_match else "No valid Python code found."

    # Extract transcript under heading "## Voiceover Script:"
    transcript_match = re.search(r"## Voiceover Script:(.*)", text, re.DOTALL)
    transcript = transcript_match.group(1).strip() if transcript_match else "No transcript found."

    return code, transcript
