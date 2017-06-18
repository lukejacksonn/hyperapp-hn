import firebase from 'firebase/app'
import 'firebase/database'

const app = firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com'
})

export const database = app.database()
