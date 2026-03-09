import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: 'male' | 'female';
}

interface ProfileContextType extends ProfileData {
  setProfileData: (data: Partial<ProfileData>) => void;
  isLoading: boolean;
}

const DEFAULT_PROFILE: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  gender: 'male',
};

const ProfileContext = createContext<ProfileContextType>({
  ...DEFAULT_PROFILE,
  setProfileData: () => {},
  isLoading: true,
});

const STORAGE_KEY = '@milcalc_profile_v1';

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ ...profile, setProfileData, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};
