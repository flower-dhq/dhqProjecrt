<style lang="scss" scoped>
.left-nav-menu {
  position: fixed;
  left: 0;
  top: 0;
  z-index: $global-z-index;
  width: $left-nav-width;
  height: 100vh;
  overflow-y: auto;
  background: #515a6e;
  .logo {
    @include flx-dsp($jsc: center, $ali: center);
    height: 50px;
    width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    h1 {
      color: #fff;
      font-size: 18px;
    }
  }
}
.logoPic {
  background-image: '../assets/images/ebeilogo.png';
}
.changeWitch {
  width:50px;
}
:deep .ivu-menu-submenu-title {
  padding: 14px 15px 14px 24px;
}
:deep .ivu-menu-submenu .ivu-icon-ios-arrow-down:before {
    content: "\f115";
}

:deep .ivu-menu-opened .ivu-icon-ios-arrow-down:before {
    content: "\f116" ;
}
:deep .ivu-menu-vertical .ivu-menu-opened>*>.ivu-menu-submenu-title-icon {
  transform: translateY(-50%);
}
:deep .ivu-menu-vertical .ivu-menu-submenu-title-icon {
  right: 12px;
}
:deep .ivu-menu-submenu-title>i {
  margin-right: 0;
}
</style>

<template>
  <div class="left-nav-menu" :class="felxs ? '' : 'changeWitch'">
    <div class="logo" :class="felxs ? '': 'logoPic'">
      <img :src=" felxs ? '' : logPic"/>
      <h1 v-show="felxs">办公管理平台</h1>
    </div>
    <Menu v-show="felxs" ref="menuRef" width="200" theme="dark" :active-name="activeName" :open-names="openNames" :accordion="true">
      <template v-for="menu1 in leftMenu">
        <!-- 一级菜单 -->
        <MenuItem :to="menu1.router" v-if="!isHavingChild(menu1)" :name="menu1.id">{{ menu1.name }}</MenuItem>
        <template v-if="isHavingChild(menu1)">
          <!-- 二级菜单 -->
          <Submenu :name="menu1.id" :open-names="['331']">
            <template #title> {{ menu1.name }} </template>
            <template v-for="menu2 in menu1.items">
              <!-- 三级菜单 -->
              <MenuItem @click="clickMenu(menu2)" :to="menu2.router" v-if="!isHavingChild(menu2)" :name="menu2.id">{{ menu2.name }}</MenuItem>
              <template v-if="isHavingChild(menu2)">
                <Submenu :name="menu2.id">
                  <template #title> {{ menu2.name }} </template>
                  <MenuItem :to="menu3.router" v-for="menu3 in menu2.items" :name="menu3.id">{{ menu3.name }}</MenuItem>
                </Submenu>
              </template>
            </template>
          </Submenu>
        </template>
      </template>
    </Menu>
  </div>
</template>

<script setup>
import { ref, watch, toRaw, computed, nextTick, onBeforeMount ,defineProps} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import logPic from '@/assets/images/ebeilogo.png'
 //简单数据的响应

// 路由器
const router = useRouter();
const store = useStore();
const leftMenu = computed(() => store.getters.leftMenu);
const openNames = ref([]);
const activeName = ref('');
const menuRef = ref(null);
const prop = defineProps({
  felxs: Boolean 
})
const isHavingChild = (data) => {
  return data.items && data.items.length;
};

const handleRouteChange = () => {
  const path = router.currentRoute.value.path;
  const list = toRaw(leftMenu.value);
  const openIds = [];
  const recursion = (list, parentId) => {
    let name = '';
    if (Array.isArray(list)) {
      list.some((item) => {
        const { router, items, id } = item;
        if (router == path) {
          name = parentId;
          activeName.value = id;
          return true;
        } else {
          const { name: n } = recursion(items, id);
          if (n) name = parentId;
          return !!n;
        }
      });
    }
    if (name) openIds.push(name);

    return { name };
  };
  recursion(list);
  openIds.reverse();
  openNames.value = openIds;
};
const clickMenu = (item) =>{
  sessionStorage.setItem('child_id',item.id)
}
// 在组件挂载前
onBeforeMount(() => {
  watch(() => router.currentRoute, handleRouteChange, { immediate: true, deep: true });
});


</script>
