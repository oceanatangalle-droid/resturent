/**
 * Stub for @ant-design/cssinjs useHMR.
 * Next.js does not provide __webpack_require__.hmd, so we replace the real
 * useHMR with this noop to avoid "hmd is not a function" at runtime.
 */
function useHMR() {
  // noop
}
module.exports = useHMR
