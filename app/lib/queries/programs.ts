import { createClient } from '@/app/lib/supabase/server'
import { PROGRAMS as FALLBACK_PROGRAMS } from '@/app/lib/constants'
import type { Program } from '@/app/lib/types/database'

// Convert database program to the format expected by existing components
function dbProgramToLegacy(program: Program) {
  return {
    id: program.id,
    name: program.name,
    slug: program.slug,
    tagline: program.tagline || '',
    description: program.description || '',
    logo: program.logo_url || '',
    youthAges: program.youth_ages || '',
    adultAges: program.adult_ages || undefined,
    features: program.features || [],
    benefits: program.benefits || [],
    whatYoullLearn: program.what_youll_learn || [],
    whatToBring: program.what_to_bring || [],
    schedule: program.schedule || '',
  }
}

export async function getPublishedPrograms() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (error || !data?.length) {
      console.warn('Using fallback programs data')
      return FALLBACK_PROGRAMS
    }

    return data.map(dbProgramToLegacy)
  } catch (error) {
    console.error('Database error, using fallback:', error)
    return FALLBACK_PROGRAMS
  }
}

export async function getProgramBySlug(slug: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      // Fallback to constants
      const fallbackProgram = FALLBACK_PROGRAMS.find((p) => p.slug === slug)
      return fallbackProgram || null
    }

    return dbProgramToLegacy(data)
  } catch (error) {
    console.error('Database error:', error)
    const fallbackProgram = FALLBACK_PROGRAMS.find((p) => p.slug === slug)
    return fallbackProgram || null
  }
}

// Admin queries - return raw database format
export async function getAllPrograms(): Promise<Program[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching programs:', error)
    return []
  }

  return data || []
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching program:', error)
    return null
  }

  return data
}

// Get all published program slugs for static generation
export async function getPublishedProgramSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await (supabase
      .from('programs')
      .select('slug')
      .eq('is_published', true) as any)

    if (error || !data?.length) {
      // Fallback to constants
      return FALLBACK_PROGRAMS.map((p) => p.slug)
    }

    return (data as { slug: string }[]).map((p) => p.slug)
  } catch (error) {
    console.error('Database error, using fallback slugs:', error)
    return FALLBACK_PROGRAMS.map((p) => p.slug)
  }
}
