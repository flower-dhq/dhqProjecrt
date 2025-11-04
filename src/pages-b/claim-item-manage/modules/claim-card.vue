<template>
  <view class="claim-card" @tap="linkTo('detail')">
    <view class="card-content">
      <view class="left-panel">
        <text class="left-title one-line">{{ data.title }}</text>
        <text class="one-line">{{ data.detail }}</text>
        <text>{{ getAddressText }}{{ data.address }}</text>
        <view class="view-panel">
          <text>{{ getTimeText }}{{ itemType == 'claim' ? data.time : (itemType == 'find' ? data.publishTime : '') }}</text>
          <!-- <text>134查看</text> -->
        </view>
      </view>
      <u--image :src="getImage" :radius="5" :width="73" :height="73" />
      <!-- 状态 -->
      <view v-if="isShowStatus" :class="['card-status', getStatusText]">{{ getLabel }}</view>
    </view>
    <view class="button-panel" v-if="isShowStatus">
      <u-button v-if="getStatusText != 'cancel'" plain text="取消" shape="circle" size="mini" :customStyle="{ width: '50px', margin: 0, marginLeft: '7px' }" @tap.stop="modalAction('cancel')" />
      <u-button v-if="getStatusText == 'doing'" plain text="完成" shape="circle" size="mini" :customStyle="{ width: '50px', margin: 0, marginLeft: '7px' }" @tap.stop="modalAction('finish')" />
      <u-button v-if="getStatusText == 'doing'" plain text="编辑" shape="circle" size="mini" :customStyle="{ width: '50px', margin: 0, marginLeft: '7px' }" @tap.stop="linkTo('edit')" />
    </view>

    <u-modal ref="modalRef" :content="modalObj.content" :show="modalObj.isShow" showCancelButton asyncClose @confirm="onConfirm" @cancel="modalObj.isShow = false" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { claimStatus } from '@/pages-b/claim-item-manage/modules/utils'
import { cancelFindItemOrder, editFindItemOrder, finishFindItemOrder } from '@/service/community'

/**
 * @event refresh
 */
export default {
  name: 'ClaimCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    // claim: 失物招领; find: 寻物启事
    itemType: {
      type: String,
      default: 'claim',
      validator(val) {
        return ['claim', 'find'].includes(val)
      }
    },
    // 是否显示 tag状态标签，操作按钮
    isShowStatus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      modalObj: {
        isShow: false,
        content: '',
        type: ''
      },
    }
  },
  computed: {
    getLabel() {
      return (claimStatus({ id: this.data.status + '' }) || {}).label || ''
    },
    getStatusText() {
      let res = (claimStatus({ id: this.data.status + '' }) || {}).alias || ''
      return res
    },
    getImage() {
      return (this.data.fileList[0] || {}).filePath || ''
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
    }
  },
  methods: {
    // 跳转到编辑页面
    linkTo(type) {
      let map = {
        edit: Utils.spliceGetUrl('/pages-b/claim-item-manage/add-claim-item', { id: this.data.id, itemType: this.itemType }),
        detail: Utils.spliceGetUrl('/pages-b/claim-item-manage/claim-item-detail', { id: this.data.id, itemType: this.itemType, isShowButton: this.isShowStatus })
      }

      uni.navigateTo({
        url: map[type] || ''
      })
    },
    // 取消操作
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
        res = await cancelFindItemOrder(this.data.id)
      } else if (this.modalObj.type === 'finish') {
        // 完成订单
        res = await finishFindItemOrder({ data: { id: this.data.id, remark: '' } })
      }

      if (res.status == 200) {
        this.modalObj.isShow = false
        // 需要刷新列表
        this.$emit('refresh')
      } else {
        this.$refs.modalRef.loading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.claim-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 7px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
}
.card-content {
  display: flex;
  position: relative;
}
.left-panel {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #9e9d9b;
  flex: 1 1 auto;
  padding-right: 7px;
  overflow: hidden;
}
.left-title {
  font-size: 14px;
  color: #333;
  line-height: 25px;

  & + view {
    flex: 0 0 auto;
  }
}
.view-panel {
  display: flex;
  justify-content: space-between;
}
.card-status {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 2px 7px;
  border-bottom-left-radius: 5px;

  &.doing {
    color: #1890ff;
  }
  &.finish {
    color: #52c41a;
  }
  &.cancel {
    color: #722ed1;
  }
}
.button-panel {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>