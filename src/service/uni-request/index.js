import uniRequestConfig from './config.js';
import constant from '@/js/constant';
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
import commonMethod from '@/js/commonMethod';
import appConfig from '@/app-config';
const { unauthorizedApi, requestOptions, requestProxyPlatform, responseConfig, uploadKeys, downloadKeys, requestKeys, apiParticularStatusKey, assertion } = uniRequestConfig;
const { PROXY_PATH, DOMAIN_DEV, DOMAIN_PRO } = appConfig;
const { TOKEN, M_TOKEN, MEMBER_ID, WX_USERID } = constant;
const { storageAction } = utils;
const throttle = commonMethod.throttle();

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
    const { responseToast = false, successfulText, failureText } = params || {};
    const notSuccessNotHideToast = success === false && responseToast !== false; // 请求不成功，没有设置隐藏Toast，不成功则提示
    const notSuccessHideToast = success === false && !(responseToast === false); // 请求不成功，设置隐藏Toast
    const successHideToast = success === true && !(responseToast !== true); // 请求成功，不提示
    const successShowToast = success === true && responseToast === true; // 请求成功，responseToast为true则提示
    const mallUnauthorized = status == 10401;
    const shwoToast = notSuccessNotHideToast || notSuccessHideToast || successHideToast || successShowToast;
    if (shwoToast && !mallUnauthorized)
      uni.showToast({
        title: success && successfulText ? successfulText : !success && failureText ? failureText : message,
        duration: 2000,
        icon: 'none',
      });
  }

  // 校验及刷新token
  verifyToken() {
    const token = storageAction({ key: TOKEN, action: 'get' });
    const expires = false;
    if (expires && !this.isRefreshing) {
      this.isRefreshing = true;
      return refreshToken({ token, loading: false }).then((res) => {
        const newToken = res.data.token;
        storageAction({ key: TOKEN, action: 'set', value: newToken });
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
    return Promise.resolve();
  }

  // 响应完成
  responseComplete({ resolve, reject, response, options, requestOptionsValue }) {
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
        const tokenInvalid = data.hasOwnProperty('token_code') && data.token_code == -1;

        return {
          ...others,
          statusCode,
          status: tokenInvalid ? 401 : (status ??  null),
          success: !!jsonTypeSuccess,
          data: d,
          message: tokenInvalid ? '令牌无效，请登录! ' : httpSuccess ? (message ? message : requestSuccessText) : message ? message : requestFailureText,
        };
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
  }

  // 处理options参数
  optionsHandler(options) {
    const { url = '', method, params, apiType = 'request' } = options || {};
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
      const requestOpt = requestOptions || {};
      const invokeOpt = params || {};
      const optionsKeys = apiType === 'request' ? requestKeys : apiType === 'upload' ? uploadKeys : apiType === 'download' ? downloadKeys : [];
      const token = storageAction({ key: TOKEN, action: 'get' });
      const mToken = storageAction({ key: M_TOKEN, action: 'get' });
      // const { projectType,companyId } = commLogic.getProjectConfig();
      const { mProjectType, projectType, companyId } = commLogic.getProjectConfig();
      console.log('mProjectType==invokeOpt', invokeOpt,method)
		  // 加入签名sign
      var headers = {
        token,
        'x-client-access-token': mToken,
        'x-applet-id': mProjectType || projectType,
        'x-user-id-header':storageAction({ key: WX_USERID, action: 'get' }),
        sign:commLogic.createMd5Key(invokeOpt)
      };
      if(companyId){
        headers["myCompanyId"] = companyId;
        headers["x-companyId-header"] = companyId;
      }
      if(utils.storageAction({ key: "O_USER_INFO", action: 'get' })){
        const { phoneNumber,wxUserId,wxUserName } = utils.storageAction({ key: "O_USER_INFO", action: 'get' });
      
        if(wxUserId){
          
          headers["myUserId"] = wxUserId;
        }
        // if(wxUserName){
          
        //   headers["myUserName"] = wxUserName;
        // }
        if(phoneNumber){
         
          headers["myPhone"] = phoneNumber;
        }
      }
      
      const optionsValue = {
        url: requestPath,
        // header: headers,
      };

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
          optionsValue[key] = key === 'header' ? { ...optionsValue[key], ...val } : val;
        }
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
        // 将字符串参数转化成数组的接口
        // 将字符串参数转化成数组的接口
        if(requestConfig.url && (
          requestConfig.url.indexOf('/community/projectTab/getListByMap') > -1 
        || requestConfig.url.indexOf('/decorationManage/dicDetail/getDicDetailType') > -1)
        || requestConfig.url.indexOf('/community/enterpriseAuth/applyJoinCompany') > -1
        || requestConfig.url.indexOf('/question/questionnaire/addQuestionnaireAnswer') > -1
        || requestConfig.url.indexOf('/question/returnVisit/saveQuestionnaireAnswer') > -1
        || requestConfig.url.indexOf('/community/payCommon/v2/getPay') > -1
        || requestConfig.url.indexOf('/decorationApp/addAPPDecoration') > -1){
          for(let Key in requestConfig.data){
            let thatKey = requestConfig.data[Key]
            if(typeof thatKey == 'string' && thatKey.indexOf('[')>-1 && thatKey.indexOf(']')>-1){
              requestConfig.data[Key] = JSON.parse(thatKey)
            }
          }
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
    const { status } = responseData
    const { key } = apiParticularStatusKey.find(item => url.includes(item.path)) || {}
    return key && responseData[key] || status
  }

  // 发起请求
  async request(options) {
    const { apiType = 'request' } = options || {};
    await this.interceptorRequest(options);

    return new Promise((resolve, reject) => {
      const isObject = (d) => typeof d === 'object' && d !== null && !Array.isArray(d);
      if (!isObject(options.params)) 
      {
        options.params = {};
      }
      
      const requestOptionsValue = this.optionsHandler(options);
      requestOptionsValue.complete = (response) => {
        options.params?.complete && options.params.complete(response);
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
