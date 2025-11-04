<template>
    <div class="name-tag">
      <span class="name">{{ name }}</span>
      <button v-if="closable" class="close-button" @click="emitClose"><Icon type="md-close" /></button>
    </div>
  </template>
  
  <script>
  export default {
    name:"NameTag",
    props: {
      name: String,
      closable: Boolean,
    },
    methods: {
      emitClose() {
        this.$emit('on-close',this.name);
      },
    }
  }
  </script>
  
  <style scoped>
  .name-tag {
    max-width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    
    padding: 10px;
    border-radius: 5px;
    overflow: hidden; /* 隐藏超出部分 */
    text-overflow: ellipsis; /* 如果内容过长，使用省略号表示 */
    white-space: nowrap; /* 防止换行 */
  }
  
  .name {
    color: #2d69fb;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .close-button {
    margin-left: 10px;
    cursor: pointer;
    border: none;
    background-color: transparent;
  }
  </style>
  