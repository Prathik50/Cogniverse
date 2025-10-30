import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';

const StoryTimeScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const sampleStories = [
    {
      id: 'birthday-party',
      title: 'Going to a Birthday Party',
      prompt: 'We are going to Prathik\'s birthday party',
      steps: [
        {
          image: '🎂',
          text: 'We get ready to go to the party. We put on nice clothes and brush our teeth.',
          audio: 'We get ready to go to the party. We put on nice clothes and brush our teeth.'
        },
        {
          image: '🚗',
          text: 'We drive to Prathik\'s house. The car ride is fun and we sing songs.',
          audio: 'We drive to Prathik\'s house. The car ride is fun and we sing songs.'
        },
        {
          image: '🏠',
          text: 'We arrive at Prathik\'s house. We ring the doorbell and wait for someone to answer.',
          audio: 'We arrive at Prathik\'s house. We ring the doorbell and wait for someone to answer.'
        },
        {
          image: '👋',
          text: 'We say hello to Prathik and his family. We give him a birthday present.',
          audio: 'We say hello to Prathik and his family. We give him a birthday present.'
        },
        {
          image: '🎮',
          text: 'We play games with other children. We have fun and make new friends.',
          audio: 'We play games with other children. We have fun and make new friends.'
        },
        {
          image: '🎁',
          text: 'We watch Prathik open his presents. We clap and cheer for him.',
          audio: 'We watch Prathik open his presents. We clap and cheer for him.'
        },
        {
          image: '🍰',
          text: 'We eat birthday cake and ice cream. The cake is delicious!',
          audio: 'We eat birthday cake and ice cream. The cake is delicious!'
        },
        {
          image: '👋',
          text: 'We say thank you and goodbye. We had a wonderful time at the party!',
          audio: 'We say thank you and goodbye. We had a wonderful time at the party!'
        }
      ]
    },
    {
      id: 'doctor-visit',
      title: 'Going to the Doctor',
      prompt: 'We are going to visit the doctor',
      steps: [
        {
          image: '🏥',
          text: 'We arrive at the doctor\'s office. We check in at the front desk.',
          audio: 'We arrive at the doctor\'s office. We check in at the front desk.'
        },
        {
          image: '⏰',
          text: 'We wait in the waiting room. We can read books or play quietly.',
          audio: 'We wait in the waiting room. We can read books or play quietly.'
        },
        {
          image: '👩‍⚕️',
          text: 'The nurse calls our name. We follow her to the examination room.',
          audio: 'The nurse calls our name. We follow her to the examination room.'
        },
        {
          image: '🌡️',
          text: 'The doctor checks our temperature and listens to our heart.',
          audio: 'The doctor checks our temperature and listens to our heart.'
        },
        {
          image: '💉',
          text: 'We might need a shot. It will hurt for just a moment, but it helps us stay healthy.',
          audio: 'We might need a shot. It will hurt for just a moment, but it helps us stay healthy.'
        },
        {
          image: '🍭',
          text: 'The doctor gives us a sticker or lollipop for being brave. We did great!',
          audio: 'The doctor gives us a sticker or lollipop for being brave. We did great!'
        }
      ]
    },
    {
      id: 'grocery-store',
      title: 'Going to the Grocery Store',
      prompt: 'We are going shopping at the grocery store',
      steps: [
        {
          image: '🛒',
          text: 'We get a shopping cart and make a list of things we need to buy.',
          audio: 'We get a shopping cart and make a list of things we need to buy.'
        },
        {
          image: '🥛',
          text: 'We walk through the aisles and find the milk and bread.',
          audio: 'We walk through the aisles and find the milk and bread.'
        },
        {
          image: '🍎',
          text: 'We pick out fresh fruits and vegetables. We choose the best ones.',
          audio: 'We pick out fresh fruits and vegetables. We choose the best ones.'
        },
        {
          image: '💰',
          text: 'We go to the checkout counter and pay for our groceries.',
          audio: 'We go to the checkout counter and pay for our groceries.'
        },
        {
          image: '🏠',
          text: 'We carry our bags to the car and drive home. Shopping is complete!',
          audio: 'We carry our bags to the car and drive home. Shopping is complete!'
        }
      ]
    }
  ];

  const handleStorySelect = (story) => {
    setCurrentStory(story);
    setCurrentStep(0);
    speak(`Starting story: ${story.title}`);
  };

  const handleCustomStory = async () => {
    if (!customPrompt.trim()) {
      Alert.alert('Error', 'Please enter a story prompt');
      return;
    }

    setIsLoading(true);
    // In a real implementation, this would call the Gemini API
    // For now, we'll create a simple generated story
    setTimeout(() => {
      const generatedStory = {
        id: 'custom',
        title: 'Custom Story',
        prompt: customPrompt,
        steps: [
          {
            image: '📝',
            text: `We are preparing for: ${customPrompt}`,
            audio: `We are preparing for: ${customPrompt}`
          },
          {
            image: '🚶',
            text: 'We walk to our destination. We stay calm and focused.',
            audio: 'We walk to our destination. We stay calm and focused.'
          },
          {
            image: '👀',
            text: 'We observe what is happening around us. We pay attention to details.',
            audio: 'We observe what is happening around us. We pay attention to details.'
          },
          {
            image: '😊',
            text: 'We participate and have a good time. We remember to be polite.',
            audio: 'We participate and have a good time. We remember to be polite.'
          },
          {
            image: '🏠',
            text: 'We finish our activity and return home. We did a great job!',
            audio: 'We finish our activity and return home. We did a great job!'
          }
        ]
      };
      setCurrentStory(generatedStory);
      setCurrentStep(0);
      setIsLoading(false);
      speak(`Starting custom story: ${customPrompt}`);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStory && currentStep < currentStory.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      speak('The story is complete! Great job!');
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const playCurrentStep = () => {
    if (currentStory) {
      speak(currentStory.steps[currentStep].audio);
    }
  };

  const resetStory = () => {
    setCurrentStory(null);
    setCurrentStep(0);
    setCustomPrompt('');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      padding: 16 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    backButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16 * currentSpacing.scale,
    },
    backIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    headerTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    instructionText: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.text,
      textAlign: 'center',
      marginBottom: 20 * currentSpacing.scale,
      fontWeight: '500',
    },
    customPromptContainer: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    customPromptTitle: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 12 * currentSpacing.scale,
    },
    textInput: {
      borderColor: currentTheme.colors.border,
      borderWidth: 1,
      borderRadius: 12 * currentSpacing.scale,
      paddingHorizontal: 15 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      backgroundColor: currentTheme.colors.background,
      color: currentTheme.colors.text,
      marginBottom: 12 * currentSpacing.scale,
    },
    generateButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 24 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 25 * currentSpacing.scale,
      alignItems: 'center',
    },
    generateButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
    },
    storyCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginBottom: 16 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    storyTitle: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 8 * currentSpacing.scale,
    },
    storyPrompt: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      fontStyle: 'italic',
    },
    storyViewer: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    stepImage: {
      fontSize: 60 * currentTextSize.scale,
      textAlign: 'center',
      marginBottom: 16 * currentSpacing.scale,
    },
    stepText: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.text,
      textAlign: 'center',
      lineHeight: 26 * currentTextSize.scale,
      marginBottom: 20 * currentSpacing.scale,
    },
    stepCounter: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16 * currentSpacing.scale,
    },
    controlButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20 * currentSpacing.scale,
    },
    controlButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 20 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 25 * currentSpacing.scale,
      flex: 0.3,
      alignItems: 'center',
    },
    controlButtonDisabled: {
      backgroundColor: currentTheme.colors.textSecondary,
    },
    controlButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
    },
    playButton: {
      backgroundColor: '#4CAF50',
      flex: 0.4,
    },
    resetButton: {
      backgroundColor: '#F44336',
      alignSelf: 'center',
      paddingHorizontal: 24 * currentSpacing.scale,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Story Time</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructionText}>
          Choose a story or create your own to help understand new situations
        </Text>

        {!currentStory ? (
          <>
            <View style={styles.customPromptContainer}>
              <Text style={styles.customPromptTitle}>Create Your Own Story</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Describe the situation (e.g., 'We are going to the dentist')"
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={customPrompt}
                onChangeText={setCustomPrompt}
                multiline
              />
              <TouchableOpacity 
                style={styles.generateButton} 
                onPress={handleCustomStory}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={currentTheme.colors.surface} />
                ) : (
                  <Text style={styles.generateButtonText}>Generate Story</Text>
                )}
              </TouchableOpacity>
            </View>

            {sampleStories.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyCard}
                onPress={() => handleStorySelect(story)}
              >
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyPrompt}>"{story.prompt}"</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.storyViewer}>
            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {currentStory.steps.length}
            </Text>
            <Text style={styles.stepImage}>
              {currentStory.steps[currentStep].image}
            </Text>
            <Text style={styles.stepText}>
              {currentStory.steps[currentStep].text}
            </Text>
            
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={[styles.controlButton, currentStep === 0 && styles.controlButtonDisabled]}
                onPress={previousStep}
                disabled={currentStep === 0}
              >
                <Text style={styles.controlButtonText}>← Previous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, styles.playButton]}
                onPress={playCurrentStep}
              >
                <Text style={styles.controlButtonText}>🔊 Play</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, currentStep === currentStory.steps.length - 1 && styles.controlButtonDisabled]}
                onPress={nextStep}
                disabled={currentStep === currentStory.steps.length - 1}
              >
                <Text style={styles.controlButtonText}>Next →</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={resetStory}>
              <Text style={styles.controlButtonText}>Choose Different Story</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoryTimeScreen;
