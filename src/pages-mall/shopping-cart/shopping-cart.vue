<template>
  <view class="box">
    <view class="page-bg-color"></view>
    <view class="page-top-btn">
      <text>共 {{ getShopCount }} 件商品</text>
      <view class="address_text" @click="openAddress">
        <image class="address-icon" src="/pages-mall/static/address_icon.png" />
        配送至：{{addressData.consigneeAddress?addressData.consigneeAddress:''}}{{addressData.inputAddress?addressData.inputAddress:''}}
      </view>
      <text @click="cartStatusChange">{{ isEditor ? '完成' : '管理' }}</text>
    </view>
    <!-- 购物车列表 -->
    <view class="page-cart-panel" v-if="shopCardList.length">
      <cart-card-swiper v-for="(seller, index) in shopCardList" :key="index" :sellerName="seller.sellerName">
        <!-- 可以全选店铺下的所有商品购物车 -->
        <cl-checkbox
          v-if="isEditor"
          slot="prefix"
          round
          :ref="'elSellerCart'"
          v-model="seller.isSelected"
          :label="seller.sellerId"
          @change="sellerCartChange($event, seller)"
        ></cl-checkbox>
        <cl-checkbox
          v-else
          slot="prefix"
          round
          :ref="'elSellerCart'"
          v-model="seller.isSelected"
          :label="seller.sellerId"
          :disabled="seller.isVaild"
          @change="sellerCartChange($event, seller)"
        ></cl-checkbox>
        <!-- 商品购物车 -->
        <cart-card-item
          v-for="(shop, jndex) in seller.cartList"
          :key="jndex"
          :src="shop.gmPicture"
          :name="shop.gmName"
          :specification="shop.specName"
          :price="shop.gmPrice"
          :invalidDesc="shop.invalidDesc"
          :valid="shop.valid"
          v-model="shop.numbers"
          @numberChange="numChangeThrot(shop, seller)"
          @click="linkTo(shop.gmId)"
        >
          <!-- 可以选择单个商品购物车 -->
          <view slot="prefix" class="item-checkbox" @click.stop>
            <!-- 完成 -->
            <cl-checkbox
              v-if="isEditor"
              v-model="shop.isSelected"
              :label="shop.gmId"
              round
              @change="shopCartChange($event, shop, seller)"
            ></cl-checkbox>
            <!-- 管理 -->
            <cl-checkbox
              v-else
              v-model="shop.isSelected"
              :label="shop.gmId"
              :disabled="shop.valid?false:true"
              round
              @change="shopCartChange($event, shop, seller)"
            ></cl-checkbox>
          </view>
        </cart-card-item>
      </cart-card-swiper>
    </view>
    <!-- 空数据 -->
    <view class="page-cart-panel" v-else>
      <view class="list-scroll">
        <image class="list-none" src="/pages-mall/static/shop_cart_none_icon.png" mode="widthFix" />
        <text class="list-none-text">抱歉~没找到商品</text>
      </view>
    </view>
    <view class="placeholder" :class="isLcreen?'isLcreen-placeholder':''"></view>
    <!-- 购物车不可编辑的底部栏-->
    <view class="page-bottom-btn flex-spacebetween" :class="isLcreen?'isLcreen':''" v-if="!isEditor">
      <!-- 可以全选所有店铺的商品购物车 -->
      <cl-checkbox v-model="allCheckbox" label="1" round @change="allCartChange" :disabled="isEmptyOfList">全选</cl-checkbox>
      <view class="page-bottom-right">
        <text>总计：</text>
        <cl-text class="page-bottom-price" type="price" size="30rpx" :value="sumPrice" color="primary" />
        <cl-button
          class="page-bottom-account"
          size="mini"
          type="error"
          :disabled="isEmptyOfList || !getSelStatus"
          @click="buyNow"
        >去结算</cl-button>
      </view>
    </view>
    <!-- 购物车可编辑的底部栏 -->
    <view class="page-bottom-btn space-between" :class="isLcreen?'isLcreen':''" v-else>
      <cl-checkbox v-model="allCheckbox" label="1" round @change="allCartChange" :disabled="isEmptyOfList">全选</cl-checkbox>
      <view>
        <cl-button class="page-bottom-account" size="mini" type="text" plain @click="addAndDelFavorites">移入收藏夹</cl-button>
        <cl-button class="page-bottom-account" size="mini" type="error" plain @click="deleteShopCart">删除</cl-button>
      </view>
    </view>

    <!-- 弹窗-选择地址 -->
    <address-popup :visible.sync="isShowAddress" :addressData.sync="addressData" @getAddrStock="getAddrStock"></address-popup>

    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>

    <!-- 底部导航栏 -->
    <m-tabbar :value="2"></m-tabbar>
  </view>
</template>

<script>
import CartCardItem from '@/components/cart-card-item/cart-card-item.vue'
import CartCardSwiper from './module/cart-card-swiper.vue'
import commonMethod from '@/js/commonMethod'
import AddressPopup from './module/address-popup.vue'
import { createLogger, mapMutations } from 'vuex'
import { miniInit } from '@/js/miniStore'
import * as DeliveryStore from '@/pages-mall-a/shopping-info/module/deliveryStore'
import ThrottleNum from './module/throttleNum'
import mTabbar from '@/pages-mall/components/m-tabbar.vue'
let timeFlag = undefined

/**
 * 只有普通商品才能被加入购物车
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CartCardSwiper,
    CartCardItem,
    AddressPopup,
    mTabbar
  },
  data() {
    return {
      isEditor: false, // (false: 不可删除购物车状态，只能结算, ture: 可删除购物车状态，不可结算)
      allCheckbox: '', // 底部全选
      shopCardList: [], // 购物车列表数据, [{ sellerId, cartList: [{ gmId }] }]
      sumPrice: 0, // 总价格
      selShopList: [], // 从shopCardList中筛选出被选中的子项
      deliveryStore: DeliveryStore.state(),
      isLcreen: false,
      isShowAddress: false,
      addressData: {},
      isLoad: false
    }
  },
  computed: {
    getSelDelivery: DeliveryStore.getters.getSelDelivery,
    getShopCount() {
      return this.shopCardList.reduce((sum, item) => {
        sum += item.cartList.length
        return sum
      }, 0)
    },
    // 购物车列表是否为空
    isEmptyOfList() {
      return !this.shopCardList.length
    },
    // 获取是否有商品被选中
    getSelStatus() {
      console.log('this.selShopList.length====',this.selShopList.length)
      return this.selShopList.length
    }
  },
  onLoad() {
    if (!this.checkAuth()) return

    this.refresh()
  },
  onReady() {
    this.compatibleIos()
  },
  onShow() {
    if (!this.isLoad) {
      if (!this.checkAuth()) return
      this.allCheckbox = ''
      this.refresh() 
      this.sumPrice = 0
      this.selShopList = []
      this.isEditor = false
      this.compatibleIos()
    }else {
      this.isLoad = false
      this.compatibleIos()
    }
  },
  onPageScroll(e) {
    // console.log(e.scrollTop)
    if (e.scrollTop >= 300) {
      this.compatibleIos()
    } else {
      
    }
  },
  // 下拉刷新
  async onPullDownRefresh() {
    if (!this.checkAuth()) return

    await this.refresh()
    this.sumPrice = 0
    this.selShopList = []
    this.isEditor = false
    this.allCheckbox = ''
  },
  beforeCreate() {
    miniInit('deliveryStore')
  },
  methods: {
    ...mapMutations({
      updateOrderAddress: 'mall/updateOrderAddress'
    }),
    // 获取购物车列表
    async getShopCartList() {
      const { memberId } = commonMethod.getUserStatusInfo()
      const params = {
        pathParams: `/${memberId}`, // userId
        hideLoading: true,
        responseToast: false
      }
      let { data = [] } = await this.$mallApi.shop.getShopCartList(params)
      data = data || []


      let shopCardList = this.transformDataToSellerGroup(data)
      //二次处理   
      this.shopCardList = shopCardList.map(item=>{
        if (item.cartList.length>0) {
          let isVaild = 0
          item.cartList.forEach((childItem)=>{
              if (!childItem.valid) {
                isVaild++
              }
          })
          if (item.cartList.length == isVaild) {
            item.isVaild = true
          }else {
            item.isVaild = false
          }
        }
        return item
      })
    },
    transformDataToSellerGroup(data = []) {
      // TODO 缺少接口返回的参数，就自己在这里添加上去
      const temp = data.reduce((store, item) => {
        if (!store.has(item.sellerId)) {
          store.set(item.sellerId, {
            companyId: item.companyId,
            userId: item.userId, // 用户id
            sellerId: item.sellerId, // 店铺id
            sellerName: item.sellerName, // 店铺名称
            isSelected: false, // checkbox是否被选中
            cartList: [],
            deliveryPrice: item.deliveryMode, // 快递费用
            invoiceStatus: item.invoiceStatus // 是否开发票，1: 开, 0: 不开
          })
        }
        store.get(item.sellerId).cartList.push({
          gmId: item.gmId, // 商品id
          gmName: item.gmName, // 商品名称
          gmPicture: item.gmPicture, // 商品图片
          numbers: item.numbers, // 商品数量
          specId: item.specId, // 规格id
          specName: item.specName, // 规格名称
          gmPrice: commonMethod.precision.divide(item.gmPrice, 100), // 商品价格，需要将单位分转换为单位元
          deliveryMethod: item.deliveryMode, // 配送方式
          isSelected: false, // checkbox是否被选中
          id: item.id, // 购物车id
          gcId: item.gcId, // 分类id
          // gcIdList: item.gcIdList, // 分类路由
          supplySpecId: item.supplySpecId,
          valid: item.valid,
          invalidDesc: item.invalidDesc
        })
        return store
      }, new Map())

      return [...temp.values()]
    },
    async refresh() {
      await this.getShopCartList()
      uni.stopPullDownRefresh()

      // 重置底部全选按钮和管理状态
      // this.allCheckbox = ''
      // this.sumPrice = 0
      // this.selShopList = []
    },
    sellerCartChange(isSelected, item) {
      // 管理操作下  全部都可以勾选（删除，移入收藏夹）     正常情况下   除了商品异常不能被选中  其他则都正常选中
      if (this.isEditor) {
        item.cartList = item.cartList.map(shop => ({
          ...shop,
          isSelected
        }))
      } else {
        item.cartList = item.cartList.map(shop => {
          if (shop.valid) {
            shop.isSelected = isSelected
          }
          return shop
        })
      }

      this.allCheckbox = this.allCheckboxStatus(this.shopCardList)

      this.selShopList = this.selectedShopCart()

      this.getSumPrice()
    },
    shopCartChange(isSelected, item, seller) {
      seller.isSelected = this.allCheckboxStatus(seller.cartList)
      this.allCheckbox = this.allCheckboxStatus(this.shopCardList)

      this.selShopList = this.selectedShopCart()

      this.getSumPrice()
    },
    allCartChange(isSelected) {
      // 管理操作下  全部都可以勾选（删除，移入收藏夹）     正常情况下   除了商品异常不能被选中  其他则都正常选中
      if (this.isEditor) {
        this.shopCardList = this.shopCardList.map(seller => {
          seller.cartList = seller.cartList.map(shop => ({
            ...shop,
            isSelected
          }))

          return {
            ...seller,
            isSelected
          }
        })
      } else {
        this.shopCardList = this.shopCardList.map(seller => {
          if (seller.isVaild&&isSelected) {
            isSelected = !isSelected
          }
          seller.cartList = seller.cartList.map(shop => {
            if (shop.valid) {
              shop.isSelected = isSelected
            }
            return shop
          })

          return {
            ...seller,
            isSelected
          }
        })
      }
      this.allCheckbox = this.allCheckboxStatus(this.shopCardList)
      this.selShopList = this.selectedShopCart()

      this.getSumPrice()
    },
    // 获取被选中的商品购物车的总价格
    getSumPrice() {
      let sum = this.shopCardList.reduce((sum, seller) => {
        sum += seller.cartList.reduce((count, shop) => {
          if (shop.isSelected) {
            count += shop.gmPrice * shop.numbers
          }

          return count
        }, 0)

        return sum
      }, 0)

      this.sumPrice = sum
    },
    // (true: 全选被勾选, false: 全选被取消勾选) 检查如果子项被选中了，则需要勾选全选
    allCheckboxStatus(arr) {
      const isUnChecked = arr.some(item => {
        let isSelected = item.isSelected
        if (item.isVaild) {
          isSelected = true
        }
        return !isSelected
      })
      return !isUnChecked
    },
    cartStatusChange() {
      this.isEditor = this.isEmptyOfList ? false : !this.isEditor
    },
    // 加入收藏夹
    async addAndDelFavorites() {
      const { memberId, companyId } = commonMethod.getUserStatusInfo()

      const favoriteList = this.shopCardList.reduce((params, cart) => {
        const temp = cart.cartList.reduce((temp, shop) => {
          if (shop.isSelected) {
            temp.push({
              companyId,
              memberId, // 会员id
              gcId: shop.gcId, // 商品分类id
              // gcPath: shop.gcIdList.join(','), // 商品分类路由，用逗号隔开
              gmId: shop.gmId, // 商品分类id
              price: shop.gmPrice, // Number, 商品价格
              state: 1, // 收藏状态（0.删除、1.正常）
              shoppingCarToFavorites: true // 表示在购物车页面将商品加入收藏夹，就需要传它，值固定为true
            })
          }

          return temp
        }, [])

        return params.concat(temp)
      }, [])

      if (favoriteList.length === 0) {
        this.$refs.elMessage.open({ message: '请选择商品哦', position: 'middle' })
        return
      }

      const params = {
        data: {
          favoriteList
        },
        hideLoading: true
      }
      const { success } = await this.$mallApi.shop.editorFavorites(params)
      const message = success ? '收藏成功' : '收藏失败'

      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })

      if (success) {
        // 加入收藏夹的购物车，需要将它从购物车中删除
        this.deleteShopCart({ showTip: false })
      }
    },
    // 删除购物车
    async deleteShopCart({ showTip = true }) {
      const { memberId } = commonMethod.getUserStatusInfo()

      const ids = this.shopCardList.reduce((res, cart) => {
        const temp = cart.cartList.reduce((temp, shop) => {
          if (shop.isSelected) {
            temp.push(shop.id)
          }
          return temp
        }, [])

        return res.concat(temp)
      }, [])

      const params = {
        data: {
          ids,
          userId: memberId
        },
        hideLoading: true
      }
      if (params.data.ids.length == 0) {
        this.$refs.elMessage.open({ message: '请选择商品哦', position: 'middle' })
        return
      }
      const { success } = await this.$mallApi.shop.delShopCart(params)

      if (showTip) {
        const message = success ? '购物车删除成功' : '购物车删除失败'

        this.$refs.elMessage.open({
          message,
          position: 'middle'
        })
      }

      // 刷新列表
      await this.refresh()
      this.selShopList = this.selectedShopCart()
      this.getSumPrice()
    },
    // 立即购买，进入确认订单页面
    buyNow() {
      // const isMultiple = this.checkSeller()
      // if (isMultiple) {
      //   this.$refs.elMessage.open({
      //     message: '只能选择同一店铺下的商品',
      //     position: 'middle'
      //   })
      //   return
      // }
      // const isSame = this.checkDelivery()
      // if (!isSame) {
      //   this.$refs.elMessage.open({
      //     message: '只能选择相同配送方式的商品',
      //     position: 'middle'
      //   })
      //   return
      // }

      const orderList = this.selShopList.reduce((pre, seller) => {
        const goodsList = seller.cartList.reduce((obj, shop) => {
          const {
            gmId: goodsId,
            gmPicture: img,
            gmName: goodsName,
            specName: spec,
            specId: specId,
            numbers: buyNumber,
            gmPrice,
            deliveryMethod,
            supplySpecId
          } = shop
          const decimalInfo = commonMethod.formatSum({ value: gmPrice, type: 'UpperCamelCase' })
          const decimalValue = commonMethod.formatSum({ value: gmPrice })

          const PENNY = 100 // 将元转换为分

          obj.push({
            goodsId, // 商品id
            img, // 商品图片
            goodsName, // 商品名称
            spec, // 规格名称
            specId, // 规格id
            price: {
              // 规格价格，例如 "18.08"
              int: decimalInfo.int, // String，整数部分
              flt: decimalInfo.flt, // String，小数部分，包括小数点
              value: decimalValue, // Number，int + flt
              price: decimalValue * PENNY // 原来价格
            },
            buyNumber, // Number，购买数量
            integrals: '', // String，使用积分
            deliveryMethod: deliveryMethod, // 配送方式
            freightText: DeliveryStore.getTextByDeliMethod(deliveryMethod), // 配送方式的文字说明
            supplySpecId
          })
          return obj
        }, [])

        const { sellerName: shopName, sellerId: shopId } = seller
        pre.push({
          shopName, // 店铺名称
          shopId, // 店铺id
          promotionId: '', // 促销id
          promotionType: '0', // String，促销类型，(0未参与(普通商品), 1团购, 2秒杀, 3积分, 4分销)
          goodsList
        })
        return pre
      }, [])

      // 只要有一个商品是支持开发票的，那说明就可以开发票
      const isInvoice = this.selShopList.some(seller => seller.invoiceStatus)

      // 未选择的不能结算
      if (!orderList.length) return

      const deliveryValue = this.selShopList[0].cartList[0]
      DeliveryStore.mutations.setDeliveryMethod([deliveryValue])
      DeliveryStore.mutations.setSelDeliveryId(deliveryValue.deliveryMethod)

      let params = {
        orderList,
        freightText: this.getSelDelivery.value,
        invoiceStatus: isInvoice ? 1 : 0 // 是否开发票。1：开, 0: 不开
      }
      console.log('%c提交订单参数', 'color:#97bdd7', params, this.transformObjToUrl(params))

      this.updateOrderAddress(null)
      uni.navigateTo({
        url: `/pages-mall-a/order/pay-order?${this.transformObjToUrl(params)}`
      })
      this.isLoad = true
      this.isLcreen = false
    },
    // 获取购物车被选择项
    selectedShopCart() {
      const res = this.shopCardList.reduce((pre, seller) => {
        const temp = seller.cartList.filter(shop => shop.isSelected)

        if (!temp.length) return pre

        pre.push({
          ...seller,
          cartList: temp
        })
        return pre
      }, [])
      return res
    },
    // 结算时候，只能选择同一配送方式的商品，true相同，false不相同
    checkDelivery() {
      const res = this.selShopList

      // 检查配送方式是否一致
      let isSame = false
      const isNotSame = res.some(seller => {
        const isNotSame = seller.cartList.some(shop => {
          if (isSame === false) {
            isSame = shop.deliveryMethod
            return false
          } else {
            return shop.deliveryMethod !== isSame
          }
        })
        return isNotSame
      })

      return !isNotSame
    },
    // 结算时候,也只能选择同一店铺下的商品
    checkSeller() {
      const res = this.selShopList

      let isMultiple = res.length > 1
      return isMultiple
    },
    // 未授权登录不允许进入当前页面
    checkAuth() {
      const userInfo = commonMethod.getUserStatusInfo()
      const isExist = !!Object.keys(userInfo).length

      const fn = () => {
        clearTimeout(timeFlag)
        timeFlag = setTimeout(() => {
          if (!isExist && !this.$refs.elMessage) {
            fn()
            return
          }
          this.$refs.elMessage.open({
            message: '需要授权才能继续操作',
            position: 'middle'
          })
        }, 50)
      }
      if (!isExist) {
        fn()
      }

      return isExist
    },
    // 跳转到商品详情页面
    linkTo(shopId) {
      uni.navigateTo({ url: '/pages-mall-a/shopping-info/shopping-info?shopId=' + shopId })
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
    // 购物车商品数量改变时，触发保存商品数量
    numChangeThrot: ThrottleNum(async function(shop, seller) {
      const { companyId, memberId: userId } = commonMethod.getUserStatusInfo()
      const { id: shoppingCartId, specId, numbers } = shop
      const params = {
        data: {
          numbers,
          shoppingCartId,
          specId
        }
      }

      const { success } = await this.$mallApi.shop.editShopNum(params)

      this.getSumPrice()
    }, 800),
    // ios且刘海
    compatibleIos() {
      // #ifdef H5
      const self = this
      uni.getSystemInfo({
        success: function(res) {
          if (res.model == 'iPhone' && res.windowBottom == 84) {
            self.isLcreen = true
          }
        }
      })
      // #endif
    },
    // 点开选择地址弹窗
    openAddress() {
      this.isShowAddress = true
      uni.hideTabBar()
    },
    getAddrStock() {
      // console.log('11111')
    }
  },
  watch: {
    isShowAddress: {
      handler(newName, oldName) {
        if (newName == false) uni.showTabBar()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  background-color: #f7f7f7;
  z-index: 0;
  min-height: 100vh;

  @include flx-dsp(flex-start, flex-start, column);
}
.page-bg-color {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  right: 0rpx;
  z-index: 1;
  height: 294rpx;
  background-image: linear-gradient(90deg, $uni-color-main, $uni-color-assist);
}
.page-top-btn {
  width: 100%;
  height: 88rpx;
  box-sizing: border-box;
  @include flx-size('keep');
  @include flx-dsp(space-between, center, row);
  font-size: 26rpx;
  color: #fff;
  padding: 0rpx 40rpx;
  position: relative;
  z-index: 2;
  .address_text {
    width: 460rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    font-weight: 700;
    .address-icon {
      width: 18rpx;
      height: 28rpx;
      vertical-align: top;
      margin-right: 8rpx;
    }
  }
}
.page-cart-panel {
  @include flx-size('stretch');
  @include flx-dsp(flex-start, center, column);
  width: 100%;
  min-height: 400rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

// cart-card-swiper和cart-card-item
$swiper-margin: 28rpx;
::v-deep .cart-card-swiper {
  margin-bottom: $swiper-margin;
}
::v-deep cart-card-swiper {
  width: 100%;
}
$item-margin: 48rpx;
::v-deep cart-card-swiper cart-card-item:not(:last-child) .cart-card-item {
  margin-bottom: $item-margin;
}
::v-deep .cart-card-swiper .cart-card-item:not(:last-child) {
  margin-bottom: $item-margin;
}

// checkbox
.item-checkbox {
  height: 180rpx;
  line-height: 160rpx;
}
::v-deep .cl-checkbox.is-checked .cl-checkbox__input {
  @mixin checkbox {
    background-color: $uni-color-assist;
    border-color: $uni-color-assist;
  }

  @include checkbox;
  cl-checkbox & {
    @include checkbox;
  }
}

.list-scroll {
  width: 100%;
  @include flx-size('stretch');
  @include flx-dsp(flex-start, center, column);
  flex-wrap: wrap;
  background-color: #fff;
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;

  .list-none {
    display: block;
    width: 640rpx;
    margin: 0 auto;
    padding-top: 300rpx;
  }
  .list-none-text {
    display: block;
    width: 100%;
    font-size: 28rpx;
    color: #888;
    text-align: center;
  }
}

$footer-height: 96rpx;
.placeholder {
  width: 100%;
  height: $footer-height * 2;
}
.page-bottom-btn {
  width: 100%;
  height: $footer-height;
  padding-left: 44rpx;
  padding-right: 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 5;

  /* #ifdef H5 */
  position: fixed;
  bottom: 92rpx;
  /* #endif */

  /* #ifdef MP-WEIXIN */
  position: fixed;
  bottom: 0rpx;
  /* #endif */

  &.flex-spacebetween {
    @include flx-dsp(space-between, center, row);
  }
  &.flex-end {
    @include flx-dsp(flex-end, center, row);
  }
  &.space-between {
    @include flx-dsp(space-between, center, row);
  }
  .page-bottom-right {
    font-size: 26rpx;
    @include flx-dsp(flex-start, center, row);
    /* padding-right: 64rpx; */
  }
  .page-bottom-account {
    &.cl-button.cl-button--mini,
    &::v-deep .cl-button.cl-button--mini {
      padding: 0 40rpx;
      height: 64rpx;
      margin-left: 20rpx;
    }
    &.cl-button--error:not(.is-plain),
    &::v-deep .cl-button--error:not(.is-plain) {
      background-color: $uni-color-assist;
      border-color: $uni-color-assist;
    }
    &::v-deep.cl-button--text.is-plain,
    &::v-deep .cl-button--text.is-plain {
      .cl-button__text {
        color: #666;
      }
    }
  }
}
.isLcreen {
  /* #ifdef H5 */
  /* bottom: 152rpx; */
  bottom: calc(90rpx + env(safe-area-inset-bottom));
  /* #endif */
}
.safe-padding {
  /* padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box; */
}

.isLcreen-placeholder {
  height: 280rpx;
}
::v-deep .cl-text.is-price {
  color: $uni-color-assist;
}
::v-deep .box .cl-popup__container {
  z-index: 99999999;
}
</style>