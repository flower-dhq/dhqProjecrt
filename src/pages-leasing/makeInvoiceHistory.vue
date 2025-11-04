<template>
    <view id="pay-history-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="choose-date">
            <view class="choose-date-container com-width">
                <view class="time">
                    <u-icon
                        name="search"
                        style="fill: rgba(174,174,174, 1)"
                        size="20"
                    ></u-icon>
                    <span class="start-time" @click="showTimePlugin({key:'startTime'})">{{startTime}}</span>
                    <p>至</p>
                    <span class="end-time" @click="showTimePlugin({key:'endTime'})">{{endTime}}</span>
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
                </view>
                <u-icon
                    @click="showTimePlugin({key:'startTime'})"
                    name="arrow-down"
                    style="fill: rgba(174,174,174, 1)"
                    size="20"
                ></u-icon>
            </view>
        </view>
      <scroll-view  scroll-y="true" @scrolltolower="loadMore" style="height: 100%;">
                <view class="bill-record">
                    <view class="bill-item" v-for="(item, index) in billList" :key="index">
                        <u-row customStyle="flex-wrap: wrap;width: 100%;">
                            <u-col span="12" >
                                <view  class="color-grey bg-greey padding-08 pb-0 col-flex">
                                  <u-icon name="clock" customStyle="margin-right: 22rpx;"/>
                                  <span v-if="item.dateDesc">{{item.dateDesc}}</span>
                                </view>
                            </u-col>
                            <!-- <u-col span="7" class="text-right color-grey bg-greey padding-08 pb-0">
                                <u-icon name="arrow" />
                            </u-col> -->
                            <u-col span="8">
                                <view class="bg-greey ticket-type" style="flex-direction: row;height: 50px; padding: 0 22rpx">
                                  <span style="font-size: 14px;margin-right: 5px">缴费订单</span>
                                  <u-tag shape="circle" plain color="#003366" borderColor="#003366" :text="item.ticketTypeName"></u-tag>
                                </view>
                            </u-col>
                            <u-col span="4"  textAlign="right">
                                <view class="text-right fz-16 bg-greey ticket-type" style="height: 50px;justify-content:flex-end;padding-right: 22rpx">
                                  ￥{{item.receivableAmount}}
                                </view>
                            </u-col>
                            <u-col span="6" > <view class="color-grey padding-08" style="font-size: 14px">{{item.usingStateName}}</view></u-col>
                            <u-col span="6">
                              <view style="display: flex;justify-content: flex-end">
                                <view class="text-right  padding-08" textAlign="right"
                                         @click="getInvoice" v-if="currentProjectName == 'dehuan' && item.usingState!= 3 && item.usingState!= 4">
                                  <u-tag shape="circle" plain color="#003366" borderColor="#003366" text="发票领取"></u-tag>
                                </view>
                                <view class="text-right  padding-08"
                                         v-if="item.ticketType == '5'" @click="lookInvoiceBtn(item.pdfUrl)">
                                  <u-tag shape="circle" plain color="#003366" borderColor="#003366" text="下载"></u-tag>
                                </view>
                              </view>

                            </u-col>

                            <!-- <u-col span="7" class="text-right  padding-08" @click="sendBtn">
                                <u-tag round plain color="#003366" text-color="#003366">重发发票</u-tag>
                            </u-col> -->
                        </u-row>
                    </view>
                </view>
      </scroll-view>
        <u-modal :show="showInvoiceDialog" title="提示" @confirm="showInvoiceDialog = false">
          <view style="display: flex;justify-content: center;padding: 12px">
            <span>请联系税务人员+862131768924进行发票二次推送</span>
          </view>
        </u-modal>
    </view>
</template>

<script>
import moment from "moment";
import {
    getOwnerByMemberId,        //获取用户信息
    getOwnerRoomByMemberId,  //通过会员ID获取业主信息以及房间信息
    getTicketMessageListXSAPP,  //发票列表接口
} from "@/service/leasing.js";
import util from "../js/utils";

// import { controlFunction } from "@/assets/js/mixin";
export default {
    data(){
        return{
            startTime: '开始时间',
            endTime: '结束时间',
            ticketList: [],
            pageSize: 50,
            currentPage: 0,
            totalCount: "",
            loading: false,
            finished: true,
            refreshing: false,
            customerId: "",
            billList: [],
            customerIdArr: [], //用户关联房间的客户id
            showInvoiceDialog:false,
            currentProjectName: process.env.currProjectName,
            projectId: '',
            memberId: '',
            companyId: '',
            showTime: false,
            timeValue: Number(new Date()),
            key: '',
        }
    },

    // mixins: [controlFunction],
  onLoad(){
      const {AREA_ID, PROJECT_ID, MEMBER_ID,COMPLANY_ID} = this.$constant;
      this.projectId = util.storageAction({key: PROJECT_ID, action: 'get'});
      this.memberId = util.storageAction({key: MEMBER_ID, action: 'get'}); 
      this.companyId =  util.storageAction({key: COMPLANY_ID, action: 'get'}); 
      this.getUserInfo();    //获取用户信息
    },

    methods:{
        //获取用户信息
        getUserInfo() {
            let data = {
                projectId: this.projectId,
                memberId: this.memberId
            }

            var params = {
              data:data,
              "hideLoading": true
            }
            getOwnerByMemberId(params).then(res => {
                if (res.status == 200) {
                    this.customerId = res.data.customerId;
                    this.getOwnerRoomList();
                    // this.currentPage = 1;
                    // this.getListData(1);
                } else {
                    this.toastWord({text: res.message})
                }
            });
        },

        //通过会员ID获取业主信息以及房间信息
        getOwnerRoomList(){
            let self = this;
            let data = {
                projectId: this.projectId,
                memberId: this.memberId
            };
            self.customerIdArr = [];
            var params = {
              data:data,
              "hideLoading": true
            }
            getOwnerRoomByMemberId(params).then(res=>{
                if(res.status == 200 && res.data.length > 0){
                    res.data.forEach(item => {
                        if(item.customerId){
                            self.customerIdArr.push(item.customerId);
                        }
                    });
                    this.currentPage = 1;
                    this.getListData(1);
                }
            })
        },

        // 选择时间
        showTimePlugin(params) {
            const {key} = params;
            this.timeValue =  Number(new Date());
            this.showTime = true;
            this.key = key;
        },
        confirmTime(res){
          let {value} = res;
          this[this.key] = moment(value).format('YYYY-MM-DD');
          const st = this.startTime;
          const et = this.endTime;
          if (st !== '开始时间' && et !== '结束时间' && moment(et).isBefore(st)) {
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
            // if(!self.customerId){
            //     self.loading = false;
            //     self.finished = true;
            //     return;
            // }
            let data = {
                projectId: this.projectId,
                drawDateStart: self.startTime!= "开始时间" ? moment(self.startTime).format('YYYY-MM-DD') : "",
                drawDateEnd: self.endTime!= "结束时间" ? moment(self.endTime).format('YYYY-MM-DD') : "",
                pageIndex: self.currentPage,
                pageSize: self.pageSize,
                customerId: self.customerId,
                customerId: self.customerId ? self.customerId : -1,
                customerIds: self.customerIdArr.join(","),
            };
            var params = {
              data:data,
              "hideLoading": true
            }
            getTicketMessageListXSAPP(params).then(res=>{
                if(res.status == 200){
                    self.totalCount = res.data.total;
                    self.loading = false;
                    // if(res.data.records.length){
                    //     res.data.records.forEach(item=>{
                    //         item.pdfUrl = "http://www.aisinogz.com:19876/AisinoFp-test/pd?id=1310412844113727488_144002010000_00021048.pdf"
                    //     })
                    // }
                    if(flag == 0){
                        self.billList = res.data.records;
                    }else if(flag == 1){
                        self.billList = self.billList.concat(res.data.records);
                    }
                    if (self.billList.length === self.totalCount) {
                        self.finished = true;
                    }
                }else{
                    self.billList = [];
                    self.finished = true;
                    self.toastWord({text: res.message})
                }
            })
        },

        //重发发票按钮
        sendBtn(){
            this.$router.push({
                name: "sendInvoice",
            });
        },

        // 提示文字
        toastWord(params) {
            const {text} = params;
            if (!text) return;
            // this.$vux.toast.show({
            //     type: 'text',
            //     text: text,
            //     position: 'middle',
            //     width:" 17em",
            // })
          uni.showToast({ title: text, icon: 'none' });
        },
        getInvoice(){
          this.showInvoiceDialog = true;
        },
        lookInvoiceBtn(pdfUrl){
            if(pdfUrl){
                // if (util.isWeixin()){
                //     window.open(pdfUrl)
                // }else{
                //     EbeiPlugins.previewFile(pdfUrl, null, null);
                // }
              window.open(pdfUrl)
            }else{
                // self.toastWord({text: "暂无可下载发票"})
              uni.showToast({ title: '暂无可下载发票', icon: 'none' });
            }

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
    #pay-history-list{
        $font-s: 28rpx;
        box-sizing: border-box;
        padding: 88rpx 0 0;
        height: 100vh;
        background-color: #f5f5f5;
        .choose-date {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 2;
            background-color: #F5F5F5;
            &-container {
                width: 700rpx;
                margin: 0 auto;
                height: 44px;
                box-sizing: content-box;
                @include flx-dsp($jsc: space-between, $ali: center);
                .time {
                    width: 100%;
                    @include flx-dsp($jsc: flex-start, $ali: center);
                    height: 100%;
                    & > span {
                        flex: 1;
                        @include flx-dsp($jsc: center, $ali: center);
                        height: 100%;
                        color: #999;
                        font-size: $font-s;
                    }
                    p {
                        color: #999;
                        font-size: $font-s;
                    }
                }
                & > img {
                    width: 36rpx;;
                }
            }
        }
        .bill-record {
            color: #333;
            .bill-item{
                background-color: #fff;
                margin: 0 22rpx 22rpx;
                // padding: 22rpx;
                border-radius: 14rpx;
                line-height: 50rpx;
                .fz-16{
                    font-size: 30rpx;
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
                .color-grey{
                    color: #aaa;
                }
                .color-green{
                    color: rgb(43,162,70);
                }
                .bg-greey{
                    background: #fafafa;
                }
                .padding-08{
                    padding: 22rpx!important;
                }
                .pb-0{
                    padding-bottom: 0;
                }
                .col-flex{
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                }
                .ticket-type{
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                }
            }
        }

    }
</style>
