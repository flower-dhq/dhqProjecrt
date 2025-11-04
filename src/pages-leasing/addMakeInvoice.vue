<template>
  <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!--开票详情-->
    <view style="padding: 10px 16px;color: #999;">详细信息</view>
    <u--form :rules="rules" labelWidth="100" customStyle="padding: 0 16px;background-color: #fff">
      <u-form-item
          label="发票类型"
          borderBottom
          ref="item1"
          @click="openTicketRulePicker"
      >
        <u--input
            v-model="formParams.ticketTypeName"
            border="none"
            readonly
        ></u--input>
        <u-icon
            slot="right"
            name="arrow-right"
        ></u-icon>
      </u-form-item>
      <u-form-item
          label="发票抬头"
          borderBottom
          @click="openTicketHeaderPicker"
          ref="item1"
      >
        <u--input
            v-model="formParams.ticketHeaderName"
            placeholder="请选择发票抬头"
            readonly
            border="none"
        ></u--input>
        <u-icon
            slot="right"
            name="arrow-right"
        ></u-icon>
      </u-form-item>
      <u-form-item
          label="总金额"
          borderBottom
          ref="item1"
      >
        <u--input
            v-model="formParams.totalMoney"
            readonly
            placeholder="总金额"
            border="none"
        ></u--input>
        <template #right>
          <u-button
              type="default"
              size="small"
              class="no-bg-btn"
              @click="lookOrder"
          >1张发票，含{{ formParams.checkOrderTotal }}个订单>
          </u-button>
        </template>
      </u-form-item>

    </u--form>
    <view style="margin: 16px;">
      <u-button shape="circle"  type="primary" @click="submit">提交</u-button>
    </view>
    <u-picker :show="showTicketHeaderPicker" :columns="ticketOptions" keyName="text" @confirm="onConfirmTicketHeader"  @cancel="cancelTicket"></u-picker>
    <u-picker :show="showTicketRulePicker" :columns="ruleList" keyName="ticketTypeDesc" @confirm="onConfirmTicketRule"  @cancel="cancelTicketRule"></u-picker>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import {
  getOwnerByMemberId,        //获取用户信息
  getSysCodeValueList, //根据常量类类型获取常量类集合
  getCustomerDetailByCustomerId, //查询客户信息
  makeOutAnInvoiceForHisNew,   //收款开票
  getOwnerRoomByMemberId,  //通过会员ID获取业主信息以及房间信息
  getRuleType3,//获取发票类型
} from "@/service/leasing.js";
import {grantMemberGrowthIntegral} from '@/service/community.js';
import util from "../js/utils";

export default {
  data() {
    return {
      formParams: {
        ticketTypeName: "",  //发票类型名称
        ticketType: "",       //发票类型
        // ticketHeaderType: "2",  //抬头类型   1-个人，2-单位
        ticketHeader: "",  //发票抬头
        ticketHeaderName: "",  //发票抬头名称
        // mailAddress: "",
        // taxNumber: "",
        totalMoney: "",
        checkOrderTotal: "",
      },
      customerId: "",
      customerName: "",
      showTicketTypePicker: false,  //发票类型选择器
      ticketTypeList: [],  //发票类型数据
      showTicketHeaderPicker: false,  //发票抬头选择器
      showTicketRulePicker: false,  //发票规则
      ticketHeaderList: [],  //发票抬头数据
      ticketHeaderIndex: "0",
      invoiceInfo: "",
      selectedCustomerIdsArr: [],
      userList: [],
      projectId: '',
      memberId: '',
      companyId: '',
      projectCode: '',
      rules:{
        'ticketHeaderName': {
          type: 'string',
          max: 1,
          required: true,
          message: '请选择发票抬头',
          trigger: ['blur', 'change']
        },
      },
      ticketOptions: [],
      ruleList: [],
    }
  },
  onLoad() {
    const {AREA_ID, PROJECT_ID, MEMBER_ID,COMPLANY_ID} = this.$constant;
    this.projectId = util.storageAction({key: PROJECT_ID, action: 'get'});
    this.memberId = util.storageAction({key: MEMBER_ID, action: 'get'});
    const {PROJECT_CODE} = this.$appConfig
    this.companyId = util.storageAction({key: COMPLANY_ID, action: 'get'});
    this.projectCode = PROJECT_CODE;
    this.getOwnerRoomList();  //通过会员ID获取业主信息以及房间信息
    this.getUserInfo();    //获取用户信息
    this.getTicketTypeList();   //获取票据类型数据
    let selectedOrderData = util.storageAction({ key: 'selectedOrderData', action: 'get' });
    this.formParams.totalMoney = JSON.parse(selectedOrderData).checkOrderTotalMoney;
    this.formParams.checkOrderTotal = JSON.parse(selectedOrderData).checkOrderTotal;
    let selectedCustomerIdsArr = util.storageAction({ key: 'selectedCustomerIdsArr', action: 'get' });
    this.selectedCustomerIdsArr = JSON.parse(selectedCustomerIdsArr);
    this.getRuleType();
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
      }
      getOwnerRoomByMemberId(params).then(res => {
        if (res.status == 200 && res.data.length > 0) {
          self.userList = res.data;
        }
      })
    },
    getRuleType() {
      let self = this;
      let data = {
        projectId: this.projectId,
      };
      self.customerIdArr = [];
      var params = {
        data: data,
      }
      getRuleType3(params).then(res => {
        if (res.status == 200 && res.data.length > 0) {
          let value = res.data[0];
          self.formParams.ticketTypeName = value.ticketTypeDesc;
          self.formParams.ticketType = value.ticketType;
          self.ruleList = [res.data];
        }
      })
    },

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
          this.getTicketHeaderData(); //获取发票抬头
        } else {
          this.toastWord({text: res.message})
        }
      });
    },

    //获取发票抬头
    getTicketHeaderData() {
      let self = this;
      if (self.selectedCustomerIdsArr.length > 1) {
        return false;
      }
      let data = {
        customerId: self.selectedCustomerIdsArr.join(","),
        projectId: this.projectId
      };
      var params = {
        data: data,
        "hideLoading": true
      }
      getCustomerDetailByCustomerId(params).then(res => {
        if (res.status == 200) {
          if (res.data) {
            self.ticketHeaderList = res.data.invoiceInfoList;
            self.ticketOptions = [self.ticketHeaderList];
            if (self.ticketHeaderList.length > 0) {
              self.ticketHeaderList.forEach(item => {
                if (item.invoiceTypeText) {
                  item.text = item.invoiceLabel + "(" + item.invoiceTypeText + ")";
                } else {
                  item.text = item.invoiceLabel;
                }
              })
              self.formParams.ticketHeaderName = self.ticketHeaderList[0].invoiceLabel;
              self.formParams.ticketHeader = self.ticketHeaderList[0].invoiceInfoId;
              self.invoiceInfo = self.ticketHeaderList[0];
              self.invoiceInfo.mailAddress = self.ticketHeaderList[0].mailAddress;
            }
          }
        }
      });
    },
    //打开发票抬头选择器
    openTicketHeaderPicker() {
      let self = this;
      // self.ticketHeaderIndex = self.ticketHeaderList.findIndex(item => item.invoiceInfoId == self.formParams.ticketHeader);
      self.showTicketHeaderPicker = true;
    },

    openTicketRulePicker() {
      let self = this;
      self.showTicketRulePicker = true;
    },

    //选择发票抬头
    onConfirmTicketHeader(e) {
      let index = e.indexs[0];
      let value = this.ticketOptions[0][index];
      let self = this;
      self.formParams.ticketHeaderName = value.invoiceLabel,
          self.formParams.ticketHeader = value.invoiceInfoId;
      self.invoiceInfo.mailAddress = self.ticketHeaderList.find(
          item => self.formParams.ticketHeader == item.invoiceInfoId
      ).mailAddress;
      self.showTicketHeaderPicker = false;
    },
    onConfirmTicketRule(e){
      let index = e.indexs[0];
      let value = this.ruleList[0][index];
      let self = this;
      self.formParams.ticketTypeName = value.ticketTypeDesc;
      self.formParams.ticketType = value.ticketType;
      self.showTicketRulePicker = false;
    },
    cancelTicket(){
      this.showTicketHeaderPicker = false;
    },
    cancelTicketRule(){
      this.showTicketRulePicker = false;
    },
    //获取票据类型数据
    getTicketTypeList() {
      let self = this;
      self.ticketTypeList = [];
      let data = {
        codeType: "TICKET_TYPE"
      };
      var params = {
        data: data,
        "hideLoading": true
      }
      getSysCodeValueList(params).then(res => {
        if (res.status == 200) {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              if (item.Id == "5") {
                let obj = {
                  Id: item.Id,
                  text: item.Name,
                }
                self.ticketTypeList.push(obj);
              }
            })
          }
        } else {
          self.toastWord({text: res.message})
        }
      });
    },

    //查看已选订单
    lookOrder() {
      // this.$router.push({
      //   name: "selectedOrder",
      // });
      uni.navigateTo({
        url:'/pages-leasing/selectedOrder',
      })
    },

    //提交
    submit() {
      let self = this;
      let selectedOrderData = util.storageAction({ key: 'selectedOrderData', action: 'get' });
      let billMessage = JSON.parse(selectedOrderData).arr;
      let customerName = "";
      self.userList.forEach(item => {
        if (self.selectedCustomerIdsArr[0] == item.customerId) {
          customerName = item.customerName;
        }
      })
      // let invoiceLabelMessage = "";
      // if(self.selectedCustomerIdsArr.length == 1){
      //     data.invoiceLabelMessage = self.invoiceInfo;
      // }
      let data = {
        customerId: self.selectedCustomerIdsArr[0],
        hisMessage: JSON.stringify(billMessage),
        invoiceLabelMessage: self.selectedCustomerIdsArr.length == 1 ? JSON.stringify(self.invoiceInfo) : " ",
        ticketType: self.formParams.ticketType,
        customerName: customerName,
        userName: self.customerName,
        projectId: this.projectId,
        invoiceNumber: "1",
        appFlag: 1,
        companyId: this.companyId,
      };
      console.log(data)
      var params = {
        data: data,
        responseToast: false,
      }
      makeOutAnInvoiceForHisNew(params).then(res => {
        if (res.status == 200) {

          // self.$Message.success("开票成功");
          uni.showToast({ title: '开票成功', icon: 'none' });
          var json = {
            memberId: this.memberId,
            source: 'ELECTRONIC_INVOICE',
            calculationMethod: 1,
            condition: 1,
          }
          if (this.projectCode == 'xiangshun') {
            var params = {
              data: json,
            }
            grantMemberGrowthIntegral(params);
          }
          // this.$router.go(-1); //返回上一层
          uni.navigateBack({
            delta: 1
          });
        } else {
          // self.$Message.warning(res.message);
          // uni.showToast({ title: res.message, icon: 'none' });
          self.$refs.uToast.show({
            type: 'default',
            message: res.message,
          })
        }
      })
    },

    // 提示文字
    toastWord(params) {
      const {text} = params;
      if (!text) return;
      // this.$vux.toast.show({
      //   type: 'text',
      //   text: text,
      //   position: 'middle',
      //   width: " 17em",
      // })
      uni.showToast({ title: text, icon: 'none' });
    },

  },
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background-color: #f5f5f5;
  ::v-deep .u-form{
    padding: 0 16px;
    background-color: #fff
  }
}
</style>

<style>
.no-bg-btn {
  color: #333333;
  background: rgb(255, 255, 255);
  border-color: rgb(255, 255, 255);
}

.no-bg-btn.u-button::before {
  background-color: #fff;
  border-color: #fff;
}

.no-bg-btn span {
  font-size: 12px;
}
</style>
