<template>
  <view class="list-wrapper">
    <view class="wrap-com">
      <view class="cmn-list cmn-active" @click="handleSelectCompany">集团总部</view>
    </view>
    <view class="wrap-area">
      <view :class="['cmn-list list-project', { 'cmn-active': areaId == item.areaId }]" v-for="item in areaList" :key="item.areaId" @click="handleSelectArea(item)">
        <view class="list-name">{{ item.areaName }}</view>
        <text v-if="areaId == '-1' && item.areaId == '-1'" class="iconfont select-icon">&#xe786;</text>
      </view>
    </view>
    <view class="wrap-project" v-if="areaId != -1">
      <view :class="['cmn-list list-project', { 'cmn-active': projectId == item.id }]" v-for="item in projectList" :key="item.id" @click="handleSelectProject(item)">
        <view class="list-name">{{ item.title }}</view>
        <text v-if="projectId == item.id" class="iconfont select-icon">&#xe786;</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getAreaList } from '@/service/landcrm.js'
import { getProjectAndQuesRange } from '@/service/wuyecrm.js'
export default {
  name: 'taskArea',
  data() {
    return {
      areaList: [],
      projectList: [],
      areaId: '',
      areaName: '',
      projectId: '-1',
      projectName: '',
      userInfo: {}
    }
  },
  computed: {},
  async mounted() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.areaList = await this.getAreas()
    this.$emit('updateData', { nowFresh: true })
    this.handleSelectArea(this.areaList[0])
  },
  methods: {
    getAreas() {
      let params = {
        data: {
          userId: this.userInfo.userId
        }
      }
      return getAreaList(params).then((result) => {
        let list = result.items || []
        list.unshift({
          areaId: '-1',
          areaName: '全部区域'
        })

        return list
      })
    },
    handleSelectCompany() {
      this.handleSelectArea(this.areaList[0])
    },
    handleSelectArea(item) {
      this.areaId = item.areaId
      this.areaName = item.areaName
      this.projectId = '-1'
      this.projectList = []
      this.updateDate()
      if (this.areaId == '-1') {
        return
      }
      let params = {
        data: {
          userId: this.userInfo.userId,
          areaId: this.areaId
        }
      }
      getProjectAndQuesRange(params).then((res) => {
        if (res.resultCode == '200') {
          this.projectList = res.data || []
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
    handleSelectProject(item) {
      this.projectId = item.id
      this.projectName = item.title
      this.updateDate()
    },
    updateDate() {
      let params = {
        areaId: this.areaId != '-1' ? this.areaId : '',
        projectId: this.projectId !== '-1' ? this.projectId : '',
        areaName: this.areaId == '-1' ? '集团总部' : this.projectId == '-1' ? this.areaName : this.projectName
      }
      console.log(params)
      this.$emit('updateData', params)
    },
    reset() {
      this.handleSelectArea(this.areaList[0])
      this.updateDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
  font-size: 26rpx;
  height: 88rpx;
  .wrap-com {
    flex: 3;
    background: #f7f7f7;
    overflow: auto;
  }
  .wrap-area {
    flex: 3;
    background: #f4f4f4;
    overflow: auto;
  }
  .wrap-project {
    flex: 5;
    overflow: auto;
  }
  .cmn-list {
    padding: 30rpx;
    text-align: left;
    font-size: 30rpx;
  }
  .list-project {
    border-bottom: 1rpx solid #eaeaea;
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
}
</style>
