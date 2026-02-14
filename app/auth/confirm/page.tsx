'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import type { EmailOtpType } from '@supabase/supabase-js'

function ConfirmFlow() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null

    if (!tokenHash || !type) {
      setError('Invalid confirmation link — missing token or type.')
      return
    }

    const supabase = createClient()

    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type })
      .then(({ error: otpError }) => {
        if (otpError) {
          console.error('OTP verification failed:', otpError.message)
          setError(otpError.message)
          return
        }

        // Invite users need to set password, everything else goes to dashboard
        if (type === 'invite') {
          router.replace('/admin/set-password')
        } else {
          router.replace('/admin/programs')
        }
      })
  }, [searchParams, router])

  if (error) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-atlas-navy">
          Confirmation Failed
        </h1>
        <p className="text-red-600 bg-red-50 p-4 rounded-md text-sm">
          {error}
        </p>
        <a
          href="/admin/login"
          className="text-sm text-blue-600 hover:underline"
        >
          Go to login
        </a>
      </div>
    )
  }

  return (
    <div className="text-center space-y-2">
      <div className="animate-spin h-8 w-8 border-4 border-atlas-navy border-t-transparent rounded-full mx-auto" />
      <p className="text-gray-600">Confirming your account...</p>
    </div>
  )
}

export default function AuthConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense
        fallback={
          <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-atlas-navy border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600">Loading...</p>
          </div>
        }
      >
        <ConfirmFlow />
      </Suspense>
    </div>
  )
}
