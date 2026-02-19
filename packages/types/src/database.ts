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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bill: {
        Row: {
          amount: number
          assigned_to: string | null
          created_at: string
          created_by: string
          currency: string
          due_date: string
          household_id: string
          id: string
          name: string
          notes: string | null
          paid_at: string | null
          paid_by: string | null
          recurrence: Database["public"]["Enums"]["bill_recurrence"]
          status: Database["public"]["Enums"]["bill_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          assigned_to?: string | null
          created_at?: string
          created_by: string
          currency?: string
          due_date: string
          household_id: string
          id?: string
          name: string
          notes?: string | null
          paid_at?: string | null
          paid_by?: string | null
          recurrence?: Database["public"]["Enums"]["bill_recurrence"]
          status?: Database["public"]["Enums"]["bill_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          due_date?: string
          household_id?: string
          id?: string
          name?: string
          notes?: string | null
          paid_at?: string | null
          paid_by?: string | null
          recurrence?: Database["public"]["Enums"]["bill_recurrence"]
          status?: Database["public"]["Enums"]["bill_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      household: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      household_invite: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          code: string
          created_at: string
          email: string | null
          expires_at: string
          household_id: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["member_role"]
          status: Database["public"]["Enums"]["invite_status"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          code: string
          created_at?: string
          email?: string | null
          expires_at?: string
          household_id: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["invite_status"]
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          code?: string
          created_at?: string
          email?: string | null
          expires_at?: string
          household_id?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["invite_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_invite_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_invite_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_invite_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      household_item: {
        Row: {
          added_by: string
          assigned_to: string | null
          created_at: string
          household_id: string
          id: string
          name: string
          notes: string | null
          priority: Database["public"]["Enums"]["item_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["item_status"]
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string
        }
        Insert: {
          added_by: string
          assigned_to?: string | null
          created_at?: string
          household_id: string
          id?: string
          name: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["item_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["item_status"]
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
        }
        Update: {
          added_by?: string
          assigned_to?: string | null
          created_at?: string
          household_id?: string
          id?: string
          name?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["item_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["item_status"]
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_item_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_item_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_item_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
        ]
      }
      household_member: {
        Row: {
          created_at: string
          household_id: string
          id: string
          joined_at: string
          permissions: Json
          role: Database["public"]["Enums"]["member_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          household_id: string
          id?: string
          joined_at?: string
          permissions?: Json
          role?: Database["public"]["Enums"]["member_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          household_id?: string
          id?: string
          joined_at?: string
          permissions?: Json
          role?: Database["public"]["Enums"]["member_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_member_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      household_secret: {
        Row: {
          category: Database["public"]["Enums"]["secret_category"]
          created_at: string
          created_by: string
          household_id: string
          id: string
          label: string
          updated_at: string
          value_encrypted: string
          visible_to: string[]
        }
        Insert: {
          category?: Database["public"]["Enums"]["secret_category"]
          created_at?: string
          created_by: string
          household_id: string
          id?: string
          label: string
          updated_at?: string
          value_encrypted: string
          visible_to?: string[]
        }
        Update: {
          category?: Database["public"]["Enums"]["secret_category"]
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          label?: string
          updated_at?: string
          value_encrypted?: string
          visible_to?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "household_secret_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_secret_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          body: string | null
          created_at: string
          household_id: string | null
          id: string
          is_read: boolean
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          household_id?: string | null
          id?: string
          is_read?: boolean
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          household_id?: string | null
          id?: string
          is_read?: boolean
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminder: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          created_by: string
          due_at: string
          household_id: string
          id: string
          is_completed: boolean
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by: string
          due_at: string
          household_id: string
          id?: string
          is_completed?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string
          due_at?: string
          household_id?: string
          id?: string
          is_completed?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_checklist: {
        Row: {
          created_at: string
          created_by: string
          household_id: string
          id: string
          is_active: boolean
          recurrence: Database["public"]["Enums"]["recurrence_type"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          household_id: string
          id?: string
          is_active?: boolean
          recurrence?: Database["public"]["Enums"]["recurrence_type"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          is_active?: boolean
          recurrence?: Database["public"]["Enums"]["recurrence_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_checklist_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_checklist_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_checklist_item: {
        Row: {
          checklist_id: string
          completed_by: string | null
          created_at: string
          id: string
          label: string
          last_completed_at: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          checklist_id: string
          completed_by?: string | null
          created_at?: string
          id?: string
          label: string
          last_completed_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          checklist_id?: string
          completed_by?: string | null
          created_at?: string
          id?: string
          label?: string
          last_completed_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_checklist_item_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "routine_checklist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_checklist_item_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      urgent_problem: {
        Row: {
          created_at: string
          description: string
          household_id: string
          id: string
          is_active: boolean
          reported_by: string
          resolved_at: string | null
          resolved_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          household_id: string
          id?: string
          is_active?: boolean
          reported_by: string
          resolved_at?: string | null
          resolved_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          household_id?: string
          id?: string
          is_active?: boolean
          reported_by?: string
          resolved_at?: string | null
          resolved_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "urgent_problem_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "urgent_problem_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "urgent_problem_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invite: { Args: { p_invite_code: string }; Returns: Json }
      expire_pending_invites: { Args: never; Returns: number }
      get_checklist_completion: {
        Args: { p_checklist_id: string }
        Returns: {
          completed_by: string
          is_completed_this_cycle: boolean
          item_id: string
          label: string
          last_completed_at: string
          sort_order: number
        }[]
      }
      get_cycle_start: {
        Args: { p_recurrence: Database["public"]["Enums"]["recurrence_type"] }
        Returns: string
      }
      get_household_role: {
        Args: { p_household_id: string }
        Returns: Database["public"]["Enums"]["member_role"]
      }
      guest_has_permission: {
        Args: { p_household_id: string; p_level: string; p_section: string }
        Returns: boolean
      }
      is_household_member: {
        Args: { p_household_id: string }
        Returns: boolean
      }
      is_household_owner: { Args: { p_household_id: string }; Returns: boolean }
      prune_old_notifications: { Args: never; Returns: number }
    }
    Enums: {
      bill_recurrence: "one_off" | "weekly" | "monthly" | "quarterly" | "yearly"
      bill_status: "unpaid" | "paid" | "overdue" | "cancelled"
      invite_status: "pending" | "accepted" | "revoked" | "expired"
      item_priority: "low" | "medium" | "high"
      item_status: "pending" | "in_progress" | "done"
      item_type: "buy" | "repair" | "fix"
      member_role: "owner" | "member" | "guest"
      recurrence_type: "daily" | "weekly" | "monthly" | "custom"
      secret_category: "password" | "contact" | "code" | "other"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      bill_recurrence: ["one_off", "weekly", "monthly", "quarterly", "yearly"],
      bill_status: ["unpaid", "paid", "overdue", "cancelled"],
      invite_status: ["pending", "accepted", "revoked", "expired"],
      item_priority: ["low", "medium", "high"],
      item_status: ["pending", "in_progress", "done"],
      item_type: ["buy", "repair", "fix"],
      member_role: ["owner", "member", "guest"],
      recurrence_type: ["daily", "weekly", "monthly", "custom"],
      secret_category: ["password", "contact", "code", "other"],
    },
  },
} as const
