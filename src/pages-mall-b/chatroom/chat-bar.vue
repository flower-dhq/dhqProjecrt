<style scoped lang="scss">
$bar-h: 100rpx;
$bdt: 1rpx;
$bgc: #f3f3f3;
.chat-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  border-top: $bdt solid #e4e4e4;
  background-color: $bgc;
  @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
  width: 100%;

  $mrg: 20rpx;
  box-sizing: border-box;

  .tool-bar {
    @include flx-dsp($jsc: flex-start, $ali: center);
    width: 100%;
    min-height: $bar-h;
    padding: 10rpx;
    box-sizing: border-box;
    image {
      width: 48rpx;
      height: 48rpx;
    }
    .smile {
      margin: 0 $mrg;
    }
    .voice-speak {
      @include flx-dsp($jsc: center, $ali: center);
      flex: 1;
      background-color: #fff;
      font-size: 28rpx;
      height: 70rpx;
      margin-left: $mrg;
      border-radius: 10rpx;
    }
    textarea {
      display: inline;
      flex: 1;
      margin-left: $mrg;
      background-color: #fff;
      border: none;
      outline: none;
      border-radius: 10rpx;
      box-sizing: border-box;
      min-height: 70rpx;
      height: auto !important;
      max-height: 150rpx;
      padding: 14rpx;
      overflow-y: auto;
    }
    .send-button {
      @include flx-dsp($jsc: center, $ali: center);
      color: #fff;
      background-color: $uni-color-primary;
      height: 60rpx;
      border: none;
      outline: none;
      font-size: 28rpx;
    }
  }
  .multiple-type-info {
    width: 100%;
    border-top: $bdt solid #e4e4e4;
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    flex-wrap: wrap;
    $mg: 15rpx;
    padding: $mg 5%;
    box-sizing: border-box;
    & > view {
      width: 25%;
      @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
      margin-top: $mg;
      margin-bottom: $mg;
      & > view {
        @include flx-dsp($jsc: center, $ali: center);
        background-color: #fff;
        padding: 16rpx;
        border-radius: 10rpx;
        image {
          width: 48rpx;
          height: 48rpx;
        }
        margin-bottom: 10rpx;
      }
      text {
        font-size: 24rpx;
      }
    }
  }
  .voice-recording {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 60rpx;
    background-color: rgba($color: #000000, $alpha: .08);
    border-radius: 20rpx;
    .spinner {
      width: 100rpx;
      height: 60rpx;
      text-align: center;
      font-size: 10rpx;
      & > view {
        background-color: $uni-color-primary;
        height: 100%;
        width: 10rpx;
        margin: 0 10rpx 0 0;
        display: inline-block;
        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
      }
    }

    .spinner .rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }

    .spinner .rect3 {
      -webkit-animation-delay: -1s;
      animation-delay: -1s;
    }

    .spinner .rect4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }

    .spinner .rect5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }

    @-webkit-keyframes sk-stretchdelay {
      0%,
      40%,
      100% {
        -webkit-transform: scaleY(0.4);
      }
      20% {
        -webkit-transform: scaleY(1);
      }
    }

    @keyframes sk-stretchdelay {
      0%,
      40%,
      100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1);
        -webkit-transform: scaleY(1);
      }
    }
  }
}
</style>

<template>
  <view class="chat-bar">
    <!-- 工具栏 -->
    <view class="tool-bar">
      <image
        v-if="isVoice"
        @tap="buttonTap({key: 'keyboard'})"
        class="voice"
        src="/pages-mall-b/static/keyboard.png"
        mode="scaleToFill"
      />
      <image v-else @tap="buttonTap({key: 'voice'})" class="voice" src="/pages-mall-b/static/voice.png" mode="scaleToFill" />
      <text v-if="isVoice" class="voice-speak" @longtap="recordVoice(1)" @touchend="recordVoice(0)">按住 说话</text>
      <textarea @focus="textareaFocus" maxlength="-1" v-else v-model="msg" placeholder-class="textarea-placeholder" />
      <image @tap="buttonTap({key: 'smile'})" class="smile" src="/pages-mall-b/static/smile.png" mode="scaleToFill" />
      <button class="send-button" v-if="sendButtonShow" @tap="buttonTap({key: 'sendText'})">发送</button>
      <image @tap="buttonTap({key: 'plus'})" v-else class="plus" src="/pages-mall-b/static/plus.png" mode="scaleToFill" />
    </view>
    <!-- 多种类型信息 -->
    <view class="multiple-type-info" v-if="openMultipleType">
      <view v-for="(item, index) in multipleType" :key="index">
        <view @tap="buttonTap">
          <image :src="item.icon" mode="scaleToFill" />
        </view>
        <text>{{item.text}}</text>
      </view>
    </view>
    <!-- 语音录音中 -->
    <view class="voice-recording" v-if="voiceRecording">
      <view class="spinner">
        <view class="rect1"></view>
        <view class="rect2"></view>
        <view class="rect3"></view>
        <view class="rect4"></view>
        <view class="rect5"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      msg: '',
      isVoice: false, // 当前是否语音模式
      openMultipleType: false, // 是否打开多种类型信息
      multipleType: [
        {
          icon: require('@/pages-mall-b/static/image.png'),
          text: '相册',
          key: 'image'
        },
        {
          icon: require('@/pages-mall-b/static/camera.png'),
          text: '拍照',
          key: 'camera'
        },
        {
          icon: require('@/pages-mall-b/static/video.png'),
          text: '录像',
          key: 'video'
        },
        {
          icon: require('@/pages-mall-b/static/location.png'),
          text: '位置',
          key: 'location'
        },
        {
          icon: require('@/pages-mall-b/static/note.png'),
          text: '商品订单',
          key: 'note'
        },
        {
          icon: require('@/pages-mall-b/static/return.png'),
          text: '售后订单',
          key: 'return'
        }
      ],
      voiceRecording: false
    }
  },
  props: {},
  computed: {
    sendButtonShow() {
      const msg = this.msg
      const isVoice = this.isVoice
      const openMultipleType = this.openMultipleType
      return !isVoice && !openMultipleType && msg
    }
  },
  methods: {
    // 按钮点击
    buttonTap(params) {
      const { key } = params || {}
      const notOpen = !['sendText', 'keyboard', 'voice', 'plus'].includes(key)
      if (key === 'keyboard') {
        this.isVoice = false
      } else if (key === 'sendText') {
        this.$emit('onEvent', { evt: 'sendText', data: this.msg })
      } else if (key === 'voice') {
        this.isVoice = true;
        this.switchMultipleTypeBoard({ status: false })
      } else if (key === 'plus') {
        this.isVoice = false
        this.switchMultipleTypeBoard({ status: true })
      } else if (key === 'smile') {
        // this.$emit('onEvent', { evt: 'emoticon' })
      }
      if (notOpen) {
        return uni.showToast({
          title: '暂未开放此功能',
          icon: 'none',
          mask: false
        })
      }
    },
    // 录音
    recordVoice(status) {
      this.voiceRecording = status;
      if(!status) {
        return uni.showToast({
          title: '暂未开放此功能',
          icon: 'none',
          mask: false
        })
      }
    },
    // 清空textarea
    emptyMsg() {
      this.msg = ''
    },
    // 收起
    switchMultipleTypeBoard({ status, parentInvoking }) {
      const openMultipleType = this.openMultipleType
      this.openMultipleType = status
      if (parentInvoking) {
        if (openMultipleType) this.$emit('onEvent', { evt: 'plus' })
      } else {
        this.$emit('onEvent', { evt: 'plus' })
      }
    },
    textareaFocus() {
      this.switchMultipleTypeBoard({ status: false })
    }
  }
}
</script>