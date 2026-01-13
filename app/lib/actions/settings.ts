'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SettingsFormState = {
  error?: string
  success?: boolean
}

export async function updateRegistrationStatus(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const supabase = await createClient()

  try {
    const value = {
      isOpen: formData.get('is_open') === 'true',
      openDate: formData.get('open_date') as string || '',
      message: formData.get('message') as string || '',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert({
        key: 'registration_status',
        value,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/registration')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch {
    return { error: 'An unexpected error occurred' }
  }
}

export async function updateContactInfo(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const supabase = await createClient()

  try {
    const value = {
      email: formData.get('email') as string || '',
      serviceArea: formData.get('service_area') as string || '',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert({
        key: 'contact_info',
        value,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/settings')
    return { success: true }
  } catch {
    return { error: 'An unexpected error occurred' }
  }
}
