<template>
  <movable-area class="fixed-box">
    <movable-view disabled class="fixed-view" v-if="isShow" direction="all" :inertia="true">
      <slot></slot>
    </movable-view>
  </movable-area>
</template>

<script>
export default {
  name: 'Movable',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-box {
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
}
.fixed-view {
  pointer-events: auto;
  width: max-content;
  height: auto;
  overflow: hidden;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90vw;
  top: 85vh;
}
</style>