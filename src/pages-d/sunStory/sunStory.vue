<style scoped lang="scss">
  @mixin flx-dsp($jsc, $ali, $drt:row) {
    display: flex;
    flex-direction: $drt;
    justify-content: $jsc;
    align-items: $ali;
  }

  .com-w {
    margin: 0 auto;
    width: 710rpx;
  }

  .sun-story {
    $color1: #333;
    $color2: #666;
    $color3: #333;
    background-color: #f5f5f5;
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom: 50rpx;
    &-head {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 9;
      width: 100%;
      padding: 28rpx 0 28rpx 0;
      background-color: #f5f5f5;
      text-align: center;
      font-size: 30 rpx;
      font-weight: 400;
      height: 32 rpx;
      line-height: 32 rpx;
      color: $color1;
    }
    .story-item {
      position: relative;
      border-radius: 15rpx;
      background-color: #fff;
      padding: 25rpx;
      box-sizing: border-box;
      margin-bottom: 40rpx;
      & > image {
        position: absolute;
        top: 0;
        right: 40rpx;
        width: 44rpx;
        height: 56rpx;
      }
      &-h {
        @include flx-dsp($jsc: flex-start, $ali: center);
        padding: 10rpx 0 40rpx 0;
        border-bottom: 2rpx solid #ececec;
        & > image {
          width: 120rpx;
          border-radius: 20rpx;
          margin-right: 40rpx;
          height: 60px;

        }
        & > view {
          @include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);

          & > span:nth-of-type(1) {
            color: $color1;
            font-size: 32rpx;
            margin-bottom: 6rpx;
          }
          & > span:nth-of-type(2) {
            color: $color2;
            font-size: 24rpx;
          }
        }
      }
      &-b {
        & > view:nth-of-type(1) {
          padding-top: 34rpx;
          padding-bottom: 20rpx;
          padding-right: 50rpx;
          & > p {
            font-size: 28rpx;
            font-weight: bold;
            color: $color3;
          }
          & > span {
            display: block;
            font-size: 28rpx;
            min-height: 80rpx;
          }
        }
        .operation-bar {
          @include flx-dsp($jsc: space-between, $ali: center);
          & > span {
            color: #2EC6D1;
            font-size: 30rpx;
          }
          & > view {
            @include flx-dsp($jsc: center, $ali: center);
            & > view {
              display: inline-block;
              height: 44rpx;
              background: #fff;
              i.like {
                display: inline-block;
                width: 44rpx;
                height: 44rpx;
                background-image: url(@/static/theme-default/sunHome/like_icon.png);
                background-position: left center;
                background-size: 80rpx 44rpx;
              }
              .like_slo{
                display: inline-block;
                width: 44rpx;
                height: 44rpx;
              }
              & > text {
                position: relative;
                top: -4px;
                margin-left: 3px;
              }
            }
            & > image {
              width: 44rpx;
              height: 44rpx;
              background-size: 100%;
            }
            & > image:nth-of-type(1) {
              margin: 0 22rpx;
            }
          }
        }
      }
    }

    .scl-wr {
      height: auto !important;
    }
    ::v-deep .xs-plugin-pullup-container, .xs-plugin-pullup-undefined {
      bottom: -46rpx !important;
      line-height: 40rpx;
    }
    .base-lien {
      position: relative;
      margin: 0 auto;
      width: 400.32rpx;
      height: 80rpx;
      @include flx-dsp($jsc: center, $ali: center);
      font-size: 30rpx;
      & > p {
        width: 100%;
        height: 1rpx;
        background-color: #e0e0e0;
      }
      & > span {
        position: absolute;
        top: 48%;
        left: 50%;
        width: 180rpx;
        height: 40rpx;
        text-align: center;
        background-color: #f5f5f5;
        transform: translate(-50%, -50%);
        display: block;
        color: #ACACAC;
      }
    }

    .comment-bg {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background-color: rgba(0, 0, 0, .2);
      @include flx-dsp($jsc: flex-end, $ali: center, $drt: column);
      .comment-control {
        width: 100%;
        padding: 40rpx 20rpx;
        @include flx-dsp($jsc: center, $ali: center);
        border: 1rpx solid #a1a6bb;
        border-right: none;
        border-left: none;
        background-color: #f5f5f5;
        box-sizing: border-box;
        & > textarea {
          width: 183.68rpx;
          min-height: 35px;
          padding: 3.2rpx;
          box-sizing: border-box;
          border: 1rpx solid #A1A6BB;
          margin-right: 6.4rpx;
          border-radius: 5.12rpx;
        }
        & > button {
          margin-left: 20rpx;
          width: 160rpx;
          line-height: 70rpx;
          border-radius: 5.12rpx;
          text-align: center;
          color: #fff;
          border: none;
          outline: none;
          background-color: rgba(255, 166, 51, 1);
        }
      }
    }

  }

   .story-item-b-arrow{
        position: absolute;
        right: 10px;
        bottom: 20px;
        width: 14px;
        height: 10px;
       right: 60rpx;
       & > image {
        width: 100%;
        height: 100%;
      }
      }
   .nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
  }
  .nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .divider{
    width: 70%;
    margin: 0 auto;
  } 
  .imglist{
    /* width: 95%; */
    height: 320rpx;
    border-radius: 8px;
    overflow: hidden;
  }
  .defalut_img{
    width: 0rpx;
    height: 0rpx;
    opacity: 0;

  }   
</style>

<template>
  <view v-if="!storyList.length" class="nodata"></view>
  <view v-else class="sun-story" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <h3 class="sun-story-head">好人好事星星榜</h3>
    <!-- 故事 -->
    <view  style="height:auto;padding-top: 104rpx;">
      <view>
        <view class="story-item com-w" v-for="(str,index) in storyList" :key="index"
             @click="viewDetail(str)">
          <image src="@/static/theme-default/sunHome/tag_icon.png" alt=""></image>
          <view class="story-item-h">
            <image :src=" str.imgIds ? str.imgIds[0] : require('@/static/theme-default/sunHome/no-pictures.jpg')" alt=""></image>
            <view>
              <span>{{str.name}}</span>
              <span>{{str.job}}</span>
            </view>
          </view>
          <view class="story-item-b">
            <view style="position: relative;">
              <p>个人故事：</p>
              <span>{{str.story}}</span>
              <view class="story-item-b-arrow">
                  <image src="@/static/theme-default/sunHome/right_arrowTwo.png" alt=""></image>
              </view>
            </view>
            <view class="operation-bar">
              <span @click.stop="viewDetails(str)">查看评论</span>
              <view>
                <view @click.stop="giveLike(str)">
                  <i class="like" v-if="str.isLike != 1"></i>
                  <image src="@/static/theme-default/sunHome/like-select.png" class="like_slo"  v-if="str.isLike == 1"></image>
                  <text v-if="str.likeCount > 0">{{str.likeCount}}</text>
                </view>
                <image @click.stop="showComment({show: true, data: str})" src="@/static/theme-default/sunHome/comment_icon.png"
                     alt=""></image>
              </view>
            </view>
          </view>
        </view>
        <!-- <view class="base-lien" v-show="!storyList.length || isNoData"> 
          <p class="line"></p>
          <span>已无其它内容</span>
        </view> -->
        <view class="divider">
          <u-divider text="已无其它内容" v-if="!storyList.length || isNoData"></u-divider>
        </view>
      </view>
    </view>

    <!-- 评论输入 -->
    <view class="comment-bg" v-if="comment.show" @click="comment.show = false">
      <view class="comment-control" @click.stop="">
        <u-textarea  placeholder="点击输入评论..." v-model="comment.text" :count="false" autoHeight></u-textarea>
        <button @click="addComment">发布</button>
      </view>
    </view>
     <!-- <u-loading-icon :show="like.show"  :text="like.text"></u-loading-icon> -->
  </view>
</template>

<script>
  import {
    getArticleList,
    giveArticleLike,
    getCommentAdd,
    giveArticleLikeCancel,
    storyShareCount,
    selectSupremePosition
  } from '@/service/wxmanage.js';
  // import {putJsSDKConfig} from '@/service/getData.js';
  // import { controlFunction } from "@/assets/js/mixin.js";
  import util from '@/js/utils';
  import comml from '@/js/comm-logic.js'
  export default {
    name: "sunStory",
    data() {
      return {
        storyList: [],
        pullDownConfig: {
          content: '上拉加载数据',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: true,
          downContent: '释放后加载',
          upContent: '上拉加载数据',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        isNoData: true,
        scrollerStatus: {
          pullupStatus: 'default'
        },
        currentPage: 1,
        pageSize: 10,
        areaId: '',
        projectId: '',
        comment: {
          text: '',
          show: false,
          id: ''
        },
        // isWx: util.isWeixin(),
        isWx: comml.isWeixinBrowser(),
        haveSetConfig: false,
        role: null,
        like: {
          show: false,
          text: '点赞中...'
        },
        defalutImg:false
      }
    },
    computed: {},
    // mixins: [controlFunction],
    // beforeCreate () {
    //   if (process.env.moduleConfig.projectName=='zhongtie') {
    //     document.title = '物业故事';
    //     util.title("物业故事");
    //   }
    // },
    methods: {
      wanc(e){
        this.defalutImg =true
      },
      // 下拉加载更多数据
      loadMore() {
        if (this.isNoData) {
          this.resetScroller();
        } else {
          this.getArticleList();
        }
      },
      // 获取列表
      getArticleList() {
        const { MEMBER_ID ,O_USER_INFO} = this.$constant;
        const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        const params = {
          data:{
            colId: "32",
            areaId: this.areaId,
            projectId: this.projectId,
            // "areaId": 7,
            // "projectId": "14",
            limit: this.pageSize,
            page: this.currentPage,
            userId:memberId
          }
        
        };
        uni.showLoading({ title: '加载中' })
        getArticleList(params).then(res => {
          // this.resetScroller();
          // this.$vux.loading.hide();
          if (res.status === '200') {
            const list = res.data && res.data.records && Array.isArray(res.data.records) && res.data.records || [];
            const totalCount = Number(res.total) || 0;
            if (list.length === this.pageSize) this.currentPage = this.currentPage + 1;
            if (this.storyList.length === totalCount) {
              this.isNoData = true;
            }
            list.forEach(item => {
              const {title, imgIds, station, name, likeCount, articleId,isLike} = item;
              const str = {
                name,
                imgIds,
                job: station,
                story: title,
                likeCount: likeCount,
                articleId: articleId,
                isLike:isLike
              };
              this.storyList.push(str);
            });
            this.$forceUpdate();
          }
        }).catch(_ => {
          //this.resetScroller();
          // this.$vux.loading.hide();
          uni.hideLoading();
        })
      },
      //取消点赞
      cancalLike(params,item){
        giveArticleLikeCancel(params).then(res => {
          this.like.show = false;
          // this.$vux.loading.hide();
          if (res.status === '200') {
            item.likeCount -= 1;
            item.isLike = 0;
          }
          uni.showToast({
            title: res.message,
            type: 'text',
            icon: 'none',
            position: 'center'
          })
        }).catch(_ => {
           this.like.show = false;
          // this.$vux.loading.hide()
        })
      },
      // 点赞
      giveLike(item) {
        //this.$vux.loading.show({text: '点赞中...'});
        this.like.show = true;
        const { MEMBER_ID ,O_USER_INFO} = this.$constant;
        const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        let userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
        let params = {
          loadingText: '点赞中',
          data: {
            businessId: item.articleId,
            likeType: '1',
            userId: memberId,
            userName: userInfo.fullName,
          }
        }
        if(item.isLike == 1){
          this.cancalLike(params,item)
          return
        }
        giveArticleLike(params).then(res => {
          this.like.show = false;
          // this.$vux.loading.hide();
          if (res.status === '200') {
            item.likeCount += 1;
            item.isLike = 1;
          }
          uni.showToast({
            title: res.message,
            type: 'text',
            icon: 'none',
            position: 'center'
          })
        }).catch(_ => {
           this.like.show = false;
          // this.$vux.loading.hide()
        })
      },
      // 重置Scroller
      resetScroller() {
        this.$nextTick(_ => {
          const isNoData = this.isNoData;
          const containerEle = $('.xs-plugin-pullup-container');
          const display = isNoData ? 'none' : 'block';
          const padding = isNoData ? '0rpx' : '40rpx';
          this.scrollerStatus.pullupStatus = 'default';
          containerEle.css('display', display);
          $('.scl-wr').css('padding-bottom', padding);
        })
      },
      // 查看评论
      // viewDetail(params) {
      //   const {path, data} = params || {};
      //   this.$router.push({path: path, query: {articleId: data.articleId}});
      // },

      //查看详情
      viewDetail(str) {
        // const {path, data} = params || {};
        // this.$router.push({path: path, query: {articleId: data.articleId}});
        uni.navigateTo({url: `/pages-d/sunStory/sunStoryDetail?articleId=${str.articleId}`});
      },
     //更多评论
      viewDetails(str) {
        uni.navigateTo({url: `/pages-d/sunStory/sunStoryComment?articleId=${str.articleId}`});
      },
      // 评论
      showComment(params) {
        const {show, data} = params || {};
        this.comment.show = show;
        if (data.articleId !== this.comment.id) this.comment.text = '';
        this.comment.id = data.articleId;
      },
      // 评论
      addComment() {
        const {id, text} = this.comment;
        const role = this.role;
        if (text.trim() === '') return uni.showToast({
	         title: '评论不能为空',
           position: 'center'
           });
        const {O_USER_INFO } = this.$constant;
        const {STRG_memberId, STRG_realName} = util.storageAction({ key: O_USER_INFO, action: 'get' });
        const params = {
          loadingText: '评论中',
          data: {
            articleId: id,
            content: text,
            userId: STRG_memberId,
            userName: STRG_realName,
            // likeType: 2,
            userType: role !== null && role === 2 ? 1 : 0,
          },
          responseToast: false
        };

        getCommentAdd(params).then(res => {
          uni.hideLoading()
          let tips = '';
          if (res.status == 200) {
            tips = '评论成功';
            this.comment.show = false;
            this.comment.id = '';
          }
          else {
            tips = res.message;
          }
          if (tips) uni.showToast({
            title: tips,
            duration: 2000,
            icon: 'none',
          });
        }).catch()
      },
      // 获取用户类型
      getUserType() {
        uni.showLoading({ title: '加载中'})
        selectSupremePosition({memberId: this.memberId,projectId:this.projectId}).then(res => {
          this.$vux.loading.hide();
          if (res.status === '200') {
            this.role = res.data && res.data.hasOwnProperty('supremePosition') && res.data.supremePosition || null;
          }
        }).catch(_ => this.$vux.loading.hide())
      },
      // 设置微信配置
      setWxConfig() {
        const targetUrl = window.location.href.split('#')[0];
        const { PROJECT_TYPE } = this.$constant;
        const projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
        if (!this.isWx) return;
        putJsSDKConfig(targetUrl, projectType).then(res => {
          res.data.jsApiList.concat(['updateAppMessageShareData', 'updateTimelineShareData']);
          res.debug = false;
          this.$wechat.config(res.data);
        });
      },
    },
    onLoad() {
      const { AREA_ID, PROJECT_ID } = this.$constant;
      let projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      let areaId = util.storageAction({ key: AREA_ID, action: 'get' });
      this.projectId = projectId
      this.areaId = areaId
      this.getArticleList();
      // this.setWxConfig();
    },
  }
</script>


