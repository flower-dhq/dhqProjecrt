import { projectInfo } from '@/assets/js/comm-logic';

/**
 * @description: 存储localstoage，云环境会存在键名冲突问题，
 * @param {*} params：{action: 'get：获取，set：存储， remove：'删除', removeItem: '删除item',  key: '键名', value: '存储值'}
 * @return {*}
 */
export const storageAction = (params) => {
  const { action, key, value } = params || {};
  const { PROJECT_TYPE } = projectInfo()
  const storeKey = `PC_${key}_${PROJECT_TYPE}`;
  const innerStoreKey = 'INNER_STORE_KEY';
  let data = null;
  try {
    if (action === 'get') {
      data = JSON.parse(localStorage.getItem(storeKey));
      data = data === null ? null : data.hasOwnProperty(innerStoreKey) ? data[innerStoreKey] : data;
    }
    if (action === 'set') {
      if (typeof value !== 'function') {
        if (typeof value === 'object') {
          data = JSON.stringify(value);
        } else {
          data = {};
          data[innerStoreKey] = value;
          data = JSON.stringify(data);
        }
        localStorage.setItem(storeKey, data);
      }
    }
    if (action === 'removeItem') localStorage.removeItem(storeKey);
    if (action === 'clear') localStorage.clear();
  } catch (e) {}
  return data;
};

// 节流
export const throttle = () => {
  let lastTime = 0;

  return function (func, delay) {
    const currentTime = new Date().getTime();
    if (currentTime - lastTime >= delay) {
      func && func();
      lastTime = currentTime;
    }
  };
};
