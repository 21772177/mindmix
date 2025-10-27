# 🎵 Audio Setup Guide for BeatRush

## Current Situation

BeatRush has audio player UI ready, but needs **real audio files** instead of text prompts.

## What You Need to Do

### **Option 1: Use Free Online Audio (Quickest)**

1. Find royalty-free music/sound effects:
   - Freesound.org
   - Zapsplat
   - YouTube Audio Library
   - Bensound

2. Download audio clips (5-15 seconds each)

3. Upload to a CDN:
   - **Cloudinary** (Recommended - Free tier available)
   - **AWS S3**
   - **Google Cloud Storage**
   - **GitHub** (as release assets)

4. Replace URLs in `BeatRush.js`:
   ```javascript
   audioUrl: 'https://your-cdn.com/audio/song1.mp3'
   ```

### **Option 2: Store in MongoDB with URLs**

Add audio URLs to database:

```javascript
// backend/models/BeatRushChallenge.js
{
  audioUrl: 'https://cdn.example.com/bollywood-song1.mp3',
  prompt: '🎵 Listen to this song and guess',
  options: [...],
  answer: 0
}
```

### **Option 3: Text-to-Speech (Temporary)**

Use browser's text-to-speech for immediate testing:

```javascript
const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN'; // Indian English
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

// Use in BeatRush:
speakText("Pahli pahli baar hun kisipe fida");
```

## Quick Implementation

For **immediate testing** with audio:

1. **Add a few real audio URLs** to mock data
2. **Test playback** in BeatRush
3. **Verify audio controls work**
4. **Then add more audio files**

## Recommended URLs for Testing

You can use these free sample audio URLs:

```javascript
// Sample song (demo)
audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

// Or use YouTube (with youtube-dl URL conversion)
audioUrl: 'https://www.youtube.com/embed/VIDEO_ID'
```

## Where to Add Audio URLs

**File:** `frontend-web/src/components/BeatRush.js`

**Location:** Line 85-140 (getMockMusicChallenge function)

**Current Code:**
```javascript
audioUrl: 'data:audio/wav;base64,...' // Base64 data
```

**Replace With:**
```javascript
audioUrl: 'https://your-audio-host.com/song.mp3' // Real URL
```

## Timeline

- **Quick Fix** (30 min): Add sample URLs, test playback
- **Full Implementation** (2-3 hours): Upload real audio, update all challenges
- **Production** (1 week): Add 50+ audio files for all genres

## Priority

This is **HIGH PRIORITY** for user experience.
BeatRush is designed for audio interaction, but currently shows text.

**Immediate action:** Add at least 5 real audio URLs per genre for testing.

