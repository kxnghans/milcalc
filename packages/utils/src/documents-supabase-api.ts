import * as Haptics from "expo-haptics";
import { Linking } from "react-native";

import { supabase } from "./supabaseClient";
import { Tables } from "./types";

/**
 * Fetches a list of documents from the database based on a category.
 * @param category - The category of documents to fetch (e.g., 'PT', 'PAY').
 * @returns An array of document objects.
 */
const documentsCache: Record<string, Tables<"documents">[]> = {}; // Simple in-memory cache

export const getDocumentsByCategory = async (
  category: string,
): Promise<Tables<"documents">[]> => {
  if (!category) return [];

  if (documentsCache[category]) {
    return documentsCache[category];
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("category", category)
    .order("sort_order");

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  documentsCache[category] = data || [];
  return data || [];
};

/**
 * Internal helper to append page number to URL if present.
 */
const buildUrlWithPage = (url: string, page?: number | null): string => {
  if (!page) return url;
  const separator = url.includes("#") ? "&" : "#";
  return `${url}${separator}page=${page}`;
};

/**
 * Handles opening a document, either by fetching a signed URL for private files
 * or by opening a public web link.
 * @param doc - The document object from the database.
 */
export const openDocument = async (doc: Tables<"documents">) => {
  // 1. Handle web links or custom learn_more links
  if (doc.type === "web" || doc.learn_more_uri) {
    let urlToOpen = doc.learn_more_uri || doc.source;
    if (urlToOpen) {
      urlToOpen = buildUrlWithPage(urlToOpen, doc.page_number);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        await Linking.openURL(urlToOpen);
      } catch (error) {
        console.error("Error opening URL:", error);
      }
      return;
    }
  }

  // 2. Handle private files (local pdfs/audio) via get-signed-url edge function
  if ((doc.type === "local" || doc.type === "audio") && doc.source) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      // Remove leading slash if exists for consistent pathing in storage
      const sanitizedPath = doc.source.startsWith("/")
        ? doc.source.slice(1)
        : doc.source;

      const result = await supabase.functions.invoke<{
        signedURL: string;
      }>("get-signed-url", {
        body: { filePath: sanitizedPath },
      });

      if (result.error) throw result.error;

      const responseData = result.data;

      if (responseData && responseData.signedURL) {
        let finalUrl = responseData.signedURL;
        // Append page number for local PDFs if applicable
        if (doc.type === "local" && doc.page_number) {
          finalUrl = buildUrlWithPage(finalUrl, doc.page_number);
        }
        await Linking.openURL(finalUrl);
      } else {
        console.error("No signed URL returned from edge function", result.data);
      }
    } catch (error) {
      console.error("Error getting signed URL:", error);
    }
    return;
  }

  console.error("No valid URL or source found for this document:", doc);
};
