# 🎵 Audio Integration Plan for BeatRush

## Current Status

BeatRush currently shows **text-only** challenges. User wants **real audio playback** based on challenge type.

## Required Implementation

### **Challenge Types That Need Audio:**

1. **🎧 Guess the Song** - Play audio clip, user guesses
2. **🗣️ Guess the Dialogue** - Play dialogue audio, user identifies movie
3. **🎼 Complete the Lyrics** - Play partial song, user completes lyrics
4. **🎵 Instrument Match** - Play instrument sound, user identifies
5. **🧠 Memory Play** - Play sequence, user remembers order

### **What Needs to Be Done:**

#### 1. **Audio File Storage** 📁
   - Upload audio files to a CDN (e.g., Cloudinary, AWS S3, or public folder)
   - Store audio URLs in database
   - Or host on GitHub/render

#### 2. **Database Schema Update** 📊
   Add to `BeatRushChallenge` model:
   ```javascript
   {
     audioUrl: String,  // URL to audio file
     audioDuration: Number,  // in seconds
     audioType: String  // 'song', 'dialogue', 'instrument'
   }
   ```

#### 3. **Backend API Enhancement** 🔧
   Create endpoint to return challenges with audio:
   ```javascript
   // backend/routes/beatrush.js
   GET /api/beatrush/challenge
   - Returns: challenge with audioUrl
   ```

#### 4. **Frontend Audio Player** 🎧
   Add audio player to BeatRush component:
   ```javascript
   - Audio element with controls
   - Play/Pause button
   - Progress bar
   - Volume control
   - Auto-play option
   ```

#### 5. **Mock Data with Real URLs** 📝
   Replace text prompts with audio URLs:
   ```javascript
   {
     prompt: "Guess the song",
     audioUrl: "https://example.com/audio/song1.mp3",
     options: [...],
     answer: 0
   }
   ```

## Recommended Approach

### **Option 1: Use Public Audio URLs (Quick)**
- Find free music/dialogue clips online
- Use direct URLs (YouTube, SoundCloud, etc.)
- Store URLs in database
- Play audio in HTML5 audio element

### **Option 2: Upload to Cloudinary (Best)**
- Upload audio files to Cloudinary
- Get CDN URLs
- Store in database
- Fast, reliable delivery

### **Option 3: Use Web Speech API (Temporary)**
- Convert text to speech
- Use browser's text-to-speech
- Good for testing
- Limited quality

## Implementation Priority

1. ⚠️ **Quick Fix** (Today):
   - Add audio player UI to BeatRush
   - Use mock audio URLs
   - Test playback

2. 📊 **Database** (Next):
   - Add audioUrl field to challenges
   - Update backend API
   - Store real audio URLs

3. 🎵 **Real Audio** (Later):
   - Upload audio files
   - Connect to CDN
   - Add to database

## Current Code Status

BeatRush.js already has:
- ✅ Audio ref: `audioRef = useRef(null)`
- ✅ State: `audioUrl`, `isPlaying`
- ✅ But uses text prompts only

**Need to add:**
- Audio player component
- Real audio URLs
- Database storage

## Next Steps

1. Create audio player component
2. Add audio URLs to mock data
3. Test audio playback
4. Update backend to return audio URLs
5. Store audio files online

---

**Priority:** HIGH  
**Estimated Time:** 2-3 hours for basic implementation  
**Difficulty:** Medium

