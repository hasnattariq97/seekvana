/**
 * Passthrough. The auth redirect that used to live here moved into each
 * route's Suspense island (requireUser in src/lib/profile-data.ts) so the
 * profile shells stay static under cacheComponents while the auth-gated
 * data streams behind a skeleton. A logged-out visitor sees the skeleton
 * for one beat, then requireUser() redirects to /?auth=required.
 */
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
