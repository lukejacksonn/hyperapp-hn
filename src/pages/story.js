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

export const Story = (s,a) =>
  <main>
    <Nav/>
    { s.item && s.item.id &&
      <header>
        <title->
          <a href={s.item.url
            ? s.item.url
            : `/item/${s.item.id}`
          }>{s.item.title}</a>
        </title->
        <meta->
          <score->{s.item.score} points</score->
          <span>|</span>
          <span>by</span>
          <a href={`/user/${s.item.by}`}>{s.item.by}</a>
          <time->{timeSince(s.item.time)}</time->
        </meta->
      </header>
    }
    <comment-list>{
      s.item && s.item.kids && s.item.kids.map(x =>
        !x.text ? '' :
        <comment->
          <meta->
            <a href={`/user/${x.by}`}>{x.by}</a>
            <time->{timeSince(x.time)}</time->
          </meta->
          <text->{decodeEntities(x.text)}</text->
        </comment->
      )
    }</comment-list>
  </main>
