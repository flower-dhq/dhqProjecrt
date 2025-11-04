<style lang="scss" scoped>
.top-nav-menu {
  width: 100%;
  height: 60px;
  @include flx-dsp($jsc: flex-start, $ali: center);
  .menu {
    position: relative;
    @include flx-dsp($jsc: center, $ali: center);
    height: 100%;
    padding: 0 $page-padding;
    cursor: pointer;
    margin-left: 10px;
    &.active {
      &::before {
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        content: '';
        width: 100%;
        height: 2px;
        background-color: $primary-color;
      }
      .menu-text {
        color: $primary-color;
      }
    }

  }

 .sidebar-toggle{
    color:rgba(60,141,188,1);
  }
  .sidebar-toggle:before {
    content: "\f0c9";
 }
 .sidebar-toggle:hover{
    color:#fff;
  }
 .sidebar-toggle{color:#484f62}
}

.menuLogo {
  width: 42px;
  text-align: center;
  height: 100%;
  line-height: 60px;
  &:hover {
    background-color: #20a0ff;
  }
}
</style>

<template>
  <div class="top-nav-menu">
    <span @click="flexDisplay" class="menuLogo">
      <Icon type="md-menu" />
    </span>
    <div class="menu" v-for="(item, index) in navMenu" :key="index" :class="{ active: activeIndex == index }" @click="navMenuClick(index, menu)">
      <span class="menu-text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed ,defineEmits } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const navMenu = computed(() => store.getters.navMenu);
const activeIndex = ref(0);
const felxFlag = ref(true)
const emit = defineEmits(['onFlex'])
const navMenuClick = (index, menu) => {
  activeIndex.value = index;
  store.commit('updateNavMenu', {index});
};

const flexDisplay = () =>{
    felxFlag.value = !felxFlag.value
    emit('onFlex',felxFlag.value);
}
</script>
