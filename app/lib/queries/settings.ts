import { createClient } from '@/app/lib/supabase/server'
import { REGISTRATION_STATUS, CONTACT_INFO } from '@/app/lib/constants'

export interface RegistrationStatus {
  isOpen: boolean
  openDate: string
  message: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
}

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('value')
      .eq('key', 'registration_status')
      .single()

    if (error || !data) {
      return REGISTRATION_STATUS
    }

    return data.value as RegistrationStatus
  } catch {
    return REGISTRATION_STATUS
  }
}

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('value')
      .eq('key', 'contact_info')
      .single()

    if (error || !data) {
      return CONTACT_INFO
    }

    return data.value as ContactInfo
  } catch {
    return CONTACT_INFO
  }
}

export async function getAllSettings() {
  const [registrationStatus, contactInfo] = await Promise.all([
    getRegistrationStatus(),
    getContactInfo(),
  ])

  return {
    registrationStatus,
    contactInfo,
  }
}
