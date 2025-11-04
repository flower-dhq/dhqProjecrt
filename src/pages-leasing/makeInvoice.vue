<template>
  <view>
    <view id="pay-history-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
      <view class="top-search">
        <u-row>
          <u-col span="4">
            <view class="top-search-container">
              <view @click="showSearchTypePicker">{{searchTypeName}}</view>
              <u-icon name="arrow-down" size="12" customStyle="margin-left: 5px"></u-icon>
            </view>
          </u-col>
          <u-col span="8">
            <view class="choose-date">
              <view class="choose-date-container com-width">
                <view class="time">
                  <u-icon
                      name="search"
                      style="fill: rgba(174,174,174, 1)"
                      size="20"
                  ></u-icon>
                  <span class="start-time" @click="showTimePlugin({key:'startTime'})">{{ startTime }}</span>
                  <p>至</p>
                  <span class="end-time" @click="showTimePlugin({key:'endTime'})">{{ endTime }}</span>
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
                    @click="showTimePlugin({key:'startTime'})"
                    type="ios-arrow-down"
                    style="fill: rgba(174,174,174, 1)"
                    size="20"
                ></u-icon>
              </view>
            </view>
          </u-col>
        </u-row>
      </view>

      <scroll-view  scroll-y="true" @scrolltolower="loadMore" style="background-color: #F5F5F5;height: 100%;">
          <view class="bill-record">
              <u-checkbox-group v-model="checkSon" ref="checkboxGroup" placement="column" @change="setMoney">
                <view class="bill-item" v-for="(item, index) in billList" :key="index">
                  <u-checkbox
                      :name="item.rhId"
                      shape="circle"
                      :disabled="item.invoiceStatus == '1' && actionType == '1' || item.bookOffsetFlag == '1' || item.disabledInvoice == '1'"
                      :activeColor="THEME_COLOR"
                      style="padding:5px 0"
                  >
                  </u-checkbox>
                <u-row customStyle="flex-wrap: wrap;flex: 1">
                  <u-col span="8" ><view class="fz-16 item-top">订单号：{{ item.rhNum }}</view></u-col>
                  <u-col span="4" v-if="item.invoiceStatus == '1'" textAlign="right"
                         ><view class="text-right fz-16 color-grey item-top">{{ item.invoiceStatusName }}</view>
                  </u-col>
                  <u-col span="4" v-else  textAlign="right"><view class="text-right fz-16 color-red item-top">{{ item.invoiceStatusName }}</view>
                  </u-col>
                  <u-col span="8"><view class="color-grey fz-14">{{ item.fiName }}</view></u-col>
                  <u-col span="4"  textAlign="right"><view class="text-right color-red">￥{{ item.receivedAmount }}</view></u-col>
                  <u-col span="8" ><view class="color-grey fz-14">{{ item.receivedTime }}</view></u-col>
                  <u-col span="4"  textAlign="right"><view class="text-right color-green">{{ item.paymentTypeNames }}</view></u-col>
                </u-row>
                </view>
              </u-checkbox-group>

          </view>
      </scroll-view>
      <view class="footer-action" v-if="billList.length > 0">
        <u-row customStyle="padding: 5px;border-bottom: 1px solid #efefef;">
          <u-col span="4" customStyle="width: 60px;">
            <u-checkbox-group @change="checkAll" v-model="isCheckAll">
            <u-checkbox
                name="1"
                shape="circle"
                :activeColor="THEME_COLOR"
                label="全选"
            >
            </u-checkbox>
            </u-checkbox-group>
          </u-col>
          <u-col span="8"  customStyle="width: calc(100% - 70px);">
            <view style="font-size: 0.85em" class="text-right">
              <span class="red">{{ checkOrderTotal }}</span>条记录，
              共<span class="red">{{ checkOrderTotalMoney }}元</span>
            </view>
          </u-col>
          <!-- <u-col span="7" class="text-right" style="width: 90px;">
              <u-button
                  type="primary"
                  class="btnMoney"
                  v-if="checkSon.length > 0"
                  @click="nextBtn"
              >下一步</u-button>
              <u-button disabled  type="default" v-else>下一步</u-button>
          </u-col> -->
        </u-row>
        <u-row customStyle="padding-left: 5px;">
          <u-col span="8" class="text-right" customStyle="width: calc(100% - 90px);">
            <u-radio-group v-model="actionType" direction="horizontal" checked-color="#ffa633">
              <u-radio name="1">发票开具</u-radio>
              <u-radio name="2" v-if="isShowSJBtn">收据下载</u-radio>
            </u-radio-group>
          </u-col>
          <u-col span="4" class="text-right" style="width: 90px;">
            <u-button
                type="primary"
                class="btnMoney"
                v-if="checkSon.length > 0"
                @click="nextBtn"
                :loading="loadingBtn"
                loading-text="请稍后..."
                style="width: 90px; padding: 0 0;"
            >下一步
            </u-button>
            <u-button
                class="btnMoney"
                disabled
                type="default"
                v-else
                style="width: 90px; padding: 0 0;"
            >下一步
            </u-button>
          </u-col>
        </u-row>
      </view>
    </view>
    <u-picker :show="showSearchType" :columns="option" keyName="text" @confirm="changeType" @cancel="cancelType"></u-picker>
  </view>
</template>

<script>
import moment from "moment";
import {
  getOrderListXS,     //缴费记录查询
  getOwnerRoomByMemberId,  //通过会员ID获取业主信息以及房间信息
  printToPdf,   //打印收据
} from "@/service/leasing.js";
import util from "../js/utils";

export default {
  data() {
    return {
      startTime: '开始时间',
      endTime: '结束时间',
      billList: [],
      pageSize: 50,
      currentPage: 0,
      totalCount: "",
      loading: false,
      finished: true,
      refreshing: false,
      customerId: "",
      isCheckAll: [],   //是否全选
      checkSon: [],
      checkOrderTotal: 0,
      checkOrderTotalMoney: 0,
      searchType: "2",   //查询类型(1-可开票订单,2-全部订单)
      searchTypeName: "全部订单",   //
      showSearchType: false,
      option: [[
        {text: "可开票订单", value: "1"},
        {text: "全部订单", value: "2"}
      ]],
      actionType: "1",   //操作类型，1-发票开具，2-收据下载
      isShowSJBtn: false,  //是否显示收据下载按钮
      loadingBtn: false,   //按钮加载状态
      customerIdArr: [], //用户关联房间的客户id
      selectedCustomerIdsArr: [],   //已选择的开票的客户
      projectId: '',
      memberId: '',
      companyId: '',
      showTime: false,
      timeValue: Number(new Date()),
      key: '',
    }
  },

  onLoad() {
    const { AREA_ID, PROJECT_ID, MEMBER_ID,PROJECT_TYPE,COMPLANY_ID } = this.$constant;
    this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
    this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
     this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' });
    // localStorage.selectedCustomerIdsArr = "";
    util.storageAction({ key: 'selectedCustomerIdsArr', action: 'set', value: '' });
    let projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
    if (projectType == 129) {    //悦来项目下显示收据下载按钮
      this.isShowSJBtn = true;
    }
    // localStorage.selectedOrderData = "";
    util.storageAction({ key: 'selectedOrderData', action: 'set', value: '' });
    this.getOwnerRoomList();
  },

  methods: {
    //通过会员ID获取业主信息以及房间信息
    getOwnerRoomList() {
      let self = this;
      let data = {
        projectId: this.projectId,
        memberId: this.memberId
      };
      self.customerIdArr = [];
      var params = {
        data: data,
        "hideLoading": true
      }
      getOwnerRoomByMemberId(params).then(res => {
        if (res.status == 200 && res.data.length > 0) {
          res.data.forEach(item => {
            if (item.customerId) {
              self.customerIdArr.push(item.customerId);
            }
          });
          this.currentPage = 1;
          this.getListData(1);
        }
      })
    },

    //获取用户信息
    // getUserInfo() {
    //     let data = {
    //         projectId: this.projectId,
    //         memberId: this.memberId
    //     }
    //     getOwnerByMemberId(data).then(res => {
    //         if (res.status == 200) {
    //             this.customerId = res.data.customerId;
    //             this.currentPage = 1;
    //             this.getListData(1);
    //         } else {
    //             this.toastWord({text: res.message})
    //         }
    //     });
    // },

    //切换类型
    changeType(e) {
      let index = e.indexs[0];
      let typeInfo = this.option[0][index];
      this.searchType = typeInfo.value;
      this.searchTypeName = typeInfo.text;
      this.showSearchType =false;
      this.clearSelectd();
      this.resetLoadData();
    },
    cancelType(){
      this.showSearchType =false;
    },

    // 选择时间
    showTimePlugin(params) {
      const {key} = params;
      // this.timeValue =  Number(new Date());
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
        this.clearSelectd();
        this.resetLoadData();
      }
      this.showTime = false;
    },
    cancelTime(){
      if (this.key === 'startTime') this[this.key] = '开始时间';
      if (this.key === 'endTime') this[this.key] = '结束时间';
      this.clearSelectd();
      this.resetLoadData();
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
    resetLoadData() {
      this.currentPage = 1;
      this.finished = false;
      this.loading = true;
      this.getListData(0);
    },

    //获取列表数据
    getListData(flag) {
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
        startTime: self.startTime != "开始时间" ? moment(self.startTime).format('YYYY-MM-DD') : "",
        endTime: self.endTime != "结束时间" ? moment(self.endTime).format('YYYY-MM-DD') : "",
        type: self.searchType,
        pageIndex: self.currentPage,
        pageSize: self.pageSize,
        // customerId: self.customerId,
        companyId: this.companyId,
        customerIds: self.customerIdArr.join(","),
      };
      var params = {
        data:data,
        "hideLoading": true
      }
      getOrderListXS(params).then(res => {
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
          self.toastWord({text: res.message})
        }
      })
    },

    //全选
    checkAll(detail) {
      let self = this;
      self.checkSon = []
      if (detail.length >0) {
        self.billList.forEach(item => {
          if (self.actionType == '1') {        //发票开具时已经开过票的禁选
            if (item.invoiceStatus != '1') {
              self.checkSon.push(item.rhId);
            }
          } else {
            self.checkSon.push(item.rhId);
          }
        })
      }
      self.setMoney(self.checkSon);
    },

    //清空选项
    clearSelectd() {
      let self = this;
      self.checkSon = [];
      self.isCheckAll = [];
      self.checkOrderTotalMoney = 0;
      self.checkOrderTotal = 0;
    },

    //计算金额
    setMoney(detail) {
      let self = this;
      self.checkSon = detail;
      self.checkOrderTotalMoney = 0;
      self.checkOrderTotal = self.checkSon.length;
      self.selectedCustomerIdsArr = [];
      if (self.checkSon.length > 0) {
        self.billList.forEach(item => {
          self.checkSon.forEach(item2 => {
            if (item2 == item.rhId) {
              self.checkOrderTotalMoney = self.accAdd(item.receivedAmount, self.checkOrderTotalMoney);
              self.selectedCustomerIdsArr.push(item.customerId);
            }
          })
        })
        if (self.actionType == '1') {
          let newData = self.billList.filter(item => item.invoiceStatus != '1')
          console.log(newData)
          if (self.checkSon.length == newData.length) {
            self.isCheckAll = ['1'];
          } else {
            self.isCheckAll = [];
          }
        } else {
          if (self.checkSon.length == self.billList.length) {
            self.isCheckAll = ['1'];
          } else {
            self.isCheckAll = [];
          }
        }

      }
      self.selectedCustomerIdsArr = [...new Set(self.selectedCustomerIdsArr)];
      console.log(self.selectedCustomerIdsArr)
    },

    //下一步按钮
    nextBtn() {
      let self = this;
      if (self.actionType == "1") {
        let selectedOrderData = {};
        selectedOrderData.arr = [];
        selectedOrderData.checkOrderTotal = self.checkOrderTotal;
        selectedOrderData.checkOrderTotalMoney = self.checkOrderTotalMoney;
        self.billList.forEach(item => {
          self.checkSon.forEach(item2 => {
            if (item2 == item.rhId) {
              selectedOrderData.arr.push(item);
            }
          })
        })
        // localStorage.selectedOrderData = JSON.stringify(selectedOrderData);
        util.storageAction({ key: 'selectedOrderData', action: 'set', value: JSON.stringify(selectedOrderData) });
        // localStorage.selectedCustomerIdsArr = JSON.stringify(self.selectedCustomerIdsArr);
        util.storageAction({ key: 'selectedCustomerIdsArr', action: 'set', value:JSON.stringify(self.selectedCustomerIdsArr) });
        // self.$router.push({
        //   name: "addMakeInvoice",
        //   // params: { type: "edit" },
        // });
        uni.navigateTo({
          url:'/pages-leasing/addMakeInvoice',
        })
      } else {
        let data = {
          templateKey: "PRINT_TEMPLATE_RH_YUE_LAI",
          projectId: this.projectId,
          ids: self.checkSon.join(","),
        };
        console.log(data);
        self.loadingBtn = true;
        var params = {
          data: data,
          "hideLoading": true
        }
        printToPdf(params).then(res => {
          self.loadingBtn = false;
          if (res.status == 200) {
            location.href = res.data;
            // window.open(res.data)
          } else {
            self.toastWord({text: res.message})
          }
        });
      }
    },

    // 提示文字
    toastWord(params) {
      const {text} = params;
      if (!text) return;
      uni.showToast({ title: text, icon: 'none' });
    },

    // 两个浮点数求和
    accAdd(num1, num2) {
      var r1, r2, m;
      try {
        r1 = num1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = num2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      // return (num1*m+num2*m)/m;
      return Math.round(num1 * m + num2 * m) / m;
    },

    showSearchTypePicker(){
      this.showSearchType = true;
    },
    closeTime(){
      this.showTime = false;
    },
  },

  watch: {
    "actionType": {
      handler(val, oldVal) {
        if (val == '1') {
          this.checkSon.forEach((item, index) => {
            this.billList.forEach(item2 => {
              if (item == item2.rhId && item2.invoiceStatus == '1') {
                this.checkSon.splice(index, 1)
              }
            })
          })
        } else {
          if (this.isCheckAll.length > 1) {
            this.checkSon = [];
            this.billList.forEach(item => {
              this.checkSon.push(item.rhId);
            })
          }
        }
        console.log(this.checkSon);
        this.setMoney();
      }
    }
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

#pay-history-list {
  $font-s: 28rpx;
  box-sizing: border-box;
  padding: 88rpx 0 140rpx;
  height: 100vh;
  background-color: #f5f5f5;

  .top-search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background-color: #F5F5F5;

    .top-search-container {
      height: 44px;
      box-sizing: content-box;
      @include flx-dsp($jsc: center, $ali: center);
      padding-left: 22rpx;
      margin: 0 auto;
    }
  }

  .choose-date {
    // position: fixed;
    // top: 0;
    // left: 0;
    // width: 100%;
    // z-index: 2;
    // background-color: #F5F5F5;
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
  .text-right {
    text-align: right;
    font-size: 28rpx;
    padding-right: 40rpx!important;
  }
  .bill-record {
    color: #333;
    margin-bottom: 140rpx;
    
    .bill-item {
      background-color: #fff;
      margin: 0 11px 11px;
      padding: 11px;
      border-radius: 14rpx;
      line-height: 50rpx;
      display: flex;
      flex-direction: row;
      width: calc(100% - 44px);

      .fz-16 {
        font-size: 30rpx;
      }
      .fz-14 {
        font-size: 28rpx;
      }

      .color-blue {
        color: #2761ff;
      }

      .text-right {
        text-align: right;
        font-size: 28rpx;
        padding-right: 40rpx!important;
      }

      .color-red {
        color: #ff3300;
      }

      .item-top {
        border-bottom: 1px solid #eee;
        padding: 14rpx 0;
        margin-bottom: 14rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .color-grey {
        color: #aaa;
      }

      .color-green {
        color: rgb(43, 162, 70);
      }
    }
  }

  .footer-action {

  }
}
.btnMoney {
  margin-right: 0;
}
</style>


<style>
.footer-action {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  padding: 0 0 0 0;
  box-shadow: -1px -1px 5px #eee;
}



.red {
  color: #ff3300;
}
</style>
