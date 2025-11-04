<style scoped lang="scss">
.house-dynamic-info {
  padding-top: 20rpx;
  width: 100%;
  .info-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    .title-font {
      display: block;
    }

    .unsold-empty-house {
      width: 320rpx;
    }
    .sold-empty-house {
      width: 320rpx;
    }
  }
  .info-bottom {
    .number-of-decorated-house {
      display: flex;
      flex-direction: column;
      margin-bottom: 24rpx;
    }
    .decoration-items {
      display: flex;
      justify-content: space-between;
      .decorated-item {
        width: 164rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .up-item {
          margin-bottom: 24rpx;
        }
        & > view {
          display: flex;
          flex-direction: column;
          text:nth-child(1) {
            font-size: 20rpx;
            color: #666;
            margin-bottom: 8rpx;
          }
          text:nth-child(2) {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
          }
        }
      }
    }
  }
  .title-font {
    font-size: 20rpx;
    color: #666;
  }
  .bold-font {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
  }
  .comm-style {
    background: #f7f9ff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 20rpx;
  }
}
</style>

<template>
  <view class="house-dynamic-info">
    <label-header :title="$t('房屋动态')">
      <view class="info-top">
        <view class="comm-style unsold-empty-house" style="margin-right: 22rpx">
          <text class="title-font">{{$t('未售空置房数量')}}</text>
          <text class="bold-font">{{ dynamicInfo.numberOfunsoldEmptyHouse }}</text>
        </view>
        <view class="comm-style sold-empty-house">
          <text class="title-font">{{$t('已售申请办理空置房数量')}}</text>
          <text class="bold-font">{{ dynamicInfo.numberOfsoldEmptyHouse }}</text>
        </view>
      </view>
      <view class="info-bottom comm-style">
        <view class="number-of-decorated-house">
          <text class="title-font">{{$t('装修户数量')}}</text>
          <text class="bold-font">{{ dynamicInfo.numberOfdecoratedHouse }}</text>
        </view>
        <view class="decoration-items">
          <view class="decorated-item">
            <view class="up-item">
              <text>{{$t('封阳台')}}</text>
              <text>{{ dynamicInfo.numberOfbalconySealed }}</text>
            </view>
            <view>
              <text>{{$t('刷油漆')}}</text>
              <text>{{ dynamicInfo.wallPainting }}</text>
            </view>
          </view>
          <view class="decorated-item">
            <view class="up-item">
              <text>{{$t('装防盗网')}}</text>
              <text>{{ dynamicInfo.numberOfsafeGrid }}</text>
            </view>
            <view>
              <text>{{$t('安装门窗')}}</text>
              <text>{{ dynamicInfo.windowNdoorIntallation }}</text>
            </view>
          </view>
          <view class="decorated-item">
            <view class="up-item">
              <text>{{$t('整装')}}</text>
              <text>{{ dynamicInfo.wholeHoseDecorated }}</text>
            </view>
            <view>
              <text>{{$t('安装厨卫')}}</text>
              <text>{{ dynamicInfo.kitchenNbathroomInstallation }}</text>
            </view>
          </view>
          <view class="decorated-item">
            <view class="up-item">
              <text>{{$t('墙体拆建')}}</text>
              <text>{{ dynamicInfo.wallDismentled }}</text>
            </view>
            <view>
              <text>{{$t('其他')}}</text>
              <text>{{ dynamicInfo.other }}</text>
            </view>
          </view>
        </view>
      </view>
    </label-header>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

import { getHouseDataReportCount } from '@/service/leasingbi_new';
import LabelHeader from '@/pages-kanban/kanban/component/label-header.vue';
import SwitchTabs from '@/pages-kanban/kanban/component/switch-tabs.vue';
export default {
  data() {
    return {
      dynamicInfo: {
        numberOfunsoldEmptyHouse: 0,
        numberOfsoldEmptyHouse: 0,
        numberOfdecoratedHouse: 0,
        numberOfbalconySealed: 0,
        numberOfsafeGrid: 0,
        wholeHoseDecorated: 0,
        wallDismentled: 0,
        wallPainting: 0,
        windowNdoorIntallation: 0,
        kitchenNbathroomInstallation: 0,
        other: 0,
      },
    };
  },
  components: {
    SwitchTabs,
    LabelHeader,
  },
  methods: {
    init(data = {}) {
      const { areaId = '', projectId = '', companyId } = data;
      const params = {
        data: {
          areaId,
          projectId,
          companyId,
        },
      };
      getHouseDataReportCount(params).then((res) => {
        if (res.status == 200) {
          const { unsoldVacancyHouseNum, soldVacancyHouseNum, decorationHouseholdNum, sealingBalconyNum, installSecurityNum, completeInstallationNum, wallDemolitionnum, brushingPaintNum, installDoorWindowNum, installKitchenToiletNum, otherNum } = res.data || {};
          this.dynamicInfo = {
            numberOfunsoldEmptyHouse: unsoldVacancyHouseNum,
            numberOfsoldEmptyHouse: soldVacancyHouseNum,
            numberOfdecoratedHouse: decorationHouseholdNum,
            numberOfbalconySealed: sealingBalconyNum,
            numberOfsafeGrid: installSecurityNum,
            wholeHoseDecorated: completeInstallationNum,
            wallDismentled: wallDemolitionnum,
            wallPainting: brushingPaintNum,
            windowNdoorIntallation: installDoorWindowNum,
            kitchenNbathroomInstallation: installKitchenToiletNum,
            other: otherNum,
          };
        }
      });
    },
  }
};
</script>
