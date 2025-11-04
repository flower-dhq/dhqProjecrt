<style lang="scss" scoped>
.figure-caption {
  width: 100%;
  background: #f6f9ff;
  box-sizing: border-box;
  padding: 20px 32rpx;
  .up-box {
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .txt-figure {
      padding-bottom: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .tft {
        color: #666;
        font-size: 20rpx;
        font-family: PingFang SC;
        margin-bottom: 10rpx;
      }
      .tff {
        font-size: 40rpx;
        font-weight: bold;
        color: #000;
      }
    }
  }
  .down-box {
    width: 100%;
    .txt-progress {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 24rpx;
      $mg: 24rpx;
      $p-w: 290rpx;
      .tpt {
        color: #999;
        font-size: 20rpx;
        display: inline-block;
        width: calc(100% - #{$p-w} - 80rpx - #{$mg});
        text-align: left;
      }
      .tpp {
        width: $p-w;
        height: 16rpx;
        margin: 0 $mg;
        overflow: hidden;
        .tppc{
          height: 100%;
        }
      }
      .tfv {
        text-align: right;
        width: 80rpx;
        color: #333;
        font-size: 20rpx;
      }
    }
  }
}
</style>

<template>
  <view class="figure-caption">
    <view class="up-box">
      <view class="txt-figure" v-for="(item, index) in configData.textFigure" :key="index">
        <text class="tft">{{ item.title }}</text>
        <text :class="['tff', tenGrand ? '' : 'yuan-size']">{{ item.value }}</text>
      </view>
    </view>
    <view class="down-box">
      <view class="txt-progress" v-for="(item, index) in configData.textProgress" :key="index">
        <text class="tpt">{{ item.title }}</text>
        <view class="tpp" :style="{background: item.progressBg}">
          <view class="tppc" :style="{background: item.progressActiveBg, width: item.value}"></view>
        </view>
        <text class="tfv">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

export default {
  data() {
    return {
    };
  },
  props: {
    configData: {
      type: Object,
      default() {
        return {
          textFigure: [
            {
              title: i18n.t('本期收缴率'),
              value: '52.12%',
            },
            {
              title: i18n.t('本期应收'),
              value: '56789',
            },
            {
              title: i18n.t('本期实收'),
              value: '14567',
            },
          ],
          textProgress: [
            {
              title: i18n.t('本期收缴率'),
              value: '67.18%',
              progressBg: '#e1eaff',
              progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
            },
            {
              title: i18n.t('本期目标收缴完成率'),
              value: '47.13%',
              progressBg: '#e1eaff',
              progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
            },
          ],
        };
      },
    },
    tenGrand: {
      type: Boolean,
      default: true
    }
  },
  methods: {},
};
</script>
