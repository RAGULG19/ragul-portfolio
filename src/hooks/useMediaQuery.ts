import { useCallback, useSyncExternalStore } from 'react'

/** SSR-safe media query hook with change listener (no render cascades). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onStoreChange)
      return () => media.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** True on devices with a real pointer (mouse) — false on touch. */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)')
}
