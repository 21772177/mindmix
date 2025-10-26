# 🔑 Complete Guide: Getting Your OpenAI API Key

## Quick Links

- **OpenAI Platform**: https://platform.openai.com
- **API Keys Page**: https://platform.openai.com/api-keys
- **Billing/Add Payment**: https://platform.openai.com/account/billing

---

## Visual Step-by-Step

### Step 1: Website
Go to: **https://platform.openai.com**

### Step 2: Login/Signup
- If you have an account → **Log In**
- If new → **Sign Up** (can use Google account)

### Step 3: Navigation
Click your **profile icon** (top right corner) → Select **"API Keys"**

**OR** go directly to: **https://platform.openai.com/api-keys**

### Step 4: Create Key
1. Click **"+ Create new secret key"** button
2. Enter name (optional): "AiLiveChallenge"
3. Click **"Create secret key"**
4. **🔥 COPY THE KEY NOW** (starts with `sk-proj-...`)
   - You won't see it again after you close the popup!

### Step 5: Add Payment (Required)
⚠️ **You must add a payment method to use the API**

1. Go to: **https://platform.openai.com/account/billing**
2. Click **"Add payment method"**
3. Enter credit card info
4. Confirm

**Don't worry**: 
- You get **$5 FREE credit** to start
- GPT-3.5 is **very cheap** (~$0.002 per challenge)
- $5 = ~2,500 challenges!

---

## After You Get the Key

### Method 1: Use Helper Script (Easiest)
```bash
cd /home/lenovo/AiLiveChallenge
./add_openai_key.sh

# Then paste your key when prompted
```

### Method 2: Edit File Manually
```bash
# Open the file
nano /home/lenovo/AiLiveChallenge/backend/.env

# Find this line:
OPENAI_API_KEY=your-openai-api-key-here

# Replace with:
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Save (Ctrl+X, then Y, then Enter)
```

### Method 3: One-Line Update
```bash
# Replace YOUR_KEY with your actual key
sed -i 's/OPENAI_API_KEY=.*/OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE/' /home/lenovo/AiLiveChallenge/backend/.env
```

---

## Test It Works

After adding the key, the server will auto-reload. Test with:

```bash
curl "http://localhost:4000/ai/generate?type=music&difficulty=easy"
```

**Expected**: Different challenge each time (not demo mode)

---

## Cost Information

| Feature | Cost |
|---------|------|
| **Free Credit** | $5 |
| **Per Challenge** | ~$0.002 |
| **$5 Worth** | ~2,500 challenges |
| **Very Affordable!** | Yes ✅ |

---

## Troubleshooting

### "Invalid API key" error
- Make sure you copied the entire key (starts with `sk-proj-`)
- No extra spaces before or after
- Key should be in one line

### "You exceeded your quota"
- Go to: https://platform.openai.com/account/billing
- Add payment method
- Check account has credits

### Still getting mock data after adding key?
- Server needs to restart (nodemon should auto-reload)
- Check key is correct: `grep OPENAI_API_KEY backend/.env`
- Key should not say `your-openai-api-key-here`

---

## Alternative: Skip OpenAI for Now

If you don't want to add OpenAI right now, you can:
- Continue testing with mock challenges (50+ available)
- Test the API functionality
- Add OpenAI later when ready
- The app works great even without it!

Your choice: Mock challenges work NOW, or add OpenAI for infinite AI challenges!
