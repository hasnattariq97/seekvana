'use client'

import { useEffect, useState } from 'react'

const KEY = 'sk_subscribed'

export function useSubscribed() {
  const [subscribed, setSubscribedState] = useState<boolean | null>(null)

  useEffect(() => {
    setSubscribedState(localStorage.getItem(KEY) === '1')
  }, [])

  function setSubscribed() {
    localStorage.setItem(KEY, '1')
    setSubscribedState(true)
  }

  return { subscribed, setSubscribed }
}
