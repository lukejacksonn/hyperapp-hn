import { h, app } from 'hyperapp'
import { Router } from '@hyperapp/router'

import { database } from './helpers/firebase'
import Linker from './plugins/linker'

import { Fallback } from './pages/fallback'
import { Stories } from './pages/stories'
import { Story } from './pages/story'

import './index.scss'

const fetchItem = items => id => items[id]
  ? Promise.resolve(items[id])
  : database.child(`item/${id}`).once('value')
      .then(snap => snap.val())

const toObjectById = array =>
  array.reduce((a,x) => Object.assign(a, { [x.id]: x }), {})

app({
  state: {
    items: {},
    stories: [],
    story: {},
  },
  actions: {
    setStories: (s,a,stories) => ({ stories }),
    setStory: (s,a,story) => ({ story }),
    cacheItems: (s,a,items) => ({
      items: Object.assign(s.items, toObjectById(items))
    }),
    fetchItemComments: (s,a,item) => _ =>
      item.kids &&
        Promise.all(item.kids.map(fetchItem(s.items)))
        .then(items => items.forEach(a.fetchItemComments) || items)
        .then(a.cacheItems),
    fetchStories: (s,a,category) => _ =>
      database.child(`${category}stories`).once('value')
        .then(snap => snap.val())
        .then(a.setStories)
        .then(({ stories }) => Promise.all(stories.map(fetchItem(s.items))))
        .then(a.cacheItems),
    fetchStory: (s,a,id) => _ =>
      fetchItem(s.items)(id)
        .then(a.setStory)
        .then(({ story }) => story)
        .then(a.fetchItemComments),
  },
  events: {
    route: [
      (s,a,d) => { d.match === '/' && a.fetchStories('top') },
      (s,a,d) => { d.match === '/:type' && a.fetchStories(d.params.type) },
      (s,a,d) => { d.match === '/item/:id' && a.fetchStory(d.params.id) },
    ],
  },
  view: [
    ['/', Stories],
    ['/item/:id', Story],
    ['/:type', Stories],
    ['*', Fallback],
  ],
  mixins: [
    Router,
    Linker,
  ],
})
