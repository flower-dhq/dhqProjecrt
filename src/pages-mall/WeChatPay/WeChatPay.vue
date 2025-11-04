<style lang="scss" scoped>
.page{
  height: 100%;
  width: 100%;
}
.pay-box{ 
  height: 70%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
   flex-direction:column;
} 
   
.pay-class{
  font-size: 18px;
 }
.pay-btn-box{ 
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: center;

}
.pay-btn{
  width:100%;
}
.from-h5{
  margin-bottom: 100rpx;
  width: 400rpx;
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  padding: 0;
}
</style>
<template>
  <view>
    <!--pages/WeChatPay/WeChatPay.wxml-->
    <view class="pay-box">
      <view class="pay-type">
      <view>
        <image v-if="paySuccess == '支付成功'" class="pay_success" src=""></image>
        <image v-if="paySuccess == '支付失败'"  class="pay_success" src="/pages-mall/static/error.png"></image>
        <image v-if="paySuccess == '支付中'"  class="pay_success" src="/pages-mall/static/loading.gif"></image>
        </view> 
      <text class="pay-class">{{paySuccess}}</text> 
      <button class="pay-btn" type="primary" open-type="launchApp" app-parameter="wechat"  binderror="launchAppError">点击返回APP</button>
      </view> 
        <!-- <view class="pay-btn-box">
        <button v-if="{{fromH5}}" class="pay-btn from-h5" bindtap="backToh5" type="primary">点击返回首页</button>
        <button wx:else class="pay-btn" type="primary" open-type="launchApp" app-parameter="wechat"  binderror="launchAppError">点击返回APP</button>
      </view>    -->
    </view> 
    <include src="../../js/utils/alert/alert.wxml" />
  </view>
</template>
<script>
import alert from '../../js/utils/alert/alert.js'
export default {
  data(){
    return{
      paySuccess:'支付中',
      orderInfo:{},
      payInfo:{},
      fromH5: false,
      wxPayVersion:null,
    }
  },

  methods:{
    onloadFun(options){
      var that = this;   
      if(options.wxPaymentVersion && options.wxPaymentVersion==2){
        var payInfo=JSON.parse(decodeURIComponent(options.params)) 
        that.setData({payInfo:payInfo, fromH5: true})
        wx.showLoading();
        that.appletLogin(1); 
      }else if(options.type == 'query'){
        that.setData({
          orderInfo:{
            modal:options.modal,
            orderNo:options.orderNo,
            totalAmount:options.totalAmount,
            projectId:options.projectId,
            returnUrl:options.returnUrl,
          }
        })
      }else{
        console.log('参数',JSON.parse(options.orderInfo))
        that.setData({
          orderInfo:JSON.parse(options.orderInfo)
        })
        wx.showLoading();
        that.appletLogin(); 
      }
    },

    /**
     * 游客登录注册接口
     */
    appletLogin (type) {
      var self = this;
      //调用登录接口
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求 
            wx.request({
              url: app.globalData.basePath + '/community/wechatInfo/appletLogin',
              data: {
                code: res.code,
                appletId: app.globalData.wxId
              },
              header: {
                "Content-Type": "application/json"
              },
              method: "post",
              success: function (res) {
                var result = res.data;
                console.info(res);
                console.log("获取的用户信息===="+JSON.stringify(result))
                if (result.status == 200) { 
                  app.globalData.openId = result.data.openId;
                  app.globalData.unionId = result.data.unionId;
                  app.globalData.token = result.data.token;
                  if(app.globalData.webUrl){
                    self.setData({
                      webUrl: app.globalData.webUrl+"indexNew?source=applet&unionId="+result.data.unionId
                    }); 
                    if(type==1){
                      self.onloadPay();
                    }else{ 
                      self.getPayUrl();
                    } 
                  }else{
                    alert.show(self, "warn", "登录失败");
                    console.log("webUrl参数未配置")
                  }
                }
                else {
                  wx.hideLoading();
                  alert.show(self, "warn", result.message);
                  console.log(result.errmsg);
                }
              },
              error: function () {
                wx.hideLoading();
                if (self.data.pullDown) { wx.stopPullDownRefresh() }
              }
            }) 
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },

    /**
     * 点击返回APP——失败事件
     */
    launchAppError (e) {
      console.log('返回APP失败！',e.detail.errMsg)
      console.log(e.detail.errMsg)
      // wx.showToast({
      //   title: "返回失败！",
      //   icon: 'none',
      // });
    },
    backToh5() {
      wx.reLaunch({
        url: '/pages-mall/index/index?loginType=H5Login'
      })
    },
    getPayUrl(){
      var self = this;
      console.log('调用支付')
      var orderInfo = {};
      if(self.options.type == 'query'){
        orderInfo={
          modal:self.options.modal,
          orderNo:self.options.orderNo,
          totalAmount:self.options.totalAmount,
          projectId:self.options.projectId,
          returnUrl:self.options.returnUrl,
          notifyUrl:self.options.notifyUrl
        }
      }else{
        orderInfo = JSON.parse(self.options.orderInfo);
      } 
      console.log('调用支付',orderInfo)
      console.log('获取到的信息',orderInfo) 
  
      //获取支付参数
      var params={
        orderNo: orderInfo.orderNo,
        payType: 1,
        totalAmount:orderInfo.totalAmount,
        returnUrl: orderInfo.returnUrl,
        type: 7,
        projectId: orderInfo.projectId,
        model: orderInfo.modal,
        other:{
          openId: app.globalData.openId,
        },
      } 
      if(self.options.type == 'query' && orderInfo.notifyUrl){
        params.notifyUrl=orderInfo.notifyUrl;
        params.body = orderInfo.orderNo;
      } 
      console.log('用户信息',app.globalData)
      wx.request({
        url: app.globalData.basePath + '/community/payCommon/getPay?_t='+new Date().valueOf(),
        data:params,
        header: {
          "Content-Type": "application/json",
          "token":app.globalData.token
        },
        method: "post",
        success: function (res) {
          let result = res.data;
          if(result.status == 200){
            self.toPay(result.data.data);
          }else{
            self.setData({
              paySuccess:'支付失败！'+result.message
            })
            wx.hideLoading();
          }
        },
        error: function () {
          self.setData({
            paySuccess:'支付失败'
          })
          wx.hideLoading();
        }

      }) 
    },
    toPay(pay){ 
      var that = this;
      let payInfo = JSON.parse(pay)
      // 发起微信支付
      wx.requestPayment({
        timeStamp: payInfo.timeStamp,
        nonceStr: payInfo.nonceStr,
        package: payInfo.package,
        signType: payInfo.signType,
        paySign:  payInfo.paySign,
        success (res) {  
          that.setData({
            paySuccess:'支付成功',
          })
          if(that.wxPayVersion==3){
            that.dfPayBack(pay.outTradeNo,1)
          }
          wx.hideLoading();
        },
        fail (res) {
          that.setData({
            paySuccess:'支付失败'
          })
          if(that.wxPayVersion==3){
            that.dfPayBack(pay.outTradeNo,0)
          }
          wx.hideLoading();
          console.log('失败原因',JSON.stringify(res))
        }
      }) 
    },
    //  获取支付信息新接口
    onloadPay(){ 
      let that = this;
      let item = that.data.payInfo;
      wx.request({
        url: app.globalData.basePath +'/community/payCommon/v2/getPay',
        data: {
          model:item.model,//必填 模块：huodong=活动，club=场馆/会所、parking=停车场、printing=打印
          orderNo:item.orderNo,//必填 业务订单号 
          payMethod:item.payMethod,//必填 支付类型：wx=微信、zfb=支付宝，yl=银联，common=通用
          tradeType:item.tradeType,//必填 支付方式：jsapi=微信公众号， mini=银联小程序，wxmini=微信小程序  app=app支付，
          assetsId:item.assetsId,//必填 资产（项目、园区、单元、楼栋、楼层、房间等）ID
          expenditure:item.expenditure,//费项名称,按费项支付时传入
          merge:item.merge,//合并支付标识，缺省值: false
          mergeParamsList:item.mergeParamsList,
          // [{
          //   assetsId:item.mergeParamsList.assetsId, //资产ID
          //   expenditure:item.mergeParamsList.expenditure, //费项名称
          //   totalAmount:item.mergeParamsList.totalAmount //分账金额
          // }],//合并支付，分账列表，merge=true时，必传
          expireTime:item.expireTime,//订单失效时间的 Unix 时间戳，缺省值：30分钟
          returnUrl:item.returnUrl,//支付完成跳转地址
          notifyUrl:item.notifyUrl,//上送支付中心回调接口
          totalAmount:parseInt(item.totalAmount),//必填 金额（单位：分）
          body:item.body,//订单描述
          attach:item.attach,//自定义参数JSON字符串
          thirdJson:item.thirdJson,//三方参数JSON字符串
          userId:item.userId,//用户ID
          userName:item.userName,//用户姓名
          openId: app.globalData.openId ,//用户支付ID，例:微信openId，支付宝用户唯一ID(productId)
        },
        header: {
          "Content-Type": "application/json"
        },
        method: "post",
        success (res) {   
          if(res.data.status==200){
            let JSONStr =res.data.data.data;
            if(JSONStr){ 
              that.toPay(JSONStr);
            } else{
              that.setData({
                paySuccess:'未获取到支付参数，请联系管理员！'
              })
            }
          }else{ 
                that.setData({
                    paySuccess:res.data.message
                  })
          }
          wx.hideLoading();
        },
        fail (res) {
          that.setData({
            paySuccess:'支付失败'
          })
          wx.hideLoading();
          console.log('失败原因',JSON.stringify(res))
        }
      }) 
    },

    //东孚支付回调
    dfPayBack(OutTradeNo,status){
      uni.navigateTo({
        url:`pages/dfPayment/dfPayment?outTradeNo=${OutTradeNo}&status=${status}`
      });
    }
  },


  onLoad(options) {
    // options.wxPaymentVersion  1:通用；2:奥联（好像）；3:东孚
    this.wxPayVersion=options.wxPaymentVersion
    if(options.wxPaymentVersion && options.wxPaymentVersion==3){
      this.toPay(options.params)
    }else{
      this.onloadFun(options)
    }
    
  }
}
</script>