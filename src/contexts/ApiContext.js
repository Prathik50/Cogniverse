import React, { createContext, useContext, useState } from 'react';
import API_KEYS from '../config/apiKeys';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const getApiKey = (keyType) => {
    switch (keyType) {
      case 'gemini':
        return API_KEYS.GEMINI_API_KEY;
      case 'imagen':
        return API_KEYS.IMAGEN_API_KEY;
      default:
        return '';
    }
  };

  const hasApiKey = (keyType) => {
    const key = getApiKey(keyType);
    return !!(key && key !== 'YOUR_GEMINI_API_KEY_HERE' && key !== 'YOUR_IMAGEN_API_KEY_HERE' && key.trim());
  };

  const value = {
    getApiKey,
    hasApiKey,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
