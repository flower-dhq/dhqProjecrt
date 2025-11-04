<style lang="scss" scoped>
  .test {
    padding: 30rpx;
    box-sizing: border-box;
    .hr {
      width: 100%;
      height: 30rpx;
    }
    .skin-shape {
      width: 200rpx;
      height: 200rpx;
      background-color: var(--app-primary-color);
      @include flx-dsp($jsc: center, $ali: center);
      color: #fff;
      border-radius: 10rpx;
      font-size: 24rpx;
      margin: 0 0 20rpx 10rpx;
    }
    .mgb20 {
      margin-bottom: 20rpx;
    }
  }
</style>

<template>
  <view class="test" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    
    <view class="hr"></view>
    <u-tag text="标签"></u-tag>
    <u-tag text="标签" type="warning"></u-tag>
    <u-tag text="标签" type="success"></u-tag>
    <u-tag text="标签" type="error"></u-tag>

    <text class="iconfont icon-service">&#xe64b;</text>
    <view class="hr"></view>
    <u-button type="primary" text="按钮"></u-button>
    <view class="hr"></view>

    <u-calendar @close="calendar = false" :show="calendar"></u-calendar>
    <u-button @click="calendar = true">打开日历</u-button>
    <view class="hr"></view>

    <u-checkbox-group v-model="checkboxValue1">
      <u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList1" :key="index" :label="item.name" :name="item.name"> </u-checkbox>
    </u-checkbox-group>
    <view class="hr"></view>

    <u-radio-group v-model="radiovalue1" placement="column">
      <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.name"> </u-radio>
    </u-radio-group>
    <view class="hr"></view>

    <u-switch v-model="switchVal"></u-switch>

    <view class="hr"></view>
    <text>自定义样式</text>
    <u-button text="主题-default" @click="changeTheme('default')"></u-button>
    <view class="hr"></view>
    <u-button text="主题-test" @click="changeTheme('test')"></u-button>
    <view class="hr"></view>
    <view class="skin-shape">
      <text>图形</text>
    </view>
  </view>
</template>

<script>
  import utils from '@/js/utils';
  import commLogic from '@/js/comm-logic';
  import { loginByMemberId } from '@/service/api-gateway';
  export default {
    data() {
      return {
        rate: 5,
        value1: 0,
        project: process.env.VUE_APP_TEST,
        calendar: false,
        checkboxValue1: ['苹果'],
        // 基本案列数据
        checkboxList1: [
          {
            name: '苹果',
            disabled: false,
          },
          {
            name: '香蕉',
            disabled: false,
          },
          {
            name: '橙子',
            disabled: false,
          },
        ],
        radiolist1: [
          {
            name: '苹果',
            disabled: false,
          },
          {
            name: '香蕉',
            disabled: false,
          },
          {
            name: '橙子',
            disabled: false,
          },
          {
            name: '榴莲',
            disabled: false,
          },
        ],
        // u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
        radiovalue1: '苹果',
        switchVal: true,
      };
    },
    components: {
      // cUSwitch
    },
    onLoad() {
      const { MEMBER_ID } = this.$constant;
      const { projectType } = commLogic.getProjectConfig();
      const memberId = utils.storageAction({ key: MEMBER_ID, action: 'get'});
      loginByMemberId({data: {memberId: memberId, equipment: 'MP'}, header: {'x-applet-id': projectType}, loadingText: '授权中'})
    },
    methods: {
      changeTheme(theme) {
        const { THEME } = this.$constant;
        uni.setStorageSync(THEME, 'theme-' + theme);
        this.updateGlobalTheme();
      },
    },
  };
</script>
