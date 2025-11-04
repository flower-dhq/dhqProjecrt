<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <label-cell label="资产" :placehoderVisible="false" >
      <picker mode="selector" :range='costRoomList' range-key="text"  @change="($event) => pickerEvent('confirm', 'costRoomList', $event)">
        <text v-if="form.roomsCode">{{ form.roomsCode }}</text>
        <text v-else  class="placeholer">请选择</text>
      </picker>
    </label-cell>
    <label-cell label="费用标准" :placehoderVisible="false">
      <picker mode="selector" :range='feeList' range-key="text"  @change="($event) => pickerEvent('confirm', 'feeList', $event)">
        <text v-if="form.fiName">{{ form.fiName }}</text>
        <text v-else  class="placeholer">请选择</text>
      </picker>
    </label-cell>
    <label-cell label="应收金额"   placehoder="请输入" :placehoderVisible="false"
                :arrow="false">
      <u--input type="digit" placeholder="请输入" border="none" v-model="form.receivableAmount"></u--input>
    </label-cell>
    <label-cell label="开始时间" :placehoderVisible="false" >

      <picker mode="date" :value="form.startTime"  @change="($event) => confirmTime($event, 'startTime')">
        <text v-if="form.startTime">{{ form.startTime }}</text>
        <text v-else class="placeholer">请选择</text>
      </picker>
    </label-cell>
    <label-cell label="结束时间"  :placehoderVisible="false" >
      <picker mode="date" :value="form.endTime"  @change="($event) => confirmTime($event, 'endTime')">
        <text v-if="form.endTime">{{ form.endTime }}</text>
        <text v-else  class="placeholer">请选择</text>
      </picker>
    </label-cell>
    <label-cell label="备注" :required="false"  placehoder="请输入" :placehoderVisible="false"
                :arrow="false">
      <u--textarea v-model="form.remark" border="none" placeholder="请输入" autoHeight></u--textarea>
    </label-cell>


    <view class="action-container">
      <u-button type="primary" text="提交" @click="submit"></u-button>
    </view>
  </view>
</template>

<script>
import {getRelatedFeeItemList3,getPropertyByCustomerId, addBillDetailRecordAndReceivableRecordOnline} from "@/service/leasing";
import labelCell from './components/label-cell.vue';
import Utils from '@/js/utils'

export default {
  components: {
    labelCell
  },
  data() {
    return {
      form: {
        fiName: "",            //费用标准名称
        fiId: "",              //费用标准id
        receivableAmount: "",  //金额
        startTime: "",         //开始日期
        endTime: "",           //结束日期
        remark: "",
        roomId: "",
        roomsCode: "",
      },
      receivableType: "",  //应收类别 0:保证金应收;2:押金类应收3:临时性类应收
      keyword: '',
      buildingList: [],
      cellList: [],
      roomList: [],
      parkingList: [],
      bills: {},
      customerList: [],
      picker: {
        show: false,
        type: '',
        list: [],
        keyName: '',
        defaultIndex:  [],
      },
      customerInfo: null,
      feeList: [], //费用数据
      costRoomList: [],
      showTime: false,
      timeValue: Number(new Date()),
      key: '',
      warningMsg: "",  //提示信息
      showRoom: false,
      showFee: false,
      userInfo: {},
    }
  },
  onLoad(options) {
    var O_USER_INFO = this.$constant.O_USER_INFO;
    this.userInfo = this.$utils.storageAction({
      key: O_USER_INFO,
      action: 'get'
    });
    this.customerInfo = JSON.parse(decodeURIComponent(options.customerInfo));
    this.getProperty();  //获取资产
    this.getTemporaryFeeList();
  },
  computed: {
  },
  methods: {
    //根据客户、资产查询资源
    getProperty(){
      let self = this;
      self.costRoomList = [];
      var params = {
        data:  {
          projectId: this.customerInfo.projectId,  //项目id
          customerId: this.customerInfo.customerId,  //客户id
        },
        hideLoading: true,
        responseToast: false,
      }
      getPropertyByCustomerId(params).then(res=>{
        if(res.status == 200){
          let roomIdArr = [];
          res.data.forEach((ele) => {
            if (ele.nodeCategory == 2) {
              let obj = {
                text: ele.roomInfo,
                roomId: ele.customerPropertyId,
              }
              self.costRoomList.push(obj)
            }
          })
          self.form.roomId = self.costRoomList[0].roomId;
          self.form.roomsCode = self.costRoomList[0].text;
        }else{
          self.form.roomId = "";
          self.form.roomsCode = "";
        }
      })
    },
    getTemporaryFeeList(){
      let self = this;
      var params = {
        data:  {
          projectId: this.customerInfo.projectId,
          billSettingAuthFlag:'1'
        },
        hideLoading: true,
        responseToast: false,
      }
      getRelatedFeeItemList3(params).then(res=>{
        if(res.status == 200){
          if(res.data.length > 0){
            res.data.forEach(item=>{
              let obj = {
                text: item.fiName,
                fiId: item.fiId,
                taxFlag: item.taxFlag,
                taxRate: item.taxRate,
                fiType: item.fiType,
              }
              self.feeList.push(obj);
            })
          }else{
            self.feeList = [[]]
          }
        }else{
          self.feeList = [[]]
        }
      })
    },

    pickerEvent(action, key, data) {
      if (action === 'confirm') {
        console.log(data);
        const index = data.detail.value;

        if (key === 'costRoomList') {
          let item = this.costRoomList[index];
          this.form.roomId = item.roomId;
          this.form.roomsCode = item.text;
          this.showRoom = false;
        }else if(key == 'feeList'){
          let item = this.feeList[index];
          this.form.fiId = item.fiId;
          this.form.fiName = item.text;
          this.form.taxRate = item.taxRate;
          this.receivableType = item.fiType == "3" ? 0 : 3;
          console.log("receivableType："+this.receivableType)
          this.showFee = false;
        }
      }
    },
    // 选择时间
    showTimePlugin(params) {
      const {key} = params;
      // this.timeValue =  Number(new Date());
      this.showTime = true;
      this.key = key;
    },
    confirmTime(res, key){
      this.key = key;
      this.form[this.key] = res.detail.value;
      console.log('this.form[this.key]', this.form[this.key]);
      const st = this.form.startTime;
      const et = this.form.endTime;
      if (st && et && Utils.dateIsBefore(et, st)) {
        this.toastWord({text: '结束时间不能小于开始时间'})
      }
      this.showTime = false;
    },
    cancelTime(){
      if (this.key === 'startTime') this.form[this.key] = '';
      if (this.key === 'endTime') this.form[this.key] = '';
      this.showTime = false;
    },
    closeTime(){
      this.showTime = false;
    },
    submit(){
      let self = this;
      if(!self.checkData()){
        self.toastWord({text: self.warningMsg})
        return false;
      }
      
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      let obj = {
        fiId: self.form.fiId,   //费用标准id
        taxFlag: self.form.taxFlag,  //是否含税
        taxRate: self.form.taxRate,  //税率
        receivableType: this.receivableType,   // ---- receivableType应收类别 0:保证金应收;2:押金类应收3:临时性类应收
        receivableAmount: self.form.receivableAmount,  //应收金额
        startTime: uni.$u.timeFormat(self.form.startTime, 'yyyy-mm-dd'),  //开始时间
        endTime: uni.$u.timeFormat(self.form.endTime, 'yyyy-mm-dd'),      //结束时间
        chargePeriod:  uni.$u.timeFormat(self.form.startTime, 'yyyy-mm'),  //计费账期=开始时间所在月
        receivablePeriod: uni.$u.timeFormat(self.form.startTime, 'yyyy-mm'), //应收账期=开始时间所在月
        receiveDeadLine: uni.$u.timeFormat(self.form.endTime, 'yyyy-mm-dd'), //应收截止时间=结束时间
        remark: self.form.remark,  //备注
        customerId: self.customerInfo.customerId,  //客户id
        customerName: self.customerInfo.customerName,  //客户名称
        projectId: self.customerInfo.projectId,  //项目id
        projectName: self.customerInfo.projectName,  //项目名称
        companyId: companyId,  //公司id
        creator: this.userInfo.userId,  //操作人
        roomId: self.form.roomId,
        roomsCode: self.form.roomsCode,
      }
      let arr = [];
      arr.push(obj);
      let data = {
        jsonObject: JSON.stringify(arr),
      }
      var params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      addBillDetailRecordAndReceivableRecordOnline(params).then(res=>{
        self.loadingBtn = false;
        if(res.status == 200){
          self.toastWord({text: "操作成功"})
          uni.$emit('addFee', { })
          uni.navigateBack();
        }else{
          if(res.message == '请求成功'){
            res.message = '新增临时费用失败'
          }
          self.toastWord({text: res.message})
        }
      })
    },
    //校验
    checkData(){
      let self = this;
      let result = true;
      if(!self.customerInfo.customerId){
        self.warningMsg = "暂无用户信息";
        result = false;
        return false;
      }
      if(!self.form.fiId){
        self.warningMsg = "请选择费用标准";
        result = false;
        return false;
      }
      if(!self.form.receivableAmount){
        self.warningMsg = "请填写金额";
        result = false;
        return false;
      }
      if(!self.form.receivableAmount){
        self.warningMsg = "请填写金额";
        result = false;
        return false;
      }

      //大于0的两位小数
      if (self.form.receivableAmount == 0
          || !/^([0-9]*)+(\.[0-9]{1,2})?$/.test(self.form.receivableAmount)) {
        self.warningMsg = "金额不合法，请重新输入";
        result = false;
        return false;
      }
      if(Utils.dateIsAfter(self.form.startTime, self.form.endTime)){
        self.warningMsg = "开始日期不能大于结束日期";
        result = false;
        return false;
      }
      return result;
    },
    // 提示文字
    toastWord(params) {
      const {text} = params;
      if (!text) return;
      uni.showToast({ title: text, icon: 'none' });
    },
    bindDateChange: function(e) {
      this.form.startTime = e.detail.value
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 10px;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  .placeholer{
    color: rgb(192, 196, 204);
  }
  .select-compound{
    height: 88rpx;
    padding-left: 30rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
  }
  .action-container{
    display: flex;
    padding: 0 40rpx 80rpx 40rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
::v-deep .uni-picker-container .uni-picker-action.uni-picker-action-confirm{
  color:  red;
}
::v-deep .u-sticky {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 16rpx !important;
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
</style>
