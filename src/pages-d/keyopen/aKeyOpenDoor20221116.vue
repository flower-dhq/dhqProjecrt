<template>
  <view id="open-door-page">
    <view class="open-door-background">
      <view style="line-height: 24px; padding-top: 60px; font-size: 18px; color: #FFFFFF; text-align: center;">
        <image src="/static/aKeyOpenDoor/open_door_bluetooth.png" style="width: 20px; height: 20px;"/>
        请连接蓝牙一键开门哦～
      </view>

      <!-- <view class="open-door-button" @click="clickToOpenDoorBluetooth()"> -->
      <view class="open-door-button" @click="openDoorFailed=true">
        <view class="open-door-out-border"></view>
        <view class="open-door-inner-border"></view>
        <view class="open-door-click">
          <view class="open-door-click-words-box">
            <view class="open-door-click-words">点击</view><view class="open-door-click-words">开门</view>
          </view>
        </view>
      </view>

    </view>

    <!--底部菜单-->
    <!-- <nav-tab-bar page="currEnableOpenDoor"></nav-tab-bar>
    <loading v-model="loading" text="加载中"></loading> -->

    <!-- 替换完 -->
    <!-- <div v-transfer-dom>
      <x-dialog v-model="openBluetooth"  :hide-on-blur="true" class="open-door-bluetooth-show">
        <div style="font-size: 18px; color: #2C3444; padding: 20px; font-weight: bold;">温馨提示</div>
        <div style="font-size: 14px; color: #566075; text-align: center; padding-bottom: 10px;">
          尊敬的业主,<br/>
          您的蓝牙开关好像没打开哦~<br/>
          <span v-if="isiOS" style="font-size: 15px;color: #2C3444;font-weight: bold">请在"设置"-"蓝牙"中打开</span>
        </div>
        <div class="confirm-btn-container">
          <x-button v-if="isiOS"  @click.native="openBluetooth=!openBluetooth" plain type="primary" class="open-door-set">确定</x-button>
          <x-button v-else @click.native="toSetBluetooth()" plain type="primary" class="open-door-set">去设置</x-button>
        </div>
      </x-dialog>
    </div> -->
    <u-modal :show="openBluetooth" title="温馨提示" width="300" class="nokey-modal" @confirm="toSetBluetooth" :confirmText="isiOS?'确定':'去设置'">
			<view class="slot-content">
				<view class="tips">
          尊敬的业主,<br/>
          您的蓝牙开关好像没打开哦~<br/>
          <text class="isIos" v-if="isiOS">请在"设置"-"蓝牙"中打开</text>
        </view>
			</view>
		</u-modal>

    <!-- <div v-transfer-dom>
      <x-dialog v-model="showMessageAlert" :hide-on-blur="true" class="open-door-bluetooth-show">
        <div style="font-size: 18px; color: #2C3444; padding: 20px; font-weight: bold;">温馨提示</div>
        <div style="font-size: 14px; color: #566075; text-align: center; padding-bottom: 10px;">
          {{showMessageText}}
        </div>
        <div class="confirm-btn-container">
          <x-button @click.native="goToPage()" plain type="primary" class="open-door-set">确定</x-button>
        </div>
      </x-dialog>
    </div> -->
  
    <u-modal :show="showMessageAlert" title="温馨提示" width="300" class="nokey-modal" @confirm="goToPage" confirmText="确定">
			<view class="slot-content">
				<view class="tips">
          {{showMessageText}}
        </view>
			</view>
		</u-modal>

    <!-- <div v-transfer-dom>
      <x-dialog v-model="openDoorFailed" class="open-door-bluetooth-show" hide-on-blur>
        <div style="font-size: 18px; color: #2C3444; text-align: center; padding: 30px 0;">门禁在开小差~~</div>
        <div class="confirm-btn-container">
          <x-button @click.native="handleOpendoorData()" plain type="primary" class="open-door-set">再试一次</x-button>
        </div>
      </x-dialog>
    </div> -->

    <u-modal :show="openDoorFailed" width="250" class="nokey-modal" @confirm="handleOpendoorData" confirmText="再试一次">
			<view class="slot-content">
				<view class="tips">
          门禁在开小差~~
        </view>
			</view>
		</u-modal>

    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
  import util from '../../js/utils';

  // import NavTabBar from './../components/home/NavTabBar';
  // import {getDoorId,             //获取一键开门账号
  //   getDeviceList,         //获取门禁设备列表
  //   insertAccessDeviceLog, //开门记录
  //   GetMemberInfoByMemberId, selectSupremePosition} from "@/service/getDataNew.js";
  // import { setTitleNameAndBackgroundColor, hideOptionMenu, setBackButtonState, showOrHideCloseButton, getMessagesAndNoticeAndAtivityCount,
  //   eventListenerRoute, showRightUnreceivedButton, backButtonListener, networkConnectionStartType, errorReportAlert, test11}from '@/js/mpaasTitleStyle.js';
  import {test11}from '@/js/mpaasTitleStyle.js';
  export default {
    name: 'aKeyOpenDoor',
    components: {
      // NavTabBar
    },
    data() {
      return {
        isNoKeyFlag: false,

        memberId: '',
        companyId: '',
        projectId: '',
        currentUserPhone: '',

        localstorage: {             //项目stoage太麻烦   改写本地
          token: '',
          userType: '',
          tokenPase: 0,
          networkConnectionType: 0,  //网络状态是否未连接
          isAssociation: '',   
          bluetoothEnterFirstTime: 1, //设置是否第一次进入蓝牙界面
          openDoorDevices: {},
        },


        openDoorSuccess: "1",                                                    //是否开门成功
        doorId: "",                                                              //开门账号
        deviceType: 2,
        openDoorList: [],                                                        //网络开门门禁列表
        openDoorNpdList: [],                                                     //蓝牙开门门禁列表
        openDoorRecord: [],
        openTime: "",                                                            //开门时间
        openDate: "",
        // projectId: localStorage.getItem("projectId"),
        projectName: "",
        // currentUserPhone: localStorage.getItem("phoneNumber"),
        loading: false,
        openBluetooth: false,
        openDoorFailed: false,
        failedTimes: 0,
        // isMpaas: process.env.moduleConfig.isMpaas,//是否使用Mpaas接口
        bluetoothOpen: false,
        showMessageText:'',
        showMessageAlert:false,
        goPageType:1,
        isiOS:false
      }
    },
    onLoad() {
      // uni.showTabBar()
      const { MEMBER_ID, COMPLANY_ID, PROJECT_ID, O_USER_INFO,TOKEN,USER_TYPE } = this.$constant
      this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' })
      this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
      this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' })
      this.localstorage.token = util.storageAction({ key: TOKEN, action: 'get' })
      this.localstorage.userType = util.storageAction({ key: USER_TYPE, action: 'get' })
      let data = util.storageAction({ key: O_USER_INFO, action: 'get' })
      console.log('isAuthUserLocal==',data)
      let { phoneNumber,isAssociation } = data
      this.currentUserPhone = phoneNumber
      this.localstorage.isAssociation = isAssociation
      util.storageAction({ key: 'aaaaaa', action: 'set', value: '22222222' })
      test11()
    },
    created() {
      // uni.showTabBar()
      var u = navigator.userAgent;
      this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // localStorage.setItem("tokenPase", 0);
      // localStorage.setItem('networkConnectionType', 0);//网络状态是否未连接
      this.networkConnectionStartType()
      this.failedTimes = 0;
      let isAuthUserLocal = this.localstorage.isAssociation
      let isFirstEnter =  this.localstorage.bluetoothEnterFirstTime  //设置是否第一次进入蓝牙界面
      if (isFirstEnter == 1){
        if (isAuthUserLocal == 1){
          window.AlipayJSBridge && AlipayJSBridge.call('getAppVersion', function(data){
            if(data.resultCode == 1){
              if(data.version > '1.6.2'){
                this.getDoorDeviceList(1);//获取蓝牙开门门禁列表
              }else{
                this.showMessageText = '请升级APP，以便使用蓝牙开门功能';
                this.showMessageAlert = true;
                this.goPageType = 2;
                errorReportAlert("一键开门", "提示类弹窗", "7001", "提示：请升级APP，以便使用蓝牙开门功能");
              }
            }else{
              this.showMessageText = '请升级APP，以便使用蓝牙开门功能';
              this.showMessageAlert = true;
              this.goPageType = 2;
              errorReportAlert("一键开门", "提示类弹窗", "7001", "获取版本号失败");
            }
          });
        } else {
          this.loading = false;
          this.userTypesInformation((userTypes)=>{
            this.myInformation((isAuthUser)=>{
              if (isAuthUser == 1) {
                window.AlipayJSBridge && AlipayJSBridge.call('getAppVersion', function (data) {
                  if (data.resultCode == 1) {
                    if (data.version > '1.6.2') {
                      this.getDoorDeviceList(1);//获取蓝牙开门门禁列表
                    } else {
                      this.showMessageText = '请升级APP，以便使用蓝牙开门功能';
                      this.showMessageAlert = true;
                      this.goPageType = 2;
                      errorReportAlert("一键开门", "提示类弹窗", "7001", "提示：请升级APP，以便使用蓝牙开门功能");

                    }
                  } else {
                    this.showMessageText = '请升级APP，以便使用蓝牙开门功能';
                    this.showMessageAlert = true;
                    this.goPageType = 2;
                    errorReportAlert("一键开门", "提示类弹窗", "7001", "获取版本号失败");
                  }
                });
              }else {
                this.showNoAuthAlert();
              }
            });
          })
        }
      }
      this.getMessagesAndNoticeAndAtivityCount()                                    //统计消息
      // eventListenerRoute(true, this.rightButtonRouter)                       //右上角按钮跳转地址
      // setTitleNameAndBackgroundColor("一键开门", "E7BA35")
      // setBackButtonState(true)
      // showOrHideCloseButton(false)
      // backButtonListener(true,this.exitOrBackApp)
    },
    beforeDestroy() {
      // let self = this;
      // showRightUnreceivedButton(false);
      // eventListenerRoute(false, this.rightButtonRouter);
      // backButtonListener(false,this.exitOrBackApp)
    },
    methods: {
      goToPage(){
        this.showMessageAlert = false;
        this.failedTimes = 0;
        if (this.goPageType == 1) {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }else if (this.goPageType == 2){
          hideOptionMenu()
          setBackButtonState(false);
          localStorage.setItem('bluetoothEnterFirstTime', 0);//设置是否第一次进入蓝牙界面
          window.open('http://w.yikb.cn/ios/qiaoxinowner/download.html') ;
        }else if (this.goPageType == 3){

        }
      },

      toSetBluetooth(){
        this.openBluetooth = false
        if (isiOS) return;
        window.AlipayJSBridge && AlipayJSBridge.call('setBluetooth', {}, function(data){

        })
      },
      getBluetoothStatus(){
          let self = this
        window.AlipayJSBridge && AlipayJSBridge.call('getBluetoothStatus', {}, function(data){
          if(data.resultCode === "0"){
            this.openBluetooth = false;
            this.bluetoothOpen = true;
          }else{
            if (!this.isiOS) {
              this.openBluetooth = true;
              this.bluetoothOpen = false;
              errorReportAlert("一键开门", "提示类弹窗", "7001", "提示：蓝牙未打开");
            }
          }
        });
      },
      openDoorId() {                                                            //获取开门账号//获取开门账号       本地
        let self = this;
        getDoorId({}, "一键开门", "获取开门账号失败").then(res =>{
          if(res.status === "200"){
            this.doorId = res.data.doorId;
            this.openDate = res.data.date;
          }else{
          }
          if(this.doorId === "" || this.doorId == undefined || this.doorId == null){
            // this.showTips("获取开门账号失败");
          }
        });
      },

      getDoorDeviceList(value) {                                                    //获取门禁列表
        //获取门禁列表         本地
        let params = {
          projectId: this.projectId,
          memberId: this.memberId,
          deviceType: value,                                      //1蓝牙，2网络，3二维码
        };

        this.loading = true;
        setTimeout(function(){
         if (this.loading){
           this.loading = false;
           this.getDataFromeLocalStorage();//本地缓存获取数据
         }
        },1500)
        // let netWorkType = localStorage.getItem("networkConnectionType")
        let netWorkType = this.localstorage.networkConnectionType
        if (netWorkType == 1) {//没有网络
          this.loading = false
          this.getDataFromeLocalStorage();//本地缓存获取数据
        }else{
          getDeviceList(params,'一键开门','获取门禁列表失败').then(res =>{
          this.loading = false;
          if (res.status === "200") {
            if (res.data.devices.length > 0) {
              localStorage.setItem('openDoorDevices', JSON.stringify(res.data));
              if (value == 1) {
                this.getBluetoothStatus(); //获取蓝牙状态
              }
              this.projectName = res.data.devices[0].projectName;
              let devicesArray = [];
              res.data.devices.forEach(item1 => {
                let obj = {};
                obj.devices = [];
                item1.devices.forEach(item2 => {
                  if (devicesArray.indexOf(item2.deviceName) == -1) {
                    obj.devices.push(item2);
                    devicesArray.push(item2.deviceName);
                  }
                });
                if (obj.devices.length > 0) {
                  obj.devices.projectId = item1.projectId;
                  obj.devices.projectName = item1.projectName;
                  this.openDoorNpdList = item1.devices;
                }
              });
            } else {
              this.showMessageText = "您的房产区域暂未开放，敬请期待";
              this.showMessageAlert = true;
              this.goPageType = 1;
              errorReportAlert("一键开门", "提示类弹窗", "7001", "提示：您的房产区域暂未开放，敬请期待");
            }
          } else {
            this.getDataFromeLocalStorage();//本地缓存获取数据
          }
        });
        }
      },
      showNoAuthAlert () {
       this.$confirmPage.show({'path':'#/indexNew'});
      },
      getDataFromeLocalStorage(){
        let self = this
        let storageData = JSON.parse(localStorage.getItem('openDoorDevices'));
        if (!!storageData&&storageData.devices.length > 0) {
            this.getBluetoothStatus(); //获取蓝牙状态
          this.projectName = storageData.devices[0].projectName;
          let devicesArray = [];
          storageData.devices.forEach(item1 => {
            let obj = {};
            obj.devices = [];
            item1.devices.forEach(item2 => {
              if (devicesArray.indexOf(item2.deviceName) == -1) {
                obj.devices.push(item2);
                devicesArray.push(item2.deviceName);
              }
            });
            if (obj.devices.length > 0) {
              obj.devices.projectId = item1.projectId;
              obj.devices.projectName = item1.projectName;
              this.openDoorNpdList = item1.devices;
            }
          });
        }else {
          this.showMessageText = "您的房产区域暂未开放，敬请期待";
          this.showMessageAlert = true;
          this.goPageType = 1;
          errorReportAlert("一键开门", "提示类弹窗", "7001", "提示：您的房产区域暂未开放，敬请期待");
        }
      },

      openDoorClick(){
      },

      clickToOpenDoorBluetooth() {                    //点击开门
        let self = this;
        this.openDoorClick();
        let isAuthUserLocal = localStorage.getItem('isAuthUser');
          if (isAuthUserLocal == 1) {
           this.handleOpendoorData()
          } else {
            this.userTypesInformation((userTypes)=>{
              this.myInformation((isAuthUser)=>{
                if (isAuthUser == 1) {
                  this.handleOpendoorData()
                }else {
                  this.showNoAuthAlert();
                }
              });
            })
          }
      },
      handleOpendoorData(){
        this.openDoorFailed = false;
        this.openDoorSuccess == "0"
        let time = this.getOpenTime();
        window.AlipayJSBridge && AlipayJSBridge.call('getAppVersion', function (data) {
          if (data.resultCode == 1) {
            if (data.version > '1.6.2') {
              if (this.openDoorNpdList.length === 0) {
                this.showMessageText = "您的房产区域暂未开放，敬请期待";
                this.showMessageAlert = true;
                this.goPageType = 1;
                errorReportAlert("一键开门", "提示类弹窗", "7001", "提示：您的房产区域暂未开放，敬请期待");
                return;
              }
              if (!this.bluetoothOpen&&!this.isiOS) {
                this.getBluetoothStatus();
                return
              }
              window.AlipayJSBridge && AlipayJSBridge.call('openDoor', {'openType':'npd', 'keys': this.openDoorNpdList}, function(data){
                if(data.resultCode == "0"){//正在开门
                  this.showMessageText = "正在开门，请稍后！";
                  this.showMessageAlert = true;
                  this.goPageType = 3;
                }else if(data.resultCode == "1100"){//取消开门
                  this.loading = false;
                }else {
                  this.loading = false;
                  if(data.resultCode === "1"){//开门成功
                    // alert(JSON.stringify(data.data))
                    if (data.data instanceof Array) {
                      this.openDoorRecord = data.data[0];
                    }else {
                      this.openDoorRecord = data.data;
                    }
                    this.openDoorSuccess = "1";
                    let messageMsg = (this.openDoorRecord.address?this.openDoorRecord.address:JSON.stringify(data))+'、'+(this.openDoorRecord.deviceName?this.openDoorRecord.deviceName:'未知名称')
                    let mac_addr = this.openDoorRecord.mac?this.openDoorRecord.mac:'未知mac'
                    this.openSuccess(messageMsg,mac_addr)
                    this.openDoorRecordFunction(time,'1',data.msg,1);
                  }else{
                    this.openDoorSuccess = "0";
                    if (data.resultCode === "-2") {
                      this.openDoorSuccess = "2";//蓝牙未打开
                      errorReportAlert("一键开门", "提示类弹窗",  this.openDoorSuccess, "提示：蓝牙未打开");
                      // return;
                    }else if (data.resultCode === "1008"||data.resultCode === "1007"||data.resultCode === "1004"||data.resultCode === "1005"||data.resultCode === "-3") {
                      this.openDoorSuccess = "3";//未发现蓝牙设备
                      errorReportAlert("一键开门", "门禁开小差", data.resultCode, "提示：未发现蓝牙设备");
                      // return;
                    }else if (data.resultCode === "-4") {
                      //门禁未授权，账号无此门信息
                      this.openDoorSuccess = "4";
                      let scanDevice = "开门失败，门禁未授权 "+ (data.data.scanDevices?data.data.scanDevices:'')
                      errorReportAlert("一键开门", "门禁开小差", this.openDoorSuccess, scanDevice);
                    }else if (data.resultCode === "-6") {
                      //未打开GPS位置服务
                      this.openDoorSuccess = "6";
                      errorReportAlert("一键开门", "提示类弹窗", this.openDoorSuccess, "提示：请打开GPS定位服务");
                    }else {
                      errorReportAlert("一键开门", "开门失败", data.resultCode, "开门失败，门禁开小差");
                    }
                    this.failedTimes = this.failedTimes + 1;
                    if(data.data.address != undefined && data.data.deviceId != undefined){
                      if (data.data instanceof Array) {
                        this.openDoorRecord = data.data[0];
                      }else {
                        this.openDoorRecord = data.data;
                      }
                      this.openDoorRecordFunction(time,'0',data.msg,1);
                      let errorMsg = ((data.resultCode?data.resultCode:'7005')+'、'+this.openDoorRecord.address?this.openDoorRecord.address:'未知房产')+'、'
                        +(this.openDoorRecord.deviceName?this.openDoorRecord.deviceName:'未知名称')+(this.openDoorRecord.mac?this.openDoorRecord.mac:'未知mac')+'、'+
                        (data.msg?data.msg:'')
                      errorReportAlert("一键开门", "开门失败", '7003', errorMsg);
                    }
                  }
                  this.showMessageAlert = false
                  if(this.openDoorSuccess == "2"){
                    if (this.failedTimes < 3){
                      // this.openDoorFailed = true;
                      this.openBluetooth = true;
                      this.bluetoothOpen = false;
                    } else {
                      this.failedTimes = 0
                      this.openBluetooth = true;
                      this.bluetoothOpen = false;
                      // this.getBluetoothStatus()
                    }
                  }else if(this.openDoorSuccess == "3"){
                    if (this.failedTimes < 3){
                      this.showMessageText = "未发现蓝牙设备";
                      this.showMessageAlert = true;
                      this.goPageType = 3;
                    } else {
                      this.showMessageText = "未发现蓝牙设备";
                      this.showMessageAlert = true;
                      this.goPageType = 3;
                    }
                  }else if(this.openDoorSuccess == "4"){
                    if (this.failedTimes < 3){
                      this.openDoorFailed = true;
                    } else {
                      this.$router.push("/aKeyOpenDoorSuccess?openDoorSuccess=" + this.openDoorSuccess);
                    }
                  }else if(this.openDoorSuccess == "6"){
                    this.showMessageText = "请打开GPS定位服务";
                    this.showMessageAlert = true;
                    this.goPageType = 3;
                  }else if(this.openDoorSuccess == "1"  || (this.openDoorSuccess == "0" && this.failedTimes === 3)){
                    this.$router.push("/aKeyOpenDoorSuccess?openDoorSuccess=" + this.openDoorSuccess);
                  }else if(this.openDoorSuccess == "0" && this.failedTimes < 3){
                    this.openDoorFailed = true;
                  }
                }
              });
            } else {
              this.showMessageText = '请升级APP，以便使用蓝牙开门功能';
              this.showMessageAlert = true;
              this.goPageType = 2;
              errorReportAlert("一键开门", "提示类弹窗",'7001', "提示：请升级APP，以便使用蓝牙开门功能");
            }
          } else {
            this.showMessageText = '请升级APP，以便使用蓝牙开门功能';
            this.showMessageAlert = true;
            this.goPageType = 2;
            errorReportAlert("一键开门", "提示类弹窗",'7001', "提示：获取版本号失败");
          }
        });
      },
      /**
       * myInformation（）：获取个人信息头像
       * **/
      myInformation(callback){
        let self=this;
          let params = {
            "id":localStorage.getItem('memberId')
          };
          GetMemberInfoByMemberId([localStorage.getItem('memberId')],params,'一键开门','获取会员信息失败').then(res => {
            if (res.status === '200') {
              let isAuthUser = res.data.isAssociation == 1?1:0;
              localStorage.setItem("isAuthUser",isAuthUser);
              callback&&callback(isAuthUser)
            }else {
              callback&&callback(0)
            }
          }).catch(e => {
            callback&&callback(0)
          });
      },
      /**
       * 获取用户类型状态
       * */
      userTypesInformation(callback){
        let self = this;
          let onMemberId={
            "memberId": localStorage.getItem('memberId'),
            "projectId":localStorage.getItem('projectId')
          };
          selectSupremePosition(onMemberId, "一键开门", "获取用户类型状态失败").then(res=>{
            if(res.status=='200'){
              let userTypes = "";
              switch (res.data.supremePosition){
                case 2:
                  userTypes="业主";
                  break;
                case 1:
                  userTypes="租客";
                  break;
                case 3:
                  userTypes="家属";
                  break;
                case 5:
                  userTypes="家政";
                  break;
                default:
                  userTypes="游客";
                  break;
              }
              callback && callback(userTypes);
            }
          })
      },
      /**
       * 开门结果
       * **/
      openSuccess(address,openSuccess) {
      },
      openDoorRecordFunction(time,index,msg,deviceType) {                                                    //开门记录
        //开门记录       本地
        let self = this;
        let params = {
          "address": this.openDoorRecord.address,
          "createDate": time,
          "projectId": this.projectId,
          "projectName": this.projectName,
          "type": 1,                                                    // "1：业主 2：访客",
          "userName": localStorage.getItem("fullName"),
          "deviceType": deviceType,                                //1蓝牙，2网络，3二维码
          "telephone": localStorage.getItem("phoneNumber"),
          "nickName": localStorage.getItem("nickname"),
          "whetherSuccess": index,                                      //"是否成功:1-成功 0-失败"
          "openTime": time,
          "deviceId": this.openDoorRecord.deviceId,
        };
        let tempParams = params;
        tempParams.doorId = this.doorId;
        tempParams.date = this.openDate;
        tempParams.msg = msg;
        let logDesc = JSON.stringify(tempParams);
        let recordParams = {
            "deviceType": deviceType,                          //1蓝牙，2网络，3二维码
            "address": this.openDoorRecord.address,
            "nickName": localStorage.getItem("nickname"),
            "telephone": localStorage.getItem("phoneNumber"),
            "whetherSuccess": index,                                //"是否成功:1-成功 0-失败"
            "projectName": this.projectName,
            "type": 1,                                              // "1：业主 2：访客",
            "userName": localStorage.getItem("fullName"),
            "openTime": time,
            "projectId": this.projectId,
            "deviceId": this.openDoorRecord.deviceId,
            "createDate": time,
            "logDesc": logDesc
          }
        insertAccessDeviceLog(recordParams,'一键开门','上传门禁开门记录失败').then(res =>{
        });
      },

      getOpenTime(){                                                      //获取时间格式
        let time,year,month,date,hours,minutes,seconds;
        time = new Date();
        year = time.getFullYear();//年
        month = (time.getMonth() + 1) < 10 ? ("0" + (time.getMonth() + 1)) : (time.getMonth() + 1);//月
        date = time.getDate() < 10 ? ("0" + time.getDate()) : time.getDate();//日
        hours = time.getHours() < 10 ? ("0" + time.getHours()) : time.getHours();//时
        minutes = (time.getMinutes() < 10 ? ("0" + time.getMinutes()) : time.getMinutes());//分
        seconds = (time.getSeconds() < 10 ? ("0" + time.getSeconds()) : time.getSeconds()); //秒
        time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        return time;
      },

      bluetoothDoor(){
        this.$vux.alert.show({
          title: '提示',
          content: '此功能暂未开放，敬请期待~',
          buttonText: '确定'
        })
      },

      showTips (tip) {
        this.$vux.toast.show({
          type: 'text',
          text: tip,
          position: 'bottom'
        })
      },

      exitOrBackApp(e){
        let self = this;
        let path=this.$route.path;
        e.preventDefault();
        setTimeout(function() {
          if(path == '/aKeyOpenDoor'){
            window.location.href = '#/index';
          } else {
            window.history.back();
          }
        }, 10);
      },

      rightButtonRouter(e) {                                    //消息跳转路由
        let self = this;
        this.$router.push('/myMessagesIndexList');
      },
      // 
      ready (callback) {
        // 如果 jsbridge 已经注入则直接调用
        if (window.AlipayJSBridge) {
          callback && callback();
        } else {
          // 如果没有注入则监听注入的事件
          document.addEventListener('AlipayJSBridgeReady', callback, false);
        }
      },
      //判断网络状态是否连接
      networkConnectionStartType(){
        this.ready(function(){
          window.AlipayJSBridge && AlipayJSBridge.call('getNetworkType', function(data){
            if(data.status==0){
              if(this.localstorage.networkConnectionType<1){
                this.localstorage.networkConnectionType = 1
                Vue.$vux.toast.text('当前网络无链接', 'top')
              }
            }else {
              this.localstorage.networkConnectionType = 0
            }
            return true;
          })
        })
      },
      // 获取系统消息,公告，活动邀请统计
      getMessagesAndNoticeAndAtivityCount(){
        let systemMessageUnread = 0,//系统消息未读消息
        rightButtonTest = true;//是否开启右上角测试按钮，展示右上角测试按钮，4.0版本需要，其余不需要，IOS特需要
        this.ready(function() {
          let params = [{
            "_requestBody":{
              "current":'1',
              "size":'100',
              "fortType":'2',
              'type':'2,3,10,17,18',
              "memberId": this.memberId,
              "isRead": 0
            }
          }];
          this.setRightButtonIconCount("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
          let operationType = 'message.mqtt.template.getMessages';
          AlipayJSBridge.call('rpc', {
            operationType: operationType,
            requestData: params,
            headers:{
              "token":this.localstorage.token
            }
          }, function (res) {
            if(res.token_code=='-1'||res.token_code=='-2'){
              // tokenCheck(res.token_code,res.code);
              return
            }
            if(res.status === 200){
              systemMessageUnread+=res.data.records.length;
              this.ready(function() {
                let messageParams1 = [{
                  "current":1,
                  "_requestBody":{
                    "msgType":5,
                    "sendType":2,
                    "toUserId": this.memberId,
                    "isRead": 0
                  },
                  "size":100
                }];
                let operationType = 'message.page.client.owner';

                AlipayJSBridge.call('rpc', {
                  operationType: operationType,
                  requestData: messageParams1,
                  headers:{
                    "token": this.localstorage.token
                  }
                }, function (res) {
                  if(res.token_code=='-1'||res.token_code=='-2'){
                    // tokenCheck(res.token_code,res.code);
                    return
                  };
                  if (res.status === "200") {
                  // alert(res.data.records.length)
                    if(this.localstorage.userType != '游客'){
                      systemMessageUnread+=res.data.records.length;
                    }
                    //统计活动消息
                    this.ready(function() {
                      let activityParams = [{
                        "_requestBody":{
                          "current":1,
                          "size":100,
                          "fortType":2,
                          'type':6,
                          "memberId": this.memberId,
                          "isRead":0,
                        }
                      }];
                      let operationType = 'message.mqtt.template.getMessages';

                      AlipayJSBridge.call('rpc', {
                        operationType: operationType,
                        requestData: activityParams,
                        headers:{
                          "token": this.localstorage.token
                        }
                      }, function (res) {
                        if(res.token_code=='-1'||res.token_code=='-2'){
                          // tokenCheck(res.token_code,res.code);
                          return
                        }
                        if(res.status === 200){
                          systemMessageUnread+=res.data.records.length;
                          this.hideOptionMenu()
                          if (systemMessageUnread > 0){

                            if (rightButtonTest) {
                              //显示测试按钮
                              showRightTestButton("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F",systemMessageUnread);
                              showRightUnreceivedButton(true);
                            }else {
                              //显示右上角消息，数量显示
                              setRightButtonIconCount("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F",systemMessageUnread);
                              showRightUnreceivedButton(true);
                            }
                          }else {
                            if (rightButtonTest) {
                              //显示测试按钮
                              showRightTestButton("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                              showRightUnreceivedButton(true);
                            }else {
                              //显示右上角消息
                              setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                              showRightUnreceivedButton(true);
                            }
                          }
                        }else {
                          setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                        }
                      });
                    })
                  }else{
                    setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                  }
                })
              });
            }else{
              setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
            }
          });
        })
      },
      /**
       * 设置右上角按钮
       * @param rightIcon 图片
       * @param rightIconColor 颜色
       * @param count 表示在红点上显示的数字
       */
      setRightButtonIconCount(rightIcon,rightIconColor,count) {
        this.ready(function() {
          AlipayJSBridge.call('setOptionMenu', {
            icon : rightIcon,
            redDot : count, // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
            color : rightIconColor, // 必须以＃开始 ARGB 颜色值
          });
          AlipayJSBridge.call('postNotification', {
            name:'messageViewInit',
            data:{}
          }, function (result) {
          });
          AlipayJSBridge.call('showOptionMenu');
        });
      },
      //隐藏右上角按钮
      hideOptionMenu() {
        this.ready(function() {
          AlipayJSBridge.call('hideOptionMenu');
        });
      },

    }
  }
</script>

<style lang="scss" scoped>
  #open-door-page {
    height: 100vh;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    background: #F6F7F9;
  }
  .open-door-background{
    width: 100vw;
    /* height: calc(100vh -  92rpx); */
    height: 100vh;
    background-image: url("/static/aKeyOpenDoor/open_door.png");
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
  }
  .open-door-button{
    /* width: 148px;
    height: 148px; 
    margin: calc(100vh - 360px) auto 0;*/
    width: 296rpx;
    height: 296rpx;
    margin: calc(100vh - 720rpx) auto 0;
    position: relative;
  }
  .open-door-out-border{
    /* width: 148px;
    height: 148px;
    padding: 15px; */
    width: 296rpx;
    height: 296rpx;
    /* padding: 30rpx; */
    position: absolute;
    z-index: 101;
    animation: button-out-border-flashing 1s infinite linear;
  }
  .open-door-out-border::after {
    content : "";
    width : 200%;
    height : 200%;
    position : absolute;
    top : 0;
    left : 0;
    border : 1px solid #FFFFFF;
    -webkit-transform : scale(0.5);
    transform : scale(0.5);
    -webkit-transform-origin : 0 0;
    transform-origin : 0 0;
    box-sizing: border-box;
    -webkit-border-radius: 400rpx;
    -moz-border-radius: 400rpx;
    border-radius: 400rpx;
  }
  .open-door-inner-border{
    width: 236rpx;
    height: 236rpx;
    margin: 30rpx;
    /* padding: 30rpx; */
    border: 1px solid #FFFFFF;
    position: absolute;
    z-index: 102;
    animation: button-inner-border-flashing 1s infinite linear;
  }
  .open-door-click{
    width: 176rpx;
    height: 176rpx;
    margin: 60rpx;
    background: #FFFFFF;
    position: relative;
    z-index: 103;
    animation: button-flashing 1s infinite linear;
  }
  .open-door-out-border, .open-door-inner-border, .open-door-click{
    display: inline-block;
    -webkit-border-radius: 400rpx;
    -moz-border-radius: 400rpx;
    border-radius: 400rpx;
  }
 .weui-btn_plain-primary:not(.weui-btn_plain-disabled):active {
   color: #ffffff;
   border: 1px solid #fcbf72;
   background-color: #fcbf72;
   -webkit-border-radius: 400rpx;
   -moz-border-radius: 400rpx;
   border-radius: 400rpx;
  }

  .open-door-click-words-box{
    position: relative;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .open-door-click-words{
    font-size: 36rpx;
    text-align: center;
    color: #C8924B;
  }
  @keyframes button-out-border-flashing{
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.6
    }
    50%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
      opacity: 0
    }
    100%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.6
    }
  }
  @keyframes button-inner-border-flashing{
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.8
    }
    50%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
      opacity: 0
    }
    100%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.8
    }
  }
  @keyframes button-flashing{
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    100%{
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes button-out-border-flashing{
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.6
    }
    50%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
      opacity: 0
    }
    100%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.6
    }
  }
  @-webkit-keyframes button-inner-border-flashing{
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.8
    }
    50%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
      opacity: 0
    }
    100%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.8
    }
  }
  @-webkit-keyframes button-flashing{
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    100%{
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  .open-door-bluetooth-show ::v-deep .weui-dialog{
    top: -100px;
    width: calc(100% - 120rpx) !important;
    -webkit-border-radius: 16rpx;
    -moz-border-radius: 16rpx;
    border-radius: 16rpx;
    background: #ffffff;
  }
  .open-door-set{
    color: #ffffff;
    background-color: #C8924B;
    border: 1px solid #C8924B;
    -webkit-border-radius: 200rpx;
    -moz-border-radius: 200rpx;
    border-radius: 200rpx;
  }
  .confirm-btn-container{
    padding: 30rpx 50rpx;
  }

  .nokey-modal {
    .tips {
      font-size: 28rpx; 
      color: #566075; 
      text-align: center; 
      padding-bottom: 20rpx;
      .isIos {
        font-size: 30rpx;
        color: #2C3444;
        font-weight: bold;
      }
    }
  }
</style>
