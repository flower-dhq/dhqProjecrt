<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <!-- 二维码 -->
    <view class="code-panel">
      <view class="status-text">
        <text class="code-tile">{{formModel.decpassStateTitle}}</text>
        <text class="approval" v-if="formModel.authType === 2">已通过审核</text>
      </view>
      <view class="code-content-panel" v-if='formModel.decpassStateTitle!="已取消" && formModel.decpassStateTitle!="已拒绝"'>
        <!-- 请让后端生成二维码，没必要使用QRCode.js -->
        <u-image :showLoading="true" :src="formModel.qrCode" width="250px" height="250px" mode="aspectFit" />
        <!-- <u-image :showLoading="true" src="https://xyd-io.9zdata.cn/filemanager/previewFile?fileId=a995147e-5348-4cc0-ba4c-853c4924efcf&type=filedatabase/xxxx.jpg" width="160px" height="160px" mode="aspectFit" /> -->
        <text class="code-content-desc">门岗放行时，请出示此二维码和身份证</text>
      </view>
    </view>

    <!-- 信息表单 -->
    <view class="pd-20">
      <view class="form-title cell-border">信息详情</view>
    </view>  
    <view class="pd-20">
      <!-- <cell-text label="房产地址" :labelWidth="80" padding="10px 11px" class="fz">{{ formModel.address }}</cell-text> -->
      <cell-text v-if="formModel.companyName" label="放行公司" :labelWidth="80" padding="10px 11px" class="fz">{{ formModel.companyName }}</cell-text>
      <cell-text label="放行人员" :labelWidth="80" padding="10px 11px" class="fz">{{ formModel.pedestriansName }}</cell-text>
      <cell-text label="联系电话" :labelWidth="80" padding="10px 11px" class="fz">{{ formModel.telephone }}</cell-text>
      <cell-text label="身份证" :labelWidth="80" padding="10px 11px" class="fz">{{ formModel.idcardNum }}</cell-text>
      <cell-text label="放行日期" :labelWidth="80" padding="10px 11px" class="fz">{{ formModel.startTime }}</cell-text>
      <cell-text label="放行物品" :labelWidth="80" padding="10px 11px" class="fz">
        <view class="cell__table">
          <view class="cell__table--header">
            <text style="width: 55%; border-right: 1px solid #f5f5f5;">物品</text>
            <text style="width: 45%;">数量/单位</text>
          </view>
          <view class="cell__table--content" v-for="(item, index) in formModel.item" :key="index">
            <text style="width: 55%; border-right: 1px solid #f5f5f5;">{{ item.itemName }}</text>
            <text style="width: 45%;">{{ item.itemNum }}</text>
          </view>
        </view>
      </cell-text>
      <cell-text label="备注" padding="10px 11px" class="fz">{{ formModel.descriptionContent }}</cell-text>
    </view>
    <view class="album-panel">
      <u-album :urls="formModel.notePicture" singleSize="70" multipleSize="70"/>
    </view>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import CellText from '@/components/cell-text/cell-text.vue'
import { getApplyVisitDetail } from '@/service/wxmanage'

export default {
  name: 'GoodsReleaseDetail',
  components: {
    CellText
  },
  data() {
    return {
      formModel: {
        address: '',
        decpassStateTitle: '',
        pedestriansName: '',
        companyName:'',
        ownerName:'',
        telephone: '',
        idcardNum: '',
        startTime: '',
        descriptionContent: '',
        item: [],
        notePicture: [],
        qrCode: '', //二维码
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const { passId } = await Utils.getPageQuery()
      const res = await getApplyVisitDetail(passId)
      const data = res.data || {}
      // if(res.data.decpassState==1)data.decpassStateTitle ='待审核';
      // if(res.data.decpassState==2)data.decpassStateTitle ='待放行';
      // if(res.data.decpassState==3)data.decpassStateTitle ='已放行';
      // if(res.data.decpassState==4)data.decpassStateTitle ='已拒绝';
      // if(res.data.decpassState==5)data.decpassStateTitle ='已取消'; 
      const stateTitles = {
        1: '待审核',
        2: '待放行',
        3: '已放行',
        4: '已拒绝',
        5: '已取消'
      }
      data.decpassStateTitle = stateTitles[res.data.decpassState] || ''

      this.formModel = {
        ...data,
        startTime: uni.$u.timeFormat(data.startTime + '', 'yyyy-mm-dd'),
      }
      try {
        this.formModel.item = JSON.parse(data.items)
        this.formModel.notePicture = JSON.parse(data.notePicture)
      } catch (error) {
        this.formModel.item = []
        this.formModel.notePicture = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
}

.code-panel {
  position: relative;
  background-color: rgb(245, 245, 245);
  min-height: 100px;
  display: flex;
  flex-direction: column;
  padding: 0 20px 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background-color: var(--app-primary-color);
    z-index: 0;
  }
  .status-text{
    @include flx-dsp($jsc: flex-start, $ali: center);
    .approval{
      color: #fff;
      font-size: 28rpx;
      z-index: 1;
      margin-left: 10rpx;
      position: relative;
      top: 4rpx;
    }
  }
  .code-tile {
    font-size: 46rpx;
    font-weight: bold;
    line-height: 2.5;
    color: #fff;
    z-index: 1;
  }
  .code-content-panel {
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    z-index: 1;
    padding: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .code-content-desc {
    font-size: 28rpx;
    // margin-top: 28px;
  }
}

.form-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 38px;
  line-height: 1;
  font-weight: bold;
  padding-left: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 17px;
    background-color: var(--app-primary-color);
    margin-right: 8px;
  }
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
.cell__table {
  border: 1px solid #f5f5f5;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  width: 100%;

  .cell__table--header, .cell__table--content {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;

    text {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 40px;
    }
  }
}
.album-panel {
  padding: 10px 15px;
}
.fz {
  font-size: 26rpx;
}
.pd-20 {
  padding: 0 40rpx;
}

::v-deep .cell-text-label text{
	font-size: 28rpx;  
}
::v-deep .cell-text-content{
	font-size: 28rpx !important;  
}
</style>