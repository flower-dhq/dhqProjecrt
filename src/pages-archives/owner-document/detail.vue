<template>
  <view class="page-panel"  :style="[THEME_CSS_VAR]">
    <!-- 业主信息 -->
    <view class="owner-panel">
      <view class="owner-name">
        <u--image :src="ownerDetail.headimgUrl" width="100rpx" height="100rpx" shape="circle" />
        <view :class="['user-sex', getOwnerSex]">
          <u-icon :name="getOwnerSex" color="#fff" size="28rpx" />
        </view>
        <text style="font-size: 30rpx; color: #333; font-weight: bold; margin-left: 30rpx;">{{ ownerDetail.ownerName }}</text>
        <!-- 住户状态 -->
        <view class="owner-tag primary">{{ ownerDetail.houseState }}</view>
        <!-- 认证状态 -->
        <view :class="['owner-tag', getStatusText.color]">{{ getStatusText.label }}</view>
      </view>
      <view class="owner-info">
        <text>昵称：{{ ownerDetail.unifiedMemNickname || ownerDetail.nickName || '--'}}</text>
        <u--text :suffixIcon="phoneIcon" :text="'电话：' + (ownerDetail.ownerPhone || '--')" size="26rpx" color="#666" iconStyle="margin-left: 8rpx" @click="callPhone" />
        <text>是否重点业主：{{ isImportantOwner }}</text>
        <text>邮箱：{{ ownerDetail.email || '--' }}</text>
      </view>
      <view class="owner-btn">
        <u--text v-if="isOwner" :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-edit.png`)" text="编辑资料" type="primary" size="28rpx" :iconStyle="{fontSize: '32rpx', color: THEME_COLOR, marginRight: '12rpx'}" align="center" @click="openEditInfo" />
        <u--text :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" text="发起会话" type="primary" size="28rpx" :iconStyle="{fontSize: '32rpx', color: THEME_COLOR, marginRight: '12rpx'}" align="center" @click="openChat" />
      </view>
    </view>
    <u-gap height="24rpx" /> 
    <!-- tab栏 -->
    <u-tabs
      :list="tabList" :current="searchForm.selTab.index"
      lineColor="#1989F7" :activeStyle="{color: '#1989F7'}"
      itemStyle="height: 88rpx; padding: 0 10rpx;" :scrollable="false" @change="tabsChange"
    />

    <scroll-view class="tabs-scroll" scroll-y :scroll-into-view="searchForm.selTab.id" @scroll="onScroll" scroll-with-animation>
      <template>
         <!-- 房产信息 -->
      <real-estate-info id="tabs-1" show :ownerId="ownerId" ref="realEstateEl" />
      <u-gap height="24rpx" /> 
      <!-- 客户标签 -->
      <view id="tabs-2" :class="['owner-tag-info', { show: true }]">
        <view class="tab-title" @click="tagChangePer()">
          <text>客户标签</text>
          <u-icon name="arrow-right" />
        </view>
        <view class="owner-tag-list">
          <text class="owner-tag-item" v-for="(item, index) in tagList" :key="index">{{ item.tagName }}</text>
        </view>
      </view>
      <u-gap height="24rpx" /> 
      <!-- 日常服务 -->
      <order-info id="tabs-3" show :ownerId="ownerId" ref="orderEl" />
      <u-gap height="24rpx" /> 
      <!-- 账款信息 -->
      <account-info id="tabs-4" show :ownerId="ownerId" ref="accountEl" />
      </template>

      
    </scroll-view>
    <u-safe-bottom />

    <behavior-tag :show.sync="tagShow" :defaultTag="tagList" :unifiedMemberId="unifiedMemberId" @confirm="getCustomerTagList" />
    <yb-complete ref="completeMsgEl" />
    <u-modal :show="ownerModal.isShow" title="提示" content="未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
  </view>
</template>

<script>
import RealEstateInfo from '@/pages-archives/modules/real-estate-info.vue'
import OrderInfo from '@/pages-archives/modules/order-info.vue'
import AccountInfo from '@/pages-archives/modules/account-info.vue'
import BehaviorTag from '@/pages-archives/modules/behavior-tag.vue'
import Utils from '@/js/utils'
import pageRefresh from '@/js/pageRefresh'
import { getOwnerInfoById, getProjectList } from '@/service/landcrm'
import { getCustomerTagList } from '@/service/community'
import { getQYInfoByOwnerId, syncOwnerInfo } from '@/service/api-gateway'

/**
 * 企微上的客户（叫外部联系人），然后会根据企微的手机号码，查找出在业主端对应的手机号码的业主信息，然后进行同步信息（即绑定）。
 * 因此，工单的服务请求人，就是企微上的客户（外部联系人）。
 * 只有企微上的客户，才会存在业户档案数据
 */
export default {
  components: {
    BehaviorTag,
    RealEstateInfo,
    OrderInfo,
    AccountInfo
  },
  data() {
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
    return {
      companyId:companyId,
      userId: '',
      ownerId: '', // 业主id
      unifiedMemberId: '', // 统一会员id
      pageType: '',
      tabList: [
        { name: '房产信息', id: 'tabs-1' },
        { name: '客户标签', id: 'tabs-2' },
        { name: '日常服务', id: 'tabs-3' },
        { name: '账款信息', id: 'tabs-4' }
      ],
      searchForm: {
        selTab: {
          index: 0
        },
        isTabChange: false
      },
      ownerDetail: {}, // 业主信息
      tagShow: false,
      tagList: [], // 客户标签
      distanceTab: [], // 每个tab项下的内容的坐标信息
      ownerModal: {
        isShow: false
      }
    }
  },
  computed: {
    // 获取业主性别
    getOwnerSex() {
      const map = {
        0: 'man',
        1: 'woman'
      }
      return map[this.ownerDetail.sex] || ''
    },
    // 认证状态
    getStatusText() {
      const map = {
        0: { label: '未认证', color: 'no' },
        1: { label: '已认证', color: 'success' },
        2: { label: '待认证', color: 'primary' },
        3: { label: '认证失败', color: 'fail' },
        4: { label: '已取消', color: 'cancel' },
        5: { label: '异常', color: 'cancel' },
      }
      return map[this.ownerDetail.authType] || ''
    },
    // 电话图标
    phoneIcon() {
      const { ownerPhone } = this.ownerDetail
      return ownerPhone ? require('@/static/theme-default/workorder/icon-phone-fill.png') : ''
    },
    //是否重点客户
    isImportantOwner() {
      return this.ownerDetail.isImportantOwnerName == 1 ? '是' : '否'
    },
    isOwner() {
      return this.ownerDetail.houseState != '会员'
    }
  },
  async onLoad(options) {
    this.ownerId = options.ownerId || ''
    this.unifiedMemberId = options.unifiedMemberId || ''
    this.pageType = options.type || '' // '': 默认，房间列表中进来。'singleChat': 从单聊会话的工具栏进入

    const { O_USER_INFO } = this.$constant
    const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
    this.userId = userInfo.userId

    pageRefresh.restore('OWNER_INFO')
  },
  async mounted() {
    const idTmp = this.ownerId

    const projectIds = await this.getProjectByUserId()
    await this.getOwnerInfoById()
    await Promise.all([
      this.$refs.realEstateEl.getHouseListByOwnerId(idTmp, projectIds), // 获取列表
      this.getCustomerTagList(),
      this.$refs.orderEl.getQuestionTasksByOwnerInfoId(idTmp, projectIds), // 获取日常服务列表
      this.$refs.accountEl.selectBillRecordByOwnerInfoId(idTmp, projectIds), // 获取账款列表
    ])

    this.$nextTick(() => {
      // 需要等页面渲染完，才能拿到坐标参数
      this.getDistanceItem()
    })
  },
  onShow() {
    if (pageRefresh.isRefresh('OWNER_INFO', true)) {
      this.getOwnerInfoById()
    }
  },
  methods: {
    tagChangePer(){
      this.tagShow = true
    },
    // 监听tab栏滚动
    onScroll(event) {
      console.log('isTabChange', this.searchForm.isTabChange)
      if (this.searchForm.isTabChange) {
        // 当前的滚动是因为 tab栏 切换导致的,需要排除掉
        this.searchForm.isTabChange = false
        return
      }

      const scrollTop = Math.floor(event.detail.scrollTop) // 滚动距离
      const offsetTop = event.target.offsetTop // tab栏整体离顶部的偏移量
      const pageTop = scrollTop + offsetTop // 整体距离
      
      let index = this.distanceTab.findIndex((item, index) => {
        const nextIndex = index + 1 // 下一个节点的索引
        if (nextIndex < this.distanceTab.length) {
          const nextItem = this.distanceTab[nextIndex]

          if (pageTop >= item.top && pageTop < nextItem.top) {
            // 滚动距离，大于当前节点的开始位置，小于当前节点的结束位置
            return true
          }
        } else {
          // 滚动到最后节点，直接返回最后的节点
          return true
        }
        return false
      })
      index = index == -1 ? 0 : index // 如果意外出错，就默认返回第一个节点
      // 重复的就不需要修改了,阻止滚动时候出现抖动问题
      if (index == this.searchForm.selTab.index) return

      this.searchForm.selTab = { ...this.tabList[index], index  }
    },
    tabsChange({ index }) {
      const item = this.tabList[index]
      this.searchForm.isTabChange = true
      this.searchForm.selTab = { ...item, index }
    },
    // 获取当前登录用户能够查看到哪些项目
    async getProjectByUserId() {
      const params = {
        data: {
          userId: this.userId
        },
        hideLoading: false
      }
      const res = await getProjectList(params)
      const data = res?.items ?? []
      return data.map(item => item.projectId).join(',')
    },
    // 获取业主数据
    async getOwnerInfoById() {
      const params = {
        data: {
          companyId: this.companyId,
          ownerId: this.ownerId
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await getOwnerInfoById(params)
      this.ownerDetail = res.data ?? {}
      // memberFlag: 1: 会员; 0: 游客；
      // unifiedMemberId: 大会员id
      const { memberFlag,  unifiedMemberId } = this.ownerDetail
      // 为会员时，其他字段为空
      if (memberFlag && !this.isOwner) {
        const d = {
          ownerName: '--',
          unifiedMemNickname: '',
          email: '',
          ownerPhone: ''
        }
        Object.assign(this.ownerDetail, d)
      }
      if (!this.unifiedMemberId) this.unifiedMemberId =  unifiedMemberId
      
    },
    // 获取业主标签列表
    async getCustomerTagList() {
      const params = {
        data: {
          companyId: this.companyId,
          unifiedMemberId: this.unifiedMemberId
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await getCustomerTagList(params)
      this.tagList = res.data ?? []
    },
    // 获取tab栏内容块的位置
    getDistanceItem() {
      this.tabList.forEach(item => {
        uni.createSelectorQuery().in(this).select('#' + item.id).boundingClientRect(data => {
          // 例如 tabItem的top是 352.635 , 但是滚动的距离刚好是 352 ,则会往前一个tab。 然后下次滚动又刚好卡在前面的步骤, 这样就会导致 tab 一直往前滚动
          data = this.floatToInt(data)
          this.distanceTab.push(data)
        }).exec()
      })
    },
    // 遍历对象的所有值,将小数转换为整数
    floatToInt(obj) {
      if (Utils.kindOf(obj) != 'object') return obj

      const res = Object.keys(obj).reduce((res, key) => {
        const item = obj[key]
        res[key] = (Utils.kindOf(item) == 'number') ? Math.floor(item) : item
        return res
      }, {})
      return res
    },
    /**
     * 根据业主，在企微上打开 当前登录人 与 业主 的会话
     * 如果是员工，在企微上开通的是企业成员(即企微名字后面不带 @微信 标志)
     * 如果是业主，在企微上开通的是外部联系人（即企微名字后面带 @微信 标志，也叫客户）
     */
    async openChat() {
      const ownerId = this.ownerId || '' // 反馈人业主id
      if (!ownerId) {
        // 业主未认证业主端
        this.ownerModal.isShow = true
        return
      }

      const res = await getQYInfoByOwnerId(ownerId) // 获取反馈人在企微上的信息
      const data = res.data || {}
      if (!data.userId) {
        // 如果不存在外部联系人id
        this.ownerModal.isShow = true
        return
      }

      // 需要先根据员工id同步业主信息
      await syncOwnerInfo(data.userId)
      // 打开与客户的单聊会话
      wx.qy.openEnterpriseChat({
        externalUserIds: data.userId,
        success: (res) => { }
      })
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
    // 打开编辑业主信息页面
    openEditInfo() {
      uni.navigateTo({ url: '/pages-archives/owner-document/edit-owner?ownerId=' + this.ownerId })
    },
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: this.ownerDetail.ownerPhone || ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  background-color: #f3f5f9;
  height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}
.owner-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  /* margin: 0 20rpx 20rpx 24rpx; */
  border-radius: 16rpx;
  padding: 40rpx 40rpx 20rpx;
}
.owner-name {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.user-sex {
  position: absolute;
  bottom: 0rpx;
  left: 64rpx;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rpx;
  width: 32rpx;
  height: 32rpx;
  
  &.woman {
    background-color: #f02da4;
    transform: rotateZ(45deg);
  }
  &.man {
    background-color: #1989f7;
  }
}
.owner-tag {
  min-width: 92rpx;
  height: 36rpx;
  background-color: #f2f2f2;
  color: #666;
  font-size: 22rpx;
  border-radius: 18rpx;
  text-align: center;
  margin-left: 24rpx;
  padding: 0 10rpx;
  box-sizing: border-box;

  &.success {
    /* 已认证 */
    color: #10BB88;
    background-color: #e7faf4;
  }
  &.no {
    /* 未认证 */
    color: #FE9900;
    background-color: #fff7f2;
  }
  &.fail {
    /* 认证失败 */
    color: #FF1E1E;
    background-color: #ffeaea;
  }
  &.primary {
    /* 待认证 */
    color: var(--app-primary-color);
    background-color: #e7f3ff;
  }
  &.cancel {
    /* 已取消，异常 */
    color: #a5a5a5;
    background-color: #f3f3f3;
  }
}
.owner-info {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0 12rpx;
  color: #666;
  font-size: 26rpx;
}
.owner-btn {
  display: flex;
  align-items: flex-end;
  height: 60rpx;
  border-top: 1px solid #EBEBEB;
  margin-top: 16rpx;

  & ::v-deep.u-text {
    font: 1 1 auto;
    justify-content: center;
  }
}
::v-deep .u-tabs {
  background-color: #fff;
  border-bottom: 1px solid #efefef;
}
.owner-tag-info {
  display: none;
  
  &.show {
    display: block;
  }
}
.tabs-scroll {
  flex: 1 1 auto;
  overflow: hidden;
}
.tab-title {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 102rpx;
  color: #333;
  font-size: 30rpx;
  font-weight: bold;
  border-bottom: 1px solid #efefef;
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
}
.owner-tag-list {
  display: flex;
  flex-wrap: wrap;
  padding: 30rpx 14rpx 14rpx 30rpx;
  background-color: #fff;
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;
}
.owner-tag-item {
  padding: 4rpx 8rpx;
  font-size: 24rpx;
  color: var(--app-primary-color);
  border-radius: 4rpx;
  border: 1px solid var(--app-primary-color);
  box-sizing: border-box;
  margin: 0 0 16rpx 16rpx;
}
::v-deep .table-panel {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .border {
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }
  .uni-table-tr:first-child {
    background-color: #f8f8f8;
  }
  .uni-table-th, .uni-table-td {
    font-size: 24rpx;
    color: #333;
    font-weight: normal;
    padding: 24rpx 10rpx;
  }
}
</style>