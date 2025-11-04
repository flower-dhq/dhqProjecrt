<template>
  <view class="list-wrapper">
    <view class="wrap-area">
      <view :class="['cmn-list', { 'cmn-active': areaId == item.areaId }]" v-for="item in areaList" :key="item.areaId" @click="handleSelectArea(item)">
        <view class="list-name">{{ item.areaName }}</view>
        <text v-if="areaId == item.areaId && !projectList.length" class="iconfont select-icon">&#xe786;</text>
      </view>
    </view>
    <view class="wrap-project" v-if="projectList.length">
      <view :class="['cmn-list', { 'cmn-active': projectId == item.id }]" style="border-bottom: 1rpx solid #eaeaea" v-for="item in projectList" :key="item.id" @click="handleSelectProject(item)">
        <view class="list-name">{{ item.title }}</view>
        <text v-if="projectId == item.id" class="iconfont select-icon">&#xe786;</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getAreaList } from '@/service/landcrm.js'
import { getProjectAndQuesRange } from '@/service/wuyecrm.js'
export default {
  data() {
    return {
      searchData: {},
      areaId: '-1',
      areaName: '全部',
      areaList: [],
      projectId: '',
      projectName: '',
      projectList: [],
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo'
    })
  },
  created() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
  },
  methods: {
    ...mapMutations('searchBar', ['setDataInfo']),
    getAreas() {
      let params = {
        data: {
          userId: this.userInfo.userId
        }
      }
      getAreaList(params).then((result) => {
        if (result && result.items) {
          result.items.unshift({
            areaId: '-1',
            areaName: '全部'
          })
          this.areaList = result.items
          this.handleSelectArea(this.areaList[0])
        }
      })
    },
    selectArea() {
      let params = {
        data: {
          userId: this.userInfo.userId,
          areaId: this.areaId
        }
      }
      getProjectAndQuesRange(params).then((res) => {
        if (res.resultCode == '200' && res.data && res.data.length > 0) {
          this.projectList = res.data
          this.projectList.unshift({
            id: '-1',
            title: '全部'
          })
        } else {
          uni.showToast({
            title: res.resultDesc,
            icon: 'none'
          })
        }
      })
    },
    handleSelectArea(item) {
      this.areaId = item.areaId
      this.areaName = item.areaName
      this.projectId = ''
      this.projectName = ''
      this.projectList = []
      if (this.areaId == '-1') {
        return
      }
      this.projectId = '-1'
      this.projectName = '全部'
      this.selectArea()
    },
    handleSelectProject(item) {
      console.log('project', item)
      if (item.projectId == this.projectId) {
        this.projectId = ''
        this.projectName = ''
      } else {
        this.projectId = item.id
        this.projectName = item.title
      }
    },
    handleSyncData() {
      console.log('同步数据', this.dataInfo)
      this.areaList = this.dataInfo.areaList
      this.projectList = this.dataInfo.projectList
      if (this.dataInfo.areaId) {
        this.areaId = this.dataInfo.areaId
        if (this.areaId != '-1') {
          this.selectArea()
        }
      }
      if (this.dataInfo.areaName) {
        this.areaName = this.dataInfo.areaName
      }
      if (this.dataInfo.projectId) {
        this.projectId = this.dataInfo.projectId || '-1'
      }
      if (this.dataInfo.projectName) {
        this.projectName = this.dataInfo.projectName || '全部'
      }
    },
    updateStoreDate() {
      let setInfo = {
        areaList: this.areaList,
        projectList: this.projectList,
        areaId: this.areaId,
        areaName: this.areaName,
        projectId: this.projectId == '-1' ? '' : this.projectId,
        projectName: this.projectId == '-1' ? '' : this.projectName
      }
      console.log('更新数据', setInfo)
      this.setDataInfo(setInfo)
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
  max-height: 50vh;
  .wrap-area {
    flex: 1;
    background: #f7f7f7;
    overflow: auto;
  }
  .wrap-project {
    flex: 2;
    overflow: auto;
  }
  .cmn-list {
    padding: 30rpx;
    text-align: left;
    font-size: 30rpx;
    @include flx-dsp($jsc: center, $ali: center);
    .list-name {
      flex: 1;
    }
    .select-icon {
      font-size: 36rpx;
    }
  }
  .cmn-active {
    background: #ffffff;
    color: #2761ff;
  }
  .active-project {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &::after {
      position: relative;
      top: 3px;
      content: url('@/static/icon-img/icon-select.png');
    }
  }
}
</style>
