<style lang="scss" scoped>
.select-type {
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include flx-dsp($jsc: center, $ali: center, $drt: column);
  .inputs-wrap {
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .input-wrap {
      flex: 1;
      margin: 14rpx 24rpx;
      ::v-deep .u-input {
        padding: 12rpx 32rpx !important;
      }
      ::v-deep .input-placeholder {
        font-size: 26rpx !important;
        color: #999999 !important;
      }
    }
    .extra-text {
      margin-right: 24rpx;
      color: var(--app-primary-color);
      font-size: 30rpx;
    }
  }
  .content-wrap {
    flex: 1;
    width: 100%;
    overflow: hidden;
    @include flx-dsp($jsc: center, $ali: center);
  }
  .type-wrap {
    flex: 1;
    height: 100%;
    overflow: auto;
    background: #ffffff;
    &:nth-child(2) {
      background: #f0f0f0;
    }
    &:nth-child(3) {
      background: #f3f3f3;
    }
  }
  .item-wrap {
    padding: 30rpx;
    font-size: 30rpx;
    color: #333333;
    border-bottom: 1px solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .item-name {
      flex: 1;
    }
  }
  .active {
    color: var(--app-primary-color) !important;
    background: #ffffff !important;
  }
  .e-empty {
    width: 100%;
    height: 100%;
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    .img-wrap {
      width: 65%;
    }
    .text-wrap {
      font-size: 30rpx;
      color: #999999;
    }
  }
}
</style>

<template>
  <view class="select-type" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="inputs-wrap">
      <view class="input-wrap">
        <u--input v-model="query.serverName" fontSize="26rpx" customStyle="{padding:12rpx 32rpx;background: #F3F3F3;}" placeholder="请输入关键字搜索" shape="circle" clearable></u--input>
      </view>
      <view class="extra-text" @click="getTypes">搜索</view>
    </view>
    <view class="content-wrap">
      <view class="type-wrap" v-for="(select, index) in selectList" :key="index">
        <view @click="selectType(type, index)" class="item-wrap" :class="{ active: type.serverId === selected[index] }" v-for="type in select" :key="type.serverId">
          <view class="item-name">{{ type.serverName }}</view>
          <u-icon v-if="type.serverId === selected[index] && type.serverId === selected[selected.length - 1]" size="40rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
        </view>
      </view>
    </view>
    <view class="e-empty" v-if="!selectList.length">
      <view class="img-wrap">
        <image style="width: 100%" src="@/static/icon-img/no-data.png" mode="aspectFit"></image>
      </view>
      <view class="text-wrap">暂无数据</view>
    </view>
  </view>
</template>

<script>
import { getQuesTaskServerSettingTree } from '@/service/wuyecrm.js'

export default {
  name: 'selectType',
  computed: {},
  data() {
    return {
      query: {},
      selectList: [],
      selected: [],
      userInfo: {}
    }
  },
  onLoad(query) {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.query = query
    this.query.companyId = this.userInfo.companyId
    this.getTypes()
  },
  methods: {
    getTypes() {
      this.selectList = []
      this.selected = []
      let params = {
        data: this.query
      }
      getQuesTaskServerSettingTree(params).then((res) => {
        if ((res.status = 200)) {
          if (res.data && res.data.length && res.data[0].children && res.data[0].children.length) {
            this.selectList = [res.data[0].children]
          }
        } else {
          this.selectList = []
          uni.showToast({ title: res.message, icon: 'none' })
        }
      })
    },
    selectType(type, index) {
      if (index <= this.selected.length) {
        this.selected.splice(index, this.selected.length)
      }
      if (index <= this.selectList.length) {
        this.selectList.splice(index + 1, this.selectList.length)
      }

      this.selected.push(type.serverId)
      if (type.children && type.children.length) {
        this.selectList.push(type.children)
      } else if (type.serverId) {
        let params = {
          taskSubTypeId: type.serverId,
          taskSubTypeName: type.fullName,
          serverSettingId: type.serverSettingId,
          processKey: type.processId || '',
          processName: type.processName || ''
        }
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('dataEvent', { data: params })
        uni.navigateBack()
      }
    }
  }
}
</script>
