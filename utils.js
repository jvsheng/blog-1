/**
 * 1. 返回最近的包含该元素的定位元素
 * @param element
 * @returns {Element} offset parent
 * @example https://jsfiddle.net/Viajes/br6uw9vj/3/
 */
function getOffsetParent(element) {
  var offsetParent = element.offsetParent;
  return offsetParent === window.document.body || !offsetParent ? window.document.documentElement : offsetParent;
}