import { h } from 'hyperapp'
import { Nav } from '../components/nav'
import { timeSince } from '../helpers/time'

var decodeEntities = html => {
  var element = document.createElement('div');
  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }
    return str;
  }
  return decodeHTMLEntities(html);
}

const $comment = items => id => items[id] &&
  <comment->
    <meta->
      <a href={`/user/${items[id].by}`}>{items[id].by}</a>
      <time->{timeSince(items[id].time)}</time->
    </meta->
    <text->{decodeEntities(items[id].text)}</text->
    <kids->{ items[id].kids && items[id].kids.map($comment(items)) }</kids->
  </comment->


export const Story = (s,a) =>
  <main>
    <Nav/>
    { s.story.id &&
      <header>
        <title->
          <a href={s.story.url
            ? s.story.url
            : `/item/${s.story.id}`
          }>{s.story.title}</a>
        </title->
        <meta->
          <score->{s.story.score} points</score->
          <span>|</span>
          <span>by</span>
          <a href={`/user/${s.story.by}`}>{s.story.by}</a>
          <time->{timeSince(s.story.time)}</time->
        </meta->
      </header>
    }
    <comment-list>{
      s.story.kids && s.story.kids.map($comment(s.items))
        // !x.text ? '' :
        // <comment->
        //   <meta->
        //     <a href={`/user/${x.by}`}>{x.by}</a>
        //     <time->{timeSince(x.time)}</time->
        //   </meta->
        //   <text->{decodeEntities(x.text)}</text->
        //   <kids->{ x.kids && x.kids.map(y => decodeEntities(y.text)) }</kids->
        // </comment->
      // )
    }</comment-list>
  </main>
