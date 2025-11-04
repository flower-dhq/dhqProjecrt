<template>
    <view id="pay-history-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="bill-record">
            <view class="bill-item" v-for="(item, index) in billList" :key="index">
                <u-row customStyle="flex-wrap: wrap;width: 100%">
                    <u-col span="8"  ><view class="fz-16 item-top">订单号：{{item.rhNum}}</view></u-col>
                    <u-col span="4" textAlign="right" ><view class="text-right fz-16 color-red item-top">{{item.invoiceStatusName}}</view></u-col>
                    <u-col span="8" ><view class="color-grey fz-14">{{item.fiName}}</view></u-col>
                    <u-col span="4" textAlign="right"><view  class="fz-14 text-right color-red">{{item.receivedAmount}}</view></u-col>
                    <u-col span="8" ><view class="fz-14 color-grey">{{item.receivedTime}}</view></u-col>
                    <u-col span="4" textAlign="right" ><view class="fz-14 text-right color-green">{{item.paymentTypeNames}}</view></u-col>
                </u-row>
            </view>
        </view>
    </view>
</template>

<script>
import util from "../js/utils";

export default {
    data(){
        return{
            billList: [],
        }
    },
    created(){
        this.initData();
    },
    methods:{
        initData(){
            let self = this;
          let selectedOrderData = util.storageAction({ key: 'selectedOrderData', action: 'get' });
            this.billList = JSON.parse(selectedOrderData).arr;
        }
    }
}
</script>

<style lang="scss" scoped>
    @mixin flx-dsp($jsc, $ali, $drt:row) {
        display: flex;
        flex-direction: $drt;
        justify-content: $jsc;
        align-items: $ali;
    }
    #pay-history-list{
        $font-s: 28rpx;
        box-sizing: border-box;
        padding: 22rpx 0;
        height: 100vh;
        background-color: #f5f5f5;
        .bill-record {
            color: #333;
            .bill-item{
                background-color: #fff;
                margin: 0 22rpx 22rpx;
                padding: 22rpx;
                border-radius: 14rpx;
                line-height: 50rpx;
                .fz-16{
                    font-size: 30rpx;
                }
              .fz-14 {
                font-size: 28rpx;
              }
              .color-blue{
                    color: #2761ff;
                }
                .text-right{
                    text-align: right;
                }
                .color-red{
                    color: #ff3300;
                }
                .item-top{
                    border-bottom: 1px solid #eee;
                    padding: 14rpx 0;
                    margin-bottom: 14rpx;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .color-grey{
                    color: #aaa;
                }
                .color-green{
                    color: rgb(43,162,70);
                }
            }
        }
    }
</style>
