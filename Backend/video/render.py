import subprocess
import os
import sys
import re

def run_manim_file(file_path):
    """
    Render a Manim file to video with proper error handling
    """
    try:
        print(f"🎬 Starting to render: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"❌ File does not exist: {file_path}")
            return False
            
        # Read the file to find the scene class name
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        print(f"📄 File content length: {len(content)} characters")
        
        # Extract scene class name (find class that inherits from Scene)
        scene_match = re.search(r'class\s+(\w+)\s*\(\s*Scene\s*\)', content)
        if not scene_match:
            print("❌ No Scene class found in the file")
            print("📝 File content preview:")
            print(content[:500] + "..." if len(content) > 500 else content)
            return False
            
        scene_name = scene_match.group(1)
        print(f"📝 Found scene class: {scene_name}")
        
        # Get the directory containing the file and change to it
        file_dir = os.path.dirname(os.path.abspath(file_path))
        file_name = os.path.basename(file_path)
        original_dir = os.getcwd()
        
        print(f"📁 Changing directory to: {file_dir}")
        os.chdir(file_dir)
        
        try:
            # Test Manim installation first
            print("🔍 Testing Manim installation...")
            test_cmd = [sys.executable, "-m", "manim", "--version"]
            test_result = subprocess.run(test_cmd, capture_output=True, text=True, timeout=30)
            
            if test_result.returncode != 0:
                print("❌ Manim not found via 'python -m manim', trying direct 'manim' command...")
                test_cmd2 = ["manim", "--version"]
                test_result2 = subprocess.run(test_cmd2, capture_output=True, text=True, timeout=30)
                if test_result2.returncode != 0:
                    print("❌ Manim is not properly installed or not in PATH")
                    print(f"Error: {test_result.stderr}")
                    return False
                else:
                    print(f"✅ Manim found: {test_result2.stdout.strip()}")
                    use_python_m = False
            else:
                print(f"✅ Manim found: {test_result.stdout.strip()}")
                use_python_m = True
            
            # Prepare the rendering command
            if use_python_m:
                cmd = [
                    sys.executable, "-m", "manim",
                    "-ql",  # low quality for faster rendering
                    "--disable_caching",
                    "--output_file", f"{scene_name}_output",  # specific output name
                    file_name,
                    scene_name
                ]
            else:
                cmd = [
                    "manim",
                    "-ql",  # low quality for faster rendering  
                    "--disable_caching",
                    "--output_file", f"{scene_name}_output",  # specific output name
                    file_name,
                    scene_name
                ]
            
            print(f"🚀 Running command: {' '.join(cmd)}")
            print("⏳ This may take a few minutes...")
            
            # Run the command with real-time output
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            # Print output in real-time
            output_lines = []
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    print(f"📺 {output.strip()}")
                    output_lines.append(output.strip())
            
            return_code = process.poll()
            
            if return_code == 0:
                print("✅ Manim rendering completed successfully!")
                
                # Check if video files were created
                media_dirs = ["media", "videos"]
                video_found = False
                for media_dir in media_dirs:
                    if os.path.exists(media_dir):
                        for root, dirs, files in os.walk(media_dir):
                            video_files = [f for f in files if f.endswith(('.mp4', '.mov', '.avi'))]
                            if video_files:
                                print(f"🎥 Found video files: {video_files}")
                                video_found = True
                
                if not video_found:
                    print("⚠️ No video files found, but command succeeded")
                
                return True
            else:
                print(f"❌ Manim command failed with return code: {return_code}")
                print("📝 Full output:")
                for line in output_lines:
                    print(f"   {line}")
                return False
                
        except subprocess.TimeoutExpired:
            print("❌ Rendering timed out")
            return False
        except FileNotFoundError as e:
            print(f"❌ Command not found: {e}")
            print("💡 Make sure Manim is installed: pip install manim")
            return False
        except Exception as e:
            print(f"❌ Error during rendering: {str(e)}")
            return False
        finally:
            # Always change back to original directory
            os.chdir(original_dir)
            print(f"📁 Changed back to: {original_dir}")
            
    except Exception as e:
        print(f"❌ General error in run_manim_file: {str(e)}")
        return False

def test_manim_installation():
    """Test if Manim is properly installed and working"""
    print("🔍 Testing Manim installation...")
    
    try:
        # Test python -m manim
        result1 = subprocess.run([sys.executable, "-m", "manim", "--version"], 
                               capture_output=True, text=True, timeout=30)
        if result1.returncode == 0:
            print(f"✅ python -m manim works: {result1.stdout.strip()}")
            return True
            
        # Test direct manim command
        result2 = subprocess.run(["manim", "--version"], 
                               capture_output=True, text=True, timeout=30)
        if result2.returncode == 0:
            print(f"✅ Direct manim command works: {result2.stdout.strip()}")
            return True
            
        print("❌ Manim is not properly installed")
        print("💡 Install with: pip install manim")
        return False
        
    except Exception as e:
        print(f"❌ Error testing Manim: {e}")
        return False
