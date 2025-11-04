<template>
  <view :class="['dropdown-project', getCustomClass]" :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]">
    <view class="tree-panel">

      <!-- 左侧菜单栏 -->
      <!-- <view class="tree-menu">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <text :class="['tree-menu--item', { selected: selArea.areaId == item.areaId }]" v-for="(item, index) in areaList" :key="index" @click="menuClickEvent(index, item)">{{ item.areaName }}</text>
        </scroll-view>
      </view> -->
			<view class="tree-menu all-width" v-if="showProject">
			  <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
			    <text :class="['tree-menu--item', { selected: selArea.projectId == item.projectId }]" v-for="(item, index) in projectList" :key="index" @click="menuClickEvent(index, item)">{{ item.projectName }}</text>
			  </scroll-view>
			</view>

      <!-- 右侧列表 -->
      <view :class="['tree-list', { show: true }]" v-if="!showProject">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in getChildList" :key="index">
            <view :class="['tree-list--item', { selected: selProject.buildingId == item.buildingId }]" @click="childClickEvent(index, item)">
              <text>{{ item.buildingLocation }}</text>
              <u-icon name="checkmark" v-if="selProject.buildingId == item.buildingId" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>

    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getAreaList, getProjectList  } from '@/service/landcrm'
import { getbuldingInfoByParam  } from '@/service/community'

/**
 * 下拉列表 - 区域项目
 * @event confirm 提交事件
 */
export default {
  name: 'DropdownProject',
  mixins: [mpMixin],
  props: {
    // 显示/隐藏
    show: Boolean,
    isAll:{
      type: Boolean,
      default: true
    },
		showProject:Boolean,
  },
  data() {
    return {
      store: {},
      areaList: [],
      selArea: {},
      selProject: {},
			projectList:[],
    }
  },
  computed: {
    getChildList() {
      return this.store[this.selArea.projectId] || []
    }
  },
  async created() {
    // #ifdef MP-WEIXIN
    const res = wx.getSystemInfoSync()
    if (res.environment) {
      await this.$onLaunched;
    }
    // #endif
    
    await this.getProjectListNew()
    if (this.projectList.length) {
      // 获取第一个区域数据
      await this.menuClickEvent(0, this.projectList[0])
      // await this.getProjectListNew()
    }
    // 获取第一个项目数据
    if (this.getChildList.length) {
      this.childClickEvent(0, this.getChildList[0])
    }
  },
  methods: {
		//获取楼栋
		async getbuldingInfoByParam(projectId) {
		  // 判断是否已经加载过了
		  if (this.store[projectId]) return
		  let { O_USER_INFO } = this.$constant;
		  let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
		  
		  const params = {
		    data: {
		      userId:userInfo.userId,
		      projectId,
		      // userId:'2063798',//测试用
          // projectId:'293215',//测试用
		    },
		    hideLoading: true,
		    responseToast: false
		  }
		  let res = await getbuldingInfoByParam(params)
      // res.data = [{"buildingLocation":"2栋","projectId":"2932157","buildingId":"32703"},{"buildingLocation":"3栋","projectId":"2932157","buildingId":"32704"},{"buildingLocation":"1栋","projectId":"2932157","buildingId":"32702"}]
      let allBId = []
      res.data.map(item=>{
        if(item.buildingId){
          allBId.push(item.buildingId)
        }
      })
		  if (this.isAll) {
		    res.data.unshift({ buildingLocation: '全部', buildingId: allBId.join(',') })
		  }
		  this.store[projectId] = res.data
      if(!this.$parent.selectBuildingId){
        this.$parent.selectBuildingId = res.data
      }
		},
		async getProjectListNew() {
		  let { O_USER_INFO } = this.$constant;
		  let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
		  const params = {
		    data: {
		      userId: userInfo.userId
		    },
		    hideLoading: true,
		    responseToast: false
		  }
		  let res = await getProjectList(params)
			console.log('res--------------',res)
		  this.projectList = res.items
		  this.store = res.items.reduce((store, item) => {
		    store[item.projectId] = null
		    return store
		  }, {})
		},
    async getAreaList() {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      const params = {
        data: {
          userId: userInfo.userId
        },
        hideLoading: true,
        responseToast: false
      }
      let res = await getAreaList(params)
      this.areaList = res.items
      this.store = res.items.reduce((store, item) => {
        store[item.areaId] = null
        return store
      }, {})
    },
    async getProjectList(areaId) {
      // 判断是否已经加载过了
      if (this.store[areaId]) return
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      
      const params = {
        data: {
          userId:userInfo.userId,
          areaId
        },
        hideLoading: true,
        responseToast: false
      }
      let res = await getProjectList(params)
      if (this.isAll) {
        res.items.unshift({ projectName: '全部', projectId: `` })
      }
      this.store[areaId] = res.items
    },
    // 左侧菜单栏操作
    async menuClickEvent(index, item) {
      this.selArea = item
			if(!this.showProject){
				await this.getbuldingInfoByParam(item.projectId)
			}
			this.childClickEvent(0,this.getChildList[0])
    },
    // 右侧列表操作
    childClickEvent(index, item) {
      this.selProject = item
      this.confirmEvent()
    },
    // 提交
    confirmEvent() {
      this.$emit('confirm', { project: this.selArea, building: this.selProject })
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-project {
  @include flx-dsp(flex-start, flex-start, column);
  font-family: "PingFang SC";
}
.tree-panel {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
  height: 612rpx;
}
.tree-menu {
  flex: 0 0 300rpx;
  height: 100%;
  background-color: #F7F7F7;
}
.all-width{
	flex: 0 0 750rpx;
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
  display: none;

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
</style>