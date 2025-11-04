<template>
  <view :class="['dropdown-three-tree', getCustomClass]" :style="[getCustomStyle]">
    <scroll-view class="level1" scroll-y scroll-top="0">
      <text :class="['tree-item', { selected: formObj.areaId == item.name, expanded: expandObj.areaId == item.name }]" v-for="(item, index) in areaList" :key="index" @click="reClickEvent('area', item, index)">{{ item.label }}</text>
    </scroll-view>
    <scroll-view class="level2" scroll-y scroll-top="0">
      <text :class="['tree-item', { selected: formObj.projectId == item.name, expanded: expandObj.projectId == item.name }]" v-for="(item, index) in projectList" :key="index" @click="reClickEvent('project', item, index)">{{ item.label }}</text>
    </scroll-view>
    <scroll-view class="level3" scroll-y scroll-top="0">
      <view class="radio-item" v-for="(item, index) in parkList" :key="index" @click="itemEvent('park', item, index)">
        <u-text
          :text="item.label" :suffixIcon="formObj.parkId == item.name ? 'checkmark' : ''" lines="1"
          :iconStyle="{ fontSize: '40rpx', color: THEME_COLOR }"
          :customStyle="{ fontSize: '30rpx', color: formObj.parkId == item.name ? THEME_COLOR : '#333', flex: '1 1 auto' }"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import mpWeixin from '@/js/mixin/mpMixin'
import { getAreaList, getProjectList, getCourtyardByProjectId } from '@/service/landcrm'

/**
 * 区域-项目-院区 树形选择器，单选
 * @property {Array<string|number>} selectData 默认选中的节点。[areaId, projectId, parkId]
 * @event confirm 确认事件。结果: [areaNode, projectNode, parkNode]
 */
export default {
  name: 'DropdownThreeTree',
  mixins: [mpWeixin],
  props: {
    show: Boolean,
    selectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      /**
       * @typedef {Object} Item
       * @property {string} label 文本
       * @property {string|number} name id
       * 
       * @type {Array<Item>}
       */
      areaList: [],
      projectMap: {}, // areaId -> projectList
      parkMap: {}, // projectId -> parkList
      // 需要展开的节点
      expandObj: {
        areaId: '',
        projectId: ''
      },
      formObj: {
        areaId: '',
        projectId: '',
        parkId: ''
      },
      loadArea: false // 区域数据是否已经加载
    }
  },
  computed: {
    projectList() {
      const tmp = this.expandObj.areaId
      return (!!tmp || tmp === 0) ? (this.projectMap[tmp] || []) : []
    },
    parkList() {
      const tmp = this.expandObj.projectId
      return (!!tmp || tmp === 0) ? (this.parkMap[tmp] || []) : []
    }
  },
  async created() {
    // 如果区域数据已经加载，且显示时候，需要设置默认选中节点和默认展开节点
    this.unwatch = this.$watch(
      function(that) {
        return that.loadArea === true && that.show === true
      },
      function(newVal) {
        if (newVal) {
          const { name: areaId, index: areaIndex, item: areaItem } = this.getDefaultNode('area')
          if (areaIndex == -1) return
          this.itemEvent('area', areaItem, areaIndex, { defaultSelect: true })
        }
      },
      { immediate: true }
    )
    this.lazyLoad({ type: 'area' }, () => {
      this.loadArea = true
    })
  },
  beforeDestroy() {
    this.unwatch && this.unwatch()
  },
  methods: {
    // 获取区域
    async getAreaList() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          userId: userInfo.userId
        },
        wrapResponse: true
      }
      const res = await getAreaList(params)
      this.areaList = (res.data.items || []).map((item) => ({
        ...item,
        label: item.areaName,
        name: item.areaId,
      }))
    },
    // 获取项目
    async getProjectList(areaId) {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          userId: userInfo.userId,
          areaId
        },
        wrapResponse: true
      }
      const res = await getProjectList(params)
      this.projectMap[areaId] = (res.data.items || []).map((item) => ({
        ...item,
        label: item.projectName,
        name: item.projectId,
      }))
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
      this.parkMap[projectId] = (res.data || []).map((item) => ({
        label: item,
        name: item
      }))
    },
    /**
     * 节点点击事件
     * @param {object} options
     * @property {boolean} defaultSelect 默认false。是否设置park节点默认被选中
     */
    itemEvent(type, item, index, options = {}) {
      const defaultSelect = options.defaultSelect || false

      if (type == 'area') {
        // 清空数据
        this.expandObj.areaId = ''
        this.expandObj.projectId = ''

        // 加载项目数据
        this.lazyLoad({ type: 'project', item }, () => {
          this.expandObj.areaId = item.name

          // 设置默认节点
          const { name: projectName, index: projectIndex, item: projectItem } = this.getDefaultNode('project')
          if (projectIndex == -1) return
          this.itemEvent('project', projectItem, projectIndex, { defaultSelect })
        })
      } else if (type == 'project') {
        // 清空数据
        this.expandObj.projectId = ''

        // 加载院区数据
        this.lazyLoad({ type: 'park', item }, () => {
          this.expandObj.projectId = item.name

          // 设置默认节点
          if (defaultSelect) {
            const { name: parkName, index: parkIndex, item: parkItem } = this.getDefaultNode('park')
            if (parkIndex == -1) return
            this.itemEvent('park', parkItem, parkIndex)
          }
        })
      } else if (type == 'park') {
        // 点击选中 区域-项目-院区 节点
        const areaTmp = this.formObj.areaId = this.expandObj.areaId
        const projectTmp = this.formObj.projectId = this.expandObj.projectId
        const parkTmp = this.formObj.parkId = item.name

        this.$emit('confirm', [
          this.getNodeByName('area', areaTmp),
          this.getNodeByName('project', projectTmp),
          this.getNodeByName('park', parkTmp)
        ])
      }
    },
    // 避免重复点击事件
    reClickEvent(type, item, index) {
      if (type == 'area' && item.name == this.expandObj.areaId) return
      if (type == 'project' && item.name == this.expandObj.projectId) return
      this.itemEvent(type, item, index)
    },
    // 懒加载数据
    lazyLoad({ type, item }, next) {
      if (type == 'area') {
        // 展开区域
        this.loadArea = false
        this.getAreaList().then(next)
      } else if (type == 'project') {
        // 展开项目
        const parentName = item.name
        if (this.projectMap.hasOwnProperty(parentName)) {
          next()
        } else {
          this.getProjectList(parentName).then(next)
        }
      } else if (type == 'park') {
        // 展开院区
        const parentName = item.name
        if (this.parkMap.hasOwnProperty(parentName)) {
          next()
        } else {
          this.getParkList(parentName).then(next)
        }
      }
    },
    // 通过name获取节点数据
    getNodeByName(type, name) {
      if (type == 'area') {
        const index = this.areaList.findIndex((item) => item.name == name)
        return index == -1 ? {} : this.areaList[index]
      } else if (type == 'project') {
        const index = this.projectList.findIndex((item) => item.name == name)
        return index == -1 ? {} : this.projectList[index]
      } else if (type == 'park') {
        const index = this.parkList.findIndex((item) => item.name == name)
        return index == -1 ? {} : this.parkList[index]
      }
    },
    /**
     * @param {object} options
     * @property {boolean} hasDefault 默认true。如果没有传默认值，是否需要将第一个节点做为默认值
     */
    getDefaultNode(type) {
      const arrMap = {
        area: this.areaList,
        project: this.projectList,
        park: this.parkList
      }
      const arr = arrMap[type] || [] // 数据列表
      const selMap = {
        area: 0,
        project: 1,
        park: 2
      }
      let name = this.selectData[selMap[type]] || '' // id
      let index = arr.findIndex((item) => (name === 0 || !!name) && name == item.name) // 索引

      if (index == -1) {
        // 如果没有传默认值，则直接取第一个节点做为默认值
        name = arr.length ? arr[0].name : ''
        index = arr.length ? 0 : -1
      }

      return {
        name,
        index,
        item: index == -1 ? {} : arr[index]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-three-tree {
  display: flex;
  width: 100%;
  height: 100%;
}
level1, level2, level3 {
  flex: 0 0 33.33%;
  height: 100%;
  overflow: hidden;
}
.level1 {
  background-color: #f4f6f9;
}
.level2 {
  background-color: #eff1f5;
}
.level3 {
  background-color: #ffffff;
}
.tree-item {
  display: block;
  width: 100%;
  height: 102rpx;
  line-height: 102rpx;
  font-size: 30rpx;
  color: #333;
  text-align: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  @include ellipsis(1);

  &.selected {
    color: var(--app-primary-color);
  }
  &.expanded {
    background-color: #fff;
  }
}
.radio-item {
  display: flex;
  align-items: center;
  width: calc(100% - 40rpx);
  height: 102rpx;
  margin: 0 20rpx;
  border-bottom: 1px solid #EBEBEB;
  box-sizing: border-box;
}
</style>