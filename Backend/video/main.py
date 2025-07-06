import os
import glob
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from manim_generator import manim_main
from preprocessor import extract_code_and_voiceover
from render import run_manim_file
from checker import validate_and_fix_code

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"])

def save_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        print(f"✅ Saved: {path}")

def find_video_file(output_dir):
    """Find the generated video file in the media directory"""
    video_patterns = [
        os.path.join(output_dir, "media", "videos", "**", "*.mp4"),
        os.path.join(output_dir, "media", "videos", "**", "*.mov"),
        os.path.join(output_dir, "media", "videos", "**", "*.avi")
    ]
    
    for pattern in video_patterns:
        video_files = glob.glob(pattern, recursive=True)
        if video_files:
            # Return the most recently created video file
            return max(video_files, key=os.path.getctime)
    
    return None

@app.route('/video/<filename>')
def serve_video(filename):
    """Serve video files from the Param directory"""
    try:
        # Look for the video file in the media directory structure
        output_dir = "Param"
        video_file_path = find_video_file(output_dir)
        
        if video_file_path and os.path.basename(video_file_path) == filename:
            directory = os.path.dirname(video_file_path)
            return send_from_directory(directory, filename, as_attachment=False)
        else:
            return jsonify({"error": "Video file not found"}), 404
    except Exception as e:
        print(f"Error serving video: {e}")
        return jsonify({"error": "Error serving video file"}), 500

@app.route('/generate', methods=['POST', 'OPTIONS'])
def generate_video():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    try:
        # Get input from request
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"success": False, "error": "Query is required"}), 400
        
        query = data['query']
        print(f"🎬 Processing query: {query}")
        
        # Step 1: Generate process
        print("📝 Step 1: Generating Manim code...")
        ans = manim_main(query)
        code, trans = extract_code_and_voiceover(ans)
        print("✅ Code generation completed")
        print("✅ Translation generation completed")

        # Step 2: Save to Param folder
        print("💾 Step 2: Saving files...")
        output_dir = "Param"
        os.makedirs(output_dir, exist_ok=True)

        # Use a unique filename to avoid Flask reloading
        code_path = os.path.join(output_dir, "manim_scene.py")
        trans_path = os.path.join(output_dir, "trans.txt")

        save_file(code_path, code)
        save_file(trans_path, trans)

        # Step 3: Validate and fix code using local Qwen model
        print("🤖 Step 3: Validating code with Qwen model...")
        try:
            fixed_response = validate_and_fix_code(code)
            fixed_code, updated_trans = extract_code_and_voiceover(fixed_response)

            if fixed_code and fixed_code.strip():
                save_file(code_path, fixed_code)
                print("✅ Code was corrected and updated by Qwen.")
                if updated_trans:
                    trans = updated_trans
                    save_file(trans_path, trans)
            else:
                print("✅ No issues found. Proceeding with original code.")
        except Exception as e:
            print(f"⚠️ Code validation error: {e}. Proceeding with original code.")

        # Step 4: Render video
        print("🎬 Step 4: Starting video rendering...")
        print("⏳ Please wait, this may take a few minutes...")
        
        # Verify the code file content before rendering
        if os.path.exists(code_path):
            with open(code_path, 'r', encoding='utf-8') as f:
                code_content = f.read()
            print(f"📄 Code file size: {len(code_content)} characters")
            
            # Check if it contains a Scene class
            import re
            scene_match = re.search(r'class\s+(\w+)\s*\(\s*Scene\s*\)', code_content)
            if scene_match:
                print(f"✅ Found Scene class: {scene_match.group(1)}")
            else:
                print("❌ No Scene class found in code!")
                return jsonify({
                    "success": False,
                    "error": "Generated code does not contain a valid Scene class",
                    "code_path": code_path,
                    "code_preview": code_content[:500]
                }), 500
        else:
            return jsonify({
                "success": False,
                "error": "Code file does not exist",
                "code_path": code_path
            }), 500
        
        # Clear any existing video files first
        media_dir = os.path.join(output_dir, "media")
        if os.path.exists(media_dir):
            import shutil
            shutil.rmtree(media_dir)
            print("🧹 Cleared existing media directory")
        
        render_result = run_manim_file(code_path)
        
        if render_result:
            print("✅ Manim rendering process completed!")
            
            # Wait a moment for file system to update
            import time
            time.sleep(2)
            
            # Find the actual video file
            video_file_path = find_video_file(output_dir)
            
            if video_file_path:
                # Convert to absolute path
                abs_video_path = os.path.abspath(video_file_path)
                print(f"🎥 Video file created: {abs_video_path}")
                
                response = jsonify({
                    "success": True,
                    "message": "Video generated and rendered successfully",
                    "video_path": abs_video_path,
                    "video_filename": os.path.basename(video_file_path),
                    "code_path": code_path,
                    "trans_path": trans_path,
                    "query": query
                })
                
                # Add CORS headers to the response
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            else:
                # List what files were actually created
                all_files = []
                if os.path.exists(output_dir):
                    for root, dirs, files in os.walk(output_dir):
                        for file in files:
                            all_files.append(os.path.join(root, file))
                
                print("❌ Video file was not found after rendering")
                print(f"📁 Files in output directory: {all_files}")
                
                response = jsonify({
                    "success": False,
                    "error": "Video rendering completed but video file not found",
                    "code_path": code_path,
                    "media_directory": os.path.join(output_dir, "media"),
                    "all_files": all_files
                })
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 500
        else:
            print("❌ Video rendering failed - check the render.py output above")
            response = jsonify({
                "success": False,
                "error": "Video rendering failed - check server logs for details",
                "code_path": code_path,
                "suggestion": "Check if Manim is properly installed: pip install manim"
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 500
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        response = jsonify({"success": False, "error": str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/health', methods=['GET'])
def health_check():
    response = jsonify({"status": "healthy", "message": "Manim Generator API is running"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("🚀 Starting Manim Generator API...")
    print("📝 Send POST request to /generate with query in JSON body")
    print("🔗 Example: http://localhost:5001/generate")
    print("🎥 Video serving endpoint: http://localhost:5001/video/<filename>")
    print("⚠️  Auto-reload is DISABLED to prevent interruption during video rendering")
    
    # IMPORTANT: Disable debug mode and reloader to prevent auto-restart
    app.run(debug=False, host='0.0.0.0', port=5001, use_reloader=False)
