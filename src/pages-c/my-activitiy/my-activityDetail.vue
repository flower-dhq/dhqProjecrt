
<style lang="scss" scoped>
.head_img {
    image {
        width: 100%;
    }
}
.box {
    position: relative;
}
.head_title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
}
.head_content {
    margin: 40rpx;
    border-bottom: 1rpx solid #e4e4e4;
    view {
        margin-bottom: 20rpx;
    }
}
.head_info {
    @include flx-dsp($jsc: space-between, $ali: center);
    font-size: 26rpx;
    color: #666666;
    .info_time {
        color: red;
    }
    .info_num {
        color: red;
    }
}

.head_detail {
    padding: 0 40rpx;
    font-size: 28rpx;
    color: #666666;
    line-height: 52rpx;
    .demo-uni-row {
        @include flx-dsp($jsc: center, $ali: center);
        margin-bottom: 10rpx;
    }
    .detail_btn {
        margin: 10rpx 0;
        font-size: 26rpx;
        padding-left: 180rpx;
        color: var(--app-primary-color);
    }
}
.eventDetails_sign_button {
    position: absolute;
    right: 40rpx;
    //  bottom: 10px;
    border-radius: 50rpx;
    background-color: var(--app-primary-color);
    text-align: center;
    color: #fff;
    min-width: 120rpx;
    height: 76rpx;
    line-height: 76rpx;
    font-weight: bold;
    font-size: 32rpx;
    padding: 0 24rpx;
}
.slot-content {
    text-align: center;
}
.activity-sign {
    margin: 40rpx;
    .sign-title {
        //   width: 50px;
        height: 45px;
        line-height: 45px;
        text-align: justify !important;
        font-size: 26rpx !important;
    }
    .sign-title i {
        display: inline-block !important;
        width: 100% !important;
    }
    .sign-zf {
        .sign-zfcell {
            @include flx-dsp($jsc: space-between, $ali: center);
            .cell-left {
                @include flx-dsp($jsc: center, $ali: center);
                font-weight: 600;
                font-size: 30rpx;
            }
        }
    }
}
.minus {
    width: 70rpx;
    height: 60rpx;
    background-color: var(--app-primary-color);
    @include flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.input {
    padding: 0 10px;
    width: 70rpx;
    height: 60rpx;
    text-align: center;
    line-height: 30px;
    font-size: 30rpx;
}

.plus {
    width: 70rpx;
    height: 60rpx;
    background-color: var(--app-primary-color);
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
    align-items: center;

    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.activity-sign-btn {
    margin: 20px 0;
    display: flex;
    .sign-btn {
        height: 30px;
        line-height: 30px;
        font-size: 28rpx;
        background-color: var(--app-primary-color); 
        min-width: 200rpx;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        border-radius: 30rpx;
        padding: 0 20rpx;
    }
    .sign-btn-Disable {
        background-color: #cad3e7 !important;
    }
}
.cancel-sign-confirm {
    color: red;
}
.cancel-sign-confirm ::v-deep.uni-modal {
    border-radius: 10px;
}
</style>  
<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="head_img">
            <image :src="activityInfo.coverUrl"></image>
        </view>
        <view class="box">
            <view class="head_content">
                <view class="head_title">{{activityInfo.title}}</view>
                <view class="head_info">
                    <view>报名截止时间</view>
                    <view class="info_time">{{activityInfo.signUpEndDate}}</view>
                    <view>报名 <text class="info_num">{{activityInfo.signUpNum}}</text>人</view>
                </view>
            </view>
            <view class="head_detail">
                <uni-row class="demo-uni-row">
                    <uni-col :span="5">
                        <view class="demo-uni-col dark">活动时间</view>
                    </uni-col>
                    <uni-col :span="19">
                        <view class="demo-uni-col light">{{activityInfo.startDate}} ~ {{activityInfo.endDate}} </view>
                    </uni-col>
                </uni-row>
                <uni-row class="demo-uni-row">
                    <uni-col :span="5">
                        <view class="demo-uni-col dark">活动地点</view>
                    </uni-col>
                    <uni-col :span="19">
                        <view class="demo-uni-col light">{{activityInfo.location}}</view>
                    </uni-col>
                </uni-row>
                <uni-row class="demo-uni-row">
                    <uni-col :span="5">
                        <view class="demo-uni-col dark">活动费用</view>
                    </uni-col>
                    <uni-col :span="19">
                        <view class="demo-uni-col light">{{activityInfo.isFree==0?(activityInfo.money + ' 元/人'):'免费'}}</view>
                    </uni-col>
                </uni-row>
                <uni-row class="demo-uni-row">
                    <uni-col :span="5">
                        <view class="demo-uni-col dark">人数限制</view>
                    </uni-col>
                    <uni-col :span="19">
                        <view class="demo-uni-col light">{{activityInfo.limitNum==0?'不限制人数':activityInfo.limitNum || 0 +'人'}}</view>
                    </uni-col>
                </uni-row>
                <uni-row class="demo-uni-row">
                    <uni-col :span="5">
                        <view class="demo-uni-col dark">联系人</view>
                    </uni-col>
                    <uni-col :span="19">
                        <view class="demo-uni-col light">{{activityInfo.contacts}}</view>
                    </uni-col>
                </uni-row>
                <uni-row class="demo-uni-row">
                    <uni-col :span="5">
                        <view class="demo-uni-col dark">咨询电话</view>
                    </uni-col>
                    <uni-col :span="19">
                        <view class="demo-uni-col light">{{activityInfo.contactPhone}}</view>
                    </uni-col>
                </uni-row>
                <view class="">
                    <text>活动简介</text>
                    <text>{{activityInfo.description}}</text>
                </view>
                <a v-show="activityInfo.summaryUrl" class="detail_btn" @click="openPage">查看详情 ></a>
            </view>
            <view v-if="isSignBtn" class="eventDetails_sign_button" @click="signButton">
                {{signBtnName}}
            </view>
        </view>
        <view class="activity-sign" v-if="!regInformationStart">
            <u-row v-for="(item,index) in signUpInfos" :key="index" :gutter="10" style="border-bottom: 1px solid #e4e4e4;">
                <u-col span="3" class="hdCellleft">
                    <view class="sign-title"> {{item.title}}<i></i></view>
                </u-col>
                <u-col span="9">
                    <u-input v-model="item.value" :readonly="readOnly" :type="item.type" :placeholder="item.placeholder" clearable border="none"></u-input>
                </u-col>
            </u-row>
            <u-row :gutter="10" style="border-bottom: 1px solid #e4e4e4;">
                <u-col span="3" class="hdCellleft">
                    <view class="sign-title">参与人数 <i></i></view>
                </u-col>
                <u-col span="9">
                    <u-number-box v-model="count" :disabled="readOnly">
                        <view slot="minus" class="minus">
                            <u-icon name="minus" color="#FFFFFF" size="15"></u-icon>
                        </view>
                        <text slot="input" class="input">{{count}}</text>
                        <view slot="plus" class="plus">
                            <u-icon name="plus" color="#FFFFFF" size="15"></u-icon>
                        </view>
                    </u-number-box>
                </u-col>
            </u-row>
            <view v-if="activityInfo.isFree==0">
                <view class="sign-title">支付方式</view>
                <view class="sign-zf">
                    <u-radio-group v-model="payType" placement="column">
                        <view class="sign-zfcell">
                            <view class="cell-left">
                                <u-icon name="weixin-fill" color="#04BE02" size="28"></u-icon><text>微信</text>
                            </view>
                            <u-radio name="1"></u-radio>
                        </view>
                        <view class="sign-zfcell">
                            <view class="cell-left">
                                <u-icon name="zhifubao" color="#1977fd" size="28"></u-icon> <text>支付宝</text>
                            </view>
                            <u-radio name="2"></u-radio>
                        </view>

                    </u-radio-group>
                </view>
            </view>

            <view class="activity-sign-btn" v-if="activityInfo.checkStatus === '200'">
                <view class="sign-btn" @click="submitSign">{{registrationStatus}}</view>
                <view v-if="activityInfo.asuid" class="sign-btn" @click="cancelSign">取消报名</view>
            </view> 
            <view class="activity-sign-btn" v-if="activityInfo.checkStatus != '200'">
                <view class="sign-btn sign-btn-Disable">{{activityInfo.checkMsg}}</view>
            </view>
        </view>

        <u-modal :show="showTip" title="提示" :width="260" @confirm="goback">
            <view class="slot-content">
                <text>此活动为业主专享活动，只有业主才能参加此活动哟</text>
            </view>
        </u-modal>
        <u-modal :show="showSingSuccess" title="提示" @confirm="submintAlert">
            <view class="slot-content">
                <text>报名成功</text>
            </view>
        </u-modal>
        <u-modal :show="payModal" title="提示" @confirm="payModal=false">
            <view class="slot-content">
                <text>{{payMessage}}</text>
            </view>
        </u-modal>
        <u-modal :show="payAlert.show" title="支付确认" @confirm="alertHide" :confirmText="payAlert.confirm">
            <view class="slot-content">
                <text>{{payAlert.content}}</text>
            </view>
        </u-modal>
        <u-toast ref="uToast"></u-toast>

    </view>
</template>

<script>
import appConfig from '@/app-config';
import util from '../../js/utils';
import { getActivityByUser, addClickCountById, saveActivitySignUp, cancelSignUpByAsuid } from '../../service/wxmanage'
import { saveTbgOrder, getPayChannel, getPay2 } from '../../service/community'
import { param } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
export default {
    data() {
        return {
            aid: '',
            activityInfo: {},
            signBtnName: '报名',
            isSignBtn: false,//报名按钮
            regInformationStart: true,//报名信息填写
            registrationStatus: '',//报名按钮文字
            showSingSuccess: false,//报名成功弹窗
            showTip: false,
            signUpInfos: [],//报名信息
            count: 1,
            readOnly: false,//报名信息只读
            payType: "1",//1:微信，2支付宝
            projectId: '',
            memberId: '',
            payModal: false,//支付成功提示
            payMessage: '',
            payAlert: {
                show: false,
                title: "支付提示",
                confirm: "确定",
                content: "支付成功",
                success: false
            },

        }
    },
    onLoad(e) {
        // this.time = uni.$u.timeFormat(this.timestamp, 'yyyy-mm-dd');

        const { MEMBER_ID, PROJECT_ID } = this.$constant;
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });

        this.aid = e.aid;
        this.getInfo();
    },
    computed: {
        totalMoney: {
            get() {
                if (this.count && this.activityInfo.money) {
                    let temp = this.count * this.activityInfo.money;
                    let y = String(temp).indexOf(".") + 1; //获取小数点的位置
                    if (y > 0) {
                        return temp.toFixed(2);
                    } else {
                        return temp;
                    }
                } else {
                    return 0;
                }
            },
            set(newVal) {
                return newVal;
            }
        }
    },
    methods: {
        getInfo() {
            let that = this;
            var params = {
                data: {
                    aid: that.aid,
                    memberId: that.memberId,
                },
                "hideLoading": true
            }
            getActivityByUser(params).then(res => {
                if (res.statusCode == 200) {
                    that.activityInfo = res.data;
                    that.count = that.activityInfo.num || 1;

                    //   判断是否业主专享活动  1、业主专享  0、非业主专享
                    const { USER_TYPE } = this.$constant;
                    const userType = util.storageAction({ key: USER_TYPE, action: 'get' });
                    if (that.activityInfo.isMember == 1 && (userType != '业主')) {
                        //   判断是否业主
                        that.showTip = true;
                    }

                    //报名截至时间前显示报名按钮
                    let tempTime = that.activityInfo.signUpEndDate;
                    tempTime = tempTime.replace(/-/g, '/');
                    let signUpEndDate = new Date(tempTime).getTime();
                    let newTime = new Date().getTime()
                    if (signUpEndDate > newTime) {
                        that.isSignBtn = true
                    }
                    if (that.activityInfo.asuid == "") {
                        if (that.activityInfo.isFree == 0) {
                            that.registrationStatus = "确认报名并支付";
                        } else {
                            that.registrationStatus = "确认报名";
                        }
                        if (that.activityInfo.limitNum !== 0 && that.activityInfo.limitNum == that.activityInfo.signUpNum) {
                            that.signBtnName = "报名人数已达上限";
                            that.isSignBtn = true;
                        }
                    } else {
                        that.registrationStatus = "已参加";
                        that.signBtnName = "已参加";
                        that.isSignBtn = true;
                        that.readOnly = true;
                    }

                    //   报名信息 已报名过的
                    if (that.activityInfo.asuid) {
                        that.signUpInfos = JSON.parse(that.activityInfo.detail);

                    } else {
                        // 未报名过的
                        that.activityInfo.signUpInfo.split(";").forEach(function (e) {
                            var signUpInfo = {};
                            signUpInfo.title = e;
                            signUpInfo.value = "";

                            if (e == '姓名') {
                                signUpInfo.placeholder = "请填写您的真实姓名"
                            } else if (e == '身份证') {
                                signUpInfo.type = 'idcard'
                                signUpInfo.placeholder = "请填写您的身份证号码"
                            } else if (e == '电话') {
                                signUpInfo.type = 'number'
                                signUpInfo.placeholder = "请填写您的联系电话"
                            } else {
                                signUpInfo.placeholder = `请填写${e}`
                            }
                            that.signUpInfos.push(signUpInfo);
                        });
                    }


                }

            })
        },

        signButton() {
            let that = this;
            that.isSignBtn = false;

            if (that.regInformationStart == true) {
                // that.identityType = '1';
                that.regInformationStart = false;
                // this.setInputAttr();
            } else {
                // that.instructionsStart = 0;
                that.regInformationStart = true;
            }
        },
        openPage() {
            let that = this;
            let link = that.activityInfo.summaryUrl;
            if (link) {
                var params = {
                    data: {
                        articleId: that.activityInfo.summaryId,
                        userId: that.memberId,
                    },
                    "hideLoading": true
                }
                if (that.activityInfo.summaryId) {
                    addClickCountById(params);

                }
            }

            uni.navigateTo({
                url: `/pages-d/webview/webview?url=${link}`
            })


        },
        cancelSign() {
            //    取消报名
            let that = this;
            uni.showModal({
                title: '提示',
                content: '您确认要取消报名吗？',
                confirmText: "好的",
                confirmColor: '#13C3BF',
                success: function (res) {
                    if (res.confirm) {
                        var params = {
                            data: { asuid: that.activityInfo.asuid }
                        }
                        cancelSignUpByAsuid(params).then(res => {
                            if (res.status == 200) {
                                that.$refs.uToast.show({
                                    type: 'default',
                                    message: '取消报名成功',
                                })
                                window.location.reload()
                            } else {
                                that.$refs.uToast.show({
                                    type: 'default',
                                    message: res.message,
                                })
                            }
                        })
                    }
                }
            });
        },
        //收费活动
        async submitSign() {
            let that = this;
            await that.signUp();
            const payOrderNo = "M" + uni.$u.timeFormat(new Date(), 'yyyymmddhhMMss') + "0";
            // const payOrderNo = 'M2022110418201820';

            console.log('缴费报名', payOrderNo)
            console.log('报名3', that.activityInfo.payType)
            if (that.activityInfo.isFree == 0) {
                let params = await that.uploadPayOrder({ payOrderNo: payOrderNo });
                // let params = {
                //     "chargeStatus": "1",
                //     "createUserid": "589a026333884f14ba6804582a293388",
                //     "creator": "",
                //     "memberId": "589a026333884f14ba6804582a293388",
                //     "projectId": 1,
                //     "orNo": "S2022110418234290",
                //     "parentOrNo": "M2022110418201820",
                //     "goodssendStatus": "0",
                //     "orderStatus": "5",
                //     "payType": "1",
                //     "payTotalFee": "0.10",
                //     "payment": "0"
                // }
                console.log('参数', params)
                let add = await that.paymentByAddr(params)
                params.assetsId = add.assetsId;
                let pay = await that.goToPay(params)
                console.log(add)
                console.log('pay', pay)

            }


        },
        signUp() {
            let that = this;
            return new Promise((resolve, reject) => {
                let flag = this.checkParam();
                if (flag) {
                    let signInfo = that.signUpInfos.map(m => {
                        return {
                            title: m.title,
                            value: m.value
                        }
                    })
                    var params = {
                        data: {
                            count: that.count,
                            content: JSON.stringify(signInfo),
                            isFree: that.activityInfo.isFree,
                            money: that.totalMoney ? that.totalMoney : 0,
                            aid: that.activityInfo.aid,
                            projectId: that.projectId,
                            memberId: that.memberId
                        },
                    }
                    console.log('缴费账单', params)

                    saveActivitySignUp(params).then(res => {
                        if (res.statusCode == 200) {
                            if (that.activityInfo.isFree != 0) {
                                console.log('报名信息', params)
                                that.getInfo();
                                that.showSingSuccess = true;
                                that.readOnly = true;
                                that.regInformationStart = true;
                            }
                            resolve()

                        }
                    })
                }
            })
        },
        // 校验报名参数
        checkParam() {
            let that = this;
            if (that.activityInfo.asuid == '') {
                if (that.count < 1) {
                    that.$refs.uToast.show({
                        type: 'default',
                        message: "报名人数至少为1",
                    })
                    return false;
                }

                for (var i = 0; i < that.signUpInfos.length; i++) {
                    let info = that.signUpInfos[i];
                    if (info.title == '姓名') {
                        if (!info.value) {
                            that.$refs.uToast.show({
                                type: 'default',
                                message: '请填写报名姓名',
                            })
                            return false;
                        }
                    } else if (info.title == '身份证') {
                        if (info.value && (!(/\d{17}[\d|x]|\d{15}/).test(info.value) || (info.value.length !== 15 && info.value.length !== 18))) {
                            that.$refs.uToast.show({
                                type: 'default',
                                message: '请填写正确身份证号码格式',
                            })
                            return false;
                        }

                    } else if (info.title == '电话') {
                        if (!info.value) {
                            that.$refs.uToast.show({
                                type: 'default',
                                message: '请填写电话号码',
                            })
                            return false;
                        } else if (info.value && (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/).test(info.value))) {
                            that.$refs.uToast.show({
                                type: 'default',
                                message: '请填写正确的电话号码格式',
                            })
                            return false;
                        }

                    }
                }
                // 校验报名人数是否超过限制报名人数
                if (
                    that.activityInfo.limitNum > 0 &&
                    that.count > that.activityInfo.limitNum - that.activityInfo.signUpNum
                ) {
                    that.$refs.uToast.show({
                        type: 'default',
                        message: '报名人数超过活动总人数',
                    })
                    return false;
                }
                //check限制单个人报名人数
                if (that.activityInfo.perLimit == 1) {
                    if (that.count > that.activityInfo.perLimitNum) {
                        that.$refs.uToast.show({
                            type: 'default',
                            message: `报名人数最多为${that.activityInfo.perLimitNum}`,
                        })
                        return false;
                    }
                }
                if (that.activityInfo.isFree == 0 && (!that.payType || that.payType == '')) {
                    that.$refs.uToast.show({
                        type: 'default',
                        message: `请选择支付方式`,
                    })
                    return false;
                }
                return true;
            } else {
                //    已报名 返回列表
                uni.navigateTo({
                    url: `/pages-d/activity/activityList`
                })
            }

        },
        //上传订单
        uploadPayOrder(args = {}) {
            let that = this;
            return new Promise((resolve, reject) => {
                const { payOrderNo } = args;
                const money =
                    that.activityInfo &&
                    that.activityInfo.money &&
                    Number(that.activityInfo.money);
                const userId = that.memberId;
                const memberId = that.memberId;
                const projectId = that.projectId;
                const payMny = (Number(that.count) * money).toFixed(2);
                const orNo = "S" + uni.$u.timeFormat(new Date(), 'yyyymmddhhMMss') + "0";
                const parentOrNo = payOrderNo;
                const payType = that.payType;
                const params = {
                    data: {
                        chargeStatus: "1", //收费状态 1 未收款 2 已收款
                        createUserid: userId, //userId
                        creator: "", //微信名称
                        memberId, //memberId
                        projectId, //项目id
                        orNo, //子订单号
                        parentOrNo, //母订单号
                        goodssendStatus: "0", //发货状态 0：未发货 1：已发货
                        orderStatus: "5", //订单状态：1-待处理,2-处理中,3-已完成,4-已取消,5-待付款,6-待发货,7-待收货,8-待收款,9-订单关闭
                        payType: payType, // 支付方式 微信支付：1
                        payTotalFee: payMny, //支付单金额
                        payment: "0" //付款方式 1.货到付款 0.在线支付
                    }
                };
                console.log('订单参数', params)

                // resolve(params)
                saveTbgOrder(params).then(res => {
                    if (res.statusCode == 200) {
                        resolve(params.data)
                    } else {

                    }
                })
            })
        },
        // 获取支付方式
        paymentByAddr(args = {}) {
            const { USER_ADDR_INFO } = this.$constant;
            let addrInfo = util.storageAction({ key: USER_ADDR_INFO, action: 'get' });
            let assetsId = addrInfo && addrInfo.addrId ? addrInfo.addrId : this.projectId;
            let payType = '';
            if (args.payType == 2) {
                payType = 'zfb'
            } else {
                payType = 'wx'
            }
            return new Promise((resolve, reject) => {
                var params = { pathParams: `/${payType}/${assetsId}` }
                getPayChannel(params).then(res => {
                    if (res.statusCode == 200) {
                        resolve({ assetsId })
                    }

                })
            })


        },
        // 获取支付参数
        goToPay(args = {}) {
            console.log('arg', args)
            let that = this;
            const { parentOrNo, payType, payTotalFee, projectId, assetsId } = args;
            const { PROXY_PATH, DOMAIN_DEV, DOMAIN_PRO } = appConfig;
            let notifyUrl = ` ${DOMAIN_PRO}/community/payCommon/v2/notify2/huodong/${parentOrNo}`;
            const returnUrl = '';
            // const returnUrl =
            //     url.substr(0, url.lastIndexOf("#") + 1) +
            //     `/getPayResult?orderNo=${parentOrNo}`;
            var params = {
                data: {
                    model: "huodong",
                    orderNo: parentOrNo,
                    totalAmount: util.floatMul(payTotalFee, 100), //必填 金额（单位：分）,
                    payType: payType,
                    projectId,
                    type: payType == 2 ? 1 : 0,
                    returnUrl: returnUrl,
                    assetsId: assetsId,
                    notifyUrl: notifyUrl,
                    other: {
                        openId: localStorage.openId,
                    }
                },
                responseToast: false
            }
            return new Promise((resolve, reject) => {
                getPay2(params).then(res => {
                    if (res.status == 200) {
                        const onBridgeReady = () => {
                            console.log("invoke on bridge ready");
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
                                res => {
                                    const success =
                                        res.err_msg === "get_brand_wcpay_request:ok";
                                    const tips = success ? "支付成功" : "失败成功";
                                    this.payAlert.confirm = success ? "返回上一页" : "确定";
                                    this.payAlert.success = success;
                                    this.payAlert.content = tips;
                                    this.payAlert.show = true;
                                }
                            );
                        };
                        const WeixinPayBridge = () => {
                            console.log("invoke Weixin PayBridge");
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener(
                                        "WeixinJSBridgeReady",
                                        onBridgeReady,
                                        false
                                    );
                                } else if (document.attachEvent) {
                                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                                    document.attachEvent(
                                        "onWeixinJSBridgeReady",
                                        onBridgeReady
                                    );
                                }
                            } else {
                                onBridgeReady();
                            }
                        };
                        if (res.data.type === "ebeipay") {
                            //银联商务

                            uni.location = res.data.data;
                        } else if (res.data.type === "swiftpass") {
                            //全付通
                            payInfo = JSON.parse(res.data.data.payInfo);
                            WeixinPayBridge();
                        } else if (res.data.type === "mbupay") {
                            //兴业银行 目前未对应
                        } else if (res.data.type === "xftPay") {
                            //浦发银行 星付通
                            payInfo = res.data.data.payInfo;
                            WeixinPayBridge();
                        }
                        resolve(params)
                    } else {
                        that.payModal = true;
                        that.payMessage = '支付失败;'
                        reject();
                    }
                })

            })

        },
        // 微信支付
        wechatPay() {
            uni.requestPayment({
                "provider": "wxpay",
                "orderInfo": {
                    "appid": "wx499********7c70e",  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
                    "noncestr": "c5sEwbaNPiXAF3iv", // 随机字符串
                    "package": "Sign=WXPay",        // 固定值
                    "partnerid": "148*****52",      // 微信支付商户号
                    "prepayid": "wx202254********************fbe90000", // 统一下单订单号 
                    "timestamp": 1597935292,        // 时间戳（单位：秒）
                    "sign": "A842B45937F6EFF60DEC7A2EAA52D5A0" // 签名，这里用的 MD5/RSA 签名
                },
                success(res) { },
                fail(e) { }
            })
        },
        // App支付
        appPay() {
            uni.requestPayment({
                provider: 'alipay',
                orderInfo: 'orderInfo', //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
                success: function (res) {
                    console.log('success:' + JSON.stringify(res));
                },
                fail: function (err) {
                    console.log('fail:' + JSON.stringify(err));
                }
            });
        },

        // 报名成功关闭弹窗
        submintAlert() {
            this.showSingSuccess = false;

        },
        goback() {
            uni.navigateBack({
                delta: 1
            });
        },
        alertHide() {
            const success = this.payAlert.success;
            if (success) {
                this.payAlert.success = false;
                this.$router.go(-1);
            }
        }
    }

}
</script>
 