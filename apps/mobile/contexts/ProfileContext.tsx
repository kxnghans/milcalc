import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: 'male' | 'female';
  accountType: 'free' | 'premium';
  hasSeenOnboarding: boolean;
}

interface ProfileContextType extends ProfileData {
  setProfileData: (data: Partial<ProfileData>) => void;
  isLoading: boolean;
  isProfileComplete: boolean;
}

const DEFAULT_PROFILE: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  gender: 'male',
  accountType: 'free',
  hasSeenOnboarding: false,
};

const ProfileContext = createContext<ProfileContextType>({
  ...DEFAULT_PROFILE,
  setProfileData: () => {},
  isLoading: true,
  isProfileComplete: false,
});

const STORAGE_KEY = '@milcalc_profile_v1';
const db = SQLite.openDatabaseSync("milcalc-cache.db");

// Ensure cache table exists (also handled in SyncManager, but safe to repeat)
db.execSync("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)");

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  const isProfileComplete = !!(profile.firstName?.trim() && profile.lastName?.trim() && profile.email?.trim());

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = db.getFirstSync<{ value: string }>(
          "SELECT value FROM cache WHERE key = ?",
          [STORAGE_KEY]
        );
        
        if (result) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(result.value) });
        }
      } catch (e) {
        console.error('Failed to load profile from SQLite:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const setProfileData = async (newData: Partial<ProfileData>) => {
    try {
      const updatedProfile = { ...profile, ...newData };
      setProfile(updatedProfile);
      
      db.runSync(
        "INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)",
        [STORAGE_KEY, JSON.stringify(updatedProfile)]
      );
    } catch (e) {
      console.error('Failed to save profile to SQLite:', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ ...profile, setProfileData, isLoading, isProfileComplete }}>
      {children}
    </ProfileContext.Provider>
  );
};
