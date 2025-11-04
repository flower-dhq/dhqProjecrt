<!--  -->
<template>
    <view class="lockBox">
        <view>
            <image :src="require(`@/static/theme-default/common/lock.png`)"></image>
        </view>
        <view class="lock-text">您没有权限访问该页面</view>
        <view class="lock-text2">{{errorCode | getMessage}}</view>
        <view class="lock-btn" slot="confirmButton">
            <navigator open-type="exit" target="miniProgram" class="close-btn complete">我知道了</navigator>
        </view>
    </view>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            errorCode: '', // 错误类型
        }
    },
    filters: {
        getMessage(val) {
            const map = {
                login: '如需访问，请联系系统管理员开通账号权限',
                menu: '如需访问，请联系系统管理员开通系统权限'
            }
            return map[val] || map['login']
        }
    },
    onLoad(options) {
        this.errorCode = options.errorCode || ''
    }
}
</script>
<style scoped lang="scss">
.lockBox {
    background: #FFFFFF;
    text-align: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 20%;
    margin: 0 auto;

    image {
        width: 540rpx;
        height: 300rpx;
    }

    .lock-text {
        font-size: 28rpx;
        font-weight: bold;
        line-height: 30rpx;
        color: #333333;
    }

    .lock-text2 {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 30rpx;
        color: #999999;
        height: 38px;
        line-height: 38px;
    }

    .lock-btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-btn {
        background: #1989F7;
        font-size: 30rpx;
        color: #FFFFFF;
        width: 330rpx;
        height: 80rpx;
        line-height: 80rpx;
    }

}
</style>