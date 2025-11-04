/**
 * @property {number|string} price 价格，默认为0
 * @property {string} title 标题
 * @property {string} desc 描述
 * @property {string} dateTime 日期
 * @property {string} btnState 按钮状态
 */

export default {
  props: {
    price: {
      type: [Number, String],
      default: 0
    },
    title: String,
    desc: String,
    dateTime: String,
    btnState: {
      type: String,
      default: 'receive',
      validator(val) {
        return ['receive', 'use'].includes(val)
      }
    },
    couponData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    getBtnText() {
      const {remain, activityState, lineState} = this.couponData
      return activityState === 3 ? '活动结束' : lineState !== 1 ? '已失效' : remain === 0 ? '已经抢光' : '立即领取'
    },
    couponDisabled() {
      const {activityState, lineState, remain} = this.couponData
      const couponIsExpired = lineState !== 1
      const lootOut = remain === 0
      const activityIsOver = activityState == 3
      return activityIsOver || couponIsExpired || lootOut
    }
  },
  directives: {
    attrColor: {
      inserted: function (el, binding, vnode) {
        const {attrColorFn} = vnode.context
        attrColorFn({el, binding, vnode})
      },
      update: function (el, binding, vnode) {
        const {attrColorFn} = vnode.context
        attrColorFn({el, binding, vnode})
      }
    }
  },
  methods: {
    handleClick() {
      const clickable = !this.couponDisabled
      if (clickable) this.$emit('click')
    },
    attrColorFn({el, binding, vnode}) {
      const {arg, value} = binding
      const disabledStatus = this.couponDisabled
      if (disabledStatus) el.style[arg || 'color'] = value || '#cdcdcd'
    }
  }
}