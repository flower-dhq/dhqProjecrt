<style  scoped lang="scss">
.chatroom {
  width: 100%;
  min-height: 100%;
  $bar-h: 100rpx;
  $bgc: #f3f3f3;
  background-color: $bgc;
  $bdt: 1rpx;
  .chat-cont {
    width: 100%;
    padding: 20rpx;
    min-height: 100vh;
    box-sizing: border-box;
    //transition: padding-bottom .1s;
  }
  ::v-deep .cl-loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<template>
  <view class="chatroom">
    <!-- 聊天内容 -->
    <view class="chat-cont" :style="{'padding-bottom': pdb}" @tap="chatContTap">
      <cl-scroller ref="scroller" :refresher-enabled="downRefresh" :loading-text="''" release-text="释放加载" @down="onDown">
        <message v-for="(msg, index) in msgList" :key="index" :msgData="msg" @resend="resend" />
      </cl-scroller>
    </view>
    <!-- 聊天bar -->
    <chat-bar id="chat-bar" ref="chatBar" @onEvent="onEvent"></chat-bar>
    <cl-loading theme="spin" text="聊天记录加载中" v-if="loading"></cl-loading>
  </view>
</template>

<script>
import socketConfig from '@/socket/config'
import message from './message.vue'
import ChatBar from './chat-bar.vue'
export default {
  data() {
    return {
      msg: '',
      loading: false,
      downRefresh: true,
      msgList: [],
      pageSize: 10,
      current: 1,
      query: {},
      pdb: '100rpx'
    }
  },
  components: {
    message,
    ChatBar
  },
  methods: {
    onDown() {
      this.getChattingRecords()
    },
    getUuiD(randomLength) {
      return Number(
        Math.random()
          .toString()
          .substr(2, randomLength) + Date.now()
      ).toString(36)
    },
    // 运行socket
    runSocket() {
      const { sessionId } = this.$route.query
      const { baseUrl, im } = socketConfig
      const { memberId } = this.$cmMth.getUserStatusInfo()
      const url = `${baseUrl}${im}/${memberId}/${sessionId}/0`
      this.socket = this.$cmMth.initSocket({ url, socketId: sessionId })
      this.socket &&
        this.socket.obj.on({
          eventName: 'onMessage',
          callback: msg => {
            const { data } = msg || {}
            const msgFail = data.messageTypeDetail === -1
            if (msgFail) {
              this.sendFailTips({ msgId: data.messageId, sendFailText: data.sendContent })
            } else {
              this.assemblyMsgData(data)
            }
          }
        })
    },
    // 绑定chatbar事件
    onEvent(params) {
      const { evt, data } = params || {}
      if (evt === 'sendText') {
        this.sendText(data)
      } else if (evt === 'plus') {
        this.updatePaddingBottom();
      } else if (evt === 'emoticon') {
        
      }
    },
    // 页面底边距
    updatePaddingBottom() {
      this.$nextTick(_ => {
        const query = uni.createSelectorQuery().in(this);
        query.select('#chat-bar').boundingClientRect(data => {
          const {height} = data || {};
          const h = height ? data.height * 2 : 100;
          this.pdb = `${h}rpx`;  
          this.scrollToBottom();
        }).exec();
      })
    },
    // 表情/文本发送
    sendText(msg) {
      const msgId = this.getUuiD(6);
      const time = this.$cmMth.formatDate({ type: 's2d', value: new Date().getTime() })
      const chatBarRef = this.$refs.chatBar
      const isEmpty = msg.trim() === ''
      const sendMsg = {
        role: 1, // 1 发送者 2 接收者
        type: 'text', // 文本text 图片image 视频video
        content: msg,
        headimg: '',
        sending: true,
        time,
        msgId,
        chatMsg: true,
        sendFail: false,
        sendFailText: ''
      }
      if (isEmpty)
        return uni.showToast({
          title: '不能发送空白信息',
          icon: 'none'
        })
      sendMsg.sendSocketCont = JSON.stringify({
        sendContent: sendMsg.content,
        messageTypeDetail: 1,
        messageId: msgId
      })
      this.msgList.push(sendMsg)
      chatBarRef && chatBarRef.emptyMsg && chatBarRef.emptyMsg()
      this.scrollToBottom();
      this.socketSend({ sendSocketCont: sendMsg.sendSocketCont, msgId })
    },
    // 发送socket
    socketSend(data) {
      const { sendSocketCont, msgId } = data || {}
      const socketObj = this.socket && this.socket.obj
      if (socketObj) {
        socketObj.aciton({
          acitonName: 'send',
          payload: {
            data: sendSocketCont,
            success: () => {
              this.msgList.some(item => {
                if (item.msgId === msgId) {
                  item.sending = false
                  return true
                }
              })
            },
            fail: () => {
              this.sendFailTips({ msgId })
            }
          }
        })
      }
    },
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(_ => {
        uni.pageScrollTo({
          scrollTop: 9999999999999999999,
          duration: 0,
          selector: '.chatroom'
        })
      })
    },
    // 组装信息
    assemblyMsgData(params) {
      const { messageTypeDetail: code, sendContent, sendDate, sendId, images} = params
      const type = this.convertType(code)
      const { memberId } = this.$cmMth.getUserStatusInfo()
      const role = sendId === memberId ? 1 : 2
      const sendMsg = {
        ...params,
        type,
        role,
        content: sendContent,
        headimg: images,
        time: sendDate,
        chatMsg: type !== 'tips' && type !== 'sessionRemind'
      }
      this.msgList.push(sendMsg)
      this.scrollToBottom();
      this.updateTimeDisplay({ chatType: 'chatMsg' })
      this.$forceUpdate();
    },
    // 更新时间
    updateTimeDisplay(params) {
      const { chatType } = params || {}
      const list = this.msgList
      const len = list.length - 1
      const formatDate = this.$cmMth.formatDate
      const intervalTime = 5 * 60 * 1000
      const newTime = new Date().getTime()
      let recordLastTime = newTime,
        chatLastTime = newTime
      for (let i = len; i >= 0; i--) {
        const { chatMsg, type, time } = list[i]
        const isChatCont = type !== 'tips' && type !== 'sessionRemind'
        const sendTime = formatDate({ type: 'd2s', value: time })
        const isChatMsg = chatType === 'chatMsg' && chatMsg
        const isRecordMsg = chatType === 'chatRecord' && isChatCont
        const lastTime = isChatMsg ? chatLastTime : isRecordMsg ? recordLastTime : 0
        const over5min = lastTime - sendTime > intervalTime

        if ((isChatMsg || isRecordMsg) && over5min) {
          if (isChatMsg) chatLastTime = sendTime
          if (isRecordMsg) recordLastTime = sendTime
          this.msgList[i].showTime = true
        }
      }
    },
    // 转换类型
    convertType(code) {
      return code == 0
        ? 'tips'
        : code == 1
        ? 'text'
        : code == 2
        ? 'image'
        : code == 3
        ? 'video'
        : code == 4
        ? 'voice'
        : code == 5
        ? 'map'
        : code == 6
        ? 'goodsOrder'
        : code == 7
        ? 'afterSale'
        : code == 9
        ? 'sessionRemind'
        : 'unkonw'
    },
    // 读取聊天记录
    getChattingRecords(params) {
      const { init } = params || {}
      const { sessionId } = this.query
      const args = {
        data: {
          sessionId
        },
        pathParams: `/${this.pageSize}/${this.current}`,
        hideLoading: true
      }
      if (init) this.loading = true
      this.$mallApi.data
        .findSessionMessage(args)
        .then(res => {
          this.loading = false
          this.scrollerEnd()
          if (res.statusCode === 200) {
            const list = (res.data && Array.isArray(res.data.records) && res.data.records) || []
            const unreadMsgId = []
            const { memberId } = this.$cmMth.getUserStatusInfo()
            let chatCont = []
            list.forEach(item => {
              const { messageTypeDetail: code, sendContent, sendDate, sendId, isRead, messageId, images} = item
              if (code >= 1) {
                const type = this.convertType(code)
                const role = sendId === memberId ? 1 : 2;
                const d = {
                  ...item,
                  role,
                  type,
                  content: sendContent,
                  headimg: images,
                  time: sendDate
                }
                chatCont.push(d)
                if (isRead === 0) unreadMsgId.push(messageId)
              }
            })
            chatCont = chatCont.reverse()
            this.msgList = chatCont.concat(this.msgList);
            this.downRefresh = !(list.length < this.pageSize)
            this.current = this.current + 1
            this.updateTimeDisplay({ chatType: 'chatRecord' })
            if (init) this.readSessionMessage()
            if (!init && unreadMsgId.length) this.readSystemMessage(unreadMsgId);
            if (init) this.scrollToBottom();
          }
        })
        .catch(_ => {
          this.scrollerEnd()
          this.loading = false
        })
    },
    // 滚动底部
    scrollerEnd() {
      const scroller = this.$refs['scroller']
      scroller && scroller && scroller.end && scroller.end()
    },
    // 读取消息
    readSystemMessage(messageIds) {
      this.$mallApi.data.readSystemMessage({ data: messageIds, responseToast: false, hideLoading: true })
    },
    // 读取会话消息
    readSessionMessage() {
      const { sessionId } = this.query
      this.$mallApi.data.readSessionMessage({ pathParams: `/${sessionId}`, responseToast: false, hideLoading: true })
    },
    // 重发
    resend(data) {
      const { sendSocketCont, msgId } = data || {}
      // 延迟300ms显示loading
      data.sending = true
      data.sendFail = false
      const timer = setTimeout(() => {
        clearTimeout(timer)
        this.socketSend({ sendSocketCont, msgId })
      }, 300)
    },
    // 点击chatCont
    chatContTap () {
      const chatBarRef = this.$refs.chatBar;
      chatBarRef && chatBarRef.switchMultipleTypeBoard && chatBarRef.switchMultipleTypeBoard({status: false, parentInvoking: 1});
    },
    // 发送失败提示
    sendFailTips(params) {
      const { msgId, sendFailText } = params || {}
      this.msgList.some(item => {
        if (item.msgId === msgId) {
          item.sending = false
          item.sendFail = true
          if (sendFailText) item.sendFailText = sendFailText
          return true
        }
      })
    },
    // 关闭当前socket连接
    closeSocket() {
      const { sessionId } = this.$route.query
      const sockets = this.$sockets || {}
      const currentSk = sockets[sessionId]
      return new Promise(resolve => {
        try {
            currentSk.obj.aciton({acitonName: 'close', payload: {success:  success => {
                delete this.$sockets[sessionId];
                resolve();
            }}})
        } catch (error) {
            resolve();
        }
      })
    },
    // 初始化socket
    async initSocket() {
      const {shopName} = this.$route.query;
      if (shopName) uni.setNavigationBarTitle({title: shopName});
      await this.closeSocket();
      this.runSocket();
    }
  },
  onLoad(options) {
    this.query = options
    this.getChattingRecords({ init: 1 });
    this.initSocket();
  }
}
</script>