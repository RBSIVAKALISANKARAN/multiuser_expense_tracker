export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          bio: string | null;
          phone_number: string | null;
          avatar_url: string | null;
          college_name: string | null;
          department: string | null;
          year_of_study: number | null;
          pg_name: string | null;
          pg_address: string | null;
          room_number: string | null;
          move_in_date: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          bio?: string | null;
          phone_number?: string | null;
          avatar_url?: string | null;
          college_name?: string | null;
          department?: string | null;
          year_of_study?: number | null;
          pg_name?: string | null;
          pg_address?: string | null;
          room_number?: string | null;
          move_in_date?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          bio?: string | null;
          phone_number?: string | null;
          avatar_url?: string | null;
          college_name?: string | null;
          department?: string | null;
          year_of_study?: number | null;
          pg_name?: string | null;
          pg_address?: string | null;
          room_number?: string | null;
          move_in_date?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          subcategory: string | null;
          amount: number;
          description: string | null;
          payment_mode: string;
          expense_date: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          subcategory?: string | null;
          amount: number;
          description?: string | null;
          payment_mode: string;
          expense_date: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          subcategory?: string | null;
          amount?: number;
          description?: string | null;
          payment_mode?: string;
          expense_date?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      income: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          amount: number;
          payment_mode: string | null;
          account_id: string | null;
          income_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          source: string;
          amount: number;
          payment_mode?: string | null;
          account_id?: string | null;
          income_date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          source?: string;
          amount?: number;
          payment_mode?: string | null;
          account_id?: string | null;
          income_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          is_achieved: boolean;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          is_achieved?: boolean;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          is_achieved?: boolean;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          frequency: string;
          next_due_date: string;
          category: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          frequency: string;
          next_due_date: string;
          category?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          frequency?: string;
          next_due_date?: string;
          category?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      roommates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          room_number: string | null;
          notes: string | null;
          balance: number;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone?: string | null;
          room_number?: string | null;
          notes?: string | null;
          balance?: number;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string | null;
          room_number?: string | null;
          notes?: string | null;
          balance?: number;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      shared_expenses: {
        Row: {
          id: string;
          user_id: string;
          roommate_id: string | null;
          description: string;
          total_amount: number;
          paid_by_user: boolean;
          split_type: string;
          your_share: number;
          their_share: number;
          is_settled: boolean;
          settled_date: string | null;
          expense_date: string;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          roommate_id?: string | null;
          description: string;
          total_amount: number;
          paid_by_user?: boolean;
          split_type?: string;
          your_share: number;
          their_share: number;
          is_settled?: boolean;
          settled_date?: string | null;
          expense_date: string;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          roommate_id?: string | null;
          description?: string;
          total_amount?: number;
          paid_by_user?: boolean;
          split_type?: string;
          your_share?: number;
          their_share?: number;
          is_settled?: boolean;
          settled_date?: string | null;
          expense_date?: string;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      mess_log: {
        Row: {
          id: string;
          user_id: string;
          provider_name: string | null;
          monthly_fee: number;
          start_date: string;
          is_active: boolean;
          off_days_count: number;
          expected_refund: number;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider_name?: string | null;
          monthly_fee: number;
          start_date: string;
          is_active?: boolean;
          off_days_count?: number;
          expected_refund?: number;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider_name?: string | null;
          monthly_fee?: number;
          start_date?: string;
          is_active?: boolean;
          off_days_count?: number;
          expected_refund?: number;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      health_log: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          hospital_pharmacy_name: string | null;
          doctor_name: string | null;
          medicine_name: string | null;
          medicine_dosage: string | null;
          medicine_duration: string | null;
          amount: number;
          payment_mode: string;
          visit_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          hospital_pharmacy_name?: string | null;
          doctor_name?: string | null;
          medicine_name?: string | null;
          medicine_dosage?: string | null;
          medicine_duration?: string | null;
          amount: number;
          payment_mode: string;
          visit_date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          hospital_pharmacy_name?: string | null;
          doctor_name?: string | null;
          medicine_name?: string | null;
          medicine_dosage?: string | null;
          medicine_duration?: string | null;
          amount?: number;
          payment_mode?: string;
          visit_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      academics_log: {
        Row: {
          id: string;
          user_id: string;
          semester: number;
          subject: string | null;
          item_name: string;
          item_type: string | null;
          amount: number;
          payment_mode: string;
          purchase_date: string;
          is_exam_fee: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          semester: number;
          subject?: string | null;
          item_name: string;
          item_type?: string | null;
          amount: number;
          payment_mode: string;
          purchase_date: string;
          is_exam_fee?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          semester?: number;
          subject?: string | null;
          item_name?: string;
          item_type?: string | null;
          amount?: number;
          payment_mode?: string;
          purchase_date?: string;
          is_exam_fee?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      social_log: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          person_name: string | null;
          place: string | null;
          people_count: number | null;
          description: string;
          amount: number;
          is_lent: boolean | null;
          is_returned: boolean;
          due_date: string | null;
          transaction_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          person_name?: string | null;
          place?: string | null;
          people_count?: number | null;
          description: string;
          amount: number;
          is_lent?: boolean | null;
          is_returned?: boolean;
          due_date?: string | null;
          transaction_date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          person_name?: string | null;
          place?: string | null;
          people_count?: number | null;
          description?: string;
          amount?: number;
          is_lent?: boolean | null;
          is_returned?: boolean;
          due_date?: string | null;
          transaction_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      shopping_log: {
        Row: {
          id: string;
          user_id: string;
          item_type: string;
          item_name: string;
          brand: string | null;
          color: string | null;
          size: string | null;
          occasion: string | null;
          amount: number;
          payment_mode: string;
          purchase_date: string;
          category: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: string;
          item_name: string;
          brand?: string | null;
          color?: string | null;
          size?: string | null;
          occasion?: string | null;
          amount: number;
          payment_mode: string;
          purchase_date: string;
          category?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: string;
          item_name?: string;
          brand?: string | null;
          color?: string | null;
          size?: string | null;
          occasion?: string | null;
          amount?: number;
          payment_mode?: string;
          purchase_date?: string;
          category?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Income = Database['public']['Tables']['income']['Row'];
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Roommate = Database['public']['Tables']['roommates']['Row'];
export type SharedExpense = Database['public']['Tables']['shared_expenses']['Row'];
export type MessLog = Database['public']['Tables']['mess_log']['Row'];
export type HealthLog = Database['public']['Tables']['health_log']['Row'];
export type AcademicsLog = Database['public']['Tables']['academics_log']['Row'];
export type SocialLog = Database['public']['Tables']['social_log']['Row'];
export type ShoppingLog = Database['public']['Tables']['shopping_log']['Row'];
