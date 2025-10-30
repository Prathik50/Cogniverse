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
import { useTTS } from '../contexts/TTSContext';

// Help content for different screens
const HELP_CONTENT = {
  hub: [
    {
      id: 'welcome',
      name: 'Welcome to CogniVerse',
      description: 'CogniVerse is a comprehensive learning companion designed to support children with special needs through personalized, interactive experiences. Every feature is built with accessibility and visual learning in mind. Your main hub gives you access to four key modules that work together to build communication, social, and cognitive skills. Use the profile icon (top-left) to view progress, or the help icon (bottom-right) for context-specific guidance. The settings icon (top-right) lets you customize the app experience to fit your needs.',
    },
    {
      id: 'autism-communication',
      name: 'Autism & Communication',
      description: 'This comprehensive communication module contains four powerful features: "My Voice" provides unlimited AI-generated vocabulary for communication boards - tap any word or symbol to speak. "Learn to Build" teaches sentence construction progressively, from single words to complex sentences with visual guidance. "Feelings Finder" develops emotional vocabulary by exploring 8 core emotions with stories and contexts. "Story Time" creates personalized social stories to prepare for real-world situations. Each feature opens by tapping its card. This module is crucial for non-verbal communication, language development, emotional intelligence, and social understanding, directly addressing core challenges in autism communication.',
      icon: '🗣️',
      impact: 'Develops expressive language, reduces frustration from communication barriers, builds confidence in social interactions, and improves emotional regulation. Regular use leads to measurable improvement in vocabulary, sentence complexity, and social engagement.',
    },
    {
      id: 'learning-basics',
      name: 'Learning Basics',
      description: 'Coming soon - This foundational learning module will teach essential life skills through interactive visual lessons. It will include: Number recognition and counting activities, Letter recognition and phonics games, Basic math operations with visual aids, Daily life skills like telling time, recognizing colors and shapes, and understanding money. Each lesson adapts to the child\'s pace and provides positive reinforcement. The gamified approach makes learning enjoyable while building core academic and practical skills.',
      icon: '📚',
      impact: 'Will build strong academic foundations, improve school readiness, teach practical daily living skills, and boost confidence in learning abilities.',
    },
    {
      id: 'social-skills',
      name: 'Social Skills',
      description: 'Coming soon - This interactive module will focus on developing crucial social competencies through visual learning and practice. It will include: Recognizing facial expressions and body language, Understanding social cues and appropriate responses, Practicing conversation skills with visual prompts, Learning personal space and boundaries, Managing transitions and changes in routine, Role-playing common social scenarios. Each activity uses visual supports and provides immediate feedback to reinforce positive social behaviors.',
      icon: '👥',
      impact: 'Will significantly improve peer interactions, reduce social anxiety, enhance emotional intelligence, and build lasting friendships through better social understanding.',
    },
    {
      id: 'games',
      name: 'Educational Games',
      description: 'Coming soon - A fun collection of educational games that reinforce learning through play. Games will include: Memory matching games with symbols and words, Word association games to build vocabulary, Pattern recognition puzzles, Interactive stories with choices, Reward-based challenges that track progress. All games incorporate learned concepts from other modules and adapt difficulty automatically. Points and achievements provide motivation while data tracks improvement.',
      icon: '🎮',
      impact: 'Will maintain motivation and engagement, reinforce learned skills through repetition, provide stress-free practice opportunities, and make learning feel like play rather than work.',
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
      description: 'This suite contains four specialized tools working together to build comprehensive communication skills. Each tool addresses different aspects of communication: My Voice for expressive communication, Learn to Build for language structure, Feelings Finder for emotional expression, and Story Time for social understanding. Use them individually or in combination to create a holistic communication development program.',
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
      id: 'feelings-finder',
      name: 'Feelings Finder - Emotional Literacy',
      description: 'An interactive emotional learning tool featuring 8 core emotions. Features include: Visual emotion cards with facial expressions (Happy, Sad, Angry, Surprised, Confused, Scared, Excited, Proud), Color-coded emotions for easy visual identification, Tap any emotion to read detailed description, Context stories explain when someone feels this way, "Speak" button vocalizes emotional states, Relatable scenarios help connect emotions to real situations. This tool develops emotional vocabulary and understanding, essential for self-regulation and social skills. Users learn to identify their own feelings and recognize emotions in others.',
      icon: '😊',
      impact: 'Immediate impact: Builds emotional vocabulary, helps identify current feelings, validates emotional experiences. Long-term benefits: Improves emotional regulation, enhances empathy and social understanding, reduces emotional outbursts, supports mental health through self-awareness.',
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
      description: 'For best results, use features in combination: Start with Feelings Finder to identify current emotional state, Use My Voice to communicate about feelings, Build sentences with Learn to Build to express complex thoughts, Read Story Time stories to prepare for upcoming social situations, Practice daily with different features to build consistency. This integrated approach creates comprehensive communication development addressing all aspects of expressive and receptive language plus social-emotional skills.',
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
  feelingsFinder: [
    {
      id: 'overview',
      name: 'Feelings Finder Overview',
      description: 'Feelings Finder builds emotional literacy - the foundation of emotional intelligence and social skills. This tool introduces 8 core emotions through visual, interactive exploration. Users learn to identify, name, and understand emotions through relatable stories and contexts. For users with autism who often struggle with recognizing or expressing emotions, this tool provides concrete ways to understand abstract feeling states. Each emotion is color-coded for visual memory and paired with scenarios that help users recognize when they or others might experience that feeling.',
    },
    {
      id: 'exploring-feelings',
      name: 'Exploring the 8 Core Emotions',
      description: 'Happy (Green): Joy, contentment, pleasure. Example: When getting a hug, eating ice cream, or playing with friends. Sad (Blue): Disappointment, loss, hurt feelings. Example: When missing someone, when something breaks, when feeling left out. Angry (Red): Frustration, annoyance, being upset. Example: When someone takes your toy, when things don\'t go your way, when feeling misunderstood. Surprised (Orange): Shock, amazement, sudden realization. Example: When seeing something unexpected, getting an unplanned gift, discovering something new. Confused (Purple): Uncertainty, not understanding. Example: When instructions are unclear, when something doesn\'t make sense. Scared (Yellow): Fear, anxiety, worry. Example: When it\'s dark, loud noises, new situations. Excited (Pink): High energy, anticipation, enthusiasm. Example: Before a birthday party, going to a favorite place. Proud (Gold): Accomplishment, satisfaction. Example: After finishing something hard, when praised. Tap any emotion to read full description and context story.',
    },
    {
      id: 'using-feelings',
      name: 'Using Feelings in Daily Life',
      description: 'Practical application: Tap "Speak" to hear the emotion vocalized, helping connect words to feelings. Use the communication board to express current feelings using emotion words. Practice identifying the emotion being felt right now. Discuss emotions with caregivers using the provided scenarios. Relate story examples to personal experiences. The app teaches that all emotions are valid - there are no "wrong" feelings. Understanding that emotions are temporary helps users process feelings without becoming overwhelmed. This knowledge supports emotional regulation strategies.',
    },
    {
      id: 'building-awareness',
      name: 'Building Emotional Awareness and Intelligence',
      description: 'Self-awareness development: Identify own emotional states accurately, Recognize physical sensations associated with emotions (butterflies when scared, warm when happy), Develop vocabulary to communicate feelings, Understand that emotions change and pass. Social awareness development: Recognize emotions in others through facial expressions, Understand that others have feelings different from your own, Develop empathy by imagining how others might feel, Learn appropriate responses to others\' emotions. Self-regulation support: Accept feelings without judgment, Learn that feelings don\'t have to dictate actions, Develop coping strategies for difficult emotions, Gain confidence in emotional management.',
    },
    {
      id: 'impact',
      name: 'Impact and Benefits',
      description: 'Immediate benefits: Reduces frustration from inability to express emotions, provides vocabulary for emotional communication, helps identify and name current feelings, validates emotional experiences, reduces confusion about internal states. Long-term development: Improves emotional regulation and reduces meltdowns, enhances social skills and peer relationships, builds empathy and emotional connection with others, supports mental health through self-awareness, increases ability to handle transitions and changes, improves communication about internal states with caregivers. For users with autism, this tool addresses a core deficit area (emotion recognition and expression) that significantly impacts social functioning and quality of life. Regular use leads to measurable improvements in emotional intelligence over time.',
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

const HelpModal = ({ visible, onClose, context = 'hub', sections = null }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();

  const handleClose = () => {
    speak('Closing help');
    onClose();
  };

  // Use context-specific content or provided sections
  const helpContent = sections || HELP_CONTENT[context] || HELP_CONTENT.hub;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      width: '90%',
      maxHeight: '80%',
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20 * currentSpacing.scale,
    },
    modalTitle: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
    },
    closeButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 20 * currentSpacing.scale,
      width: 40 * currentSpacing.scale,
      height: 40 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      fontSize: 20 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    helpItem: {
      marginBottom: 20 * currentSpacing.scale,
      paddingBottom: 20 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    helpItemTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8 * currentSpacing.scale,
    },
    helpIcon: {
      fontSize: 24 * currentTextSize.scale,
      marginRight: 8 * currentSpacing.scale,
    },
    helpTitleText: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
    },
    helpDescription: {
      fontSize: 15 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 22 * currentTextSize.scale,
      marginLeft: 32 * currentSpacing.scale,
    },
    impactSection: {
      marginTop: 12 * currentSpacing.scale,
      padding: 12 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.background,
      borderRadius: 8 * currentSpacing.scale,
      borderLeftWidth: 3,
      borderLeftColor: currentTheme.colors.primary,
    },
    impactTitle: {
      fontSize: 16 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.primary,
      marginBottom: 8 * currentSpacing.scale,
    },
    impactText: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 20 * currentTextSize.scale,
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
            <Text style={styles.modalTitle}>Help & Information</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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
                    <Text style={styles.impactTitle}>Impact & Benefits:</Text>
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

