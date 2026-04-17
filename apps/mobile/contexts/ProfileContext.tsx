import * as SQLite from "expo-sqlite";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: "male" | "female";
  accountType: "free" | "premium";
  hasSeenOnboarding: boolean;
  donationTotal: number;
}

interface ProfileContextType extends ProfileData {
  setProfileData: (data: Partial<ProfileData>) => void;
  isLoading: boolean;
  isProfileComplete: boolean;
}

const DEFAULT_PROFILE: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  gender: "male",
  accountType: "free",
  hasSeenOnboarding: false,
  donationTotal: 0,
};

const ProfileContext = createContext<ProfileContextType>({
  ...DEFAULT_PROFILE,
  setProfileData: () => {},
  isLoading: true,
  isProfileComplete: false,
});

const STORAGE_KEY = "@milcalc_profile_v1";
const db = SQLite.openDatabaseSync("milcalc-cache.db");

// Ensure cache table exists (also handled in SyncManager, but safe to repeat)
db.execSync(
  "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)",
);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  const isProfileComplete = !!(
    profile.firstName?.trim() &&
    profile.lastName?.trim() &&
    profile.email?.trim()
  );

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = db.getFirstSync<{ value: string }>(
          "SELECT value FROM cache WHERE key = ?",
          [STORAGE_KEY],
        );

        if (result) {
          const parsed = JSON.parse(result.value) as Partial<ProfileData>;
          setProfile({ ...DEFAULT_PROFILE, ...parsed });
        }
      } catch (e) {
        console.error("Failed to load profile from SQLite:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const setProfileData = useCallback(async (newData: Partial<ProfileData>) => {
    try {
      setProfile((prevProfile) => {
        const updatedProfile = { ...prevProfile, ...newData };
        db.runSync("INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)", [
          STORAGE_KEY,
          JSON.stringify(updatedProfile),
        ]);
        return updatedProfile;
      });
    } catch (e) {
      console.error("Failed to save profile to SQLite:", e);
    }
  }, []);

  const value = useMemo(
    () => ({
      ...profile,
      setProfileData,
      isLoading,
      isProfileComplete,
    }),
    [profile, setProfileData, isLoading, isProfileComplete],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
