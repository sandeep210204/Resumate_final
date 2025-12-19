import pyttsx3
import wikipedia
import os
import requests
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips, TextClip, CompositeVideoClip
from moviepy.config import change_settings
import time
import re
from duckduckgo_search import DDGS 

# Configure ImageMagick path
change_settings({"IMAGEMAGICK_BINARY": r"C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"})

class VideoGenerator:
    def __init__(self):
        self.tts_engine = pyttsx3.init()
        self.pexels_api_key = "hkflPFViDnQfvfgmpTiu1fKTdo6jsBjN5R2rQJT4whFhQlqnPlY7cqyH"
        # Create videos directory if it doesn't exist
        os.makedirs("videos", exist_ok=True)

    def generate_script(self, topic):
        try:
            # First, try to get a Wikipedia summary for the exact match of the topic
            if self.is_exact_match_in_wikipedia(topic):
                summary = wikipedia.summary(topic, sentences=10).strip()
            else:
                # If not an exact match, use DuckDuckGo
                print(f"Exact match not found for '{topic}' in Wikipedia. Using DuckDuckGo instead.")
                summary = self.search_duckduckgo(topic)

            # Clean up summary to avoid URLs in the speech
            script = self.clean_script_for_speech(summary)
            return script

        except wikipedia.exceptions.DisambiguationError:
            # If Wikipedia returns multiple results, use DuckDuckGo
            print(f"Disambiguation error: Multiple results for '{topic}'. Using DuckDuckGo.")
            return self.search_duckduckgo(topic)
        except wikipedia.exceptions.PageError:
            # If Wikipedia does not have the page, use DuckDuckGo
            print(f"Page error: No exact match for '{topic}' in Wikipedia. Using DuckDuckGo.")
            return self.search_duckduckgo(topic)
        except Exception as e:
            print(f"Error generating script: {e}")
            return ""

    def is_exact_match_in_wikipedia(self, topic):
        try:
            # Check if the topic exactly matches a Wikipedia page by searching for the title
            page = wikipedia.page(topic)
            return page.title.lower() == topic.lower()
        except wikipedia.exceptions.DisambiguationError:
            # If it's ambiguous, it's not an exact match
            return False
        except wikipedia.exceptions.PageError:
            # If the page does not exist, it's not an exact match
            return False
        except Exception as e:
            print(f"Error checking Wikipedia for exact match: {e}")
            return False

    def search_duckduckgo(self, query):
        try:
            # Initialize DDGS (DuckDuckGo Search) object
            ddgs = DDGS()

            # Perform the text search using DuckDuckGo
            results = list(ddgs.text(query, region="wt-wt", safesearch="moderate", timelimit=None, backend="auto", max_results=1))

            if results:
                # Extract the title, href (URL), and body of the first result
                first_result = results[0]
                title = first_result.get("title", "")
                body = first_result.get("body", "")

                # Constructing the script by combining the title and body text
                script = f"Topic: {title}\nSummary: {body}"
                return script
            else:
                return f"Information about {query}. This is a general topic that covers various aspects and details."
        except Exception as e:
            print(f"Error searching DuckDuckGo: {e}")
            return f"Information about {query}. This is a general topic that covers various aspects and details."

    def clean_script_for_speech(self, script):
        """
        Clean the script by removing unnecessary elements like URLs.
        """
        # Remove any URLs from the script

        cleaned_script = " ".join([word for word in script.split() if not word.startswith("http://") and not word.startswith("https://")])
        cleaned_script = cleaned_script.replace("Wikipedia", "").replace("Summary", "").strip()
        cleaned_script = re.sub(r'\[\d+\]', '', cleaned_script)
        return cleaned_script


    def generate_speech(self, text, output_file="output_audio.wav"):
        try:
            # Configure voice properties
            self.tts_engine.setProperty('rate', 150)  # Speed
            self.tts_engine.setProperty('volume', 1.0)  # Volume
            
            # Generate speech and save to file
            self.tts_engine.save_to_file(text, output_file)
            self.tts_engine.runAndWait()
            
            # Check if file was created
            if not os.path.exists(output_file):
                raise Exception(f"Audio file {output_file} was not created")
            
            return output_file

        except Exception as e:
            print(f"Speech generation failed: {e}")
            return None

    def download_videos(self, query, num_videos=3):
        headers = {"Authorization": self.pexels_api_key}
        url = f"https://api.pexels.com/videos/search?query={query}&per_page={num_videos}"
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            videos = []
            for video in data.get('videos', []):
                for video_file in video['video_files']:
                    if video_file['width'] <= 1280:  # Limit resolution
                        filename = f"temp_video_{len(videos)}.mp4"
                        with open(filename, 'wb') as f:
                            video_response = requests.get(video_file['link'], stream=True)
                            for chunk in video_response.iter_content(chunk_size=8192):
                                if chunk:
                                    f.write(chunk)
                        videos.append(filename)
                        break
            return videos

        except Exception as e:
            print(f"Video download failed: {e}")
            return []

    def create_video(self, topic):
        try:
            print("Generating script...")
            script = self.generate_script(topic)
            if not script:
                raise Exception("Failed to generate script")

            print("Generating speech...")
            audio_file = self.generate_speech(script)
            if not audio_file:
                raise Exception("Failed to generate speech")
                
            audio_clip = AudioFileClip(audio_file)
            if audio_clip.duration == 0:
                raise Exception("Generated audio has no duration")

            print("Downloading videos...")
            video_files = self.download_videos(topic)
            if not video_files:
                raise Exception("Failed to download videos")

            print("Creating video clips...")
            clips = []
            clip_duration = audio_clip.duration / len(video_files)
            
            for file in video_files:
                try:
                    clip = VideoFileClip(file)
                    if clip.duration > clip_duration:
                        clip = clip.subclip(0, clip_duration)
                    elif clip.duration < clip_duration:
                        repeats = int(clip_duration / clip.duration) + 1
                        clip = concatenate_videoclips([clip] * repeats).subclip(0, clip_duration)
                    clips.append(clip)
                except Exception as e:
                    print(f"Error processing clip {file}: {e}")
                    continue

            if not clips:
                raise Exception("No valid video clips")

            print("Combining clips...")
            video_clip = concatenate_videoclips(clips)
            video_clip = video_clip.set_duration(audio_clip.duration)

            print("Adding subtitles...")
            words = script.split()
            time_per_word = audio_clip.duration / len(words)
            
            subtitle_clips = []
            for i in range(0, len(words), 10):
                text = ' '.join(words[i:i+10])
                start_time = i * time_per_word
                end_time = min((i + 10) * time_per_word, audio_clip.duration)
                
                text_clip = (TextClip(text, fontsize=24, color='white', bg_color='black',
                                   size=(video_clip.w * 0.8, None), method='caption')
                            .set_start(start_time)
                            .set_end(end_time)
                            .set_position(('center', 'bottom')))
                subtitle_clips.append(text_clip)

            print("Rendering final video...")
            final_clip = CompositeVideoClip([video_clip] + subtitle_clips)
            final_clip = final_clip.set_audio(audio_clip)
            
            # Generate unique filename using timestamp
            timestamp = int(time.time())
            output_file = f"videos/video_{topic.replace(' ', '_')}_{timestamp}.mp4"
            final_clip.write_videofile(output_file, codec='libx264', audio_codec='aac', fps=24)
            
            # Cleanup
            for file in video_files:
                try:
                    os.remove(file)
                except:
                    pass
            os.remove(audio_file)
            
            return output_file

        except Exception as e:
            print(f"Error in video creation: {e}")
            # Cleanup on error
            for file in locals().get('video_files', []):
                try:
                    os.remove(file)
                except:
                    pass
            if 'audio_file' in locals():
                try:
                    os.remove(audio_file)
                except:
                    pass
            raise

def main():
    generator = VideoGenerator()
    topic = input("Enter the topic for the video: ")
    try:
        output_file = generator.create_video(topic)
        print(f"Video generated successfully: {output_file}")
    except Exception as e:
        print(f"Error generating video: {e}")

if __name__ == "__main__":
    main()