<template>
	<view class="page-panel" :style="[THEME_CSS_VAR]">
	  <view class="all-pd">
	  	<u--textarea v-model="remark" placeholder="请填写原因" border='none' height='400rpx'></u--textarea>
			<view class="pd-btn">
				<view class="confirm-btn" @click="reOrcan">确定</view>
			</view>
	  </view>
	</view>
</template>

<script>
	import { approvalAuthCommBg,reApprove,cancelApproveBg } from '@/service/community'
	export default {
		data() {
			return {
				remark:'',
				allData:'',
				type:'reject',
			}
		},
		onLoad(option){
			console.log('option-------',option)
			this.allData = option.reData
			this.type = option.type
		},
		methods:{
			// 拒绝还是取消认证
			reOrcan(){
				let data = JSON.parse(this.allData)
				if(!this.remark){
					uni.showToast({title:'请填写原因',icon:'none'})
					return
				}
				if(this.type == 'reject'){
					this.rejectApprove()
				}else{
					this.cancalApprove()
				}
			},
			//取消重新认证接口
			cancalApprove(){
				let data = JSON.parse(this.allData)
				let tempPicList = data.tempPicList
				let { O_USER_INFO } = this.$constant;
				let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
				tempPicList.map(item=>{
					let params = {
						data:{
							relateId:item,
							operationType:3,
							message:this.remark
						}
					}
					cancelApproveBg(params).then(res=>{
						if(res.status == '200'){
							uni.showToast({title:'取消认证成功',icon:'none'})
							uni.setStorageSync('authen_manage_list_load','1')
							setTimeout(()=>{
								uni.navigateBack()
							},300)
						}else{
							uni.showToast({title:res.message,icon:'none'})
						}
					})
				})
			},
			//拒绝接口
			rejectApprove(){
				let data = JSON.parse(this.allData)
				let tempPicList = data.tempPicList
				let { O_USER_INFO } = this.$constant;
				let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
				tempPicList.map(item=>{
					let params = {
						data:{
							relateId:item,
							approvalState:0,
							userId: userInfo.userId,
							ownerPhone:userInfo.userAccount,
							houseState:data.houseState,
							message:this.remark
						}
					}
					approvalAuthCommBg(params).then(res=>{
						if(res.status == '200'){
							uni.showToast({title:'拒绝成功',icon:'none'})
							uni.setStorageSync('authen_manage_list_load','1')
							setTimeout(()=>{
								uni.navigateBack()
							},300)
						}else{
							uni.showToast({title:res.message,icon:'none'})
						}
					})
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page-panel {
	  padding-bottom: 20rpx;
	  background-color: #f3f5f9;
	  min-height: 100vh;
	  box-sizing: border-box;
	  font-family: "PingFang SC";
		padding-top: 24rpx;
	}
	.all-pd{
		width: 710rpx;
		box-sizing: border-box;
		margin: 0 20rpx 24rpx;
		background: #fff;
	}
	.pd-btn{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 100rpx;
		left: 0;
		.confirm-btn{
			width: 670rpx;
			height: 88rpx;
			background: #2761FF;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 30rpx;
		}
	}
</style>