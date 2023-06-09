export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      debt: {
        Row: {
          created_at: string | null
          id: number
          room_number: number
          settled_period: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          room_number: number
          settled_period: string
        }
        Update: {
          created_at?: string | null
          id?: number
          room_number?: number
          settled_period?: string
        }
      }
      inventory: {
        Row: {
          created_at: string
          description: string
          given_date: string
          id: string
          room_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          given_date: string
          id?: string
          room_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          given_date?: string
          id?: string
          room_number?: number
          updated_at?: string
        }
      }
      resident: {
        Row: {
          created_at: string
          id: string
          moving_in: string
          moving_out: string | null
          nid: string | null
          resident_name: string
          room_number: number
          still_lives: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          moving_in: string
          moving_out?: string | null
          nid?: string | null
          resident_name: string
          room_number: number
          still_lives?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          moving_in?: string
          moving_out?: string | null
          nid?: string | null
          resident_name?: string
          room_number?: number
          still_lives?: boolean
          updated_at?: string
        }
      }
      room: {
        Row: {
          created_at: string | null
          id: number
          number: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          number: number
        }
        Update: {
          created_at?: string | null
          id?: number
          number?: number
        }
      }
      transaction: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          month: string
          note: string | null
          payment_type: string
          room_number: number
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          month: string
          note?: string | null
          payment_type: string
          room_number: number
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          month?: string
          note?: string | null
          payment_type?: string
          room_number?: number
        }
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
