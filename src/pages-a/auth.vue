<template>
	<view>
		<view class='about'>
			<view class='logo'>
				<image :src="require(`@/static/${[THEME_NAME]}/common/login.png`)"></image>
				<view class="loginText">欢迎登录{{ name }}</view>
			</view>
		</view>
		<view class="about-info">
			<view class="text-info">需要获取以下您的信息:</view>
			<view class="text-cinfo">您的公开信息（昵称、头像等）</view>

		</view>

		<!-- #ifdef MP -->
		<button class="login" open-type="getPhoneNumber" @getphonenumber="getuserinfo">微信一键授权</button>
		<!-- #endif -->
		<!--  #ifdef H5 -->
		<view class="login" @click="login">模拟登录</view>
		<!-- #endif -->
 	</view>
</template>

<script>
const md5 = require('js-md5')
import { getAuth, qpiUserLogin } from '../service/landcrm'
import utils from '../js/utils'
export default {
	data() {
		return {
			code: '',
			username: 'lhwyjtadmin',
			password: 'y12345',
			isQw: false,
			name: ''

		}
	},
	onLoad() {
		let that = this
		that.name =this.$appConfig.MINE_NAME
		// #ifdef MP-WEIXIN
		uni.login({
			success(res) {
				that.code = res.code
			}
		})

		// #endif  
	},
	methods: {
		back() {
			uni.reLaunch({ url: '/pages/index/index' })

		},
		qiwei() {

		},
		getuserinfo(e) {
			let that = this;
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				var params = {
					data: {
						appletId: 'wxc0f25fdbb36b57e2',
						code: that.code,
						encryptData: e.detail.encryptedData,
						iv: e.detail.iv
					}
				}
				getAuth(params).then(res => {
					if (res.status == 200) {
						const { IS_AUTH, TOKEN, O_USER_INFO } = that.$constant;
						res.data.userId = res.data.userid;
						utils.storageAction({ key: IS_AUTH, action: 'set', value: '1' });
						utils.storageAction({ key: TOKEN, action: 'set', value: res.data.token });
						utils.storageAction({ key: O_USER_INFO, action: 'set', value: res.data });
						// 返回上一页
						that.back();
					}

				})

			}
		},
		login() {
			let that = this;
			var params = {
				data: {
					userAccount: that.username,
					password: md5(that.password).toUpperCase(),
					verifyCode: '', //验证码
					verifyCodeToken: '',
					telephone: '',
					model: '',
					SMS_V_Code: ''
				}
			}
			qpiUserLogin(params).then(res => {
				if (res.result == 1) {
					const { IS_AUTH, TOKEN, O_USER_INFO } = that.$constant;
					let data = res.users[0];
					data.userId = data.userid;

					utils.storageAction({ key: IS_AUTH, action: 'set', value: '1' });
					utils.storageAction({ key: TOKEN, action: 'set', value: data.token });
					utils.storageAction({ key: O_USER_INFO, action: 'set', value: data });
					const { uniPlatform } = uni.getSystemInfoSync();
					const isWeb = uniPlatform === 'web';  
					if(isWeb){
						uni.setStorageSync('userName', data.userName);
						uni.setStorageSync('userId', data.userId);
						uni.setStorageSync('userAccount', data.userAccount);
						uni.setStorageSync('companyId', data.companyId);
						uni.setStorageSync('token', data.token);
					} 
					// 返回上一页
					that.back();
				} else {
					uni.showToast({
						title: '登录失败了',
						duration: 2000
					});
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.about {
	padding: 120rpx 40rpx 0;
}

.about .logo image {
	display: block;
	width: 180rpx;
	height: 180rpx;
	margin: 0 auto 35rpx;
	border-radius: 30rpx;
}

.logo {
	text-align: center;
}

.about .logo view {
	font-size: 36rpx;
	color: #333;
}

.foot {
	position: fixed;
	left: 0;
	right: 0;
	text-align: center;
	bottom: 40rpx;
}

.login {
	width: 600rpx !important;
	height: 86rpx !important;
	line-height: 86rpx !important;
	background: #1989F7 !important;
	font-size: 32rpx;
	border-radius: 6rpx !important;
	color: #fff;
	margin: 0 auto !important;
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 514rpx;
	text-align: center;
}

.zanbu {
	font-size: 32rpx;
	color: #999999;
	/* margin: 45rpx 0 80rpx; */
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 436rpx;
}

.xieyi {
	font-size: 24rpx;
	/* color: var(--mina) !important; */
	margin-bottom: 15rpx;
}

.copy {
	font-size: 24rpx;
	color: #9b9b9b;
}

.loginText {
	font-size: 44rpx;
	font-weight: bold;
	color: #333333;
}

.about-info {
	margin-top: 160rpx;
	padding-left: 80rpx;

	.text-info {
		font-size: 28rpx;
		color: #333333; 
		margin: 12rpx 0;
	}

	.text-cinfo {
		font-size: 24rpx;
		color: #666666; 
	}
}
</style>

