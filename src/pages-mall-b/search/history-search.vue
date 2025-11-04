<style scoped lang="scss">
.history-search-page{
    width: 100%;
    min-height: 100%;
    background-color: #f7f7f7;
    $cmw: 690rpx;
    $title-fs: 30rpx;
    .search-area{
        margin: 0 auto;
        width: $cmw;
        padding: 20rpx 0;
        @include flx-dsp($jsc: space-between, $ali: center);
        .search-input{
            $h: 60rpx;
            @include flx-dsp($jsc: flex-start, $ali: center);
            flex: 1;
            height: 64rpx;
            margin: 0 20rpx 0 10rpx;
            border-radius: 30rpx;
            border: 1rpx solid $uni-color-primary;
            background-color: #fff;
            $fs: 28rpx;
            input{
                flex: 1;
                padding-left: 30rpx;
                height: $h;
                line-height: $h;
                box-sizing: border-box;
                border: none;
                font-size: $fs;
            }
            .input-placeholder{
                font-size: $fs;
            }
            .clear-icon{
                display: block;
                @include flx-dsp($jsc: center, $ali: center);
                line-height: $h;
                margin: 0 20rpx;
            }
        }
        .search-button{
            font-size: 32rpx;
        }
    }
    .page-cont{
        width: 100%;
        height: calc(100vh - 108rpx);
        overflow: auto;
    }
    .history-search{
        margin: 0 auto;
        width: $cmw;
        .history-header{
            @include flx-dsp($jsc: space-between, $ali: center);
            width: 100%;
            padding: 10rpx 0 20rpx 0;
            text{
                font-size: $title-fs;
                font-weight: bold;
            }
            image {
                width: 32rpx;
                height: 32rpx;
            }
        }
        .history-body{
            @include flx-dsp($jsc: flex-start, $ali: center);
            flex-wrap: wrap;
            .word{
                @include flx-dsp($jsc: center, $ali: center);
                background-color: #fff;
                border-radius: 20rpx;
                padding: 8rpx 15rpx;
                margin: 0 10rpx 20rpx 10rpx;
                & > text{
                    font-size: 26rpx;
                    line-height: 36rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 670rpx;
                }
                ::v-deep .cl-icon-close{
                    margin-left: 8rpx;
                     /*  #ifdef  MP-WEIXIN  */
                        position: relative;
                        top: -5rpx;
                    /*  #endif  */
                }
               
            }
            .arrow-container{
                margin: 0 0rpx 20rpx 10rpx;
                & > view {
                    background-color: #fff;
                    border-radius: 50%;
                    width: 52rpx;
                    height: 52rpx;
                    @include flx-dsp($jsc: center, $ali: center);
                }
            }
        }
    }
    .hot-word{
        margin: 0 auto;
        width: $cmw;
        &-header{
            @include flx-dsp($jsc: space-between, $ali: center);
            & > text{
                font-size: $title-fs;
                font-weight: bold;
            }
            & > view {
                image{
                    width: 38rpx;
                    height: 38rpx;
                }
            }
            margin-bottom: 20rpx;
        }
        &-body{
            width: 100%;
            flex-wrap: wrap;
            @include flx-dsp($jsc: flex-start, $ali: center);
            .key-word{
                width: 50%;
                @include flx-dsp($jsc: flex-start, $ali: flex-start);
                margin-bottom: 20rpx;
                text{
                    font-size: 24rpx;
                }
            }
            .no-keyword{
                display: block;
                width: 100%;
                text-align: center;
                font-size: 24rpx;
                color: #8C8C8C;
            }
        }
        .hide-keyword{
            width: 100%;
            @include flx-dsp($jsc: center, $ali: center);
            text{
                font-size: 24rpx;
                color: #8C8C8C;
            }
        }
    }
}
</style>

<template>
	<view class="history-search-page">
        <!-- 搜索区域 -->
        <view class="search-area">
            <text @tap="pageNav({key: 'back'})">
                <cl-icon name="cl-icon-arrow-left" :size="50"></cl-icon>
            </text>
            <view class="search-input">
                <input
                    @confirm="confirm"
                    @input="input"
                    @blur="blur_input"
                    v-model="inputValue"
                    type="text"
                    focus
                    placeholder-class="input-placeholder"
                    placeholder="请输入关键词"
			    />
                <text class="clear-icon" @tap="clear" v-if="inputValue">
                    <cl-icon name="cl-icon-close-border" :size="30"></cl-icon>
                </text>
            </view>
            <text class="search-button" @tap="confirm">搜索</text>
        </view>
        <view class="page-cont" @tap="keywordClearClick()">
            <!-- 搜索历史 -->
            <view class="history-search" v-if="searchHistoty.length">
                <view class="history-header">
                    <text>搜索历史</text>
                    <image @tap.stop="deleteAllSearchHistoryConfirm" src="/pages-mall-b/static/trash_icon.png" mode=""></image>
                </view>
                <view class="history-body">
                    <view class="word" v-if="wordShow(index)" v-for="(item, index) in searchHistoty" :key="index" @longpress.stop="keywordClearClick(index)" @tap.stop="tapKeyword(index)">
                        <text>{{item.word}}</text>
                        <cl-icon v-if="item.showClear" name="cl-icon-close" color="#c1c1c1" :size="15"></cl-icon>
                    </view>
                    <view class="arrow-container" v-if="searchHistoty.length > maxWord">
                        <view v-if="arrowUp"  @tap="arrowUp = 0">
                            <cl-icon name="cl-icon-arrow-bottom" :size="30"></cl-icon>
                        </view>
                        <view v-else @tap="arrowUp = 1">
                            <cl-icon name="cl-icon-arrow-top" :size="30"></cl-icon>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 热门关键词 -->
            <view class="hot-word">
                <view class="hot-word-header">
                    <text>热门关键词</text>
                    <view>
                        <image v-if="eyeOpen" @tap="eyeOpen = 0" src="/pages-mall-b/static/eye_open.png" mode=""></image>
                        <image v-else @tap="eyeOpen = 1" src="/pages-mall-b/static/eye_close.png" mode=""></image>
                    </view>
                </view>
                <view class="hot-word-body" v-if="eyeOpen">
                    <view class="key-word" v-for="(item, index) in hotKeyWord" :key="index" @tap.stop="pageNav({keyword: item.word})">
                        <text>{{item.word}}</text>
                    </view>
                    <text class="no-keyword">暂无热门关键词~</text>
                </view>
                <view v-else class="hide-keyword">
                    <text>已隐藏热门关键词</text>
                </view>
            </view>
        </view>
        <!-- 确认框 -->
        <cl-confirm ref="confirm"> </cl-confirm>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputValue: '',
                searchHistoty: [],
                arrowUp: 1,
                maxWord: 8,
                eyeOpen: 1,
                hotKeyWord: [] 
			}
		},
        computed:{
           
        },
		methods: {
            input (evt) {
                this.inputValue = evt.detail.value;
            },
            confirm() {
                this.pageNav({keyword: this.inputValue})
            },
            // 失去焦点
            blur_input() {
                setTimeout(function(){
                    uni.pageScrollTo({ scrollTop: 0, duration: 0 })
                    //为了处理安卓手机键盘弹回后底部空白界面占位
                    document.getElementById("a").scrollIntoView()
                },100)
            },
            clear() {
                this.inputValue = '';
            },
            wordShow(index) {
                const maxWord = this.maxWord;
                const arrowUp = this.arrowUp;
                return arrowUp && index < maxWord || !arrowUp;
            },  
            getSearchHistotyWord() {
                const testPms = new Promise((resolve) => {
                    setTimeout(() => {
                        const list = [];
                        for (let i = 0; i < 18; i++) {
                            const rd = Math.random()
                            list.push({
                                keyWord: rd < .3 ? '苹果mac' : rd < .6 ? '严办' : '笔记本电脑',
                            });
                        }
                        const res = {
                            statusCode: 200,
                            message: '请求成功',
                            data: list
                        }
                        resolve(res)
                    }, 200)
                });
                const prodPms = this.$mallApi.data.getSearchHistoryRecord({data: {size: 0, current: 0}})
                const pms = prodPms;
                return pms.then(res => {
                    if (res.statusCode === 200) {
                        const list = Array.isArray(res.data) ? res.data : [];
                        const tempList = [];
                        list.forEach(item => {
                            const {keyWord} = item;
                            const d = {
                              ...item,
                              word: keyWord,
                              showClear: false  
                            }
                            tempList.push(d);
                        });
                        this.searchHistoty = tempList
                    }
                })
            },
            keywordClearClick(index) {
                this.searchHistoty.forEach(item => item.showClear = false);
                if (index !== undefined) this.searchHistoty[index].showClear = true;
            },
            tapKeyword(index) {
                const {showClear, word} = this.searchHistoty[index];
                if (showClear) {
                    this.clearKeywordByApi({index});
                } else {
                    this.pageNav({keyword: word});
                }
            },
            clearKeywordByApi(params) {
                const {index} = params || {};
                const ids = [];
                if (index === undefined) this.searchHistoty.forEach(item => ids.push(item.id));
                if (index !== undefined) {
                    const {id} = this.searchHistoty[index];
                    ids.push(id); 
                }  
                this.$mallApi.data.deleteSearchHistory({data: {ids}}).then(res => {
                    if (res.statusCode === 200) {
                        index === undefined ? (this.searchHistoty = []) : (this.searchHistoty.splice(index, 1))
                    }
                });
            },
            getHotWord() {
                const testPms = new Promise((resolve) => {
                    setTimeout(() => {
                        const list = [];
                        for (let i = 0; i < 8; i++) {
                            const rd = Math.random()
                            list.push({
                                keyWord: rd < .3 ? '电视柜818购物节狂欢' : rd < .6 ? '乌龙茶' : '真皮沙发',
                            });
                        }
                        const res = {
                            statusCode: 200,
                            message: '请求成功',
                            data: list
                        }
                        resolve(res)
                    }, 200)
                });
                const prodPms = this.$mallApi.data.getHotKeywordList({pathParams: '/0/0'});
                const pms = prodPms;
                return pms.then(res => {
                    if (res.statusCode === 200) {
                        const list = Array.isArray(res.data) ? res.data : [];
                        const tempList = [];
                        list.forEach(item => {
                            const {keyWord} = item;
                            const d = {
                              ...item,
                              word: keyWord  
                            }
                            tempList.push(d);
                        });
                        this.hotKeyWord = tempList
                    }
                })
            },
            pageNav(params) {
                const {key, keyword} = params || {};
                if (key === 'back') {
                    uni.navigateBack()
                } else if (keyword !== undefined) {
                    // uni.redirectTo({
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages-mall-a/search-list/search-list?gmName=' + keyword,
                            animationType:'none'
                        })
                    },100)
                }
            },
            deleteAllSearchHistoryConfirm() {
                this.$refs["confirm"].open({
					title: "提示",
					message: "您确定要删除全部搜索历史吗？",
					callback: ({ action }) => {
						if (action === 'confirm') this.clearKeywordByApi();
					}
				});
            },
            async initPageData() {
                uni.showLoading({title: '加载中'});
                await this.getSearchHistotyWord().catch();
                await this.getHotWord().catch();
                uni.hideLoading();
            }
		},
		async onLoad(options) {
            this.initPageData();
            if(options.searchKey){
				this.inputValue = options.searchKey
			}
		}
	}
</script>


