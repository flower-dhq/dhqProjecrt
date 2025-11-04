<template>
  <cl-input
    :class="{ 'is-center': isCenter }"
    v-model="currentValue"
    prefix-icon="cl-icon-search"
    placeholder="点击输入搜索商品名称"
    clearable
    round
    placeholder-style="color: #ccc;"
    :auto-blur="true"
    @confirm="eventConfirm"
  ></cl-input>
</template>

<script>
import ClInput from 'cl-uni/components/cl-input/cl-input.vue'

/**
 * 本来想继承下cl-input的属性和事件，结果这平台不支持，那就随便点吧，需要什么事件，自己加上去
 * @extends ClInput.props
 * @property {string|number} value 输入框的值,使用v-model
 * @event input
 * @event confirm 搜索事件
 */
export default {
  options: { styleIsolation: 'shared' },
  props: {
    ...ClInput.props,
    value: [String, Number]
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      }
    },
    isCenter() {
      return !this.currentValue
    }
  },
  methods: {
    eventConfirm() {
      this.$emit('confirm', ...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
.cl-input {
  background-color: #f6f6f6;
  border-width: 0;
}
.cl-input:not(.cl-input--focus).is-center {
  text-align: center;

  ::v-deep .cl-input__icon {
    left: 20%;
  }
}
/* #endif */

/* #ifdef MP-WEIXIN */
::v-deep .cl-input {
  background-color: #f6f6f6;
  border-width: 0;
}
cl-input.is-center {
  ::v-deep .cl-input:not(.cl-input--focus) {
    text-align: center;

    .cl-input__icon {
      left: 20%;
    }
  }
}
/* #endif */

::v-deep .cl-icon-search{
  color: #ccc;
  font-size: 28rpx;
}
</style>