<template>
<!--  v-if="isShow" -->
  <view class="mod" v-if="isShow">
    <view class="mask"></view>
    <view class="mod-box">
      <swiper class="swiper-box" :indicator-dots="true" indicator-active-color="#EA6A31" indicator-color="#ffffff">
        <swiper-item v-for="item in openPageList" :key="item.advertId">
          <image :style="{ width: '540rpx', height: '648rpx' }" :src="item.filePath" mode="aspectFit" @tap="advertJump(item)" />
        </swiper-item>
      </swiper>
      <image class="btn-close" src="@/pages-mall/static/close.png" @tap="handleCloseAd" />
    </view>
  </view>
</template>

<script>
import { advertJumpMx } from '@/js/minxins.js'

/**
 * 弹窗广告
 */
export default {
  mixins: [advertJumpMx],
  data() {
    return {
      isShow: false, // 显示首页开屏页
      openPageList: [], // 广告列表
    }
  },
  methods: {
    // 获取广告列表，被父组件调用
    async getAdverList(projectId) {
      const params = {
        data: {
          advertType: 4,  // 广告位置(1:商城 3:首页福利来了 4：首页开屏页 5:首页功能区 6:首页中部推广)
					projectId
        },
        responseToast: false
      }
      let { data } = await this.$mallApi.data.getBanner(params)
      data = data || []

      // 先获取localStorage里被使用的广告id，然后用接口数据覆盖旧数据，再用被使用的广告id和接口获取的数据进行对比，给接口数据打上是否被使用的标记，再根据这些数据给localStorage打上标记
      const { usedData, unUseData } = this.getListOfStorage()
      if (usedData.length) {
        // 表示24小时内已经看过的广告
        this.isShow = false
        return
      }

      //  去除重复的广告
      data = data.filter(item => {
        let isRepet = unUseData.some(un => un.advertId === item.advertId)
        return !isRepet
      })
      data = data.concat(unUseData)
      // 按过期时间来排序，时间越短的排首位
      let sortRes = data.sort((atem, btem) => {
        let atime = atem.expiresTime || 0
        let btime = btem.expiresTime || 0

        return atime - btime
      })
      this.openPageList =sortRes[0] ? [sortRes[0]] : []
      if (this.openPageList.length) {
        this.isShow = true
      }

      // 把用过的广告都加上过期时间
      this.setListOfStorage(data)
      this.setExpiresOfList(this.openPageList)
    },
    // 获取localStorage的广告列表数据
    getListOfStorage() {
      const { OPEN_AD } = this.$constant
      console.log('OPEN_AD',OPEN_AD)
      const nowDay = Date.now()
      const SECOND = 1000

      let data = this.$cmMth.storageAction({ key: OPEN_AD, action: 'get' })

      if (!Array.isArray(data)) {
        // 对旧数据做兼容，因为一开始存数据是一种格式，后来换了另一种格式存储数据
        this.setListOfStorage([])
        data = []
      }
      
      let res = data.reduce((store, item) => {
        // 过期的数据(可使用)放进unUseData，未过期的数据(已被使用)放进usedData
        if (!item.expiresTime) {
          store.unUseData.push(item)
        } else {
          let isExpired = nowDay - item.expiresTime >= SECOND
          isExpired ? store.unUseData.push(item) : store.usedData.push(item)
        }

        return store
      }, { usedData: [], unUseData: [] })

      return res
    },
    // 设置广告列表数据到localStorage
    setListOfStorage(data = []) {
      const { OPEN_AD } = this.$constant
      
      this.$cmMth.storageAction({ key: OPEN_AD, value: data, action: 'set' })
    },
    // 给广告列表数据设置个过期时间
    setExpiresOfList(ids = []) {
      const { OPEN_AD } = this.$constant
      const DAY = 24 * 60 * 60 * 1000
      let expiresTimeTmp = Date.now() + DAY

      let data = this.$cmMth.storageAction({ key: OPEN_AD, action: 'get' }) || []
      let res = data.map(({ expiresTime, ...item }) => {
        let isExist = ids.some(id => id === item.advertId)
        return isExist ? { ...item, expiresTime: expiresTimeTmp } : item
      })

      // let res = [
      //   { expiresTime: 过期时间(24小时), ...item: 其他数据 }
      // ]
      this.setListOfStorage(res)
    },
    // 显示广告
    handleCloseAd() {
      this.isShow = false
      // 给已展示过的广告设置过期时间
      let ids = this.openPageList.map(item => item.advertId)
      this.setExpiresOfList(ids)
    }
  },

}
</script>

<style scoped lang="scss">
.mod {
  width: 100%;
  height: 100%;

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    z-index: 1999;
  }

  .mod-box {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2999;

    .swiper-box {
      width: 540rpx;
      height: 708rpx;
    }
    .btn-close {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 60rpx;
    }
  }
}
</style>



