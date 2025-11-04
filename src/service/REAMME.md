
 #### 定义业务接口参数(ARG)
 
| 属性名  | 说明           | 类型   | 默认值   | 必填 |
| :---- | :------------- | :----- | :------- | :--- |
| url | 具体请求接口路径 | String | 无 | 是   |
| params | postParams 调用接口传的参数 | Object | {} | 否   |
| method | 请求方式 | String | GET | 否   |
| headers | 设置请求头 | Object | 无 | 否   |


 #### 示例代码
 ```
// 登录
export const qpiUserLogin = (params) => {
  const args = {
    url: `${servicePath}/rest/userInfo/qpiUserLogin`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}
 ```
 

 #### 调用业务接口参数(POST_PARAMS)

| 属性名  | 说明           | 类型   | 默认值   | 必填 |
| :---- | :------------- | :----- | :------- | :--- |
| data | 请求的参数 | Object | 无 | 否   |
| hideLoading | 请求时是否隐藏loading | Boolean | 无 | 否   |
| loadingText | 请求时loading的提示文案 | String | 无 | 否   |
| responseToast | 响应的toast提示(失败显示，成功不显示) | Boolean | false | 否   |
| successfulText | 请求成功后的提示语 | String | 无 | 否   |
| failureText | 请求失败后的提示语(会覆盖后端接口返回) | String | 无 | 否   |
| pathParams | 路径参数 | String | 无 | 否   |

 #### 示例代码
 ```
<script setup>
import { qpiUserLogin } from '@/service/landcrm';

const params = {
    data: {
      userAccount: 'ybwlkjadmin'
    },
		// hideLoading: true
		// responseToast: false,
		// successfulText: '请求成功',
		// failureText: '请求失败'
  };
  qpiUserLogin(params).then((res) => {
    if (res.success) {}
  });
</script>

 ```
 
