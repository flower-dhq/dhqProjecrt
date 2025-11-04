<template>
  <view>
    <view class="plate" :class="{ show: show }">
      <view
        :class="['item', { active: index === 0 }]"
        @click.stop="handleChange(0)"
        >{{ plate[0] }}</view
      >
      <view
        :class="['item ml10', { active: index === 1 }]"
        @click="handleChange(1)"
        >{{ plate[1] }}</view
      >
      <view>●</view>
      <view
        :class="['item', { active: index === 2 }]"
        @click="handleChange(2)"
        >{{ plate[2] }}</view
      >
      <view
        :class="['item ml10', { active: index === 3 }]"
        @click="handleChange(3)"
        >{{ plate[3] }}</view
      >
      <view
        :class="['item ml10', { active: index === 4 }]"
        @click="handleChange(4)"
        >{{ plate[4] }}</view
      >
      <view
        :class="['item ml10', { active: index === 5 }]"
        @click="handleChange(5)"
        >{{ plate[5] }}</view
      >
      <view
        :class="['item ml10', { active: index === 6 }]"
        @click="handleChange(6)"
        >{{ plate[6] }}</view
      >
      <view
        :class="['item ml10 column', { active: index === 7 }]"
        @click="handleChange(7)"
      >
        <template v-if="newEnergy">
          <text>{{ plate[7] }}</text>
        </template>
        <template v-else>
          <!-- <u-icon name="plus-circle"></u-icon> -->
          <view style="font-size: 20upx; writing-mode: vertical-rl;">新能源</view>
        </template>
      </view>
    </view>
    <section class="panel" :class="{ show: show }">
      <view class="header">
        <view class="p24" style="color: #267ef1" @click="panelReset">重置</view>
        <view
          src="/static/down.png"
          style="width: 140upx"
          mode="widthFix"
          @click="panelHide"
        />
        <view class="p24" @click="panelHide">关闭</view>
      </view>
      <view class="panelList clearfix">
        <!--				<view class="item" v-for="(item,index) of currentDatas" @click.stop="clickKeyBoard(item)">{{item}}</view>-->
        <!-- 其他组件内容 -->
        <view v-for="(item, index) in currentDatas" :key="index">
          <button
            class="item"
            :disabled="isDisabled(index)"
            @click="!isDisabled(index) && clickKeyBoard(item)"
          >
            {{ item }}
          </button>
        </view>
      </view>
      <view class="backspace shadow" @click="backspace">
        <u-icon name="backspace" color="#333" size="34"></u-icon>
      </view>
    </section>
  </view>
</template>
 
<script>
export default {
  name: "keyboard",
  props: {
    characterDatas: {
      type: Array,
      default() {
        return [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          0,
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
          "港",
          "澳",
          "学",
          "领",
        ];
      },
    },
    areaDatas: {
      type: Array,
      default() {
        return [
          "京",
          "沪",
          "粤",
          "津",
          "冀",
          "晋",
          "蒙",
          "黑",
          "吉",
          "辽",
          "苏",
          "浙",
          "皖",
          "闽",
          "赣",
          "鲁",
          "豫",
          "鄂",
          "湘",
          "桂",
          "琼",
          "渝",
          "川",
          "贵",
          "云",
          "藏",
          "陕",
          "甘",
          "青",
          "宁",
          "新",
          "临",
          "领",
          "警",
          "学",
          "港",
          "澳",
        ];
      },
    },
    defaultPlate: {
      type: Array,
      default() {
        return Array.from(
          {
            length: 8,
          },
          (v) => ""
        );
      },
    },
  },
  data() {
    return {
      show: false,
      index: -1,
      newEnergy: false,
      plate: this.defaultPlate,
    };
  },
  created() {},
  computed: {
    currentDatas() {
      return this.index === 0 ? this.areaDatas : this.characterDatas;
    },
  },
  watch: {
    defaultPlate(newValue) {
      this.plate = newValue;
    },
    plate(value) {
      this.$emit("listenPlateChange", value);
    },
  },
  methods: {
    panelShow() {
      this.show = true;
    },
    panelHide() {
      this.show = false;
    },
    handleChange(index) {
      this.index = index;
      if (index === 7) {
        this.newEnergy = true;
      }
      this.panelShow();
    },
    clickKeyBoard(item) {
      if (this.index < 7 || this.newEnergy) {
        this.$set(this.plate, this.index, item);
      }

      if (this.index < 7) {
        this.index++;
      }
    },
    backspace() {
      if (this.index > 0) {
        this.$set(this.plate, this.index, "");
        this.index--;
      }
    },
    panelReset() {
      this.index = 0;
      this.plate = Array.from(
        {
          length: 8,
        },
        (v) => ""
      );
      this.newEnergy = false;
    },
    isDisabled(index) {
      if (this.index === 0) {
        return index >= this.areaDatas.length - 6;
      } else {
        const lastFour = this.characterDatas.length - 4;
        if (this.index === 1) {
          return (
            typeof this.characterDatas[index] === "number" || index >= lastFour
          );
        }
        return index >= lastFour;
      }
      return false;
    },
  },
};
</script>
 
<style scoped lang='scss'>
.plate {
  display: flex;
  align-items: center;
  justify-content: center;

  .item {
    width: calc(100% / 7 - 30rpx);
    height: 90rpx;
    // background-color: #F2F3F5;
    border: 0.5px solid #b6b1b1;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    &.ml10 {
      margin-left: 10upx;
    }

    &.column {
      flex-direction: column;
      border: 1px solid #4cb58e;
    }

    &.active {
      background-color: #ddf5dd;
      border: 1px solid #85d870;
    }
  }
}

.panel {
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  z-index: 999;
  box-sizing: border-box;
  background-color: #ffffff;
  transition: all 0.3s ease;
  transform: translateY(100%);

  .p24 {
    padding: 24upx;
  }

  &.show {
    transform: translateX(0);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80upx;
    border-top: 1px solid #c9cacd;
    //border-bottom: 1px solid #c9cacd;
  }

  .panelList {
    padding: 20upx;
    text-align: center;

    .item {
      float: left;
      width: calc(100% / 10 - 10rpx);
      height: 76rpx;
      background: #fff;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10rpx 10rpx 0;
      font-size: 32rpx;
      font-weight: 600;
      box-shadow: 0 0 4px 1px #e5e5e5;
    }
  }

  .backspace {
    position: absolute;
    bottom: 25rpx;
    right: 26rpx;
    width: 100rpx;
    height: 84rpx;
    background-color: #cbcbcb;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.clearfix::before,
.clearfix::after {
  content: " ";
  display: table;
  height: 0;
  line-height: 0;
  visibility: hidden;
  clear: both;
}
</style>