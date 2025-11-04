<style lang="scss" scoped>
.session-list {
  box-sizing: border-box;
  .msg-item {
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    position: relative;
    box-sizing: border-box;
    padding: 24rpx 30rpx;
    &::before {
      position: absolute;
      left: 0;
      bottom: 0;
      display: block;
      content: '';
      width: 100%;
      height: 1rpx;
      background-color: #ddd;
      transform: scaleY(0.5);
    }
    &:last-child {
      &::before {
        display: none;
      }
    }
    .msg-info {
      margin-left: 24rpx;
      flex: 1;
      &__top {
        @include flx-dsp($jsc: space-between, $ali: flex-start);
        text {
          display: inline-block;
        }
        text:nth-child(1) {
          width: 300rpx;
          color: #333;
          font-size: 30rpx;
          text-align: left;
          @include ellipsis(1);
          flex: 1;
        }
        text:nth-child(2) {
          color: #666;
          font-size: 28rpx;
          text-align: right;
        }
      }
      &__body {
        margin: 16rpx 0;
        .text {
          font-size: 28rpx;
          color: #333;
        }
      }
      &__bottom {
        @include flx-dsp($jsc: flex-end, $ali: flex-start);
        .sensitive {
          color: #fc0b0b;
          font-size: 26rpx;
        }
      }
    }
  }
  .load-more {
    padding: 30rpx 0;
    box-sizing: border-box;
  }
}
</style>

<template>
  <view class="session-list" :style="[THEME_CSS_VAR]">
    <view class="msg-item" v-for="(item, index) in dataList" :key="index">
      <u-avatar size="40" :src="item.avatar"></u-avatar>
      <view class="msg-info">
        <view class="msg-info__top">
          <text>{{ item.nickName }}</text>
          <text>{{ item.msgTime }}</text>
        </view>
        <view class="msg-info__body">
          <message-parse :ref="`rf-${item.msgId}`" :item="item" @onAudioPlay="onAudioPlay"></message-parse>
        </view>
        <view class="msg-info__bottom">
          <text class="sensitive" v-if="item.sensitiveWordClassify">{{ item.sensitiveWordClassify }}</text>
        </view>
      </view>
    </view>
    <view class="load-more"><u-loadmore :status="load.status" line /></view>
  </view>
</template>

<script>
import { getWechatRecord } from '@/service/wechatguanjia';
import MessageParse from './message-parse.vue'

export default {
  data() {
    return {
      load: {
        current: 1,
        size: 10,
        status: 'nomore',
        pending: false,
      },
      dataList: [],
      options: {},
    };
  },
  components: {
    MessageParse
  },
  methods: {
    // 重置条件
    resetCondition() {
      this.load = {
        current: 1,
        size: 10,
        status: 'nomore',
        pending: false,
      };
      this.dataList = [];
    },
    // 加载列表
    getListData(params) {
      const { pullDown } = params || {};
      const { current, size } = this.load;
      const { wxMsgId } = this.options;
      const { groupId } = this.options;

      const args = {
        data: {
          wxMsgId,
          groupId,
          pageNum: current,
          pageSize: size,
        },
        hideLoading: true,
      };
      this.load.status = 'loading';
      getWechatRecord(args)
        .then((res) => {
          if (pullDown) uni.stopPullDownRefresh();
          this.load.status = 'nomore';
          if (res.success) {
            const list = Array.isArray(res.data.records) ? res.data.records : [];
            const tempList = [];
            list.forEach((item) => {
              const { msgData } = item;

              const d = {
                ...item,
                msgData: JSON.parse(msgData),
              };
              tempList.push(d);
            });
            this.load.status = tempList.length < size ? 'nomore' : 'loadmore';
            this.dataList = this.dataList.concat(tempList);
          }
        })
        .catch((_) => {
          if (pullDown) uni.stopPullDownRefresh();
          this.load.status = 'nomore';
        });
    },
    // 语音播放
    onAudioPlay(params) {
      const { msgId } = params
      this.dataList.forEach(item => {
        if (msgId != item.msgId) {
          const ref = this.$refs[`rf-${item.msgId}`][0]
          if (ref && ref.isPlayVoice) ref.stopAudio()
        }
      })
      
    }
  },
  onPullDownRefresh() {
    this.resetCondition();
    this.getListData({ pullDown: 1 });
  },
  onReachBottom() {
    const { pending, status } = this.load;
    if (!pending && status != 'nomore') {
      this.load.current += 1;
      this.getListData();
    }
  },
  onLoad(options) {
    this.options = options;
    this.getListData();
  },
};
</script>
