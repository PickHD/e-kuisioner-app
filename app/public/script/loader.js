(function loader() {
  const getLoadWrapper = document.querySelector(".loader-wrapper").style;
  if (!getLoadWrapper) {
    return;
  }
  getLoadWrapper.opacity = 1;
  (function fadeOut() { (getLoadWrapper.opacity -= .1) < 0 ? getLoadWrapper.display = "none" : setTimeout(fadeOut, 200); })();
}())