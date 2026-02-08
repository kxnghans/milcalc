import { supabase } from './supabaseClient';
import { Linking } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Fetches a list of documents from the database based on a category.
 * @param category - The category of documents to fetch (e.g., 'PT', 'PAY').
 * @returns An array of document objects.
 */
const documentsCache: Record<string, any> = {}; // Simple in-memory cache

export const getDocumentsByCategory = async (category: string) => {
  if (!category) return [];

  if (documentsCache[category]) {
    return documentsCache[category];
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', category)
    .order('sort_order');

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  documentsCache[category] = data || [];
  return data || [];
};

/**
 * Fetches help details for a specific exercise from the database.
 * @param exercise - The exercise to fetch help details for.
 * @returns An array of help detail objects.
 */
export const getHelpDetailsByExercise = async (exercise: string) => {
  if (!exercise) return [];

  const { data, error } = await supabase
    .from('help_details' as any)
    .select('*')
    .eq('exercise', exercise)
    .order('id');

  if (error) {
    console.error('Error fetching help details:', error);
    return [];
  }

  return data || [];
};

/**
 * Handles opening a document, either by fetching a signed URL for private files
 * or by opening a public web link.
 * @param doc - The document object from the database.
 */
export const openDocument = async (doc: any) => {
    // Use learn_more_uri if it exists, otherwise use the source based on type.
    const urlToOpen = doc.learn_more_uri || (doc.type === 'web' ? doc.source : null);

    if (urlToOpen) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            await Linking.openURL(urlToOpen);
        } catch (error) {
            console.error('Error opening URL:', error);
        }
        return;
    }

    // Handle private files that need a signed URL.
    if ((doc.type === 'local' || doc.type === 'audio') && doc.source) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            const { data, error } = await supabase.functions.invoke('get-signed-url', {
                body: { filePath: doc.source },
            });
    
            if (error) {
                throw error;
            }
    
            if (data.signedURL) {
                await Linking.openURL(data.signedURL);
            } else {
                console.error('No signed URL returned from edge function');
            }
        } catch (error) {
            console.error('Error getting signed URL:', (error as any).message);
        }
        return;
    }

    console.error('No valid URL or source found for this document:', doc);
};
