<style lang="scss" scoped>
.select-building {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 600rpx;
  .c-scroll {
    width: 230rpx;
    height: 100%;
    background-color: #f7f7f7;
  }
  .b-scroll {
    flex: 1;
    height: 100%;
    background-color: #fff;
  }
  .courtyard {
    width: 100%;
    height: 100%;
    
    & > view {
      width: 100%;
      padding: 30rpx;
      box-sizing: border-box;
      color: #333;
      font-size: 30rpx;
      text-align: center;
    }
    .i-active {
      color: var(--app-primary-color);
      background-color: #fff;
    }
  }
  .building {
    width: 100%;
    height: 100%;
    
    & > view {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-size: 30rpx;
      padding: 30rpx;
      border-bottom: 1px solid #eaeaea;
      box-sizing: border-box;
      color: #333;
    }
    & > view:last-child {
      border-bottom: none;
    }
    .i-active {
      color: var(--app-primary-color);
    }
  }
}
</style>

<template>
  <view class="select-building">
    <scroll-view scroll-y class="c-scroll">
      <view class="courtyard">
        <view v-for="(item, index) in houseCompoundList" :class="[item.name == cyTempModel ? 'i-active' : '']" :key="index" @click="clickEvent({ type: 'courtyard', data: item })">
          <text>{{ item.label }}</text>
        </view>
      </view>
    </scroll-view>
    <scroll-view class="b-scroll" scroll-y style="height: 100%; flex: 1;">
      <view class="building">
        <view v-for="(item, index) in buildingList" :class="[item.name == buildingModel ? 'i-active' : '']" :key="index" @click="clickEvent({ type: 'building', data: item })">
          <text>{{ item.label }}</text>
          <u-icon name="checkmark" v-if="item.name == buildingModel" :color="THEME_COLOR"></u-icon>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getCourtyardByProjectId, getBuildingDetailList } from '@/service/landcrm';
export default {
  data() {
    return {
      houseCompoundList: [],
      buildingList: [],
      courtyardModel: '',
      cyTempModel: '',
      buildingModel: '',
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    searchForm: {
      type: Object,
      default() {
        return {};
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    show(n) {
      if (n) {
        this.cyTempModel = this.courtyardModel;
        this.clickEvent({type: 'courtyard', data: {name: this.cyTempModel}})
      }
    },
  },
  methods: {
    // 点击事件
    clickEvent(params) {
      const { type, data } = params;
      const { label, name } = data;
      if (type == 'courtyard') {
        this.cyTempModel = name;
        const {list = []} = this.houseCompoundList.find(item => item.name == name) || {}
        if (list.length) {
          this.buildingList = list
        } else {
          this.getbuldingInfoByParam(name);
        }
      }
      if (type == 'building') {
        this.buildingModel = name;
        this.courtyardModel = this.cyTempModel;
        this.$emit('confirmSlBd', { label, name });
      }
    },
    // 获取院区
    async getParkList() {
      const params = {
        data: {
          projectId: this.searchForm.projectId,
        },
        wrapResponse: true,
        responseToast: false,
        hideLoading: true,
      };
      const res = await getCourtyardByProjectId(params);
      this.houseCompoundList = (res.data || []).map((item) => ({
        label: item,
        name: item,
        list: []
      }));
      this.houseCompoundList.unshift({label:'全部',name:'', list: []})
    },
    // 根据项目id获取楼栋
    async getbuldingInfoByParam(name, init) {
      const { O_USER_INFO } = this.$constant;
      const { userId } = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const { areaId, projectId } = this.searchForm;
      const courtyard = this.cyTempModel;
      const buildingModel = this.buildingModel
      const params = {
        data: {
          userId,
          areaId,
          projectId,
          courtyard,
          buildingLocation: '',
          startIndex: 1,
          pageSize: 10000,
        },
        responseToast: false,
        hideLoading: true,
      };
      this.buildingList = [];
      const res = await getBuildingDetailList(params);
      const data = res.data || [];

      const allBuild = data.map((item) => item.buildingId).join(','); // 全部选项
      const otherBuild = data.map((item) => ({
        ...item,
        label: item.buildingLocation,
        name: item.buildingId,
      }));
      if (init && !buildingModel) {
        this.buildingModel = allBuild
      }
      const list = [{ label: '全部', name: allBuild }].concat(otherBuild);
      this.houseCompoundList.some(item => {
        if (name === item.name) {
          item.list = list
          return true
        }
      })
      this.buildingList = list
    },
    // 初始化返回楼栋信息
    initedEmit() {
      const { label = '全部', name = '' } = this.buildingList.find((item) => item.name == this.buildingModel) || {};
      this.$emit('confirmSlBd', { label, name, init: true });
    },
    // 初始化数据
    async initData() {
      const { courtyard, buildingId = '' } = this.options;
      this.cyTempModel = this.courtyardModel = courtyard == "undefined" || !courtyard ? '' : courtyard;
      this.buildingModel = buildingId;
      await this.getParkList();
      await this.getbuldingInfoByParam('', 1);
      this.initedEmit();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
