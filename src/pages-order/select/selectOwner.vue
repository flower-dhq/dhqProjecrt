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
    overflow: auto;
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
  .bottom-wrap {
    font-size: 30rpx;
    color: #999999;
    text-align: center;
    padding: 30rpx;
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
        <u--input v-model="unionSelect" fontSize="26rpx" customStyle="{padding:12rpx 32rpx;background: #F3F3F3;}" placeholder="输入楼栋/楼层/房间号/姓名/电话号码快捷查询" shape="circle" clearable></u--input>
      </view>
      <view class="extra-text" @click="search">搜索</view>
    </view>

    <view class="content-wrap">
      <u-list @scrolltolower="scrolltolower" v-if="ownerList.length" height="100%">
        <view @click="selectOwner(owner)" class="item-wrap" :class="{ active: owner.ownerInfoId === ownerId }" v-for="(owner, index) in ownerList" :key="index">
          <view class="item-name">{{ owner.regName }}-{{ owner.regNumber }}-{{ owner.roomInfo }}</view>
        </view>
        <view class="bottom-wrap" v-if="ownerList.length === totalCount">到底啦~</view>
      </u-list>
    </view>
    <view class="e-empty" v-if="!ownerList.length">
      <view class="img-wrap">
        <image style="width: 100%" src="@/static/icon-img/no-data.png" mode="aspectFit"></image>
      </view>
      <view class="text-wrap">暂无数据</view>
    </view>
  </view>
</template>

<script>
import { ownerInfoListNew, getNewOwnerInfosByHouseInfo } from '@/service/landcrm.js'

export default {
  name: 'selectOwner',
  computed: {},
  data() {
    return {
      unionSelect: '',
      query: {
        startIndex: 1,
        pageSize: 50
      },
      totalCount: 0,
      ownerList: [],
      ownerId: '',
      userInfo: {}
    }
  },
  onLoad(query) {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.query = {
      ...this.query,
      ...query,
      userId: this.userInfo.userId
    }
    this.getOwnerList()
  },
  onPullDownRefresh() {
    this.query.startIndex = 1
    this.getOwnerList()
  },
  methods: {
    search() {
      this.query.startIndex = 1
      this.getOwnerList()
    },
    getOwnerList() {
      let params = {
        data: {
          ...this.query,
          unionSelect: this.unionSelect
        }
      }
      uni.showLoading({
        title: '加载中'
      })
      ownerInfoListNew(params).then((res) => {
        uni.stopPullDownRefresh()
        uni.hideLoading()
        if ((res.status = 200)) {
          if (this.query.startIndex === 1) {
            this.ownerList = res.data || []
          } else {
            this.ownerList = this.ownerList.concat(res.data || [])
          }

          this.totalCount = res.totalCount
        } else {
          uni.showToast({ title: res.message, icon: 'none' })
        }
      })
    },
    scrolltolower() {
      if (this.ownerList.length < this.totalCount) {
        this.query.startIndex++
        this.getOwnerList()
      }
    },
    async selectOwner(owner) {
      this.ownerId = owner.ownerInfoId
      const res = await getNewOwnerInfosByHouseInfo({data: { houseInfoId: owner.infoId }})
      const { contactName = '', contactPhone = ''} = res && res.data && res.data[0] || {}
      let params = {
        location: owner.roomInfo,
        contactName,
        contactPhone,
        ownerId: owner.ownerInfoId,
        ownerName: owner.regName,
        ownerPhone: owner.regNumber,
        houseinfoId: owner.infoId,
        buildingId: owner.buildingId,
        quesRangeId: owner.quesRangeId,
        houseRoom: owner.houseRoom
      }

      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('dataEvent', { data: params })
      uni.navigateBack()
    }
  }
}
</script>
