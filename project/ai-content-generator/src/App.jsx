import React, { useState } from 'react';

function App() {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('video');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // FastAPI backend URL
  const API_BASE_URL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Call your FastAPI backend
      const apiResponse = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          generation_type: type, // Maps to your FastAPI TopicRequest model
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.detail || 'Generation failed');
      }

      const data = await apiResponse.json();
      
      // Transform FastAPI response to match your UI expectations
      setResponse({
        status: data.status,
        message: data.message,
        url: data.url ? `${API_BASE_URL}${data.url}` : null, // Full URL for static files
        file: data.file
      });
      
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles for the best visual experience
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundParticles: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    },
    particle: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: 0.1,
      animation: 'float 6s ease-in-out infinite'
    },
    particle1: {
      width: '80px',
      height: '80px',
      background: '#ff6b6b',
      top: '10%',
      left: '10%',
      animationDelay: '0s'
    },
    particle2: {
      width: '120px',
      height: '120px',
      background: '#4ecdc4',
      top: '20%',
      right: '15%',
      animationDelay: '2s'
    },
    particle3: {
      width: '60px',
      height: '60px',
      background: '#45b7d1',
      bottom: '15%',
      left: '20%',
      animationDelay: '4s'
    },
    particle4: {
      width: '100px',
      height: '100px',
      background: '#f9ca24',
      bottom: '20%',
      right: '10%',
      animationDelay: '1s'
    },
    content: {
      position: 'relative',
      zIndex: 10,
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px'
    },
    logo: {
      fontSize: '60px',
      marginBottom: '20px',
      animation: 'sparkle 3s ease-in-out infinite'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '20px',
      textShadow: '0 0 30px rgba(255,255,255,0.5)'
    },
    subtitle: {
      fontSize: '1.3rem',
      color: 'rgba(255,255,255,0.9)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    formContainer: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '30px',
      padding: '40px',
      marginBottom: '30px',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    inputGroup: {
      marginBottom: '30px'
    },
    label: {
      display: 'block',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '10px'
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      fontSize: '1.1rem',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '15px',
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#4ecdc4',
      background: 'rgba(255,255,255,0.25)',
      boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)'
    },
    typeSelection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    typeOption: {
      padding: '25px',
      borderRadius: '20px',
      border: '2px solid rgba(255,255,255,0.3)',
      background: 'rgba(255,255,255,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    typeOptionActive: {
      borderColor: '#4ecdc4',
      background: 'rgba(78, 205, 196, 0.2)',
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(78, 205, 196, 0.3)'
    },
    typeOptionContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    typeIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    typeIconActive: {
      background: '#4ecdc4'
    },
    typeTitle: {
      color: 'white',
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '5px'
    },
    typeDescription: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.95rem'
    },
    submitButton: {
      width: '100%',
      padding: '18px 40px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    submitButtonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
    },
    submitButtonDisabled: {
      background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
      cursor: 'not-allowed',
      transform: 'none'
    },
    spinner: {
      width: '24px',
      height: '24px',
      border: '3px solid rgba(255,255,255,0.3)',
      borderTop: '3px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    errorMessage: {
      background: 'rgba(231, 76, 60, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(231, 76, 60, 0.5)',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    errorIcon: {
      fontSize: '24px',
      color: '#e74c3c'
    },
    errorText: {
      color: '#fff',
      fontSize: '1.1rem'
    },
    successMessage: {
      background: 'rgba(46, 204, 113, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(46, 204, 113, 0.5)',
      borderRadius: '25px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    successHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px'
    },
    successIcon: {
      fontSize: '32px',
      color: '#2ecc71'
    },
    successTitle: {
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: 'bold'
    },
    videoContainer: {
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '20px'
    },
    videoPlayer: {
      width: '100%',
      aspectRatio: '16/9',
      borderRadius: '15px',
      backgroundColor: '#2c3e50'
    },
    videoPlayerFallback: {
      width: '100%',
      aspectRatio: '16/9',
      background: '#2c3e50',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '15px'
    },
    playIcon: {
      fontSize: '64px',
      color: '#95a5a6'
    },
    videoText: {
      color: '#bdc3c7',
      textAlign: 'center'
    },
    learningPathContainer: {
      background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(155, 89, 182, 0.2))',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    learningPathIcon: {
      fontSize: '64px',
      color: '#3498db',
      marginBottom: '20px'
    },
    learningPathTitle: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '15px'
    },
    learningPathDescription: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: '1.1rem',
      marginBottom: '30px',
      lineHeight: '1.6'
    },
    learningPathButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(45deg, #3498db, #9b59b6)',
      color: 'white',
      padding: '15px 30px',
      borderRadius: '15px',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.1rem'
    },
    downloadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(45deg, #27ae60, #2ecc71)',
      color: 'white',
      padding: '12px 25px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      marginLeft: '15px'
    }
  };

  // Add CSS animations
  const cssAnimations = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes sparkle {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(180deg); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.2; }
    }
    @media (max-width: 768px) {
      .title { font-size: 2.5rem !important; }
      .subtitle { font-size: 1.1rem !important; }
      .form-container { padding: 25px !important; }
      .type-selection { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        {/* Animated Background Particles */}
        <div style={styles.backgroundParticles}>
          <div style={{...styles.particle, ...styles.particle1}}></div>
          <div style={{...styles.particle, ...styles.particle2}}></div>
          <div style={{...styles.particle, ...styles.particle3}}></div>
          <div style={{...styles.particle, ...styles.particle4}}></div>
        </div>

        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logo}>✨</div>
            <h1 style={styles.title} className="title">AI Content Generator</h1>
            <p style={styles.subtitle} className="subtitle">
              Transform any topic into engaging videos or comprehensive learning paths with the power of AI
            </p>
          </div>

          {/* Main Form */}
          <div style={styles.formContainer} className="form-container">
            <div onSubmit={handleSubmit}>
              {/* Topic Input */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  What would you like to learn about?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter any topic (e.g., Python, Machine Learning, Cooking...)"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  required
                />
              </div>

              {/* Type Selection */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Choose your content type:
                </label>
                <div style={styles.typeSelection} className="type-selection">
                  <div
                    style={{
                      ...styles.typeOption,
                      ...(type === 'video' ? styles.typeOptionActive : {})
                    }}
                    onClick={() => setType('video')}
                  >
                    <div style={styles.typeOptionContent}>
                      <div style={{
                        ...styles.typeIcon,
                        ...(type === 'video' ? styles.typeIconActive : {})
                      }}>
                        ▶️
                      </div>
                      <div>
                        <div style={styles.typeTitle}>AI Video</div>
                        <div style={styles.typeDescription}>
                          Generate educational videos with AI narration
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.typeOption,
                      ...(type === 'learning_path' ? styles.typeOptionActive : {})
                    }}
                    onClick={() => setType('learning_path')}
                  >
                    <div style={styles.typeOptionContent}>
                      <div style={{
                        ...styles.typeIcon,
                        ...(type === 'learning_path' ? styles.typeIconActive : {})
                      }}>
                        📚
                      </div>
                      <div>
                        <div style={styles.typeTitle}>Learning Path</div>
                        <div style={styles.typeDescription}>
                          Curated YouTube videos in structured roadmap
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !topic.trim()}
                style={{
                  ...styles.submitButton,
                  ...(loading || !topic.trim() ? styles.submitButtonDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading && topic.trim()) {
                    Object.assign(e.target.style, styles.submitButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, styles.submitButton);
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    <span>Generating Amazing Content...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorMessage}>
              <div style={styles.errorIcon}>⚠️</div>
              <div style={styles.errorText}>{error}</div>
            </div>
          )}

          {/* Success Response */}
          {response && response.status === 'success' && (
            <div style={styles.successMessage}>
              <div style={styles.successHeader}>
                <div style={styles.successIcon}>✅</div>
                <div style={styles.successTitle}>{response.message}</div>
              </div>
              
              {type === 'video' ? (
                <div>
                  <div style={styles.videoContainer}>
                    {response.url ? (
                      <video
                        controls
                        style={styles.videoPlayer}
                        src={response.url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div style={styles.videoPlayerFallback}>
                        <div style={styles.playIcon}>▶️</div>
                        <div style={styles.videoText}>
                          <p>Video generated successfully!</p>
                          {response.file && (
                            <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                              File: {response.file}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: '1.1rem'}}>
                    Your AI-generated video is ready! Click play to watch and learn.
                  </p>
                  {response.url && (
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                      <a
                        href={response.url}
                        download={response.file}
                        style={styles.downloadButton}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <span>⬇️</span>
                        <span>Download Video</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div style={styles.learningPathContainer}>
                  <div style={styles.learningPathIcon}>📚</div>
                  <div style={styles.learningPathTitle}>
                    Your personalized learning roadmap is ready!
                  </div>
                  <div style={styles.learningPathDescription}>
                    We've curated the best YouTube videos and organized them into a structured learning path just for you.
                  </div>
                  <div>
                    {response.url && (
                      <a
                        href={response.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.learningPathButton}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-3px)';
                          e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <span>📖</span>
                        <span>Open Learning Path</span>
                      </a>
                    )}
                    {response.url && (
                      <a
                        href={response.url}
                        download={response.file}
                        style={styles.downloadButton}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <span>⬇️</span>
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;