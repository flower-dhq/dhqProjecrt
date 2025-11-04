import store from '@/store';
import router from '@/router';
import { storageAction } from '@/assets/js/utils';
import { TOKEN } from '@/assets/js/constant';
import { logout } from '@/service/landcrm';

// 清空状态数据
export const statusLogout = () => {
  store.commit('statusLogout');
  storageAction({ action: 'clear' });
};

// 重新的登录
export const relogin = (params = {}) => {
  const { nonApi } = params;
  const token = storageAction({ key: TOKEN, action: 'get' });
  const loginPath = '/login' 
  const args = {
    data: {
      ebeiToken: token,
    },
  };

  if (nonApi) {
    statusLogout();
    // router.push({ path: loginPath});
    window.location.replace('/sjzx6.0/#/loginInner')
  } else {
    logout(args).then((res) => {
      if (res.success) {
        // router.push({ path: loginPath });
        statusLogout();
        window.location.replace('/sjzx6.0/#/loginInner')
      }
    });
  }
};

// 项目信息
export const projectInfo = () => {

  return {
    PROJECT_TYPE: ''
  }
}