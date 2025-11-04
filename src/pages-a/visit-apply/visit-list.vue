<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="page-bg" />

    <u-tabs :list.sync="tabList" :current="0" :scrollable="false" :activeStyle="{ color: THEME_COLOR }" :lineColor="THEME_COLOR" @change="tabChange" />
    <u-list height="calc(100vh - 44px)" @scrolltolower="onScrollBottom">
      <u-list-item v-for="(item, index) in visitList" :key="index">
        <block>
          <u-gap height="8" bgColor="#f5f5f5" />
          <visit-card :data="item" @submit="reqVisitorList(1)" />
        </block>
      </u-list-item>

      <!-- 空数据 -->
      <u-gap height="8" bgColor="#f5f5f5" />
      <u-empty v-if="!pageObj.total" mode="list" text="暂无记录" marginTop="144px" icon="/static/components/visit-empty.png" />
      <u-loadmore v-if="pageObj.total && visitList.length === pageObj.total" status="nomore" />
    </u-list>

    <view class="add-btn" @click="linkToApply">
      <u-icon name="plus" :size="25" color="#fff" />
    </view>
  </view>
</template>

<script>
import VisitCard from './modules/visit-card'
import Utils from '@/js/utils'
import commLogic from '@/js/comm-logic'
import { getVisitRecordList } from '@/service/wxmanage'

export default {
  name: 'VisitList',
  components: {
    VisitCard
  },
  data() {
    const { MEMBER_ID, O_USER_INFO, USER_TYPE_NUM } = this.$constant
    const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    const userType = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' })

    return {
      companyId: commLogic.getProjectConfig().companyId,
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      phoneNumber: userInfo.ownerPhone || userInfo.phoneNumber || userInfo.contactPhone || '',
      userType, // 当前身份  4:企业联系人  6：企业员工  其他：访客(会员或游客)
      tabList: [
        { name: '预约' },
        // { name: '邀请', disabled: ![4, 6].some(item => item == userType) },
        { name: '邀请' },
      ],
      tabIndex: 0,
      pageObj: {
        total: 1,
        size: 10,
        index: 1
      },
      visitList: []
    }
  },
  onPullDownRefresh() {
    this.reqVisitorList(1).finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  onLoad() {
    this.reqVisitorList()
  },
  methods: {
    // 获取访客列表
    async reqVisitorList(pageIndex) {
      if (pageIndex) {
        this.pageObj.index = pageIndex
      }
      const tmpIndex = this.pageObj.index
      if (tmpIndex == 1) {
        this.visitList = []
      }
      const params = {
        pageNum: tmpIndex,
        pageSize: this.pageObj.size,
        recordStatus: '',  // 记录状态，全部则不传，待审核：0，已审核（待拜访、待放行）：1， 已完成：2， 已拒绝：3， 已取消：4， 已过期：5， 其他：-1（业主端我的访客列表加上）
        companyId: this.companyId,
        recordType: this.tabIndex == 1 ? 2 : 1 // 1: 访客登记, 2: 访客邀请
      }
      if (this.userType == 4) {
        params.toVisitCompanyContactPhone = this.phoneNumber
      } else if (this.userType == 6) {
        params.toVisitPersonPhone = this.phoneNumber
      } else {
        params.visitPersonPhone = this.phoneNumber
      }
			uni.showLoading({title:'加载中..'})
      const res = await getVisitRecordList({ data: params,hideLoading:true })
      const data = res.data || {}
      const tmpList = (data.records || []).map(item => ({
        ...item,
        phoneNumber: this.phoneNumber,
        userType: this.userType,
        memberId: this.memberId
      }))
      this.pageObj.total = data.total

      if (pageIndex == 1) {
        this.visitList = tmpList
      } else {
        this.visitList = [].concat(this.visitList, tmpList)
      }
			setTimeout(()=>{
				uni.hideLoading()
			},800)

      return
    },
    tabChange(item) {
      this.tabIndex = item.index
      this.reqVisitorList(1)
    },
    linkToApply() {
			if(this.tabIndex == 1 && ![4, 6].some(item => item == this.userType)){
				uni.showToast({
					title:'邀请访客需要先认证企业',
					icon:'none'
				})
				return
			}
      const type = this.tabIndex == 1 ? 'invite' : 'regist'
      uni.navigateTo({ url: '/pages-a/visit-apply/visit-regist?type=' + type })
    },
    onScrollBottom() {
      // 判断是否为最后一页
      if (this.pageObj.total === this.visitList.length) return

      this.reqVisitorList(this.pageObj.index + 1)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  box-sizing: border-box;
}
.page-bg {
  background-image: url(@/static/components/visit-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 200px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}
::v-deep .u-tabs {
  background-color: #fff;
  position: relative;
  z-index: 1;
}
.add-btn {
  position: fixed;
  bottom: 60px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: var(--app-primary-color);
  box-shadow: 0px 2px 7px -1px var(--app-primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .u-tabs__wrapper__nav__line{
	transform:translate(186rpx)
}
</style>