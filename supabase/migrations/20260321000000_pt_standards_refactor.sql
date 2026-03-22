-- Drop old tables
DROP TABLE IF EXISTS public.pt_altitude_corrections CASCADE;
DROP TABLE IF EXISTS public.pt_altitude_walk_thresholds CASCADE;
DROP TABLE IF EXISTS public.run_altitude_adjustments CASCADE;
DROP TABLE IF EXISTS public.hamr_altitude_adjustments CASCADE;

-- Recreate unified altitude corrections table
CREATE TABLE public.pt_altitude_corrections (
    id BIGSERIAL PRIMARY KEY,
    exercise_type TEXT NOT NULL,
    altitude_group TEXT NOT NULL,
    altitude_range TEXT,
    perf_start TEXT,
    perf_end TEXT,
    correction INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Recreate walk thresholds table
CREATE TABLE public.pt_altitude_walk_thresholds (
    id BIGSERIAL PRIMARY KEY,
    sex TEXT NOT NULL,
    altitude_group TEXT NOT NULL,
    altitude_range TEXT,
    age_range TEXT NOT NULL,
    max_time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure pass/fail table is clean for new standards
TRUNCATE TABLE public.pt_pass_fail_standards;
TRUNCATE TABLE public.pt_scoring_standards;
