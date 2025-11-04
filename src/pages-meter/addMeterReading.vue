<template>
  <view class="page" :style="[THEME_CSS_VAR]">
    <view style="background-color: #fff;">
      <view class="meter-info">
        <cell-text customClass="auto-width header-desc" label="仪表路址" border="bottom" isRight
          padding="15px 0" contentAlign="flex-end">
          <text class="font-color">{{meterInfo.address?meterInfo.address:'暂无路址信息'}}</text>
        </cell-text>
        <cell-text customClass="auto-width header-desc" label="抄表日期" border="bottom" isRight
          padding="15px 0" contentAlign="flex-end">
          <text class="font-color" @click="showTimePicker = true">{{ startTime }}</text>
          <u-icon name="arrow-right" size="16" color="#B2B2B2"></u-icon>
        </cell-text>
        <cell-text customClass="auto-width header-desc" label="是否清零" border="none" isRight
          padding="15px 0" contentAlign="flex-end">
          <u-switch v-model="zeroFlag"></u-switch>
        </cell-text>
      </view>
    </view>
    <view class="title-line">标准</view>
    <view style="background-color: #fff;">
      <view class="meter-info" v-for="(item, index) in meterReadingData" :key="index">
        <cell-text customClass="auto-width header-desc" label="上月度数" border="bottom" isRight
          padding="15px 0" contentAlign="flex-end">
          <text class="font-color">{{item.lastRead}}</text>
        </cell-text>  
        <cell-text customClass="auto-width header-desc" label="本次度数" border="bottom" isRight
          padding="15px 0" contentAlign="flex-end">
          <u--input
            placeholder="请填写本次度数"
            v-model="meterReadingData[index].thisRead"
            border="none"
            slot="right"
            type="digit"
            :customStyle="{ width: '114px',paddingRight: '11px'}"
            @input="changeReading(item.thisRead, index)"
            :formatter="formatter"
            inputAlign="right"
          ></u--input>
        </cell-text>  
        <cell-text customClass="auto-width header-desc" label="用量" border="none" isRight
          padding="15px 0" contentAlign="flex-end">
          <text class="font-color">{{item.dosage}}</text>
        </cell-text>  
      </view>
    </view>
    <view style="height: 250rpx;"></view>
    <view class="footer-btn">
      <u-button type="primary" :loading="loadingBtn" loadingText="提交中" :customStyle="{ width: '670rpx', height: '88rpx', padding: '0', background: '#1989F7', borderRadius: '8px' }" @click="submitBtn">提交</u-button>
      <u-safe-bottom />
    </view>
    <!-- 抄表日期 -->
    <u-datetime-picker :minDate="minDate" :show="showTimePicker" mode="date" @cancel="showTimePicker = false"
      @confirm="confirmTime">
    </u-datetime-picker>
    <u-toast ref="messageEl" />
  </view>
</template>

<script type="text/ecmascript-6">
import {
  getMeterInfoByNumber,   //查询仪表抄表数据
  getDeviceDetail,     //查询仪表详情
  saveMeterRead,      //提交
} from "@/service/energy";
import utils from '@/js/utils'
import CellText from '@/components/cell-text.vue'
export default {
  name: "",
  components: {
    CellText,
  },
  data() {
    return {
      // meterId: '202212061670294459843',
      meterId: '',
      customerId: '', //用户id
      projectId: '',
      zeroFlag: false,
      loadingBtn: false, //提交加载
      meterInfo: {
      },
      meterReadingData: [],
      showTimePicker: false,
      minDate: Number(new Date()),
      startTime: '',    //展示时间
      //二维码链接信息
      isCode: false,  //是否扫一扫进
      codeInfo: {
        mid: '',   //仪表id
        meterType: '',  //仪表类型
        deviceCode: '',  //表号
      },
      shareFlag: '',  //分摊标识，0-不分摊；1-分摊
      subsectionType: '',  //1,2-标准尖峰平谷；3-时段
    }
  },
  // components: {},
  onLoad(option) {
    const { scanInfo } = option
    this.meterId = option.meterId || ''
    this.customerId = option.customerId || ''
    this.startTime = utils.formatDate({ type: 's2d', format: 'YY-MM-DD', value: new Date() })
    if (scanInfo) {
      const parseData = JSON.parse(decodeURIComponent(scanInfo)) || {}
      console.log('parseData===',parseData)
      const d = parseData.p || {}
      this.meterId = d.m
      this.setMeterDetail(d)
      this.getMeterInfo()
    } else {
      this.getMeterInfo()
    }

  },
  methods: {
    //根据二维码链接信息设置仪表信息
    setMeterDetail(meterData){
      this.isCode = true;
      this.meterInfo.address = meterData.a;
      this.shareFlag = meterData.s;
      this.codeInfo.mid = meterData.m;
      this.codeInfo.meterType = meterData.mt;
      this.codeInfo.deviceCode = meterData.n;
      this.subsectionType = 1;
      let list = meterData.l;
      let subsectionList = meterData.sd;
      this.meterReadingData = [];
      if(list.length > 0){
        list.forEach(item=>{
          let obj = {};
          obj.subsectionId = item;
          obj.thisRead = "";
          obj.dosage = "";
          obj.totalAmount = "";
          obj.isHide = true;
          if(item == "0"){
              obj.subsectionName = "标准";
          }else if(item == "1"){
              obj.subsectionName = "尖";
          }else if(item == "2"){
              obj.subsectionName = "峰";
          }else if(item == "3"){
              obj.subsectionName = "平";
          }else if(item == "4"){
              obj.subsectionName = "谷";
          }
          this.meterReadingData.push(obj);
        })
      }else if(subsectionList.length > 0){
        subsectionList.forEach(item=>{
          let obj = {};
          obj.thisRead = "";
          obj.dosage = "";
          obj.totalAmount = "";
          obj.subsectionId = item.i;
          obj.subsectionName = item.n;
          this.meterReadingData.push(obj);
        })
      }
    },
    //查询仪表信息
    getMeterInfo(){
      let params = {
        data: {
          meterId: this.meterId,
        }
      }
      getDeviceDetail(params).then(res=>{
        if(res.status == 200){
          this.meterInfo = res.data
          this.shareFlag = res.data.shareType == "6" ?  "1" : "0";
          this.subsectionType = res.data.subsectionType
          this.projectId = res.data.projectId
          this.getMeterReadingInfo()
        }else{
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    //根据表号获取读数
    getMeterReadingInfo(){
      let params = {
        data: {
          projectId: this.projectId,
          number: this.meterInfo.deviceCode,
          readChildList: '',
        }
      };
      getMeterInfoByNumber(params).then(res=>{
        if(res.status == 200){
          this.meterReadingData = res.data.childList;
          this.meterReadingData.forEach(item=>{
            item.thisRead = '';
            item.dosage = '';
            item.totalAmount = '';
          })
        }else{
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    formatter(val) {
      const [int, flt] = String(val).split('.')
      const decimals = Number(`${int}${flt === undefined ? `` : `.${flt.substr(0, 2)}` }`)  
      return flt && flt.length >= 3 ? decimals : val 
    },
    //计算用量
    changeReading(val, index){
      // if(!this.isCode){
        this.$set(this.meterReadingData, index, this.meterReadingData[index]);
        let selectLastRead = this.meterReadingData[index].lastRead;   //上次度数
        let selectThisRead = this.meterReadingData[index].thisRead;   //本次读数
        this.setDosage(selectLastRead, selectThisRead, index);   //计算用量
      // }
    },
    //计算用量
    setDosage(selectLastRead, selectThisRead, index){
      let dosage = 0;
      if(this.meterInfo.rotateType == "1"){
        if (selectThisRead < selectLastRead) {// 本次读数小于上月读数 则过了量程
          // 重新计算 如 量程为100
          // 上次读数95 本次读数5
          // 则用量10
          dosage = this.accSub(this.meterInfo.range, selectLastRead)
          this.meterReadingData[index].dosage = this.accAdd(dosage, selectThisRead);
          this.$set(this.meterReadingData, index, this.meterReadingData[index]);
        } else {
          this.meterReadingData[index].dosage = this.accSub(selectThisRead, selectLastRead)
          this.$set(this.meterReadingData, index, this.meterReadingData[index]);
        }
      }else {// 反转
        if (selectThisRead>lastRead ) {// 本次读数大于上月读数 则过了量程
          // 重新计算 如 量程为 100
          // 上次读数 5 本次读数 95
          // 则用量10
          dosage = this.accSub(this.meterInfo.range, selectThisRead)
          this.meterReadingData[index].dosage = this.accAdd(dosage, selectLastRead);
          this.$set(this.meterReadingData, index, this.meterReadingData[index]);
        } else {
          this.meterReadingData[index].dosage = this.accSub(selectLastRead, selectThisRead)
          this.$set(this.meterReadingData, index, this.meterReadingData[index]);
        }
      }
    },
    //两数相减
    accSub(arg1,arg2) {
      var r1,r2,m,n;
      try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
      try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
      m=Math.pow(10,Math.max(r1,r2));
      //last modify by deeka
      //动态控制精度长度
      n=(r1>=r2)?r1:r2;
      return ((arg1*m-arg2*m)/m).toFixed(n);
    },
    //两个浮点数求和
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
    // 确认预约时间
    confirmTime(evt) {
      this.startTime = utils.formatDate({ type: 's2d', format: 'YY-MM-DD', value: evt.value })
      console.log('确定===',this.startTime)
      this.showTimePicker = false
    },
    submitBtn() {
      if(!this.startTime) {
        uni.showToast({
          title: '请选择抄表日期!',
          icon: 'none'
        })
        return;
      }

      this.meterReadingData.forEach(item=>{
        if(!item.thisRead){
          uni.showToast({
            title: '度数不能为空!',
            icon: 'none'
          })
          return;
        }
      })
      let readChildList = []
      this.meterReadingData.forEach(item=>{
        readChildList.push({
          subsectionId: item.subsectionId,
          thisRead: item.thisRead ? Number(item.thisRead) : "",
          dosage: item.dosage ? Number(item.dosage) : "",
          totalAmount: item.totalAmount ? Number(item.totalAmount) : "",
        })
      })
      let params = {
        data: {
          mid: this.meterId,
          zeroFlag: this.zeroFlag ? 1 : 0,
          readDate: this.startTime,
          submitTime: utils.formatDate({ value: new Date() }),
          readChildList: readChildList,
          channel: 2,   //渠道：1-web， 2-APP
          // userName: localStorage.nickname
          userName: '管理员'
        }
      }
      console.log('提交代码===',params)
      this.loadingBtn = true;
      saveMeterRead(params).then(res => {
        this.loadingBtn = false;
        if(res.status == 200) {
          this.$refs.messageEl.show({
            type: 'default',
            message: '抄表成功'
          })
          uni.navigateTo({
            url: `/pages-meter/successMeter?projectId=${this.projectId}&roomId=${this.meterInfo.roomId}&meterId=${this.meterInfo.deviceId}&customerId=${this.customerId}`
          })
          // uni.navigateBack()
        } else {
          uni.showToast({
            title: res.message || '抄表失败',
            duration: 2000,
            icon: 'none',
          })
        }
      }) 
    }
  },
  watch:{
    zeroFlag:{
      handler(){
        if(this.zeroFlag){
          this.meterReadingData.forEach(item=>{
            item.lastRead = 0;
            item.thisRead = "";
            item.dosage = "";
          })
        }else{
          this.getMeterReadingInfo();
        }
      },
      deep: true,
    },
  }
}
</script>

<style lang="scss" scoped>
.font-color {
  color: #333;
  font-size: 15px;
  font-family: PingFang SC;
}
::v-deep .header-title {
  .cell-text-label {
    font-size: 28rpx;
  }
 } 
.page {
  width: 100%;
  min-height: 100%;
  background-color: #f9f9f9;
  font-family: PingFang SC, "Helvetica Neue", Arial, sans-serif;
}
.meter-info{
  /* overflow-y: scroll; */
  padding: 0 15px;
}
.title-line {
  font-size: 30rpx;
  color: #999;
  padding: 10px 0 10px 15px;
}
.footer-btn {
  bottom: 40rpx;
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
