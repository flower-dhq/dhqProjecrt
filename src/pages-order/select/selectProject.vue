<style lang="scss" scoped>
.select-project {
  height: 100%;
  overflow: hidden;
  @include flx-dsp($jsc: center, $ali: center);
  .area-wrap {
    flex: 1;
    height: 100%;
    overflow: auto;
    background: #ffffff;
  }
  .projects-wrap {
    flex: 3;
    height: 100%;
    overflow: hidden;
    background: #f0f0f0;
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    .input-wrap {
      width: 100%;
      background: #ffffff;
      border-bottom: 1px solid #eaeaea;
      border-left: 1px solid #eaeaea;
    }
    .project-wrap {
      flex: 1;
      width: 100%;
      overflow: auto;
      background: #f0f0f0;
    }
  }
  .item-wrap {
    padding: 30rpx;
    font-size: 30rpx;
    color: #333333;
    border-bottom: 1px solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .item-name {
      flex: 1;
    }
  }
  .active {
    color: var(--app-primary-color) !important;
    background: #ffffff !important;
  }
}
</style>

<template>
  <view class="select-project" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="area-wrap">
      <view class="item-wrap" :class="{ active: area.areaId === areaId }" @click="selectArea(area)" v-for="(area, index) in areaList" :key="index">
        {{ area.areaName }}
      </view>
    </view>
    <view class="projects-wrap">
      <view class="input-wrap">
        <view style="margin: 14rpx 24rpx">
          <u--input v-model="inputVal" placeholder="请输入内容" shape="circle" clearable></u--input>
        </view>
      </view>
      <view class="project-wrap">
        <view class="item-wrap" :class="{ active: project.id === projectId }" @click="selectProject(project)" v-for="(project, index) in showProjectList" :key="index">
          <view class="item-name">{{ project.title }}</view>
          <u-icon v-if="project.id === projectId" size="40rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAreaList } from '@/service/landcrm.js'
import { getProjectAndQuesRange } from '@/service/wuyecrm.js'

export default {
  name: 'selectProject',
  computed: {
    showProjectList() {
      let list = this.projectList.filter((ele) => ele.title.includes(this.inputVal))
      return list
    }
  },
  data() {
    return {
      userInfo: {},
      areaList: [],
      projectList: [],
      areaId: '',
      areaName: '',
      projectId: '',
      inputVal: ''
    }
  },
  onLoad() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.getAreas()
  },
  methods: {
    getAreas() {
      let params = {
        data: {
          userId: this.userInfo.userId
        }
      }
      getAreaList(params).then((result) => {
        if (result && result.items) {
          this.areaList = result.items
          if (this.areaList.length > 0) {
            this.selectArea(this.areaList[0])
          }
        } else {
          this.areaList = []
          this.areaId = ''
          this.areaName = ''
          this.projectList = []
          this.projectId = ''
        }
      })
    },
    selectArea(area) {
      this.areaId = area.areaId
      this.areaName = area.areaName
      this.projectId = ''
      this.projectList = []
      let params = {
        data: {
          userId: this.userInfo.userId,
          areaId: this.areaId
        }
      }
      getProjectAndQuesRange(params).then((res) => {
        if (res.resultCode == '200') {
          this.projectList = res.data
        } else {
          uni.showToast({
            title: res.resultDesc,
            icon: 'none'
          })
        }
      })
    },
    selectProject(project) {
      this.projectId = project.id
      let params = {
        areaId: this.areaId,
        areaName: this.areaName,
        projectId: this.projectId,
        projectName: project.title,
        projectProperty: project.projectProperty
      }
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('dataEvent', { data: params })
      uni.navigateBack();
    }
  }
}
</script>
