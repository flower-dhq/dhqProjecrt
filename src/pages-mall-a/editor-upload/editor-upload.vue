<template>
  <view class="page-box-top">
    <view class="card-panel">
      <cart-card-item
        :name="cartStore.goodsName"
        :specification="cartStore.specName"
        :src="cartStore.imgUrl"
        type="none"
      />
      <view class="card-footer">
        <text>描述相符：</text>
        <cl-rate v-model="rateValue" />
      </view>
    </view>
    <view class="editor-panel">
      <textarea v-model="content" placeholder="您对商品还满意吗？请写下您的评价" placeholder-style="color: #DCDCDC"></textarea>
      <view class="image-panel">
        <upload-image v-model="imgList" :limit="5" multiple />
      </view>
    </view>
    <view class="placeholder"></view>
    <cl-button @click="uploadSingleFile" fill round type="primary">提交</cl-button>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import CartCardItem from '@/components/cart-card-item/cart-card-item.vue'
import UploadImage from '@/pages-mall-a/components/upload-image/upload-image.vue'
import commonMethod from '@/js/commonMethod'

// 商品评价
// 地址传参，?orderId=(订单id)
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CartCardItem,
    UploadImage
  },
  data() {
    return {
      orderId: '', // 订单id
      cartStore: {}, // 购物车数据
      content: '', // 评价内容
      imgList: [], // 上传图片文件列表数据
      rateValue: 0 // 评级
    }
  },
  onLoad(option) {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    let { args } = commonMethod.getRouteParams(option, 'args')
    /**
     * args = '{"orderId":"1407235704693592064","gmId":"1402195115325824654","gsId":"1402195116329884674","specName":"规格名称""imgUrl":"https://img.alicdn.com/imgextra/i4/1757689593/O1CN01ydlIFX2KjdykSQj8m_!!1757689593.jpg_430x430q90.jpg","shopName":"商家名"，goodsName:"xxx"}'
     * orderId: 订单id
     * gmId: 商品id
     * gsId: 规格id
     * specName: 规格名称
     * imgUrl: 图片地址
     * shopName: 商品名称
     */

    // 判断是否为空
    args = (/^\{.+\}$/.test(args) && args) || '{}'
    this.cartStore = JSON.parse(args)

    console.log(this.cartStore)
  },
  methods: {
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
      // 一个包含图片地址的数组
      try {
        let imgUrlList = await Promise.all(reqAll)
        imgUrlList = imgUrlList.map(item => item.data)

        await this.application(imgUrlList)
      } catch (error) {
        this.$refs.elMessage.open({
          type: 'error',
          message: '评论失败，请重新评论'
        })
      }

      uni.hideLoading()
    }, 3000),
    // 校验参数
    checkParams() {
      let obj = [
        { value: this.rateValue, message: '请选择评级' },
        { value: this.content, message: '请输入评价内容' }
        // { value: this.imgList.length, message: '请上传图片' }
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
    // 提交评价
    async application(imgUrlList = []) {
      const { memberId, memberName, companyId } = commonMethod.getUserStatusInfo()
      const { gmId, gsId, orderId } = this.cartStore
      const fileList = imgUrlList.map(filePath => filePath)

      const params = {
        data: {
          anonymous: 0, // 是否匿名，[1: 匿名, 0: 否]
          companyId,
          // submitUserId, // 用户id
          // submitName,  // 用户名称
          gmId, // 商品id
          gsId, // 规格id
          orderId, // 订单id
          grade: this.rateValue, // number, 评价星级，[1-2: 差评, 3-4: 中评, 5:好评]
          reviewDesc: this.content, // 评论内容
          filePaths: fileList.join(','), // 图片地址，用逗号分隔不同地址
          type: 1 // 类型，[1: 商城-商品订单评论, 2: 商城-商品留言, 3: 二手商品留言]
        },
        header: {
          'x-user-id': encodeURIComponent(memberId),
          'x-user-name': encodeURIComponent(memberName)
        },
        hideLoading: true
      }
      const { success } = await this.$mallApi.shop.addShopComment(params)

      if (success) {
        this.$refs.elMessage.open({
          type: 'success',
          message: '评论成功'
        })
        setTimeout(() => {
          uni.switchTab({ url: '/pages-mall/mine/mine' })
        }, 2000)
      }else {
        throw new Error('')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box-top {
  background-color: #f7f7f7;
  padding: 20rpx;
  box-sizing: border-box;
  @include flx-dsp(flex-start, flex-start, column);
}
.card-panel {
  width: 100%;
  padding: 24rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;

  .card-footer {
    @include flx-dsp(flex-start, center, row);

    & > text {
      font-size: 28rpx;
    }
  }
}
.editor-panel {
  width: 100%;
  border-radius: 8rpx;
  background-color: #fff;

  textarea {
    padding: 30rpx;
    color: #333;
    font-weight: normal;
    width: 100%;
    height: 400rpx;
    box-sizing: border-box;
  }
  .image-panel {
    width: 100%;
    padding: 0 30rpx;
  }
}
.placeholder {
  @include flx-size('stretch');
}
::v-deep .cl-button,
cl-button {
  width: 100%;
  height: 80rpx;
}
</style>