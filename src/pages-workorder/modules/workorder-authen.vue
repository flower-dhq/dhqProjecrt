<template>
  <view :class="['workorder-sheet', getCustomClass]" :style="[getCustomStyle]" @click="linkTo">
    <view class="sheet-title-wrap">
      <view class="title-tag-wrap">
        <view class="title-tag" :class="'neibu'">{{getStateText}}</view>
        <!-- 问题描述 -->
        <view class="title">{{ (data.ownerName || data.nickname) +' | ' + data.ownerPhones}}</view>
      </view>
      <!-- 工单状态 -->
      <text class="title-state"> {{getChildStateText}} </text>
    </view>
    <view class="sheet-content-wrap">
      <!-- 楼栋地址 -->
      <text>{{ data.detailAddress || data.houseBuilding || data.projectName }}</text>
      <text>{{ data.createDate }}</text>
      <!-- <text>阳光广场-智慧花园A区</text>
      <view>
        <text style="margin-right: 10px;">李四</text>
        <text>18823450918</text>
      </view> -->
    </view>
    <view class="sheet-footer-wrap" v-if="data.authBuilding == '1' && hiddenBottom">
      <view class="sheet-footer-left">
        <view class="refuse" @click.stop="rejectThat" v-if="data.authState == 2">拒绝</view>
        <view class="agree" @click.stop="agreeThat" v-if="data.authState == 2">同意</view>
        <view class="agree cancel" @click.stop="cancelThat" v-if="data.authState == 1">取消认证</view>
        <view class="agree again" @click.stop="againThat" v-if="data.authState == 3 || data.authState == 4">重新认证</view>
      </view>
    </view>
		<u-modal :show="agreeShow" content="确定要同意认证申请吗？" showCancelButton @confirm="agreeThatCheak"
		    @cancel="agreeShow = false" />
		<u-modal :show="againShow" content="确定要重新认证吗？" showCancelButton @confirm="againThatCheak"
		    @cancel="againShow = false" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import YbTag from '@/components/yb-tag/yb-tag.vue'
import { approvalAuthCommBg,reApprove,cancelApproveBg } from '@/service/community'

export default {
  name: 'WorkorderSheet',
  mixins: [mpMixin],
  components: {
    YbTag
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    hiddenBottom:{
      default: ()=>(true),
    }
  },
  data() {
    return {
			agreeShow:false,
			againShow:false,
    }
  },
  computed: {
    // 工单状态
    getStateText() {
      const dataTmp = this.data
      if (dataTmp.houseState == 1) return '租户'
      else if (dataTmp.houseState == 2) return '业主'
      else if (dataTmp.houseState == 3) return '家属'
      else if (dataTmp.houseState == 5) return '家政'
      return '待认证'
    },
    getChildStateText() {
      const dataTmp = this.data
      if (dataTmp.authState == 1) return '认证成功'
      else if (dataTmp.authState == 3) return '已拒绝'
      else if (dataTmp.authState == 4) return '已取消'
      else if (dataTmp.authState == 5) return '异常'
      return '待认证'
    },
  },
  methods:{
		//取消认证
		cancelThat(){
			let tempPicList = this.data.relateId.split(",")
			let data = {
				tempPicList,
				houseState:this.data.houseState,
			}
			uni.navigateTo({
				url:'/pages-workorder/authen-manage/cause-remark?type=cancel&reData='+JSON.stringify(data)
			})
		},
		//重新认证
		againThatCheak(){
			this.againShow = false
			let { O_USER_INFO } = this.$constant;
			let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
			let tempPicList = this.data.relateId.split(",")
			tempPicList.map(item=>{
				let params = {
					data:{
						relateId:item,
						approvalState:1,
						houseState:this.data.houseState,
					}
				}
				reApprove(params).then(res=>{
					if(res.status == '200'){
						uni.showToast({title:'认证成功',icon:'none'})
						this.$emit('upDataList')
					}else{
						uni.showToast({title:res.message,icon:'none'})
					}
				})
			})
		},
		againThat(){
			this.againShow = true
		},
		//拒绝认证
		rejectThat(){
			let tempPicList = this.data.relateId.split(",")
			let data = {
				tempPicList,
				houseState:this.data.houseState,
			}
			uni.navigateTo({
				url:'/pages-workorder/authen-manage/cause-remark?type=reject&reData='+JSON.stringify(data)
			})
		},
		agreeThatCheak(){
			this.agreeShow = false
			let { O_USER_INFO } = this.$constant;
			let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
			let tempPicList = this.data.relateId.split(",")
			tempPicList.map(item=>{
				let params = {
					data:{
						relateId:item,
						approvalState:1,
						userId: userInfo.userId,
						ownerPhone:userInfo.userAccount,
						houseState:this.data.houseState,
					}
				}
				approvalAuthCommBg(params).then(res=>{
					if(res.status == '200'){
						uni.showToast({title:'认证成功',icon:'none'})
						this.$emit('upDataList')
					}else{
						uni.showToast({title:res.message,icon:'none'})
					}
				})
			})
			
		},
		//同意认证
		agreeThat(){
			this.agreeShow = true
		},
    linkTo() {
      if(!this.hiddenBottom){
        return
      }
			uni.setStorageSync('authen_manage_allData', JSON.stringify(this.data));
      uni.navigateTo({ url: `/pages-workorder/authen-manage/detail` })
    },
    convertTime(val) {
      val = val.replace(/-/g, '/').split('.0')[0]
      return new Date(val).getTime()
    },
    calculationTime(minTime, maxTime) {
      let dateDiff = maxTime - minTime; //时间差的毫秒数
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      let leave1 = dateDiff%(24*3600*1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1/(3600*1000)); //计算出小时数
      return dayDiff + '天' + hours + '小时'
    }
  }
}
</script>

<style lang="scss" scoped>
.workorder-sheet {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #fff;
  border-radius: 10rpx;
  font-family: "PingFang SC";
	margin: 24rpx 20rpx
}
.sheet-title-wrap {
  @include flx-dsp(flex-start, flex-start);
  box-sizing: border-box;
  width: 100%;
  padding: 24rpx 30rpx;
  font-size: 30rpx;

  .title-state {
    flex: 0 0 auto;
    color: var(--app-primary-color);
    padding-left: 40rpx;
		font-size: 28rpx;
		max-width: 130rpx;
		text-align: right;
  }
}
.title-tag-wrap {
  flex: 1 1 auto;
  position: relative;

  .title-tag {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 60rpx;
    height: 40rpx;
    font-size: 24rpx;
    line-height: 40rpx;
    text-align: center;
    border-top-right-radius: 8rpx;
    border-bottom-left-radius: 8rpx;
    color: #fff;

    &.neibu {
      background-color: var(--app-primary-color);
    }
    &.kehu {
      background-color: #faad13;
    }
  }
  .title {
    @include ellipsis(2);
    font-weight: bold;
    text-indent: 74rpx;
		font-size: 30rpx;
		line-height: 40rpx;
    color: #222;
  }
}
.sheet-content-wrap {
  @include flx-dsp(flex-start, flex-start, column);
  box-sizing: border-box;
  width: 100%;
  font-size: 28rpx;
  padding: 0rpx 30rpx 16rpx;
  color: #9d9d9d;
  line-height: 44rpx;
  border-bottom: 1px solid #EAEAEA;
}
.sheet-footer-wrap {
  @include flx-dsp(space-between, center);
  box-sizing: border-box;
  width: 100%;
  font-size: 28rpx;
  color: #9d9d9d;
  // padding: 16rpx 30rpx;
  height:80rpx;
}
.sheet-footer-left {
	width: 100%;
	height: 100%;
  @include flx-dsp(flex-start, center);
	.refuse{
		width: 49.9%;
		height: 100%;
		@include flx-dsp(center, center);
		color: #666666;
		border-right: 1px solid #EAEAEA;
	}
	.agree{
		width: 50%;
		height: 100%;
		@include flx-dsp(center, center);
		color: #2761FF;
		cursor: pointer;
	}
	.cancel{
		width: 100%;
		color: #FC0B0B;
		cursor: pointer;
	}
	.again{
		width: 100%;
	}
}
::v-deep .u-tag-wrapper {
  padding-left: 10rpx !important;
}
</style>