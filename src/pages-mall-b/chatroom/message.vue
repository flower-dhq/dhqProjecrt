<style  scoped lang="scss">
.message-elm {
  width: 100%;
  $hi-s: 80rpx;
  $mrg: 20rpx;
  margin-bottom: 20rpx;
  .plhe {
    width: $hi-s;
  }
  .dialog-wr {
    width: 100%;
  }
  .headimg {
    width: $hi-s;
    height: $hi-s;
    background-color: #dadada;
    border-radius: 4rpx;
    background-size: cover;
    background-position: center;
  }
  .cont-value {

    box-sizing: border-box;
  }
  .sender {
    width: 100%;
    @include flx-dsp($jsc: flex-end, $ali: center);
    .message-cont {
      flex: 1;
      max-width: calc(100% - #{$hi-s});
      @include flx-dsp($jsc: flex-end, $ali: flex-start);
      .cont-value {
        position: relative;
        max-width: calc(100% - #{$mrg} - #{$hi-s * 2});
        box-sizing: border-box;
        .msg-status {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          ::v-deep .cl-loading {
            position: relative !important;
            transform: translateX(-200%);
          }
          .send-fail {
            transform: translateX(-103%);
            @include flx-dsp($jsc: flex-end, $ali: center);
            width: calc(100vw - 110% - 140rpx);
            text {
              margin-left: 6rpx;
              font-size: 24rpx;
            }
            
          }
        }
      }
      .headimg {
        margin-left: $mrg;
      }
    }
  }
  .receiver {
    width: 100%;
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    .message-cont {
      flex: 1;
      @include flx-dsp($jsc: flex-start, $ali: flex-start);
      .cont-value {
        position: relative;
        max-width: calc(100% - #{$mrg} - #{$hi-s  * 2});
      }
      .headimg {
        margin-right: $mrg;
      }
    }
  }
  .msg-time {
    margin-bottom: 10rpx;
    width: 100%;
    @include flx-dsp($jsc: center, $ali: center);
    text {
      color: #333;
      font-size: 24rpx;
    }
  }
  .system-msg {
    margin-top: 10rpx;
    width: 100%;
    @include flx-dsp($jsc: center, $ali: center);
    text {
      padding: 10rpx 20rpx;
      background-color: #e2e2e2;
      color: #333;
      font-size: 24rpx;
      border-radius: 10rpx;
    }
  }
}
</style>

<template>
  <view class="message-elm">
    <view class="dialog-wr" v-if="dialogueMsg">
      <view class="msg-time" v-if="msgData.showTime">
        <text>{{msgData.time}}</text>
      </view>
      <!-- 发送者 -->
      <view class="sender" v-if="msgData.role === 1">
        <view class="plhe"></view>
        <view class="message-cont">
          <view class="cont-value">
            <!-- 消息内容 -->
            <message-type :msgData="msgData"></message-type>
            <view class="msg-status">
              <!-- 发送中 -->
              <cl-loading :size="15" v-if="msgData.sending"></cl-loading>
              <!-- 发送失败 -->
              <view class="send-fail" v-if="msgData.sendFail" @tap="resend">
                <cl-icon name="cl-icon-warning-border" color="red" :size="28"></cl-icon>
                <text>重发</text>
              </view>
            </view>
          </view>
          <view class="headimg" :style="{backgroundImage: `url(${mineHeadImg})`}"></view>
        </view>
      </view>
      <!-- 接受者 -->
      <view class="receiver" v-if="msgData.role === 2">
        <view class="message-cont">
          <view class="headimg" :style="{backgroundImage: `url(${msgData.headimg})`}"></view>
          <view class="cont-value">
            <!-- 消息内容 -->
            <message-type :msgData="msgData"></message-type>
          </view>
        </view>
        <view class="plhe"></view>
      </view>
    </view>
    <view v-else class="system-msg">
      <text>{{msgData.content}}</text>
    </view>
  </view>
</template>

<script>
import messageType from './message-type.vue';
export default {
  data() {
    return {}
  },
  props: {
    msgData: {
      type: Object,
      default() {
        return {}
      }
    },
    receiverAvatar: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialogueMsg() {
      const { type } = this.msgData
      return type !== 'tips' && type !== 'sessionRemind'
    },
    mineHeadImg() {
      const { memberPhoto } = this.$cmMth.getUserStatusInfo()
      return memberPhoto
    }
  },
  components: {
    messageType,
  },
  methods: {
    resend() {
      this.$emit('resend', this.msgData)
    }
  }
}
</script>