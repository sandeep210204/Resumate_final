// Content Generator functionality
const API_BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('content-form');
    const loadingDiv = document.getElementById('loading');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const generateBtn = document.getElementById('generate-btn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const topic = document.getElementById('topic-input').value.trim();
        const type = document.getElementById('type-select').value;
        
        if (!topic || !type) {
            alert('Please fill in all fields');
            return;
        }

        await generateContent(topic, type);
    });

    async function generateContent(topic, generationType) {
        try {
            // Show loading state
            loadingDiv.style.display = 'block';
            resultSection.style.display = 'none';
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';

            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: topic,
                    generation_type: generationType
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status === 'success') {
                displayResult(result, generationType, topic);
            } else {
                throw new Error(result.message || 'Generation failed');
            }

        } catch (error) {
            console.error('Error generating content:', error);
            displayError('Content generation is currently a mock implementation. ' + error.message);
        } finally {
            // Hide loading state
            loadingDiv.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Content';
        }
    }

    function displayResult(result, type, topic) {
        resultSection.style.display = 'block';
        
        if (type === 'video') {
            resultContent.innerHTML = `
                <div class="result-success">
                    <h3>✅ Video Generated Successfully!</h3>
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>File:</strong> ${result.file}</p>
                    <div class="video-container" style="margin: 1rem 0;">
                        <video controls width="100%" style="max-width: 600px;">
                            <source src="${API_BASE_URL}${result.url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <a href="${API_BASE_URL}${result.url}" target="_blank" class="rm-btn rm-btn-ghost">
                        Open Video in New Tab
                    </a>
                </div>
            `;
        } else if (type === 'learning_path') {
            resultContent.innerHTML = `
                <div class="result-success">
                    <h3>✅ Learning Path Generated Successfully!</h3>
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>File:</strong> ${result.file}</p>
                    <div class="learning-path-actions" style="margin: 1rem 0;">
                        <a href="${API_BASE_URL}${result.url}" target="_blank" class="rm-btn rm-btn-primary">
                            View Learning Path
                        </a>
                        <a href="${API_BASE_URL}${result.url}" download class="rm-btn rm-btn-ghost">
                            Download HTML
                        </a>
                    </div>
                </div>
            `;
        }
    }

    function displayError(message) {
        resultSection.style.display = 'block';
        resultContent.innerHTML = `
            <div class="result-error">
                <h3>❌ Generation Failed</h3>
                <p><strong>Error:</strong> ${message}</p>
                <p>Make sure the backend server is running on port 8000.</p>
                <div style="margin-top: 1rem;">
                    <button onclick="checkServerHealth()" class="rm-btn rm-btn-ghost">
                        Check Server Status
                    </button>
                </div>
            </div>
        `;
    }

    // Make checkServerHealth available globally
    window.checkServerHealth = async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            const health = await response.json();
            
            if (response.ok) {
                alert('✅ Server is healthy and running!');
            } else {
                alert('❌ Server is running but not healthy');
            }
        } catch (error) {
            alert('❌ Cannot connect to server. Make sure the Python backend is running on port 8000.');
        }
    };
});