# 🔑 Add OpenAI API Key - Quick Guide

## Get Your OpenAI API Key

1. **Visit**: https://platform.openai.com/api-keys
2. **Sign up** or **Log in** to your account
3. **Click** "Create new secret key"
4. **Name it**: "AiLiveChallenge" (or any name)
5. **Copy the key** (starts with `sk-...`)

## Add Payment Method (Required)
- Go to: https://platform.openai.com/account/billing
- Add a payment method
- You get $5 free credit to start
- GPT-3.5-turbo is very cheap (~$0.002 per challenge)

## Update Your .env File

After you get your key, run:

```bash
# Option 1: Edit the file
nano /home/lenovo/AiLiveChallenge/backend/.env

# OR Option 2: Use sed to replace
# Replace YOUR-KEY-HERE with your actual key
sed -i 's/OPENAI_API_KEY=your-openai-api-key-here/OPENAI_API_KEY=sk-your-actual-key-here/' /home/lenovo/AiLiveChallenge/backend/.env
```

## After Adding the Key

1. **Restart the server** (it will auto-reload with nodemon)
2. **Test AI generation**:
```bash
curl "http://localhost:4000/ai/generate?type=music&difficulty=easy"
```
3. **Check response** - should show real AI-generated content without `"demo: true"`

## Cost Estimate

- **Free Tier**: $5 credit
- **Per Challenge**: ~$0.002 (GPT-3.5-turbo)
- **$5 credit = ~2,500 challenges**
- **Very affordable** for testing!

## Troubleshooting

**Error: "You exceeded your current quota"**
- Add payment method at https://platform.openai.com/account/billing

**Error: "Invalid API key"**
- Check the key is copied correctly
- Make sure it starts with `sk-`
- No extra spaces

**Still getting mock data?**
- Server must restart after .env update
- Check: `grep OPENAI_API_KEY backend/.env`
