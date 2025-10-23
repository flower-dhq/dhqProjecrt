import Vue from 'vue'
import {ready, errorReport} from '@/js/mpaasTitleStyle.js';
import {tokenCheck} from '@/js/tokenCheck.js'
import util from '@/js/utils'

const { MEMBER_ID, TOKEN, USER_TYPE } = Vue.prototype.$constant
const token = util.storageAction({ key: TOKEN, action: 'get' })

export default async(operationType = '',requestBody = {},requestType = 'POST',errorPage = '',errorType = '',timeout = 20)=>{
  let response = await new Promise(resolve => {
    ready(function(){
      let params = [{
        "_requestBody":requestBody
      }];
      if (requestType == 'GET'){
        params = [requestBody];
      }
      if (requestBody instanceof Array) {
        params = requestBody;
      }
      var timestamp=new Date().getTime();
      var requestId = operationType + timestamp;
      // alert(JSON.stringify(params))
      AlipayJSBridge.call('rpc', {
        operationType: operationType,
        requestData: params,
        timeout: timeout,
        headers:{
          "token": token,
          "requestId":requestId
        }
      }, function (res) {
        console.log(res);
        //判断网络报错或者网络超时状态
        // networkStartType(res);
        // if(res.token_code=='-1'||res.token_code=='-2'){
        //   tokenCheck(res,res.token_code,res.code);
        //   return
        // }
        // token_code: -1:token为空，-2:token:无效或者过期
        if (res.token_code != undefined) {
          if(res.token_code=='-1'||res.token_code=='-2'){
            tokenCheck(res.token_code,res.code);
          }
        }
        let isMpaas = process.env.moduleConfig.isMpaas;
        if (isMpaas == undefined){
          isMpaas = true;
        }
        resolve(res);
        if(res.status=='200'||res.resultCode=='200'||res.status=='1'){

        }else{

          if (operationType == 'rest.projectInfo.projectList'){

          } else {
            errorReport(isMpaas, errorPage, errorType, operationType, res);
          }
        }

      });
    })
  })
  return response;
}
