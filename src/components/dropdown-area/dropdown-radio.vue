<template>
  <view :class="['dropdown-radio', getCustomClass]" :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]">
    <scroll-view :scrollTop="0" scroll-y :style="'width: 100%; height: '+maxHeight+';'">
      <block v-for="(item, index) in data" :key="index">
        <view :class="['radio-item', { selected: value == item.name }]" @click="clickEvent(index, item)">
          <text>{{ item.label }}</text>
          <u-icon name="checkmark" v-if="value == item.name" :color="THEME_COLOR"></u-icon>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

/**
 * 下拉列表 - 单选列表
 * @property {string} value 需要被选中的节点的name值
 * @property {array<Data>} data 数据
 * @property {boolean} show 显示/隐藏
 * @property {boolean} required 默认false。true: 表示只能选择一个; false: 表示可以选择1个和0个
 * @event confirm 点击事件
 */
export default {
  name: 'DropdownRadio',
  mixins: [mpMixin],
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * @typedef {object} Data
     * @property {string} label 文本
     * @property {string} name 唯一值
     */
    /**@type {[Data]} 数据 */
    data: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
		maxHeight:{
			type: String,
			default: '100%'
		}
  },
  methods: {
    clickEvent(index, item) {
      const isSame = this.value == item.name
      if (this.required && isSame) return

      this.$emit('confirm', isSame ? {} : item)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-radio {
  @include flx-dsp(flex-start, flex-start, column);
  font-family: "PingFang SC";
  width: 100%;
  height: 100%;
}

.classheight{
    height: 500rpx !important;
 }
.radio-item {
  width: 100%;
  @include flx-dsp(space-between, center);
  font-size: 30rpx;
  line-height: 1;
  padding: 30rpx;
  border-bottom: 1px solid #EAEAEA;
  box-sizing: border-box;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
  }
}
</style>