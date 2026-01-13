'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { AnnouncementInsert, AnnouncementUpdate } from '@/app/lib/types/database'

const AnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  program_id: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  publish_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
})

export type AnnouncementFormState = {
  error?: string
  success?: boolean
}

export async function createAnnouncement(
  prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  const supabase = await createClient()

  try {
    const programId = formData.get('program_id') as string
    const publishAt = formData.get('publish_at') as string
    const expiresAt = formData.get('expires_at') as string

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string || null,
      image_url: formData.get('image_url') as string || null,
      program_id: programId && programId !== '' ? programId : null,
      is_published: formData.get('is_published') === 'true',
      is_pinned: formData.get('is_pinned') === 'true',
      publish_at: publishAt || null,
      expires_at: expiresAt || null,
    }

    const validated = AnnouncementSchema.parse(rawData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('announcements')
      .insert(validated)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/announcements')
    revalidatePath('/updates')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/admin/announcements')
}

export async function updateAnnouncement(
  id: string,
  prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  const supabase = await createClient()

  try {
    const programId = formData.get('program_id') as string
    const publishAt = formData.get('publish_at') as string
    const expiresAt = formData.get('expires_at') as string

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string || null,
      image_url: formData.get('image_url') as string || null,
      program_id: programId && programId !== '' ? programId : null,
      is_published: formData.get('is_published') === 'true',
      is_pinned: formData.get('is_pinned') === 'true',
      publish_at: publishAt || null,
      expires_at: expiresAt || null,
      updated_at: new Date().toISOString(),
    }

    const validated = AnnouncementSchema.parse(rawData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('announcements')
      .update(validated)
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/announcements')
    revalidatePath('/updates')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/admin/announcements')
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/updates')
  return { success: true }
}
