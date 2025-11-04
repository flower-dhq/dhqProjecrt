<style lang="scss" scoped>
.breadcrumb {
  width: 100%;
  height: 45px;
  @include flx-dsp($jsc: flex-start, $ali: center);
  background-color: rgb(244, 246, 250);
  padding: 0 $page-padding;
  box-sizing: border-box;
}
::v-deep .ivu-breadcrumb-item-link{
  font-size: 13px;
}
::v-deep .ivu-breadcrumb>span:last-child {
  color:#0e84f8;
  font-weight: normal;
  font-size: 13px;
}
</style>

<template>
  <div class="breadcrumb">
    <Breadcrumb separator=">">
      <BreadcrumbItem v-for="item in breadcrumb">
        <Icon v-if="item.iconType" :type="item.iconType" color="#0e84f8"></Icon>
        {{ item.name }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script setup>
import { ref, watch, computed, toRaw, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// 路由器
const router = useRouter();
// 面包屑
const breadcrumb = ref([]);
const store = useStore();
const leftMenu = computed(() => store.getters.leftMenu);
const activeNav = computed(() => store.state.activeNav);

// 路由变化
const handleRouteChange = () => {
  updateBreadcrumb();
};

// 更新面包屑
const updateBreadcrumb = () => {
  const path = router.currentRoute.value.path;
  const list = toRaw(leftMenu.value);
  const { name: navName } = toRaw(activeNav.value) || {};
  let templist = [];

  // 配对面包屑路径
  const recursion = (list) => {
    let n = '';
    if (Array.isArray(list)) {
      list.some((item) => {
        const { router, items, name } = item;
        if (router == path) {
          n = name;
          return true;
        } else {
          const { n: title } = recursion(items, name);
          if (title) n = name;
          return !!title;
        }
      });
    }
    if (n) templist.push({ name: n });

    return { n };
  };

  recursion(list);
  templist.reverse();
  if (navName) templist.unshift({ iconType: 'ios-home' });
  breadcrumb.value = templist;
};

// 在组件挂载时
onMounted(() => {
  watch(() => router.currentRoute, handleRouteChange, { immediate: true, deep: true });
});
</script>
