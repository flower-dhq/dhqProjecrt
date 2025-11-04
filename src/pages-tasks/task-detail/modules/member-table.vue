<template>
  <view class="table-panel">
    <cell-text :label="getCount" isRight labelWidth="auto" border="none" :customStyle="{fontSize: '28rpx'}">
      <u-button v-if="isShowSend" :customStyle="{height: '64rpx', fontSize: '12px'}" slot="right" text="提醒成员发送" plain size="normal" shape="circle" @click="remindSendMsg" />
    </cell-text>

    <!-- <uni-table>
      <uni-tr v-for="(item, index) in data" :key="index">
        <uni-td width="30" align="center">
          <u-avatar :src="item.avatarUrl" size="30" />
        </uni-td>
        
        <uni-td width="60" align="center">{{ item.nickName || '' }}</uni-td>
        
        <uni-td width="100" align="center">{{ item.areaName || '' }}</uni-td>
        
        <uni-td width="100" align="center">{{ item.projectName || '' }}</uni-td>
        
        <uni-td width="100" align="center">{{ item.postName || '' }}</uni-td>
        
        <uni-td width="70" align="center">{{ sendStatusStr(item) }}</uni-td>
      </uni-tr>
    </uni-table> -->
    <view class="table">
        <view class="tr" v-for="(item, index) in data" :key="index">
            <!-- 头像 -->
            <view class="avatar" >
                <u-avatar :src="item.avatarUrl" size="50" />
            </view>
            <view class="cellMiddle">
              <!-- 用户名称 -->
              <view class="user-info">
                <view class="userName">{{ item.nickName || '' }}</view>
                <!-- 任务状态 -->
                <view class="rightStatus" :style="item.sendStatus == 3 ? 'color:#FC0B0B' : item.sendStatus == '0' ? 'color:#2761FF' : 'color:#16CE92'" >{{ sendStatusStr(item) }}</view>
              </view>
              <!-- 岗位名称 -->
              <view class="postName">{{ item.postName || '' }}</view>
            </view>
        </view>
    </view>


    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import CellText from '@/components/cell-text.vue'
import { remindSendMsg } from '@/service/api-gateway'

/**
 * 执行成员列表数据
 */
export default {
  name: 'MemberTable',
  mixins: [mpMixin],
  components: {
    CellText
  },
  props: {
    // 任务状态文本
    stateText: String,
    // 列表数据
    data: {
      type: Array,
      default: () => ([])
    },
    // 是否显示“提醒成员发送”按钮
    isShowSend: {
      type: Boolean,
      default: false
    },
    // 任务ID
    taskId: String
  },
  data() {
    return {
    }
  },
  computed: {
    getCount() {
      return `${this.data.length}名成员-${this.stateText || ''}`
    },
    
  },
  methods: {
    sendStatusStyle(data){
      const { sendStatus } = data || {}
      if(sendStatus == 3){
        return "color:#FC0B0B"
      } else {
        return "color:#16CE92"
      }
    },
    sendStatusStr(data) {
      const { sendStatus, sendStatusStr } = data || {}
      return  sendStatus == 3 ? '超时进行中' : sendStatusStr
    },
    // 提醒成员发送
    async remindSendMsg() {
      const res = await remindSendMsg(this.taskId)
      if (res.status == 200) {
        this.$refs.messageEl.show({
          type: 'default',
          message: '发送成功'
        })
      } else {
        this.$refs.messageEl.show({
          type: 'default',
          message: res.message || '发送失败'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-panel {
  display: flex;
  flex-direction: column;
  padding: 0 15px 17px;
  border-top-style: solid;
  border-width: 24rpx;
  border-color: #F9F9F9;
}
.table{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
.tr{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  padding: 30rpx 0;
}
.avatar{
  padding-right: 30rpx;
  /* padding-top: 30rpx;
  padding-bottom: 30rpx; */
}
.cellMiddle{
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.user-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.userName{
  font-size: 30rpx;
}
.postName {
  font-size: 28rpx;
  color: #666666;
}
.jobName{
  font-size: 28rpx;
  color: #666666;
}
.jobView{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 28rpx;
  color: #666666;
}
.rightStatus{
  font-size: 26rpx;
  /* padding-top: 32rpx; */
  
}
</style>