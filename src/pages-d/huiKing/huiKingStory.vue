<style lang="scss" scoped>
  #app-page {
    width: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    background: #F6F7F9;
    position: absolute;
    top: 0px;
    z-index: 0;

  }
  .story-list{
    padding: 30px 15px 0px;
    /*margin: 0px 15px 15px 15px;*/
    margin: 15px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fff;
    position: relative;
  }
  .story-info{
    min-height: 60px;
    padding-bottom: 15px;
    border-bottom: 1px solid #D9DCE7;
  }
  .story-info-image{
    width: 45px;
    height: 45px;
  }
  .story-info-image img{
    width: 45px;
    height: 45px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
  }
  .content-no-more-data-tip {
    width: 100%;
    height: 30px;
    font-size: 14px;
    color: #999;
    line-height: 45px;
    text-align: center;
    margin-top: -10px;
  }
  .story-comment{
    width: 100%;
    border-top: 1px solid #A1A6BB;
    border-bottom: 1px solid #A1A6BB;
    padding: 9px;
    background: #ffffff;
    position: absolute;
    /*z-index: -10111;*/
  }
  .story-comment-input{
    min-height: 32px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    border: 1px solid #A1A6BB;
    margin-right: 70px;
  }
  .story-comment-input ::v-deep .vux-x-textarea .weui-textarea{
    max-height: 80px;
  }
  .story-comment-input ::v-deep .weui-cell{
    padding: 6px 15px;
  }

  .story-comment-publish{
    width: 60px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    position: absolute;
    bottom: 9px;
    right: 9px;
    border: 1px solid #A1A6BB;
    color: #fff;
    background: #A1A6BB;
  }

</style>


<template>
  <view ref="huiKingStoryPage" style="width: 100wh">
    <view id="app-page" :style="{bottom: storyBottom,height: storyHeight}">
      <u-list>
        <view>
          <view style="margin: 20px 15px; font-weight: bold; text-align: center; font-size: 15px;">本周好人好事星星榜</view>
          <view class="story-list" v-for="(item,index) in storyInfo" :key="item">
            <img v-if="item.isStar == 1" src="@/static/theme-default/sunHome/hui_story_one.png" style="width: 24px; height: 36px; position: absolute; top: 0px; right: 30px;"/>
            <view class="story-info">
              <view class="story-info-image">
                <img v-if="item.url == undefined" src="@/static/theme-default/sunHome/familyPortrait.jpg">
                <img v-else :src="item.url">
              </view>
              <view style="min-height: 45px; margin-top: -45px; margin-left: 60px;">
                <view style="font-weight: bold; font-size: 15px; color: #2C3444;">{{item.userName}}</view>
                <view v-if="item.jobNames.length > 0" style="margin-top: 5px; font-size: 13px; color: #A1A6BB;">{{item.jobNames[0].deptName}}/{{item.jobNames[0].jobName}}</view>
              </view>
            </view>
            <view style="font-weight: bold; font-size: 13px; padding: 15px 0px;">个人故事：</view>
            <view style="font-size: 15px; color: #2C3444;">{{item.content}}</view>
            <view style="padding: 30px 0px 15px 0px; height: 70px; line-height: 20px;">
                <span @click="moreComment(item.storyId)">
                  <span style="font-size: 13px;color: #E6B42A; margin-right: 10px;">更多评论</span>
                  <img src="@/static/theme-default/sunHome/right_arrow.png" style="width: 10px; height: 10px;"/>
                </span>
              <span style="float: right; position: relative;">
                  <span style="font-size: 12px; margin-right: 10px;">{{item.greatTimes}}</span>
                  <img v-if="item.greatState === 0" src="@/static/theme-default/sunHome/praise.png"
                       style="width: 20px; height: 20px; margin-right: 30px; margin-top: -6px;" @click="clickGreat(index,item.storyId)"/>
                  <img v-if="item.greatState === 1" src="@/static/theme-default/sunHome/praised.png"
                       style="width: 20px; height: 20px; margin-right: 30px; margin-top: -6px;" @click="clickGreat(index,item.storyId)"/>
                  <label for="input1" style="margin-right: 10px;" @click="clickComment">
                    <img src="@/static/theme-default/sunHome/comment.png" style="width: 20px; height: 20px; margin-top: -6px;"/>
                  </label>
                  <input type="search"  style="width: 20px; height: 20px; background: transparent; position: absolute; right: 10px; top: -2px; z-index: -10001; opacity: 0;" />
                </span>
            </view>
            <view v-if="item.storyComments.length > 0" style="border-top: 1px solid #D9DCE7; padding: 5px 0 20px 0;">
              <view v-if="index1 < 3" style="margin-top: 15px;" v-for="(item1, index1) in item.storyComments" :key="item1">
                <span style="font-size: 13px; color: #E6B42A;">{{item1.memberName}}:</span>
                <span style="font-size: 13px; color: #001600;">{{item1.content}}</span>
              </view>
            </view>
          </view>
          <view class="content-no-more-data-tip" v-if="!hasMoreData">{{noMoreDataTips}}</view>
        </view>
      </u-list>
         <u-loading-icon :show="loading" text="加载中"></u-loading-icon>
    </view>

    <view class="story-comment" :style="{bottom: storyCommentBottom, zIndex: zIndex}">
      <view class="story-comment-input">
        <u-textarea id="input1" @blur="onBlur" placeholder="comment" ref="textarea" v-model="commentContent" count="false" autoHeight></u-textarea>
        <view class="story-comment-publish">发布</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getStoryInfo,//获取员工故事列表
    storyPraise,//点赞
    storyAddComment,//评论
  } from "@/service/wxmanage.js";
  // import {ready, setTitleNameAndBackgroundColor, hideOptionMenu, setBackButtonState, showOrHideCloseButton,setRightButton} from '@/assets/js/mpaasTitleStyle.js';
  export default {
    name: "huiKingStory",
    data() {
      return {
        loading: false,
        projectId: localStorage.getItem("projectId"),
        pageSize: 10,
        pageNum: 1,
        storyInfo: [],
        hasMoreData: true,
        noMoreDataTips: "没有更多的数据",
        totalCount: 0,
        commentContent: "",
        storyComment: false,
        storyHeight: "100vh",
        storyBottom: "0px",
        storyScrollHeight: "100vh",
        storyScrollBottom: "0px",
        storyScrollTop: "0px",
        storyCommentBottom: "0px",
        clientHeight: "",
        clientHeightTemp: "",
        zIndex: -1,
        isAndroid: true,
        isiOS: false,
        isMpaas: true,
      }

    },
    mounted(){
      // 获取浏览器可视区域高度
      this.clientHeight = document.documentElement.clientHeight;
      window.onresize = function windowResize () {
        this.clientHeight = document.documentElement.clientHeight;
      };
    },
    watch: {
      clientHeight(curVal,oldVal){
        let self = this;

      },

      hasMoreData: function (newVal) {
        if(newVal){
          this.$refs.storyInfo.enablePullup();
        }else{
          this.$refs.storyInfo.disablePullup();
        }
      }
    },
    created() {
      let self = this;
      let u = navigator.userAgent;
      self.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      self.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // self.loadMoreData();
      // setTitleNameAndBackgroundColor("汇景故事", "E6B932");
      // setRightButton("","#ff00ff00");
      // hideOptionMenu();
      // setBackButtonState(false);
      // showOrHideCloseButton(false);
    },

    methods: {
      //业主评论
      clickComment(){
        let self = this;
        // alert(document.documentElement.clientHeight);
        if(self.isAndroid === true && self.isiOS === false){
          self.storyHeight = "calc(100vh - 54px)";
          self.storyBottom = "254px";
          self.zIndex = 0;
          self.storyCommentBottom = "0px";
          this.$refs.textarea.focus();
        }else{
          self.storyScrollHeight = "calc(100vh - 66px)";
          self.storyScrollBottom = "66px";
          self.zIndex = 0;
          self.storyCommentBottom = "66px";
          this.$refs.textarea.focus();
        }

      },

      onBlur() {
        let self = this;
        self.zIndex = -1;
        self.storyScrollHeight = "100vh";
        self.storyScrollBottom = "0px";
      },

      // 加载更多数据
      loadMoreData() {
        let self = this;
        if(!self.hasMoreData){
          return
        }
        self.loading = true;
        let params = {
          "projectId": self.projectId,
          "memberInfoId": localStorage.getItem("memberId"),
          "current": self.pageNum,
          "size": self.pageSize,
        };
        getStoryInfo(params,'汇景故事','获取汇景故事列表失败').then(res => {
          if (res.status === '200'){
            self.pageNum += 1;
            self.totalCount = res.data.total;
            self.storyInfo = self.storyInfo.concat(res.data.records);
          }else{
            self.showTips("网络异常");
          }
          self.loading = false;
          self.donePullup();
          self.checkListData();
        }).catch((err) => {
          self.loading = false;
          self.util.debugLog(err);
          self.showTips('网络异常，获取数据失败');
          self.donePullup();
        });
      },

      //刷新列表数据
      refreshData(){
        let self = this;
        self.loading = true;
        self.pageNum = 1;
        let params = {
          "projectId":self.projectId,
          "memberInfoId":localStorage.getItem("memberId"),
          "current": self.pageNum,
          "size": self.pageSize,
        };
        getStoryInfo(params,'汇景故事','获取汇景故事列表失败').then(res => {
          if(res.status === '200'){
            self.pageNum += 1;
            self.totalCount = res.data.total;
            self.storyInfo = res.data.records;
          }else{
            self.showTips("网络异常");
          }
          self.loading = false;
          self.donePulldown();
          self.checkListData();
        }).catch((err) => {
          self.loading = false;
          self.util.debugLog(err);
          self.showTips('网络异常，获取数据失败');
          self.donePulldown();
        });
      },

      //获取更多评论
      moreComment(storyId){
        this.$router.push("/huiKingStoryDetail?storyId=" + storyId);
      },

      //员工故事点赞点赞接口
      clickGreat(index,storyId) {
        let self = this;
        let params = {
          "memberId": localStorage.getItem("memberId"),
          "storyId": storyId
        };
        storyPraise(params,'汇景故事','点赞失败').then(res =>{
          if(res.status === '200'){
            if(self.storyInfo[index].greatState === 1){
              self.showTips("取消点赞");
              self.storyInfo[index].greatState = 0;
              self.storyInfo[index].greatTimes -= 1;
            }else{
              self.showTips("点赞成功");
              self.storyInfo[index].greatState = 1;
              self.storyInfo[index].greatTimes += 1;
            }
          }else{
            self.showTips('网络异常，点赞失败');
          }
        }).catch((error) =>{
          self.showTips('网络异常');
        })
      },

      //业主评论
      /*   clickComment(index,storyId){
           let self = this;
           self.storyComment = true;
           self.storyScrollHeight = "calc(100vh - 54px)";
           self.storyScrollBottom = "54px";
           self.storyCommentBottom = "0px";

           // this.$refs.textarea.focus();
           self.showKeyboard();

           let newH = window.innerHeight;
           alert(newH);

           let cliH = document.body.clientHeight;
           if(!self.isMpaas){
               //普通方式调用评论
               self.storyCommentTo(index,storyId);
             }else{
               //mpaas方式调用评论
               self.storyCommentToMpaas(index,storyId);
             }
         },

         showKeyboard() {
           let self = this;
           self.storyScrollHeight = "calc(100vh - 54px)";
           self.storyScrollBottom = "54px";
           self.storyCommentBottom = "0px";
           let newH = window.innerHeight;
           alert(newH);
         },*/

      //员工故事评论接口
      storyCommentTo(index,storyId){
        let self = this;
        self.storyComment = true;
        let params = {
          "memberId": localStorage.getItem("memberId"),
          "storyId": storyId,
          "content": self.commentContent
        };
        storyAddComment(params,'汇景故事','评论失败').then(res =>{
          if (res.status === '200'){
            self.showTips("评论成功");
            self.loadMoreStoryInfo();
          } else {
            self.showTips('评论失败');
          }
        }).catch((error) => {
          self.showTips('网络异常');
        });
      },

      //提示框
      showTips (tip) {
        this.$vux.toast.show({
          type: 'text',
          text: tip,
          position: 'bottom'
        })
      },
      donePulldown() {
        this.$refs.storyInfo.donePulldown();
        this.$refs.storyInfo.reset({ top: 0 });
      },
      donePullup() {
        this.$refs.storyInfo.donePullup();
        this.$refs.storyInfo.reset();
      },
      checkListData() {
        if(this.totalCount === this.storyInfo.length){
          this.hasMoreData = false;
        }else{
          this.hasMoreData = true;
        }
      }
    },
    watch: {
      hasMoreData: function (newVal) {
        if(newVal){
          this.$refs.storyInfo.enablePullup();
        }else{
          this.$refs.storyInfo.disablePullup();
        }
      }
    }
  };
</script>

