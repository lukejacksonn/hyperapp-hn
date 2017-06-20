export const timeSince = (date) => {
  const z = (x, y) => x > 1 ? `${x} ${y}s ago` : `${x} ${y} ago`
  const x = Math.floor((new Date().getTime()/1000) - date)
  var i = Math.floor(x / 31536000); if (i >= 1) return z(i, 'year')
  i = Math.floor(x / 2592000); if (i >= 1) return z(i, 'month')
  i = Math.floor(x / 86400); if (i >= 1) return z(i, 'day')
  i = Math.floor(x / 3600); if (i >= 1) return z(i, 'hour')
  i = Math.floor(x / 60); if (i >= 1) return z(i, 'minute')
  if(Math.floor(x) < 1) return 'Just Now'
  return z(Math.floor(x), 'second')
}
