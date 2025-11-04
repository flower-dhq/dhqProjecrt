<style lang="scss" scoped>
.select-type {
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include flx-dsp($jsc: center, $ali: center, $drt: column);
  .inputs-wrap {
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .input-wrap {
      flex: 1;
      margin: 14rpx 24rpx;
    }
    .extra-text {
      margin-right: 24rpx;
      color: var(--app-primary-color);
      font-size: 30rpx;
    }
  }
  .content-wrap {
    flex: 1;
    width: 100%;
    overflow: auto;
		background-color: #f5f5f5;
  }
  .item-wrap {
    padding: 30rpx;
    font-size: 30rpx;
    color: #333333;
		background: #ffffff;
		margin-top: 10px;
    // border-bottom: 1px solid #eaeaea;
    // @include flx-dsp($jsc: center, $ali: center);
		.item-top{
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;
			.state{
				background: #16ce92;
				padding: 4rpx 16rpx;
				border-radius: 10rpx;
				color: #ffffff;
				font-size: 26rpx;
				margin-left: 4rpx;
			}
			.circle-wrap {
			  width: 34rpx;
			  height: 34rpx;
			  border: 2rpx solid #cccccc;
			  border-radius: 50%;
			}
		}
		.item-txt{
			color: #999999;
			margin-top: 20rpx;
		}
		.item-bot{
			border-top: 2rpx solid #eaeaea;
			color: #999999;
			text-align: right;
			margin-top: 20rpx;
			padding: 10rpx 0;
		}
		
  }
  .active {
    color: var(--app-primary-color) !important;
    background: #ffffff !important;
  }
  .bottom-wrap {
    font-size: 30rpx;
    color: #999999;
    text-align: center;
    padding: 30rpx;
  }
  .e-empty {
    width: 100%;
    height: 100%;
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    .img-wrap {
      width: 65%;
    }
    .text-wrap {
      font-size: 30rpx;
      color: #999999;
    }
  }
}
</style>

<template>
  <view class="select-type" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="inputs-wrap">
      <view class="input-wrap">
        <u--input v-model="query.nameAndCode" fontSize="26rpx" customStyle="{padding:12rpx 32rpx;background: #F3F3F3;}" placeholder="系统名称、机房名称、设备编码、设备名称" shape="circle" clearable></u--input>
      </view>
      <view class="extra-text" @click="search">搜索</view>
			<view class="extra-text" style="cursor: pointer; right: 5px" @click="confirmBtnClick">提交</view>
    </view>

    <view class="content-wrap">
      <u-list @scrolltolower="scrolltolower" v-if="deviceList.length" height="100%">
        <view class="item-wrap" v-for="(item, index) in deviceList" :key="index" @click="selectDevice(item,index)">
					<view class="item-top">
						<view>
							<span>{{item.deviceName}}</span>
							<span class="state">{{item.deviceState}}</span>
						</view>
						<view>
							<view class="circle-wrap" v-if="!item.checked"></view>
							<u-icon v-if="item.checked" size="40rpx" color="var(--app-primary-color)" name="checkmark-circle-fill"></u-icon>	
						</view>						
					</view>
					<view class="item-txt">编码：{{item.deviceCode}}</view>
					<view class="item-txt">类型：{{item.sysName}}-{{item.levelName}}</view>
					<view class="item-txt">机房：{{item.devicePartrolName}}</view>
					<view class="item-bot">维修次数：{{item.repaired}}/{{item.max}}</view>								
        </view>
        <view class="bottom-wrap" v-if="deviceList.length === totalCount">到底啦~</view>
      </u-list>
    </view>
    <view class="e-empty" v-if="!deviceList.length">
      <view class="img-wrap">
        <image style="width: 100%" src="@/static/icon-img/no-data.png" mode="aspectFit"></image>
      </view>
      <view class="text-wrap">暂无数据</view>
    </view>
  </view>
</template>

<script>
import { getDevicesByParam,editDevice } from '@/service/crm6.0.js'

export default {
  name: '',
  computed: {},
  data() {
    return {
      query: {
				 pageIndex:1,
				 pageSize:50,
				 nameAndCode:'',
      },
      totalCount: 0,
      deviceList: [],
    }
  },
  onLoad(query) {
		this.query = {
			...this.query,
      ...query,
		 }
		this.getDeviceList();
  },
  onPullDownRefresh() {
    this.query.pageIndex = 1
    this.getDeviceList()
  },
  methods: {
		confirmBtnClick(){
			let selectDatas=[];
			let associatedDevice='';
			this.deviceList.forEach(item=>{
				if(item.checked){					
					let deviceName=item.sysName+'-'+item.devicePartrolName+'-'+item.levelName+'-'+item.deviceName+'（维修次数:'+item.repaired+'/'+item.max+'）';
					let json={
					  facilityId:item.deviceId,
					  type:2,//类型(1:装修单;2:设备巡检单;)
					  facilityName:deviceName,
					  repairedNumber:item.repaired,//已维修次数
					  repairedNumberMax:item.max,//最大维修次数
					}
					associatedDevice=associatedDevice?associatedDevice+'，'+deviceName:deviceName;
					selectDatas.push(json);
				}
			})
			let self=this;
			if(this.query.type=='detail'){//工单详情页面 选择设备 直接做保存
				let params={
				  quesTaskId:this.query.quesTaskId,
				  bos:JSON.parse(JSON.stringify(selectDatas))
				}
				let params1 = {
				  data: {
				    ...params,
				  }
				}
				editDevice(params1).then(res=>{
				  if(res.status==200){
				    uni.showToast({
				    	title: res.message,
				    	duration: 1000,
				    	icon:'success',
				    });
						setTimeout(function () {
							//  self.$router.go(-1)
							 uni.navigateBack()
						}, 1000);
				  }else{
				       uni.showToast({ title: result.message, icon: 'none' })
				    }
				})
			}else{				
				let params = {
					selectDatas:selectDatas,
					associatedDevice:associatedDevice,
				}
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('dataEvent', { data: params })
				// self.$router.go(-1)
				uni.navigateBack()
			}
		},
		selectDevice(item,index){
			this.deviceList[index].checked=!this.deviceList[index].checked;
		},
    search() {
      this.query.pageIndex = 1
      this.getDeviceList()
    },
    getDeviceList() {
      let params = {
      	data: {
      		...this.query
      	}
      }
      uni.showLoading({
      	title: '加载中'
      })
      getDevicesByParam(params).then((res) => {
        uni.stopPullDownRefresh()
        uni.hideLoading()
        if (res.status = 200) {
          let list = res.data.records;
					const selectDatas = uni.getStorageSync('selectDatas')
          let _selectDatas = JSON.parse(selectDatas);
					
					for (let index = 0; index < list.length; index++) {
					  const element = list[index];
					  if (_selectDatas.length > 0) {
					    // 默认勾选
					    for (let index = 0; index < _selectDatas.length; index++) {
					      const user = _selectDatas[index];
					      if (user.facilityId == element.deviceId) {
					        element.checked=true;
									_selectDatas.splice(index, 1)
									break;
					      } else {
					        element.checked=false;
					      }
					    }
					  }else{
							element.checked=false;
						}
					}
					if (this.query.pageIndex === 1) {
					  	this.deviceList = list || []
					  } else {
					  	this.deviceList = this.deviceList.concat(list || [])
					  }
          
          this.totalCount = res.data.total;
        } else {
          uni.showToast({ title: res.message, icon: 'none' })
        }
      })
    },		
    scrolltolower() {
      if (this.deviceList.length < this.totalCount) {
        this.query.pageIndex++
        this.getDeviceList()
      }
    },
  }
}
</script>
