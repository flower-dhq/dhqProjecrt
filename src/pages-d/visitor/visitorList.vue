
<style lang="scss" scoped>
.topInput {
	background: #FFFFFF;
	height: 104rpx;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
	box-sizing: border-box;
	padding-top: 20rpx;

}
::v-deep .u-border {
	border-style:none
}
.dates {
	padding-top: 104rpx;
	background-color:#f5f5f5;
}

.data-list {
	background: #FFFFFF;
	padding: 24rpx 40rpx;
	margin-top:20rpx

}
.stateOrange {
  color: #FF6E00;
}
.stateGreen {
  color: #C8924B;
}
.stateGrey {
  color: #666666 ;
}
.top-line {
  border-bottom: 2rpx solid #f3f3f3;
  /* padding: 9px 15px; */
  padding-bottom: 16rpx;
  font-size: 28rpx;
  /* color: #808695; */
  overflow: hidden;
  display: flex;
  flex-direction: row;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
}
.top-line .state {
  font-size: 24rpx;
  width: 160rpx;
  text-align: right;
}
.data-left{
  flex: 1;
}
.data-address {
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  font-size: 28rpx;
}
.content {
  padding-top: 16rpx;
  overflow: hidden;
}
.content-left {
	font-size: 26rpx;
	font-family: PingFang SC;
font-weight: 500;
color: #393939;
margin-bottom: 8rpx;
display: flex;
}
.content-spanleft {
	margin-right: 60rpx;
}
.content-spanright {
	font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #666666;
	flex:1;
}

.nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>


<template>
	<view style="background-color:#f5f5f5;height: 100vh;  box-sizing: border-box;" :style="[THEME_CSS_VAR]" :class="[THEME_NAME]">
		<view class="topInput">
			<u--input v-model="searchConditionContact"
	    placeholder="请输入访客姓名/电话/房间"
	    prefixIcon="search"
	    prefixIconStyle="font-size: 22px;color: #8F8F8F" clearable customStyle="width:85%;margin: auto;background-color:#F5F5F5;height:64rpx;box-sizing:border-box"
		placeholderStyle="font-size: 24rpx;font-family: PingFang SC;color: #8F8F8F;"
		@confirm="searchData"
		@change ="searchDataChange"
		></u--input>
		</view>
		<view class="dates">
			<view  class="data-list" v-for="(item, index) in currentList" :key="index">
			<dl class="top-line">
        <view class="data-left">
        <view class="data-address">{{item.name}}</view>
        </view>
				<view class="state">
					<view v-if="item.status == '1'" class="stateOrange">待放行</view>
					<view v-else-if="item.status == '2'" class="stateGreen">已放行</view>
					<view v-else-if="item.status == '-1'" class="stateGrey">已过期</view>
				</view>
			</dl>
			<dl class="content">
				<view class="content-left">
					<span class="content-spanleft">来访时间</span>
					<span class="content-spanright">{{item.visitTime}}</span>
				</view>
				<view class="content-left">
					<span class="content-spanleft">访客电话</span>
					<span class="content-spanright">{{item.phone}}</span>
				</view>
				<view class="content-left">
					<span class="content-spanleft">来访地址</span>
					<span class="content-spanright">{{item.roomInfo}}</span>
				</view>
				<view class="content-left">
					<span class="content-spanleft">来访事由</span>
					<span class="content-spanright">{{item.reason}}</span>
				</view>
			</dl>
		</view>

		</view>
		 <view v-if="currentList.length == 0" class="nodata"></view>
	</view>
</template>

<script>
import util from '@/js/utils';
import {getvisitorList} from '@/service/community'
	export default {
		name: 'visitorList',
		data () {
			return {
				dataList: [],
				currentPage: 1,
				currentList: [],
				pageSize: 10,
				searchConditionContact:'',
				total:''
			}
		},
		watch: {
			
		},
		
		onLoad(){
 			const { MEMBER_ID, PROJECT_TYPE ,O_USER_INFO,COMPLANY_ID } = this.$constant;
			this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
			this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' });;
			this.userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
 			this.projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
			this.handleData()
		},
	    onPullDownRefresh() {
		  this.currentPage = 1
          this.handleData();
        },
        onReachBottom() {
			if (this.total === this.currentList.length) return
			this.currentPage = this.currentPage +1
		    this.handleData()
        //   if (this.status != 'nomore') this.loadMore();
        },
		methods: {
			// 下拉加载更多数据
			loadMore() {
				const key = this.selectedTabIndex ? 'done' : 'undone';
				
				if (this[key].isNoData) {
					// this.$vux.toast.text('已经到底了', 'middle');
					// this.resetScroller();
				} else {
					self.currentPage = self.currentPage +1
					this.handleData()
				}
			},
			searchData(){
				this.pageSize = 10
				this.currentPage =1
				this.currentList = []
				this.handleData()
			},
			searchDataChange(){
                 if(this.searchConditionContact == ''){
					this.pageSize = 10
				    this.currentPage =1
				    this.currentList = []
				    this.handleData()
				 }
			},
			
			handleData() { //处理数据
				var self = this;
				const args ={
					data:{
						// current:self.currentPage,
                        // size:self.pageSize,
                        memberId:self.memberId,
                        searchConditionContact:self.searchConditionContact.trim(),
						// type:0,
					},
					hideLoading:true,
					responseToast:false,
					pathParams: `/${self.pageSize}/${self.currentPage}`
                 }
				const p = getvisitorList(args);
				uni.showLoading({title:'加载中...'})
				// this.currentList = this[key].list;
				return p.then(res => {
					console.log('res===', res)
					if (res.status === '200') {
						this.total = res.data.total			
						if (res.current == 1) {
							this.currentList = res.data.records		
                        } else {
                           this.currentList = [].concat(this.currentList, res.data.records)
                        }
	            			uni.hideLoading()
                       }else {
						uni.showToast({
                            title: res.message,
							duration:800,
                            icon: 'none'
                          })
					   }
				     }).catch(_ => {
				     	uni.hideLoading()
				     })
			},
			},
		
		}
	
</script>
