<style>
	page{
		background: #FAFAFA;
	}
</style>
<style  scoped lang="scss">
	.notice{
		width: 100%;
		$font-color: #333333;
		.h1{
			font-size: 28rpx;
			color: $font-color;
			padding:0 14rpx 0 36rpx;
		}
		.flex-box{
			width: 100%;
			display: flex;
			align-items: center;
		}
		.notice-tle{
			height: 82rpx;
			justify-content: center;
			background-color: #fff;
			.notice-icon{
				width: 24rpx;
				height: 28rpx;
				background-image: url('~@/pages-mall/static/shop/notice-icon.png');
				background-size: 100% 100%;
			}
			.notice-tle-txt{
				font-size: 20rpx;
				padding-left: 12rpx;
				color: $font-color;
			}
		}
		.before-price{
			height: 86rpx;
			.price-color,
			.price-color::v-deep .cl-text {
			  color: #FD8444;
			}
			.price{
				color: #FD8444;
				.symbol{
					font-size: 26rpx;
					font-weight: bold;
				}
				.price-txt{
					font-size: 36rpx;
					font-weight: bold;
				}
				.price-txt2{
					font-size: 28rpx;
				}
			}
		}
		.want-price{
			height: 96rpx;
			background-color: #fff;
			.symbol{
				font-size: 28rpx;
				color: $font-color;
				padding-right: 8rpx;
			}
			::v-deep .placeholder-class{
				color: #CCCCCC;
				font-size: 28rpx;
			}
		}
		.message-notice{
			height: 96rpx;
			margin-top: 16rpx;
			justify-content: space-between;
			background-color: #fff;
		}
		.confirm{
			justify-content: center;
			height: 136rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			.confirm-btn{
				width: 670rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				color: #fff;
				border-radius: 40rpx;
				background-color: #FD6944;
			}
		}
	}
	::v-deep .cl-text.is-price .cl-text__symbol--price {
	  font-size: 26rpx;
	  font-weight: bold;
	}
	::v-deep .cl-text.is-price .cl-text__value {
	  font-size: 36rpx;
	  font-weight: bold;
	}
	::v-deep .cl-text.is-price .cl-text__precision {
	  font-size: 28rpx;
	}
	::v-deep .uni-switch-input-checked{
		background-color: #F98547!important;
		border-color: #F98547!important;
	}
</style>

<template>
  <view class="notice">
    <view class="notice-tle flex-box">
		<view class="notice-icon"></view>
		<view class="notice-tle-txt">设置后若此商品在3个月内降价，您将收到手机推送消息以及短信通知。</view>
	</view>
	<view class="before-price flex-box">
		<text class="h1">当前价格：</text>
		<cl-text class="price-color" type="price" size="40rpx" :value="beforePrice" color="primary" />
		<!-- <view class="price">
			<text class="symbol">¥</text>
			<text class="price-txt">709</text>
			<text class="price-txt2">.00</text>
		</view> -->
	</view>
	<view class="want-price flex-box">
		<view class="h1">期望价格：</view>
		<view class="symbol">¥</view>
		<input type="text" v-model="saveData.expectedPriceStr" placeholderClass="placeholder-class" placeholder="低于此价格会通知您"/>
	</view>
	<!-- <view class="message-notice flex-box">
		<view class="h1">短信通知</view>
		<cl-switch v-model="saveData.smsStatus" style="transform:scale(0.7);" :active-value="1" :inactive-value="0"></cl-switch>
	</view> -->
	<view class="confirm flex-box">
		<view class="confirm-btn" @click="setNotice">确定</view>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  beforePrice:0,
	  saveData:{
		  expectedPriceStr: '',//期望价格（元）
		  sellerId:'',
		  gmId:'',
		  gsId:'',
		  smsStatus:0,//是否开启短信通知（0.不开启，1.开启）
	  }
    }
  },
  methods: {
	// 根据id获取商品信息
	async setNotice() {
		if(this.saveData.expectedPriceStr == ''){
			uni.showToast({title: '请输入期望价格',icon: 'none'})
			return
		}
		let params = {
			data:this.saveData
		}
		const res = await this.$mallApi.shop.setMgdGoodsDiscountNotice(params)
		if(res.success){
			uni.showToast({
			  title: res.message,
			  icon: 'none',
			  success() {
				  console.log(res)
			  	setTimeout(()=>{
					console.log('res')
					uni.navigateBack({})
				},1000)
				
			  }
			})
		}
		
	},
  },
  onLoad(options) {
    console.log(options)
	if(options.gmId){
		this.beforePrice = options.price
		this.saveData.sellerId = options.sellerId
		this.saveData.gmId = options.gmId
		this.saveData.gsId = options.gsId
	}
  }
}
</script>