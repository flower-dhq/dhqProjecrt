import { createStore } from 'vuex';
import { getFunctionButtons2 } from '@/service/landcrm';
import testData from './test.js';

export default createStore({
  state: {
    menus: [], // 系统菜单
    activeNav: null, // 选择的导航菜单
  },
  getters: {
    // 左侧菜单
    leftMenu(state) {
      const menusAll = state.menus;
      const { name } = state.activeNav || {};
      let menus = [];
      menusAll.forEach((item) => {
        if (item.name == name) {
          menus = item.items;
          return true;
        }
      });
      return menus;
    },
    // 导航菜单
    navMenu(state) {
      const menusAll = state.menus;
      return menusAll;
    },
    // 是否初始化菜单
    isInitedMenus(state, getters) {
      const accessibleRoutes = getters.accessibleRoutes;
      return !!(Array.isArray(accessibleRoutes) && accessibleRoutes.length);
    },
    // 权限路由
    accessibleRoutes(state, getters) {
      const leftMenu = getters.leftMenu
      const flattenRoues = [];
      const recursion = (array) => {
        if (Array.isArray(array)) {
          array.forEach((item) => {
            const { router, items } = item;
            if (router) flattenRoues.push(router);
            recursion(items);
          });
        }
      };
      recursion(leftMenu)
      return flattenRoues
    }
  },
  mutations: {
    // 更新菜单
    updateMenusInfo(state, payload = {}) {
      const { menus } = payload;
      state.menus = menus;
    },
    // 设置导航菜单
    updateNavMenu(state, payload = {}) {
      const { index = 0 } = payload;
      state.activeNav = state.menus[index] || null;
    },
    // 重置state
    resetState(state, payload = {}) {
      state.menus = []
      state.activeNav = null
    },
    // 退出
    statusLogout(state, payload = {}) {
      state.menus = []
      state.activeNav = null
    }
  },
  actions: {
    // 获取系统菜单
    fetchSystemMenus({ commit }) {
      // 删除菜单里的按钮
      const recursion = (array) => {
        if (Array.isArray(array)) {
          for (let i = array.length - 1; i >= 0; i--) {
            const item = array[i]
            const { router, items, parentId } = item;
            if (!router && !parentId && !items) {
              array.splice(i, 1)
            }
            recursion(items);
          }
        }
      }
      return new Promise((resolve) => {
        const pms = new Promise((resolve) => {
          const menus = [
            {
              id: '0',
              name: '系统管理',
              items: [
                {
                  name: '物联概况',
                  router: '/applicationCenter/home',
                  id: '1',
                },
                {
                  name: '智慧人行',
                  id: '2',
                  items: [
                    {
                      name: '门禁列表',
                      id: '21',
                      router: '/applicationCenter/accessControlList',
                    },
                    {
                      name: '开门记录',
                      id: '22',
                      router: '/applicationCenter/openingDoorRecord',
                    },
                  ],
                },
                {
                  name: '智慧车行',
                  id: '3',
                  items: [
                    {
                      name: '车辆列表',
                      id: '31',
                      router: '/applicationCenter/vehicleList',
                    },
                    {
                      name: '停车记录',
                      id: '32',
                      router: '/applicationCenter/parkingRecord',
                    },
                    {
                      name: '预警记录',
                      id: '33',
                      items: [
                        {
                          name: '僵尸车',
                          id: '331',
                          router: '/applicationCenter/zombieVehicle',
                        },
                        {
                          name: '车辆违停',
                          id: '332',
                          router: '/applicationCenter/unlawfulParking',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ];
          setTimeout(() => {
            resolve({
              success: 200,
              data: menus,
            });
          }, 800);
        });
        const { TOKEN, USER_INFO } = window.GlobalProperties.$constant || {};
        const { storageAction } = window.GlobalProperties.$utils || {};
        const { userid } = storageAction({action: 'get', key: USER_INFO}) || {}
        const params = {
          data: {
            userId: userid,
            menuTypes: 0,
            belongSystem: 1,
          },
          responseToast: false
        }
        // getFunctionButtons2(params)
        getFunctionButtons2(params).then((res) => {
            if (res.success) {
              const menus = res.data.length>0 ? res.data.filter( (e)=>{ return e.menuCode=='bangongguanli' }) : [];
              recursion(menus)
              commit('updateMenusInfo', { menus });
              commit('updateNavMenu');
              resolve({ code: 1 });
            } else {
              resolve({ code: 0 });
            }
          })
          .catch((err) => {
            resolve({ code: 0 });
          });
      });
    }
  },
  modules: {
    testData,
  },
});
