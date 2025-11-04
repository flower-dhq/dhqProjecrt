/**
 * 节流
 * @example
 * ```js
 * function fn(arg) {
 *   // ...
 * }
 * const examp = throttle(fn, 800)
 * ```
 * ```html
 * <div on-click="examp(arg)"></div>
 * ```
 */
export default function throttle(fn, wait = 1000) {
  let timeout
  return function() {
    let ctx = this
    let args = arguments

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        args = Array.from(args)
        fn.apply(ctx, args)
      }, wait)
    }
  }
}
