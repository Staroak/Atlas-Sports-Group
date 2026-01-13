export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      programs: {
        Row: {
          id: string
          name: string
          slug: string
          tagline: string | null
          description: string | null
          logo_url: string | null
          youth_ages: string | null
          adult_ages: string | null
          features: string[]
          benefits: string[]
          what_youll_learn: string[]
          what_to_bring: string[]
          schedule: string | null
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          youth_ages?: string | null
          adult_ages?: string | null
          features?: string[]
          benefits?: string[]
          what_youll_learn?: string[]
          what_to_bring?: string[]
          schedule?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          youth_ages?: string | null
          adult_ages?: string | null
          features?: string[]
          benefits?: string[]
          what_youll_learn?: string[]
          what_to_bring?: string[]
          schedule?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          program_id: string | null
          start_date: string
          end_date: string | null
          start_time: string | null
          end_time: string | null
          is_all_day: boolean
          location: string | null
          is_published: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          program_id?: string | null
          start_date: string
          end_date?: string | null
          start_time?: string | null
          end_time?: string | null
          is_all_day?: boolean
          location?: string | null
          is_published?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          program_id?: string | null
          start_date?: string
          end_date?: string | null
          start_time?: string | null
          end_time?: string | null
          is_all_day?: boolean
          location?: string | null
          is_published?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          image_url: string | null
          program_id: string | null
          is_published: boolean
          is_pinned: boolean
          publish_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          image_url?: string | null
          program_id?: string | null
          is_published?: boolean
          is_pinned?: boolean
          publish_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          image_url?: string | null
          program_id?: string | null
          is_published?: boolean
          is_pinned?: boolean
          publish_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Program = Database['public']['Tables']['programs']['Row']
export type ProgramInsert = Database['public']['Tables']['programs']['Insert']
export type ProgramUpdate = Database['public']['Tables']['programs']['Update']

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type Announcement = Database['public']['Tables']['announcements']['Row']
export type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert']
export type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update']

export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
