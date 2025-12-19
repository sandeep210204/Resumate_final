from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import os
import logging
import traceback
from typing import Optional

# Import custom modules
from video_generator import VideoGenerator  # Your existing video generator
from youtube_api import create_learning_path  # Your YouTube API based learning path generator

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()


# Create necessary directories
videos_dir = "videos"
learning_paths_dir = "learning_paths"
os.makedirs(videos_dir, exist_ok=True)
os.makedirs(learning_paths_dir, exist_ok=True)

# Mount the static directories
app.mount("/videos", StaticFiles(directory=videos_dir), name="videos")
app.mount("/learning_paths", StaticFiles(directory=learning_paths_dir), name="learning_paths")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:4001", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TopicRequest(BaseModel):
    topic: str
    generation_type: str  # Either "video" or "learning_path"

class GenerationResponse(BaseModel):
    status: str
    message: str
    file: Optional[str]
    url: Optional[str]

@app.post("/generate", response_model=GenerationResponse)
async def generate_content(request: TopicRequest):
    logger.info(f"Received {request.generation_type} generation request for topic: {request.topic}")
    
    try:
        if request.generation_type == "video":
            return await generate_video_content(request.topic)
        elif request.generation_type == "learning_path":
            return await generate_learning_path_content(request.topic)
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid generation_type. Must be either 'video' or 'learning_path'"
            )
            
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_video_content(topic: str):
    try:
        # Set ImageMagick path for Linux
        import os
        os.environ['IMAGEMAGICK_BINARY'] = '/usr/bin/convert'
        
        generator = VideoGenerator()
        output_file = generator.create_video(topic)
        
        if not output_file or not os.path.exists(output_file):
            raise Exception("Video file was not created")
        
        filename = os.path.basename(output_file)
        video_url = f"/videos/{filename}"
        
        return GenerationResponse(
            status="success",
            message="Video generated successfully",
            file=filename,
            url=video_url
        )
    
    except Exception as e:
        logger.error(f"Error in video generation: {str(e)}")
        raise

async def generate_learning_path_content(topic: str):
    try:
        filename = f"{topic.lower().replace(' ', '_')}_learning_roadmap.html"
        filepath = os.path.join(learning_paths_dir, filename)
        
        # Create learning path
        create_learning_path(topic, output_dir=learning_paths_dir)
        
        if not os.path.exists(filepath):
            raise Exception("Learning path file was not created")
        
        return GenerationResponse(
            status="success",
            message="Learning path generated successfully",
            file=filename,
            url=f"/learning_paths/{filename}"
        )
    
    except Exception as e:
        logger.error(f"Error in learning path generation: {str(e)}")
        raise

@app.get("/health")
async def health_check():
    try:
        return {
            "status": "healthy",
            "videos_dir": os.path.exists(videos_dir) and os.access(videos_dir, os.W_OK),
            "learning_paths_dir": os.path.exists(learning_paths_dir) and os.access(learning_paths_dir, os.W_OK)
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.get("/")
async def root():
    return {
        "message": "Content Generator API is running",
        "available_endpoints": [
            {
                "path": "/generate",
                "method": "POST",
                "description": "Generate either a video or learning path",
                "params": {
                    "topic": "string",
                    "generation_type": "video | learning_path"
                }
            },
            {
                "path": "/health",
                "method": "GET",
                "description": "Check API health status"
            }
        ]
    }

if __name__ == "__main__":
    import asyncio
    import sys
    
    # Fix for event loop issues in Docker
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info", loop="asyncio")