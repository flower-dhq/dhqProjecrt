import axios from 'axios';
import qs from 'qs';
import ViewUIPlus from 'view-ui-plus';
import { storageAction, throttle } from '@/assets/js/utils';
import { relogin } from '@/assets/js/comm-logic';
import { TOKEN ,USER_INFO } from '@/assets/js/constant';
import axiosConfig from '@/service/axios/config';

const VITE_APP_CONFIG = import.meta.env.VITE_APP_CONFIG || '{}';
const { DOMAIN_DEV, DOMAIN_PRO, PROXY_PATH } = JSON.parse(VITE_APP_CONFIG);
const { requestOptions, customKeys, responseConfig } = axiosConfig;
const throttleFn = throttle();

class AxiosRequest {
  constructor() {
    const isDev = process.env.NODE_ENV === 'development';
    this.config = {
      isDev,
      domain: isDev ? DOMAIN_DEV : DOMAIN_PRO || '/',
    };
  }

  _interceptors({ instance, extend, insideConfig = {} }) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        this._setHeaders(config, insideConfig);
        this._setLoading({ action: 'show', config: insideConfig });
        return config;
      },
      (error) => {
        this._setLoading({ action: 'hide', config: insideConfig });
        this._responseToast({ insideConfig, error });
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (response) => {
        const data = response.data;
        this._mutation(data);
        this._responseToast({ insideConfig, response });
        this._setLoading({ action: 'hide', config: insideConfig });
        this._responseHandle({ insideConfig, response });
        if(data.type == 'application/vnd.ms-excel' || data.type == 'application/x-zip-compressed'){
         let filename = "";
         let disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('attachment') !== -1) {
             let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
             let matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = decodeURI(matches[1].replace(/['"]/g, ''));
        }
         let type2 = response.headers['content-type'];
   
        if(typeof File === 'undefined' && typeof Blob === 'undefined')
        {
          alert("当前浏览器不支持下载，请使用最新浏览器重试");
          return;
        }
         let blob = typeof File === 'function'
            ? new File([data], filename, { type: type2 })
            : new Blob([data], { type: type2 });
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, filename);
        } else {
             let URL = window.URL || window.webkitURL;
             let downloadUrl = URL.createObjectURL(blob);
            if (filename) {
                 let a = document.createElement("a");
                if (typeof a.download === 'undefined') {
                    window.location = downloadUrl;
                } else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                }
            } else {
                window.location = downloadUrl;
            }
            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
        }
         }
        return data;
      },
      (error) => {
        axios.CancelToken.source().cancel();
        this._setLoading({ action: 'hide', config: insideConfig });
        return Promise.reject(error);
      }
    );
  }

  _mutation(response = {}, insideConfig = {}) {
    const { successCode = [] } = responseConfig;
    // 响应体设置success状态
    const success = successCode.some((str) => {
      const [key, code] = str.split(':');
      return response[key] == code;
    });

    response.success = success;
  }

  _responseHandle(responseBody = {}, insideConfig = {}) {
    const { response } = responseBody;
    const { headers = {} } = response;
    const { token_code } = headers;
    const invalidToken = token_code == -1 || token_code == -2;

    if (invalidToken) {
      throttleFn((_) => {
        ViewUIPlus.Message.error({
          background: true,
          content: '令牌失效，请重新的登录！',
        });
        relogin();
      }, 3000);
    }
  }

  _setHeaders(config = {}, insideConfig = {}) {
    const { headers } = insideConfig;
    const { method } = config;
    const isGetMethod = typeof method === 'string' && method.toLocaleLowerCase() === 'get';
    const token = storageAction({ action: 'get', key: TOKEN });

    // 设置token
    config.headers['token'] = token;

    const { companyId, userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
    config.headers['x-companyId-header'] = companyId;
    config.headers['x-userId-header'] = userid;

    // 设置contentType
    if (isGetMethod) {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      };
    } else {
      for (let k in headers) config.headers[k] = headers[k];
      config.transformRequest = [
        function (data) {
          const contentType = config.headers['Content-Type'];
          if (contentType === 'application/json') {
            return JSON.stringify(data);
          } else if (contentType === 'application/x-www-form-urlencoded') {
            return qs.stringify(data);
          } else if (contentType === 'multipart/form-data') {
            return data;
          } else{
            return JSON.stringify(data);
          }
        },
      ];
    }
  }

  _responseToast(params = {}) {
    const { response = {}, insideConfig = {}, error = {} } = params;
    const { message: errorMsg } = error;
    const { data = {} } = response;
    const { success: responseSuccess } = data || {};
    const success = responseSuccess ? responseSuccess : !!!error;
    const { responseToast, successfulText, failureText } = insideConfig;
    const notSuccessNotHideToast = success === false && responseToast !== false; // 请求不成功，没有设置隐藏Toast，不成功则提示
    const notSuccessHideToast = success === false && !(responseToast === false); // 请求不成功，设置隐藏Toast
    const successHideToast = success === true && !(responseToast !== true); // 请求成功，不提示
    const successShowToast = success === true && responseToast === true; // 请求成功，responseToast为true则提示
    const shwoToast = notSuccessNotHideToast || notSuccessHideToast || successHideToast || successShowToast;

    if (shwoToast) {
      let message = errorMsg || '';
      const { messageKeys = [] } = responseConfig;
      messageKeys.some((key) => {
        if (data[key]) {
          message = data[key];
          return true;
        }
      });
      // ViewUIPlus.Message[success ? 'success' : 'error']({
      //   background: true,
      //   content: success && successfulText ? successfulText : !success && failureText ? failureText : message,
      // });
    }
  }

  _optionsHandle(options) {
    const { method, params = {} } = options || {};
    const { isDev, domain } = this.config;
    const isGetMethod = typeof method === 'string' && method.toLocaleLowerCase() === 'get';
    const configKeys = customKeys || [];
    const result = {
      extend: {},
      insideConfig: {},
    };
    if(method === 'get'){
      
    }
    configKeys.forEach((key) => {
      const keyValue = params[key];
      const { devBaseUrl, prodBaseUrl } = params || {};
      const hasDevBaseUrl = !!devBaseUrl;
      const hasProdBaseUrl = !!prodBaseUrl;
      const devUrl = isDev && hasDevBaseUrl ? devBaseUrl : PROXY_PATH ? PROXY_PATH : domain;
      const prodUrl = !isDev && hasProdBaseUrl ? prodBaseUrl : domain;
      const envUrl = isDev ? devUrl : prodUrl;

      options['baseURL'] = envUrl;
      result.insideConfig[key] = keyValue;
      if (key === 'data' && isGetMethod) options.params = keyValue;
      if (key === 'data' && !isGetMethod) options[key] = keyValue || {};
      if (key === 'pathParams' && keyValue) options.url = options.url  + keyValue;
    //  console.log(167,key, isGetMethod ,options)
      if(method !=='get' && ((options.params) instanceof Object)) {
        Reflect.deleteProperty(params, key);
     }
    });
    if (!isGetMethod) Reflect.deleteProperty(options, 'params');
    return result;
  }

  _setLoading(params = {}) {
    const { action, config = {} } = params;
    const { hideLoading, loadingText } = config;
    if (hideLoading === true) return;
    if (action === 'show') {
      console.log(222,action)
      // ViewUIPlus.Spin.show({
      //   render: (h) => {
      //     return h('div', [
      //       h('Icon', {
      //         class: 'demo-spin-icon-load',
      //         props: {
      //           type: 'ios-loading',
      //           size: 18,
      //         },
      //       }),
      //       h('div', ''),
      //     ]);
      //   },
      // });
    }
    if (action === 'hide') ViewUIPlus.Spin.hide();
  }

  request(options) {
    const instance = axios.create();
    const { timeout } = requestOptions;
    const { extend, insideConfig } = this._optionsHandle(options);

    instance.defaults.timeout = timeout;
    this._interceptors({ instance, extend, insideConfig });
    return instance({ ...requestOptions, ...options });
  }
}

export default new AxiosRequest();
