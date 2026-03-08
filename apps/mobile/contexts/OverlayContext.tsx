import React, { createContext, useContext, useState, useCallback } from 'react';
import { ImageSourcePropType } from 'react-native';

export type OverlayType = 'MENU' | 'PROFILE' | 'SETTINGS' | 'BUG_REPORT' | null;
export type DocumentCategory = 'PAY' | 'PT' | 'RETIREMENT' | null;
export type HelpSource = 'pt' | 'pay' | 'retirement' | 'best_score' | null;

interface OverlayContextType {
  // Main Overlay (BottomSheet)
  overlayType: OverlayType;
  isVisible: boolean;
  openOverlay: (type: OverlayType) => void;
  closeOverlay: () => void;
  snapToIndex: number;
  setSnapToIndex: (index: number) => void;

  // Global Help (DetailModal)
  helpContentKey: string | null;
  helpMascot: ImageSourcePropType | null;
  helpSource: HelpSource;
  openHelp: (key: string, source: HelpSource, mascot?: ImageSourcePropType) => void;
  closeHelp: () => void;

  // Global Documents (DocumentModal)
  documentCategory: DocumentCategory;
  isDocumentVisible: boolean;
  openDocuments: (category: DocumentCategory) => void;
  closeDocuments: () => void;
}

const OverlayContext = createContext<OverlayContextType>({
  overlayType: null,
  isVisible: false,
  openOverlay: () => {},
  closeOverlay: () => {},
  snapToIndex: 0,
  setSnapToIndex: () => {},

  helpContentKey: null,
  helpMascot: null,
  helpSource: null,
  openHelp: () => {},
  closeHelp: () => {},

  documentCategory: null,
  isDocumentVisible: false,
  openDocuments: () => {},
  closeDocuments: () => {},
});

export const useOverlay = () => useContext(OverlayContext);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Main Overlay State
  const [overlayType, setOverlayType] = useState<OverlayType>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [snapToIndex, setSnapToIndex] = useState(0);

  // Global Help State
  const [helpContentKey, setHelpContentKey] = useState<string | null>(null);
  const [helpMascot, setHelpMascot] = useState<ImageSourcePropType | null>(null);
  const [helpSource, setHelpSource] = useState<HelpSource>(null);

  // Global Documents State
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory>(null);
  const [isDocumentVisible, setIsDocumentVisible] = useState(false);

  const openOverlay = useCallback((type: OverlayType) => {
    setOverlayType(type);
    setIsVisible(true);
    setSnapToIndex(2); // Default to open
  }, []);

  const closeOverlay = useCallback(() => {
    setIsVisible(false);
    setSnapToIndex(0);
    // Delay setting type to null to allow for close animation
    setTimeout(() => {
      setOverlayType(null);
    }, 300);
  }, []);

  const openHelp = useCallback((key: string, source: HelpSource, mascot?: ImageSourcePropType) => {
    setHelpContentKey(key);
    setHelpSource(source);
    if (mascot) setHelpMascot(mascot);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpContentKey(null);
    setHelpMascot(null);
    setHelpSource(null);
  }, []);

  const openDocuments = useCallback((category: DocumentCategory) => {
    setDocumentCategory(category);
    setIsDocumentVisible(true);
  }, []);

  const closeDocuments = useCallback(() => {
    setIsDocumentVisible(false);
    // Slight delay for UI smoothness
    setTimeout(() => setDocumentCategory(null), 300);
  }, []);

  return (
    <OverlayContext.Provider
      value={{
        overlayType,
        isVisible,
        openOverlay,
        closeOverlay,
        snapToIndex,
        setSnapToIndex,
        helpContentKey,
        helpMascot,
        helpSource,
        openHelp,
        closeHelp,
        documentCategory,
        isDocumentVisible,
        openDocuments,
        closeDocuments,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};
