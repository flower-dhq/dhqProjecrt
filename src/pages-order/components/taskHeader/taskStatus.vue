<template>
  <view class="list-wrap">
    <view :class="['item-wrap', { active: taskState == item.value }]" v-for="(item, index) in list" :key="index" @click="handleSelect(item)">
      <view class="list-name">{{ item.label }}</view>
      <text v-if="taskState == item.value" class="iconfont select-icon">&#xe786;</text>
    </view>
  </view>
</template>

<script>
export default {
  name:"taskStatus",
  data() {
    return {
      list: [
        { value: '0', label: '待派单' },
        { value: '1', label: '待接单' },
        { value: '6', label: '待审核' },
        { value: '2', label: '处理中' },
        { value: '3', label: '待确认' },
        { value: '4', label: '已关闭' }
      ],
      taskState: ''
    }
  },
  methods: {
    handleSelect(item) {
      this.taskState = this.taskState === item.value ? '' : item.value
      let params = {
        taskState: this.taskState,
        nowFresh: true
      }
      this.$emit('updateData', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrap {
  width: 100%;
  font-size: 30rpx;
  .item-wrap {
    padding: 30rpx;
    border-bottom: 1rpx solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .list-name {
      flex: 1;
    }
    .select-icon {
      font-size: 36rpx;
    }
  }
  .active {
    color: #2761ff;
  }
}
</style>
