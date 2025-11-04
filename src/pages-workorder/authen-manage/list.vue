<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
		<view class="authen-top-box">
			<view class="box" @click="chaeckRoomList">
				<text class="title">房间认证率</text>
				<text class="center">{{authData.houseAuthRate}}</text>
				<view class="bottom">
					<text class="pd-20">未认证 {{authData.houseNoAuthTotal}}</text>
					<u-icon name="eye-fill" size="16" color="#1989F7"></u-icon>
				</view>
			</view>
			<view class="box" @click="chaeckMemberList">
				<text class="title">客户认证率</text>
				<text class="center">{{authData.ownerAuthRate}}</text>
				<view class="bottom">
					<text class="pd-20">未认证 {{authData.ownerNoAuthTotal}}</text>
					<u-icon name="eye-fill" size="16" color="#1989F7"></u-icon>
				</view>
			</view>
		</view>
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" maskTop="280rpx" :isAll="false" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectEvent"
          @showMask="hideMenuEvent('btn')" :showProject="true"/>
        <u-search placeholder="房号/客户名称/手机号" v-model="searchForm.keyWords" shape="square" :showAction="false"
          searchIcon=" " height="56rpx" clearabled @blur="initData" />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" @upDataBuilding='getAllThat'/>
    </u-sticky>
    <workorder-authen v-for="(item, index) in dataList" :key="index" :data="item" @upDataList='getData(1)'/>
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
// import DropdownBtn from '@/components/dropdown-area/dropdown-newBtn.vue'
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownFilter from './dropdown-filter.vue'
import WorkorderAuthen from '@/pages-workorder/modules/workorder-authen.vue'
import { getRealTimeQuesTaskListPool } from '@/service/landcrm'
import { getRoomPage, getStatistic, getRoomInfoPage } from '@/service/community'

export default {
  mixins: [menuAuthMixin],
  components: {
    DropdownBtn,
    DropdownFilter,
    WorkorderAuthen
  },
  authName: '认证管理',
  data() {
    return {
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '',
        biProblemCategory: '',
        quesTaskState: '',
        workTypeName: '',
        sort: '',
        handleType: '',
        exception: '',
        submitDateScreen: '',
        payStatus: '',
        sourceType: '',
				buildingId:'',
				keyWords:'',
				houseState:'',
				source:'',
        houseCompound: ''
      },
			authData:{
				houseAuthRate:'0%',
				houseNoAuthTotal:'0',
				ownerAuthRate:'0%',
				ownerNoAuthTotal:'0',
			},
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      allBuildingList:[],
      currentProjectId: ''
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
  onShow() {
		if(uni.getStorageSync('authen_manage_list_load') == '1'){
			uni.setStorageSync('authen_manage_list_load','')
			this.initData()
		}
  },
  mounted() {
    // 不需要请求，因为下拉菜单栏需要设置默认区域和项目，会发起请求的
  },
  methods: {
		chaeckRoomList(){
			if(this.authData.houseNoAuthTotal <1){
				uni.showToast({
					title:'暂无未认证的房间',
					icon:'none',
				})
				return
			}
			let pId = this.$refs.btnEl.selectProjectId
      const { houseCompound } = this.searchForm
			uni.navigateTo({
				// url:'/pages-workorder/authen-manage/room-list?projectId='+pId + '&buildingId=' + this.searchForm.buildingId
				url:'/pages-workorder/authen-manage/room-list?areaId=' + this.searchForm.areaId +'&projectId='+ this.searchForm.projectId + '&buildingId=' + this.searchForm.buildingId + '&courtyard=' + houseCompound
			})
		},
		chaeckMemberList(){
			if(this.authData.ownerNoAuthTotal <1){
				uni.showToast({
					title:'暂无未认证的客户',
					icon:'none',
				})
				return
			}
			let pId = this.$refs.btnEl.selectProjectId
      const { houseCompound } = this.searchForm
			uni.navigateTo({
				url:'/pages-workorder/authen-manage/member-list?areaId=' + this.searchForm.areaId +'&projectId='+ this.searchForm.projectId + '&buildingId=' + this.searchForm.buildingId + '&courtyard=' + houseCompound
			})
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
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

      const params = {
        data: {
          current: this.pageForm.current,
          size: this.pageForm.size,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
					buildingIds:this.searchForm.buildingId,
					keyWords:this.searchForm.keyWords,//房号/客户姓名/客户联系电话
          authState: this.searchForm.biProblemCategory, // 认证状态
					houseState:this.searchForm.houseState,
					source:this.searchForm.source,
          courtyard: this.searchForm.houseCompound
        },
        hideLoading: true
      }

      // if(!params.data.buildingIds){
      //   params.data.buildingIds = this.allBuildingList
      // }
      const res = await getRoomInfoPage(params).finally(() => {
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
    async initData() {
			this.getAllThat()
      this.getData(1)
    },
    async areaProjectEvent(data) {
      // this.searchForm = Object.assign(this.searchForm, {
      //   projectId: data.projectId
      // })
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })
			let { O_USER_INFO } = this.$constant;
			let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.currentProjectId = data.projectId
			
      await this.$refs.navigatorEl.getParkList(data.projectId)
      await this.$refs.navigatorEl.findWorkUserList(this.searchForm.areaId, this.currentProjectId)
      this.initData()
    },
    async dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        biProblemCategory: data.biProblemCategory,
        buildingId: data.quesTaskState,
        houseState: data.houseState,
        source: data.source,
        houseCompound: data.houseCompound
      })
      let { O_USER_INFO } = this.$constant;
			let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      await this.$refs.navigatorEl.findWorkUserList(this.searchForm.areaId, this.currentProjectId, data.houseCompound)
      this.initData()
    },
		//获取上面的认证率
		getAllThat(){
			let buildingIds = ''
			if(this.searchForm.buildingId){
				buildingIds = this.searchForm.buildingId
			}else{
				let list = this.$refs.navigatorEl.taskStatusList || []
				let idS = []
				list.map((item,index)=>{
					if(index>0){
						idS.push(item.buildingId)
					}
				})
				buildingIds = idS.join(',')
			}
			const params = {
			  data: {
			    projectId: this.searchForm.projectId,
					buildingIds,
			  },
			  hideLoading: true
			}
      this.allBuildingList = buildingIds
			getStatistic(params).then(res=>{
				if(res.status == '200'){
					this.authData = res.data
				}else{
					this.authData = {
						houseAuthRate:'0%',
						houseNoAuthTotal:'0',
						ownerAuthRate:'0%',
						ownerNoAuthTotal:'0',
					}
				}
			})
		},
    hideMenuEvent(type) {
      if (type == 'btn') {
        this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
      } else if (type == 'navigator') {
        this.$refs.btnEl.showMaskEvent(false)
      }
    }
  }
}
</script>

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
.pd-20{
	padding-right: 10rpx;
}
</style>