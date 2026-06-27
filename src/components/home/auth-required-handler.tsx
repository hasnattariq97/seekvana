'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export function AuthRequiredHandler() {
  const searchParams = useSearchParams()
  const { openAuthModal, user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user && searchParams.get('auth') === 'required') {
      openAuthModal()
    }
  }, [loading, user, searchParams, openAuthModal])

  return null
}
