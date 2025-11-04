<template>
  <div class="container" style="height: 100vh;">
    <img src="../../assets/images/indexbg.png" class="imgIndex">
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeMount, reactive, watch, getCurrentInstance, resolveComponent } from 'vue'


  let isImportModal = ref(false)


  let areaCleared = () => {
  }


  //初始化
  onMounted(() => {
    areaCleared()
  })
</script>

<style lang="scss" scoped>
.imgIndex{
  width: 100%;
}
</style>
