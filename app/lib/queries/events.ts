import { createClient } from '@/app/lib/supabase/server'
import type { Event } from '@/app/lib/types/database'

// Event with optional program info for linking
export type EventWithProgram = Event & {
  programs?: { name: string; slug: string } | null
}

export async function getPublishedEvents(): Promise<EventWithProgram[]> {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Get events where:
    // 1. start_date is today or in the future, OR
    // 2. end_date is today or in the future (ongoing multi-day events)
    // Join program data for linking
    const { data, error } = await supabase
      .from('events')
      .select('*, programs(name, slug)')
      .eq('is_published', true)
      .or(`start_date.gte.${today},end_date.gte.${today}`)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return (data || []) as EventWithProgram[]
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .or(`start_date.gte.${today},end_date.gte.${today}`)
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
export async function getAllEvents(): Promise<EventWithProgram[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*, programs(name, slug)')
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
