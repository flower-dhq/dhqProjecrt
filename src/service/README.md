### UniRequest类
1、全局统一处理接口请求的相同事务，例如：loading显示/隐藏、请求头设置、响应完toast提示等等


### 定义/新增接口说明
1、接口模块化，按服务划分，例如community服务，新建community.js文件在里面定义接口  
2、在/src/service/下定义的js文件，都会当做接口模块文件自动在index.js引入  
3、有些/src/service/下js文件不是接口文件，需要在index.js里excluedFile数组添加文件路径忽略


### 接口配置文件
1、配置文件在/src/service/uni-request/config.js  
2、requestOptions：请求时默认配置属性  
3、requestProxyPlatform：请求跨域时需要代理平台(web、小程序、App)，目前就web端

### 定义业务接口参数

| 属性名  | 说明                             | 类型   | 默认值  | 必填 |
| :------ | :------------------------------- | :----- | :------ | :--- |
| url     | 具体请求接口路径(不包含域名端口) | String | 无      | 是   |
| params  | 调用接口传的参数                 | Object | {}      | 否   |
| method  | 请求方式                         | String | GET     | 否   |
| apiType | 请求类型 request upload download | String | request | 否   |

#### 示例代码

```js
// /src/service/community.js

// 接口模块化，按服务community划分

import uniHttp from './uni-request';
const servicePath = '/community'; // 接口服务路径名


export const uploadFile = getCompanyConfig = (params = {}) => {
	const args = {
		url: servicePath + '/companyConfig/getCompanyConfig',
		method: 'POST',
		params,
		apiType: 'request'
	};
	return uniHttp.request(args);
}

export const uploadFile = (params = {}) => {
	// 若个别接口不同于其他接口请求前缀(协议+域名+端口)，可通过devBaseUrl、prodBaseUrl自定义配置
	const args = {
		url: '/upload/files',
		params: {
			...params,
			devBaseUrl: '/LC', // 会覆盖项目配置/app-config/project/下的DOMAIN_DEV，若代理了也会覆盖PROXY_PATH
			prodBaseUrl: 'http://123.45.67.890' // 覆盖 DOMAIN_PROD
		},
		apiType: 'upload'
	};
	return uniHttp.request(args);
}

```

### 调用业务接口参数

| 属性名           | 说明                                                  | 类型                      | 默认值 | 必填 |
| :--------------- | :---------------------------------------------------- | :------------------------ | :----- | :--- |
| data             | 请求的参数                                            | Object/String/ArrayBuffer | 无     | 否   |
| header           | 设置请求头                                            | Object                    | 无     | 否   |
| pathParams         | 路径参数                                              | String                    | 无     | 否   |
| hideLoading      | 请求时是否隐藏 loading(默认显示)                      | Boolean                   | 无     | 否   |
| loadingText      | 请求时 loading 的提示文字                             | String                    | 加载中 | 否   |
| responseToast    | 请求完toast提示是否显示(请求失败默认显示，成功不显示) | Boolean                   | 无  | 否   |
| successfulText   | 请求成功后的提示语                                    | String                    | 无     | 否   |
| failureText      | 请求失败后的提示语(会覆盖后端接口返回)                | String                    | 无     | 否   |
| devBaseUrl       | 开发环境：协议+域名+端口                              | String                    | 无     | 否   |
| prodBaseUrl      | 生产环境：协议+域名+端口                              | String                    | 无     | 否   |
| fileTaskCallback | 上传/下载 fileTask 对象回调                           | Function                  | 无     | 否   |

#### 示例代码

```js
// 需要引入对应模块的接口
import { getCompanyConfig, uploadFile, downloadFile} from '@/service/community';

// 普通请求
const params {
	data: { 
		companyId: '1'
	},
	pathParams: '/10/1' // 最终拼接成：http://主机地址/具体业务接口路径/10/1
	// 除了自定义属性(pathParams)外，原生(data|dataType|sslVerify)uni.request/uploadFile/download接口请求支持的传参属性，在这里同样支持，需要去/service/config.js配置对应键名
}

getCompanyConfig(params).then(res => {

	if (res.success) { // 接口状态判断用此属性
		// 请求成功业务逻辑处理
	}
})

// 上传
const params {
	filePath: '要上传文件资源的路径',
	name: 'file',
	fileTaskCallback: (fileTask) => {
		// fileTask：uploadTask 对象，对象身上方法具体看文档
		fileTask.onProgressUpdate((res) => {
			console.log('上传进度' + res.progress);
			console.log('已经上传的数据长度' + res.totalBytesSent);
			console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
			// 测试条件，取消上传任务。
			if (res.progress > 50) {
				fileTask.abort();
			}
		});
	}
}

uploadFile(params).then(res => {

	if (res.success) {
		// 请求成功业务逻辑处理
	}
})

// 下载
const params {
	loadingText: '下载中',
	fileTaskCallback: (fileTask) => {
		// fileTask：uploadTask 对象，对象身上方法具体看文档
		fileTask.onProgressUpdate((res) => {
			console.log('下载进度' + res.progress);
            console.log('已经下载的数据长度' + res.totalBytesWritten);
            console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
			// 测试条件，取消下载任务。
			if (res.progress > 50) {
				fileTask.abort();
			}
		});
	}
}

downloadFile(params).then(res => {

	if (res.success) {
		// 请求成功业务逻辑处理
	}
})

```

### 多个请求时，loading显示
1、因为 uni.showLoading 相当于单例   
2、多个http请求时，响应快的接口会loading隐藏掉，其他接口没响应完loading也没显示  

```js
	import { getList, getAppConfig} from '@/service/community';
	// 多个http请求，隐藏里面loading，使用外面自定义loading
	const getList = getList({hideLoading: true})
	const getAppConfig = getAppConfig({hideLoading: true})
	const pmsAll = [getList, getAppConfig]

	// 显示loading
	uni.showLoading({ title: '加载中'})
	Promise.all(pmsAll).finally( => {
		// 隐藏loading 
		// 只要有一个promise先变成 reject状态，不管其他promise是否resolve、reject，都会执行 finally，导致其他接口还在请求loading就关了
		uni.hideLoading()
	})

	// 这种方式接口请求事件会叠加
	async onLoad() {
		uni.showLoading({ title: '加载中'})
		await getList({hideLoading: true}).catch(_ => {})
		await getAppConfig({hideLoading: true}).catch(_ => {})
		uni.hideLoading()
	}

```