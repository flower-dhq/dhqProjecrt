<template>
  <view :class="['dropdown-multiple-tree', getCustomClass]"
    :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]">
    <view class="tree-panel">

      <!-- 左侧菜单栏 -->
      <view class="tree-menu">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <text :class="['tree-menu--item', { selected: selForm.menuId == item.id ,badge: item.isSelected }]" v-for="(item) in menuTable"
            :key="item.id" @click="menuClickEvent(item)">{{ item.data.label }}
           </text>

        </scroll-view>
      </view>

      <!-- 右侧列表 -->
      <view class="tree-list">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <template v-if="getSelMenu.isCustom">
            <slot v-bind:node="currentMenu"></slot>
          </template>
          <block v-for="(item) in getChildList" :key="item.id">
            <view :class="['tree-list--item', { selected: item.isSelected }]" @click="childClickEvent(item)">
              <text>{{ item.data.label }}</text>
              <u-icon name="checkmark" v-if="item.isSelected" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
          <template v-if="getSelMenu.loading">
            <view style="margin-top: 40rpx;"></view>
            <u-loading-icon />
          </template>
        </scroll-view>
      </view>

    </view>

    <view class="tree-btn">
      <u-button text="重置" :customStyle="{ flex: '0 0 240rpx', height: '88rpx', borderRadius: '0rpx' }"
        @click="resetEvent(true)" />
      <u-button text="确认" type="primary" :customStyle="{ flex: '1 1 auto', height: '88rpx', borderRadius: '0rpx' }"
        @click="confirmEvent" />
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

/**
 * @event loadList parent: 当前菜单节点。 next(data): 回调函数
 * data = [{ label: '显示的文字', name: 'id' }]
 * @event menuClick item: 当前节点 菜单点击事件
 * @event confirm 确认事件
 * 单选: { [menuKey]: { parent: menuNode.data, children: childNode.data } }
 * 多选: { [menuKey]: { parent: menuNode.data, children: [childNode.data] } }
 * @event reset 重置事件
 */
export default {
  name: 'DropdownMultipleTree',
  mixins: [mpMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    /**
     * 选中的子节点
     * { [menuKey]: [childKey] }
     */
    value: {
      type: Object,
      default: () => ({})
    },
    // 需要展开的菜单节点
    expand: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    nodeKey: {
      type: String,
      default: 'name'
    },
    menuMultiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.increment = 1
    this.childTable = [] // 子节点列表
    return {
      menuTable: [], // 菜单列表
      getChildList: [], // 需要展示的子节点列表
      selForm: {
        menuId: '',
      },
      // 当前被选中的菜单。解决 uniapp slot-scope 数据更新，无法触发父组件的 slot 重新渲染问题
      currentMenu: {
        data: {}
      }
      // menuName: '',
      // filterMenu: []
    }
  },
  computed: {
    // 获取被选中的菜单节点
    getSelMenu() {
      const selMenuId = this.selForm.menuId
      if (!selMenuId) return {}
      const index = this.insertPolationSearch(this.menuTable, selMenuId)
      return this.currentMenu.data = this.menuTable[index] || {}
    }
  },
  watch: {
    // 初始化数据的时候才会调用
    data: {
      immediate: true,
      handler(newVal, oldVal) {
        if (Array.isArray(newVal) && this.nodeKey) {
          this.initData(newVal)
          this.resetEvent()
        }
      }
    },
    value(newVal, oldVal) {
      this.setDefaultSelect()
    },
    expand(newVal, oldVal) {
      if (typeof (newVal) == 'string') {
        this.setDefaultExpand()
      }
    },
    show(newVal, oldVal) {
      if (!newVal) {
        this.resetEvent()
      }
    }
  },
  created() {
    // 当左侧菜单栏被点击，然后发起请求获取到了子节点列表，才会调用
    const unwatch = this.$watch(
      vm => {
        const parent = vm.getSelMenu
        return parent.loaded ? parent : false
      },
      function(parent) {
        if (!parent) {
          this.getChildList = []
        } else {
          // 设置子节点列表
          this.getChildList = this.getNodeByField((item) => item.parentId === parent.id, { level: 2 })
        }
      },
      { immediate: true }
    )
    this.$options.beforeDestroy = (this.$options.beforeDestroy || []).concat(function beforeDestroy() {
      unwatch()
    })
  },
  methods: {
    initData(data = []) {
      data.forEach((menuItem) => {
        const { children = [], ...other } = menuItem
        const menuNode = this.setData(other, { level: 1, isMultiple: other.isMultiple, isLazy: other.isLazy, isCustom: other.isCustom, isRequired: other.isRequired })
        this.menuTable.push(menuNode)
        if (menuNode.isLazy || menuNode.isCustom) return

        children.forEach((childItem) => {
          const childNode = this.setData(childItem, { level: 2, parentId: menuNode.id })
          this.childTable.push(childNode)
        })
        this.updateData(menuNode.id, { loaded: true })
      })
    },
    setData(data = {}, options = {}) {
      const { parentId, isMultiple, isCustom, isLazy, level, isRequired } = options

      let node = {
        id: this.increment++,
        currentKey: data[this.nodeKey],
        level: level || 1, // 等级
        data: data || {},
      }
      if ((typeof (node.currentKey) == 'number' && isNaN(node.currentKey)) || (typeof (node.currentKey) !== 'number' && !node.currentKey)) return
      if (node.level == 1) {
        // 菜单级节点
        node = {
          ...node,
          isMultiple: isCustom ? false : (isMultiple || false), // 它的子节点列表是否支持多选。如果是自定义的，则不需要多选设置
          isCustom: isCustom || false, // 它的子节点区域是否自定义
          isExpanded: false,
          isSelected: false,
          isLazy: isCustom ? false : (isLazy || false), // 它的子节点是否懒加载。如果是自定义的，则不需要懒加载设置
          loaded: false, // 是否已经加载过子节点
          loading: false, // 是否正在请求子节点
          isRequired: isCustom ? false : (isRequired || false), // 是否必填
        }
      } else if (node.level == 2) {
        // 子节点
        node = {
          ...node,
          parentId,
          isSelected: false
        }
      }
      return node
    },
    // 初始化展开的节点
    setDefaultExpand() {
      this.selForm.menuId = ''
      this.getNodeByField((item) => item.isExpanded).forEach((node) => {
        this.updateData(node.id, { isExpanded: false })
      })

      const node = this.getNodeByField((item) => item.currentKey === this.expand, { isOnly: true })
      if (node) {
        this.menuClickEvent(node)
      }
    },
    // 初始化选中的节点
    setDefaultSelect() {
      // 把所有节点都设置为不选中状态
      const selMenuNode = this.getNodeByField((item) => item.isSelected, { level: 1 })
      const selChildNode = this.getNodeByField((item) => item.isSelected, { level: 2 })
      selMenuNode.forEach((node) => {
        this.updateData(node.id, { isSelected: false }, { level: 1 })
      })
      selChildNode.forEach((node) => {
        this.updateData(node.id, { isSelected: false }, { level: 2 })
      })

      const arrTmp = this.value
      const menuKeys = Object.keys(arrTmp)
      // this.filterMenu = menuKeys
      if (menuKeys.length == 0) return

      menuKeys.forEach((menuKey) => {
        const childKeys = arrTmp[menuKey]
        const menuNode = this.getNodeByField((item) => item.currentKey === menuKey, { isOnly: true })
        if (!menuNode) return

        childKeys.forEach((childKey) => {
          const childNode = this.getNodeByField((item) => item.parentId === menuNode.id && item.currentKey === childKey, { level: 2, isOnly: true })
          if (!childNode) return

          // 设置子节点被选中
          this.childClickEvent(childNode, { value: true })
        })
      })
    },
    /**
     * 通过currentKey获取节点
     * menuTable.currentKey -> menuTable.id
     * childTable.parentId + childTable.currentKey -> childTable.id
     * menuTable.isExpanded -> [menuTable.id]
     * childTable.isSelected -> [childTable.id]
     */
    getNodeByField(where = (item) => {}, options = {}) {
      const isOnly = options.isOnly || false // true: 只匹配一个, false: 匹配多个
      const level = options.level || 1 // 1: 菜单节点, 2: 子节点
      let arrTmp = []
      if (level == 1) {
        // 查找菜单级节点
        arrTmp = this.menuTable
      } else if (level == 2) {
        // 查找子节点
        arrTmp = this.childTable
      }

      // 查找出满足条件的节点。使用for是为了节省开销
      let res = []
      for (let i = 0, l = arrTmp.length; i < l; i++) {
        const item = arrTmp[i]
        const flag = where(item)
        if (isOnly && flag) return item
        if (!isOnly && flag) {
          res.push(item)
        }
      }
      return isOnly ? null : res
    },
    /**
     * 获取展开的节点
     */
    getExpandNode() {
      const res = this.getNodeByField((item) => item.isExpanded, { isOnly: true })
      return res
    },
    /**
     * 获取选中的子节点
     */
    getSelectChildNode() {
      const res = this.getNodeByField((item) => item.isSelected, { level: 2 })
      return res
    },
    /**
     * 插值查找，根据 id 查找 arr 数组中匹配的节点
     * @param {Array} arr
     * @param {number} id
     */
    insertPolationSearch(arr, id, left, right) {
      left = left || 0
      right = right || arr.length - 1
      if (left > right || id < arr[left].id || id > arr[right].id) return -1
      if (left == right) return arr[left].id == id ? left : -1

      let mid = left + (right - left) * (id - arr[left].id) / (arr[right].id - arr[left].id)
      if (isNaN(mid)) return -1
      mid = Math.floor(mid)
      let midVal = arr[mid].id
      if (id > midVal) return this.insertPolationSearch(arr, id, mid + 1, right)
      else if (id < midVal) return this.insertPolationSearch(arr, id, left, mid - 1)
      else if (midVal === id) return mid
    },
    /**
     * 更新isExpanded，isSelected
     */
    updateData(id, data = {}, options = {}) {
      const level = options.level || 1
      const arrTmp = level == 1 ? this.menuTable : level == 2 ? this.childTable : []

      const index = this.insertPolationSearch(arrTmp, id)
      if (index == -1) return

      const node = arrTmp[index]
      Object.keys(data).forEach(field => {
        if (node.hasOwnProperty(field)) {
          node[field] = data[field]
        }
      })
    },
    // 给parent节点设置子节点列表
    setChildData(parentNode, data = []) {
      for (let i = 0, l = data.length; i < l; i++) {
        const { children = [], ...other } = data[i]
        const childNode = this.setData(other, { level: 2, parentId: parentNode.id })
        this.childTable.push(childNode)
      }
    },
    // 菜单栏点击事件
    menuClickEvent(menuNode) {
      const oldMenuId = this.selForm.menuId
      this.selForm.menuId = menuNode.id
      // this.menuName = menuNode.currentKey;
      if (oldMenuId) {
        this.updateData(oldMenuId, { isExpanded: false })
      }
      this.updateData(menuNode.id, { isExpanded: true })

      this.$emit('menuClick', menuNode)

      if (menuNode.isLazy && !menuNode.loaded && !menuNode.loading && !menuNode.isCustom) {
        // 请求子节点列表
        this.requestChild(menuNode)
      }
    },
    // 子节点列表点击事件
    childClickEvent(childNode, options = {}) {
      console.time('time')
      const { value } = options
      const parentIndex = this.insertPolationSearch(this.menuTable, childNode.parentId)
      const parentNode = this.menuTable[parentIndex]
      const selChildNode = this.getSelectChildNode()
      // const index = this.insertPolationSearch(selChildNode, childNode.id)
      // if (!this.filterMenu.includes(this.menuName)) this.filterMenu.push(this.menuName);

      if (value === true && childNode.isSelected) return
      if (value === false && !childNode.isSelected) return

      // 如果存在value值，则按value来；否则如果已经被选中，则取值为false（取消选中状态）；如果还没有被选中，则取值为true（选中状态）
      const isSelected = typeof (value) == 'boolean' ? value : !childNode.isSelected
      if (!isSelected) {
        // 设置当前子节点为取消选中状态
        this.updateData(childNode.id, { isSelected: false }, { level: 2 })
        // 设置菜单节点为是否需要选中状态
        const hasSel = selChildNode.some((node) => node.parentId == parentNode.id && node.id != childNode.id)
        if (!hasSel && parentNode.isRequired) {
          // 如果是必选情况，当最后一个被选中的节点，是不能被取消选择的
          this.updateData(childNode.id, { isSelected: true }, { level: 2 })
        } else {
          // 否则，需要更新菜单节点的选中状态
          this.updateData(parentNode.id, { isSelected: hasSel }, { level: 1 })
        }
        return
      }

      selChildNode.filter((node) => {
        if (!parentNode.isMultiple) {
          // 如果当前节点所属的列表,是个单选状态
          if (node.parentId == parentNode.id) {
            // 这个节点被包含在当前被点击节点的列表里
            this.updateData(node.id, { isSelected: false }, { level: 2 })
            return false
          }
        }
        if (!this.menuMultiple) {
          // 如果菜单节点,是个单选状态
          if (node.parentId != parentNode.id) {
            // 这个节点不被包含在当前被点击节点的列表里
            this.updateData(node.id, { isSelected: false }, { level: 2 })
            return false
          }
        }
        return true
      })

      // 设置当前子节点为选中状态
      this.updateData(childNode.id, { isSelected: true }, { level: 2 })
      // 给菜单节点设置是否需要选中状态
      this.updateData(parentNode.id, { isSelected: true }, { level: 1 })
      if (!this.menuMultiple) {
        // 菜单节点，是个单选状态，需要取消
        this.getNodeByField((node) => {
          if (node.isSelected && node.id != parentNode.id) {
            this.updateData(node.id, { isSelected: false }, { level: 1 })
          }
        }, {})
      }
      console.timeEnd('time')
    },
    // 请求子节点
    requestChild(parentNode) {
      this.updateData(parentNode.id, { loading: true })
      const next = (data = []) => {
        this.updateData(parentNode.id, { loading: false, loaded: true })

        this.setChildData(parentNode, data)

      }
      this.$emit('loadList', parentNode, next)
    },
    /**
     * 设置子节点为还未加载状态
     * @param {string|number} parentId 可以是 id，也可以是 currentNode
     */
    clearChildData(parentId) {
      const index = typeof (parentId) === 'number' ? this.insertPolationSearch(this.menuTable, parentId) : -1
      let parentNode = null
      if (index === -1) {
        parentNode = this.getNodeByField((item) => item.currentKey === parentId, { isOnly: true })
      } else {
        parentNode = this.menuTable[index]
      }
      if (!parentNode) return

      // 删除之前加载的子节点数据
      const children = this.getNodeByField((item) => item.parentId === parentNode.id, { level: 2 })
      for (let i = 0, l = children.length; i < l; i++) {
        const childNode = children[i]
        const index = this.insertPolationSearch(this.childTable, childNode.id)
        this.childTable.splice(index, 1)
      }

      this.updateData(parentNode.id, { loaded: false, loading: false })
    },
    // 重置事件
    resetEvent(isEmit = false) {
      this.setDefaultExpand()
      this.setDefaultSelect()

      isEmit && this.$emit('reset')
    },
    // 
    confirmEvent() {
      /**
       * 单选: { [menuKey]: { parent: menuNode.data, children: childNode.data } }
       * 多选: { [menuKey]: { parent: menuNode.data, children: [childNode.data] } }
       */
      const res = this.getSelectChildNode().reduce((store, node) => {
        const menuIndex = this.insertPolationSearch(this.menuTable, node.parentId)
        const menuNode = this.menuTable[menuIndex]
        const menuKey = menuNode.currentKey

        if (menuNode.isMultiple) {
          // 多选
          if (!store[menuKey]) {
            store[menuKey] = { parent: menuNode.data, children: [] }
          }
          store[menuKey].children.push(node.data)
        } else {
          // 单选
          store[menuKey] = { parent: menuNode.data, children: node.data }
        }

        return store
      }, {})
      this.$emit('confirm', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-multiple-tree {
  @include flx-dsp(flex-start, flex-start, column);
  font-family: "PingFang SC";
}

.tree-panel {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
  height: 408rpx;
}

.tree-menu {
  // flex: 0 0 180rpx;
  height: 100%;
  background-color: #F7F7F7;
}

.tree-menu--item {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  font-size: 30rpx;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
    background-color: #fff;
  }
}

.tree-list {
  flex: 1 1 auto;
  height: 100%;
  // display: none;

  &.show {
    display: block;
  }
}

.tree-list--item {
  width: 100%;
  @include flx-dsp(space-between, center);
  font-size: 30rpx;
  padding: 30rpx;
  border-bottom: 1px solid #EAEAEA;
  box-sizing: border-box;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
  }
}

.tree-btn {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
}
.badge ::after{
  content:'';
      display: inline-block;
      width:5px;
      height:5px;
      background:red;
      border-radius: 50%;
     vertical-align: middle;
 }
</style>