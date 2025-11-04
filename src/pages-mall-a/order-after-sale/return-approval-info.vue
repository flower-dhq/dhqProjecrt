<template>
  <view class="box">
    <view class="page-bg-color"></view>
    <view class="placeholder"></view>
    <!-- 步骤条 -->
    <setup-line-bilateral
      ref="elSetup"
      v-model="setupValue"
      :setupList="setupList"
      :prefixHeight="44"
      :suffixHeight="52"
    ></setup-line-bilateral>
    <!-- 售后进度 -->
    <view class="card-box flex-column" @click="linkTo">
      <text>售后进度：{{ getPageInfo.progress.status }}</text>
      <text class="clear-padding text--gray">
        {{ getPageInfo.progress.status === '退款成功' ? '已退款' + orderInfo.payAmountStr + '元' : getPageInfo.progress.descript }}
        <text v-if="getPageInfo.progress.status === '退款成功'">({{orderInfo.refundTime}})</text>
      </text>
      <cl-icon class="icon-right" name="cl-icon-arrow-right"></cl-icon>
    </view>
    <!-- 商品 -->
    <view class="card-box" v-for="(item, index) in shopCartList" :key="index">
      <cart-card-item
        :src="item.goodsPicture"
        :name="item.goodsName"
        :specification="item.goodsSpec"
        :price="formatMoney(item.payAmount)"
        :value="item.numbers"
        :refundText="1"
        :otherData="orderInfo"
        type="textNumber"
      />
    </view>
    <!-- 订单号 -->
    <view class="card-box flex-column">
      <view class="flex-spacebetween">
        <text>售后单号</text>
        <text>{{ orderInfo.asNo }}</text>
      </view>
      <view class="flex-spacebetween">
        <text>申请时间</text>
        <text>{{ orderInfo.createTime }}</text>
      </view>
      <view class="flex-spacebetween">
        <text>退货类型</text>
        <text>{{ orderInfo.asTypeStr }}</text>
      </view>
    </view>
    <!-- 详细付款 -->
    <view class="card-box flex-column" v-if="setupValue === 'pendingReview'">
      <view class="flex-spacebetween">
        <text>优惠券</text>
        <view class="footer-price--sign">
          -
          <cl-text
            class="footer-price"
            type="price"
            size="26rpx"
            :value="orderInfo.discountAmount | formatMoneyFil"
            color="primary"
          />
        </view>
      </view>
      <!-- TODO 暂时去掉 -->
      <!-- <view class="flex-spacebetween">
        <text>运费</text>
        <view class="footer-price--sign">
          +
          <cl-text class="footer-price" type="price" size="26rpx" value="59" color="primary" />
        </view>
      </view>-->
      <view class="flex-spacebetween">
        <text>实付款</text>
        <cl-text
          class="footer-price"
          type="price"
          size="26rpx"
          :value="orderInfo.payAmount | formatMoneyFil"
          color="primary"
        />
      </view>
    </view>
    <!-- 发货，提交单号 -->
    <view class="card-box flex-column" v-if="setupState === 3">
      <view class="flex-spacebetween">
        <text style="width: 140rpx;">快递公司</text>
        <cl-select v-model="formData.expressCompany" :options="expressList"></cl-select>
      </view>
      <view class="flex-spacebetween">
        <text style="width: 140rpx;">快递单号</text>
        <cl-input v-model="formData.expressNo" @input="expressNoKeyUp"></cl-input>
      </view>
    </view>
    <view class="clear-both"></view>
    <!-- 底部按钮，具体内容可以查看afterSaleStore文件 -->
    <view class="page-bottom-panel" v-if="getPageInfo.bottomBtn.isEnable && isSupplyAndit">
      <cl-button
        class="page-bottom-btn"
        round
        type="primary"
        :fill="true"
        :disabled="isDisabled"
        @click="nextSetup(setupValue)"
      >{{ getPageInfo.bottomBtn.text }}</cl-button>
    </view>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import SetupLineBilateral from '@/components/setup-line-bilateral/setup-line-bilateral.vue'
import CartCardItem from '@/components/cart-card-item/cart-card-item.vue'
import afterSaleStore from './module/afterSaleStore.js'
import commonMethod from '@/js/commonMethod'
import handleDataOfNull from '@/js/handleDataOfNull'
import dayjs from 'cl-uni/utils/dayjs'

/*
 * 页面传参，?afterSaleId=
 * type: (pendingReview: 待审核, passed: 已通过, refunding: 收到退款, refundSuccess: 退款成功, refundRefused: 已拒绝, refundCancel: 已取消)
 * type: pendingReview - 显示售后进度、商品、订单号、详细付款、底部按钮
 * type: passed,refunding - 显示售后进度、商品、订单号
 * type: refundSuccess,refundRefused,refundCancel - 显示售后进度、商品、订单号、底部按钮
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    SetupLineBilateral,
    CartCardItem
  },
  data() {
    return {
      // 步骤列表数据
      setupList: [],
      // 售后订单类型，对应setupList里的label
      setupValue: 'pendingReview',
      setupState: 1,
      afterSaleId: '', // 售后订单id
      shopCartList: [],
      // 请求接口返回的数据
      orderInfo: {
        asNo: '', // 售后单号
        createTime: '', // 申请时间
        discountAmount: 0, // 优惠总金额，单位分
        payAmount: 0 // 实付金额，单位分
      },
      asState: 1, // 退货状态，（1:待审核 2:已拒绝 3:已通过（待发货）4:已通过（待收货） 5:收到货（待退款）6：已退款（已完成） 7:已取消 8 已删除 9：退款失败 10：退款中）
      asType: 50, // 退货类型，{50 : 我要退货退款, 20: 我要换货, 40: 仅退款(无需退货) }
      formData: {
        expressCompany: '', // 快递公司
        expressNo: '' // 快递单号
      },
      expressList: [], // 快递公司列表
      isSupply: 1 //是否供应链售后
    }
  },
  computed: {
    getPageInfo() {
      return afterSaleStore.getPageInfo(this.setupState)
    },
    isDisabled() {
      // 待发货状态下的按钮判断
      return this.asState === 3 && (this.formData.expressCompany === '' || this.formData.expressNo === '')
    },
    isSupplyAndit() {
      //待审核且供应链售后时不显示取消按钮
      return !(this.isSupply == 1 && this.asState == 1)
    }
  },
  filters: {
    formatDate(val) {
      return val ? dayjs(new Date(val)).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    // 将金额的单位分转换为元
    formatMoneyFil(val) {
      return commonMethod.precision.divide(val, 100)
    },
    formatAsType(val) {
      const tmp = {
        50: '我要退货退款',
        20: '我要换货',
        40: '仅退款(无需退货)'
      }
      return tmp[val]
    }
  },
  onLoad(option) {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    const { afterSaleId } = commonMethod.getRouteParams(option, 'afterSaleId')

    this.afterSaleId = afterSaleId || ''

    afterSaleStore.init()
    this.getAfterSaleById(this.afterSaleId)
    this.getExpressDelivery()
  },
  methods: {
    // 获取售后进度详情
    async getAfterSaleById(saleId) {
      const params = {
        pathParams: `/${saleId}`
      }
      const res = await this.$mallApi.shop.getAfterSaleById(params)
      let data = res.data || {}
      let { asState: aftState, asType = 50, afterSaleGoodsList = [], isSupply = 0, goodsRefundState, refundState} = handleDataOfNull(data)
      const { asState } = this.transformAfterSaleState({aftState, asType, goodsRefundState, refundState}) // 状态转换
      console.log('asState', asState)
      this.asState = this.setupState = asState
      this.asType = asType
      this.isSupply = isSupply
      this.setupValue = (asState === 5 || asState === 10) && asType == '40' ? 'waitForDelivery' : afterSaleStore.getKey(asState).type
      this.setupList = afterSaleStore.getSetupList(asState, asType)
      this.shopCartList = afterSaleGoodsList
      this.orderInfo = Object.freeze(data)
    },
    // type: 类型
    async nextSetup(type) {
      const saleId = this.afterSaleId
      const info = afterSaleStore.getPageInfo(this.setupValue).bottomBtn

      let res = {}
      let linkTo = false
      switch (type) {
        case 'pendingReview': // 取消
          res = await this.$mallApi.shop.cancelAfterSaleById({ pathParams: `/${saleId}`, responseToast: false })
          break
        case 'refundSuccess': // 删除
        case 'refundRefused': // 删除
        case 'refundCancel': // 删除
          res = await this.$mallApi.shop.delAfterSaleById({ pathParams: `/${saleId}`, responseToast: false })
          linkTo = true
          break
        case 'waitForDelivery': // 发货，提交订单
          // expressState: 快递状态 { 1：发货, 2：确认收货 } 固定为1
          const param = {
            data: {
              asId: this.afterSaleId,
              expressCompany: this.formData.expressCompany,
              expressNo: this.formData.expressNo,
              expressState: 1
            }
          }
          res = await this.$mallApi.shop.submitOrderNum(param)
          linkTo = true
          break
        default:
          break
      }

      const message = res.success ? info.success : info.failed
      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })

      if (res.success && type === 'pendingReview') {
        // 点击取消申请按钮后，需要刷新页面重新加载数据
        location.reload()
        return
      }
      if (res.success && linkTo) {
        // 返回上一页
        // setTimeout(function(){
        //   uni.navigateBack({ delta: 1 })
        //   return
        // },1500)
      }
    },
    linkTo() {
      uni.navigateTo({ url: '/pages-mall-a/order-after-sale/return-approval-progress?afterSaleId=' + this.afterSaleId })
    },
    // 将单位分转换为单位元
    formatMoney(val) {
      const res = commonMethod.precision.divide(val, 100)
      return commonMethod.precision.decimals(res, 2)
    },
    // 获取快递公司
    async getExpressDelivery() {
      const params = {
        pathParams: '/ExpressCompany'
      }
      const { data } = await this.$mallApi.data.getConfigByCode(params)

      this.expressList = (data.children || []).map(item => ({ label: item.configName, value: item.configName }))
    },
    //监听快递单号输入限制   限制数字和字母
    expressNoKeyUp(e) {
      this.$nextTick(function() {
        this.formData.expressNo = e.replace(/[\u4e00-\u9fa5/\s+/]|[^a-zA-Z0-9\u4E00-\u9FA5]/g, '')
      })
    },
    transformAfterSaleState(params = {}) {
      const {aftState, asType, goodsRefundState, refundState} = params
      const getState = () => {
        // goodsRefundState：退货状态（0:待退货 1:已退货 2:已收货） refundState("退款状态 1：退款成功  0:退款失败 2:退款中 3:待退款")
        const isPass = aftState === 3
        const goodsReturn = asType == 20 || asType == 50
        const refundMoney = refundState == 1
        const state3 = isPass && !goodsRefundState && goodsReturn
        const state4 = isPass && goodsReturn && goodsRefundState == 1
        const state5 = isPass && goodsReturn && goodsRefundState == 2 && !refundMoney
        const state6 = aftState === 4 && (refundMoney || asType == 20) 
        const state7 = aftState === 5
        const state9 = refundState == 0
        const state10 = refundState == 2 || asType == 40 && refundState === 3 // refundState = 3 待退款
        return state3 ? 3 : state4  ? 4 : state5  ? 5 : state6  ? 6 : state7  ? 7 : state9  ? 9 : state10 ? 10 : 0 
      }
      // 待审核1 已拒绝2 已通过3 已通过（待收货）4 收到退货5 退款成功6 已取消7 已删除8 退款失败8 退款失败9 退款中10
      const asState = aftState === 1 || aftState === 2 ? aftState : getState()

      return { asState }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  background-color: #f7f7f7;
  z-index: 0;

  /* #ifdef H5 */
  min-height: 100vh;
  /* #endif */

  /* #ifdef MP-WEIXIN */
  min-height: 100vh;
  /* #endif */
}
.page-bg-color {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  right: 0rpx;
  z-index: -1;
  height: 294rpx;
  background-image: linear-gradient(90deg, $uni-color-main, $uni-color-assist);
}
.placeholder {
  width: 100%;
  height: 40rpx;
}
.clear-both {
  width: 100%;
  height: 1rpx;
}

::v-deep .setup-line-bilateral {
  position: relative;
  // z-index: 2;
}
.card-box {
  margin: 0 20rpx 20rpx;
  padding: 30rpx 22rpx;
  background-color: #fff;
  border-radius: 8rpx;
  position: relative;
}
.flex-column {
  @include flx-dsp(flex-start, flex-start, column);
  font-size: 26rpx;

  & > view:not(:last-child),
  & > text:not(:last-child) {
    padding-bottom: 30rpx;
  }
  & > text.clear-padding {
    padding-bottom: 0rpx;
    margin-right: 20rpx;
  }
  & > text.text--gray {
    color: #888;
  }
}
.flex-spacebetween {
  width: 100%;
  @include flx-dsp(space-between, center, row);
}
.footer-price--sign {
  color: $uni-color-assist;
}
.footer-price::v-deep {
  &.cl-text.is-price,
  .cl-text.is-price {
    color: $uni-color-assist;
  }
}
.page-bottom-panel {
  width: 100%;
  box-sizing: border-box;
  padding: 0 40rpx 56rpx;

  .page-bottom-btn {
    height: 80rpx;
  }
}
.icon-right {
  position: absolute;
  right: 14rpx;
  top: 50%;
  transform: translateY(-50%);
}
</style>