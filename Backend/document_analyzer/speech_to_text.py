import os
import tempfile
import shutil
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from pydub import AudioSegment
from pydub.utils import which

class AudioProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.supported_audio_formats = {'.mp3', '.wav', '.m4a', '.ogg'}
        self.supported_video_formats = {'.mp4', '.avi', '.mov', '.mkv'}

        # Set FFmpeg path explicitly if not auto-detected
        ffmpeg_path = which("ffmpeg") or r"C:\ffmpeg\ffmpeg-7.1.1\bin\ffmpeg.exe"
        if not ffmpeg_path or not os.path.exists(ffmpeg_path):
            raise Exception(f"FFmpeg not found at: {ffmpeg_path}")

        AudioSegment.converter = ffmpeg_path
        print(f"FFmpeg set to: {ffmpeg_path}")

    def convert_to_wav(self, audio_path):
        """Convert any audio format to WAV for transcription"""
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        temp_wav_path = tempfile.mktemp(suffix=".wav")

        try:
            print(f"Converting {audio_path} to WAV...")

            if audio_path.lower().endswith('.mp3'):
                audio = AudioSegment.from_mp3(audio_path)
            else:
                audio = AudioSegment.from_file(audio_path)

            audio.export(temp_wav_path, format="wav")
            print(f"Converted file saved at: {temp_wav_path}")
            return temp_wav_path

        except Exception as e:
            raise Exception(f"Failed to convert audio to WAV: {str(e)}")

    def transcribe_audio(self, audio_path):
        """Transcribe WAV audio to text using SpeechRecognition"""
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        try:
            print(f"Transcribing audio: {audio_path}")
            with sr.AudioFile(audio_path) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                return text
        except Exception as e:
            raise Exception(f"Failed to transcribe audio: {str(e)}")

    def process_file(self, file_path):
        """Handles both audio & video files, extracts audio, and transcribes"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        extension = os.path.splitext(file_path)[1].lower()
        temp_wav_path = None

        try:
            print(f"Processing file: {file_path}")

            if extension in self.supported_audio_formats:
                temp_wav_path = self.convert_to_wav(file_path)
            elif extension in self.supported_video_formats:
                temp_wav_path = tempfile.mktemp(suffix=".wav")
                video = VideoFileClip(file_path)
                video.audio.write_audiofile(temp_wav_path)
                video.close()
            else:
                raise Exception(f"Unsupported file format: {extension}")

            text = self.transcribe_audio(temp_wav_path)
            return text

        finally:
            # Cleanup temp files
            if temp_wav_path and os.path.exists(temp_wav_path):
                os.remove(temp_wav_path)