<template>
  <view :class="['owner-sheet', getCustomClass]" :style="[getCustomStyle]" @click="linkTo">
    <!-- 头像 -->
    <view class="avatar-box">
      <u--image :src="ownerInfo.headimgUrl || ownerInfo.avatarUrl" width="100rpx" height="100rpx" shape="circle" />
      <!-- 性别 -->
      <view :class="['user-sex', getSexText]">
        <u-icon :name="getSexText" color="#fff" size="28rpx" />
      </view>
    </view>
   
    <view class="content-panel">
      <!-- 姓名 -->
      <cell-text :label="ownerInfo.ownerName || ownerInfo.nickName" labelColor="#333" labelWidth="auto" contentAlign="flex-end" border="none" padding="0 0 4rpx 0" customStyle="font-size: 30rpx;">
        <text :class="['user-status', getStatusText.color]">{{ getStatusText.label }}</text>
      </cell-text>
      <!-- 住户状态 -->
      <text class="content-desc">{{ ownerInfo.houseState }}</text>
      <view class="content-tag">
        <!-- 标签 -->
        <text class="tag-item" v-for="(item, index) in ownerInfo.customerTags" :key="index">{{ item.tagName }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import mpMixin from '@/js/mixin/mpMixin'
import Utils from '@/js/utils'

export default {
  name: 'OnwerSheet',
  mixins: [mpMixin],
  components: {
    CellText
  },
  props: {
    ownerInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    }
  },
  computed: {
    // 认证状态
    getStatusText() {
      const map = {
        0: { label: '未认证', color: 'no' },
        1: { label: '已认证', color: 'success' },
        2: { label: '待认证', color: 'primary' },
        3: { label: '认证失败', color: 'fail' },
        4: { label: '已取消', color: 'cancel' },
        5: { label: '异常', color: 'cancel' },
        6: { label: '预认证', color: 'primary' },
        7: { label: '业主已审核', color: 'primary' }
      }
      
      return map[this.ownerInfo.authType] || map[5]
    },
    // 性别
    getSexText() {
      const map = {
        0: 'man',
        1: 'woman'
      }
      return map[this.ownerInfo.sex] || ''
    }
  },
  methods: {
    linkTo() {
      if (!Utils.isEmpty(this.ownerInfo.ownerId)) {
        // 如果有返回ownerId，才能查看业主信息
        const query = uni.$u.queryParams({
          unifiedMemberId: this.ownerInfo.unifiedMemberId,
          ownerId: this.ownerInfo.ownerId
        })
        uni.navigateTo({ url: '/pages-archives/owner-document/detail' + query })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.owner-sheet {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "PingFang SC";
  background-color: #fff;
  padding: 30rpx;
  box-sizing: border-box;
  position: relative;
}
::v-deep .u-transition {
  flex: 0 0 auto;
}
.avatar-box{
  position: relative;
}
.user-sex {
  position: absolute;
  right: 0;
  bottom: 0;
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
.content-panel {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  margin-left: 24rpx;
}
.user-status {
  font-size: 26rpx;

  &.success {
    /* 已认证 */
    color: #10BB88;
  }
  &.no {
    /* 未认证 */
    color: #FE9900;
  }
  &.fail {
    /* 认证失败 */
    color: #FF1E1E;
  }
  &.primary {
    /* 待认证 */
    color: var(--app-primary-color);
  }
  &.cancel {
    /* 已取消，异常 */
    color: #a5a5a5;
  }
}
.content-desc {
  font-size: 28rpx;
  color: #666;
  margin-top: 4rpx;
  margin-bottom: 6rpx;
}
.content-tag {
  display: flex;
  flex-wrap: wrap;

  .tag-item {
    height: 36rpx;
    line-height: 36rpx;
    font-size: 22rpx;
    padding: 0 6rpx;
    border: 1px solid #2D8CF0;
    color: #2D8CF0;
    border-radius: 4rpx;
    margin-top: 12rpx;

    &:not(:first-child) {
      margin-left: 12rpx;
    }
  }
}
</style>