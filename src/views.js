import { h } from 'hyperapp'
import { timeSince, decodeEntities } from './utils'

export const $nav = _ =>
  <nav>
    <wrapper->
      <icon->H</icon->
      <a href='/top'>Top</a>
      <a href='/new'>New</a>
      <a href='/show'>Show</a>
      <a href='/ask'>Ask</a>
      <a href='/job'>Jobs</a>
    </wrapper->
  </nav>

export const $storyListItem = item => item.id &&
  <li>
    <score->{item.score}</score->
    <article>
      <title->
        <a href={item.url
          ? item.url
          : `/item/${item.id}`
        }>{item.title}</a>
      </title->
      <meta->
        <span>by</span>
        <a href={`/user/${item.by}`}>{item.by}</a>
        <time->{timeSince(item.time)}</time->
        <span>|</span>
        <a href={`/item/${item.id}`}>{item.descendants} comments</a>
      </meta->
    </article>
  </li>

export const $storyItem = items => story => story.id &&
  <story->
    <header>
      <title->
        <a href={story.url
          ? story.url
          : `/item/${story.id}`
        }>{story.title}</a>
      </title->
      <meta->
        <score->{story.score} points</score->
        <span>|</span>
        <span>by</span>
        <a href={`/user/${story.by}`}>{story.by}</a>
        <time->{timeSince(story.time)}</time->
      </meta->
    </header>
    <comment-list>{
      story.kids && story.kids.map($commentItem(items))
    }</comment-list>
  </story->

export const $commentItem = items => id => items[id] &&
  <comment->
    <meta->
      <a href={`/user/${items[id].by}`}>{items[id].by}</a>
      <time->{timeSince(items[id].time)}</time->
    </meta->
    <text->{items[id].text}</text->
    <kids->{ items[id].kids && items[id].kids.map($commentItem(items)) }</kids->
  </comment->
