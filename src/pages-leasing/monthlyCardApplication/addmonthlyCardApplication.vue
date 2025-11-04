<template>
  <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="topbg" v-show="type != 'licensePlate' && type!='changeparking'">
      <image :src="imagesrc" class="topbg-image"></image>
      <text class="topbg-text1" @click="toselectParkingLot">{{ title }}</text>
      <!-- <text class="topbg-text2" v-show="type == 'add'">月卡余量：100个</text> -->
    </view>
    <view class="centerbg0" :class="type=='licensePlate'|| type=='changeparking'?'page-height':''">
      <text class="centerbg-text">车辆信息</text>
      <image :src="imagesrc2" class="centerbg-img"></image>
      <view class="centertext">
        <u--form
          :rules="rules"
          labelWidth="100"
          customStyle="padding: 0 16px;background-color: #fff"
        >
          <u-form-item label="客户" required ref="item1" >
            <u--input
              v-model="formParams.cardholder"
              placeholder="请输入"
              border="none"
              :readonly="type != 'add'"
            ></u--input>
          </u-form-item>
          <u-form-item  label="手机号" required ref="item1">
            <u--input
              v-model="formParams.customerPhone"
              placeholder="请输入"
              border="none"
              :readonly="type != 'add'"
            ></u--input>
          </u-form-item>
          <u-form-item label="预约车位" required ref="item1" v-if="monthcardSetting.fixedParkingSpace==1">
             <view @click="toparkinglot()" class="pNclass">
              <!-- <u--input
              v-model="formParams.parkingNumber"
              placeholder="请选择"
              readonly
              border="none"
            ></u--input> -->
            <text>{{formParams.parkingNumber}}</text>
            </view>
            <!-- <u-icon
              @click="toparkinglot()"
              class="pNicon1"
              name="arrow-right"
            ></u-icon> -->
            <image
              v-if="type=='add'||type=='edit'||type=='changeparking'"
              @click="toparkinglot()"
              :src="imagesrc6"
              class="pNicon1"
            ></image>
            
          </u-form-item>
          <u-form-item required label="车牌号" ref="item1">
            <view class="ulbg">
              <ul>
                <li v-for="(row, index) in platedata" :key="index">
                  <u-row customStyle="margin-bottom: 10rpx">
                    <u-col span="10">
                         <text>{{ row }}</text>
                    </u-col>
                    <u-col span="1">
                        <u-icon
                           v-if="type == 'add' || type == 'licensePlate'"
                           id="liicon"
                           name="close"
                           color="#85D870"
                           size="13"
                           @click="delplatedata(index)"
                         ></u-icon>
                    </u-col>
                </u-row>
                 
                  
                </li>
              </ul>
            </view>
              <image
              @click="addplatedata()"
              :src="imagesrc3"
              class="ul-img1"
              v-if="(type == 'add' || type == 'licensePlate') && platedata.length<monthcardSetting.monthCardBinding"
            ></image>
          </u-form-item>
        </u--form>
      </view>
      <view class="savebtn">
        <u-button
        shape="circle"
        type="primary"
        @click="submit('licensePlate')"
        v-if="type == 'licensePlate'"
        >保存</u-button
      >
      <u-button
        shape="circle"
        type="primary"
        @click="submit('changeparking')"
        v-if="type == 'changeparking'"
        >保存</u-button
      >
      </view>
    </view>
    
    <view
      class="centerbg"
      style="min-height: 550rpx; margin-top: 75rpx"
      v-show="type != 'licensePlate'&&type != 'changeparking'"
    >
      <text class="centerbg-text">缴费信息</text>
      <image :src="imagesrc2" class="centerbg-img"></image>
      <view class="centertext">
        <u--form
          :rules="rules"
          labelWidth="100"
          customStyle="padding: 0 16px;background-color: #fff"
        >
          <u-form-item label="收费标准" required borderBottom ref="item1">
            <view @click="getlistPagination()" class="pNclass1" :class="type == 'add'?'pNclass1width':''">
            <text>{{formParams.contractCategory}}
              <!-- <u-icon
              class="pNicon"
              name="arrow-right"
              v-show="type == 'add'"
            ></u-icon> -->
            </text>
            
            <!-- <u-icon
              class="pNicon"
              name="arrow-right"
              v-show="type == 'add'"
            ></u-icon> -->
            </view>
            <image
              v-if="type == 'add'"
              @click="getlistPagination()"
              :src="imagesrc6"
              class="pNicon1"
            ></image>
            <!-- <u--input
              v-model="formParams.contractCategory"
              placeholder="请输入"
              readonly
              border="none"
              inputAlign="right"
            ></u--input>
            <u-icon
              @click="getlistPagination"
              slot="right"
              name="arrow-right"
              v-show="type == 'add'"
            ></u-icon> -->
          </u-form-item>
          <u-form-item
            :label="type=='renew'?'续费开始日期':'开通日期'"
            labelWidth="120"
            borderBottom
            required
            @click="changestartTime"
            ref="item1"
          >
          <view @click="changestartTime()" class="pNclass1" :class="type == 'add'?'pNclass1width':''">
            <text>{{formParams.startTime}}
              <!-- <u-icon
              class="pNicon"
              name="arrow-right"
              v-show="type == 'add'"
            ></u-icon> -->
            </text>
            </view>
            <image
              v-if="type == 'add'"
              @click="changestartTime()"
              :src="imagesrc6"
              class="pNicon1"
            ></image>
            <!-- <u--input
              v-model="formParams.startTime"
              placeholder="请输入"
              readonly
              border="none"
              inputAlign="right"
            ></u--input>
            <u-icon
              slot="right"
              name="arrow-right"
              v-show="type == 'add'"
            ></u-icon> -->
          </u-form-item>
          <u-form-item required borderBottom label="缴费月数" ref="item1">
            <view class="imagebg" > 
              <u-number-box
               v-if="type == 'add' || type == 'renew'"
                :min="1"
                integer
                
                :longPress="false"
                v-model="formParams.number"
                color="#333333"
                bgColor="#ffffff"
                iconStyle="color: #fff"
                @change="numchange"
              >
                <view slot="minus" class="minus">
                  <image :src="imagesrc4" class="ul-img"></image>
                </view>
                <!-- <text
                  slot="input"
                  style="width: 50px; text-align: center"
                  class="input"
                  >{{ value }}</text
                > -->
                <view slot="plus" class="plus">
                  <image :src="imagesrc3" class="ul-img"></image></view
              ></u-number-box>
            </view>
            <view class="monthnumber" v-show="type != 'add' && type != 'renew'">{{formParams.number}}</view>
          </u-form-item>
          <u-form-item
            label="到期日"
            borderBottom
            placeholder="请输入"
            required
            @click="changeendTime"
            ref="item1"
          >
            <u--input
              v-model="formParams.endTime"
              placeholder="请选择开通日期"
              inputAlign="right"
              readonly
              border="none"
            ></u--input>
          </u-form-item>
          <u-form-item label="支付金额" required ref="item1"
            ><u--input
              v-model="receivableAmount"
              color='red'
              placeholder=""
              inputAlign="right"
              readonly
              border="none"
            ></u--input
          ></u-form-item>
        </u--form>
      </view>
    </view>

    <view :class="type=='add'?'centerbg3':'centerbg31'" v-show="monthcardSetting.openCardFile==1 && (type != 'renew' && type != 'licensePlate'&&type != 'changeparking')">
      <text class="centerbg-text"> 上传附件 </text>
      <image :src="imagesrc2" class="centerbg-img"></image>
      <view class="centerbg-upload" v-show="type == 'add'||type=='edit'">
        <!-- 只显示上传 -->
        <u-upload @afterRead="afterRead" @delete="deletePic">
          <view class="imgview">
            <image :src="imagesrc5" class="centerbg-img5"></image>
          </view>
        </u-upload>
      </view>
      <view class="texts" v-show="type == 'add'||type=='edit'">
        <text class="textred"> {{monthcardSetting.openCardFileWriteTip}} </text>
      </view>
      <!-- 只显示文件 -->
      <u-upload
        v-if="type == 'add'||type=='edit'"
        :fileList="formModel.fileList"
        disabled
        useBeforeRead
        :previewFullImage="true"
        @delete="deletePic"
        class="uploaddata"
      >
        <view style=""> </view>
      </u-upload>
      <view class="uploadetail" v-show="type != 'add'&&type!='edit'">
        <u-upload
        :fileList="formModel.fileList"
        disabled
        useBeforeRead
        :deletable="false"
        :previewFullImage="true"
        @delete="deletePic"
        class="uploaddatadetail"
      >
        <view style=""> </view>
      </u-upload>
      </view>
    </view>

    <view style="margin: 40px" v-if="type!='detail'">
      <u-button
        shape="circle"
        type="primary"
        @click="submit('add')"
        v-if="type == 'add'"
        >申请并支付</u-button
      >
      <u-button
        shape="circle"
        type="primary"
        @click="submit('edit')"
        v-if="type == 'edit'"
        >重新提交</u-button
      >
      <u-button
        shape="circle"
        type="primary"
        @click="submit('renew')"
        v-if="type == 'renew'"
        >立即支付</u-button
      >
      
      <view>
        <!-- <u-button
          shape="circle"
          type="primary"
          v-show="type == 'pay'"
          >待支付</u-button
        > -->
        <u-button
          shape="circle"
          type="primary"
          @click="submit('pay')"
          v-if="type == 'pay'"
          >支付</u-button
        >
      </view>
      <u-radio-group
       class="Iknow"
        v-model="value"
        v-if="type == 'add'||type == 'pay'"
      >
        <u-checkbox-group v-model="checkboxValue">
          <u-checkbox
            name="isNewEnergy"
            activeColor="var(--app-primary-color)"
            labelSize="14"
            label="我同意"
          ></u-checkbox>
        </u-checkbox-group>
        <view v-for="item,index in termSetting" :key="index">
          <text class="termNameclass" @click="openafile(item)">《{{item.termName}}》</text>
          <u-popup ref="popup" mode="center"  :show="popupModel">
            <view>
              <!-- <web-view  :src="item.termFile"></web-view> -->
            </view>
          </u-popup>
        </view>
        
      </u-radio-group>
    </view>
    <u-toast ref="uToast"></u-toast>
    <u-calendar
      ref="calendar"
      :maxDate="maxDate"
      :minDate="minDate"
      :monthNum="monthNum"
      :defaultDate="defaultDateMultiple"
      :show="calendarshow"
      @close="calendarshow = false"
      @confirm="calendarconfirm"
    ></u-calendar>
    <!-- <u-popup
      :show="keyboardshow"
      @close="keyboardclose"
      mode="center"
      customStyle="background-color: #fff; border-radius: 8px;width:85%;height:340rpx"
    >
      <view style="width: 100%">
        <selectLicensePlate
          @tokeyboardshow="tokeyboardshow"
        ></selectLicensePlate>
      </view>
    </u-popup> -->
    <u-popup :show="keyboardshow" @close="keyboardclose" mode="center" 
         customStyle="background-color: #fff; border-radius: 8px;width:85%;height:340rpx">
      <view style="width:100%">
          <text class="addcar">添加车辆</text>
          <keyboard ref="keyboards" class="addkeyboard"></keyboard>
          <text class="addkeysubmit" @click="tokeyboardshow">确认</text>
          <!-- <u-button shape="circle" type="primary" @click="tokeyboardshow" class="addkeysubmit"
        >确认</u-button
      > -->
      </view>
		</u-popup>

    <u-popup
      :show="payPopup"
      mode="bottom"
      :closeable="true"
      @close="closePopup"
    >
      <view class="payPopupStyle">
        <u-radio-group v-model="payWay">
          <u-cell-group :border="false">
            <u-cell
              clickable
              :border="false"
              v-if="!isShowMiniWx"
              @click="payWay = '1'"
            >
              <view slot="title" class="u-slot-title">
                <view style="text-align: left; display: flex">
                  <text>微信支付</text>
                  <u-icon
                    name="weixin-fill"
                    size="24"
                    color="rgb(7, 193, 96)"
                    style="vertical-align: middle; margin-left: 24rpx"
                  />
                </view>
              </view>
              <template #right-icon>
                <u-radio name="1" />
              </template>
            </u-cell>
            <u-cell
              clickable
              :border="false"
              @click="payWay = '3'"
              v-if="isShowMiniWx"
            >
              <view slot="title" class="u-slot-title">
                <view style="text-align: left; display: flex">
                  <text>微信支付</text>
                  <u-icon
                    name="weixin-fill"
                    size="24"
                    color="rgb(7, 193, 96)"
                    style="vertical-align: middle; margin-left: 24rpx"
                  />
                </view>
              </view>
              <template #right-icon>
                <u-radio name="3" />
              </template>
            </u-cell>
            <u-cell
              clickable
              :border="false"
              @click="payWay = '2'"
              v-show="isShowAlipay"
            >
              <view slot="title" class="u-slot-title">
                <view style="text-align: left; display: flex">
                  <text>支付宝支付</text>
                  <u-icon
                    name="zhifubao"
                    size="24"
                    color="#1989fa"
                    style="vertical-align: middle; margin-left: 24rpx"
                  />
                </view>
              </view>
              <template #right-icon>
                <u-radio name="2" />
              </template>
            </u-cell>
          </u-cell-group>
        </u-radio-group>
        <view class="btn-cont">
          <view v-show="isClick" @click="getNum">立即支付</view>
          <view v-show="!isClick">支付中...</view>
        </view>
      </view>
    </u-popup>
    <u-popup :show="payResultPopup" mode="center">
      <view
        class="pay-result-container"
        style="padding: 0 0 0 0"
        v-show="payStatus === '0'"
      >
        <p class="wait-pay-tips">正在支付……</p>
        <view class="button-container">
          <view class="my_order_detail_unpay-button" @click.stop="notPayClick">
            尚未支付
          </view>
          <view
            class="my_order_detail_paied-buttton"
            @click.stop="alreadyPayClick"
          >
            我已支付
          </view>
        </view>
      </view>
      <div class="pay-result-container" v-show="payStatus === '1'">
        <u-icon
          name="checkmark-circle"
          size="22"
          color="var(--app-primary-color)"
        ></u-icon>
        <div class="pay-result-title">支付成功</div>
        <div class="pay-result-tips">请点击确定按钮，返回上一级！</div>
        <div
          class="my_order_detail_result-confirm-button"
          @click.stop="confirmClick"
        >
          确定
        </div>
      </div>
      <div class="pay-result-container" v-show="payStatus === '-1'">
        <u-icon name="close-circle" size="22" color="#ff3c3c"></u-icon>
        <div class="pay-result-title">支付失败</div>
        <div class="pay-result-tips">请重新进入，进行支付！</div>
        <div
          class="my_order_detail_result-confirm-button"
          @click.stop="confirmClick"
        >
          确定
        </div>
      </div>
    </u-popup>
    <u-picker
      :show="listshow"
      :columns="[Paginations]"
      keyName="categoryName"
      @close="listshow = false"
      @cancel="listshow = false"
      @confirm="onConfirm"
    ></u-picker>
  </view>
</template>

<script>
import keyboard from "./keyboard.vue";
import {
  getOwnerContractCategoryList,
  getParklotMonthCardFeeItemByCategoryId,
  commitParklotMonthCardApprove,
  renewalsParklotMonthCard,
  generatorSerialNum,
  MonthCardSettingselect,
  getOwnerByMemberId,
  getYbkOrderNum,
  getParklotMonthCardDetail,
  changeParklotMonthCard,
  chinaumsPay, //付款
    saveLog,
} from "@/service/leasing.js";
import {
    getPay2,
    appletLogin,
    getPayChannel,
} from '@/service/community'
import {getSubscribeTemplateGroup} from '@/service/community';
import {
  geProjectsByCompanyId, //获取项目
  getResourceMenuManger, //获取车场
} from "@/service/leasing.js";
import { uploadMutiFile } from "@/service/landcrm";
import commonMethod from '@/js/commonMethod'
import util from "../../js/utils";
import commLogic from "@/js/comm-logic";
import appConfig from '@/app-config';
const d = new Date()
const year = d.getFullYear()
let month = d.getMonth() + 1
month = month < 10 ? `0${month}` : month
const date = d.getDate()+1
export default {
  components: {
    // 注册子组件
    keyboard: keyboard,
  },
  data() {
    return {
      defaultDateMultiple: [`${year}-${month}-${date}`],
      imagesrc: require(`@/static/icon-img/imgbg.png`),
      imagesrc2: require(`@/static/icon-img/imgdown.png`),
      imagesrc3: require(`@/static/icon-img/img2.png`),
      imagesrc4: require(`@/static/icon-img/img1.png`),
      imagesrc5: require(`@/static/icon-img/imgphoto.png`),
      imagesrc6: require(`@/static/icon-img/icon_right.png`),
      fileList: [
        // {
        //   url: "https://cdn.uviewui.com/uview/swiper/1.jpg",
        // },
      ],
      isWeixin: true,
      isWeixinBrowser: true,
      popupModel:false,
      value: 1,
      platedata: [],
      keyboardshow: false,
      payPeople: "",
      termSetting:[],
      listshow: false,
      checkboxValue: false,
      projectType: "",
      currProjectName: "",
      Paginations: [],
      title: "",
      isShowMiniWx:false,
      customerInfo: {
          customerName: "",
          ownerCalls: "",
      },
      isShowAlipay:false,
      formModel: {
        fileList: [],
      },
      showTicketHeaderPicker: false,
      formParams: {
        startTime:'',
        endTime:'',
        customerPhone: "",
        resourceMenuId:'',
        resourceName:'',
        contractCategory:'',
      },
      customerId: "",
      customerName: "",
      resourceMenuId: "",
      ticketHeaderIndex: "0",
      invoiceInfo: "",
      receivableAmount: 0,
      selectedCustomerIdsArr: [],
      FeeItems: [],
      userList: [],
      projectId: "",
      memberId: "",
      companyId: "",
      projectCode: "",
      rules: {
        ticketHeaderName: {
          type: "string",
          max: 1,
          required: true,
          message: "请选择发票抬头",
          trigger: ["blur", "change"],
        },
      },
      ticketOptions: [],
      calendarshow: false,
      minDate:null,
      maxDate:null,
      monthNum:24,
      currentDate:null,
      customerIdArr: [],
      calendarendshow: false,
      serialNumber: "",
      type: "",
      payNum: 0,
      payWay: "1",
      payPopup: false,
      payResultPopup: false,
      payStatus: "", //支付状态 空-未支付，0-等待支付 1-支付成功 -1 支付失败
      isClick: true,
      R_openId:'',
      appId:'',
      monthcardSetting:{},
      resourceMenuids:'',
      loading:false,
      mcsettingId:'',
    };
  },
  onShow() {
    uni.$on("addresourceName", (item) => {
      // this.formParams.resourceMenuId = item.resourceMenuId
      //   ? item.resourceMenuId
      //   : this.formParams.resourceMenuId;
      // this.formParams.resourceName = item.resourceName
      //   ? item.resourceName
      //   : this.formParams.resourceName;
      // this.projectId = item.projectId ? item.projectId : this.projectId;
      // this.projectName = item.projectName ? item.projectName : this.projectName;
      // this.getUserByRoomId();
      // this.MonthCardSettingselect();
    });
    // this.title = this.projectName + "-" + this.formParams.resourceName;
    uni.$on("addparkingNumber", (data) => {
      console.log(data); // value1
      this.formParams.parkingNumber = data.parkingNumber;
      this.formParams.parkingId = data.parkingId;
    });
    this.$forceUpdate();
  },
  onLoad(options) {
    this.type = options.type;
    if (this.type != "add"){
      this.serialNumber = options.serialNumber
    }
    if(this.type == "pay"){
      uni.setNavigationBarTitle({
      		title: '支付'
      });
      this.mcsettingId = options.mcsettingId;
    }else if(this.type == "licensePlate"){
      uni.setNavigationBarTitle({
      		title: '修改车牌'
      });
    }else if(this.type == "changeparking"){
      uni.setNavigationBarTitle({
      		title: '变更车位'
      });
    }else if(this.type == "renew"){
      uni.setNavigationBarTitle({
      		title: '续费'
      });
    }else if(this.type == "edit"){
      uni.setNavigationBarTitle({
      		title: '重新提交'
      });
    }
    if(options.form){
      let item = options.form?JSON.parse(options.form):[];
      this.formParams.resourceMenuId = item.resourceMenuId
      this.formParams.resourceName = item.resourceName
      this.resourceMenuids = item.resourceMenuids
      this.projectId = item.projectId 
      this.projectName = item.projectName
      this.title = item.projectName + "-" + item.resourceName;
      this.getUserByRoomId();
      this.MonthCardSettingselect(item.mcsettingId);
    }
    let R_companyId = options.companyId ? options.companyId : "";
    let R_projectType = options.projectType ? options.projectType : "";
    let R_projectId = options.projectId ? options.projectId : "";
    let isWechat = options.isWechat ? options.isWechat : "";
    this.R_openId = options.openId ? options.openId : "";
    // if (R_companyId) {
    //   this.companyId = R_companyId;
    // }
    // if (R_projectType) {
    //   this.projectType = R_projectType;
    // }
    // if (R_projectId) {
    //   this.projectId = R_projectId;
    // }
    if (isWechat) {
      // debugger;
      // this.memberId = R_memberId;
      //从消息推送页面进入，需要先登录
      this.wxMiniLogin();
      // this.getSearchTypeFun(); //获取欠费查询方式接口
      console.log("路由取值" + isWechat);
    } else {
      // 需要授权登录
      const { O_USER_INFO } = this.$constant;
      const { phoneNumber } = util.storageAction({
        key: O_USER_INFO,
        action: "get",
      });
      if (!phoneNumber) {
        uni.navigateTo({ url: "/pages-a/authorization/bindingMobile" });
        return;
      }
      this.initData();
    }
  },
  methods: {
    initData() {
      const { AREA_ID, PROJECT_ID, MEMBER_ID ,O_USER_INFO,OA_APP_ID: configAppId } = this.$constant;
      // this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      // this.projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
      const {PROJECT_TYPE } = this.$appConfig
      this.projectType = PROJECT_TYPE;
     // this.getWechatMsgTemplate()
      let { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
      this.companyId = companyId;
      let userInfo = util.storageAction({ key: O_USER_INFO, action: "get" });
      const { OA_APP_ID } = this.$constant;
      const localAppId = this.$cmMth.storageAction({ key: OA_APP_ID, action: 'get' });
      this.appId = localAppId || configAppId || '';
      const { uniPlatform } = uni.getSystemInfoSync();
      if (uniPlatform === 'mp-weixin' || uniPlatform === 'h5' || uniPlatform === 'web') {
          this.isWeixinBrowser = true;
      } else if (uniPlatform === 'app') {
          this.isWeixinBrowser = false;
      }
      
      let today = new Date()
      this.minDate = new Date(today).setDate(today.getDate()+1)
      // this.formParams.contractCategory = "月保卡合同";
      // this.formParams.contractCategoryId = 555;
      // this.getFeeItemsByCategoryIds();
      if (this.type == "add") {
        this.getUserByRoomId();
        // this.formParams.cardholder = userInfo.fullName;
        this.geProjectList();
        this.getGeneratorSerialNum();
      }else{
        this.getParklotMonthCardDetail()
      }
    },
    //用户登录
    wxMiniLogin() {
      let self = this;
      const { PROJECT_TYPE } = appConfig;
      const { COMPLANY_ID } = appConfig;
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            let params = {
              data: {
                code: res.code,
                // appletId: self.projectType,
                // companyId: self.companyId,
                appletId: PROJECT_TYPE,
                companyId: COMPLANY_ID,
                source: "wxMini",
              },
            };
            appletLogin(params).then((res) => {
              if (res.status == "200") {
                let data = {};
                let obj = res.data;
                // 有手机号码就是授权过，没有则需要授权
                if (res.data.memberPhone) {
                  data = res.data.appMemberJson
                    ? JSON.parse(res.data.appMemberJson)
                    : {};
                  data.wxUserId = res.data.wxUserId;
                } else {
                  data = {
                    companyId: obj.companyId,
                    id: obj.memberId,
                    token: obj.token,
                    wxUserId: obj.wxUserId,
                    nickname: obj.wxUserName,
                  };
                }
                const { token, id, wxUserId } = data;
                // 有手机号码，设置缓存
                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID, PROJECT_ID } =
                  self.$constant;
                const combineData = { ...obj, ...data };
                // 用的是微信小程序登录接口，用mpWeixin方法处理
                const storage = commLogic.setOwerUserInfo(
                  "mpWeixin",
                  combineData
                );
                util.storageAction({
                  key: PROJECT_TYPE,
                  action: "set",
                  value: PROJECT_TYPE,
                });
                util.storageAction({ key: TOKEN, action: "set", value: token });
                util.storageAction({
                  key: MEMBER_ID,
                  action: "set",
                  value: id,
                });
                util.storageAction({
                  key: O_USER_INFO,
                  action: "set",
                  value: storage,
                });
                util.storageAction({
                  key: WX_USERID,
                  action: "set",
                  value: wxUserId,
                });
                util.storageAction({
                  key: PROJECT_ID,
                  action: "set",
                  value: self.projectId,
                });
                self.initData();
              }
            });
          }
        },
      });
    },
    changestartTime() {
      let self = this;
      if(this.type=='detail'||this.type=='pay'||this.type=='edit'||this.type=='renew'){
        return
      }
      if(!self.formParams.contractCategory){
        uni.showToast({
          title: "请先选择收费标准",
          duration: 2000,
          icon: "none",
        });
        return
      }
      self.calendarshow = true;
    },
    calendarconfirm(val) {
      this.formParams.startTime = val[0].replace(/-/g, '/') + "  00:00:00";
      this.calendarshow = false;
      this.formParams.number = 1;
      this.numchange();
    },
    changeendTime() {},
    delplatedata(index) {
      this.platedata.splice(index, 1);
    },
    addplatedata() {
      this.keyboardshow = true;
      this.$refs.keyboards.plate = []
    },
    keyboardclose() {
      this.keyboardshow = false;
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp); // 时间戳为毫秒级别
     
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      // 格式化月份、日期、小时、分钟、秒
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
     
      return year + '-' + month + '-' + day
    },
    getDateAfterMonths(date, months) {
      var newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + months);
      return newDate;
    },
    getDateAfterMonthsnew(date, months) {
      var newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + (months+1),1);
      return newDate;
    },
    numchange(num) {
      if (this.formParams.startTime) {
        let days =  num ? num.value : 1
        var futureDate = this.getDateAfterMonths(this.formParams.startTime,days) ;
        this.formParams.endTime =this.timestampToTime(new Date(futureDate).setDate(futureDate.getDate()-1)).replace(/-/g, '/')  +' 23:59:59'
        var newdays = this.getMonthDiff(this.formParams.startTime.substring(0,7),this.formParams.endTime.substring(0,7))
        // 1月31加一个月到3月2号需判断，月份不相等按2月最后一天计算
        if(days<newdays){
          var futureDate = this.getDateAfterMonthsnew(this.formParams.startTime,days);
          this.formParams.endTime =this.timestampToTime(new Date(futureDate).setDate(futureDate.getDate()-1)).replace(/-/g, '/')  +' 23:59:59'
        }
        this.previewFee(num ? num.value : 1);
        this.$forceUpdate();
      }
    },
    getMonthDiff(date1, date2) {
      var yearDiff = new Date(date2).getFullYear() - new Date(date1).getFullYear();
      var monthDiff = new Date(date2).getMonth() - new Date(date1).getMonth();
      if (new Date(date2).getDate() < new Date(date1).getDate()) {
        monthDiff--;
      }
      return yearDiff * 12 + monthDiff;
    },
    previewFee(num) {
      let self = this;
      self.receivableAmount = 0;
      this.$nextTick(() => {
        let feeList = JSON.parse(JSON.stringify(self.FeeItems));
        feeList.forEach((item) => {
          console.log("item.receivableAmount", item.receivableAmount);
          console.log("num", num);
          item.totalAmount = +item.receivableAmount * num;
          self.receivableAmount += item.totalAmount;
        });
      });
    },
    toselectParkingLot() {
      return
      uni.navigateTo({
        url: "/pages-leasing/monthlyCardApplication/selectParkingLot",
      });
    },
    toparkinglot() {
      if(this.type == 'add'||this.type == 'edit'||this.type == 'changeparking'){
        if(!this.formParams.resourceMenuId){
        this.toastWord({ text: "请选择车场" });
        return
      }
      uni.navigateTo({
        url: "/pages-leasing/monthlyCardApplication/selectParking?resourceMenuId=" + this.resourceMenuids,
      });
      }
    },
    MonthCardSettingselect(mcsettingId) {
      this.monthcardSetting = {}
      let data = {
        resourceMenuId:mcsettingId?'':this.formParams.resourceMenuId,
        mcsettingId: mcsettingId?mcsettingId:'',
      };
      let params = {
        data: data,
      };
      MonthCardSettingselect(params).then((res) => {
        if (res.status == 200 && res.data) {
          this.monthcardSetting =  res.data
          this.termSetting = res.data.termSetting
          if(!this.payPeople){
            if(res.data.customerName){
              if(this.type=='add'){
                // this.formParams.cardholder = res.data.customerName
                this.customerId = res.data.customerId
                this.payPeople = res.data.customerName
              }
            }else{
              this.toastWord({ text: "请联系项目管家配置该车场默认的费用挂靠客户" });
            }
          }
        }else{
          this.toastWord({ text: '当前车场没有月保卡配置，请先前往配置！' });
        }
      });
    },
    tokeyboardshow() {
      let key = ''
      let value = this.$refs.keyboards.plate;
      if(value.length>0){
        value.forEach(item=>{
          if(item){
            key += item
          }
        })
      }
      console.log("key",key)
      this.platedata.push(key);
      this.keyboardshow = false;
    },
    onOpeningDateChange() {
      if (this.formParams.startTime) {
        this.previewFee();
      }
    },
    //根据合同大类获得费项
    getFeeItemsByCategoryIds() {
      if (
        this.formParams.contractCategory &&
        this.formParams.contractCategory != ""
      ) {
        let data = {
          contractCategory: this.formParams.contractCategoryId,
        };
        let params = {
          data: data,
        };
        getParklotMonthCardFeeItemByCategoryId(params).then((res) => {
          if (res.status == 200 && res.data) {
            this.FeeItems = res.data;
            this.onOpeningDateChange();
          }
        });
      }
    },
    geProjectList() {
      let self = this;
      return
      let data = {
        // companyId: 438,
        companyId: self.companyId,
      };
      let params = {
        data: data,
      };
      geProjectsByCompanyId(params).then((res) => {
        if (res.status == 200) {
          if (res.data && res.data.length > 0) {
            self.projectId =self.projectId?self.projectId:res.data[0].projectId;
            self.projectName = res.data.find(
            item => item.projectId == self.projectId 
            ).projectName;
            self.title = self.projectName;
            uni.setStorageSync("DEFAULT_PROJECT_ID", self.projectId);
            self.getParkingLotList();
          }
        } else {
          self.toastWord({ text: res.message });
        }
      });
    },
    //获取车场
    getParkingLotList() {
      let self = this;
      let data = {
        projectId: self.projectId,
      };
      let params = {
        data: data,
      };
      getResourceMenuManger(params).then((res) => {
        if (res.status == 200) {
          if (res.data && res.data.length > 0) {
            self.formParams.resourceMenuId = res.data[0].resourceMenuId;
            self.formParams.resourceName = res.data[0].resourceName;
            self.title = self.title + "-" + res.data[0].resourceName;
            self.MonthCardSettingselect();
          }
        } else {
          self.toastWord({ text: res.message });
        }
      });
    },
    onConfirm(e) {
      console.log("e",e)
      let self = this;
      self.formParams.contractCategoryId = e.value[0].categoryId;
      self.formParams.contractCategory = e.value[0].categoryName;
      self.getFeeItemsByCategoryIds();
      self.listshow = false;
    },
    getGeneratorSerialNum() {
      let data = {
        firstKey: "22",
        secretKey: "jinmao-secretKey",
      };
      var params = {
        data: data,
      };
      generatorSerialNum(params).then((res) => {
        if (res.status == 200) {
          this.serialNumber = res.data;
        }
      });
    },
    getParklotMonthCardDetail(){
      let self = this
      let data = {
        serialNumber: self.serialNumber
        // serialNumber:'YBK2024100114'
      };
      var params = {
        data: data,
      };
      getParklotMonthCardDetail(params).then(res => {
        if (res.status == 200) {
          self.platedata = []
          self.customerId = res.data.customerId
          self.payPeople = res.data.customerName
          self.serialNumber = res.data.serialNumber;
          self.projectId = res.data.projectId;
          uni.setStorageSync("DEFAULT_PROJECT_ID", self.projectId);
          self.projectName = res.data.projectName;
          self.formParams.cardholder = res.data.cardholder;
          self.formParams.customerPhone = res.data.cardholderPhone;
          self.formParams.parkingNumber = res.data.serialnumRParking.parkingNumber;
          self.formParams.parkingId = res.data.serialnumRParking.parkingId;
          self.formParams.resourceMenuId = parseInt(res.data.resourceMenuId)
          self.getUserByRoomId();
          if(self.type=='pay'){
            self.MonthCardSettingselect(self.mcsettingId);
          }else{
            self.MonthCardSettingselect();
          }
          self.formParams.resourceName = res.data.resourceMenuName
          self.title = self.projectName + "-" + self.formParams.resourceName;
          self.resourceMenuids = res.data.ids
          self.formParams.contractCategory = res.data.contractCategoryName
          self.formParams.contractCategoryId = res.data.contractCategory
          self.receivableAmount = res.data.totalAmount
          self.formParams.number = res.data.monthDiff
          if(res.data.vehicleLicenseNumberList.length>0){
            res.data.vehicleLicenseNumberList.forEach(item=>{
              self.platedata.push(item.vehicleLicenseNumber) 
            })
          }
          self.formModel.fileList = []
          if(res.data.fileList&&res.data.fileList.length>0){
            res.data.fileList.forEach(item=>{
              item.url = item.filePath
            })
            self.formModel.fileList = res.data.fileList
          }
          self.FeeItems = res.data.feeitemList;
          if(self.type=='add'||self.type=='pay'||self.type=='detail'||self.type=='edit'){
            self.formParams.startTime = res.data.openingDate.substring(0, 10).replace(/-/g, '/') + '  00:00:00'
            self.formParams.endTime = res.data.endDate.substring(0, 10).replace(/-/g, '/')+ '  23:59:59'
            //  var newdays = self.getMonthDiff(self.formParams.startTime,self.formParams.endTime)
            // self.formParams.number = newdays
            // console.log("newdays",self.formParams.number)
            // self.receivableAmount = res.data.receivableAmount
          }else if(self.type=='renew'){
              const now = new Date(res.data.endDate.substring(0, 10)); // 获取当前时间
              self.formParams.startTime =self.timestampToTime(now.setDate(now.getDate() + 1)).replace(/-/g, '/') + '  00:00:00' ; 
              self.formParams.number = 1;
              self.numchange();
          }
        } else {
          self.$refs.uToast.show({
            type: "default",
            message:res.message,
          });
        }
      })
    },

    //提交
    submit(value) {
      let self = this;
      if(!self.checkboxValue&&(self.type=='add'||value=='pay')){
        self.$refs.uToast.show({
            type: "default",
            message:'请先阅读并同意协议后申请！',
          });
        return
      }
      if(value=='pay' || value=='renew'){
        self.selectPay();
        return
      }
      if(!self.formParams.cardholder){
        self.$refs.uToast.show({
            type: "default",
            message:'请填写客户！',
          });
        return
      }
      if(!self.formParams.customerPhone){
        self.$refs.uToast.show({
            type: "default",
            message:'请填写手机号！',
          });
        return
      }
      if(self.platedata.length==0){
        self.$refs.uToast.show({
            type: "default",
            message:'请填写车辆信息！',
          });
        return
      }
     if(!self.formParams.parkingId&&self.monthcardSetting.fixedParkingSpace==1){
        self.$refs.uToast.show({
            type: "default",
            message:'请选择车位！',
          });
        return
      }
      let vehicleLicenseNumberList = [];
      self.platedata.forEach((item) => {
        vehicleLicenseNumberList.push({
          vehicleLicenseNumber: item,
        });
      });
      if(value=='licensePlate'||value=='changeparking'){
        let data1 = {
              pcFlag : 'APP',
              serialNumber: self.serialNumber,
              fwContractId: '',
              monthInsureCardTypeId: "",
              vehicleLicenseNumberList: JSON.stringify(vehicleLicenseNumberList),
              parkingId : self.formParams.parkingId,
              parkingNum : self.formParams.parkingNumber,
            }
         var params1 = {
           data: data1,
           responseToast: false,
         };
        changeParklotMonthCard(params1).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: "none",
          });
          setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                });
            }, 2000);
        } else {
          // self.$Message.warning(res.message);
          // uni.showToast({ title: res.message, icon: 'none' });
          self.$refs.uToast.show({
            type: "default",
            message: res.message,
          });
        }
      });
      return
      } 
      if(self.FeeItems.length>0){
        self.FeeItems.forEach((item) => {
          item.startDate = self.formParams.startTime.substring(0, 10).replace(/\//g, '-'); // 起始时间
          item.endDate = self.formParams.endTime.substring(0, 10).replace(/\//g, '-'); //  截止日期
        });
      }
      if(self.monthcardSetting.openCardFile==1&&self.monthcardSetting.openCardFileWrite==1&&self.formModel.fileList.length==0){
        self.$refs.uToast.show({
            type: "default",
            message:'请上传附件！',
          });
        return
      }
      if(!self.formParams.contractCategoryId){
        self.$refs.uToast.show({
            type: "default",
            message:'请选择收费标准！',
          });
        return
      }
      if(!self.formParams.startTime){
        self.$refs.uToast.show({
            type: "default",
            message:'请选择开通日期！',
          });
        return
      }
      let data = {
        pcFlag: "APP",
        serialNumber: self.serialNumber,
        memberId: self.memberId,
        cardholder: self.formParams.cardholder,
        cardholderPhone: self.formParams.customerPhone,
        vehicleLicenseNumberList: JSON.stringify(vehicleLicenseNumberList),
        parkingId: self.formParams.parkingId,
        parkingNum: self.formParams.parkingNumber,
        contractCategory: self.formParams.contractCategoryId,
        projectId: self.projectId,
        projectName: self.projectName,
        openingDate: self.formParams.startTime.substring(0, 10).replace(/\//g, '-'),
        endDate: self.formParams.endTime.substring(0, 10).replace(/\//g, '-'),
        receivedAmount: self.receivableAmount,
        companyId: self.companyId,
        // customerId: 17955,
        // customerName: "孙君丽",
        customerName:self.payPeople,
        customerId:self.customerId,
        parkAreaId:self.monthcardSetting.areaId,
        monthInsureCardTypeId: self.monthcardSetting.monthlyCardTypeId,
        resourceMenuId: self.formParams.resourceMenuId,
        feeitemList: JSON.stringify(self.FeeItems),
        fileList: JSON.stringify(self.formModel.fileList),
      };
      if(value=='edit'||value=='add'){
        data.bhFlag = value=='edit'?1:0
      }
      var params = {
        data: data,
        responseToast: false,
      };
      if(value=='add'||value=='edit'){
        commitParklotMonthCardApprove(params).then((res) => {
        if (res.status == 200) {
          if(value=='edit'){
             self.$refs.uToast.show({
                type: "default",
                message: res.message,
              });
             setTimeout(function() {
                 uni.navigateBack({
                    delta: 1 // delta值为1表示返回的页面层数
                  })
              }, 3000);
              self.getWechatMsgTemplate()
             return
          }else{
            self.selectPay();
            self.serialNumber = res.data
          }
        } else {
          // self.$Message.warning(res.message);
          // uni.showToast({ title: res.message, icon: 'none' });
          self.$refs.uToast.show({
            type: "default",
            message: res.message,
          });
        }
      });
      }
      // else if(value=='renew'){
      //   renewalsParklotMonthCard(params).then((res) => {
      //   if (res.status == 200) {
      //     self.selectPay();
      //   } else {
      //     self.$refs.uToast.show({
      //       type: "default",
      //       message: res.message,
      //     });
      //   }
      // });
      // }
    },
    getUserByRoomId() {
      let self = this;
      uni.showLoading({
	    	title: '正在加载中..'
	    })
      let data = {
        projectId: self.projectId,
        memberId: self.memberId,
      };
      let params = {
        data: data,
        hideLoading: true,
      };
      getOwnerByMemberId(params).then((res) => {
        uni.hideLoading();
        if (res.status == 200) {
          self.customerInfo = res.data;
          self.payPeople = res.data.customerName;
          self.customerId = res.data.customerId;
          // self.formParams.cardholder = self.type == "add"?res.data.customerName:self.formParams.cardholder
        } else {
          // self.toastWord({ text: "请联系项目管家配置该车场默认的费用挂靠客户" });
        }
      });
    },
    //关闭弹出层
        closePopup() {
            let self = this;
            self.payPopup = false;
        },
    selectPay() {
      this.payWay = "1";
      this.payPopup = true;
      this.isClick = true;
      const { uniPlatform } = uni.getSystemInfoSync(); //云环境的公众号，默认使用jsapi支付方式
      if (
        this.projectType == 116 ||
        this.currProjectName == "fudanyijia" ||
        this.currProjectName == "qingtehuihao" ||
        this.currProjectName == "jinpeng" ||
        this.currProjectName == "zhongjian" ||
        this.currProjectName == "ZRT" ||
        this.currProjectName == "ZR" ||
        this.currProjectName == "HC" ||
        this.currProjectName == "HJFW" ||
        (this.currProjectName == "YBYS" &&
          this.projectType != 216 &&
          this.projectType != 212 &&
          this.projectType != 220 &&
          uniPlatform != "web" &&
          uniPlatform != "h5") ||
        this.currProjectName == "yun50" ||
        this.currProjectName == "ZZWY" ||
        this.currProjectName == "XXSH" ||
        this.currProjectName == "PGD" ||
        this.currProjectName == "JIAHE" ||
        this.currProjectName == "LCSH" ||
        this.currProjectName == "LZYH" ||
        this.currProjectName == "daren" ||
        uniPlatform == "mp-weixin"
      ) {
        this.isShowMiniWx = true;
        this.payWay = "3";
      } else {
        this.isShowMiniWx = false;
      }
      if (
        this.currProjectName == "wuxiditie" ||
        this.projectName == "dehui" ||
        this.currProjectName == "fudanyijia" ||
        this.currProjectName == "YU_FA_BU" ||
        this.currProjectName == "yufabu" ||
        this.currProjectName == "xinghai" ||
        (!this.isWeixin && this.currProjectName == "zhongjian") ||
        (!this.isWeixin && this.currProjectName == "qingtehuihao") ||
        this.projectType == 116 || //星河湾
        this.projectType == 139
      ) {
        this.isShowAlipay = true;
      } else {
        this.isShowAlipay = false;
      }
      console.log("支付方式" + this.payWay);
    },
    getNum(key, message) {
      var self = this;
      if (!self.isClick) {
        self.toastWord({ text: "正在请求支付，请勿重复点击" });
        return false;
      }
      self.isClick = false;
      let type = ""; //支付方式：0-微信，1-支付宝, 2-银联
      if (self.payWay == "1") {
        type = 0;
      } else if (self.payWay == "2") {
        type = 1;
      } else if (self.payWay == "3") {
        type = 0;
      } else if (self.payWay == "4") {
        type = 2;
      }
      // if (self.formModel.fileList.length > 0) {
      let payPreDepositJson = {
        serialNumber: self.serialNumber, //月保卡流水号,  必传值
        startDate: self.formParams.startTime.substring(0, 10).replace(/\//g, '-'), //开始日期   必传值
        endDate: self.formParams.endTime.substring(0, 10).replace(/\//g, '-'), //结束日期   必传值
        operator: self.memberId, //操作人ID
        operateName: self.payPeople, //操作人名
        amount: self.receivableAmount, //收款金额   必传值
        operateType: self.type == "add"||self.type == "pay" ? 1 : 2, // 1.开卡缴费  2.续卡缴费  必传值
        ybkPayNew: "1", //新的支付方式，默认传1，这个一定要传，不然就默认走老的了。 原来有一个业主端月报卡续费，那个不动。
      };
      var data = {
        // customerId: 17955,
        // customerName: "孙君丽",
        customerId:self.customerId,
        customerName:self.payPeople,
        addrInfo: self.platedata.toString(","),
        paymentAmount: self.receivableAmount,
        // amountType
        projectId: self.projectId,
        payPeople: self.payPeople,
        payChannel: "业主端",
        getNotifyUrl: 1, //获取回调地址
        paymentType: type,
        userName: self.payPeople,
        payPreDepositJson: JSON.stringify(payPreDepositJson),
      };
      let params = {
        data: data,
      };
      getYbkOrderNum(params).then((res) => {
        if (res.status == 200) {
          if (
            (this.payWay == "3" || this.payWay == "2" || this.payWay == "1") &&
            (this.projectType == 146 ||
              this.projectType == 141 ||
              this.projectType == 116 ||
              (this.projectType == 134 &&
                this.currProjectName == "fudanyijia") ||
              this.currProjectName == "ebei-cloud" ||
              this.currProjectName == "zhongjian" ||
              this.currProjectName == "dehui" ||
              this.currProjectName == "aolian" ||
              this.currProjectName == "yueda" ||
              this.currProjectName == "JDWY" ||
              this.currProjectName == "yun50")
          ) {
            let params1 = {
              paymentType: type,
              paymentAmount: this.receivableAmount + "",
            };
            // console.log(res.data, params1, this.payWay, "this.payWay969");
            // this.wxMiniPay(res.data, params1, this.payWay, 1, res.extraData.notifyUrl);
            this.getPayChannelFun(
              res.data,
              params1,
              this.payWay,
              1,
              res.extraData.notifyUrl
            );
          } else {
            this.orderNo = res.data;
            let params1 = {
              paymentType: type,
              paymentAmount: this.receivableAmount + "",
            };
            // this.wxMiniPay(res.data, params1, this.payWay, 0, res.extraData.notifyUrl);
            this.getPayChannelFun(
              res.data,
              params1,
              this.payWay,
              0,
              res.extraData.notifyUrl
            );
          }
        } else {
          this.isClick = true;
          uni.showToast({
            title: "订单上传失败！" + res.message,
            duration: 5000,
            icon: "none",
          });
        }
        // if (res.status == 200) {
        //   self.SKnumber = res.data
        //   self.notifyUrl = res.extraData.notifyUrl
        // } else {
        //   uni.showToast({ title: res.message, icon: "none" });
        // }
      });
      // } else {
      //   uni.showToast({ title: res.message, icon: "none" });
      //   uni.navigateBack({
      //     delta: 1,
      //   });
      // }
    },
    getPayChannelFun(orderNo, params1, payWay, isMerge, notifyUrl) {
      let self = this;
      let assetsId = this.projectId;
      let payType = "";
      if (self.payWay == 2) {
        payType = "zfb";
      } else {
        payType = "wx";
      }
      var params = { pathParams: `/${payType}/${assetsId}` };
      getPayChannel(params).then((res) => {
        if (res.status == 200) {
          let paymentMethod = "";
          if (res.data == "chinaums") {
            paymentMethod = "wxmini";
          } else {
            paymentMethod = "mini";
          }
          this.wxMiniPay(
            orderNo,
            params1,
            payWay,
            isMerge,
            notifyUrl,
            paymentMethod
          );
        } else {
          let paymentMethod = "wxmini";
          this.wxMiniPay(
            orderNo,
            params1,
            payWay,
            isMerge,
            notifyUrl,
            paymentMethod
          );
        }
      });
    },
    wxMiniPay(orderNo, params1, payWay, isMerge, notifyUrl, paymentMethod) {
      //orderNo-订单号, params1-支付方式, payWay-支付方式, isMerge-合并支付标识, notifyUrl-回调地址
      // 小程序支付 接口文档地址
      let self = this;
      const { DOMAIN_PRO } = appConfig;
      let returnUrl = "";
      // returnUrl = DOMAIN_PRO +
      //       "/#/pages-leasing/monthlyCardApplication/myparkingSpot";
      if (this.isWeixinBrowser) {
        let url = location.href;
        if (
          this.currProjectName == "ebei-cloud" ||
          this.currProjectName == "aolian"
        )
         {
          // returnUrl = `https://portal.wuyeface.com/miniPrograms/pages-leasing/monthlyCardApplication/newPayResult.html?source=${
          //   this.currProjectName
          // }&projectType=${this.projectType}&appId=${
          //   this.appId
          // }&url=${encodeURIComponent(
          //   window.location.protocol + "//" + window.location.host
          // )}`;
        } else {
          returnUrl =
            DOMAIN_PRO +
            "/uniwechat/#/pages-leasing/monthlyCardApplication/newPayResult?payModel=jiaofei&paymentType=" +
            params1.paymentType +
            "&orderNo=" +
            orderNo +
            "&paymentAmount=" +
            params1.paymentAmount +
            "&customerId=" +
            this.customerInfo.customerId +
            "&projectId=" +
            this.projectId;
        }
      }
      let expenditureTxt = "";
      let mergeParamsArr = [];
      console.log("isMerge",isMerge)
      if (isMerge == 1) {
        let expenditure = this.$refs.billShowByQuarterRef.feeName;
        let mergeParamsList = this.$refs.billShowByQuarterRef.feeList;
        expenditureTxt = expenditure
          ? Array.from(new Set(expenditure.values())).join(",")
          : "";
        let mergeParamsLists = mergeParamsList
          ? Array.from(mergeParamsList.values())
          : [];

        // 合并支付参数mergeParamsList下的内容，存在assetsId和expenditure完全相同的参数时，应合并成同一个，金额相加
        let mergeParamsObj = {};
        mergeParamsLists.forEach((v) => {
          if (mergeParamsObj.hasOwnProperty(v.assetsId + "-" + v.expenditure)) {
            mergeParamsObj[v.assetsId + "-" + v.expenditure] += v.totalAmount
              ? Number(v.totalAmount)
              : 0;
          } else {
            mergeParamsObj[v.assetsId + "-" + v.expenditure] = v.totalAmount
              ? Number(v.totalAmount)
              : 0;
          }
        });
        for (var key in mergeParamsObj) {
          let keys = key.split("-");
          let assetsId = keys[0];
          let expenditure = keys[1];
          let value = mergeParamsObj[key];
          mergeParamsArr.push({
            assetsId: assetsId,
            expenditure: expenditure,
            totalAmount: value,
          });
        }
      }
      const isApp = commonMethod.isWebViewApp(); //app
      const isMini = process.env.VUE_APP_PLATFORM === "mp-weixin"; //小程序
      const isZGH = process.env.VUE_APP_PLATFORM === "h5"; //公众号
      let tradeType = "";
      if (this.isWeixinBrowser) {
        if (this.payWay == 1) {
          //微信支付
          tradeType = "jsapi";
        } else if (this.payWay == 2) {
          //支付宝
          tradeType = "app";
        } else if (this.payWay == 3) {
          //微信程序支付
          tradeType = paymentMethod;
          // tradeType = "mini";
          // 合创对接的通联小程序收银台支付
          if (this.currProjectName == "HJFW") {
            tradeType = "appletCashier";
          }
        }
      } else {
        if (this.payWay == 1) {
          //微信支付
          // tradeType = "wxmini";
          tradeType = "mini";
        } else if (this.payWay == 2) {
          //支付宝
          if (this.currProjectName == "zhongjian") {
            // 中建三局支付宝走原生
            tradeType = "mini";
          } else {
            tradeType = "app";
          }
        } else if (this.payWay == 3) {
          //微信程序支付
          // tradeType = "wxmini";

          tradeType = paymentMethod; //云测试
          // 合创对接的通联小程序收银台支付
          if (this.currProjectName == "HJFW") {
            tradeType = "h5";
          }
        }
      }
      const { O_USER_INFO } = this.$constant;
      const userInfo = util.storageAction({ key: O_USER_INFO, action: "get" });
      console.log("用户信息" + userInfo.realName, userInfo.fullName);
      var params = {
        model: "ybkparking", //必填 模块：huodong=活动，club=场馆/会所、parking=停车场、printing=打印
        orderNo: orderNo, //必填 业务订单号
        payMethod: payWay == 3 ? "wx" : payWay == 2 ? "zfb" : "wx", //必填 支付类型：wx=微信、zfb=支付宝，yl=银联，common=通用
        tradeType: tradeType, //必填 支付方式：jsapi=微信公众号， mini=银联小程序，wxmini=微信小程序  app=app支付，appletCashier 小程序收银台  h5 h5收银台
        // assetsId:'78201',//必填 资产（项目、园区、单元、楼栋、楼层、房间等）ID
        assetsId: this.projectId, //必填 资产（项目、园区、单元、楼栋、楼层、房间等）ID
        expenditure: expenditureTxt, //费项名称,按费项支付时传入
        merge: isMerge == 1 ? true : false, //合并支付标识，缺省值: false
        mergeParamsList: mergeParamsArr, //{assetsId:'', //资产ID  expenditure:'', //费项名称 totalAmount:'' //分账金额  },//合并支付，分账列表，merge=true时，必传
        expireTime: "", //订单失效时间的 Unix 时间戳，缺省值：30分钟
        returnUrl: returnUrl, //支付完成跳转地址
        notifyUrl: notifyUrl, //上送支付中心回调接口
        totalAmount: util.floatMul(this.receivableAmount, 100), //必填 金额（单位：分）
        // totalAmount:this.payNum*100,//必填 金额（单位：分）
        // body: "", //订单描述
        attach: "", //自定义参数JSON字符串
        thirdJson: "", //三方参数JSON字符串
        userId: this.memberId, //用户ID
        userName: userInfo.realName || userInfo.realName || userInfo.nickname, //用户姓名
      };
      // if (this.roomCodesParams.length > 0) {
      //   params.body =
      //     this.roomCodesParams[0] +
      //     "," +
      //     this.customerInfo.customerName +
      //     "(" +
      //     this.customerInfo.ownerCalls +
      //     ")";
      // } else {
        params.body =
          this.customerInfo.customerName +
          "(" +
          this.customerInfo.ownerCalls +
          ")";
      // }
      let { STRG_openId } = util.storageAction({
        key: O_USER_INFO,
        action: "get",
      });
      if (this.R_openId) {
        params.openId = this.R_openId;
      } else {
        params.openId = STRG_openId;
      }
      console.log("params",params)
      // return
      // params.openId="oN5eq6SA4REP13WSi0geC_hjnZOI"
      getPay2({ data: params }).then((res) => {
        self.loading = false;
        self.payPopup = false;
        let paymentAmount = this.receivableAmount + "";
        if (res.status == 200) {
          if (res.data.type === "ebeipay") {
            if (
              res.data.channel === "chinaums" &&
              res.data.tradeType == "jsapi"
            ) {
              window.location.href = res.data.data;
              return;
            }
            const payArg = JSON.parse(res.data.data);
            if (res.data.tradeType == "appletCashier") {
              this.tyWXPay("appletCashier", payArg.extraData);
              return;
            } else if (res.data.tradeType == "h5") {
              //将接口返回的Form表单显示到页面
              window.location.href = res.data.payInfo;

              return;
            } else if (res.data.tradeType == "jsapi") {
              WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                {
                  appId: payArg.appId, //动态获取初始化请求中返回的pay_info参数中appId值
                  timeStamp: payArg.timeStamp, //动态获取初始化请求中返回的pay_info参数中timeStamp值
                  nonceStr: payArg.nonceStr, //动态获取初始化请求中返回的pay_info参数中nonceStr值
                  package: payArg.package, //动态获取初始化请求中返回的pay_info参数中package值
                  signType: payArg.signType, //动态获取初始化请求中返回的pay_info参数中signType值
                  paySign: payArg.paySign, //动态获取初始化请求中返回的pay_info参数中paySign值
                },
                function (res) {
                  if (res.err_msg == "get_brand_wcpay_request:ok") {
                    uni.showToast({
                      title: "支付成功",
                      duration: 2000,
                      icon: "none",
                    });
                    self.payResultPopup = true;
                    self.payStatus = "1";
                  } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    uni.showToast({
                      title: "支付已取消",
                      duration: 2000,
                      icon: "none",
                    });
                  } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                    uni.showToast({
                      title: "支付失败",
                      duration: 2000,
                      icon: "none",
                    });
                    self.payResultPopup = true;
                    self.payStatus = "-1";
                  }
                }
              );
              return;
            } else if (res.data.channel == "cebpay") {
              wx.navigateToMiniProgram({
                appId: payArg.appId,
                path: payArg.path,
                success(res) {
                  // 打开成功
                },
              });
              return;
            }
            return new Promise((resolve) => {
              uni.getProvider({
                service: "payment",
                success: ({ provider }) => {
                  self.getWechatMsgTemplate()
                  uni.requestPayment({
                    provider,
                    timeStamp: payArg.timeStamp,
                    nonceStr: payArg.nonceStr,
                    package: payArg.package,
                    signType: payArg.signType,
                    paySign: payArg.paySign,
                    success: () => {
                      uni.redirectTo({
                        url:
                          // "/#/pages-leasing/monthlyCardApplication/myparkingSpot"
                          "/pages-leasing/monthlyCardApplication/newPayResult?payModel=jiaofei&paymentType=0&orderNo=" +
                          orderNo +
                          "&paymentAmount=" +
                          paymentAmount +
                          "&customerId=" +
                          this.customerId +
                          "&projectId=" +
                          this.projectId,
                      });
                      resolve({ success: true, data: "success" });
                    },
                    fail: (err) => {
                      uni.showToast({
                        title: "支付已取消",
                        duration: 2000,
                        icon: "none",
                      });

                      resolve({ success: false });
                    },
                  });
                },
              });
            });
          }
          if (res.data.payChannel === "chinaums") {
            const payArg = JSON.parse(res.data.payInfo);
            return new Promise((resolve) => {
              uni.getProvider({
                service: "payment",
                success: ({ provider }) => {
                  self.getWechatMsgTemplate()
                  uni.requestPayment({
                    provider,
                    timeStamp: payArg.timeStamp,
                    nonceStr: payArg.nonceStr,
                    package: payArg.package,
                    signType: payArg.signType,
                    paySign: payArg.paySign,
                    success: () => {
                      uni.redirectTo({
                        url:
                        // "/#/pages-leasing/monthlyCardApplication/myparkingSpot"
                          "/pages-leasing/monthlyCardApplication/newPayResult?payModel=jiaofei&paymentType=0&orderNo=" +
                          orderNo +
                          "&paymentAmount=" +
                          paymentAmount +
                          "&customerId=" +
                          this.customerId +
                          "&projectId=" +
                          this.projectId,
                      });
                      resolve({ success: true, data: "success" });
                    },
                    fail: (err) => {
                      uni.showToast({
                        title: "支付已取消",
                        duration: 2000,
                        icon: "none",
                      });

                      resolve({ success: false });
                    },
                  });
                },
              });
            });
          }
        } else {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: "none",
          });
        }
      });
    },
    confirmClick() {
            this.payResultPopup = false;
            this.payStatus = "";
            setTimeout(() => {
                // location.reload();
                // uni.redirectTo({
                //     url: '/pages-leasing/paymentinfo/newPaymentCenter'
                // });
                var pages = getCurrentPages(); //获取所有页面的数组对象
                var currPage = pages[pages.length - 1]; //当前页面
                uni.redirectTo({
                    url: currPage.__page__ ? currPage.__page__.fullPath : currPage.$page.fullPath
                })
            }, 50);
        },
        chinaumsPayFun(skNum, params1) {
            let self = this;
            // let url = location.href;
            let returnUrl = "";
            let notifyUrl = "";
            const { DOMAIN_PRO } = appConfig;
            // returnUrl = DOMAIN_PRO +
            // "/#/pages-leasing/monthlyCardApplication/myparkingSpot"
            if (this.isWeixinBrowser) {
                returnUrl =
                    DOMAIN_PRO +
                    "/uniwechat/#/pages-leasing/monthlyCardApplication/newPayResult?payModel=jiaofei&paymentType=" +
                    params1.paymentType +
                    "&orderNo=" +
                    skNum +
                    "&paymentAmount=" +
                    params1.paymentAmount +
                    "&customerId=" +
                    this.customerInfo.customerId +
                    "&projectId=" +
                    this.projectId;
            }
            notifyUrl = ` ${DOMAIN_PRO}/leasing/chargeReceivableOnline/notifyPaymentRecord`;
            const isApp = commonMethod.isWebViewApp()
            const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin'
            const isZGH = process.env.VUE_APP_PLATFORM === 'h5'
            let paymentType = "";
            let paymentCode = "";
            if (this.isWeixinBrowser) {
                paymentType = "3";
                paymentCode = "1";
                if (self.payWay == "2") {
                    paymentType = "4";
                    paymentCode = "2";
                }
                // 微信小程序业主端
                if (isMini) {
                    paymentType = "7";
                    paymentCode = "1";
                }
            } else {
                if (self.payWay == "1") {
                    if (
                        self.currProjectName == "dehui" ||
                        self.projectType == 115
                    ) {
                        paymentType = "6";
                    } else {
                        paymentType = "5";
                    }
                    paymentCode = "1";
                } else if (self.payWay == "2") {
                    paymentCode = "2";
                } else if (self.payWay == "3") {
                    paymentCode = "1";
                    // paymentType = "7";  //生产
                    paymentType = "6";  //云测试
                }
            }
            let data = {
                orderNo: skNum,
                totalAmount: this.receivableAmount + "",
                projectId: self.projectId,
                // bodyMessage: "物业缴费",
                paymentType: paymentType, //缴费方式(1-二维码，2-pos机，3-微信公众号,4-H5支付,5-APP,6-银联小程序，7-微信小程序，8-公对公转账)
                paymentCode: paymentCode, //支付类型（1-微信，2-支付宝，3-通用）
                returnUrl: returnUrl, //支付完成跳转地址
                // openId: localStorage.openId,
                notifyUrl: notifyUrl //支付中心回调业务系统地址
            };
            // if (this.roomCodesParams.length > 0) {
            //     data.bodyMessage = this.roomCodesParams.join(",") + ","
            //         + this.customerInfo.customerName + "(" + this.customerInfo.ownerCalls + ")"
            // } else {
                data.bodyMessage = this.customerInfo.customerName + "(" + this.customerInfo.ownerCalls + ")"
            // }

            const { O_USER_INFO } = this.$constant;
            let { STRG_openId } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            if (this.R_openId) {
                data.openId = this.R_openId;
            } else {
                data.openId = STRG_openId;
            }
            let logContent = "唤起支付参数:" + JSON.stringify(data)
            var logParams = {
                orderNo: skNum,
                logContent: logContent
            }
            saveLog({ data: logParams });
            self.loading = true;
            chinaumsPay({ data: data }).then(res => {
                self.loading = false;
                self.payPopup = false;
                if (res.status == 200) {
                    if (this.isWeixinBrowser) {
                        if (isMini && paymentType == 7) {
                            const { PAY_ORIGINAL_ID } = this.$appConfig;
                            if (window.EbeiPlugins) {
                                // 小程序支付版本wxPaymentVersion：  1:粤澳支付版本，2：通用小程序支付版本
                                window.EbeiPlugins.launchWechatMP(
                                    {
                                        userName: PAY_ORIGINAL_ID, //小程序原始id
                                        path: `pages/WeChatPay/WeChatPay?wxPaymentVersion=2&params=${payInfo}`, //小程序页面路径
                                        type: '0', //小程序版本 0 1 2 分别是 正式 开发 体验
                                        extMsg: '',
                                    },
                                    (success) => {
                                        // uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${payOrderSn}` });
                                    },
                                    (failure) => {
                                        uni.showToast({
                                            title: "小程序支付跳转失败",
                                            duration: 2000,
                                            icon: 'none'
                                        })
                                        this.toastTips({ message: '小程序支付跳转失败' });
                                    }
                                );
                            } else {
                                uni.showToast({
                                    title: "缺少EbeiPlugins.launchWechatMP",
                                    duration: 2000,
                                    icon: 'none'
                                })
                            }
                        } else if (res.data.payChannel === "chinaums") {
                            //公众号支付
                            if (self.payWay == "4") {
                                //公对公转账
                            } else {
                                //银联商务
                                window.location.href = res.data.payInfo;
                            }
                        } else if (res.data.payChannel == "ebeipay") {
                            //  一碑
                            if (self.companyId == "200" || self.currProjectName == "YU_FA_BU") {
                                //朗悦公司、云测试唤起微信jsapi支付
                                var payInfo = JSON.parse(res.data.payInfo);
                                WeixinJSBridge.invoke(
                                    "getBrandWCPayRequest",
                                    {
                                        appId: payInfo.appId, //动态获取初始化请求中返回的pay_info参数中appId值
                                        timeStamp: payInfo.timeStamp, //动态获取初始化请求中返回的pay_info参数中timeStamp值
                                        nonceStr: payInfo.nonceStr, //动态获取初始化请求中返回的pay_info参数中nonceStr值
                                        package: payInfo.package, //动态获取初始化请求中返回的pay_info参数中package值
                                        signType: payInfo.signType, //动态获取初始化请求中返回的pay_info参数中signType值
                                        paySign: payInfo.paySign //动态获取初始化请求中返回的pay_info参数中paySign值
                                    },
                                    function (res) {
                                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                                            uni.showToast({
                                                title: "支付成功",
                                                duration: 2000,
                                                icon: 'none'
                                            })
                                            self.payResultPopup = true;
                                            self.payStatus = "1";
                                        }
                                    }
                                );
                            } else {
                                window.location.href = res.data.payInfo;
                            }
                        } else if (res.data.payChannel === "swiftpass") {
                            //全付通
                            var payInfo = JSON.parse(res.data.payInfo);
                            WeixinJSBridge.invoke(
                                "getBrandWCPayRequest",
                                {
                                    appId: payInfo.appId, //动态获取初始化请求中返回的pay_info参数中appId值
                                    timeStamp: payInfo.timeStamp, //动态获取初始化请求中返回的pay_info参数中timeStamp值
                                    nonceStr: payInfo.nonceStr, //动态获取初始化请求中返回的pay_info参数中nonceStr值
                                    package: payInfo.package, //动态获取初始化请求中返回的pay_info参数中package值
                                    signType: payInfo.signType, //动态获取初始化请求中返回的pay_info参数中signType值
                                    paySign: payInfo.paySign //动态获取初始化请求中返回的pay_info参数中paySign值
                                },
                                function (res) {
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        uni.showToast({
                                            title: "支付成功",
                                            duration: 2000,
                                            icon: 'none'
                                        })
                                        self.payResultPopup = true;
                                        self.payStatus = "1";
                                    }
                                }
                            );
                        } else if (res.data.payChannel === "mbupay") {
                            //兴业银行 目前未对应
                        }
                    } else {
                        //App支付
                        var payInfo = res.data.payInfo;
                        if (res.data.payChannel === "chinaums") {
                            //银联商务 未对应App支付
                            if (self.payWay == "1") {
                                //微信支付
                                // payInfo = payInfo.payInfo
                            } else if (self.payWay == "2") {
                                //支付宝支付'
                                payInfo =
                                    "alipayqr://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=" +
                                    payInfo;
                            } else if (self.payWay == "3") {
                                const payArg = JSON.parse(res.data.payInfo)
                                return new Promise(resolve => {
                                    uni.getProvider({
                                        service: 'payment',
                                        success: ({ provider }) => {
                                            uni.requestPayment({
                                                provider,
                                                timeStamp: payArg.timeStamp,
                                                nonceStr: payArg.nonceStr,
                                                package: payArg.package,
                                                signType: payArg.signType,
                                                paySign: payArg.paySign,
                                                success: () => {
                                                    resolve({ success: true, data: 'success' })
                                                },
                                                fail: err => {
                                                    uni.showToast({
                                                        title: "支付已取消",
                                                        duration: 2000,
                                                        icon: 'none'
                                                    })

                                                    resolve({ success: false })
                                                }
                                            })
                                        }
                                    })
                                })
                            }
                        } else if (res.data.payChannel === "swiftpass") {
                            //全付通 不区分微信或支付宝
                            payInfo = JSON.stringify(payInfo);
                        } else if (res.data.payChannel === "ebeipay") {
                            //一碑支付中心
                            if (self.payWay == "2") {
                                payInfo =
                                    "alipayqr://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=" +
                                    payInfo;
                            } else if (self.payWay == "1") {
                                // payInfo = JSON.stringify(payInfo)
                            }
                            this.openAppToPay(self.payWay, payInfo, "chinaums");
                            return;
                        } else if (res.data.type === "mbupay") {
                            //兴业银行
                            if (self.payWay == 1) {
                                //微信支付
                                payInfo = payInfo.payInfo;
                            } else if (self.payWay == 2) {
                                //支付宝支付
                                payInfo =
                                    "alipayqr://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=" +
                                    payInfo.codeUrl;
                            }
                        }
                        this.openAppToPay(self.payWay, payInfo, res.data.payChannel);
                    }
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 2000,
                        icon: 'none'
                    })
                    this.payPopup = false;
                }
            })
                .catch(error => {
                    let logContent = "唤起支付失败,唤起支付参数:" + JSON.stringify(data)
                    var logParams = {
                        orderNo: skNum,
                        logContent: logContent
                    }
                    saveLog({ data: logParams })
                    console.log(error);
                    self.loading = false;
                });
        },
        openAppToPay(payType, url, payChannel) {
            let self = this;
            try {
                EbeiPlugins.payByApp(
                    payType,
                    url,
                    payChannel,
                    function onSuccess() {
                        self.payResultPopup = true;
                        self.payStatus = "0";
                        self.payPopup = false;
                    },
                    function onFailure() {
                        var appName =
                            payType === "1" ? "微信" : payType === "2" ? "支付宝" : "银联";
                        self.$vux.toast.show({
                            type: "text",
                            text: "无法打开" + appName + "，请确认是否安装" + appName,
                            position: "bottom"
                        });
                    }
                );
            } catch (e) {
                console.log(JSON.stringify(e));
            }
        },

        // 支付宝支付
        alipayPayment(params, payWay) {
            let self = this;
            let data = {
                params: params,
            }
            getPay2(data).then(res => {
                if (res.status == 200) {
                    if (res.data.tradeType == "mini") {
                        let payInfo = res.data.data;
                        this.openAppToPay(payWay, payInfo, "chinaums");
                    } else {
                        let payInfo = res.data.data;
                        payInfo =
                            "alipayqr://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=" +
                            payInfo;
                        this.openAppToPay(payWay, payInfo, "chinaums");
                    }
                }
            })
        },

    // 通联收银台支付
      tyWXPay(tradeType, extraData) {
          console.log('传递', extraData)
          if (tradeType == 'appletCashier') {
              wx.openEmbeddedMiniProgram({
                  appId: 'wxef277996acc166c3',
                  extraData: JSON.parse(extraData)
              })
          }
      },
    openafile(item){
      console.log("item",item)
      // uni.navigateTo({url: `/pages-leasing/pdfDemo/pdfView?URL=${item.termFile}`})
      // return
       uni.showLoading({
			title: '正在加载中..'
		})
		uni.downloadFile({
			url: item.termFile,
			success: function(res) {
        console.log('res',res);
				var filePath = res.tempFilePath;
				uni.openDocument({
					filePath: filePath,
					showMenu: true,
					success: function(res) {
						console.log('打开文档成功');
						uni.hideLoading()
					},
				});
			},
			complete: function(r) {
				uni.hideLoading()
			}
		});
      // uni.openDocument({
			// 		filePath: item.termFile,
			// 	  fileType: 'pdf',
      //     success: function (res) {
      //         // console.log('打开文档成功');
      //     },
      //     fail: function (err) {
      //         console.log('打开文档失败', err);
      //     }
			// 	});
    },

    getlistPagination() {
      if(this.type=='detail'||this.type=='pay'||this.type=='edit'){
        return
      }
      // this.formParams.contractCategoryId = 1540;
      // this.formParams.contractCategory = "车位合同（资产公司）"
      // return
      this.listshow = true;
      this.Paginations = [];
      var data = {
        projectId: this.projectId,
        contractType: "2",
        resourceMenuId:this.formParams.resourceMenuId,
      };
      var params = {
        data: data,
      };
      getOwnerContractCategoryList(params).then((res) => {
        if (res.status == 200) {
          this.Paginations = res.data;
          // this.Paginations[0].push(
          //   {
          //     categoryId:res.data.categoryId,
          //     categoryName:res.data.categoryName
          //   }
          // )
        }else{
        }
      });
    },
    // 删除图片
    deletePic(event) {
      this.formModel.fileList.splice(event.index, 1);
    },
    // 新增图片
    async afterRead(event) {
      console.log("event", event);
      const { code } = await commLogic.permissionCheckAndAlert({
        permissionKeys: ["camera", "readStorage"],
      });
      if (code !== 1 && code !== -2) {
        return;
      }
      const fileList = {
        ...event.file,
        status: "uploading",
        message: "上传中",
      };
      this.formModel.fileList.push(fileList);

      const res = await uploadMutiFile(fileList.url);
      const fileInfo = res.fileInfo;
      if (!fileInfo) {
        uni.showToast({ title: res.msg, icon: "none" });
        return;
      }
      let lastIndex = this.formModel.fileList.length - 1;
      let item = this.formModel.fileList[lastIndex];
      this.formModel.fileList.splice(lastIndex, 1, {
        ...item,
        filePath: fileInfo.resPath,
        fileId: fileInfo.fid,
        fileName: fileInfo.fName,
        status: "success",
        message: "",
      });
    },
    getWechatMsgTemplate(){ 
		let that = this;
		let tparams = {
				data: {
					tokenId: that.projectType,//小程序ID
					bizType: 'YBK',//模板类别  模板组需要后台在tbw_template_group_config表配置,根据配置表中的模板类别获取模板组
				},
				hideLoading: true,
				responseToast: false
			}
			getSubscribeTemplateGroup(tparams).then(res => {
				if(res.status  == 200){
					let code = res.data.map(m=>{
						return m.modelCode
					})
					console.log('模板',code);
 						// #ifdef MP-WEIXIN
						uni.requestSubscribeMessage({
							tmplIds: code,
							success(succ) {

							},
							fail(err) {
								console.log('消息订阅错误信息', err);
							},
							complete() {
								// that.toIndex()
							}
						})
						// #endif
  						 
				}else{
					// that.submitSuccess = true;
				}
			 
			})
	  },

    // 提示文字
    toastWord(params) {
      const { text } = params;
      if (!text) return;
      // this.$vux.toast.show({
      //   type: 'text',
      //   text: text,
      //   position: 'middle',
      //   width: " 17em",
      // })
      uni.showToast({ title: text, icon: "none" });
    },
  },
};
</script>

<style lang="scss" scoped>
.uni-page-body {
  background-color: #f5f5f5 !important;
}
.page-height {
  // height: 100vh;
  height: calc(100vh - 300rpx);
  margin-bottom:250rpx
  // margin-top: 10rpx !important;
  // margin-bottom: 200rpx !important;
}
.page {
  // height: 100vh;
  padding-top: 30rpx;
  overflow-x: hidden;
  background-color: #f5f5f5;
  ::v-deep .u-form {
    padding: 0 16px;
    background-color: #fff;
  }
}
.topbg {
  width: 96%;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 14rpx;
  background-color: #fff;
  position: relative;
  left: 2%;
  right: 2%;
}
.topbg-text1 {
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
  position: relative;
  top: -5px;
  left: 20rpx;
}
.topbg-text2 {
  float: right;
  color: #333333;
  font-size: 26rpx;
  margin-right: 10rpx;
}
.topbg-image {
  width: 45rpx;
  height: 45rpx;
  margin-top: 30rpx;
  margin-left: 30rpx;
}
.centerbg31 {
  width: 96%;
  // min-height: 310rpx;
  border-radius: 14rpx;
  background-color: #fff;
  margin-top: 60rpx;
  margin-left: 2%;
  margin-right: 2%;
}

.centerbg3 {
  width: 96%;
  // min-height: 310rpx;
  border-radius: 14rpx;
  background-color: #fff;
  margin-top:25rpx;
  margin-left: 2%;
  margin-right: 2%;
}
.centerbg0 {
  width: 96%;
  // min-height: 510rpx;
  // line-height: 500rpx;
  border-radius: 14rpx;
  background-color: #fff;
  margin-top: 20rpx;
  margin-left: 2%;
  margin-right: 2%;
}
.centerbg {
  width: 96%;
  min-height: 510rpx;
  // line-height: 500rpx;
  border-radius: 14rpx;
  background-color: #fff;
  // margin-top: 20rpx;
  margin-left: 2%;
  margin-right: 2%;
  // position: relative;
  // left: 2%;
  // right: 2%;
}
.centerbg-text {
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
  position: relative;
  top: 20rpx;
  left: 20rpx;
}
.centerbg-img {
  width: 100rpx;
  height: 8rpx;
  position: relative;
  top: 45rpx;
  left: -110rpx;
}
.centertext {
  position: relative;
  top: 50rpx;
}
// .bggray ::v-deep .u-form-item__body__right {
//   background-color: #f6f6f6 !important;
//   padding: 10rpx;
//   border-radius: 14rpx;
// }
::v-deep .u-form-item__body__left__content__label,
.u-form-item__body__right {
  font-size: 28rpx !important;
  margin-left: 25rpx;
  color: #333333;
  font-weight: Regular;
}
::v-deep .u-form-item__body__left__content__required {
  position: absolute0;
  left: -9rpx;
}
::v-deep .u-button--primary {
  border-radius: 14rpx;
  // background-color: #74c260 !important;
  // color: #ffffff;
}
.imagebg {
  width: 100%;
  position: relative;
  left: 70%;
  & > text {
    position: relative;
    right: -40%;
  }
}
.ulbg {
  width: 90%;
  // background-color: #666666;
  // position: relative;
  // top: 2rpx;
  // margin-left: 10rpx;
  & > ul {
    list-style-type: none;
    padding: 0; /* 清除padding */
    margin: 0; /* 清除margin */
    // width: 100%;
    
    & > li {
      color: #333333;
      width: 50%;
      // margin-left: 40rpx;
      // & > text {
      //    color: #333333;
      //   //  width: 50%;
      //    // margin-left: 40rpx;
      //  }
    }
  }
}
#liicon {
  // width: 20%;
  // position: relative;
  // right: -150rpx;
  // top: -30rpx;
  // margin-left: 150rpx;
  // margin-top: -30rpx;
  // transform: translateX(100%);
}
.ul-img1 {
  width: 35rpx;
  height: 32rpx;
  line-height: 32rpx;
  position: absolute;
  right: 40rpx;
}
.ul-img {
  // float: right;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  // position: absolute;
  // top: 3rpx;
}
.imgview {
  width: 600rpx;
  height: 300rpx;
  border-radius: 14rpx;
  background-color: #f2f2f2;
  margin-left: 10%;
}
.centerbg-upload {
  width: 100%;
  margin-top: 70rpx;
}
.centerbg-img5 {
  width: 100rpx;
  height: 80rpx;
  margin-top: 17%;
  margin-left: 40%;
}
.texts {
  width: 100%;
  text-align: center;
  padding: 20rpx;
}
.textred {
  font-size: 26rpx;
  color: #ff0000;
  font-weight: bold;
}
.savebtn {
  position:absolute;
  top: 70%;
  left: 10%;
  // background-color: white;
  width: 80%;
  height: 80rpx;
}
.addcar {
  color: #333333;
  font-weight: bold;
  position: relative;
  top: 20rpx;
  left: 20rpx;
  font-size: 26rpx;
}
.addkeyboard {
  position: relative;
  top: 40rpx;
  height: 100rpx;
}
.addkeysubmit{
  padding: 20rpx 200rpx;
  position: relative;
  top: 90rpx;
  left: 14%;
  color: #fff;
  background: var(--app-primary-color);
  border-radius: 14rpx;
}
.payPopupStyle {
  padding-top: 45px;
  height: 45vh;
}

.payPopupStyle ::v-deep .u-cell-group {
  border-top: 1px solid #f3f3f3;
}

.payPopupStyle ::v-deep .u-cell {
  border-bottom: 1px solid #f3f3f3;
}
.btn-cont {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 68rpx;
  line-height: 68rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  background: var(--app-primary-color);
}
.pay-result-container {
  padding: 28px 0;
  background: white;
  //   margin: 0px 50px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
}

.pay-result-title {
  color: #333333;
  margin-top: 10px;
  font-size: 15px;
}

.pay-result-tips {
  color: #666666;
  margin: 15px 0px;
  font-size: 12px;
}
.my_order_detail_result-confirm-button {
  width: 120px;
  text-align: center;
  background: var(--app-primary-color);
  height: 34px;
  line-height: 34px;
  color: white;
  border-radius: 3px;
  font-size: 14px;
}
.wait-pay-tips {
  margin: 25px 0px;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: center;
  color: white;
  margin-top: 15px;
  border-top: 1px solid #ccc;
}

.my_order_detail_unpay-button {
  color: #333;
  width: 50%;
  padding: 12px 0;
}

.my_order_detail_paied-buttton {
  color: var(--app-primary-color);
  border-left: 1px solid #ccc;
  width: 50%;
  padding: 12px 0;
}
.uploaddata{
    margin-top: 60rpx;
    margin-left: 20rpx
}
.uploadetail{
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  padding-top: 60rpx;
}
.uploaddatadetail{
  //  margin-top: 60rpx;
  //  margin-left: 20rpx
}
.pNclass{
  width: 90%;
  position: relative;
  top: 2rpx;
  color:#333333;
  text-align: left;
}
.pNclass1{
  width: 100%;
  position: relative;
  // top: 2rpx;
  color:#333333;
  text-align: right;
}
.pNclass1width{
  width: 90%;
}
.pNicon{
  width: 35rpx;
  height: 32rpx;
  line-height: 32rpx;
  position: absolute;
  right: -40rpx;
  top: 5rpx;
}
.pNicon1{
  width: 35rpx;
  height: 32rpx;
  line-height: 32rpx;
  position: absolute;
  right: 40rpx;
}
.Iknow{
  padding-top: 20rpx;
}
.monthnumber{
  text-align: right;
}
.termNameclass{
  color: #2761FF;
  font-size: 27rpx;
  padding: 0 10rpx;
}
</style>










