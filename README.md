# 🧠 MindMix+ - Play Smart. Learn Faster.

A full-stack application combining music challenges and learning quizzes with real-time stats tracking and leaderboards.

## 🌐 Live Application

**Frontend:** https://mindmix-frontend.onrender.com  
**Backend:** https://mindmix-backend.onrender.com

## ✨ Features

- 🎵 **BeatRush** - Music challenges with voice detection
- 📚 **Knowledge Zone** - Educational quizzes
- 📊 **Real-time Stats** - Track your progress
- 🏆 **Leaderboard** - Compete globally
- 👤 **User Profiles** - View your achievements
- 🔐 **Secure Authentication** - MongoDB + JWT

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Render account for deployment

### Installation

```bash
# Clone repository
git clone https://github.com/21772177/mindmix.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend-web
npm install
```

### Configuration

**Backend Environment Variables:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
```

**Frontend Environment Variables:**
```env
REACT_APP_API_URL=https://mindmix-backend.onrender.com
```

### Run Locally

```bash
# Start backend
cd backend
npm start

# Start frontend (new terminal)
cd frontend-web
npm start
```

Visit: http://localhost:3000

## 📁 Project Structure

```
mindmix/
├── backend/              # Node.js API
│   ├── routes/         # API endpoints
│   ├── models/         # Database schemas
│   ├── middleware/     # Auth & validation
│   └── server.js       # Main server
├── frontend-web/       # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   └── config/     # API configuration
│   └── render.yaml      # Render deployment
└── ai_engine/          # AI helpers
```

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Axios
- Web Speech API
- CSS3

**Backend:**
- Node.js / Express
- MongoDB / Mongoose
- JWT Authentication
- bcrypt

**Deployment:**
- Render.com
- MongoDB Atlas
- GitHub

## 📊 Features

1. **User Authentication**
   - Registration with password hashing
   - JWT token-based auth
   - Protected API routes

2. **BeatRush Music Challenges**
   - Multiple music genres
   - Audio playback
   - Voice detection
   - Real-time scoring

3. **Knowledge Zone**
   - Educational quizzes
   - Multiple topics
   - Progress tracking

4. **Stats & Leaderboard**
   - Real-time stats updates
   - Global rankings
   - Streak tracking
   - Level progression

## 🧪 Testing

```bash
# Test backend
cd backend
npm test

# Test frontend
cd frontend-web
npm test
```

## 📝 API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /stats/user` - Get user stats
- `POST /stats/update` - Update stats
- `GET /analytics/leaderboard` - Get leaderboard
- `GET /ai/generate` - Generate challenges

## 🚀 Deployment

Deployed on Render.com with auto-deployment from GitHub.

**Services:**
- Frontend Web Service
- Backend Web Service
- MongoDB Database (Atlas)

## 📄 License

MIT License

## 👥 Contributing

Contributions welcome! Please open an issue or pull request.

## 📞 Support

For issues or questions, open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and MongoDB**

