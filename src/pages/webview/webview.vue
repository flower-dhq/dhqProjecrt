<template>
  <web-view :src="appUrl" fullscreen />
</template>

<script>
export default {
  data() {
    return {
      appUrl: ''
    }
  },
  onLoad(options) {
    const url = options.url || ''
    const title = decodeURIComponent(options.title || '')
    this.appUrl = decodeURIComponent(url)

    // 修改标题
    uni.setNavigationBarTitle({
      title
    })
  }
}
</script>

<style>

</style>