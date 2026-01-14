'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { ProgramInsert, ProgramUpdate } from '@/app/lib/types/database'

// Helper to clean array fields - filters out null/undefined/empty values
const cleanStringArray = z.preprocess(
  (val) => {
    if (!Array.isArray(val)) return []
    return val.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
  },
  z.array(z.string())
)

const ProgramSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  youth_ages: z.string().optional().nullable(),
  adult_ages: z.string().optional().nullable(),
  features: cleanStringArray,
  benefits: cleanStringArray,
  what_youll_learn: cleanStringArray,
  what_to_bring: cleanStringArray,
  schedule: z.string().optional().nullable(),
  display_order: z.number().default(0),
  is_published: z.boolean().default(false),
})

export type ProgramFormState = {
  error?: string
  success?: boolean
}

export async function createProgram(
  prevState: ProgramFormState,
  formData: FormData
): Promise<ProgramFormState> {
  const supabase = await createClient()

  // Helper to safely parse JSON arrays, filtering out nulls
  const parseJsonArray = (value: FormDataEntryValue | null): unknown[] => {
    try {
      const parsed = JSON.parse((value as string) || '[]')
      return Array.isArray(parsed) ? parsed.filter((item) => item != null) : []
    } catch {
      return []
    }
  }

  try {
    const rawData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      tagline: formData.get('tagline') as string || null,
      description: formData.get('description') as string || null,
      logo_url: formData.get('logo_url') as string || null,
      youth_ages: formData.get('youth_ages') as string || null,
      adult_ages: formData.get('adult_ages') as string || null,
      features: parseJsonArray(formData.get('features')),
      benefits: parseJsonArray(formData.get('benefits')),
      what_youll_learn: parseJsonArray(formData.get('what_youll_learn')),
      what_to_bring: parseJsonArray(formData.get('what_to_bring')),
      schedule: formData.get('schedule') as string || null,
      display_order: parseInt(formData.get('display_order') as string || '0', 10),
      is_published: formData.get('is_published') === 'true',
    }

    const validated = ProgramSchema.parse(rawData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('programs')
      .insert(validated)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/programs')
    revalidatePath('/admin/programs')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/admin/programs')
}

export async function updateProgram(
  id: string,
  prevState: ProgramFormState,
  formData: FormData
): Promise<ProgramFormState> {
  const supabase = await createClient()

  // Helper to safely parse JSON arrays, filtering out nulls
  const parseJsonArray = (value: FormDataEntryValue | null): unknown[] => {
    try {
      const parsed = JSON.parse((value as string) || '[]')
      return Array.isArray(parsed) ? parsed.filter((item) => item != null) : []
    } catch {
      return []
    }
  }

  try {
    const rawData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      tagline: formData.get('tagline') as string || null,
      description: formData.get('description') as string || null,
      logo_url: formData.get('logo_url') as string || null,
      youth_ages: formData.get('youth_ages') as string || null,
      adult_ages: formData.get('adult_ages') as string || null,
      features: parseJsonArray(formData.get('features')),
      benefits: parseJsonArray(formData.get('benefits')),
      what_youll_learn: parseJsonArray(formData.get('what_youll_learn')),
      what_to_bring: parseJsonArray(formData.get('what_to_bring')),
      schedule: formData.get('schedule') as string || null,
      display_order: parseInt(formData.get('display_order') as string || '0', 10),
      is_published: formData.get('is_published') === 'true',
      updated_at: new Date().toISOString(),
    }

    const validated = ProgramSchema.parse(rawData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('programs')
      .update(validated)
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/programs')
    revalidatePath(`/programs/${validated.slug}`)
    revalidatePath('/admin/programs')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/admin/programs')
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  return { success: true }
}

export async function reorderPrograms(orderedIds: string[]) {
  const supabase = await createClient()

  for (let i = 0; i < orderedIds.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('programs')
      .update({ display_order: i })
      .eq('id', orderedIds[i])

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  return { success: true }
}
