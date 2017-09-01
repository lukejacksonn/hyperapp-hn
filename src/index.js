import { h, app } from 'hyperapp'
import { Router } from '@hyperapp/router'

import './index.css'
import './startup.js'

import Linker from './mixins/linker'

import StoriesPage from './pages/stories'
import StoryPage from './pages/story'
import FallbackPage from './pages/fallback'

import { database, fetchItem, toObjectById, decodeTextAttribute } from './utils'

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
      items: Object.assign(s.items, toObjectById(
        items.map(decodeTextAttribute)
      ))
    }),
    fetchKids: (s,a,item) => _ =>
      item.kids &&
        Promise.all(item.kids.map(fetchItem(s.items)))
        .then(items => items.forEach(a.fetchKids) || items)
        .then(a.cacheItems),
    fetchStories: (s,a,type) => _ =>
      database.child(`${type}stories`).once('value')
        .then(snap => snap.val())
        .then(a.setStories)
        .then(({ stories }) => Promise.all(stories.map(fetchItem(s.items))))
        .then(a.cacheItems),
    fetchStory: (s,a,id) => _ =>
      fetchItem(s.items)(id)
        .then(a.setStory)
        .then(({ story }) => story)
        .then(a.fetchKids),
  },
  events: {
    route: [
      (s,a,d) => { d.match === '/' && a.fetchStories('top') },
      (s,a,d) => { d.match === '/:type' && a.fetchStories(d.params.type) },
      (s,a,d) => { d.match === '/item/:id' && a.fetchStory(d.params.id) },
    ],
  },
  view: [
    ['/', StoriesPage],
    ['/:type', StoriesPage],
    ['/item/:id', StoryPage],
    ['*', FallbackPage],
  ],
  mixins: [
    Router,
    Linker,
  ],
})
