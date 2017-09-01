import { h } from 'hyperapp'
import { $nav, $storyListItem } from '../views'

export default (s,a) =>
  h('main', {}, [
    $nav(),
    h('ul', {}, s.stories.slice(0,20)
      .map(story => s.items[story] || {})
      .map($storyListItem)
    )
  ])
