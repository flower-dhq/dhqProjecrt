/**
 * 创建监听事件，会自动销毁监听事件
 * @example
 * ```js
 * export default {
 *   listener: {
 *     'event-on'() { },
 *     'event-once': {
 *       once: true,
 *       handle() { }
 *     }
 *   }
 * }
 * ```
 */
export default {
  created() {
    this.$custListener = {} // 需要在组件实例上注册该属性

    const listener = this.$options.listener // $options下的是源数据，不能做修改操作
    if (!listener || typeof(listener) != 'object') {
      console.error('【event-listener-mixin】请注意 $options.listener 格式是否正确')
      return
    }

    // 注册监听事件
    Object.keys(listener).forEach((eventName) => {
      const oldCallback = listener[eventName]

      if (typeof(oldCallback) == 'function') {
        const callback = this.$custListener[eventName] = oldCallback.bind(this)
        uni.$on(eventName, callback)
      } else if (oldCallback.once && typeof(oldCallback.handle) == 'function') {
        this.$custListener[eventName] = { once: true }
        const callback = this.$custListener[eventName].handle = oldCallback.handle.bind(this)
        uni.$once(eventName, callback)
      } else {
        console.error(`【event-listener-mixin】请注意 $options.listener.${eventName} 事件格式是否正确`)
      }
    })
  },
  beforeDestroy() {
    const listener = this.$custListener

    // 注销监听事件
    Object.keys(listener).forEach((eventName) => {
      const callback = listener[eventName]

      if (typeof(callback) == 'function') {
        uni.$off(eventName, callback)
      } else if (callback.once && typeof(callback.handle) == 'function') {
        uni.$off(eventName, callback.handle)
      }
    })
  }
}