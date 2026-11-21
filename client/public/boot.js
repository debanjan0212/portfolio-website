/* Runs before the first paint so the page never flashes the wrong theme. */
;(function () {
  try {
    var saved = localStorage.getItem("portfolio-theme")
    var light = saved ? saved === "light" : window.matchMedia("(prefers-color-scheme: light)").matches
    document.documentElement.dataset.theme = light ? "light" : "dark"
  } catch (e) {
    document.documentElement.dataset.theme = "dark"
  }
})()
