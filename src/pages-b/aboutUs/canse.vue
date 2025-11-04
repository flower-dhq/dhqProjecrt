<template>
  <web-view :src="url" :progress="true"></web-view>
</template>

<script>
/**
 * 小程序的备案号页面
 */
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(option) {
    this.url = decodeURIComponent(option.url)
  }
}
</script>

<style>

</style>