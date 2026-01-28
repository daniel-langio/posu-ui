import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthState {
  username: string | null;
  apiKey: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (username: string, apiKey: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    username: null,
    apiKey: null,
    isLoading: true,
  });

  useEffect(() => {
    async function loadStorageData() {
      try {
        let username = null;
        let apiKey = null;

        if (Platform.OS !== 'web' || (typeof window !== 'undefined' && window.localStorage)) {
          username = await SecureStore.getItemAsync('username');
          apiKey = await SecureStore.getItemAsync('apiKey');
        }

        setState({
          username,
          apiKey,
          isLoading: false,
        });
      } catch (e) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }

    loadStorageData();
  }, []);

  const signIn = async (username: string, apiKey: string) => {
    await SecureStore.setItemAsync('username', username);
    await SecureStore.setItemAsync('apiKey', apiKey);
    setState({
      username,
      apiKey,
      isLoading: false,
    });
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('username');
    await SecureStore.deleteItemAsync('apiKey');
    setState({
      username: null,
      apiKey: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
