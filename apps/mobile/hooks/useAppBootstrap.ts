import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface SeedData {
  pt_altitude_corrections?: unknown[];
  base_pay_2024?: Array<{ pay_grade: string }>;
  bas_rates?: Array<{ enlisted_rate: number }>;
  federal_tax_data?: Array<{ year: number }>;
  state_tax_data?: Array<{ year: number }>;
  veterans_disability_compensation?: unknown[];
  pt_scoring_standards?: Array<{
    exercise_type: string;
    gender: string;
    age_group: string;
    performance: string;
    points: number;
    health_risk_category: string | null;
  }>;
  pt_pass_fail_standards?: Array<{
    gender: string;
    age_group: string;
  }>;
  pt_altitude_walk_thresholds?: Array<{
    sex: string;
    age_range: string;
  }>;
  [key: string]: unknown;
}

/**
 * Hook to handle app-wide initialization, cache hydration, and data synchronization.
 */
export function useAppBootstrap() {
  const queryClient = useQueryClient();

  // Hydration logic: Seed the cache from seed-data.json if it's empty
  useEffect(() => {
    const hydrateCache = async () => {
      // Simple check to see if we have any data (e.g., altitude corrections)
      const existingData = queryClient.getQueryData(["altitudeCorrections"]);
      if (!existingData) {
        console.warn("Cache is empty. Hydrating from seed-data.json...");
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const seedData = require("../assets/seed-data.json") as SeedData;

          // 1. Demographic-independent data
          if (seedData.pt_altitude_corrections) {
            queryClient.setQueryData(
              ["altitudeCorrections"],
              seedData.pt_altitude_corrections,
            );
          }
          if (seedData.base_pay_2024) {
            queryClient.setQueryData(
              ["payGrades"],
              seedData.base_pay_2024.map(
                (i: { pay_grade: string }) => i.pay_grade,
              ),
            );
          }
          if (seedData.bas_rates) {
            queryClient.setQueryData(
              ["basRate", 2025],
              seedData.bas_rates[0]?.enlisted_rate || 460.25,
            ); // Default fallback
          }
          const fedTaxData = seedData.federal_tax_data;
          if (fedTaxData) {
            const years = [
              ...new Set(fedTaxData.map((i: { year: number }) => i.year)),
            ];
            years.forEach((year) => {
              queryClient.setQueryData(
                ["federalTaxData", year],
                fedTaxData.filter((i: { year: number }) => i.year === year),
              );
            });
            if (years.length > 0) {
              queryClient.setQueryData(
                ["maxFederalTaxYear"],
                Math.max(...(years as number[])),
              );
            }
          }
          const stateTaxData = seedData.state_tax_data;
          if (stateTaxData) {
            const years = [
              ...new Set(stateTaxData.map((i: { year: number }) => i.year)),
            ];
            years.forEach((year) => {
              queryClient.setQueryData(
                ["stateTaxData", year],
                stateTaxData.filter((i: { year: number }) => i.year === year),
              );
            });
            if (years.length > 0) {
              queryClient.setQueryData(
                ["maxStateTaxYear"],
                Math.max(...(years as number[])),
              );
            }
          }
          if (seedData.veterans_disability_compensation) {
            queryClient.setQueryData(
              ["disabilityData"],
              seedData.veterans_disability_compensation,
            );
          }

          // 2. Demographic-dependent data (PT Standards)
          if (seedData.pt_scoring_standards) {
            const scoringStandards = seedData.pt_scoring_standards as Array<{
              exercise_type: string;
              gender: string;
              age_group: string;
              performance: string;
              points: number;
              health_risk_category: string | null;
            }>;
            const whtrData = scoringStandards.filter(
              (s) => s.exercise_type === "whtr",
            );

            // Get unique combinations of gender and age_group
            const groups = [
              ...new Set(
                scoringStandards
                  .filter((s) => s.exercise_type !== "whtr")
                  .map((s) => `${s.gender}|${s.age_group}`),
              ),
            ];

            groups.forEach((groupKey: string) => {
              const [gender, ageRange] = groupKey.split("|");

              const groupStandards = scoringStandards
                .filter((s) => s.gender === gender && s.age_group === ageRange)
                .map((item) => ({
                  exercise: item.exercise_type,
                  measurement: item.performance,
                  points: item.points,
                  healthRiskCategory: item.health_risk_category,
                }));

              const whtrMapped = whtrData.map((item) => ({
                exercise: item.exercise_type,
                measurement: item.performance,
                points: item.points,
                healthRiskCategory: item.health_risk_category,
              }));

              queryClient.setQueryData(
                ["ptStandards", gender, ageRange],
                [...groupStandards, ...whtrMapped],
              );

              if (seedData.pt_pass_fail_standards) {
                const groupPassFail = (
                  seedData.pt_pass_fail_standards as Array<{
                    gender: string;
                    age_group: string;
                  }>
                ).filter(
                  (s) => s.gender === gender && s.age_group === ageRange,
                );
                queryClient.setQueryData(
                  ["passFailStandards", gender, ageRange],
                  groupPassFail,
                );
              }

              if (seedData.pt_altitude_walk_thresholds) {
                const groupWalk = (
                  seedData.pt_altitude_walk_thresholds as Array<{
                    sex: string;
                    age_range: string;
                  }>
                ).filter((s) => s.sex === gender && s.age_range === ageRange);
                queryClient.setQueryData(
                  ["walkAltitudeThresholds", gender, ageRange],
                  groupWalk,
                );
              }
            });
          }

          // 3. Help Content
          const helpTables = [
            "pt_help_details",
            "pay_help_details",
            "retirement_help_details",
            "best_score_help_details",
          ];
          helpTables.forEach((tableName) => {
            const data = seedData[tableName];
            if (Array.isArray(data)) {
              data.forEach((item: { content_key?: string; title?: string }) => {
                const key = item.content_key || item.title;
                if (key) {
                  queryClient.setQueryData(
                    ["helpContent", key],
                    (
                      data as Array<{
                        content_key?: string;
                        title?: string;
                      }>
                    ).filter((i) => i.content_key === key || i.title === key),
                  );
                }
              });
            }
          });

          console.warn("Hydration complete.");
        } catch (error) {
          console.error("Failed to hydrate cache from seed-data.json:", error);
        }
      }
    };

    hydrateCache();
  }, [queryClient]);
}
