<style lang="scss" scoped>
.oval-tabs {
  $bdr: 24rpx;
  $cl: #2761ff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8rpx 20rpx;
  box-shadow: 0px 0px 40rpx rgba(0, 104, 183, 0.1);
  border-radius: 32rpx;
  background-color: #fff;
  & > view {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bbb;
    font-size: 22rpx;
    height: 48rpx;
    flex: 1;
    line-height: 48rpx;
  }
  view.active-tab {
    color: $cl;
    background-color: $cl;
    color: #fff;
    border-radius: $bdr;
  }
}
</style>

<template>
  <view class="oval-tabs" v-if="tabs.length">
    <view
      @click="clickTab(item)"
      :class="{ 'active-tab': item.value === tabIndex }"
      v-for="(item, index) in tabs"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    tabIndex: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    value: ''
  },
  methods: {
    clickTab(item = {}) {
      const { value } = item
      this.tabIndex = value;
      this.$emit("click", item);
    },
  },
};
</script>
