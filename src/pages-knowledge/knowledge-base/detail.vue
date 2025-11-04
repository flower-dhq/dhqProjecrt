<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-panel"> 
      <text class="title" style="margin-bottom: 20rpx;">{{ quesDetail.quesTitle }}</text>
      <view style="display: flex;">
      <u-text
          :text="quesDetail.quoteNum" prefixIcon="share-square" 
          :iconStyle="{ fontSize: '18px', color: '#666666' }"
          :customStyle="{ fontSize: '13px', color: '#666666',marginTop: '1.6rpx',marginRight:'40rpx' }"
        />
      <u-text
          :text="quesDetail.likeCount" prefixIcon="star"
          :iconStyle="{ fontSize: '18px', color: '#666666' }"
          :customStyle="{ fontSize: '13px', color: '#666666',marginTop: '1.6rpx' }"
        />
      </view>
      <view v-if="quesDetail.fileList.length>0" class="file-box" :style="{'max-height':fileBoxH}">
        <view class="file-list-box">
          <view class="file-list"  @click="viewFile(item)" v-for="(item,i) in quesDetail.fileList" :key="i">
            <view class="icon-box">
              <image v-if="isPic(item.fileName)" :src="item.filePath" style="width:64rpx;height:64rpx;"></image>
              <image v-else :src="require(`@/static/${[THEME_NAME]}/knowledge/icon-file.png`)" style="width:64rpx;height:64rpx;"></image>
            </view>
            <view class="file-name">{{item.fileName}}</view>
          </view>
        </view>
      </view>
      <view v-if="quesDetail.fileList.length>1" class="file-btn" @click="openFile()">
        <view class="btn-name">{{ flag ? '收起' : '展开' }}</view>
        <u-icon class="btn-icon" :name="flag ? 'arrow-down' : 'arrow-up'" size="14" color="#555555"></u-icon>
      </view>
    </view>

    <view class="content-panel">
      <text class="content-title title-lines">对内回复</text>
      <view class="content-info" v-html="quesDetail.quesAnswer"></view>
    </view>
    <view class="content-panel ">
      <text class="content-title title-lines">对客回复</text>
      <view class="content-info" v-html="quesDetail.externalReply"></view>


    </view>
    <!-- 底部按钮 -->
    <view class="footer-panel">
      <view class="footer-btn">
        <block>
          <view class="sheet-left">
            <u--text :text="quesDetail.top==1 ?'取消置顶':'置顶'" :prefixIcon="quesDetail.top==1 ? require(`@/static/${THEME_NAME}/common/top.png`) : require(`@/static/${THEME_NAME}/common/untop.png`)" 
        size="28rpx" color="#666666" iconStyle="width: 30rpx; height: 30rpx;" 
        :customStyle="{ fontSize: '14px', color: quesDetail.top == 1 ? '#2761FF ' : '#666666' ,opacity: '1'}"
              margin="26rpx 30rpx 26rpx 0" opacity ='1' @click="topKnow(quesDetail.quesId,quesDetail.top == 1 ? 0 : 1)" />
            <u-text
                text="收藏"  prefixIcon="star-fill"
                :iconStyle="{ fontSize: '18px', color: quesDetail.praised == 1 ? '#FF0000' : '#666666' }"
                :customStyle="{ fontSize: '14px', color: quesDetail.praised == 1 ? '#FF0000' : '#666666' ,opacity: '1'}"
                @click="collectKnow(quesDetail.quesId,quesDetail.praised ==1 ? 0 : 1)"
            ></u-text>
          </view>
          <button :class="['footer-btns', 'active']" @click.native.stop="handleShare">发送</button>
        </block>
      
      </view>

    </view>

  </view>
</template>
  
<script>
  import { getQuesDetail,collectQues,updateQuesTopStatus,addQuesQuoteNum} from '@/service/knowledgeBase'
  import pageRefresh from '@/js/pageRefresh';
  
  export default {
    components: {
      
    },
    data() {
      return {
        quesId:'',
        quesDetail:{
          fileList:[]
        },
        flag:false,
        fileBoxH:'75rpx'
      }
    },
    computed: {
      
    
    },
    async onLoad(options) {
      // 获取页面传递的参数
      this.quesId = options.quesId || ''   
      await this.getDetail(this.quesId)
     
    },
    created() {
    },
    onShow() {

    },
    methods: {
      async  getDetail(quesId){
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            const params = {
                  data: {
                      quesId: quesId,
                      userId: userInfo.userId,
                  },
                  wrapResponse: true,
                  hideLoading: true,
                  responseToast: false
             }
      const res = await getQuesDetail(params)
      const dataTmp = res.data.data || {}
      this.quesDetail = Object.assign({}, dataTmp)

    },
    collectKnow(id,data){ //收藏
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        let params = {
          data:{
            quesId:id,
            type:data,
            userId:userInfo.userId
          }   
      }
      collectQues(params).then(res =>{
        if(res.status=='200'){
          uni.showToast({title:res.message,icon:'none'})
          this.getDetail(id)
        }else{
          uni.showToast({title:res.message,icon:'none'})
        }
      })

      },
      topKnow(id,data){ //置顶
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        let params = {
          data:{
            quesId:id,
            type:data,
            userId:userInfo.userId,
            userName:userInfo.userName
          }   ,
          header: {
          'content-type': 'application/json'
        },
          hideLoading: true,
          responseToast: false
      }
      updateQuesTopStatus(params).then(res =>{
        if(res.status=='200'){
          uni.showToast({title: `${ data == 1 ? '置顶': '取消置顶'}成功`,icon:'none',duration: 1000})
          pageRefresh.setRefresh('KONWLEDGE_DETAIL')
          this.getDetail(id)
        }else{
          uni.showToast({title:res.message,icon:'none'})
        }
      })

      },
      handleShare() {
        let self = this;
      const miniprogram = {
        appid: self.$appConfig.OWNER_APPID,
        title: self.quesDetail.quesTitle,
        imgUrl:'https://saas60.wuyeface.com/qw-online-assets/static/theme-default/common/shareKnowledge.png',
        // 打开消息内容-对客内容
        page: 'pages-b/knowledgeBase/messageContent.html?quesId=' + self.quesId, // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
      }
      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            // 从单聊进入
            wx.qy.sendChatMessage({
              msgtype: "miniprogram", //消息类型，必填
              enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
              miniprogram,
              success: function(res) {
                   // 分享成功后 res 返回的数据：
                   //{err_code: 0, err_msg: "qy.sendChatMessage:ok"}
                  if(res.err_msg == 'qy.sendChatMessage:ok'){
                    self.addQuesQuoteNum(self.quesId)
                	}   
                }
            })
          } else {
            wx.qy.shareToExternalContact({
              text: {
                content: this.quesDetail.quesTitle,
              },
              attachments: [
                {
                  msgtype: 'miniprogram',
                  miniprogram
                }
              ],
              success: function(res) {
                self.addQuesQuoteNum(self.quesId)
              }
            })
          }
        }
      })
    },
    async  addQuesQuoteNum(quesId){ //增加引用量
        let params = {
          data:{
            quesId:quesId,
          },
          header: {
          'content-type': 'application/json'
        },
          hideLoading: true,
          responseToast: false  
      }
    await  addQuesQuoteNum(params).then(res =>{
        if(res.status=='200'){
          this.getDetail(quesId)
        }else{
          uni.showToast({title:res.message,icon:'none'})
        }
      })
    },
    //判断文件是否为图片
    isPic(url){
      //获取最后一个.的位置
      let index= url.lastIndexOf(".");
      //获取后缀
      let ext = url.substr(index+1);
      let ls = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      return ls.indexOf(ext.toLowerCase()) !== -1;
    },

    //打开文件列表
    openFile(){
      this.flag = !this.flag
      if(this.flag){
        const query = uni.createSelectorQuery().in(this);
        query.select('.file-list-box').boundingClientRect(data => {
          this.fileBoxH = data.height*2 +'rpx'
        }).exec();
      }else{
        this.fileBoxH = '75rpx'
      }
    },

    // 查看文件
    viewFile(item){
      if(this.isPic(item.filePath)){
        uni.previewImage({
          current: 0,//当前预览图片url
          urls: [item.filePath]
        })
      }else{
        uni.showLoading({title:'加载中'})
        uni.downloadFile({
          url: item.filePath,
          filePath: wx.env.USER_DATA_PATH + '/' + item.fileName + '.' + item.fileName.split('.')[item.fileName.split('.').length - 1],
          success: function (res) {
            if (res.statusCode === 200) {
              uni.openDocument({
              showMenu: true,
              filePath: res.filePath,
              fileType:res.filePath.split('.').pop(),
              success: function (res) {
                console.log(res,'打开文件成功')
              },
              fail: (err) => {
                uni.showToast({title:'打开文件失败请重试',icon:'none'})}})
              } 
            else {
              uni.showToast({title:'打开文件失败请重试',icon:'none'})
            }
            uni.hideLoading()
          },fail:(err) => {
            uni.hideLoading()
            uni.showToast({title: '加载失败请重试',icon:"none"})}
        })
      }
    },
   }
  }
</script>
  
<style lang="scss" scoped>
  .page-panel {
    padding: 24rpx 20rpx;
    padding-bottom: 100rpx;
    min-height: 100vh;
    background-color: #f3f5f9;
    box-sizing: border-box;
    font-family: "PingFang SC";
  }
  .header-panel {
    @include flx-dsp(flex-start, flex-start, column);
    width: 100%;
    padding: 24rpx 30rpx;
    border-radius: 12rpx;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 24rpx;
  }
  .content-panel {
    padding: 30rpx 0;
    border-radius: 12rpx;
    background-color: #fff;
    box-sizing: border-box;
    margin-bottom: 24rpx;
    ::v-deep .cell-text-content {
      color: #333;
    }
    &.none-padding {
      padding: 0;
    }
  }
  
  ::v-deep .cell-text {
    .cell-text-label {
      min-height: 1rem;
    }
    .cell-text-content {
      min-height: 1rem;
    }
  }

  .footer-panel {
    @include flx-dsp(flex-start, flex-start, column);
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #d9dce7;
    border-bottom: 1px solid #d9dce7;
    position: fixed;
    left: 0;
    bottom: 0;
  
    .footer-btn {
      width: 100%;
      @include flx-dsp(space-between, center);
      padding: 0 30rpx;
      box-sizing: border-box;
    }
 
  }
  .title {
    padding: 0 0 30rpx 0;
    box-sizing: border-box;
  font-size: 30rpx;
  color: #222;
  font-weight: bold;
  word-break: break-all;
  // @include ellipsis(2);
}
  .content-title {
    padding: 0 30rpx 30rpx 30rpx;
    box-sizing: border-box;
  font-size: 30rpx;
  color: #222;
  font-weight: bold;
  @include ellipsis(2);
}
.title-lines {
    border-bottom: 1px solid  #EBEBEB;

}
.content-info {
  padding: 24rpx 30rpx 18rpx;
  font-size: 28rpx;
  color: #666;
}
  .sheet-left {
    display: flex;
  justify-content:space-between;
  width: 50%;
  box-sizing: border-box;
  align-items: center;
  }

  .footer-btns {
  width: 120rpx;
  height: 60rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 26rpx;
  color: #fff;
  margin: 0;
  border-width: 0;

  &.active {
    background-color: var(--app-primary-color);
  }
  &.disabled {
    background-color: #ccc;
  }
  &::after {
    border-width: 0;
  }
}

.content-info ::v-deep img{
  width: 100% !important;
}
.file-box{
  padding-top: 20rpx;
  overflow: hidden;
  max-height: 75rpx;
  -webkit-transition: max-height 0.5s;
  transition: max-height 0.5s;
}
.file-list{
  display: flex;
  margin-bottom: 20rpx;
  .file-icon{
    width: 64rpx;
  }
  .file-name{
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    padding-left: 20rpx;
  }
}

.file-btn{
  width: 100%;
  padding: 10rpx 6rpx;
  font-size: 28rpx;
  color: #555;
  display: flex;
  justify-content: center;
  .btn-name{
    padding-right: 10rpx;
  }
}
</style>