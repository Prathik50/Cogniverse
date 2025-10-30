# API Keys Setup

## How to Configure API Keys

To use the AI features in CogniVerse, you need to add your API keys to the configuration file.

### Step 1: Get Your API Keys

1. **Gemini Pro API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Create a new project
   - Generate an API key for Gemini Pro

2. **Imagen API Key**:
   - In the same Google AI Studio project
   - Generate an API key for Imagen (image generation)

### Step 2: Add Keys to Config File

1. Open the file: `src/config/apiKeys.js`
2. Replace the placeholder values with your actual API keys:

```javascript
const API_KEYS = {
  GEMINI_API_KEY: 'your_actual_gemini_api_key_here',
  IMAGEN_API_KEY: 'your_actual_imagen_api_key_here',
};
```

### Step 3: Restart the App

After adding your API keys, restart the React Native app:

```bash
npx react-native run-ios
# or
npx react-native run-android
```

## Features That Use API Keys

### Gemini Pro API Key
- **Sentence Builder**: Generates sentence descriptions and scenarios
- **Feelings Finder**: Creates contextual stories for emotions
- **Story Time**: Generates custom social stories
- **My Voice**: Future text generation features

### Imagen API Key
- **My Voice**: Generates custom symbols for any word
- **Sentence Builder**: Creates visual elements for scenarios

## Security Notes

- **Never commit API keys to version control**
- The `apiKeys.js` file is already in `.gitignore` to prevent accidental commits
- API keys are only used locally on your device
- Keys are not transmitted to any external servers except Google's official APIs

## Troubleshooting

If you see "API Key Required" messages:
1. Check that you've replaced the placeholder values in `apiKeys.js`
2. Verify your API keys are valid and active
3. Make sure you've restarted the app after adding the keys
4. Check your internet connection

## Free Tier Limits

Both Gemini Pro and Imagen have free tiers with generous limits:
- **Gemini Pro**: 15 requests per minute, 1 million tokens per day
- **Imagen**: 100 requests per day

These limits are more than sufficient for development and testing.

