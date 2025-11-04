<template>
  <!-- 选择处理人 -->
  <view style="height: 100%" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="main-page">
      <view class="inputs-wrap">
        <view class="input-wrap">
          <u--input v-model="searchKey" fontSize="26rpx" placeholder="请输入组织名称、姓名、电话" shape="circle" clearable></u--input>
        </view>
        <view class="extra-text" @click="search(0)">查询</view>
        <view class="extra-text" @click="search(1)">直属上级</view>
        <view class="extra-text" v-if="multiple" @click="saveUsers">提交</view>
      </view>
      <view class="list-wrap">
        <view class="box-max">
          <view v-for="(item, index) in showList" :key="index">
            <view :class="['list-box',{'multiple-select':multiple && seletcted.includes(item.userId)}]"  @click="linkTo(item)">
              <view class="list-li">
                <view class="list-name">人员岗位：</view>
                <view class="list-value">{{ item.jobName }}</view>
              </view>
              <view class="list-li" v-if="parentFlag != '1'">
                <view class="list-name">所属组织：</view>
                <view class="list-value">{{ item.archName }}</view>
              </view>
              <view class="list-li">
                <view class="list-name">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</view>
                <view class="list-value">{{ item.userName }}</view>
              </view>
              <!-- <view class="list-li">
                <view class="list-name">电话号码：</view>
                <view class="list-value">{{ item.telephone }}</view>
              </view> -->
              <text v-if="multiple && seletcted.includes(item.userId)" class="iconfont select-icon">&#xe70b;</text>
            </view>
          </view>

          <!-- 空数据 -->
          <view v-if="!showList.length" class="nodata"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { usergetProjectUserList } from '@/service/crm6.0.js'
import { getJobArchUsers } from '@/service/landcrm.js'
export default {
  computed: {
    showList() {
      let dataList = this.parentFlag == '1' ? this.dataSetMember2 : this.dataSetMember
      let list = dataList.filter((ele) => (ele.jobName && ele.jobName.includes(this.searchKeyT)) || (ele.archName && ele.archName.includes(this.searchKeyT)) || (ele.userName && ele.userName.includes(this.searchKeyT)) || (ele.telephone && ele.telephone.includes(this.searchKeyT)))
      return list
    }
  },
  data() {
    return {
      inputVal: '',
      areaShow: false,
      areaList: [],
      projectList: [],
      jobList: [],
      seletcIndex: 0,
      searchItem: {
        areaId: ''
      },
      chooseList: [],
      dataSetMember: [],
      dataSetMember2: [],
      searchKey: '',
      searchKeyT: '',
      multiple: false,
      seletcted:[],
      parentFlag: 0
    }
  },
  onLoad(query) {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.multiple = query.multiple === '1' ? true : false
    if(query.selected){
      let Ids = query.selected.split(",");
      this.seletcted = Ids.map(ele => Number(ele))
    }
    if (query.projectId) {
      this.searchItem.areaId = query.areaId
      this.searchItem.projectId = query.projectId
    } else if (uni.getStorageSync('basicInfo')) {
      let info = JSON.parse(uni.getStorageSync('basicInfo'))
      this.searchItem.areaId = info.areaId
      this.searchItem.areaName = info.areaName
      this.searchItem.projectId = info.projectId
      this.searchItem.projectName = info.projectName
    }
    this.setMemberListData()
  },
  methods: {
    search(parentFlag){
      this.searchKeyT = this.searchKey;
      this.parentFlag = parentFlag
    },
    linkTo(item) {
      if(this.multiple){
        let Idx = this.seletcted.findIndex(ele => ele === item.userId);
        if(Idx > -1){
          this.seletcted.splice(Idx,1);
        }else{
          this.seletcted.push(item.userId)
        }
        return
      }
      let params = {
        followUserId: item.userId,
        followUserName: item.userName,
        followUserAccount: item.userAccount,
        followUserPhone: item.telephone
      }
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('dataEvent', { data: params })
      uni.navigateBack();
    },
    saveUsers(){
      let dataList = this.parentFlag == '1' ? this.dataSetMember2 : this.dataSetMember
      let params = {
        selected: dataList.filter(ele => this.seletcted.includes(ele.userId))
      }
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('dataEvent', { data: params })
      uni.navigateBack();
    },
    setMemberListData() {
      let params = {
        data: {
          projectId: this.searchItem.projectId,
          companyId: this.userInfo.companyId
        }
      }
      usergetProjectUserList(params).then((result) => {
        if (result.status == '200') {
          this.dataSetMember = result.data || []
        } else {
          this.dataSetMember = []
        }
      })
      let params2 = {
        data: {
          projectId: this.searchItem.projectId,
          companyId: this.userInfo.companyId,
          parentFlag: 1
        }
      }
      getJobArchUsers(params2).then((result) => {
        if (result.resultCode == '200') {
          this.dataSetMember2 = result.data || []
          this.dataSetMember2.forEach(ele => {
            ele.jobName = ele.jobs
            ele.archName = ''
          })
        } else {
          this.dataSetMember2 = []
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.main-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .inputs-wrap {
    width: 100%;
    background: #ffffff;
    border-bottom: 2rpx solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .input-wrap {
      flex: 1;
      margin: 14rpx 24rpx;
      ::v-deep .u-input {
        padding: 12rpx 32rpx !important;
        background: #f3f3f3;
      }
    }
    .extra-text {
      margin-right: 24rpx;
      color: var(--app-primary-color);
      font-size: 30rpx;
    }
  }
  .list-wrap {
    flex: 1;
    overflow: auto;
    background: #f5f5f5;
  }
  .box-max {
    padding: 20rpx;
    box-sizing: border-box;
    .list-box {
      width: 100%;
      padding: 20rpx;
      box-sizing: border-box;
      background: #ffffff;
      margin-bottom: 20rpx;
      border-radius: 12rpx;
      overflow: hidden;
      border: 2rpx solid #ffffff;
      .list-li {
        display: flex;
        align-items: baseline;
        font-size: 28rpx;
        .list-name {
          padding: 12rpx 0;
          color: #666666;
        }
        .list-value {
          flex: 1;
          color: #333333;
          text-align: right;
        }
      }
    }
    .multiple-select{
      position: relative;
      border: 2rpx solid var(--app-primary-color);
      .select-icon{
        position: absolute;
        top: -4rpx;
        right: 0;
        color: var(--app-primary-color);
        font-size: 48rpx;
      }
    }
  }
}
.hdCellCenter {
  display: flex;
  flex-direction: row;
  justify-content: center !important;
}
//  .u-action-sheet{
// 	height: 400px;
// 	overflow-y: scroll;
// }
::v-deep .u-action-sheet {
  height: 800rpx !important;
  overflow-y: scroll !important;
}
</style>
