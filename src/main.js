import Vue from 'vue';
import appConfig from '@/app-config';
import constant from '@/js/constant';
import store from './store'
import { ThemeSkin } from '@/js/minxins';
import uView from 'uview-ui';
import App from './App';
// import mallApi from './service/mall-api';
import commonMethod from './js/commonMethod';
import { myRouterPlugin } from '@/js/router/index'
import share from './js/share.js' //全局显示分享
Vue.mixin(share)

//小程序顶部导航组件
import topBar from './components/topBar/topBar.vue'
Vue.component('topBar',topBar)

/* #ifdef H5 */
// 这个文件不能删除，实际上是用script-loader方式去加载该文件的，要通过window.jWeixin的方式去使用它，绝不能直接用jWeixin方式
import jWeixin from '@/js/jweixin-1.6.0.js'
Vue.prototype.$jWeixin = window.jWeixin
/* #endif */

// 旧的商城接口，新的接口写到 api-gateway.js
// Vue.prototype.$mallApi = mallApi;
Vue.prototype.$cmMth = commonMethod;
Vue.config.productionTip = false;

App.mpType = 'app';
Vue.prototype.$appConfig = appConfig;
Vue.prototype.$constant = constant;

Vue.use(uView);
Vue.mixin(ThemeSkin);
Vue.use(myRouterPlugin)

const app = new Vue({
  ...App,
  store
});
app.$mount(); 
