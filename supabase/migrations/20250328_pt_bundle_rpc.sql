-- Migration: Add get_pt_standards_bundle RPC
-- Description: Bundles all necessary PT reference data into a single call for performance.

CREATE OR REPLACE FUNCTION get_pt_standards_bundle(p_gender text, p_age_group text)
RETURNS json AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'standards', COALESCE((
      SELECT json_agg(s) FROM (
        SELECT exercise_type, performance, points, health_risk_category
        FROM public.pt_scoring_standards
        WHERE (gender = p_gender AND age_group = p_age_group) OR exercise_type = 'whtr'
        ORDER BY points DESC
      ) s
    ), '[]'::json),
    'pass_fail', COALESCE((
      SELECT json_agg(pf) FROM (
        SELECT *
        FROM public.pt_pass_fail_standards
        WHERE (gender = p_gender AND age_group = p_age_group)
      ) pf
    ), '[]'::json),
    'corrections', COALESCE((
      SELECT json_agg(c) FROM (
        SELECT *
        FROM public.pt_altitude_corrections
      ) c
    ), '[]'::json),
    'walk_thresholds', COALESCE((
      SELECT json_agg(w) FROM (
        SELECT *
        FROM public.pt_altitude_walk_thresholds
        WHERE sex = p_gender
      ) w
    ), '[]'::json)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;
