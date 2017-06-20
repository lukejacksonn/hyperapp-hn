export default (options) => ({
  events: {
    loaded: (s,a) => addEventListener("click", (e) => {
      if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) return
      let target = e.target
      while (target && target.localName !== "a") target = target.parentNode
      if (target && target.host === location.host && !target.hasAttribute("data-no-routing")) {
        e.preventDefault()
        a.router.go(target.pathname)
      }
    })
  }
})
