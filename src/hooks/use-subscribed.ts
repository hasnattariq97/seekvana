'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'sk_subscribed'

// Read localStorage through useSyncExternalStore so the value is
// hydration-safe: the server snapshot is null (localStorage doesn't exist
// there) and the client's first render also uses null, matching the SSR
// HTML. React then swaps to the real value after hydration. This avoids the
// #418 mismatch a useState initializer caused, without a setState-in-effect
// that trips react-hooks/set-state-in-effect. Mirrors the useSyncExternalStore
// pattern already used in theme-toggle.tsx.

const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function getSnapshot(): boolean {
  return localStorage.getItem(KEY) === '1'
}

function getServerSnapshot(): boolean | null {
  return null
}

export function useSubscribed() {
  const subscribed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function setSubscribed() {
    localStorage.setItem(KEY, '1')
    listeners.forEach((l) => l())
  }

  return { subscribed, setSubscribed }
}
