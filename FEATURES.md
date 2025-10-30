# CogniVerse - Autism & Communication Features

## Overview
CogniVerse now includes a comprehensive Autism & Communication suite with four main features designed to support communication, learning, and social understanding for individuals with autism and communication challenges.

## 🗣️ My Voice (Core Communication Board)
**Purpose**: AI-powered communication board with unlimited vocabulary

### Features:
- **Symbol-based Communication**: Tap pre-loaded symbols to build sentences
- **AI Symbol Generation**: Type any word to instantly create custom symbols with AI-generated images
- **Voice Output**: All symbols and sentences are spoken aloud using TTS
- **Sentence Building**: Build complete sentences by tapping symbols in sequence
- **Custom Vocabulary**: Create unlimited custom symbols for any word or concept

### How it Helps:
- Provides a limitless vocabulary beyond static AAC apps
- Enables spontaneous communication with any word or phrase
- Visual symbols support understanding and memory
- Voice output helps with pronunciation and communication

### AI Used:
- **Imagen API**: Generates custom symbol images
- **TTS**: Converts text to speech in English or Hindi

---

## 🧩 Sentence Builder (Grammar Learning)
**Purpose**: Interactive grammar learning through visual puzzles

### Features:
- **Picture-based Learning**: Visual scenarios to describe (e.g., "A boy eating an apple")
- **Word Arrangement**: Drag and arrange word symbols to build correct sentences
- **Progressive Levels**: Multiple difficulty levels with increasing complexity
- **Instant Feedback**: Immediate correction and encouragement
- **Visual Grammar**: Learn sentence structure without writing or typing

### How it Helps:
- Teaches sentence structure and grammar in a visual, interactive way
- Makes grammar learning fun and engaging
- Builds confidence in language construction
- Develops understanding of word order and relationships

### AI Used:
- **Gemini Pro**: Creates sentence descriptions and scenarios
- **Imagen API**: Generates main pictures and individual word symbols

---

## 😊 Feelings Finder (Emotional Literacy)
**Purpose**: Develop emotional recognition and understanding

### Features:
- **Emotion Recognition**: Interactive faces showing different emotions
- **Emotional Stories**: Contextual stories explaining when and why emotions occur
- **Voice Narration**: All emotions and stories are spoken aloud
- **Comprehensive Emotions**: Covers 8 core emotions (Happy, Sad, Angry, Surprised, Confused, Excited, Worried, Proud)
- **Real-world Context**: Stories relate to everyday situations

### How it Helps:
- Develops emotional literacy and recognition skills
- Teaches appropriate emotional responses
- Builds empathy and social understanding
- Provides vocabulary for expressing feelings

### AI Used:
- **Gemini Pro**: Generates contextual stories for each emotion
- **TTS**: Speaks emotion names and stories

---

## 📚 Story Time (Social Understanding)
**Purpose**: AI-generated social stories for new situations

### Features:
- **Custom Story Generation**: Create personalized stories for any social situation
- **Pre-built Stories**: Sample stories for common scenarios (birthday parties, doctor visits, grocery shopping)
- **Step-by-step Narratives**: Visual stories broken into manageable steps
- **Interactive Navigation**: Move through story steps at your own pace
- **Voice Narration**: Complete story narration with TTS

### How it Helps:
- Makes new or stressful situations predictable
- Reduces anxiety about unfamiliar social situations
- Teaches social expectations and routines
- Provides a safe way to practice and understand social scenarios

### AI Used:
- **Gemini Pro**: Generates custom social stories and step-by-step narratives
- **TTS**: Narrates complete stories

---

## ⚙️ API Configuration

### Required API Keys:
1. **Gemini Pro API Key**: For text generation, stories, and content creation
2. **Imagen API Key**: For custom symbol and image generation

### How to Get API Keys:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new project
4. Generate API keys for both Gemini Pro and Imagen
5. Enter the keys in the Settings screen

### Security:
- API keys are stored locally on your device using AsyncStorage
- Keys are encrypted and never shared with external servers
- You can update or remove keys at any time through Settings

---

## 🎯 Target Users

### Primary Users:
- Individuals with autism spectrum disorder
- Non-verbal or minimally verbal individuals
- People with communication challenges
- Children and adults learning language skills

### Secondary Users:
- Parents and caregivers
- Speech therapists and educators
- Special education teachers
- Anyone supporting communication development

---

## 🚀 Getting Started

1. **Install the App**: Download and install CogniVerse
2. **Configure API Keys**: Go to Settings and add your API keys
3. **Choose a Feature**: Select from the four main features
4. **Start Learning**: Begin with any feature that interests you
5. **Customize**: Adjust themes, text size, and voice settings as needed

---

## 🔧 Technical Features

### Accessibility:
- High contrast themes and large text options
- Voice feedback for all interactions
- Simple, intuitive interface design
- Customizable spacing and sizing

### Performance:
- Offline symbol storage
- Efficient image caching
- Smooth animations and transitions
- Optimized for mobile devices

### Customization:
- Multiple theme options
- Adjustable text sizes
- Configurable spacing
- Language support (English/Hindi)

---

## 📱 System Requirements

- **Platform**: React Native (iOS/Android)
- **Dependencies**: 
  - @google/generative-ai
  - react-native-tts
  - @react-native-async-storage/async-storage
- **API Requirements**: Internet connection for AI features
- **Storage**: Local storage for symbols and settings

---

## 🆘 Support

For technical support or feature requests, please contact the development team or refer to the main project documentation.

---

*CogniVerse - Empowering communication through technology*
