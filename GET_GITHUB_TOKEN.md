# 🔐 How to Get GitHub Personal Access Token

## Step-by-Step Instructions

### Step 1: Go to GitHub Settings
1. Open your browser
2. Go to: https://github.com
3. Click your **profile picture** (top right corner)
4. Click **"Settings"**

**Direct link:** https://github.com/settings/profile

---

### Step 2: Navigate to Developer Settings
1. On the left sidebar, scroll down
2. Click **"Developer settings"** (near the bottom)
3. If you don't see it, scroll the left sidebar down

**Direct link:** https://github.com/settings/apps

---

### Step 3: Go to Personal Access Tokens
1. In the left sidebar under "Developer settings"
2. Click **"Personal access tokens"**
3. Click **"Tokens (classic)"**

**Direct link:** https://github.com/settings/tokens

---

### Step 4: Generate New Token
1. Click **"Generate new token"** button (green button)
2. Click **"Generate new token (classic)"**
3. You may need to enter your GitHub password

---

### Step 5: Configure Token
**Fill in the form:**

1. **Note:** Type: `MindMix Deployment`
   (This is just a label, you can use any name)

2. **Expiration:** 
   - Select "90 days" (or "No expiration" if you want it permanent)

3. **Select scopes (permissions):**
   - ✅ Check **"repo"** (this gives access to all repositories)
     - This will automatically check these sub-permissions:
       - repo:status
       - repo_deployment
       - public_repo
       - repo:invite
       - security_events

4. Scroll down and click **"Generate token"** (green button)

---

### Step 6: Copy Token ⚠️
1. **A new page will open with your token**
2. **⚠️ IMPORTANT: Copy this token NOW!**
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You will NOT see it again!
3. Click the **copy icon** or select all and copy (Ctrl+C)

---

## Quick Visual Guide

```
GitHub.com
    ↓
Your Profile Picture (top right)
    ↓
Settings
    ↓
Left Sidebar: Developer settings
    ↓
Personal access tokens → Tokens (classic)
    ↓
Generate new token → Generate new token (classic)
    ↓
Fill form:
  Note: MindMix Deployment
  Expiration: 90 days
  ✅ repo (checked)
    ↓
Generate token
    ↓
COPY THE TOKEN (you won't see it again!)
```

---

## After Getting Token

### Use the Helper Script:
```bash
cd /home/lenovo/AiLiveChallenge
./push_to_github.sh
```
(Enter your token when asked)

### OR Manual Push:
```bash
cd /home/lenovo/AiLiveChallenge
git push -u origin main

# When asked:
Username: 21772177
Password: [paste your token]
```

---

## Troubleshooting

**Can't find "Developer settings"?**
- Make sure you're logged into GitHub
- Scroll the left sidebar all the way down
- Direct link: https://github.com/settings/tokens

**Token doesn't work?**
- Make sure you selected "repo" permission
- Token expires after selected time period
- Generate a new one if needed

**Already have a token?**
- You can reuse existing tokens
- Or create a new one specifically for MindMix

---

## Security Note

⚠️ **Never share your token publicly!**
- Keep it secret
- You can revoke it anytime from the same page
- If compromised, generate a new one immediately

---

## Next Steps After Getting Token

1. ✅ Get your token (follow steps above)
2. ✅ Run: `./push_to_github.sh`
3. ✅ Push to GitHub
4. ✅ Go to https://github.com/21772177/mindmix
5. ✅ Deploy to Vercel!

