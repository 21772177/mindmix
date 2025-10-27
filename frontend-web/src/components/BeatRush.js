import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import './BeatRush.css';

function BeatRush({ user, token, onBack }) {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [challengeNumber, setChallengeNumber] = useState(1);
  const [genre, setGenre] = useState('');
  const [challengeType, setChallengeType] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const genreOptions = [
    'bollywood', 
    'hollywood', 
    'punjabi', 
    'tollywood', 
    'kollywood', 
    'kannada',
    'odia',
    'marathi',
    'gujarati',
    'bengali',
    'classical',
    'pop',
    'hindi-rap',
    'indian-folk'
  ];

  // Music challenge types
  const challengeTypes = [
    { id: 'guess-song', name: '🎧 Guess the Song', description: 'Guess the song from audio snippet' },
    { id: 'guess-dialogue', name: '🗣️ Guess the Dialogue', description: 'Identify the movie from dialogue' },
    { id: 'complete-lyrics', name: '🎼 Complete the Lyrics', description: 'Fill in the missing lyrics' },
    { id: 'instrument', name: '🎵 Instrument Match', description: 'Identify the instrument from sound' },
    { id: 'memory', name: '🧠 Memory Play', description: 'Remember the order of music clips' }
  ];

  useEffect(() => {
    // Don't auto-generate, wait for user selections
  }, []);

  const generateChallenge = async () => {
    try {
      // Use selected challenge type instead of random
      const selectedType = challengeType || 'guess-song';
      
      // Get music challenge from backend
      const response = await axios.get(`${API_URL}/ai/generate`, {
        params: { 
          type: 'music', // Use music type
          difficulty: 'medium',
          genre: genre,
          challengeType: selectedType,
          userId: user?.id 
        }
      });
      
      if (response.data.ok) {
        setCurrentChallenge(response.data.data);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
      }
    } catch (err) {
      console.error('Failed to generate challenge:', err);
      // Fallback to mock challenge
      setCurrentChallenge(getMockMusicChallenge());
    }
  };

  const getMockMusicChallenge = () => {
    // Mock challenges by genre with real audio URLs
    const genreChallenges = {
      'bollywood': [
        {
          type: 'guess-song',
          prompt: '🎵 Listen to this song and guess the name!',
          options: ['Humko Tumse Pyar Hai', 'Tujh Mein Rab Dikhta Hai', 'Munni Badnam Hui', 'Chaiyya Chaiyya'],
          answer: 0,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Sample audio URL
        },
        {
          type: 'guess-dialogue',
          prompt: '🗣️ "Pushpa naam sunke flower samajh aaya?" - From which movie?',
          options: ['Pushpa', 'Bahubali', 'KGF', 'RRR'],
          answer: 0
        }
      ],
      'tollywood': [
        {
          type: 'guess-song',
          prompt: '🎵 "Manasa manayunanthananaria..." - Which Telugu movie song?',
          options: ['Baahubali', 'Magadheera', 'RRR', 'Saaho'],
          answer: 0
        },
        {
          type: 'guess-dialogue',
          prompt: '🗣️ "Nenu antu ledhu, nuv antu nuvve" - Which famous Telugu dialogue?',
          options: ['Baahubali', 'Magadheera', 'Pokiri', 'Temper'],
          answer: 1
        }
      ],
      'kollywood': [
        {
          type: 'guess-song',
          prompt: '🎵 "Enna ennatha solla..." - From which Tamil movie?',
          options: ['Mersal', 'Viswasam', 'Vedalam', 'Remo'],
          answer: 0
        }
      ],
      'kannada': [
        {
          type: 'guess-song',
          prompt: '🎵 "Huttidare kannada nadalli..." - Guess this Kannada song?',
          options: ['Pogaru', 'Campus', 'Santhu Straight Forward', 'Doddmane Hudga'],
          answer: 2
        }
      ],
      'odia': [
        {
          type: 'guess-song',
          prompt: '🎵 "Mu ebejana heuchhi..." - Which Odia song?',
          options: ['Bhai Nijhum', 'Suna Paruna', 'Jhia Jhia', 'Rangabati'],
          answer: 3
        }
      ],
      'punjabi': [
        {
          type: 'guess-song',
          prompt: '🎵 "Jatt da muqabala..." - Guess the Punjabi song?',
          options: ['Jatt Da Muqabala', 'Naah', 'Gal Ban Gayi', 'Cheques'],
          answer: 0
        }
      ]
    };

    // Get challenges for current genre or default to bollywood
    const challenges = genreChallenges[genre] || genreChallenges['bollywood'];
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  // Audio playback functions
  const playAudio = (audioData) => {
    if (audioData) {
      setAudioUrl(audioData);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    setAudioUrl(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Real-time voice detection using Web Speech API
  const startVoiceDetection = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true; // Keep listening
    recognitionRef.current.interimResults = true; // Show results as speaking
    recognitionRef.current.lang = 'en-IN'; // Indian English for better detection

    recognitionRef.current.onresult = (event) => {
      let currentTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setDetectedText(currentTranscript);
      setIsDetecting(true);
      
      // Check if spoken text matches expected answer
      checkVoiceAnswer(currentTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // User stopped speaking, check the final result
        if (detectedText) {
          finalizeVoiceCheck();
        }
      }
    };

    recognitionRef.current.onend = () => {
      // Auto-restart for continuous listening
      if (isListening) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore restart errors
        }
      }
    };

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setDetectedText('');
    } catch (err) {
      console.error('Error starting voice detection:', err);
      alert('Could not start voice detection. Please try again.');
    }
  };

  const stopVoiceDetection = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsDetecting(false);
    }
    
    // Finalize the answer check
    if (detectedText) {
      finalizeVoiceCheck();
    }
  };

  const checkVoiceAnswer = (transcript) => {
    if (!currentChallenge) return;
    
    const transcriptLower = transcript.toLowerCase().trim();
    const expectedAnswer = currentChallenge.options[currentChallenge.answer].toLowerCase();
    
    // Check if transcript contains keywords from expected answer
    const keywords = expectedAnswer.split(' ').filter(word => word.length > 3);
    const matches = keywords.filter(keyword => transcriptLower.includes(keyword));
    
    // If 50% or more keywords match, consider it correct
    if (matches.length >= Math.ceil(keywords.length * 0.5)) {
      handleAudioResult(true);
      stopVoiceDetection();
    }
  };

  const finalizeVoiceCheck = () => {
    if (detectedText) {
      checkVoiceAnswer(detectedText);
    }
  };

  const handleAudioResult = async (isCorrect) => {
    setIsCorrect(isCorrect);
    setShowResult(true);

    // Update stats in database
    if (token && user) {
      try {
        await axios.post(
          `${API_URL}/stats/update`,
          { type: 'beatrush', correct: isCorrect },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to update stats:', err);
      }
    }

    if (isCorrect) {
      setScore(score + 10);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    // Reset detection
    setIsDetecting(false);
    setDetectedText('');

    // Auto-advance after 2 seconds
    setTimeout(() => {
      setChallengeNumber(challengeNumber + 1);
      generateChallenge();
    }, 2000);
  };

  const handleAnswer = async (index) => {
    setSelectedAnswer(index);
    const correct = index === currentChallenge.answer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update stats in database
    if (token && user) {
      try {
        await axios.post(
          `${API_URL}/stats/update`,
          { type: 'beatrush', correct },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to update stats:', err);
      }
    }

    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      setChallengeNumber(challengeNumber + 1);
      generateChallenge();
    }, 2000);
  };

  const handleSkip = () => {
    setStreak(0);
    setChallengeNumber(challengeNumber + 1);
    generateChallenge();
  };

  const handleStartQuiz = () => {
    if (!genre || !challengeType) {
      alert('Please select both genre and challenge type!');
      return;
    }
    setQuizStarted(true);
    setChallengeNumber(1);
    setScore(0);
    setStreak(0);
    generateChallenge();
  };

  const handleBackToSelection = () => {
    setQuizStarted(false);
    setCurrentChallenge(null);
  };

  return (
    <div className="beatrush-container">
      <div className="beatrush-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h1>🎵 BeatRush</h1>
        {quizStarted && (
          <div className="stats-bar">
            <span>Score: {score}</span>
            <span>Streak: {streak} 🔥</span>
            <span>Challenge: #{challengeNumber}</span>
          </div>
        )}
      </div>

      {/* Selection Screen */}
      {!quizStarted ? (
        <>
          <div className="beatrush-header">
            <button className="btn btn-secondary" onClick={onBack}>
              ← Back to Dashboard
            </button>
            <h1>🎵 BeatRush Setup</h1>
          </div>
          
          {/* Genre Selection */}
          <div className="card genre-selection">
            <h3>🎵 Step 1: Select Genre</h3>
            <select 
              className="select-input"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: '2px solid #ddd',
                marginTop: '1rem'
              }}
            >
              <option value="">-- Select Genre --</option>
              {genreOptions.map(g => {
                // Format display name
                const displayName = g
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                return (
                  <option key={g} value={g}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Challenge Type Selection */}
          <div className="card challenge-type-selection">
            <h3>🎯 Step 2: Select Challenge Type</h3>
            <select 
              className="select-input"
              value={challengeType}
              onChange={(e) => setChallengeType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: '2px solid #ddd',
                marginTop: '1rem'
              }}
              disabled={!genre}
            >
              <option value="">{genre ? '-- Select Challenge Type --' : '-- Select Genre First --'}</option>
              {genre && challengeTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Start Button */}
          <div className="card start-quiz-card">
            <button 
              className="btn btn-primary" 
              onClick={handleStartQuiz}
              disabled={!genre || !challengeType}
              style={{ 
                width: '100%',
                padding: '1.5rem',
                fontSize: '1.3rem',
                borderRadius: '12px'
              }}
            >
              🚀 Start Quiz
            </button>
          </div>

          {/* Show info about selected options */}
          {genre && challengeType && (
            <div className="card quiz-preview">
              <h3>📋 Quiz Preview</h3>
              <p><strong>Genre:</strong> {genre.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
              <p><strong>Challenge:</strong> {challengeTypes.find(t => t.id === challengeType)?.name}</p>
              <p><strong>Description:</strong> {challengeTypes.find(t => t.id === challengeType)?.description}</p>
            </div>
          )}
        </>
      ) : (
        /* Quiz Active Screen */
        <>
          {/* Back to selection button */}
          <div className="card" style={{marginBottom: '1rem'}}>
            <button className="btn btn-secondary" onClick={handleBackToSelection}>
              ← Change Genre/Type
            </button>
          </div>

          {/* Challenge Display */}
          {currentChallenge ? (
            <div className="challenge-card">
              <div className="challenge-type">
                {challengeTypes.find(t => t.id === challengeType)?.name || '🎵 Music Challenge'}
              </div>
              
              <div className="challenge-prompt">
                {currentChallenge.prompt}
              </div>

        {/* Audio controls for audio-based challenges */}
        {currentChallenge.type && ['guess-song', 'complete-lyrics', 'memory'].includes(currentChallenge.type) && (
          <div className="audio-controls">
            {!isPlaying ? (
              <button 
                className="btn btn-audio" 
                onClick={() => playAudio(currentChallenge.audioUrl)}
              >
                ▶️ Play Audio
              </button>
            ) : (
              <button 
                className="btn btn-audio-stop" 
                onClick={stopAudio}
              >
                ⏸️ Stop
              </button>
            )}
            {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={stopAudio} autoPlay />}
          </div>
        )}

        {/* Real-time voice detection for singing/speaking answers */}
        {(currentChallenge.type === 'complete-lyrics' || currentChallenge.type === 'guess-dialogue') && (
          <div className="voice-controls">
            {!isListening ? (
              <button 
                className="btn btn-listen" 
                onClick={startVoiceDetection}
              >
                🎤 Start Speaking/Singing
              </button>
            ) : (
              <button 
                className="btn btn-listen-stop" 
                onClick={stopVoiceDetection}
              >
                ⏹️ Stop & Check
              </button>
            )}
            {isListening && (
              <div className="voice-status">
                {isDetecting ? (
                  <div className="detecting-indicator">
                    <span className="pulse-dot"></span>
                    Listening... "{detectedText}"
                  </div>
                ) : (
                  <div className="waiting-indicator">
                    Speak now...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="options-grid">
          {currentChallenge.options.map((option, index) => {
            let className = 'option-btn';
            if (showResult && index === currentChallenge.answer) {
              className += ' correct';
            } else if (showResult && index === selectedAnswer && !isCorrect) {
              className += ' incorrect';
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`result-message ${isCorrect ? 'success' : 'failure'}`}>
            {isCorrect ? '🎉 Correct! +10' : '❌ Wrong'}
          </div>
        )}

        {!showResult && (
          <button className="btn btn-secondary skip-btn" onClick={handleSkip}>
            Skip →
          </button>
        )}
            </div>
          ) : (
            <div className="card">
              <p>Loading challenge...</p>
            </div>
          )}
        </>
      )}

      {/* Challenge Types Info - Only show when not started */}
      {!quizStarted && (
        <div className="card challenge-types-info">
          <h3>Challenge Types</h3>
          <div className="challenge-grid">
            {challengeTypes.map(type => (
              <div key={type.id} className="challenge-type-card">
                <div className="type-icon">{type.name.split(' ')[0]}</div>
                <div className="type-name">{type.name}</div>
                <div className="type-desc">{type.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BeatRush;

