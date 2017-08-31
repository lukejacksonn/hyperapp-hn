import { h, app } from 'hyperapp'
import { Router } from '@hyperapp/router'

import { database } from './helpers/firebase'

import { Fallback } from './pages/fallback'
import { Stories } from './pages/stories'
import { Story } from './pages/story'

import './index.scss'

app({
  state: {
    item: {},
    items: {},
    comments: [],
  },
  actions: {
    addItem: (s,a,item) => ({ items: Object.assign(s.items, item) }),
    addComment: (s,a,comment) => ({ comments: Object.assign(s.comments, comment) }),
    setItems: (s,a,d) => ({ items: d }),
    setItem: (s,a,d) => ({ item: d }),
    setComments: (s,a,d) => ({ comments: d }),
    fetchItem: (s,a,id) => _ =>
      database.child(`item/${id}`).once('value')
        .then(snap => ({ [id]: snap.val() }))
        .catch(console.log),
    fetchItemComments: (s,a,d) => _ => {
      a.setItem(d)
      const comments = {}
      function fetchComments (d) {
        comments[d.id] = d
        if (d && d.kids) {
          return Promise.all(d.kids.map(id =>
            database.child(`item/${id}`).once('value')
            .then(snap => snap.val())
          )).then(kids => Promise.all(kids.map(fetchComments)))
        }
        return Promise.resolve()
      }
      return fetchComments(d)
        .then(() => comments)
    },
    fetchStories: (s,a,d) => _ =>
      database.child(`${d}stories`).once('value')
        .then(snap => snap.val())
        .then(data => Promise.all(data.map(a.fetchItem)))
        .then(stories => stories.map(a.addItem))
        .catch(console.log),
    fetchStory: (s,a,id) => update =>
      database.child(`item/${id}`).once('value')
        .then(x => x.val())
        .then(a.fetchItemComments)
        .then(a.setComments)
        .catch(console.log),
  },
  events: {
    route: [
      (s,a,d) => { d.match === '/' ? a.fetchStories('top') : null },
      (s,a,d) => { d.match === '/:type/:page' ? a.fetchStories(d.params.type) : null },
      (s,a,d) => { d.match === '/item/:id' ? a.fetchStory(d.params.id) : null },
    ],
    action: console.log,
    // update: (s,a,d) => d.comments && console.log(`
    //   count: ${Object.keys(d.comments).length}
    // `, d)
  },
  view: [
    ['/', Stories],
    ['/item/:id', Story],
    ['/:type/:page', Stories],
    ['*', Fallback],
  ],
  mixins: [
    Router
  ],
})
