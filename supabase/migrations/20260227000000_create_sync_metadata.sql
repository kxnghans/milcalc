-- Create the sync_metadata table
CREATE TABLE IF NOT EXISTS public.sync_metadata (
    table_name TEXT PRIMARY KEY,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access on sync_metadata" ON public.sync_metadata;
CREATE POLICY "Allow public read access on sync_metadata"
ON public.sync_metadata
FOR SELECT
TO anon
USING (true);

-- Function to update the sync_metadata timestamp
CREATE OR REPLACE FUNCTION public.update_sync_metadata()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.sync_metadata (table_name, last_updated_at)
    VALUES (TG_TABLE_NAME, NOW())
    ON CONFLICT (table_name) DO UPDATE
    SET last_updated_at = EXCLUDED.last_updated_at;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Helper to create triggers for ALL lookup tables
DO $$
DECLARE
    t TEXT;
    tables_to_sync TEXT[] := ARRAY[
        'pt_muscular_fitness_standards',
        'pt_cardio_respiratory_standards',
        'walk_standards',
        'base_pay_2024',
        'reserve_drill_pay',
        'bah_rates_dependents',
        'bah_rates_no_dependents',
        'bas_rates',
        'federal_tax_data',
        'state_tax_data',
        'veterans_disability_compensation',
        'pt_help_details',
        'pay_help_details',
        'retirement_help_details',
        'best_score_help_details',
        'bah_oop_amounts',
        'bah_rate_component_breakdown',
        'documents',
        'hamr_altitude_adjustments',
        'run_altitude_adjustments',
        'walk_altitude_adjustments',
        'tax_data_22zpallagi',
        'non_locality_bah_rates'
    ];
BEGIN
    FOREACH t IN ARRAY tables_to_sync LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS tr_update_sync_metadata_%I ON public.%I;
            CREATE TRIGGER tr_update_sync_metadata_%I
            AFTER INSERT OR UPDATE OR DELETE ON public.%I
            FOR EACH STATEMENT EXECUTE FUNCTION public.update_sync_metadata();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- Initialize the metadata table with current timestamps
INSERT INTO public.sync_metadata (table_name, last_updated_at)
SELECT table_name, NOW()
FROM (
    VALUES 
        ('pt_muscular_fitness_standards'),
        ('pt_cardio_respiratory_standards'),
        ('walk_standards'),
        ('base_pay_2024'),
        ('reserve_drill_pay'),
        ('bah_rates_dependents'),
        ('bah_rates_no_dependents'),
        ('bas_rates'),
        ('federal_tax_data'),
        ('state_tax_data'),
        ('veterans_disability_compensation'),
        ('pt_help_details'),
        ('pay_help_details'),
        ('retirement_help_details'),
        ('best_score_help_details'),
        ('bah_oop_amounts'),
        ('bah_rate_component_breakdown'),
        ('documents'),
        ('hamr_altitude_adjustments'),
        ('run_altitude_adjustments'),
        ('walk_altitude_adjustments'),
        ('tax_data_22zpallagi'),
        ('non_locality_bah_rates')
) AS t(table_name)
ON CONFLICT (table_name) DO NOTHING;
