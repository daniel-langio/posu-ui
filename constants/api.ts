import { Platform } from 'react-native';

const BASE_URL = 'https://vendredi-soir-posu.onrender.com';

// CORS Proxy for Web development to avoid "Failed to fetch" due to backend CORS policy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export const getApiUrl = (path: string, useProxy: boolean = false) => {
  const url = `${BASE_URL}${path}`;

  if (useProxy && Platform.OS === 'web') {
    return `${CORS_PROXY}${encodeURIComponent(url)}`;
  }

  return url;
};

export const API_BASE_URL = BASE_URL;
