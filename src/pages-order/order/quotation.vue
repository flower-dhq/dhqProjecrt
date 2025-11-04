<template>
  <view class="page-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="box-header">
      <u-search placeholder="请输入关键字搜索" v-model="searchKey" :showAction="false" @search="doSearch"></u-search>

      <u--text suffixIcon="arrow-down-fill" iconStyle="font-size: 18rpx" :text="serverType ? serverType : '服务类别'" @click="showServerAction"></u--text>
    </view>
    <view class="box-collapse">
      <uni-collapse>
        <!-- 因为list默认带一条分隔线，所以使用 titleBorder="none" 取消面板的分隔线 -->
        <uni-collapse-item class="custom-collapse-item" title-border="none" open :border="false" v-for="(item, index) in filterList" :key="index">
          <view slot="title" class="custom-slot-title">{{ item.serverName }}</view>
          <view class="custom-table">
            <view class="common-fr table-header">
              <view class="common-text table-header-item">服务项目</view>
              <view class="common-text table-header-item">收费标准</view>
              <view class="common-text table-header-item">备注</view>
            </view>
            <view class="common-fr table-body-item" v-for="list in item.list" :key="list.id">
              <view class="common-text table-body-item-text">{{ list.serverAvailable }}</view>
              <view class="common-text table-body-item-text">{{ list.fees }}</view>
              <view class="common-text table-body-item-text">{{ list.remark }}</view>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
    <!-- 服务类别 -->
    <u-action-sheet :show="visible" :actions="serverTypeList" title="请选择服务类别" @close="visible = false" @select="serverTypeSelect"></u-action-sheet>
  </view>
</template>

<script>
import wycrmApi from "@/service/wycrm6.0.js";
export default {
  data() {
    return {
      areaId: "",
      projectId: "",
      searchKey: "", // 服务项目
      serverType: "", // 服务类别
      quotationList: [],
      visible: false,
      serverTypeList: [],
    };
  },
  computed: {
    filterList() {
      if (this.serverType) {
        return this.quotationList.filter((item) => {
          return item.serverName == this.serverType;
        });
      } else {
        return this.quotationList;
      }
    },
  },
  onLoad(options) {
    this.requestQuotationList(options.areaId, options.projectId);
    this.areaId = options.areaId;
    this.projectId = options.projectId;
  },
  methods: {
    doSearch() {
      this.requestQuotationList(this.areaId, this.projectId);
    },
    requestQuotationList(areaId, projectId) {
      let params = {
        data: {
          serverType: this.searchKey || "",
          areaId: areaId,
          projectId: projectId,
          merge: 1,
        },
      };
      wycrmApi.quotationList(params).then((res) => {
        if (res.status == 200) {
          this.quotationList = res.data.quotationList;
          if (this.serverTypeList.length < 1) {
            this.serverTypeList.push({ name: "全部" });
            for (let index = 0; index < res.data.quotationList.length; index++) {
              const ele = res.data.quotationList[index];
              this.serverTypeList.push({ name: ele.serverName });
            }
          }
        } else {
          this.quotationList = [];
        }
      });
    },
    showServerAction() {
      this.visible = true;
    },
    serverTypeSelect(data) {
      this.serverType = data.name == "全部" ? "" : data.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  row-gap: 10rpx;
  background: #f5f5f5;
}
.box-header {
  padding: 24rpx 76rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  row-gap: 36rpx;

  ::v-deep .u-text {
    justify-content: center !important;
  }
}

.custom-collapse-item {
  border-bottom: 1px solid #f5f5f5;
}

.custom-slot-title {
  padding: 22rpx 76rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.custom-table {
  padding: 10rpx 28rpx 40rpx;
  .common-fr {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .common-text {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 10rpx 0;
    text-align: center;
    border-collapse: collapse;
    border: 1px solid #cccccc;
    margin-right: -1px;
    margin-bottom: -1px;
  }
  .table-header {
    background: #fbf8f4;
  }
}
</style>
