export default {
	// 响应配置
  responseConfig: {
    successCode: ['200', '10200', '1','204'], // 成功状态
    unauthorizedCode: ['401'],
    requestSuccessText: '请求成功',
    requestFailureText: '请求失败，请稍后再试'
  },
	// 请求默认配置
	requestOptions: {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		timeout: 30000,
	},
  // 自定义属性
  customKeys: [
    "pathParams",
    "hideLoading",
    "loadingText",
    "responseToast",
    "successfulText",
    "failureText",
    "devBaseUrl",
    "prodBaseUrl",
    "fileTaskCallback",
  ],
  // 上传传参属性
  uploadKeys: [
    "files",
    "fileType",
    "file",
    "filePath",
    "name",
    "header",
    "timeout",
    "formData",
    "success",
    "fail",
    "complete",
  ],
  // 下载传参属性
  downloadKeys: [
    "header",
    "timeout",
    "success",
    "fail",
    "complete",
    "filePath",
  ],
  // request请求传参属性
  requestKeys: [
    "data",
    "header",
    "timeout",
    "dataType",
    "responseType",
    "sslVerify",
    "withCredentials",
    "firstIpv4",
    "success",
    "fail",
    "complete",
  ],
	// 不携带token、不校验token过期时间的接口
	unauthorizedApi: [
		'/app/member/loginByMemberId',
    '/app/member/tokenLogin'
	],
  // 开发时，请求需要代理的平台(端)，值：uni.getSystemInfoSync().uniPlatform
  requestProxyPlatform: [
    'web'
  ],
  // 有些接口状态键名不是 status，故此，通过映射配置取指定的状态字段
  apiParticularStatusKey: [
    {
      path: '/rest/uploadFileInfo/uploadMutiFile',
      key: 'result'
    }
  ],
  // 断言
  assertion: {
    //例如：响应头没返回header，无法读取content-type，但是，响应体数据已知是application/json
    contentTypeIsJson: [
      '/rest/uploadFileInfo/uploadMutiFile'
    ]
  }
};
