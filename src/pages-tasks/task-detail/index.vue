<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <u-tabs :current="curTab.index" :list="tabList" :scrollable="false" :lineWidth="70" :lineHeight="2" @click="tabChange" 
      :activeStyle="{fontWeight: '400',fontSize: '26rpx',color: '#2761FF'}" 
      :inactiveStyle="{fontWeight: '400',fontSize: '26rpx',color: '#666666 '}"/>
    </u-sticky>

    <parent v-if="curTab.id == 'allTasks'" key="allTasks" :taskId="taskId" />
    <children v-if="curTab.id == 'subTasks'" key="subTasks" :taskId="taskId" />
  </view>
</template>

<script>
import Parent from './parent.vue'
import Children from './children.vue'

/**
 * 任务详情
 */
export default {
  components: {
    Parent,
    Children
  },
  data() {
    return {
      curTab: {
        index: 0,
        id: 'allTasks'
      },
      tabList: [
        { name: '任务详情', id: 'allTasks' },
        { name: '子任务执行情况', id: 'subTasks' }
      ],
      taskId: ''
    }
  },
  onLoad(query) {
    this.taskId = query.taskId
  },
  methods: {
    tabChange(val) {
      this.curTab.index = val.index
      this.curTab.id = val.id
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
::v-deep .u-tabs {
  background-color: #fff;
  border-bottom: 1px solid #e9eaec;
}
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 0px !important;
  border-radius: 0px !important;
}
::v-deep .u-search {
  padding: 14rpx 24rpx;
  border-bottom: 1px solid #EAEAEA;
  background-color: #fff;
  z-index: 10;
  position: relative;

  .u-search__content__input {
    height: 56rpx !important;
  }
}
::v-deep .u-search .u-search__content__input{
	font-size: 26rpx !important;
}
::v-deep .uni-table-td {
  vertical-align: top;
  padding: 5px;
}
::v-deep .uni-table {
  min-width: 475px !important;
}
</style>