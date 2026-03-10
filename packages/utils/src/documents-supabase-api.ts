import { supabase } from './supabaseClient';
import { Linking } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Tables } from './types';

/**
 * Fetches a list of documents from the database based on a category.
 * @param category - The category of documents to fetch (e.g., 'PT', 'PAY').
 * @returns An array of document objects.
 */
const documentsCache: Record<string, Tables<'documents'>[]> = {}; // Simple in-memory cache

export const getDocumentsByCategory = async (category: string): Promise<Tables<'documents'>[]> => {
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
 * Handles opening a document, either by fetching a signed URL for private files
 * or by opening a public web link.
 * @param doc - The document object from the database.
 */
export const openDocument = async (doc: Tables<'documents'>) => {
    const buildUrlWithPage = (url: string, page?: number | null) => {
        if (!page) return url;
        // Append #page=N if it's a PDF or we have a page number
        const separator = url.includes('#') ? '&' : '#';
        return `${url}${separator}page=${page}`;
    };

    // Override for DAFMAN 36-2905 to use a specific static link
    if (doc.name.toLowerCase().replace(/\s+/g, '') === 'dafman36-2905') {
        const staticLink = 'https://static.e-publishing.af.mil/production/1/af_a1/publication/dafman36-2905/dafman36-2905.pdf';
        const finalLink = buildUrlWithPage(staticLink, doc.page_number);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            await Linking.openURL(finalLink);
        } catch (error) {
            console.error('Error opening static DAFMAN 36-2905 URL:', error);
        }
        return;
    }

    // Use learn_more_uri if it exists, otherwise use the source based on type.
    let urlToOpen = doc.learn_more_uri || (doc.type === 'web' ? doc.source : null);

    if (urlToOpen) {
        urlToOpen = buildUrlWithPage(urlToOpen, doc.page_number);
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
    
            if (data && data.signedURL) {
                const finalUrl = buildUrlWithPage(data.signedURL, doc.page_number);
                await Linking.openURL(finalUrl);
            } else {
                console.error('No signed URL returned from edge function');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Error getting signed URL:', errorMessage);
        }
        return;
    }

    console.error('No valid URL or source found for this document:', doc);
};
