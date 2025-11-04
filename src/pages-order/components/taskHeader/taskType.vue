<style lang="scss" scoped>
.select-type {
  width: 100%;
  max-height: 50vh;
  overflow: auto;
  display: flex;
  .type-wrap {
    overflow: auto;
    &:nth-child(1) {
      width: 30%;
      overflow-x: hidden;
      background: #ffffff;
    }
    &:nth-child(2) {
      width: 30%;
    }
    &:last-child {
      flex: 1;
    }
  }
  .item-wrap {
    padding: 30rpx;
    font-size: 30rpx;
    color: #333333;
    @include flx-dsp($jsc: center, $ali: center);
    .item-name {
      flex: 1;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 超出几行省略 */
      overflow: hidden;
    }
  }
  .active {
    color: var(--app-primary-color) !important;
    background: #ffffff !important;
  }
}
</style>

<template>
  <view class="select-type">
    <view class="type-wrap" v-for="(select, index) in selectList" :key="index" :style="{ 'background-color': BackgroundColor[index] }">
      <view @click="selectType(type, index)" class="item-wrap" :class="{ active: type.serverId === selected[index] }" v-for="type in select" :key="type.serverId">
        <view class="item-name">{{ type.serverName }}</view>
        <u-icon v-if="type.serverId === selected[index] && type.serverId === selected[selected.length - 1]" size="40rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import { getAllQuesTaskServerTypes } from '@/service/wuyecrm.js'

export default {
  name: 'taskType',
  computed: {},
  data() {
    return {
      selectList: [],
      selected: [],
      BackgroundColor: ['#FFFFFF', '#F0F0F0', '#F3F3F3', '#F6F6F6']
    }
  },
  mounted() {
    this.getTypes()
  },
  methods: {
    getTypes() {
      this.selected = []
      const { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      let params = {
        data: {
          companyId: userInfo.companyId
        }
      }
      getAllQuesTaskServerTypes(params).then((res) => {
        if ((res.status = 200)) {
          if (res.data && res.data.length && res.data[0].children && res.data[0].children.length) {
            this.selectList = [res.data[0].children]
          } else {
            this.selectList = []
          }
        }
      })
    },
    selectType(type, index) {
      if (index <= this.selected.length) {
        this.selected.splice(index, this.selected.length)
      }
      if (index <= this.selectList.length) {
        this.selectList.splice(index + 1, this.selectList.length)
      }

      this.selected.push(type.serverId)
      if (type.children && type.children.length) {
        this.selectList.push(type.children)
      }
      let params = {
        taskTypeId: type.serverId
      }
      this.$emit('updateData', params)
    },
    reset() {
      if (this.selectList.length > 1) {
        this.selectList = [this.selectList[0]]
      }
      this.selected = []
      let params = {
        taskTypeId: ''
      }
      this.$emit('updateData', params)
    }
  }
}
</script>
