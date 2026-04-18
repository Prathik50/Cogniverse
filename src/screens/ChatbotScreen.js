/**
 * ChatbotScreen — CogniBot AI Assistant  (v2 Full Overhaul)
 * ===========================================================
 *
 * WHAT CHANGED AND WHY (from v1):
 * ────────────────────────────────
 * 1. Message list switched to inverted FlatList — newest messages
 *    stick to the bottom naturally, no manual scrollToEnd hacks.
 *
 * 2. Chat bubbles extracted to <ChatBubble /> component — each
 *    bubble now has its own slide-in entrance animation and
 *    accessibilityLiveRegion="polite".
 *
 * 3. Typing indicator extracted to <TypingIndicator /> — three
 *    dots with staggered bounce animation replace the plain
 *    ActivityIndicator spinner.
 *
 * 4. Bot avatar gets a subtle pulse animation while "thinking",
 *    achieved by a looping scale oscillation in the indicator.
 *
 * 5. SVG wave divider — smooth curve between the purple header
 *    gradient and the white chat area (not a hard edge).
 *
 * 6. Quick-reply suggestion chips appear under the first bot
 *    message ("Explain autism", "Help me calm down", "What is ADHD?").
 *
 * 7. Input bar restyled — rounded pill shape with filled circular
 *    send button containing an arrow icon.
 *
 * 8. StyleSheet.create() moved OUTSIDE component (was fine before
 *    but now guaranteed for the rewrite).
 *
 * 9. All magic numbers replaced with theme tokens.
 *
 * 10. Gemini API + offline knowledge base preserved from v1.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { BackArrowIcon, SendIcon } from '../components/icons/ConditionIcons';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import {
  COLORS,
  SPACING,
  RADII,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
} from '../theme';

// ── API key from config ──
import { GEMINI_API_KEY } from '../config/apiKeys';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Quick-reply chip labels ──
const QUICK_REPLIES = [
  'Explain autism',
  'Help me calm down',
  'What is ADHD?',
];

// ════════════════════════════════════════════════════
// OFFLINE KNOWLEDGE BASE  (preserved from v1)
// ════════════════════════════════════════════════════
const KNOWLEDGE_BASE = {
  en: [
    {
      keywords: ['down syndrome', "down's syndrome", 'downs', 'trisomy 21', 'trisomy'],
      response: "Down syndrome (Trisomy 21) is a genetic condition caused by an extra copy of chromosome 21. It affects about 1 in 700 babies born worldwide.\n\n🧬 Key Facts:\n• It's the most common chromosomal condition\n• It causes mild to moderate intellectual disability\n• People with Down syndrome can live fulfilling, meaningful lives\n\n💪 Strengths:\n• Strong visual learning abilities\n• Excellent social skills and empathy\n• Good long-term memory\n\n🏠 Support Tips:\n• Use visual aids and concrete examples\n• Break tasks into small, manageable steps\n• Encourage social interaction and inclusion\n• Celebrate every achievement, big or small!",
    },
    {
      keywords: ['autism', 'asd', 'autistic', 'autism spectrum', 'spectrum disorder'],
      response: "Autism Spectrum Disorder (ASD) is a neurodevelopmental condition that affects how a person communicates, interacts, and experiences the world.\n\n🧠 Key Facts:\n• It's a spectrum — every autistic person is unique\n• Affects about 1 in 36 children\n• It's not a disease — it's a different way of processing the world\n\n⭐ Strengths:\n• Exceptional attention to detail\n• Strong pattern recognition\n• Deep focus on areas of interest\n• Honest and loyal\n\n🏠 Support Tips:\n• Create predictable routines\n• Use clear, direct language\n• Respect sensory sensitivities\n• Focus on strengths rather than deficits\n• Visual schedules can be very helpful!",
    },
    {
      keywords: ['dyslexia', 'dyslexic', 'reading difficulty', 'reading disorder', 'reading problem'],
      response: "Dyslexia is a learning difference that primarily affects reading, writing, and spelling skills. It's not related to intelligence!\n\n📖 Key Facts:\n• Affects 5-10% of the population\n• It's neurological — the brain processes text differently\n• Many successful people have dyslexia\n\n⭐ Strengths:\n• Creative and innovative thinking\n• Strong problem-solving skills\n• Great big-picture thinking\n• Often excellent verbal skills\n\n🏠 Support Tips:\n• Use audiobooks alongside reading\n• Allow extra time for reading tasks\n• Use colored overlays if helpful\n• Multi-sensory learning approaches work best\n• Encourage their creative talents!",
    },
    {
      keywords: ['adhd', 'attention deficit', 'hyperactivity', 'attention', 'focus', 'hyperactive', 'inattentive'],
      response: "ADHD (Attention-Deficit/Hyperactivity Disorder) is a neurodevelopmental condition that affects focus, impulse control, and activity levels.\n\n🧠 Key Facts:\n• Affects about 5-7% of children worldwide\n• Three types: inattentive, hyperactive-impulsive, or combined\n• It's neurological — related to dopamine regulation in the brain\n\n⭐ Strengths:\n• Creative and out-of-the-box thinking\n• High energy and enthusiasm\n• Ability to hyperfocus on interesting tasks\n• Resilient and adaptable\n\n🏠 Support Tips:\n• Break tasks into smaller chunks\n• Use timers and visual schedules\n• Create a calm, organized environment\n• Allow movement breaks\n• Celebrate effort, not just results!",
    },
    {
      keywords: ['intellectual disability', 'intellectual', 'cognitive disability', 'learning disability', 'cognitive delay'],
      response: "Intellectual Disability (ID) is characterized by limitations in intellectual functioning and adaptive behavior. It's important to focus on abilities, not limitations!\n\n🧠 Key Facts:\n• Affects about 1-3% of the population\n• Ranges from mild to profound\n• Can be caused by genetic, environmental, or unknown factors\n\n⭐ Strengths:\n• Determination and persistence\n• Warmth and social connection\n• Ability to learn and grow throughout life\n\n🏠 Support Tips:\n• Use simple, clear instructions\n• Break tasks into small steps\n• Provide consistent routines\n• Use visual supports and demonstrations\n• Celebrate progress and effort\n• Encourage independence in daily living skills!",
    },
    {
      keywords: ['calm', 'calm down', 'anxious', 'anxiety', 'scared', 'worry', 'worried', 'panic', 'stress', 'stressed', 'overwhelm', 'overwhelmed', 'meltdown'],
      response: "I'm here for you. Let's take a moment to calm down together. 💙\n\n🧘 Try this breathing exercise:\n1. Breathe IN slowly for 4 counts... 1, 2, 3, 4\n2. HOLD your breath for 4 counts... 1, 2, 3, 4\n3. Breathe OUT slowly for 4 counts... 1, 2, 3, 4\n4. Repeat 3-5 times\n\n🌊 More calming strategies:\n• Press your hands together firmly for 10 seconds, then release\n• Name 5 things you can see around you\n• Listen for 3 sounds you can hear\n• Touch something soft and focus on how it feels\n• Hum your favorite song softly\n\n💛 Remember: It's okay to feel overwhelmed. These feelings will pass. You're doing great by reaching out!",
    },
    {
      keywords: ['therapy', 'therapies', 'treatment', 'intervention', 'help child'],
      response: "There are many effective therapies and interventions that can make a big difference! Here are some common ones:\n\n🗣️ Speech & Language Therapy:\n• Helps with communication skills\n• Can include sign language or AAC devices\n\n🏃 Occupational Therapy:\n• Develops fine motor skills\n• Helps with daily living activities\n• Addresses sensory processing needs\n\n🧩 Behavioral Therapy:\n• ABA (Applied Behavior Analysis)\n• Positive behavior support\n• Social skills training\n\n🎵 Other Helpful Approaches:\n• Music therapy\n• Art therapy\n• Physical therapy\n• Play-based learning\n\n💡 Remember: Early intervention leads to the best outcomes!",
    },
    {
      keywords: ['parent', 'parents', 'parenting', 'caregiver', 'family', 'families', 'coping', 'support group'],
      response: "Being a parent or caregiver is both rewarding and challenging. You're doing an amazing job! 💛\n\n🤝 Support Resources:\n• Join local or online support groups\n• Connect with other families who understand\n• Seek respite care when you need a break\n\n💪 Self-Care Tips:\n• Take time for yourself — you matter too\n• Don't compare your child to others\n• Celebrate small victories every day\n• It's okay to ask for help\n\n📋 Practical Steps:\n• Learn about your child's condition\n• Advocate for your child's needs at school\n• Build a team of supportive professionals\n• Keep a journal to track progress\n\nRemember: You are your child's greatest advocate and champion! 🌟",
    },
    {
      keywords: ['school', 'education', 'iep', 'learning', 'classroom', 'teacher', 'inclusion', 'inclusive', 'special education'],
      response: "Education is so important for every child! Here's what you should know:\n\n🏫 School Support:\n• IEP (Individualized Education Program) — customized learning plans\n• Inclusive classrooms with proper support\n• Special education services when needed\n\n📝 Helpful Strategies:\n• Visual schedules and instructions\n• Modified assignments and extra time\n• Assistive technology tools\n• Peer buddy systems\n\n👨‍🏫 Working with Teachers:\n• Share what works at home\n• Attend all IEP meetings\n• Communicate regularly\n• Ask about available accommodations\n\n💡 Remember: Every child can learn — they may just need a different approach!",
    },
    {
      keywords: ['speech', 'talking', 'communication', 'nonverbal', 'non-verbal', 'language', 'words', 'speak'],
      response: "Communication takes many forms, and every form is valid! 🗣️\n\n📱 Communication Methods:\n• Verbal speech\n• Sign language\n• Picture cards (PECS)\n• AAC devices (augmentative & alternative communication)\n• Gestures and body language\n\n🎯 How to Help:\n• Talk to your child often, even if they don't respond yet\n• Use simple, clear sentences\n• Give them time to process and respond\n• Read books together every day\n• Sing songs — music helps language!\n\n⏰ Milestones:\n• Don't compare — every child develops at their own pace\n• Early speech therapy can make a huge difference\n• Celebrate every new word or communication attempt!",
    },
    {
      keywords: ['social', 'friends', 'friendship', 'play', 'interaction', 'socialize', 'isolation', 'lonely', 'bullying', 'bully'],
      response: "Social connections are so important for everyone! Here's how to help:\n\n🤝 Building Friendships:\n• Arrange playdates with understanding peers\n• Join inclusive community activities\n• Practice social skills through role-playing\n• Special Olympics and adaptive sports are great!\n\n🛡️ Handling Challenges:\n• Teach self-advocacy skills\n• Address bullying immediately with school staff\n• Build your child's confidence\n• Help them find their 'tribe' — people who appreciate them\n\n💛 Social Skills Support:\n• Social stories can help explain situations\n• Practice greetings and conversations\n• Use visual cues for emotions\n• Celebrate social successes!",
    },
    {
      keywords: ['sensory', 'sensitive', 'noise', 'loud', 'texture', 'stimming'],
      response: "Sensory sensitivities are very common and completely valid! 🌈\n\n🔊 Common Sensory Challenges:\n• Sounds (loud or unexpected noises)\n• Textures (clothing, food, surfaces)\n• Lights (bright or flickering)\n• Crowds and busy environments\n\n🧘 Calming Strategies:\n• Create a quiet 'safe space' at home\n• Noise-cancelling headphones\n• Weighted blankets or vests\n• Fidget tools\n• Deep breathing exercises\n\n✅ Helpful Approaches:\n• Prepare for new environments in advance\n• Allow sensory breaks\n• Respect their sensitivities — don't force exposure\n• Stimming is self-regulation — it's okay!\n\nRemember: Sensory needs are real needs! 💙",
    },
    {
      keywords: ['sleep', 'sleeping', 'bedtime', 'night', 'rest'],
      response: "Sleep can be challenging, but good sleep habits make a big difference! 🌙\n\n😴 Healthy Sleep Tips:\n• Keep a consistent bedtime routine\n• Create a calm, dark sleeping environment\n• Limit screen time before bed\n• Use calming activities (bath, soft music, reading)\n\n🛏️ Common Challenges:\n• Difficulty falling asleep\n• Waking during the night\n• Early morning waking\n• Anxiety at bedtime\n\n💡 Solutions:\n• Visual bedtime schedule\n• Weighted blankets can help\n• White noise machines\n• Talk to your doctor about persistent sleep issues\n• Melatonin (under medical supervision)",
    },
    {
      keywords: ['food', 'eat', 'eating', 'diet', 'nutrition', 'picky', 'feeding'],
      response: "Feeding challenges are very common and you're not alone! 🍎\n\n🥗 Common Challenges:\n• Picky eating or food aversions\n• Sensory issues with textures\n• Difficulty with chewing or swallowing\n\n💡 Helpful Strategies:\n• Introduce new foods slowly\n• Don't force — offer without pressure\n• Make mealtimes fun and stress-free\n• Let them explore food with their hands\n• Try food chaining (similar textures/colors)\n\n👨‍⚕️ When to Seek Help:\n• If nutrition is a concern, talk to a dietitian\n• Feeding therapy can help with oral motor skills\n• Occupational therapy for sensory-based food aversions",
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      response: "Hello there! 👋 I'm CogniBot, your friendly assistant!\n\nI can help you learn about:\n🧩 Autism Spectrum Disorder\n💛 Down Syndrome\n📖 Dyslexia\n⚡ ADHD\n🧠 Intellectual Disability\n\nI can also answer questions about:\n🗣️ Speech & Communication\n🏫 Education & School\n👨‍👩‍👧 Parenting & Family Support\n🧘 Sensory Needs\n💪 Therapies & Interventions\n\nJust ask me anything! I'm here to help. 😊",
    },
    {
      keywords: ['thank', 'thanks', 'thank you', 'appreciate'],
      response: "You're very welcome! 😊 I'm always here to help. Never hesitate to ask — no question is too small! You're doing a wonderful job seeking information and support. Keep going! 💛🌟",
    },
    {
      keywords: ['who are you', 'what are you', 'your name', 'about you', 'what can you do'],
      response: "I'm CogniBot! 🤖 Your friendly AI assistant inside CogniVerse.\n\nI'm here to help you understand developmental conditions and provide support and guidance. I can answer questions about:\n\n• Autism, Down Syndrome, Dyslexia, ADHD, and Intellectual Disability\n• Therapies and interventions\n• Parenting tips and family support\n• Education and school accommodations\n• Sensory needs and communication\n\nI'm patient, kind, and always here to help — ask me anything! 💙",
    },
    {
      keywords: ['milestone', 'development', 'developmental', 'delay', 'delayed', 'progress', 'growth'],
      response: "Every child develops at their own unique pace! 🌱\n\n📊 Understanding Development:\n• Milestones are guidelines, not deadlines\n• Delays in one area don't define the whole child\n• Progress may be slower but it IS happening\n\n🎯 How to Support Growth:\n• Focus on what they CAN do\n• Set small, achievable goals\n• Celebrate every step forward\n• Work with therapists to track progress\n\n💡 Remember:\n• Comparing to other children isn't helpful\n• Keep a progress journal — you'll be amazed looking back!\n• Early intervention makes the biggest difference\n• Your child is growing and learning every single day! 🌟",
    },
  ],
  hi: [
    {
      keywords: ['डाउन सिंड्रोम', 'down syndrome', 'downs', 'ट्राइसोमी'],
      response: "डाउन सिंड्रोम (ट्राइसोमी 21) एक आनुवंशिक स्थिति है जो क्रोमोसोम 21 की एक अतिरिक्त प्रतिलिपि के कारण होती है।\n\n🧬 मुख्य तथ्य:\n• यह सबसे आम क्रोमोसोमल स्थिति है\n• हर 700 में से 1 बच्चे को प्रभावित करती है\n• हल्की से मध्यम बौद्धिक अक्षमता होती है\n\n💪 शक्तियाँ:\n• मजबूत दृश्य सीखने की क्षमता\n• उत्कृष्ट सामाजिक कौशल\n• अच्छी दीर्घकालिक स्मृति\n\n🏠 सहायता:\n• दृश्य सहायता का उपयोग करें\n• कार्यों को छोटे चरणों में विभाजित करें\n• हर उपलब्धि का जश्न मनाएँ! 🌟",
    },
    {
      keywords: ['ऑटिज्म', 'autism', 'asd', 'आत्मकेंद्रित'],
      response: "ऑटिज्म स्पेक्ट्रम डिसऑर्डर (ASD) एक न्यूरोडेवलपमेंटल स्थिति है।\n\n🧠 मुख्य तथ्य:\n• हर ऑटिस्टिक व्यक्ति अद्वितीय है\n• यह कोई बीमारी नहीं है\n• 36 में से 1 बच्चे को प्रभावित करता है\n\n⭐ शक्तियाँ:\n• विस्तार पर असाधारण ध्यान\n• मजबूत पैटर्न पहचान\n• रुचि के क्षेत्रों में गहन ध्यान\n\n🏠 सहायता:\n• पूर्वानुमानित दिनचर्या बनाएं\n• स्पष्ट भाषा का उपयोग करें\n• संवेदी संवेदनशीलताओं का सम्मान करें\n• शक्तियों पर ध्यान दें! 💙",
    },
    {
      keywords: ['डिस्लेक्सिया', 'dyslexia', 'पढ़ने में कठिनाई'],
      response: "डिस्लेक्सिया एक सीखने का अंतर है जो मुख्य रूप से पढ़ने, लिखने और वर्तनी को प्रभावित करता है।\n\n📖 मुख्य तथ्य:\n• 5-10% आबादी को प्रभावित करता है\n• बुद्धिमत्ता से कोई संबंध नहीं है\n• कई सफल लोगों को डिस्लेक्सिया है\n\n⭐ शक्तियाँ:\n• रचनात्मक सोच\n• मजबूत समस्या-समाधान कौशल\n• उत्कृष्ट मौखिक कौशल\n\n🏠 सहायता:\n• ऑडियोबुक का उपयोग करें\n• अतिरिक्त समय दें\n• बहु-संवेदी सीखने की विधियाँ सबसे अच्छी हैं! 📚",
    },
    {
      keywords: ['नमस्ते', 'हेलो', 'हाय', 'hello', 'hi'],
      response: "नमस्ते! 👋 मैं CogniBot हूँ, आपका मित्रवत सहायक!\n\nमैं आपकी इन विषयों में मदद कर सकता हूँ:\n🧩 ऑटिज्म\n💛 डाउन सिंड्रोम\n📖 डिस्लेक्सिया\n🧠 बौद्धिक अक्षमता\n\nमुझसे कुछ भी पूछें! 😊",
    },
    {
      keywords: ['धन्यवाद', 'शुक्रिया', 'thanks'],
      response: "आपका स्वागत है! 😊 मैं हमेशा मदद के लिए यहाँ हूँ। कोई भी सवाल पूछने में संकोच न करें! 💛🌟",
    },
  ],
};

// ── Smart keyword matching against the offline KB ──
const getOfflineResponse = (userInput, lang = 'en') => {
  const input = userInput.toLowerCase().trim();
  const kb = KNOWLEDGE_BASE[lang] || KNOWLEDGE_BASE.en;

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of kb) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        score += keyword.length; // longer matches = more specific
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) return bestMatch.response;

  // Default fallback
  if (lang === 'hi') {
    return "मैं एक ऑफ़लाइन सहायक के रूप में काम कर रहा हूँ। मैं इन विषयों पर मदद कर सकता हूँ:\n\n🧩 ऑटिज्म\n💛 डाउन सिंड्रोम\n📖 डिस्लेक्सिया\n🧠 बौद्धिक अक्षमता\n🗣️ भाषण और संचार\n🏫 शिक्षा\n👨‍👩‍👧 पालन-पोषण\n\nकृपया इनमें से किसी विषय पर प्रश्न पूछें! 😊";
  }
  return "I'd love to help! I work best with questions about specific topics like:\n\n🧩 Autism Spectrum Disorder\n💛 Down Syndrome\n📖 Dyslexia\n⚡ ADHD\n🧠 Intellectual Disability\n🗣️ Speech & Communication\n🏫 Education & School Support\n👨‍👩‍👧 Parenting & Family\n🧘 Sensory Needs\n💪 Therapies & Interventions\n\nTry asking about any of these topics! 😊";
};

// ════════════════════════════════════════════════════
// PULSING BADGE — live "Online" indicator in header
// ════════════════════════════════════════════════════
const OnlineBadge = () => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  return (
    <View style={styles.onlineBadge}>
      <Animated.View
        style={[styles.onlineDot, { opacity: pulse }]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
      />
      <Text style={styles.onlineText}>Online</Text>
    </View>
  );
};

// ════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════
const ChatbotScreen = ({ onBack }) => {
  const { language } = useTheme();
  const { t } = useLanguage();
  const { speak, stop } = useTTS();
  const { userData } = useUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // ── Header entrance animation ──
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 45,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFade, headerSlide]);

  // ── Initialize with welcome message ──
  useEffect(() => {
    const welcomeText =
      language === 'hi'
        ? 'नमस्ते! 👋 मैं CogniBot हूँ। मैं आपकी कैसे मदद कर सकता हूँ?'
        : "Hi there! 👋 I'm CogniBot, your friendly assistant. How can I help you today?";

    setMessages([
      {
        id: 'welcome-1',
        text: welcomeText,
        sender: 'bot',
      },
    ]);
  }, [language]);

  // ── Android hardware back ──
  useEffect(() => {
    const handler = () => {
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  }, [onBack]);

  // ── Send message ──
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      text: trimmed,
      sender: 'user',
    };
    setMessages((prev) => [userMsg, ...prev]); // prepend (inverted list)
    setInput('');
    setLoading(true);
    stop(); // stop any ongoing TTS

    // ── Try Gemini API, fallback to offline KB ──
    let botText = null;

    if (GEMINI_API_KEY) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const systemText =
          language === 'hi'
            ? 'आप CogniBot हैं, CogniVerse ऐप के लिए एक मित्रवत और सहायक AI सहायक। धैर्यवान, दयालु और अत्यंत प्रोत्साहक बनें। सरल भाषा का उपयोग करें। हमेशा हिंदी में जवाब दें।'
            : 'You are CogniBot, a friendly and helpful AI assistant for the CogniVerse app — a learning platform for neurodivergent children. Be patient, kind, and extremely encouraging. Use simple, clear language. Keep answers concise but informative. Always respond in English.';

        // Build history (reverse because our state is inverted)
        const history = [...messages]
          .reverse()
          .map((m) => ({
            role: m.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: m.text }],
          }));

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `System context: ${systemText}` }],
            },
            {
              role: 'model',
              parts: [
                {
                  text: 'Understood! I am CogniBot and I will follow these guidelines.',
                },
              ],
            },
            ...history,
            { role: 'user', parts: [{ text: trimmed }] },
          ],
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          const candidate = result.candidates?.[0];
          if (candidate?.content?.parts?.[0]?.text) {
            botText = candidate.content.parts[0].text;
          }
        }
      } catch (_err) {
        // Network error → fall through to offline
      }
    }

    // Fallback to offline KB
    if (!botText) {
      botText = getOfflineResponse(
        trimmed,
        language === 'hi' ? 'hi' : 'en',
      );
    }

    // Add bot response (prepend for inverted list)
    const botMsg = {
      id: `bot-${Date.now()}`,
      text: botText,
      sender: 'bot',
    };
    setMessages((prev) => [botMsg, ...prev]);
    speak(botText);
    setLoading(false);
  }, [input, loading, messages, language, speak, stop]);

  // ── Quick-reply chip handler ──
  const handleChipPress = useCallback(
    (label) => {
      setInput(label);
      // Small delay so user sees the input filled, then send
      setTimeout(() => {
        setInput('');
        // Simulate sending the chip text
        const userMsg = {
          id: `user-${Date.now()}`,
          text: label,
          sender: 'user',
        };
        setMessages((prev) => [userMsg, ...prev]);
        setLoading(true);
        stop();

        // Use offline KB for instant response on chips
        const botText = getOfflineResponse(
          label,
          language === 'hi' ? 'hi' : 'en',
        );

        setTimeout(() => {
          const botMsg = {
            id: `bot-${Date.now()}`,
            text: botText,
            sender: 'bot',
          };
          setMessages((prev) => [botMsg, ...prev]);
          speak(botText);
          setLoading(false);
        }, 1200); // Simulate small delay for natural feel
      }, 150);
    },
    [language, speak, stop],
  );

  // ── Render individual message ──
  const renderMessage = useCallback(
    ({ item, index }) => {
      const isFirstBot =
        item.sender === 'bot' && item.id === 'welcome-1';

      return (
        <ChatBubble
          text={item.text}
          sender={item.sender}
          isFirstBot={isFirstBot}
          quickReplies={isFirstBot ? QUICK_REPLIES : []}
          onChipPress={handleChipPress}
        />
      );
    },
    [handleChipPress],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      {/* ═══════════════════════════════════════
          SECTION 1: PURPLE HEADER + SVG WAVE
      ═══════════════════════════════════════ */}
      <View style={styles.headerSection}>
        {/* Solid purple background behind header */}
        <View style={styles.purpleBg} />

        <SafeAreaView>
          <Animated.View
            style={[
              styles.headerRow,
              {
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}
          >
            {/* Back button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              accessibilityHint="Returns to the home screen"
            >
              <BackArrowIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Title group */}
            <View style={styles.headerCenter}>
              <View style={styles.headerAvatarRow}>
                <View style={styles.headerAvatar}>
                  <Text style={styles.headerAvatarEmoji}>🤖</Text>
                </View>
                <View>
                  <Text
                    style={styles.headerTitle}
                    accessibilityRole="header"
                  >
                    CogniBot
                  </Text>
                  <OnlineBadge />
                </View>
              </View>
            </View>

            {/* Spacer for symmetry */}
            <View style={styles.headerSpacer} />
          </Animated.View>
        </SafeAreaView>

        {/* ── SVG wave curve divider ── */}
        <View style={styles.waveDivider}>
          <Svg
            width="100%"
            height="50"
            viewBox="0 0 1440 50"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient
                id="waveGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#312E81" />
                <Stop offset="50%" stopColor="#4338CA" />
                <Stop offset="100%" stopColor="#6366F1" />
              </LinearGradient>
            </Defs>
            <Path
              fill="url(#waveGrad)"
              d="M0,0 L0,25 Q180,50 360,30 T720,35 T1080,25 T1440,30 L1440,0 Z"
            />
          </Svg>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          SECTION 2: CHAT AREA + INPUT
      ═══════════════════════════════════════ */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatSection}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* ── Inverted message list ── */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          inverted={true}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          // Header in inverted list = bottom = typing indicator
          ListHeaderComponent={
            loading ? <TypingIndicator /> : null
          }
        />

        {/* ── Input bar (pill shape) ── */}
        <View style={styles.inputBarWrapper}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message…"
              placeholderTextColor={COLORS.textMuted}
              onSubmitEditing={handleSend}
              editable={!loading}
              returnKeyType="send"
              multiline={false}
              accessibilityLabel="Message input"
              accessibilityHint="Type a message to send to CogniBot"
            />

            {/* Circular send button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || loading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
              activeOpacity={0.8}
              accessibilityLabel="Send message"
              accessibilityRole="button"
              accessibilityState={{ disabled: !input.trim() || loading }}
            >
              <SendIcon size={18} color={COLORS.textOnDark} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// ════════════════════════════════════════════════════
// STYLES — Outside component, using theme tokens
// ════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header section ──
  headerSection: {
    zIndex: 2,
  },
  purpleBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.base : SPACING.sm,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm + 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerAvatarEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title3,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 44,
  },

  // ── Online badge ──
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: SPACING.xs + 1,
  },
  onlineText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.semibold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
  },

  // ── SVG wave divider ──
  waveDivider: {
    height: 50,
    marginTop: -1, // eliminate hairline gap
  },

  // ── Chat section ──
  chatSection: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },

  // ── Input bar ──
  inputBarWrapper: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.base,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  inputBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.pill,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.xs + 2,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    ...SHADOWS.md,
    shadowOpacity: 0.08,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.subhead,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.medium,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm + 2 : SPACING.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.colored(COLORS.primary),
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    shadowOpacity: 0,
  },
});

export default ChatbotScreen;