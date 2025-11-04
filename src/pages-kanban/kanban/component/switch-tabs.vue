<style lang="scss" scoped>
.switch-tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  $bdr: 4rpx;
  $t-c: #2761ff;
  .tab-item {
    color: #7d8292;
    font-size: 22rpx;
    border: 1px solid #d1d3d9;
    border-right: none;
    padding: 6rpx 10rpx;
    cursor: pointer;
    min-width: 44rpx;
    text-align: center;
  }
  .tab-item:first-child {
    border-radius: $bdr 0 0 $bdr;
  }
  .tab-item:last-child {
    border-radius: 0 $bdr $bdr 0 !important;
    border-right: 1px solid #d1d3d9 !important;
  }
  .tab-item.active-tab:last-child {
    border-radius: 0 $bdr $bdr 0 !important;
  }
  .active-tab + .tab-item {
    border-right: none;
    border-left: none;
  }
  .tab-item.active-tab {
    color: $t-c;
    border: 1px solid $t-c !important;
  }
}
</style>

<template>
  <view class="switch-tabs">
    <view @click="clickTab(index)" :class="[index == tabIndex ? 'active-tab' : '', 'tab-item']" v-for="(item, index) in tabs">
      {{ item.label }}
    </view>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

export default {
  data() {
    return {
      tabIndex: 0,
    };
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [
          {
            label: i18n.t('万元'),
            value: 2,
          },
          {
            label: i18n.t('元'),
            value: 1,
          },
        ];
      },
    },
  },
  methods: {
    clickTab(index) {
      this.tabIndex = index;
      this.$emit('click', this.tabs[index]);
    },
  },
};
</script>
