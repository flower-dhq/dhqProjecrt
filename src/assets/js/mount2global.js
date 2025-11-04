import * as utils from '@/assets/js/utils';
import * as constant from '@/assets/js/constant';


export default (app) => {
  const VITE_APP_CONFIG = import.meta.env.VITE_APP_CONFIG || '{}'
  const appConfig = JSON.parse(VITE_APP_CONFIG);
  const globalProperties = app.config.globalProperties

  globalProperties.$utils = utils;
  globalProperties.$constant = constant;
  globalProperties.$appConfig = appConfig;
  window.GlobalProperties = globalProperties;
};
