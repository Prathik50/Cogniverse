import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';

const { width } = Dimensions.get('window');

const getConditions = (t) => [
  t('conditions.asd'),
  t('conditions.downSyndrome'),
  t('conditions.dyslexia'),
  t('conditions.intellectualDisability'),
  t('conditions.other'),
];

const LoginScreen = ({ onLoginSuccess }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const { login, signup } = useUser();
  const CONDITIONS = getConditions(t);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      speak(t('fillAllFields'));
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      onLoginSuccess();
    } else {
      Alert.alert(t('loginFailed'), result.error);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupAge || !signupEmail || !signupPassword || !selectedCondition) {
      speak(t('fillAllFields'));
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      speak(t('passwordsNoMatch'));
      Alert.alert(t('error'), t('passwordsNoMatch'));
      return;
    }

    if (signupPassword.length < 6) {
      speak(t('passwordTooShort'));
      Alert.alert(t('error'), t('passwordTooShort'));
      return;
    }

    const result = await signup({
      name: signupName,
      age: parseInt(signupAge),
      email: signupEmail,
      password: signupPassword,
      condition: selectedCondition,
    });

    if (result.success) {
      onLoginSuccess();
    } else {
      Alert.alert(t('signupFailed'), result.error);
    }
  };

  const toggleMode = () => {
    speak(isLogin ? t('switchingToSignup') : t('switchingToLogin'));
    setIsLogin(!isLogin);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F172A', // Fallback for the SVG
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24 * currentSpacing.scale,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 40 * currentSpacing.scale,
    },
    title: {
      fontSize: 42 * currentTextSize.scale,
      fontWeight: '900',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8 * currentSpacing.scale,
      letterSpacing: -1,
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 10,
    },
    subtitle: {
      fontSize: 18 * currentTextSize.scale,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      fontWeight: '500',
      letterSpacing: 0.5,
    },
    glassCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 24 * currentSpacing.scale,
      padding: 32 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.4,
      shadowRadius: 30,
      elevation: 10,
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 16 * currentSpacing.scale,
      padding: 18 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      color: '#FFFFFF',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      marginBottom: 16 * currentSpacing.scale,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 16 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      marginBottom: 16 * currentSpacing.scale,
    },
    passwordInput: {
      flex: 1,
      padding: 18 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      color: '#FFFFFF',
    },
    passwordToggle: {
      padding: 18 * currentSpacing.scale,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    dropdownContainer: {
      marginBottom: 16 * currentSpacing.scale,
      position: 'relative',
    },
    dropdownButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 16 * currentSpacing.scale,
      padding: 18 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownText: {
      fontSize: 16 * currentTextSize.scale,
      color: '#FFFFFF',
    },
    dropdownPlaceholder: {
      fontSize: 16 * currentTextSize.scale,
      color: 'rgba(255, 255, 255, 0.5)',
    },
    dropdownList: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)', // Solid dark panel for dropdown
      borderRadius: 16 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      marginTop: 8 * currentSpacing.scale,
      maxHeight: 200,
      overflow: 'hidden',
    },
    dropdownItem: {
      padding: 18 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    dropdownItemText: {
      fontSize: 16 * currentTextSize.scale,
      color: '#FFFFFF',
    },
    primaryButton: {
      backgroundColor: currentTheme.colors.primaryLight || '#818CF8',
      borderRadius: 16 * currentSpacing.scale,
      padding: 18 * currentSpacing.scale,
      alignItems: 'center',
      marginTop: 24 * currentSpacing.scale,
      shadowColor: currentTheme.colors.primaryLight || '#818CF8',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    toggleButton: {
      marginTop: 32 * currentSpacing.scale,
      alignItems: 'center',
      padding: 10 * currentSpacing.scale,
    },
    toggleText: {
      fontSize: 15 * currentTextSize.scale,
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '500',
    },
    toggleHighlight: {
      color: currentTheme.colors.primaryLight || '#818CF8',
      fontWeight: '700',
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0F172A" />
              <Stop offset="50%" stopColor="#1E1B4B" />
              <Stop offset="100%" stopColor="#312E81" />
            </LinearGradient>
            <LinearGradient id="orb1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#4338CA" stopOpacity="0.0" />
            </LinearGradient>
            <LinearGradient id="orb2" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bg)" />
          <Circle cx="10%" cy="10%" r={width * 0.7} fill="url(#orb1)" />
          <Circle cx="90%" cy="90%" r={width * 0.8} fill="url(#orb2)" />
        </Svg>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{t('appName')}</Text>
            <Text style={styles.subtitle}>
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </Text>
          </View>

          <View style={styles.glassCard}>
            {isLogin ? (
              // Login Form
              <>
                <TextInput
                  style={styles.input}
                  placeholder={t('email')}
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t('password')}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.passwordToggle}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.8}>
                  <Text style={styles.primaryButtonText}>{t('login')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Signup Form
              <>
                <TextInput
                  style={styles.input}
                  placeholder={t('fullName')}
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={signupName}
                  onChangeText={setSignupName}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('age')}
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={signupAge}
                  onChangeText={setSignupAge}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('email')}
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t('password')}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.passwordToggle}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t('confirmPassword')}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={signupConfirmPassword}
                    onChangeText={setSignupConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowConditionDropdown(!showConditionDropdown)}
                    activeOpacity={0.8}
                  >
                    <Text style={selectedCondition ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {selectedCondition || t('selectCondition')}
                    </Text>
                    <Text style={styles.dropdownText}>{showConditionDropdown ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {showConditionDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                        {CONDITIONS.map((condition, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedCondition(condition);
                              setShowConditionDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{condition}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} activeOpacity={0.8}>
                  <Text style={styles.primaryButtonText}>{t('signup')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isLogin ? (
                <Text>{t('noAccount')} <Text style={styles.toggleHighlight}>{t('signup')}</Text></Text>
              ) : (
                <Text>{t('hasAccount')} <Text style={styles.toggleHighlight}>{t('login')}</Text></Text>
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
