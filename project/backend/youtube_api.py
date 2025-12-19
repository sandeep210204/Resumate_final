import requests
import webbrowser
from collections import defaultdict
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()
API_KEY = os.getenv('YOUTUBE_API_KEY')
YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

def get_videos(query, max_results=3):
    try:
        params = {
            'key': API_KEY,
            'q': query,
            'part': 'snippet',
            'maxResults': max_results,
            'type': 'video',
            'videoDuration': 'medium',
            'order': 'relevance'
        }
        response = requests.get(YOUTUBE_API_URL, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching videos: {e}")
        return {'items': []}

def generate_html(videos, topic):
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Learning Roadmap: {topic}</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }}
            .roadmap-header {{
                text-align: center;
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                margin-bottom: 30px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }}
            .section {{
                margin-bottom: 40px;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }}
            .section-header {{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
            }}
            .section-number {{
                background-color: #007bff;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
            }}
            .video-card {{
                border: 1px solid #ddd;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 8px;
                transition: transform 0.2s;
            }}
            .video-card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }}
            .video-card img {{
                max-width: 100%;
                height: auto;
                border-radius: 5px;
            }}
            .watch-button {{
                display: inline-block;
                padding: 10px 20px;
                background-color: #ff0000;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
                transition: background-color 0.2s;
            }}
            .watch-button:hover {{
                background-color: #cc0000;
            }}
            .section-description {{
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }}
            .progress-bar {{
                width: 100%;
                height: 5px;
                background-color: #ddd;
                margin-bottom: 30px;
                border-radius: 5px;
            }}
            .progress {{
                height: 100%;
                background-color: #28a745;
                border-radius: 5px;
                width: 0%;
                transition: width 1s;
            }}
        </style>
    </head>
    <body>
        <div class="roadmap-header">
            <h1>Complete Learning Roadmap: {topic}</h1>
            <p>A structured path from fundamentals to advanced concepts</p>
            <div class="progress-bar">
                <div class="progress" id="progress"></div>
            </div>
        </div>"""

    sections = {
        'fundamentals': {
            'title': 'Fundamentals',
            'description': f'Master the basic concepts and foundations of {topic}. Start here if you\'re a beginner.'
        },
        'core_concepts': {
            'title': 'Core Concepts',
            'description': f'Build upon the fundamentals with essential {topic} concepts and principles.'
        },
        'practical_applications': {
            'title': 'Practical Applications',
            'description': f'Learn how to apply {topic} in real-world scenarios and projects.'
        },
        'intermediate': {
            'title': 'Intermediate Topics',
            'description': f'Dive deeper into more complex aspects of {topic}.'
        },
        'advanced': {
            'title': 'Advanced Concepts',
            'description': 'Master advanced techniques and specialized topics.'
        },
        'expert': {
            'title': 'Expert Level',
            'description': 'Explore cutting-edge concepts and professional applications.'
        }
    }

    for i, (section, info) in enumerate(sections.items(), 1):
        html += f"""
        <div class="section">
            <div class="section-header">
                <div class="section-number">{i}</div>
                <h2>{info['title']}</h2>
            </div>
            <div class="section-description">
                <p>{info['description']}</p>
            </div>
        """
        
        section_videos = videos[section]
        for video in section_videos:
            html += f"""
            <div class="video-card">
                <img src="{video['thumbnail']}" alt="{video['title']}">
                <h3>{video['title']}</h3>
                <p>{video['description'][:200]}...</p>
                <a href="https://www.youtube.com/watch?v={video['video_id']}" 
                   class="watch-button" 
                   target="_blank">Watch Video</a>
            </div>
            """
        
        html += "</div>"

    html += """
        <script>
            // Animate progress bar on page load
            window.onload = function() {
                document.getElementById('progress').style.width = '100%';
            }

            // Track video progress
            const watchButtons = document.querySelectorAll('.watch-button');
            let watchedVideos = new Set();
            
            watchButtons.forEach(button => {
                button.addEventListener('click', function() {
                    watchedVideos.add(this.href);
                    this.style.backgroundColor = '#28a745';
                    this.textContent = 'Watched';
                });
            });
        </script>
    </body>
    </html>
    """
    return html

def create_learning_path(topic, output_dir=None):
    if not API_KEY:
        print("Error: YouTube API key not found.")
        return

    videos = defaultdict(list)
    used_video_ids = set()
    search_queries = {
        'fundamentals': [f'{topic} basics', f'{topic} fundamentals', f'{topic} for beginners'],
        'core_concepts': [f'{topic} core concepts', f'essential {topic}', f'{topic} principles'],
        'practical_applications': [f'{topic} practical examples', f'{topic} projects', f'{topic} applications'],
        'intermediate': [f'intermediate {topic}', f'{topic} best practices'],
        'advanced': [f'advanced {topic}', f'{topic} advanced concepts'],
        'expert': [f'{topic} expert level', f'{topic} professional', f'mastering {topic}']
    }

    def is_relevant_video(video_title, query_terms):
        title_lower = video_title.lower()
        return any(term.lower() in title_lower for term in query_terms)

    for section, queries in search_queries.items():
        section_videos = []
        for query in queries:
            if len(section_videos) >= 3:  # Limit to 3 videos per section
                break
                
            results = get_videos(query, max_results=5)
            query_terms = query.lower().split()
            
            for item in results.get('items', []):
                video_id = item['id']['videoId']
                
                # Skip if video already used or not relevant
                if video_id in used_video_ids or not is_relevant_video(item['snippet']['title'], query_terms):
                    continue
                    
                video_data = {
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnail': item['snippet']['thumbnails']['medium']['url'],
                    'video_id': video_id
                }
                
                section_videos.append(video_data)
                used_video_ids.add(video_id)
                
                if len(section_videos) >= 3:
                    break
                    
        videos[section].extend(section_videos)

    html_content = generate_html(videos, topic)
    filename = f"{topic.lower().replace(' ', '_')}_learning_roadmap.html"
    
    # Use output_dir if provided, otherwise use current directory
    if output_dir:
        filepath = os.path.join(output_dir, filename)
    else:
        filepath = filename
    
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Only open in browser if no output_dir is specified (standalone usage)
        if not output_dir:
            webbrowser.open(f'file://{os.path.realpath(filepath)}')
        
        print(f"Learning roadmap created successfully: {filepath}")
        return filepath
    except IOError as e:
        print(f"Error creating file: {e}")
        return None

if __name__ == "__main__":
    topic = input("Enter the topic you want to learn about: ")
    create_learning_path(topic)