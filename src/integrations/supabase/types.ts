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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_detail_level: string
          country: string | null
          created_at: string
          full_name: string | null
          goals: string[]
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          notify_risks: boolean
          notify_weather: boolean
          onboarding_completed: boolean
          timezone: string | null
          updated_at: string
        }
        Insert: {
          ai_detail_level?: string
          country?: string | null
          created_at?: string
          full_name?: string | null
          goals?: string[]
          id: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notify_risks?: boolean
          notify_weather?: boolean
          onboarding_completed?: boolean
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          ai_detail_level?: string
          country?: string | null
          created_at?: string
          full_name?: string | null
          goals?: string[]
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notify_risks?: boolean
          notify_weather?: boolean
          onboarding_completed?: boolean
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rainwater_plans: {
        Row: {
          ai_summary: string | null
          created_at: string
          efficiency: number | null
          estimated_harvest_liters: number | null
          expected_rainfall_mm: number | null
          id: string
          rainfall_data: Json
          recommended_storage_liters: number | null
          roof_area: number | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          efficiency?: number | null
          estimated_harvest_liters?: number | null
          expected_rainfall_mm?: number | null
          id?: string
          rainfall_data?: Json
          recommended_storage_liters?: number | null
          roof_area?: number | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          efficiency?: number | null
          estimated_harvest_liters?: number | null
          expected_rainfall_mm?: number | null
          id?: string
          rainfall_data?: Json
          recommended_storage_liters?: number | null
          roof_area?: number | null
          user_id?: string
        }
        Relationships: []
      }
      risk_alerts: {
        Row: {
          created_at: string
          explanation: string | null
          forecast_data: Json
          id: string
          location: string | null
          period: string | null
          recommendations: string[]
          risk_type: string
          severity: string
          user_id: string
        }
        Insert: {
          created_at?: string
          explanation?: string | null
          forecast_data?: Json
          id?: string
          location?: string | null
          period?: string | null
          recommendations?: string[]
          risk_type: string
          severity: string
          user_id: string
        }
        Update: {
          created_at?: string
          explanation?: string | null
          forecast_data?: Json
          id?: string
          location?: string | null
          period?: string | null
          recommendations?: string[]
          risk_type?: string
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      water_plans: {
        Row: {
          ai_summary: string | null
          created_at: string
          id: string
          plan_data: Json
          supply_duration_days: number | null
          user_id: string
          water_security_score: number | null
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          plan_data?: Json
          supply_duration_days?: number | null
          user_id: string
          water_security_score?: number | null
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          plan_data?: Json
          supply_duration_days?: number | null
          user_id?: string
          water_security_score?: number | null
        }
        Relationships: []
      }
      water_profiles: {
        Row: {
          available_water_liters: number
          collection_efficiency: number
          created_at: string
          daily_consumption_liters: number
          emergency_reserve_liters: number
          household_size: number
          household_type: string
          id: string
          rainwater_collection_enabled: string
          roof_area_m2: number
          roof_type: string
          storage_capacity_liters: number
          tank_capacity_liters: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_water_liters?: number
          collection_efficiency?: number
          created_at?: string
          daily_consumption_liters?: number
          emergency_reserve_liters?: number
          household_size?: number
          household_type?: string
          id?: string
          rainwater_collection_enabled?: string
          roof_area_m2?: number
          roof_type?: string
          storage_capacity_liters?: number
          tank_capacity_liters?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_water_liters?: number
          collection_efficiency?: number
          created_at?: string
          daily_consumption_liters?: number
          emergency_reserve_liters?: number
          household_size?: number
          household_type?: string
          id?: string
          rainwater_collection_enabled?: string
          roof_area_m2?: number
          roof_type?: string
          storage_capacity_liters?: number
          tank_capacity_liters?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
