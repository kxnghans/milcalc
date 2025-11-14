export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bah_oop_amounts: {
        Row: {
          id: number
          pay_grade: string | null
          with_deps: number | null
          without_deps: number | null
        }
        Insert: {
          id?: number
          pay_grade?: string | null
          with_deps?: number | null
          without_deps?: number | null
        }
        Update: {
          id?: number
          pay_grade?: string | null
          with_deps?: number | null
          without_deps?: number | null
        }
        Relationships: []
      }
      bah_rate_component_breakdown: {
        Row: {
          id: number
          mha_code: string | null
          mha_name: string | null
          rent_pct: number | null
          utilities_pct: number | null
        }
        Insert: {
          id?: number
          mha_code?: string | null
          mha_name?: string | null
          rent_pct?: number | null
          utilities_pct?: number | null
        }
        Update: {
          id?: number
          mha_code?: string | null
          mha_name?: string | null
          rent_pct?: number | null
          utilities_pct?: number | null
        }
        Relationships: []
      }
      bah_rates_dependents: {
        Row: {
          e01: number | null
          e02: number | null
          e03: number | null
          e04: number | null
          e05: number | null
          e06: number | null
          e07: number | null
          e08: number | null
          e09: number | null
          mha: string
          mha_name: string | null
          o01: number | null
          o01e: number | null
          o02: number | null
          o02e: number | null
          o03: number | null
          o03e: number | null
          o04: number | null
          o05: number | null
          o06: number | null
          o07: number | null
          state: string | null
          w01: number | null
          w02: number | null
          w03: number | null
          w04: number | null
          w05: number | null
        }
        Insert: {
          e01?: number | null
          e02?: number | null
          e03?: number | null
          e04?: number | null
          e05?: number | null
          e06?: number | null
          e07?: number | null
          e08?: number | null
          e09?: number | null
          mha: string
          mha_name?: string | null
          o01?: number | null
          o01e?: number | null
          o02?: number | null
          o02e?: number | null
          o03?: number | null
          o03e?: number | null
          o04?: number | null
          o05?: number | null
          o06?: number | null
          o07?: number | null
          state?: string | null
          w01?: number | null
          w02?: number | null
          w03?: number | null
          w04?: number | null
          w05?: number | null
        }
        Update: {
          e01?: number | null
          e02?: number | null
          e03?: number | null
          e04?: number | null
          e05?: number | null
          e06?: number | null
          e07?: number | null
          e08?: number | null
          e09?: number | null
          mha?: string
          mha_name?: string | null
          o01?: number | null
          o01e?: number | null
          o02?: number | null
          o02e?: number | null
          o03?: number | null
          o03e?: number | null
          o04?: number | null
          o05?: number | null
          o06?: number | null
          o07?: number | null
          state?: string | null
          w01?: number | null
          w02?: number | null
          w03?: number | null
          w04?: number | null
          w05?: number | null
        }
        Relationships: []
      }
      bah_rates_no_dependents: {
        Row: {
          e01: number | null
          e02: number | null
          e03: number | null
          e04: number | null
          e05: number | null
          e06: number | null
          e07: number | null
          e08: number | null
          e09: number | null
          mha: string
          mha_name: string | null
          o01: number | null
          o01e: number | null
          o02: number | null
          o02e: number | null
          o03: number | null
          o03e: number | null
          o04: number | null
          o05: number | null
          o06: number | null
          o07: number | null
          state: string | null
          w01: number | null
          w02: number | null
          w03: number | null
          w04: number | null
          w05: number | null
        }
        Insert: {
          e01?: number | null
          e02?: number | null
          e03?: number | null
          e04?: number | null
          e05?: number | null
          e06?: number | null
          e07?: number | null
          e08?: number | null
          e09?: number | null
          mha: string
          mha_name?: string | null
          o01?: number | null
          o01e?: number | null
          o02?: number | null
          o02e?: number | null
          o03?: number | null
          o03e?: number | null
          o04?: number | null
          o05?: number | null
          o06?: number | null
          o07?: number | null
          state?: string | null
          w01?: number | null
          w02?: number | null
          w03?: number | null
          w04?: number | null
          w05?: number | null
        }
        Update: {
          e01?: number | null
          e02?: number | null
          e03?: number | null
          e04?: number | null
          e05?: number | null
          e06?: number | null
          e07?: number | null
          e08?: number | null
          e09?: number | null
          mha?: string
          mha_name?: string | null
          o01?: number | null
          o01e?: number | null
          o02?: number | null
          o02e?: number | null
          o03?: number | null
          o03e?: number | null
          o04?: number | null
          o05?: number | null
          o06?: number | null
          o07?: number | null
          state?: string | null
          w01?: number | null
          w02?: number | null
          w03?: number | null
          w04?: number | null
          w05?: number | null
        }
        Relationships: []
      }
      bas_rates: {
        Row: {
          enlisted_rate: number | null
          id: number
          officer_rate: number | null
          year: number | null
        }
        Insert: {
          enlisted_rate?: number | null
          id?: number
          officer_rate?: number | null
          year?: number | null
        }
        Update: {
          enlisted_rate?: number | null
          id?: number
          officer_rate?: number | null
          year?: number | null
        }
        Relationships: []
      }
      base_pay_2024: {
        Row: {
          pay_grade: string
          yos_2_or_less: number | null
          yos_over_10: number | null
          yos_over_12: number | null
          yos_over_14: number | null
          yos_over_16: number | null
          yos_over_18: number | null
          yos_over_2: number | null
          yos_over_20: number | null
          yos_over_22: number | null
          yos_over_24: number | null
          yos_over_26: number | null
          yos_over_28: number | null
          yos_over_3: number | null
          yos_over_30: number | null
          yos_over_32: number | null
          yos_over_34: number | null
          yos_over_36: number | null
          yos_over_38: number | null
          yos_over_4: number | null
          yos_over_40: number | null
          yos_over_6: number | null
          yos_over_8: number | null
        }
        Insert: {
          pay_grade: string
          yos_2_or_less?: number | null
          yos_over_10?: number | null
          yos_over_12?: number | null
          yos_over_14?: number | null
          yos_over_16?: number | null
          yos_over_18?: number | null
          yos_over_2?: number | null
          yos_over_20?: number | null
          yos_over_22?: number | null
          yos_over_24?: number | null
          yos_over_26?: number | null
          yos_over_28?: number | null
          yos_over_3?: number | null
          yos_over_30?: number | null
          yos_over_32?: number | null
          yos_over_34?: number | null
          yos_over_36?: number | null
          yos_over_38?: number | null
          yos_over_4?: number | null
          yos_over_40?: number | null
          yos_over_6?: number | null
          yos_over_8?: number | null
        }
        Update: {
          pay_grade?: string
          yos_2_or_less?: number | null
          yos_over_10?: number | null
          yos_over_12?: number | null
          yos_over_14?: number | null
          yos_over_16?: number | null
          yos_over_18?: number | null
          yos_over_2?: number | null
          yos_over_20?: number | null
          yos_over_22?: number | null
          yos_over_24?: number | null
          yos_over_26?: number | null
          yos_over_28?: number | null
          yos_over_3?: number | null
          yos_over_30?: number | null
          yos_over_32?: number | null
          yos_over_34?: number | null
          yos_over_36?: number | null
          yos_over_38?: number | null
          yos_over_4?: number | null
          yos_over_40?: number | null
          yos_over_6?: number | null
          yos_over_8?: number | null
        }
        Relationships: []
      }
      best_score_help_details: {
        Row: {
          content_key: string | null
          id: number
          section_content: string | null
          section_header: string | null
          title: string | null
        }
        Insert: {
          content_key?: string | null
          id: number
          section_content?: string | null
          section_header?: string | null
          title?: string | null
        }
        Update: {
          content_key?: string | null
          id?: number
          section_content?: string | null
          section_header?: string | null
          title?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          id: number
          learn_more_uri: string | null
          name: string
          source: string | null
          type: string
        }
        Insert: {
          category: string
          id?: number
          learn_more_uri?: string | null
          name: string
          source?: string | null
          type: string
        }
        Update: {
          category?: string
          id?: number
          learn_more_uri?: string | null
          name?: string
          source?: string | null
          type?: string
        }
        Relationships: []
      }
      federal_tax_data: {
        Row: {
          amt_exemption: number | null
          children: string | null
          eitc_parameter: string | null
          eitc_value: number | null
          filing_status: string | null
          id: number
          income_bracket_high: string | null
          income_bracket_low: number | null
          personal_exemption: number | null
          standard_deduction: number | null
          state: string | null
          tax_rate: number | null
          year: number | null
        }
        Insert: {
          amt_exemption?: number | null
          children?: string | null
          eitc_parameter?: string | null
          eitc_value?: number | null
          filing_status?: string | null
          id?: number
          income_bracket_high?: string | null
          income_bracket_low?: number | null
          personal_exemption?: number | null
          standard_deduction?: number | null
          state?: string | null
          tax_rate?: number | null
          year?: number | null
        }
        Update: {
          amt_exemption?: number | null
          children?: string | null
          eitc_parameter?: string | null
          eitc_value?: number | null
          filing_status?: string | null
          id?: number
          income_bracket_high?: string | null
          income_bracket_low?: number | null
          personal_exemption?: number | null
          standard_deduction?: number | null
          state?: string | null
          tax_rate?: number | null
          year?: number | null
        }
        Relationships: []
      }
      hamr_altitude_adjustments: {
        Row: {
          altitude_group: string | null
          altitude_range: string | null
          id: number
          shuttles_to_add: number | null
        }
        Insert: {
          altitude_group?: string | null
          altitude_range?: string | null
          id?: number
          shuttles_to_add?: number | null
        }
        Update: {
          altitude_group?: string | null
          altitude_range?: string | null
          id?: number
          shuttles_to_add?: number | null
        }
        Relationships: []
      }
      non_locality_bah_rates: {
        Row: {
          bah_rc_t_with_dependents_rate: number | null
          bah_rc_t_without_dependents_rate: number | null
          differential_rate: number | null
          id: number
          partial_rate: number | null
          pay_grade: string | null
        }
        Insert: {
          bah_rc_t_with_dependents_rate?: number | null
          bah_rc_t_without_dependents_rate?: number | null
          differential_rate?: number | null
          id?: number
          partial_rate?: number | null
          pay_grade?: string | null
        }
        Update: {
          bah_rc_t_with_dependents_rate?: number | null
          bah_rc_t_without_dependents_rate?: number | null
          differential_rate?: number | null
          id?: number
          partial_rate?: number | null
          pay_grade?: string | null
        }
        Relationships: []
      }
      pay_help_details: {
        Row: {
          calculation_details: string | null
          example: string | null
          id: number
          purpose_description: string | null
          recipient_group: string | null
          report_section: string | null
          title: string | null
        }
        Insert: {
          calculation_details?: string | null
          example?: string | null
          id: number
          purpose_description?: string | null
          recipient_group?: string | null
          report_section?: string | null
          title?: string | null
        }
        Update: {
          calculation_details?: string | null
          example?: string | null
          id?: number
          purpose_description?: string | null
          recipient_group?: string | null
          report_section?: string | null
          title?: string | null
        }
        Relationships: []
      }
      pt_age_sex_groups: {
        Row: {
          age_range: string | null
          id: number
          sex: string | null
        }
        Insert: {
          age_range?: string | null
          id?: number
          sex?: string | null
        }
        Update: {
          age_range?: string | null
          id?: number
          sex?: string | null
        }
        Relationships: []
      }
      pt_cardio_respiratory_standards: {
        Row: {
          age_sex_group_id: number | null
          health_risk_category: string | null
          id: number
          points: number | null
          run_time: string | null
          shuttles_range: string | null
        }
        Insert: {
          age_sex_group_id?: number | null
          health_risk_category?: string | null
          id?: number
          points?: number | null
          run_time?: string | null
          shuttles_range?: string | null
        }
        Update: {
          age_sex_group_id?: number | null
          health_risk_category?: string | null
          id?: number
          points?: number | null
          run_time?: string | null
          shuttles_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_cardio_respiratory_standards_age_sex_group_id_fkey"
            columns: ["age_sex_group_id"]
            isOneToOne: false
            referencedRelation: "pt_age_sex_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_help_details: {
        Row: {
          content_key: string | null
          id: number
          section_content: string | null
          section_header: string | null
          title: string | null
        }
        Insert: {
          content_key?: string | null
          id: number
          section_content?: string | null
          section_header?: string | null
          title?: string | null
        }
        Update: {
          content_key?: string | null
          id?: number
          section_content?: string | null
          section_header?: string | null
          title?: string | null
        }
        Relationships: []
      }
      pt_muscular_fitness_standards: {
        Row: {
          age_sex_group_id: number | null
          exercise_type: string | null
          id: number
          points: number | null
          reps: string | null
          time: string | null
        }
        Insert: {
          age_sex_group_id?: number | null
          exercise_type?: string | null
          id?: number
          points?: number | null
          reps?: string | null
          time?: string | null
        }
        Update: {
          age_sex_group_id?: number | null
          exercise_type?: string | null
          id?: number
          points?: number | null
          reps?: string | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_muscular_fitness_standards_age_sex_group_id_fkey"
            columns: ["age_sex_group_id"]
            isOneToOne: false
            referencedRelation: "pt_age_sex_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      reserve_drill_pay: {
        Row: {
          pay_grade: string
          yos_gt_10: number | null
          yos_gt_12: number | null
          yos_gt_14: number | null
          yos_gt_16: number | null
          yos_gt_18: number | null
          yos_gt_2: number | null
          yos_gt_20: number | null
          yos_gt_22: number | null
          yos_gt_24: number | null
          yos_gt_26: number | null
          yos_gt_28: number | null
          yos_gt_3: number | null
          yos_gt_30: number | null
          yos_gt_32: number | null
          yos_gt_34: number | null
          yos_gt_36: number | null
          yos_gt_38: number | null
          yos_gt_4: number | null
          yos_gt_40: number | null
          yos_gt_6: number | null
          yos_gt_8: number | null
          yos_le_2: number | null
        }
        Insert: {
          pay_grade: string
          yos_gt_10?: number | null
          yos_gt_12?: number | null
          yos_gt_14?: number | null
          yos_gt_16?: number | null
          yos_gt_18?: number | null
          yos_gt_2?: number | null
          yos_gt_20?: number | null
          yos_gt_22?: number | null
          yos_gt_24?: number | null
          yos_gt_26?: number | null
          yos_gt_28?: number | null
          yos_gt_3?: number | null
          yos_gt_30?: number | null
          yos_gt_32?: number | null
          yos_gt_34?: number | null
          yos_gt_36?: number | null
          yos_gt_38?: number | null
          yos_gt_4?: number | null
          yos_gt_40?: number | null
          yos_gt_6?: number | null
          yos_gt_8?: number | null
          yos_le_2?: number | null
        }
        Update: {
          pay_grade?: string
          yos_gt_10?: number | null
          yos_gt_12?: number | null
          yos_gt_14?: number | null
          yos_gt_16?: number | null
          yos_gt_18?: number | null
          yos_gt_2?: number | null
          yos_gt_20?: number | null
          yos_gt_22?: number | null
          yos_gt_24?: number | null
          yos_gt_26?: number | null
          yos_gt_28?: number | null
          yos_gt_3?: number | null
          yos_gt_30?: number | null
          yos_gt_32?: number | null
          yos_gt_34?: number | null
          yos_gt_36?: number | null
          yos_gt_38?: number | null
          yos_gt_4?: number | null
          yos_gt_40?: number | null
          yos_gt_6?: number | null
          yos_gt_8?: number | null
          yos_le_2?: number | null
        }
        Relationships: []
      }
      retirement_help_details: {
        Row: {
          calculation_details: string | null
          content_key: string | null
          example: string | null
          id: number
          purpose_description: string | null
          title: string | null
        }
        Insert: {
          calculation_details?: string | null
          content_key?: string | null
          example?: string | null
          id: number
          purpose_description?: string | null
          title?: string | null
        }
        Update: {
          calculation_details?: string | null
          content_key?: string | null
          example?: string | null
          id?: number
          purpose_description?: string | null
          title?: string | null
        }
        Relationships: []
      }
      run_altitude_adjustments: {
        Row: {
          altitude_group: string | null
          altitude_range: string | null
          correction: number | null
          id: number
          time_range_end: number | null
          time_range_start: number | null
        }
        Insert: {
          altitude_group?: string | null
          altitude_range?: string | null
          correction?: number | null
          id?: number
          time_range_end?: number | null
          time_range_start?: number | null
        }
        Update: {
          altitude_group?: string | null
          altitude_range?: string | null
          correction?: number | null
          id?: number
          time_range_end?: number | null
          time_range_start?: number | null
        }
        Relationships: []
      }
      state_tax_data: {
        Row: {
          amt_exemption: number | null
          filing_status: string | null
          id: number
          "Income at Max Credit_No Children": number | null
          "Income at Max Credit_One Child": number | null
          "Income at Max Credit_Three or More Children": number | null
          "Income at Max Credit_Two Children": number | null
          income_bracket_high: string | null
          income_bracket_low: number | null
          "Maximum Credit_No Children": number | null
          "Maximum Credit_One Child": number | null
          "Maximum Credit_Three or More Children": number | null
          "Maximum Credit_Two Children": number | null
          personal_exemption: number | null
          "Phaseout Begins_No Children": number | null
          "Phaseout Begins_One Child": number | null
          "Phaseout Begins_Three or More Children": number | null
          "Phaseout Begins_Two Children": number | null
          "Phaseout Ends (Credit Equals Zero)_No Children": number | null
          "Phaseout Ends (Credit Equals Zero)_One Child": number | null
          "Phaseout Ends (Credit Equals Zero)_Three or More Children":
            | number
            | null
          "Phaseout Ends (Credit Equals Zero)_Two Children": number | null
          standard_deduction: number | null
          state: string | null
          tax_rate: number | null
          year: number | null
        }
        Insert: {
          amt_exemption?: number | null
          filing_status?: string | null
          id?: number
          "Income at Max Credit_No Children"?: number | null
          "Income at Max Credit_One Child"?: number | null
          "Income at Max Credit_Three or More Children"?: number | null
          "Income at Max Credit_Two Children"?: number | null
          income_bracket_high?: string | null
          income_bracket_low?: number | null
          "Maximum Credit_No Children"?: number | null
          "Maximum Credit_One Child"?: number | null
          "Maximum Credit_Three or More Children"?: number | null
          "Maximum Credit_Two Children"?: number | null
          personal_exemption?: number | null
          "Phaseout Begins_No Children"?: number | null
          "Phaseout Begins_One Child"?: number | null
          "Phaseout Begins_Three or More Children"?: number | null
          "Phaseout Begins_Two Children"?: number | null
          "Phaseout Ends (Credit Equals Zero)_No Children"?: number | null
          "Phaseout Ends (Credit Equals Zero)_One Child"?: number | null
          "Phaseout Ends (Credit Equals Zero)_Three or More Children"?:
            | number
            | null
          "Phaseout Ends (Credit Equals Zero)_Two Children"?: number | null
          standard_deduction?: number | null
          state?: string | null
          tax_rate?: number | null
          year?: number | null
        }
        Update: {
          amt_exemption?: number | null
          filing_status?: string | null
          id?: number
          "Income at Max Credit_No Children"?: number | null
          "Income at Max Credit_One Child"?: number | null
          "Income at Max Credit_Three or More Children"?: number | null
          "Income at Max Credit_Two Children"?: number | null
          income_bracket_high?: string | null
          income_bracket_low?: number | null
          "Maximum Credit_No Children"?: number | null
          "Maximum Credit_One Child"?: number | null
          "Maximum Credit_Three or More Children"?: number | null
          "Maximum Credit_Two Children"?: number | null
          personal_exemption?: number | null
          "Phaseout Begins_No Children"?: number | null
          "Phaseout Begins_One Child"?: number | null
          "Phaseout Begins_Three or More Children"?: number | null
          "Phaseout Begins_Two Children"?: number | null
          "Phaseout Ends (Credit Equals Zero)_No Children"?: number | null
          "Phaseout Ends (Credit Equals Zero)_One Child"?: number | null
          "Phaseout Ends (Credit Equals Zero)_Three or More Children"?:
            | number
            | null
          "Phaseout Ends (Credit Equals Zero)_Two Children"?: number | null
          standard_deduction?: number | null
          state?: string | null
          tax_rate?: number | null
          year?: number | null
        }
        Relationships: []
      }
      tax_data_22zpallagi: {
        Row: {
          a00100: number | null
          a00101: number | null
          a00200: number | null
          a00300: number | null
          a00400: number | null
          a00600: number | null
          a00650: number | null
          a00700: number | null
          a00900: number | null
          a01000: number | null
          a01400: number | null
          a01700: number | null
          a02300: number | null
          a02500: number | null
          a02650: number | null
          a02900: number | null
          a03150: number | null
          a03210: number | null
          a03220: number | null
          a03270: number | null
          a03300: number | null
          a04100: number | null
          a04200: number | null
          a04450: number | null
          a04470: number | null
          a04475: number | null
          a04800: number | null
          a05780: number | null
          a05800: number | null
          a06500: number | null
          a07100: number | null
          a07180: number | null
          a07225: number | null
          a07230: number | null
          a07240: number | null
          a07260: number | null
          a07300: number | null
          a09400: number | null
          a09600: number | null
          a10300: number | null
          a10600: number | null
          a10960: number | null
          a11070: number | null
          a11560: number | null
          a11900: number | null
          a11901: number | null
          a11902: number | null
          a12000: number | null
          a17000: number | null
          a18300: number | null
          a18425: number | null
          a18450: number | null
          a18460: number | null
          a18500: number | null
          a18800: number | null
          a19300: number | null
          a19500: number | null
          a19530: number | null
          a19570: number | null
          a19700: number | null
          a20950: number | null
          a25870: number | null
          a26270: number | null
          a59660: number | null
          a59661: number | null
          a59662: number | null
          a59663: number | null
          a59664: number | null
          a59720: number | null
          a85300: number | null
          a85530: number | null
          a85770: number | null
          a85775: number | null
          agi_stub: number
          cprep: number | null
          dir_dep: number | null
          elderly: number | null
          elf: number | null
          mars1: number | null
          mars2: number | null
          mars4: number | null
          n00200: number | null
          n00300: number | null
          n00400: number | null
          n00600: number | null
          n00650: number | null
          n00700: number | null
          n00900: number | null
          n01000: number | null
          n01400: number | null
          n01700: number | null
          n02300: number | null
          n02500: number | null
          n02650: number | null
          n02900: number | null
          n03150: number | null
          n03210: number | null
          n03220: number | null
          n03270: number | null
          n03300: number | null
          n04100: number | null
          n04200: number | null
          n04450: number | null
          n04470: number | null
          n04475: number | null
          n04800: number | null
          n05780: number | null
          n05800: number | null
          n06500: number | null
          n07100: number | null
          n07180: number | null
          n07225: number | null
n07230: number | null
          n07240: number | null
          n07260: number | null
          n07300: number | null
          n09400: number | null
          n09600: number | null
          n1: number | null
          n10300: number | null
          n10600: number | null
          n10960: number | null
          n11070: number | null
          n11560: number | null
          n11900: number | null
          n11901: number | null
          n11902: number | null
          n12000: number | null
          n17000: number | null
          n18300: number | null
          n18425: number | null
          n18450: number | null
          n18460: number | null
          n18500: number | null
          n18800: number | null
          n19300: number | null
          n19500: number | null
          n19530: number | null
          n19570: number | null
          n19700: number | null
          n2: number | null
          n20950: number | null
          n25870: number | null
          n26270: number | null
          n59660: number | null
          n59661: number | null
          n59662: number | null
          n59663: number | null
          n59664: number | null
          n59720: number | null
          n85300: number | null
          n85530: number | null
          n85770: number | null
          n85775: number | null
          prep: number | null
          rac: number | null
          schf: number | null
          state: string | null
          statefips: string | null
          tce: number | null
          total_vita: number | null
          vita: number | null
          vita_eic: number | null
          vrtcrind: number | null
          zipcode: number
        }
        Insert: {
          a00100?: number | null
          a00101?: number | null
          a00200?: number | null
          a00300?: number | null
          a00400?: number | null
          a00600?: number | null
          a00650?: number | null
          a00700?: number | null
          a00900?: number | null
          a01000?: number | null
          a01400?: number | null
          a01700?: number | null
          a02300?: number | null
          a02500?: number | null
          a02650?: number | null
          a02900?: number | null
          a03150?: number | null
          a03210?: number | null
          a03220?: number | null
          a03270?: number | null
          a03300?: number | null
          a04100?: number | null
          a04200?: number | null
          a04450?: number | null
          a04470?: number | null
          a04475?: number | null
          a04800?: number | null
          a05780?: number | null
          a05800?: number | null
          a06500?: number | null
          a07100?: number | null
          a07180?: number | null
          a07225?: number | null
          a07230?: number | null
          a07240?: number | null
          a07260?: number | null
          a07300?: number | null
          a09400?: number | null
          a09600?: number | null
          a10300?: number | null
          a10600?: number | null
          a10960?: number | null
          a11070?: number | null
          a11560?: number | null
          a11900?: number | null
          a11901?: number | null
          a11902?: number | null
          a12000?: number | null
          a17000?: number | null
          a18300?: number | null
          a18425?: number | null
          a18450?: number | null
          a18460?: number | null
          a18500?: number | null
          a18800?: number | null
          a19300?: number | null
          a19500?: number | null
          a19530?: number | null
          a19570?: number | null
          a19700?: number | null
          a20950?: number | null
          a25870?: number | null
          a26270?: number | null
          a59660?: number | null
          a59661?: number | null
          a59662?: number | null
          a59663?: number | null
          a59664?: number | null
          a59720?: number | null
          a85300?: number | null
          a85530?: number | null
          a85770?: number | null
          a85775?: number | null
          agi_stub: number
          cprep?: number | null
          dir_dep?: number | null
          elderly?: number | null
          elf?: number | null
          mars1?: number | null
          mars2?: number | null
          mars4?: number | null
          n00200?: number | null
          n00300?: number | null
          n00400?: number | null
          n00600?: number | null
          n00650?: number | null
          n00700?: number | null
          n00900?: number | null
          n01000?: number | null
          n01400?: number | null
          n01700?: number | null
          n02300?: number | null
          n02500?: number | null
          n02650?: number | null
          n02900?: number | null
          n03150?: number | null
          n03210?: number | null
          n03220?: number | null
          n03270?: number | null
          n03300?: number | null
          n04100?: number | null
          n04200?: number | null
          n04450?: number | null
          n04470?: number | null
          n04475?: number | null
          n04800?: number | null
          n05780?: number | null
          n05800?: number | null
          n06500?: number | null
          n07100?: number | null
          n07180?: number | null
          n07225?: number | null
          n07230?: number | null
          n07240?: number | null
          n07260?: number | null
          n07300?: number | null
          n09400?: number | null
          n09600?: number | null
          n1?: number | null
          n10300?: number | null
          n10600?: number | null
          n10960?: number | null
          n11070?: number | null
          n11560?: number | null
          n11900?: number | null
          n11901?: number | null
          n11902?: number | null
          n12000?: number | null
          n17000?: number | null
          n18300?: number | null
          n18425?: number | null
          n18450?: number | null
          n18460?: number | null
          n18500?: number | null
          n18800?: number | null
          n19300?: number | null
          n19500?: number | null
          n19530?: number | null
          n19570?: number | null
          n19700?: number | null
          n2?: number | null
          n20950?: number | null
          n25870?: number | null
          n26270?: number | null
          n59660?: number | null
          n59661?: number | null
          n59662?: number | null
          n59663?: number | null
          n59664?: number | null
          n59720?: number | null
          n85300?: number | null
          n85530?: number | null
          n85770?: number | null
          n85775?: number | null
          prep?: number | null
          rac?: number | null
          schf?: number | null
          state?: string | null
          statefips?: string | null
          tce?: number | null
          total_vita?: number | null
          vita?: number | null
          vita_eic?: number | null
          vrtcrind?: number | null
          zipcode: number
        }
        Update: {
          a00100?: number | null
          a00101?: number | null
          a00200?: number | null
          a00300?: number | null
          a00400?: number | null
          a00600?: number | null
          a00650?: number | null
          a00700?: number | null
          a00900?: number | null
          a01000?: number | null
          a01400?: number | null
          a01700?: number | null
          a02300?: number | null
          a02500?: number | null
          a02650?: number | null
          a02900?: number | null
          a03150?: number | null
          a03210?: number | null
          a03220?: number | null
          a03270?: number | null
          a03300?: number | null
          a04100?: number | null
          a04200?: number | null
          a04450?: number | null
          a04470?: number | null
          a04475?: number | null
          a04800?: number | null
          a05780?: number | null
          a05800?: number | null
          a06500?: number | null
          a07100?: number | null
          a07180?: number | null
          a07225?: number | null
          a07230?: number | null
          a07240?: number | null
          a07260?: number | null
          a07300?: number | null
          a09400?: number | null
          a09600?: number | null
          a10300?: number | null
          a10600?: number | null
          a10960?: number | null
          a11070?: number | null
          a11560?: number | null
          a11900?: number | null
          a11901?: number | null
          a11902?: number | null
          a12000?: number | null
          a17000?: number | null
          a18300?: number | null
          a18425?: number | null
          a18450?: number | null
a18460?: number | null
          a18500?: number | null
          a18800?: number | null
          a19300?: number | null
          a19500?: number | null
          a19530?: number | null
          a19570?: number | null
          a19700?: number | null
          a20950?: number | null
          a25870?: number | null
          a26270?: number | null
          a59660?: number | null
          a59661?: number | null
          a59662?: number | null
          a59663?: number | null
          a59664?: number | null
          a59720?: number | null
          a85300?: number | null
          a85530?: number | null
          a85770?: number | null
          a85775?: number | null
          agi_stub?: number
          cprep?: number | null
          dir_dep?: number | null
          elderly?: number | null
          elf?: number | null
          mars1?: number | null
          mars2?: number | null
          mars4?: number | null
          n00200?: number | null
          n00300?: number | null
          n00400?: number | null
          n00600?: number | null
          n00650?: number | null
          n00700?: number | null
          n00900?: number | null
          n01000?: number | null
          n01400?: number | null
          n01700?: number | null
          n02300?: number | null
          n02500?: number | null
          n02650?: number | null
          n02900?: number | null
          n03150?: number | null
          n03210?: number | null
          n03220?: number | null
          n03270?: number | null
          n03300?: number | null
          n04100?: number | null
          n04200?: number | null
          n04450?: number | null
          n04470?: number | null
          n04475?: number | null
          n04800?: number | null
          n05780?: number | null
          n05800?: number | null
          n06500?: number | null
          n07100?: number | null
          n07180?: number | null
          n07225?: number | null
          n07230?: number | null
          n07240?: number | null
          n07260?: number | null
          n07300?: number | null
          n09400?: number | null
          n09600?: number | null
          n1?: number | null
          n10300?: number | null
          n10600?: number | null
          n10960?: number | null
          n11070?: number | null
          n11560?: number | null
          n11900?: number | null
          n11901?: number | null
          n11902?: number | null
          n12000?: number | null
          n17000?: number | null
          n18300?: number | null
          n18425?: number | null
          n18450?: number | null
          n18460?: number | null
          n18500?: number | null
          n18800?: number | null
          n19300?: number | null
          n19500?: number | null
          n19530?: number | null
          n19570?: number | null
          n19700?: number | null
          n2?: number | null
          n20950?: number | null
          n25870?: number | null
          n26270?: number | null
          n59660?: number | null
          n59661?: number | null
          n59662?: number | null
          n59663?: number | null
          n59664?: number | null
          n59720?: number | null
          n85300?: number | null
          n85530?: number | null
          n85770?: number | null
          n85775?: number | null
          prep?: number | null
          rac?: number | null
          schf?: number | null
          state?: string | null
          statefips?: string | null
          tce?: number | null
          total_vita?: number | null
          vita?: number | null
          vita_eic?: number | null
          vrtcrind?: number | null
          zipcode?: number
        }
        Relationships: []
      }
      veterans_disability_compensation: {
        Row: {
          "10%": number | null
          "100%": number | null
          "20%": number | null
          "30%": number | null
          "40%": number | null
          "50%": number | null
          "60%": number | null
          "70%": number | null
          "80%": number | null
          "90%": number | null
          dependent_status: string
        }
        Insert: {
          "10%"?: number | null
          "100%"?: number | null
          "20%"?: number | null
          "30%"?: number | null
          "40%"?: number | null
          "50%"?: number | null
          "60%"?: number | null
          "70%"?: number | null
          "80%"?: number | null
          "90%"?: number | null
          dependent_status: string
        }
        Update: {
          "10%"?: number | null
          "100%"?: number | null
          "20%"?: number | null
          "30%"?: number | null
          "40%"?: number | null
          "50%"?: number | null
          "60%"?: number | null
          "70%"?: number | null
          "80%"?: number | null
          "90%"?: number | null
          dependent_status?: string
        }
        Relationships: []
      }
      walk_altitude_adjustments: {
        Row: {
          age_range_end: number | null
          age_range_start: number | null
          altitude_group: string | null
          altitude_range: string | null
          gender: string | null
          id: number
          max_time: number | null
        }
        Insert: {
          age_range_end?: number | null
          age_range_start?: number | null
          altitude_group?: string | null
          altitude_range?: string | null
          gender?: string | null
          id?: number
          max_time?: number | null
        }
        Update: {
          age_range_end?: number | null
          age_range_start?: number | null
          altitude_group?: string | null
          altitude_range?: string | null
          gender?: string | null
          id?: number
          max_time?: number | null
        }
        Relationships: []
      }
      walk_standards: {
        Row: {
          age_range: string | null
          gender: string | null
          id: number
          max_time: string | null
        }
        Insert: {
          age_range?: string | null
          gender?: string | null
          id?: number
          max_time?: string | null
        }
        Update: {
          age_range?: string | null
          gender?: string | null
          id?: number
          max_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      keep_alive: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
