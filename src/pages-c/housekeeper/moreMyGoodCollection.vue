<template>
  <view class="page-content">
    <u-list
      @scrolltolower="scrolltolower"
      class="page-content-body" v-if="expressList.length"
    >
      <u-list-item
        v-for="(item, index) in expressList"
        :key="index"
      >
        <GoodCollectionInfoView :collectionInfo="item"></GoodCollectionInfoView>
        <view class="divider-view" v-show="index < expressList.length - 1"></view>
      </u-list-item>
    </u-list>
    <view v-if="!expressList.length" class="nodata"></view>
  </view>
</template>

<script>
import util from '../../js/utils'
import GoodCollectionInfoView from './components/GoodCollectionInfoView'
import {
    getExpressList,
    findLocations
} from '../../service/community'
export default {
  name: 'moreMyGoodCollection',
  components: {
    GoodCollectionInfoView
  },
  data() {
    return {
        expressList: [],
        ownerId: '',
        memberId: '',
        page: 1, //页码
        pageSize: 1000, //每页数量
        totalCount: 0, //消息总数
      }
    },
    async onLoad(option) {
      this.ownerId = option.ownerId
      const { MEMBER_ID } = this.$constant;
      this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      if(!this.ownerId){
        await this.getLocations();
      }
      if(this.ownerId){
        await this.loadData(1)
      }
		},
    // 上拉加载  uni自带
    onPullDownRefresh() {
      this.page = 0
      this.loadData(0)
      uni.stopPullDownRefresh()
    },
    methods: {
      // 下拉加载
      scrolltolower() {
        this.page++
        this.loadData(1)
			},
			loadmore() {
				for (let i = 0; i < 30; i++) {
					this.indexList.push({
						url: this.urls[uni.$u.random(0, this.urls.length - 1)]
					})
				}
			},
      // 获取默认的地址
      getLocations(){
        let params = {
          data: {
            memberId: this.memberId,
            // projectType: PROJECT_TYPE
          },
          hideLoading: true,
          pathParams: '/1'
        };
        findLocations(params).then(res =>{
          if (res.data !== null) { 
            if (res.data.authBuildings.length > 0) {
              var relateAddress = null;
              for (var i in res.data.authBuildings) {
                var item = res.data.authBuildings[i];
                if (i == 0) {
                  relateAddress = item;
                } else {
                  if (item.isDefault == 1) {
                    relateAddress = item;
                  }
                }
              }
                this.ownerId = relateAddress.ownerId;
                this.loadData(1)
            }
          }  
        })
      },
      loadData(flag){
        let params = {
          data: {
            ownerId: this.ownerId,
            pageNum: this.page,
            pageSize: this.pageSize
          }
        }
        getExpressList(params).then(res =>{
          if (res.data && res.data.records) {
            let infos = res.data.records;
            for (var index in infos) {
              var item = infos[index];
              var records = new Array();
              for (var j = item.expressRecords.length - 1; j > -1; j--) {
                records.push(item.expressRecords[j]);
              }
              item.expressRecords = records;
            }


            if (flag === 0) {
              // console.log('infos11111=',infos)
              this.expressList =  infos
            } else {
              // console.log('infos2222222=',infos)
              this.expressList = this.expressList.concat(infos)
            }
            this.totalCount = res.data.total
          }
        })
      },
    }
}
</script>

<style lang="scss" scoped>
  .divider-view {
    display: flex;
    flex: 1;
    height: 1px;
    margin-left: 30rpx;
    background: #F7F7F7;
  }
  .page-content-body{
    width: 100%;
    background-color: #fff;
    min-height: calc(100vh);
  }
  .page-content{
    background-color: #F7F7F7;
    position: absolute;
    width: 100%;
    height: 100vh;
  }
  .nodata {
    height: 100vh ;
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
