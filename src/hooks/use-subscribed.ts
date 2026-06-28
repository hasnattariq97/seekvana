'use client'

import { useState } from 'react'

const KEY = 'sk_subscribed'

export function useSubscribed() {
  const [subscribed, setSubscribedState] = useState<boolean | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(KEY) === '1' : null
  )

  function setSubscribed() {
    localStorage.setItem(KEY, '1')
    setSubscribedState(true)
  }

  return { subscribed, setSubscribed }
}
