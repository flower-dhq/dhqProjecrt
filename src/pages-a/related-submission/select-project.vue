<style lang="scss" scoped>
.select-project {
	$bgc: #f2f2f2;
  width: 100%;
  min-height: 100vh;
  background-color: $bgc;
  box-sizing: border-box;
  $search-h: 108rpx;
  .search-area {
    @include flx-dsp($jsc: flex-start, $ali: center);
    width: 100%;
    height: $search-h;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20rpx 20rpx 20rpx 24rpx;
    .buttons {
      margin: 0 10px;
      height: 100%;
      text {
        display: inline-block;
        height: 100%;
        font-size: 28rpx;
        line-height: 68rpx;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  &__list {
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    position: relative;
    width: 100%;
    height: calc(100vh - $search-h);
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #eee;
      transform: translateY(-50%);
    }
    & > view {
      height: 100%;
      overflow-y: auto;
    }
    .column {
      height: 100%;
      .cell {
        border-bottom: 1px solid #edebeb;
				font-size: 28rpx;
				text-align: left;
				padding-left: 28rpx;
      }
    }
    .column-1 {
      width: 260rpx;
			.active-cell{
				background-color: #fff;
			}
    }
    .column-2 {
      flex: 1;  
      background-color: #fff;
      .cell {
        border-bottom: 1px solid #e7e7e7;
				
      }
    }
    .column-3 {
      background-color: #ebebeb;
      .cell {
        border-bottom: 1px solid #ddd;
      }
    }
    .column-4 {
      background-color: #e5e5e5;
      .cell {
        border-bottom: 1px solid #d7d7d7;
      }
    }
    .level-two {
      width: 240rpx;
      background-color: #f6f6f6;
      .cell {
        border-bottom: 1px solid #ddd;
      }
    }
    text.active-cell {
      color: var(--app-primary-color);
    }
    .cell {
      width: 100%;
      display: inline-block;
      box-sizing: border-box;
      padding: 30rpx;
      font-size: 30rpx;
      color: #333;
      text-align: center;
    }
  }
}
</style>

<template>
  <view class="select-project" :style="[THEME_CSS_VAR]">
    <view class="search-area">
      <u-search v-model="keyword" :showAction="false" shape="square" @search="search"></u-search>
    </view>
    <view class="select-project__list">
      <view :class="[`column-${index + 1}`, 'column']" v-for="(col, index) in columnData" :key="index">
        <text @click="clickCell({ colIdx: index, cellIdx: i })" :class="['cell', cellClassName({ colIdx: index, cellIdx: i })]" v-for="(d, i) in col.list" :key="i">{{ d.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getAreaList, getProjectList } from '@/service/landcrm';
export default {
  data() {
    return {
      keyword: '',
      columnData: [
        {
          index: 0,
          list: [],
        },
        {
          index: 0,
          list: [],
          areaId:'',
        },
      ],
      option: {},
     };
  },
  methods: {
    // 类名
    cellClassName({ colIdx, cellIdx }) {
      const index = this.columnData[colIdx].index;
      return index === cellIdx ? 'active-cell' : '';
    },
    // 点击分类单元
    clickCell({ colIdx, cellIdx }) {  
      const { goback } = this.option
      const columnData = this.columnData;
      const clickFirstCol = colIdx === 0
      const clickLastCol = columnData.length === colIdx + 1;
      columnData.forEach((item, index) => { 
        if (index === colIdx) {
          item.index = cellIdx;
        } else if (colIdx < index) {
          item.index = 0;
          item.list = []
        }
      });
      if (clickFirstCol) this.relatedLoading();
      if (clickLastCol) {
        const data = {};
        columnData.forEach((item, i) => {
          const { list, index } = item;
          const d = list[index] || {};
          const { id, label } = d || {};

          if(i + 1 === columnData.length) {
            const { areaId,areaName } = this.columnData[1];
            Object.assign(data, {...d, id, text: label,areaId,areaName})
          }
        });
         uni.$emit('select-project', {type: '', data})
        if (goback == 1) { 
          uni.navigateBack()
        } else { 
          uni.navigateTo({url: `/pages-a/related-submission/select-unit?projectId=${data.id}`})
        }
      }
    },
    // 搜索
    search() {},
    // 确定
    confirm() {},
    // 获取区域数据
    getAreaData(option) {
      const {} = option || {};
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        data: {
          userId: userInfo.userId,
         },
        hideLoading: true,
				responseToast: false
      };
      return getAreaList(params).then((res) => {
        if (res.items) {
          const data = res.items || [];
          data.forEach(item => {
            const { areaName, areaId} = item;
            item.label = areaName
            item.id = areaId
          })
          this.columnData[0].list = data
 
         }
      });
    },
    // 获取项目数据
    getProjectData(option) {
      const {} = option || {};
      const columnData = this.columnData
      const {index, list = []} = columnData[0]
      const { id,areaName } = list[index] || {}; 
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        data: {
          userId: userInfo.userId,
          areaId: id
        },
        hideLoading: true,
				responseToast: false
      };
      if (!id) return Promise.resolve()
      return getProjectList(params).then((res) => {
        if (res.items) {
          const data = res.items || [];
          data.forEach(item => {
            const { projectName, projectId} = item;
            item.label = projectName
            item.id = projectId
          })
          this.columnData[1].list = data;
          this.columnData[1].areaId = id;
          this.columnData[1].areaName = areaName;
          }
      });
    },
    // 关联加载
    async relatedLoading(type) {
      uni.showLoading({ title: '加载中'});
      if (type == 'area') await this.getAreaData().catch(_ => {});
      await this.getProjectData().catch(_ => {})
      uni.hideLoading()
    }
  },
  onLoad(option) {
    this.option = option
    this.relatedLoading('area');
  },
};
</script>
