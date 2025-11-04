<!--  -->
<template>
    <view class='pagesbox'>
        <view class="box">
            <view class="title">订阅详情</view>
            <view class="detail">
                <view class="detail-box" v-for="(item, index) in  list " :key="index" @click="selectTab(item)">
                    <view class="name" :class="{ 'nameAction': item.name == selectTabName }">{{ item.name }}</view>
                    <view class="value DIN">{{ item.value }}</view>
                </view>
            </view>
        </view>
            <view class="box list-box">
                <view class="title">{{ title }}</view>
                <journal-push :dataList="dataList" :pageIndex="pageIndex" :pages="pages" @changePage="changePage"></journal-push>
            </view>

    </view>
</template>

<script>
import JournalPush from './journalPush.vue';
import { getUserSubscribeCount, getUserPushLogListByPage } from '../service/datawarehouse';

export default {
    components: { JournalPush },
    data() {
        return {
            selectTabName: '',
            title: '最新报告',
            list: [{
                name: '日报',
                value: '0',
                key: 'dailyReportNum'
            }, {
                name: '周报',
                value: '0',
                key: 'weekReportNum'
            }, {
                name: '月报',
                value: '0',
                key: 'monthReportNum'
            }, {
                name: '季报',
                value: '0',
                key: 'quarterReportNum'
            }, {
                name: '年报',
                value: '0',
                key: 'yearReportNum'
            }],
            dataList: [],
            pageIndex: 1,
            pages: 1,


        };
    },
    computed: {},
    watch: {},
    methods: {
        selectTab(item) {
            this.pageIndex = 1;
            this.dataList = [];
            if (this.selectTabName == item.name) {
                this.selectTabName = '';
                this.title = '最新报告';
                this.getList(this.selectTabName);
                return;
            }
            this.selectTabName = item.name;
            this.title = item.name;
            this.getList(this.selectTabName);
        },
        getUserNumber() {
            let { O_USER_INFO } = this.$constant;
            let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    userId: userInfo.userId
                }
            }
             getUserSubscribeCount(params).then(res => {
                if (res.status == 200) {
                    let items = res.data;
                    this.list = this.list.map(m => {
                        return {
                            name: m.name,
                            key: m.key,
                            value: items[m.key]
                        }
                    })


                }
            })
        },
        getList(type) {
            let { O_USER_INFO } = this.$constant;
            let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    userId: userInfo.userId,
                    pushType: type
                },
                pathParams: `/10/${this.pageIndex}`
            }
            getUserPushLogListByPage(params).then(res => {
                if (res.status == 200) {
                    this.pages = res.data.pages;
                    if (this.pageIndex == 1) {
                        this.dataList = res.data.records;
                    } else {
                        this.dataList = this.dataList.concat(res.data.records);
                    }


                }
            })
        },
        changePage(pages) {
            console.log('分页', pages);
            this.pageIndex = pages.num;
            this.getList(this.selectTabName);

        }
    },
    onShow(){
        this.getUserNumber();
        this.getList(this.selectTabName);
    },
    created() {
        this.selectTabName = '日报'
    },
    mounted() {
        // this.getUserNumber();
        // this.selectTab({name:'日报'})
    },
}
</script>
<style scoped lang="scss"> .pagesbox {
     box-sizing: border-box;
     height: 100vh;
     width: 100%;
     background-color: #f5f6f8;
     padding: 20rpx;
     box-sizing: border-box;
    //  overflow: auto;
 }

 .box {
     background: #FFFFFF;

     // padding: ;
     .title {
         font-size: 30rpx;
         font-weight: bold;
         color: #333333;
         border-bottom: 1px solid #EBEBEB;
         padding: 30rpx;
         box-sizing: border-box;
     }

     .detail {
         display: flex;

         .detail-box {
             flex: 1;
             text-align: center;
             padding: 30rpx 0;
             box-sizing: border-box;
             .name {

                 font-size: 20rpx;
                 color: #666666;
             }

             .nameAction {
                 color: #2761FF;
             }

             .value {
                 font-size: 40rpx;
                 font-weight: bold;
                 color: #2761FF;
                 margin: 10px 0 0;
                 box-sizing: border-box;
             }

         }
     }
 }
 .list-box{
     height: calc(100vh - 160px);
     box-sizing: border-box;
    margin: 24rpx 0 0;
  }
</style>