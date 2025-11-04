<template>
    <div class="pay-history-list">
        <div class="choose-date">
              <view class="time-container" @click="showTimePlugin({key:'startTime'})">
                <span class="time-info" >{{startTime}}</span>
                <u-icon
                    name="arrow-down"
                    style="fill: rgba(84,84,84, 1)"
                    size="16rpx"
                ></u-icon>
              </view>

              <view class="middle"></view>
              <view class="time-container" @click="showTimePlugin({key:'endTime'})">
                <span class="time-info" >{{endTime}}</span>
                <u-icon
                    name="arrow-down"
                    style="fill: rgba(84,84,84, 1)"
                    size="16rpx"
                ></u-icon>
              </view>

        </div>
        <scroll-view  scroll-y="true" @scrolltolower="loadMore" >
                <div class="bill-record">
                    <div class="bill-item" v-for="(item, index) in billList" :key="index">
                        <u-row customStyle="flex-wrap: wrap;width: 100%;">
                            <u-col span="8" ><view class="fi-name">{{item.fiName}}</view></u-col>
                            <u-col span="4" ><view class="text-right payment-status">{{item.paymentStatusName}}</view></u-col>
                            <u-col span="8"  ><view class="order-num">订单号：{{item.orderNum}}</view></u-col>
                            <u-col span="4" ><view class="text-right color-red"><span class="pay-name">{{item.paymentName}}</span>￥{{item.paymentAmount}}</view></u-col>
                            <u-col
                                span="12"
                                style="border-bottom: 1px dashed #eee;margin-bottom: 0.5em;padding: 0.5em 0;"
                            ><view class="payment-date">{{item.paymentDate}}</view></u-col>
                        </u-row>
                    </div>
                </div>
      </scroll-view>
      <u-datetime-picker
          :show="showTime"
          v-model="timeValue"
          mode="date"
          cancelText="清除"
          @confirm="confirmTime"
          @cancel="cancelTime"
          @close="closeTime"
          :closeOnClickOverlay="true"
      ></u-datetime-picker>
  </div>
</template>

<script>
import {
    getReceiptHistoryList,     //缴费记录查询
} from "@/service/leasing.js";
import Utils from '@/js/utils'

export default {
    props:{
        customerId:{
            type: String,
            default: "",
        },
        projectId:{
        type: String,
        default: "",
      }

    },
    data(){
        return{
            startTime: '开始时间',
            endTime: '结束时间',
            billList: [],
            pageSize: 10,
            currentPage: 0,
            totalCount: "",
            loading: false,
            finished: false,
            refreshing: false,
            showTime: false,
            timeValue: Number(new Date()),
            key: '',
        }
    },
    onLoad(){
    },
    methods:{
        // 选择时间
        showTimePlugin(params) {
          const {key} = params;
          this.timeValue =  Number(new Date());
          this.showTime = true;
          this.key = key;
        },

        //下拉刷新数据
        onRefresh() {
            this.currentPage = 1
            this.finished = false;
            this.loading = true;
            this.getListData(0)
        },

        //上拉加载数据
      loadMore() {
            this.currentPage += 1
            this.getListData(1)
        },

        // 重置加载数据
        resetLoadData () {
            this.currentPage = 1;
            this.finished = false;
            this.loading = true;
            this.getListData(0);
        },

        //获取列表数据
        getListData(flag){
            let self = this;
            if (self.refreshing) {
                self.billList = [];
                self.refreshing = false;
            }
            let data = {
                projectId: this.projectId,
                startDate: self.startTime!= "开始时间" ? uni.$u.timeFormat(self.startTime, 'yyyy-mm-dd') : "",
                endDate: self.endTime!= "结束时间" ? uni.$u.timeFormat(self.endTime, 'yyyy-mm-dd') : "",
                orderStates: "1,4",    //支付成功，已撤销
                ifShowFiName: 1,    //显示费项
                pageIndex: self.currentPage,
                pageSize: self.pageSize,
                customerId: self.customerId,
            };
            var params = {
              data: data,
              hideLoading: true,
              responseToast: false,
            }
            getReceiptHistoryList(params).then(res=>{
                if(res.status == 200){
                  if(res.data && res.data.total){
                      self.totalCount = res.data.total;
                      self.loading = false;
                      res.data.records.forEach(item => {
                        if(Array.isArray(item.fiName))
                        item.fiName = item.fiName.map(fi => fi.fiName).join();
                      })
                      if(flag == 0){
                          self.billList = res.data.records;
                      }else if(flag == 1){
                          self.billList = self.billList.concat(res.data.records);
                      }
                      if (self.billList.length === self.totalCount) {
                          self.finished = true;
                      }
                  }else{
                    self.totalCount = 0;
                    self.billList = [];
                    self.loading = false;
                    self.finished = true;
                  }
                    
                }else{
                    self.billList = [];
                    self.finished = true;
                    self.toastWord({text: res.message})
                }
            })
        },

        //撤销按钮
        cancelOrderBtn(params){
            let self = this;
            EbeiPlugins.cancelByPos({
                extOrderNo: params.paySn,   //商户流水号
                useCan: false,             //普通撤销
                orgTraceNo: params.orgTraceNo,   //原交易凭证号
          }, (data) => {
            this.cancelTheOrderFun(params.paySn, params.rhId);
          }, (data) => {
              self.toastWord({text: "撤销失败"})
            // this.cancelTheOrderFun(params.paySn, params.rhId);
          })
        },

        //pos机撤销
        cancelTheOrderFun(paySn, rhId){
            let data = {
                paySn: paySn,
                rhId: rhId,
            };
            cancelTheOrder(data).then(res=>{
                if(res.status == 200){
                    Notify({
                        type: "success",
                        message: "撤销成功"
                    });
                    this.resetLoadData();
                }else{
                    Notify({
                        type: "danger",
                        message: res.message,
                    });
                }
            })
        },

        // 提示文字
        toastWord(params) {
            const {text} = params;
            if (!text) return;
            // this.$vux.toast.show({
            //     type: 'text',
            //     text: text,
            //     position: 'middle',
            //     width:" 8em",
            // })
          uni.showToast({ title: text, icon: 'none' });
        },

      confirmTime(res){
        let {value} = res;
        this[this.key] = uni.$u.timeFormat(value, 'yyyy-mm-dd');
        const st = this.startTime;
        const et = this.endTime;
        if (st !== '开始时间' && et !== '结束时间' && Utils.dateIsBefore(et, st)) {
          this.toastWord({text: '结束时间不能小于开始时间'})
        } else {
          this.resetLoadData();
        }
        this.showTime = false;
      },
      cancelTime(){
        if (this.key === 'startTime') this[this.key] = '开始时间';
        if (this.key === 'endTime') this[this.key] = '结束时间';
        this.resetLoadData();
        this.showTime = false;
      },
      closeTime(){
        this.showTime = false;
      },
    },

}
</script>
<style lang="scss" scoped>
    @mixin flx-dsp($jsc, $ali, $drt:row) {
        display: flex;
        flex-direction: $drt;
        justify-content: $jsc;
        align-items: $ali;
    }
    .pay-history-list{
        $font-s: 1.2em;
        box-sizing: border-box;
        width: 100%;
        margin-top: 24rpx;
        .choose-date {
            height: 100rpx;
            padding: 0 30rpx;
            background-color: #fff;
           @include flx-dsp($jsc: space-between, $ali: center);
          .time-container{
            @include flx-dsp($jsc: space-between, $ali: center);
            flex: 1;
            border: 1px solid #CCCCCC;
            height: 60rpx;
            padding: 0rpx 24rpx;
            .time-info{
              font-size: 26rpx;
              font-weight: 400;
              color: #999999;
              opacity: 1;
            }
          }
          .middle{
            position: relative;
            width: 30rpx;
            height: 1px;
            background-color: #999999;
            margin: 0 30rpx;
          }

        }
        .bill-record {
            color: #333;
            font-size: 14px;
            .bill-item{
                background-color: #fff;
                margin: 0 0em 0.8em 0;
                padding: 0.8em;
                line-height: 1.8em;
                .fi-name{
                  font-size: 30rpx;
                  font-family: PingFang SC;
                  font-weight: bold;
                  color: #333333;
                  opacity: 1;
                }
                .payment-status{
                  font-size: 28rpx;
                  font-family: PingFang SC;
                  font-weight: 400;
                  color: #16CE92;
                  opacity: 1;
                }
                .order-num{
                  font-size: 26rpx;
                  font-family: PingFang SC;
                  font-weight: 400;
                  color: #666666;
                  opacity: 1;
                }
                .payment-date{
                  font-size: 22rpx;
                  font-family: PingFang SC;
                  font-weight: 400;
                  color: #999999;
                  opacity: 1;
                }
                .fz-16{
                    font-size: 1.1em;
                }
                .color-blue{
                    color: #1261ff;
                }
                .text-right{
                    text-align: right;
                }
                .color-red{
                    color: #ff3300;
                }
                .item-top{
                    border-bottom: 1px dashed #eee;
                    padding: 0.5em 0;
                    margin-bottom: 0.5em;
                }
                .color-grey{
                    color: #aaa;
                }
                .color-green{
                    color: rgb(43,162,40);
                }
            }
        }

    }
</style>


<style>

</style>
