'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { EventInsert, EventUpdate } from '@/app/lib/types/database'

const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  program_id: z.string().optional().nullable(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  is_all_day: z.boolean().default(false),
  location: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
})

export type EventFormState = {
  error?: string
  success?: boolean
}

export async function createEvent(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const supabase = await createClient()

  try {
    const programId = formData.get('program_id') as string
    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string || null,
      program_id: programId && programId !== '' ? programId : null,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string || null,
      start_time: formData.get('start_time') as string || null,
      end_time: formData.get('end_time') as string || null,
      is_all_day: formData.get('is_all_day') === 'true',
      location: formData.get('location') as string || null,
      is_published: formData.get('is_published') === 'true',
      is_featured: formData.get('is_featured') === 'true',
    }

    const validated = EventSchema.parse(rawData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('events')
      .insert(validated)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/events')
    revalidatePath('/programs')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/admin/events')
}

export async function updateEvent(
  id: string,
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const supabase = await createClient()

  try {
    const programId = formData.get('program_id') as string
    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string || null,
      program_id: programId && programId !== '' ? programId : null,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string || null,
      start_time: formData.get('start_time') as string || null,
      end_time: formData.get('end_time') as string || null,
      is_all_day: formData.get('is_all_day') === 'true',
      location: formData.get('location') as string || null,
      is_published: formData.get('is_published') === 'true',
      is_featured: formData.get('is_featured') === 'true',
      updated_at: new Date().toISOString(),
    }

    const validated = EventSchema.parse(rawData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('events')
      .update(validated)
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/events')
    revalidatePath('/programs')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/admin/events')
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/events')
  revalidatePath('/programs')
  return { success: true }
}
