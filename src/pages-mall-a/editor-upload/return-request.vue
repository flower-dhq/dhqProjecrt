<template>
  <view class="page-box">
    <view class="card-panel" v-for="(item, index) in cartList" :key="index">
      <view class="card-row">
        <cl-checkbox
          v-if="isMultiple"
          round
          v-model="item.select"
          :label="item.orderGoodsId"
          :disabled="item.disable"
          @change="setSelCheckbox(item.orderGoodsId, $event)"
        />
        <cart-card-item
          :name="item.goodsName"
          :specification="item.goodsSpec"
          :src="item.goodsImageUrl"
          :price="item.salePriceStr"
          :value="item.numbers"
          type="textNumber"
        />
      </view>
    </view>

    <view class="editor-panel">
      <template v-if="packagingVisible">
        <view class="editor-panel-title pd30 require-star require-star-tl"><text>商品包装情况：</text></view>
        <cl-select class="mgt" v-model="packaging" :options="packagingList" placeholder="请选择" style="padding: 0 30rpx 0;"></cl-select>
      </template>

      <view class="editor-panel-title require-star" :class="{'pd30': !packagingVisible, 'require-star-tl': !packagingVisible}"><text>售后类型：</text></view>
      <cl-select class="mgt" v-model="typeValue" :options="typeList" placeholder="请选择" style="padding: 0 30rpx 0;"></cl-select>

      <template v-if="returnReasonVisible">
        <view class="editor-panel-title require-star"><text>售后原因：</text></view>
        <cl-select class="mgt" v-model="reasonValue" :options="reasonList" placeholder="请选择" style="padding: 0 30rpx 0;"></cl-select>
      </template>

      <template v-if="['50', '40'].includes(typeValue)">
        <view class="editor-panel-title"><text>退款金额：</text></view>
        <view class="head-title mgt"><text>&yen; {{returnMoney}}</text></view>
      </template>

      <template v-if="backWayVisible">
        <view class="editor-panel-title require-star"><text>返件方式：</text></view>
        <cl-select class="mgt" v-model="backWay" :options="backWayList" placeholder="请选择" style="padding: 0 30rpx 0;"></cl-select>
      </template>
      
      <template v-if="returnWayVisible">
        <view class="editor-panel-title require-star"><text>退货方式：</text></view>
        <cl-select class="mgt" v-model="returnWay" :options="returnWayList" placeholder="请选择" style="padding: 0 30rpx 0;"></cl-select>
      </template>

      <view class="editor-panel-title require-star"><text>补充描述和凭证：</text></view>
      <textarea v-model="content" placeholder="补充描述，有助于商家更好处理售后问题" placeholder-style="color: #DCDCDC" maxlength="150"></textarea>
      
      <view class="image-panel">
        <upload-image v-model="imgList" :limit="5" multiple />
      </view>
    </view>
    <view class="placeholder"></view>
    <cl-button @click="uploadSingleFile" fill round type="primary" :disabled="disableBtn">提交</cl-button>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import CartCardItem from '@/components/cart-card-item/cart-card-item.vue'
import UploadImage from '@/pages-mall-a/components/upload-image/upload-image.vue'
import commonMethod from '@/js/commonMethod'

/**
 * 提交售后申请
 * 如果是从pagesA/order/list商品订单页面进入的退货申请，则地址不传goodsId，则需要多选商品进行退货(此时有可能是多个商品一起提交退货)
 * 如果是从pagesA/order/order-detail订单详情页面进入的退货申请，则地址传goodsId，表示订单下(一个订单存在多个商品)只有这个商品需要提交退货。(此时只有一个商品提交退货)
 * 地址传参，?orderId=(订单id)&goodsSpecId=(商品规格id)
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CartCardItem,
    UploadImage
  },
  data() {
    return {
      orderId: '', // 订单id
      shopId: '', // 商品id
      cartList: [], // 购物车列表数据
      content: '', // 评价内容
      imgList: [], // 上传图片文件列表数据
      typeValue: '', /// 退货类型
      // 退货类型列表
      typeList: [
        // { label: '我要退货退款', value: '50' },
        // { label: '我要换货', value: '20' },
        // { label: '仅退款(无需退货)', value: '40' },
      ],
      reasonValue: '', // 退货原因
      // 退货原因列表
      reasonList: [
        // { label: '后悔了，不要了', value: '1' },
        // { label: '商家说不接待团购', value: '2' },
        // { label: '商家说可以现金/刷卡付款来享受团购', value: '3' },
        // { label: '买多了，买错了', value: '4' },
        // { label: '其他原因', value: '5' }
      ],
      selCheckbox: [],
      // 包装情况
      packaging: '',
      packagingList: [],
      // 退货方式
      returnWay: '',
      returnWayList: [],
      returnMoney: '',
      // 返件方式
      backWay: '',
      backWayList: [],
    }
  },
  computed: {
    // 是否多选商品
    isMultiple() {
      return !this.shopId
    },
    disableBtn() {
      return this.selCheckbox.length === 0
    },
    returnWayVisible() {
      return this.returnWayList.length
    },
    backWayVisible() {
      return ['20'].includes(this.typeValue) && this.backWayList.length
    },
    requireImage() {
      return !!this.reasonList.find(item => item.value === this.reasonValue && item.needVoucher)
    },
    packagingVisible() {
      return !!this.packagingList.length
    },
    returnReasonVisible() {
      return !!this.reasonList.length
    }
  },
  onLoad(option) {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    const { orderId, goodsSpecId, undeliver } = commonMethod.getRouteParams(option, 'orderId', 'goodsSpecId', 'undeliver')

    this.orderId = orderId || ''
    this.shopId = goodsSpecId || ''

    // this.getAfterSaleReason()
    this.getOrderInfo(this.orderId)

  },
  methods: {
    // 根据订单获取订单详情
    async getOrderInfo(orderId) {
      let { data } = await this.$mallApi.data.getOrderById({ pathParams: `/${orderId}` })
      data = data || {}
      let { orderGoodsList = [], orderStatus} = data
      const {id: orderGoodsId, payAmountStr} = orderGoodsList.find(item => item.goodsSpecId === this.shopId) || {}

      this.returnMoney = payAmountStr
      this.cartList = this.orderShop(orderGoodsList).map(item => ({
        ...item,
        goodsImageUrl: item.goodsImageUrl,
        goodsName: item.goodsName,
        goodsSpec: item.goodsSpec,
        numbers: item.numbers,
        unitPriceStr: item.unitPriceStr, // 商品单价
        salePriceStr: item.salePriceStr, // 商品售价
        orderGoodsId: item.id, // 商品详情id
        select: item.isAfterSale == 1 ? false : true, // 商品是否被选中
        disable: item.isAfterSale == 1 // 是否售后(1:已申请, 0:无)。如果是多选框，则已退货的商品是要禁止checkbox的
      }))
      this.cartList.forEach(({ orderGoodsId, select, disable }) => {
        if (!disable) {
          this.setSelCheckbox(orderGoodsId, select)
        }
      })
      
      // 判断 orderStatus = 1 为代发货状态时，退货类型列表 仅显示退款
      if (orderStatus === 1 && false) { // 数据接口返回
        this.typeList = [
          { label: '仅退款，不退货', value: 3 },
        ]
      }
      this.afterSalePreCheck(orderGoodsId)
    },
    // 上传单个图片文件，并返回图片地址
    uploadSingleFile: commonMethod.throttle1(async function() {
      if (!this.checkParams()) return

      uni.showLoading({ title: '提交中' })
      const reqAll = this.imgList.map(item =>
        this.$mallApi.file.uploadSingleFile({
          fileType: 'image',
          filePath: item.path,
          name: 'file'
        })
      )

      try {
        // 一个包含图片地址的数组
        let imgUrlList = await Promise.all(reqAll)
        imgUrlList = imgUrlList.map(item => item.data)
        this.application(imgUrlList)
      } catch (error) {
        this.$refs.elMessage.open({
          message: '图片上传失败，无法提交退货申请',
          position: 'middle'
        })
      }

      uni.hideLoading()
    }, 3000),
    // 组装申请退换货传参
    assembleParams(imgUrlList) {
      const {numbers, id} = this.cartList[0]
      const packaging = this.packagingList.find(item => item.value === this.packaging)
      const backWay = this.backWayList.find(item => item.value === this.backWay)
      const reasonValue = this.reasonList.find(item => item.value === this.reasonValue)
      const returnWay = this.returnWayList.find(item => item.value === this.returnWay)
      const typeValue = this.typeList.find(item => item.value === this.typeValue)
      const vouchers = Array.isArray(imgUrlList) ? imgUrlList : []
      const config = {
        packageTypeCode: packaging, 
        pickTypeCode: backWay, 
        reasonsTypeCode: reasonValue, 
        returnTypeCode: returnWay, 
        serviceTypeCode: typeValue
      }
      const params = {
        // num: numbers,
        orderGoodsId: id,
        reasonsDescription: this.content,
        vouchers
      }

      for (const key in config) {
        const value = config[key]
        if (value) {
          const {value: val, label, needVoucher, refundCarriage} = value
          const args = { code: val, name: label}
          if (key === 'reasonsTypeCode') Object.assign(args, {needVoucher, refundCarriage})
          params[key] = args
        }
      }

      return params
    },
    // 退货申请
    async application(imgUrlList = []) {
      const { memberId } = commonMethod.getUserStatusInfo()
      const { projectId, projectName } = uni.getStorageSync(this.$constant.PROJECT_INFO)
      const fileList = imgUrlList.map(filePath => ({
        filePath, // 图片地址
        state: 1, // 状态 (1:正常 0:删除) 默认1
        type: 1 // 附件分类 (1:退货原因附件) 默认1
      }))
      const orderGoodsIdList = this.cartList.filter(item => !item.disable && item.select).map(item => item.orderGoodsId)
      // 获取售后原因id对应的文本
      const asReason = (this.reasonList.find(item => item.value === this.reasonValue) || {}).label
      
      const paramsOld = {
        data: {
          asDesc: this.content, // 退款具体原因
          asReason, // 售后原因id对应的内容
          asReasonId: this.reasonValue, // 售后原因id
          asType: this.typeValue, // 售后类型id
          memberId, // 用户id
          orderGoodsIdList, // 商品详情id
          orderId: this.orderId, // 订单id
          projectId, // 项目id
          projectName, // 项目名称
          fileList // 图片
        },
        responseToast: false,
        hideLoading: true
      }
      const params = this.assembleParams(imgUrlList)
      const { success, data, message } = await this.$mallApi.shop.addAfterSale({data: params, responseToast: false, hideLoading: true})

      if (success) {
        uni.navigateTo({ url: '/pages-mall-a/order-after-sale/return-approval-info?afterSaleId=' + data })
      } else {
        this.$refs.elMessage.open({
          message: message || '提交退货申请失败',
          position: 'middle'
        })
      }
    },
    // 获取售后原因
    async getAfterSaleReason() {
      const { data } = await this.$mallApi.shop.getAfterSaleReason()
      this.reasonList = data.map(item => ({ label: item.configDesc, value: item.configId }))
    },
    // 校验参数
    checkParams() {
      const packagingVal = this.packagingList.length ? this.packaging : true
      const returnWayVal = this.returnWayVisible ? this.returnWay : true
      const backWayVal = this.backWayVisible ? this.backWay : true
      const requireImage = this.requireImage ? this.imgList.length : true
      const requireReturnReason = this.returnReasonVisible ? this.reasonValue : true

      let obj = [
        { value: packagingVal, message: '请选择商品包装情况' },
        { value: this.typeValue, message: '请选择售后类型' },
        { value: requireReturnReason, message: '请选择售后原因' },
        { value: backWayVal, message: '请选择返件方式' },
        { value: returnWayVal, message: '请选择退货方式' },
        { value: this.content, message: '请输入补充描述' },
        { value: requireImage, message: '请上传图片' }
      ]
      const res = obj.find(item => !item.value)

      if (!res) return true

      const message = res.message
      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })
      return false
    },
    // 如果存在goodsId，则从订单的多个商品中筛选出对应的商品进行展示；如果不存在goodsId，则展示订单下的所有商品
    orderShop(orderGoodsList) {
      if (this.isMultiple) {
        return orderGoodsList || []
      } else {
        const res = orderGoodsList.find(item => item.goodsSpecId === this.shopId)
        return (res && [res]) || []
      }
    },
    setSelCheckbox(id = '', bool = false) {
      const index = this.selCheckbox.findIndex(item => item === id)
      if (bool && index === -1) {
        this.selCheckbox.push(id)
      } else if (!bool && index > -1) {
        this.selCheckbox.splice(index, 1)
      }
    },
    // 获取选项数据
    afterSalePreCheck(id) {
      this.$mallApi.data.afterSalePreCheck({pathParams: `/${id}`}).then(res => {
        if (res.statusCode == 200) {
          const {packageTypeList, pickTypeList, returnTypeList, reasonsTypeList, serviceTypeList} = res.data || {}
          const packagingList = Array.isArray(packageTypeList) ? packageTypeList.map(item => ({...item, value: item.code, label: item.name})) : []
          const returnWayList = Array.isArray(pickTypeList) ? pickTypeList.map(item => ({...item, value: item.code, label: item.name})) : [] // 退货方式
          const backWayList = Array.isArray(returnTypeList) ? returnTypeList.map(item => ({...item, value: item.code, label: item.name})) : [] // 返件方式
          const reasonList = Array.isArray(reasonsTypeList) ?  reasonsTypeList.map(item => ({...item, value: item.code, label: item.name})) : []
          const typeList = Array.isArray(serviceTypeList) ?  serviceTypeList.map(item => ({...item, value: item.code, label: item.name})) : []

          this.reasonList = reasonList
          this.packagingList = packagingList
          this.returnWayList = returnWayList
          this.backWayList = backWayList
          this.typeList = typeList
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  background-color: #f7f7f7;
  padding: 20rpx 20rpx 30rpx;
  box-sizing: border-box;
  @include flx-dsp(flex-start, flex-start, column);
  min-height: 100%;
  height: auto !important;
}
.cl-checkbox-group,
cl-checkbox-group {
  width: 100%;
}
.card-panel {
  width: 100%;
  padding: 24rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;

  .card-row {
    @include flx-dsp(flex-start, center, row);
  }
  .card-footer {
    @include flx-dsp(flex-start, center, row);

    & > text {
      font-size: 28rpx;
    }
  }
  cart-card-item {
    width: 100%;
  }
}
.editor-panel {
  width: 100%;
  border-radius: 8rpx;
  background-color: #fff;

  // ::v-deep .cl-select:nth-child(1) {
  //   padding: 30rpx 30rpx 0;
  // }
  // ::v-deep .cl-select:nth-child(2) {
  //   padding: 0 30rpx 0;
  // }
  textarea {
    padding: 30rpx;
    color: #333;
    font-weight: normal;
    width: 100%;
    // height: 400rpx;
    box-sizing: border-box;
  }
  .image-panel {
    width: 100%;
    padding: 0 30rpx;
    box-sizing: border-box;
  }
}
.placeholder {
  width: 100%;
  @include flx-size('stretch');
}
::v-deep .cl-button,
cl-button {
  width: 100%;
  height: 80rpx;
}
.editor-panel-title, .head-title{
  padding: 0 30rpx 0;
  box-sizing: border-box;
}
.head-title > text{
  display: block;
  font-size: 28rpx;
  padding: 10rpx 10rpx 10rpx 10rpx;
  box-sizing: border-box;
  color: $uni-color-primary;
}
.pd30{
  padding: 30rpx 30rpx 0;
}
.editor-panel-title text{
  font-size: 28rpx;
  // font-weight: bold;
  color: #8C8C8C;
  border-bottom: 1px solid #EEEEEE;
  display: block;
  padding: 10rpx 0;
}
.mgt{
  margin-bottom: 20rpx;
}
.require-star{
  position: relative;
  &::before{
    display: block;
    content: '*';
    color: red;
    position: absolute;
    top: 10rpx;
    left: 14rpx;
    font-size: 24rpx;
  }
}
.require-star-tl::before{
  top: 40rpx;
}
</style>