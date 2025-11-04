<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-swiper :list="imageList" indicator autoplay />
    <view class="content-panel">
      <view class="title-panel">
        <text>{{ title }}</text>
        <!-- 状态 -->
        <u-tag :text="getTag.label" plain plainFill size="mini" :color="getTag.color" :borderColor="getTag.color" :bgColor="getTag.bgColor" />
      </view>
      <view class="flex-row">
        <text>联系人：公司 {{ contactName }}</text>
        <u--text :text="contactPhone" mode="phone" call :size="12" :color="THEME_COLOR" decoration="underline" margin="0 0 0 5px" />
      </view>
      <text class="content-address">{{ getAddressText }}{{ address }}</text>
      <text>{{ getTimeText }}{{ dateTime }}</text>
      <u-divider />
      <view class="describe-title">失物详情</view>
      <text class="describe-content">{{ detail }}</text>
    </view>

    <view class="button-panel" v-if="isShowButton">
      <u-button v-if="getStatusText != 'cancel'" text="取消发布" color="#ff9900" :customStyle="{ borderRadius: 0, height: '30px' }" @tap.stop="modalAction('cancel')" />
      <u-button v-if="getStatusText == 'doing'" text="完成" color="#1890ff" :customStyle="{ borderRadius: 0, height: '30px' }" @tap.stop="modalAction('finish')" />
      <u-button v-if="getStatusText == 'doing'" text="编辑" color="#00c6d2" :customStyle="{ borderRadius: 0, height: '30px' }" @tap.stop="linkTo" />
    </view>

    <u-modal ref="modalRef" :content="modalObj.content" :show="modalObj.isShow" showCancelButton asyncClose @confirm="onConfirm" @cancel="modalObj.isShow = false" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { claimStatus } from '@/pages-b/claim-item-manage/modules/utils'
import { getClaimItemDetail, getFindItemDetail, cancelFindItemOrder, finishFindItemOrder } from '@/service/community'

/**
 * @query {string|number} id
 * @query {'claim'|'find'} itemType claim: 失物招领; find: 寻物启事
 * @query {boolean} isShowButton 默认true。是否显示底部操作按钮
 */
export default {
  name: 'ClaimItemDetail',
  data() {
    return {
      _originData: {},
      imageList: [],
      title: '',
      status: '',
      contactName: '',
      contactPhone: '',
      address: '',
      dateTime: '',
      detail: '',
      modalObj: {
        isShow: false,
        content: '',
        type: ''
      },
      isShowButton: true
    }
  },
  computed: {
    getTag() {
      let item = claimStatus({ id: this.status })
      let map = {
        doing: ['#1890ff', '#e6f7ff'],
        finish: ['#52c41a', '#ecf7e7'],
        cancel: ['#722ed1', '#f0ebf7']
      }

      return !item ? {} : {
        ...item,
        color: map[item.alias]?.[0] || '',
        bgColor: map[item.alias]?.[1] || ''
      }
    },
    getAddressText() {
      let map = {
        claim: '拾取地点：',
        find: '遗失地点：'
      }
      return map[this.itemType] || ''
    },
    getTimeText() {
      let map = {
        claim: '拾取时间：',
        find: '发布时间：'
      }
      return map[this.itemType] || ''
    },
    getStatusText() {
      let item = claimStatus({ id: this.status })
      return item?.alias??''
    }
  },
  async onLoad() {
    const { id, isShowButton } = await Utils.getPageQuery()
    this.isShowButton = isShowButton == 'true'
    await this.getFindItemDetail(id)
  },
  methods: {
    // 获取详情
    async getFindItemDetail() {
      const { id, itemType } = await Utils.getPageQuery()
      let res = {}
      if (itemType == 'claim') {
        res = await getClaimItemDetail(id)
      } else if (itemType == 'find') {
        res = await getFindItemDetail(id)
      }
      let data = this._originData = res.data || {}
      this.imageList = (data.fileList || []).map(item => item.filePath)
      this.title = data.title
      this.status = data.status + ''
      this.contactName = data.contactName
      this.contactPhone = data.contactPhone
      this.address = data.address
      this.dateTime = this.itemType === 'claim' ? data.time : (this.itemType === 'find' ? data.publishTime : '')
      this.detail = data.detail
    },
    modalAction(type) {
      let map = {
        cancel: '是否取消？',
        finish: '是否完成？'
      }
      this.modalObj.content = map[type] || map.cancel
      this.modalObj.type = type
      this.modalObj.isShow = true
    },
    async onConfirm() {
      let res = {}
      if (this.modalObj.type === 'cancel') {
        // 取消发布订单
        res = await cancelFindItemOrder(this.id)
      } else if (this.modalObj.type === 'finish') {
        // 完成订单
        res = await finishFindItemOrder({ data: { id: this.id, remark: '' } })
      }

      if (res.status == 200) {
        this.modalObj.isShow = false
      } else {
        this.$refs.modalRef.loading = false
      }
    },
    // 跳转到编辑页面
    linkTo() {
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-b/claim-item-manage/add-claim-item', { id: this._originData.id }),
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f6f7;
}
.content-panel {
  display: flex;
  flex-direction: column;
  padding: 10px;
  font-size: 12px;
  line-height: 25px;
  color: #999999;
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 30px;
}
.title-panel {
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  color: #333;
  line-height: 20px;
}
.content-address {
  line-height: 16px;
  white-space: pre-wrap;
  word-break: break-all;
}
::v-deep .u-tag-wrapper .u-tag--mini {
  height: 18px;
  line-height: 18px;
  margin-left: 10px;
}
::v-deep .u-divider {
  margin: 5px 0 !important;
}
.describe-title {
  font-size: 14px;
  color: #333;

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 20px;
    background-color: var(--app-primary-color);
    vertical-align: middle;
    margin-right: 5px;
  }
}
.flex-row {
  display: flex;
  align-items: center;
  white-space: pre;
}
.describe-content {
  color: #333;
  line-height: 20px;
}
.button-panel {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>