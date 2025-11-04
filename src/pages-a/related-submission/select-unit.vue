<style lang="scss" scoped>
.select-unit {
  $bgc: #f3f4f7;
  width: 100%;
  min-height: 100vh;
  background-color: $bgc;
  box-sizing: border-box;
  $search-h: 108rpx;
  .search-area {
    @include flx-dsp($jsc: flex-start, $ali: center);
    width: 100%;
    height: $search-h;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20rpx 20rpx 20rpx 24rpx;
    .buttons {
      margin: 0 10px;
      height: 100%;
      text {
        display: inline-block;
        height: 100%;
        font-size: 28rpx;
        line-height: 68rpx;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  &__list {
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    position: relative;
    width: 100%;
    height: calc(100vh - $search-h);
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #eee;
      transform: translateY(-50%);
    }
    & > view {
      height: 100%;
      overflow-y: auto;
    }
    $lw: 240rpx;
    .building {
      width: $lw;
      height: 100%;
      background-color: #f2f2f2;
      .cell {
        border-bottom: 1px solid #edebeb;
        width: 100%;
      }
    }
    text.active-building {
      color: var(--app-primary-color);
    }
    .cell {
      width: 100%;
      display: inline-block;
      box-sizing: border-box;
      padding: 30rpx;
      font-size: 30rpx;
      color: #333;
      text-align: center;
    }
    .unit {
      width: calc(100% - $lw);
      background-color: #f3f4f7;
      &__scroll {
        background-color: #fff;
        width: 100%;
        height: 96rpx;
        overflow-x: auto;
        padding: 0 28rpx;
        box-sizing: border-box;
        view.wrap {
          height: 96rpx;
          @include flx-dsp($jsc: flex-start, $ali: center);
          box-sizing: border-box;
          text {
           width: 124rpx;
            @include flx-dsp($jsc: center, $ali: center);
            flex-wrap: nowrap;
            margin-right: 28rpx;
            background-color: #f4f4f4;
            color: #666;
            font-size: 24rpx;
            padding: 12rpx 0rpx;
            border-radius: 30rpx;
          }
          text.active-unit {
            color: var(--app-primary-color);
            background-color: rgba(#2761ff, $alpha: 0.1);
          }
        }
      }
      .middle {
        width: 100%;
      }
      .wrap {
        width: 100%;
      }
      .floor {
        width: 100%;
        height: calc(100% - 96rpx);
        padding: 20rpx 0rpx 20rpx 28rpx;
        box-sizing: border-box;
        overflow-y: auto;
        $pd: 0 2rpx;
        .wrap {
          position: relative;
          min-height: 100%;
          padding: 20rpx 0;
          .scroll-bar {
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            padding: $pd;
            height: 100%;
            background-color: #d2d2d2;
            border-radius: 24rpx;
            color: transparent;
            font-size: 24rpx;
            z-index: 1;
            text-align: center;
          }
        }
        .floor-item {
          position: relative;
          z-index: 3;
          @include flx-dsp($jsc: flex-start, $ali: flex-start);
          .floor-no {
            display: inline-block;
            margin-right: 30rpx;
            font-size: 24rpx;
            color: #fff;
            padding: $pd;
            text-align: center;
          }
          .room-box {
            @include flx-dsp($jsc: flex-start, $ali: flex-start);
            flex-wrap: wrap;
            .room {
              margin-right: 20rpx;
              margin-bottom: 20rpx;
              display: inline-block;
              padding: 10rpx 20rpx;
              border: 1px solid #ccc;
              border-radius: 8rpx;
              font-size: 24rpx;
              color: #333;
              background-color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <view class="select-unit" :style="[THEME_CSS_VAR]">
    <view class="search-area">
      <u-search v-model="keyword" placeholder="请输入房间、业主姓名、手机号、营销房间号" :showAction="false" shape="square" @search="search"></u-search>
    </view>
    <view class="select-unit__list">
      <view class="building">
        <text :class="['cell', i == building.index ? 'active-building' : '']" v-for="(d, i) in building.list" :key="i" @click="clicBuilding(i)">{{ d.label }}</text>
      </view>
      <view class="unit">
        <view class="unit__scroll">
          <view class="wrap">
            <text v-for="(u, j) in unitList" :class="['cell', j == unitIndex ? 'active-unit' : '']" :key="j" @click="unitIndex = j">{{ u.unitText }}</text>
          </view>
        </view>
        <view class="floor">
          <view class="wrap">
            <text class="scroll-bar" id="sbar" :style="{width: scrollBar}">{{ maxWithText }}</text>
            <view class="middle">
              <view class="floor-item" v-for="(f, fi) in floorList" :key="fi">
                <text class="floor-no" :style="{width: scrollBar}">{{ f.floorText }}</text>
                <view class="room-box">
                  <text class="room" v-for="(r, ri) in f.rooms" :key="ri" @click="clicRoom(r)">{{ r.roomText }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getBuildingDetailList, getHouseAddrInfoListToPage, getOwnerInfo} from '@/service/landcrm';
export default {
  data() {
    return {
      keyword: '',
      columnData: [
        {
          index: 0,
          list: [],
        },
        {
          index: 0,
          list: [],
        },
      ],
      building: {
        index: 0,
        list: [],
      },
      unitIndex: 0,
      unitList: [],
      maxWithText: '1',
      scrollBar: 'auto'
    };
  },
  computed: {
    floorList() {
      return this.unitList[this.unitIndex]?.floor || [];
    },
  },
  methods: {
    // 类名
    cellClassName({ colIdx, cellIdx }) {
      const index = this.columnData[colIdx].index;
      return index === cellIdx ? 'active-cell' : '';
    },
    // 点击楼栋
    clicBuilding(index) {
      this.building.index = index;
      this.getRoomData({hideLoading: false});
    },
    // 点击房间
    clicRoom(room) {
      this.getOwnerInfo(room)
    },
    // 获取楼栋
    getBuildingData(option) {
      const { projectId } = option || {};
      const params = {
        data: {
          projectId,
          startIndex: 1,
          pageSize: 100000,
        },
        hideLoading: true,
        responseToast: false,
      };
      if (!projectId) return Promise.resolve();
      return getBuildingDetailList(params).then((res) => {
        if (res.success) {
          const data = res.data || [];
          data.forEach((item) => {
            const { courtyard, buildingLocation, buildingId } = item;
            item.label = `${courtyard}-${buildingLocation}`;
            item.id = buildingId;
          });
          this.building.list = data;
        }
        
      });
    },
    // 获取房间数据
    getRoomData(option) {
      const { hideLoading = true } = option || {};
      const { index, list = [] } = this.building;
      const { id } = list[index] || {};
      const params = {
        data: {
          buildingId: id,
          startIndex: 1,
          pageSize: 9999,
        },
        hideLoading,
        responseToast: false,
      };
      if (!id) return Promise.resolve();
      return getHouseAddrInfoListToPage(params).then((res) => {
        if (res.success) {
          const data = res.data || [];
          const unit = [];
          this.maxWithText = '1'

          // 组装单元数据
          data.forEach((item) => {
            const { houseCell } = item;
            const unitText = `${houseCell}单元`;
            const exist = unit.some((item) => item.houseCell === houseCell);
            if (!exist) unit.push({ ...item, unitText, floor: [] });
          });
          // 组装楼层数据
          unit.forEach((u) => {
            const { floor, houseCell } = u;
            data.forEach((item) => {
              const { houseCell: iCell, houseFloor: iFloor } = item;
              const isSameUnit = houseCell === iCell;
              const exist = floor.some((f) => f.houseFloor === iFloor);
              if (isSameUnit && !exist) u.floor.push({ ...item, floorText: iFloor, rooms: [] });
            });
          });
          // 组装房间数据
          unit.forEach((u) => {
            const { floor, houseCell } = u;
            floor.forEach((floor) => {
              const { rooms, houseFloor } = floor;
              data.forEach((item) => {
                const { houseCell: iCell, houseFloor: iFloor, houseRoom: iRoom } = item;
                const isSameFloor = houseCell === iCell && houseFloor === iFloor;
                const exist = rooms.some((f) => f.houseRoom === iRoom);
                if (isSameFloor && !exist) {
                  floor.rooms.push({ ...item, roomText: iRoom });
                }
              });
            });
          });

          // 排序
          unit.sort((a, b) => a.houseCell - b.houseCell);
          unit.forEach((u) => {
            u.floor.sort((a, b) => a.houseFloor - b.houseFloor);
          });
          unit.forEach((u) => {
            u.floor.forEach((f) => {
              if (f.floorText.length > this.maxWithText) this.maxWithText = f.floorText
              f.rooms.sort((a, b) => a.houseRoom - b.houseRoom);
            });
          });
          this.unitList = unit;
          this.scrollBar = 'auto'
          setTimeout(() => {
            const query = uni.createSelectorQuery().in(this);
            query.select('#sbar').boundingClientRect(data => {
              this.scrollBar = parseInt(data.width) + 4 + 'px'
            }).exec();
          }, 0);
        }
      });
    },
    // 获取业主
    getOwnerInfo(room) {
      const { houseAddrInfoId } = room || {}
      const params = {
        data: {
          houseAddrInfoId: houseAddrInfoId
        },
        // hideLoading,
        responseToast: false,
      };
      getOwnerInfo(params).then(res => {
        let data = []
        const owners = res || {}
        for (const k in owners) {
          const key = Number(k)
          if (typeof key === 'number' && !isNaN(key) ) data.push(owners[k])
        }
        data = data.map((item) => Object.assign({}, item, { roomId: houseAddrInfoId, ownerId: item.infoId }))
        if (data.length) {
          uni.$emit('select-unit', {type: '', data })
          uni.navigateBack({delta: 2})
        } else {
          uni.showToast({
            title: '无业主房间信息',
            duration: 2000,
            icon: 'none',
          });
        }
      
      })
    },
    // 关联加载
    async initData(option) {
      uni.showLoading({ title: '加载中' });
      await this.getBuildingData(option).catch((_) => {});
      await this.getRoomData().catch((_) => {});
      uni.hideLoading();
    },
  },
  onLoad(option) {
    this.initData(option);
  },
};
</script>
