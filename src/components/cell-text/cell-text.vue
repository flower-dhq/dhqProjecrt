<template>
  <view :class="['cell-text', getBorderClass, 'class']" :style="[getContainerStyle]">
    <view class="cell-text-panel">
      <view class="cell-text-label" :style="[{ color: labelColor }, getLabelWidth]">
        <text v-if="getRequired.position === 'start'" class="cell-text-label--required">*</text>
        <text>{{ getRequired.label }}</text>
        <text v-if="getRequired.position === 'end'" class="cell-text-label--required">*</text>
      </view>
      <view class="cell-text-content" :style="[{ 'justify-content': contentAlign }]" @click="handleClick">
        <slot></slot>
      </view>
      <view class="cell-text-right" v-if="isRight" @click="handleClick">
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
 * @property {number|string} labelWidth 左侧标题宽度，数字类型会转为 px 单位。默认 70px
 * @property {'flex-start'|'center'|'flex-end'} contentAlign 中间内容的水平对齐方式。默认 居左
 * @property {boolean} isRight 是否自定义右侧内容。默认 false 。需要先设置为 true ，才能去使用 slot="right"
 * @property {boolean} isDesc 是否自定义描述信息。默认 false 。需要先设置为 true ，才能去使用 slot="desc"
 * @property {string} descColor 描述信息的文字颜色。默认 #999999
 * @property {'label'|'content'} descAlign 描述信息的水平对齐方式。默认 label
 * @property {'bottom'|'none'} border 边框类型。默认 bottom
 * @property {number|string} padding 样式padding，数字类型会转为 px 单位。默认 { padding: 10px 0; }
 * @property {object|string} customStyle cell-text 添加style
 * @event click slot=default right 的点击事件
 * 
 * @slot default 中间位置的内容。（可用于 输入框，文字 等）
 * @slot right 右侧位置内容。（可用于 tag标签，icon图标 等）
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
      default: 70
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
      default: '10px 0'
    },
    customStyle: {
      type: [Object, String],
      default: ''
    },
  },
  options: {
    virtualHost: true,
    multipleSlots: true
  },
  externalClasses: ['class'],
  computed: {
    getBorderClass() {
      const border = this.border
      return border === 'bottom' ? 'cell-text-border--bottom' : border === 'none' ? 'cell-text-border--none' : 'cell-text-border--bottom'
    },
    getLabelWidth() {
      return { width: typeof(this.labelWidth) === 'number' ? this.labelWidth + 'px' : this.labelWidth }
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
      const padding = { padding: typeof(this.padding) === 'number' ? this.padding + 'px' : this.padding }
      const style = uni.$u.addStyle(this.customStyle) || {}
      return uni.$u.deepMerge(style, padding)
    },
    getDescMarginLeft() {
      const descAlign = this.descAlign
      return { marginLeft: descAlign === 'content' ? this.getLabelWidth.width : '0px' }
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-text {
  padding: 10px 0;
  font-size: inherit;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.cell-text-panel {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
}
.cell-text-label {
  display: inline-block;
  flex: 0 0 auto;
  min-height: 22px;
  font-size: inherit;
  word-break: break-all;
  white-space: break-spaces;
}
.cell-text-label--required {
  color: #f56c6c;
}
.cell-text-content {
  flex: 1;
  flex-wrap: wrap;
  min-height: 22px;
  word-break: break-all;
  font-size: inherit;
  display: flex;
  align-items: center;
  color: #a1a1a1;
}
.cell-text-right {
  flex: 0 0 auto;
  margin-left: 10px;
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
  margin-top: 5px;
}
</style>