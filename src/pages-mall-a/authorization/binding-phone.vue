<style  scoped lang="scss">
	.binding-phone{
		width: 100%;
		height: 100%;
		background-size: 100%;
		background-repeat: no-repeat;
		background-color: #fff;
		padding-top: 114rpx;
		box-sizing: border-box;
		.submit-form{
			margin: 0 auto;
			width: 615rpx;
			background-color: #fff;
			border-radius: 24rpx 24rpx 0 0;
			box-sizing: border-box;
			.title{
				display: block;
				font-size: 44rpx;
				padding: 36rpx;
				font-weight: Bold;
			}
			.form-cont{
				width: 100%;
				box-sizing: border-box;
				padding: 32rpx;
				$lh: 80rpx;
				.control{
					border: 1rpx solid #d6d6d6;
					border-radius: 40rpx;
					padding: 0 30rpx;
					input{
						height: $lh;
						line-height: $lh;
						color: #b7b7b7;
					}
				}
				.auth-code{
					margin-top: 64rpx;
					margin-bottom: 32rpx;
					@include flx-dsp($jsc: space-between, $ali: center);
					input{
						width: 250rpx;
					}
					text{
						line-height: $lh;
						color: $uni-color-primary;
						font-size: 30rpx;
					}
				}
				.tips-text{
					margin: 0 auto 80rpx auto;
					display: block;
					width: 480rpx;
					text-align: center;
					font-size: 24rpx;
					line-height: 40rpx;
				}
				.submit-button{
					display: block;
					width: 100%;
					line-height: 72rpx;
					height: 72rpx;
					text-align: center;
					background-color: $uni-color-primary;
					color: #fff;
					font-size: $uni-font-size-base;
					border-radius: 36rpx;
				}
			}
		}	
	}
</style>

<template>
	<view class="binding-phone" :style="{'background-image': `url(${backgroundImge})`}">
		<view class="submit-form">
			<text class="title">授权</text>
			<view class="form-cont">
				<view class="control">
					<input @input="onInput($event, 'phone')" type="number" placeholder-style="color:#b7b7b7" :value="form.phone" placeholder="请输入手机号码" />
				</view>
				<view class="control auth-code">
					<input @input="onInput($event, 'code')" type="number" placeholder-style="color:#b7b7b7" :value="form.code" placeholder="请输入验证码" />
					<text @tap="getAuthCode">{{getCodeText}}</text>
				</view>
				<text class="tips-text">为了给您提供更好的服务，请先绑定您的手机号码，谢谢！</text>
				<text class="submit-button" @tap="submitForm">提交</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				backgroundImge: require('@/pages-mall-a/static/binding_bg.png'),
				form: {
					phone: '',
					code: ''
				},
				getCodeText: '获取验证码',
				countDown: null,
				counting: false,
				binding: false
			}
		},
		computed: {
			isPlatform() {
				/* #ifdef H5 */
				const isApp = this.$cmMth.isWebViewApp()
				return isApp ? 'APP' : 'MP'
				/* #endif */

				/* #ifdef MP-WEIXIN */
				return 'APPLET'
				/* #endif */

				return undefined
			}
		},
		methods: {
			// 获取验证码
			getAuthCode() {
				const {phone, code} = this.form;
				const emptyPhone = phone.trim() === ''; 
				const invalidPhone = !emptyPhone && !/1\d{10}$/.test(phone)
				const counting = this.counting;
				if (counting) return;
				if (emptyPhone || invalidPhone) {
					const prms = {
					    title: emptyPhone ? '请输入手机号码~' : '请输入正确手机号码~',
					    duration: 2000,
						icon: 'none'
					}
					uni.showToast(prms);
				} else {
					const { projectType } = this.$cmMth.getProjectConfig()
					this.counting = true;
					this.$mallApi.data.getSmsCode({data: {mobiles: phone, model: 2, projectType}}).then(res => {
						this.counting = false;
						if (res.statusCode === 200) {
							this.countDownFn();
							uni.showToast({
								title: '验证码发送成功~',
								duration: 2000,
								icon: 'none'
							});
						}
					}).catch(_ => {
						this.counting = false;
					});
					
				}
			},
			// 倒计时
			countDownFn() {
				let sec = 60;
				this.getCodeText = `${sec}(s)`;
				this.counting = true;
				this.countDown = setInterval(_ => {
					if (sec <= 1) {
						this.counting = false;
						clearInterval(this.countDown);
						this.countDown = null;
						this.getCodeText = '重新获取验证码';
					} else {
						sec--;
						this.getCodeText = `${sec}(s)`;
					}
				}, 1000)
			},
			onInput(evt, key) {
				this.form[key] = evt.detail.value;
			},
			// 提交
			submitForm() {
				const {phone, code} = this.form;
				const emptyPhone = phone.trim() === ''; 
				const invalidPhone = !emptyPhone && !/1\d{10}$/.test(phone);
				const emptyCode = code.trim() === ''; 
				if (emptyPhone || invalidPhone || emptyCode) {
					const prms = {
					    title: emptyPhone ? '请输入手机号码~' : invalidPhone ? '请输入正确手机号码~' : '请输入验证码',
					    duration: 2000,
						icon: 'none'
					}
					uni.showToast(prms);
				} else {
					this.bindingPhoneByApi();
				}
			},
			// 绑定手机
			bindingPhoneByApi() {
				const binding = this.binding;
				const {args: qry} = this.$route?.query || {};
				let urlArgs = null;
				try { urlArgs = JSON.parse(decodeURIComponent(qry))} catch (error) {}
				if(!binding) {
					const {USER_INFO} = this.$constant;
					const userInfo = this.$cmMth.storageAction({key: USER_INFO, action: 'get'});
					const {phone, code} = this.form;
					const { projectType } = this.$cmMth.getProjectConfig()
					const wxUserId = userInfo && userInfo.wxUserId || '';	
					const args = {
						mobile: phone,
						code,
						equipment: this.isPlatform, // 登录设备：H5，MP=公众号，APP=APP，APPLET=小程序，PC=WEB端后台
						model: 2, // 模块, 1:登录 2：验证码
						wxUserId,
						projectType
					}
					this.binding = true;
					this.$mallApi.data.bindPhoneNumber({data: args}).then(res => {
						this.binding = false;
						const rdrUrl = urlArgs?.rdrUrl
						if (res.statusCode === 200) {
							// 注册完手机号码后，保存返回的用户信息
							const { id, headimg, nickname, phoneNumber } = res.data
							const userInfo = {
								...res.data,
								memberId: id,
								memberPhoto: headimg || require('@/pages-mall/static/mine/default_head.png'),
								memberName: nickname,
								memberPhone: phoneNumber,
							}
							this.$cmMth.storageAction({key: USER_INFO, action: 'set', value: userInfo});

							if (rdrUrl) {
								const tabbarPage = ['/pages-mall/index/index', '/pages-mall/category/category', '/pages-mall/shopping-cart/shopping-cart', '/pages-mall/mine/mine']
								const isTabbarPage = tabbarPage.includes(rdrUrl);
								uni.showToast({title:"授权成功",duration: 1000,icon: 'none'});
								setTimeout(() => {
									isTabbarPage ? uni.switchTab({url: rdrUrl}) : uni.redirectTo({url: rdrUrl})
								}, 1000);
							} else {
								uni.navigateBack();
							}
						}
					}).catch(_ => {
						this.binding = false;
					});
					
				}
			},
			
		},
		beforeDestroy() {
			clearInterval(this.countDown);
			this.countDown = null;
		}
	}
</script>


