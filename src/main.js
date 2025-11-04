import Vue from 'vue';
import appConfig from '@/app-config';
import constant from '@/js/constant';
 import store from './store'
 import i18n from '@/lang'
import { ThemeSkin } from '@/js/minxins';
import uView from 'uview-ui';
import App from './App';
import utils from '@/js/utils';
import { indexArrow } from '@/js/tool';
import dayjs from 'dayjs';

 
/* #ifdef H5 */
// 这个文件不能删除，实际上是用script-loader方式去加载该文件的，要通过window.jWeixin的方式去使用它，绝不能直接用jWeixin方式
import jWeixin from '@/js/jweixin-1.6.0.js'
Vue.prototype.$jWeixin = window.jWeixin
/* #endif */


Vue.config.productionTip = false;

App.mpType = 'app';
Vue.prototype.$appConfig = appConfig;
Vue.prototype.$constant = constant;
Vue.prototype.$utils = utils;
Vue.prototype.$idxArrow = indexArrow
Vue.prototype.$store = store;
Vue.prototype.$dayjs = dayjs;
Vue.use(uView);
Vue.mixin(ThemeSkin);

// 让app的onLaunch先执行，主要是用来进行登录
Vue.prototype.$onLaunched = new Promise(resolve => {
  Vue.prototype.$isResolve = resolve
})

const app = new Vue({
  ...App,
  store,
  i18n
});
app.$mount(); 
