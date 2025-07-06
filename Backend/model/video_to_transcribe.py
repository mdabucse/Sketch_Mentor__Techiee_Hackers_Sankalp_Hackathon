import json
import yt_dlp
import os

# Set this to your ffmpeg bin path
os.environ["PATH"] += os.pathsep + r"C:\ffmpeg-7.1.1-essentials_build\ffmpeg-7.1.1-essentials_build\bin"

import whisper


# Set this to your local ffmpeg/bin directory
ffmpeg_path = r"C:\ffmpeg-7.1.1-essentials_build\ffmpeg-7.1.1-essentials_build\bin"  # <- Change this if needed

def download_audio(youtube_url, output_template):
    """
    Downloads the audio from the provided YouTube URL using yt-dlp.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_template,
        'ffmpeg_location': ffmpeg_path,  # Pass explicit path to ffmpeg/ffprobe
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': False,
    }

    print("Downloading audio using yt-dlp...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])
    final_filename = output_template.replace('%(ext)s', 'mp3')
    return final_filename

def group_transcript_by_minute(segments):
    transcript_by_minute = {}
    for segment in segments:
        start_time = segment["start"]
        text = segment["text"].strip()
        minute_index = int(start_time // 60)
        transcript_by_minute.setdefault(minute_index, []).append(text)
    
    for minute in transcript_by_minute:
        transcript_by_minute[minute] = " ".join(transcript_by_minute[minute])
    
    return transcript_by_minute

def main_video(youtube_url):
    output_template = "audio.%(ext)s"
    audio_file = download_audio(youtube_url, output_template)
    print("Audio downloaded as", audio_file)

    print("Loading Whisper model...")
    model = whisper.load_model("base")

    print("Transcribing audio...")
    result = model.transcribe(audio_file)
    segments = result.get("segments", [])
    
    transcript_by_minute = group_transcript_by_minute(segments)
    
    output_json = r"data\single.json"
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(transcript_by_minute, f, ensure_ascii=False, indent=4)
    print("Transcript saved to", output_json)

# main_video("https://youtu.be/RpWFli2Iz9E")
