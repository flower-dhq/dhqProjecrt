<template>
  <view class="fight-group">
    <view class="header">
      已有
      <text class="header-num">{{groupCount}}</text>人正在参与活动
      <cl-button v-if="groupCount" type="text" @click="isShowPopup = true">查看全部</cl-button>
    </view>
    <view class="content">
      <!-- 拼团 -->
      <swiper
        v-if="groupCount"
        autoplay
        vertical
        disable-touch
        circular
        :display-multiple-items="2"
        :style="{ height: '232rpx' }"
      >
        <swiper-item class="swiper-item" v-for="(childItem, index) in groupList" :key="index">
          <fight-group-card :groupNum="groupNum" :data="childItem" @joinGroup="joinGroup" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 弹窗 -->
    <cl-dialog :visible.sync="isShowPopup" show-close-btn>
      <view class="popup-header">可参与的拼团</view>
      <!-- 拼团 -->
      <scroll-view scroll-y>
        <fight-group-card
          v-for="(childItem, index) in groupList"
          :groupNum="groupNum"
          :key="index"
          :data="childItem"
          @joinGroup="joinGroup"
        />
      </scroll-view>
    </cl-dialog>
  </view>
</template>

<script>
import FightGroupCard from './fight-group-card.vue'
import dayjs from 'cl-uni/utils/dayjs'
import * as ShopStore from './shopStore'

/**
 * 拼团
 * @property {number} groupNum 拼团人数，默认2人
 * @event joinGroup 去参团
 */
export default {
  options: { styleIsolation: 'shared' },
  props: {
    // 多少人才可以成团
    groupNum: {
      type: Number,
      default: 2
    }
  },
  components: {
    FightGroupCard
  },
  data() {
    return {
      groupList: [], // 拼团列表，一个买家为一个子项
      shopStore: ShopStore.state(),
      isShowPopup: false
    }
  },
  computed: {
    // 拼团总人数
    groupCount() {
      return this.groupList.reduce((sum, item) => {
        sum += item.child.length
        return sum
      }, 0)
    },
    // 临时数据，没什么作用，只是为了展示头像数量用的
    getArrByNum() {
      return new Array(this.groupNum).fill({})
    }
  },
  created() {
    this.getGroupOrder()
  },
  methods: {
    // 获取团购商品参团列表
    async getGroupOrder() {
      const params = {
        pathParams: '/10/1',
        data: {
          goodsId: this.shopStore.shopId,
          groupStatus: 1, // 团购状态，{0: 未参团, 1: 拼团中， 2：未成团, 3: 已成团}
          payStatus: 2 // 支付状态，{0: 待支付, 1: 已退款, 2: 已支付, 3: 部分退款}
        }
      }
      const { data = {} } = await this.$mallApi.shop.getGroupOrder(params)
      const { records = [], total = 0 } = data

      this.groupList = this.formatList(records)
    },
    formatList(arr = []) {
      let today = dayjs(new Date()).format('YYYY-MM-DD')
      const datetime = today + ' 23:59:59'
      // groupSn为团号，有可能两个人是同一个团，他们的团号就一样
      const res = new Map()

      arr.forEach(item => {
        const uniqueId = item.groupSn
        const type = item.groupType // 团购类型。{ 1: 开团, 2: 参团 }
        const childObj = {
          groupType: type,
          buyerId: item.buyerId,
          buyerName: item.buyerName,
          buyerHeadPortrait: item.buyerHeadPortrait || ''
        }

        if (!res.has(uniqueId)) {
          res.set(uniqueId, {
            groupSn: uniqueId,
            goodsId: item.goodsId,
            datetime,
            child: [{}]
          })
        }

        // 确保child的第一个位置是开团，后面的位置是参团
        const tmp = res.get(uniqueId).child
        if (type === 1) {
          tmp[0] = childObj
        } else {
          tmp.push(childObj)
        }
      })

      return Array.from(res.values())
    },
    // 计算左边头像的位置，在宽度为138rpx下怎样才能容纳groupNum个人数
    groupNumStyle(index) {
      const size = 84 // 图片大小，单位rpx
      const width = 138 // 总宽度
      const left = (size * this.groupNum - width) / (this.groupNum - 1)
      const marginLeft = -left * index + 'rpx'
      return { marginLeft }
    },
    // 还差多少人成团
    differNum(num) {
      const res = this.groupNum - num
      return res < 0 ? 0 : res
    },
    joinGroup(childItem) {
      this.$emit('joinGroup', childItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.fight-group {
  width: 100%;
}
.header {
  width: 100%;
  font-size: 24rpx;
  font-weight: bold;
  color: #000;

  .header-num {
    font-size: 32rpx;
    color: $uni-color-main;
    padding: 0 8rpx;
  }
  ::v-deep .cl-button {
    float: right;
    height: 40rpx;
    line-height: 1.8;
  }
}
.content {
  width: 100%;
  margin-top: 14rpx;

  .swiper-item {
    padding: 16rpx 0;
    box-sizing: border-box;
  }
}
::v-deep .cl-dialog__container,
cl-dialog {
  height: 800rpx;
  padding: 0;
}
::v-deep .cl-dialog__message {
  height: 100%;
}
::v-deep uni-scroll-view,
scroll-view {
  height: calc(100% - 102rpx);
}
.popup-header {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 36rpx;
  border-bottom: 2rpx solid #ddd;
}
.cl-dialog__container,
scroll-view {
  ::v-deep .group-card {
    padding: 20rpx;
  }
}
</style>