<style lang="scss" scoped>
$search-h: 108rpx;
$btn-h: 120rpx;

.category {
  width: 100%;
  min-height: calc(100vh - $btn-h);
  background-color: #f3f5f9;
  box-sizing: border-box;
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
    height: calc(100vh - $search-h - $btn-h);
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
      flex: 1;
      height: 100%;
      background-color: #fff;
      .cell {
        border-bottom: 1px solid #edebeb;
      }
    }
    .column-1 {
      background-color: #fff;

    }
    .column-2 {
      background-color: #f6f6f6;
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
        border-bottom: 1px solid  #d7d7d7;
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
.btn-panel {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 40rpx;
  box-sizing: border-box;
}
</style>

<template>
  <view class="category" :style="[THEME_CSS_VAR]">
    <view class="search-area">
      <u-search v-model="keyword" :showAction="false" shape="square" @search="search(true)"></u-search>
    </view>
    <view class="category__list">
      <view :class="[`column-${index + 1}`, 'column']" v-for="(col, index) in columnData" :key="index">
        <text @click="clickCell({ colIdx: index, cellIdx: i })" :class="['cell', cellClassName({ colIdx: index, cellIdx: i })]" v-for="(d, i) in col.list" :key="i">{{ d.title }}</text>
      </view>
    </view>

    <view class="btn-panel">
      <u-button text="取消" plain type="primary" @click="cancelEvent" />
      <u-button text="确认" type="primary" :customStyle="{ marginLeft: '30rpx' }" @click="confirmEvent" />
    </view>
    <u-safe-bottom />
  </view>
</template>

<script>
import { getServerTypeByTypeReport } from '@/service/landcrm';
export default {
  data() {
    return {
      keyword: '',
      columnData: [],
      originData: [],
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
      const columnData = this.columnData
      let parentIndex = []
      for (let index = columnData.length - 1; index >= 0; index--) {
        const item = columnData[index]
        if (colIdx > index) {
          item.index = parentIndex[index]
        } else if (colIdx === index) {
          item.index = cellIdx
          item.expand = cellIdx
          parentIndex = item.parentIndex
        } else if (colIdx < index) {
          item.index = -1 // 如果是只能选择到末级，则 index = 0；如果是选择任意一级，则 index = -1
          item.expand = 0
          for (let j = colIdx, l = item.parentIndex.length; j < l; j++) {
            item.parentIndex[j] = j == colIdx ? cellIdx : 0
          }
        }
      }
      this.search();
    },
    // 确认事件
    confirmEvent() {
      const data = {id: '', text: '', list: []}
      this.columnData.some((item, i) => {
        const { list, index } = item
        if (index == -1 || list.length == 0) return true
        const {serverId, title} = list[index] || {}
        data.text += `${data.text ? '-' : ''}${title}`

        const node = list[index]
        data.list.push({ serverId: node.serverId || '', title: node.title || '' })
      })

      data.id = (data.list.slice(-1)[0] || {}).serverId || ''

      uni.$emit('updateQuestionType', {type: '', data})
      uni.navigateBack()
    },
    cancelEvent() {
      uni.navigateBack()
    },
    // 搜索
    search(nonReset) {
      const noKeyword = this.keyword.trim() == ''
      const originData = JSON.parse(JSON.stringify(this.originData));
      const d = this.filterByKeyword(originData)
      if (nonReset) this.columnData.forEach(item => {
        item.index = 0;
        item.list = []
      })
      this.updateColumnData(noKeyword ? null : d)
    },
    // 获取问题分类
    getCategoryData(option) {
      const { typeReport } = option || {}
      const { COMPLANY_ID } = this.$appConfig
      const params = {
        data: {
          typeReport,
          companyId: COMPLANY_ID,
        },
      };
      getServerTypeByTypeReport(params).then((res) => {
        if (res.success) {
          const data = res.data || [];
          const { children } = data[0] || {}
          this.originData = children || [];
          // 初始化数据列表
          this.initDataStructure();
          this.updateColumnData();
        }
      });
    },
    // 初始化数据结构
    initDataStructure() {
      const data = this.originData || [];
      // 初始化数据列表
      const colunm = this.findNestedCount(data);
      this.columnData = []
      if (colunm) {
        for (let i = 0; i < colunm; i++) {
          const expand = 0
          this.columnData.push({
            expand,
            index: -1, // 如果是只能选择到末级，则 index = 0；如果是选择任意一级，则 index = -1
            parentIndex: Array(i).fill(expand),
            list: [],
          });
        }
      }
    },
    // 加载列表数据
    updateColumnData(data) {
      const originData = JSON.parse(JSON.stringify(data || this.originData));
      const columnData = this.columnData;
      let reference = originData;
      columnData.forEach((item, i) => {
        const expand = columnData[i].expand
        if (reference) {
          item.list = reference;
          reference = reference[expand]?.children || null;
        } else {
          item.list = [];
          reference = null;
        }
      });
    },
    // 查出多少列
    findNestedCount(data) {
      let count = 0;
      const max = [];
      const nonEmpty = !!(Array.isArray(data) && data.length);
      const recursion = ({ array, level }) => {
        array.forEach((item) => {
          const { children } = item || {};
          const hasChildren = children && Number(children.length) > 0;
          if (hasChildren) {
            recursion({ array: children, level: level + 1 });
          } else {
            max.push(level);
          }
        });
      };
      if (nonEmpty) {
        recursion({ array: data, level: 1 });
        count = Math.max.apply(null, max);
      }
      return count;
    },
    // 过滤数据
    filterByKeyword(data) {
      const keyword = this.keyword.trim()
      const recursion = ({ array, level }) => {
        const length = array.length - 1
        let arrayHasKeyword = false
        for (let i = length; i >= 0; i--) {
          const { children, title = '' } = array[i] || {};
          const hasChildren = children && Number(children.length) > 0;
          const hasKeyword = title.includes(keyword)
          if (!arrayHasKeyword && hasKeyword) arrayHasKeyword = true
          if (hasChildren && !hasKeyword) {
            const childrenHasKeyword = recursion({array: children})
            if (!childrenHasKeyword) array.splice(i, 1)
            if (!arrayHasKeyword && childrenHasKeyword) arrayHasKeyword = true
          } else {
            if (!hasKeyword) array.splice(i, 1)
          }
        }
        return arrayHasKeyword
      };
      recursion({array: data, level: 1})
      return data
    },
  },
  onLoad(option) {
    this.getCategoryData(option);
  },
};
</script>
