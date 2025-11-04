<template>
  <view class="upload-image">
    <!-- 图片预览 -->
    <view class="preview-image" v-for="(item, index) in value" :key="index">
      <cl-image :src="item.path" size="140rpx" mode="aspectFill" @click.native="previewImage(index)">
        <view slot="error" class="cl-image__placeholder">
          <text class="cl-icon-image"></text>
        </view>
      </cl-image>
      <cl-icon name="cl-icon-close" size="30rpx" color="#fff" @click.native="deleteImage(index)" />
    </view>
    <!-- 上传图片 -->
    <view class="limit-image" @click.capture="choose" v-show="value.length < limit">
      <cl-image src="/pages-mall/static/shop/camera_icon.png" size="56rpx" />
      <text class="limit-number">{{value.length}}/{{limit}}</text>
    </view>
  </view>
</template>

<script>
/**
 * 图片上传
 * @property {Number} limit 限制图片上传数量
 * @property {Array} value 图片，使用v-model
 * @property {Boolean} multiple 是否支持多选图片
 * @event input 使用v-model
 * @event choose 返回选择的图片File参数
 */
export default {
  options: { styleIsolation: 'shared' },
  name: 'UploadImage',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    // 限制上传数量
    limit: {
      type: Number,
      default: 0
    },
    // 是否支持多选图片
    multiple: Boolean
  },
  data() {
    return {
    }
  },
  methods: {
    choose() {
      const count = this.multiple ? this.limit - this.value.length : 1
      uni.chooseImage({
        count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: ({ tempFilePaths, tempFiles }) => {
          const count = this.limit - this.value.length
          // tempFilePaths = tempFilePaths.slice(0, count)
          tempFiles = tempFiles.slice(0, count)

          this.$emit('input', this.value.concat(tempFiles))
          this.$emit('choose', tempFiles)
        }
      })
    },
    previewImage(index) {
      console.log(index);
      uni.previewImage({
        current: index,
        urls: this.value.map(item => item.path)
      })
    },
    deleteImage(index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-image {
  width: 100%;
  @include flx-dsp(flex-start, flex-start, row);
  flex-wrap: wrap;
}
.preview-image {
  width: 140rpx;
  height: 140rpx;
  position: relative;
  margin-right: 20rpx;
  margin-bottom: 20rpx;

  ::v-deep .cl-icon {
    position: absolute;
    top: -14rpx;
    right: -14rpx;
    border-radius: 100px;
    background-color: $uni-color-main;
    padding: 4rpx;
    line-height: 30rpx;
  }
}
::v-deep .cl-image__placeholder {
  background-color: #f1f1f1;
}
.limit-image {
  width: 140rpx;
  height: 140rpx;
  background-color: #fafafa;
  @include flx-dsp(center, center, column);
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}
.limit-number {
  color: #cecece;
  font-size: 24rpx;
  margin-top: 4rpx;
}
</style>