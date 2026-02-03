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

if (typeof window !== 'undefined') {
  const g = require('gsap')
  const st = require('gsap/ScrollTrigger').ScrollTrigger
  gsapImpl = g.default
  ScrollTriggerImpl = st
}

export const gsap = gsapImpl
export const ScrollTrigger = ScrollTriggerImpl

export function registerGSAP() {
  if (typeof window !== 'undefined' && gsapImpl !== stubGsap) {
    ;(gsapImpl as { registerPlugin: (p: unknown) => void }).registerPlugin(ScrollTriggerImpl)
  }
}
