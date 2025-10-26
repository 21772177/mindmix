# 🧠 MindMix+

**Where Fun Meets Knowledge — Music, Quizzes & Learning Challenges, All in One App**

[![Vercel](https://vercelbadge.com)](https://vercel.com/new/clone)

## ✨ Features

### 🎵 Play Mode
- **BeatRush**: Music challenges across 14+ genres
  - Guess the Song
  - Guess the Dialogue
  - Complete the Lyrics
  - Instrument Match
  - Memory Play
- **Live Voice Detection**: Real-time speech recognition
- **Group Challenges**: Compete with friends
- **Live Battle Mode**: Head-to-head competitions

### 📚 Learn Mode
- **Knowledge Zone**: Educational quizzes
- **UPSC/MPSC Questions**: Preparation-focused challenges
- **Timed Challenges**: Difficulty-based time limits
- **No Repeat Questions**: Fresh content every time

### 🏆 Social & Gamification
- Global leaderboards
- XP & Level system
- Achievements & Badges
- Friend connections
- Streak tracking
- Category rankings

### 🎯 Smart Features
- AI-powered challenge generation
- Personal recommendations
- Progress tracking
- Audio narration (optional)
- Challenge history
- User profiles with stats

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/mindmix.git
cd mindmix

# Install dependencies
cd backend && npm install
cd ../frontend-web && npm install
cd ..
```

### Configuration

1. **Backend Configuration:**
```bash
cd backend
cp env.example .env
# Edit .env with your credentials
```

2. **Environment Variables:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key (optional)
```

### Run Locally

```bash
# Start backend (in one terminal)
cd backend
npm start

# Start frontend (in another terminal)
cd frontend-web
npm start
```

Visit: http://localhost:3000

## 🌐 Deployment

### Deploy to Vercel (Recommended)

**Frontend:**
```bash
cd frontend-web
vercel
```

**Backend:**
```bash
cd backend
vercel
```

Or use the [Vercel dashboard](https://vercel.com) to import from GitHub.

### Other Platforms
- Netlify
- Render
- Railway

See `DEPLOY_TO_VERCEL.md` for detailed deployment instructions.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **AI:** OpenAI GPT-3.5
- **Auth:** JWT + bcrypt
- **Real-time:** Socket.io
- **Deployment:** Vercel

## 📱 Screenshots

_Coming soon_

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Built with ❤️ for students and learners everywhere.

---

**App Name:** MindMix+
**Tagline:** Play Smart. Learn Faster.
**Colors:** Electric Blue (#007BFF), Neon Purple (#8A2BE2)
