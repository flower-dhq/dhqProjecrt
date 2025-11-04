<style scoped lang="scss">
  @mixin flx-dsp($jsc, $ali, $drt:row) {
    display: flex;
    flex-direction: $drt;
    justify-content: $jsc;
    align-items: $ali;
  }
.switop {
    background-color: #F5F5F5;
    padding:48rpx  30rpx;
}
.steward-info {
    display: flex;
    justify-content: space-between;
    align-content: center;
    .steward-info-image ::v-deep image{
      width: 174rpx;
      height: 174rpx;
      overflow: hidden;
      border-radius: 120rpx;
      border: 1px solid #e4e4e4;
      box-sizing: border-box;
      margin-top: 20rpx;
    }
     .stwedInfo {
        flex:1;
        margin-left:50rpx;
     }
    .sttitle {
        display: flex;
        //  justify-content: space-between;
        //  flex-direction: column;
        margin-bottom: 10rpx;
    }
    .sttitle span {
        font-size: 40rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
    }
    .sttitle  ::v-deep image {
     width: 72rpx;
     height: 72rpx;
     margin-left: 120rpx;
     }
     .secondPen ::v-deep image{
        width: 32rpx;
        height: 32rpx;
        margin-right: 20rpx;
     }
     .star-item ::v-deep image{
        width: 30rpx;
        height: 30rpx;
     }
     .secondPen {
        margin: 20rpx 0;
        width: 100%;
        display: flex;
    align-items: center;

     }
     .thirdPen {
        display: flex;
        width: 100%;
        align-items: flex-start;
     }
     .thirdPen ::v-deep image{
       width: 32rpx;
        height: 32rpx;
        margin-right: 20rpx;
     }
   
  }
  .articStyle {
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #444444;
    word-wrap: word-break;
    word-break: break-all;
    flex: 1;
  }
  .evaluation-wrapper {
    .evaluation-title {
      text-indent: 4rpx;
      height: 90rpx;
      line-height: 88rpx;
    font-size: 32rpx;
    background: white;
    border-bottom: 2rpx solid #f5f5f5;
    margin-bottom: 40rpx;
    padding-left: 30rpx;
    box-sizing: border-box;
    }
    .evaluation-star {
      padding: 0 64rpx;
    }
    .star-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
   
    
  }
  .evaluation-tag {
        display: flex;
        margin: 52rpx auto 24rpx auto;
        flex-wrap: wrap;
        // width: 100%;
        -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-wrap: wrap;
        button {
          height: 70rpx;
          line-height: 64rpx;
          text-align: center;
          color: rgba(170, 170, 170, 1);
          outline: none;
          background-color: #fff;
          border: 2rpx solid #d7d7d7;
          font-size: 26rpx;
          margin-bottom: 26rpx;
          box-sizing: border-box;
        }
        .active {
          background: #fcf8ec !important;
          border: 1px solid #C8924B !important;
          color: #C8924B !important;
        }
      }
      .evaluation-des {
        display: block;
        margin: 0 auto;
        width: 100%;
        min-height: 200rpx;
        box-sizing: border-box;
        border: 1px solid rgba(234, 234, 234, 1);
        border-radius: 10rpx;
        padding: 30rpx;
        font-size: 28rpx;
      }
      .uButtonStyle {
        width:100%;

    
      }
      .submit-tips{
      margin: 25rpx auto 0 auto;
      width: 100%;
      @include flx-dsp($jsc: center, $ali: center);
      flex-wrap: wrap;
      color:#333;
      font-size: 28rpx;
      
    }
    .speText{
      text-align: left;
      padding:3px 20px 10px;
      font-size: 28rpx;
    }
      .submit-btn {
      margin: 50rpx auto 0 auto;
      display: block;
      width: 95%;
      line-height: 70rpx;
      background: #C8924B;
      border-radius: 30rpx;
      border: none;
      outline: none;
      text-align: center;
      color: #fff;
      font-size: 28rpx;
      height: 70rpx;
    }
    button::after {
             border: none ;
			}
</style>

<template>
  <view class="housekeeper-evaluation" :style="{'height': submittedEvaluation ? 'auto' : '100%'}">
    <view  class="switop">
        <view class="steward-info"
             v-if="true">
          <view class="steward-info-image">
            <image mode="aspectFill"  :src="steward.image"
                 alt />
          </view>
          <view class="stwedInfo">
            <view class="sttitle">
              <span>{{steward.name}}</span>
            </view>
            <view class=" goEvaluationBox">
              <view class="secondPen">
                <image src="@/static/components/pen.png" alt /> 
                <view class="star-wrapper">
			               <uni-rate :max="5" :value="starScore ? starScore : '0' " :is-fill="false" active-color="#C8924B" color="#cccccc" :readonly="true" size="18"/>
                </view>
                    <p style="color: #444; font-size: 26rpx; margin-left: 20rpx;" v-show="starScore">{{starScore}}分</p>
              </view>
              <view class="thirdPen">
                <image src="@/static/components/heart_icon.png" alt />
                <p v-html="steward.desc" class="articStyle"></p>
              </view>
            </view>
        </view>
      </view>
    </view>
    <view class="evaluation-wrapper">
      <view class="evaluation-title">管家评价</view>
      <view class="evaluation-star">
        <view class="star-wrapper" >
              <uni-rate :max="5" :value="starScore ? starScore : '0' " :is-fill="false" active-color="#C8924B" color="#cccccc"  size="28" @change="onChange" :readonly="evaluated || submittedEvaluation" />
              <p style="margin-left: 10rpx;">{{starScore}}分</p>
      </view>
      <view class="evaluation-tag" v-if="!submittedEvaluation">
        <button type="default" plain="true" :class=" item.selected == true  ? 'active':'' "  @click="clickOperate({type: 'tag', data: item})" v-for="item in tagList" :key="item.id">{{item.text}}</button>
      </view>
      <textarea class="evaluation-des" v-model="evaluationDes" v-if="!submittedEvaluation" :disabled="evaluated" placeholder="请输入您对我的评价（1-200个字）"
        maxlength="200"></textarea>               
      <p class="submit-tips" v-if="submitSuccessTips">{{submitSuccessTips}}</p>
      <button class="submit-btn" v-show="!submittedEvaluation" @click="clickOperate({type: 'submit'})">提交</button>
      
    </view>
    <p class="speText" v-if="submitSuccessTips" v-html="evaluationDes"></p>
  </view>
  </view>
</template>

<script>
	  import Utils from '@/js/utils'
  import {saveStewardEvaluate, getStewardEvaluate, getStewardTag} from '@/service/wxmanage';
  export default {
    name: "housekeeperEvaluation",
    data() {
      return {
        steward: {
          name: '管家名称',
          image: require('@/static/components/default_header.png'),
          desc: '以全心全意的卓越服务，带给用户发自内心的预愉悦。',
          id: '',
          ownerId: ''
        },
        queryInfo: {},
        starScore: 0,
        tagList: [],
        tagListT: [
          {
            text: '细心周到',
            id: '0',
            selected: false
          },
          {
            text: '服务专业',
            id: '1',
            selected: false
          },
          {
            text: '服务态度好',
            id: '2',
            selected: false
          }
        ],
        evaluationDes: '',
        submitSuccessTips: '',
        evaluated: false, // 本月是否已评价过
        submittedEvaluation: false, // 是否已提交评价
        optionUserInfo:''
      }
    },
    onLoad(options){
      let userInfo = JSON.parse(decodeURIComponent(options.option));
      this.optionUserInfo = userInfo
         this.steward.name = userInfo.nickname;
         this.steward.image = userInfo.stewardHeadUrl;
         this.steward.desc =  userInfo.stewardRecord ? userInfo.stewardRecord : this.steward.desc;
         this.steward.id = userInfo.id;
         this.steward.ownerId = userInfo.ownerId;
         this.initData();
    },
    onShow(){
      uni.setNavigationBarTitle({title:'管家评价'})
    },
    methods: {
      onChange(e){
            this.starScore = e.value
      },
      // 评价过提示
      haveEvaluationTips() {
        uni.showToast({
          title: '本月已评价，请不要重复评价',
          icon: 'none',
        });
      },
      // 获取评价标签
      getStewardTags () {
        const pms = getStewardTag();
        pms.then(res => {
          if (res.success) {
            this.tagList = [];
            const list = res.data && Array.isArray(res.data) && res.data || [];
            list.forEach(item => {
              const {content, id} = item;
              this.tagList.push({
                text: content,
                id,
                selected: false
              })
            })
          } else {
            uni.showToast({
                title: res.message || '获取评价标签失败',
                icon: 'none',
              });
          }
        }).catch()
      },
      // 提交评价
      submit() {
				const { MEMBER_ID, PROJECT_ID, COMPLANY_ID, AREA_ID } = this.$constant
        const {id, projectId, buildingId, ownerName, ownerId, addrId} = this.optionUserInfo;
        console.log(326,this.queryInfo)
        const starScore = this.starScore;
        const evaluationDes = this.evaluationDes.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
        console.log(this.evaluationDes, 'ppp')
        if (starScore === 0) {
          return  uni.showToast({
          title: '请对管家进行评价',
          icon: 'none',
        });
        }
        let stewardLabel = '';
        this.tagList.forEach(itm => itm.selected ? stewardLabel += `${itm.text},`: '');
        const params = {
          data:{
            areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
          buildingId,
          creator: ownerName,
          msg: evaluationDes,
          operator: ownerName,
          ownerId,
          ownerName,
          projectId,
          star: starScore,
          addrId,
          roomId: addrId,
          stewardId: id,
          stewardLabel
          },
          responseToast:false,
          hideLoading: true
         
        };

        uni.showLoading({
						title:'提交中',
					})
        const pms = saveStewardEvaluate(params);
        pms.then(res => {
          uni.hideLoading()
          if (res.status !== '200') {
            uni.showToast({
                        title: res.msg,
                        duration: 1000,
                        icon: 'none'
                    })
          } else {
            uni.showToast({
                        title: '提交成功',
                        duration: 1000,
                        icon: 'none'
                    })
            this.submittedEvaluation = true;
            this.tagList.forEach(item => {
              if (item.selected) this.submitSuccessTips += item.text + '、'
            });
            if (this.submitSuccessTips) this.submitSuccessTips = `${this.submitSuccessTips.substring(0, this.submitSuccessTips.length - 1)}的服务态度。`
          }
        }).catch(_ => {
          uni.hideLoading()
        })
      },
      // 获取管家评价详情
      getStewardEvaluate () {
        const {ownerId, id} = this.steward;
        const params = {
          data:{
            stewardId: id,
            ownerId
          },
          responseToast:false,
        hideLoading: true
        };
        const pms = getStewardEvaluate(params);
        pms.then(res => {
          if (res.success || res.status=='200') {
            const {star, stewardLabel = '', msg} = res.data[0];
            this.starScore = star;
            const stewardTag = stewardLabel.replace(/,$/g, '').split(',');
            this.tagList.forEach(item => {
              item.selected = stewardTag.includes(item.text);
            });
            this.evaluated = true;
            // this.evaluationDes = msg;
            if (stewardLabel) this.submitSuccessTips = `${stewardLabel.replace(/,$/g, '')}的服务态度。`
            if (msg != '') this.evaluationDes = msg;
            this.submittedEvaluation = true;
          } else {
            this.evaluated = false;
          }
        }).catch()
      },
      //点击统一操作
      clickOperate (params) {
        const {type = '', data} = params || {};
        const evaluated = this.evaluated;
        const submittedEvaluation = this.submittedEvaluation;
        if (evaluated) {
          this.haveEvaluationTips();
        }
        // else if (type == 'star' && !submittedEvaluation){
        //   this.giveScore(data);
        // }
        else if (type == 'tag') {
			    this.tagList.forEach(item => {
            if(data.id == item.id)
			       item.selected = !item.selected
			     });
        } else if (type == 'submit') {
          this.submit();
        }
      },
      // 初始化数据
      initData () {
        this.getStewardEvaluate();
        this.getStewardTags();
      },
    },
  
  }
</script>


