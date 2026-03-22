-- Simplified PT Standards Schema
-- This migration redefines the PT tables to use direct gender/age columns for easier CSV management.

-- Drop existing unified tables if they exist
DROP TABLE IF EXISTS public.pt_scoring_standards CASCADE;
DROP TABLE IF EXISTS public.pt_pass_fail_standards CASCADE;
DROP TABLE IF EXISTS public.pt_altitude_corrections CASCADE;
DROP TABLE IF EXISTS public.pt_altitude_walk_thresholds CASCADE;

-- 1. Unified Scoring Standards
CREATE TABLE public.pt_scoring_standards (
    id BIGSERIAL PRIMARY KEY,
    exercise_type TEXT NOT NULL,
    gender TEXT NOT NULL,
    age_group TEXT NOT NULL,
    performance TEXT NOT NULL,
    points NUMERIC(4,1) NOT NULL,
    health_risk_category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Unified Pass/Fail Standards
CREATE TABLE public.pt_pass_fail_standards (
    id BIGSERIAL PRIMARY KEY,
    exercise_type TEXT NOT NULL,
    gender TEXT NOT NULL,
    age_group TEXT NOT NULL,
    min_performance TEXT NOT NULL,
    max_performance TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Unified Altitude Corrections
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

-- 4. Unified Altitude Walk Thresholds
CREATE TABLE public.pt_altitude_walk_thresholds (
    id BIGSERIAL PRIMARY KEY,
    sex TEXT NOT NULL,
    altitude_group TEXT NOT NULL,
    altitude_range TEXT,
    age_range TEXT NOT NULL,
    max_time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.pt_scoring_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_pass_fail_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_altitude_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_altitude_walk_thresholds ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on pt_scoring_standards" ON public.pt_scoring_standards FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access on pt_pass_fail_standards" ON public.pt_pass_fail_standards FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access on pt_altitude_corrections" ON public.pt_altitude_corrections FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access on pt_altitude_walk_thresholds" ON public.pt_altitude_walk_thresholds FOR SELECT TO anon USING (true);

-- Indices for performance
CREATE INDEX idx_pt_scoring_lookup ON public.pt_scoring_standards(exercise_type, gender, age_group);
CREATE INDEX idx_pt_pass_fail_lookup ON public.pt_pass_fail_standards(exercise_type, gender, age_group);
