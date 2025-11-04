<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="goods-image">
      <u-image :src="goodsObj.cardImageText" width="240px" height="200px" />
    </view>
    <view class="goods-info">
      <view class="goods-info--bright">
        <text>￥</text><text class="goods-info--stress">{{ selItem.value.businessPrice || 0 }}</text><text> 元 / {{ selItem.value.priceUnit }}</text>
      </view>
      <view class="goods-info--title">{{ goodsObj.cardName }}</view>

      <text class="goods-business">办理业务</text>
      <view :class="['goods-business-radio', { select: index === selItem.index }]" v-for="(item, index) in goodsObj.cardBusinessList" :key="index" @click="onSelItem(item, index)">{{ item.businessName }}</view>
    </view>

    <view class="goods-info">
      <text class="goods-business goods-business--prefix cell-border">办卡须知</text>
      <text class="goods-info--desc">{{ goodsObj.cardNeedToKnow }}</text>
    </view>

    <view style="padding: 30px 0 10px;">
      <u-button type="primary" text="提交申请" customStyle="width: 70%;" :color="THEME_COLOR" @click="onSubmit" />
    </view>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getCardDetail } from '@/service/returnVisit'

export default {
  name: 'CardHandleDetail',
  data() {
    return {
      goodsObj: {
        cardImageText: '',
        cardName: '',
        cardBusinessList: [],
        cardNeedToKnow: ''
      },
      selItem: {
        value: {},
        index: 0
      }
    }
  },
  created() {
    this.getCardDetail()
  },
  methods: {
    async getCardDetail() {
      const { id } = await Utils.getPageQuery()
      const res = await getCardDetail({ id })

      this.goodsObj = res.data
      let tmp = this.goodsObj.cardBusinessList = res.data?.cardBusinessList || []

      this.onSelItem(tmp[0] || {}, 0)
    },
    onSelItem(item, index) {
      this.selItem.index = index
      this.selItem.value = item
    },
    onSubmit() {
      const selItem = this.selItem.value

      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-d/card-manage/my-card-apply', {
          id: selItem.id,
          cardName: this.goodsObj.cardName,
          businessName: selItem.businessName,
          businessPrice: selItem.businessPrice,
          maxNumber: selItem.maxNumber,
          maxNumberCompany: selItem.maxNumberCompany
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 10px;

.page-panel {
  min-height: 100vh;
  background-color: rgb(245, 245, 245);
}
.goods-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  height: 240px;
  padding: 20px 0;
}
.goods-info {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 5px 10px;
  margin-top: 10px;
}
.goods-info--bright {
  color: var(--app-primary-color);
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  padding: 10px $padding 0;
}
.goods-info--stress {
  font-size: 20px;
}
.goods-info--title {
  border-bottom: 1px solid #eaeaea;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  word-break: break-all;
  padding: 10px $padding;
}
.goods-business {
  height: 40px;
  line-height: 40px;
  padding: 0 $padding;
}
.goods-business-radio {
  width: 200px;
  padding: 8px 14px;
  border: 1px solid #666;
  border-radius: 5px;
  color: #666;
  text-align: center;
  line-height: 18px;
  margin: 0 auto;
  font-size: 14px;
  margin-bottom: 7px;

  &.select {
    border: 1px solid var(--app-primary-color);
    background-color: #ebfafa;
    color: var(--app-primary-color);
  }
}
.goods-business--prefix {
  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    background-color: var(--app-primary-color);
    margin-right: 2px;
    vertical-align: -4px;
  }
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
.goods-info--desc {
  font-size: 14px;
  line-height: 20px;
  word-break: break-all;
  padding: 10px $padding;
}
</style>