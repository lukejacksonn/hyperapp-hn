import { h } from 'hyperapp'

export const Fallback = (s,a) =>
  <h1 onclick={e => a.router.go('/')}>
    Back to {location.hostname}
  </h1>
