<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="page" v-if="isShow">
            <view class="timeStyle">
                <text style="color: #fff;">剩余支付时间  </text>
                <u-count-down 
                    :time="countdown"
                    format="HH:mm:ss"
                    :autoStart="true"
                    :millisecond="false"
                    @change="onChangeTime"
                    style="display: inline-block;"
                >
                    <view class="time">
                        <text class="block">{{ timeData.hours }}</text>
                        <text class="colon">:</text>
                        <text class="block">{{ timeData.minutes }}</text>
                        <text>:</text>
                        <text class="block">{{ timeData.seconds }}</text>
                    </view>
                </u-count-down>
            </view>
            <view class="customer_info">
                <view class="customer_info_item">
                    <u-icon name="account" color="#1989fa"/>
                    <text class="customer_info_item_name">付费人：{{customerInfo.customerName}}  {{customerInfo.contactTel}}</text>
                </view>
                <view class="customer_info_item">
                    <u-icon name="map" color="#1989fa"/>
                    <text class="customer_info_item_name">{{customerInfo.addrInfo}}</text>
                </view>
            </view>
            <view class="billStyle" style="height: calc(100vh - 206px);overflow: auto;">
                <u-collapse class="bill_collapse">
                    <view v-for="(item, index) in bills.FeeList" :key="index">
                        <u-collapse-item
                            v-for="(Fee, index3) in item.data" :key="index3"
                            :title="Fee.fiName" 
                            :value="'￥' + Fee.feeTotal" 
                        >
                            <u-cell-group :border="false" class="bill_cell_group">
                                <u-cell
                                    v-for="(ele, index2) in Fee.feeData" :key="index2" 
                                    :title="ele.showTime" 
                                    :value="'￥' + ele.arrearsAmount" 
                                ></u-cell>
                            </u-cell-group>
                        </u-collapse-item>
                    </view>
                    
                </u-collapse>
                <view style="color: #888;padding: 12px;line-height: 2;font-size: 0.8em;">
                    <view>付款说明：</view>
                    <view>1.付款前务必与好友再次确认，避免是诈骗行为。</view>
                    <view>2.如果发生退款，资金将退还到您的微信账号里。</view>
                </view>
            </view>
            <view id="footer-btn">
                <view class="footer-item">
                    <view style="margin-right: 12px;font-size:1em;flex: 3;text-align: right;">
                        合计代缴 
                        <text 
                            style="color:#ff3300;font-size:14px;"
                        >￥{{totalMoney}}</text>
                    </view>
                    <u-button type="primary" v-if="isClick" @click="getNum(0)">立即支付</u-button>
                    <u-button type="primary" v-if="!isClick">支付中...</u-button>
                </view>
            </view>
        </view>
        <view v-if="!isShow" style="text-align: center;padding-top: 100px;">
            <image src="@/static/onlinePayment/sad_icon.png" style="width:168px;height:160px;"/></image>
            <view style="font-size: 1em;margin-top: 1em;" v-if="isWeiXin">分享账单已失效</view>
            <view style="font-size: 1em;margin-top: 1em;" v-if="!isWeiXin">无效链接</view>
        </view>
    </view>
</template>

<script>
import moment from "moment";
import commLogic from '@/js/comm-logic';
import appConfig from '@/app-config';
import commonMethod from '@/js/commonMethod'
import { 
  selectBillSharingSettingByKey,   //分享账单查看
  getBillSharingSettingTime,    //获取账单分享时间
  getOrderNum,  //提交订单
  chinaumsPay, //获取支付信息
  cancelChargePayOrder,
} from "@/service/leasing.js";
import { 
    getPay2,
    appletLogin,
    getListByMap,
    wxOauthNew,
} from '../../service/community'
import util from "../../js/utils";
export default {
    data(){
        return{
            activeNames: [],
            bills: [],
            totalMoney: "0",
            customerInfo: {
                customerName: "暂无数据",
                contactTel: "暂无数据",
                addrInfo: "暂无数据",
                customerId: "",
            },
            timeData: {},
            isShow: true,
            isWeiXin: true,
            key: "",
            shareTime: "",   //分享账单时间
            countdown: "",   //倒计时，单位是毫秒
            isClick: true,
            receivedRemark: "",
            userName: "",
            payChannel:'',
            memberId: '',
            companyId: '',
            currProjectName: "",
            projectType: "",
            wechatInfo: {},
        }
    },

    async onLoad(option) {  
        this.key = option.key;
        this.userName = option.userName ? decodeURIComponent(option.userName) : "";  
        if(option.code && option.projectType){
            this.wechatInfo = option;            
        }
        //页面加载没有会员数据，先登录，有会员数据，则初始化数据
        if (this.isAuthorized()) {
            this.initData()
        }
        
    },

    async onShow(){
        if(this.wechatInfo.code && this.wechatInfo.projectType){
            // await this.wechatSetCompany(this.wechatInfo.projectType);
            await this.wechatLogin(this.wechatInfo);  
        }
    },

    methods:{
        isAuthorized() {
            const { O_USER_INFO } = this.$constant;
            return !!util.storageAction({ key: O_USER_INFO, action: 'get' });
        },

        async wechatSetCompany(projectType) {
            var params = {
                data: {
                    projectType: projectType,
                },
                "hideLoading": true
            }
            let res=await getListByMap(params);
            if(res.status == 200 && res.data){
                let info = res.data?.[0]??{};
                const { COMPLANY_ID } = this.$constant;
                util.storageAction({ key: COMPLANY_ID, action: 'set', value: info.companyId });  
            }
        },

        async wechatLogin(option) { 
            // 微信公众号授权登录
            var params = {
                data: {
                    code: option.code,
                    projectType: option.projectType
                },
                hideLoading: true,
                responseToast: false
            }
            let result = await wxOauthNew(params);
            if (result.status == 200) {
                this.wechatInfo = {
                    projectType: '',
                    code: ''
                };
                const { token, memberId, wxUserId,memberPhone,projectType } = result.data;
                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID, PROJECT_TYPE, COMPLANY_ID } = this.$constant;
                let companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' });
                let memberJsonObject = JSON.parse(result.data.memberJsonObject);
                let wxUserJsonObject = JSON.parse(result.data.wxUserJsonObject);
                const combineData = { ...memberJsonObject, ...wxUserJsonObject, companyId, id: memberId,phoneNumber:memberPhone }

                const storage = commLogic.setOwerUserInfo('mpWeixin', combineData);
                let newprojectType = option.projectType?option.projectType:projectType
                util.storageAction({ key: TOKEN, action: 'set', value: token });
                util.storageAction({ key: MEMBER_ID, action: 'set', value: memberId });
                util.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                util.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                util.storageAction({ key: PROJECT_TYPE, action: 'set', value: newprojectType });
                this.initData();
                console.log('获取到用户信息');
                const { errMsg } = await commLogic.mallLoginByMbid();
                if (errMsg) uni.showToast({icon: 'none', title: errMsg}) 
            }else{
                uni.showToast({
                    title: result.message,
                    duration: 2000,
                    icon: 'none'
                })
            }
  
        },

        //初始化数据
        initData(){
            const {PROJECT_ID, MEMBER_ID, PROJECT_TYPE, O_USER_INFO } = this.$constant;
            this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            this.projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
            let { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
            this.companyId = companyId;
            console.log("companyId------"+this.companyId)
            console.log("projectType------"+this.projectType)
            const {PROJECT_CODE, COMPLANY_ID,OA_APP_ID: configAppId } = this.$appConfig;
            const { OA_APP_ID } = this.$constant;
            const localAppId = this.$cmMth.storageAction({ key: OA_APP_ID, action: 'get' });
            this.appId = localAppId || configAppId || '';
            // this.companyId = COMPLANY_ID;
            this.currProjectName = PROJECT_CODE;
            // this.projectType = PROJECT_TYPE;
            this.isWeixin = commLogic.isWeixinBrowser()
            this.getShareTime();   //获取分享账单时间
            this.getOrderList();   //获取分享账单列表
        },

        //获取分享账单列表
        getOrderList(){
            let self = this;
            let data = {
                value: self.key,
            };
            selectBillSharingSettingByKey({data: data}).then(res => {
                if(res.status == 200){
                    self.totalMoney = res.data.total;
                    self.customerInfo = JSON.parse(res.data.json);
                    self.bills = res.data;
                    self.bills.FeeList = [];

                    for (var key in self.bills) {
                        if (key != "total" && key != "FeeList" && key != "json") {
                            self.bills[key].key = key;
                            
                            self.bills[key].data.forEach(element => {

                                element.feeData.forEach(ele => {
                                    ele.showTime =
                                        moment(ele.startDate).format("YYYY-MM-DD") +
                                        "~" +
                                        moment(ele.endDate).format("YYYY-MM-DD");
                                });
                            });

                            self.bills.FeeList.push(self.bills[key]);
                        }
                    }
                }else{
                    self.isShow = false;
                    self.isWeiXin = true;
                }
            })
        },

        //获取分享账单时间
        getShareTime(){
            let self = this;
            let data = {
                value: self.key,
            }
            getBillSharingSettingTime({data: data}).then(res=>{
                if(res.status == 200){
                    self.shareTime = res.data;
                    self.setCountDown();  //设置倒计时
                }
            })
        },

        //设置倒计时
        setCountDown(){
            let self = this;
            let endTimeObj = {};
            endTimeObj = moment(self.shareTime).add(30, 'm');   //结束时间=账单分享时间+30分钟
            let endTime = moment(endTimeObj._d).format("YYYY-MM-DD HH:mm:ss"); //结束时间格式化
            let nowDate = moment().format("YYYY-MM-DD HH:mm:ss");  //当前时间
            let diffMillisecond = moment(endTime).diff(moment(nowDate), 'milliseconds');   //倒计时=结束时间-当前时间
            if(diffMillisecond > 0){
                self.countdown = diffMillisecond;
                self.isShow = true;
            }else{
                self.isShow = false;
                self.isWeiXin = true;
            }
        },

        //倒计时结束
        finish(){
            this.isShow = false;
            this.isWeiXin = true;
        },

        onChangeTime(e) {
            this.timeData = e;
            if( this.countdown > 0 
                && this.timeData.hours == "0"
                && this.timeData.minutes == "0" 
                && this.timeData.seconds == "0"){
                this.finish();
            }
        },

        getNum(type){
            //type (0-微信,1-支付宝,2-银联) 
            if(!this.isClick){
                uni.showToast({
                    title: "正在请求支付，请勿重复点击",
                    duration: 5000,
                    icon: 'none'
                })
                return false;
            }
            this.isClick = false;
            var params = {
                customerId: this.customerInfo.customerId,
                paymentAmount: this.totalMoney + "",
                userAccount: "",
                billDetailIds: this.customerInfo.billDetailIds,
                poundageMoney: "",
                projectId: this.customerInfo.projectId,
                paymentType: type,
                discountMoney: "",
                customerName: this.customerInfo.customerName,
                addrInfo: this.customerInfo.addrInfo,
                payChannel: "员工端",
                userName: this.userName,
                getNotifyUrl: 1,   //获取回调地址
            };
            if(this.receivedRemark){
                params.receivedRemark = this.receivedRemark;
            }
            getOrderNum({data: params}).then(res => {
                // this.isClick = true;
                if (res.status == 200) {
                   let orderNo = res.data;
                   let notifyUrl = res.extraData.notifyUrl;
                    const { DOMAIN_PRO } = appConfig;
                    let returnUrl =
                        DOMAIN_PRO+
                        "/#/pages-leasing/paymentinfo/newPayResult?payModel=jiaofei&paymentType=" +
                        params.paymentType +
                        "&orderNo=" +
                        orderNo +
                        "&paymentAmount=" +
                        params.paymentAmount +
                        "&customerId=" +
                        this.customerInfo.customerId +
                        "&projectId=" +
                        this.customerInfo.projectId;
                    // this.setPayment(orderNo, returnUrl);
                    this.wxMiniPay(orderNo, notifyUrl);
                } else {
                    this.isClick = true;
                    uni.showToast({
                        title: res.message,
                        duration: 2000,
                        icon: 'none'
                    })
                }
            });
        },

        wxMiniPay(orderNo, notifyUrl){
            let self = this;
            const { DOMAIN_PRO } = appConfig;
            let returnUrl =
                DOMAIN_PRO +
                "/uniwechat/#/pages-leasing/paymentinfo/newPayResult?payModel=jiaofei&orderNo=" +
                orderNo;
            let tradeType = "jsapi";
            var params = {
                model: "jiaofei", //必填 模块：huodong=活动，club=场馆/会所、parking=停车场、printing=打印
                orderNo: orderNo, //必填 业务订单号
                payMethod: "wx", //必填 支付类型：wx=微信、zfb=支付宝，yl=银联，common=通用
                tradeType: tradeType, //必填 支付方式：jsapi=微信公众号， mini=银联小程序，wxmini=微信小程序  app=app支付，
                // assetsId:'78201',//必填 资产（项目、园区、单元、楼栋、楼层、房间等）ID
                assetsId: this.customerInfo.projectId, //必填 资产（项目、园区、单元、楼栋、楼层、房间等）ID
                expenditure: "", //费项名称,按费项支付时传入
                merge: false, //合并支付标识，缺省值: false
                mergeParamsList: [], //{assetsId:'', //资产ID  expenditure:'', //费项名称 totalAmount:'' //分账金额  },//合并支付，分账列表，merge=true时，必传
                expireTime: "", //订单失效时间的 Unix 时间戳，缺省值：30分钟
                returnUrl: returnUrl, //支付完成跳转地址
                notifyUrl: notifyUrl, //上送支付中心回调接口
                totalAmount: util.floatMul(this.totalMoney, 100), //必填 金额（单位：分）
                body: this.customerInfo.addrInfo ? this.customerInfo.addrInfo.split(",")[0] : "物业缴费",  //订单描述
                // totalAmount:this.payNum*100,//必填 金额（单位：分）
                // body: "", //订单描述
                attach: "", //自定义参数JSON字符串
                thirdJson: "", //三方参数JSON字符串
            };
            const {O_USER_INFO } = this.$constant;
            let { STRG_openId, STRG_memberId, STRG_realName, STRG_nickname} = util.storageAction({ key: O_USER_INFO, action: 'get' });
            params.openId = STRG_openId;
            params.userId = STRG_memberId;
            params.userName = STRG_realName || STRG_nickname; //用户姓名
            getPay2({data: params}).then(res=>{
                this.isClick = true;
                if(res.status == 200){
                    if (res.data.type === "ebeipay") {
                        if (res.data.channel === "chinaums" && res.data.tradeType == 'jsapi'){
                            window.location.href = res.data.data;
                            return;
                        }
                        const payArg = JSON.parse(res.data.data)
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
                                    }else if (res.err_msg == "get_brand_wcpay_request:cancel"){
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
                                        this.closePayOrder(orderNo);
                                    }
                                }
                            );
                            return;
                        }
                        return new Promise(resolve => {
                            uni.getProvider({
                            service: 'payment',
                            success: ({provider}) => {
                                uni.requestPayment({
                                provider,
                                timeStamp: payArg.timeStamp,
                                nonceStr: payArg.nonceStr,
                                package: payArg.package,
                                signType: payArg.signType,
                                paySign: payArg.paySign,
                                success: () => {
                                    uni.showToast({
                                        title: "支付成功",
                                        duration: 5000,
                                        icon: 'success'
                                    })
                                    this.isShow = false;
                                    this.isWeiXin = true;
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
                            success: ({provider}) => {
                                uni.requestPayment({
                                provider,
                                timeStamp: payArg.timeStamp,
                                nonceStr: payArg.nonceStr,
                                package: payArg.package,
                                signType: payArg.signType,
                                paySign: payArg.paySign,
                                success: () => {
                                    uni.showToast({
                                        title: "支付成功",
                                        duration: 5000,
                                        icon: 'success'
                                    })
                                    this.isShow = false;
                                    this.isWeiXin = true;
                                    resolve({ success: true, data: 'success' })
                                },
                                fail: err => {
                                    uni.showToast({
                                    title: err.errMsg,
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

        setPayment(orderNo, returnUrl){
            //type (0-微信,1-支付宝,2-银联)
            const { DOMAIN_PRO } = appConfig;
            let notifyUrl = ` ${DOMAIN_PRO}/leasing/chargeReceivableOnline/notifyPaymentRecord`;
            let params = {
                orderNo: orderNo,   //订单号
                totalAmount: this.totalMoney + "",    //金额
                projectId: this.customerInfo.projectId,    //项目id
                bodyMessage: this.customerInfo.addrInfo ? this.customerInfo.addrInfo.split(",")[0] : "物业缴费",  //订单描述
                // paymentType: 7,    //缴费方式(1-二维码，2-pos机，3-微信公众号,4-H5支付,5-APP,6-银联小程序，7-微信小程序，8-公对公转账)
                paymentType: "6",  //云测试
                paymentCode: 1,    //支付类型（1-微信，2-支付宝，3-通用）
                returnUrl: returnUrl,
                notifyUrl: notifyUrl,  //支付中心回调业务系统地址
            };
            const {O_USER_INFO } = this.$constant;
            let { STRG_openId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
            params.openId = STRG_openId;
            chinaumsPay({data: params}).then(res=>{
                if(res.status == 200){
                    const payArg = JSON.parse(res.data.payInfo)
                    return new Promise(resolve => {
                        uni.getProvider({
                        service: 'payment',
                            success: ({provider}) => {
                                uni.requestPayment({
                                provider,
                                timeStamp: payArg.timeStamp,
                                nonceStr: payArg.nonceStr,
                                package: payArg.package,
                                signType: payArg.signType,
                                paySign: payArg.paySign,
                                success: () => {
                                    uni.showToast({
                                        title: "支付成功",
                                        duration: 5000,
                                        icon: 'success'
                                    })
                                    this.isShow = false;
                                    this.isWeiXin = true;
                                    resolve({ success: true, data: 'success' })
                                },
                                fail: err => {
                                    uni.showToast({
                                        title: err.errMsg,
                                        duration: 2000,
                                        icon: 'none'
                                    })

                                    resolve({ success: false })
                                }
                                })
                            }
                        })
                    })
                }else {
                    this.isClick = true;
                    uni.showToast({
                        title: res.message,
                        duration: 2000,
                        icon: 'none'
                    })
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
    }
}
</script>

<style scoped>
.page{
    height: 100vh;
    background-color: #f5f5f5;
}
.timeStyle{
    /* width: 100%; */
    text-align: center;
    background: var(--app-primary-color);
    font-size: 1em;
    padding: 8px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.time{
    color: #fff;
}
.block{
    padding: 1px 3px;
    border: 1px solid #fff;
    border-radius: 5px;
    box-shadow: none;
    text-align: center;
    display: inline-block;
    margin: 0 0.4em;
}
.customer_info{
    background: #fff;
    padding: 12px 12px 0;
    margin-bottom: 12px;
}
.customer_info .customer_info_item{
    padding-bottom: 12px;
}
.customer_info .customer_info_item /deep/ .u-icon{
    vertical-align: middle;
    margin-right: 12px;
    display: inline-block;
}
.customer_info .customer_info_item .customer_info_item_name{
    font-size: 1em;
    vertical-align: middle;
}
.billStyle /deep/ .u-collapse{
    background: #ffffff;
}
.billStyle /deep/ .u-collapse > .u-line{
    border-bottom: none !important;
}
.billStyle /deep/ .u-collapse .content-class{
    padding: 0 15px;
}
.billStyle /deep/ .u-collapse .u-cell__title-text,
.billStyle /deep/ .u-collapse .u-cell__value{
    color: #333;
}
.billStyle /deep/ .u-collapse .u-cell-group .u-cell__value{
    color: #969799;
}
.billStyle /deep/ .u-collapse .u-cell-group .u-cell-group__wrapper .u-cell:nth-last-child(1) .u-line{
    border-bottom: none !important;
}
#footer-btn{
    margin: 12px 0 0;
    background: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;

}
#footer-btn .footer-item{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 4;
}
#footer-btn /deep/ .u-button{
    height: 58px;
    line-height: 30px;
    /* width: 120px; */
    flex: 1;
}
</style>