<style  scoped lang="scss">
.item-parse {
  width: 100%;
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
    
    video {
      width: 560rpx;
      border-radius: 10rpx;
      z-index: 1;
    }
    &.vdo-box{
      width: 260rpx;
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
    width: 200rpx;
    padding: 10rpx 30rpx 10rpx 10rpx;
    border-radius: 10rpx;
    box-sizing: border-box;
    background-color: #eee;
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
  .link-type{
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    & > view {
      margin-left: 20rpx;
      text:nth-child(1) {
        @include ellipsis(1);
        color: #000;
        font-size: 26rpx;
        display: block;
      }
      text:nth-child(2) {
        color: #666;
        font-size: 24rpx;
        @include ellipsis(2);
      }
    }
  }
  .comInfo {
    display: flex;
   flex-direction: row;
   padding: 10px;
   &-middle{
     display: flex;
     flex-direction: column;
     margin-right: auto;
     &-name{
        font-size: 12px;
        color: #797979;
       margin-bottom: 10px;
     }
     &-text{
       font-size: 14px;
       color: #333;
       white-space: pre-line;
     }
     &-image{
        img{
          width: 120px;
          height: auto;
        }
     }
     &-audio{
      &-content{
        width: 52px;
        padding: 10px 20px;
        background-color: #eee;
        img{
          width: 12px;
          height: 12px;
        }
      }
      &-time{
        font-size: 13px;
        color: #797979;
      }
     }
     &-file{
       width: auto;
       display: flex;
       flex-direction: row;
       padding: 10px;
       background-color: #eee;
        &-img{
          width: 35px;
          height: 40px;
          margin-right: 20px;
        }
       &-info{
         display: flex;
         flex-direction: column;
         &-name{
            font-size: 28rpx;
            color: #000000;
         }
         &-size{
           font-size: 24rpx;
           color: #666;
           margin-top: 5px;
         }
       }
     }
     &-news{
       display: flex;
       flex-direction: row;
       padding: 10px;
       background-color: #eee;
      &-img{
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
       &-info{
        width: 70%;
        border: lightgray 2rpx solid;
        background: #fff;
        padding: 20rpx 0 10rpx 0;
        border-radius: 10rpx;
         &-name{
           font-size: 28rpx;
           color: #000;
           word-break: break-word;
           padding:0 20rpx 20rpx 20rpx;
         }
         &-url{
           font-size: 24rpx;
           color: #666;
         }
       }
     }
     &-other{
       font-size: 16px;
       color: #797979;
     }
   }
   &-bottom{
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    border-top-style: solid;
    border-width: 2rpx;
    border-color: lightgray;
    color: #666;
    font-size: 24rpx;
    padding:0 20rpx;
    padding-top:10rpx;
   }
  }
}

</style>

<template>
  <view class="item-parse">
    <!-- 文本 -->
    <text v-if="item.msgType == 'text'  || item.msgType == 'switch'" class="text-msg">{{ item.msgData.content }}</text>
    <text v-else-if=" item.msgType == 'revoke'" class="text-msg">{{ item.text }}</text>
    <!-- 语音 -->
    <view v-else-if="item.msgType == 'voice' || item.msgType == 'meeting_voice_call' || item.msgType ==  'voip_doc_share'" :class="{ 'voice': 1, 'play-voice': isPlayVoice}" @tap="playStopVoice">
      <view class="wifi-symbol">
        <view class="wifi-circle first"></view>
        <view class="wifi-circle second"></view>
        <view class="wifi-circle third"></view>
      </view>
      <view style="font-size: 26rpx;color: #666;">{{ item.msgData.playLength }}s</view>
    </view>
    <!-- 图片 -->
    <u--image v-else-if="item.msgType == 'image'" :showLoading="true" :src="item.fileUrl" width="100px" @click="previewImage"></u--image>
    <!-- 表情 -->
    <u--image v-else-if="item.msgType == 'emotion'" :showLoading="true" :src="item.fileUrl" width="30px" height="30px" @click="previewImage"></u--image>
    <!-- 视频 -->
    <view v-else-if="item.msgType == 'video' || item.msgType == 'meeting_voice_call' || item.msgType ==  'voip_doc_share'" class="msg-cont vdo-box">
      <video object-fit="cover" class="vdo-poster" :controls="true" :src="item.fileUrl"></video>
      <!-- <video class="vdo-player" :id="refId" :src="item.fileUrl" @fullscreenchange="onFullscreenchange"></video> -->
      <!-- <view class="play-modal" @tap="playStopVideo(1)"></view> -->
    </view>
    <!-- 链接 -->
    <view v-else-if="item.msgType == 'link'" class="link-type">
      <u--image :showLoading="true" :src="item.msgData.imageUrl" width="40px" height="40px"></u--image>
      <view>
        <text>{{ item.msgData.title }}</text>
        <text>{{ item.msgData.description }}</text>
      </view>
    </view>
    <!-- 文件 -->
    <view v-else-if="item.msgType == 'file'" class="link-type">
      <a :href="item.fileUrl" download>
          <view class="comInfo-middle-file" >
            <view class="comInfo-middle-file-info" >
              <view class="comInfo-middle-file-info-name">{{item.msgData.fileName}}</view>
              <view class="comInfo-middle-file-info-size">{{getfilesize(item.msgData.fileSize)}}</view>
            </view>
          </view>
      </a>
    </view>
      <view v-else-if="item.msgType == 'card'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.corpName}}</view>
            <view class="comInfo-bottom">{{ item.msgData.corpName == '微信' ?  '个人名片' : '企业微信名片' }} </view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'agree'">
          <view class="text-msg">对方同意存档会话内容,你将无法继续提供服务</view>
      </view>
      <view v-else-if="item.msgType == 'disagree'">
          <view class="text-msg">对方不同意存档会话内容,你将无法继续提供服务</view>
      </view>
      <view v-else-if="item.msgType == 'location'">
          <!-- <view class="comInfo-middle-news-info"> -->
            <!-- <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.address}}</view> -->
            <map id="myMap" style="width: 560rpx; height: 500rpx;"
               :longitude = "item.msgData.longitude"
               :latitude = "item.msgData.latitude"
               :show-location="true"
               :markers="getMap(item.msgData)"
               scale="15" >
              </map>
            <!-- <view class="comInfo-middle-news-info-url" style="position: absolute;bottom: 30px;background-color: red;z-index: 9999;">{{item.msgData.address}}</view> -->
            <!-- <view class="comInfo-bottom">位置</view> -->
          <!-- </view> -->
      </view>
      <view v-else-if="item.msgType == 'weapp'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.description}}</view>
            <view class="comInfo-bottom">小程序</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'chatrecord'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-bottom">聊天记录</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'todo'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.content}}</view>
            <view class="comInfo-bottom">待办</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'vote'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.votetitle}}</view>
            <view class="comInfo-bottom">投票</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'collect'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.details}}</view>
            <view class="comInfo-bottom">填表</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'redpacket'|| item.msgType == 'external_redpacket'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.wish}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.totalamount}}元</view>
            <view class="comInfo-bottom">红包</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'meeting'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.topic}}</view>
            <view class="comInfo-middle-news-info-url">会议开始时间：{{item.msgData.starttime}}</view>
            <view class="comInfo-middle-news-info-url">会议结束时间：{{item.msgData.endtime}}</view>
            <view class="comInfo-middle-news-info-url">会议地址：{{item.msgData.address}}</view>
            <view class="comInfo-bottom">会议邀请</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'docmsg'">
        <a :href="item.msgData.link_url" target="_blank" class="comInfo-middle-news" >
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">创建者：{{item.msgData.doc_creator}}</view>
            <view class="comInfo-bottom">在线文档</view>
        </a>
      </view>
      <view v-else-if="item.msgType == 'markdown'">
          <view class="comInfo-middle-text">{{ item.info }}</view>
      </view>
      <view v-else-if="item.msgType == 'news'">
        <a :href="item.msgData.url" target="_blank"  class="comInfo-middle-news" >
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.info}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.description}}</view>
            <img :src="item.picurl" alt=""/>
        </a>
      </view>
      <view v-else-if="item.msgType == 'calendar'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.title}}</view>
            <view class="comInfo-middle-news-info-url">	组织者{{item.msgData.creatorname}}</view>
            <view class="comInfo-middle-news-info-url">	开始时间{{item.msgData.starttime}}</view>
            <view class="comInfo-middle-news-info-url">	结束时间{{item.msgData.endtime}}</view>
            <view class="comInfo-middle-news-info-url">	地点{{item.msgData.place}}</view>
            <view class="comInfo-bottom">日程</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'sphfeed'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.sph_name}}</view>
            <view class="comInfo-middle-news-info-url">{{item.msgData.feed_desc}}</view>
            <view class="comInfo-bottom">视频号</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'voiptext'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">通话时长{{item.msgData.callduration}}</view>
            <view class="comInfo-bottom">音视频通话</view>
          </view>
      </view>
      <view v-else-if="item.msgType == 'qydiskfile'">
          <view class="comInfo-middle-news-info">
            <view class="comInfo-middle-news-info-name">{{item.msgData.filename}}</view>
            <view class="comInfo-bottom">微盘文件</view>
          </view>
      </view>
      <text class="text" v-else-if="item.msgType == '' || item.msgType == null || item.msgType == undefined">消息加载失败</text>
      <text class="text" v-else>[消息类型暂不支持]</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isPlayVoice: false,
      audioContext: null,
      videoContext: null,
      
    }
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    refId() {
      return `v_${this.getUuiD(8)}`
    },
    mediaRef() {
      const vid = this.refId
      return this.$refs[vid] || null
    }
  },
  methods: {
    getMap(data){
      var marker = {
     id: 1,
     latitude: data.latitude,
     longitude: data.longitude,
     width:25,
     height:40,
     callout:{//自定义标记点上方的气泡窗口 点击有效
            content:data.address,//文本
            color:'#ffffff',//文字颜色
            fontSize:12,//文本大小
            borderRadius:2,//边框圆角
            bgColor:'#6f6f6f',//背景颜色
            display:'ALWAYS',//常显
            padding:5,
            zIndex: 9999,
            width:200
         }
    //  label:{
    //         content:data.address,//文本
    //         color:'#ffffff',//文字颜色
    //         fontSize:12,//文本大小
    //         borderRadius:2,//边框圆角
    //         bgColor:'#6f6f6f',//背景颜色
    //         display:'ALWAYS',//常显
    //         padding:5,
    //         width:200,
    //         zIndex: 9999,
    //         anchorY:50,
    //         textAlign:'center'
    //   }
     }
   var markers = new Array();
    markers.push(marker);
     return markers;
    },
    getfilesize(size) {//把字节转换成正常文件大小
        if (!size)  return "";
        var num = 1024.00; //byte
        if (size < num)
          return size + "B";
        if (size < Math.pow(num, 2))
          return (size / num).toFixed(2) + "KB"; //kb
        if (size < Math.pow(num, 3))
          return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
        if (size < Math.pow(num, 4))
          return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
        return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
     },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
    },
    previewImage() {
      uni.previewImage({
        urls: [this.item.fileUrl]
      })
    },
    playStopVideo(status) {
      const mediaRef = this.videoContext
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
      this.$emit('onAudioPlay', this.item)
      if (isPlay) {
        audioContext.play();
      } else {
        audioContext.stop();
      }
    },
    initVideoContext() {
      const isVideo = this.item.msgType === 'video';
      if (isVideo) this.videoContext = uni.createVideoContext(this.refId);
    },
    initAudioContext() {
      const isVoice = this.item.msgType === 'voice';
      if (isVoice) {
        this.audioContext = uni.createInnerAudioContext();
        this.audioContext.src = this.item.fileUrl;
        this.audioContext.onEnded(() => {
          this.isPlayVoice = false;
        });
        this.audioContext.onError(() => {
          this.isPlayVoice = false;
        });
      }
    },
    stopAudio() {
      const audioContext = this.audioContext;
      if (audioContext) {
        this.isPlayVoice = false
        audioContext.stop()
      }
    }
  },
  mounted() {
    this.initAudioContext();
    // this.initVideoContext();
  }
}
</script>