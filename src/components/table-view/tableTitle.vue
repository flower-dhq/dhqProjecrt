<template>
  <div>
    <div class="header-title">
      <div class="title">
        {{ title }}
      </div>
      <div class="btn-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title?: string,
}
defineProps<Props>()

</script>

<style lang="scss" scoped>
.header-title{
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #e4e4e4;
}
.title{
  width: 30%;
  display: flex;
  align-items: center;
  font-size: 16px;
}
.btn-list{
  flex: 1;
  text-align: right;
  padding-bottom: 10px;
  :deep(.ivu-btn){
    margin-left: 10px;
  }
}
</style>