<template>
	<view class="page-box">
		<view class="tips">请在下面的框中签名</view>
		<view class="main-box">
			<view class="sign-box">
				<canvas class="signCanvas" canvas-id="canvasId" @touchstart="touchstart"
					@touchmove.stop.prevent="touchmove" id="canvasId" :style="{width:height +'rpx'}"></canvas>
			</view>
		</view>

		<view class="btnBox">
			<view class="btn cancel" @click="clear()" style="width: calc(50% - 15px);">清除</view>
			<view class="btn submit" @click="saveSign()" style="width: calc(50% - 15px);float: right;">提交</view>
		</view>
	</view>
</template>

<script>
	import {
		saveAndUpdateQuestionTask
	} from '@/service/wuyecrm.js'
	import { mapMutations } from 'vuex'
	import { uploadMutiFile } from '@/service/landcrm'
	export default {
		data() {
			return {
				context: '',
				moveX: '',
				moveY: '',
				width: 0,
				height: 0,
			}
		},
		mounted() {
			// 创建绘图对象
			let context = uni.createCanvasContext('canvasId')
			// 设置线条
			context.lineWidth = 2
			context.setLineCap('round')
			context.setLineJoin('round')
			// 赋值
			this.context = context;
			let self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.width = res.windowWidth;
					self.height = res.windowHeight;
				}
			});
		},
		methods: {
			...mapMutations('repair', ['setRepairsInfo','clearRepairsInfo']),
			touchstart(e) {
				// 取出x、y的值
				let {
					x,
					y
				} = e.changedTouches[0]
				// 绘制线条起点
				this.context.beginPath()
				this.context.moveTo(x, y)
				// 起点与移动的连接断开
				this.moveX = ''
				this.moveY = ''
			},
			touchmove(e) {
				// 取出x, y的值
				let {
					x,
					y
				} = e.changedTouches[0]
				// 防止线条出现断点
				if (this.moveX && this.moveY) {
					this.context.moveTo(this.moveX, this.moveY)
					this.context.lineTo(this.moveX, this.moveY)
				}
				this.context.lineTo(x, y)
				this.moveX = x
				this.moveY = y
				this.context.stroke()
				// ture，保留之前的内容
				this.context.draw(true)
			},
			// 清除
			clear() {
				this.context.draw()
				this.moveX = ''
				this.moveY = ''
			},
			saveSign() {
				let self=this;
				let params = {}
				if(uni.getStorageSync('saveParams')){
					params = uni.getStorageSync('saveParams')
				}
				uni.canvasToTempFilePath({
					canvasId: 'canvasId',
					success: function(res) {
						//这里的res.tempFilePath就是生成的签字图片
						uploadMutiFile(res.tempFilePath).then(result=>{
							let fileInfo=JSON.parse(result.data).fileInfo;
							if(fileInfo){
								uni.showLoading({
									mask:true 
								}); 	
								params.data.signFileId=params.data.taskAttachment?(params.data.taskAttachment+','+fileInfo.fid):fileInfo.fid;
								saveAndUpdateQuestionTask(params).then(result => {
								uni.hideLoading();
									if (result.status == '200') {		
											self.clearRepairsInfo();
											uni.showToast({
												title: result.message,
												duration: 1000,
												icon:'success',
											});
											setTimeout(function () {
												 uni.navigateBack(2);
											}, 1000);
										
									} else {
									 uni.showToast({ title: result.message, icon: 'none' })
									}
								})
							}
						})
					}
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.page-box {
		overflow: hidden;
	}

	.tips {
		color: #666666;
		text-align: center;
		margin-top: 15px;
		font-size: 14px;
	}

	.sign-box {
		border: 1px dashed #dddddd;
		background: #FFFFFF;
		border-radius: 3px;
		height: 100%;
	}

	.main-box {
		width: 100%;
		height: calc(100% - 130px);
		overflow: auto;
		padding: 12px;
		box-sizing: border-box;
	}

	.btnBox {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-top: 20rpx;

		.btn {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			background-color: #2761FF;
			color: #ffffff;
			font-size: 28rpx;
		}

		.cancel {
			float: left;
		}

		.submit {
			float: right;
		}
	}
</style>
