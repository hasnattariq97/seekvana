'use client'

import { useState, useEffect } from 'react'

const KEY = 'sk_subscribed'

export function useSubscribed() {
  // Start null on BOTH server and the client's first render so hydration
  // matches; read localStorage only after mount. Returning a client-only
  // value during the first render caused a #418 hydration mismatch that
  // aborted hydration and broke Speed Insights' vitals beacon.
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
