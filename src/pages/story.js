import { h } from 'hyperapp'
import { $nav, $storyItem } from '../views'

export default (s,a) =>
  h('main', {}, [
    $nav(),
    $storyItem(s.items)(s.story)
  ])
