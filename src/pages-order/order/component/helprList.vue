<template>
  <view class="helpers-wrap">
    <e-input v-model="manHour" name="实际工时（分钟）" :type="isAllowToModifyManHour ? 'InputNumber' : 'custom'" placeholder="请填写" />
    <view class="helper-title">
      <view> 维修人员工作量明细 </view>
      <view style="color: var(--app-primary-color)" @click="setHelpers"> +添加协助人 </view>
    </view>
    <view class="helpers-list" style="background: #eeeff3; padding: 5px 0">
      <view class="helper-name">维修人</view>
      <view class="helper-type">人员类型 </view>
      <view class="helper-rate">工时比例 <br />（%）</view>
      <view class="helper-hour">实际工时<br />（分钟） </view>
      <view class="helper-icon"></view>
    </view>
    <view class="helpers-list">
      <view class="helper-name">{{ basicInfo.followUserName }}</view>
      <view class="helper-type">维修人 </view>
      <view class="helper-rate"><u-number-box name="numberBox0" v-model="manHourRate" min="1" max="100" integer></u-number-box> </view>
      <view class="helper-hour"> {{ Number((manHourRate * manHour) / 100).toFixed(2) }} </view>
      <view class="helper-icon"></view>
    </view>
    <view class="helpers-list" v-for="(helper, index) in helperList" :key="index">
      <view class="helper-name">{{ helper.userName }}</view>
      <view class="helper-type">协助人 </view>
      <view class="helper-rate"><u-number-box :name="'numberBox' + (index + 1)" v-model="helper.manHourRate" min="1" max="100" integer></u-number-box> </view>
      <view class="helper-hour"> {{ Number((helper.manHourRate * manHour) / 100).toFixed(2) }} </view>
      <view class="helper-icon">
        <u-icon name="minus-circle-fill" color="#d81e07" @click="deleteHelper(index)"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import eInput from '../../components/eInput/index.vue'
import { getHelperSetting } from '@/service/crm6.0'
export default {
  components: {
    eInput
  },
  props: {
    basicInfo: {
      type: Object,
      default: {}
    },
    quesTaskId: {
      type: String,
      default: ''
    }
  },
  computed: {
    helperName() {
      let names = this.helperList.map((ele) => ele.userName)
      return names.join()
    }
  },
  data() {
    return {
      helperList: [],
      selectedPeople: [],
      manHour: 0,
      isAllowToModifyManHour: false,
      manHour: '',
      manHourRate: 0,
      followWorkingHours: 0
    }
  },
  mounted() {
    this.getSetting()
  },
  methods: {
    getSetting() {
      this.helperList = []
      let params = {
        data: {
          companyId: localStorage.companyId,
          quesTaskId: this.quesTaskId
        }
      }
      getHelperSetting(params).then((res) => {
        if (res.status == 200 && res.data) {
          this.isAllowToModifyManHour = res.data.isAllowToModifyManHour == '1'
          this.manHour = res.data.manHour || 0
          this.manHourRate = 100
          this.followWorkingHours = this.manHour
        } else {
          uni.showToast({ title: res.data.message, icon: 'none' })
          this.isAllowToModifyManHour = false
          this.manHour = 0
        }
      })
    },
    setHelpers() {
      let params = {
        areaId: this.basicInfo.areaId,
        projectId: this.basicInfo.projectId,
        multiple: 1
      }
      let userIds = this.helperList.map((ele) => ele.userId)
      params.selected = userIds.join(',')
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-order/order/choosePeople', params),
        events: {
          dataEvent: (data) => {
            this.helperList = data.data.selected
            this.helperList.forEach((ele) => {
              this.$set(ele, 'manHourRate', 1)
            })
            console.log(this.helperList)
          }
        }
      })
    },
    deleteHelper(index) {
      this.helperList.splice(index, 1)
    },
    isValidate() {
      if (this.helperList.length) {
        if (this.helperList.some((ele) => !ele.manHourRate)) {
          uni.showToast({ title: '请选择协助人对应工时比例', icon: 'none' })
          return false
        }
        let manHourRate = this.manHourRate
        this.helperList.forEach((ele) => (manHourRate += ele.manHourRate))
        if (Number(manHourRate.toFixed(2)) !== 100) {
          uni.showToast({ title: '工时比例累加不等于100%,请修改', icon: 'none' })
          return false
        }
        return true
      } else {
        if (Number(this.manHourRate.toFixed(2)) !== 100) {
          uni.showToast({ title: '工时比例累加不等于100%,请修改', icon: 'none' })
          return false
        }
        return true
      }
    },
    getData() {
      let helpers = [
        {
          userType: '1',
          userId: this.basicInfo.followUserId,
          userAccount: '',
          userName: this.basicInfo.followUserName,
          manHour: Number((this.manHourRate * this.manHour) / 100).toFixed(2),
          manHourRate: this.manHourRate
        }
      ]
      this.helperList.forEach((ele) => {
        ele.userType = '2'
        ele.manHour = Number((ele.manHourRate * this.manHour) / 100).toFixed(2)
        helpers.push(ele)
      })

      return {
        actualityManHour: this.manHour,
        helpers: JSON.stringify(helpers)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.helpers-wrap {
  .helper-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background: #f5f5f5;
  }
  .helpers-list {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .helper-name {
      flex: 1;
      text-align: center;
    }
    .helper-type {
      flex: 1;
      text-align: center;
    }
    .helper-rate {
      flex: 1;
      text-align: center;
    }
    .helper-hour {
      flex: 1;
      text-align: center;
    }
    .helper-icon {
      width: 25px;
    }
  }
}
</style>
