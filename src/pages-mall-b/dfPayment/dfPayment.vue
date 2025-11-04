<template>
  <view class="webview-container">
    <web-view :src="url"></web-view>
  </view>
</template>
<script>
export default {
  data(){
    return{
      url:''
    }
  },
  onLoad(options){
    if(options.OutTradeNo){
      const {USER_INFO} = this.$constant;
      const {openId, phoneNumber, memberPhone, telephone} = this.$cmMth.storageAction({key: USER_INFO, action: 'get'});
      let phone = telephone || phoneNumber || memberPhone
      let search = `?phone=${phone}&OpenID=${openId}&type=1`
      let url = `http://wy.zjdf.com/${search}#/pages-mall/complete/complete?outTradeNo=${options.OutTradeNo}&status=${options.status}`
      this.url =url
    }else{
      const {USER_INFO} = this.$constant;
      const { openId, phoneNumber, memberPhone, telephone } = this.$cmMth.storageAction({ key: USER_INFO, action: 'get' })
      let phone = telephone || memberPhone || phoneNumber
      let url = `http://syzf.syswinsoft.com:8188/?phone=${phone}&OpenID=${openId}&type=1#/pages-mall/CheckPayment/CheckPayment`
      this.url =url
    }
    
  }
}
</script>
<style lang="scss" scoped>
.webview-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>