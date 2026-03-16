# Chatbot API Setup Guide

## Your API Key is Already Configured! ✅

Good news! I've already added your Gemini API key to both chatbots:

**API Key:** `AIzaSyBSCUaw68g1maX7sXkkBT0_ZiVCgolYQtQ`

## Where the API Keys Are Located

### 1. Main Hub Chatbot
**File:** `/src/screens/ChatbotScreen.js`
**Line:** 22

```javascript
const YOUR_API_KEY_HERE = 'AIzaSyBSCUaw68g1maX7sXkkBT0_ZiVCgolYQtQ';
```

### 2. Conditions Guide Chatbot
**File:** `/src/screens/ConditionsGuideScreen.js`
**Line:** 21

```javascript
const YOUR_API_KEY_HERE = 'AIzaSyBSCUaw68g1maX7sXkkBT0_ZiVCgolYQtQ';
```

## What I Just Did

✅ **Replaced dummy responses** with real Gemini API integration
✅ **Added your API key** to the Conditions Guide chatbot
✅ **Implemented condition-specific context** - The chatbot knows which condition you're asking about
✅ **Added bilingual support** - Responds in Hindi or English based on app language
✅ **Added error handling** - Shows helpful messages if something goes wrong
✅ **Added chat history** - Maintains conversation context

## How It Works Now

### Main Hub Chatbot
- General AI assistant for any questions
- Responds in user's selected language (English/Hindi)
- Friendly, encouraging tone for children

### Conditions Guide Chatbot
- **Context-aware** - Knows which condition you're viewing
- **Expert mode** - Acts as a specialist in that specific condition
- **Parent-focused** - Helps caregivers understand the condition
- **Practical advice** - Provides actionable guidance
- **Bilingual** - Full Hindi/English support

## Example Conversations

### Autism Chatbot (English)
**User:** "How can I help my child with social skills?"
**Bot:** Provides autism-specific social skills strategies

### Autism Chatbot (Hindi)
**User:** "मैं अपने बच्चे को सामाजिक कौशल में कैसे मदद कर सकता हूं?"
**Bot:** ऑटिज़्म-विशिष्ट सामाजिक कौशल रणनीतियां प्रदान करता है

## Features

### Condition-Specific Intelligence
Each condition's chatbot has specialized knowledge:
- **Autism:** Communication strategies, sensory support
- **Down Syndrome:** Developmental milestones, learning approaches
- **ADHD:** Focus techniques, behavior management
- **Dyslexia:** Reading strategies, learning accommodations
- **Cerebral Palsy:** Motor support, accessibility tips
- **Intellectual Disability:** Cognitive support, skill building
- **Speech Delay:** Language development, communication tools

### Smart System Prompts
The chatbot receives condition-specific instructions:
- Be an expert in the specific condition
- Help parents/caregivers understand
- Provide practical, actionable advice
- Simplify medical terminology
- Maintain hope and positivity
- Recommend professional help when needed

### Language Detection
Automatically responds in the user's language:
```javascript
language === 'hi' ? 'Hindi response' : 'English response'
```

## Testing the Chatbot

1. **Open the app**
2. **Go to Side Menu → Conditions Guide**
3. **Select any condition** (e.g., Autism)
4. **Tap "Ask Questions" button**
5. **Type a question** like:
   - "What are the early signs?"
   - "How can I help at home?"
   - "What therapy options exist?"
6. **Get AI-powered response!**

## If You Need to Change the API Key

### For Main Chatbot:
Edit `/src/screens/ChatbotScreen.js` line 22:
```javascript
const YOUR_API_KEY_HERE = 'YOUR_NEW_KEY_HERE';
```

### For Conditions Chatbot:
Edit `/src/screens/ConditionsGuideScreen.js` line 21:
```javascript
const YOUR_API_KEY_HERE = 'YOUR_NEW_KEY_HERE';
```

## API Model Used

**Model:** `gemini-2.0-flash-exp`
- Fast responses
- High quality
- Supports long conversations
- Multilingual

## Error Handling

The chatbot handles:
- ✅ Missing API key
- ✅ Network errors
- ✅ API errors
- ✅ Empty responses
- ✅ Rate limiting

All errors show user-friendly messages in the correct language.

## Cost & Limits

**Gemini API Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

This should be more than enough for testing and moderate use!

## Security Note

⚠️ **Important:** In production, you should:
1. Move API key to environment variables
2. Use a backend proxy to hide the key
3. Implement rate limiting
4. Add user authentication

For development/testing, the current setup works fine!

## Ready to Use! 🎉

Both chatbots are now fully functional with real AI responses. Just run the app and start asking questions!

The Conditions Guide chatbot is particularly powerful because it:
- Knows which condition you're asking about
- Provides expert, condition-specific advice
- Helps parents understand severity levels
- Offers practical support strategies
- Responds in your language

Try it out! 🚀
