<template>
  <image :src="getImgSrc" @error="imageError" class="feedback-image" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      errSrc: ''
    }
  },
  computed: {
    getImgSrc: {
      get() {
        return this.errSrc || this.src
      },
      set(val) {
        this.errSrc = val
      }
    }
  },
  methods: {
    imageError(event) {
      this.errSrc = '/pages-mall/static/default_img.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback-image {
  background-color: #f0f0f0;
}
</style>