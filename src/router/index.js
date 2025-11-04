import { ref, reactive } from 'vue';
import ViewUIPlus from 'view-ui-plus';
import { useStore } from 'vuex';
import { createRouter, createWebHashHistory } from 'vue-router';
import { allRoutes, nonMenuRoutes } from '@/router/routes';
import { statusLogout } from '@/assets/js/comm-logic';

const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const { TOKEN } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const isInitedMenus = store.getters.isInitedMenus;
  const tokenLogin = !!to.query.token;
  const logined = storageAction({ key: TOKEN, action: 'get' });
  const toPath = to.path;
  const pathWhiteList = nonMenuRoutes.map(item => item.path)
  const isWhiteList = pathWhiteList.includes(toPath);

  ViewUIPlus.LoadingBar.start();

  // token登录
  if (tokenLogin) {
    next({ replace: true, name: 'tokenLogin' });
    return;
  }

  // 跳过
  if (toPath == '/error') return next();

  // 登录过
  if (logined) {
    if (toPath == '/login') return next({ path: '/' });

    // 没初始化菜单
    if (!isInitedMenus) {
      const { code } = await store.dispatch('fetchSystemMenus');
      if (!code) {
        ViewUIPlus.Message.error({
          background: true,
          content: '系统菜单获取失败！',
        });

        statusLogout()
        return next({ replace: true, name: 'login' });
        // return next({ name: 'error', query: { type: 500 } });
      }
    }

    const accessibleRoutes = [...store.getters.accessibleRoutes, ...pathWhiteList];
    const isAccessible = accessibleRoutes.includes(toPath);
    next()
    // isAccessible ? next() : next({ replace: true, name: 'error', query: { type: 403 } });
  } else {
    
    isWhiteList ? next() : window.location.replace('/sjzx6.0/#/loginInner') //next({ replace: true, name: 'login' });
  }
});

// 全局后置钩子
router.afterEach(async (to, from) => {
  const { meta = {} } = to;
  const { title } = meta;
  if (title) document.title = title;

  ViewUIPlus.LoadingBar.finish();
});

export default router;
