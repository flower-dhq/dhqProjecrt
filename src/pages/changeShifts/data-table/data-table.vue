<template>
  <div>
    <div class="buttonGroup">
      <slot name="toolButtons"></slot>
    </div>
    <div class="rightTable">
      <Table
      stripe
      :size="tableSize"
      :loading="loading"
      :border="border"
      :width="width"
      :columns="cols"
      :data="dataCurrent"
      :checkBox="checkBox"
      :max-height="height"
      @on-selection-change="onSelectChange"
      @on-select-all="onSelectAll"
      @on-expand="onExpand"
    ></Table>
    <Page
      :size="pSize"
      ref="paging"
      v-if="pagingOption.showPaging"
      :total="totalNum"
      style="margin-top:5px;text-align: right"
      :show-total="pagingOption.showTotal"
      show-sizer
      :page-size="pageSizes"
      :page-size-opts="pageSizeList"
      @on-change="changePage"
      @on-page-size-change="_nowPageSize"
    ></Page>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted,onBeforeMount,watch } from 'vue';

let  current = ref(1)
let  pageSize = ref(10)
let  dataCurrent = ref([])
let  loading = ref(true)
let  totalNum = ref(0)
let  initPage = ref(1)
let  selection = ref([])
      
let  maxHeight = ref(714)

const props = defineProps({
  tableData: {
      type: Array
    },
  border: {
      type: Boolean,
      default: false
    },
  border: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String,
      require: true
    },
    pageSizeList: {
      type: Array,
      default: () => [5, 10, 20, 30]
    },
    pagingOption: {
      type: Object,
      default: function () {
        return {
          showPaging: true,
          showTotal: true
        }
      }
    },
    cols: {
      type: Array
    },
   
    checkBox: {
      type: Boolean,
      default: false
    },
    tableSize: {
      type: String
    },
    pSize: {
      type: String
    },
    total: {
      type: Number
    },
    pageSizes: {
      type: Number,
      default: 10
    }
})
// watch(tableData,() => {
//        loading.value = false;
//         if(newValue){
//           getData(initPage.value)
//       }
//   },{ deep: true}
// )
// watch(total,()=>{
//   maxHeight.value = height
// }, { deep: true})
// watch(height,()=>{
//   totalNum.value = total
// }, { deep: true})

const  getData = (pageNum) => {
      dataCurrent.value = tableData.value.slice(
        pageSize.value * (pageNum.value - 1),
        pageSize.value * pageNum.value
      )
    }
    /* 多选触发事件 */
const  onSelectChange = (selection) => {
      this.$emit('onSelectChange', selection)
    }
    /* 全选触发事件 */
const  onSelectAll = (selection) => {
      this.$emit('onSelectAll', selection)
    }

    /* 展开列表触发 */
const    onExpand = (value) => {
      this.$emit('onExpand', value)
    }

    /* 改变当前页 */
const  changePage = (value) => {
      this.$emit('changePage', value)
    }

    // 每页显示的数据条数
const _nowPageSize = (index) => {
      // 实时获取当前需要显示的条数
      pageSize.value = index
      this.$emit('changePageSize', index)
    }

  //初始化
onMounted(() => {
  // pageSize.value = pageSizes
  getData(initPage)

  if (checkBox.value) {
      cols.value.unshift({
        type: 'selection',
        width: 60,
        align: 'center'
      })
    }
});



</script>
 
<style  scoped lang="scss">
  .rightTable :deep(.ivu-table-wrapper > .ivu-table > .ivu-table-body){
    height: calc(100vh - 268px);
    /* overflow-y: scroll; */
    overflow-x: auto;
  }
  .ivu-table-border{
    border-color: white;
  }

  .buttonGroup {
    text-align: right;
    
  }
  .ivu-table-overflowY{
    margin-right: -10px;
  }
</style>
