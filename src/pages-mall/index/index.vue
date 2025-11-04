<style scoped lang="scss">
page {
  height: 100%;
}
.index {
  width: 100%;
  min-height: 100%;
  background-color: $uni-bg-color-grey;
  padding-bottom: calc(var(--window-bottom) + 40rpx);
  $mrb: 28rpx;
  .top-banner {
    $lct-msg-h: 100rpx;
    position: relative;
    width: 100%;
    height: calc(316rpx + #{$lct-msg-h});
    background-color: $uni-color-primary;
    overflow: hidden;
    .carousel-swiper {
      position: relative;
      z-index: 2;
      margin: 10rpx auto 0;
      $border-radius: 16rpx;
      width: 710rpx;
      height: 264rpx;
      border-radius: $border-radius;
      overflow: hidden;
      .carousel {
        width: 100%;
        height: 100%;
        border-radius: $border-radius;
        overflow: hidden;
      }
    }
    .bottom-border-radius {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      width: 100%;
      height: 40rpx;
      background-color: $uni-bg-color-grey;
      border-radius: 30rpx 30rpx 0 0;
    }
  }
  .special-area {
    width: 100%;
    // height: 200rpx;
    margin-bottom: 44rpx;
    /*  #ifdef  MP-WEIXIN  */
    // height: 230rpx;
    margin-bottom: 0rpx;
    padding: 25rpx 0 0;
    /*  #endif  */
    .s-a-swiper {
      height: 134rpx;
      &-item {
        @include flx-dsp($jsc: flex-start, $ali: center);
        margin-left: 18rpx;
        /* margin-top: 30rpx; */
      }
      ::v-deep .uni-swiper-wrapper {
        .uni-swiper-dots {
          bottom: 0rpx !important;
          /*  #ifdef  MP-WEIXIN  */
          bottom: 100rpx !important;
          /*  #endif  */
          .uni-swiper-dot-active {
            width: 30rpx;
            height: 10rpx;
            border-radius: 6rpx;
          }
        }
      }
    }
    .area {
      position: relative;
      top: 0rpx;
      /*  #ifdef  MP-WEIXIN  */
      top: -20rpx;
      /*  #endif  */
      &:last-child {
        margin-right: 0;
      }
      @include flx-dsp($jsc: center, $ali: center, $drt: column);
      margin-right: 46rpx;
      image {
        width: 98rpx;
        height: 98rpx;
        margin-bottom: 14rpx;
        // border-radius: 50%;
      }
      text {
        color: $uni-text-color;
        font-size: 25rpx;
        @include ellipsis($line: 1);
      }
    }
  }
  .section-card {
    background-color: #fff;
    border-radius: 30rpx;
    box-sizing: border-box;
    padding: 40rpx 20rpx 60rpx 20rpx;
    .card-header {
      @include flx-dsp($jsc: space-between, $ali: center);
      &-l {
        @include flx-dsp($jsc: flex-start, $ali: center);
        padding-left: 18rpx;
        font-size: $uni-spacing-row-lg;
      }
      &-r {
        @include flx-dsp($jsc: flex-end, $ali: center);
        text {
          font-size: $uni-font-size-base;
          color: $gray-1;
        }
      }
    }
    .card-body {
      padding: 30rpx 5rpx 0 5rpx;
      box-sizing: border-box;
    }
  }
  .scroll-v {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    @include flx-dsp($jsc: flex-start, $ali: center);
    border-radius: 10rpx;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .scroll-item {
      margin: 0 15rpx;
      width: 220rpx;
      @include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
      $pd-l: 20rpx;
      &::last-child {
        margin-right: 0;
      }
      image {
        width: 220rpx;
        height: 220rpx;
        border-radius: 10rpx;
      }
      .goods-name {
        width: 100%;
        padding-left: $pd-l;
        margin-top: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: $uni-font-size-base;
      }
      .price-container {
        padding-left: $pd-l;
        @include flx-dsp($jsc: flex-start, $ali: center);
        .present-price {
          color: $uni-color-primary;
          margin-right: 10rpx;
          .price-symbol {
            font-size: 24rpx;
          }
          .price-value {
            font-size: 34rpx;
          }
        }
        .original-price {
          text-decoration: line-through;
          color: $gray-2;
          .price-symbol {
            font-size: 20rpx;
          }
          .price-value {
            font-size: 28rpx;
          }
        }
      }
    }
  }
  .seconds-kill {
    max-height: 457rpx;
    margin-bottom: $mrb;
    .count-down {
      margin-left: 10rpx;
      @include flx-dsp($jsc: center, $ali: center);
      $cl: #ff6868;
      padding: 0 12rpx;
      height: 36rpx;
      border: 1rpx solid $cl;
      border-radius: 20rpx;
      color: $cl;
      .explain-text {
        font-size: 20rpx;
        margin-right: 10rpx;
      }
      .timer {
        @include flx-dsp($jsc: center, $ali: center);
        .time-val {
          @include flx-dsp($jsc: center, $ali: center);
          width: 30rpx;
          height: 30rpx;
          border-radius: 8rpx;
          background-color: $cl;
          color: #fff;
          font-size: 20rpx;
        }
        .colon {
          margin: 0 4rpx;
        }
      }
    }
  }
  .today-group {
    margin-bottom: $mrb;
    .card-body {
      @include flx-dsp($jsc: space-between, $ali: center);
      &.less2 {
        @include flx-dsp($jsc: flex-start, $ali: center);
        .group-buy {
          margin-right: 26rpx;
        }
      }
      .group-buy {
        position: relative;
        z-index: 2;
        @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
        width: 214rpx;
        height: 240rpx;
        .poster {
          margin-top: 10rpx;
          position: relative;
          z-index: 1;
          width: 160rpx;
          height: 144rpx;
          & > image {
            position: absolute;
            top: -10rpx;
            left: 0;
            z-index: 1;
            width: 156rpx;
            height: 144rpx;
          }
        }

        .price-container {
          position: relative;
          z-index: 3;
          @include flx-dsp($jsc: center, $ali: center, $drt: column);
          .present-price {
            position: relative;
            // top: 0rpx;
            color: #fff;
            .price-symbol {
              font-size: 24rpx;
            }
            .price-value {
              font-size: 32rpx;
            }
          }
          .original-price {
            position: relative;
            // top: -16rpx;
            color: rgba(0, 0, 0, 0.1);
            text-decoration: line-through;
            color: $gray-2;
            .price-symbol {
              font-size: 20rpx;
            }
            .price-value {
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }
  .merge {
    max-height: 457rpx;
    margin-bottom: $mrb;
    display: flex;
    padding: 20rpx 10rpx 10rpx;
    .merge-half {
      width: 50%;
      .card-header {
        min-height: 40rpx;
      }
      .card-header {
        .card-header-l {
          padding-left: 8rpx;
          .title {
            font-size: 24rpx;
          }
        }
      }
      .card-body {
        .scroll-item {
          margin: 0 10rpx;
          image {
            width: 152rpx;
            height: 152rpx;
          }
          .present-price {
            .price-value {
              font-size: 24rpx;
            }
          }
          .original-price {
            .price-value,
            .price-symbol {
              font-size: 20rpx;
            }
          }
        }
      }
      .changePd {
        padding: 20rpx 4rpx 0 4rpx;
        .group-buy {
          margin-right: 16rpx;
          .present-price {
            top: 18rpx;
            .price-symbol {
              font-size: 20rpx;
            }
            .price-value {
              font-size: 26rpx;
            }
          }
          .original-price {
            bottom: 0;
            .price-value {
              font-size: 22rpx;
            }
          }
        }
      }
      .newPd {
        padding: 32rpx 4rpx 0 4rpx;
        position: relative;
        .price-container {
          padding-top: 10rpx;
          padding-left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          .present-price {
            margin-right: 4rpx;
            .price-symbol {
              font-size: 20rpx;
            }
            .price-value {
              font-size: 22rpx;
            }
          }
          .price-symbol {
            .price-symbol {
              font-size: 20rpx;
            }
            .price-value {
              font-size: 20rpx;
            }
          }
        }
        .swiper-h {
          height: 224rpx;
        }
        .swiper-w {
          width: 50%;
        }
        .swiper-w2 {
          width: 25%;
        }
        .mask {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 2;
        }
      }
      .flex-center {
        justify-content: flex-start;
      }
    }
    .w100 {
      width: 100%;
      .scroll-v {
        .scroll-item {
          width: 152rpx;
        }
      }
    }
  }
  .recommend4you {
    width: 100%;
    &-title {
      @include flx-dsp($jsc: center, $ali: center);
      width: 100%;
      height: 104rpx;
      text {
        font-size: 34rpx;
      }
    }
    &-body {
      margin: 0 auto;
      width: 710rpx;
      .fall-item {
        $img-s: 330rpx;
        width: $img-s;
        border-radius: 16rpx;
        &.goods {
          position: relative;
          background-color: #fff;
          padding-bottom: 28rpx;
          $pd: 0 20rpx;
          margin-bottom: 20rpx;
          & > image.poster {
            position: relative;
            z-index: 1;
            border-radius: 16rpx 16rpx 0 0;
            width: 100%;
            max-height: $img-s;
          }
          .new-product {
            position: absolute;
            top: 0;
            right: 20rpx;
            z-index: 2;
            width: 56rpx;
            height: 50rpx;
          }
          .goods-info {
            padding: $pd;
            margin: 20rpx 0;
            flex-wrap: wrap;
            @include flx-dsp($jsc: flex-start, $ali: flex-start);
            font-size: $uni-font-size-base;
            @include ellipsis($line: 2);
          }
          .goods-tag {
            background-color: $uni-color-primary;
            border-radius: 10rpx 0 10rpx 0;
            color: #fff;
            padding: 2rpx 8rpx;
            font-size: 24rpx;
            margin-right: 10rpx;
          }
          .price {
            padding: $pd;
            @include flx-dsp($jsc: flex-start, $ali: flex-end);
            color: $uni-color-primary;
            &__symbol {
              font-size: 24rpx;
              margin-right: 4rpx;
            }
            &__money {
              position: relative;
              top: 2rpx;
              font-size: 34rpx;
            }
            &__decimals {
              font-size: 26rpx;
            }
            .sale-count {
              display: inline-block;
              margin-left: 10rpx;
              font-size: 20rpx;
              color: #999999;
            }
          }
        }
        &.hot-shop {
          background-size: contain;
          background-image: url('~@/pages-mall/static/hot_shop_bg.png');
          padding: 22rpx 22rpx 20rpx 22rpx;
          box-sizing: border-box;
          margin-bottom: 20rpx;
          .shop-header {
            margin-bottom: 20rpx;
            @include flx-dsp($jsc: space-between, $ali: center);
            text:first-child {
              font-size: $uni-font-size-lg;
            }
            text:last-child {
              font-size: $uni-font-size-base;
              color: $gray-1;
            }
          }
          .shop-item {
            margin-top: 20rpx;
            width: 100%;
            @include flx-dsp($jsc: flex-start, $ali: center);
            image {
              width: 80rpx;
              height: 80rpx;
              margin-right: 26rpx;
              border-radius: 50%;
            }
            text {
              flex: 1;
              @include ellipsis($line: 1);
              font-size: $uni-font-size-base;
            }
          }
        }
      }
    }
  }
  .custom-bar {
    .section-card {
      margin-top: $mrb;
      padding: 10rpx;
      &:first-child {
        margin-top: none;
      }
      .scroll-item {
        margin: 0 30rpx 0 0;
        width: 140rpx;
        image {
          width: 140rpx;
          height: 140rpx;
          background-color: #eee;
        }
        .goods-name,
        .price-container {
          padding-left: 0;
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .price-container {
          .price-value {
            font-size: 28rpx;
          }
        }
      }
      .loadMore {
        width: 70rpx;
        display: flex;
        align-items: center;
        text {
          color: #999;
          font-size: 24rpx;
        }
        .loadMore-arrow {
          padding-right: 10rpx;
        }
        .more-txt {
          writing-mode: vertical-lr;
          letter-spacing: 8rpx;
        }
      }
      .card-body {
        padding: 20rpx 4rpx 0;
      }
    }
  }
  .go-back {
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    position: fixed;
    z-index: 9;
    right: 20rpx;
    bottom: calc(var(--window-bottom) + 40rpx);
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    border: 0.5px solid #ddd;
    background-color: #fff;
    text {
      font-size: #444;
      font-size: 24rpx;
    }
    ::v-deep .cl-icon-back {
      font-size: 60rpx !important;
      color: #d2d2d2;
      //background-color: #fff;
    }
  }
  ::v-deep .cl-divider__line {
    background: #e6e6e6 !important;
  }

  ::v-deep .cl-dialog .cl-dialog__container {
    padding: 0;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 0;
  }

  .middle-swiper {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    $border-radius: 16rpx;
    width: 710rpx;
    height: 200rpx;
    border-radius: $border-radius;
    overflow: hidden;
    .middle-swiper-img {
      width: 100%;
      height: 100%;
      border-radius: $border-radius;
      overflow: hidden;
    }
  }

  .customize-waterfall {
    width: 100%;
    @include flx-dsp($jsc: space-between, $ali: flex-start);
    .col-l,
    .col-r {
      flex: 1;
      @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
    }
  }
}
</style>

<template>
  <view class="index" :style="{ minHeight: scrollH + 'rpx' }">
    <view class="top-banner">
      <!-- 位置、信息 -->
      <location-msg ref="locationMsgRef"></location-msg>
      <!-- 轮播banner图 -->
      <swiper
        class="carousel-swiper"
        indicator-active-color="#fff"
        :indicator-dots="true"
        :autoplay="true"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item v-for="(item, index) in carouselList" :key="index">
          <image
            @tap="pageClick({ actionType: 'banner', data: item })"
            class="carousel"
            :src="item.img"
            mode="aspectFill"
          ></image>
        </swiper-item>
      </swiper>
      <view class="bottom-border-radius"></view>
    </view>
    <!-- 专区 -->
    <view class="special-area" v-if="specialArea.length > 0">
      <!-- <swiper class="s-a-swiper common-width" indicator-active-color="#C8924B" indicator-color="rgba(230, 185, 50, .2)" indicator-dots >
				<swiper-item class="s-a-swiper-item" v-for="(area, index) in specialArea" :key="index">
					<view class="area" @tap="specialAreaClick({funKey: item.spellKey, data: item})" v-for="(item, i) in area" :key="i">
						<image  :src="item.img" mode="aspectFill"></image>
						<text>{{item.name}}</text>
					</view>
				</swiper-item>
			</swiper> -->
      <view class="s-a-swiper common-width">
        <view class="s-a-swiper-item" v-for="(area, index) in specialArea" :key="index">
          <view class="area" @tap="advertJump(item)" v-for="(item, i) in area" :key="i">
            <image :src="item.filePath" mode="aspectFill"></image>
            <text>{{ item.advertName }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 限时秒杀和每日必拼 -->
    <view class="section-card seconds-kill today-group merge common-width" v-if="scKill.length || groupBuy.length">
      <view
        class="merge-half"
        @tap="pageClick({ actionType: 'scKill', isMore: 1 })"
        v-if="scKill.length"
        :class="groupBuy.length == 0 && isNoGroupBuyList ? 'w100' : ''"
      >
        <view class="card-header">
          <view class="card-header-l">
            <text class="title">限时秒杀</text>
            <view class="count-down">
              <text class="explain-text">距结束</text>
              <view class="timer">
                <text class="time-val">{{ countDown.h }}</text>
                <text class="colon">:</text>
                <text class="time-val">{{ countDown.m }}</text>
                <text class="colon">:</text>
                <text class="time-val">{{ countDown.s }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="card-body newPd" :class="groupBuy.length == 0 ? 'flex-center' : ''" v-if="!isNoGroupBuyList">
          <swiper
            class="scroll-v swiper-h"
            :class="[groupBuyTmp === 0 ? 'swiper-w2' : 'swiper-w']"
            :autoplay="true"
            :interval="4000"
            :duration="0"
            disable-touch
          >
            <swiper-item class="scroll-item" v-for="(item, index) in scKill" :key="index">
              <image :src="item.img" mode="aspectFill"></image>
              <view class="price-container">
                <view class="present-price">
                  <text class="price-symbol">&yen;</text>
                  <text class="price-value">{{ item.presentPrice }}</text>
                </view>
                <view class="original-price">
                  <text class="price-symbol">&yen;</text>
                  <text class="price-value">{{ item.originalPrice }}</text>
                </view>
              </view>
            </swiper-item>
          </swiper>
          <swiper
            class="scroll-v swiper-h"
            :class="[groupBuyTmp == 0 ? 'swiper-w2' : 'swiper-w']"
            :autoplay="true"
            :interval="7000"
            :duration="0"
            disable-touch
          >
            <swiper-item class="scroll-item" v-for="(item, index) in scKillSecond" :key="index">
              <image :src="item.img" mode="aspectFill"></image>
              <view class="price-container">
                <view class="present-price">
                  <text class="price-symbol">&yen;</text>
                  <text class="price-value">{{ item.presentPrice }}</text>
                </view>
                <view class="original-price">
                  <text class="price-symbol">&yen;</text>
                  <text class="price-value">{{ item.originalPrice }}</text>
                </view>
              </view>
            </swiper-item>
          </swiper>
          <view class="mask"></view>
        </view>
        <view class="card-body newPd" v-else>
          <view class="scroll-v" style="overflow: hidden">
            <template v-for="(item, i) in allSckill">
              <view class="scroll-item" :key="i" v-if="i < 4">
                <image :src="item.img" mode="aspectFill"></image>
                <view class="price-container">
                  <view class="present-price">
                    <text class="price-symbol">&yen;</text>
                    <text class="price-value">{{ item.presentPrice }}</text>
                  </view>
                  <view class="original-price">
                    <text class="price-symbol">&yen;</text>
                    <text class="price-value">{{ item.originalPrice }}</text>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
      <view
        class="merge-half"
        @tap="pageClick({ actionType: 'groupBuy', isMore: 1 })"
        v-if="groupBuyTmp"
        :class="scKill.length == 0 && isNoScKillList ? 'w100' : ''"
      >
        <view class="card-header">
          <view class="card-header-l">
            <text class="title">今日必拼</text>
          </view>
          <!-- <view class="card-header-r" @tap="pageClick({actionType: 'groupBuy', isMore: 1})">
						<text>更多</text>
					</view> -->
        </view>
        <view class="card-body newPd" :class="{ less2: groupBuy.length <= 2 }">
          <view class="scroll-v" style="overflow: hidden">
            <template v-for="(item, i) in groupBuy">
              <view class="scroll-item" :key="i" v-if="i < (scKill.length == 0 ? 4 : 2)">
                <image :src="item.img" mode="aspectFill"></image>
                <view class="price-container">
                  <view class="present-price">
                    <text class="price-symbol">&yen;</text>
                    <text class="price-value">{{ item.presentPrice }}</text>
                  </view>
                  <view class="original-price">
                    <text class="price-symbol">&yen;</text>
                    <text class="price-value">{{ item.originalPrice }}</text>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <!-- 自定义栏 -->
    <view class="custom-bar common-width">
      <template v-for="(item, index) in customGoodsList">
        <view class="section-card" :key="index" v-if="item.list.length > 0">
          <view class="card-header">
            <view class="card-header-l">
              <text class="title">{{ item.title }}</text>
            </view>
            <!-- <view class="card-header-r" @tap="pageClick({actionType: 'custom', isMore: 1, data: item})">
							<text>更多</text>
						</view> -->
          </view>
          <view class="card-body" @tap="pageClick({ actionType: 'custom', isMore: 1, data: item })">
            <view scroll-x="true" class="scroll-v">
              <view class="scroll-item" v-for="(goods, i) in item.list" :key="i">
                <image :src="goods.poster" mode="aspectFill"></image>
                <!-- <text class="goods-name">{{goods.goodsName}}</text> -->
                <view class="price-container">
                  <view class="present-price">
                    <text class="price-symbol">&yen;</text>
                    <text class="price-value">{{ goods.price }}</text>
                  </view>
                </view>
              </view>
              <view class="loadMore">
                <text class="loadMore-arrow"></text>
                <text class="more-txt">查看更多</text>
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 首页中部广告 -->
    <view class="common-width" style="margin-top: 28rpx" v-if="middleAdList.length > 0">
      <swiper
        class="middle-swiper"
        indicator-active-color="#fff"
        :autoplay="true"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item v-for="(item, index) in middleAdList" :key="index">
          <image @tap="advertJump(item)" class="middle-swiper-img" :src="item.img" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- · 为 / 您 / 推 / 荐 · -->
    <view class="recommend4you">
      <view class="recommend4you-title">
        <text>· 为 / 您 / 推 / 荐 ·</text>
      </view>
      <view class="recommend4you-body">
        <!-- 瀑布流 -->
        <cl-waterfall v-if="false" ref="waterfall" :column="2" v-model="waterfallList">
          <cl-waterfall-column v-for="(child, index) in waterfallList" :key="index">
            <view v-for="(item, i) in child" :key="i">
              <view class="fall-item goods" @tap="pageClick({ actionType: 'goods', data: item })">
                <image
                  v-show="item.newProduct"
                  class="new-product"
                  src="@/pages-mall/static/new_product.png"
                  mode="aspectFit"
                ></image>
                <image class="poster" :src="item.poster" mode="widthFix"></image>
                <text class="goods-info">
                  <text v-if="item.mode === '自营'" class="goods-tag">{{ item.mode }}</text>
                  {{ item.title }}
                </text>
                <view class="price">
                  <text class="price__symbol">&yen;</text>
                  <text class="price__money" v-if="item.price">{{ item.price.int }}</text>
                  <text class="price__decimals" v-if="item.price">{{ item.price.flt }}</text>
                  <text class="sale-count">{{ item.salesCount }}人付款</text>
                </view>
              </view>
            </view>
          </cl-waterfall-column>
        </cl-waterfall>
        <!-- 自定义列表 -->
        <div class="customize-waterfall" v-if="waterfallList.length">
          <template v-if="waterfallList[0]">
            <div class="col-l">
              <view
                v-for="(item, lIdx) in waterfallList[0]"
                :key="lIdx + 'l'"
                class="fall-item goods"
                @tap="pageClick({ actionType: 'goods', data: item })"
              >
                <image
                  v-show="item.newProduct"
                  class="new-product"
                  src="@/pages-mall/static/new_product.png"
                  mode="aspectFit"
                ></image>
                <image class="poster" :src="item.poster" mode="widthFix"></image>
                <text class="goods-info">
                  <text v-if="item.mode === '自营'" class="goods-tag">{{ item.mode }}</text>
                  {{ item.title }}
                </text>
                <view class="price">
                  <text class="price__symbol">&yen;</text>
                  <text class="price__money" v-if="item.price">{{ item.price.int }}</text>
                  <text class="price__decimals" v-if="item.price">{{ item.price.flt }}</text>
                  <text class="sale-count">{{ item.salesCount }}人付款</text>
                </view>
              </view>
            </div>
          </template>
          <template v-if="waterfallList[1]">
            <div class="col-r">
              <view
                v-for="(item, rIdx) in waterfallList[1]"
                :key="rIdx + 'r'"
                class="fall-item goods"
                @tap="pageClick({ actionType: 'goods', data: item })"
              >
                <image
                  v-show="item.newProduct"
                  class="new-product"
                  src="@/pages-mall/static/new_product.png"
                  mode="aspectFit"
                ></image>
                <image class="poster" :src="item.poster" mode="widthFix"></image>
                <text class="goods-info">
                  <text v-if="item.mode === '自营'" class="goods-tag">{{ item.mode }}</text>
                  {{ item.title }}
                </text>
                <view class="price">
                  <text class="price__symbol">&yen;</text>
                  <text class="price__money" v-if="item.price">{{ item.price.int }}</text>
                  <text class="price__decimals" v-if="item.price">{{ item.price.flt }}</text>
                  <text class="sale-count">{{ item.salesCount }}人付款</text>
                </view>
              </view>
            </div>
          </template>
        </div>
        <cl-loadmore
          v-show="load.show"
          :text="load.text"
          :finish="load.finish"
          finish-text="我是底线"
          :loading="load.pending"
        ></cl-loadmore>
      </view>
    </view>

    <!-- 开屏页广告 -->
    <homepage-adver ref="elHomePageAdver"></homepage-adver>

    <!-- 回到顶部 -->
    <backTop :scrollTop="scrollTop"></backTop>

    <!-- 底部导航栏 -->
    <m-tabbar></m-tabbar>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import locationMsg from './locaiton-msg.vue'
import { userAuth, advertJumpMx } from '@/js/minxins.js'
import homepageAdver from './module/homepage-adver.vue'
import backTop from './module/back-top.vue'
import mTabbar from '@/pages-mall/components/m-tabbar.vue'

export default {
  options: { styleIsolation: 'shared' },
  data() {
    return {
      title: '',
      interval: 5000,
      duration: 1000,
      shopCartNum: 0,
      carouselList: [
        {
          img: require('@/pages-mall/static/default._banner.png'),
          isDefault: 1
        }
      ],
      specialArea: [],
      countDown: {
        timeVal: '2021-06-01 23:59:59',
        h: '00',
        m: '00',
        s: '00',
        timer: null
      },
      scKill: [],
      scKillSecond: [],
      allSckill: [],
      groupBuy: [],
      waterfallList: [],
      load: {
        text: '滚动上拉加载',
        finish: false,
        pending: false,
        show: false,
        current: 1,
        pageSize: 10
      },
      inited: false,
      customGoodsList: [],
      query: null,
      cmLoading: false, // 推荐商品是否加载中
      scrollTop: 0, //  滚动位置到顶部的距离
      middleAdList: [], // 首页中部广告
      isNoScKillList: false,
      isNoGroupBuyList: false
    }
  },
  mixins: [userAuth, advertJumpMx],
  components: {
    locationMsg,
    homepageAdver,
    backTop,
    mTabbar
  },
  computed: {
    ...mapState('mall', {
      homeJumpOtherPage: 'homeJumpOtherPage'
    }),
    groupBuyTmp() {
      return this.groupBuy.length
    },
    scrollH: function () {
      let sys = uni.getSystemInfoSync()
      let winWidth = sys.windowWidth
      let winrate = 750 / winWidth
      let winHeight = parseInt(sys.windowHeight * winrate)
      return winHeight
    }
  },
  mounted() {
    
  },
  methods: {
    ...mapMutations({
      updateHomeJumpOtherPage: 'mall/updateHomeJumpOtherPage'
    }),
    startCountDown() {
      const formatDate = this.$cmMth.formatDate
      const today = formatDate({ type: 'd2d', value: new Date(), format: 'YY-MM-DD' })
      const countDown = `${today} 23:59:59`
      const endTime = formatDate({ type: 'd2s', value: countDown })
      const displayTime = () => {
        const startTime = new Date().getTime()
        const second = (endTime - startTime) / 1000
        if (second > 0) {
          let days = 0,
            h = 0,
            m = 0,
            s = 0
          days = Number.parseInt(second / 60 / 60 / 24)
          h = Number.parseInt(second / 3600) % 24
          m = Number.parseInt(second / 60) % 60
          s = Math.floor(second % 60)
          this.countDown.h = h >= 10 ? h : '0' + h
          this.countDown.m = m >= 10 ? m : '0' + m
          this.countDown.s = s >= 10 ? s : '0' + s
        }
      }

      displayTime()
      this.countDown.timer = setInterval((_) => {
        const startTime = new Date().getTime()
        const second = (endTime - startTime) / 1000
        if (second <= 0) {
          this.clearCountDown()
        } else {
          let days = 0,
            h = 0,
            m = 0,
            s = 0
          days = Number.parseInt(second / 60 / 60 / 24)
          h = Number.parseInt(second / 3600) % 24
          m = Number.parseInt(second / 60) % 60
          s = Math.floor(second % 60)
          this.countDown.h = h >= 10 ? h : '0' + h
          this.countDown.m = m >= 10 ? m : '0' + m
          this.countDown.s = s >= 10 ? s : '0' + s
        }
      }, 1000)
    },
    clearCountDown() {
      clearInterval(this.countDown.timer)
      this.countDown.timer = null
      this.countDown.h = '00'
      this.countDown.m = '00'
      this.countDown.s = '00'
    },
    getShopCart() {
      const testPms = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ statusCode: 200, data: { shopCartNum: 3 } })
        }, 100)
      })
      const pms = testPms
      return pms.then((res) => {
        this.shopCartNum = 0
        if (res.statusCode === 200) {
          const { shopCartNum } = res.data || {}
          this.shopCartNum = shopCartNum
        }
      })
    },
    getBanner() {
      const { projectId } = this.getProjectInfo()
      const params = {
        data: {
          advertType: '1',
          projectId: projectId || ''
        },
        hideLoading: true,
        responseToast: false
      }
      const prodPms = this.$mallApi.data.getBanner(params)
      const pms = prodPms
      return pms.then((res) => {
        if (res.statusCode === 200) {
          const list = Array.isArray(res.data) ? res.data : []
          this.carouselList = []
          list.forEach((item, i) => {
            const { filePath } = item
            const banner = {
              ...item,
              img: filePath
            }
            this.carouselList.push(banner)
          })
          if (list.length === 0)
            this.carouselList = [
              {
                img: require('@/pages-mall/static/default._banner.png'),
                isDefault: 1
              }
            ]
        }
      })
    },
    getScKill() {
      const today = this.$cmMth.formatDate({ value: new Date(), type: 'd2d', format: 'YY-MM-DD' })
      const { companyId } = this.$cmMth.getUserStatusInfo()
      const { projectId } = this.getProjectInfo()
      const params = {
        data: {
          promotionType: 2,
          activityDateEnd: today,
          companyId: companyId || '',
          projectId
        },
        pathParams: `/20/1`,
        hideLoading: true
      }
      const prodPms = this.$mallApi.data.getPromotionGoods(params)
      const pms = prodPms
      this.clearCountDown()
      return pms.then((res) => {
        this.scKill = []
        this.scKillSecond = []
        this.allSckill = []
        if (res.statusCode === 200) {
          const list = res.data && Array.isArray(res.data.records) ? res.data.records : []
          if (list.length == 0) {
            this.isNoScKillList = true
          }
          list.forEach((item, i) => {
            const { specList, logo, gmName, priceStr, activityPriceStr } = item
            const goods = {
              ...item,
              img: logo || '',
              name: gmName,
              originalPrice: priceStr,
              presentPrice: activityPriceStr
            }
            // Array.isArray(specList) && specList.some(item => {
            // 	if (item.promotionActivity) {
            // 		const {activityPrice} = item.promotionActivity || {};
            // 		goods.originalPrice = item.price;
            // 		goods.presentPrice = activityPrice;
            // 		return
            // 	}
            // })
            this.allSckill.push(goods)
            let sumNumber = Math.ceil(list.length / 2) - 1
            if (i <= sumNumber) {
              this.scKill.push(goods)
            } else {
              this.scKillSecond.push(goods)
            }
          })
          if (list.length) this.startCountDown()
        }
      })
    },
    getGroupBuy() {
      const { companyId } = this.$cmMth.getUserStatusInfo()
      const { projectId } = this.getProjectInfo()
      const params = {
        data: {
          promotionType: 1,
          companyId: companyId || '',
          projectId
        },
        pathParams: `/4/1`,
        hideLoading: true
      }
      const prodPms = this.$mallApi.data.getPromotionGoods(params)
      const pms = prodPms
      return pms.then((res) => {
        if (res.statusCode === 200) {
          const list = res.data && Array.isArray(res.data.records) ? res.data.records : []
          if (list.length == 0) {
            this.isNoGroupBuyList = true
          }
          this.groupBuy = list.map((item) => {
            // let activityItem = item.specList?.find(act => act.promotionActivity)
            return {
              ...item,
              img: item.logo || '',
              name: item.gmName,
              originalPrice: item.priceStr,
              presentPrice: item.activityPriceStr
            }

            // return Boolean(activityItem) ? {
            //   ...groupTmp,
            //   originalPrice: activityItem.price,
            // 	presentPrice: activityItem.promotionActivity.activityPrice,
            // } : groupTmp
          })
        }
      })
    },
    getSpecialArea(params = {}) {
      const { isReset } = params
      const { companyId } = this.$cmMth.getUserStatusInfo()

      const { projectId } = this.getProjectInfo()
      const data = {
        advertType: 5, // 广告位置(1:商城 3:首页福利来了 4：首页开屏页 5:首页功能区 6:首页中部推广)
        projectId: projectId || ''
      }

      return this.$mallApi.data.getBanner({ data, hideLoading: true }).then((res) => {
        this.specialArea = []
        if (res.statusCode === 200) {
          const list = Array.isArray(res.data) ? res.data : []
          list.forEach((item, i) => {
            const index = Math.floor(i / 5)
            const indexElem = this.specialArea[index]

            if (!indexElem) {
              this.specialArea[index] = [item]
            } else {
              this.specialArea[index].push(item)
            }

            // const indexElem = this.specialArea[index];
            // origin.some(sa => {
            // 	if (sa.name === item.configName) {
            // 		item.name = item.configName;
            // 		item.img = sa.img;
            // 		item.spellKey = sa.spellKey;
            // 		return
            // 	}
            // })
            // if (!indexElem) {
            // 	this.specialArea[index] = [item];
            // } else {
            // 	this.specialArea[index].push(item);
            // }
          })
        }
      })
    },
    getRecommendGoodsOld(params = {}) {
      const { isReset } = params
      const { current, pageSize } = this.load
      const { memberId, companyId } = this.$cmMth.getUserStatusInfo() || {}
      const { projectId } = this.getProjectInfo()
      const args = {
        pathParams: `/${pageSize}/${current}`,
        data: {
          //memberId,
          //companyId: companyId || '',
          projectId
        },
        hideLoading: true
      }
      const prodPms = this.$mallApi.data.getRecommendGoods(args)
      const pms = prodPms
      if (isReset) {
        this.load.show = false
      } else {
        this.load.show = true
        this.load.text = '加载中'
      }
      this.cmLoading = true
      return pms
        .then((res) => {
          this.cmLoading = false
          this.load.show = true
          if (isReset) {
            const ref = this.$refs['waterfall']
            this.waterfallList = []
            ref && ref.refresh && ref.refresh([])
          }
          this.$nextTick((_) => {
            const waterfallRef = this.$refs['waterfall']
            if (res.statusCode === 200) {
              const list = res.data && Array.isArray(res.data.records) ? res.data.records : []
              const allLoaded = list.length < pageSize
              let dividerText = ''
              const waterfallList = []
              list.forEach((item, i) => {
                const { price, gmName, files, logo, lowestPrice, sellerSource, clientSalesCount } = item
                const salesCount = this.$cmMth.formatSaleCount(clientSalesCount)
                const { int, flt } = this.$cmMth.formatSum({ value: lowestPrice, type: 'UpperCamelCase' })
                const poster = logo
                const goods = {
                  ...item,
                  title: gmName,
                  poster,
                  price: {
                    int,
                    flt,
                    value: Number(lowestPrice)
                  },
                  mode: sellerSource === 0 ? '自营' : '加盟',
                  newProduct: 0,
                  salesCount
                }
                waterfallList.push(goods)
              })
              waterfallRef && waterfallRef.append && waterfallRef.append(waterfallList)
              dividerText = waterfallList.length <= 1 ? '暂无商品~' : allLoaded ? '我的底线' : '滚动上拉加载'
              this.load.text = dividerText
              this.load.finish = allLoaded
              ++this.load.current
            } else {
              this.load.text = '滚动上拉加载'
            }
          })
        })
        .catch((_) => {
          this.cmLoading = false
          this.load.text = '滚动上拉加载'
        })
    },
    getRecommendGoods(params = {}) {
      const { isReset } = params
      const { current, pageSize } = this.load
      const { projectId } = this.getProjectInfo()
      const args = {
        pathParams: `/${pageSize}/${current}`,
        data: {
          //memberId,
          //companyId: companyId || '',
          projectId
        },
        hideLoading: true
      }
      const prodPms = this.$mallApi.data.getRecommendGoods(args)
      const pms = prodPms
      if (isReset) {
        this.load.show = false
      } else {
        this.load.show = true
        this.load.text = '加载中'
      }
      this.cmLoading = true
      return pms
        .then((res) => {
          this.cmLoading = false
          this.load.show = true
          if (isReset) this.waterfallList = []
          this.$nextTick((_) => {
            if (res.statusCode === 200) {
              const list = res.data && Array.isArray(res.data.records) ? res.data.records : []
              const allLoaded = list.length < pageSize
              let dividerText = ''
              if (list.length && this.waterfallList.length === 0) this.waterfallList = [[], []]
              list.forEach((item, i) => {
                const { gmName, logo, lowestPrice, sellerSource, clientSalesCount } = item
                const salesCount = this.$cmMth.formatSaleCount(clientSalesCount)
                const { int, flt } = this.$cmMth.formatSum({ value: lowestPrice, type: 'UpperCamelCase' })
                const poster = logo
                const goods = {
                  ...item,
                  title: gmName,
                  poster,
                  price: {
                    int,
                    flt,
                    value: Number(lowestPrice)
                  },
                  mode: sellerSource === 0 ? '自营' : '加盟',
                  newProduct: 0,
                  salesCount
                }
                this.waterfallList[i % 2].push(goods)
              })
              dividerText = this.waterfallList.length <= 1 ? '暂无商品~' : allLoaded ? '我的底线' : '滚动上拉加载'
              this.load.text = dividerText
              this.load.finish = allLoaded
              ++this.load.current
            } else {
              this.load.text = '滚动上拉加载'
            }
          })
        })
        .catch((_) => {
          this.cmLoading = false
          this.load.text = '滚动上拉加载'
        })
    },
    pageClick(params = {}) {
      const { actionType, isMore, data = {} } = params
      let args = null,
        detailUrl = '',
        moreUrl = ''
      if (actionType === 'search') {
        args = {
          url: '/pages-mall-b/search/history-search'
        }
      } else if (actionType === 'scKill') {
        detailUrl = `/pages-mall-a/shopping-info/shopping-info?shopId=${data.gmId}&shopType=2`
        moreUrl = `/pages-mall-a/seckill/limit-time-seckill`
        args = { url: isMore ? moreUrl : detailUrl }
      } else if (actionType === 'groupBuy') {
        detailUrl = `/pages-mall-a/shopping-info/shopping-info?shopId=${data.gmId}&shopType=1`
        moreUrl = `/pages-mall-a/group-buy/today-group-buy`
        args = { url: isMore ? moreUrl : detailUrl }
      } else if (actionType === 'hotShop') {
        detailUrl = `/pages-mall-a/shop/detail?shopId=${data.sellerId}`
        moreUrl = `/pages-mall-a/shop/list`
        args = { url: isMore ? moreUrl : detailUrl }
      } else if (actionType === 'goods') {
        args = {
          url: `/pages-mall-a/shopping-info/shopping-info?shopId=${data.gmId}`
        }
      } else if (actionType === 'custom') {
        const { title, customId, gmId } = data
        const detailUrl = `/pages-mall-a/shopping-info/shopping-info?shopId=${gmId}&shopType=0`
        const moreUrl = `/pages-mall-a/custom-bar/custom-list?title=${title}&customId=${customId}`
        args = { url: isMore ? moreUrl : detailUrl }
      }
      if (actionType === 'banner') {
        this.advertJump(data)
        return
      }
      if (args) {
        this.updateHomeJumpOtherPage(true)
        uni.navigateTo(args)
      } else {
        const prms = {
          title: '暂未开放此功能，请敬请期待!',
          duration: 2000,
          icon: 'none'
        }
        uni.showToast(prms)
      }
    },
    specialAreaClick(params) {
      const { funKey, data } = params
      const prms = {
        title: '暂未开放此功能，请敬请期待!',
        duration: 2000,
        icon: 'none'
      }
      let url = ''
      switch (funKey) {
        case 'xsms':
          url = '/pages-mall-a/seckill/limit-time-seckill'
          break
        case 'jfsc':
          url = '/pages-mall-a/integral/integral-mall'
          break
        case 'zbdp':
          url = '/pages-mall-a/shop/list?fromCircum=1'
          break
        case 'jrbp':
          url = `/pages-mall-a/group-buy/today-group-buy`
          break
        case 'lqzx':
          url = `/pages-mall-a/coupon-manage/coupon-manage`
          break
        case 'qbsp':
          url = `/pages-mall-a/search-list/search-list?fromType=allGoods`
          break
      }
      if (url) {
        this.updateHomeJumpOtherPage(true)
        uni.navigateTo({ url })
      } else {
        uni.showToast(prms)
      }
    },
    getCustomBarGoods(params) {
      const { isReset } = params || {}
      const { companyId } = this.$cmMth.getUserStatusInfo()
      const { projectId } = this.getProjectInfo()
      return this.$mallApi.data
        .getCustomBarGoods({ data: { companyId, projectId, isRecommend: 0 }, hideLoading: true, pathParams: '/10/1' })
        .then((res) => {
          if (res.statusCode === 200) {
            const list = (res.data && Array.isArray(res.data.records) && res.data.records) || []
            const precision = this.$cmMth.precision
            this.customGoodsList = []
            list.forEach((item) => {
              const { customName, modules } = item
              const card = {
                ...item,
                title: customName,
                list: []
              }
              Array.isArray(modules) &&
                item.modules.forEach((goods) => {
                  const { gmName, lowestPrice, logo } = goods || {}
                  const { int, flt } = this.$cmMth.formatSum({ value: lowestPrice, type: 'UpperCamelCase' })
                  const gd = {
                    ...goods,
                    goodsName: gmName,
                    price: `${int}${flt}`,
                    poster: logo
                  }
                  card.list.push(gd)
                })
              this.customGoodsList.push(card)
            })
          }
        })
    },
    updateProject() {
      this.$nextTick((_) => {
        const ref = this.$refs.locationMsgRef
        if (ref && ref.getLocationMsg) {
          ref.getLocationMsg()
          this.isChangeProject = ref.isChangeProject
        }
      })
    },
    getProjectInfo() {
      const { PROJECT_INFO } = this.$constant
      const data = this.$cmMth.storageAction({ key: PROJECT_INFO, action: 'get' })
      return data || {}
    },
    refreshPageData() {
      this.load.finish = false
      this.load.current = 1
      this.initPageData({ onShowRefresh: 1 })
    },
    async initPageData(params) {
      const ref = this.$refs.locationMsgRef
      const { pullDownRefresh, onShowRefresh, options } = params || {}
      const isInit = !pullDownRefresh && !onShowRefresh
      this.inited = false

      if (isInit) uni.showLoading({ title: '加载中' })
      this.updateProject()
      Promise.all([
        this.getShopCart(),
        this.getBanner(),
        this.getScKill(),
        this.getGroupBuy(),
        this.getSpecialArea({ isReset: 1 }),
        this.getRecommendGoods({ isReset: 1 }),
        this.getCustomBarGoods({ isReset: 1 }),
        this.getMiddleAdvert()
      ]).finally((res) => {
        if (isInit) uni.hideLoading()
        this.inited = true
        if (pullDownRefresh) uni.stopPullDownRefresh()
      })
    },
    // 根据项目设置页面标题
    setPageTitle() {
      uni.setNavigationBarTitle({
        title: process.env.VUE_APP_BAR_TITLE || '首页'
      })
    },
    setOpeningAdStorage(adverList) {
      let obj = {
        data: adverList,
        storageTime: Date.now()
      }
      const { OPEN_AD } = this.$constant
      this.$cmMth.storageAction({ key: OPEN_AD, action: 'set', value: JSON.stringify(obj) })
    },
    getOpeningAdStorage() {
      const duration = 24 * 60 * 60 * 1000 // 存放时间：24小时
      const { OPEN_AD } = this.$constant
      let openingAdStorage = this.$cmMth.storageAction({ key: OPEN_AD, action: 'get' })
      if (openingAdStorage) {
        openingAdStorage = JSON.parse(openingAdStorage)
        if (Date.now() - openingAdStorage.storageTime > duration) {
          this.$cmMth.storageAction({ key: OPEN_AD, action: 'remove' })
          return null
        }
        return openingAdStorage.data
      } else {
        return null
      }
    },
    // 获取中部广告图
    async getMiddleAdvert() {
      const { projectId } = this.getProjectInfo()

      const params = {
        data: {
          advertType: 6, // 广告位置(1:商城 3:首页福利来了 4：首页开屏页 5:首页功能区 6:首页中部推广)
          projectId: projectId || ''
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await this.$mallApi.data.getBanner(params)

      if (res.statusCode === 200) {
        let list = res.data
        this.middleAdList = []
        if (list && list.length > 0) {
          list.forEach((item, i) => {
            const { filePath } = item
            const banner = {
              ...item,
              img: filePath
            }
            this.middleAdList.push(banner)
          })
        }
      }
    }
  },
  onReachBottom() {
    const cmLoading = this.cmLoading
    const inited = this.inited
    const { finish } = this.load
    if (cmLoading || !inited || finish) return
    this.getRecommendGoods()
  },
  onPullDownRefresh() {
    this.load.finish = false
    this.load.current = 1
    this.initPageData({ pullDownRefresh: 1 })
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  onLoad(options) {
    this.query = options

    // 当从分享的链接跳转进来时，缓存分享者ID
    if (options.shareId) {
      const { SHARE_ID } = this.$constant
      this.$cmMth.storageAction({ key: SHARE_ID, action: 'set', value: options.shareId })
    }

    // 统计访问流量的接口
    this.$mallApi.data.addNumberOfVisits()
    this.setPageTitle()
    this.initPageData({ options })

    // 判断开屏页广告缓存是否过期，如过期重新调查询接口，否则不显示广告
    this.$nextTick(() => {
      const { projectId } = this.getProjectInfo()
      this.$refs.elHomePageAdver.getAdverList(projectId)
    })
  },
  onShow() {
    const inited = this.inited
    const homeJumpOtherPage = this.homeJumpOtherPage
    if (inited) this.updateProject()
    if (!homeJumpOtherPage && inited) this.refreshPageData()
    this.updateHomeJumpOtherPage(false)
  },
  beforeDestroy() {
    this.clearCountDown()
  }
}
</script>
