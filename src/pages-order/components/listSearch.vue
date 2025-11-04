<style lang="scss" scoped>
.list-search {
  .search-body {
    padding: 14rpx 24rpx;
    font-size: 30rpx;
    border-bottom: 1rpx solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .area-select {
      padding-right: 24rpx;
      color: #333333;
      cursor: pointer;
      transition: 0.6s;
      @include flx-dsp($jsc: center, $ali: center);
      .area-name {
        max-width: 160rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .u-icon {
        color: #666666;
      }
    }
    .active {
      color: var(--app-primary-color);
      .u-icon {
        transform: scaleY(-1);
        color: var(--app-primary-color);
      }
    }
    .inputs-wrap {
      flex: 1;
      @include flx-dsp($jsc: center, $ali: center);
      .input-wrap {
        flex: 1;
      }
      .search-text {
        padding-left: 24rpx;
        color: var(--app-primary-color);
      }
    }
  }
  .area-search {
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    .area-body {
      height: 600rpx;
      width: 100%;
      overflow: hidden;
      @include flx-dsp($jsc: center, $ali: center);
      .area-wrap {
        flex: 1;
        height: 100%;
        overflow: auto;
        background: #ffffff;
      }
      .project-wrap {
        flex: 2;
        height: 100%;
        overflow: auto;
        background: #f0f0f0;
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
    .area-btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: var(--app-primary-color);
      color: #ffffff;
      font-size: 32rpx;
    }
  }
}
</style>

<template>
  <u-popup :show="true" mode="top" closeOnClickOverlay :overlay="selectShow" duration="0" class="list-search">
    <view class="search-body">
      <view class="area-select" :class="{ active: selectShow }" @click="selectActive">
        <view class="area-name">全部</view>
        <u-icon size="24rpx" color="unset" name="arrow-down-fill" style="margin-left: 4rpx"></u-icon>
      </view>
      <view class="inputs-wrap">
        <view class="input-wrap">
          <u--input v-model="inputVal" fontSize="26rpx" customStyle="{padding:12rpx 32rpx;background: #F3F3F3;}" placeholder="请输入客户姓名/电话/单号/业务编号" shape="circle" clearable></u--input>
        </view>
        <view class="search-text"> 搜索</view>
      </view>
    </view>
    <view v-if="selectShow" class="area-search">
      <view class="area-body">
        <view class="area-wrap">
          <view class="item-wrap" :class="{ active: area.areaId === areaId }" @click="selectArea(area)" v-for="(area, index) in areaList" :key="index">
            {{ area.areaName }}
          </view>
        </view>
        <view class="project-wrap">
          <view class="item-wrap" :class="{ active: project.id === projectId }" @click="selectProject(project)" v-for="(project, index) in projectList" :key="index">
            <view class="item-name">{{ project.title }}</view>
            <u-icon v-if="project.id === projectId" size="40rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
          </view>
        </view>
      </view>
      <view class="area-btn" @click="submitSearch"> 确认</view>
    </view>
  </u-popup>
</template>

<script>
import { getAreaList } from '@/service/landcrm.js'
import { getProjectAndQuesRange } from '@/service/wuyecrm.js'
export default {
  name: 'list-search',
  components: {},
  data() {
    return {
      areaList: [],
      projectList: [],
      areaId: '',
      areaName: '',
      projectId: '',
      inputVal: '',
      selectShow: false,
      userInfo: {}
    }
  },
  created() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
  },
  mounted() {
    this.getAreas()
  },
  methods: {
    selectActive() {
      this.selectShow = true
    },
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
    },
    submitSearch() {
      this.selectShow = false
    }
  }
}
</script>
