<template>
  <view>
    <u-modal
      :show="show"
      :title="title"
      :cancelText="cancelText"
      :confirmText="confirmText"
      :showConfirmButton="showConfirmButton"
      :showCancelButton="showCancelButton"
      @confirm="submit"
      @cancel="cancelBtn"
    >
      <view class="slot-content">
        {{ content }}
      </view>
    </u-modal>
    <u-modal
      :show="rzModal"
      title="请认证"
      width="272"
      :showConfirmButton="false"
    >
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      title: '提示',
      content: '',
      cancelText: '取消',
      confirmText: '确认',
      showConfirmButton: true,
      showCancelButton: true,
      path: '',
      type: '',
      rzModal: false
    }
  },
  methods: {
    showModal(e) {
      document.body.style.overflow = 'hidden'
      if (e.modalType == 'rz') {
        this.rzModal = true
      } else {
        this.content = e.content
        this.path = e.path
        this.show = true
      }
    },
    submit() {
      document.body.style.overflow = 'auto'

      this.show = false
      if (this.path) {
        uni.navigateTo({ url: this.path })
      }
    },
    cancelBtn() {
      this.show = false
      document.body.style.overflow = 'auto'
    },
    menuJump(type) {
      document.body.style.overflow = 'auto'
      this.rzModal = false
      if (type == 1) {
        uni.navigateTo({ url: '' })
      } else if (type == 2) {
        uni.navigateTo({ url: '/pages-d/enterprise-info/join-company' })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.slot-content {
  width: 100%;
  min-height: 80rpx;
  font-size: 30rpx;
  line-height: 1.3;
  word-wrap: break-word;
  word-break: break-all;
  color: #999;
  text-align: center;
}
.rz-title {
  font-size: 12px;
  
  
  line-height: 17px;
  color: #999999;
}
.rz-text {
  font-size: 12px;
  
  
  line-height: 17px;
  display: flex;
  align-items: center;
  height: 108rpx;
  border-radius: 5px;
  margin: 15px 0;
  image {
    height: 64rpx;
    width: 64rpx;
    margin: 0 30rpx;
  }
}
.rz-fwbox {
  background: #fdf7f4;
  color: #fc510d;
}
.rz-qybox {
  background: #f5fbff;
  color: #1a9cf9;
}
.rz-no {
  height: 34px;
  line-height: 34px;
  border: 1px solid #e6b932;
  border-radius: 17px;
  font-size: 14px;
  line-height: 34px;
  color: #e6b932;
}
</style>
