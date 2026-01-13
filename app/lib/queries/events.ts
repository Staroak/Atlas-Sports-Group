import { createClient } from '@/app/lib/supabase/server'
import type { Event } from '@/app/lib/types/database'

export async function getPublishedEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date', { ascending: true })
      .limit(3)

    if (error) {
      console.error('Error fetching featured events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

// Admin queries - returns events with optional program join
export type EventWithProgram = Event & {
  programs?: { name: string } | null
}

export async function getAllEvents(): Promise<EventWithProgram[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*, programs(name)')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return (data || []) as EventWithProgram[]
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  return data
}
