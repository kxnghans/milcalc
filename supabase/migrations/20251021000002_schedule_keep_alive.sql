-- Unschedule if it exists to make it idempotent
SELECT cron.unschedule('keep-alive-job');
-- Schedule the keep_alive function to run at midnight UTC on Monday and Thursday.
SELECT cron.schedule('keep-alive-job', '0 0 * * 1,4', 'SELECT keep_alive();');