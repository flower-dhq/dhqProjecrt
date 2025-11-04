<style lang="scss" scoped>
.questionnaire-detail {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 24rpx 20rpx 44rpx 20rpx;
  background-color: #f3f5f9;

  &.pdb {
    padding-bottom: 128rpx;
  }
  .card-style {
    width: 100%;
    padding: 24rpx 30rpx 12rpx 30rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12rpx;
  }
  .person-info {
    margin-bottom: 24rpx;
    .info-top {
      @include flx-dsp($jsc: space-between, $ali: flex-start);
      .info-text {
        width: 87%;
        text {
          display: block;
        }
        text:nth-child(1) {
          color: #222;
          font-size: 30rpx;
        }
        text:nth-child(2) {
          color: #666;
          font-size: 28rpx;
          margin-top: 24rpx;
          margin-bottom: 16rpx;
          @include ellipsis(1);
        }
      }
      .status-text {
        font-size: 28rpx;
        color: var(--app-primary-color);
        flex: 1;
      }
    }
    .info-bottom {
      position: relative;
      @include flx-dsp($jsc: center, $ali: center);
      height: 80rpx;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        display: block;
        width: 100%;
        height: 1rpx;
        transform: scaleY(50%);
        background-color: #eee;
      }
      .contact {
        margin-right: 190rpx;
      }
      & > view {
        @include flx-dsp($jsc: center, $ali: center);
        & > text {
          margin-left: 12rpx;
          font-size: 28rpx;
          color: var(--app-primary-color);
        }
      }
      .chat {
         ::v-deep  .u-icon__img {
          width: 40rpx !important;
          height: 40rpx !important;
        }
      }
    }
  }
  .questionnaire-info {
    .title {
      display: inline-block;
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    .questions {
      box-sizing: border-box;
      padding: 30rpx;
      .question-item {
        .topic {
          display: inline-block;
          margin-bottom: 40rpx;
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
      }
      .control-ele {
        box-sizing: border-box;
        ::v-deep .u-radio,
        ::v-deep .u-checkbox,
        ::v-deep .u-rate,
        ::v-deep .u-textarea {
          margin-bottom: 40rpx;
        }
      }
    }
  }
  .sendQuestionnaire {
    @include flx-dsp($jsc: center, $ali: center);
    position: fixed;
    left: 50%;
    bottom: 44rpx;
    transform: translateX(-50%);
    width: 670rpx;
    height: 88rpx;
    background: var(--app-primary-color);
    border-radius: 8rpx;
    color: #fff;
  }
}
</style>

<template>
  <view class="questionnaire-detail" :style="[THEME_CSS_VAR]" :class="[personInfo.fiiled ? '' : 'pdb']">
    <!-- 人员信息 -->
    <view class="person-info card-style">
      <view class="info-top">
        <view class="info-text">
          <text>{{ namePhone }}</text>
          <text>{{ personInfo.addresses }}</text>
        </view>
        <text class="status-text">{{ personInfo.statusText }}</text>
      </view>
      <view class="info-bottom">
        <view class="contact" @click="dial">
          <u-icon name="phone" :color="THEME_COLOR" size="22"></u-icon>
          <text>联系客户</text>
        </view>
        <view class="chat" @click="chatAndMassage('chat')">
          <u--text
                  :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)"
                  text="发起会话" type="primary" size="28rpx"
                  :iconStyle="{fontSize: '40rpx', color: THEME_COLOR, marginRight: '4px'}"
                  align="center"
                />
          <!-- <u-icon size="22" name="weixin-fill" :color="THEME_COLOR"></u-icon>
          <text>发起会话</text> -->
        </view>
      </view>
    </view>
    <!-- 问卷信息 -->
    <view class="questionnaire-info card-style">
      <text class="title">问卷内容</text>
      <view class="questions">
        <view class="question-item" v-for="(item, index) in questions" :key="index">
          <text class="topic">{{ index + 1 }}. {{ item.title }} <text style="color: red; margin-left: 4rpx;" v-if="item.required">*</text></text>
          <!-- 单选框 -->
          <view class="control-ele" v-if="item.type == 'radio'">
            <u-radio-group v-model="item.radiovalue" placement="column" @change="" :disabled="disabled" inactiveColor="#666666">
              <u-radio v-for="(item, ri) in item.answer" :key="ri" :label="item.label" :name="item.label" :customStyle="{marginBottom: '30rpx'}" labelSize="30rpx" labelColor="#666666" ></u-radio>
            </u-radio-group>
          </view>
          <!-- 单选框 -->
          <view class="control-ele" v-if="item.type == 'checkbox'">
            <u-checkbox-group v-model="item.checkboxValue" placement="column" @change="" :disabled="disabled" inactiveColor="#666666">
              <u-checkbox :customStyle="{marginBottom: '30rpx'}" labelSize="30rpx" labelColor="#666666" v-for="(item, ci) in item.answer" :key="ci" :label="item.label" :name="item.value"> </u-checkbox>
            </u-checkbox-group>
          </view>
          <!-- 评分 -->
          <view class="control-ele" v-if="item.type == 'rate'">
            <u-rate  :readonly="true" :minCount="0" size="24" inactiveIcon="star-fill" count="5" v-model="item.rateValue" :active-color="THEME_COLOR"  inactiveColor="#d2d2d2"></u-rate>
          </view>
          <!-- 文本 -->
          <view class="control-ele" v-if="item.type == 'input'">
            <u--textarea v-model="item.inputValue" placeholder="请输入" :disabled="disabled"></u--textarea>
          </view>
        </view>
      </view>
    </view>
    <text v-if="!personInfo.finishFlag" class="sendQuestionnaire" @click="chatAndMassage('message')">发送问卷</text>
    <chat-message ref="chatMessage"></chat-message>
  </view>
</template>

<script>
import { viewWxQuestionnaireAnswer } from '@/service/wxmanage';
import ChatMessage from './components/chat-message.vue';
import { getShareConfig,shareToExternalContact } from '@/js/sharePage'

export default {
  data() {
    return {
      personInfo: {},
      questions: [],
      disabled: true,
      options: {},
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      }
    };
  },
  components: {
    ChatMessage,
  },
  computed: {
    namePhone() {
      const { name, phone } = this.personInfo;
      return `${name ? name : '-'} | ${phone ? phone : '-'}`;
    },
  },
  methods: {
    // 加载数据
    getData() {
      const { args, surveyId } = this.options;
      const { memberId } = JSON.parse(decodeURIComponent(args));
      const params = {
        data: {
          mpqId: surveyId,
          userId: memberId,
        },
      };
      viewWxQuestionnaireAnswer(params).then((res) => {
        if (res.success) {
          const { questionnaireMpqExtend } = res.data || {};
          const { questionnaireAnswerValues } = res.data || {};
          const { subjectsList } = questionnaireMpqExtend || {};
          const questions = [];
          if (Array.isArray(subjectsList)) {
            subjectsList.forEach((item) => {
              const { display, title, type, elementList, id, required } = item;
              // display 	显示标识(1:显示 2:隐藏)
              if (display) {
                const d = { id, title, answer: [], required};
                // 题目类型(0:单选 1:多选 2:输入框 3:分值)
                switch (type) {
                  case 0:
                    d.type = 'radio';
                    d.radiovalue = '';
                    break;
                  case 1:
                    d.type = 'checkbox';
                    d.checkboxValue = [];
                    break;
                  case 2:
                    d.type = 'input';
                    d.inputValue = '';
                    break;
                  case 3:
                    d.type = 'rate';
                    d.rateValue = '';
                    break;
                }
                if (Array.isArray(elementList)) {
                  elementList.forEach((item) => {
                    const { id, title } = item;
                    const option = {
                      ...item,
                      label: title,
                      value: id,
                    };
                    d.answer.push(option);
                  });
                }
                questions.push(d);
              }
            });
          }
          //回显答案
          let answer=questionnaireAnswerValues
          if(answer.length>0){
            questions.forEach(item =>{
              answer.forEach(v=>{
                if(item.id==v.subjectsId){
                  console.log('item.type',item.type)
                  switch (item.type) {
                    case 'radio':
                      item.radiovalue = v.text;
                      break;
                    case 'checkbox':
                      item.checkboxValue = v.elements.split(',');
                      break;
                    case 'input':
                      item.inputValue = v.text;
                      break;
                    case 'rate':
                      item.rateValue = v.text;
                      break;
                  }
                }
              })
            })
          }
          this.questions = questions;
        }
      });
    },
    // 校验问卷
    verifyForm() {
      let title = '';
      this.questions.some((item, index) => {
        const { type, radiovalue, checkboxValue, rateValue, inputValue } = item;
        const order = index + 1;
        switch (type) {
          case 'radio':
            title = radiovalue == '' ? `请选择第${order}题` : '';
            break;
          case 'checkbox':
            title = checkboxValue.length == 0 ? `请选择第${order}题` : '';
            break;
          case 'rate':
            title = rateValue == '' ? `请给第${order}题评分` : '';
            break;
          case 'input':
            title = inputValue == '' ? `请填写第${order}题` : '';
            break;
        }
        return !!title;
      });
      if (title) {
        uni.showToast({
          title,
          duration: 2000,
          icon: 'none',
        });
      }

      return !!!title;
    },
    // 提交问卷
    sunbmit() {},
    // 加载参数
    loadOptions() {
      const { args } = this.options;
      const { name, phone, addresses, finishFlag } = JSON.parse(decodeURIComponent(args));
      this.personInfo = {
        name,
        phone,
        addresses,
        statusText: finishFlag == 1 ? '已填写' : finishFlag == 0 ? '未填写' : '未知',
        finishFlag,
      };
    },
    // 会话、发卷
    chatAndMassage(key) {
      const { args } = this.options;
      const data = JSON.parse(decodeURIComponent(args));

      if (key == 'chat') {
        this.$refs.chatMessage.startChat(data)
      } else if (key == 'message') {
        if (!this.shareConfig.materialUrl) {
          uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
          return
        }

        const queryStr = '&id=' + data.relationPushId

        shareToExternalContact({
          type: this.shareConfig.type,
          appid: this.shareConfig.appId,
          title: this.shareConfig.materialTitle,
          desc: this.shareConfig.materialDesc,
          imgUrl: this.shareConfig.materialPicUrl,
          pageUrl: this.shareConfig.materialUrl + queryStr
        })
      }
    },
    // 拨打电话
    dial() {
      uni.makePhoneCall({
        phoneNumber: this.personInfo.phone
      });
    },
  },
  onLoad(options) {
    this.options = options;
    this.loadOptions();
    this.getData();
    getShareConfig('分享问卷').then(res => {
      this.shareConfig = res
    })
  },
};
</script>
