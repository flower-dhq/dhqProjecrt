<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100%;
  .right-section {
    width: 100%;
    box-sizing: border-box;
    padding-left: $left-nav-width;
    padding-top: $top-section-height;
    .router-view {
      width: 100%;
      padding: 0 13px;
      box-sizing: border-box;
      background-color: rgb(244, 246, 250);
    }
  }
}
.changeWidth {
  padding-left: 50px !important
}
</style>

<template>
  <div class="main">
    <left-nav-menu :felxs = felxs></left-nav-menu>
    <div class="right-section" :class="felxs? '' : 'changeWidth'">
      <top-section @changeLeft="changeLeft"></top-section>
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeftNavMenu from '@/components/left-nav-menu.vue';
import TopSection from '@/components/top-section.vue';
import { onBeforeMount ,ref} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const felxs = ref(true)
const store = useStore();

const changeLeft = (fls) =>{
    felxs.value = fls
}


onBeforeMount(() => {

});
</script>
