<template>
  <!-- 选择处理人 -->
  <view style="height: 100%" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="main-page">
      <view class="inputs-wrap">
        <view class="input-wrap">
          <u--input v-model="searchKey" fontSize="26rpx" placeholder="请输入组织名称、姓名、电话" shape="circle" clearable></u--input>
        </view>
        <view class="extra-text" @click="searchKeyT = searchKey">查询</view>
      </view>
      <view class="list-wrap">
        <view class="box-max">
          <view v-for="(item, index) in showList" :key="index">
            <view class="list-box">
              <view class="list-li">
                <view class="list-name">人员岗位：</view>
                <view class="list-value">{{ item.jobName }}</view>
              </view>
              <view class="list-li">
                <view class="list-name">所属组织：</view>
                <view class="list-value">{{ item.archName }}</view>
              </view>
              <view class="list-li">
                <view class="list-name">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</view>
                <view class="list-value">{{ item.user_name }}</view>
              </view>
              <!-- <view class="list-li">
                <view class="list-name">电话号码：</view>
                <view class="list-value">{{ item.telephone }}</view>
              </view> -->
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
import { getFollowUserList } from '@/service/crm6.0'
export default {
  name: 'followUser',
  computed: {
    showList() {
      let list = this.followUserData.filter((ele) => (ele.jobName && ele.jobName.includes(this.searchKeyT)) || (ele.archName && ele.archName.includes(this.searchKeyT)) || (ele.user_name && ele.user_name.includes(this.searchKeyT)) || (ele.telephone && ele.telephone.includes(this.searchKeyT)))
      return list
    }
  },
  data() {
    return {
      quesTaskId: '',
      followUserData: [],
      searchKey: '',
      searchKeyT: ''
    }
  },
  onLoad(query) {
    this.quesTaskId = query.quesTaskId
    this.getList()
  },
  methods: {
    getList() {
      const { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      let params = {
        data: {
          quesTaskId: this.quesTaskId,
          userId: userInfo.userId
        }
      }
      //获取跟进人列表
      getFollowUserList(params).then((res) => {
        if (res.status == 200) {
          this.followUserData = res.data
        } else {
          this.followUserData = []
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
