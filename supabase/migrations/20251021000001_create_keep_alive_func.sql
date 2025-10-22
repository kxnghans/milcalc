CREATE OR REPLACE FUNCTION keep_alive()
RETURNS void AS $$
BEGIN
  -- This function does nothing but its execution is registered as activity.
END;
$$ LANGUAGE plpgsql;