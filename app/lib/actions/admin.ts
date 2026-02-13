'use server'

import { createClient } from '@/app/lib/supabase/server'

export async function createAdminUser() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  // Check if admin_users row already exists (idempotent)
  const { data: existing } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return { success: true }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertError } = await (supabase
    .from('admin_users') as any)
    .insert({ user_id: user.id, role: 'admin' })

  if (insertError) {
    console.error('Failed to create admin_users row:', insertError.message)
    return { error: insertError.message }
  }

  return { success: true }
}
