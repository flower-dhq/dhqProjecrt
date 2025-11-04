<style lang="scss" scoped>
.index {
    //padding: 20rpx 30rpx 0 30rpx;
    background-color: #F5F5F5;
    padding-bottom: calc(var(--window-bottom) + 100rpx);
}
.i-bottom-Interval {
    margin-bottom: 16rpx;
}
.indicator {
    @include flex(row);
    justify-content: center;

    &__dot {
        height: 12rpx;
        width: 12rpx;
        border-radius: 100px;
        background-color: rgba(255, 255, 255, 1);
        margin: 0 10rpx;
        transition: background-color 0.3s;

        &--active {
            background-color: rgba(251, 217, 98, 1);
        }
    }
}

.menu-background {
    background-color: white;
    box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.08);
    ::v-deep .u-scroll-list .u-scroll-list__indicator {
             margin-top: 0  !important;
    }
    ::v-deep .u-scroll-list .u-scroll-list__indicator__line__bar {
        height: 6px !important;
    }
    ::v-deep .u-scroll-list .u-scroll-list__indicator__line {
        height: 6px !important;

    }
}
.menu-box {
    padding: 32rpx 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 40rpx 20rpx;
    .menu-grid {
        text-align: center;
    }
}
.menu-icon {
    height: 60rpx;
    width: 60rpx;
    background-repeat: no-repeat;
    background-size: 60rpx;
    margin: auto;
}
.menu-title {
    font-size: 26rpx;
    color: #333333;
    margin-top: 8rpx;
}
.list-wrap {
    @include flex(row);
    flex-wrap: nowrap;
    padding: 16px 0;

    .list__menu-item:not(:last-child) {
        margin-right: 20rpx;
    }
}
.list__menu-item {
    height: 104rpx;
    width: calc((100vw - 20rpx * 3) / 4);
    display: grid;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
}  
.list__menu-item ::v-deep .uni-badge {
  position: absolute;
}
.i-notice {
    background-color: white;
    margin-left: 28rpx;
    margin-right: 28rpx;

    display: flex;
    //@include flx-dsp($jsc: flex-start, $ali: center);
    justify-content: flex-start;
    align-items: center;
    border-top-style: solid;
    border-width: 1rpx;
    border-color: #EAEAEA;

    .i-notice-title {

        padding-right: 22rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #C8924B;
        opacity: 1;
        border-right-style:solid;
        border-color:#C8924B;
        border-width: 2rpx;
    }
    .i-notice-image {
        width: 46rpx;
        height: 46rpx;
        padding-right: 22rpx;
        border-right-style:solid;
        border-color:#C8924B;
        border-width: 2rpx;
        opacity: 1;
    }


    // ::v-deep .u-notice-bar {
    //     padding: 18rpx 0;
    //     background-color: #C8924B;
    // }
    // ::v-deep .u-notice .u-notice__left-icon {
    //     margin-right: 20rpx;
    // }
    // ::v-deep .u-notice .u-notice__left-icon .u-icon--right::after {
    //     content: "";
    //     margin: 0 20rpx;
    //     height: 40rpx;
    //     border-right: 1px solid #cccccc;
    // }
    // ::v-deep .u-notice__left-icon image {
    //     width: 40rpx;
    //     height: 40rpx;
    // }
}


.i-title {

    margin-bottom: 12rpx;
    display: flex;

    @include flx-dsp($jsc: space-between, $ali: center);
    span {
        margin-left: 32rpx;
        margin-top: 20rpx;
        font-size: 36rpx;
        color: #333333;
        font-family: "PingFangSC-Semibold";
    }
    .i-title-right{
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;
        .i-title-more{
            font-size: 24rpx;
            color: #C8924B;
            opacity: 1;
            margin-right: 8rpx;
        }
        image {
            height: 24rpx;
            width: 24rpx;
            margin-right: 28rpx;
        }
    }

}
.duojing {
    width: calc(100% - 40rpx) ;
    height: 349rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;

}
.activity-box {
    background-color: white;
    box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.08);
    .activity-scroll{
        @include flx-dsp($jsc: flex-start, $ali: center);

        margin-left: 32rpx;
        margin-bottom: 12rpx;
        white-space: nowrap;
        .activity-content{
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: stretch;
            $w: 332rpx;
            margin-right: 20rpx;
            width:$w;
            .activity-img{
                width: $w;
                height: 208rpx;
                border-radius: 10rpx;
            }

            .activity-title{
                margin-top: 14rpx;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 28rpx;
            }

            .activity-deadline{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                font-size: 24rpx;
                color: #999999;
                margin-top: 8rpx;
                padding-bottom: 10rpx;
                border-bottom-style: solid;
                border-color: #EAEAEA;
                border-width: 1rpx;
                .activity-deadline-icon{
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 4rpx;
                }
                .activity-deadline-text {
                    font-size: 22rpx;
                    color: #AAAAAA
                }


            }

            .activity-info{
                max-width: $w;
                height: 54rpx;
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
                .activity-image {
                    position:relative;
                    width: 80rpx;
                    margin-top: 8rpx;
                    height: 48rpx;
                    .image-header {
                        width: 36rpx;
                        height: 36rpx;
                        border-radius: 50%;
                        position: absolute;
                        top:0;
                        object-fit: contain;
                    }
                    .image-header:nth-child(1){
                        left: 0;
                    }
                    .image-header:nth-child(2){
                        left: 20rpx;
                    }
                    .image-header:nth-child(3){
                        left: 40rpx;
                    }
                }
                .activity-signUpText{
                    flex-grow: 1;
                    font-size: 20rpx;
                    color: #AAAAAA;
                    .activity-signUpNum{
                        color: #C8924B;
                        font-weight: bold;
                    }

                }

                .tag{
                    font-size: 16rpx;
                    color: #fff;
                    border-radius: 20rpx;
                    margin-right: 8rpx;
                    font-size: 20rpx;
                    height: 36rpx;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    line-height: 36rpx;
                }

            }
        }
    }
    // .activity-content {
    //     background: #ffffff;
    //     box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.08);
    //     border-radius: 16rpx;
    //     // padding: 20rpx 20rpx 0 20rpx;
    //     width: 100%;
    //     .activity-img {
    //         width: 100%;
    //         height: 389rpx;
    //         border-radius: 16rpx 16rpx 0 0;
    //     }
    //     .activity-info {
    //         // padding: 20rpx;
    //         padding: 14rpx 20rpx 18rpx 20rpx;
    //         .activity-info-bottom {
    //             margin-top: 10rpx;
    //         }
    //         .activity-info-cell {
    //             @include flx-dsp($jsc: space-between, $ali: center);
    //             .activity-title {
    //                 font-size: 32rpx;
    //                 font-weight: bold;
    //                 // color: #333333;
    //                 font-family: "PingFangSC-Semibold";
    //             }
    //             .activity-btn {
    //                 @include flx-dsp($jsc: center, $ali: center);
    //                 width: 136rpx;
    //                 height: 48rpx;
    //                 background: var(--app-primary-color);
    //                 border-radius: 48rpx;
    //                 font-size: 24rpx;
    //                 color: #ffffff;
    //             }
    //             .activity-info-time {
    //                 @include flx-dsp($jsc: center, $ali: center);
    //                 font-size: 24rpx;
    //                 color: #aaaaaa;
    //                 image {
    //                     width: 32rpx;
    //                     height: 32rpx;
    //                     margin-right: 8rpx;
    //                 }
    //             }
    //             .activity-info-sign {
    //                 font-size: 20rpx;
    //                 color: #aaaaaa;
    //                 margin-right: 10rpx;
    //                 display: flex;
    //                 align-items: center;
    //                 .activity-signNum {
    //                     font-size: 28rpx;
    //                     font-weight: bold;
    //                     color: var(--app-primary-color);
    //                     margin-right: 6rpx;
    //                 }
    //             }
    //         }
    //     }
    // }
}
.policy-box {
    background-color: white;
    box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.08);
    .policy-content {
        display: flex;
        flex-direction: column;
        justify-content: start;
        grid-template-columns: 1fr 1fr;
        padding-left: 26rpx;
        padding-right: 26rpx;
        .policy-content-grid {
            display: flex;
            justify-content: left;
            align-items: stretch;
            height: 202rpx;
            background: #ffffff;
            border-bottom-style: solid;
            border-color: #EAEAEA;
            border-width: 1rpx;
            .policy-content-info {
                flex:auto;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .policy-title {
                    padding-left: 24rpx;
                    padding-right: 26rpx;
                    //padding-bottom: 70rpx;
                    padding-top: 22rpx;
                    font-size: 28rpx;
                    @include ellipsis($line: 2);
                    margin-bottom: 8rpx;
                    font-family: vant-icon, "source han sans", sans-serif;
                }
                .policy-content-bottom {
                    padding-left: 24rpx;
                    padding-bottom: 24rpx;
                    justify-content: start;
                    align-items: center;
                    .policy-time {
                        font-family: vant-icon, "source han sans", sans-serif;
                        font-size: 22rpx;
                        color: #D8D8D8;
                    }
                    .policy-checkNum {
                        padding-left: 20rpx;
                        font-size: 22rpx;
                        color: #D8D8D8;
                    }
                }
            }

            image {
                margin-top: 20rpx;
                width: 242rpx;
                height: 158rpx;
                border-radius: 10rpx;

            }
        }
    }
}
.sk-transparent {
    color: transparent !important;
}
.sk-text-14-2857-839 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text {
    background-origin: content-box !important;
    background-clip: content-box !important;
    background-color: transparent !important;
    color: transparent !important;
    background-repeat: repeat-y !important;
}
.sk-text-14-2857-243 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-570 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-552 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-232 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-881 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-486 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-869 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 35.5072rpx;
    position: relative !important;
}
.sk-text-14-2857-963 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 48.1884rpx;
    position: relative !important;
}
.sk-text-14-2857-803 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 43.1159rpx;
    position: relative !important;
}
.sk-text-14-2857-162 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 32.971rpx;
    position: relative !important;
}
.sk-text-14-2857-123 {
    background-image: linear-gradient(
        transparent 14.2857%,
        #eeeeee 0%,
        #eeeeee 85.7143%,
        transparent 0%
    ) !important;
    background-size: 100% 32.971rpx;
    position: relative !important;
}
.sk-opacity {
    opacity: 0 !important;
}
.sk-image {
    background: #efefef !important;
}
.sk-pseudo::before,
.sk-pseudo::after {
    background: #efefef !important;
    background-image: none !important;
    color: transparent !important;
    border-color: transparent !important;
}
.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
    border-radius: 0 !important;
}
.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
    border-radius: 50% !important;
}
.sk-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
}
.primary-color{
    background-color: var(--app-primary-color);
}
.gray-color {
    background-color: #aaa;
}

.home-top-logo{
	min-width: 162rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24rpx;
	line-height: 56rpx;
	background-color: var(--app-primary-color);
	color: #fff;
	z-index: 999;
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	margin-top: 20rpx;
	border-radius: 30rpx;
}
.component-homehead-project-name{
	font-size: 24rpx;
	padding-right: 10rpx;
}

.i-bottom-Interval-sun {
    margin-bottom: 20rpx;
}
  .activity-box-sun {
    background-color: white;
    box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.08);
    .activity-scroll{
        @include flx-dsp($jsc: flex-start, $ali: center);
        margin-left: 32rpx;
        margin-bottom: 12rpx;
        white-space: nowrap;
        .activity-content{
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: stretch;
            $w: 246rpx;
            margin-right: 20rpx;
            width:$w;
            image {
                width: 246rpx;
                height: 140rpx;
                border-radius: 10rpx;
            }
            .activity-title{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 28rpx;
            }
        }
    }
}
.i-title-sun {
    padding-bottom: 12rpx;
    display: flex;
    @include flx-dsp($jsc: space-between, $ali: center);
    span {
        margin-left: 32rpx;
        margin-top: 20rpx;
        font-size: 36rpx;
        color: #000000;
        // font-weight: bold;
        font-family: "PingFangSC-Semibold";
    }
}
.birthShow ::v-deep .u-popup__content {
    background-color:rgba(0,0,0,0)
}
.birthday-close{
    height: 60rpx;
    width: 60rpx;
    color: #ffffff;
    font-size: 60rpx;
    margin: auto;
    display: block;
  }
 .iconMessage  {

    position: fixed;
    z-index: 99; 
    .sys-icon {
    height: 148rpx;
    width: 148rpx;
    background-repeat: no-repeat;
    background-size: 148rpx;
    margin: auto;
}
  }
  .message-num{
    position: absolute;
    /* width: 16px; */
    height: 28rpx;
    right: 48rpx;
    top: 38rpx;
    padding: 6rpx 6rpx;
    text-align: center;
    background: #FF2300;
    color: #ffffff;
    border-radius: 14rpx;
    font-size: 20rpx !important;
    font-family: PingFang SC;
    line-height: 16rpx;
    box-sizing: border-box;
  }
</style>

<template>
    <view class="index" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <!-- <Skeleton v-if="loading" ref="skeleton"></Skeleton> -->
        <view v-if="loading" class="sk-container">
            <view class="index data-v-57280228 theme-default" style="--u-view-primary__theme-color:#00C6D2;--u-tag__error__theme-color:#ff3c3c;--app-primary-color:#00C6D2">
                <view class="data-v-57280228">
                    <view class="i-swiper i-bottom-Interval data-v-57280228">
                        <view class="u-swiper swiper--u-swiper data-v-7b038a67 swiper--data-v-7b038a67" style="background-color:#f3f4f6;height:160px;border-radius:4px;">
                            <swiper autoplay="false" class="u-swiper__wrapper swiper--u-swiper__wrapper data-v-7b038a67 swiper--data-v-7b038a67" current="0" display-multiple-items="1" duration="300" easing-function="default" interval="3000" next-margin="0px" previous-margin="0px" style="height:160px;">
                                <swiper-item class="u-swiper__wrapper__item swiper--u-swiper__wrapper__item data-v-7b038a67 swiper--data-v-7b038a67" style="position: absolute; width: 100%; height: 100%; transform: translate(0%, 0px) translateZ(0px);">
                                    <view class="u-swiper__wrapper__item__wrapper swiper--u-swiper__wrapper__item__wrapper data-v-7b038a67 swiper--data-v-7b038a67" style="true">
                                        <image class="u-swiper__wrapper__item__wrapper__image swiper--u-swiper__wrapper__item__wrapper__image data-v-7b038a67 swiper--data-v-7b038a67 sk-image" mode="aspectFill" style="height:160px;border-radius:4px;width:100%"></image>
                                    </view>
                                </swiper-item>
                                <swiper-item class="u-swiper__wrapper__item swiper--u-swiper__wrapper__item data-v-7b038a67 swiper--data-v-7b038a67" style="position: absolute; width: 100%; height: 100%; transform: translate(100%, 0px) translateZ(0px);">
                                    <view class="u-swiper__wrapper__item__wrapper swiper--u-swiper__wrapper__item__wrapper data-v-7b038a67 swiper--data-v-7b038a67" style="true">
                                        <image class="u-swiper__wrapper__item__wrapper__image swiper--u-swiper__wrapper__item__wrapper__image data-v-7b038a67 swiper--data-v-7b038a67 sk-image" mode="aspectFill" style="height:160px;border-radius:4px;width:100%"></image>
                                    </view>
                                </swiper-item>
                            </swiper>
                            <view class="u-swiper__indicator swiper--u-swiper__indicator data-v-7b038a67 swiper--data-v-7b038a67" style="true">
                                <view class="indicator data-v-57280228">
                                    <view class="indicator__dot data-v-57280228 indicator__dot--active"></view>
                                    <view class="indicator__dot data-v-57280228 false"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="menu-box i-bottom-Interval data-v-57280228">
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-839 sk-text" style="background-position-x: 50%;">通行</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-243 sk-text" style="background-position-x: 50%;">停车</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-570 sk-text" style="background-position-x: 50%;">访客</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-552 sk-text" style="background-position-x: 50%;">会议</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-232 sk-text" style="background-position-x: 50%;">放行</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-881 sk-text" style="background-position-x: 50%;">报修</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-486 sk-text" style="background-position-x: 50%;">活动</view>
                        </view>
                        <view class="menu-grid data-v-57280228">
                            <image class="menu-icon data-v-57280228 sk-image"></image>
                            <view class="menu-title data-v-57280228 sk-transparent sk-text-14-2857-869 sk-text" style="background-position-x: 50%;">更多</view>
                        </view>
                    </view>
                    <view class="i-notice i-bottom-Interval data-v-57280228">
                        <view class="u-notice-bar notice-bar--u-notice-bar data-v-4eff50a7 notice-bar--data-v-4eff50a7" style="background-color:#FFFFFF">
                            <view class="u-notice column-notice--u-notice data-v-515940d7 column-notice--data-v-515940d7">
                                <view class="u-notice__left-icon column-notice--u-notice__left-icon data-v-515940d7 column-notice--data-v-515940d7">
                                    <view class="u-icon icon--u-icon data-v-172979f2 icon--data-v-172979f2 u-icon--right icon--u-icon--right sk-pseudo sk-pseudo-circle">
                                        <image class="u-icon__img icon--u-icon__img data-v-172979f2 icon--data-v-172979f2 sk-image" mode="true" style="width:19px;height:19px"></image>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="activity-box i-bottom-Interval">
                        <view class="i-title data-v-57280228">
                            <label class="_span data-v-57280228 sk-transparent sk-text-14-2857-963 sk-text">活动来了</label>
                            <image class="data-v-57280228 sk-image"></image>
                        </view>
                        <view class="u-grid grid--u-grid data-v-50bc7b32 grid--data-v-50bc7b32 vue-ref grid--vue-ref" data-ref="u-grid" style="justify-content:flex-start;padding:0px 0px 10px 0px">
                            <view class="u-grid-item item--u-grid-item data-v-99a45d26 item--data-v-99a45d26" hover-class="u-grid-item--hover-class" hover-stay-time="200" style="background:transparent;width:100%">
                                <view class="activity-content data-v-57280228">
                                    <image class="activity-img data-v-57280228 sk-image"></image>
                                    <view class="activity-info data-v-57280228">
                                        <view class="activity-info-cell data-v-57280228">
                                            <text class="activity-title data-v-57280228 sk-transparent sk-text-14-2857-803 sk-text">圣诞节活动</text>
                                            <view class="activity-btn data-v-57280228 sk-transparent sk-text-14-2857-162 sk-text">去参加</view>
                                        </view>
                                        <view class="activity-info-cell activity-info-bottom data-v-57280228">
                                            <view class="activity-info-time data-v-57280228">
                                                <image class="data-v-57280228 sk-image"></image>
                                                <text class="data-v-57280228 sk-transparent sk-text-14-2857-123 sk-text">12-22 00:00 截止</text>
                                            </view>
                                            <view class="activity-info-sign data-v-57280228 sk-transparent">
                                                <text class="activity-signNum data-v-57280228 sk-transparent sk-opacity">5</text>人参加
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <movable-area style="display: block;    width: 100%;    height: 100%;">  
            <view v-if="pageMenu.page_banner_1_1" class="i-swiper">
                <u-swiper radius="0" :height="197" :list="swiperList" @change="e => current = e.current" keyName="picture" @click="bannerClick">
                    <view slot="indicator" class="indicator">
                        <template v-if="swiperList.length>1">
                            <view class="indicator__dot" v-for="(item, index) in swiperList" :key="index" :class="[index === current && 'indicator__dot--active']"></view>
                        </template>
                    </view>
                </u-swiper>
                <view class="home-top-logo" @click.stop="switchProject">
                    <!-- <view class="component-homehead-project-btn1"   @click.stop="switchProject"> -->
                        <text class="component-homehead-project-name" v-show="userTypes=='游客' || isAssociation==0 || userTypes=='会员'">请认证</text>
                        <text class="component-homehead-project-name" v-show="userTypes!='游客' && isAssociation!=0 && userTypes!='会员'">{{projectName}}</text>
                                <u-icon name="arrow-down-fill" size="8px" color="#FFFFFF"></u-icon>
                    <!-- </view> -->
                </view>
            </view>
            <view class="menu-background i-bottom-Interval">
                <view v-if="pageMenu.page_menu_2_4" class="menu-box">
                    <template v-for="(item, index) in menuList"> 
                    <view class="menu-grid" v-if="index > 7 ?false:true" :key="index" @click="menuJump(item)">
                        <uni-badge  absolute="rightTop"   size="small" :offset="[-29, -29]"
                        :text="item.detailCode == 'activity' ? totalCounts.activityCount : item.detailCode == 'questionnaire' ? totalCounts.questionnaireCount : item.detailCode == 'announcement' ? totalCounts.articleCount : 0"
                         v-if="item.detailCode == 'activity' || item.detailCode == 'announcement' ||  item.detailCode == 'questionnaire'"
                         :customStyle="{background: '#FF2300'}"/>
                        <image class="menu-icon" :src="item.detailCode.indexOf('tionalFea')>-1?item.icon:require(`@/static/${[THEME_NAME]}/menu/${item.icon}.png`)"></image>
                        <view class="menu-title">{{item.configName}}</view>
                    </view>
                </template>
                </view>
                <u-scroll-list v-if="pageMenu.page_menu_1_4" indicatorBarWidth="6" indicatorWidth="35"  indicatorStyle="border-radius:6px;height:6px">
                    <view class="list-wrap">
                        <view v-for="(item, index) in menuList" :key="index" class="list__menu-item" @click="menuJump(item)">
                        <view style="position: relative;height: 0;"  v-if="item.detailCode == 'activity' || item.detailCode == 'announcement' ||  item.detailCode == 'questionnaire'">
                            <uni-badge  absolute="rightTop"   :customStyle="{background: '#FF2300',display:'flex'}"  :offset="[-18, -16]" size="small" 
                        :text="item.detailCode == 'activity' ? totalCounts.activityCount : item.detailCode == 'questionnaire' ? totalCounts.questionnaireCount : item.detailCode == 'announcement' ? totalCounts.articleCount : 0"
                        v-if="item.detailCode == 'activity' || item.detailCode == 'announcement' ||  item.detailCode == 'questionnaire'"/>  
                        </view>
                           <image class="menu-icon" :src="require(`@/static/${[THEME_NAME]}/menu/${item.icon}.png`)" />

                            <view class="menu-title">{{item.configName}}</view>
                        </view>
                    </view>
                </u-scroll-list>
                <view v-if="pageMenu.page_headlines_1_1" class="i-notice" @click="menuJump({'page':'/pages-b/announcement/list','configName':'通知公告'},'noAuth')">
                    <!-- <view class="i-notice-title">头条</view> -->
                    <image class="i-notice-image"  :src="require(`@/static/${[THEME_NAME]}/index/headlines.png`)" />


                    <u-notice-bar :text="messageList" direction="column" icon=" " bgColor="#FFFFFF" fontSize="12" color="#333333"></u-notice-bar>
                </view>
            </view>
                 <movable-view style="width: 148rpx; height: 148rpx;z-index: 99;"  :x="x" :y="y" direction="all" @change="onChange">
                    <view class="iconMessage" @click="goToSystemMessages()">
                   <uni-badge v-show="totalCounts" :text="totalCounts.massPushCount"  absolute="rightTop"   :customStyle="{background: '#FF2300'}"  :offset="[30, 25]" size="small">
                        <image class="sys-icon" :src="require(`@/static/${[THEME_NAME]}/index/system-icon.png`)"></image>
				    </uni-badge> 
                </view>
                </movable-view> 
            <view v-if="pageMenu.page_activity_1_1" class="activity-box i-bottom-Interval">
                <view class="i-title"><span>{{pageMenu.page_activity_1_1_text?pageMenu.page_activity_1_1_text:'最新活动'}}</span>
                    <view class="i-title-right" @click="menuJump({'page':'/pages-d/activity/activityList','configName':'活动来了'},'noAuth')">
                        <view class="i-title-more">更多</view>
                        <image :src="require(`@/static/${[THEME_NAME]}/multiplexing/icon-more.png`)" alt="" ></image>
                    </view>


                </view>
                <!-- <image class="duojing" :src="detailCodeurl" mode="aspectFit" @click="jumpDuoJing"></image> -->
                <scroll-view v-if="true" scroll-x="false">
                    <view  class="activity-scroll"  style="overflow: hidden;justify-content: space-between;margin-right: 8rpx;">
                        <view class="activity-content" v-for="(activity,listIndex) in activityList" :key="listIndex" @click="menuJump({'page':`/pages-d/activity/activityDetail?aid=${activity.aid}`,'configName':'活动详情'},'noAuth')" style="width: 336rpx;">
                            <image class="activity-img"  style="width: 336rpx;" :src="activity.coverUrl"></image>
                            <text class="activity-title">{{activity.title}}</text>
                            <view class="activity-deadline">
                                <image class="activity-deadline-icon" :src="require(`@/static/${[THEME_NAME]}/multiplexing/icon-time.png`)"></image>
                                <text class="activity-deadline-text">报名截止{{activityDate(activity.signUpEndDate)}}</text>
                            </view>
                            <view class="activity-info">
                                <view class="activity-image" v-if="activity.headImgs.length>0">
                                    <image class="image-header" v-for="(item,index) in activity.headImgs" :key="index" :src="item.headImg=='-1'||!item.headImg?require(`@/static/${[THEME_NAME]}/multiplexing/default-photo.png`):item.headImg" v-if="index<=2"/>
                                </view>
                                <text class="activity-signUpText"><text class="activity-signUpNum">{{activity.signUpNum}}</text>人参加</text>
                                <text :class="[activityStatusColor(activity), 'tag']">{{ activityStatusText(activity) }}</text>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <u-grid v-else :border="false" col="1" :customStyle="{'padding':'0px 0px 10px 0px'}">
                    <u-grid-item v-for="(activity,listIndex) in activityList" :key="listIndex" @click="menuJump({'page':`/pages-d/activity/activityDetail?aid=${activity.aid}`,'configName':'活动详情'},'noAuth')">
                        <view class="activity-content">
                            <image class="activity-img" :src="activity.coverUrl"></image>
                            <view class="activity-info">
                                <view class="activity-info-cell">
                                    <text class="activity-title">{{activity.title}}</text>
                                    <view class="activity-btn">去参加</view>
                                </view>
                                <view class="activity-info-cell activity-info-bottom">
                                    <view class="activity-info-time">
                                        <image :src="require(`@/static/${[THEME_NAME]}/multiplexing/icon-time.png`)"></image>
                                        <text>{{activity.signUpEndDate}} 截止</text>
                                    </view>
                                    <view class="activity-info-sign"><text class="activity-signNum">{{activity.signUpNum}}</text>人参加</view>
                                </view>
                            </view>
                        </view>
                    </u-grid-item>
                </u-grid>

            </view>
            <view v-if="pageMenu.page_announcement_1_1" class="policy-box i-bottom-Interval">
                <view class="i-title"><span>{{pageMenu.page_announcement_1_1_text?pageMenu.page_announcement_1_1_text:'社区公告'}}</span>

                    <view class="i-title-right" @click="menuJump({'page':'/pages-b/announcement/list','configName':'通知公告'},'noAuth')">
                        <view class="i-title-more">更多</view>
                        <image :src="require(`@/static/${[THEME_NAME]}/multiplexing/icon-more.png`)" alt="" ></image>
                    </view>


                </view>
                <view class="policy-content">
                    <view class="policy-content-grid" v-for="(annItem,baseListIndex) in announcementList" :key="baseListIndex" @click="menuJump({'page':`/pages-b/announcement/detail?articleId=${annItem.articleId}`,'configName':'社区公告'},1,annItem.articleId)">
                        <view class="policy-content-info">
                            <view class="policy-title">{{annItem.title}}</view>
                            <view class="policy-content-bottom">
                                <span class="policy-time">{{DateFormat(annItem.operateTime)}}</span>
                                <text class="policy-checkNum">{{annItem.clickCount}}人点击</text>

                            </view>
                        </view>
                        <view class="policy-content-img">
                            <image :src="annItem.imgIds ? annItem.imgIds[0] : require(`@/static/${[THEME_NAME]}/activity/small-photo.png`) " mode="aspectFill"></image>
                        </view>
                    </view>
                </view>
            </view>
             <!-- 阳光物业 -->
             <view v-if="pageMenu.page_sunshine_1_1" class=" activity-box-sun i-bottom-Interval">
               <view class="i-title-sun">
                 <span>{{pageMenu.page_sunshine_1_1_text ? pageMenu.page_sunshine_1_1_text: '阳光物业'}}</span>
                </view>
               <scroll-view v-if="true" scroll-x="true">
                    <view  class="activity-scroll">
                        <view class="activity-content" v-for="(item,i) in sunshineList" @click="propertyJumpClick(item.node,item.title)" :key=i>
                            <image  v-if="item.imgUrl" :src="item.imgUrl"></image>
                            <image  v-else :src="item.path" />
                            <h6 style="color:#555;text-align: center;font-size: 12px;padding-top: 12rpx;padding-bottom:20rpx">{{item.title}}</h6>
                        </view>
                    </view>
               </scroll-view>
             </view>
             </movable-area>
        </view>
        <u-toast ref="uToast"></u-toast>
        <uniPop ref="rzModal"></uniPop>
        <middle-box :current-page="0" ref="child"></middle-box>
        <custom-modal ref="customModal"></custom-modal>
        <view class="birthShow">
            <u-popup :show="birthImg" mode="center">
                 <view>
                    <image :src="require(`@/static/${[THEME_NAME]}/index/birthday.png`)" style="width:600rpx" />
                    <view><image :src="require(`@/static/${[THEME_NAME]}/index/birthday1.png`)" class="birthday-close" @click="closeBirthday" /></view>
                 </view>
	         </u-popup>
        </view>
    </view>
</template>

<script>
import commLogic from '@/js/comm-logic';
import tabBarFun from '../../js/utils/tabBarCommon'
import util from '../../js/utils';
import { mapMutations } from 'vuex'
import {
    getAppByCode, getShelvesList, queryMyMessages, findCompanyAuthInfoList, getOwnerBuildingListComm,
    getListByMap, getUserRole, addGbSlideRead, appletLogin,selectTboMemberInfo,wxOauthNew,getCompanyConfig
} from '../../service/community';
import { activity, alist, addClickCountById, getPushRecordCount } from '../../service/wxmanage'
import { menu } from '../../js/menu'
import { savePageTitle } from '@/js/router/router-utils'
import { getDictDetail } from '../../service/landcrm'

import MiddleBox from '@/components/middle/middle-box.vue';
// import Skeleton from '@/components/skeleton/skeleton.vue';
import ygjy from "@/static/theme-default/sunHome/ygjy.png";
import yggs from "@/static/theme-default/sunHome/yggs.png";
import ygtd from "@/static/theme-default/sunHome/ygtd.png";
import wyxc from "@/static/theme-default/sunHome/wyxc.png";
import { GetHomePageFunctionNew} from '@/service/community';

export default {
    components: {
        MiddleBox,
        //   Skeleton
    },
    data() {
        return {
            x: 300,
            y: 500,
            old: {
                x: 0,
                y: 0
            },
            isAssociation:Number,
            detailCodeurl:'',
            birthImg:false,
            loading: true,
            current: 0,
            swiperList: [],
            messageList: [],
            activityList: [],
            announcementList: [],
            menuList: [],
            memberId: '',
            areaId: '',
            projectId: '',
            projectType: '',
            companyId: '',
            userTypes:'游客',
		    projectName:'',
            pageMenu: {
                page_banner_1_1: true,
                page_banner_1_1_text: '',
                page_menu_2_4: true,
                page_menu_2_4_text: '',
                page_headlines_1_1: true,
                page_headlines_1_1_text: '',
                page_activity_1_1: true,
                page_activity_1_1_text: '',
                page_announcement_1_1: true,
                page_announcement_1_1_text: '',
                page_sunshine_1_1:false,
                page_sunshine_1_1_text:'',
            },
            isOneTime: true,
            nowData1: 0,
            nowData2: 0,
            sunshineList:[],
        // customFunction:process.env.moduleConfig.customFunction,  //是否使用自定义功能名称
        dataList:[
          {
            code:'huiHomeScene',
            node:1,
            path: ygjy,
            title:'阳光家园'
          },
          {
            code:'sunStory',
            node:2,
            path:yggs,
            title:'阳光故事'
          },
          {
            code:'huiFamilyScene',
            node:3,
            path: ygtd,
            title:'阳光团队'
          },
          {
            code:'propertyPublicity',
            node:4,
            path: wyxc,
            title:'物业宣传'
          }
        ],
        authType:[],
        showFWQY:Number,
        wechatInfo:{
            projectType:'',
            code:''
        },
        totalCounts:{}
        };
    },
    computed: {
        duoJingImage(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/index/duojing.png`
			},
        options() {
            const { swiperList, menuList, activityList, announcementList, sunshineList } = this
            return { swiperList, menuList, activityList, announcementList , sunshineList}
        },
    },
    watch: {
        swiperList: function () {
            this.$nextTick(function () {
                this.loading = false
            })
        },
        options: {
            deep: true,
            handler(n, v) {
                if (n.swiperList && n.menuList && n.activityList && n.announcementList && n.sunshineList) {
                    this.$nextTick(function () {
                        this.loading = false
                    })
                }
            }
        }
    },
    onNavigationBarButtonTap(e) {
        this.$refs.customModal.show({
            title: '提示',
            content: '此功能暂未开放，敬请期待~',
            showConfirmButton: true,
            showCancelButton: false,
            confirmText: "好的",
        })
    },
    async onLoad(option) {  
        console.log('onloadindex')
        // #ifdef H5
        const { O_USER_INFO } = this.$constant;
        if(!util.storageAction({ key: O_USER_INFO, action: 'get' })){
          uni.clearStorageSync();  
        }
        // #endif
        // #ifdef MP-WEIXIN      
        // 搬家到首页去  避免分享页面进来时候被清空存储信息接口异常
          uni.clearStorageSync();  
        // #endif
        
        if(option.code && option.projectType){
            this.wechatInfo = option;
            const { PROJECT_TYPE } = this.$constant;
            uni.setStorageSync(PROJECT_TYPE,this.wechatInfo.projectType)            
        } 
        this.geturl()
        this.nowData1 = new Date().getTime()
        //页面加载没有会员数据，先登录，有会员数据，则初始化数据
        if (this.isAuthorized()) {
            this.initData()
        }
        
    },
    onReady() {
        if (this.isAuthorized()) {
            if (this.isOneTime) {
                this.isOneTime = false
                this.init()
            }
            // 保存跳转商城tabbar前的页面
            this.catchTabbarPagePath('/pages/index/index')
        }
    },
    async onShow() {   
        savePageTitle({ title: '' })
        const { MEMBER_ID, AREA_ID, PROJECT_ID, O_USER_INFO, USER_TYPE, PROJECT_NAME,OLD_WECHAT_CODE,PROJECT_TYPE } = this.$constant;
        let oldWechatCode = util.storageAction({ key: OLD_WECHAT_CODE, action: 'get' });
        // let oldWechatCode = uni.getStorageSync('oldWechatCode');;
        // uni.setStorage('oldWechatCode')
        if(oldWechatCode != this.wechatInfo.code && this.wechatInfo.code && this.wechatInfo.projectType){
            await this.wechatSetCompany(this.wechatInfo.projectType);
            await this.wechatLogin(this.wechatInfo);  
        }
        
      
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
        const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
        this.userTypes = util.storageAction({ key: USER_TYPE, action: 'get' });
        this.projectName = util.storageAction({ key: PROJECT_NAME, action: 'get' });
       
        this.companyId = userInfo?userInfo.companyId:'';
        await this.login();
        this.getProfile()
        //if (this.isOneTime) {
         await   this.init()
        //}
        // 保存跳转商城tabbar前的页面
        this.catchTabbarPagePath('/pages/index/index')

        console.log(1070, this.projectName,this.userTypes)
        if(this.userTypes == '游客' || this.userTypes == '会员' ||this.userTypes==''){
        }else {
            if(this.isAssociation == 0){
            }else {
               this.projectName = util.storageAction({ key: PROJECT_NAME, action: 'get' });
            }
        }
    },
    onHide() {
        this.isOneTime = true
    },
    methods: {
        tap: function(e) {
            this.x = this.old.x
            this.y = this.old.y
            this.$nextTick(function() {
                this.x = 30
                this.y = 30
            })
        },
        onChange: function(e) {
            this.old.x = e.detail.x
            this.old.y = e.detail.y
        },
        jumpDuoJing(){
            let item = {appId:"wxbbc5022cc0c9d3dd", url:""};
            this.jumpMini(item);
        },
        ...mapMutations({
            catchTabbarPagePath: 'catchTabbarPagePath'
        }),
        switchProject(){
            const { INDEX_PROJECT_ID, O_USER_INFO } = this.$constant;
            const {PROGRAM_TYPE} = this.$appConfig;
              // console.log(1106,this.isAssociation)
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            if (!phoneNumber) {
                if (PROGRAM_TYPE == 'wechat' || PROGRAM_TYPE == 'appH5') {
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return;
                } else {
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return;
                }

            }

            let projectIds = util.storageAction({ key: INDEX_PROJECT_ID, action: 'get' }) || []
            if (this.userTypes == '游客' || projectIds.length == 0 || this.isAssociation == 0) {
                this.$refs.rzModal.showModal({ modalType: 'rz' });
                this.$refs.rzModal.showCompanyConfig();
                return
            }
            this.menuJump({
                page:'/pages-a/switchProject/switchProject',
                configName:'选择社区'
            })
        },
        closeBirthday() {
            let self = this;
            self.birthImg = false;
            let data = '2'
            util.storageAction({ key: 'BIRTHDAY', action: 'set', value: JSON.parse(JSON.stringify(data)) });
       },
        // 获取用户信息
        getProfile() {
            const { MEMBER_ID,COMPLANY_ID } = this.$constant;
            const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            
            if(!memberId) {
                return;
            }
            const args = {
                pathParams: `/${memberId}`,
                hideLoading: true,
            };
            selectTboMemberInfo(args).then((res) => {
                if (res.status == 200) {
                    const data = res.data || {}
                    
                    const isAssociation = data.isAssociation || 0
                    const { IS_ASSOCIATION } = this.$constant
                    util.storageAction({ key: IS_ASSOCIATION, action: 'set', value: data.isAssociation || 0 })
                    this.isAssociation = isAssociation
                   
                    // #ifdef  H5
                    uni.setStorageSync(COMPLANY_ID,data.companyId)
                    // #endif

                   const birthday = data.birthDay
                   let BIRTHDAY
                   if (birthday && birthday != undefined){
                           let date = new Date();
                          let mm = date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
                          let dd = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
                          let monthDay = mm + '-' + dd;
                          let tempBirthDay = birthday.substring(5, 10);
                          console.log(1008,monthDay,tempBirthDay)
                          if (monthDay == tempBirthDay) {
                         console.log(1012,util.storageAction({ key: 'BIRTHDAY', action: 'get' }))
                             if (util.storageAction({ key: 'BIRTHDAY', action: 'get' }) != "2") {
                               this.birthImg = true;
                               let data = '2'
                               util.storageAction({ key: 'BIRTHDAY', action: 'set', value: JSON.parse(JSON.stringify(data)) });
                             }
                           } else {
                               let data = '1'
                               util.storageAction({ key: 'BIRTHDAY', action: 'set', value: JSON.parse(JSON.stringify(data)) });
                           }
                        } else {
                            let data = '1'
                            util.storageAction({ key: 'BIRTHDAY', action: 'set', value: JSON.parse(JSON.stringify(data)) });
                        }
                                }
                            });
        },

        // 初始化数据
        async initData() {
            const { MEMBER_ID, AREA_ID, PROJECT_ID, O_USER_INFO,USER_TYPE,PROJECT_NAME } = this.$constant;
            this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
            const userInfo= util.storageAction({ key: O_USER_INFO, action: 'get' });
            this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
            //this.userTypes = util.storageAction({ key: USER_TYPE, action: 'get' }) || '游客';
            this.companyId =userInfo?userInfo.companyId:'';
            if (this.isOneTime) {
                this.isOneTime = false
                await this.init()
            }
            this.projectName = util.storageAction({ key: PROJECT_NAME, action: 'get' });
            // 保存跳转商城tabbar前的页面
            this.catchTabbarPagePath('/pages/index/index')
        },

        // 小程序登录
        async wxMiniLogin() {
            const { companyId } = commLogic.getProjectConfig();
            const { PROJECT_TYPE } = this.$appConfig;
            const { errMsg: loginMsg, code } = await this.getWxCode().catch(_ => { });
            let params = {
                data: {
                    code: code,
                    appletId: PROJECT_TYPE,
                    companyId: companyId,
                    source: 'wxMini'
                }
            }
            const res = await appletLogin(params)
            if (res.status == '200') {
                let data = {}
                let obj = res.data
                // 有手机号码就是授权过，没有则需要授权
                if (res.data.memberPhone) {
                    data = res.data.appMemberJson ? JSON.parse(res.data.appMemberJson) : {}
                    data.wxUserId = res.data.wxUserId
                } else {
                    data = {
                        companyId: obj.companyId,
                        id: obj.memberId,
                        token: obj.token,
                        wxUserId: obj.wxUserId,
                        nickname: obj.wxUserName
                    }
                }
                const { token, id, wxUserId } = data
                // 有手机号码，设置缓存
                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID } = this.$constant;
                const combineData = {...obj, ...data}
                // 用的是微信小程序登录接口，用mpWeixin方法处理
                const storage = commLogic.setOwerUserInfo('mpWeixin', combineData)
                util.storageAction({ key: TOKEN, action: 'set', value: token });
                util.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                util.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                util.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                this.initData();
                this.geturl()
                this.nowData1 = new Date().getTime()
                //页面加载没有会员数据，先登录，有会员数据，则初始化数据
                if (this.isAuthorized()) {
                    this.initData()
                }
            }
        },

        // 获取微信授权code
        getWxCode(pvd) {
            return new Promise((resolve) => {
                uni.getProvider({
                    service: 'oauth',
                    success: (provider) => {
                        uni.login({
                            provider: pvd || provider,
                            onlyAuthorize: !!pvd, // 微信登录仅请求授权认证
                            success: (res) => {
                                resolve(res);
                            },
                            fail: (error) => {
                                resolve(error);
                            },
                        });
                    },
                    fail: (error) => {
                        resolve(error);
                    },
                });
            });
        },

        menuJump(item, type, id) {
             //400电话
             if(item.detailCode == '400phone' || item.detailCode == 'reportphone'){
              const { PHONE, REPORT_PHONE } = this.$appConfig;
              let phone = item.detailCode == '400phone' ? PHONE : REPORT_PHONE
               console.log(phone);
               if(phone){
                uni.makePhoneCall({
                  phoneNumber: phone,
                })
              }
              return;
            }
            const { O_USER_INFO, IS_ASSOCIATION } = this.$constant;
 
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            let isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
            // type：noAuth 不需要授权可以访问，type：跳转到公告详情
            //item.auth==1,需要授权
            const {PROGRAM_TYPE} = this.$appConfig;
            if (!phoneNumber && type != 'noAuth' && type != 1 && item.auth == '1') {
                if(PROGRAM_TYPE == 'wechat'|| PROGRAM_TYPE == 'appH5'){
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return
                }else{
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return
                }
                
            }

             //跳转第三方小程序
             if(item.appId){
                this.jumpMini(item)
                return
            }

            if (type == 1) {
                // 跳转到公告详情，计算阅读量
                const params = {
                    data: {
                        articleId: id,
                        userId: this.memberId
                    }
                }
                addClickCountById(params)
            }


            if (isAssociation == '0' && item.registered) {
								// #ifdef MP-WEIXIN
									if (!phoneNumber) {
											uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
											return
									}
								// #endif
                switch(this.showFWQY){
                    case 0:
                    // this.$refs.customModal.show({
                    //          title: '提示',
                    //          content: '请选择房屋认证或企业认证',
                    //          showConfirmButton: true,
                    //          confirmText: "确认",
                    //     }) 
                     this.$refs.rzModal.showModal({ modalType: 'rz' });
                     this.$refs.rzModal.showCompanyConfig();
                       break;
                    case 1:
                    this.$refs.customModal.show({
                          title: '提示',
                          content: '您还未认证，请先去认证',
                          showConfirmButton: true,
                          showCancelButton: true,
                           confirmText: "去认证",
                           cancelText: '取消',
                           onConfirm: () => {
                               uni.navigateTo({url:'/pages-b/house-info/add-house-address'})
                        }
                     })
                        break;
                    case 2:
                    this.$refs.customModal.show({
                          title: '提示',
                          content: '您还未认证，请先去认证',
                          showConfirmButton: true,
                          showCancelButton: true,
                           confirmText: "去认证",
                           cancelText: '取消',
                           onConfirm: () => {
                               uni.navigateTo({url:'/pages-d/enterprise-info/join-company'})
                        }
                     })
                        break;
                    default:
                        break;
                }
               return;
            }



            if (!item.page && !item.url) {
                uni.showModal({
                    title: '提示',
                    content: '此功能暂未开放，敬请期待~',
                    confirmText: "好的",
                    showCancel: false,
                    confirmColor: '#13C3BF',
                    success: function (res) {
                        if (res.confirm) {
                        }
                    }
                });
                return;
            }
            if (item.isTabbar) {
                uni.switchTab({ url: item.page })
            } else {
                if (item.url) {
                    uni.navigateTo({
                        url: `/pages-d/webview/webview?url=${encodeURIComponent(item.url)}`
                    })
                } else {
                    item.configName && savePageTitle({ title: item.configName })
                    uni.navigateTo({ url: item.page });
                }
            }
        },
        // 跳转第三方小程序方法
        jumpMini(item){
            // #ifdef MP-WEIXIN
            uni.navigateToMiniProgram({
                appId:item.appId,// 第三方小程序appid
                path:item.url,//
                envVersion:"release",
                success: res => {
                    // 打开成功
                    console.log("打开成功", res);
                },
                fail: err => {
                    console.log(err);
                }
            })
            // #endif

            // #ifdef APP-PLUS
            plus.share.getServices((res) => {
            let weixin = res.find(i => i.id === 'weixin');
                if (weixin) {
                    weixin.launchMiniProgram({
                        id: item.originalId,
                        path: item.url,
                        type: 0
                    }, (res) => {

                    }, (err) => {

                    });
                }
            }, (err) => {
                console.log("获取分享服务列表失败： " + JSON.stringify(e));
            });
            // #endif
        },
        isAuthorized() {
            const { O_USER_INFO } = this.$constant;
            return !!util.storageAction({ key: O_USER_INFO, action: 'get' });
        },
        async init() {
            // 没登录/授权布请求接口
            const isAuthorized = this.isAuthorized(); 
            console.log('登录失败',isAuthorized)
            if (!isAuthorized) return Promise.resolve() 

            let { flag } = await this.defaultProperty();
            if (flag) {
                await this.getCity();
            }
            tabBarFun.getUserNarbar();
            this.getPageCode();
            console.log(1519,this.userTypes)
            const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            if((this.userTypes != '游客' && this.userTypes != '') || phoneNumber){
            this.getPushRecordCount();
            }
            this.getMenuConfig();
            // this.getBarConfig();
            this.getMessage()
            this.getActivity()
            this.getAdvertising();
            this.getAnnouncement()
            this.getItems();
            this.showCompanyConfig();
            this.isOneTime = false
        },
        // 默认房产数据
        async defaultProperty() {
            let companyData = await this.getCompanyAuthInfoList();
            let ownerData = await this.getOwnerHouse(); 
            return new Promise((resolve, reject) => {
                let data = [];
                if (companyData.status == 200) {
                    data = companyData.data ? data.concat(companyData.data) : data;

                }
                if (ownerData.status == 200) {
                    data = ownerData.data ? data.concat(ownerData.data) : data;
                }

                // 根据默认房产设置默认区域，项目
                let defaultEnterprise = data.filter(item => { return item.employeeStatus && item.employeeStatus == 1 });
                let defaultHouse = data.filter(item => { return item.isDefault == 1 });
                let list = data.filter(f => { return f.authType == 1 });
                // 业主身份
                if (defaultEnterprise.length > 0) {
                    const { AREA_ID, PROJECT_ID, COMPLANY_ID, AREA_NAME, PROJECT_NAME } = this.$constant;
                    const { areaId, projectId, houseState, companyId, areaName, projectName } = defaultEnterprise && defaultEnterprise.length > 0 ? defaultEnterprise[0] : [];
                    util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                    util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                    util.storageAction({ key: COMPLANY_ID, action: 'set', value: companyId });
                    util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                    util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                    this.areaId = areaId;
                    this.projectId = projectId;
                    this.projectName = projectName;
                    this.companyId = companyId
                } else if (defaultHouse && defaultHouse.length > 0 && !this.isOneTime) {
                    // if (!this.isOneTime) {
                        const { AREA_ID, PROJECT_ID, USER_ADDR_INFO, AREA_NAME, PROJECT_NAME } = this.$constant;
                        const { areaId, projectId, houseState, areaName, projectName } = defaultHouse[0]
                        util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                        util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                        util.storageAction({ key: USER_ADDR_INFO, action: 'set', value: defaultHouse[0] });
                        util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                        util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                        console.log('222222')
                        this.areaId = areaId;
                        this.projectId = projectId;
                        this.projectName = projectName;
                    // }
                } else if (list.length > 0) {
                    const { AREA_ID, PROJECT_ID, USER_ADDR_INFO, AREA_NAME, PROJECT_NAME } = this.$constant;
                    const { areaId, projectId, houseState, areaName, projectName } = list && list.length > 0 ? list[0] : [];
                    util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                    util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                    util.storageAction({ key: USER_ADDR_INFO, action: 'set', value: list[0] });
                    util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                    util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                    this.areaId = areaId;
                    this.projectId = projectId;
                    this.projectName = projectName;

                } else if (list.length == 0) {
                    resolve({ flag: true })

                } 
                if(ownerData.data)this.setIndexProjectId(ownerData.data);
                 this.setIdentity();
                tabBarFun.setIdentity() //获取用户角色
                tabBarFun.isJoinEnterprise() //获取用户认证状态
                resolve({ flag: false })
            })

        },
        setIndexProjectId(list){
            const { INDEX_PROJECT_ID } = this.$constant;
                let indexProjectId = []
                list.map(item=>{
                    indexProjectId.push(item.projectId)
                })
                let data = JSON.stringify(indexProjectId)
                util.storageAction({ key: INDEX_PROJECT_ID, action: 'set', value: data });
                const { SWITCH_PROJECT_ID } = this.$constant;
                const switchPjId = util.storageAction({ key: SWITCH_PROJECT_ID, action: 'get'});
                const switchPjIdList = util.storageAction({ key: INDEX_PROJECT_ID, action: 'get'});
                const { AREA_ID, PROJECT_ID, USER_ADDR_INFO, AREA_NAME, PROJECT_NAME } = this.$constant;
                if(switchPjId && switchPjIdList && !switchPjIdList.includes(switchPjId)){
                    const { areaId, projectId, areaName, projectName } = list[0]
                    util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                    util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                    util.storageAction({ key: USER_ADDR_INFO, action: 'set', value: list[0] });
                    util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                    util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                    this.areaId = areaId;
                    this.projectId = projectId;   
                    this.projectName = projectName
                }else if(switchPjId && switchPjIdList && switchPjIdList.includes(switchPjId)){
                    let selectPro = list.filter((item)=>item.projectId == switchPjId)
                    const { areaId, projectId, areaName, projectName } = selectPro[0]
                    util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                    util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                    util.storageAction({ key: USER_ADDR_INFO, action: 'set', value: selectPro[0] });
                    util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                    util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                    this.areaId = areaId;
                    this.projectId = projectId;   
                    this.projectName = projectName
                }
        },
        //设置当前房产，用户的角色
        setIdentity() {
            let params = {
                data: {
                    memberId: this.memberId,
                    projectId: this.projectId,
                    companyId: this.companyId
                },
                hideLoading: true
            }
            getUserRole(params).then(res => {

                if (res.status == '200') {
                    let state = res.data.supremePosition;
                      /** 1.租客,2.业主,3.家人,4.企业联系人,5.家政,6.企业员工,7.学生 8.非房产会员(带电话号码)
                      * 9 既是企业联系人也是租客 10 既是企业联系人也是业主 11既是企业联系人也是家人 
                      * 12既是企业联系人也是家政  13 既是企业员工也是租客 14 既是企业员工也是业主 
                      * 15既是企业员工也是家人 16既是企业员工也是家政
                      *  会员身份：住宅>企业
                      */
                    let userTypes = '';
                    switch (state) {
                        case 1:
                            userTypes = '租户'
                            break;
                        case 2:
                            userTypes = '业主'
                            break;
                        case 3:
                            userTypes = '家属'
                            break;
                        case 4:
                            userTypes = '企业联系人'
                            break;
                        case 5:
                            userTypes = '家政'
                            break;
                        case 6:
                          userTypes = '企业员工'
                          break;
                        case 8:
                           userTypes = '会员'
                             break;
                        case 9:
                           userTypes = '企业联系人'
                             break;
                        case 10:
                           userTypes = '业主'
                              break;
                        case 11:
                            userTypes = '家人'
                              break;
                        case 12:
                            userTypes = '家政'
                              break;
                        case 13:
                            userTypes = '租客'
                              break;
                        case 14:
                             userTypes = '业主'
                              break;
                        case 15:
                             userTypes = '家人'
                            break;
                        case 16:
                            userTypes = '家政'
                            break;
                        default:
                            userTypes = '游客'
                            break;
                    }
                    const { USER_TYPE, USER_TYPE_NUM } = this.$constant;
                    util.storageAction({ key: USER_TYPE, action: 'set', value: userTypes });
                    this.userTypes = userTypes;
                    util.storageAction({ key: USER_TYPE_NUM, action: 'set', value: state });
                    if (userTypes == '游客') {
                        // this.$refs.rzModal.showModal({ modalType: 'rz' });
                    }
                }
            })

        },

        // 获取企业房产
        getCompanyAuthInfoList() {
            return new Promise((resolve, reject) => {
                var params = {
                    data: {
                        companyId: this.companyId,
                        memberId: this.memberId,
                        applyStatus: 9  //已通过企业
                    },
                    "hideLoading": true,
                    responseToast: false
                }
                findCompanyAuthInfoList(params).then(res => {
                    resolve(res);
                })
            })
        },
        //获取房产
        getOwnerHouse() {
            return new Promise((resolve, reject) => {
                var params = {
                    data: {
                        companyId: this.companyId,
                        memberId: this.memberId,
                        authState:1
                    },
                    "hideLoading": true,
                    responseToast: false
                }
                getOwnerBuildingListComm(params).then(res => {
                    resolve(res);
                })
            })
        },
        getCity() {
            const { projectType } = commLogic.getProjectConfig();
            console.log('参数',projectType);
            
            return new Promise((resolve, reject) => {
                var params = {
                    data: {
                        projectType: projectType,
                    },
                    "hideLoading": true
                }
                getListByMap(params).then(res => {
                    if (res.status == 200) {
                    let defaultData = res.data
                    let defDate = defaultData.some(function(i){
                      return i.isDefaultProject == true
                    });
                    if(defDate == true) {
                        for ( var i = 0; i <defaultData.length; i++){
                                if(defaultData[i].isDefaultProject == true){
                                    const { AREA_ID, PROJECT_ID, AREA_NAME, PROJECT_NAME } = this.$constant;
                                    const { areaId, projectId, areaName, projectName } = defaultData[i]
                                    util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                                    util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                                    util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                                    util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                                    this.areaId = areaId;
                                    this.projectName = projectName
                                    this.projectId = projectId;
                                    resolve();
                                }
                            }
                    }
                    else{
                        const { AREA_ID, PROJECT_ID, AREA_NAME, PROJECT_NAME } = this.$constant;
                        if (!res.data.length) {
                            resolve()
                            return
                        }

                        const { areaId, projectId, areaName, projectName } = res.data[0]
                        util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                        util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                        util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                        util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                        this.areaId = areaId;
                        this.projectName = projectName
                        this.projectId = projectId;
                        resolve();
                        if( this.isAssociation == 0){
                            // const { AREA_ID, PROJECT_ID, AREA_NAME, PROJECT_NAME } = this.$constant;
                            // util.storageAction({ key: AREA_ID, action: 'remove'});
                            // util.storageAction({ key: PROJECT_ID, action: 'remove' });
                            // util.storageAction({ key: AREA_NAME, action: 'remove' });
                            // util.storageAction({ key: PROJECT_NAME, action: 'remove' });
                            // this.areaId = '';
                            // this.projectId = '';
                            this.projectName = ''
                           resolve();
                        }
                    }
                    } else {
                        reject();
                    }
                })
            })


        },
        getPageCode() {
            let that = this;
            var params = {
                data: {
                    configCode: "pageIndex",
                    projectId: that.projectId,
                    memberId: that.memberId
                },
                "hideLoading": true
            }
            getAppByCode(params).then(res => {
                if (res.status == 200) {
                    let configDesc = res.data.configDesc;
                    if (configDesc && configDesc.length > 0) {
                        that.pageMenu = {
                            page_banner_1_1: false,
                            page_menu_2_4: false,
                            page_headlines_1_1: false,
                            page_activity_1_1: false,
                            page_activity_1_1_text: '',
                            page_announcement_1_1: false,
                            page_announcement_1_1_text: '',
                            page_sunshine_1_1: false,
                            page_sunshine_1_1_text: ''
                        }
                        that.pageMenu = {};
                        configDesc.forEach(item => {
                            that.pageMenu[item.detailCode] = true;
                            that.pageMenu[item.detailCode + '_text'] = item.configName
                        })
                    }


                }
            })
        },
        getMenuConfig() {
            let that = this;
            var params = {
                data: {
                    configCode: "wyAuthModules",
                    projectId: that.projectId,
                    memberId: that.memberId
                },
                "hideLoading": true
            }
            getAppByCode(params).then(res => {
                if (res.status == 200) {
                    let configDesc = res.data.configDesc;
                    // 默认菜单
                    var defaultMenu = [
                        { detailCode: 'repair' },
                        { detailCode: 'complaint' },
                        { detailCode: 'questionnaire' },
                        { detailCode: 'activity' },
                        { detailCode: 'announcement' },
                        { detailCode: 'intimateHousekeeper' },
                        { detailCode: '400phone' },
                        { detailCode: 'more' }]
                    if (!configDesc || configDesc.length == 0) {
                        configDesc = defaultMenu;
                    }
                    let showMenu = util.intersection(configDesc, menu, 'detailCode',true,'wyAuthModules');
                    // console.log('showMenu-------------------',showMenu,configDesc)
                    let setMenu = [];
                    configDesc.forEach(item => {
                        setMenu[item.detailCode] = item.configName;
                    })
                    showMenu.forEach(item => {
                        item.configName = setMenu[item.detailCode] ? setMenu[item.detailCode] : item.configName;
                    })
                    let menus = JSON.parse(JSON.stringify(showMenu));
                    that.menuList = menus;
                    
                }
            })

        },

        // getBarConfig() {
        //     let that = this;
        //     var params = {
        //         data: {
        //             configCode: "wechatBarConfig",
        //             projectId: that.projectId,
        //             memberId: '8331e87b-122c-4b5b-afad-3b53d4776685'
        //         },
        //         "hideLoading": true
        //     }
        //     getAppByCode(params).then(res => {
        //         console.log(785,res)
        //         if (res.status == 200) {
        //             let configDesc = res.data.configDesc;
        //             // 默认菜单
        //             var defaultMenu = [
        //                 { detailCode: 'repair' },
        //                 { detailCode: 'complaint' },
        //                 { detailCode: 'questionnaire' },
        //                 { detailCode: 'activity' },
        //                 { detailCode: 'announcement' },
        //                 { detailCode: 'intimateHousekeeper' },
        //                 { detailCode: 'more' }]
        //             if (!configDesc || configDesc.length == 0) {
        //                 configDesc = defaultMenu;
        //             }
        //             let showMenu = util.intersection(configDesc, menu, 'detailCode');
        //             console.log('showMenu', showMenu)
        //             let setMenu = [];
        //             configDesc.forEach(item => {
        //                 setMenu[item.detailCode] = item.configName;
        //             })
        //             showMenu.forEach(item => {
        //                 item.configName = setMenu[item.detailCode] ? setMenu[item.detailCode] : item.configName;
        //             })
        //             console.log(showMenu)

        //             that.menuList = showMenu;

        //         }
        //     })

        // },

        getAdvertising() {
            console.log("getAdvertising");
            let that = this;
            const {COMPLANY_ID , O_USER_INFO} = this.$constant
            that.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
            const { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    sort: "true",
                    projectId: that.projectId,
                    areaId: that.areaId,
                    companyId: this.companyId || companyId,
                    recommendType: "ad_homePage"
                },
                "hideLoading": true
            }
            getShelvesList(params).then(res => {

                if (res.status == 200) {
                    that.swiperList = res.data.records;
                }

                if(that.swiperList.length == 0){

                    that.swiperList = [
                        {
                            picture: require('@/static/theme-default/index/default_banner.png'),
                            linkType: 0,
                        }

                    ]
                }
                console.log("getShelvesList", that.swiperList);
            });
        },
        // banner点击事件
        bannerClick(e) {
            let info = this.swiperList[e];
            const { O_USER_INFO } = this.$constant;
            let userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    slideInfoId: info.slideinfoId,
                    userId: this.memberId,
                    userName: userInfo.fullName,
                },
                hideLoading: true,

            }
            // 链接类型(0、未有链接 1、文章 2、商品  3、外链 4、优惠券 5、活动,6、问卷)
            if (info.linkType == 0) {
                return
            } else if (info.linkType == 1) {
                addGbSlideRead(params);
                uni.navigateTo({ url: `/pages-b/announcement/detail?articleId=${info.url}` });
            } else if (info.linkType == 3) {
                uni.navigateTo({
                    url: `/pages-d/webview/webview?url=${info.url}`
                })
            } else if (info.linkType == 5) {
                addGbSlideRead(params);
                uni.navigateTo({ url: `/pages-d/activity/activityDetail?aid=${info.url}` });
            } else if (info.linkType == 6) {
                addGbSlideRead(params);
                uni.navigateTo({ url: `/pages-c/questionnaire/detail?id=${info.url}` });
            }
        },
        getMessage() {
            let that = this;
            var params = {
                data: {
                    "sendType": 2,
                    "toUserId": that.memberId,
                    "msgType": "5,6",
                    "projectId": that.projectId
                },
                hideLoading: true,
                pathParams: '/10/1'
            }
            queryMyMessages(params).then(res => {
                if (res.status == 200) {
                    that.messageList = [];
                    res.data.records.forEach(item => {
                        that.messageList.push(item.title)
                    });
                }
            })
        },
        getActivity() {
            let that = this;
            var params = {
                data: {
                    "pageSize": 10,
                    "pageNum": 1,
                    "projectId": that.projectId,
                    "memberId": that.memberId
                },
                "hideLoading": true
            }
            activity(params).then(res => {
                if (res.status == 200) {
                    that.activityList = Array.isArray(res.data.records) ? res.data.records.slice(0, 2) : [];
                    for (var j = 0; j < that.activityList.length; j++) {
                        // let signUpEndDate = new Date(res.data.records[j].signUpEndDate.replace(/-/g, '/'))
                        // let signUpEndDate = new Date(res.data.records[j].signUpEndDate.replace(/-/g, "/"));
                        let afterTime = res.data.records[j].signUpEndDate.split(" ")[1]
                        var dateTimeStamp = new Date(res.data.records[j].signUpEndDate.replace(/-/g, "/"));
                        let checkDate = (date) => {
                            return date < 10 ? '0' + date : date
                        }
                        // res.data.records[j].signUpEndDate = checkDate(dateTimeStamp.getMonth() + 1) + '-' + checkDate(dateTimeStamp.getDate()) + ' ' + afterTime;
                    }
                }
            })
        },
        getAnnouncement() {
            let that = this;
            var params = {
                data: {
                    "page": 1,
                    "colId": 1,
                    "limit": 5,
                    "projectId": that.projectId,
                    "companyId": this.companyId
                },
                hideLoading: true,
            }
            alist(params).then(res => {
                let getCompanyAuthInfoListTime = (new Date().getTime() - this.nowData1) / 1000
                if (res.status == 200) {
                    that.announcementList = res.data.records
                }
            })
        },
        DateFormat(t) {
            if (t) {
                return t.split(" ")[0]
            }
        },
        login() {  
            const isAuthorized = this.isAuthorized()
             
            if (!isAuthorized) {
                const { uniPlatform } = uni.getSystemInfoSync();
                if (uniPlatform === 'mp-weixin') {
                    return this.wxMiniLogin()
                } else if (uniPlatform === 'app' || uniPlatform === 'web') {
                    uni.navigateTo({ url: '/pages-a/authorization/login' })
                    return Promise.resolve()
                }
            }

        },
        activityStatusColor(item) {
            const { signUpStartDate, signUpEndDate, activityButtonStart, activityStart, endDate} = item || {}
            const currentDate = new Date()
            const notStarted = new Date(signUpStartDate.replace(/-/g, '/')) > currentDate
            const haveBegun = activityButtonStart == true && activityStart != '';
            const endDateFlag = (new Date(signUpEndDate.replace(/-/g, '/')) < currentDate && new Date(endDate.replace(/-/g, '/')) > currentDate) || new Date(endDate.replace(/-/g, '/')) < currentDate

            return notStarted || haveBegun ? 'primary-color' : endDateFlag ? 'gray-color' : 'primary-color'
        },
        activityStatusText(item) {
            const { signUpStartDate, signUpEndDate, endDate} = item || {}
            const currentDateObj = new Date()
            const signUpStartDateObj = new Date(signUpStartDate.replace(/-/g, '/'))
            const signUpEndDateObj = new Date(signUpEndDate.replace(/-/g, '/'))
            const endDateObj = new Date(endDate.replace(/-/g, '/'))
            const notStarted = signUpStartDateObj > currentDateObj;
            const happening = currentDateObj > signUpStartDateObj && currentDateObj < signUpEndDateObj
            const deadline = currentDateObj > signUpEndDateObj && currentDateObj < endDateObj
            const isOver = currentDateObj > endDateObj

            return notStarted ? '未开始' : happening ? '去参加' : deadline ? '已截止' : isOver ? '已结束' : '未知'
        },
        activityDate(dateString) {
            // 使用正则表达式将日期字符串拆分成年、月和日
            const dateParts = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);

            if (dateParts) {
                const year = parseInt(dateParts[1], 10);
                const month = parseInt(dateParts[2], 10);
                const day = parseInt(dateParts[3], 10);

                return `${month}-${day}`;
            } else {
                // 如果无法解析日期字符串，则返回原始值
                return dateString;
            }
        },
        // activityDate(dateString) {

        //     const date = new Date(dateString);
        //     const month = date.getMonth() + 1;
        //     const day = date.getDate();
        //     return `${month}-${day}`;
        // },
        propertyJumpClick(index,title) {
         let self = this;
        if (index == 1) {
            savePageTitle({ title: "阳光家园"});
            uni.navigateTo({ url: '/pages-d/huiKing/huiHomeScene'});
        } else if (index == 2) {
            savePageTitle({ title: "阳光故事" });
            uni.navigateTo({ url: '/pages-d/sunStory/sunStory'});
        } else if (index == 3) {
            savePageTitle({ title: "阳光团队" });
            uni.navigateTo({ url: '/pages-d/huiKing/huiFamilyScene'});
        } else if (index == 4) {
            savePageTitle({ title: "物业宣传" });
            uni.navigateTo({ url: '/pages-d/propertyPublicity/list'});
        }
      },

      //获取code
      getItems(){

        const { MEMBER_ID, AREA_ID, PROJECT_ID, O_USER_INFO } = this.$constant;
        let param={
            data:{
                configCode: "sunshineModules",
                projectId: util.storageAction({ key: PROJECT_ID, action: 'get' }),
                memberId:util.storageAction({ key: MEMBER_ID, action: 'get' })
            },
            hideLoading: true
        }
        let getCode
        getCode=GetHomePageFunctionNew(param)
        getCode.then(res =>{
          let arr = res.data.configDesc;

          let temArr=[]
          let defaultList1=['huiHomeScene', 'sunStory', 'huiFamilyScene', 'propertyPublicity']  //显示
          let defaultList2=[{detailCode: "huiHomeScene"}, {detailCode: "sunStory"}, {detailCode: "huiFamilyScene"}, {detailCode: "propertyPublicity"}]
          let defaultList=defaultList2
          let list = arr
          list.forEach(code => {
            this.dataList.forEach(item =>{
            //   if(this.customFunction){
                if(code.detailCode==item.code){
                  if(code.configName){
                    item.title=code.configName
                  }
                  if(code.imgUrl){
                    item.imgUrl = code.imgUrl
                  }
                  temArr.push(item)
                }
            //   }else{
            //     if(code==item.code){
            //       temArr.push(item)
            //     }
            //   }

            })
          });
          this.sunshineList = temArr;

        })
      },
      geturl(){
        var params = {
                data: {
                    dictCode: 'Owner_Customize'
                },
                "hideLoading": true,
                responseToast: false
            }
            getDictDetail(params).then(res => {
                if (res.resultCode == 200) {
                    let data = res.data
                    data.forEach(item=>{
                        if(item.detailCode=="Owner_customize_url"){
                            this.detailCodeurl = item.detailDesc
                        }
                    })
                }
            })
          },
     async wechatLogin(option) { 
            // 微信公众号授权登录
            var params = {
                data: {
                    code: option.code,
                    projectType: option.projectType
                },
                hideLoading: true,
                responseToast: false
            }
            let result = await wxOauthNew(params);
            if (result.status == 200) {
                this.wechatInfo = {
                    projectType: '',
                    code: ''
                };                 
                const { token, memberId, wxUserId,memberPhone,projectType } = result.data;
                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID, PROJECT_TYPE, COMPLANY_ID,OLD_WECHAT_CODE } = this.$constant;
                util.storageAction({ key: OLD_WECHAT_CODE, action: 'set', value: option.code });
                let companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' });
                let memberJsonObject = JSON.parse(result.data.memberJsonObject);
                let wxUserJsonObject = JSON.parse(result.data.wxUserJsonObject);
                const combineData = { ...memberJsonObject, ...wxUserJsonObject, companyId, id: memberId,phoneNumber:memberPhone }

                const storage = commLogic.setOwerUserInfo('mpWeixin', combineData);
                let newprojectType = option.projectType?option.projectType:projectType
                util.storageAction({ key: TOKEN, action: 'set', value: token });
                util.storageAction({ key: MEMBER_ID, action: 'set', value: memberId });
                util.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                util.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                util.storageAction({ key: PROJECT_TYPE, action: 'set', value: newprojectType });
                util.storageAction({ key: OLD_WECHAT_CODE, action: 'set', value: option.code });
                this.initData();
                console.log('获取到用户信息');
                const { errMsg } = await commLogic.mallLoginByMbid();
                if (errMsg) uni.showToast({icon: 'none', title: errMsg}) 
            }
  
        },
       async wechatSetCompany(projectType) {
            var params = {
                data: {
                    projectType: projectType,
                },
                "hideLoading": true
            }
          let res=await getListByMap(params);
          if(res.status == 200 && res.data){
           let info = res.data?.[0]??{};
           const { COMPLANY_ID } = this.$constant;
           util.storageAction({ key: COMPLANY_ID, action: 'set', value: info.companyId });  
          }
        },
        //后台配置认证接口
        async  showCompanyConfig() { 
            const {COMPLANY_ID , O_USER_INFO} = this.$constant
            this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
            const { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
             var params = {
                data:{
                    companyId: this.companyId || companyId,
                }
             };
           getCompanyConfig(params).then(result=>{ 
               if (result.status == 200) {
                this.authTypes= result.data.authType ? JSON.parse(result.data.authType).filter(f => { return f != '' }) : [];
                this.authTypes.forEach(item=>{ 
                   let val = item ? parseInt(item) : 0
                   if(this.authTypes.length==1){
                     switch(val){
                      case 1:
                         this.showFWQY = val;
                        break
                       case 2:
                       this.showFWQY = val;
                         break;
                       default :
                       break;
                     }
                  }
                  if(this.authTypes.length==2){
                       this.showFWQY = 0;
                  }
               })
               }else{
                 this.showFW = 0; 
               }
     });
    },
   //未阅读数
    getPushRecordCount() {
        const { O_USER_INFO ,PROJECT_ID} = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            let params = {
                data: {
                    projectId:util.storageAction({ key: PROJECT_ID, action: 'get' }),
                    phone:phoneNumber
                },
                hideLoading: true,
                responseToast: false
            }
            getPushRecordCount(params).then(res => {
                if (res.status == '200') {
                    let list=res.data || {}
                    this.totalCounts = list
                }
            })

        },
      //去系统列表
        goToSystemMessages(){
        uni.navigateTo({ url: '/pages-b/systemMessages/systemList'});
      },
    },
    mounted() {
        const { O_USER_INFO } = this.$constant;
        let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        clearInterval(this.intervalTime)
        if((this.userTypes != '游客' && this.userTypes != '') || phoneNumber){
         this.intervalTime = setInterval(() => {
            console.log(2337)
            this.getPushRecordCount();  // 接口方法
        }, 5000);
        }
    },
    beforeDestroy() {
    this.intervalTime()
  }
};
</script>
