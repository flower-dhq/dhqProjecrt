<template>
  <view :class="['cell-text', getBorderClass, getCustomClass]" :style="[getContainerStyle]" @click="clickEvent">
    <view class="cell-text-panel">
      <view :class="['cell-text-label', { 'cell-text-label--auto': labelWidth == 'auto' }]" :style="[{ color: labelColor }, getLabelWidth, getLabelStyle]">
        <text v-if="getRequired.position === 'start'" class="cell-text-label--required">*</text>
        <text>{{ getRequired.label }}</text>
        <text v-if="getRequired.position === 'end'" class="cell-text-label--required">*</text>
      </view>
      <view class="cell-text-content" :style="[{ 'justify-content': contentAlign }]">
        <slot></slot>
      </view>
      <view class="cell-text-right" v-if="isRight">
        <slot name="right"></slot>
      </view>
    </view>
    <view class="cell-text-desc" v-if="isDesc" :style="[{ color: descColor }, getDescMarginLeft]">
      <slot name="desc"></slot>
    </view>
  </view>
</template>

<script>
/**
 * @property {string} label 左侧标题，如果要显示必填符号，则需要加上 *
 * @property {string} labelColor 左侧标题的文字颜色。默认 #A1A6BB
 * @property {number|string} labelWidth 左侧标题宽度，数字类型会转为 rpx 单位。默认 140rpx。可以是 auto 或 具体的值
 * @property {'flex-start'|'center'|'flex-end'} contentAlign 中间内容的水平对齐方式。默认 居左
 * @property {boolean} isRight 是否自定义右侧内容。默认 false 。需要先设置为 true ，才能去使用 slot="right"
 * @property {boolean} isDesc 是否自定义描述信息。默认 false 。需要先设置为 true ，才能去使用 slot="desc"
 * @property {string} descColor 描述信息的文字颜色。默认 #999999
 * @property {'label'|'content'} descAlign 描述信息的水平对齐方式。默认 label
 * @property {'bottom'|'none'} border 边框类型。默认 bottom
 * @property {number|string} padding 样式padding，数字类型会转为 rpx 单位。默认 { padding: 20rpx 0; }
 * @property {object|array|string} customClass cell-text 添加class
 * @property {object|string} customStyle cell-text 添加style
 * @property {object|string} labelStyle label 添加style。优先级比customStyle高
 * @event click
 * 
 * @slot default 中间位置的内容。（可用于 输入框，文字 等）
 * @slot right 右侧位置内容。（可用于 tag标签，icon图标 等）。注意，如果在 right 插槽里使用 u--input ，则需要把 .cell-text-right 设置为 "flex: 1 !important;"
 * @slot desc 最下面位置的描述信息。（可用户 输入框的错误信息描述 等）
 */
export default {
  name: 'CellText',
  props: {
    label: {
      type: String,
      default: ''
    },
    labelColor: {
      type: String,
      default: '#333'
    },
    labelWidth: {
      type: [Number, String],
      default: 140
    },
    contentAlign: {
      type: String,
      validator(val) {
        return ['flex-start', 'center', 'flex-end'].includes(val)
      },
      default: 'flex-start'
    },
    isRight: Boolean,
    isDesc: Boolean,
    descColor: {
      type: String,
      default: '#999999'
    },
    descAlign: {
      type: String,
      validator(val) {
        return ['label', 'content'].includes(val)
      },
      default: 'label'
    },
    border: {
      type: String,
      validator(val) {
        return ['bottom', 'none'].includes(val)
      },
      default: 'bottom'
    },
    padding: {
      type: [Number, String],
      default: '20rpx 0'
    },
    customClass: {
      type: [Object, Array, String],
      default: () => []
    },
    customStyle: {
      type: [Object, String],
      default: ''
    },
    labelStyle: {
      type: [Object, String],
      default: ''
    }
  },
  options: {
    virtualHost: true,
    multipleSlots: true
  },
  computed: {
    getBorderClass() {
      const border = this.border
      return border === 'bottom' ? 'cell-text-border--bottom' : border === 'none' ? 'cell-text-border--none' : 'cell-text-border--bottom'
    },
    getLabelWidth() {
      return { width: this.kindOf(this.labelWidth) === 'number' ? this.labelWidth + 'rpx' : this.labelWidth }
    },
    getLabelStyle() {
      let cst = this.labelStyle
      if (cst && this.kindOf(cst) == 'string') {
        return uni.$u.addStyle(cst, 'object')
      }
      return cst || {}
    },
    getRequired() {
      const labelTmp = this.label
      const length = labelTmp.length
      const position = labelTmp[0] === '*' ? 'start' : labelTmp[length - 1] === '*' ? 'end' : 'none'

      return {
        label: position === 'start' ? labelTmp.substring(1) : position === 'end' ? labelTmp.substring(0, length - 1) : labelTmp,
        isRequired: ['start', 'end'].includes(position),
        position
      }
    },
    getContainerStyle() {
      const padding = { padding: this.kindOf(this.padding) === 'number' ? this.padding + 'rpx' : this.padding }
      return uni.$u.deepMerge(this.getCustomStyle, padding)
    },
    getDescMarginLeft() {
      const descAlign = this.descAlign
      return { marginLeft: descAlign === 'content' ? this.getLabelWidth.width : '0rpx' }
    },
    getCustomClass() {
      let tmp = this.customClass
      if (this.kindOf(tmp) == 'string') {
        return tmp.trim().split(/\s+/)
      } else if (this.kindOf(tmp) == 'object') {
        return this.obj2Arr(tmp)
      }
      return tmp
    },
    getCustomStyle() {
      let cst = this.customStyle
      if (cst && this.kindOf(cst) == 'string') {
        return uni.$u.addStyle(cst, 'object')
      }
      return cst || {}
    }
  },
  methods: {
    kindOf(val) {
      return Object.prototype.toString.call(val)
        .replace(/^\[[a-z]+ ([a-z]+)\]$/i, '$1')
        .toLowerCase()
    },
    /**
     * 将数组转为对象
     */
    obj2Arr(target = {}) {
      let res = Object.keys(target).reduce((res, key) => {
        if (target[key]) {
          res.push(key)
        }
        return res
      }, [])
      return res
    },
    clickEvent() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-text {
  width: 100%;
  padding: 20rpx 0;
  font-size: inherit;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
}
.cell-text-panel {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
}
.cell-text-label {
  width: auto;
  display: inline-block;
  flex: 0 0 auto;
  min-height: 1rem;
  font-size: 28rpx;
  word-break: break-all;
  white-space: break-spaces;

  &.cell-text-label--auto {
    margin-right: 10rpx;
  }
}
.cell-text-label--required {
  color: #f56c6c;
}
.cell-text-content {
  flex: 1;
  flex-wrap: wrap;
  min-height: 1rem;
  word-break: break-all;
  font-size: inherit;
  display: flex;
  align-items: center;
  color: #a1a1a1;
}
.cell-text-right {
  flex: 0 0 auto;
  margin-left: 20rpx;
}
.cell-text-border--bottom {
  position: relative;
  // border-bottom: 1px solid #d9dce7;
  &::after{
    content: '';
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #d9dce7;
    width: 100%;
    height: 1px;
    transform: scaleY(.5);
  }
}
.cell-text-border--none {
  border: none;
}
.cell-text-desc {
  font-size: 0.7em;
  line-height: 1.3;
  margin-top: 10rpx;
}
</style>