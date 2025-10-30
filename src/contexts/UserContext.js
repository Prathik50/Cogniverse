import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Create a wrapper component that uses TTS
const UserProviderInner = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const allUsers = await AsyncStorage.getItem('allUsers');
      if (allUsers) {
        const users = JSON.parse(allUsers);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          setUserData(user);
          setIsAuthenticated(true);
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          return { success: true };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      }
      return { success: false, error: 'No account found' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userInfo) => {
    try {
      const allUsers = await AsyncStorage.getItem('allUsers') || '[]';
      const users = JSON.parse(allUsers);
      
      // Check if email already exists
      if (users.find(u => u.email === userInfo.email)) {
        return { success: false, error: 'Email already registered' };
      }

      const newUser = {
        id: Date.now().toString(),
        ...userInfo,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem('allUsers', JSON.stringify(users));
      
      setUserData(newUser);
      setIsAuthenticated(true);
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
  };

  const updateUserData = async (updatedData) => {
    try {
      const updatedUser = { ...userData, ...updatedData };
      setUserData(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Update in allUsers array as well
      const allUsers = await AsyncStorage.getItem('allUsers');
      if (allUsers) {
        const users = JSON.parse(allUsers);
        const updatedUsers = users.map(u => u.id === userData.id ? updatedUser : u);
        await AsyncStorage.setItem('allUsers', JSON.stringify(updatedUsers));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: 'Update failed' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserData(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      isAuthenticated,
      userData,
      isLoading,
      login,
      signup,
      updateUserData,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserProvider = UserProviderInner;

export default UserContext;

