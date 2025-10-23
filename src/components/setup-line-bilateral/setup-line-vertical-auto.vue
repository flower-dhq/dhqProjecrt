<template>
  <view class="setup-line-vertical-auto">
    <view :class="['line-panel', { 'is-active': index === 0 }]" v-for="(item, index) in setupList" :key="index">
      <!-- 左边的点和线 -->
      <view class="line-vertical">
        <view class="line-point"></view>
        <view class="line"></view>
      </view>
      <view class="content">
        <view class="content-top">
          <!-- 申请标题，例如 提交申请 -->
          <text class="content-top-title">{{ item.title }}</text>
          <!-- 申请日期 -->
          <text class="content-top-date">{{ item.dateTime }}</text>
        </view>
        <view class="content-center">
          <!-- 内容描述 -->
          <text class="word-break">{{ item.descript | formatEl }}</text>
          <!-- 退货时间提示 -->
          <view v-if="item.refundTime">
            <text>退款时间：{{item.refundTime}}</text>
          </view>
					<view class="image-all" v-if="item.imageList">
            <cl-image :src="img" size="160rpx" mode="aspectFill" v-for="(img, j) in item.imageList" :key="j" :preview-list="item.imageList">
              <view slot="error" class="cl-image__placeholder">
                <cl-icon name="cl-icon-image" />
              </view>
            </cl-image>
					</view>
					<view class="image-all" v-else></view>
        </view>
      </view>
    </view>
    <view class="line-all"></view>
  </view>
</template>

<script>
/**
 * 垂直单边步骤进度，内容可伸缩
 * @property {array} setupList 数据列表，[{ title: String, dateTime: String, descript: String }]
 */
import dayjs from 'cl-uni/utils/dayjs'

export default {
  options: { styleIsolation: 'shared' },
  props: {
    // 数据列表，[{ title: String, dateTime: String, descript: String }]
    // descript：第一种是文本字符串，换行使用\n；第二种是标签字符串，会被替换成文本字符串，换行使用<br>
    setupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  filters: {
    // 将带有标签的文本内容，去掉标签，只提取文本内容
    formatEl(val) {
      val = val || ''
      // 将标签进行转换，默认不写则转换为空字符串
      const tagName = {
        br: '\n' // <br>标签转换为'\n'
      }

      return val.replace(/[<>][^<>]*[<>]/gi, item => {
        let exp = /^<\/?([^\s>]+)[\s>]+/i
        let tag = exp.exec(item) // 查找出标签名称，例如span，br

        if (!tag) return item
        const key = tag[1].toLocaleLowerCase()
        return tagName[key] || ''
      })
    },
    formatDate(val) {
      return val ? dayjs(new Date(val)).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  onLoad() {},
  methods: {
		lookThat(list){
			// uni.previewImage({urls: list,indicator:'default'});
		},
    //点击放大图片
    showBigImg(imgsArray){
      let arr=[];
      arr.push(imgsArray)
      uni.previewImage({
          current: 0,
          urls: arr //必须是网址路径，否则加载不出来，如：http：或https：
      });
    }
	}
}
</script>

<style lang="scss" scoped>
.setup-line-vertical-auto {
  width: 100%;
  height: 100%;
  overflow: auto;
  @include flx-dsp(flex-start, flex-start, column);
  position: relative;
}
.word-break{
  word-break: break-all;
}
.line-panel {
  width: 100%;
  display: flex;
  position: relative;
  z-index: 1;

  &:not(:last-child) .content {
    padding-bottom: 50rpx;
  }
  &:last-child .line {
    height: 0;
  }
  &.is-active .line-point {
    background-color: #fd8444;
  }
}
.line-vertical {
  width: 22rpx;
  height: 100%;
  @include flx-size('keep');
  @include flx-dsp(flex-start, center, column);
  padding-top: 4rpx;

  .line-point {
    width: 22rpx;
    height: 22rpx;
    background-color: #e6e6e6;
    border-radius: 100%;
  }
  .line {
    width: 2rpx;
    height: 100%;
    background-color: #dcdcdc;
  }
}
.content {
  @include flx-size('stretch');
  @include flx-dsp(flex-start, flex-start, column);
  padding-left: 20rpx;
}
.content-top {
  width: 100%;
  @include flx-dsp(space-between, center, row);
  margin-bottom: 24rpx;

  .content-top-title {
    font-size: 28rpx;
    font-weight: bold;
  }
  .content-top-date {
    font-size: 24rpx;
    color: #dcdcdc;
  }
}
.content-center {
  width: 100%;
  font-size: 26rpx;
  line-height: 42rpx;
  color: #666;
}
.line-all{
  position: absolute;
  left: 11rpx;
  top: 10rpx;
  bottom: 0;
  width: 1px;
  background: #dcdcdc;
}
.image-all{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}
.image-box{
	width: 190rpx;
	height: 190rpx;
	margin: 5rpx;
}
::v-deep .cl-image__placeholder {
  background-color: #ddd;
}
</style>