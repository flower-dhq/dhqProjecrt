<template>
    <dropdown-menu navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="270rpx" :dataForm="filterForm"
      :required="false" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
      <template v-slot="{ item }">
        <dropdown-radio :show="item.name == 'sortType'" required :value="searchForm.sortType" :data="sortTypeList"
          @confirm="confirmEvent('sortType', $event)" />
        <dropdown-project :show="item.name == 'area'" required  @confirm="confirmEvent('area', $event)" />

        <dropdown-know-tree :show="item.name == 'quesCategory'" :value="searchForm.quesCategory" :data="quesCategoryList"
          @confirm="confirmEvent('quesCategory', $event)"  />

        <dropdown-radio :show="item.name == 'screen'" required :value="searchForm.screen" :data="screenList"
          @confirm="confirmEvent('screen', $event)" />
     
      </template>
    </dropdown-menu>
  </template>
  
  <script>
  import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
  import DropdownProject from '@/components/dropdown-area/dropdown-project.vue'
  import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
  import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
  import DropdownKnowTree from '@/components/dropdown-area/dropdown--know-three.vue'
  
  export default {
    name: 'DropdownFilter',
    components: {
      DropdownMenu,
      DropdownRadio,
      DropdownStaff,
      DropdownProject,
      DropdownKnowTree
    },
    props: {
    },
    data() {
      return {
        filterForm: [
          { label: '排序方式', name: 'sortType', icon: 'down-icon' },
          { label: '全部', name: 'area', icon: 'down-icon' },
          { label: '分类', name: 'quesCategory', icon: 'down-icon' },
          { label: '标签', name: 'screen', icon: 'down-icon' }
        ],
        // 排序类型 0-默认排序 1-引用量排序 2-收藏排序 3-创建时间;默认选择默认排序方式；
        sortTypeList: [
          { label: '默认排序', name: '' },//0
          { label: '引用量排序', name: '0' },//1
          { label: '收藏排序', name: '1' },//2
          { label: '创建时间', name: '2' },//3
        ],
        screenList: [
          { label: '全部', name: '' },//0
          { label: '已置顶', name: '1' },//1
          { label: '已收藏', name: '2' },//2
        ],
      
        searchForm: {
          areaId:'',
          projectId:'',
          quesCategory: '',
          sortType: '',
          screen: '',
        }
      }
    },
   
   
    methods: {
      // 显示菜单栏
      showMenuEvent(item) {
      },
      // 隐藏菜单栏
      hideMenuEvent() {
      },
      confirmEvent(name, item) {
        console.log(87,name,item)
        console.log(88,name)
        console.log(89,item)
        this.$refs.dropdownEl.showMaskEvent(false)
  
        if (name == 'area') {
        let projectId = item.project.projectId + ''
        this.filterForm[1].label = projectId.includes('-all') ? item.area.areaName : item.project.projectName
        console.log(83,)
        this.searchForm.areaId = item.area.areaId + ''
        this.searchForm.projectId = projectId.includes('-all') ? '' : projectId // '[areaId]-all'表示区域下的全部项目

      }else if(name == 'quesCategory'){
        console.log(97,item)
        this.searchForm.quesCategory = item.categoryId || null; 
      } else if (name == 'sortType') {
          this.searchForm.sortType = item.name;
          this.filterForm[0].label = item.label || '排序方式'
      } else if (name == 'screen') {
          console.log(98,item.name)
          this.searchForm.screen = item.name || null ;
          this.filterForm[3].label = item.label || '标签'

        }
  
        this.$emit('confirm', this.searchForm)
      },
    }
  }
  </script>
  
  <style></style>