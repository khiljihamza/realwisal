import axios, { AxiosResponse } from 'axios';
import { SearchFilters, SearchSuggestion, Product } from '@/types';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Search API functions
export const searchProducts = async (filters: SearchFilters & { query: string }) => {
  try {
    const response = await api.get('/products/search', { params: filters });
    return response;
  } catch (error) {
    console.error('Search products error:', error);
    throw error;
  }
};

export const getSearchSuggestions = async (query: string): Promise<{ data: SearchSuggestion[] }> => {
  try {
    const response = await api.get('/search/suggestions', { params: { q: query } });
    return response;
  } catch (error) {
    console.error('Get suggestions error:', error);
    throw error;
  }
};

// Fuzzy search implementation for client-side fallback
export const fuzzySearch = (query: string, items: Product[], threshold = 0.6): Product[] => {
  const normalizeString = (str: string) => 
    str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  const normalizedQuery = normalizeString(query);
  
  return items
    .map(item => ({
      ...item,
      similarity: Math.max(
        calculateSimilarity(normalizedQuery, normalizeString(item.name)),
        calculateSimilarity(normalizedQuery, normalizeString(item.description)),
        calculateSimilarity(normalizedQuery, normalizeString(item.category))
      )
    }))
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
};

// Image optimization utility
export const optimizeImageUrl = (url: string, width?: number, quality = 80): string => {
  if (!url) return '';
  
  // If using Cloudinary, add transformation parameters
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = [];
      if (width) transformations.push(`w_${width}`);
      transformations.push(`q_${quality}`, 'f_auto');
      return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
    }
  }
  
  return url;
};

// Cache utilities
export const cacheManager = {
  set: (key: string, data: any, ttl = 300000) => { // 5 minutes default TTL
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  get: (key: string) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  },

  clear: (pattern?: string) => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        if (!pattern || key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      }
    });
  }
};

export default api;
