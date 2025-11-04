<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="page">
            <u-sticky bgColor="#fff" style="top: 0px;">
                <view class="contactCustomerStyle" @click.native="selectAddress">
                    <u-icon name="account" size="20"></u-icon>
                    <view class="customerInfoStyle">
                        <view>姓名：{{ customerInfo.customerName }}</view>
                        <view class="flexStyle">
                            <view>电话：{{ customerInfo.ownerCalls }}</view>
                            <view v-if="searchType == 1">房间：{{ roomCode }}</view>
                        </view>
                    </view>
                    <u-icon v-if="searchType == 1" name="arrow-right" size="16" color="#969799"></u-icon>
                </view>
                <u-tabs :list.sync="tabsList" :current="tabsIndex" :scrollable="false" :lineColor="THEME_COLOR"
                    lineWidth="380rpx" @change="onTabsChange"></u-tabs>
            </u-sticky>

            <!--账单-->
            <bill-record ref="billRecordRef" :customerId="customerInfo.customerId" v-if="tabsIndex == '0'"
                :customerIdArr="customerIdArr" :searchType="searchType" :roomIds="selectRoomIds"
                :projectId="projectId"></bill-record>

            <view v-if="tabsIndex == '1'">
                <view class="arrCell">
                    <view class="text-center">缴费合计</view>
                    <view class="text-center" style="padding:10rpx 0">
                        <text class="num new-family" style="margin:0;padding:0">{{ payNum }}</text>
                        <text class="unit" style="margin:0;padding:0">元</text>
                    </view>
                    <view class="integralInfoRefs" v-show="isShowIntegralTips" style="height: 62px">
                        <view class="integralInfoStyle">
                            <text>{{integralRuleInfo.prefixTips}}</text>
                            <text style="color: #ff3300;">{{integralRuleInfo.suffixTips}}</text>
                        </view>
                        <view class="integralInfoStyle" style="margin-top: 10px;">
                            <text>{{integralRuleInfo.validityDate}}</text>
                        </view>
                    </view>
                </view>
                <billShowByQuarter ref="billShowByQuarterRef" :customerId="customerInfo.customerId"
                    :depositType="depositType" :roomIds="selectRoomIds" :isDisabled="isDisabled"
                    :customerIdArr="customerIdArr" :searchType="searchType"
                    :projectId="projectId" :isShowIntegralTips="isShowIntegralTips"
                    @sendNumFun="getPayNum"></billShowByQuarter>
                <view class="footerBtn" style="margin: 0;">
                    <view>
                        <text class="confirmBtnStyle" @click="checkBillDetailData()">马上缴费</text>
                    </view>
                    <view>
                        <text class="plainBtnStyle" @click="goPayHistory()">缴费历史</text>
                    </view>
                </view>
            </view>

            <u-popup :show="payPopup" mode="bottom" :closeable="true" @close="closePopup">
                <view class="payPopupStyle">
                    <u-radio-group v-model="payWay">
                        <u-cell-group :border="false">
                            <u-cell clickable :border="false" v-if="!isShowMiniWx" @click="payWay = '1'">
                                <view slot="title" class="u-slot-title">
                                    <view style="text-align:left;display: flex;">
                                        <text>微信支付</text>
                                        <u-icon name="weixin-fill" size="24" color="rgb(7, 193, 96)"
                                            style="vertical-align: middle;margin-left: 24rpx;" />
                                    </view>
                                </view>
                                <template #right-icon>
                                    <u-radio name="1" />
                                </template>
                            </u-cell>
                            <u-cell clickable :border="false" @click="payWay = '3'" v-if="isShowMiniWx">
                                <view slot="title" class="u-slot-title">
                                    <view style="text-align:left;display: flex;">
                                        <text>微信支付</text>
                                        <u-icon name="weixin-fill" size="24" color="rgb(7, 193, 96)"
                                            style="vertical-align: middle;margin-left: 24rpx;" />
                                    </view>
                                </view>
                                <template #right-icon>
                                    <u-radio name="3" />
                                </template>
                            </u-cell>
                            <u-cell clickable :border="false" @click="payWay = '2'" v-if="isShowAlipay">
                                <view slot="title" class="u-slot-title">
                                    <view style="text-align:left;display: flex;">
                                        <text>支付宝支付</text>
                                        <u-icon name="zhifubao" size="24" color="#1989fa"
                                            style="vertical-align: middle;margin-left: 24rpx;" />
                                    </view>
                                </view>
                                <template #right-icon>
                                    <u-radio name="2" />
                                </template>
                            </u-cell>
                            <u-cell clickable :border="false" @click="payWay = '4'" v-if="isShowBToB">
                                <view style="text-align:left;display: flex;">
                                    <text>对公转账</text>
                                    <u-icon name="B2B" size="24" color="#1989fa"
                                        style="vertical-align: middle;margin-left: 24rpx;" />
                                </view>
                                <template #right-icon>
                                    <u-radio name="4" />
                                </template>
                            </u-cell>
                        </u-cell-group>
                    </u-radio-group>
                    <view class="btn-cont">
                        <view v-if="isClick" @click="getNum">立即支付</view>
                        <view v-if="!isClick">支付中...</view>
                    </view>
                </view>
            </u-popup>
        </view>

        <u-popup :show="payResultPopup" mode="center">
            <view class="pay-result-container" style="padding: 0 0 0 0;" v-if="payStatus === '0'">
                <p class="wait-pay-tips">正在支付……</p>
                <view class="button-container">
                    <view class="my_order_detail_unpay-button" @click.stop="notPayClick">
                        尚未支付
                    </view>
                    <view class="my_order_detail_paied-buttton" @click.stop="alreadyPayClick">
                        我已支付
                    </view>
                </view>
            </view>
            <div class="pay-result-container" v-if="payStatus === '1'">
                <u-icon name="checkmark-circle" size="22" color="var(--app-primary-color)"></u-icon>
                <div class="pay-result-title">支付成功</div>
                <div class="pay-result-tips">请点击确定按钮，返回上一级！</div>
                <div class="my_order_detail_result-confirm-button" @click.stop="confirmClick">
                    确定
                </div>
            </div>
            <div class="pay-result-container" v-if="payStatus === '-1'">
                <u-icon name="close-circle" size="22" color="#ff3c3c"></u-icon>
                <div class="pay-result-title">支付失败</div>
                <div class="pay-result-tips">请重新进入，进行支付！</div>
                <div class="my_order_detail_result-confirm-button" @click.stop="confirmClick">
                    确定
                </div>
            </div>
        </u-popup>

    </view>
</template>

<script>
import commLogic from '@/js/comm-logic';
import appConfig from '@/app-config';
import commonMethod from '@/js/commonMethod'
import {
    getOwnerByMemberId,     //查询会员信息
    getOwnerRoomByMemberId,  //通过会员ID获取业主信息以及房间信息
    getSearchType, //获取欠费查询方式接口
    checkBillDetailRecordForCharge, //账单核销先检查数据
    getOrderNum,
    chinaumsPay, //付款
    saveLog,
    cancelChargePayOrder,
} from "@/service/leasing.js";
import {
    findLocations,
    getPay2,
    appletLogin,
    getPayChannel,
    tipsBeforePay,   //业主端缴费增加相关积分规则提示
} from '../../service/community'
import util from "../../js/utils";
import billRecord from "./components/billRecord.vue";
import billShowByQuarter from "./components/billShowByQuarter.vue";
export default {
    name: "newPaymentCenter",
    components: {
        "bill-record": billRecord, //账单
        billShowByQuarter,
    },
    data() {
        return {
            tabsList: [
                { name: '账单' },
                { name: '缴费' }
            ],
            tabsIndex: 0,  //0-账单，1-缴费
            customerInfo: {
                customerName: "",
                ownerCalls: "",
            },
            payNum: 0,
            payWay: "1",
            payPopup: false,
            roomCodesArr: [],
            payResultPopup: false,
            payStatus: "", //支付状态 空-未支付，0-等待支付 1-支付成功 -1 支付失败
            isClick: true,
            roomCodesParams: [],
            depositType: "0", //保证金费项(固定传‘3’)
            isShowMsg: false,
            selectRoomIds: "", //选择的用户对应的房间号
            isShowAlipay: true, //是否显示支付宝支付
            isShowMiniWx: false, //是否显示小程序支付
            isShowBToB: false,
            loading: false,
            orderNo: "",
            payPeople: "", //付费人
            isDisabled: false,
            // wxApp: localStorage.wxApp,
            // wxPaymentVersion: localStorage.wxPaymentVersion, //1:粤澳支付版本，2：通用小程序支付版本
            customerIdArr: [], //用户关联房间的客户id
            searchType: 0, //查询欠费房间，0是业主方式，1是房间方式
            roomCode: "", //按房间查询时的房间号
            externalApp: false, //是否第三方APP 外部APP
            addrId: "", //房间id（房间表主键）
            projectId: '',
            memberId: '',
            companyId: '',
            currProjectName: "",
            projectType: "",
            accountInfo: {},
            isWeixin: true,
            isWeixinBrowser: true,
            appId: "",
            R_openId: "",
            R_roomId: "",
            isShowIntegralTips: false,  //是否显示积分规则
            configIntegral: false,
            integralRuleInfo: {},
        }
    },

    onLoad(options) {
        let phone = options.phone ? options.phone : '';
        let R_memberId = options.memberId ? options.memberId : '';
        let R_companyId = options.companyId ? options.companyId : '';
        let R_projectType = options.projectType ? options.projectType : '';
        let R_projectId = options.projectId ? options.projectId : '';
        let isWechat = options.isWechat ? options.isWechat : '';
        let flag = options.flag ? options.flag : '';
        this.R_openId = options.openId ? options.openId : '';
        this.R_roomId = options.roomId ? options.roomId : '';
        let type = options.type ? options.type : '';
        if (type == 1) {
            this.tabsIndex = "1";
        }
        if (R_companyId) {
            this.companyId = R_companyId;
        }
        if (R_projectType) {
            this.projectType = R_projectType;
        }
        if (R_projectId) {
            this.projectId = R_projectId;
        }
        if (flag == "xh") {
            this.externalApp = true;
        }
        if (isWechat) {
            // debugger;
            // this.memberId = R_memberId;
            //从消息推送页面进入，需要先登录
            this.wxMiniLogin();
            // this.getSearchTypeFun(); //获取欠费查询方式接口
            console.log("路由取值" + isWechat)
        } else {
            	// 需要授权登录
			const { O_USER_INFO } = this.$constant;
			const { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
			if(!phoneNumber){
				  uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
					return
			}
            this.initData();
        }
    },
    onShow() {

        // #ifdef MP-WEIXIN


        let options = wx.getEnterOptionsSync();
        if (options.scene == '1038' &&
            options.referrerInfo.appId == 'wxef277996acc166c3') {
            // 代表从收银台小程序返回
            let extraData = options.referrerInfo.extraData;
            if (!extraData) {
                // "当前通过物理按键返回，未接收到返参，建议自行查询交易结果";
            } else {
                if (extraData.code == 'success') {
                    // "支付成功";
                    this.tabsIndex = "1";
                    this.initData();
                } else if (extraData.code == 'cancel') {
                    // "支付已取消";

                } else {
                    // "支付失败：" + extraData.errmsg;
                }

            }

        }
        // #endif
    },
    methods: {
        //初始化数据
        initData() {
            const { PROJECT_ID, MEMBER_ID, PROJECT_TYPE, O_USER_INFO } = this.$constant;
            this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
            this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            this.projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
            let { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
            this.companyId = companyId;
            console.log("companyId------"+this.companyId)
            console.log("projectType------"+this.projectType)
            // this.projectId = "2933996";
            // this.memberId = "605c82a7-9bc6-4816-b16d-4effd3aac593";
            const { PROJECT_CODE, COMPLANY_ID, OA_APP_ID: configAppId, LEASING_INTEGRAL} = this.$appConfig;
            const { OA_APP_ID } = this.$constant;
            const localAppId = this.$cmMth.storageAction({ key: OA_APP_ID, action: 'get' });
            this.appId = localAppId || configAppId || '';
            this.currProjectName = PROJECT_CODE;
            // this.companyId = COMPLANY_ID;
            // this.projectType = PROJECT_TYPE;
            this.configIntegral = LEASING_INTEGRAL ? LEASING_INTEGRAL : false;
            this.isWeixin = commLogic.isWeixinOpen();
            const { uniPlatform } = uni.getSystemInfoSync();
            if (uniPlatform === 'mp-weixin' || uniPlatform === 'h5' || uniPlatform === 'web') {
                this.isWeixinBrowser = true;
            } else if (uniPlatform === 'app') {
                this.isWeixinBrowser = false;
            }
            this.getSearchTypeFun(); //获取欠费查询方式接口
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
                                source: 'wxMini'
                            }
                        }
                        appletLogin(params).then(res => {
                            if (res.status == '200') {
                                let data = {}
                                let obj = res.data
                                // 有手机号码就是授权过，没有则需要授权
                                if (res.data.memberPhone) {
                                    data = res.data.appMemberJson ? JSON.parse(res.data.appMemberJson) : {}
                                    data.wxUserId = res.data.wxUserId;
                                } else {
                                    data = {
                                        companyId: obj.companyId,
                                        id: obj.memberId,
                                        token: obj.token,
                                        wxUserId: obj.wxUserId,
                                        nickname: obj.wxUserName,
                                    }
                                }
                                const { token, id, wxUserId } = data
                                // 有手机号码，设置缓存
                                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID, PROJECT_ID} = self.$constant;
                                const combineData = { ...obj, ...data }
                                // 用的是微信小程序登录接口，用mpWeixin方法处理
                                const storage = commLogic.setOwerUserInfo('mpWeixin', combineData)
                                util.storageAction({ key: PROJECT_TYPE, action: 'set', value: PROJECT_TYPE });
                                util.storageAction({ key: TOKEN, action: 'set', value: token });
                                util.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                                util.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                                util.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                                util.storageAction({ key: PROJECT_ID, action: 'set', value: self.projectId });
                                self.initData()
                            }
                        })
                    }
                }
            })
        },

        //切换tabs
        onTabsChange(item) {
            let self = this;
            self.tabsIndex = item.index;
        },

        //获取欠费查询方式接口
        getSearchTypeFun() {
            let self = this;
            let data = {
                projectId: self.projectId
            };
            var params = {
                data: data,
            }
            getSearchType(params).then(res => {
                if (res.status == 200) {
                    if (
                        this.currProjectName == "XIANG_RONG_ZHONG_SHENG" ||
                        this.currProjectName == "RUI_SI_HANG"
                    ) {
                        self.searchType = 1;
                        self.loadAddress();
                    } else {
                        self.searchType = res.data.searchType;
                        if (self.searchType == 1) {
                            self.loadAddress();
                        } else {
                            this.getOwnerRoomList(); //通过会员ID获取业主信息以及房间信息
                        }
                    }
                } else {
                    // self.$toast(res.message);
                    if (
                        this.currProjectName == "XIANG_RONG_ZHONG_SHENG" ||
                        this.currProjectName == "RUI_SI_HANG"
                    ) {
                        self.searchType = 1;
                        self.loadAddress();
                    } else {
                        this.getOwnerRoomList(); //通过会员ID获取业主信息以及房间信息
                    }
                }
            });
        },

        //加载地址
        loadAddress() {
            let self = this;
            let params = {
                data: {
                    memberId: this.memberId,
                    companyId: this.companyId,
                    projectType: this.projectType,
                    authType: 1 //已认证房产
                },
                pathParams: '/0'
            }
            findLocations(params).then(res => {
                if (res.status == 200) {
                    if (res.data !== null) {
                        let authBuildings = res.data.authBuildings;
                        if (authBuildings.length > 0) {
                            let addressListArr = JSON.parse(JSON.stringify(authBuildings));
                            authBuildings = addressListArr.filter(
                                item => item.projectId == self.projectId
                            )
                            if (self.R_roomId) {
                                authBuildings.forEach(item => {
                                    if (item.roomId == self.R_roomId) {
                                        self.selectRoomIds = item.roomId;
                                        self.roomCode = item.houseRoom;
                                        self.addrId = item.addrId;
                                    }
                                });
                                if (!self.selectRoomIds) {
                                    self.selectRoomIds = authBuildings[0].roomId;
                                    self.roomCode = authBuildings[0].houseRoom;
                                }
                            } else if (uni.getStorageSync('paymentRoomInfo')) {
                                let paymentRoomInfo = JSON.parse(uni.getStorageSync('paymentRoomInfo'));
                                authBuildings.forEach(item => {
                                    if (item.roomId == paymentRoomInfo.roomId) {
                                        self.selectRoomIds = item.roomId;
                                        self.roomCode = item.houseRoom;
                                        self.addrId = item.addrId;
                                    }
                                });
                                if (!self.selectRoomIds) {
                                    self.selectRoomIds = authBuildings[0].roomId;
                                    self.roomCode = authBuildings[0].houseRoom;
                                }
                            } else {
                                self.selectRoomIds = authBuildings[0].roomId;
                                self.addrId = authBuildings[0].roomId;
                                self.roomCode = authBuildings[0].houseRoom;
                            }
                            this.getOwnerRoomList(); //通过会员ID获取业主信息以及房间信息
                        }
                    }
                } else {
                    self.toastWord({ text: res.message })
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
            let params = {
                data: data,
            }
            getOwnerRoomByMemberId(params).then(res => {
                if (res.status == 200 && res.data.length > 0) {
                    let roomIdArr = [];
                    res.data.forEach(item => {
                        if (!item.ownerCalls) {
                            item.ownerCalls = "暂无";
                        }
                        if (item.customerId) {
                            self.customerIdArr.push(item.customerId);
                        }
                        if (item.houseIdList.length > 0) {
                            roomIdArr.push(...item.houseIdList);
                        }
                    });
                    if (self.searchType != 1) {
                        self.selectRoomIds = Array.from(new Set(roomIdArr)).join(",");
                    }
                }
                this.getUserByRoomId(); //根据会员id获取客户信息
            });
        },

        getUserByRoomId() {
            let self = this;
            let data = {
                projectId: this.projectId,
                memberId: this.memberId,
            };
            let params = {
                data: data,
            }
            getOwnerByMemberId(params).then(res => {
                if (res.status == 200) {
                    self.payPeople = res.data.customerName;
                    self.customerInfo = res.data;
                    self.customerInfo.ownerCalls = res.data.telephone;
                    self.user_customerId = self.customerInfo.customerId;
                    if (self.tabsIndex == "1") {
                        self.$nextTick(() => {
                            self.$refs.billShowByQuarterRef.initData();
                        })
                    } else if (this.tabsIndex == "0") {
                        this.$nextTick(() => {
                            this.$refs.billRecordRef.initData();
                        });
                    }
                } else {
                    this.customerInfo = {
                        customerName: "",
                        contactTel: ""
                    };
                    this.$refs.customModal.show({
                        title: '提示',
                        content: res.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmText: "确定",
                        onConfirm: () => {
                            uni.navigateBack()
                        }
                    })
                }
            });
        },

        // 选择其他认证地址
        selectAddress() {
            uni.navigateTo({
                url: '/pages-b/house-info/auth-address-list?page=wyPayment'
            })
        },

        //检查账单核销数据
        checkBillDetailData() {
            let self = this;
            if (self.payNum == 0) {
                self.toastWord({ text: "请选择账单" })
                return false;
            }
            let data = {
                billDetailIds: self.$refs.billShowByQuarterRef.checkSon.join(","),
                customerId: self.customerInfo.customerId
                    ? this.customerInfo.customerId
                    : "-1",
                projectId: self.projectId ? self.projectId : "",
                customerIds: self.customerIdArr.length > 0 ? self.customerIdArr.join(",") : ""
            };
            let params = {
                data: data,
            }
            checkBillDetailRecordForCharge(params).then(res => {
                if (res.status == 200) {
                    self.selectPay();
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 5000,
                        icon: 'none'
                    })
                }
            });
        },

        //查找缴费账单的房间号
        getRoomCodesArr() {
            let self = this;
            let bills = self.$refs.billShowByQuarterRef.bills;
            let checkSon = self.$refs.billShowByQuarterRef.checkSon;
            self.roomCodesArr = [];
            if (bills.length > 0) {
                bills.forEach(item => {
                    item.datadArr.forEach(item2 => {
                        item2.forEach(item3 => {
                            item3.billDetailIdList.forEach(item4 => {
                                if (checkSon.includes(item4)) {
                                    if (item3.code) {
                                        self.roomCodesArr.push(item3.code);
                                    }
                                }
                            });
                        });
                    });
                });
            }
        },

        selectPay() {
            this.getRoomCodesArr(); //查找缴费账单的房间号
            this.roomCodesParams = Array.from(new Set(this.roomCodesArr));
            if (this.payNum == 0) {
                self.toastWord({ text: "请选择账单" })
                return false;
            }
            this.payWay = "1";
            this.payPopup = true;
            this.isClick = true;
            const { uniPlatform } = uni.getSystemInfoSync();  //云环境的公众号，默认使用jsapi支付方式
            if (
                this.projectType == 116 ||
                this.currProjectName == "fudanyijia" ||
                this.currProjectName == "qingtehuihao" ||
                this.currProjectName == "jinpeng" ||
                this.currProjectName == "zhongjian" ||
                this.currProjectName == 'ZRT' ||
                this.currProjectName == 'ZR' ||
                this.currProjectName == 'HC' ||
                this.currProjectName == 'HJFW' ||
                (this.currProjectName == "YBYS" && this.projectType != 216 &&
                this.projectType != 212 && this.projectType != 220  && 
                uniPlatform != "web" && uniPlatform != "h5") ||
                this.currProjectName == "yun50" ||
                this.currProjectName == "ZZWY" ||
                this.currProjectName == "XXSH" ||
                this.currProjectName == "PGD"  ||
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

            if (this.currProjectName == "yueao") {
                this.isShowBToB = true; //粤澳项目下显示对公转账
            }
            console.log("支付方式" + this.payWay)
        },

        getNum() {
            if (!this.isClick) {
                self.toastWord({ text: "正在请求支付，请勿重复点击" })
                return false;
            }
            this.isClick = false;
            let type = ""; //支付方式：0-微信，1-支付宝, 2-银联
            if (this.payWay == "1") {
                type = 0;
            } else if (this.payWay == "2") {
                type = 1;
            } else if (this.payWay == "3") {
                type = 0;
            } else if (this.payWay == "4") {
                type = 2;
            }
            let billDetailIds = this.$refs.billShowByQuarterRef.checkSon.join(",");
            var params = {
                customerId: this.customerInfo.customerId
                    ? this.customerInfo.customerId
                    : "-1",
                paymentAmount: this.payNum + "",
                userAccount: "",
                billDetailIds: billDetailIds,
                poundageMoney: "",
                projectId: this.projectId,
                paymentType: type,
                discountMoney: "",
                customerName: this.customerInfo.customerName,
                addrInfo:
                    this.roomCodesParams.length > 0
                        ? this.roomCodesParams.join(",")
                        : " ",
                payPeople: this.payPeople,
                getPayForComUrl: this.payWay == "4" ? 1 : 0,
                payChannel: "业主端",
                getNotifyUrl: 1,   //获取回调地址
                memberId: this.memberId,
            };
            console.log("支付参数", params);
            let data = {
                data: params,
            }
            getOrderNum(data).then(res => {
                if (res.status == 200) {
                    if (
                        (this.payWay == "3" || this.payWay == "2" || this.payWay == "1") &&
                        (this.projectType == 146 || this.projectType == 141 || this.projectType == 116 ||
                            (this.projectType == 134 && this.currProjectName == "fudanyijia") ||
                            this.currProjectName == "ebei-cloud" || this.currProjectName == "zhongjian" ||
                            this.currProjectName == "dehui" || this.currProjectName == "aolian" ||
                            this.currProjectName == 'yueda' ||  this.currProjectName == 'JDWY' ||
                            this.currProjectName == 'yun50')
                    ) {
                        let params1 = {
                            paymentType: type,
                            paymentAmount: this.payNum + ""
                        };
                        // console.log(res.data, params1, this.payWay, "this.payWay969");
                        // this.wxMiniPay(res.data, params1, this.payWay, 1, res.extraData.notifyUrl);
                        this.getPayChannelFun(res.data, params1, this.payWay, 1, res.extraData.notifyUrl);
                    }else{
                        this.orderNo = res.data;
                        let params1 = {
                            paymentType: type,
                            paymentAmount: this.payNum + ""
                        };
                        // this.wxMiniPay(res.data, params1, this.payWay, 0, res.extraData.notifyUrl);
                        this.getPayChannelFun(res.data, params1, this.payWay, 0, res.extraData.notifyUrl);
                    }
                } else {
                    this.isClick = true;
                    uni.showToast({
                        title: "订单上传失败！" + res.message,
                        duration: 5000,
                        icon: 'none'
                    })
                }
            })
        },

        getPayChannelFun(orderNo, params1, payWay, isMerge, notifyUrl){
            let self = this;
            let assetsId = this.projectId;
            let payType = '';
            if (self.payWay == 2) {
                payType = 'zfb'
            } else {
                payType = 'wx'
            }
            var params = { pathParams: `/${payType}/${assetsId}` }
            getPayChannel(params).then(res => {
                if (res.status == 200) {
                    let paymentMethod = "";
                    if(res.data == "chinaums"){
                        paymentMethod = "wxmini"
                    }else{
                        paymentMethod = "mini";
                    }
                    this.wxMiniPay(orderNo, params1, payWay, isMerge, notifyUrl, paymentMethod)
                }else{
                    let paymentMethod = "wxmini";
                    this.wxMiniPay(orderNo, params1, payWay, isMerge, notifyUrl, paymentMethod)
                    this.closePayOrder(orderNo);
                }
            })
        },

        wxMiniPay(orderNo, params1, payWay, isMerge, notifyUrl, paymentMethod){
            //orderNo-订单号, params1-支付方式, payWay-支付方式, isMerge-合并支付标识, notifyUrl-回调地址
            // 小程序支付 接口文档地址
            let self = this;
            let returnUrl = "";
            const { DOMAIN_PRO } = appConfig;
            if (this.isWeixinBrowser) {
                // let url = location.href;
                if (this.currProjectName == "ebei-cloud" || this.currProjectName == 'aolian') {
                    returnUrl = `https://portal.wuyeface.com/miniPrograms/pages-leasing/paymentinfo/newPayResult.html?source=${this.currProjectName}&projectType=${this.projectType
                        }&appId=${this.appId}&url=${encodeURIComponent(
                            window.location.protocol + "//" + window.location.host
                        )}`;
                } else {
                    returnUrl =
                        DOMAIN_PRO +
                        "/uniwechat/#/pages-leasing/paymentinfo/newPayResult?payModel=jiaofei&paymentType=" +
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
                mergeParamsLists.forEach(v => {
                    if (mergeParamsObj.hasOwnProperty(v.assetsId + '-' + v.expenditure)) {
                        mergeParamsObj[v.assetsId + '-' + v.expenditure] += v.totalAmount ? Number(v.totalAmount) : 0
                    } else {
                        mergeParamsObj[v.assetsId + '-' + v.expenditure] = v.totalAmount ? Number(v.totalAmount) : 0
                    }
                })
                for (var key in mergeParamsObj) {
                    let keys = key.split('-');
                    let assetsId = keys[0];
                    let expenditure = keys[1];
                    let value = mergeParamsObj[key];
                    mergeParamsArr.push({
                        assetsId: assetsId,
                        expenditure: expenditure,
                        totalAmount: value
                    })
                }
            }
            const isApp = commonMethod.isWebViewApp()   //app
            const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin'   //小程序
            const isZGH = process.env.VUE_APP_PLATFORM === 'h5'    //公众号
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
                    if (this.currProjectName == 'HJFW') {
                        tradeType = 'appletCashier'
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

                    tradeType = paymentMethod;  //云测试
                    // 合创对接的通联小程序收银台支付
                    if (this.currProjectName == 'HJFW') {
                        tradeType = 'h5'
                    }
                }
            }
            const { O_USER_INFO } = this.$constant;
            const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
            console.log("用户信息" + userInfo.realName, userInfo.fullName);
            var params = {
                model: "jiaofei", //必填 模块：huodong=活动，club=场馆/会所、parking=停车场、printing=打印
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
                totalAmount: util.floatMul(this.payNum, 100), //必填 金额（单位：分）
                // totalAmount:this.payNum*100,//必填 金额（单位：分）
                // body: "", //订单描述
                attach: "", //自定义参数JSON字符串
                thirdJson: "", //三方参数JSON字符串
                userId: this.memberId, //用户ID
                userName: userInfo.realName || userInfo.realName || userInfo.nickname //用户姓名
            };
            if (this.roomCodesParams.length > 0) {
                params.body = this.roomCodesParams[0] + ","
                    + this.customerInfo.customerName + "(" + this.customerInfo.ownerCalls + ")"
            } else {
                params.body = this.customerInfo.customerName + "(" + this.customerInfo.ownerCalls + ")"
            }
            let { STRG_openId } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            if (this.R_openId) {
                params.openId = this.R_openId;
            } else {
                params.openId = STRG_openId;
            }
            // params.openId="oN5eq6SA4REP13WSi0geC_hjnZOI"
            getPay2({ data: params }).then(res => {
                self.loading = false;
                self.payPopup = false;
                let paymentAmount = this.payNum + "";
                if (res.status == 200) {
                    if (res.data.type === "ebeipay") {
                        if (res.data.channel === "chinaums" && res.data.tradeType == 'jsapi'){
                            window.location.href = res.data.data;
                            return;
                        }
                        const payArg = JSON.parse(res.data.data);
                        if (res.data.tradeType == 'appletCashier') {
                            this.tyWXPay('appletCashier', payArg.extraData);
                            return;
                        } else if (res.data.tradeType == 'h5') {
                            //将接口返回的Form表单显示到页面
                            window.location.href = res.data.payInfo;

                            return;
                        }else if (res.data.tradeType == 'jsapi'){
                            WeixinJSBridge.invoke(
                                "getBrandWCPayRequest",
                                {
                                appId: payArg.appId, //动态获取初始化请求中返回的pay_info参数中appId值
                                timeStamp: payArg.timeStamp, //动态获取初始化请求中返回的pay_info参数中timeStamp值
                                nonceStr: payArg.nonceStr, //动态获取初始化请求中返回的pay_info参数中nonceStr值
                                package: payArg.package, //动态获取初始化请求中返回的pay_info参数中package值
                                signType: payArg.signType, //动态获取初始化请求中返回的pay_info参数中signType值
                                paySign: payArg.paySign //动态获取初始化请求中返回的pay_info参数中paySign值
                                },
                                function(res) {
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        uni.showToast({
                                            title: "支付成功",
                                            duration: 2000,
                                            icon: 'none'
                                        })
                                        self.payResultPopup = true;
                                        self.payStatus = "1";
                                    } else if (res.err_msg == "get_brand_wcpay_request:cancel"){
                                        uni.showToast({
                                            title: "支付已取消",
                                            duration: 2000,
                                            icon: 'none'
                                        })
                                        this.closePayOrder(orderNo);
                                    }else if (res.err_msg == "get_brand_wcpay_request:fail"){
                                        uni.showToast({
                                            title: "支付失败",
                                            duration: 2000,
                                            icon: 'none'
                                        })
                                        self.payResultPopup = true;
                                        self.payStatus = "-1";
                                        this.closePayOrder(orderNo);
                                    }
                                }
                            );
                            return;
                        }
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
                                            uni.redirectTo({
                                                url: "/pages-leasing/paymentinfo/newPayResult?payModel=jiaofei&paymentType=0&orderNo=" +
                                                    orderNo +
                                                    "&paymentAmount=" +
                                                    paymentAmount +
                                                    "&customerId=" +
                                                    this.customerInfo.customerId +
                                                    "&projectId=" +
                                                    this.projectId
                                            });
                                            resolve({ success: true, data: 'success' })
                                        },
                                        fail: err => {
                                            uni.showToast({
                                                title: "支付已取消",
                                                duration: 2000,
                                                icon: 'none'
                                            })
                                            this.closePayOrder(orderNo);
                                            resolve({ success: false })
                                        }
                                    })
                                }
                            })
                        })
                    }
                    if (res.data.payChannel === "chinaums") {
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
                                            uni.redirectTo({
                                                url: "/pages-leasing/paymentinfo/newPayResult?payModel=jiaofei&paymentType=0&orderNo=" +
                                                    orderNo +
                                                    "&paymentAmount=" +
                                                    paymentAmount +
                                                    "&customerId=" +
                                                    this.customerInfo.customerId +
                                                    "&projectId=" +
                                                    this.projectId
                                            });
                                            resolve({ success: true, data: 'success' })
                                        },
                                        fail: err => {
                                            uni.showToast({
                                                title: "支付已取消",
                                                duration: 2000,
                                                icon: 'none'
                                            })
                                            this.closePayOrder(orderNo);
                                            resolve({ success: false })
                                        }
                                    })
                                }
                            })
                        })
                    }
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 2000,
                        icon: 'none'
                    })
                    this.closePayOrder(orderNo);
                }
            })
        },

        chinaumsPayFun(skNum, params1) {
            let self = this;
            // let url = location.href;
            let returnUrl = "";
            let notifyUrl = "";
            const { DOMAIN_PRO } = appConfig;
            if (this.isWeixinBrowser) {
                returnUrl =
                    DOMAIN_PRO +
                    "/#/pages-leasing/paymentinfo/newPayResult?payModel=jiaofei&paymentType=" +
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
                totalAmount: this.payNum + "",
                projectId: self.projectId,
                // bodyMessage: "物业缴费",
                paymentType: paymentType, //缴费方式(1-二维码，2-pos机，3-微信公众号,4-H5支付,5-APP,6-银联小程序，7-微信小程序，8-公对公转账)
                paymentCode: paymentCode, //支付类型（1-微信，2-支付宝，3-通用）
                returnUrl: returnUrl, //支付完成跳转地址
                // openId: localStorage.openId,
                notifyUrl: notifyUrl //支付中心回调业务系统地址
            };
            if (this.roomCodesParams.length > 0) {
                data.bodyMessage = this.roomCodesParams.join(",") + ","
                    + this.customerInfo.customerName + "(" + this.customerInfo.ownerCalls + ")"
            } else {
                data.bodyMessage = this.customerInfo.customerName + "(" + this.customerInfo.ownerCalls + ")"
            }

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

        notPayClick() {
            this.payResultPopup = true;
            this.payStatus = "-1";
        },

        alreadyPayClick() {
            let self = this;
            self.payResultPopup = false;
            self.payStatus = "";
            self.payNum = 0;
            self.$nextTick(() => {
                self.$refs.billShowByQuarterRef.initData(); //翔顺项目下，获取按季度展示的物业欠费
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

        // 提示文字
        toastWord(params) {
            const { text } = params;
            if (!text) return;
            uni.showToast({ title: text, icon: 'none' });
        },

        getPayNum(res) {
            let self = this;
            self.payNum = res;
        },

        //关闭弹出层
        closePopup() {
            let self = this;
            self.payPopup = false;
        },


        //获取积分规则信息
        getTipsBeforePayFun(){
            let self = this;
            let data = {
                source: "PROPERTY_PAYMENT",
                companyId: self.companyId,
                projectId: self.projectId,
            };
            var params = {
                data:data,
            }
            tipsBeforePay(params).then(res=>{
                if(res.status == 200){
                    self.isShowIntegralTips = true;
                    self.integralRuleInfo = res.data;
                }else{
                    self.isShowIntegralTips = false;
                }
            })
        },

        //取消订单
        closePayOrder(orderNo){
            this.payPopup = false;
            let params = {
                orderNo: orderNo,
            };
            cancelChargePayOrder(params).then(res=>{
                if(res.status == 200){
                    self.$refs.billShowByQuarterRef.initData();
                }else{
                    self.$refs.billShowByQuarterRef.initData();
                }
            })
        },

        //跳转到缴费历史页面
        goPayHistory(){
            uni.navigateTo({
                url: '/pages-leasing/payMentHistory'
            })
        }

    },

    watch: {
        tabsIndex: {
            handler(val) {
                if (val == "1") {
                    this.payNum = "0.00";
                    this.$nextTick(() => {
                        if(this.configIntegral){
                            this.getTipsBeforePayFun()
                        }
                        this.$refs.billShowByQuarterRef.bills = [];
                        this.$refs.billShowByQuarterRef.checkSon = [];
                        this.$refs.billShowByQuarterRef.checked = {};
                        this.$refs.billShowByQuarterRef.initData();
                    });
                } else if (val == "0") {
                    this.$nextTick(() => {
                        this.$refs.billRecordRef.billList = [];
                        this.$refs.billRecordRef.initData();
                    });
                }
            }
        }
    },
}
</script>

<style scoped lang="scss">
.text-center {
    text-align: center;
}

.page {
    height: 100vh;
    background-color: #f5f5f5;
}

.contactCustomerStyle {
    position: relative;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    padding: 16px;
    align-items: center;
}

.contactCustomerStyle:before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: repeating-linear-gradient(-45deg, #20BCDA 0, #20BCDA 20%, transparent 0, transparent 25%, var(--app-primary-color) 0, var(--app-primary-color) 45%, transparent 0, transparent 50%);
    background-size: 80px;
    content: "";
}

.contactCustomerStyle ::v-deep.uicon-account {
    margin-right: 4px;
}

.contactCustomerStyle ::v-deep .uicon-arrow-right {
    margin-left: 4px;
}

.customerInfoStyle {
    margin-left: 12rpx;
    line-height: 44rpx;
    position: relative;
    overflow: hidden;
    color: #323233;
    text-align: left;
    vertical-align: middle;
    word-wrap: break-word;
    flex: 1;
    font-size: 28rpx;
}

.customerInfoStyle .flexStyle {
    position: relative;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    justify-content: space-between;
    padding-right: 10px;
}

.arrCell {
    margin: 20rpx 0;
    padding: 20rpx 32rpx;
    background: #ffffff;
}

.num {
    font-size: 68rpx;
    color: #ff0000;
    font-weight: bold;
}

.btnMoney {
    background: var(--app-primary-color);
    border: 1px solid var(--app-primary-color);
    color: #ffffff;
}

.footerBtn {
    padding: 20rpx 0;
    text-align: center;
    display: flex;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    width: 100%;

    view {
        flex: 1;

        text {
            width: 168rpx;
            height: 72rpx;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 34rpx;
            font-size: 28rpx;
        }

        .confirmBtnStyle {
            background: var(--app-primary-color);
            color: white;
        }
        .plainBtnStyle{
            border: 1px solid var(--app-primary-color);
            color: var(--app-primary-color)
        }
    }
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

.overlay {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    /* 此处的图层要大于页面 */
    display: flex;
    justify-content: center;
    align-items: center;
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
.integralInfoStyle{
  text-align: left !important;
  font-size: 12px;
  background: #f9f9f9;
  padding: 5px 10px;
  border-radius: 5px;
  color: #888;
}
</style>
