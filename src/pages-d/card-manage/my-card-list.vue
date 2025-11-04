<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <u-tabs :list="tabList" :current="selTab.index" :lineColor="THEME_COLOR" :scrollable="false" @change="onTabsChange" />
    <u-list height="calc(100vh - 44px)" @scrolltolower="onScrollBottom">
      <u-list-item v-for="(item, index) in releaseData" :key="index">

        <view class="card__box" @click="linkTo(item)">
          <cell-text :labelWidth="0" isRight>
            <text>订单号{{ item.handleCode }}</text>
            <u-tag slot="right" :text="item.handleState" shape="circle" :bgColor="getStateText(item.handleState).bgColor" :borderColor="getStateText(item.handleState).bgColor" :color="getStateText(item.handleState).color" />
          </cell-text>
          <cell-text label="卡证名称" :labelWidth="80" border="none">{{ item.cardType }}</cell-text>
          <cell-text label="办理业务" :labelWidth="80" border="none" :padding="0" isRight>
            {{ item.cardBusiness }}
            <text slot="right" style="font-weight: bold; font-size: 16px;">￥ {{ item.payAmount || 0 }} 元</text>
          </cell-text>
          <cell-text label="联系人" :labelWidth="80" :border="item.handleState === '待支付' ? 'bottom' : 'none'">{{ item.contactName + '  ' + item.contactNumber }}</cell-text>
          <cell-text :labelWidth="0" border="none" contentAlign="flex-end" v-if="item.handleState === '待支付'">
            <u-button v-if="item.handleState === '待支付'" text="去支付" :customStyle="{ width: '60px', marginRight: '10px' }" size="small" @click.native.stop="linkToPayment(item)" />
            <u-button v-if="item.handleState === '待支付'" text="取消" :customStyle="{ width: '60px', margin: 0 }" size="small" @click.native.stop="onItemCancel(item)" />
          </cell-text>
        </view>
        
      </u-list-item>

      <!-- 空数据 -->
      <view v-if="!pageObj.count && loading" class="nodata"></view>
      <!-- <u-empty v-if="!pageObj.count" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" /> -->
      <u-loadmore v-if="pageObj.count && releaseData.length === pageObj.count" status="nomore" />
    </u-list>

    <u-modal :show="modalShow" content="确定取消吗？" showCancelButton @cancel="modalShow = false" @confirm="modalConfirm" />
    <u-toast ref="elToast" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text.vue'
import Utils from '@/js/utils'
import { selectCardHandleByPage, editCardHandle } from '@/service/returnVisit'

const TABS_ENUM = [
  { name: '待付款', id: '待支付' },
  { name: '处理中', id: '待审核处理中' },
  { name: '已完成', id: '已完成' },
  { name: '其他', id: '其他' }
]

export default {
  name: 'MyCardList',
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID, O_USER_INFO } = this.$constant
    let userInfo = {}
    try {
      userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    } catch (err) { }

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      userInfo,
      tabList: TABS_ENUM.map(item => ({
        ...item,
        badge: { value: 0 }
      })),
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
      selItem: {} ,// 被选中的item项
      loading:false
    }
  },
  onLoad(options) {
    let tabId = ''
    if(options.tabId){
      tabId = options.tabId
    }else {
      tabId = '待支付'
    }
    this.getList(this.pageObj.index, tabId)
  },
  /**监听用户下拉刷新 */
  onPullDownRefresh() {
    this.getList(1, this.selTab.id)
  },
  methods: {
    async getList(pageIndex, tabId) {
      // 更新pageIndex和selTab
      this.pageObj.index = pageIndex
      if (pageIndex == 1) {
        this.releaseData = []
      }
      if (!!tabId && tabId != this.selTab.id) {
        this.updateSelTabById(tabId)
      }

      const params = {
        memberId: this.memberId,
        handleState: this.selTab.id,
        size: 10,
        current: pageIndex,
      }
      this.loading = false
      const res = await selectCardHandleByPage(params).finally(() => {
        uni.stopPullDownRefresh()
      })
      const data = res.data || {}
      const releaseDataTmp = data.list || []

      this.pageObj.count = data.total || 0
      if(this.pageObj.count == 0){
        this.loading = true;
      }
      if (pageIndex == 1) {
        this.releaseData = releaseDataTmp
        this.updateTabListBadge('待支付', res.part1)
        this.updateTabListBadge('待审核处理中', res.part3 + res.part4)
        this.updateTabListBadge('已完成', res.part5)
        this.updateTabListBadge('其他', res.part2 + res.part6 + res.part7)
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
    // 取消支付
    onItemCancel(item) {
      this.selItem = Object.assign({}, item)
      this.modalShow = true
    },
    async modalConfirm() {
      const params = {
        handleState: 7,
        handleId: this.selItem.handleId,
        operator: this.userInfo.fullName
      }
      const res = await editCardHandle(params)
      if (res.status != 200) {
        this.$refs.elToast.show({
          type: 'error',
          message: '取消失败'
        })
        return
      }
      this.modalShow = false

      this.$refs.elToast.show({
        type: 'success',
        message: '取消成功'
      })
      this.pageObj.index = 1
      this.getList(this.pageObj.index,this.selTab.id)
    },
    getStateText(state) {
      if (state === '待支付') return { bgColor: '#ffe5f0 !important', color: '#ff0167 !important' }
      if (state === '待审核处理中') return { bgColor: '#e5f7ff !important', color: '#00b1ff !important' }
      return { bgColor: '#f2f2f4 !important', color: '#9d9c9f !important' }
    },
    /**
     * 设置被选中的 tab 栏
     * @param {string} tabId
     */
    updateSelTabById(tabId) {
      tabId = tabId || '待支付'

      this.selTab.id = tabId
      this.selTab.index = TABS_ENUM.findIndex(item => item.id == tabId)
    },
    /**
     * 更新 tab 栏的 badge 数字
     * @param {string} tabId
     * @param {number} num
     */
    updateTabListBadge(tabId, num) {
      const res = this.tabList.find(item => item.id === tabId)
      if (res) {
        res.badge.value = num
      }
    },
    linkTo(item) {
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-d/card-manage/my-card-detail', { id: item.handleId, cardId: item.cardId })
      })
    },
    // 跳转到支付页面
    linkToPayment(item) {
      this.selItem = Object.assign({}, item)

      // 支付截至时间
      const endPayDate = new Date(item.createDate.replace(/-/g, '/'))
      endPayDate.setMinutes(endPayDate.getMinutes() + (parseInt(item.payTimelimit) || 0))
      const enterpriseName = item.enterpriseName
      const other = `${item.cardType}-${item.cardBusiness}/${item.contactName}/${item.contactNumber}${enterpriseName ? '/' + enterpriseName : ''}/${item.handleCode}`

      const orderInfo = {
        orderId: item.handleId, // 订单ID
        totalAmount: item.payAmount, // 缴费金额
        isCountdown: true, // 是否倒计时
        countdownDate: uni.$u.timeFormat(endPayDate, 'yyyy-mm-dd hh:MM:ss'), // 倒计时时间  2020-12-01 17:00:00
        PaymentInfo: `${item.cardType}-${item.cardBusiness}`, // 支付信息
        returnUrl: Utils.spliceGetUrl('/pages-d/card-manage/my-card-detail', { id: item.handleId, cardId: item.cardId }), // 支付成功跳转页面
        notifyUrl: item.notifyUrl,
        banktransferUrl: item.banktransferUrl,
        model: 'card',
        other
      }
      // 跳转到支付页面
      this.$router.push({
						path: '/toBePaid',
						query: {
							orderInfo: JSON.stringify(orderInfo)
						}
					})
      // uni.redirectTo({ url: Utils.spliceGetUrl('', { orderInfo: encodeURIComponent(JSON.stringify(orderInfo)) }) })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: rgb(245, 245, 245);
}

::v-deep .u-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
}

::v-deep .u-list-item {
  margin: 10px;
}

.card__box {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 14px;
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
</style>