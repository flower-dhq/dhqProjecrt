<style lang="scss" scoped>
$pdlr: 20rpx;
::v-deep .u-swiper {
  border-radius: 0 !important;
  .u-swiper__wrapper__item__wrapper__image {
    border-radius: 0 !important;
  }
}
.exposure-detail {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}
.interval {
  width: 100%;
  height: 20rpx;
  background-color: #f6f6f7;
}
.indicator {
  @include flx-dsp($jsc: center, $ali: center);

  &__dot {
    height: 6px;
    width: 6px;
    border-radius: 100px;
    background-color: rgba(255, 255, 255, 0.35);
    margin: 0 5px;
    transition: background-color 0.3s;

    &--active {
      background-color: #ffffff;
    }
  }
}
.swiper-box {
  position: relative;
  .tag {
    display: block;
    z-index: 9;
    position: absolute;
    left: 0;
    top: 20px;
    color: #fff;
    padding: 10rpx 20rpx;
    background-color: var(--app-primary-color);
    font-size: 24rpx;
    border-radius: 0 20rpx 20rpx 0;
  }
}
.detail-info {
  background-color: #fff;
  font-size: 28rpx;
  $mg: 20rpx;

  .info-title {
    font-size: 28rpx;
    padding: 20rpx $pdlr;
    display: block;
  }
  .info-head {
    font-size: 28rpx;
    padding: 0 $pdlr $mg $pdlr;
    width: 100%;
    box-sizing: border-box;
    @include flx-dsp($jsc: space-between, $ali: flex-end);
    color: #aaa;
    border-bottom: 1rpx solid #eee;
    .view-style {
      color: var(--app-primary-color);
      ::v-deep .uni-icons {
        color: var(--app-primary-color) !important;
      }
      .view-count {
        margin-right: 6rpx;
      }
    }
  }
  .info-descr {
    padding: $mg $pdlr;
    min-height: 40rpx;
  }
}

.reply-process {
  padding: 20rpx $pdlr;
  background-color: #fff;
  .label {
    & > text {
      margin-left: 20rpx;
      position: relative;
      font-size: 30rpx;
      &::before {
        content: '';
        position: absolute;
        left: -20rpx;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        width: 6rpx;
        height: 36rpx;
        background-color: var(--app-primary-color);
      }
    }
  }
  .step {
    padding-top: 30rpx;
    padding-left: 10rpx;
  }
}
</style>

<template>
  <view class="exposure-detail" :style="[THEME_CSS_VAR]">
    <!-- 轮播图 -->
    <view class="swiper-box">
      <text class="tag" v-if="replyProcess.length">已回复</text>
      <u-swiper indicator :list="banner" @change="(e) => (current = e.current)" imgMode="aspectFill" height="250px" @click="preview()">
        <view slot="indicator" class="indicator">
          <view class="indicator__dot" v-for="(item, index) in banner" :key="index" :class="[index === current && 'indicator__dot--active']"> </view>
        </view>
      </u-swiper>
    </view>
    <!-- 标题/时间 -->
    <view class="detail-info">
      <text class="info-title">{{ info.title }}</text>
      <view class="info-head">
        <text>{{ info.date }}</text>
        <view class="view-style">
          <text class="view-count">{{ info.view }}</text>
          <uni-icons type="eye-filled" class="view-icon" size="16"></uni-icons>
        </view>
      </view>
      <view class="info-descr">
        <text>{{ info.descr }}</text>
      </view>
    </view>
    <view class="interval"></view>
    <!-- 物业回复 -->
    <view class="reply-process">
      <view class="label">
        <text>物业回复</text>
      </view>
      <view class="step">
        <u-steps v-if="replyProcess.length" current="1" direction="column" dot :activeColor="THEME_COLOR">
          <u-steps-item v-for="(item, index) in replyProcess" :key="index" :title="item.text" :desc="item.date"> </u-steps-item>
        </u-steps>
        <u-empty v-else mode="message" icon="http://cdn.uviewui.com/uview/empty/message.png"> </u-empty>
      </view>
    </view>
  </view>
</template>

<script>
import util from '@/js/utils';
import { getMiniExposureDetail, addReadNum } from '@/service/wxmanage'
export default {
  data() {
    return {
      banner: [],
      current: 0, // 指示点索引
      info: {
        title: '',
        date: '',
        view: 0,
        descr: '',
      },
      replyProcess: [],
    };
  },
  methods: {
    // 加载详情
    getDetailData(options) {
      const { detailId, increaseViews} = options || {}
      const { MEMBER_ID } = this.$constant;
      const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      const params = {
        data: {
          exposureId: detailId
        }
      }
      const pms = getMiniExposureDetail(params)
      pms.then((res) => {
        if (res.success) {
          const { title, submitTime, readNum, detailDesc, fileList, replyRecordList } = res.data;
          const replyProcess = []

          // 轮播图
          this.banner = Array.isArray(fileList) ? fileList : [];

          // 详情
          this.info = {
            title,
            date: submitTime,
            view: readNum,
            descr: detailDesc
          };

          // 节点
          if (Array.isArray(replyRecordList)) {
            replyRecordList.forEach(item => {
              const { content, submitTime } = item
              const d = {
                text: content,
                date: submitTime
              }
              replyProcess.push(d)
            })
            
          }
          this.replyProcess = replyProcess;

          // 阅读量
          addReadNum({data: {exposureId: detailId, memberId}, responseToast: false, hideLoading: true})
        }
      });
    },
    // 预览图片
    preview(index) {
      uni.previewImage({
        urls: this.banner,
        current: this.current
      });
    }
  },
  onLoad(options) {
    this.getDetailData(options);
  },
};
</script>
