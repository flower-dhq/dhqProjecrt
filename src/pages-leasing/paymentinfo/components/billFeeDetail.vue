<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="page">
            <view  v-if="settlementStatus == '1'">
                <u-cell-group>
                    <u-cell :title="billChargePeriod" style="font-weight: 600;"/>
                    <u-cell 
                        v-for="(item, index) in billFeeDetailData"
                        :key="index"
                        center 
                        :title="item.fiName" 
                    >
                        <template slot="label">
                            <span class="labelStyle">收款期限：{{item.receiveDeadLine}}</span>
                        </template>
                        <template slot="value">
                            <span class="black">￥</span>
                            <span class="black">{{item.receivableAmount}}</span>
                        </template>
                    </u-cell>
                </u-cell-group>
            </view>
            <view style="height: calc(100vh - 68rpx);overflow-y: scroll;" v-else>
                <u-cell-group>
                    <u-cell :title="billChargePeriod" style="font-weight: 600;"/>
                    <u-cell 
                        v-for="(item, index) in billFeeDetailData"
                        :key="index"
                        center 
                        :title="item.fiName"
                    >
                        <template slot="label">
                            <text class="labelStyle">收款期限：{{item.receiveDeadLine}}</text>
                        </template>
                        <template slot="value">
                            <text class="black">￥</text>
                            <text class="black">{{item.receivableAmount}}</text>
                        </template>
                    </u-cell>
                </u-cell-group>
                <view class="btn-cont" @click="gotoPay">去缴费</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{
            billFeeDetailData: [],
            billChargePeriod: "",
            settlementStatus: "",
        }
    },

    onLoad(){
        this.initData();
    },

    methods:{
        //初始化数据
        initData(){
            let self = this;
            if(uni.getStorageSync('billFeeDetailData')){
                self.billFeeDetailData = JSON.parse(uni.getStorageSync('billFeeDetailData'));
                if(self.billFeeDetailData.length > 0){
                    self.billFeeDetailData.forEach(item => {
                        item.receiveDeadLine = item.receiveDeadLine.slice(0, 10)
                    })
                }
            }
            if(uni.getStorageSync('billChargePeriod')){
                let date = uni.getStorageSync('billChargePeriod').replace('-', '年')
                self.billChargePeriod = date + "月"
            }
            self.settlementStatus = uni.getStorageSync('settlementStatus');
        },

        gotoPay(){
            uni.redirectTo({
                url:'/pages-leasing/paymentinfo/newPaymentCenter?type=1'
                // url:'/pages-leasing/paymentinfo/newPaymentCenter?projectType=184&memberId=3963eb222a0c4d62833faf9e3b0e978e&companyId=440&projectId=2933544&openId=orDTa4o9Mgewa6yIjZERztndYstE&roomId=99931962678'
                // url:'/pages-leasing/paymentinfo/newPaymentCenter?projectType=184&roomId=99931964732&memberId=9fc6c1100a74424aac6e33dde732553a&companyId=440&openId=orDTa4uYP5Na5u_eRluWAOquNgDE&projectId=2933544&phone=15061820157'
            });
            
        }
    }
}
</script>

<style scoped>
.page {
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
    font-family: PingFang SC, "Helvetica Neue", Arial, sans-serif;
}
.black{
    color: #333;
}
.labelStyle{
    margin-top: 8rpx;
    color: #969799;
    font-size: 24rpx;
    line-height: 36rpx;
}
.btn-cont{
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 68rpx;
  line-height: 68rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  background: var(--app-primary-color);
}
.footer-btn .u-button{
    /* width: 100%; */
    border-radius: 20px;
}
.page ::v-deep .u-cell-group{
    background: #ffffff;
}
.page ::v-deep .u-cell__title-text{
    font-weight: 500;
}
.page ::v-deep .u-line{
    border-bottom: 1px solid #ebedf0 !important;
}
</style>
