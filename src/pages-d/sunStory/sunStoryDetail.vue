<style scoped lang="scss">
  @mixin flx-dsp($jsc, $ali, $drt:row) {
    display: flex;
    flex-direction: $drt;
    justify-content: $jsc;
    align-items: $ali;
  }
  .sun-story-detail {
    height: 100vh;
    background-color: #f5f5f5;
    &-cont {
      background-color: #fff;
      padding-top: 10rpx;
      box-sizing: border-box;
      .cont-wr {
        margin: 0 auto;
        width: 700rpx;

        & > h3 {
          color: #333;
          font-size: 30rpx;
          margin: 30rpx auto;
          text-align: center;
        }
        & > view {
          width: 100%;
          // padding-bottom: 30rpx;
         p {
            font-size: .28rem;
            line-height: .3rem;
            color: #333;
            background-color: red;
          }
          & > p:nth-of-type(1){
            text-indent: 16px;
          }
          img {
            border-radius: 10rpx;
          }
        }
      }
    }
    .base-lien {
      position: relative;
      margin: 30rpx auto 20rpx auto;
      width: 400rpx;
      height: 80rpx;
      @include flx-dsp($jsc: center, $ali: center);
      font-size: 30rpx;
      & > p {
        width: 100%;
        height: 1px;
        background-color: #e0e0e0;
      }
      & > span {
        position: absolute;
        top: 50%;
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

  }
</style>

<template>
  <view class="sun-story-detail">
    <!-- 故事 -->
    <view class="sun-story-detail-cont">
      <view class="cont-wr">
        <h3>{{story.title}}</h3>
        <view class="html" v-html="story.html" style="padding-bottom:30rpx"></view>
      </view>
    </view>

    <view class="base-lien">
      <p class="line"></p>
      <span>已无其它内容</span>
    </view>

  </view>
</template>

<script>
  import {getStoryDetail, readStoryCount, storyShareCount, addClickCountById} from '../../service/wxmanage';
  // import {putJsSDKConfig} from '@/service/getData.js';
  import util from '@/js/utils';
  import comMethod from '@/js/commonMethod.js';
  export default {
    name: "sunStoryDetail",
    data() {
      return {
      articleId: "",
        story: {
          title: '',
          html: ''
        },
        isNoData: false,
        currentPage: 1,
        pageSize: 10,
        // isWx: comMethod.isWeixin(),
        memberId:'',
      }
    },
    methods: {
      // 下拉加载更多数据
      loadMore() {
        if (this.isNoData) {
          uni.showToast({
            title: '已经到底了',
            type: 'text',
            icon: 'none',
            position: 'center'
          })
        } else {
          this.getArticleList();
        }
      },
      // 获取列表
      getStoryDetail() {
        uni.showLoading({ title: '加载中'})
            let params = {
             pathParams: `/${this.articleId}`
            }
        getStoryDetail(params).then(res => {
          uni.hideLoading()
          if (res.status === '200') {
            const {title, content} = res.data || {};
            this.story = {
              title,
              html: content
            };
            console.log(135,this.story);
          }
        }).catch(_ => {
          uni.hideLoading()
        })
      },
      // 阅读计数
      readStoryCount () {
        const { MEMBER_ID} = this.$constant;
        let memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        addClickCountById({
          data: {articleId: this.articleId,userId:memberId}
        });
      },
      // 设置微信配置
      setWxConfig() {
        const targetUrl = window.location.href.split('#')[0];
        const { PROJECT_TYPE} = this.$constant;
        const projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
        if (!this.isWx) return;
        putJsSDKConfig(targetUrl, projectType).then(res => {
          res.debug = false;
          this.$wechat.config(res.data);
          this.wxShare();
        });
      },
      // 分享
      wxShare() {
        if (this.isWx) {
          const _this = this;
          this.$wechat.ready(_ => {
            _this.$wechat.onMenuShareTimeline({
              title: _this.story.title,
              link: location.href, //域名必须和安全域名保持一致
              imgUrl: '', //域名必须和安全域名保持一致
              success: () => {
                storyShareCount([this.articleId]);
              },
              cancel: () => {
                uni.showToast({
                    title: '分享失败',
                    type: 'text',
                    icon: 'none',
                    position: 'center'
                  })
              },
              error: () => {

              }
            });

          })
        }
      }
    },
    onLoad(e) {
      this.articleId = e.articleId
      console.log(192,e)
      const { MEMBER_ID} = this.$constant;
      console.log(this.$constant)
      let memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      this.memberId = memberId
      console.log(196,this.memberId)
      // this.setWxConfig();
      this.getStoryDetail();
      this.readStoryCount();

    },
  }
</script>


