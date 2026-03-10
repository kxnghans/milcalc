import { bugSupabase } from './supabaseClient';

export interface BugReport {
  app_id: string;
  email: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  first_name?: string;
  last_name?: string;
  attachment_url?: string;
  status?: string;
}

/**
 * Submits a bug report to the dedicated bug tracking Supabase database.
 * @param {BugReport} report - The bug report data.
 * @returns {Promise<any>} The response data from Supabase.
 */
export const submitBugReport = async (report: BugReport) => {
  if (!bugSupabase) {
    throw new Error('Bug reporting is currently unavailable (Client not configured).');
  }

  const { data, error } = await bugSupabase
    .from('bug_reports')
    .insert([
      {
        app_id: report.app_id,
        email: report.email,
        description: report.description,
        severity: report.severity,
        first_name: report.first_name,
        last_name: report.last_name,
        attachment_url: report.attachment_url,
        status: report.status ?? 'new',
      },
    ]);

  if (error) {
    console.error('Failed to submit bug report:', error);
    throw error;
  }

  return data;
};
