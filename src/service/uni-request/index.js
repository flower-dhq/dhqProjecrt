import uniRequestConfig from './config.js';
import constant from '@/js/constant';
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
import appConfig from '@/app-config';
const { unauthorizedApi, requestOptions, requestProxyPlatform, responseConfig, uploadKeys, downloadKeys, requestKeys, apiParticularStatusKey, assertion } = uniRequestConfig;
const { PROXY_PATH, DOMAIN_DEV, DOMAIN_PRO ,USER_ID, PROJECT_CODE} = appConfig;
const { TOKEN, M_TOKEN, MEMBER_ID,O_USER_INFO } = constant;

class UniRequest {
  constructor() {
    const isDev = process.env.NODE_ENV === 'development';
    const { uniPlatform } = uni.getSystemInfoSync();
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    this.insideConfig = {
      isDev,
      domain: isDev ? DOMAIN_DEV : DOMAIN_PRO,
      uniPlatform,
    };
  }

  // 显示Loading
  showLoading(options) {
    const { params } = options || {};
    const { hideLoading, loadingText } = params || {};
    const loadingTitle = loadingText || '加载中';
    const isShow = hideLoading === undefined || hideLoading === false;
    if (isShow) {
      uni.showLoading({
        title: loadingTitle,
      });
    }
  }

  // 隐藏Loading
  hideLoading(options) {
    const { params } = options || {};
    const { hideLoading } = params || {};
    const isHide = hideLoading === undefined || hideLoading === false;
    if (isHide) uni.hideLoading();
  }

  // 响应信息的提示
  responseToast({ params, responseData }) {
    const { message, success, status } = responseData || {};
    const { responseToast, successfulText, failureText } = params || {};
    const mallUnauthorized = status == 10401;

    if (responseToast && !mallUnauthorized) {
      uni.showToast({
        title: success ? successfulText : (message || failureText),
        duration: 2000,
        icon: 'none',
      });
    }
  }

  // 接口是否携带Token及要校验
  isCarryToken(options) {
    const { url } = options || {};
    return false & !!unauthorizedApi.find((path) => url.includes(path));
  }

  // 校验及刷新token
  verifyToken() {
    const token = utils.storageAction({ key: TOKEN, action: 'get' });
    const expires = false;
    if (expires && !this.isRefreshing) {
      this.isRefreshing = true;
      return refreshToken({ token, loading: false }).then((res) => {
        const newToken = res.data.token;
        utils.storageAction({ key: TOKEN, action: 'set', value: newToken });
        this.isRefreshing = false;
        this.refreshSubscribers.map((cb) => cb());
        return res;
      });
    } else {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.refreshSubscribers.push(() => {
            resolve();
          });
        });
      } else {
        return Promise.resolve();
      }
    }
  }

  // 请求前拦截
  async interceptorRequest(options) {
    this.showLoading(options);
    const isCarryToken = this.isCarryToken(options);
    if (isCarryToken) await this.verifyToken();
    return Promise.resolve();
  }

  // 响应完成
  responseComplete({ resolve, reject, response, options, requestOptionsValue }) {
    const { wrapResponse } = options?.params ?? {}
    const { header = {}, statusCode, data } = response;
    const { requestFailureText, requestSuccessText, successCode } = responseConfig;
    const contentType = header['content-type'] || header['Content-Type'] || '';
    const textType = contentType.includes('text/html');
    const action = 'noneOfContentTypeInHeaderAndNoneOfHeaderInResponse'
    const { contentTypeIsJson } = this.handleAssertion({ action, response, requestOptionsValue})
    const responseContentType = contentType.includes('application/json') || contentTypeIsJson ? 'json' : 'other';
    const httpSuccess = statusCode === 200;
    const tokenCode = (() => {
      let tokenCodeValue = null;
      if (textType) {
        try {
          const parseVal = JSON.parse(data);
          if (parseVal.hasOwnProperty('token_code')) tokenCodeValue = parseVal;
        } catch (error) {}
      }
      return tokenCodeValue;
    })();
    const uniRequestInstance = this
    const generateResponseData = {
      json() {
        let responseData = null;
        try {
          responseData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {}
        const { data: d, message, ...others } = responseData || {};
        const status = uniRequestInstance.handleParticularStatus(responseData, options)
        const jsonTypeSuccess = httpSuccess && (successCode.includes(status + ''));

        if (wrapResponse == true) {
          const tokenInvalid = responseData.hasOwnProperty('token_code') && responseData.token_code == -1
          return {
            statusCode,
            status: tokenInvalid ? 401 : (status ?? null),
            success: !!jsonTypeSuccess,
            data: responseData,
            message: tokenInvalid ? '令牌无效，请登录!' : httpSuccess ? requestSuccessText : requestFailureText
          }
        } else {
          const tokenInvalid = data.hasOwnProperty('token_code') && data.token_code == -1;
          return {
            ...others,
            statusCode,
            status: tokenInvalid ? 401 : (status ??  null),
            success: !!jsonTypeSuccess,
            data: d,
            message: tokenInvalid ? '令牌无效，请登录! ' : httpSuccess ? (message ? message : requestSuccessText) : message ? message : requestFailureText,
          };
        }
      },
      other() {
        return {
          statusCode,
          success: httpSuccess,
          data: data,
          message: httpSuccess ? requestSuccessText : requestFailureText,
        };
      },
    };
    const responseData = generateResponseData[responseContentType]();
    // 解析Promise
    statusCode === 200 ? resolve(responseData) : reject(responseData);

    // 隐藏Loading
    this.hideLoading(options);
    // toast提示
    this.responseToast({ params: options.params, responseData });
    // 刷新token 或者 重新登录
    this.unauthorized(responseData);
  }

  // 令牌失效处理
  unauthorized(response) {
    const { status } = response;
    const handleStatus = {
      // 商城token失效
      10401() {
        const existMbid = utils.storageAction({ key: MEMBER_ID, action: 'get' });
        const url = !!existMbid ? '/pages-mall-a/authorization/refresh-token' : commLogic.getAuthUrl();
        uni.navigateTo({ url });
      },
      // 社区接口没token
      401() {
        const url = commLogic.getAuthUrl();
        uni.navigateTo({ url });
      },
    };
    utils.throttle((_) => {
      // 暂时不启用重定向
      handleStatus[status] && handleStatus[status]();
    }, 800);
  }

  // 处理options参数
  optionsHandler(options) {
    const { url = '', method, params, apiType = 'request', header } = options || {};
    const { domain, isDev, uniPlatform } = this.insideConfig;

    // 请求接口路径
    const requestPath = (() => {
      // 配置config里配置
      const hasDevBaseUrl = !!params?.devBaseUrl;
      const hasProdBaseUrl = !!params?.prodBaseUrl;
      const need2proxy = requestProxyPlatform.includes(uniPlatform);
      const pathParams = params?.pathParams || '';
      const finalUrl = `${domain}${url}`;
      // 优先级别：dev/prodBaseUrl > PROXY_PATH(项目配置/代理) > DOMAIN_DEV、DOMAIN_PRO
      const devUrl = isDev && hasDevBaseUrl ? `${params?.devBaseUrl}${url}` : need2proxy && PROXY_PATH ? `${PROXY_PATH}${url}` : finalUrl;
      const prodUrl = !isDev && hasProdBaseUrl ? `${params?.prodBaseUrl}${url}` : finalUrl;
      const envUrl = isDev ? devUrl : prodUrl;
      return `${envUrl}${pathParams}`;
    })();

    // 接口请求配置
    const optionsValue = (() => {
      const isUnauthorizedApi = !!unauthorizedApi.find((path) => url.includes(path));
      const requestOpt = JSON.parse(JSON.stringify(requestOptions)) || {};
      if (header) { // 自定义请求头
        requestOpt.header = header;
      }
      const invokeOpt = params || {};
      const optionsKeys = apiType === 'request' ? requestKeys : apiType === 'upload' ? uploadKeys : apiType === 'download' ? downloadKeys : [];
      const token = utils.storageAction({ key: TOKEN, action: 'get' });
      const mToken = utils.storageAction({ key: M_TOKEN, action: 'get' });
      const userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const { projectType,companyId } = commLogic.getProjectConfig();   
      const { uniPlatform } = uni.getSystemInfoSync();
      const isWeb = uniPlatform === 'web';   
      const userIdH5 = uni.getStorageSync('userId')
      const userAccountH5 = uni.getStorageSync('userAccount')
      const tokenH5 = uni.getStorageSync('token')
      const xiamenditie = PROJECT_CODE == 'XIAMENDITIE'
      const idToken = uni.getStorageSync('id_token')
      const optionsValue = {
        url: requestPath,
        header: {
          token: isWeb ? tokenH5 : token,
          'x-client-access-token': mToken,
          'x-applet-id': projectType,
          'x-userId-header': isWeb ? userIdH5 : userInfo.userId,
          'x-companyId-header': userInfo.companyId?userInfo.companyId:companyId, 
          'x-userAccount-header': userInfo.userAccount ? encodeURI(userInfo.userAccount) : '',
          'x-userName-header': userInfo.userName ? encodeURI(userInfo.userName) : '',
          'D-header-companyId':userInfo.companyId?userInfo.companyId:companyId,
          // 'Companyid':userInfo.companyId?userInfo.companyId:companyId,
          'Useraccount': isWeb ? userAccountH5 : '',
          sign:commLogic.createMd5Key(invokeOpt),
          locale: uni.getStorageSync('locale'),
          //  'D-USER-ID':userInfo.userId,
          //  'D-header-Authorization':mToken,
        },
      };

      if (xiamenditie) optionsValue.header['id_token']  = idToken

      // 先取配置值
      for (const key in requestOpt) {
        if (optionsKeys.includes(key)) {
          const isHeaderKey = key === 'header';
          const val = requestOpt[key];
          if (apiType === 'upload' && isHeaderKey) delete val['Content-Type'];
          optionsValue[key] = isHeaderKey ? { ...optionsValue[key], ...val } : val;
        }
      }
      // 再取接口调用定义
      for (const key in invokeOpt) {
        const val = invokeOpt[key];
        // header里的属性合并
        if (optionsKeys.includes(key) && val) {
          if (key === 'header') {
            // 二次修改的 header
            const invokeKeys = Object.keys(val).map(key => key.toLocaleLowerCase())
            // 默认设置的 header
            const defaultHeader = optionsValue[key]
            const defHeaderTmp = Object.keys(defaultHeader).filter(headerKey => {
              // 如果默认 header 里的 key，有被二次修改过，则需要排除掉
              const lowerKey = headerKey.toLocaleLowerCase()
              return invokeKeys.includes(lowerKey) ? false : true
            }).reduce((store, headerKey) => Object.assign(store, { [headerKey]: defaultHeader[headerKey] }), {})

            optionsValue[key] = { ...defHeaderTmp, ...val }
          } else {
            optionsValue[key] = val
          }
        }
      }
      // 删除 token
      if (isUnauthorizedApi) {
        delete optionsValue.header['token'];
        delete optionsValue.header['x-client-access-token'];
      }
      return optionsValue;
    })();

    const requestTypeOptions = {
      request() {
        const methodValue = typeof method === 'string' ? method : 'GET';
        const requestConfig = {
          ...optionsValue,
          data: params?.data || {},
          method: methodValue,
        };
        if (methodValue === 'GET') {
          requestConfig.data._t = new Date().getTime();
          requestConfig.header.sign = commLogic.createMd5Key(requestConfig)
        }
        return requestConfig;
      },
      download() {
        return optionsValue;
      },
      upload() {
        return optionsValue;
      },
    };

    return requestTypeOptions[apiType]() || {};
  }

  // 处理特别接口status
  handleParticularStatus(responseData, options) {
    const { url } = options
    const { status, resultCode} = responseData
    const { key } = apiParticularStatusKey.find(item => url.includes(item.path)) || {}
    return key && responseData[key] || status || resultCode
  }

  // 发起请求
  async request(options) {
    console.log('请求参数', options)
    const { apiType = 'request' } = options || {};
    await this.interceptorRequest(options);

    return new Promise((resolve, reject) => {
      const isObject = (d) => typeof d === 'object' && d !== null && !Array.isArray(d);
      if (!isObject(options.params)) options.params = {};
      const requestOptionsValue = this.optionsHandler(options);
      requestOptionsValue.complete = (response) => {
        options.params?.complete && options.params.complete(response);
        // 处理钉钉小程序ios和安卓返回值不一致问题
        if (response.header instanceof Array) {
          response.header = response.header.reduce((result, current) => {
            return { ...result, ...current };
          }, {});

        }
        this.responseComplete({ resolve, reject, response, options, requestOptionsValue });
      };
      if (apiType === 'request' || apiType === undefined) {
        uni.request(requestOptionsValue);
      }
      if (apiType === 'upload') {
        const fileTask = uni.uploadFile(requestOptionsValue);
        options?.params?.fileTaskCallback && options.params.fileTaskCallback(fileTask);
      }
      if (apiType === 'download') {
        const fileTask = uni.downloadFile(requestOptionsValue);
        options?.params?.fileTaskCallback && options.params.fileTaskCallback(fileTask);
      }
    });
  }

  // 断言
  handleAssertion(params) {
    const { action, response, requestOptionsValue } = params || {}
    const { url } = requestOptionsValue || {}
    const { contentTypeIsJson } = assertion
    const result = {}

    // 响应体无header，header里无contentType
    if (action === 'noneOfContentTypeInHeaderAndNoneOfHeaderInResponse') {
      const settingExisted = contentTypeIsJson.some(api => url.includes(api))
      result.contentTypeIsJson = settingExisted && response.header === undefined
    }

    return result
  }
}

export default new UniRequest();
