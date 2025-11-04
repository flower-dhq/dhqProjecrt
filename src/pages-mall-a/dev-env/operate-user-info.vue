<template>
  <view class="page-box-top">
    <scroll-view scroll-x="true">
      <view class="pad-box">
        <cl-card
          v-for="(item, index) in list"
          :key="index"
          :label="item.key"
          :show-more="true"
          more-text="复制"
          @more="copyText(item)"
        >
          <!-- <json-view v-if="getType(item.value)" :json="getUserInfo().value" /> -->
          <json-view v-if="renderComponent(item.value) === 'json-view'" :json="item.value" :closed="true"></json-view>
          <view v-else>{{item.value}}</view>
          <view class="flex-item">
            <cl-select class="item-left" :value="item.type" @input="dropChange($event, item)" :options="dropOption" mode="selector"></cl-select>
            <cl-input v-model="item.text" fill :maxlength="-1"></cl-input>
          </view>
          <view class="flex-item-right">
            <cl-button type="primary" @click="saveStorage(item.key, item.text, item.type)">保存</cl-button>
          </view>
        </cl-card>
      </view>
    </scroll-view>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import JsonView from './module/y-json-view/y-json-view.vue'

export default {
  options: { styleIsolation: 'shared' },
  components: {
    JsonView
  },
  data() {
    return {
      list: [],
      dropOption: ['Array', 'Object', 'Null', 'Undefined', 'String', 'Number', 'Boolean'],
    }
  },
  filters: {
    format(val) {
      return JSON.stringify(val, null, 2)
    }
  },
  onLoad() {
    this.list = this.getGlobal()

    this.dropOption = ['Array', 'Object', 'Null', 'Undefined', 'String', 'Number', 'Boolean'].map(item => ({
      label: item,
      value: item
    }))
  },
  methods: {
    getUserInfo() {
      const { USER_INFO } = this.$constant
      return {
        key: USER_INFO,
        value: this.$cmMth.getUserStatusInfo()
      }
    },
    getGlobal() {
      return Object.keys(this.$constant).reduce((pre, key) => {
        pre.push({
          key: this.$constant[key],
          value: this.$cmMth.storageAction({ key: this.$constant[key], action: 'get' }),
          type: 'Object',
          text: ''
        })
        return pre
      }, [])
    },
    getType(val) {
      const type = Object.prototype.toString.call(val)
      return ['Array', 'Object', 'Null', 'Undefined', 'String', 'Number', 'Boolean'].find(
        item => type === `[object ${item}]`
      )
    },
    renderComponent(val) {
      const type = this.getType(val)
      if (['Array', 'Object'].includes(type)) {
        return 'json-view'
      } else {
        return 'view'
      }
    },
    copyText({ key, value }) {
      uni.setClipboardData({
        data: JSON.stringify(value),
        success: () => {
          uni.getClipboardData({
            success: res => {
              console.log(res);
            }
          })
        },
        fail: () => {
          console.warn('无法复制')
        }
      })
    },
    dropChange(e, item) {
      item.type = e
    },
    saveStorage(key, value, type) {
      let res = ''
      try {
        if (['Array', 'Object'].includes(type)) {
          res = JSON.parse(value)
        } else if (type === 'Null') {
          res = null
        } else if (type === 'Undefined') {
          res = undefined
        } else if (type === 'Boolean') {
          res = Boolean(value)
        } else if (type === 'Number') {
          res = parseFloat(value)
        } else {
          res = value
        }
        this.$refs.elMessage.open({
          message: '保存成功',
          position: 'middle'
        })
      } catch (error) {        
        this.$refs.elMessage.open({
          message: '保存失败，类型错误',
          position: 'middle'
        })
        return
      }
      this.$cmMth.storageAction({ key, action: 'set', value: res })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box-top {
  background-color: #c7c7c7;
}
.pad-box {
  display: inline-block;
  padding: 20rpx;
  min-width: 100%;
  box-sizing: border-box;
}
::v-deep .cl-card {
  display: inline-block;
  min-width: 100%;
}
::v-deep .jsonview {
  display: inline-block;
  position: relative;
}
scroll-view {
  background-color: #c7c7c7;
}
.flex-item {
  @include flx-dsp(flex-start, center, row);

  .item-left {
    @include flx-size('keep');
    width: 240rpx;
    padding: 0;
  }
  cl-input, .cl-input {
    @include flx-size('stretch');
  }
}
.flex-item-right {
  @include flx-dsp(flex-end, center, row);
  padding-top: 20rpx;
}
</style>