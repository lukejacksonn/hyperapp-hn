import { h, app, Router } from 'hyperapp'

import { database } from './helpers/firebase'

import Linker from './plugins/linker'

import { Fallback } from './pages/fallback'
import { Stories } from './pages/stories'
import { Story } from './pages/story'

import './index.scss'

app({
  state: {
    item: {},
    items: [],
  },
  actions: {
    setItems: (s,a,d) => ({ items: d }),
    setItem: (s,a,d) => ({ item: d }),
    setItemComments: (s,a,d) => ({ item: Object.assign({}, s.item, { kids: d }) }),
    fetchItem: (s,a,d) =>
      database.child(`item/${d}`)
      .once('value')
      .then(snap => snap.val())
      .catch(console.log),
    fetchItemComments: (s,a,d) =>
      Promise.all(s.item.kids.map(a.fetchItem)),
    fetchStories: (s,a,d) =>
      database.child(`${d}stories`)
      .once('value')
      .then(snap => snap.val())
      .then(data => Promise.all(data.map(a.fetchItem)))
      .then(a.setItems)
      .catch(console.log),
    fetchStory: (s,a,d) =>
      a.fetchItem(d)
      .then(a.setItem)
      .then(a.fetchItemComments)
      .then(a.setItemComments)
      .catch(console.log),
  },
  events: {
    route: [
      (s,a,d) => d.match === '/' ? a.fetchStories('top') : null,
      (s,a,d) => d.match === '/:type/:page' ? a.fetchStories(d.params.type) : null,
      (s,a,d) => d.match === '/item/:id' ? a.fetchStory(d.params.id) : null,
    ]
  },
  view: [
    ['/', Stories],
    ['/item/:id', Story],
    ['/:type/:page', Stories],
    ['*', Fallback],
  ],
  mixins: [
    Router,
    Linker
  ],
})
