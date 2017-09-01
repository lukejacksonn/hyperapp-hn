import { h } from 'hyperapp'

export default (s,a) =>
  h('h1', {},
    h('a', { href: '/' }, `Back to ${location.hostname}`)
  )
