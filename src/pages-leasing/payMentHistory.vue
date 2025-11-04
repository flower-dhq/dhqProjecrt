<template>
  <view class="page" id="pay-history-list">
    <view class="choose-date">
      <view class="choose-date-container com-width">
        <view class="time">
          <u-icon
            name="search"
            style="fill: rgba(174, 174, 174, 1)"
            size="20"
          ></u-icon>
          <span
            class="start-time"
            @click="showTimePlugin({ key: 'startTime' })"
            >{{ startTime }}</span
          >
          <p>至</p>
          <span class="end-time" @click="showTimePlugin({ key: 'endTime' })">{{
            endTime
          }}</span>
          <u-datetime-picker
            :show="showTime"
            v-model="timeValue"
            mode="date"
            cancelText="清除"
            :closeOnClickOverlay="true"
            @confirm="confirmTime"
            @cancel="cancelTime"
            @close="closeTime"
          ></u-datetime-picker>
        </view>
        <u-icon
          @click="showTimePlugin({ key: 'startTime' })"
          name="arrow-down"
          style="fill: rgba(174, 174, 174, 1)"
          size="20"
        ></u-icon>
      </view>
    </view>
    <scroll-view
      scroll-y="true"
      @scrolltolower="loadMore"
      style="background-color: #f5f5f5;height: 100%;"
    >
      <view class="bill-record">
        <view class="bill-item" v-for="(item, index) in billList" :key="index">
          <u-row customStyle="flex-wrap: wrap;width: 100%">
            <view class="item-top">
            <u-col span="9"
              ><view class="fz-16 ">订单号：{{ item.orderNum }}</view>
            </u-col>
            <u-col
              span="3"
              textAlign="right"

            ><view  class="text-right fz-16  color-red">{{ item.paymentStatusName }}</view>
            </u-col>
            </view>
            <u-col span="12" v-for="(item2, index2) in item.fiName" :key="index2">
              <u-row customStyle="flex-wrap: wrap;width: 100%" v-if="item.fiName && item.fiName.length > 0">
              <u-col span="10">
                <view class="color-grey">
                  <text>{{ item2.fiName }}</text>
                  <text v-if="item2.startTime">({{ item2.startTime }}~{{item2.endTime}})</text>
                </view>
              </u-col>
              <u-col span="2" textAlign="right">
                <text class="text-right color-red">{{ item2.receivedAmount  }}</text>
                <!-- <text class="text-right color-red" v-if="item.refundAmount > 0"
                  >(已退：{{ item.refundAmount }})</text
                > -->
              </u-col>
              </u-row>
            </u-col>
            <u-col span="9" ><view class="color-grey">{{ item.paymentDate }}</view></u-col>
            <u-col span="3"  textAlign="right"><view class="text-right color-green">{{
              item.paymentName
              }}</view></u-col>
          </u-row>
        </view>
            <view class="base-lien" v-if="!billList.length || isNoData">
              <p class="line"></p>
              <span>已无其它内容</span>
             </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moment from "moment";
import util from "../js/utils";
import {
  getOwnerByMemberId, //获取用户信息
  getOwnerRoomByMemberId, //通过会员ID获取业主信息以及房间信息
  getReceiptHistoryList, //缴费记录查询
} from "@/service/leasing.js";
export default {
  data() {
    const currentDate = this.getDate({
      format: true,
    });
    return {
      timeValue: Number(new Date()),
      showTime: false,
      date: currentDate,
      startTime: "开始时间",
      endTime: "结束时间",
      billList: [
        // {
        //   orderNum:'SK20210219000210',
        //   paymentStatusName:'支付成功',
        //   fiName:'23',
        //   paymentAmount:'2345',
        //   paymentDate:'2020-2-2',
        //   paymentName:'单子',
        // },
      ],
      pageSize: 10,
      currentPage: 0,
      totalCount: "",
      loading: false,
      finished: true,
      refreshing: false,
      customerId: "",
      customerIdArr: [], //用户关联房间的客户id
      isNoData:true,
    };
  },
  // mixins: [controlFunction],
  // created(){
  //     //
  //     let phone = this.$route.query.phone;
  //     let projectType = this.$route.query.projectType;
  //     if(phone && projectType){
  //         this.mobileRegistrationuiy({phone:phone,projectType:projectType}).then(res=>{
  //             if(res==200){
  //                 this.getUserInfo();    //获取用户信息
  //             }else{
  //                 this.$confirmPage.show({showBut:1});
  //             }
  //         });
  //     } else{
  //         this.getUserInfo();    //获取用户信息
  //     }

  //     // this.getUserInfo();    //获取用户信息
  // },
  onLoad(option) {
    const { AREA_ID, PROJECT_ID, MEMBER_ID } = this.$constant;
    this.projectId = util.storageAction({ key: PROJECT_ID, action: "get" });
    this.memberId = util.storageAction({ key: MEMBER_ID, action: "get" });
    let phone = option.phone;
    let projectType = option.projectType;
    if (phone && projectType) {
      this.mobileRegistrationuiy({
        phone: phone,
        projectType: projectType,
      }).then((res) => {
        if (res == 200) {
          this.getUserInfo(); //获取用户信息
        } else {
          this.$confirmPage.show({ showBut: 1 });
        }
      });
    } else {
      this.getUserInfo(); //获取用户信息
    }

  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
  },

  methods: {
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === "start") {
        year = year - 60;
      } else if (type === "end") {
        year = year + 2;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    //上拉加载数据
    loadMore() {
      // if (this.pageIndex == 0 || this.pageIndex < this.page) {
      //     this.pageIndex++;
      //     if (this.pageIndex == 1) {
      //         this.meetingList = [];
      //     }
      //     this.getList()

      // }
      this.currentPage += 1;
      this.getListData(1);
    },
    // 上拉加载  uni自带
    onPullDownRefresh() {
      if (this.customerId || this.customerIdArr.length > 0) {
        this.currentPage = 1;
        this.finished = false;
        this.loading = true;
        this.getListData(0);
      } else {
        this.refreshing = false;
      }
      uni.stopPullDownRefresh()
    },
    //获取用户信息
    getUserInfo() {
      let data = {
        projectId: this.projectId,
        memberId: this.memberId,
      };
      var params = {
        data: data,
        hideLoading: true,
      };
      getOwnerByMemberId(params).then((res) => {
        if (res.status == 200) {
          this.customerId = res.data.customerId;
          this.getOwnerRoomList();
        } else {
          this.toastWord({ text: res.message });
        }
      });
    },

    //通过会员ID获取业主信息以及房间信息
    getOwnerRoomList() {
      let self = this;
      let data = {
        projectId: this.projectId,
        memberId: this.memberId,
      };
      self.customerIdArr = [];
      var params = {
        data: data,
      };
      getOwnerRoomByMemberId(params).then((res) => {
        if (res.status == 200 && res.data.length > 0) {
          res.data.forEach((item) => {
            if (item.customerId) {
              self.customerIdArr.push(item.customerId);
            }
          });
          this.currentPage = 1;
          this.getListData(1);
        }
      });
    },
    closeTime() {
      this.showTime = false;
    },
    confirmTime(e) {
      const {
        columnIndex,
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker,
      } = e;
      this[this.key] = moment(e.value).format("YYYY-MM-DD");
      const st = this.startTime;
      const et = this.endTime;
      if (st !== "开始时间" && et !== "结束时间" && moment(et).isBefore(st)) {
        this.toastWord({ text: "结束时间不能小于开始时间" });
      } else {
        this.resetLoadData();
      }
      this.showTime = false;
    },
    // 提示文字
    toastWord(params) {
      const { text } = params;
      if (!text) return;
      uni.showToast({ title: text, icon: "none" });
    },
    cancelTime() {
      if (this.key === "startTime") this[this.key] = "开始时间";
      if (this.key === "endTime") this[this.key] = "结束时间";
      this.resetLoadData();
      this.showTime = false;
    },

    // 选择时间
    showTimePlugin(params) {
      const { key } = params;
      this.showTime = true;
      this.key = key;
      // const today = moment(new Date()).format('YYYY-MM-DD');
      // this.$vux.datetime.show({
      // cancelText: '取消',
      // confirmText: '确定',
      // clearText: "清除",
      // format: 'YYYY-MM-DD',
      // value: today,
      // onConfirm: (val) => {
      //     this[key] = val;
      //     const st = this.startTime;
      //     const et = this.endTime;
      //     const beginTime = moment(st).format('YYYY-MM-DD');
      //     const endTime = moment(et).format('YYYY-MM-DD');
      //     if (st !== '开始时间' && et !== '结束时间' && moment(et).isBefore(st)) {
      //         this.toastWord({text: '结束时间不能小于开始时间'})
      //     } else {
      //         this.resetLoadData();
      //     }
      // },
      //     onClear: _ => {
      //         if (key === 'startTime') this[key] = '开始时间';
      //         if (key === 'endTime') this[key] = '结束时间';
      //         this.resetLoadData();
      //     }
      // })
    },

    //下拉刷新数据
    onRefresh() {
      if (this.customerId || this.customerIdArr.length > 0) {
        this.currentPage = 1;
        this.finished = false;
        this.loading = true;
        this.getListData(0);
      } else {
        this.refreshing = false;
      }
    },

    //上拉加载数据
    // onLoad() {
    //   if (this.customerId || this.customerIdArr.length > 0) {
    //     this.currentPage += 1;
    //     this.getListData(1);
    //   }
    // },

    // 重置加载数据
    resetLoadData() {
      if (this.customerId || this.customerIdArr.length > 0) {
        this.currentPage = 1;
        this.finished = false;
        this.loading = true;
        this.getListData(0);
      }
    },

    //获取列表数据
    getListData(flag) {
      let self = this;
      if (self.refreshing) {
        self.billList = [];
        self.refreshing = false;
      }

      let data = {
        projectId: this.projectId,
        startDate:
          self.startTime != "开始时间"
            ? moment(self.startTime).format("YYYY-MM-DD")
            : "",
        endDate:
          self.endTime != "结束时间"
            ? moment(self.endTime).format("YYYY-MM-DD")
            : "",
        orderState: 1, //支付成功
        ifShowFiName: 1, //显示费项
        pageIndex: self.currentPage,
        pageSize: self.pageSize,
        customerId: self.customerId ? self.customerId : -1,
        customerIds: self.customerIdArr.join(","),
      };
      var params = {
        data: data,
      };
      getReceiptHistoryList(params).then((res) => {
        if (res.status == 200) {
          self.totalCount = res.data.total;
          self.loading = false;
          if (flag == 0) {
            self.billList = res.data.records;
          } else if (flag == 1) {
            self.billList = self.billList.concat(res.data.records);
          }
          if (self.billList.length === self.totalCount) {
            self.finished = true;
          }
        } else {
          self.billList = [];
          self.finished = true;
          self.toastWord({ text: res.message });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #f5f5f5;
}
@mixin flx-dsp($jsc, $ali, $drt: row) {
  display: flex;
  flex-direction: $drt;
  justify-content: $jsc;
  align-items: $ali;
}
#pay-history-list {
  $font-s: 28rpx;
  box-sizing: border-box;
  padding-top: 88rpx;
  .uni-list {
    height: 40rpx;
  }
  .choose-date {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background-color: #f5f5f5;
    &-container {
      width: 700rpx;
      margin: 0 auto;
      height: 88rpx;
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
        width: 36rpx;
      }
    }
  }
  .bill-record {
    color: #333;
    .bill-item {
      background-color: #fff;
      margin: 0 22rpx 22rpx;
      padding: 22rpx;
      border-radius: 14rpx;
      line-height: 50rpx;
      .fz-16 {
        font-size: 31rpx;
      }
      .color-blue {
        color: #2761ff;
      }
      .text-right {
        text-align: right;
      }
      .color-red {
        color: #ff3300;
      }
      .item-top {
        border-bottom: 2rpx solid #eee;
        padding: 14rpx 0;
        margin-bottom: 14rpx;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .color-grey {
        color: #aaa;
      }
      .color-green {
        color: rgb(43, 162, 70);
      }
    }
  }
  .base-lien {
      position: relative;
      margin: .3rem auto .2rem auto;
      width: 12.76rem;
      height: .8rem;
      @include flx-dsp($jsc: center, $ali: center);
      font-size: .3rem;
      & > p {
        width: 100%;
        height: 1px;
        background-color: #e0e0e0;
      }
      & > span {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5.8rem;
        height: .8rem;
        text-align: center;
        background-color: #f5f5f5;
        transform: translate(-50%, -50%);
        display: block;
        color: #acacac;
      }
    }
}
</style>


<style>
</style>
