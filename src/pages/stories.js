import { h } from 'hyperapp'
import { Nav } from '../components/nav'
import { timeSince } from '../helpers/time'

const Item = ({data,actions}) =>
  <li>
    <score->{data.score}</score->
    <article>
      <title->
        <a href={data.url
          ? data.url
          : `/item/${data.id}`
        }>{data.title}</a>
      </title->
      <meta->
        <span>by</span>
        <a href={`/user/${data.by}`}>{data.by}</a>
        <time->{timeSince(data.time)}</time->
        <span>|</span>
        <a href={`/item/${data.id}`}>{data.descendants} comments</a>
      </meta->
    </article>
  </li>

const asArray = o => Object.keys(o).map(k => o[k])

const List = ({items={},actions}) =>
  <ul>{asArray(items).map(x => <Item data={x} actions={actions}/>)}</ul>

export const Stories = (s,a) =>
  <main>
    <Nav/>
    <List
      items={s.items}
      actions={a}
    />
  </main>
