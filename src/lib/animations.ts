'use client'

const noop = (..._args: unknown[]) => {}
const noopCtx = () => ({ revert: noop })

const stubGsap = {
  fromTo: noop,
  from: noop,
  to: noop,
  registerPlugin: noop,
  context: (_: () => void, __?: unknown) => noopCtx(),
}

const stubScrollTrigger = {
  getAll: () => [] as { kill: () => void }[],
  registerPlugin: noop,
}

let gsapImpl: typeof stubGsap = stubGsap
let ScrollTriggerImpl: typeof stubScrollTrigger = stubScrollTrigger

// Lazy-load GSAP so it's not in the initial bundle (saves ~50kb+). Components should call ensureGSAP() before using gsap/ScrollTrigger.
let gsapPromise: Promise<void> | null = null

export function ensureGSAP(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (gsapImpl !== stubGsap) return Promise.resolve()
  if (gsapPromise) return gsapPromise
  gsapPromise = Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger').then((m) => m.ScrollTrigger),
  ]).then(([g, ST]) => {
    gsapImpl = g.default as typeof stubGsap
    ScrollTriggerImpl = ST as unknown as typeof stubScrollTrigger
    ;(gsapImpl as { registerPlugin: (p: unknown) => void }).registerPlugin(ScrollTriggerImpl)
  })
  return gsapPromise
}

// Proxies so callers always get the current impl (stub until ensureGSAP() resolves)
export const gsap = new Proxy(stubGsap, {
  get(_, key) {
    return (gsapImpl as Record<string, unknown>)[key as string]
  },
})

export const ScrollTrigger = new Proxy(stubScrollTrigger, {
  get(_, key) {
    return (ScrollTriggerImpl as Record<string, unknown>)[key as string]
  },
})

export function registerGSAP(): void {
  ensureGSAP()
}
