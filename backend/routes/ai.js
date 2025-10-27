const express = require('express');
const router = express.Router();
const { withRetry } = require('../../ai_engine/retry_helper');
const prompts = require('../../ai_engine/prompts');
const Challenge = require('../models/Challenge');
const { getMockChallenge } = require('../data/mockChallenges');
const User = require('../models/User');
const { filterAnsweredQuestions, markQuestionAnswered, createHash } = require('../middleware/noRepeatHelper');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// @route   GET /ai/generate
// @desc    Generate challenge (no repeats for same user)
// @access  Public
router.get('/generate', async (req, res) => {
  try {
    const { type = 'music', difficulty = 'easy', userId } = req.query;

    // Generate multiple challenges to filter repeats
    const allChallenges = [];
    
    // Demo mode: Use mock data if OpenAI is not configured
    if (!openai) {
      console.log('🎮 DEMO MODE: Using mock challenges (OpenAI not configured)');
      
      // Get multiple mock challenges
      for (let i = 0; i < 10; i++) {
        const challenge = getMockChallenge(type, difficulty);
        // Add unique ID for repeat tracking
        challenge._id = `mock_${i}_${Date.now()}`;
        // Don't add variant text - keep prompts clean
        allChallenges.push(challenge);
      }
    } else {

    let response;
    try {
      response = await withRetry(async () => {
        // Enhanced prompt for audio-based challenges
        const audioPrompt = type === 'music' 
          ? `Create a music challenge. The prompt should instruct the user to LISTEN to audio and identify the song, dialogue, or complete lyrics. Format as JSON with: type, prompt, options, answer, difficulty, audioInstructions. The prompt should say "🎵 Listen to this audio" or similar to indicate audio will play.`
          : `Create a ${type} challenge with ${difficulty} difficulty. Return only JSON with fields: type, prompt, options, answer, difficulty, metadata.`;
        
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: prompts.system },
            { role: "user", content: audioPrompt },
            { role: "assistant", content: JSON.stringify({
              type: 'music',
              prompt: '🎵 Listen to this audio clip and guess the song name',
              options: ['Pahli Pahli Baar', 'Jai Ho', 'Munni Badnam', 'Chaiyya Chaiyya'],
              answer: 0,
              difficulty,
              audioInstructions: 'Audio will play - listen carefully'
            })},
            { role: "user", content: `Create a unique ${type} challenge with ${difficulty} difficulty.` }
          ],
          temperature: 0.8,
          max_tokens: 300
        });

        return completion.choices[0].message.content;
      });
    } catch (aiError) {
      console.log('⚠️ OpenAI failed, falling back to mock challenges:', aiError.message);
      // Fallback to mock challenges on any OpenAI error
      for (let i = 0; i < 10; i++) {
        const challenge = getMockChallenge(type, difficulty);
        challenge._id = `mock_${i}_${Date.now()}`;
        // Don't add variant text - keep prompts clean
        allChallenges.push(challenge);
      }
    }
    }

    // If we have allChallenges array (from mock), use it
    if (allChallenges.length > 0) {
      // Filter out questions user has already answered
      let filteredChallenges = allChallenges;
      if (userId) {
        filteredChallenges = await filterAnsweredQuestions(allChallenges, userId);
      }
      
      // Return first available challenge
      const selectedChallenge = filteredChallenges[0] || getMockChallenge(type, difficulty);
      
      return res.json({
        ok: true,
        data: selectedChallenge
      });
    }

    // Parse AI response
    let challenge;
    try {
      challenge = JSON.parse(response);
    } catch (e) {
      // Fallback if AI doesn't return pure JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      challenge = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        type,
        prompt: response.substring(0, 100),
        options: ['A', 'B', 'C'],
        answer: 0,
        difficulty
      };
    }

    // Validate and ensure required fields
    if (!challenge.options || !Array.isArray(challenge.options)) {
      challenge.options = ['A', 'B', 'C'];
    }
    if (typeof challenge.answer !== 'number') {
      challenge.answer = 0;
    }

    // Filter single challenge if user provided
    if (userId) {
      const filtered = await filterAnsweredQuestions([challenge], userId);
      challenge = filtered[0] || challenge;
    }

    res.json({
      ok: true,
      data: {
        type: challenge.type || type,
        prompt: challenge.prompt,
        options: challenge.options,
        answer: challenge.answer,
        difficulty: challenge.difficulty || difficulty,
        metadata: challenge.metadata || {}
      }
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to generate challenge',
      details: error.message 
    });
  }
});

// @route   POST /ai/createChallenge
// @desc    Create and save a challenge
// @access  Private
router.post('/createChallenge', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { type, prompt, options, answer, difficulty } = req.body;

    if (!type || !prompt || !options || typeof answer !== 'number') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide type, prompt, options, and answer' 
      });
    }

    const challenge = await Challenge.create({
      type,
      prompt,
      options,
      answer,
      difficulty,
      createdBy: req.user.id
    });

    res.status(201).json({
      ok: true,
      data: { challenge }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
