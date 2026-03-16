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
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';

const getConditions = (t) => [
  t('conditions.asd'),
  t('conditions.downSyndrome'),
  t('conditions.adhd'),
  t('conditions.dyslexia'),
  t('conditions.cerebralPalsy'),
  t('conditions.intellectualDisability'),
  t('conditions.speechDelay'),
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
      backgroundColor: currentTheme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 24 * currentSpacing.scale,
    },
    title: {
      fontSize: 32 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      textAlign: 'center',
      marginBottom: 8 * currentSpacing.scale,
    },
    subtitle: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32 * currentSpacing.scale,
    },
    input: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12 * currentSpacing.scale,
      padding: 16 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      marginBottom: 16 * currentSpacing.scale,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      marginBottom: 16 * currentSpacing.scale,
    },
    passwordInput: {
      flex: 1,
      padding: 16 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
    },
    passwordToggle: {
      padding: 16 * currentSpacing.scale,
      color: currentTheme.colors.primary,
    },
    dropdownContainer: {
      marginBottom: 16 * currentSpacing.scale,
    },
    dropdownButton: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12 * currentSpacing.scale,
      padding: 16 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
    },
    dropdownPlaceholder: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
    dropdownList: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      marginTop: 4 * currentSpacing.scale,
      maxHeight: 200,
    },
    dropdownItem: {
      padding: 16 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    dropdownItemText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
    },
    primaryButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 12 * currentSpacing.scale,
      padding: 18 * currentSpacing.scale,
      alignItems: 'center',
      marginTop: 8 * currentSpacing.scale,
    },
    primaryButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 18 * currentTextSize.scale,
      fontWeight: 'bold',
    },
    toggleButton: {
      marginTop: 24 * currentSpacing.scale,
      alignItems: 'center',
    },
    toggleText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('appName')}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? t('welcomeBack') : t('createAccount')}
          </Text>

          {isLogin ? (
            // Login Form
            <>
              <TextInput
                style={styles.input}
                placeholder={t('email')}
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('password')}
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.passwordToggle}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>{t('login')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Signup Form
            <>
              <TextInput
                style={styles.input}
                placeholder={t('fullName')}
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={signupName}
                onChangeText={setSignupName}
              />
              <TextInput
                style={styles.input}
                placeholder={t('age')}
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={signupAge}
                onChangeText={setSignupAge}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder={t('email')}
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={signupEmail}
                onChangeText={setSignupEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('password')}
                  placeholderTextColor={currentTheme.colors.textSecondary}
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
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={signupConfirmPassword}
                  onChangeText={setSignupConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowConditionDropdown(!showConditionDropdown)}
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
              <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
                <Text style={styles.primaryButtonText}>{t('signup')}</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isLogin
                ? t('noAccount')
                : t('hasAccount')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

