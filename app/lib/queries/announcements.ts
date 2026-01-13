import { createClient } from '@/app/lib/supabase/server'
import type { Announcement } from '@/app/lib/types/database'

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${now}`)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching announcements:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export async function getLatestAnnouncements(limit: number = 3): Promise<Announcement[]> {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${now}`)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching announcements:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

// Admin queries - returns announcements with optional program join
export type AnnouncementWithProgram = Announcement & {
  programs?: { name: string } | null
}

export async function getAllAnnouncements(): Promise<AnnouncementWithProgram[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('announcements')
    .select('*, programs(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error)
    return []
  }

  return (data || []) as AnnouncementWithProgram[]
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching announcement:', error)
    return null
  }

  return data
}
