# Use Node.js 18 LTS
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    imagemagick \
    fonts-liberation \
    libgtk-3-0 \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2 \
    libssl-dev \
    openssl \
    ca-certificates \
    espeak \
    espeak-data \
    libespeak1 \
    libespeak-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Python requirements and install
COPY project/backend/requirements.txt ./project/backend/
RUN pip3 install -r project/backend/requirements.txt

# Copy all source code
COPY . .

# Copy startup script and make executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Create necessary directories
RUN mkdir -p /app/resumes \
    && mkdir -p /app/project/backend/videos \
    && mkdir -p /app/project/backend/learning_paths \
    && chmod -R 755 /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV PYTHONPATH=/app/project/backend

# Expose ports
EXPOSE 4000 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/ || exit 1

# Start both services
CMD ["/app/start.sh"]