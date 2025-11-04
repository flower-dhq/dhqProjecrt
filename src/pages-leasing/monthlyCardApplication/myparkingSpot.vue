<template>
  <view class="page" id="list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <scroll-view
      scroll-y="true"
      @scrolltolower="loadMore"
      style="background-color: #f5f5f5"
    >
      <view class="bill-record">
        <view class="bill-item" v-for="(item, index) in parkingList" :key="index" v-show="parkingList.length>0">
          <u-row customStyle="flex-wrap: wrap;width: 100%">
            <view class="item-top">
              <u-col span="9" @click="toPage('detail',item)"
              ><view class="fz-16 ">{{item.vehicleLicenseNumber}}</view>
            </u-col>
            <u-col span="3" @click="toPage('detail',item)">
              <view class="item-right item-btn-color"  v-if="[2].includes(item.contractStatus)">未开始</view>
              <view class="item-right item-btn-color1" v-if="[3].includes(item.contractStatus)">进行中</view>
              <view class="item-right item-btn-color2"  v-if="[8].includes(item.contractStatus)">审批驳回</view>
              <view class="item-right item-btn-color3"  v-if="[7].includes(item.contractStatus)">待确认</view>
              <view class="item-right item-btn-color4" v-if="[1].includes(item.contractStatus)">待支付</view>
            </u-col>
            </view>
             <u-col span="12" @click="toPage('detail',item)">
            <view  class="fz-14 ">所属车场：{{item.resourceName}}</view>
            </u-col>
            <u-col span="4" @click="toPage('detail',item)">
                <view class="fz-12">开通日期：</view>
                <view class="fz-13">{{item.openingDate}}</view>
            </u-col>
            <u-col span="4" @click="toPage('detail',item)">
                <view class="fz-12 ">到期日：</view>
                <view class="fz-13">{{item.closeDate}}</view>
            </u-col>
            <u-col span="4" @click="toPage('detail',item)">
                <view class="fz-12">剩余：</view>
                <view class="fz-13">{{item.days}}天</view>
            </u-col>
            <u-col span="12" v-if="[8].includes(item.contractStatus)">
                <view class="fz-13-red">拒绝原因：{{item.approveText}}</view>
            </u-col>
            <!-- （1-草稿,2-待开始,3-进行中 4.已终止 5.已注销 6.已废弃,7.待确认，8.拒绝申请）-->
            <u-col span="12" >
              <view style="float:right;margin-top: 25rpx">
              <text class="buttom buttom-width1" @click="toPage('licensePlate',item)" v-if="item.changeLicensePlate=='1'&&[2,3].includes(item.contractStatus)">
                修改车牌
              </text>
              <text class="buttom buttom-width1" @click="toPage('changeparking',item)"  v-if="item.changeParkingSpace=='1'&&[2,3].includes(item.contractStatus)">
                变更车位
              </text>
              <text class="buttom buttom-width3" @click="toPage('renew',item)" v-if="[2,3].includes(item.contractStatus)">
                续费
              </text>
              <text class="buttom buttom-width3" @click="toPage('pay',item)" v-if="[1].includes(item.contractStatus)">
                支付
              </text>
              <text class="buttom buttom-width1" @click="toPage('edit',item)" v-if="[8].includes(item.contractStatus)">
                重新提交
              </text>
              <!-- <text class="buttom buttom-width3" @click="dellist(item)" v-if="[7,8].includes(item.contractStatus)">
                删除
              </text> -->
              </view>
              <!-- <text class="text-right color-red" v-if="item.refundAmount > 0"
                >(已退：{{ item.refundAmount }})</text
              > -->
            </u-col>
            <!-- <u-col span="8" ><view class="color-grey">{{ item.paymentDate }}</view></u-col>
            <u-col span="4"  textAlign="right"><view class="text-right color-green">{{
              item.paymentName
              }}</view></u-col> -->
          </u-row>
        </view>
        <view v-show="parkingList.length==0" style="text-align:center;color: #928686;
    margin-top: 30px;">
          <text>暂无数据~</text>
        </view>
            <!-- <view class="base-lien">
              <span @click="toadd"><image :src="imagesrc"></image>月卡申请</span>
            </view> -->
      </view>
    </scroll-view>
    <u-popup :show="isshow" @close="isshow=false" mode="center" 
             customStyle="background-color: #fff; border-radius: 8px;width:75%;height:300rpx">
          <view class="ispopup">
              <text class="addcar">是否删除当前数据？</text>
              <text class="addkeysubmit" @click="submit">确认</text>
          </view>
	   </u-popup>
  </view>
</template>

<script>
import moment from "moment";
import util from "../../js/utils";
import {
  selectParklotMonthCardListByPageNew,
  getOwnerByMemberId,        //获取用户信息
  getMonthCardCancellation
} from "@/service/leasing.js";
export default {
  data() {
    const currentDate = this.getDate({
      format: true,
    });
    return {
      imagesrc: require(`@/static/icon-img/addparking1.png`),
      timeValue: Number(new Date()),
      showTime: false,
      date: currentDate,
      startTime: "开始时间",
      endTime: "结束时间",
      parkingList: [
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
      serialNumber:'',
      customerId: "",
      isshow:false,
      customerIdArr: [], //用户关联房间的客户id
      isNoData:true,
    };
  },
  // mixins: [controlFunction],
  created(){
      // this.getListData(0);
  },
  onShow() {
    this.getListData(0);
  },
  onLoad(option) {
    const { AREA_ID, PROJECT_ID, MEMBER_ID } = this.$constant;
    this.projectId = util.storageAction({ key: PROJECT_ID, action: "get" });
    this.memberId = util.storageAction({ key: MEMBER_ID, action: "get" });
    // this.getUserInfo();    //获取用户信息
    let projectId = option.projectId;
    let memberId = option.memberId;
    if (projectId && memberId) {
      this.projectId = projectId
      this.memberId = memberId
    } else {
      
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
    //获取用户信息
    getUserInfo() {
      let data = {
        projectId: this.projectId,
        memberId: this.memberId
      }
      var params = {
        data: data,
        "hideLoading": true
      }
      getOwnerByMemberId(params).then(res => {
        if (res.status == 200) {
          this.customerId = res.data.customerId;
          this.customerName = res.data.customerName;
        } else {
          this.toastWord({text: res.message})
        }
      });
    },
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
      if (this.memberId) {
        this.currentPage = 1;
        this.finished = false;
        this.loading = true;
        this.getListData(0);
      } else {
        this.refreshing = false;
      }
      uni.stopPullDownRefresh()
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
    toadd(){
      uni.navigateTo({
          //  url:'/pages-leasing/monthlyCardApplication/addmonthlyCardApplication?type=add'
          url:'/pages-leasing/monthlyCardApplication/selectParkingLot'
      });
      uni.removeStorageSync('DEFAULT_PROJECT_ID');
      uni.removeStorageSync('DEFAULT_PROJECT_NAME');
      uni.removeStorageSync('DEFAULT_RESOURCEMENU_ID');
      uni.removeStorageSync('DEFAULT_RESOURCEMENU_NAME');
    },
    toPage(type,item){
      if(type=='pay'){
        uni.navigateTo({
           url:'/pages-leasing/monthlyCardApplication/addmonthlyCardApplication?type=' + type + '&serialNumber=' +item.serialNumber
           + '&mcsettingId=' +item.mcsettingId
      });
      }else{
        uni.navigateTo({
           url:'/pages-leasing/monthlyCardApplication/addmonthlyCardApplication?type=' + type + '&serialNumber=' +item.serialNumber
        });
      }
    },
    dellist(item){
      this.isshow = true
      this.serialNumber = item.serialNumber
    },
    submit(){
      let self = this;
      let data = {
        serialNumber: self.serialNumber,
      };
      var params = {
        data: data,
      };
      getMonthCardCancellation(params).then((res) => {
        if (res.status == 200) {
          self.toastWord({ text: res.message });
          self.isshow = false
          self.getListData(0);
        } else {
          self.toastWord({ text: res.message });
        }
      });
    },

    //下拉刷新数据
    onRefresh() {
      if (this.memberId) {
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
      if (this.memberId) {
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
        self.parkingList = [];
        self.refreshing = false;
      }

      let data = {
        memberId: this.memberId,
      };
      var params = {
        data: data,
      };
      selectParklotMonthCardListByPageNew(params).then((res) => {
        if (res.status == 200) {
          self.parkingList = res.data
          // self.totalCount = res.data.total;
          // self.loading = false;
          // if (flag == 0) {
          //   self.parkingList = res.data.records;
          // } else if (flag == 1) {
          //   self.parkingList = self.parkingList.concat(res.data.records);
          // }
          // if (self.parkingList.length === self.totalCount) {
          //   self.finished = true;
          // }
        } else {
          self.parkingList = [];
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
#list {
  $font-s: 28rpx;
  box-sizing: border-box;
  // padding-top: 44rpx;
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
    margin-bottom: 90rpx;
    .bill-item {
      background-color: #fff;
      margin: 30rpx 22rpx;
      padding: 22rpx;
      border-radius: 14rpx;
      line-height: 50rpx;
      // height: 320rpx;
      .fz-12 {
        font-size: 26rpx;
        color: #4b4a4a;
      }
      .fz-13 {
        font-size: 28rpx;
        font-weight: bold;
      }
      .fz-13-red{
        font-size: 28rpx;
        font-weight: bold;
        color: red;
      }
      .fz-14 {
        font-size: 29rpx;
        color: #4b4a4a;
        padding-bottom: 18rpx;
      }
      .fz-16 {
        font-size: 32rpx;
        font-weight: bold;
        color: #000000;
      }
      .item-right{
        margin-left: 20rpx;
        text-align: center;
        font-size: 26rpx;
        font-weight: bold;
        width: 110rpx;
        height: 40rpx;
        line-height: 40rpx;
        padding: 10rpx 20rpx;
        border-radius: 8rpx;
      }
      .item-btn-color{
        color: #2680EB;
        background-color: rgba(42 ,131, 237, 0.2);
      }
      .item-btn-color1{
        color: #3EE17A;
        background-color: rgba(62, 225, 122, 0.2);
      }
      .item-btn-color2{
        color: #FF3030;
        background-color: rgba(255, 48, 48, 0.2);
      }
      .item-btn-color3{
        color: #F27E19;
        background-color: rgba(242, 126, 25, 0.2);
      }
      .item-btn-color4{
        color: #FFC300;
        background-color: rgba(255, 195, 0, 0.2);
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
        // padding: 14rpx 0;
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
      .buttom {
        display:block ;
        width: 96rpx;
        height: 50rpx;
        line-height:50rpx ;
        color: #fff;
        font-size: 24rpx;
        background-color: var(--app-primary-color);
        text-align: center;
        padding: 11rpx 22rpx;
        border-radius: 14rpx;
        margin-left: 10rpx;
        float: right;
      }
      .buttom-width1 {
        width: 96rpx;
      }
      .buttom-width2 {
        width: 180rpx;
        background-color: #ece8e8;
        color: #B1B1B1 !important;
        font-weight: bold;
      }
      .buttom-width3 {
        width: 76rpx;
      }
    }
  }
  .base-lien {
      position: fixed;
      bottom: 0px;
      background-color: white;
      width: 100%;
      height: 100rpx;
      font-size: 26rpx;
      & > span {
        position: fixed;
        bottom: 16rpx;
        margin: 5rpx 2%;
        width: 96%;
        height:70rpx;
        line-height:70rpx;
        text-align: center;
        border-radius: 14rpx;
        background-color: var(--app-primary-color);
        color: #FFFFFF;
        font-weight: bold;
        & > image{
            width: 24rpx;
            height: 24rpx;
            padding-right: 10rpx;
        }
      }
    }
}
.addcar {
  color: red;
  position: relative;
 // top: 20rpx;
//   left: 20rpx;
  font-size: 34rpx;
  height: 200rpx;
  line-height: 200rpx;
}
.addkeysubmit{
  padding: 18rpx 80rpx;
  color: #fff;
  font-size: 26rpx;
  background: var(--app-primary-color);
  border-radius: 14rpx;
  position: absolute;
  bottom: 30rpx;
  left: 32%;
}
.ispopup{
    width:100%;
    text-align: center;
}
</style>


<style>
</style>
