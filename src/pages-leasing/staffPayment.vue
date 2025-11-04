<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="top" @click="pickerEvent('open', 'customerList')">
      <image :src="require(`@/static/${[THEME_NAME]}/leasing/icon-person.png`)"
             style="width:30rpx;height:30rpx;"></image>
      <view class="owner-info">
        <view>姓名: {{customerInfo.customerName}}</view>
        <view style="margin-top: 5px">电话: {{customerInfo.contractTel}}</view>
      </view>
      <image :src="require(`@/static/${[THEME_NAME]}/leasing/icon-right.png`)"
             style="width:30rpx;height:30rpx;"></image>
      <image :src="require(`@/static/${[THEME_NAME]}/leasing/icon-line.png`)" class="line"
             style="width:100%;height:5rpx;"></image>
    </view>
    <u-tabs  :list="tabList" @click="tabClick" :lineColor="THEME_COLOR"  style="width: 100%" lineWidth="150rpx"></u-tabs>
    <view v-if="current == 0">
      <view class="middle">
        <view class="middle-name">费用合计</view>
        <view class="middle-value">{{ payNum }}<text class="middle-unit">元</text></view>
      </view>
      <view v-if="isShowMsg" style="text-align:center;margin-top:1rem;">暂无账单</view>
      <view style="height: calc(100vh - 558rpx);overflow: auto;"  class="bill-container">
        <uni-collapse  v-for="(item, index) in bills.FeeList" :key="item.key">
            <view class="title">{{ item.title }}</view>
            <uni-collapse-item :name="item.key" v-for="(Fee, index3) in item.data" :key="Fee.fiId"  :open="false" :border="true" title-border="show">
              <template v-slot:title>
                <view  class="item-title">
                  <u-checkbox
                      @change="checkAll($event, Fee)"
                      :checked="Fee.checked"
                      shape="circle"
                      :label="ruleType == 1 ? Fee.fiName : Fee.monthRange"
                      labelSize="28rpx"
                      labelColor="#333333"
                  />
                  <view class="total-money">合:{{ Fee.feeTotal }}元</view>
                </view>
              </template>
                <view v-for="(ele, index2) in Fee.feeData" :key="ele.billDetailId" class="item-content">
                  <u-checkbox
                      @change="checkAll($event, Fee, ele)"
                      :checked="ele.checked"
                      :name="ele.billDetailId"
                      style="padding:5px 0"
                      :activeColor="THEME_COLOR"
                      :label="ruleType == 1 ? ele.showTime : ele.fiNameAndDate"
                      shape="circle"
                      :disabled="chargeUnit == 0"
                    >
                  </u-checkbox>
                  <view >{{ ele.arrearsAmount }}元</view>
                </view>
            </uni-collapse-item>
        </uni-collapse>
        <view class="meterStyle" v-if="meterRechargeBtn && meterList.length > 0 ">
          <uni-collapse>
            <uni-collapse-item>
              <template v-slot:title>
                <view  class="item-title">
                  <u-checkbox
                      v-model="meterRechargeChecked"
                      :checked="meterRechargeChecked"
                      :label="'仪表充值'"
                      shape="circle"
                      activeColor="var(--app-primary-color)"
                      labelColor="#333333"
                      @change="changeMeter"
                  ></u-checkbox>
                  <view class="total-money">合:{{ meterRechargeAmount }}元</view>
                </view>
              </template>
              <view v-for="(item, index) in meterList" :key="index" class="item-content">
                <u-checkbox
                  v-model="meterRechargeChecked"
                  :checked="meterRechargeChecked"
                  :label="item.number"
                  shape="circle"
                  activeColor="var(--app-primary-color)"
                  @change="changeMeter"
                ></u-checkbox>
                <view >充值金额：{{item.rechargeAmount}}元</view>
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </view>
      </view>
      <view class="bottom">
        <view class="add-temportary" @click="addFee">
          <image :src="require(`@/static/${[THEME_NAME]}/leasing/icon-add.png`)"
                 style="width:48rpx;height:48rpx;"></image>
          <view class="text">新增临时费用</view>
        </view>
        <u-button type="primary" :plain="true" text="生成收款码" customStyle="width: 210rpx" @click="checkBillDetailData(1)"></u-button>
        <u-button type="primary"  text="账单分享" customStyle="width: 210rpx" @click="checkBillDetailData(2)"></u-button>
      </view>
    </view>
    <view v-if="current == '1'">
      <payMent-history ref="payMentHistoryRef" :customerId="customerInfo.customerId" :projectId="customerInfo.projectId"></payMent-history>
    </view>

    <u-popup
        :show="codePopup"
        mode="center"
        round="20rpx"
        class="code-popup-box"
        :close-on-click-overlay="false"
        :customStyle="{ width: '550rpx', height: '670rpx' }"
    >
      <view class="popup-container">
        <view style="text-align: center" v-if="!isPay">
          <view class="qrcode-container">
<!--            <view class="qrcode" ref="qrCodeUrl"></view>-->
            <canvas id="qrcode" canvas-id="qrcode" class="qrcode"></canvas>
            <cover-view class="customer-name">{{customerInfo.customerName}}</cover-view>
          </view>
          <!-- <view class="pay-type">支付宝/微信支付</view> -->
          <view class="pay-type" v-if="payWay == 'wx'">微信支付</view>
          <view class="pay-type" v-else-if="payWay == 'zfb'">支付宝支付</view>
          <view class="pay-type" v-else>支付宝/微信支付</view>
          <u-button type="primary" style="width: 260rpx" text="查看支付结果" @click="getPayResult"></u-button>
        </view>
        <view class="pay-status" v-if="isPay">
          <view style="margin: 10px 0;" v-if="payStatus == ''">正在支付……</view>
          <view style="margin: 10px 0;" v-if="payStatus == '1'">支付成功</view>
          <view style="margin: 10px 0;" v-if="payStatus == '-1'">支付失败</view>
          <u-button type="primary" style="height: 30px;margin: 10px 0;" text='确定' @click="confirmIsPay"></u-button>
        </view>
      </view>

    </u-popup>
    <!--账单分享弹框-->
    <u-action-sheet
        :show="shareModal"
        :actions="shareTypeList"
        :close-on-click-overlay="false"
        :round="false"
        cancel-text="取消"
        close-on-click-action
        title="请选择账单分享方式"
        @select="selectShareType"
        @close="shareModal = !shareModal"
    >
    </u-action-sheet>
    <u-picker :show="picker.show" :columns="picker.list" :keyName="picker.keyName" @cancel="pickerEvent('cancel')"
              @confirm="($event) => pickerEvent('confirm', null, $event)"></u-picker>

    <u-popup
      :show="payPopup"
      round="20rpx"
      mode="bottom"
      @close="closePayPopup"
      :customStyle="{ height: '500rpx','padding-top': '20px','flex': 'none', }"
    >
      <u-radio-group v-model="payWay" placement="column" class="payPopupStyle">
        <view class="allGroup" @click="payWay = 'wx'" v-if="isShowWx" style="border-bottom: 1px solid #f5f5f5;">
          <view class="allGroup-icon">
            <u-icon name="weixin-circle-fill" size="60rpx" color="#5ac725"></u-icon>
          </view>
          <view class="allGroup-gr">
            <u-radio name="wx" label-position="right"/>
          </view>
        </view>
        <view class="allGroup" @click="payWay = 'zfb'" v-if="isShowZfb">
          <view class="allGroup-icon">
            <u-icon name="zhifubao-circle-fill" size="60rpx" color="#027AFF"></u-icon>
          </view>
          <view class="allGroup-gr">
            <u-radio name="zfb" label-position="right"/>
          </view>
        </view>
      </u-radio-group>
      <view class="sureBtn">
          <view class="sureBtn-box" @click="submit">确定</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import UQRCode from 'uqrcodejs'
import {
  getBillDetailRecordByConfigStaff,
  getCustomerInfoByContractCode2,
  checkBillDetailRecordForCharge,
  getOrderNum,
  getPayInfoNew,
  makeBillSharingSetting,
  isPaySuccess2,
  cancelChargePayOrder,
  getPayOnlineSettingStaff,
  getWxAppIdByCompanyId,
  getPayOnlineSetting,
  getPayChannelByPayAssetsParams,
  getPayTypeListByPayAssetsParams,
  getMeterByCustomerIdAndRoomId,  //查询仪表信息接口
} from "@/service/leasing";
import { getCompanyAgentMaterialList } from '@/service/api-gateway'
import payMentHistory from "@/pages-leasing/payMentHistory";

export default {
  components: {
    payMentHistory,
  },
  data() {
    return {
      customerInfo: {
        customerName: '',
        contractTel: '',
        customerId: '',
        projectId: ''
      },
      tabList:[
        {
          name: '缴费'
        },
        {
          name: '记录'
        },
      ],
      payNum: 0,
      current: 0,
      bills: {},
      customerList: [],
      billDetailIds: [],
      isShowMsg: false,    //暂无信息显示
      codePopup: false,   //生成二维码弹框
      isPay: false,   //是否支付
      codeLocation: "",  //二维码地址
      payStatus: "",   //支付状态
      orderNo: "",    //订单号
      shareModal: false, //分享弹框
      shareTypeList: [
        { name: '账单二维码分享', id: 1, className: "code-item"},
        { name: '账单链接分享', id: 2, className: "link-item"},
      ],
      picker: {
        show: false,
        type: '',
        list: [],
        keyName: ''
      },
      roomCodesParams: [],   //缴费账单的房间地址
      userInfo: {},
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      },
      billSharingMethod: "",//后台配置的账单分享方式（1.小程序(太阳码)，2.H5支付，3.公众号）
      chargeUnit: 1,   //0--账单缴费，1--明细缴费
      ruleType: 1,  //展示规则,0-按资产+账期展示，1-按资产+费项展示，2-账期+资产
      notifyUrl: "",
      payPopup: false,
      payWay: "",
      isShowWx: false,
      isShowZfb: false,
      currProjectName: "",  //配置文件的PROJECT_CODE
      meterRechargeBtn: false,  //仪表充值按钮权限
      meterRechargeChecked: false,   //是否选中仪表充值
      meterRechargeAmount: 0,  //仪表充值合计金额
      meterList: [],  //仪表信息
    }
  },
  computed: {
  },
  onLoad(options){
    const { PROJECT_CODE} = this.$appConfig;
    this.currProjectName = PROJECT_CODE;
    var O_USER_INFO = this.$constant.O_USER_INFO;
    this.userInfo = this.$utils.storageAction({
      key: O_USER_INFO,
      action: 'get'
    });
    const item = options.item ? JSON.parse(decodeURIComponent(options.item)) : '';
    const customers =options.customers ? JSON.parse(decodeURIComponent(options.customers)) : '';
    if(item){
      var params = {
        data: {
          projectId: item.projectId,
          nodeCategory: item.nodeCategory,
          nodeId: item.nodeId,
        },
        hideLoading: true,
        responseToast: false,
      }
      getCustomerInfoByContractCode2(params).then(res => {
        if(res.status == 200){
          this.customerList = res.data.currentCustomer;
          this.customerInfo = this.customerList[0];
          this.customerList = [this.customerList];
          this.initData();
        }
      })
    }else{
      this.customerList = customers;
      this.customerList.forEach(item => {
        item.contractTel = item.contactTel;
      })
      this.customerInfo = this.customerList[0];
      this.customerList = [customers];
      this.initData();
    }
    uni.$on('addFee', ({ type,  }) => {
      this.getBills();
    });

    this.getShareConfig()
  },
  methods: {
    async initData(){
      await this.getMeterList();
      await this.getPayOnlineSettingFun();
      await this.getBills();
      await this.getPayOnlineShareSettingFun(); //获取后台配置的账单分享方式
    },

    //查询仪表信息
    getMeterList(){
      let self = this;
      self.meterRechargeAmount = 0;
      self.meterList = [];
      self.meterRechargeChecked = false;
      self.meterRechargeBtn = false;
      if(self.currProjectName != "DANREN" && self.currProjectName != "DANRENEJIA"){
        return false;
      }
      let data = {
          projectId: self.customerInfo.projectId,
          customerId: self.customerInfo.customerId,
      }
      if(self.customerInfo.rooms && self.customerInfo.rooms.length > 0){
        data.roomId = self.customerInfo.rooms[0].roomId;
      }
      let params = {
          data: data,
      }
      getMeterByCustomerIdAndRoomId(params).then(res=>{
          if(res.status == 200){
              if(res.data && res.data.length > 0){
                  res.data.forEach(item=>{
                    if(!item.maxBuy){
                          item.maxBuy = 0;
                      }
                      item.rechargeAmount = item.lockState == 1 ? 0 : item.maxBuy;
                      if(item.lockState == 0){
                          self.meterRechargeAmount= Number(item.rechargeAmount);
                      }
                  })
                  self.meterList = res.data;
                  self.meterRechargeBtn = true;
                  self.meterRechargeChecked = true;
              }
          }
      })
    },

    tabClick(data){
      this.current = data.index;
      if(this.current == 1){
        this.$nextTick(() =>{
          this.$refs.payMentHistoryRef.onRefresh();
        })
      }else{
        this.getBills();
      }
    },
    getBills() {
      let self = this;
      let data = {
        projectId: this.customerInfo.projectId,
        customerId: this.customerInfo.customerId,
      }
      var params = {
        data: data,
        hideLoading: false,
        responseToast: false,
      }
      getBillDetailRecordByConfigStaff(params).then(res => {
        if (res.status == 200 && res.data) {
          this.bills = res.data;
          this.bills.FeeList = [];
          let billList = []
          this.activeArr = [];
          this.resultArr = {};
          this.checkParent = {};
          this.checkSon = [];

          for (var key in this.bills) {
            if (key != "total" && key != "FeeList") {
              this.activeArr.push(key);
              this.bills[key].key = key;
              this.resultArr[key] = [];

              this.bills[key].data.forEach(element => {
                // element.checked = true;

                element.feeData.forEach(ele => {
                  ele.checked = false;
                  //账期小于等于当前日期的默认选中
                  if(ele.fiName && ele.chargePeriod){
                    ele.fiNameAndDate = ele.fiName + "(" + ele.chargePeriod + ")";
                    let newDate = uni.$u.timeFormat(Date.now(), 'yyyy-mm')
                    if(newDate > ele.chargePeriod || newDate == ele.chargePeriod){
                      ele.billDetailIds.forEach(item=>{
                        this.checkSon.push(item);
                        ele.checked = true;
                      })
                    }
                  }else{
                    let newDate = uni.$u.timeFormat(Date.now(), 'yyyy-mm')
                    let startDate = uni.$u.timeFormat(ele.startDate, 'yyyy-mm')
                    if(newDate > startDate || newDate == startDate){
                      ele.billDetailIds.forEach(item=>{
                        this.checkSon.push(item);
                        ele.checked = true;
                      })
                    }
                  }
                  // ele.billDetailIds.forEach(item=>{
                  //   this.checkSon.push(item);
                  // })
                  // this.checkSon.push(ele.billDetailId);
                  // ele.checked = true;
                  ele.showTime =
                      uni.$u.timeFormat(ele.startDate, 'yyyy-mm-dd') +
                      "-" +
                      uni.$u.timeFormat(ele.endDate, 'yyyy-mm-dd');
                });

                //子元素如果全部选中，则父元素默认选中状态
                let flag = false;
                element.feeData.forEach(ele=>{
                  if(!ele.checked){
                    flag = true;
                    return;
                  }
                })
                if(!flag){
                  element.checked = true;
                }
              });
              if(self.ruleType == 2){
                //按账期+资产展示时需要重新排序
                billList.push(this.bills[key]);
                billList.sort((a, b)=>{
                  if (a.key < b.key) return -1;
                  if (a.key > b.key) return 1;
                  return 0;
                })
                this.bills.FeeList = billList;
              }else{
                this.bills.FeeList.push(this.bills[key]);
              }
              // this.bills.FeeList.push(this.bills[key]);
            }
          }
          if(this.bills.FeeList.length > 0){
            this.isShowMsg = false;
          }else{
            this.isShowMsg = true;
          }
          this.setNum();
        } else {
          this.bills = {};
          this.bills.FeeList = [];
          this.checkSon = [];
        }
      });
    },
    checkAll(checked,fee, ele) {
      if(!ele){
        fee.checked = checked;
        fee.feeData.forEach(item => {
          item.checked = checked;
        })
      }else{
        ele.checked = checked;
        fee.checked = fee.feeData.every(item => item.checked);
      }
      this.$forceUpdate();
      this.setNum();
    },
    addFee(){
      if(!this.customerInfo){
        uni.showToast({ title: '请选择客户', icon: 'none' });
        return
      }
      let customerInfo =encodeURIComponent(JSON.stringify(this.customerInfo));
      uni.navigateTo({
        url: `/pages-leasing/addFee?customerInfo=${customerInfo}`
      });
    },
    setNum() {
      let totalMoney = 0;
      this.payNum = 0;
      this.billDetailIds = [];
      this.bills.FeeList.forEach(element => {
        element.data.forEach(fee => {
          fee.feeData.forEach(ele => {
            if (ele.checked) {
              ele.billDetailIds.forEach(item=>{
                this.billDetailIds.push(item);
              })
              // this.billDetailIds.push(ele.billDetailId);
              // this.payNum = ((ele.arrearsAmount * 100 + this.payNum * 100)) / 100;
              totalMoney  = this.accAdd(ele.arrearsAmount,totalMoney)
            }
          });
        });
      });
      totalMoney  = this.accAdd(this.meterRechargeAmount,totalMoney)
      this.payNum = totalMoney;
      console.log(this.billDetailIds)
    },
    // 两个浮点数求和
    accAdd(num1,num2){
      var r1,r2,m;
      try{
        r1 = num1.toString().split('.')[1].length;
      }catch(e){
        r1 = 0;
      }
      try{
        r2=num2.toString().split(".")[1].length;
      }catch(e){
        r2=0;
      }
      m=Math.pow(10,Math.max(r1,r2));
      // return (num1*m+num2*m)/m;
      return Math.round(num1*m+num2*m)/m;
    },
    //检查账单核销数据
    checkBillDetailData(flag){
      let self = this;
      if(self.payNum == 0){
        uni.showToast({ title: '请选择账单', icon: 'none' });
        return false;
      }
      self.getRoomCodesArr(); //查找缴费账单的房间号
      let data = {
        billDetailIds: this.billDetailIds.join(','),
        customerId: self.customerInfo.customerId,
        projectId: self.customerInfo.projectId,
      };
      var params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      checkBillDetailRecordForCharge(params).then(res=>{
        if(res.status == 200){
          if(flag == 1){
            self.getNum(3);   //生成收款码
          }else{
            // self.shareBtn();   //账单分享
            self.getOrderKey();
          }
        }else{
          uni.showToast({ title: res.message, icon: 'none' });
        }
      })
    },
    //账单分享按钮
    shareBtn(){
      let self = this;
      if (self.payNum == 0) {
        uni.showToast({ title: '请选择账单', icon: 'none' });
        return false;
      }
      self.shareModal = true;
    },
    getNum(type) {
      let self = this;
      if(self.payNum == 0){
        uni.showToast({ title: '请选择账单', icon: 'none' });
        return false;
      }
      //type (0-微信,1-支付宝,2-银联)
      let paymentAmount = this.fomatFloat(this.payNum);
      var data = {
        customerId: this.customerInfo.customerId,
        paymentAmount: paymentAmount,
        userAccount: "",
        billDetailIds: this.billDetailIds.join(','),
        poundageMoney: "",
        projectId:  this.customerInfo.projectId,
        paymentType: type,
        discountMoney: "",
        customerName: this.customerInfo.customerName,
        addrInfo: this.roomCodesParams.length > 0
            ? this.roomCodesParams.join(",")
            : " ",
        payChannel: "员工端",
        userName: this.userInfo.userName,
        getNotifyUrl: 1,   //获取回调地址
      };
      if(self.meterRechargeChecked && self.meterList && self.meterList.length > 0){
        let meterRechargeParam = [];
        meterRechargeParam = self.meterList.filter(item=>item.lockState == 0);
        data.meterRechargeParam = meterRechargeParam.length > 0 ? JSON.stringify(meterRechargeParam) : "";
      }
      this.loading = true;
      var params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      getOrderNum(params).then(res => {
        this.loading = false;
        if (res.status == 200) {
          // this.generateCodeBtn(res.data,paymentAmount,res.extraData.notifyUrl);    //生成二维码收款码
          this.orderNo = res.data;
          if(res.extraData && res.extraData.notifyUrl){
              this.notifyUrl = res.extraData.notifyUrl;
          }
          this.getPayChannelFun();   //获取支付参数
        }else{
          if(res.message.indexOf('账单正在支付请稍后') > -1){
            res.message = '您在刚刚已经生成收款码了，请在5分钟后再尝试';
          }
          uni.showToast({ title: res.message, icon: 'none' });
        }
      });
    },
    // 获取支付参数
    getPayChannelFun(){
      let self = this
      let data = [{assetsId:this.customerInfo.projectId,expenditure:""}];
      let params = {
        // data: [{assetsId:37075,expenditure:"运费费项（合创测试）"}],
        data,
        hideLoading: false,
        responseToast: false,
      }
      getPayChannelByPayAssetsParams(params).then((res)=>{
        if(res.status == 200){
            if(res.data == "allinpay" || res.data == "ebeipay" ||
                res.data == "cdcbpay" || res.data == "psbcpay" ||
                res.data == "icbcpay"){
            //通联或者一碑原生,icbcpay：工商银行
            self.payPopup = true;
            self.payWay = "wx";
            self.getPayTypeListFun(params.data);
            }else{
            self.wxMiniPay("common")
            }
        }else{
            uni.showToast({ title: res.message, icon: 'none' });
            // self.wxMiniPay("common")
        }
      })
    },

    getPayTypeListFun(){
      let self = this;
      let data = [{assetsId:this.customerInfo.projectId,expenditure:""}];
      let params = {
        // data: [{assetsId:37075,expenditure:"运费费项（合创测试）"}],
        data,
        hideLoading: false,
        responseToast: false,
      }
      getPayTypeListByPayAssetsParams(params).then(res=>{
          if(res.status == 200){
              if(res.data.length > 0){
                  res.data.forEach(item=>{
                  if(item.payType == "wx"){
                      self.isShowWx = true;
                      self.payWay = "wx";
                  }else if(item.payType == "zfb"){
                      self.isShowZfb = true;
                  }
                  })
                  if(res.data.length == 1){
                  self.payWay = res.data[0].payType;
                  }
                  self.payPopup = true;
              }else{
                  uni.showToast({ title: "暂无支付方式，请联系管理员", icon: 'none' });
              }
          }else{
              uni.showToast({ title: res.message, icon: 'none' });
          }
      })
    },

    submit(){
        let self = this;
        console.log("支付方式："+self.payWay)
        self.payPopup = false;
        self.wxMiniPay(self.payWay);
    },

    //金额转换
    fomatFloat(value){     //value：值，precision：精度， roundingType：取舍
      var s = value.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
        s += '.';
      }
      for(var i = s.length - s.indexOf('.'); i <= 2; i++){
        s += "0";
      }
      return s;
    },
    //生成二维码
    wxMiniPay(payMethod){
      let self = this;
      let totalAmount = this.fomatFloat(this.payNum);
      let data = {
        model: 'jiaofei',//必填 模块：huodong=活动，club=场馆/会所、parking=停车场、printing=打印
        orderNo: this.orderNo,//必填 业务订单号
        payMethod: payMethod,//必填 支付类型：wx=微信、zfb=支付宝，yl=银联，common=通用
        tradeType: "code",//必填 支付方式：jsapi=微信公众号， mini=银联小程序，wxmini=微信小程序  app=app支付，code=收款码,
        assetsId: this.customerInfo.projectId,//必填 资产（项目、园区、单元、楼栋、楼层、房间等）ID
        expenditure: '',//费项名称,按费项支付时传入
        merge: false,//合并支付标识，缺省值: false
        mergeParamsList: [],//{assetsId:'', //资产ID  expenditure:'', //费项名称 totalAmount:'' //分账金额  },//合并支付，分账列表，merge=true时，必传
        expireTime:'',//订单失效时间的 Unix 时间戳，缺省值：30分钟
        totalAmount: this.accMulfunction(totalAmount, 100), //必填 金额（单位：分）
        body:'物业缴费',//订单描述
        attach:'',//自定义参数JSON字符串
        thirdJson:'',//三方参数JSON字符串
        userId: this.userInfo.userId,//用户ID
        userName: this.userInfo.userName,//用户姓名
        notifyUrl:this.notifyUrl,//上送支付中心回调接口
      };
      if(this.roomCodesParams.length > 0){
        data.body = this.roomCodesParams[0]+ `${this.roomCodesParams.length > 1 ? '等资产' : ''},`
            + this.customerInfo.customerName + "(" +this.customerInfo.contactTel + ")"
      }else{
        data.body = this.customerInfo.customerName + "(" + this.customerInfo.contactTel + ")"
      }
      var params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      getPayInfoNew(params).then(res => {
        if(res.status == 200){
          self.codePopup = true;
          self.isPay = false;
          self.codeLocation = res.data.data;
          self.$nextTick(function () {
            self.creatQrCode();  //生成二维码
          })
        }else{
          self.codePopup = false;
          uni.showToast({ title: res.message, icon: 'none' });
        }
      })
    },
    accMulfunction(arg1,arg2){
      var m=0,s1=arg1.toString(),s2=arg2.toString();
      try{
        if(s1.split(".")[1] != undefined )
          m+=s1.split(".")[1].length
      }catch(e){}
      try{
        if(s2.split(".")[1] != undefined )
          m+=s2.split(".")[1].length
      }catch(e){}
      return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    },
    rpxToPx(rpx) {
      const screenWidth = uni.getSystemInfoSync().screenWidth
      return (screenWidth * Number.parseInt(rpx)) / 750
    },
    //  生成二维码
    creatQrCode () {
      let self = this;
      let width = this.rpxToPx(380);
      // let qrcode = new QRCode(self.$refs.qrCodeUrl.$el, {
      //   width: width,
      //   height: width,        // 高度
      //   text:  self.codeLocation,   // 二维码内容
      //   render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
      //   // background: '#f0f',   // 背景色
      //   // foreground: '#ff0'    // 前景色
      // })
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data =  self.codeLocation;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = width;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
    },
    //查询支付结果
    getPayResult(){
      let self = this;
      self.isPay = true;
      let data = {
        orderNo: self.orderNo,
      };
      var params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      isPaySuccess2(params).then(res=>{
        if (parseInt(res.status)  === 200) {
          if (res.data.state == 1) {
            //已支付
            self.payStatus = '1';
          }
          else {
            //未支付
            self.payStatus = '-1';
            // self.setPayment(0);
          }
        }else{
          //支付失败
          self.payStatus = '-1';
          // self.setPayment(0);
        }
      })
    },
    //确定是否支付
    confirmIsPay(){
      this.codePopup = false;
      this.getBills()
      if(this.payStatus == "-1"){
        let data = {
          orderNo: this.orderNo,
        };
        var params = {
          data: data,
          hideLoading: true,
          responseToast: false,
        }
        cancelChargePayOrder(params).then(res=>{
          if(res.status == 200){
            this.getBills()
          }else{
            this.getBills()
          }
        })
      }else{
        this.getBills()
      }
    },
    //取消支付
    closePayPopup(){
      this.payPopup = false;
      let params = {
        orderNo: this.orderNo,
      };
      cancelChargePayOrder(params).then(res=>{
        if(res.status == 200){
          this.getBills(this.customerInfo.customerId)
        }else{
          this.getBills(this.customerInfo.customerId)
        }
      })
    },
    //选择分享方式
    selectShareType(data){
      let self = this;
      if(data.id == 1){
        let shareInfo = {
          customerId: self.customerInfo.customerId,
          customerName: self.customerInfo.customerName,
          addrInfo: self.customerInfo.houseInfo,
          contactTel: self.customerInfo.contactTel,
          billDetailIds: this.billDetailIds.join(','),
          projectId: self.customerInfo.projectId,
          totalMoney: self.payNum,
        }
        // localStorage.shareInfo = JSON.stringify(shareInfo);
        // this.$router.push({
        //   path: "/replacePay"
        // });
         shareInfo =encodeURIComponent(JSON.stringify(shareInfo));
        uni.navigateTo({
          url: `/pages-leasing/replacePay?shareInfo=${shareInfo}`
        });
      }else if(data.id == 2){
        self.getOrderKey();
      }
    },

    //获取分享方式
    getPayOnlineShareSettingFun(){
      let self = this;
      let data = {
        companyId: self.$appConfig.COMPLANY_ID,
        authType: 0,
      };
      let params = {
        data: data,
      }
      getPayOnlineSettingStaff(params).then(res=>{
        if(res.status == 200){
          if(res.data && res.data.length > 0){
            self.billSharingMethod = res.data[0].billSharingMethod;
          }
        }else{
          self.billSharingMethod = ""
        }
      })
    },

    //获取线上缴费贵
    getPayOnlineSettingFun(){
      let self = this;
      let data = {
          projectId: this.customerInfo.projectId,
          authType: 2,
      };
      let params = {
          data: data,
      }
      getPayOnlineSetting(params).then(res=>{
          if(res.status == 200){
              if(res.data && res.data.length > 0){
                  res.data.forEach(item=>{
                      if(item.channelCode == "staff_account"){
                          self.chargeUnit = item.chargeUnit;
                          self.ruleType = item.ruleType;
                      }
                  })
              }
          }
      })
    },

    //获取订单key
    getOrderKey(){
      // if (!this.shareConfig.materialUrl) {
      //   uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
      //   return
      // }

      let self = this;
      let data = {
        customerId: self.customerInfo.customerId,
        customerName: self.customerInfo.customerName,
        addrInfo: this.roomCodesParams.join(","),
        contactTel: self.customerInfo.contactTel,
        billDetailIds: this.billDetailIds.join(','),
        projectId: self.customerInfo.projectId,
      };
      var params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      makeBillSharingSetting(params).then(res => {
        if(res.status == 200){
          let key  = res.data;
          // let url = process.env.URL;
          // let targetUrl = url + "ygdsf/#" + "/WXSharePage" + "?key=" + key;
          let targetUrl = "";
          targetUrl = this.$appConfig.DOMAIN_PRO + "/ygdsf/#/WXSharePage/?key=" + key + "&=userName" +encodeURIComponent(this.userInfo.userName)+"&LeasingVersion=V60";
          let desc = self.customerInfo.customerName + "有一笔订单请你帮我付，" + self.payNum + "元";
          //小程序
          let miniprogramInfo =  {
            appid: self.$appConfig.OWNER_APPID,//小程序的appid
            title: '有一笔待缴订单，烦请查阅', //小程序消息的title
            // desc: desc,
            imgUrl: `${self.$appConfig.DOMAIN_PRO}/online-assets/static/theme-default/index/payment.png`,
            page: `/pages-leasing/paymentinfo/WXSharePage.html?key=${key}&userName=${self.userInfo.userName}`
          };

          //h5页面
          let h5Info = {
            title: '有一笔待缴订单，烦请查阅',
            desc: desc,
            imgUrl: `${self.$appConfig.DOMAIN_PRO}/online-assets/static/theme-default/index/payment.png`,
            link: targetUrl,
          };

          //公众号页面
          let newsInfo = {
            title: '有一笔待缴订单，烦请查阅',
            desc: desc,
            imgUrl: `${self.$appConfig.DOMAIN_PRO}/online-assets/static/theme-default/index/payment.png`,
            link: "",
          };
          if(self.billSharingMethod == "1"){
            self.qyMiniShareFun(1,miniprogramInfo)
            return
          }else if(self.billSharingMethod == "2"){
            self.qyMiniShareFun(2,h5Info)
            return
          }else if(!self.billSharingMethod || self.billSharingMethod == "3"){
            let data = {
              companyId: self.$appConfig.COMPLANY_ID,
              wechatType: 2,
            };
            let params = {
              data: data,
            }
            getWxAppIdByCompanyId(params).then(res=>{
              if(res.status == 200){
                let appId = res.data.appId;  //公众号appid
                if(!appId){
                  uni.showToast({ title: "未关联appId，无法分享", icon: 'none' });
                  return false;
                }
                let projectType = res.data.projectType;
                let url = "";
                if(self.$appConfig.PROJECT_CODE == "YUN_DEV"){
                  url = "https://ebeitest-mp.wuyeface.com/uniwechat/oauth2.html";
                }else{
                  url = this.$appConfig.DOMAIN_PRO + "/uniwechat/oauth2.html";
                }
                let url2 = url+"?projectType="+projectType+"&leaseKey="+key+"&leaseUserName="+encodeURIComponent(encodeURIComponent(this.userInfo.userName));
                newsInfo.link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(url2)}&response_type=code&scope=snsapi_userinfo&state=code&connect_redirect=1#wechat_redirect`
                console.log(newsInfo)
                self.qyMiniShareFun(2,newsInfo)
                return
              }
            })
          }
        }else{
          uni.showToast({ title: res.message, icon: 'none' });
        }
      })
    },

    //调用企微小程序的分享方法
    qyMiniShareFun(type,data){
      let self = this;
      wx.qy.getContext({success: res => {
        var entry = res.entry;//返回进入小程序的入口类型
        console.log('entry', entry);

        if (entry == 'single_chat_tools') {

          if (type == 1) {
            // 发送小程序
            wx.qy.sendChatMessage({
              msgtype: 'miniprogram',
              enterChat: true,
              miniprogram: data,
            })
          }else if (type == 2 ) {
            // H5或公众号
            wx.qy.sendChatMessage({
              msgtype: 'news',
              enterChat: true,
              news: data,
            })
          }

        } else {

          let attachments = []
          if (type == 1) {
            // 发送小程序
            attachments.push({
              msgtype: 'miniprogram',
              miniprogram: {
                appid: data.appid,
                title: '有一笔待缴订单，烦请查阅',
                imgUrl: data.imgUrl,
                page: data.page, // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
              }
            })
          } else if (type == 2) {
            // H5或公众号
            attachments.push({
              msgtype: 'link',
              link: {
                title: '有一笔待缴订单，烦请查阅',
                desc: data.desc,
                imgUrl: data.imgUrl,
                url: data.link,
              }
            })
          }

          wx.qy.shareToExternalContact({
            externalUserIds: [],
            text: {
              content: ''
            },
            attachments,
            // success: () => {
            //   this.handleUpdateStatus(data)
            // }
          })

        }
      },
      fail: function (res){
          console.log('fail', res);
        }
      })
    },


    WXShareFun(targetUrl){
      let self = this;
      let type = 1; //type,0-图片，1-url；
      let title = "有一笔待缴订单，烦请查阅";
      let desc = self.customerInfo.customerName + "有一笔订单请你帮我付，" + self.payNum + "元";
      let url = targetUrl;
      // EbeiPlugins.shareURLToWeixin(type,title,desc,url);
      uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: url,
        title: title,
        summary: desc,
        success: function (res) {
          console.log("success:" + JSON.stringify(res));
        },
        fail: function (err) {
          console.log("fail:" + JSON.stringify(err));
        }
      });

    },
    pickerEvent(action, key, data) {
      if (action === 'open') {
        this.picker.show = true;
        this.picker.type = key;
        this.picker.list = this[key];
        this.picker.keyName = 'customerName'
      } else if (action === 'cancel') {
        this.picker.show = false;
      } else if (action === 'confirm') {
        const { value, indexs } = data;
        const item= value[0];
        const { type } = this.picker;
        if (type === 'customerList') {
          this.customerInfo = item;
        }
        this.picker.show = false;
        this.tabClick({
          index: this.current
        })
      }
    },
    //查找缴费账单的房间号
    getRoomCodesArr() {
      let self = this;
      let FeeList = self.bills.FeeList;
      let roomCodesArr = [];
      self.roomCodesParams = [];
      if (FeeList.length > 0) {
        FeeList.forEach(item => {
          item.data.forEach(item2 => {
            item2.feeData.forEach(item3 => {
              if (item3.checked) {
                if (item2.code) {
                  roomCodesArr.push(item2.code);
                }
              }
            });
          });
        });
      }
      self.roomCodesParams = Array.from(new Set(roomCodesArr));
    },
    // 获取“分享缴费”的配置
    async getShareConfig() {
      const params = {
        data: {
					pageNum: 1,
					pageSize: 100,
					title: '分享缴费'
				},
        hideLoading: true
      }
      const res = await getCompanyAgentMaterialList(params)

      const data = res?.data?.records?.[0]
      if (!data) {
        this.shareConfig = {}
        return
      }

      this.shareConfig = data
    },

    changeMeter(){
      let self = this;
      self.meterRechargeChecked = !self.meterRechargeChecked;
      if(!self.meterRechargeChecked){
          self.meterRechargeAmount = 0;
      }else{
          self.meterList.forEach(item=>{
              if(item.lockState == 0){
                  self.meterRechargeAmount= Number(item.maxBuy);
              }
          })
      }
      self.setNum();
    },
  },
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 10px;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  .top{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 30rpx;
    height: 150rpx;
    background-color: #fff;
    position: relative;
    .owner-info{
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 26rpx;
      font-size: 30rpx;
      color: #666666;
    }
    .line{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  .middle{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 180rpx;
    background: #FFFFFF;
    margin-top: 30rpx;
    &-name{
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #666666;
      opacity: 1;
      margin-bottom: 5rpx;
    }
    &-value{
      font-size: 60rpx;
      font-family: DIN;
      font-weight: bold;
      color: #FE0000;
      opacity: 1;
    }
    &-unit{
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #FF0000;
      opacity: 1;
    }
  }
  .bill-container{
    .title{
      font-size: 28rpx;
      font-family: PingFang SC;
      color: #666666;
      opacity: 1;
      padding: 24rpx 0 24rpx 40rpx;
      background-color: #F9F9F9;
    }
    .item-title{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      padding-left: 30rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
      opacity: 1;
      .total-money{
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        opacity: 1;
      }
    }
    .item-content{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      padding: 0 78rpx 0 60rpx ;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
      opacity: 1;
      position: relative;
      &:before{
        position: absolute;
        left: 60rpx;
        right: 78rpx;
        bottom: 0;
        height: 1px;
        content: '';
        background-color: #EBEBEB;
      }
    }
  }
  .bottom{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 140rpx;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0 30rpx;
    background-color: #fff;
    .add-temportary{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text{
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        opacity: 1;
      }
    }
  }
  .popup-container{
    padding: 80rpx 85rpx 40rpx 85rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    .qrcode-container{
      width: 380rpx;
      height: 380rpx;
      position: relative;
      .qrcode{
        width: 100%;
        height: 100%;
      }
      .customer-name{
        font-size: 30rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        opacity: 1;
        padding: 10rpx 25rpx;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .pay-type{
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
      opacity: 1;
      margin: 27rpx;

    }
    .pay-status{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
}
::v-deep .u-sticky {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 0rpx !important;
}
::v-deep .u-search {
  padding: 14rpx 24rpx;
  border-bottom: 1px solid #EAEAEA;
  background-color: #fff;
  z-index: 10;
  position: relative;

  .u-search__content__input {
    height: 56rpx !important;
  }
}
::v-deep .workorder-sheet {
  margin: 24rpx 20rpx 0;
}
::v-deep .u-tabs__wrapper__nav__item{
  flex: 1;
  background-color: #fff;
}
.allGroup{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  box-sizing: border-box;
  padding: 0 30rpx;
  .allGroup-icon{
    // width: 130rpx;
    // height: 130rpx;
  }
}
.sureBtn{
  width: 100%;
  display: flex;
  justify-content: center;
  .sureBtn-box{
    cursor: pointer;
    width: 100%;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #027AFF;
    color: #fff;
    font-size: 30rpx;
  }
}
</style>
