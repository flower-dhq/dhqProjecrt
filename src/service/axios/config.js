export default {
  // 响应配置
  responseConfig: {
    successCode: ['status:200', 'resultCode:200', 'result:1'], // 成功状态
    messageKeys: ['message', 'resultDesc'],
    unauthorizedCode: ['401'],
    requestSuccessText: '请求成功',
    requestFailureText: '请求失败，请稍后再试',
  },
  // 请求默认配置
  requestOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  },
  // 自定义属性
  customKeys: ['pathParams', 'hideLoading', 'data', 'loadingText', 'responseToast', 'successfulText', 'failureText', 'devBaseUrl', 'prodBaseUrl'],
};
