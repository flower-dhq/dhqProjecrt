<style  scoped lang="scss">
.message-type {
  width: 100%;
  border-radius: 10rpx;
  overflow: hidden;
  .text-msg {
    &.is-sender {
      background-color: $uni-color-primary;
    }
    display: inline-block;
    background-color: #fff;
    word-break: break-word;
    padding: 10rpx 20rpx;
    font-size: 28rpx;
  }
  .msg-cont {
    max-width: 100%;
    position: relative;
    image,
    video {
      width: 260rpx;
      border-radius: 10rpx;
      z-index: 1;
    }
    .vdo-poster {
    }
    .vdo-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .play-modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 9;
    }
  }
  .voice {
    padding: 10rpx 40rpx;
    border-radius: 10rpx;
    background-color: #fff;
    @include flx-dsp($jsc: center, $ali: center);
    audio{
      display: none;
    }
    &.is-sender {
        background-color: $uni-color-primary;
        .wifi-symbol {
          transform: rotate(-45deg);
        }
    }
    &.play-voice{
      .second {
        animation: fadeInOut 1s infinite 0.2s;
      }
      .third{
        animation: fadeInOut 1s infinite 0.4s;
      }
    }
    .wifi-symbol {
      width: 50rpx;
      height: 50rpx;
      box-sizing: border-box;
      overflow: hidden;
      transform: rotate(135deg);
      position: relative;
      
    }
    .wifi-circle {
      border: 5rpx solid rgba($color: #000000, $alpha: .8);
      border-radius: 50%;
      position: absolute;
    }
    .first {
      width: 10rpx;
      height: 10rpx;
      background: #ccc;
      top: 45rpx;
      left: 45rpx;
    }
    .second {
      width: 25rpx;
      height: 25rpx;
      top: 35rpx;
      left: 35rpx;
      
    }
    .third {
      width: 40rpx;
      height: 40rpx;
      top: 25rpx;
      left: 25rpx;
      
    }
    @keyframes fadeInOut {
      0% {
        opacity: 0; /*初始状态 透明度为0*/
      }
      100% {
        opacity: 1; /*结尾状态 透明度为1*/
      }
    }
  }
}
</style>

<template>
  <view class="message-type">
    <!-- 文本 -->
    <text v-if="textMsg" :class="{ 'text-msg': 1, 'is-sender': msgData.role === 1 }">{{ msgData.content }}</text>
    <!-- 语音 -->
    <view v-if="voiceMsg" :class="{ 'voice': 1, 'is-sender': msgData.role === 1, 'play-voice': isPlayVoice}" @tap="playStopVoice">
      <view class="wifi-symbol">
        <view class="wifi-circle first"></view>
        <view class="wifi-circle second"></view>
        <view class="wifi-circle third"></view>
      </view>
    </view>
    <!-- 图片 -->
    <view v-if="imageMsg" class="msg-cont" @tap="previewImage">
      <image :src="msgData.content" mode="widthFix" />
    </view>
    <!-- 视频 -->
    <view v-if="videoMsg" class="msg-cont">
      <video object-fit="cover" class="vdo-poster" :controls="false" :src="msgData.content"></video>
      <video class="vdo-player" :ref="refId" :src="msgData.content" @fullscreenchange="onFullscreenchange"></video>
      <view class="play-modal" @tap="playStopVideo(1)"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isPlayVoice: false,
      audioContext: null
    }
  },
  props: {
    msgData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    textMsg() {
      return this.msgData.type === 'text'
    },
    imageMsg() {
      return this.msgData.type === 'image'
    },
    videoMsg() {
      return this.msgData.type === 'video'
    },
    voiceMsg() {
      return this.msgData.type === 'voice'
    },
    refId() {
      return `v_${this.getUuiD(8)}`
    },
    mediaRef() {
      const vid = this.refId
      return this.$refs[vid] || null
    }
  },
  methods: {
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
    },
    previewImage() {
      uni.previewImage({
        urls: [this.msgData.content]
      })
    },
    playStopVideo(status) {
      const mediaRef = this.mediaRef
      if (status) {
        mediaRef.requestFullScreen()
        mediaRef.play()
      } else {
        mediaRef.pause()
        mediaRef.seek(0)
      }
    },
    onFullscreenchange(evt) {
      const { detail } = evt
      const { fullScreen } = detail || {}
      if (!fullScreen) this.playStopVideo(0)
    },
    playStopVoice() {
      const isPlay =  this.isPlayVoice = !this.isPlayVoice;
      const audioContext = this.audioContext;
      if (isPlay) {
        audioContext.play();
      } else {
        audioContext.stop();
      }
    },
    initAudioContext() {
      const isVoice = this.voiceMsg;
      if (isVoice) {
        this.audioContext = uni.createInnerAudioContext();
        this.audioContext.src = this.msgData.content;
        this.audioContext.onEnded(() => {
          this.isPlayVoice = false;
        });
        this.audioContext.onError(() => {
          this.isPlayVoice = false;
        });
      }
    }
  },
  mounted() {
    this.initAudioContext();
  }
}
</script>