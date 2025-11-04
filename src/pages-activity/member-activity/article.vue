<template>
  <view>
    <web-view :src="articleUrl" />
  </view>
</template>

<script>

export default {
  data() {
    return {
      articleUrl: ''
    }
  },
  onLoad(query) {
    this.articleUrl = query.url
  }
}
</script>

<style>

</style>