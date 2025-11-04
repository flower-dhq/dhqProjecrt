<style lang="scss" scoped>
.u-page {
    height: 100%;
    // background-color: #f5f5f5;
    box-sizing: border-box;
    padding: 20rpx 48rpx;
}
.codetext {
    color: var(--app-primary-color);
    font-size: 28rpx;
    margin-right: 18rpx;
    margin-left: 8rpx;
}
/* .btn {
    width: 40%;
    background-color: var(--app-primary-color);
    color: #ffffff;
    margin: 20rpx auto;
} */
.editForm{
    background-color: #fff;
    // padding: 0 30rpx;
    box-sizing: border-box;
}

.eidtButton ::v-deep .u-button--small{
//   margin-top: 60rpx;
    height: 68rpx;
  font-size: 28rpx;
}
.eidtButton {
    width: 540rpx;
    margin: auto;
    margin-top: 80rpx;
    height: 68rpx;
  font-size: 14px;

}
.editButon {
  font-size: 28rpx;
}
.custom-style {
	font-size: 28rpx;
	height: 68rpx;
    background-color: var(--app-primary-color);
    color: #ffffff;
	}

    ::v-deep    .custom-style {
        span{
            font-size: 28rpx;
	        height: 68rpx;
           background-color: var(--app-primary-color);
            color: #ffffff;
        }
	}
    ::v-deep  .eidtButton  .u-button--small {
      font-size: 14px !important;
	}

    ::v-deep  .eidtButton  .u-button__text{
      font-size: 14px !important;

    }

    ::v-deep .u-form-item .u-form-item__body{
        padding: 24rpx 0 12rpx 0;
    }
    .phoneText{
        padding-left: 30rpx;
    }
</style>
<template>
    <view class="u-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="editForm">
            <u--form labelPosition="left" :model="basicInfo" ref="form1">
            <u-form-item prop="userInfo.name" borderBottom ref="item1">
                <text class="phoneText">{{ basicInfo.phone }}</text>
                <!-- <u--input v-model="basicInfo.phone" placeholder="请输入手机号码" border="none" clearable placeholderStyle="font-size:14px;color:#d7d7d7" customStyle="padding-left:15px;padding-right:9px"></u--input> -->
            </u-form-item>
            <u-form-item prop="code" borderBottom>
                <u--input v-model="basicInfo.code" placeholder="请输入验证码" border="none" clearable placeholderStyle="font-size:14px;color:#d7d7d7" customStyle="padding-left:15px;padding-right:9px"></u--input>
                <text class="codetext" slot="right" @click="codeDisable?'':getCode()">{{tips}}</text>
            </u-form-item>
            <u-form-item prop="userInfo.name" borderBottom ref="item1">
                <u--input :type="showPwd?'password':''" v-model="basicInfo.pwd" placeholder="请输入新密码" border="none" clearable placeholderStyle="font-size:14px;color:#d7d7d7" customStyle="padding-left:15px;padding-right:9px"></u--input>
                <!-- <u-icon slot="right" :name="showPwd?'eye':'eye-fill'" @click="changePwd"></u-icon> -->
            </u-form-item>
            <u-form-item prop="userInfo.name" borderBottom ref="item1">
                <u--input :type="showPwds?'password':''" v-model="basicInfo.pwds" placeholder="再次确认密码" border="none" clearable placeholderStyle="font-size:14px;color:#d7d7d7" customStyle="padding-left:15px;padding-right:9px"></u--input>
                <!-- <u-icon slot="right" :name="showPwds?'eye':'eye-fill'" @click="changePwds"></u-icon> -->
            </u-form-item>
        </u--form>
        </view>
        <view class="eidtButton">
        <u-button  class="custom-style editButon" text="提交" size="small" type="primary" shape="circle" @click="submit"></u-button>
        </view>
    </view>
</template>

<script>
import util from '../../js/utils'
import commLogic from '@/js/comm-logic';
import { getSmsCode, changPwdByCode } from '../../service/community'
const md5 = require('js-md5');
export default {
    data() {
        return {
            tips: '获取验证码',
            showPwd: true,
            showPwds: true,
            basicInfo: {
                phone: '',
                code: '',
                pwd: '',
                pwds: '',
            },
            codeDisable: false,
            timeNum: 60,
        };
    },
    onLoad() {
        const { O_USER_INFO } = this.$constant;
        const { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        this.basicInfo.phone = phoneNumber
    },
    methods: {
        changePwd() {
            this.showPwd = !this.showPwd;
        },
        changePwds() {
            this.showPwds = !this.showPwds;
        },
        getCode() {
            if (!uni.$u.test.mobile(this.basicInfo.phone)) {
                this.showToast('请输入正确手机号码')
                return;
            }
            // const { O_USER_INFO } = this.$constant;
            // let userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
            // if (this.basicInfo.phone != userInfo.phoneNumber) {
            //     this.showToast('请输入当前账号绑定的手机号')
            //     return;
            // }
            const { PROJECT_TYPE } = this.$constant;
            
             var params = {
                data: {
                    mobiles: this.basicInfo.phone,
                    model: 2, //1.登录  2.验证码
                    codeModel: 2,//1.注册  2.修改密码
                    projectType: util.storageAction({ key: PROJECT_TYPE, action: 'get' })
                }
            }
            getSmsCode(params).then(res => {
                if (res.status == 200) {
                    this.countdown();
                    this.showToast('短信验证码发送成功')
                } else {
                    this.showToast('短信验证码发送失败')

                }

            })
        },
        // 倒计时
        countdown() {
            var that = this;
            if (!that.codeDisable) {
                that.codeDisable = true;
                var time = that.timeNum;
                that.tips = time + "s";
                var myTimes = setInterval(() => {
                    if (time > 0) {
                        time--;
                        that.tips = time + "s";
                    } else {
                        time = that.timeNum;
                        that.codeDisable = false;
                        that.tips = "重新获取";
                        clearInterval(myTimes); //停止循环
                    }
                }, 1000);
            }
        },
        submit() {  
            if (!uni.$u.test.mobile(this.basicInfo.phone)) {
                this.showToast('请输入正确手机号码')
                return;
            }
            if (!this.basicInfo.code) {
                this.showToast('请输入验证码');
                return;
            } 
            if (!this.basicInfo.pwd) {
                this.showToast('请输入密码');
                return;
            }
            if (!this.basicInfo.pwds) {
                this.showToast('请输入确认密码');
                return;
            }
            if (this.basicInfo.pwd != this.basicInfo.pwds) {
                this.showToast('两次密码不一致');
                return;
            }
            const { COMPLANY_ID } = this.$constant;
            const { companyId: companyIds } = commLogic.getProjectConfig();
						const newPassword = md5(this.basicInfo.pwd.trim()).toUpperCase();
            var params = {
                data: {
                    code: this.basicInfo.code,//手机验证码
                    mobile: this.basicInfo.phone, // 手机号
                    companyIds, // 公司id
                    newPassword, //申请人姓名
                }
            }
            changPwdByCode(params).then(res => {
                if (res.status == 200) {
                    uni.showToast({title: '修改密码成功', icon: 'none'})
                    setTimeout(() => {
					       uni.navigateBack();
                                }, 800) 
                } else {
                    this.showToast(res.message)
                }
            })
        },

        // 提示
        showToast(tips) {
            uni.showToast({ title: tips, icon: 'none' });
        },

    },
};
</script>