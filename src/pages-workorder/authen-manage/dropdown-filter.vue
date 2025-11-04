<template>
  <dropdown-menu navHeight="88rpx" :navIndex="10" :contentHeight="contentHeight" maskTop="294rpx" :dataForm="filterForm"
    ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
    <template v-slot="{ item }">
      <!-- 认证状态 -->
      <dropdown-radio :show="item.name == 'taskType'" :value="searchForm.biProblemCategory" :data="taskTypeList" @confirm="confirmEvent('taskType', $event)"/>
      <!-- 院区 -->
      <dropdown-radio :show="item.name == 'houseCompound'" :value="searchForm.houseCompound" :data="houseCompoundList"
        @confirm="confirmEvent('houseCompound', $event)"/>
      <!-- 楼栋 -->
      <dropdown-radio :show="item.name == 'taskState'" :value="searchForm.quesTaskState" :data="taskStatusList"
        @confirm="confirmEvent('taskState', $event)"/>
      <!-- 筛选 -->
      <dropdown-multiple-tree :show="item.name == 'filter'" expand="handleType" :value="getSelectNode"
        :expandObj="['banli']" :data="filterList" nodeKey="name" menuMultiple @confirm="confirmEvent('filter', $event)"
        @reset="dropResetEvent" />
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'
import { getCourtyardByProjectId, getBuildingDetailList } from '@/service/landcrm'
import { getbuldingInfoByParam } from '@/service/community'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownStaff,
    dropdownMultipleTree
  },
  data() {
    return {
      filterForm: [
        { label: '认证状态', name: 'taskType', icon: 'down-icon' },
        { label: '院区', name: 'houseCompound', icon: 'down-icon' },
        { label: '楼栋', name: 'taskState', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' },
      ],
      taskTypeList: [
        { label: '全部', name: '' },
        { label: '认证成功', name: '1' },
        { label: '待认证', name: '2' },
        // { label: '已拒绝', name: '3' },
        // { label: '已取消', name: '4' },
      ],
      houseCompoundList: [],
      taskStatusList: [],
      filterList: [
        // handleType
        {
          label: '身份', name: 'handleType', isRequired: true, children: [
						{ label: '租户', name: '1' },
            { label: '业主', name: '2' },
            { label: '家属', name: '3' },
            { label: '家政', name: '5' },
          ]
        },
        // exception
        {
          label: '来源', name: 'exception', children: [
            { label: '公众号', name: 'wx' },
            { label: 'APP', name: 'app' },
            { label: '微信小程序', name: 'wxMini' }
          ]
        },
      ],
      searchForm: {
        biProblemCategory: '',
        quesTaskState: '',
				houseState:'',
				source:'',
      },
      contentHeight: 'auto', // 下拉菜单的固定高度
    }
  },
  computed: {
    getSelectNode() {
      return {
        handleType: [this.searchForm.houseState],
        exception: [this.searchForm.source]
      }
    }
  },
  methods: {
    // 显示菜单栏
    showMenuEvent(item) {
      if (item.name == 'taskState') {
        this.contentHeight = '700rpx'
      } else {
        this.contentHeight = 'auto'
      }
    },
    // 隐藏菜单栏
    hideMenuEvent() {
    },
    confirmEvent(name, item) {
      this.$refs.dropdownEl.showMaskEvent(false)
      console.log('item===', item)
      const splitStr = (val) => val.split('-').slice(-1)[0] || ''

      if (name == 'taskType') {
        this.searchForm.biProblemCategory = splitStr(item.name);
        this.filterForm[0].label = item.label || '认证状态';
      } else if (name == 'houseCompound') {
        this.searchForm.houseCompound = splitStr(item.name);
        this.searchForm.quesTaskState = ''
        this.filterForm[1].label = item.label || '院区';
        this.filterForm[2].label = '全部'
      }else if (name == 'taskState') {
        this.searchForm.quesTaskState = item.name;
        this.filterForm[2].label = item.label || '楼栋';
      } else if (name == 'filter') {
        this.searchForm.houseState = item?.handleType?.children?.name ?? ''
        this.searchForm.source = item?.exception?.children?.name ?? ''
      }

      this.$emit('confirm', this.searchForm)
    },
    dropResetEvent() {
      this.$refs.dropdownEl.showMaskEvent(false)

      this.searchForm.houseState = ''
      this.searchForm.source = ''

      this.$emit('confirm', this.searchForm)
    },
    // 获取院区
    async getParkList(projectId) {
      const params = {
        data: {
          projectId
        },
        wrapResponse: true
      }
      const res = await getCourtyardByProjectId(params)
      this.houseCompoundList = (res.data || []).map((item) => ({
        label: item,
        name: item
      }))
      this.houseCompoundList.unshift({label:'全部',name:''})
    },
    // 获取楼栋列表，被父组件调用
    async findWorkUserList(areaId, projectId, courtyard='') {
      const params = {
        data: {
          areaId,
          projectId,
          courtyard,
          buildingLocation: '',
          startIndex: 1,
          pageSize: 10000
          // userId:'2063798',//测试用
          // projectId:'293215',//测试用
        },
        hideLoading: true
      }
      const res = await getBuildingDetailList(params)
			let data = res.data
			let list = []
      let allBId = []
      res.data.map(item=>{
        if(item.buildingId){
          allBId.push(item.buildingId)
        }
      })
			list.push({label:'全部',name:'',buildingId:allBId.join(',')})
			data.map(item=>{
				list.push({
					...item,
					label:item.buildingLocation,
					name:item.buildingId
				})
			})
			this.taskStatusList = list
      this.$parent.allBuildingList = list
			this.$emit('upDataBuilding', '')
    },
  }
}
</script>

<style></style>