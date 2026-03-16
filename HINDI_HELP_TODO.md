# Hindi Help Content Translation - TODO

## Current Status
✅ **Infrastructure Complete**: The help system now supports language switching
✅ **English Content**: Fully comprehensive with 240+ lines of detailed help
⚠️ **Hindi Content**: Currently using English as fallback (needs translation)

## What Was Done
1. Renamed `HELP_CONTENT` to `HELP_CONTENT_EN`
2. Added `HELP_CONTENT_HI` placeholder
3. Updated HelpModal to detect language and use appropriate content
4. System now switches between EN/HI based on language setting

## How It Works Now
```javascript
const { language } = useTheme();
const HELP_CONTENT = language === 'hi' ? HELP_CONTENT_HI : HELP_CONTENT_EN;
```

When user changes language to Hindi, the help system will automatically use `HELP_CONTENT_HI`.

## What Needs Translation

The help content has **5 main contexts**, each with multiple sections:

### 1. Hub (7 sections)
- Welcome to CogniVerse
- Autism & Communication
- Learning Basics
- Social Skills  
- Educational Games
- Profile & Dashboard
- Help & Guidance

### 2. Autism Suite (6 sections)
- Suite Overview
- My Voice - Communication Board
- Learn to Build - Sentence Construction
- Feelings Finder - Emotional Literacy
- Story Time - Social Stories
- Integration Tips

### 3. Communication Board (6 sections)
- Getting Started
- How to Use
- Understanding Categories
- Building Phrases
- Personalization
- Impact and Benefits

### 4. Sentence Builder (5 sections)
- Overview
- How it Works
- Three Learning Levels
- Learning Through Feedback
- Impact and Benefits

### 5. Feelings Finder (5 sections)
- Overview
- Exploring 8 Core Emotions
- Using Feelings in Daily Life
- Building Emotional Awareness
- Impact and Benefits

### 6. Story Time (5 sections)
- Overview
- How Story Time Works
- Creating Custom Stories
- Maximizing Story Benefits
- Impact and Benefits

### 7. Dashboard (5 sections)
- Dashboard Overview
- Profile Information
- Daily Login Streak
- Progress Graph & Impact
- Using Dashboard Data

## How to Add Hindi Translation

### Option 1: Manual Translation (Recommended for Quality)
1. Open `/src/screens/HelpModal.js`
2. Find `const HELP_CONTENT_HI = HELP_CONTENT_EN;`
3. Replace with:
```javascript
const HELP_CONTENT_HI = {
  hub: [
    {
      id: 'welcome',
      name: 'कॉग्निवर्स में आपका स्वागत है',
      description: 'कॉग्निवर्स एक व्यापक शिक्षण साथी है...',
    },
    // ... continue for all sections
  ],
  autismSuite: [...],
  // ... etc
};
```

### Option 2: Use Translation Service
1. Copy all English content from `HELP_CONTENT_EN`
2. Use Google Translate API or professional translation service
3. Paste translated content into `HELP_CONTENT_HI`

### Option 3: Gradual Translation
Translate one context at a time:
1. Start with `hub` (most visible)
2. Then `autismSuite`
3. Then individual features

## Quick Start Example

Here's how to translate just the Hub welcome section:

```javascript
const HELP_CONTENT_HI = {
  hub: [
    {
      id: 'welcome',
      name: 'कॉग्निवर्स में आपका स्वागत है',
      description: 'कॉग्निवर्स एक व्यापक शिक्षण साथी है जो विशेष आवश्यकताओं वाले बच्चों को व्यक्तिगत, इंटरैक्टिव अनुभवों के माध्यम से सहायता प्रदान करने के लिए डिज़ाइन किया गया है। प्रत्येक सुविधा पहुंच और दृश्य शिक्षण को ध्यान में रखकर बनाई गई है। आपका मुख्य हब आपको चार प्रमुख मॉड्यूल तक पहुंच प्रदान करता है जो संचार, सामाजिक और संज्ञानात्मक कौशल बनाने के लिए एक साथ काम करते हैं।',
    },
    {
      id: 'autism-communication',
      name: 'ऑटिज़्म और संचार',
      description: 'इस व्यापक संचार मॉड्यूल में चार शक्तिशाली सुविधाएं हैं: "मेरी आवाज़" संचार बोर्ड के लिए असीमित एआई-जनित शब्दावली प्रदान करती है। "सीखें बनाना" वाक्य निर्माण को क्रमिक रूप से सिखाता है। "भावना खोजक" 8 मुख्य भावनाओं की खोज करके भावनात्मक शब्दावली विकसित करता है। "कहानी का समय" वास्तविक दुनिया की स्थितियों के लिए तैयार करने के लिए व्यक्तिगत सामाजिक कहानियां बनाता है।',
      icon: '🗣️',
      impact: 'अभिव्यंजक भाषा विकसित करता है, संचार बाधाओं से निराशा कम करता है, सामाजिक संपर्क में आत्मविश्वास बनाता है, और भावनात्मक नियमन में सुधार करता है।',
    },
    // ... continue with other hub sections
  ],
  // For now, use English for other contexts
  autismSuite: HELP_CONTENT_EN.autismSuite,
  communicationBoard: HELP_CONTENT_EN.communicationBoard,
  sentenceBuilder: HELP_CONTENT_EN.sentenceBuilder,
  feelingsFinder: HELP_CONTENT_EN.feelingsFinder,
  storyTime: HELP_CONTENT_EN.storyTime,
  dashboard: HELP_CONTENT_EN.dashboard,
};
```

## Testing
After adding Hindi content:
1. Run the app
2. Go to Settings → Language → हिंदी
3. Tap ❓ help button
4. Verify Hindi text appears
5. Switch back to English to verify it still works

## Estimated Translation Effort
- **Full translation**: ~2000+ words across all contexts
- **Priority translation** (Hub + Autism Suite): ~800 words
- **Time estimate**: 4-6 hours for professional translation

## Current Behavior
- English language: Shows full detailed English help ✅
- Hindi language: Shows English help (fallback) ⚠️
- Language switching: Works correctly ✅
- Help button visibility: Works on all screens ✅

The infrastructure is complete and working. Only the Hindi text content needs to be added!
