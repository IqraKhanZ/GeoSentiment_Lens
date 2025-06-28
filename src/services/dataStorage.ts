import { SentimentData } from '../types';

const STORAGE_KEY = 'geosentiment_data';
const USER_ID_KEY = 'geosentiment_user_id';
const ONBOARDING_KEY = 'geosentiment_onboarding_complete';
const STORAGE_VERSION = '1.0';

// Generate unique user ID for private data storage
function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get or create unique user ID
function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
    console.log('Generated new user ID:', userId);
  }
  return userId;
}

// Get user-specific storage key
function getUserStorageKey(): string {
  const userId = getUserId();
  return `${STORAGE_KEY}_${userId}`;
}

export const dataStorageService = {
  async saveData(data: SentimentData[]): Promise<void> {
    try {
      const userStorageKey = getUserStorageKey();
      const dataToStore = {
        version: STORAGE_VERSION,
        timestamp: new Date().toISOString(),
        userId: getUserId(),
        data: data
      };
      
      // Use user-specific localStorage key for complete privacy
      localStorage.setItem(userStorageKey, JSON.stringify(dataToStore));
      
      console.log('Data saved privately for user:', getUserId(), 'Items:', data.length);
    } catch (error) {
      console.error('Failed to save private data:', error);
      throw new Error('Failed to save data to private storage');
    }
  },

  async loadData(): Promise<SentimentData[] | null> {
    try {
      const userStorageKey = getUserStorageKey();
      const stored = localStorage.getItem(userStorageKey);
      if (!stored) {
        console.log('No private data found for user:', getUserId());
        return null;
      }

      const parsed = JSON.parse(stored);
      
      // Validate data structure and user ownership
      if (!parsed.data || !Array.isArray(parsed.data) || parsed.userId !== getUserId()) {
        console.warn('Invalid or unauthorized data structure for user:', getUserId());
        return null;
      }

      console.log('Private data loaded for user:', getUserId(), 'Items:', parsed.data.length);
      return parsed.data;
    } catch (error) {
      console.error('Failed to load private data:', error);
      return null;
    }
  },

  async clearData(): Promise<void> {
    try {
      const userStorageKey = getUserStorageKey();
      localStorage.removeItem(userStorageKey);
      console.log('Private data cleared for user:', getUserId());
    } catch (error) {
      console.error('Failed to clear private data:', error);
      throw new Error('Failed to clear data from private storage');
    }
  },

  async getDataInfo(): Promise<{ count: number; lastUpdated: string; userId: string } | null> {
    try {
      const userStorageKey = getUserStorageKey();
      const stored = localStorage.getItem(userStorageKey);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      return {
        count: parsed.data?.length || 0,
        lastUpdated: parsed.timestamp || 'Unknown',
        userId: getUserId()
      };
    } catch (error) {
      console.error('Failed to get private data info:', error);
      return null;
    }
  },

  // Onboarding management
  isFirstTimeUser(): boolean {
    return !localStorage.getItem(ONBOARDING_KEY);
  },

  markOnboardingComplete(): void {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    console.log('Onboarding completed for user:', getUserId());
  },

  resetOnboarding(): void {
    localStorage.removeItem(ONBOARDING_KEY);
    console.log('Onboarding reset for user:', getUserId());
  },

  // User management
  getCurrentUserId(): string {
    return getUserId();
  },

  // Privacy utilities
  clearAllUserData(): void {
    const userId = getUserId();
    const userStorageKey = getUserStorageKey();
    
    // Clear user's private data
    localStorage.removeItem(userStorageKey);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    
    console.log('All private data cleared for user:', userId);
  },

  // Migration utility (if needed)
  migrateOldData(): void {
    try {
      // Check if old non-private data exists
      const oldData = localStorage.getItem(STORAGE_KEY);
      if (oldData && !localStorage.getItem(getUserStorageKey())) {
        // Migrate to private storage
        const userStorageKey = getUserStorageKey();
        localStorage.setItem(userStorageKey, oldData);
        localStorage.removeItem(STORAGE_KEY);
        console.log('Migrated old data to private storage for user:', getUserId());
      }
    } catch (error) {
      console.error('Failed to migrate old data:', error);
    }
  }
};