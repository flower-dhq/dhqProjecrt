<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-tabs :list="tabList" :current="selTab.index" :lineColor="THEME_COLOR" @change="onTabsChange"/>
    <u-list height="calc(100vh - 44px)" @scrolltolower="onScrollBottom">
      <u-list-item v-for="(item, index) in releaseData" :key="index">

        <view class="card__box" @click="linkTo(item)">
          <view class="submitTime">
            <text>提交时间：{{ item.createDate }}</text>
            <u-tag :text="stateVal(item.decpassState)" shape="circle" bgColor="#ffe5f0 !important" color="#FF0167 !important" borderColor="#ffe5f0 !important" />
          </view>
          <cell-text label="放行人员" :labelWidth="80" border="bottom" padding="10px 0 0"> <text style="font-size: 30rpx">{{ item.pedestriansName }}</text> </cell-text>
          <cell-text label="放行日期" :labelWidth="80" border="bottom" padding="10px 0 0">{{ item.releaseDate }}</cell-text>
          <cell-text label="放行物品" :labelWidth="80" :border="item.decpassState == 2 ? 'bottom' : 'none'"> <text>{{ item.releaseGoods }}</text> </cell-text>
          <view class="submitTime flexRight" v-if="item.decpassState == 2">
            <u-button text="取消" :customStyle="{ width: '60px', margin: 0 }" size="small" @click.native.stop="onItemCancel(item)" />
          </view>
        </view>
        
      </u-list-item>

      <!-- 空数据 -->
      <view v-if="!pageObj.count" class="nodata"></view>
      <!-- <u-empty v-if="!pageObj.count" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" />
      <u-loadmore v-if="pageObj.count && releaseData.length === pageObj.count" status="nomore" /> -->
    </u-list>

    <u-modal :show="modalShow" content="确定取消吗？" showCancelButton @cancel="modalShow = false" @confirm="modalConfirm" />
    <u-toast ref="elToast" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text.vue'
import Utils from '@/js/utils'
import { findDecPassList, updateDecPass } from '@/service/wxmanage'

const TABS_ENUM = [
  { name: '审核中', id: 1 },
  { name: '待放行', id: 2 },
  { name: '已完成', id: 3 },
  { name: '已拒绝', id: 4 },
  { name: '已取消', id: 5 }
]

export default {
  name: 'GoodsReleaseList',
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID } = this.$constant

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      // tabList: TABS_ENUM.map(item => ({
      //   ...item,
      //   badge: { value: 0 }
      // })),
			tabList:[
				{ name: '审核中', id: 1,badge: { value: 0 } },
				{ name: '进行中', id: 2,badge: { value: 0 } },
				{ name: '已完成', id: 3,badge: { value: 0 } },
				{ name: '已拒绝', id: 4,badge: { value: 0 } },
				{ name: '已取消', id: 5,badge: { value: 0 } }
			],
      pageObj: { // 页码
        index: 1,
        count: 0
      },
      selTab: { // tab栏被选择项
        index: 0,
        id: ''
      },
      releaseData: [], // 列表数据
      modalShow: false, // 取消按钮的弹窗
      selItem: {} // 被选中的item项
    }
  },
  onLoad(option) {
    this.getList(this.pageObj.index, option.tabId)
		this.getAllCount()
  },
  // created() {
  //   this.getList(this.pageObj.index, this.$route.query.tabId)
  // },
  /**监听用户下拉刷新 */
  onPullDownRefresh() {
    this.getList(1, this.selTab.id)
  },
  methods: {
		getFindDecPassList(index){
			let params = {
					submitter: this.memberId,
					companyId:this.companyId,
					current: 1,
					size: 10,
					type: 1,
					decpassState:index
		  }
		  findDecPassList(params).then(res=>{
		    if(res.status=='200'||res.status=='204'){ 
		      if(index==1) {this.tabList[0].badge.value = res.data.total};
		      if(index==2) {this.tabList[1].badge.value = res.data.total};
		      if(index==3) {this.tabList[2].badge.value = res.data.total};
		      if(index==4) {this.tabList[3].badge.value = res.data.total};
		      if(index==5) {this.tabList[4].badge.value = res.data.total}; 
		    }
		  }) 	     
		},
		getAllCount(){
			for( var i=1;i<6;i++){
				this.getFindDecPassList(i);
			 }
		},
    async getList(pageIndex, tabId) {
      // 更新pageIndex和selTab
      this.pageObj.index = pageIndex
      if (pageIndex == 1) {
        this.releaseData = []
      }
      if (tabId !== this.selTab.id) {
        this.updateSelTabById(tabId)
      }

      const params = {
        submitter: this.memberId,
        companyId: this.companyId,
        current: pageIndex,
        size: 10,
        type: 1,
        decpassState: this.selTab.id
      }
      const res = await findDecPassList(params).finally(() => {
        uni.stopPullDownRefresh()
      })
      const data = res.data || {}
      const releaseDataTmp = (data.records || []).map(item => {
        let list = []
        try {
          list = JSON.parse(item.items)
        } catch (error) { }

        return {
          ...item,
          releaseDate: uni.$u.timeFormat(item.startTime, 'yyyy-mm-dd'),
          releaseGoods: list.map(row => `${row.itemName}/${row.itemNum}`).join('， ')
        }
      })

      this.pageObj.count = data.total || 0
      if (pageIndex == 1) {
        this.releaseData = releaseDataTmp
      } else {
        this.releaseData = [].concat(this.releaseData, releaseDataTmp)
      }
    },
    onScrollBottom() {
      // 判断是否为最后一页
      if (this.pageObj.count === this.releaseData.length) return

      this.getList(this.pageObj.index + 1, this.selTab.id)
    },
    onTabsChange(item) {
      this.getList(1, item.id)
    },
    onItemCancel(item) {
      this.selItem = Object.assign({}, item)
      this.modalShow = true
    },
    async modalConfirm() {
      const params = {
        releaseId: this.selItem.releaseId,
        decpassState: 5
      }
      const res = await updateDecPass(params)
      if (res.status != 200) {
        this.$refs.elToast.show({
          type: 'error',
          message: '取消失败'
        })
        return
      }

      this.$refs.elToast.show({
        type: 'success',
        message: '取消成功'
      })
			this.getAllCount()
      this.pageObj.index = 1
      this.modalShow = false
      this.getList(1, this.selTab.id)
    },
    /**
     * @param {number} decpassState
     */
    stateVal(decpassState) {
      return TABS_ENUM.find(item => item.id == decpassState)?.name || ''
    },
    /**
     * @param {string} tabId
     */
    updateSelTabById(tabId) {
      tabId = tabId || '1'

      this.selTab.id = tabId
      console.log('TABS_ENUM.findIndex(item => item.id == tabId)====',TABS_ENUM.findIndex(item => item.id == tabId))
      this.selTab.index = TABS_ENUM.findIndex(item => item.id == tabId)
    },
    linkTo(item) {
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-c/goods-release/goods-release-detail', { passId: item.releaseId })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: rgb(245, 245, 245);
}

.u-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
}

::v-deep .u-list-item {
  margin: 5px 10px;
}

.card__box {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 14px;
}
::v-deep .u-tabs__wrapper__nav__item{
  flex:1;
}
.nodata {
    height: calc(100vh - 88rpx);
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

::v-deep .u-tabs__wrapper__nav__item {
  position: relative;
}
::v-deep .u-badge{
	position: absolute;
	right: 0;
	top: 12rpx;    
}
::v-deep .cell-text-label text{
	font-size: 28rpx !important;  
}
::v-deep .cell-text-content{
	font-size: 28rpx !important;  
}
::v-deep .u-button .u-button__text{
	font-size: 28rpx !important;
}
.submitTime{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0;
	position: relative;
	text{
		font-size: 28rpx;
		color:#666666;
	}
}
.submitTime::after{
	content: '';
	display: block;
	position: absolute;
	left: 0;
	bottom: 0;
	background-color: #d9dce7;
	width: 100%;
	height: 1px;
	transform: scaleY(0.5);    
}
.flexRight{
	justify-content: flex-end;
}
.flexRight::after{
	height: 0;
}
</style>