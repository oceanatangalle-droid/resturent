'use client'

import type { RefObject } from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'

const defaultOpts: IntersectionObserverInit = {
  root: null,
  rootMargin: '200px 0px',
  threshold: 0,
}

/**
 * Returns [ref, inView]. Attach ref to a sentinel element; when it enters the viewport (with rootMargin),
 * inView becomes true. Optionally call onVisible() when first visible (e.g. to load more).
 */
export function useInView(
  onVisible?: () => void,
  opts: IntersectionObserverInit = {}
): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const called = useRef(false)
  const options = { ...defaultOpts, ...opts }

  const handleVisible = useCallback(() => {
    if (onVisible && !called.current) {
      called.current = true
      onVisible()
    }
    setInView(true)
  }, [onVisible])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) handleVisible()
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
  }, [options.root, options.rootMargin, options.threshold, handleVisible])

  return [ref, inView]
}

/**
 * Use for "load more" sentinel: when the sentinel enters view, callback runs. Pass a stable callback
 * that increases the visible count. Reset key when filters change so the sentinel can trigger again.
 */
export function useLoadMore(
  loadMore: () => void,
  enabled: boolean,
  opts: IntersectionObserverInit = {}
): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)
  const options = { ...defaultOpts, ...opts }

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) loadMore()
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, loadMore, options.root, options.rootMargin, options.threshold])

  return ref
}
