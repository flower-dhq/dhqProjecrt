<template>
    <view class="page">
        <view class="box-top">
            <view>代付金额</view>
            <view style="font-size: 1.4em">￥{{totalMoney}}</view>
            <view>通过微信将代付请求发送给好友，让他为你代付吧！</view>
            <view>
                <span>剩余支付时间  </span>
                <u-count-down
                    :time="countdown"
                     @finish="finish"
                     style="display: inline-block;"
                >
                    <!-- <template v-solt="timeData">
                        <span class="block">{{ timeData.minutes }}</span>
                        <span>:</span>
                        <span class="block">{{ timeData.seconds }}</span>
                    </template> -->
                </u-count-down>
            </view>
        </view>
        <view class="box-middle">
            <view>付款说明：</view>
            <view>1.对方需要开通微信支付才能帮你付款，如果未开通，请重新选择好友发送！</view>
            <view>2.当发生重复缴费情况，所退费用将直接退回到缴费的账户</view>
            <view>3.支持有效时间30分钟</view>
        </view>
        <view class="box-footer" v-if="isShow">
            <view class="code-item" @click="WXShareFun">
              <canvas id="qrcode" canvas-id="qrcode" class="qrcode"></canvas>
                <!-- <img src="./../../assets/images/payment/code_img.jpg" style="width: 100%;"> -->
                <a class="code-link"></a>
            </view>
            <view style="color: #ccc;">请点击二维码分享好友付款</view>
        </view>
        <view class="box-footer" v-if="!isShow">
            <view v-if="isdealing">正在生成二维码请稍后...</view>
            <view v-if="!isdealing">二维码已失效</view>
        </view>
    </view>
</template>

<script>
import UQRCode from 'uqrcodejs'
import {
  makeBillSharingSetting,   //账单分享
  getBillSharingSettingTime,    //获取账单分享时间
} from "@/service/leasing";
import Utils from '@/js/utils'

export default {
    data(){
        return{
            shareInfo: {},
            isShow: false,
            isdealing: true,
            key: "",
            shareTime: "",   //分享账单时间
            countdown: "",   //倒计时，单位是毫秒
            totalMoney: "0",
            targetUrl: "",
            setTime: "",
            userInfo: {},
        }
    },
  onLoad(options){
      var O_USER_INFO = this.$constant.O_USER_INFO;
      this.userInfo = this.$utils.storageAction({
        key: O_USER_INFO,
        action: 'get'
      });
        this.shareInfo = JSON.parse(decodeURIComponent(options.shareInfo));
        this.totalMoney = this.shareInfo.totalMoney;
        this.getOrderKey();
    },
    methods:{
        //获取订单key
        getOrderKey(){
            let self = this;
            self.isdealing = true;
            let data = {
                customerId: self.shareInfo.customerId,
                customerName: self.shareInfo.customerName,
                addrInfo: self.shareInfo.addrInfo,
                contactTel: self.shareInfo.contactTel,
                billDetailIds: self.shareInfo.billDetailIds,
                projectId: self.shareInfo.projectId,
            }
            var params = {
              data: data,
              hideLoading: true,
              responseToast: false,
            }
            makeBillSharingSetting(params).then(res => {
                if(res.status == 200){
                    self.isShow = true;
                    self.key  = res.data;
                    self.targetUrl = this.$appConfig.DOMAIN_PRO + "/ygdsf/#/WXSharePage/?key=" + self.key + "&=userName" + this.userInfo.userName;
                    self.getShareTime();   //获取分享账单时间
                    self.$nextTick(function () {
                        self.creatQrCode();  //生成二维码
                    })
                }else{
                    // Toast(res.message);
                  uni.showToast({ title: res.message, icon: 'none' });
                }
            })
        },

        //获取分享账单时间
        getShareTime(){
            let self = this;
            let data = {
                value: self.key,
            }
            var params = {
              data: data,
              hideLoading: true,
              responseToast: false,
            }
            getBillSharingSettingTime(params).then(res=>{
                if(res.status == 200){
                    self.shareTime = res.data;
                    self.setCountDown();  //设置倒计时
                }
            })
        },

        //设置倒计时
        setCountDown(){
            let self = this;
            const dateEnd = Utils.timeFormat(self.shareTime)
            dateEnd.setMinutes(dateEnd.getMinutes() + 30) //结束时间=账单分享时间+30分钟
            const dateNow = new Date()

            // let endTimeObj = moment(self.shareTime).add(30, 'm');   //结束时间=账单分享时间+30分钟
            let endTime = uni.$u.timeFormat(dateEnd.getTime(), 'yyyy-mm-dd hh:MM:ss'); //结束时间格式化
            let nowDate = uni.$u.timeFormat(dateNow, 'yyyy-mm-dd hh:MM:ss');  //当前时间
            // let diffMillisecond = moment(endTime).diff(moment(nowDate), 'milliseconds');   //倒计时=结束时间-当前时间
            let diffMillisecond = dateEnd.getTime() - dateNow.getTime()
            if(diffMillisecond > 0){
                self.countdown = diffMillisecond;
                self.isShow = true;
            }else{
                self.isShow = false;
                self.isdealing = false;
            }
        },

        //倒计时结束
        finish(){
            this.isShow = false;
            this.isdealing = false;
        },

        //  生成二维码
        creatQrCode () {
            let self = this;
            // let qrcode = new QRCode(self.$refs.qrCodeUrl.$el, {
            //     width: 220,
            //     height: 220,        // 高度
            //     text:  self.targetUrl,   // 二维码内容
            //     render: 'table' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            //     // background: '#f0f',   // 背景色
            //     // foreground: '#ff0'    // 前景色
            // })
          var qr = new UQRCode();
          // 设置二维码内容
          qr.data =  self.targetUrl;
          // 设置二维码大小，必须与canvas设置的宽高一致
          qr.size = 220;
          // 调用制作二维码方法
          qr.make();
          // 获取canvas上下文
          var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
          // 设置uQRCode实例的canvas上下文
          qr.canvasContext = canvasContext;
          // 调用绘制方法将二维码图案绘制到canvas上
          qr.drawCanvas();
        },

         //开始点击
        getTouchStart(){
            let self = this;
            clearTimeout(this.setTime);
            this.setTime = setTimeout(function(){
                // Toast("打开微信分享二维码");
              uni.showToast({ title: '打开微信分享二维码', icon: 'none' });
                self.WXShareFun();
            },2000);
        },

        //结束点击
        getTouchEnd(){
            clearTimeout(this.setTime);
        },

        WXShareFun(){
            let self = this;
            let type = 0; //type,0-图片，1-url；
            let title = "有一笔待缴订单，烦请查阅";
            let desc = self.shareInfo.customerName + "有一笔订单请你帮我付，" + self.totalMoney + "元";
            let url = self.targetUrl;
            // EbeiPlugins.shareURLToWeixin(type,title,desc,url);
          uni.share({
            provider: "weixin",
            scene: "WXSceneSession",
            type: 2,
            imageUrl: url,
            success: function (res) {
              console.log("success:" + JSON.stringify(res));
            },
            fail: function (err) {
              console.log("fail:" + JSON.stringify(err));
            }
          });
        }

    },
}
</script>

<style lang="scss" scoped>
.page{
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 1.2em;
}
.box-top{
    height: 27%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 30rpx;
    background: linear-gradient(to bottom,#99cafd,#ffffff)
}
.box-middle{
    height: 27%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 30rpx;
    font-size: 28rpx;;
}
.box-footer{
    height: 46%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 30rpx;
    align-items: center;
}
.code-item{
     width: 220px;
      height: 220px;
    text-align: center;
    // padding: 20px;
    //border: 1px solid #99cafd;
    //border-radius: 1.8em;
    .qrcode{
      width: 100%;
      height: 100%;
    }
}
.block{
    padding: 1px 3px;
    border: 1px solid #666;
    border-radius: 5px;
    box-shadow: none;
    text-align: center;
    display: inline-block;
}

</style>

<style>
body {
    background-color: #fff;
}
.qrcode img{
    padding: 20px;
}
</style>
