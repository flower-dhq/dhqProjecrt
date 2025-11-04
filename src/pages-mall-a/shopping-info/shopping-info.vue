<template>
  <view class="page-box">
    <view style="position: relative;">
      <!-- 轮播图 -->
      <swiper
        class="carousel-panel"
        :indicator-dots="shopStore.carouselImg.length > 1"
        indicator-active-color="#ffffff"
      >
        <swiper-item v-for="(item, index) in shopStore.carouselImg" :key="index">
          <image class="carousel-image" mode="aspectFit" :src="item" />
        </swiper-item>
      </swiper>
      <!-- 海报分享 -->
      <view class="share-box" @click="toSharePoster">
        <image src="@/pages-mall/static/shop/share_icon.png" />
      </view>
    </view>
    <!-- 标题信息 -->
    <header-title
      ref="headerTitle"
      class="header-separat hor-separat"
      :otherParams="{}"
      @addFavorites="addFavorites"
      @timeEnd="timeEnd"
    />
    <!-- 优惠券 -->
    <view class="flex-form-panel" @click="openCoupon">
      <text class="flex-form-title">优惠</text>
      <view class="flex-form-list single-line">
        <view class="coupon-tag" v-for="(item, index) in validCouponOf2" :key="index">{{item.couponConditionsOfUse}}</view>
      </view>
      <cl-icon name="cl-icon-arrow-right" />
    </view>
    <!-- 配送方式 -->
    <view class="flex-form-panel">
      <text class="flex-form-title">配送方式</text>
      <view class="flex-form-list multi-line">
        <view class="delivery-text" v-for="item in getDeliveryValues()" :key="item.key">{{ item.value }}</view>
      </view>
    </view>
    <!-- 规格型号 -->
    <view class="flex-form-panel" @click="openModel('spec')">
      <text class="flex-form-title">型号规格</text>
      <view class="flex-form-list single-line">
        <button class="model-tag is-active" type="primary" size="mini" v-if="getSelSpec.gsId">{{ getSelSpec.gsName }}</button>
        <!-- <button class="model-tag" size="mini">活力橙坚果1405g</button> -->
      </view>
      <cl-icon name="cl-icon-arrow-right" />
    </view>
    <!-- 配送至 -->
    <view class="flex-form-panel" @click="openAddress">
      <text class="flex-form-title">配送至</text>
      <view class="flex-form-list multi-line">
        <view class="delivery-text addr-text">{{addressData.consigneeAddress?addressData.consigneeAddress:''}}{{addressData.inputAddress?addressData.inputAddress:''}}</view>
      </view>
      <cl-icon name="cl-icon-arrow-right" />
    </view>
    <!-- 服务承诺 -->
    <view class="flex-form-panel" v-if="serviceList.length">
      <text class="flex-form-title">服务承诺</text>
      <view class="flex-form-list single-line">
        <view :style="{ display: 'flex', alignItems: 'center' }" v-for="(item, index) in serviceList" :key="index">
          <cl-icon
            name="cl-icon-check-border"
            v-if="item.type === 'support'"
            :style="{ fontSize: '25rpx', color: '#C8924B', marginRight: '10rpx' }"
          ></cl-icon>
          <cl-icon
            name="cl-icon-warning-border"
            v-if="item.type === 'unSupport'"
            :style="{ fontSize: '25rpx', color: '#ccc', marginRight: '10rpx' }"
          ></cl-icon>
          <view class="delivery-text">{{ item.value }}</view>
        </view>
      </view>
    </view>
    <view class="hor-separat"></view>
    <!-- 如果是团购商品，则需要显示拼团信息 -->
    <view class="panel-pad hor-separat" v-if="getSelSpecType === 'group'">
      <fight-group :groupNum="getSelSpec.promotionActivity.minLimit" @joinGroup="joinGroup" />
    </view>
    <!-- 商品评论 -->
    <shop-comment class="comment-separat hor-separat" :gmId="shopStore.shopInfo.gmId" />
    <!-- 不配送的区域 -->
    <view class="flex-form-panel" v-if="deliveryArea">
      <text class="flex-form-title">不配送的区域</text>
      <view class="flex-form-list multi-line">
        <view class="delivery-text">{{deliveryArea}}</view>
      </view>
    </view>
    <view class="hor-separat"></view>
    <!-- 商品详情 -->
    <view class="detail-panel">
      <text class="detail-title">商品详情</text>
      <rich-text :nodes="shopStore.shopInfo.gmDescDetail"></rich-text>
      <!-- 价格说明 -->
      <image :src="bottomImg" v-if="bottomImg" mode="widthFix" />
    </view>
    <!-- 为你推荐 -->
    <recommend-to-you ref="elRecommend"></recommend-to-you>
    <view class="placeholder"></view>
    <!-- 底部信息栏 -->
    <view class="shop-cart-panel">
      <view class="clean-block newChange-clean-block">
        <icon-around
          src="/pages-mall/static/shop/shop_icon.png"
          text="店铺"
          size="middle-less"
          @click.native="linkTo('home')"
          v-if="showShopButton"
        ></icon-around>
        <icon-around src="/pages-mall/static/shop/service_icon.png" text="客服" size="middle-less" @click.native="serviceClick"></icon-around>
        <icon-around
          src="/pages-mall/static/shop/shop_cart_icon.png"
          text="购物车"
          size="middle-less"
          @click.native="linkTo('shopCart')"
        ></icon-around>
      </view>
      <!-- putShelves: 商品是否上架，0: 下架, 1: 上架 -->
      <template v-if="shopStore.shopInfo.putShelves === 1">
        <!-- 普通商品，秒杀商品，积分商品，分销商品才显示 -->
        <view class="clean-block" :style="[vShow(getSelSpecType !== 'group')]">
          <template v-if="shopStore.shopInfo.putShelves === 1">
            <button class="shop-btn" v-show="getSelSpecType === 'default'" @click="openModel('join')">加入购物车</button>
            <button
              class="shop-btn shop-btn-other"
              :disabled="getStoreCount === 0 || !isStock"
              @click="openModel('buy')"
            >{{ getStoreCount === 0 ? '已售罄' : isStartActive === 'default' || isStartActive === 'startActive' ? (isStock?'立即购买':'库存不足') : '原价购买' }}</button>
          </template>
        </view>
        <!-- 只有团购才显示 -->
        <view class="clean-block" :style="[vShow(getSelSpecType === 'group')]">
          <button class="shop-btn" :disabled="getStoreCount === 0" @click="openModel('aloneBuy')">
            <view class="flex-v">
              <cl-text class="footer-price" type="price" size="24rpx" :value="getDefaultPrice" color="#FFFFFF" />
              <text>{{ getStoreCount ? '单独购买' : '已售罄' }}</text>
            </view>
          </button>
          <button class="shop-btn shop-btn-other" :disabled="getStoreCount === 0" @click="openGroup">
            <view class="flex-v">
              <cl-text class="footer-price" type="price" size="24rpx" :value="getPromoPrice" color="#FFFFFF" />
              <text>{{ getStoreCount ? '我要开团' : '已售罄' }}</text>
            </view>
          </button>
        </view>
      </template>
      <button v-else class="shop-btn shop-btn-other fill-width" disabled>已下架</button>
    </view>
    <!-- 弹窗-优惠券 -->
    <coupon-popup identifyParam="/goods" :visible.sync="isShowCoupon" @getCouponList="onGetCouponList"></coupon-popup>
    <!-- 弹窗-选择地址 -->
    <address-popup :visible.sync="isShowAddress" :addressData.sync="addressData" @getAddrStock="getAddrStock"></address-popup>
    <!-- 弹窗-规格型号 -->
    <model-popup
      v-model="isShowModel"
      :clickSource="clickSource"
      :otherParams="{
        imgUrl: shopStore.shopInfo.logo,
        shopName: shopStore.shopInfo.gmName,
        putShelves: shopStore.shopInfo.putShelves
      }"
      @joinShopCart="joinShopCart"
      @buyNow="buyNow"
      :getAddrStock="getAddrStock"
    ></model-popup>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>

    <!-- 客服信息 -->
    <customer-service v-model="isShowService"></customer-service>
  </view>
</template>

<script>
import IconAround from '@/pages-mall-a/components/icon-around.vue'
import HeaderTitle from './module/header-title.vue'
import ShopComment from './module/shop-comment.vue'
import FightGroup from './module/fight-group.vue'
import CouponPopup from './module/coupon-popup.vue'
import AddressPopup from './module/address-popup.vue'
import ModelPopup from './module/model-popup.vue'
import RecommendToYou from './module/recommend-to-you.vue'
import CustomerService from './module/customer-service.vue'
import { miniInit } from '@/js/miniStore'
import * as ShopStore from './module/shopStore'
import * as DeliveryStore from './module/deliveryStore'
import * as SpecStore from './module/specStore'
import * as CouponStore from './module/couponStore'
import commonMethod from '@/js/commonMethod'
import { createLogger, mapMutations } from 'vuex'
import handleDataOfNull from '@/js/handleDataOfNull'

/**
 * @description
 * 页面传参，?shopId=&shopType=
 * 商品详情包含：普通商品，秒杀商品，团购商品，积分商品，分销商品
 * 规格可以是多种活动类型，例如，规格1是积分，规格2是秒杀，规格3是普通。所以，点击不同规格，商品标题那里就显示相关活动
 * 活动商品是无法被加入购物车的，只能普通商品被加入购物车
 * 从规格商品进入则显示加入购物车（普通规格）和立即购买，从底部两个按钮和去参团按钮进入则显示确定；团购商品在底部则显示单独购买和我要开团
 * 团购商品，开团和参团按钮，点击只展示团购活动的规格，其他类型规格禁止
 * 开团至少要两个人一组
 * 配送方式，有自取、商家配送、快递配送(包邮)，这三个是不需要运费的。快递配送(不包邮)、自定义模板快递、供应链快递，这三个是需要运费的
 * 这业务简直是上天了，融合了TB，TM，JD，PDD，聚划算
 * 如果所有规格库存都为0，则购买商品按钮禁止点击，内容显示 '已售罄'
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    IconAround,
    HeaderTitle,
    ShopComment,
    FightGroup,
    CouponPopup,
    ModelPopup,
    RecommendToYou,
    CustomerService,
    AddressPopup
  },
  data() {
    return {
      isShowCoupon: false,
      isShowAddress: false,
      addressData: {},
      isShowModel: false,
      isReqFavorites: false, // 在接口请求做出响应之前，不允许多次点击
      clickSource: 'spec', // 点击来源，['spec', 'join', 'buy']
      isShowService: false,
      serviceInfo: {},
      serviceList: [], // 包括支持服务和不支持服务

      shopStore: ShopStore.state(),
      deliveryStore: DeliveryStore.state(),
      specStore: SpecStore.state(),
      couponStore: CouponStore.state(),
      deliveryArea: '', //不配送的区域
      selGroupInfo: {
        groupSn: '', // 拼团号
        groupUser: [] // 拼团用户。[{ url: '用户头像地址', captain: '1是团长，2不是团长' }]
      }, // 被选中的团
      bottomImg: '', // 价格说明展示图
      showShopButton: false,
      hasShareCode: {
        //立即购买时分销商品用
        shareCode: '', //分享码
        promotionType: '', //
        promotionId: ''
      },
      linkSpecId: '',
      shareId: '', //分享者id
      validCouponOf2: []
    }
  },
  computed: {
    getSelSpec: SpecStore.getters.getSelSpec,
    getSelSpecType: SpecStore.getters.getSelSpecType,
    isStartActive: SpecStore.getters.isStartActive,
    getDefaultPrice: SpecStore.getters.getDefaultPrice,
    getPromoPrice: SpecStore.getters.getPromoPrice,
    getSpecPrice: SpecStore.getters.getSpecPrice,
    getSelDelivery: DeliveryStore.getters.getSelDelivery,
    getStoreCount: SpecStore.getters.getStoreCount,
    isStock() {
      return SpecStore.state().isStock
    }
  },
  beforeCreate() {
    miniInit('shopStore')
    miniInit('deliveryStore')
    miniInit('specStore')
    miniInit('couponStore')
  },
  async onLoad(option) {
    const params = commonMethod.getRouteParams(option, 'shopId', 'shopType', 'shareId', 's', 'specId', 'q','gParams')
    const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin'
    //分销小程序商品打开
    if(isMini && params.q){
      let res2 = await this.getQrCodeParmas(params.q)
      let res3 = JSON.parse(res2)
      params.shopId = res3.shopId;
      params.specId = res3.specId;
    }
    //商品详情分享二维码打开
    if(isMini && params.gParams){
      let resParams = await this.getQrCodeParmas(params.gParams)
      let resParams2 = JSON.parse(resParams)
      params.shopId = resParams2.shopId;
      params.specId = resParams2.specId;
      params.shareId = resParams2.shareId;
    }
    ShopStore.mutations.setShopId(params.shopId)
    ShopStore.mutations.setShopType(params.shopType)

    // 当从分享的链接跳转进来时，缓存分享者ID
    if (params.shareId) {
      const { SHARE_ID } = this.$constant
      // this.$cmMth.storageAction({ key: SHARE_ID, action: 'set', value: params.shareId })
      this.shareId = params.shareId
    }

    // 缓存分销码
    if (params.shareCode) {
      this.hasShareCode.shareCode = params.s
      this.specStore.isCodeIn = true
    } else {
      this.specStore.isCodeIn = false
    }

    // 缓存链接的规格id
    if (params.specId) {
      this.linkSpecId = params.specId
    }

    this.getGoodsById()
    this.getButtomImg()
    this.getAppletOnline()
    this.queryGoodsNoDeliveryArea()
  },
  // 为你推荐的上拉加载数据
  onReachBottom() {
    this.$refs.elRecommend.scrollToBottom()
  },
  methods: {
    ...mapMutations({
      updateOrderAddress: 'mall/updateOrderAddress',
      updateInvoicesInfo: 'mall/updateInvoicesInfo'
    }),
    getDeliveryValues: DeliveryStore.getMapValues,
    // 接口获取某个功能是否需要显示，例如 小程序为了审核通过，需要隐藏某些功能，而公众号则需要显示该功能
    async getAppletOnline() {
      const params = {
        pathParams: '/AppletOnline'
      }
      const { data: res } = await this.$mallApi.data.getConfigByCode(params)
      this.showShopButton = res ? false : true
    },
    async getQrCodeParmas(code) {
      const params = {
        pathParams: `/${code}`
      }
      const { data: res } = await this.$mallApi.data.getShareMiniParams(params)
      return res
    },
    timeEnd() {
      //活动开始前倒计时，或者结束后更新接口
      this.getGoodsById()
      this.getButtomImg()
      this.getAppletOnline()

      this.queryGoodsNoDeliveryArea()
    },
    // 根据id获取商品信息
    async getGoodsById() {
      const { memberId } = commonMethod.getUserStatusInfo()
      let params = {
        data: {
          // memberId // 会员id, 查询商品是否被收藏。如果是游客(没有memberId)，不需要传。
        },
        gmId: this.shopStore.shopId, // 商品id
      }
      // get请求中去除值等于null和undefined的属性，不然小程序会直接?memberId=undefined
      Object.keys(params.data).forEach(key => {
        const value = params.data[key]
        const type = Object.prototype.toString.call(value)

        if (['[object Null]', '[object Undefined]'].includes(type)) {
          delete params.data[key]
        }
      })

      let res = await this.$mallApi.shop.getGoodsDetailByGmId(params)

      const { data = {} } = handleDataOfNull(res)
      data.gmDescDetail = data.gmDescDetail?.replace(
        /\<img/g,
        `<img style="width: 100%;height: auto;object-fit: contain;vertical-align: middle;"`
      )
      let supportTemp = data.supportService ? data.supportService.split('|') : []
      let unSupportTemp = data.unSupportService ? data.unSupportService.split('|') : []
      data.supportService = supportTemp.map(item => ({ type: 'support', value: item }))
      data.unSupportService = unSupportTemp.map(item => ({ type: 'unSupport', value: item }))
      data.specList = data.specList
        ? await this.getNoticeOfSpec(data.specList, { gmId: data.gmId, sellerId: data.sellerId })
        : []
      /**
       * dekuvertMethod: 支持的运输方式(1.快递配送，2.商家配送，3.自取)
       * deliveryParam: 快递参数(运输方式为快递配送时才有该值。1.包邮，2.固定运费，3.运费模板，4.外部获取（供应链商品独有）)
       */
      let { specList = [], deliveries = [], supportService = [], unSupportService = [] } = handleDataOfNull(data)
      if (this.hasShareCode.shareCode) {
        this.promotionActivitySpecId(data.specList)
      }
      this.serviceList = [].concat(supportService).concat(unSupportService)
      DeliveryStore.mutations.setDeliveryMethod(deliveries)
      DeliveryStore.mutations.setSelDeliveryId(DeliveryStore.defaultDeliId())
      SpecStore.mutations.setSpecMap(specList)
      SpecStore.mutations.setSelSpecId(SpecStore.defaultSpecId(this.shopStore.shopType, this.linkSpecId))
      SpecStore.mutations.setShopNum(1)
      ShopStore.mutations.setShopInfo(data)
    },

    // 不配送的区域
    async queryGoodsNoDeliveryArea() {
      let params = {
        gmId: this.shopStore.shopId
      }
      let res = await this.$mallApi.shop.queryGoodsNoDeliveryArea(params)
      let deliveryArea = ''
      if (res.data) {
        res.data.forEach(item => {
          deliveryArea += item + '；'
        })
        deliveryArea = deliveryArea.substring(0, deliveryArea.length - 1)
      }
      this.deliveryArea = deliveryArea
    },

    //首次进来时通过链接处理多规格分销商品和分享码
    promotionActivitySpecId(list, id) {
      if (list.length == []) {
        return
      }
      //存入分销id和分销类型提交订单用
      const obj = list.find(item => item.gsId == this.linkSpecId)
      if (this.linkSpecId) {
        this.hasShareCode.promotionType = obj.promotionActivity.promotionTypeNum
        this.hasShareCode.promotionId = obj.promotionActivity.promotionId
      } else {
        this.hasShareCode.promotionType = list[0].promotionActivity.promotionTypeNum
        this.hasShareCode.promotionId = list[0].promotionActivity.promotionId
      }
      //
    },
    //判断当前选中的规格是否分销商品并且有shareCode
    isPromotionActivityHasShareCode() {
      const obj = SpecStore.getMapValues().find(item => item.gsId == this.specStore.selSpecId)
      if (obj.promotionActivity && obj.promotionActivity.promotionTypeNum == 4) {
        //促销活动且分销商品
        this.hasShareCode.promotionType = obj.promotionActivity.promotionTypeNum
        this.hasShareCode.promotionId = obj.promotionActivity.promotionId
        return true
      } else {
        return false
      }
    },
    // 加入购物车
    async joinShopCart() {
      // 未授权登录不允许进入当前页面
      if (!commonMethod.checkAuth()) return
      const { companyId, memberId: userId } = commonMethod.getUserStatusInfo()
      const { gmName, gmId, sellerId, sellerName, gcId, gcIds } = this.shopStore.shopInfo
      const { price: gmPrice, gsId: specId, gsName: specName, image: gmPicture, supplySpecId } = this.getSelSpec
      const params = {
        data: {
          companyId,
          deliveryMode: Number(this.deliveryStore.selDeliveryId),
          gmId,
          gmName,
          gmPrice,
          numbers: this.specStore.shopNum,
          salePrice: this.getDefaultPrice,
          sellerId,
          sellerName,
          specId,
          specName,
          userId,
          gcId,
          gcIds,
          gmPicture: gmPicture || this.shopStore.shopInfo.logo || '',
          invoiceStatus: this.shopStore.shopInfo.invoiceStatus,
          supplySpecId
        }
      }
      const { success = false } = await this.$mallApi.shop.addShopCart(params)
      const message = success ? '成功加入购物车' : '失败加入购物车'

      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })
    },
    linkTo(val) {
      switch (val) {
        case 'shopCart':
          uni.switchTab({ url: '/pages-mall/shopping-cart/shopping-cart' })
          window.location.reload()
          break
        case 'home':
          uni.navigateTo({ url: '/pages-mall-a/shop/detail?shopId=' + this.shopStore.shopInfo.sellerId })
          break
        default:
          break
      }
    },
    /**
     * 立即下单
     * 注意，整个项目只有 shopping-info 商品详情页面和 shopping-cart 购物车页面是下订单的，
     * 如果修改这里的代码，就要相应的也修改另外页面的代码(修改buyNow函数)
     */
    buyNow() {
      // 未授权登录不允许进入当前页面
      if (!commonMethod.checkAuth()) return

      // 只有在团购活动模式下。如果是开团，{ type: 1, headImgs: 只需要自己 }；如果是参团，{ type: 2, headImgs: 需要团里其他用户，和自己 }
      const { groupUser: headImgs } = this.selGroupInfo
      const groupInfoTemp =
        this.getSelSpecType === 'group' && ['joinBuy', 'createBuy'].includes(this.clickSource)
          ? {
              type: this.clickSource === 'createBuy' ? 1 : 2,
              headImgs
            }
          : {}

      // 可查看接口文档：https://ebeitest.wuyeface.com:1188/ebei-gateway/mall-order-service/swagger-ui.html#/APP%E8%AE%A2%E5%8D%95%E6%8E%A5%E5%8F%A3%EF%BC%88APP%E4%BD%BF%E7%94%A8%EF%BC%89/submitOrderUsingPOST
      let params = {
        orderList: this.formatSubmit(),
        groupInfo: groupInfoTemp,
        freightText: this.getSelDelivery.value,
        invoiceStatus: this.shopStore.shopInfo.invoiceStatus // 是否开发票。1：开, 0: 不开
      }
      if (this.hasShareCode.shareCode && this.isPromotionActivityHasShareCode()) {
        params.hasShareCode = this.hasShareCode
      }
      //分享者id不存入缓存改为从链接读取
      if (this.shareId) {
        params.shareId = this.shareId
      }
      // tempSpecType === 'group' && groupOrigin !== 'default' && (params.groupInfo = tempGroupInfo)

      console.log('%c提交订单参数', 'color:#97bdd7', params, this.transformObjToUrl(params))

      this.updateOrderAddress(null)
      this.updateInvoicesInfo(null)
      uni.navigateTo({
        url: `/pages-mall-a/order/pay-order?${this.transformObjToUrl(params)}`
      })
    },
    formatSubmit() {
      const { gsName: spec, gsId: specId, promotionActivity = {}, supplySpecId } = this.getSelSpec
      const {
        sellerName: shopName,
        sellerId: shopId,
        gmId: goodsId,
        logo,
        specList,
        gmName: goodsName
      } = this.shopStore.shopInfo
      const { groupSn } = this.selGroupInfo

      // 如果是普通商品，则不需要值(或需要普通价格)；如果是活动商品且已到活动时间(startState = true)，则需要值(或需要活动价格)，否则不需要值(或需要普通价格)；但是团购活动中的单独购买和从规格购买，则不需要值(或需要普通价格)
      const isAloneBuy = this.getSelSpecType === 'group' && this.clickSource === 'aloneBuy'

      const promotionIdTmp = {
        group: () => {
          return isAloneBuy || this.isStartActive === 'noActive' ? '' : promotionActivity.promotionId
        },
        default: () => '',
        other: () => {
          return this.isStartActive === 'noActive' ? '' : promotionActivity.promotionId
        }
      }
      const promotionId =
        this.getSelSpecType in promotionIdTmp ? promotionIdTmp[this.getSelSpecType]() : promotionIdTmp['other']()
      const promotionType = isAloneBuy || this.isStartActive === 'noActive' ? 0 : SpecStore.transformTextToNum()

      const priceTemp = isAloneBuy || this.isStartActive === 'noActive' ? this.getDefaultPrice : this.getSpecPrice
      const decimalInfo = commonMethod.formatSum({ value: priceTemp, type: 'UpperCamelCase' })

      // 只有在团购活动模式下，参团才需要拼团号
      const isJoinGroup = this.getSelSpecType === 'group' && this.clickSource === 'joinBuy'
      const groupSnTemp = isJoinGroup ? groupSn : ''

      const PENNY = 100 // 将元转为分
      const firstSpec = specList[0] || {}
      const { image } = Array.isArray(specList) ? specList.find(item => item.gsId === specId) || firstSpec : firstSpec // 按选规格取图片
      const orderList = [
        {
          shopName, // 商家名称
          shopId, // 商家id
          promotionId, // 活动id
          promotionType, // 活动类型
          goodsList: [
            {
              goodsId, // 商品id
              img: image, // 商品图片、、下单页面的商品图需要用规格里的图片
              goodsName, // 商品名称
              spec, // 规格名称
              specId, // 规格id
              price: {
                // 规格价格，例如 "18.08"
                int: decimalInfo.int, // String，整数部分
                flt: decimalInfo.flt, // String，小数部分，包括小数点
                value: priceTemp, // Number，int + flt
                price: this.getDefaultPrice * PENNY // 原来价格
              },
              buyNumber: this.specStore.shopNum, // Number，购买数量
              integrals: (promotionActivity?.integral || '') + '', // String，使用积分
              deliveryMethod: Number(this.deliveryStore.selDeliveryId), // 配送方式
              freightText: this.getSelDelivery.value, // 配送方式的文字说明
              supplySpecId // 供应链商品规格ID
            }
          ],
          groupSn: groupSnTemp
        }
      ]

      return orderList
    },
    // 加入/取消收藏
    async addFavorites() {
      // 未授权登录不允许进入当前页面
      console.log(commonMethod.getUserStatusInfo().phoneNumber)
      if (!commonMethod.checkAuth()) return

      if (this.isReqFavorites) return
      this.isReqFavorites = true

      const { companyId, memberId } = commonMethod.getUserStatusInfo()
      const { gmId, gcId, gcIds, lowestPrice } = this.shopStore.shopInfo
      const params = {
        data: {
          favoriteList: [
            {
              companyId, // 公司id
              gcId, // 商品分类id
              gcPath: (gcIds || []).join(','), // String, 商品分类路由，用逗号隔开
              gmId, // 商品id
              memberId, // 用户id
              price: commonMethod.formatSum({ value: lowestPrice }) // number，商品价格
            }
          ]
        },
        hideLoading: true
      }
      const { success } = await this.$mallApi.shop.editorFavorites(params)

      this.isReqFavorites = false

      if (success) {
        ShopStore.mutations.setisFavority(!this.shopStore.isFavority)
      }
    },
    // 团购商品：去参团
    joinGroup(obj) {
      const { memberPhoto: url } = commonMethod.getUserStatusInfo()
      const childArr = obj.child.map(item => ({
        url: item.buyerHeadPortrait,
        captain: item.groupType // 1是团长, 0是参团
      }))
      childArr.push({ url, captain: 0 })

      this.selGroupInfo = {
        groupSn: obj.groupSn,
        // 需要拼团用户的头像，和自己的头像
        groupUser: childArr
      }

      this.openModel('joinBuy')
    },
    // 团购商品：去开团
    openGroup() {
      const { memberPhoto: url } = commonMethod.getUserStatusInfo()
      this.selGroupInfo = {
        groupSn: '',
        // 只需要自己的头像
        groupUser: [{ url, captain: 0 }]
      }
      this.openModel('createBuy')
    },
    // 将对象转换为url地址参数
    transformObjToUrl(obj) {
      const arr = Object.keys(obj).map(key => {
        const value = obj[key]
        const type = Object.prototype.toString.call(value)
        if (['[object Array]', '[object Object]'].includes(type)) {
          return key + '=' + encodeURIComponent(JSON.stringify(value))
        } else {
          return key + '=' + encodeURIComponent(value)
        }
      })
      return arr.join('&')
    },
    openCoupon() {
      this.isShowCoupon = true
    },
    // 点开选择地址弹窗
    openAddress() {
      this.isShowAddress = true
    },
    openModel(val) {
      // { aloneBuy: '单独购买', joinBuy: '我要开团', createBuy: '参团' }
      if (!['spec', 'join', 'buy', 'aloneBuy', 'joinBuy', 'createBuy'].includes(val)) return

      this.clickSource = val
      this.isShowModel = true
    },
    // 节点的显示隐藏，代替v-show
    vShow(flag = true) {
      return { display: flag ? undefined : 'none' }
    },
    // 获取价格说明的展示图
    async getButtomImg() {
      const params = {
        pathParams: '/GoodsRuleExplain'
      }
      const { data: res } = await this.$mallApi.data.getConfigByCode(params)
      this.bottomImg = res ? res.configDesc : ''
    },
    // 跳转至分享海报页面
    toSharePoster() {
      let { lowestPrice, gmDescDetail, ...shopInfo } = this.shopStore.shopInfo
      const { price, marketPrice, gsId } = this.getSelSpec
      let specInfo = {
        // price: this.getSpecPrice,
        price: lowestPrice,
        oldPrice: this.getSelSpecType === 'default' ? marketPrice : price,
        specId: gsId //增加规格id带过去
      }

      let queryObj = this.transformObjToUrl({ source: 'goods', shopInfo, specObj: specInfo })
      // 浏览器会报错：URI malformed，是因为地址栏带有 % ，需要替换成 %25
      if (queryObj.indexOf('%') > -1) queryObj = queryObj.replace(/%/g, '%25')

      uni.navigateTo({ url: `/pages-mall-b/share-poster/share-poster?${queryObj}` })
    },
    serviceClick() {
      this.isShowService = true
    },
    /**
     * 查询每个规格，是否设置过降价通知
     * @param {array} specList 规格列表
     * @param {object} otherParam { gmId: 商品id, sellerId: 店铺id }
     */
    getNoticeOfSpec(specList = [], otherParam = { gmId, sellerId }) {
      const req = gsId => {
        const params = {
          data: { gmId: otherParam.gmId, sellerId: otherParam.sellerId, gsId },
          hideLoading: true
        }
        return this.$mallApi.shop.getNoticetype(params).then(res => res.data)
      }

      const args = specList.map(item => {
        const isActivity = item.promotionActivity
        return isActivity ? Promise.resolve(true) : req(item.gsId)
      })
      return Promise.all(args).then(isNotice => {
        let res = specList.map(item => ({
          ...item,
          isShowNotice: !isNotice
        }))

        return res
      })
    },
    onGetCouponList(couponList) {
      this.validCouponOf2 = couponList.slice(0, 2)
    },
    // 查库存
    async getAddrStock() {
      console.log('addressData', this.addressData)

      const { inputAddress, consignee, receivingTelephone, provinceName, cityName, countyName, streetName } =
        this.addressData || {}
      const { gmName, gmId, sellerId, sellerName, gcId, gcIds } = this.shopStore.shopInfo
      const { gsId, gsName, supplySpecId } = this.getSelSpec
      console.log('this.getSelSpec', this.getSelSpec)
      const prodObj = {
        deliveryMethod: Number(this.deliveryStore.selDeliveryId),
        gmId,
        gmName,
        gsId,
        gsName,
        number: this.specStore.shopNum,
        sellerId,
        supplySpecId
      }

      let params = {
        data: {
          address: {
            consignee,
            description: inputAddress,
            phone: receivingTelephone,
            province: provinceName,
            city: cityName,
            area: countyName,
            street: streetName
          },
          spuList: [prodObj]
        },
        hideLoading: true,
        responseToast: false
      }
      // console.log('params', params)
      SpecStore.mutations.setShopNum(1)
      let res = await this.$mallApi.data.getExpressFee(params)
      console.log('res', res)
      if (res.statusCode == 200) {
        SpecStore.mutations.setIsStock(true)
        return true
      } else {
        SpecStore.mutations.setIsStock(false)
        this.toastTips({ message: res.message })
        return false
      }
    },
    // toast提示
    toastTips(params) {
      const { message, position, duration } = params
      const toastRef = this.$refs['elMessage']
      if (toastRef) {
        toastRef.open({
          message,
          position: position || 'middle',
          duration: duration || 2000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel-panel {
  width: 100%;
  height: 750rpx;

  .carousel-image {
    width: 100%;
    height: 100%;
  }
}

.hor-separat {
  border-bottom: 8rpx solid #f7f7f7;
}
.header-separat::v-deep .header-title,
.comment-separat::v-deep .shop-comment {
  border-bottom: 8rpx solid #f7f7f7;
}

.flex-form-panel {
  padding: 20rpx 24rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > .flex-form-title {
    flex-shrink: 0;
    width: 164rpx;
    font-weight: bold;
    font-size: 26rpx;
    color: $uni-text-color;
  }
  .flex-form-list {
    flex: 1;
    display: flex;

    &.single-line {
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }
    &.multi-line {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
    & > button:not(:last-child),
    & > view:not(:last-child) {
      margin-right: 16rpx;
    }
  }
  .coupon-tag {
    display: inline-block;
    font-size: 20rpx;
    border-radius: 4rpx;
    border: 1px solid $uni-color-assist;
    color: $uni-color-assist;
    line-height: 28rpx;
    height: 26rpx;
    padding: 8rpx 4rpx;
    text-align: center;
  }
  .delivery-text {
    display: block;
    font-size: 26rpx;
    color: $uni-text-color;
  }
  .addr-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 260px;
  }
  .model-tag {
    padding: 0 18rpx;
    margin: 0;
    background-color: $uni-bg-color-grey;
    color: $uni-text-color;
    line-height: 2;
    text-align: left;

    &.is-active {
      box-sizing: border-box;
      border: 1px solid $uni-color-main;
      color: $uni-color-main;
      background-color: rgba($uni-color-main, 0.05);
    }
    &::after{
      border: none !important;
    }
  }
}
.panel-pad {
  padding: 20rpx 24rpx;
}
.detail-panel {
  width: 100%;
  background-color: #fff;
  border-bottom: 8px solid #f7f7f7;

  & > .detail-title {
    display: block;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    color: $uni-text-color;
    line-height: 80rpx;
    text-align: center;
  }
  & > image {
    width: 100%;
  }
}
.placeholder {
  width: 100%;
  height: 110rpx;
}
.shop-cart-panel {
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  right: 0rpx;
  height: 110rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;

  & > .clean-block {
    @include flx-dsp(flex-end, center, row);
  }
  & > .newChange-clean-block {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 232rpx;
  }
  ::v-deep .icon-around {
    margin-left: 30rpx;
  }
  .shop-btn {
    display: inline-block;
    width: 220rpx;
    height: 72rpx;
    border-radius: 36rpx;
    padding: 0px;
    font-size: 28rpx;
    color: #fff;
    background-color: $uni-color-primary;
    margin-right: 24rpx;

    &.shop-btn-other {
      background-color: $uni-color-main;

      &.fill-width {
        flex: 1;
      }
    }
    &[disabled='true'],
    &[aria-disabled='true'] {
      background-color: #ddd;
      color: #333;
    }
    ::v-deep .footer-price {
      color: #fff;
    }
  }
}
.flex-v {
  @include flx-dsp(center, center, column);
  width: 100%;
  height: 100%;
  font-size: 22rpx;
  line-height: 1.2;
}

.share-box {
  position: absolute;
  top: 25rpx;
  right: 45rpx;

  image {
    width: 50rpx;
    height: 50rpx;
  }
}
</style>
