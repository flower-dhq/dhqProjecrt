<style lang="scss" scoped>
.top-section {
  position: fixed;
  left: $left-nav-width;
  top: 0;
  width: calc(100% - #{$left-nav-width});
  z-index: $global-z-index;
  box-sizing: border-box;
  .top-bar{
    @include flx-dsp($jsc: space-between, $ali: center);
    position: relative;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 $page-padding 0 0;
    &::before{
      position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        content: '';
        width: 100%;
        height: 1px;
        background-color: #dcdee2;
    }
  }
}
.changeWitch {
  left: 50px !important;
  width: calc(100% - 50px);
}
</style>

<template>
  <div class="top-section" :class="chageFlex ? '' : 'changeWitch'">
    <div class="top-bar">
      <top-nav-menu @onFlex="changeFlex"></top-nav-menu>
      <account></account>
    </div>
    <breadcrumb></breadcrumb>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb.vue'
import TopNavMenu from '@/components/top-nav-menu.vue'
import Account from '@/components/account.vue'
import {ref,defineEmits } from 'vue'
const chageFlex = ref(true)
const emit = defineEmits(['changeLeft'])
const changeFlex = (felx) =>{
  console.log(47,felx)
   chageFlex.value = felx
   emit('changeLeft',chageFlex.value)
}
</script>
