import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';

// Help content for different screens - English
const HELP_CONTENT_EN = {
  hub: [
    {
      id: 'welcome',
      name: 'Welcome to CogniVerse',
      description: 'CogniVerse is a comprehensive learning companion designed to support children with special needs through personalized, interactive experiences. Every feature is built with accessibility and visual learning in mind. Your main hub gives you access to four key modules that work together to build communication, social, and cognitive skills. Use the profile icon (top-left) to view progress, or the help icon (bottom-right) for context-specific guidance. The settings icon (top-right) lets you customize the app experience to fit your needs.',
    },
    {
      id: 'autism-communication',
      name: 'Autism & Communication',
      description: 'This comprehensive communication module contains powerful features: "My Voice" provides unlimited AI-generated vocabulary for communication boards - tap any word or symbol to speak. "Learn to Build" teaches sentence construction progressively, from single words to complex sentences with visual guidance. "Story Time" creates personalized social stories to prepare for real-world situations. Each feature opens by tapping its card. This module is crucial for non-verbal communication, language development, and social understanding, directly addressing core challenges in autism communication.',
      icon: '🗣️',
      impact: 'Develops expressive language, reduces frustration from communication barriers, builds confidence in social interactions, and improves emotional regulation. Regular use leads to measurable improvement in vocabulary, sentence complexity, and social engagement.',
    },
    {
      id: 'learning-basics',
      name: 'Learning Basics',
      description: 'This foundational learning module teaches essential skills through interactive visual flashcards. It includes: Number recognition (1-20) with spoken words, Color identification with vibrant full-screen displays, Full alphabet (A-Z) with matching pictures, and Daily routines (wake up, brush teeth, learn, sleep). Each flashcard shows one item at a time with a Next button and Voice button. The simple, distraction-free layout is designed for children with autism and Down syndrome.',
      icon: '📚',
      impact: 'Builds strong academic foundations, improves school readiness, teaches practical daily living skills, and boosts confidence in learning abilities.',
    },
    {
      id: 'social-skills',
      name: 'Social Skills',
      description: 'This visual learning module teaches essential social skills through big, focused flashcards. It includes 12 social scenarios: Hello (waving), Shaking Hands, Thank You, Smiling, Eye Contact, Asking for Help, Hugging, Listening, Sorry, Goodbye, Sharing, and Waiting Your Turn. Each card shows a large picture with a voice button that explains the skill in simple, clear language. Children navigate one card at a time with Back and Next buttons.',
      icon: '👥',
      impact: 'Improves peer interactions, reduces social anxiety, enhances understanding of social cues, and builds lasting friendships through better social understanding.',
    },
    {
      id: 'games',
      name: 'Educational Games',
      description: 'A fun collection of four therapeutic games that build cognitive skills through play. Match Pairs: Memory card game with Easy (4 cards) and Medium (6 cards) modes. Emotion Detective: Match emotion words to emoji faces across 8 rounds. Count and Tap: Count animated objects and tap the correct number. Pattern Puzzle: Complete visual sequences with a hint system. All games include spoken feedback, celebration screens, and progress tracking.',
      icon: '🎮',
      impact: 'Maintains motivation and engagement, reinforces learned skills through repetition, provides stress-free practice opportunities, and makes learning feel like play rather than work.',
    },
    {
      id: 'dashboard',
      name: 'Profile & Dashboard',
      description: 'Access your personalized dashboard via the profile icon (top-left). View and edit your child\'s information including name, age, email, and condition. The Daily Login Streak shows consistency - each blue square represents a day of engagement. The Progress Graph displays week-by-week improvement in activity completion and accuracy. Regular practice builds longer streaks and higher progress scores, providing clear visual evidence of growth and engagement over time.',
    },
    {
      id: 'help-system',
      name: 'Help & Guidance',
      description: 'The blue question mark icon (bottom-right) provides context-aware help wherever you are in the app. The help content changes based on which screen you\'re viewing, offering specific guidance for communication tools, learning activities, social features, and progress tracking. Touch any help icon for detailed explanations of features, step-by-step usage instructions, and information about expected impacts and benefits.',
    },
  ],
  autismSuite: [
    {
      id: 'overview',
      name: 'Autism & Communication Suite Overview',
      description: 'This suite contains specialized tools working together to build comprehensive communication skills. Each tool addresses different aspects of communication: My Voice for expressive communication, Learn to Build for language structure, and Story Time for social understanding. Use them individually or in combination to create a holistic communication development program.',
    },
    {
      id: 'my-voice',
      name: 'My Voice - Communication Board',
      description: 'An unlimited vocabulary communication board powered by AI. Features include: Tap any symbol to hear it spoken aloud, Type any word to instantly generate a visual symbol, Organize words into 8 categories (Core Words, Actions, People, Places, Food, Feelings, Time, Questions), Add unlimited custom words to any category, Swipe between categories, Long-press to remove symbols, Auto-save all custom words. This tool is essential for non-verbal users to express needs, thoughts, and participate in conversations. The AI symbol generation eliminates vocabulary limitations that traditional communication devices have.',
      icon: '🗣️',
      impact: 'Immediate impact: Enables independent communication, reduces frustration from inability to express needs, increases participation in daily activities. Long-term benefits: Expands vocabulary exponentially, builds confidence in communication, improves social connections, supports academic participation.',
    },
    {
      id: 'learn-to-build',
      name: 'Learn to Build - Sentence Construction',
      description: 'A progressive grammar learning system with visual guidance. Features include: Three learning levels - beginner (single words), intermediate (two-word phrases), advanced (full sentences), Word bank with visual symbols for each word, Interactive sentence building with drag-and-drop simplicity, Real-time text-to-speech feedback, "Clear" button to start over, "Speak" button to hear your sentence, "Add Symbol" to expand vocabulary, Color-coded visual guidance for sentence parts. The system starts simple and adapts to the user\'s progress, providing encouragement at each level. This builds understanding of sentence structure naturally through practice.',
      icon: '🧩',
      impact: 'Immediate impact: Develops understanding of grammar basics, provides hands-on sentence practice, reinforces word combinations. Long-term benefits: Transitions from single words to full conversations, improves communication clarity, supports academic writing skills, builds linguistic competence.',
    },
    {
      id: 'story-time',
      name: 'Story Time - Social Stories',
      description: 'AI-powered visual social stories prepare users for real-world situations. Features include: Pre-made stories for common scenarios (birthday parties, doctor visits, school events), Custom story creation by typing any situation, Step-by-step visual guides with emoji illustrations, Simple, clear language at appropriate reading level, Navigation controls to move through story steps, Text-to-speech reads each step aloud, Personalized scenarios match user\'s specific needs. Social stories are evidence-based tools that reduce anxiety by familiarizing users with new situations before they happen. Users can create stories for specific upcoming events.',
      icon: '📚',
      impact: 'Immediate impact: Reduces anxiety about new situations, prepares for upcoming events, provides visual mental rehearsal. Long-term benefits: Increases willingness to try new experiences, improves adaptability and flexibility, enhances social confidence, reduces stress and meltdowns.',
    },
    {
      id: 'integration-tips',
      name: 'Using All Features Together',
      description: 'For best results, use features in combination: Use My Voice to communicate needs and feelings, Build sentences with Learn to Build to express complex thoughts, Read Story Time stories to prepare for upcoming social situations, Practice daily with different features to build consistency. This integrated approach creates comprehensive communication development addressing all aspects of expressive and receptive language plus social-emotional skills.',
    },
  ],
  communicationBoard: [
    {
      id: 'getting-started',
      name: 'Getting Started with My Voice',
      description: 'My Voice is your personal communication board - unlimited vocabulary, powered by AI. Start by tapping any symbol on the board to hear it spoken. Symbols are organized into 8 categories visible at the top. Use the search icon at the bottom to add any word - the AI instantly generates a visual symbol. Tap symbols repeatedly to build phrases, or combine categories to create sentences. This tool learns your preferences and saves all custom words automatically.',
    },
    {
      id: 'how-to-use',
      name: 'Using the Board',
      description: 'Basic controls: Single tap any symbol to speak it aloud. Swipe left or right to switch between categories. Tap the search icon (magnifying glass) to add custom words. Type any word and press enter - AI creates the symbol instantly. Long-press any symbol to remove it from the current board. Scroll vertically to see more symbols in each category. The board adapts to your usage patterns, showing frequently used words more prominently. Practice daily to build vocabulary and communication speed.',
    },
    {
      id: 'categories',
      name: 'Understanding Categories',
      description: 'Categories organize vocabulary for quick access: Core Words - essential communication (I, want, help, more, yes, no, please, thank you). Actions - verbs (eat, play, go, sleep, wash, read, run, sit). People - family and community (mom, dad, teacher, friend, doctor). Places - locations (home, school, park, store, bathroom, bedroom). Food - meals and snacks (apple, water, cookie, milk, bread, pizza, ice cream). Feelings - emotions (happy, sad, tired, hungry, hurt, scared). Time - temporal concepts (morning, now, later, today, tomorrow, night). Questions - inquiry words (what, where, when, who, how, why). Each category can hold unlimited custom words specific to the user\'s needs.',
    },
    {
      id: 'building-phrases',
      name: 'Building Phrases and Sentences',
      description: 'Advanced communication techniques: Combine symbols from multiple categories to create meaningful phrases. Example: "I" (Core) + "want" (Core) + "cookie" (Food) = "I want cookie". Use action words with objects: "play" (Action) + "ball" (can be added as custom). Layer emotions with situations: "I" + "feel" + "happy" + "at" + "park". Practice building 2-3 word phrases before attempting longer sentences. The visual symbols help users see sentence structure while the audio reinforces spoken language patterns. This natural progression builds toward expressive communication.',
    },
    {
      id: 'personalization',
      name: 'Customization and Personalization',
      description: 'Make My Voice truly yours: Add family names, favorite foods, preferred activities, specific places you visit regularly, school subjects, hobbies, and personal routines. Create context-specific boards: Home board for family communication, School board for classroom needs, Social board for friend interactions, Restaurant board for dining out, Medical board for doctor visits. Each custom word is saved permanently and appears in relevant categories. The app learns which words you use most frequently and positions them for easy access. Regular customization builds a personalized communication system that grows with the user.',
    },
    {
      id: 'impact',
      name: 'Impact and Benefits',
      description: 'Immediate benefits: Express basic needs without frustration, participate in daily conversations, communicate emergency situations, make choices and express preferences, ask and answer questions. Long-term development: Vocabulary expands from dozens to hundreds of words, communication speed increases with familiar boards, user gains confidence in social situations, supports transition from PECS to verbal communication, enables independent interaction without constant adult support. This tool fundamentally changes communication possibilities, particularly for non-verbal or limited-verbal users, providing a voice where there was none before.',
    },
  ],
  sentenceBuilder: [
    {
      id: 'overview',
      name: 'Learn to Build Overview',
      description: 'Learn to Build teaches sentence structure through interactive, hands-on practice. Unlike speech therapy drills, this feels like playing with blocks - drag words to build sentences visually. The system adapts to your current skill level and progresses naturally. Start with single words, advance to phrases, then construct complete, grammatically correct sentences. Visual symbols paired with words make abstract concepts concrete. This approach builds grammar understanding through practice rather than memorization.',
    },
    {
      id: 'how-it-works',
      name: 'Using Learn to Build',
      description: 'Start by selecting a word from the word bank - the word appears in the sentence building area. Continue adding words to construct your sentence. Controls: "Clear" button removes all words to start fresh, "Speak" button reads your sentence aloud, "Add Symbol" opens My Voice to add new vocabulary, Word bank updates dynamically as you add words. The interface shows word order visually and provides gentle guidance for proper structure. Each completed sentence reinforces grammar patterns naturally through repetition and practice.',
    },
    {
      id: 'levels',
      name: 'Three Learning Levels',
      description: 'Level 1 - Beginner: Single words and simple nouns. Focus on object identification and labeling. Example: "Apple", "Book", "Ball". No grammatical structure required. Level 2 - Intermediate: Two-word phrases combining actions with objects. Introduces subject-verb or verb-object relationships. Examples: "Eat apple", "Read book", "Play ball". Users learn that words have roles (subject does action, object receives action). Level 3 - Advanced: Complete sentences with subjects, verbs, and objects. Adds adjectives, articles, and proper word order. Examples: "I eat red apple", "The cat sits", "She reads big book". Users master full grammatical structure. The app tracks progress and automatically suggests level advancement when ready.',
    },
    {
      id: 'feedback',
      name: 'Learning Through Feedback',
      description: 'Multiple feedback mechanisms reinforce learning: Visual feedback shows correct word placement with color coding, Audio feedback vocalizes complete sentences to reinforce spoken language, Hints appear for incorrect word order with suggestions, Progress tracking shows improvement over time, Encouragement messages celebrate successful sentence building. The "Speak" feature is crucial - hearing sentences aloud reinforces the connection between written symbols, word order, and spoken language. This multisensory approach (visual + auditory) accelerates learning compared to visual-only methods.',
    },
    {
      id: 'impact',
      name: 'Impact and Benefits',
      description: 'Immediate benefits: Understands that words combine to form meaning, learns basic grammar patterns through practice, improves word ordering skills, connects visual symbols with grammar concepts, gains confidence in sentence construction. Long-term development: Transitions from single words to full conversations, develops proper grammar skills, supports written language development, improves communication clarity, enhances academic language skills. This tool bridges the gap between PECS-style communication and true language mastery, building the foundation for more complex communication and potential literacy development.',
    },
  ],

  storyTime: [
    {
      id: 'overview',
      name: 'Story Time Overview',
      description: 'Story Time creates personalized social stories - a proven intervention for autism that helps users understand and prepare for social situations. Social stories use simple, clear language with visuals to break down complex situations into manageable steps. This reduces anxiety by familiarizing users with what to expect before an event happens. Think of it as "mental rehearsal" - practicing a situation visually before experiencing it in real life. The AI can generate stories for any scenario, from common situations like birthday parties to specific upcoming events like dental appointments or school trips.',
    },
    {
      id: 'how-it-works',
      name: 'How Story Time Works',
      description: 'Reading pre-made stories: Browse available stories like "Going to a Birthday Party" - tap to open. Stories are broken into 5-10 steps, each with an emoji illustration and simple text. Navigate with "Next" and "Previous" buttons. Tap the sound icon to have each step read aloud. Scroll through all steps at your own pace. The visual progression helps users mentally walk through each scenario, understanding sequence and expectations.',
    },
    {
      id: 'creating-stories',
      name: 'Creating Custom Stories',
      description: 'Generate personalized stories: Tap the custom story section. Type any situation you want to prepare for - be specific! Examples: "Going to the dentist for a checkup", "Starting at a new school", "Eating at a restaurant with family", "Visiting Grandma\'s house", "Going to a water park". The AI analyzes your scenario and creates a multi-step visual story with: Appropriate sequence of events, Simple, clear language, Emoji illustrations for each step, Expected behaviors and responses, Possible variations (e.g., "If you feel scared, you can tell your parent"). Each custom story is saved for future use. Create stories several days before events for maximum benefit.',
    },
    {
      id: 'reading-stories',
      name: 'Maximizing Story Benefits',
      description: 'Best practices for reading: Read stories 2-3 days before an event for preparation, Read together with a caregiver for discussion opportunities, Read stories multiple times to build familiarity, Discuss each step - what might happen, how to handle challenges, Practice related skills mentioned in the story (e.g., greeting people if story is about meeting new people). Use the sound feature to support independent reading and auditory learning. The repetition and visual imagery create strong mental associations that help users cope with real situations. For maximum effectiveness, pair stories with real practice when possible.',
    },
    {
      id: 'impact',
      name: 'Impact and Benefits',
      description: 'Immediate benefits: Reduces anxiety about upcoming situations by providing predictability, Familiarizes users with expectations before events occur, Creates mental models for appropriate behaviors, Provides visual sequencing of events, Builds confidence through preparation. Long-term development: Increases willingness to try new experiences, Improves adaptability and flexibility to change, Reduces anxiety and meltdowns in social situations, Enhances independence by learning expected behaviors, Supports successful participation in family activities, Builds social understanding and appropriate responses, Improves transition management and routine changes. For users with autism who struggle with unexpected changes and social situations, social stories are one of the most effective evidence-based interventions. Regular use significantly improves social participation and reduces stress around novel situations.',
    },
  ],
  dashboard: [
    {
      id: 'overview',
      name: 'Dashboard Overview',
      description: 'The Child Dashboard provides comprehensive tracking of your child\'s progress and engagement with CogniVerse. Access it via the profile icon (top-left on hub screen). This is where parents can monitor activity, view progress trends, and see evidence of skill development over time. The dashboard includes three main sections: Profile Information (personal details and condition), Daily Login Streak (consistency tracking), and Progress Graph (performance improvement). Regular monitoring helps parents understand what\'s working and celebrate growth with their child.',
    },
    {
      id: 'profile',
      name: 'Profile Information Section',
      description: 'Manage your child\'s account information: View current details: Name, Age, Email address, Condition (e.g., Autism Spectrum Disorder, Down Syndrome, ADHD). Edit Profile button: Opens modal to update any information, Name can be changed as child prefers, Age updates to track development, Condition can be updated if diagnosis changes, All changes save automatically to the app. Profile personalization: Allows customization of app experience, Helps track progress for specific conditions, Stores user preferences and history, Essential for creating personalized learning paths. The profile information helps the app adapt to your child\'s specific needs and developmental stage.',
    },
    {
      id: 'login-streak',
      name: 'Daily Login Streak Tracking',
      description: 'Motivation through consistency: Visual representation shows last 30 days of activity - each blue square = logged-in day, consecutive login counter displays current streak (e.g., "5 Day Streak 🔥"), Calendar grid visualizes engagement patterns at a glance. Benefits of tracking: Encourages daily practice for skill development, Builds routine and predictability (important for autism), Creates positive reinforcement through visual progress, Helps parents monitor consistent usage, Identifies patterns in engagement. Research shows that consistency is key for skill development - daily practice is more effective than sporadic intensive sessions. The streak creates a gamification element that motivates regular use. Longer streaks (7+ days) show strong engagement and correlate with better outcomes.',
    },
    {
      id: 'progress',
      name: 'Progress Graph & Impact',
      description: 'Performance visualization: Week-by-week bar graph showing cognitive and communication improvement, X-axis shows time (weeks), Y-axis shows performance score (percentage), Visual trend shows growth trajectory clearly. What\'s measured: Activity completion rates (how many activities finished), Accuracy in communication exercises (correctness of responses), Sentence complexity progression (from single words to sentences), Emotional identification accuracy, Social story comprehension. Understanding the graph: Upward trend = improving skills, Plateau = consolidation of learning, Irregular patterns = need for consistency or approach adjustment. Parent benefits: See concrete evidence of progress, Identify areas needing more practice, Celebrate achievements with visual data, Share progress with therapists/schools, Adjust usage based on results. The progress graph provides objective evidence of improvement, which is crucial for tracking developmental milestones and demonstrating the app\'s effectiveness.',
    },
    {
      id: 'using-dashboard',
      name: 'Using Dashboard Data Effectively',
      description: 'Regular monitoring recommendations: Check dashboard weekly to track trends, Celebrate streak milestones with your child (e.g., "7-day streak!"), Discuss progress shown in the graph together, Use data to set goals ("Let\'s reach 10 days in a row!"). When progress stalls: Review which features are being used most, Increase consistency (aim for daily use), Try different features to build varied skills, Consider environmental factors (stress, routine changes). Using data for support: Share progress with therapists to complement therapy goals, Show teachers progress to support classroom communication, Use graphs in IEP meetings as evidence of home practice, Adjust app usage based on what shows progress. The dashboard transforms abstract skill development into visible, measurable progress that motivates continued engagement.',
    },
  ],
};

// Hindi help content
const HELP_CONTENT_HI = {
  hub: [
    {
      id: 'welcome',
      name: 'कॉग्निवर्स में आपका स्वागत है',
      description: 'कॉग्निवर्स एक व्यापक शिक्षण साथी है जो विशेष आवश्यकताओं वाले बच्चों को व्यक्तिगत, इंटरैक्टिव अनुभवों के माध्यम से सहायता प्रदान करने के लिए डिज़ाइन किया गया है। प्रत्येक सुविधा पहुंच और दृश्य शिक्षण को ध्यान में रखकर बनाई गई है। आपका मुख्य हब आपको चार प्रमुख मॉड्यूल तक पहुंच प्रदान करता है जो संचार, सामाजिक और संज्ञानात्मक कौशल बनाने के लिए एक साथ काम करते हैं। प्रगति देखने के लिए प्रोफ़ाइल आइकन (ऊपर-बाएं) का उपयोग करें, या संदर्भ-विशिष्ट मार्गदर्शन के लिए सहायता आइकन (नीचे-दाएं) का उपयोग करें। सेटिंग्स आइकन (ऊपर-दाएं) आपको अपनी आवश्यकताओं के अनुसार ऐप अनुभव को अनुकूलित करने देता है।',
    },
    {
      id: 'autism-communication',
      name: 'ऑटिज़्म और संचार',
      description: 'इस व्यापक संचार मॉड्यूल में चार शक्तिशाली सुविधाएं हैं: "मेरी आवाज़" संचार बोर्ड के लिए असीमित एआई-जनित शब्दावली प्रदान करती है - किसी भी शब्द या प्रतीक को बोलने के लिए टैप करें। "सीखें बनाना" वाक्य निर्माण को क्रमिक रूप से सिखाता है, एकल शब्दों से जटिल वाक्यों तक दृश्य मार्गदर्शन के साथ। "भावना खोजक" कहानियों और संदर्भों के साथ 8 मुख्य भावनाओं की खोज करके भावनात्मक शब्दावली विकसित करता है। "कहानी का समय" वास्तविक दुनिया की स्थितियों के लिए तैयार करने के लिए व्यक्तिगत सामाजिक कहानियां बनाता है। प्रत्येक सुविधा अपने कार्ड को टैप करके खुलती है। यह मॉड्यूल गैर-मौखिक संचार, भाषा विकास, भावनात्मक बुद्धिमत्ता और सामाजिक समझ के लिए महत्वपूर्ण है।',
      icon: '🗣️',
      impact: 'अभिव्यंजक भाषा विकसित करता है, संचार बाधाओं से निराशा कम करता है, सामाजिक संपर्क में आत्मविश्वास बनाता है, और भावनात्मक नियमन में सुधार करता है। नियमित उपयोग से शब्दावली, वाक्य जटिलता और सामाजिक जुड़ाव में मापनीय सुधार होता है।',
    },
    {
      id: 'learning-basics',
      name: 'सीखने की मूल बातें',
      description: 'यह बुनियादी शिक्षण मॉड्यूल इंटरैक्टिव विज़ुअल फ्लैशकार्ड के माध्यम से आवश्यक कौशल सिखाता है। इसमें शामिल है: संख्या पहचान (1-20), रंग पहचान, पूर्ण वर्णमाला (A-Z) चित्रों के साथ, और दैनिक दिनचर्या। प्रत्येक फ्लैशकार्ड एक समय में एक आइटम दिखाता है जिसमें Next बटन और Voice बटन होता है।',
      icon: '📚',
      impact: 'मजबूत शैक्षणिक नींव बनाता है, स्कूल की तैयारी में सुधार करता है, व्यावहारिक दैनिक जीवन कौशल सिखाता है, और सीखने की क्षमताओं में आत्मविश्वास बढ़ाता है।',
    },
    {
      id: 'social-skills',
      name: 'सामाजिक कौशल',
      description: 'यह विज़ुअल लर्निंग मॉड्यूल बड़े फ्लैशकार्ड के माध्यम से सामाजिक कौशल सिखाता है। इसमें 12 सामाजिक परिदृश्य शामिल हैं: नमस्ते, हाथ मिलाना, धन्यवाद, मुस्कुराना, आँखों से संपर्क, मदद मांगना, गले लगाना, सुनना, माफी, अलविदा, साझा करना, और बारी का इंतज़ार करना।',
      icon: '👥',
      impact: 'साथियों के साथ बातचीत में सुधार करता है, सामाजिक चिंता को कम करता है, सामाजिक संकेतों की समझ बढ़ाता है, और बेहतर सामाजिक समझ के माध्यम से स्थायी दोस्ती बनाता है।',
    },
    {
      id: 'games',
      name: 'शैक्षिक खेल',
      description: 'खेल के माध्यम संज्ञानात्मक कौशल बनाने वाले चार चिकित्सकीय खेलों का मज़ेदार संग्रह। मैच पेयर्स: आसान (4 कार्ड) और मध्यम (6 कार्ड) मोड के साथ मेमोरी गेम। इमोशन डिटेक्टिव: भावनाओं को पहचानना। काउंट और टैप: गिनती और गणना। पैटर्न पज़ल: तार्किक अनुक्रम।',
      icon: '🎮',
      impact: 'प्रेरणा और जुड़ाव बनाए रखता है, पुनरावृत्ति के माध्यम से सीखे गए कौशल को मजबूत करता है, तनाव-मुक्त अभ्यास के अवसर प्रदान करता है, और सीखने को काम के बजाय खेल जैसा महसूस कराता है।',
    },
    {
      id: 'dashboard',
      name: 'प्रोफ़ाइल और डैशबोर्ड',
      description: 'प्रोफ़ाइल आइकन (ऊपर-बाएं) के माध्यम से अपने व्यक्तिगत डैशबोर्ड तक पहुंचें। अपने बच्चे की जानकारी देखें और संपादित करें जिसमें नाम, उम्र, ईमेल और स्थिति शामिल है। दैनिक लॉगिन स्ट्रीक निरंतरता दिखाती है - प्रत्येक नीला वर्ग जुड़ाव के एक दिन का प्रतिनिधित्व करता है। प्रगति ग्राफ सप्ताह-दर-सप्ताह गतिविधि पूर्णता और सटीकता में सुधार प्रदर्शित करता है।',
    },
    {
      id: 'help-system',
      name: 'सहायता और मार्गदर्शन',
      description: 'नीला प्रश्न चिह्न आइकन (नीचे-दाएं) ऐप में जहां भी आप हों, संदर्भ-जागरूक सहायता प्रदान करता है। सहायता सामग्री आपके द्वारा देखी जा रही स्क्रीन के आधार पर बदलती है, संचार उपकरण, सीखने की गतिविधियों, सामाजिक सुविधाओं और प्रगति ट्रैकिंग के लिए विशिष्ट मार्गदर्शन प्रदान करती है।',
    },
  ],
  autismSuite: HELP_CONTENT_EN.autismSuite,
  communicationBoard: [
    {
      id: 'getting-started',
      name: 'संचार बोर्ड के साथ शुरुआत करें',
      description: 'संचार बोर्ड आपका व्यक्तिगत संचार बोर्ड है - असीमित शब्दावली, एआई द्वारा संचालित। बोर्ड पर किसी भी प्रतीक को टैप करके शुरू करें और इसे बोला हुआ सुनें। प्रतीक श्रेणियों में व्यवस्थित हैं। किसी भी शब्द को जोड़ने के लिए खोज आइकन का उपयोग करें - एआई तुरंत एक दृश्य प्रतीक उत्पन्न करता है। वाक्यांश बनाने के लिए प्रतीकों को बार-बार टैप करें। यह उपकरण आपकी प्राथमिकताओं को सीखता है और सभी कस्टम शब्दों को स्वचालित रूप से सहेजता है।',
    },
    {
      id: 'how-to-use',
      name: 'बोर्ड का उपयोग करना',
      description: 'बुनियादी नियंत्रण: इसे जोर से बोलने के लिए किसी भी प्रतीक को एक बार टैप करें। श्रेणियों के बीच स्विच करने के लिए बाएं या दाएं स्वाइप करें। कस्टम शब्द जोड़ने के लिए खोज आइकन (आवर्धक कांच) टैप करें। कोई भी शब्द टाइप करें और एंटर दबाएं - एआई तुरंत प्रतीक बनाता है। इसे वर्तमान बोर्ड से हटाने के लिए किसी भी प्रतीक को लंबे समय तक दबाएं। प्रत्येक श्रेणी में अधिक प्रतीक देखने के लिए लंबवत स्क्रॉल करें। बोर्ड आपके उपयोग पैटर्न के अनुकूल होता है। शब्दावली और संचार गति बनाने के लिए दैनिक अभ्यास करें।',
    },
    {
      id: 'categories',
      name: 'श्रेणियों को समझना',
      description: 'श्रेणियां त्वरित पहुंच के लिए शब्दावली को व्यवस्थित करती हैं: मुख्य शब्द - आवश्यक संचार (मैं, चाहता हूं, मदद, अधिक, हां, नहीं, कृपया, धन्यवाद)। क्रियाएं - क्रियाएं (खाना, खेलना, जाना, सोना, धोना, पढ़ना, दौड़ना, बैठना)। लोग - परिवार और समुदाय (मां, पिता, शिक्षक, दोस्त, डॉक्टर)। स्थान - स्थान (घर, स्कूल, पार्क, दुकान, बाथरूम, बेडरूम)। भोजन - भोजन और नाश्ता (सेब, पानी, कुकी, दूध, रोटी, पिज्जा, आइसक्रीम)। भावनाएं - भावनाएं (खुश, उदास, थका हुआ, भूखा, चोट, डरा हुआ)। समय - लौकिक अवधारणाएं (सुबह, अभी, बाद में, आज, कल, रात)। प्रश्न - पूछताछ शब्द (क्या, कहां, कब, कौन, कैसे, क्यों)। प्रत्येक श्रेणी उपयोगकर्ता की विशिष्ट आवश्यकताओं के लिए असीमित कस्टम शब्द रख सकती है।',
    },
    {
      id: 'building-phrases',
      name: 'वाक्यांश और वाक्य बनाना',
      description: 'उन्नत संचार तकनीक: सार्थक वाक्यांश बनाने के लिए कई श्रेणियों से प्रतीकों को संयोजित करें। उदाहरण: "मैं" (मुख्य) + "चाहता हूं" (मुख्य) + "कुकी" (भोजन) = "मैं कुकी चाहता हूं"। वस्तुओं के साथ क्रिया शब्दों का उपयोग करें: "खेलना" (क्रिया) + "गेंद" (कस्टम के रूप में जोड़ा जा सकता है)। स्थितियों के साथ भावनाओं को परत करें: "मैं" + "महसूस करता हूं" + "खुश" + "पर" + "पार्क"। लंबे वाक्यों का प्रयास करने से पहले 2-3 शब्द वाक्यांश बनाने का अभ्यास करें। दृश्य प्रतीक उपयोगकर्ताओं को वाक्य संरचना देखने में मदद करते हैं जबकि ऑडियो बोली जाने वाली भाषा पैटर्न को मजबूत करता है।',
    },
    {
      id: 'personalization',
      name: 'अनुकूलन और वैयक्तिकरण',
      description: 'संचार बोर्ड को वास्तव में अपना बनाएं: परिवार के नाम, पसंदीदा खाद्य पदार्थ, पसंदीदा गतिविधियां, विशिष्ट स्थान जहां आप नियमित रूप से जाते हैं, स्कूल विषय, शौक और व्यक्तिगत दिनचर्या जोड़ें। संदर्भ-विशिष्ट बोर्ड बनाएं: परिवार संचार के लिए होम बोर्ड, कक्षा की जरूरतों के लिए स्कूल बोर्ड, दोस्त बातचीत के लिए सोशल बोर्ड, बाहर खाने के लिए रेस्तरां बोर्ड, डॉक्टर की यात्राओं के लिए मेडिकल बोर्ड। प्रत्येक कस्टम शब्द स्थायी रूप से सहेजा जाता है और प्रासंगिक श्रेणियों में दिखाई देता है। ऐप सीखता है कि आप किन शब्दों का सबसे अधिक उपयोग करते हैं और उन्हें आसान पहुंच के लिए स्थिति देता है।',
    },
    {
      id: 'impact',
      name: 'प्रभाव और लाभ',
      description: 'तत्काल लाभ: निराशा के बिना बुनियादी जरूरतों को व्यक्त करें, दैनिक बातचीत में भाग लें, आपातकालीन स्थितियों को संवाद करें, विकल्प बनाएं और प्राथमिकताएं व्यक्त करें, प्रश्न पूछें और उत्तर दें। दीर्घकालिक विकास: शब्दावली दर्जनों से सैकड़ों शब्दों तक विस्तारित होती है, परिचित बोर्डों के साथ संचार गति बढ़ती है, उपयोगकर्ता सामाजिक स्थितियों में आत्मविश्वास प्राप्त करता है, PECS से मौखिक संचार में संक्रमण का समर्थन करता है, निरंतर वयस्क समर्थन के बिना स्वतंत्र बातचीत सक्षम करता है। यह उपकरण मौलिक रूप से संचार संभावनाओं को बदलता है, विशेष रूप से गैर-मौखिक या सीमित-मौखिक उपयोगकर्ताओं के लिए।',
    },
  ],
  sentenceBuilder: HELP_CONTENT_EN.sentenceBuilder,
  storyTime: HELP_CONTENT_EN.storyTime,
  dashboard: HELP_CONTENT_EN.dashboard,
};

const HelpModal = ({ visible, onClose, context = 'hub', sections = null }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();

  const handleClose = () => {
    speak(t('closingHelp'));
    onClose();
  };

  // Use context-specific content or provided sections based on language
  const { language } = useTheme();
  const HELP_CONTENT = language === 'hi' ? HELP_CONTENT_HI : HELP_CONTENT_EN;
  const helpContent = sections || HELP_CONTENT[context] || HELP_CONTENT.hub;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.65)', // Darker, premium overlay
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'rgba(255, 255, 255, 0.96)', // Simulated frosted glass
      borderRadius: 36 * currentSpacing.scale,
      padding: 32 * currentSpacing.scale,
      width: '90%',
      maxHeight: '82%',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.2,
      shadowRadius: 36,
      elevation: 12,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24 * currentSpacing.scale,
      paddingBottom: 16 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    },
    modalTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: '900',
      color: '#1E293B',
      letterSpacing: -0.5,
    },
    closeButton: {
      backgroundColor: 'rgba(241, 245, 249, 0.8)',
      borderRadius: 20 * currentSpacing.scale,
      width: 40 * currentSpacing.scale,
      height: 40 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '800',
      color: '#64748B',
    },
    helpItem: {
      marginBottom: 28 * currentSpacing.scale,
    },
    helpItemTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12 * currentSpacing.scale,
    },
    helpIcon: {
      fontSize: 26 * currentTextSize.scale,
      marginRight: 12 * currentSpacing.scale,
    },
    helpTitleText: {
      fontSize: 19 * currentTextSize.scale,
      fontWeight: '800',
      color: '#334155',
      letterSpacing: -0.3,
      flex: 1,
    },
    helpDescription: {
      fontSize: 16 * currentTextSize.scale,
      color: '#475569',
      lineHeight: 24 * currentTextSize.scale,
      fontWeight: '500',
      marginLeft: 38 * currentSpacing.scale,
    },
    impactSection: {
      marginTop: 16 * currentSpacing.scale,
      padding: 18 * currentSpacing.scale,
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      borderRadius: 16 * currentSpacing.scale,
      borderLeftWidth: 4,
      borderLeftColor: '#6366F1',
      marginLeft: 38 * currentSpacing.scale,
    },
    impactTitle: {
      fontSize: 15 * currentTextSize.scale,
      fontWeight: '800',
      color: '#4F46E5',
      marginBottom: 8 * currentSpacing.scale,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    impactText: {
      fontSize: 15 * currentTextSize.scale,
      color: '#334155',
      lineHeight: 22 * currentTextSize.scale,
      fontWeight: '500',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('helpAndInformation')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {helpContent.map((section) => (
              <View key={section.id} style={styles.helpItem}>
                <View style={styles.helpItemTitle}>
                  {section.icon && <Text style={styles.helpIcon}>{section.icon}</Text>}
                  <Text style={styles.helpTitleText}>{section.name}</Text>
                </View>
                <Text style={styles.helpDescription}>{section.description}</Text>
                {section.impact && (
                  <View style={styles.impactSection}>
                    <Text style={styles.impactTitle}>{t('impactAndBenefits')}</Text>
                    <Text style={styles.impactText}>{section.impact}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HelpModal;

