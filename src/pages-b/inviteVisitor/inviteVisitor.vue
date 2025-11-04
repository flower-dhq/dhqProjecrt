<template>
    <view class="page">
      <view class="view_title">
        <view style="color: #666;font-size: 28rpx;">请完善如下信息后分享给访客</view>
      </view>
      <view class="all-view-style">
      <u-form labelPosition="left" :model="controller"  ref="elFormUser" labelWidth="112px">
      <u-form-item label="访客姓名" borderBottom >
        <u-input v-model="controller.visitorName"  placeholder="请填写" border="none" />
      </u-form-item>
      <u-form-item label="访客电话" borderBottom >
        <u-input v-model="controller.visitorPhone"  placeholder="请填写" border="none" :maxlength="11" />
      </u-form-item>
      <u-form-item label="可用次数" borderBottom  @click="numberObj.isShow = true" ref="visitTimes">
        <u-input v-model="controller.showNumber" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item label="有效期（天）" borderBottom  @click="daysObj.isShow = true" ref="visitTimes">
        <u-input v-model="controller.showValidDay" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item label="拜访事由" borderBottom  @click="registerObj.isShow = true">
        <u-textarea v-model="controller.showReason" placeholder="请填写" border="none" autoHeight disabled />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
    </u-form>
    <!-- 拜访事由 -->
    <u-picker :show="registerObj.isShow" :columns="registerObj.list" title="拜访事由" closeOnClickOverlay=true keyName="name" @cancel="registerObj.isShow = false" @confirm="registerObjConfirm" />
    <!-- 可用次数 -->
    <u-picker :show="numberObj.isShow" :columns="numberObj.list" title="可用次数" closeOnClickOverlay=true keyName="name" @cancel="numberObj.isShow = false" @confirm="numberObjConfirm" />
    <!-- 有效天数 -->
    <u-picker :show="daysObj.isShow" :columns="daysObj.list" title="有效期（天）" closeOnClickOverlay=true keyName="name" @cancel="daysObj.isShow = false" @confirm="daysObjConfirm" />
    </view>
    <view class="flex-around">
      <u-button type="primary" shape="circle"  :customStyle="{ width: '35%', 'flex-shrink': 0,height: '68rpx' }" @click="onClickRecord">访客记录</u-button>
      <u-button type="primary" shape="circle" :plain="true" :customStyle="{ width: '35%', 'flex-shrink': 0,height: '68rpx' }" @click="onClickSubmit">生成通行证</u-button>
    </view>
      <view>
      </view>
      <view style="position:relative" v-if="showResult" >
        <view class="view_result">
          <view class="view_left_result">
            <view class="view_left_result_title">访客通行证</view>
            <view class="line_h"></view>
            <view v-if="currProjectName !='ruisihang'" class="view_left_result_prompt">可用次数</view>
            <view v-if="currProjectName !='ruisihang'" class="span_number">{{resultData.availNumber}}</view>
            <view class="span_date">有效期至:{{resultData.availDate}}</view>
          </view>
          <view class="view_right_result">
            <view class="view_info">
              <view class="span_title">拜访地方:</view>
              <view class="span_info">{{resultData.location}}</view>
            </view>
            <view class="view_info">
              <view class="span_title">用户姓名:</view>
              <view class="span_info">{{resultData.ownerName}}</view>
            </view>
            <view class="view_info">
              <view class="span_title">访客电话:</view>
              <view class="span_info">{{resultData.telephone}}</view>
            </view>
            <view class="view_info">
              <view class="span_title">访客姓名:</view>
              <view class="span_info">{{resultData.visitor}}</view>
            </view>
            <view class="view_info">
              <view class="span_title">拜访事由:</view>
              <view class="span_info">{{resultData.visitReason}}</view>
            </view>
          </view>
        </view>
        <image v-if="!isWeixin" class="img_right_share" src="./../../static/components/ebei_traffic_record_share.png" width="20px" height="20px" @click="onShare"/>
      </view>

      <view class="view_qr_code" v-if="showResult && isWeixin" style="margin: 28px 0;display: flex;">
        <view class="qrcode-box" v-if="currProjectName =='ruisihang' " style="width:300rpx;height:300rpx; margin:auto">
          <view id="qrcode" ref="qrCodeview"></view>
          <image class="qrcode-image-box" v-show="qrcodePath" :src="qrcodePath" alt=""></image>
        </view>
        <image v-else :src="codePath" style="width:300rpx;height:300rpx" show-menu-by-longpress />
        <view>
           <view style="margin-top: 10px;font-size: 24rpx;color: #999999; word-break: break-word;">长按图片转发给朋友开门</view>
           <view style="margin-top: 6px;font-size: 24rpx;color: #999999; word-break: break-word;" v-if="currProjectName !='xinoupeng'" @click="isShowSMS = true">或者<text class="btnSend">发送短信</text>给朋友开门</view>
        </view>
       
      </view>

      <u-modal :show="isShowSMS" :content="sendcontent" confirmText="拷贝至剪切板" @confirm="sendSMSOK" />
    </view>
</template>
  
<script>
import appConfig from '@/app-config';
import commLogic from '@/js/comm-logic';
import Utils from '@/js/utils'
import util from '@/js/utils/util'
import {  getVisitReason,  findBuildLocation } from '@/service/community'
import {  saveCrmVisitPassForBluetooth,getCrmVisitPassDetailForBluetooth} from '@/service/doorService'
import { getSignByProjectType } from '@/service/wxmanage'

    export default {
      name: "inviteVisitor",
      data(){
        const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID, PROJECT_TYPE ,USER_TYPE } = this.$constant
        const { PROJECT_CODE} = this.$appConfig;
        return{
          isShowSMS: false,
          qrcodePath:'',
          sendcontent:'',
          smmSign:'',
          city:[],
          memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
          companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
          selectTips: '请选择',
          inputTips: '请输入',
          ownerId:'',
          address:'',
          houseinfoId:'',
          showPopup:false,
          popupTitle:'',
          numbers:[[]],//
          number:[],
          validDays:[[]],//
          validDay:[],
          reasons:[[]],//
          reason:[],
          loading:false,
          showPositionValue:false,
          showToastValue:'',
          type:0,
          dayTime:86400000,
          resultData: {},
          codePath: '', // 二维码图片地址
          showResult:false,
          qrCode:'',
          isWeixin:'',
          showShareSheet: false,
          shareMenus: {
            0: '分享给朋友',
            1: '分享到朋友圈'
          },
          currProjectName: PROJECT_CODE,
          secretKey:'',  //生成二维码的加密码
          registerObj: {
              isShow: false,
              list: [[]],
              value: ''
            },
          numberObj: {
            isShow: false,
            list: [[]],
             value: ''
          },
          daysObj: {
            isShow: false,
            list: [[]],
             value: ''
          },
          controller: {   // '访客登记'模块
          visitorPhone:'',  // 被访人手机号
          visitorName: '',     // 访客姓名
          showNumber:'',
          showValidDay:'',
          showReason: '',  //拜访事由的值
      },
        }
      },
      onShow(){
        const { uniPlatform } = uni.getSystemInfoSync();
        const { O_USER_INFO } = this.$constant;
        const { phoneNumber } = Utils.storageAction({ key: O_USER_INFO, action: 'get' });
        if(!phoneNumber) return uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
        this.isWeixin = uniPlatform == 'mp-weixin';
        this.getNewLocations();
        this._getVisitQyReasor()
        this.getVisitorDayDate()
        this.getSignByProjectType()  //获取短信签名
      },
    
      methods:{
        registerObjConfirm({ indexs, value, values }) {
      this.registerObj.isShow = false
      if (indexs.length <= 0) return
        this.controller.showReason = value[0].name
        console.log(179,indexs,value)
        // this.controller.visitReasonId = value[0].value
    },
    numberObjConfirm({ indexs, value, values }){
      console.log(199,value,value[0].values)
      this.numberObj.isShow = false
      this.controller.showNumber = value[0].values
    },
    daysObjConfirm({ indexs, value, values }){
      console.log(204,value)
      this.daysObj.isShow = false
      this.controller.showValidDay = value[0].values
      console.log(205, this.controller.showValidDay)

    },

    getVisitorDayDate(){
        for (let i = 1; i < 9; i++) {
            this.numberObj.list[0].push({
              name:i+"",
              values:i+""
            })
          }
          for (let i = 1; i < 4; i++) {
            this.daysObj.list[0].push({
              name:i+"",
              values:i+""
            })
          }
       },
     // 获取拜访事由列表-----邀请访客
     _getVisitQyReasor(){
      const { PROJECT_ID} = this.$constant
      let projectId = Utils.storageAction({ key: PROJECT_ID, action: 'get' })
      let params = {
        data: {
          projectId: projectId,  // 项目id
          configCode: "VisitReason"    // 编码，住宅拜访：VisitReason
        }
      }
      getVisitReason(params).then(res => {
        if(res.status = 200){
          let reasonList = res.data
          this.registerObj.list = res.data?[[]]:[]
          for(let reason of reasonList){
            this.registerObj.list[0].push({
              name: reason.detailName,
              value:reason.detailId
            })
          }
        }
      })
    },
        getNewLocations(){
          let that = this;
        const {PROJECT_TYPE} = this.$appConfig
          let params = {
            // projectId:localStorage.getItem('projectId'),
            // companyId:this.companyId,
            data:{
              memberId:this.memberId,
             projectType: PROJECT_TYPE ,
            },
            hideLoading:true
          }
          findBuildLocation(1,params).then(response =>{
            if(response.status=='200'){
              let tempArr=response.data.authBuildings;
              let isDefault=false;
              if(tempArr.length>0){
                tempArr.forEach(item => {
                  if(item.isDefault==1){
                    that.address = item.address;
                    that.houseinfoId = item.addrId;
                    that.ownerId = item.ownerId;
                    that.ownerPhone = item.ownerPhones || item.regNumber
                    isDefault=true
                    return
                  }
                })
                if(isDefault==false){
                  uni.showToast({
							       title:"请先设置默认路址",
						       	icon: 'none'
						       })
                   setTimeout(function() {
                     window.history.back();
                   }, 10);
                }
              }
            }
          }).catch((error) =>{
            console.log(error);
          })
        },
        showPickNumber(){
          this.popupTitle = '可用次数';
          this.type = 0;
          this.showPopup = true;
        },
        showPickValidDays(){
          this.popupTitle = '有效期（天）';
          this.type = 1;
          this.showPopup = true;
        },
        showPickReason(){
          this.popupTitle = '拜访事由';
          this.type = 2;
          this.showPopup = true;
        },
        visitorNameChange (val) {
          this.controller.visitorName = val
        },
        visitorPhoneChange (val) {
          this.controller.visitorPhone = val
        },
        onChangeNumber(){
  
        },
        onClickRight(){
          switch (this.type) {
            case 0:
              console.log(this.numbers);
              console.log(this.number);
              for (let i = 0; i < this.numbers[0].length; i++){
                if (this.number[0] === this.numbers[0][i].value){
                  this.controller.showNumber = this.numbers[0][i].value;
                  break;
                }
              }
  
              break;
            case 1:
              for (let i = 0; i < this.validDays[0].length; i++){
                if (this.validDay[0] === this.validDays[0][i].value){
                  this.controller.showValidDay = this.validDays[0][i].value;
                  break;
                }
              }
              break;
            case 2:
              for (let i = 0; i < this.reasons[0].length; i++){
                if (this.reason[0] === this.reasons[0][i].value){
                  this.controller.showReason = this.reasons[0][i].name;
                  break;
                }
              }
              break;
          }
          this.showPopup = false;
        },
        onClickSubmit(){
          console.log(332,new Date().getTime() + parseInt(this.controller.showValidDay)* this.dayTime)
          console.log(330,uni.$u.timeFormat((new Date().getTime() + parseInt(this.controller.showValidDay)* this.dayTime), 'yyyy-mm-dd hh:MM:ss'))
          const { PROJECT_CODE,COMPLANY_ID, OA_APP_ID: configAppId } = this.$appConfig;
          if (this.controller.visitorName=='') {
            uni.showToast({
							title:"请输入访客姓名",
							icon: 'none'
						})
            return;
          }
          if (this.controller.visitorPhone.length < 11){
            uni.showToast({
							title:"请输入正确的手机号码",
							icon: 'none'
						})
            return;
          }
          if ((this.controller.showNumber=='') && (PROJECT_CODE != 'ruisihang')){
            uni.showToast({
							title:"请输入访问次数",
							icon: 'none'
						})
            return;
          }
          if (this.controller.showValidDay==''){
            uni.showToast({
							title:"请输入有效期",
							icon: 'none'
						})
            return;
          }
          if (this.controller.showReason==''){
            uni.showToast({
							title:"请输入拜访事由",
							icon: 'none'
						})
            return;
          }
          let that = this;
          let date  = uni.$u.timeFormat((new Date().getTime() + parseInt(this.controller.showValidDay)* this.dayTime), 'yyyy-mm-dd hh:MM:ss')
          console.log(367,date)
          const {  PROJECT_ID ,O_USER_INFO } = this.$constant
          const {  PROJECT_TYPE } = this.$appConfig
       const { fullName, phoneNumber,contactName } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
          const { uniPlatform } = uni.getSystemInfoSync();
          let params = {
            data:{
              ExpiryDate: this.controller.showValidDay,
              address: this.address,
              appletId: PROJECT_TYPE, 
              //  appletId: "87", //云环境 中奥
              availDate: date,
              availNumber: this.controller.showNumber,
              houseinfoId: this.houseinfoId,
              limitDay: this.showValidDay,
              ownerId: this.ownerId,
              projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
              telephone: this.controller.visitorPhone,
              visitReason: this.controller.showReason,
              visitor: this.controller.visitorName,
              appSource: uniPlatform == 'mp-weixin' ? '1' : '0',
              envVersion: 'release'
            }
          }
  
          const { availDate, availNumber, address, visitor, visitReason, telephone } = params
          let resultObj = {
            availDate : uni.$u.timeFormat((new Date().getTime() + parseInt(this.controller.showValidDay)* this.dayTime), 'yyyy-mm-dd'),
            // availNumber: Number(availNumber)*2,
            location: address,
            visitor,
            visitReason,
            telephone,
            ownerName: contactName || fullName
          } 
          if(PROJECT_CODE == 'ruisihang'){
            //瑞思行
            params.source = "rsh"; //来源
            params.availNumber = 1; //不需要次数，设置默认值
            let time = new Date().getTime() + 1000 * 60 * 60 *24 * Number(this.controller.showValidDay)
            params.secretKey= QRcode12(this.ownerPhone, time);
            this.secretKey = params.secretKey
            
          }
          console.log(params);
          // params.envVersion ='trial' //正式版为 "release"，体验版为 "trial"，开发版为 "develop 
          that.loading = true;

          let pms = null
          // if (PROJECT_CODE == 'ruisihang') {
            // 保留旧的接口
            pms = saveCrmVisitPassForBluetooth(params)
           //} else {
            // 深圳华业物业的接口，替换成新接口
           //  pms = saveCrmVisitPassForHuaYe(params)
           //}
          
          pms.then(res => {
            console.log(422,res.status,PROJECT_CODE)
            if (res.status == '200') {
              this.showResult = true

              if(PROJECT_CODE == 'ruisihang'){
                that.loading = false;
                that.resultData = resultObj
                that.creatQrCode(params.secretKey)
                that.sendMes(telephone, visitor)
                that.clearData() //清空表单数据
              }else{
                this.codePath = res.data.codePath || '', // 二维码图片地址
                that.getCrmVisitPassDetailForBluetoothJs(res.data.scene)
                that.clearData() //清空表单数据
              }
            }else{
              uni.showToast({
							title:res.message || "提交失败",
							icon: 'none'
						})
            }
          }).finally(() => {
            that.loading = false
          })
  
        },
        getCrmVisitPassDetailForBluetoothJs(scene){
          let that = this;
          let params = {
            data:{
              scene:scene
            }
          }
          getCrmVisitPassDetailForBluetooth(params).then(res => {
            that.loading = false;
            if (res.status === '200'){
              const { codePath, ...other } = res.data || {}
              // if(JSON.stringify(res.data) != "{}"){
                that.showResult = true;
                that.resultData = other || {}
                that.resultData.availDate = uni.$u.timeFormat(res.data.availDate, 'yyyy-mm-dd')
                // that.setInviteVisitorLogic(new inviteVisitor())
                this.sendMes(other.telephone, other.visitor)
              // }
            }
          }).catch(error =>{
            that.loading = false;
          })
        },
        onClickRecord(){
          uni.navigateTo({ url: '/pages-b/inviteVisitor/inviteVisitorRecord?ownerId=' + this.ownerId });
        },
        onShare(){
          this.showShareSheet = true;
        },
        actionSheetClicked (menuKey, menuItem) {
          let self = this;
          let url = '';
          let desc = '';
          let name = localStorage.getItem('fullName');
          const { uniPlatform } = uni.getSystemInfoSync();
           this.isWeixin = uniPlatform == 'mp-weixin';
          if ( this.isWeixin) {
            switch (menuKey) {
              case 0:
                self.$wechat.ready(function () {   //需在用户可能点击分享按钮前就先调用
                  self.$wechat.onMenuShareAppMessage({
                    title:  moduleConfig.sharePersonTitle, // 分享标题
                    desc: '', // 分享描述
                    link:  window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl:  this.codePath, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      // 用户点击了分享后执行的回调函数
                    }
                  });
                });
                break;
              case 1:
                self.$wechat.ready(function () {   //需在用户可能点击分享按钮前就先调用
                  self.$wechat.onMenuShareTimeline({
                    title: moduleConfig.sharePersonTitle, // 分享标题
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: this.codePath, // 分享图标
                    success: function () {
                      // 用户点击了分享后执行的回调函数
                    },
                  });
  
                });
                break;
  
            }
  
          } else {
            EbeiPlugins.shareByApp(menuKey==="0"?'wechatsession':'wechattimeline', 'image',{
              title:'蓝牙开门',
              description:'小程序二维码分享',
              imageUrl:this.codePath,
  
            },function () {
  
            }, function () {
  
            });
          }
        },
        showToast (tips) {
          this.$vux.toast.show({
            type: 'text',
            text: tips,
            position: 'bottom'
          })
        },
  
        //发送短信的内容
        sendMes(tel, visitor){
          let phone =tel ? tel : this.resultData.telephone;
          let visitor1 = visitor ? visitor : this.resultData.visitor
          let link = ''
          if (this.$appConfig.PROJECT_TYPE == 'ruisihang') {
            link = window.location.href.split('/wechat')[0] +'/rshOpenDoor.html?secretKey=' + this.secretKey
          } else {
            link = this.codePath
          }
          this.sendcontent = '【'+this.smmSign+'】'+'您好,'+ visitor1 +'！您的访客邀请码是：'+ link
        },
        getSignByProjectType(){
          getSignByProjectType({
            data: {
              tokenId: this.$appConfig.PROJECT_TYPE
            }
          }).then(res =>{
            if(res.status=='200'){
              this.smmSign=res.data.wechatToken.smmSign
              console.log(this.smmSign,'this.smmSign')
            }
          })
        },
  
        //生成二维码
        creatQrCode(val) {
          let that = this
          setTimeout(function(){
            let qrcode = new QRCode(that.$refs.qrCodeview, {
              text: val, // 需要转换为二维码的内容
              width: 150,
              height: 150,
              colorDark: '#000000',//二维码颜色
              colorLight: '#ffffff',//二维码背景色
              correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H
            })
            console.log('qrcode',qrcode)
            that.createPicture();
          },200)
          // setTimeout(that.image,400)
        },
  
        //生成图片
        createPicture () {
          html2canvas(this.$refs.qrCodeview, {
            backgroundColor: null,
            width: 150,
            height: 150
          }).then(canvas => {
            var imgData = canvas.toDataURL('image/png')
            console.log(imgData)
            this.qrcodePath = imgData;
            //清空生成的canvas
            let qrcodeBox = document.getElementById("qrcode");
            qrcodeBox.innerHTML = ''
          })
        },
  
        // 把时间转为时间戳
        formatTime(stringTime){
          let time = stringTime.replace(/-/g, '/')   //为了兼容IOS，需先将字符串转换为'2018/9/11 9:11:23'
          time = Date.parse(time) 
          return time;
        },
  
        //清空数据
        clearData(){
          let that = this;
          that.controller.visitorName = '';
          that.controller.visitorPhone = '';
          that.controller.showNumber = '';
          that.controller.showValidDay = '';
          that.controller.showReason = '';
        },
        sendSMSOK() {
          this.isShowSMS = false

          uni.setClipboardData({
            data: this.sendcontent,
            success: () => {}
          })
        }
  
      }
    }
</script>
  
  <style lang="scss" scoped>
    .btnSend{
    color:#C8924B;
    text-decoration:underline;
    }
    .page {
      background-color: #f7f7f7;
      padding-bottom: 36rpx;
      min-height: 100vh;
    box-sizing: border-box;
    }
    .view_title{
      display: flex;
      padding: 10px;
      background-color: #f1f1f1;
    }
   ::v-deep .u-form{
      background-color: #ffffff !important;
      .u-form-item__body {
        padding-left:  20rpx;
        padding-right:  20rpx;
        min-height: 112rpx;
        box-sizing: border-box;
      }
    }
  
    .flex-around {
  display: flex;
  margin-top:80rpx;
  padding: 0 20rpx;
    ::v-deep .u-button--primary {
        color:  #C8924B !important;
    }
    ::v-deep .u-button--plain {
        background-color:  #C8924B !important;
        color: #FFFFFF !important;
        border: none !important;
    }
 }
 .view_result {
  display: flex;
  padding: 72rpx 40rpx 40rpx 40rpx;
  .view_left_result {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-width: 100px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    background-color: #eeeeee;
    padding: 20rpx;
    border-top-left-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
    .view_left_result_title {
      color: #666;
      font-size: 28rpx;
    }
    .line_h {
      background-color: #999999;
    height: 2rpx;
    margin-top: 4rpx;
    margin-bottom: 10rpx;
    }
    .span_number {
      color: #666;
    font-size: 40rpx;
    font-weight: bold;
    }
    .view_left_result_prompt {
      font-size: 24rpx;
      color: #999999;
      word-break: break-word;
    }
    .span_date {
      font-size: 24rpx;
      color: #999999;
      word-break: break-word;
    }

  }
  .view_right_result {
    display: flex;
    -webkit-box-flex: 2;
    -ms-flex: 2;
    flex: 2;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #C8924B;
    background-size: 100% 100%;
    padding: 20rpx;
    border-top-right-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    .view_info {
      display: flex;
    padding: 5px 0;
    color: white;
    font-size: 24rpx;
    .span_info {
      display: flex;
    flex: 1;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    word-break: break-word;
    margin-left: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    }
    }
  }
 }
::v-deep .u-textarea {
 padding: 0rpx !important;
 &.u-textarea--disabled {
  background-color: transparent;
 }
}

::v-deep .u-modal__content__text {
  word-break: break-all;
}
  </style>
  