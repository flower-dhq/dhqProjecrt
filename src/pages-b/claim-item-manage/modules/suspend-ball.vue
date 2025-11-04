<template>
  <view class="suspend-ball" :style="[customStyle]" @tap.stop="onClick">
    <view>
      <text>{{ label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SuspendBall',
  props: {
    label: '',
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.suspend-ball {
  background-color: var(--app-primary-color);
  width: 60px;
  height: 60px;
  color: #fff;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 10px;
  bottom: 80px;
  & > view {
    position: relative;
    top: 2px;
    width: 40px;
    height: 40px;
    padding: 0 7px;
    font-size: 13px;
    box-sizing: border-box;
  }
}
</style>