<template>
    <view id="pay-result" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view v-show="payStatus == ''">
        <view class="pay-result-container">
            <u-loading-icon color="var(--app-primary-color)" textSize="22" style="margin: 40rpx 0;"></u-loading-icon>
            <view class="pay-result-title">正在获取支付结果,请稍后……</view>
        </view>
    </view>

    <view v-if="payStatus==='0'">
        <view class="pay-result-container">
            <p class="wait-pay-tips">正在支付……</p>
            <view class="button-container">
                <view class="unpay-button" @click.stop="notPayClick">尚未支付</view>
                <view class="paied-buttton" @click.stop="alreadyPayClick">我已支付</view>
            </view>
        </view>
    </view>

    <view v-if="payStatus==='1'">
        <view class="pay-result-container">
            <u-icon name="checkmark-circle" size="22" color="var(--app-primary-color)"></u-icon>
            <view class="pay-result-title">支付成功</view>
            <view class="pay-result-tips">请点击确定按钮，返回上一级！</view>
            <view class="result-confirm-button" @click.stop="confirmClick">确定</view>
        </view>
    </view>

    <view v-if="payStatus==='-1'">
        <view class="pay-result-container">
            <u-icon name="close-circle" size="22" color="#ff3c3c"></u-icon>
            <view class="pay-result-title">支付失败</view>
            <view class="pay-result-tips">请重新进入订单，进行支付！</view>
            <view class="result-confirm-button" @click.stop="confirmClick">确定</view>
        </view>
        </view>
    </view>
</template>

<script>
import {
    isPaySuccess2,
} from "../../service/community";
export default {
    data(){
        return{
            orderNo: '',   //调用支付的模块 缴费：jiaofei
            payModel: '',   //订单号
            payType: "",    //支付类型
            projectId: "",   //projectId
            payStatus: "",  //支付状态  空-未支付，0-等待支付 1-支付成功 -1 支付失败
            paymentAmount: "",  //缴费金额
            customerId: "",   //客户id
        }
    },

    onLoad(options){
        this.getPayResult(options);
    },

    mounted(){
        
    },

    methods: {
        getPayResult(options){
            let data = {
                orderNo: options.orderNo
            };
            isPaySuccess2({data: data}).then(res => {
                if (res.status  == 200) {
                    if (res.data.state == 1) {
                        //已支付
                        this.payStatus = '1';
                    }
                    else {
                        //未支付
                        this.payStatus = '-1';
                    }
                }
                else {
                    //请求失败
                    this.payStatus = '-1';
                }
            })
        },

        //尚未支付按钮
        notPayClick () {
            this.payStatus = '-1';
        },

        //我已支付按钮
        alreadyPayClick () {
            // this.grantIntegral();  //发放积分
            uni.redirectTo({
                url:'/pages-leasing/paymentinfo/newPaymentCenter?type=1'
            });
        },

        //支付成功返回上一页
        confirmClick () {
            uni.redirectTo({
                url:'/pages-leasing/paymentinfo/newPaymentCenter?type=1'
            });
        },
    }
}
</script>

<style scoped>
  #pay-result {
    height: 100vh;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    background: #F6F7F9;
  }

  .pay-result-container {
    /* padding: 28px; */
    background: white;
    /* margin: 0px 50px; */
    padding: 28px 50px;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pay-result-title {
    color: #333333;
    margin-top: 10px;
    font-size: 15px;
  }

  .pay-result-tips {
    color: #666666;
    margin: 15px 0px;
    font-size: 12px;
  }

  .result-confirm-button {
    width: 120px;
    text-align: center;
    background: var(--app-primary-color);
    height: 34px;
    line-height: 34px;
    color: white;
    border-radius: 3px;
    font-size: 14px;
  }

  .wait-pay-tips {
    margin: 25px 0px;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: center;
    color: white;
    margin-top: 15px;
  }

  .paied-buttton {
    width: 105px;
    height: 34px;
    background-color: var(--app-primary-color);
    color: white;
    border-radius: 3px;
    line-height: 34px;
  }

  .unpay-button {
    width: 105px;
    height: 34px;
    color: var(--app-primary-color);
    border: 1px solid var(--app-primary-color);
    border-radius: 3px;
    background-color: #fefefe;
    margin-right: 13px;
    line-height: 34px;
  }

</style>
