import { useCallback, useSyncExternalStore } from 'react'

export type BreakpointResolution = 'mobile' | 'tablet' | 'laptop' | 'laptopL'

export type BreakpointState = {
  isMobile: boolean
  isTablet: boolean
  isLaptop: boolean
  isLaptopL: boolean
}

export const BREAKPOINTS: Record<BreakpointResolution, string> = {
  mobile: `(min-width: var(--breakpoint-sm))`,
  tablet: `(min-width: var(--breakpoint-md))`,
  laptop: `(min-width: var(--breakpoint-lg))`,
  laptopL: `(min-width: var(--breakpoint-xl))`,
}

export function useBreakpoint(): BreakpointState {
  const isMobile = useMediaQuery(BREAKPOINTS.mobile)
  const isTablet = useMediaQuery(BREAKPOINTS.tablet)
  const isLaptop = useMediaQuery(BREAKPOINTS.laptop)
  const isLaptopL = useMediaQuery(BREAKPOINTS.laptopL)

  return {
    isMobile,
    isTablet,
    isLaptop,
    isLaptopL,
  }
}

// https://github.com/uidotdev/usehooks/blob/main/index.js
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query)

      matchMedia.addEventListener('change', callback)
      return () => {
        matchMedia.removeEventListener('change', callback)
      }
    },
    [query],
  )

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  const getServerSnapshot = () => {
    throw Error('useMediaQuery is a client-only hook')
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
