<template>
  <view class="page" :style="[THEME_CSS_VAR]">
    <view style="padding: 12px 12px;background-color: #f9f9f9;">
      <view style="padding: 0px 12px 12px;border-radius: 8px;background-color: #fff;">
        <view class="box-line">
          <text class="title-font">{{ meterReadingData.number }}</text>
          <text class="title-reslut">抄表成功</text>
        </view>
        <view class="box-line-item">
          <text class="item-label">抄表客户</text>
          <text class="item-text">{{meterReadingData.creator}}</text>
        </view>
        <view class="box-line-item">
          <text class="item-label">抄表日期</text>
          <text class="item-text">{{meterReadingData.readDate}}</text>
        </view>
        <view class="box-line-item">
          <text class="item-label">本次用量</text>
          <text class="item-text">{{meterReadingData.dosageSummary}}</text>
        </view>
      </view>
    </view>
    <view style="padding: 12px 12px 0;" v-if="tableData.length">
      <view class="table-title">该资产下还有如下表未抄，点击继续抄表</view>
      <zb-table :columns="column" :show-header="true" :cell-style="cellStyle" :cell-header-style="headercellStyle"
        :stripe="true" :fit="true" border="none" @edit="handleEdit"
        :data="tableData">
      </zb-table>
    </view>
    <view style="height: 250rpx;"></view>
    <view class="footer-btn">
      <u-button type="primary" :customStyle="{ width: '670rpx', height: '88rpx', padding: '0', background: '#1989F7' }" @click="goPage">完成</u-button>
      <u-safe-bottom />
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
import CellText from '@/components/cell-text.vue'
import CTabbar from '@/components/c-tabbar.vue';
import { getNoReadMeter, getHistoryReadRequest } from '@/service/energy'
export default {
  name: "",
  data() {
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    return {
      customerId: '16095',
      projectId: '',
      roomId: '',
      meterId: '',

      dosage: '',
      meterReadingData: {}, //抄表成功取列表第一条
      tableList: [],
      column: [
        { name: 'operation', type:'operation',label: '操作', renders:[
          {
            name:'抄表',
            class: 'edit-btn',
            type: 'custom',
            func:'edit' // func 代表子元素点击的事件 父元素接收的事件 父元素 @edit
          },
        ]},
        { name: 'number', label: '表号', align: 'center', },
        { name: 'meterKindStr', label: '种类', align: 'center', },
        { name: 'readDate', label: '上次抄表日', align: 'center', width: 130, },
        { name: 'lastRead', label: '上次度数', align: 'center', },
      ],

      tableData: [
        // {
        //   number: 'A101',
        //   meterKindStr: '水表',
        //   readDate: '2022-11-30',
        //   lastRead: '200',
        // }, 
        // {
        //   number: 'A101',
        //   meterKindStr: '水表',
        //   readDate: '2022-11-30',
        //   lastRead: '200',
        // }
      ]
    }
  },
  components: {
    CellText,
    CTabbar
  },
  onLoad(option) {
    console.log('新增成功页面====', option)
    this.projectId = option.projectId || ''
    this.roomId = option.roomId || ''
    this.meterId = option.meterId || ''
    this.customerId = option.customerId || ''
    
    this.getMeterReadingList()
    this.getTableData()
  },
  methods: {
    getTableData() {
      let params = {
        data: {
          projectId: this.projectId,
          roomId: this.roomId,
          customerId: this.customerId,
        }
      }
      getNoReadMeter(params).then(res=>{
        console.log('res===',res)
        this.tableData = res?.data || []
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) { 
      if (columnIndex == 3) {
        return {
          color: '#333',
          'fontSize': '12px',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': 1,
          'width': '100px',
          'white-space': 'inherit'
        }
      }else if(columnIndex == 2){
        return {
          'minWidth': '130px',
          'maxWidth': '130px',
          color: '#333',
          fontSize: '12px',
        }
      } else {
        return {
          color: '#333333',
          fontSize: '12px',
        }
      }
    },
    //获取仪表抄表数据
    getMeterReadingList(){
      let params = {
        data: {
          projectId: this.projectId,
          // projectId: 2932247,
          midList: [this.meterId],
          pageIndex: 1,
          pageSize: 3,
        }
      };
      getHistoryReadRequest(params).then(res=>{
        if(res.data.records && res.data.records.length > 0){
          this.meterReadingData = res.data.records[0];
          this.dosage = res.data.records[0]?.readChildList[0]?.dosage
        }
      })
    },
    // 此方法无效
    headercellStyle({ column, columnIndex}) {
      console.log('columnIndex===',columnIndex)
      // if (columnIndex == 2) {
      //   return {
      //     color: 'red',
      //     'fontSize': '12px',
      //     'width': '130px',
      //   }
      // } else {
      //   return {
      //     color: '#333',
      //     fontSize: '12px',
      //   }
      // }
    },
    handleEdit(row) {
      console.log('row===',row)
      uni.navigateTo({
        url: `/pages-meter/addMeterReading?meterId=${row.mid}&customerId=${this.customerId}`
      })
    },
    goPage() {
      uni.navigateTo({
        url: `/pages-meter/meterInfo?meterId=${this.meterId}&projectId=${this.projectId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.font-color {
  color: #333;
  font-size: 15px;
  font-family: PingFang SC;
}
::v-deep .header-title {
  .cell-text-label {
    font-size: 28rpx;
  }
 } 
.page {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  font-family: PingFang SC, "Helvetica Neue", Arial, sans-serif;
}
.meter-info{
  /* overflow-y: scroll; */
  padding: 0 15px;
}
.title-line {
  font-size: 30rpx;
  color: #999;
  padding: 10px 0 10px 15px;
}
.footer-btn {
  bottom: 40rpx;
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.box-line {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  border-bottom: 1px solid #EBEBEB;
  margin-bottom: 10px;
}
.box-line-item {
  display: flex;
  justify-content: space-between;
  line-height: 40px;
}
.title-font {
  font-size: 34rpx;
  color: #333;
}
.title-reslut {
  font-size: 34rpx;
  color: #16CE92;
}
.item-label {
  font-size: 28rpx;
  color: #666666;
}
.item-text {
  font-size: 28rpx;
  color: #333;
}
.table-title {
  height: 45px;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 45px;
  color: #333333;
}
::v-deep .edit-btn {
  background-color: transparent;
  border: none;
  color: inherit;
  padding: 0;
  font: inherit;
  outline: none;
  cursor: pointer;
  color: #1989F7;
}
::v-deep .item-th:nth-child(3) {
  width: 130px !important;
}
::v-deep .item-th:nth-child(4) {
  width: 100px !important;
}
::v-deep .zb-table-applet .item-td {
  padding-right: 0;
}
</style>
