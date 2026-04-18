import React, { createContext, useContext } from 'react';
import { useTheme } from './ThemeContext';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // App Name
    appName: 'CogniVerse',
    appSubtitle: 'Your Learning Companion',
    
    // Login Screen
    welcomeBack: 'Welcome Back!',
    createAccount: 'Create Your Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    age: 'Age',
    selectCondition: 'Select Condition',
    login: 'Log In',
    signup: 'Sign Up',
    noAccount: "Don't have an account? Sign Up",
    hasAccount: 'Already have an account? Log In',
    switchingToSignup: 'Switching to sign up',
    switchingToLogin: 'Switching to log in',
    fillAllFields: 'Please fill in all fields',
    passwordsNoMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    loginFailed: 'Login Failed',
    signupFailed: 'Signup Failed',
    error: 'Error',
    
    // Conditions
    conditions: {
      asd: 'Autism Spectrum Disorder',
      downSyndrome: 'Down Syndrome',
      adhd: 'ADHD',
      dyslexia: 'Dyslexia',
      cerebralPalsy: 'Cerebral Palsy',
      intellectualDisability: 'Intellectual Disability',
      speechDelay: 'Speech Delay',
      other: 'Other',
    },
    
    // Hub Screen
    openingSettings: 'Opening settings',
    returningToMenu: 'Returning to main menu',
    openingDashboard: 'Opening child dashboard',
    openingHelp: 'Opening help',
    openingAIHelper: 'Opening AI Helper',
    
    // Suites
    suites: {
      autismCommunication: {
        name: 'Autism & Communication',
        description: 'Symbol-based communication board with AI-powered symbol generation. Perfect for non-verbal communication and learning.',
      },
      learningBasics: {
        name: 'Learning Basics',
        description: 'Interactive flashcards for numbers, colors, letters, and daily routines — made fun and easy.',
      },
      socialSkills: {
        name: 'Social Skills',
        description: 'Learn greetings, eye contact, sharing, and more with big visual cards and voice guidance.',
      },
      games: {
        name: 'Fun & Games',
        description: 'Therapeutic games to build memory, emotions, counting, and pattern skills through play.',
      },
    },
    comingSoon: 'Coming Soon',
    
    // Settings Screen
    settings: 'Settings',
    visualSettings: 'Visual Settings',
    theme: 'Theme',
    textSettings: 'Text Settings',
    textSize: 'Text Size',
    spacingSettings: 'Spacing Settings',
    spacing: 'Spacing',
    languageSettings: 'Language Settings',
    language: 'Language',
    voiceSettings: 'Voice Settings',
    enableVoice: 'Enable Voice',
    speechRate: 'Speech Rate',
    
    // Theme names
    themes: {
      calm: 'Calm',
      highContrast: 'High Contrast',
      sepia: 'Sepia',
    },
    
    // Text sizes
    textSizes: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extraLarge: 'Extra Large',
    },
    
    // Spacing options
    spacingOptions: {
      compact: 'Compact',
      normal: 'Normal',
      spacious: 'Spacious',
      extraSpacious: 'Extra Spacious',
    },
    
    // Languages
    languages: {
      english: 'English',
      hindi: 'हिंदी (Hindi)',
    },
    
    // Communication Board
    myVoice: 'Communication Board',
    communicationBoard: 'Communication Board',
    myMessage: 'My Message',
    tapActionsBelow: 'Tap actions below to build your message...',
    speak: 'Speak',
    typeWord: 'Type a word to create a symbol...',
    create: 'Create',
    apiKeyRequired: 'API Key Required',
    configureImagenKey: 'Please configure your Imagen API key in Settings to generate custom symbols.',
    ok: 'OK',
    createdSymbol: 'Created symbol for',
    errorGeneratingImage: 'Could not generate image. Please try another word.',
    errorConnectingAI: 'An error occurred while connecting to the AI.',
    
    // Action Labels
    actions: {
      eating: 'Eating',
      drinking: 'Drinking',
      bathing: 'Bathing',
      brushingTeeth: 'Brushing Teeth',
      sleeping: 'Sleeping',
      gettingDressed: 'Getting Dressed',
      playing: 'Playing',
      reading: 'Reading',
      walking: 'Walking',
      sitting: 'Sitting',
      help: 'Help',
      toilet: 'Toilet',
      happy: 'Happy',
      sad: 'Sad',
      tired: 'Tired',
      hungry: 'Hungry',
      thirsty: 'Thirsty',
      hot: 'Hot',
      cold: 'Cold',
      sick: 'Sick',
      washingHands: 'Washing Hands',
      cooking: 'Cooking',
      cleaning: 'Cleaning',
      watchingTV: 'Watching TV',
    },
    
    // Categories
    categories: {
      all: 'All',
      daily: 'Daily',
      activity: 'Activity',
      need: 'Needs',
      emotion: 'Emotions',
      feeling: 'Feelings',
    },
    
    // Visual Learning
    visualLearning: 'Visual Learning',
    visualLearningCategories: {
      animals: 'Animals',
      birds: 'Birds',
      objects: 'Objects',
      timeOfDay: 'Time of Day',
      sentences: 'Make Sentences',
    },
    hearAnswer: 'Hear Answer',
    animalSound: 'Animal Sound',
    removeLastWord: 'Remove Last Word',
    
    // Visual Learning Words
    words: {
      cat: 'cat',
      dog: 'dog',
      cow: 'cow',
      lion: 'lion',
      elephant: 'elephant',
      horse: 'horse',
      sheep: 'sheep',
      pig: 'pig',
      bird: 'bird',
      duck: 'duck',
      parrot: 'parrot',
      rooster: 'rooster',
      owl: 'owl',
      crow: 'crow',
      apple: 'apple',
      car: 'car',
      book: 'book',
      chair: 'chair',
      phone: 'phone',
      watch: 'watch',
      shoes: 'shoes',
      ball: 'ball',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
      noon: 'noon',
      sunrise: 'sunrise',
      sunset: 'sunset',
      the: 'the',
      a: 'a',
      sits: 'sits',
      boy: 'boy',
      eats: 'eats',
      runs: 'runs',
      fast: 'fast',
      big: 'big',
      house: 'house',
      tree: 'tree',
      is: 'is',
      green: 'green',
      she: 'she',
      reads: 'reads',
      sun: 'sun',
      bright: 'bright',
      gives: 'gives',
      milk: 'milk',
      tiger: 'tiger',
      leopard: 'leopard',
      rhino: 'rhino',
      hippo: 'hippo',
      giraffe: 'giraffe',
      donkey: 'donkey',
      zebra: 'zebra',
      goat: 'goat',
      lamb: 'lamb',
      goose: 'goose',
      swan: 'swan',
      chicken: 'chicken',
      hen: 'hen',
      eagle: 'eagle',
      hawk: 'hawk',
      raven: 'raven',
      blackbird: 'blackbird',
      orange: 'orange',
      banana: 'banana',
      grape: 'grape',
      bus: 'bus',
      truck: 'truck',
      bike: 'bike',
      notebook: 'notebook',
      magazine: 'magazine',
      paper: 'paper',
      table: 'table',
      sofa: 'sofa',
      bench: 'bench',
      tablet: 'tablet',
      laptop: 'laptop',
      clock: 'clock',
      bracelet: 'bracelet',
      boots: 'boots',
      sandals: 'sandals',
      slippers: 'slippers',
      toy: 'toy',
      balloon: 'balloon',
      globe: 'globe',
      sunset: 'sunset',
      dusk: 'dusk',
      midnight: 'midnight',
      dark: 'dark',
      midday: 'midday',
      dawn: 'dawn',
      girl: 'girl',
      he: 'he',
      drinks: 'drinks',
      walks: 'walks',
      slow: 'slow',
      small: 'small',
      flower: 'flower',
      are: 'are',
      red: 'red',
      writes: 'writes',
      pen: 'pen',
      moon: 'moon',
      water: 'water',
    },
    
    // Default symbols
    symbols: {
      i: 'I',
      want: 'want',
      play: 'play',
      eat: 'eat',
      help: 'help',
      happy: 'happy',
    },
    
    // Chatbot Screen
    chatbot: 'AI Helper',
    hiUser: 'Hi',
    chatbotIntro: "! I'm CogniBot, your AI helper. You can ask me any question. For example: \"What is a star?\" or \"Why is the sky blue?\"",
    friend: 'friend',
    apiKeyMissing: 'API Key is missing. Please add your key to ChatbotScreen.js on line 21 to enable the AI.',
    typeMessage: 'Type a message...',
    send: 'Send',
    
    // Sentence Builder
    sentenceBuilder: 'Sentence Builder',
    buildSentence: 'Build a sentence by tapping the words below',
    clear: 'Clear',
    
    // Feelings Finder
    feelingsFinder: 'Feelings Finder',
    howDoYouFeel: 'How do you feel today?',
    feelings: {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      excited: 'Excited',
      tired: 'Tired',
      scared: 'Scared',
    },
    
    // Story Time
    storyTime: 'Story Time',
    selectStory: 'Select a story to read',
    stories: {
      threeGoats: 'The Three Billy Goats',
      littleRedHen: 'The Little Red Hen',
      tortoise: 'The Tortoise and the Hare',
    },
    
    // Child Dashboard
    myProgress: 'My Progress',
    profile: 'Profile',
    name: 'Name',
    condition: 'Condition',
    achievements: 'Achievements',
    recentActivity: 'Recent Activity',
    
    // Help Modal
    help: 'Help',
    helpAndInformation: 'Help & Information',
    close: 'Close',
    closingHelp: 'Closing help',
    howToUse: 'How to Use',
    impactAndBenefits: 'Impact & Benefits:',
    openingHelpForSuite: 'Opening help for Autism and Communication Suite',
    
    // Side Menu
    openingMenu: 'Opening menu',
    viewProgressAndAchievements: 'View your progress and achievements',
    customizeAppExperience: 'Customize your app experience',
    learnAboutConditions: 'Learn about conditions',
    
    // Conditions Guide
    conditionsGuide: {
      title: 'Conditions Guide',
      subtitle: 'Understanding special needs and how we can help',
      overview: 'Overview',
      characteristics: 'Key Characteristics',
      severityLevels: 'Understanding Severity Levels',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      howAppHelps: 'How This App Helps',
      askQuestions: 'Ask Questions',
      chatbot: 'Ask Me Anything',
      
      asd: {
        name: 'Autism Spectrum Disorder',
        preview: 'Learn about autism and support strategies',
        overview: 'Autism Spectrum Disorder (ASD) is a developmental condition that affects communication, behavior, and social interaction. It\'s called a "spectrum" because it affects people differently and to varying degrees.',
        characteristics: 'Common characteristics include difficulty with social communication, repetitive behaviors, intense interests in specific topics, sensitivity to sensory input (sounds, lights, textures), and challenges with changes in routine.',
        mild: 'Individuals can communicate verbally, may have some social challenges, can function independently with minimal support, and may have specific interests or routines.',
        moderate: 'Noticeable communication difficulties, significant social challenges, requires regular support in daily activities, and may have more pronounced repetitive behaviors.',
        severe: 'Limited or no verbal communication, significant difficulty with daily living skills, requires substantial support throughout the day, and may have intense sensory sensitivities.',
        howAppHelps: 'Our communication board provides alternative communication methods, sentence builder helps develop language skills, feelings finder aids emotional understanding, and social stories prepare for new situations.',
      },
      
      downSyndrome: {
        name: 'Down Syndrome',
        preview: 'Understanding Down syndrome and development',
        overview: 'Down syndrome is a genetic condition caused by an extra chromosome 21. It affects physical and cognitive development, but with proper support, individuals can lead fulfilling lives.',
        characteristics: 'Common features include distinctive facial features, low muscle tone, developmental delays, learning disabilities of varying degrees, and potential heart or other health conditions.',
        mild: 'Can achieve most developmental milestones with some delay, capable of learning academic skills, can develop good communication abilities, and may live independently with support.',
        moderate: 'Experiences more significant developmental delays, requires ongoing educational support, can learn self-care skills, and benefits from structured learning environments.',
        severe: 'Has significant cognitive and physical challenges, requires substantial daily support, may have limited communication abilities, and needs comprehensive care throughout life.',
        howAppHelps: 'Visual learning tools support cognitive development, communication aids help express needs, step-by-step activities build skills, and progress tracking shows growth over time.',
      },
      
      adhd: {
        name: 'ADHD',
        preview: 'Managing attention and hyperactivity',
        overview: 'Attention-Deficit/Hyperactivity Disorder (ADHD) affects focus, impulse control, and activity levels. It\'s one of the most common neurodevelopmental disorders in children.',
        characteristics: 'Key signs include difficulty sustaining attention, easily distracted, forgetfulness, fidgeting or restlessness, difficulty waiting turns, and impulsive decision-making.',
        mild: 'Can focus with effort, manages most daily tasks independently, symptoms may be situational, and responds well to structure and reminders.',
        moderate: 'Consistent attention difficulties across settings, requires regular support and strategies, impacts academic or work performance, and benefits from medication or therapy.',
        severe: 'Significant impairment in multiple life areas, difficulty completing basic tasks, may have co-occurring conditions, and requires comprehensive intervention and support.',
        howAppHelps: 'Structured activities maintain engagement, visual cues aid focus, interactive features provide immediate feedback, and gamification elements sustain motivation.',
      },
      
      dyslexia: {
        name: 'Dyslexia',
        preview: 'Supporting reading and language processing',
        overview: 'Dyslexia is a learning disorder that affects reading, writing, and spelling. It\'s not related to intelligence but rather how the brain processes written language.',
        characteristics: 'Common signs include difficulty reading fluently, problems with spelling, slow writing, mixing up letter sequences, and challenges with phonological awareness.',
        mild: 'Can read with some difficulty, may need extra time, spelling challenges persist, and benefits from specific strategies and accommodations.',
        moderate: 'Significant reading difficulties, requires specialized instruction, writing is laborious, and needs ongoing support in academic settings.',
        severe: 'Profound reading and writing challenges, may avoid text-based activities, requires intensive intervention, and benefits from alternative learning methods.',
        howAppHelps: 'Visual symbols reduce text dependence, audio features support comprehension, multi-sensory learning aids retention, and step-by-step progression builds confidence.',
      },
      
      cerebralPalsy: {
        name: 'Cerebral Palsy',
        preview: 'Understanding movement and motor challenges',
        overview: 'Cerebral Palsy (CP) is a group of disorders affecting movement, muscle tone, and posture. It\'s caused by damage to the developing brain, often before birth.',
        characteristics: 'Symptoms vary widely and may include muscle stiffness or floppiness, involuntary movements, difficulty with fine motor skills, balance issues, and potential speech difficulties.',
        mild: 'Minor motor difficulties, can walk independently, performs most daily activities, and may have slight speech or coordination challenges.',
        moderate: 'Noticeable movement difficulties, may use mobility aids, requires some assistance with daily tasks, and benefits from physical therapy.',
        severe: 'Significant motor impairment, requires wheelchair or extensive mobility support, needs help with most daily activities, and may have associated conditions.',
        howAppHelps: 'Touch-based interface is accessible, large buttons accommodate motor challenges, audio feedback reduces physical demands, and customizable settings adapt to individual needs.',
      },
      
      intellectualDisability: {
        name: 'Intellectual Disability',
        preview: 'Supporting cognitive development and learning',
        overview: 'Intellectual Disability (ID) involves limitations in intellectual functioning and adaptive behavior. It affects learning, reasoning, and practical life skills.',
        characteristics: 'Common features include delayed developmental milestones, difficulty learning new information, challenges with problem-solving, limited abstract thinking, and need for support in daily living.',
        mild: 'Can learn academic skills at a slower pace, capable of independent living with some support, can maintain employment with assistance, and develops social relationships.',
        moderate: 'Requires ongoing support for daily activities, can learn self-care skills, benefits from structured environments, and may work in supported settings.',
        severe: 'Needs substantial daily support, limited communication abilities, requires help with most self-care tasks, and benefits from consistent routines and care.',
        howAppHelps: 'Simplified interfaces reduce cognitive load, visual learning supports understanding, repetitive practice builds skills, and progress tracking celebrates achievements.',
      },
      
      speechDelay: {
        name: 'Speech Delay',
        preview: 'Developing communication and language skills',
        overview: 'Speech delay means a child\'s speech development is slower than typical for their age. It can affect pronunciation, vocabulary, or sentence formation.',
        characteristics: 'Signs include limited vocabulary for age, difficulty forming sentences, pronunciation problems, frustration when trying to communicate, and reliance on gestures.',
        mild: 'Speaks but with some delays, vocabulary is developing, can be understood by familiar people, and is making steady progress.',
        moderate: 'Significant speech delays, limited vocabulary, difficult to understand, and requires speech therapy and support.',
        severe: 'Very limited or no verbal communication, may use alternative communication methods, requires intensive therapy, and benefits from augmentative communication tools.',
        howAppHelps: 'Communication board provides voice when words are difficult, visual symbols support language learning, sentence builder teaches structure, and audio feedback reinforces correct patterns.',
      },
    },
    
    // Autism Suite Features
    autismFeatures: {
      myVoice: {
        name: 'My Voice',
        description: 'Tap picture cards to say what you need, how you feel, or who you want. Builds sentences you can speak aloud.',
      },
      learnToBuild: {
        name: 'Visual Learning',
        description: 'Learn animals, objects, and words with pictures. See an image, pick the right word, and hear it spoken.',
      },
      feelingsFinder: {
        name: 'Feelings Finder',
        description: 'Explore emotions with stories about when you feel them, what happens in your body, and what you can do.',
      },
      storyTime: {
        name: 'Story Time',
        description: 'AI-generated social stories to help understand new situations.',
      },
    },
    
    // Chatbot
    typeYourQuestion: 'Type your question...',
    returningToList: 'Returning to list',
    openingChatbot: 'Opening chatbot',
    
    // Common
    back: 'Back',
    next: 'Next',
    done: 'Done',
    cancel: 'Cancel',
    save: 'Save',
  },
  
  hi: {
    // App Name
    appName: 'कॉग्निवर्स',
    appSubtitle: 'आपका सीखने का साथी',
    
    // Login Screen
    welcomeBack: 'वापसी पर स्वागत है!',
    createAccount: 'अपना खाता बनाएं',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    age: 'उम्र',
    selectCondition: 'स्थिति चुनें',
    login: 'लॉग इन करें',
    signup: 'साइन अप करें',
    noAccount: 'खाता नहीं है? साइन अप करें',
    hasAccount: 'पहले से खाता है? लॉग इन करें',
    switchingToSignup: 'साइन अप पर जा रहे हैं',
    switchingToLogin: 'लॉग इन पर जा रहे हैं',
    fillAllFields: 'कृपया सभी फ़ील्ड भरें',
    passwordsNoMatch: 'पासवर्ड मेल नहीं खाते',
    passwordTooShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    loginFailed: 'लॉगिन विफल',
    signupFailed: 'साइनअप विफल',
    error: 'त्रुटि',
    
    // Conditions
    conditions: {
      asd: 'ऑटिज़्म स्पेक्ट्रम डिसऑर्डर',
      downSyndrome: 'डाउन सिंड्रोम',
      adhd: 'एडीएचडी',
      dyslexia: 'डिस्लेक्सिया',
      cerebralPalsy: 'सेरेब्रल पाल्सी',
      intellectualDisability: 'बौद्धिक अक्षमता',
      speechDelay: 'वाणी में देरी',
      other: 'अन्य',
    },
    
    // Hub Screen
    openingSettings: 'सेटिंग्स खोल रहे हैं',
    returningToMenu: 'मुख्य मेनू पर लौट रहे हैं',
    openingDashboard: 'बच्चे का डैशबोर्ड खोल रहे हैं',
    openingHelp: 'सहायता खोल रहे हैं',
    openingAIHelper: 'एआई सहायक खोल रहे हैं',
    
    // Suites
    suites: {
      autismCommunication: {
        name: 'ऑटिज़्म और संचार',
        description: 'एआई-संचालित प्रतीक निर्माण के साथ प्रतीक-आधारित संचार बोर्ड। गैर-मौखिक संचार और सीखने के लिए एकदम सही।',
      },
      learningBasics: {
        name: 'सीखने की मूल बातें',
        description: 'संख्याओं, रंगों, अक्षरों और दैनिक दिनचर्या के लिए इंटरैक्टिव फ्लैशकार्ड — मज़ेदार और आसान।',
      },
      socialSkills: {
        name: 'सामाजिक कौशल',
        description: 'बड़े विज़ुअल कार्ड और आवाज़ मार्गदर्शन के साथ अभिवादन, आँख से संपर्क, साझा करना और बहुत कुछ सीखें।',
      },
      games: {
        name: 'खेल और मज़ा',
        description: 'खेल के माध्यम से स्मृति, भावनाओं, गिनती और पैटर्न कौशल विकसित करने के लिए चिकित्सकीय खेल।',
      },
    },
    comingSoon: 'जल्द आ रहा है',
    
    // Settings Screen
    settings: 'सेटिंग्स',
    visualSettings: 'दृश्य सेटिंग्स',
    theme: 'थीम',
    textSettings: 'टेक्स्ट सेटिंग्स',
    textSize: 'टेक्स्ट का आकार',
    spacingSettings: 'स्पेसिंग सेटिंग्स',
    spacing: 'स्पेसिंग',
    languageSettings: 'भाषा सेटिंग्स',
    language: 'भाषा',
    voiceSettings: 'आवाज़ सेटिंग्स',
    enableVoice: 'आवाज़ सक्षम करें',
    speechRate: 'बोलने की गति',
    
    // Theme names
    themes: {
      calm: 'शांत',
      highContrast: 'उच्च कंट्रास्ट',
      sepia: 'सेपिया',
    },
    
    // Text sizes
    textSizes: {
      small: 'छोटा',
      medium: 'मध्यम',
      large: 'बड़ा',
      extraLarge: 'अतिरिक्त बड़ा',
    },
    
    // Spacing options
    spacingOptions: {
      compact: 'कॉम्पैक्ट',
      normal: 'सामान्य',
      spacious: 'विशाल',
      extraSpacious: 'अतिरिक्त विशाल',
    },
    
    // Languages
    languages: {
      english: 'English',
      hindi: 'हिंदी (Hindi)',
    },
    
    // Communication Board
    myVoice: 'संचार बोर्ड',
    communicationBoard: 'संचार बोर्ड',
    myMessage: 'मेरा संदेश',
    tapActionsBelow: 'अपना संदेश बनाने के लिए नीचे क्रियाओं पर टैप करें...',
    speak: 'बोलें',
    typeWord: 'प्रतीक बनाने के लिए एक शब्द टाइप करें...',
    create: 'बनाएं',
    apiKeyRequired: 'एपीआई कुंजी आवश्यक',
    configureImagenKey: 'कस्टम प्रतीक उत्पन्न करने के लिए कृपया सेटिंग्स में अपनी Imagen API कुंजी कॉन्फ़िगर करें।',
    ok: 'ठीक है',
    createdSymbol: 'के लिए प्रतीक बनाया गया',
    errorGeneratingImage: 'छवि उत्पन्न नहीं हो सकी। कृपया कोई अन्य शब्द आज़माएं।',
    errorConnectingAI: 'एआई से कनेक्ट करते समय एक त्रुटि हुई।',
    
    // Action Labels
    actions: {
      eating: 'खाना',
      drinking: 'पीना',
      bathing: 'नहाना',
      brushingTeeth: 'दांत साफ करना',
      sleeping: 'सोना',
      gettingDressed: 'कपड़े पहनना',
      playing: 'खेलना',
      reading: 'पढ़ना',
      walking: 'चलना',
      sitting: 'बैठना',
      help: 'मदद',
      toilet: 'शौचालय',
      happy: 'खुश',
      sad: 'उदास',
      tired: 'थका हुआ',
      hungry: 'भूखा',
      thirsty: 'प्यासा',
      hot: 'गर्म',
      cold: 'ठंडा',
      sick: 'बीमार',
      washingHands: 'हाथ धोना',
      cooking: 'खाना बनाना',
      cleaning: 'सफाई करना',
      watchingTV: 'टीवी देखना',
    },
    
    // Categories
    categories: {
      all: 'सभी',
      daily: 'दैनिक',
      activity: 'गतिविधि',
      need: 'जरूरतें',
      emotion: 'भावनाएं',
      feeling: 'अनुभूतियां',
    },
    
    // Visual Learning
    visualLearning: 'दृश्य शिक्षण',
    visualLearningCategories: {
      animals: 'जानवर',
      birds: 'पक्षी',
      objects: 'वस्तुएं',
      timeOfDay: 'दिन का समय',
      sentences: 'वाक्य बनाएं',
    },
    hearAnswer: 'उत्तर सुनें',
    animalSound: 'जानवर की आवाज़',
    removeLastWord: 'अंतिम शब्द हटाएं',
    
    // Visual Learning Words
    words: {
      cat: 'बिल्ली',
      dog: 'कुत्ता',
      cow: 'गाय',
      lion: 'शेर',
      elephant: 'हाथी',
      horse: 'घोड़ा',
      sheep: 'भेड़',
      pig: 'सूअर',
      bird: 'पक्षी',
      duck: 'बत्तख',
      parrot: 'तोता',
      rooster: 'मुर्गा',
      owl: 'उल्लू',
      crow: 'कौआ',
      apple: 'सेब',
      car: 'कार',
      book: 'किताब',
      chair: 'कुर्सी',
      phone: 'फोन',
      watch: 'घड़ी',
      shoes: 'जूते',
      ball: 'गेंद',
      morning: 'सुबह',
      afternoon: 'दोपहर',
      evening: 'शाम',
      night: 'रात',
      noon: 'दोपहर',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      the: 'यह',
      a: 'एक',
      sits: 'बैठता है',
      boy: 'लड़का',
      eats: 'खाता है',
      runs: 'दौड़ता है',
      fast: 'तेज़',
      big: 'बड़ा',
      house: 'घर',
      tree: 'पेड़',
      is: 'है',
      green: 'हरा',
      she: 'वह',
      reads: 'पढ़ती है',
      sun: 'सूरज',
      bright: 'चमकीला',
      gives: 'देती है',
      milk: 'दूध',
      tiger: 'बाघ',
      leopard: 'तेंदुआ',
      rhino: 'गैंडा',
      hippo: 'दरियाई घोड़ा',
      giraffe: 'जिराफ',
      donkey: 'गधा',
      zebra: 'ज़ेबरा',
      goat: 'बकरी',
      lamb: 'मेमना',
      goose: 'हंस',
      swan: 'राजहंस',
      chicken: 'मुर्गी',
      hen: 'मुर्गी',
      eagle: 'चील',
      hawk: 'बाज',
      raven: 'कौआ',
      blackbird: 'काला पक्षी',
      orange: 'संतरा',
      banana: 'केला',
      grape: 'अंगूर',
      bus: 'बस',
      truck: 'ट्रक',
      bike: 'साइकिल',
      notebook: 'नोटबुक',
      magazine: 'पत्रिका',
      paper: 'कागज',
      table: 'मेज',
      sofa: 'सोफा',
      bench: 'बेंच',
      tablet: 'टैबलेट',
      laptop: 'लैपटॉप',
      clock: 'घड़ी',
      bracelet: 'कंगन',
      boots: 'बूट',
      sandals: 'चप्पल',
      slippers: 'चप्पल',
      toy: 'खिलौना',
      balloon: 'गुब्बारा',
      globe: 'ग्लोब',
      sunset: 'सूर्यास्त',
      dusk: 'गोधूलि',
      midnight: 'आधी रात',
      dark: 'अंधेरा',
      midday: 'दोपहर',
      dawn: 'भोर',
      girl: 'लड़की',
      he: 'वह',
      drinks: 'पीता है',
      walks: 'चलता है',
      slow: 'धीमा',
      small: 'छोटा',
      flower: 'फूल',
      are: 'हैं',
      red: 'लाल',
      writes: 'लिखता है',
      pen: 'कलम',
      moon: 'चाँद',
      water: 'पानी',
    },
    
    // Default symbols
    symbols: {
      i: 'मैं',
      want: 'चाहता हूं',
      play: 'खेलना',
      eat: 'खाना',
      help: 'मदद',
      happy: 'खुश',
    },
    
    // Chatbot Screen
    chatbot: 'एआई सहायक',
    hiUser: 'नमस्ते',
    chatbotIntro: "! मैं कॉग्निबॉट हूं, आपका एआई सहायक। आप मुझसे कोई भी सवाल पूछ सकते हैं। उदाहरण के लिए: \"तारा क्या है?\" या \"आकाश नीला क्यों है?\"",
    friend: 'दोस्त',
    apiKeyMissing: 'API कुंजी गायब है। AI को सक्षम करने के लिए कृपया ChatbotScreen.js की लाइन 21 में अपनी कुंजी जोड़ें।',
    typeMessage: 'एक संदेश टाइप करें...',
    send: 'भेजें',
    
    // Sentence Builder
    sentenceBuilder: 'वाक्य निर्माता',
    buildSentence: 'नीचे दिए गए शब्दों पर टैप करके एक वाक्य बनाएं',
    clear: 'साफ़ करें',
    
    // Feelings Finder
    feelingsFinder: 'भावना खोजक',
    howDoYouFeel: 'आज आप कैसा महसूस कर रहे हैं?',
    feelings: {
      happy: 'खुश',
      sad: 'उदास',
      angry: 'गुस्सा',
      excited: 'उत्साहित',
      tired: 'थका हुआ',
      scared: 'डरा हुआ',
    },
    
    // Story Time
    storyTime: 'कहानी का समय',
    selectStory: 'पढ़ने के लिए एक कहानी चुनें',
    stories: {
      threeGoats: 'तीन बिली बकरियां',
      littleRedHen: 'छोटी लाल मुर्गी',
      tortoise: 'कछुआ और खरगोश',
    },
    
    // Child Dashboard
    myProgress: 'मेरी प्रगति',
    profile: 'प्रोफ़ाइल',
    name: 'नाम',
    condition: 'स्थिति',
    achievements: 'उपलब्धियां',
    recentActivity: 'हाल की गतिविधि',
    
    // Help Modal
    help: 'सहायता',
    helpAndInformation: 'सहायता और जानकारी',
    close: 'बंद करें',
    closingHelp: 'सहायता बंद कर रहे हैं',
    howToUse: 'उपयोग कैसे करें',
    impactAndBenefits: 'प्रभाव और लाभ:',
    openingHelpForSuite: 'ऑटिज़्म और संचार सूट के लिए सहायता खोल रहे हैं',
    
    // Side Menu
    openingMenu: 'मेनू खोल रहे हैं',
    viewProgressAndAchievements: 'अपनी प्रगति और उपलब्धियां देखें',
    customizeAppExperience: 'अपने ऐप अनुभव को अनुकूलित करें',
    learnAboutConditions: 'स्थितियों के बारे में जानें',
    
    // Conditions Guide
    conditionsGuide: {
      title: 'स्थितियों की मार्गदर्शिका',
      subtitle: 'विशेष आवश्यकताओं को समझना और हम कैसे मदद कर सकते हैं',
      overview: 'अवलोकन',
      characteristics: 'मुख्य विशेषताएं',
      severityLevels: 'गंभीरता स्तरों को समझना',
      mild: 'हल्का',
      moderate: 'मध्यम',
      severe: 'गंभीर',
      howAppHelps: 'यह ऐप कैसे मदद करता है',
      askQuestions: 'सवाल पूछें',
      chatbot: 'मुझसे कुछ भी पूछें',
      
      asd: {
        name: 'ऑटिज़्म स्पेक्ट्रम डिसऑर्डर',
        preview: 'ऑटिज़्म और सहायता रणनीतियों के बारे में जानें',
        overview: 'ऑटिज़्म स्पेक्ट्रम डिसऑर्डर (ASD) एक विकासात्मक स्थिति है जो संचार, व्यवहार और सामाजिक संपर्क को प्रभावित करती है। इसे "स्पेक्ट्रम" कहा जाता है क्योंकि यह लोगों को अलग-अलग तरीकों और अलग-अलग डिग्री तक प्रभावित करता है।',
        characteristics: 'सामान्य विशेषताओं में सामाजिक संचार में कठिनाई, दोहराव वाले व्यवहार, विशिष्ट विषयों में तीव्र रुचि, संवेदी इनपुट (ध्वनि, रोशनी, बनावट) के प्रति संवेदनशीलता, और दिनचर्या में बदलाव के साथ चुनौतियां शामिल हैं।',
        mild: 'व्यक्ति मौखिक रूप से संवाद कर सकते हैं, कुछ सामाजिक चुनौतियां हो सकती हैं, न्यूनतम समर्थन के साथ स्वतंत्र रूप से कार्य कर सकते हैं, और विशिष्ट रुचियां या दिनचर्या हो सकती है।',
        moderate: 'ध्यान देने योग्य संचार कठिनाइयां, महत्वपूर्ण सामाजिक चुनौतियां, दैनिक गतिविधियों में नियमित समर्थन की आवश्यकता, और अधिक स्पष्ट दोहराव वाले व्यवहार हो सकते हैं।',
        severe: 'सीमित या कोई मौखिक संचार नहीं, दैनिक जीवन कौशल में महत्वपूर्ण कठिनाई, पूरे दिन पर्याप्त समर्थन की आवश्यकता, और तीव्र संवेदी संवेदनशीलता हो सकती है।',
        howAppHelps: 'हमारा संचार बोर्ड वैकल्पिक संचार विधियां प्रदान करता है, वाक्य निर्माता भाषा कौशल विकसित करने में मदद करता है, भावना खोजक भावनात्मक समझ में सहायता करता है, और सामाजिक कहानियां नई स्थितियों के लिए तैयार करती हैं।',
      },
      
      downSyndrome: {
        name: 'डाउन सिंड्रोम',
        preview: 'डाउन सिंड्रोम और विकास को समझना',
        overview: 'डाउन सिंड्रोम एक आनुवंशिक स्थिति है जो एक अतिरिक्त क्रोमोसोम 21 के कारण होती है। यह शारीरिक और संज्ञानात्मक विकास को प्रभावित करती है, लेकिन उचित समर्थन के साथ, व्यक्ति पूर्ण जीवन जी सकते हैं।',
        characteristics: 'सामान्य विशेषताओं में विशिष्ट चेहरे की विशेषताएं, कम मांसपेशी टोन, विकासात्मक देरी, विभिन्न डिग्री की सीखने की अक्षमताएं, और संभावित हृदय या अन्य स्वास्थ्य स्थितियां शामिल हैं।',
        mild: 'कुछ देरी के साथ अधिकांश विकासात्मक मील के पत्थर हासिल कर सकते हैं, शैक्षणिक कौशल सीखने में सक्षम, अच्छी संचार क्षमताएं विकसित कर सकते हैं, और समर्थन के साथ स्वतंत्र रूप से रह सकते हैं।',
        moderate: 'अधिक महत्वपूर्ण विकासात्मक देरी का अनुभव करते हैं, निरंतर शैक्षिक समर्थन की आवश्यकता, स्व-देखभाल कौशल सीख सकते हैं, और संरचित सीखने के वातावरण से लाभ उठाते हैं।',
        severe: 'महत्वपूर्ण संज्ञानात्मक और शारीरिक चुनौतियां हैं, पर्याप्त दैनिक समर्थन की आवश्यकता, सीमित संचार क्षमताएं हो सकती हैं, और जीवन भर व्यापक देखभाल की आवश्यकता है।',
        howAppHelps: 'दृश्य शिक्षण उपकरण संज्ञानात्मक विकास का समर्थन करते हैं, संचार सहायता आवश्यकताओं को व्यक्त करने में मदद करती है, चरण-दर-चरण गतिविधियां कौशल बनाती हैं, और प्रगति ट्रैकिंग समय के साथ वृद्धि दिखाती है।',
      },
      
      adhd: {
        name: 'ADHD',
        preview: 'ध्यान और अतिसक्रियता का प्रबंधन',
        overview: 'अटेंशन-डेफिसिट/हाइपरएक्टिविटी डिसऑर्डर (ADHD) फोकस, आवेग नियंत्रण और गतिविधि स्तरों को प्रभावित करता है। यह बच्चों में सबसे आम न्यूरोडेवलपमेंटल विकारों में से एक है।',
        characteristics: 'मुख्य संकेतों में ध्यान बनाए रखने में कठिनाई, आसानी से विचलित होना, भूलने की बीमारी, बेचैनी या बेचैनी, बारी का इंतजार करने में कठिनाई, और आवेगपूर्ण निर्णय लेना शामिल है।',
        mild: 'प्रयास से ध्यान केंद्रित कर सकते हैं, अधिकांश दैनिक कार्यों को स्वतंत्र रूप से प्रबंधित करते हैं, लक्षण स्थितिजन्य हो सकते हैं, और संरचना और अनुस्मारक के लिए अच्छी प्रतिक्रिया देते हैं।',
        moderate: 'सेटिंग्स में लगातार ध्यान कठिनाइयां, नियमित समर्थन और रणनीतियों की आवश्यकता, शैक्षणिक या कार्य प्रदर्शन को प्रभावित करता है, और दवा या चिकित्सा से लाभ उठाता है।',
        severe: 'कई जीवन क्षेत्रों में महत्वपूर्ण हानि, बुनियादी कार्यों को पूरा करने में कठिनाई, सह-होने वाली स्थितियां हो सकती हैं, और व्यापक हस्तक्षेप और समर्थन की आवश्यकता है।',
        howAppHelps: 'संरचित गतिविधियां जुड़ाव बनाए रखती हैं, दृश्य संकेत फोकस में सहायता करते हैं, इंटरैक्टिव सुविधाएं तत्काल प्रतिक्रिया प्रदान करती हैं, और गेमिफिकेशन तत्व प्रेरणा बनाए रखते हैं।',
      },
      
      dyslexia: {
        name: 'डिस्लेक्सिया',
        preview: 'पढ़ने और भाषा प्रसंस्करण का समर्थन',
        overview: 'डिस्लेक्सिया एक सीखने का विकार है जो पढ़ने, लिखने और वर्तनी को प्रभावित करता है। यह बुद्धिमत्ता से संबंधित नहीं है बल्कि मस्तिष्क लिखित भाषा को कैसे संसाधित करता है।',
        characteristics: 'सामान्य संकेतों में धाराप्रवाह पढ़ने में कठिनाई, वर्तनी के साथ समस्याएं, धीमी लेखन, अक्षर अनुक्रमों को मिलाना, और ध्वन्यात्मक जागरूकता के साथ चुनौतियां शामिल हैं।',
        mild: 'कुछ कठिनाई के साथ पढ़ सकते हैं, अतिरिक्त समय की आवश्यकता हो सकती है, वर्तनी चुनौतियां बनी रहती हैं, और विशिष्ट रणनीतियों और आवास से लाभ उठाते हैं।',
        moderate: 'महत्वपूर्ण पढ़ने की कठिनाइयां, विशेष निर्देश की आवश्यकता, लेखन श्रमसाध्य है, और शैक्षणिक सेटिंग्स में निरंतर समर्थन की आवश्यकता है।',
        severe: 'गहन पढ़ने और लिखने की चुनौतियां, पाठ-आधारित गतिविधियों से बच सकते हैं, गहन हस्तक्षेप की आवश्यकता, और वैकल्पिक सीखने के तरीकों से लाभ उठाते हैं।',
        howAppHelps: 'दृश्य प्रतीक पाठ निर्भरता को कम करते हैं, ऑडियो सुविधाएं समझ का समर्थन करती हैं, बहु-संवेदी सीखना प्रतिधारण में सहायता करता है, और चरण-दर-चरण प्रगति आत्मविश्वास बनाती है।',
      },
      
      cerebralPalsy: {
        name: 'सेरेब्रल पाल्सी',
        preview: 'आंदोलन और मोटर चुनौतियों को समझना',
        overview: 'सेरेब्रल पाल्सी (CP) आंदोलन, मांसपेशी टोन और मुद्रा को प्रभावित करने वाले विकारों का एक समूह है। यह विकासशील मस्तिष्क को नुकसान के कारण होता है, अक्सर जन्म से पहले।',
        characteristics: 'लक्षण व्यापक रूप से भिन्न होते हैं और इसमें मांसपेशियों की कठोरता या ढीलापन, अनैच्छिक आंदोलनों, ठीक मोटर कौशल के साथ कठिनाई, संतुलन के मुद्दे, और संभावित भाषण कठिनाइयां शामिल हो सकती हैं।',
        mild: 'मामूली मोटर कठिनाइयां, स्वतंत्र रूप से चल सकते हैं, अधिकांश दैनिक गतिविधियां करते हैं, और मामूली भाषण या समन्वय चुनौतियां हो सकती हैं।',
        moderate: 'ध्यान देने योग्य आंदोलन कठिनाइयां, गतिशीलता सहायता का उपयोग कर सकते हैं, दैनिक कार्यों के साथ कुछ सहायता की आवश्यकता, और भौतिक चिकित्सा से लाभ उठाते हैं।',
        severe: 'महत्वपूर्ण मोटर हानि, व्हीलचेयर या व्यापक गतिशीलता समर्थन की आवश्यकता, अधिकांश दैनिक गतिविधियों के साथ मदद की आवश्यकता, और संबंधित स्थितियां हो सकती हैं।',
        howAppHelps: 'टच-आधारित इंटरफ़ेस सुलभ है, बड़े बटन मोटर चुनौतियों को समायोजित करते हैं, ऑडियो फीडबैक शारीरिक मांगों को कम करता है, और अनुकूलन योग्य सेटिंग्स व्यक्तिगत आवश्यकताओं के अनुकूल होती हैं।',
      },
      
      intellectualDisability: {
        name: 'बौद्धिक अक्षमता',
        preview: 'संज्ञानात्मक विकास और सीखने का समर्थन',
        overview: 'बौद्धिक अक्षमता (ID) में बौद्धिक कार्यप्रणाली और अनुकूली व्यवहार में सीमाएं शामिल हैं। यह सीखने, तर्क और व्यावहारिक जीवन कौशल को प्रभावित करती है।',
        characteristics: 'सामान्य विशेषताओं में विलंबित विकासात्मक मील के पत्थर, नई जानकारी सीखने में कठिनाई, समस्या-समाधान के साथ चुनौतियां, सीमित अमूर्त सोच, और दैनिक जीवन में समर्थन की आवश्यकता शामिल है।',
        mild: 'धीमी गति से शैक्षणिक कौशल सीख सकते हैं, कुछ समर्थन के साथ स्वतंत्र जीवन में सक्षम, सहायता के साथ रोजगार बनाए रख सकते हैं, और सामाजिक संबंध विकसित करते हैं।',
        moderate: 'दैनिक गतिविधियों के लिए निरंतर समर्थन की आवश्यकता, स्व-देखभाल कौशल सीख सकते हैं, संरचित वातावरण से लाभ उठाते हैं, और समर्थित सेटिंग्स में काम कर सकते हैं।',
        severe: 'पर्याप्त दैनिक समर्थन की आवश्यकता, सीमित संचार क्षमताएं, अधिकांश स्व-देखभाल कार्यों के साथ मदद की आवश्यकता, और सुसंगत दिनचर्या और देखभाल से लाभ उठाते हैं।',
        howAppHelps: 'सरलीकृत इंटरफेस संज्ञानात्मक भार को कम करते हैं, दृश्य शिक्षण समझ का समर्थन करता है, दोहराव वाला अभ्यास कौशल बनाता है, और प्रगति ट्रैकिंग उपलब्धियों का जश्न मनाती है।',
      },
      
      speechDelay: {
        name: 'भाषण देरी',
        preview: 'संचार और भाषा कौशल विकसित करना',
        overview: 'भाषण देरी का मतलब है कि एक बच्चे का भाषण विकास उनकी उम्र के लिए सामान्य से धीमा है। यह उच्चारण, शब्दावली, या वाक्य निर्माण को प्रभावित कर सकता है।',
        characteristics: 'संकेतों में उम्र के लिए सीमित शब्दावली, वाक्य बनाने में कठिनाई, उच्चारण समस्याएं, संवाद करने की कोशिश करते समय निराशा, और इशारों पर निर्भरता शामिल है।',
        mild: 'बोलते हैं लेकिन कुछ देरी के साथ, शब्दावली विकसित हो रही है, परिचित लोगों द्वारा समझा जा सकता है, और स्थिर प्रगति कर रहे हैं।',
        moderate: 'महत्वपूर्ण भाषण देरी, सीमित शब्दावली, समझना मुश्किल, और भाषण चिकित्सा और समर्थन की आवश्यकता है।',
        severe: 'बहुत सीमित या कोई मौखिक संचार नहीं, वैकल्पिक संचार विधियों का उपयोग कर सकते हैं, गहन चिकित्सा की आवश्यकता, और संवर्धक संचार उपकरणों से लाभ उठाते हैं।',
        howAppHelps: 'संचार बोर्ड आवाज प्रदान करता है जब शब्द मुश्किल होते हैं, दृश्य प्रतीक भाषा सीखने का समर्थन करते हैं, वाक्य निर्माता संरचना सिखाता है, और ऑडियो फीडबैक सही पैटर्न को मजबूत करता है।',
      },
    },
    
    // Autism Suite Features
    autismFeatures: {
      myVoice: {
        name: 'संचार बोर्ड',
        description: 'दृश्य क्रियाओं और शब्दों के साथ खुद को व्यक्त करें। संदेश बनाने और उन्हें जोर से बोलने के लिए कार्ड पर टैप करें।',
      },
      learnToBuild: {
        name: 'बनाना सीखें',
        description: 'सरल शब्दों से शुरू करें और वाक्य बनाने की ओर बढ़ें। दृश्य मार्गदर्शन के साथ एकल शब्दों से पूर्ण वाक्यों तक इंटरैक्टिव सीखना।',
      },
      feelingsFinder: {
        name: 'भावना खोजक',
        description: 'विभिन्न भावनाओं को खोजकर भावनात्मक साक्षरता विकसित करें। भावनाओं और उनके संदर्भों के बारे में जानने के लिए चेहरों पर टैप करें।',
      },
      storyTime: {
        name: 'कहानी का समय',
        description: 'नई स्थितियों को समझने में मदद करने के लिए एआई-जनित सामाजिक कहानियां। किसी भी सामाजिक परिदृश्य के लिए व्यक्तिगत दृश्य कहानियां बनाएं।',
      },
    },
    
    // Chatbot
    typeYourQuestion: 'अपना सवाल टाइप करें...',
    returningToList: 'सूची में वापस जा रहे हैं',
    openingChatbot: 'चैटबॉट खोल रहे हैं',
    
    // Common
    back: 'वापस',
    next: 'अगला',
    done: 'हो गया',
    cancel: 'रद्द करें',
    save: 'सहेजें',
  },
};

export const LanguageProvider = ({ children }) => {
  const { language } = useTheme();
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language] || translations.en;
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        // Fallback to English if translation not found
        value = translations.en;
        for (const k of keys) {
          value = value[k];
          if (value === undefined) return key;
        }
        return value;
      }
    }
    
    return value;
  };
  
  const value = {
    t,
    language,
  };
  
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
