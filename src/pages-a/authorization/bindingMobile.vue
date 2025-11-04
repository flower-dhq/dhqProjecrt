<!--  -->
<template>
    <view class="wx-auth" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]"> 
        <view class="red">
            <view class="box">
                <view class="box-text">授权</view>
                <view class="box-input">
                    <u--input fontSize="13px" color="#333333" shape="circle" v-model="phoneNum" placeholder="请输入手机号"
                        border="surround" :customStyle="{padding: '6px 13px'}"></u--input>
                </view>
                 <view v-if="smsEnableState == 1" class="box-input"> <u-input style="margin: 20rpx 0;" :maxlength="6" shape="circle" fontSize="13px" color="#333333" v-model="smsCode"
                        placeholder="请输入验证码" border="surround" :customStyle="{padding: '6px 13px'}">
                        <template slot="suffix">
                            <u-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"></u-code>
                            <u-button @tap="getCode" :text="tips" :plain="true" :color="THEME_COLOR" type="success" :customStyle="{borderWidth: 0, height: '24px', padding: 0}" />
                        </template>
                    </u-input>
                </view>
                <view class="box-input input-desc"> 为了给您提供更好的服务，请先绑定您的手机号码，谢谢！ </view>
                <view>
                    <u-button style="margin: 20rpx 0;" shape="circle" type="primary" :color="THEME_COLOR" :customStyle="{height: '35px'}"
                        text="提交" @click="bindMobile"></u-button>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import utils from '@/js/utils';
import { getSmsCode, registerByWx, appletLogin,getCompanyConfig } from "../../service/community";
import commLogic from '@/js/comm-logic';

export default {
    components: {},
    data() {
        return {
            tips: '',
            seconds: 60,
            phoneNum: '',
            smsCode: '',
            goSmsCode: '',
            smsEnableState: 1,
            authentication: '',
            otherQuery: {}
        };
    },
    computed: {},
    watch: {},
    onLoad(e) {
        // '/pages-a/authorization/auth-certify' 跳转到 'pages-a/authorization/bindingMobile'
        const { type, authentication, ...tempOther } = e || {}
        if (type == 1) {
            this.getWXuserId()
        }
        if (authentication) {
            this.authentication = authentication || ''
        }
        this.otherQuery = tempOther
        // 分享后，进入授权页面，wxUserId参数缺失，需要获取
        const { WX_USERID } = this.$constant;
        let wxUserId =  utils.storageAction({ key: WX_USERID, action: 'get' })
        if (!wxUserId) {
            this.getWXuserId()
        }
    },
    methods: {
        codeChange(text) {
            this.tips = text;
        },
        bindMobile() {
            var self = this;
            if (self.goSmsCode != "" && self.goSmsCode == self.smsCode) {
                self.message('请勿重复提交~');
                return;
            }
            var valid = this.formVerifyValid('submit');
            self.goSmsCode = self.smsCode;
            if (!valid) return;
            const { PROJECT_TYPE, WX_USERID, O_USER_INFO } = this.$constant;
            let userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
            const { projectType } = commLogic.getProjectConfig();

            var params = {
                data: {
                    mobile: self.phoneNum,
                    code: self.smsEnableState == 1 ? self.smsCode : '',
                    model: 2, //1.登录  2.验证码
                    wxUserId: utils.storageAction({ key: WX_USERID, action: 'get' }),
                    projectType: projectType
                }
            }
            // console.log('参数',params);
            // return;
            registerByWx(params).then(res => {
                // let res = {"status":"200","message":"成功","data":{"updateDate":"","tagCode":"","unionID":"otb9o1DQsHanp2e0yop3fkINc9O8","headimg":"","loginState":"","tagJson":"","idCardNo":"","jpushRegistrationId":"","unifiedMemberId":"","isAssociation":1,"lastLoginDate":"","source":7,"parentAccount":"","memberCard":"No.1693210369986","shopPrivacyAgreementVersion":"","points":"","updater":"","shopUseAgreementVersion":"","password":"","memberGradeId":"","communityPrivacyAgreementVersion":"","nickname":"游客No.4392","communityUseAgreementVersion":"","id":"3979e2b94e874470860657c1c0af5719","state":1,"firstAuthDate":"1693272532000","invitationCode":"","createDate":"1693210370000","unsubscribeDate":"","deviceType":"","authDate":"1693272532000","birthDay":"","isReaffirmAgreement":"","creator":"admin","operaDate":"1693332001000","accountType":"","sex":"","fullName":"廉嘉","alia":"","isFirstRegist":"","token":"6e0ddc9afbbb1e83e77f0778c5758eb3","adapterAccount":"63392367","memberNo":"","companyId":"451","phoneNumber":"17375597174","locationCode":"","fhhMemberId":"","isUnsubscribe":""}}
                if (res.status == '200') {
                    let data = res.data
                    if (data.code && data.code == 400) {
                        uni.showToast({ title: data.message, icon: 'none' })
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1,
                            })
                        }, 2000)
                        return;
                    }
                    const { token, id } = data
                    const { TOKEN, MEMBER_ID, O_USER_INFO } = this.$constant;
                    const storage = commLogic.setOwerUserInfo('loginPage', data)
                    utils.storageAction({ key: TOKEN, action: 'set', value: token });
                    utils.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                    utils.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                    uni.showToast({ title: "绑定成功", icon: 'none' })
                    setTimeout(() => {
                        if (self.authentication) {
                            const query = uni.$u.queryParams(Object.assign({ authType: 'none' }, this.otherQuery))
                            if (self.authentication == 'qy') {
                                uni.reLaunch({
                                    url: '/pages-d/enterprise-info/enterprise-auth-list' + query
                                });
                            } else if (self.authentication == 'paymentCenterNew') {
                                uni.reLaunch({
                                    url: '/pages-a/authorization/auth-jump?pathCode=paymentCenterNew'
                                });
                            } else if (this.authentication == 'none') {
                                uni.reLaunch({ url: '/pages-a/authorization/auth-certiry' + query })
                            } else {
                                // authentication=fw
                                uni.reLaunch({
                                    url: '/pages-b/house-info/add-house-address' + query
                                });
                            }
                        } else {
                            uni.navigateBack({
                                delta: 1,
                            })
                        }
                    }, 2000)
                } else {
                    uni.showToast({ title: res.data, icon: 'none' })
                }
            })

        },
        getCode() {
            let valid = this.formVerifyValid();
            if (!valid) return;
            if (this.$refs.uCode.canGetCode) {
                // 模拟向后端请求验证码
                uni.showLoading({
                    title: '正在获取验证码'
                })
                const { PROJECT_TYPE, O_USER_INFO } = this.$constant;
                const { projectType } = commLogic.getProjectConfig();

                // let userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
                let params = {
                    data: {
                        mobiles: this.phoneNum,
                        model: 2, //1.登录  2.验证码
                        projectType: projectType
                    },
                    responseToast: false,
                    hideLoading: false
                }

                getSmsCode(params).then(res => {
                    uni.hideLoading();
                    if (res.status == 200) {
                        uni.$u.toast('验证码已发送');
                        // 通知验证码组件内部开始倒计时
                        this.$refs.uCode.start();
                    } else {
                        uni.$u.toast(res.message);
                    }
                })

            } else {
                uni.$u.toast('倒计时结束后再发送');
            }
        },
        formVerifyValid(type) {
            var phoneValid = /^1\d{10}/.test(this.phoneNum.trim());
            var phoneEmpty = this.phoneNum.trim() === '';
            var smsCodeEmpty = this.smsCode.trim() === '';
            var tips = phoneEmpty ? '请输入手机号码~' : !phoneValid ? '请输入正确手机号码~' : '';
            if (type === 'submit' && this.smsEnableState == 1) {
                tips = tips !== '' ? tips : smsCodeEmpty ? '请输入验证码~' : '';
            }
            if (tips) this.message(tips);
            return tips === '';
        },
        message(content) {
            uni.showToast({
                title: content,
                icon: 'none',
                duration: 2000,
                position: 'bottom'

            });
        },
        //获取wxuserId
        async getWXuserId() {
            const { companyId } = commLogic.getProjectConfig();
            const { PROJECT_TYPE } = this.$appConfig;
            const { code } = await this.getWxCode().catch(_ => { });
            let params = {
                data: {
                    code: code,
                    appletId: PROJECT_TYPE,
                    companyId: companyId,
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
                        data.wxUserId = res.data.wxUserId
                    } else {
                        data = {
                            companyId: obj.companyId,
                            id: obj.memberId,
                            token: obj.token,
                            wxUserId: obj.wxUserId,
                            nickname: obj.wxUserName
                        }
                    }
                    const { token, id, wxUserId } = data
                    // 有手机号码，设置缓存
                    const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID } = this.$constant;
                    const combineData = { ...obj, ...data }
                    // 用的是微信小程序登录接口，用mpWeixin方法处理
                    const storage = commLogic.setOwerUserInfo('mpWeixin', combineData)
                    utils.storageAction({ key: TOKEN, action: 'set', value: token });
                    utils.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                    utils.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                    utils.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                }
            })
        },
        end() {
            uni.$u.toast('倒计时结束');
        },
        start() {
            uni.$u.toast('倒计时开始');
        },
        getCompanyDataList() {

            const { O_USER_INFO } = this.$constant;
            const { companyId } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    companyId: companyId
                }
            }
            getCompanyConfig(params).then(res => {
                if (res.status == 200) {
                    let info = res.data;
                    this.smsEnableState = info.smsEnableState;
                }

            })

        },
        // 获取微信授权code
        getWxCode(pvd) {
            return new Promise((resolve) => {
                uni.getProvider({
                    service: 'oauth',
                    success: (provider) => {
                        uni.login({
                            provider: pvd || provider,
                            onlyAuthorize: !!pvd, // 微信登录仅请求授权认证
                            success: (res) => {
                                resolve(res);
                            },
                            fail: (error) => {
                                resolve(error);
                            },
                        });
                    },
                    fail: (error) => {
                        resolve(error);
                    },
                });
            });
        },
    },
    created() {
        this.getCompanyDataList()
    },
    mounted() {

    },
}
</script>
<style scoped lang="scss"> .tips {
     background: rgba(0, 0, 0, 0.08);
     font-size: 20rpx;
     font-family: PingFang SC;
     font-weight: 400;
     line-height: 28rpx;
     color: #FFFFFF;
     padding: 12rpx 42rpx;
 }

 .red {
     background-image: url("@/static/theme-default/index/index_bg.png");
     background-repeat: no-repeat;
     background-size: 100%;
     background-color: #f5f5f5;
     min-height: 100vh;
      position: relative;
 }

 .box {
     background: rgba(255, 255, 255, 1);
     opacity: 1;
     border-radius: 24rpx;
     margin: 0 68rpx;
     padding: 32rpx 36rpx;
     position: absolute;
     top: 112rpx;

     .box-text {
         font-size: 44rpx;
         font-weight: bold;
         line-height: 60rpx;
         color: #333333;
         margin-bottom: 66rpx;
     }
     .box-input{
        margin-bottom: 66rpx;
        text-align: center;
     }
                                                                                                                                                                                                                                                            .input-desc { font-size: 14px; }
 }
</style>