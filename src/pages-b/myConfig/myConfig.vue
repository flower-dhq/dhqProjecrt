<style scoped lang="scss">
.u-page {
    height: 100%;
    background-color: #f5f5f5;
    box-sizing: border-box;
}
.cent{
    padding-top: 40rpx;
    background-color: #f5f5f5;
}
.cell {
    @include flx-dsp($jsc: space-between, $ali: center); 
    margin-bottom: 2rpx;
    background: #FFFFFF;
    height: 100rpx;
    padding:0 22rpx 0 46rpx;
}
.cell view:first-child{
  color:#333;
  line-height: 100rpx;
  font-size: 28rpx;
}
</style>
<template>
    <view class="u-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="cent">
            <view class="cell" @click="updatePwd">
            <view>修改密码</view>
            <u-icon name="arrow-right" color="#0e0e0e" size="22"></u-icon>

        </view>
        <view class="cell" @click="logOut">
            <view>退出登录</view>
            <u-icon name="arrow-right" color="#0e0e0e" size="22"></u-icon>
        </view>
        <view class="cell" @click="deleteAccount">
            <view>注销</view>
            <u-icon name="arrow-right" color="#0e0e0e" size="22"></u-icon>
        </view>
    </view>
      <custom-modal ref="customModal"></custom-modal>
      <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
import util from '../../js/utils';
import { cancellationMember } from '@/service/community';

export default {
    data() {
        return {
            phoneNumber:'',
        }
    },
    onLoad() {
        const { O_USER_INFO, IS_ASSOCIATION } = this.$constant;
        const { phoneNumber} = util.storageAction({ key: O_USER_INFO, action: 'get' });
        this.phoneNumber = phoneNumber
        console.log(53,phoneNumber)
    },
    methods: {
        updatePwd() {
            uni.navigateTo({ url: '/pages-b/myConfig/editPassword' });

        },
        logOut() {
            let that = this;
            this.$refs.customModal.show({
                            content: '是否确认退出登录？',
                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmText: "确定",
                            cancelText: '取消',
                            onConfirm: () => {
                                uni.clearStorage();
                                uni.reLaunch({ url: `/pages-a/authorization/login?phone=${that.phoneNumber}` });
                            }
                        })
            // uni.showModal({
            //     // title: '提示',
            //     content: '是否确认退出登录？',
            //     cancelColor:'#353535',
            //     confirmColor:'#2EC6D1',
            //     success: function (res) {
            //         console.log(68,res)
            //         if (res.confirm) {
            //             uni.clearStorage();
            //             console.log(82,that.phoneNumber)
            //             // uni.reLaunch({ url: '/pages-a/authorization/login'});
            //             uni.reLaunch({ url: `/pages-a/authorization/login?phone=${that.phoneNumber}` });
            //         } else if (res.cancel) {
            //             console.log('用户点击取消');
            //         }
            //     }
            // });
        },
        deleteAccount() {
            this.$refs.customModal.show({
                content: '您注销之后，将无法登录！',
                showConfirmButton: true,
                showCancelButton: true,
                confirmText: "确定",
                cancelText: '取消',
                onConfirm: () => {
                    const { O_USER_INFO } = this.$constant;
                    const {STRG_phone, companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' }) || {}
                    const params = {
                        data: {
                            userAccount: STRG_phone,
                            companyId,
                        },
                        loadingText: '注销中',
                        successfulText: '注销成功',
                        responseToast: true
                    }
                    cancellationMember(params).then(res => {
                        if (res.success) {
                            uni.clearStorage();
                            setTimeout(() => {
                                uni.reLaunch({ url: `/pages-a/authorization/login`});
                            }, 600);
                        }
                    })
                }
            })
        }
    }

}
</script>
 