<style lang="scss" scoped>
.page-panel {
  padding-bottom: 20rpx;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}

.header-panel {
  @include flx-dsp(flex-start, flex-start);
  background-color: #fff;

  ::v-deep .dropdown-btn {
    flex: 0 0 auto;
    padding: 14rpx 0 14rpx 24rpx;
    box-sizing: border-box;

    .content-panel {
      left: -24rpx;
    }
  }
}

::v-deep .u-search {
  padding: 14rpx 24rpx 14rpx 16rpx;
  border-bottom: 1px solid #f8f8f8;
  background-color: #fff;
}

::v-deep .workorder-sheet {
  margin: 20rpx 20rpx 0;
}
.authen-top-box{
	width: 100%;
	display: flex;
  align-items: center;
  background-color: #fff;
  margin-bottom: 24rpx;
  .box{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 180rpx;
    .title{
      color: #999999;
      font-size: 22rpx;
    }
    .center{
      color: #333333;
      font-size: 48rpx;
      font-weight: bold;
    }
    .bottom{
      display: flex;
      align-items: center;
      text{
        color: #999999;
        font-size: 22rpx;
      }
    }
  }
}
.room-box{
	width: 710rpx;
	margin: 12rpx 20rpx;
	background: #fff;
	border-radius: 12rpx;
	box-sizing: border-box;
	padding: 0 30rpx;
	.top{
		width: 100%;
		min-height: 146rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		border-bottom: 1px solid #EBEBEB;
		padding: 24rpx 0 16rpx;
		box-sizing: border-box;
		.title{
			color: #222222;
			font-size: 30rpx;
			font-weight: bold;
			padding-bottom: 24rpx;
			line-height: 42rpx;
		}
		.title2{
			font-size: 28rpx;
			color: #666;
			@include ellipsis(2);
		}
	}
	.bottom{
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.btn1,.btn2{
			width: 140rpx;
			height: 60rpx;
			border: 1px solid #2761FF;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #2761FF;
			margin-left: 30rpx;
			border-radius: 8rpx;
			font-size: 26rpx;
		}
		.btn2{
			border: none;
			background: #2761FF;
			color: #fff;
		}
	}
}
.all-list{
	width: 100%;
	.box{
		width: 100%;
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		.select{
			flex: 0 0 auto;
			width: 40rpx;
			height: 40rpx;
		}
		.title{
			flex: 0 0 auto;
			padding: 0 8rpx;
			height: 40rpx;
			border-radius: 8rpx;
			background: #CCCCCC;
			display: flex;
			align-items: center;
			justify-content: center;color: #fff;
			font-size:24rpx;
			margin-left: 24rpx;
		}
		.name{
			font-size: 26rpx;
			padding-left: 16rpx;
			@include ellipsis(1);
		}
	}
}
.btn-panel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 204rpx;
  height: 60rpx;
  background-color: var(--app-primary-color);
  color: #fff;
  border-radius: 6rpx;
  font-size: 26rpx;
  font-family: 'PingFang SC';
  margin: 14rpx 0 14rpx 24rpx;
  box-sizing: border-box;
}
.btn-text {
  @include ellipsis(1)
}
</style>
<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
				<view class="btn-panel" @tap="buildObj.isShow = !buildObj.isShow">
					<text class="btn-text">{{ buildObj.label }}</text>
					<image :src="require(`@/static/${THEME_NAME}/kanban/icon-white-down.png`)" style="width:16rpx;height:16rpx;margin-left: 10rpx;"></image>
				</view>
        <u-search placeholder="房号/客户名称/手机号" v-model="searchForm.keyword" shape="square" :showAction="false"
          searchIcon=" " height="56rpx" clearabled @blur="initData" />
      </view>
    </u-sticky>
		
		<!-- 楼栋的下拉菜单 -->
		<dropdown-universal :show.sync="buildObj.isShow" maskTop="90rpx" contentTop="0px" contentHeight="510rpx" customStyle="position: fixed; left: 0; right: 0;" @hideMask="() => {}">
			<!-- <dropdown-radio show required :data="buildingList" :value="searchForm.buildingId" @confirm="dropdownEvent" /> -->
			<select-building :show="buildObj.isShow" :searchForm="searchForm" :options="options" @confirmSlBd="dropdownEvent"></select-building>
		</dropdown-universal>

		<view class="room-box" v-for="(item, index) in dataList" :key="index">
			<view class="top">
				<view class="title">{{item.detailAddress}}</view>
				<view class="title2">{{item.ownerNameList}}</view>
			</view>
			<view class="bottom" v-if="item.authBuilding == '1'">
				<view class="btn1" @click="roomFakeThat(item,1)">短信邀请</view>
				<view class="btn2" @click="roomFakeThat(item,2)">发起会话</view>	
			</view>
		</view>
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />

		<u-modal :show="showMessage" :title="showTitle" @confirm="conversationInvite" showCancelButton @cancel="cancelInvite">
			<view class="slot-content" style="width: 100%;">
				<view class="all-list">
					<view class="box" v-for="(item,index) in memberList" :key='index' @click="selectThat(item)">
						<view class="select">
							<u-icon name="checkmark-circle-fill" color="#2979ff" size="20" v-if="item.select"></u-icon>
							<u-icon name="checkmark-circle" size="20" v-if="!item.select"></u-icon>
						</view>
						<!-- houseState: 1: 租户; 2: 业主; 3: 家属; 4: 企业联系人; 5: 家政; 6: 企业员工; -->
						<view class="title">{{item.houseState}}</view>
						<view class="name">{{item.ownerName}} | {{item.ownerPhone}}</view>
					</view>
				</view>
			</view>
		</u-modal>
		<u-modal :show="ownerModal.isShow" title="提示" content="请手动选择联系人发起会话" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
  </view>
</template>

<script>
import DropdownUniversal from '@/components/dropdown-area/dropdown-universal.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import SelectBuilding from './select-building.vue'
import { getNoAuthHouseInfoPage, inviteMemberBySMS, getbuldingInfoByParam, getOwnerInfoByAddrId } from '@/service/community'
import { getCompanyAgentMaterialList } from '@/service/api-gateway'
import { getBuildingDetailList } from '@/service/landcrm'

export default {
  components: {
		DropdownUniversal,
		DropdownRadio,
		SelectBuilding
  },
  data() {
		const { O_USER_INFO } = this.$constant
		const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

    return {
			userInfo: userInfo,
      searchForm: {
				areaId: '',
        projectId: '',
				buildingId: '',
        keyword: '',
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'nomore' // loading, nomore
      },
      dataList: [],
			showMessage:'',
			buildObj: {
				isShow: false,
				label: ''
			},
			buildingList: [], // 楼栋列表
			memberList:[
				// {name:'张三',select:false,},
				// {name:'李四',select:false,},
			],
			isSms:false,
			showTitle:'',
			ownerModal: {
				isShow: false
			},
			options: {}
    }
  },
  computed: {
    isLastPage() {
      return this.dataList.length >= this.pageForm.total
    }
  },
  onPullDownRefresh() {
    this.initData()
  },
  async onReachBottom() {
    this.getData(this.pageForm.current + 1)
  },
  async onLoad(option) {
		this.options = option
		this.searchForm.projectId = option.projectId
		this.searchForm.areaId = option.areaId

		// await this.getbuldingInfoByParam()

		// // 如果页面参数的buildingId存在值，则该楼栋需要被选中，否则是默认全部
		// let defBuildItem = null
		// if (option.buildingId) {
		// 	defBuildItem = this.buildingList.find(item => item.name == option.buildingId)
		// }
		// if (!defBuildItem) {
		// 	defBuildItem = this.buildingList[0]
		// }
		// this.dropdownEvent(defBuildItem)
		this.initData()
  },
  methods: {
		// 选择客户手机号码
		selectThat(item) {
			if (!item.ownerPhone) {
				uni.showToast({title:'客户手机号码为空', icon:'none'})
				return
			}
			if (item.ownerPhone.length != 11) {
				uni.showToast({title:'客户手机号码格式错误', icon:'none'})
				return
			}

			item.select = !item.select
		},
		// 客户手机号码列表确认事件
		conversationInvite() {
			const hasSel = this.memberList.some(item => item.select)
			if(!hasSel) {
				uni.showToast({title:'请选择至少一个对象', icon:'none'})
				return
			}

			if(this.isSms == 1){
				this.fakeThat()
			}
		},
		cancelInvite() {
			this.showMessage = false
			setTimeout(() => {
				this.memberList = []
			}, 200)
		},
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.ownerModal.isShow = false

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
    },
		async roomFakeThat(data, type){
			this.isSms = type
			this.showTitle = type == 1?'选择短信邀请对象':'选择会话邀请对象'

			let res = null
			const params = {
				data: {
					addrId: data.addrId || '',
			    ownerIdList: data.ownerIdList || ''
			  },
			  hideLoading: true,
			  responseToast: false
			}
			res = await getOwnerInfoByAddrId(params)
			if(res.status == '200'){
				this.memberList = (res.data || []).map(item => ({
					...item,
					select: !item.ownerPhone || item.ownerPhone.length != 11 ? false : true, // 手机号码格式符合11位，就默认选择
					addrId: data.addrId || ''
				}))
				if(this.memberList.length < 1){
					uni.showToast({
						title:'房间无业主，无法邀请',
						icon:'none',
					})
				}else{
					if (type == 1) {
						this.showMessage = true
					} else {
						this.ownerModal.isShow = true
					}
				}
			}
		},
		// 短信接口
		async fakeThat() {
			// 获取企微管家系统配置的常用链接，房屋认证的配置信息
			const mateRes = await getCompanyAgentMaterialList({
				data: {
					pageNum: 1,
					pageSize: 100,
					title: '业主认证'
				},
				hideLoading: true
			})
			const data = mateRes.data.records || []
			if (!data.length) {
				uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
				return
			}
			const mateDetail = data[0]
			// 获取需要发送邀请的业主
			const inviteOwner = this.memberList
				.filter(item => item.select)
				.map(item => ({ ownerName: item.ownerName, ownerPhone: item.ownerPhone }))

			let [url, query] = (mateDetail.materialUrl || '').split('?')
      url = url.replace(/\.html$/, '') // 因为常用链接里配置的地址，有时候可能是出于企微小程序打开的限制，添加了 .html ，地址格式为：/pages/index/index.html ，所以需要去除
      query = (query || '') + '&addrId=' + (this.memberList[0].addrId || '') // addrId: 业主未认证该房产

			const params = {
				data: {
					inviteOwnerList: inviteOwner,
					companyId: mateDetail.companyId || '',
					urlType: '1',
					appid: mateDetail.appId || '',
					url: url || '',
          query
				}
			}
			// 发送短信邀请，客户点击短信链接，跳转到业主端的房产认证页面
			const res = await inviteMemberBySMS(params)
			if (res.status == 200) {
				this.cancelInvite()

				uni.showToast({title:'发送成功',icon:'none'})
			}
		},
    // 获取数据
    async getData(pageIndex = 1) {
      if (pageIndex != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = 'nomore'
        return
      }
      if (pageIndex == 1) {
        // 滚动到顶部
        this.dataList = []
        this.pageForm.total = 0
        uni.pageScrollTo({ scrollTop: 0 })
      }

      this.pageForm.loadMore = 'loading'
      this.pageForm.current = pageIndex

      const params = {
        data: {
					userId: this.userInfo.userId,
          current: this.pageForm.current,
          size: this.pageForm.size,
          projectId: this.searchForm.projectId,
					buildingIds: this.searchForm.buildingId,
					keyWords: this.searchForm.keyword,
        },
        hideLoading: true
      }
      const res = await getNoAuthHouseInfoPage(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      let data = res?.data?.records ?? []
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.data.total || 0
    },
		initData() {
      this.getData(1)
    },
		// 根据项目id获取楼栋
		async getbuldingInfoByParam() {
			const {courtyard = ''} = this.options
			const params = {
		    data: {
		      userId: this.userInfo.userId,
		      areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          courtyard,
          buildingLocation: '',
          startIndex: 1,
          pageSize: 10000
		    },
		    responseToast: false
		  }
		  let res = await getBuildingDetailList(params)
			const data = res.data || []

			const allBuild = data.map(item => item.buildingId).join(',') // 全部选项
			const otherBuild = data.map(item => ({
				...item,
				label: item.buildingLocation,
				name: item.buildingId
			}))
			this.buildingList = [
				{ label: '全部', name: allBuild }
			].concat(otherBuild)
		},
		// 下拉菜单确认事件
    dropdownEvent(item) {
			this.buildObj.isShow = false
			this.buildObj.label = item.label
			this.searchForm.buildingId = item.name

			if (!item.init) this.initData()
    }
  }
}
</script>
