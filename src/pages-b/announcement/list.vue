<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <u-tabs :list="tabList" itemStyle="width:20%;padding:0;height:88rpx"
						lineWidth="70rpx" :lineColor="`url(${lineBgImgye})`"
						activeStyle="font-size:28rpx;" inactiveStyle="font-size:28rpx" :current="selectedTabIndex" @click="changeIndex">
		</u-tabs>
    <view class="card-panel-list">
      <view class="card-panel" v-for="(item, index) in announceList" :key="index" @click="linkTo(item)">
        <view class="card-tag">阅读 {{ item.clickCount }}</view>
        <u--image class="itemImage" :showLoading="true" :src="item.imgSrc" width="100%" height="440rpx" mode="aspectFill" :lazy-load="true">
          <template v-slot:loading>
            <u--image :src="require(`@/static/${[THEME_NAME]}/activity/big-photo.png`)" ></u--image>
          </template>
        </u--image>
        <view class="card-content">
          <u--text :text="item.title" wordWrap="anywhere" />
          <view class="flex-between">
            <u--text :text="item.operateTime" :size='12' color="#8f9ca2" />
            <view class="" style="position: relative;">
		  				<text class="btn-box btn-box-icon" v-if="item.boutique == 1">精品文章</text>
            	<text class="btn-box">{{item.colName}}</text>
              <view style="width: 8px;height: 8px;background: #FF2300;border-radius: 50%;position: absolute;right: 0px;top: -3px;" v-if="item.clickState  == 0"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="announceList.length==0" class="nodata"></view>
  </view>
</template>

<script>
import { alist, addClickCountById ,changeUpdateStatus,columnList} from '@/service/wxmanage'
import Utils from '@/js/utils'

export default {
  data() {
    const { AREA_ID, PROJECT_ID, COMPLANY_ID, MEMBER_ID } = this.$constant

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      memberId : Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      list: [],
      announceList:[],
      tabList: [],
      selectedTabIndex:0,
      lineBgImg:'data:image/png;base64,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',
      lineBgImgye:'data:image/png;base64,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',
      colId:'',
    }
  },
  created() {
    this.getClomList()
    this.getListData()
  },
  methods: {
    changeIndex(item){
      this.colId = item.colId
      this.getListData()
    },
    getClomList(){
      let params = {
        data:{
          parentId:'1',
        }
      }
      columnList(params).then(res=>{
        if(res.status == '200'){
          res.data.map(item=>{
            this.tabList.push({
              name:item.colName,
              ...item
            })
          })
        }
      })
    },
    async getListData() {
      const { O_USER_INFO } = this.$constant;
      let { phoneNumber } = Utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        page: 1,
        limit: 100,
        colId: this.colId ? this.colId:5,
        areaId: this.areaId,
        projectId: this.projectId,
        companyId: this.companyId,
        phone: phoneNumber
      }
      let res = await alist({ data: params })

      this.list = (res.data.records || []).map(item => ({
        ...item,
        operateTime: this.convertTime( item.operateTime),
        imgSrc: item?.imgIds?.[0] || ''
      }))
      this.announceList = JSON.parse(JSON.stringify(this.list))
    },
    convertTime (createTime) {
      let str = ''
      var timeStr = createTime + ':00';
      var yearMonthDay = timeStr.split(' ')[0];
      var month = yearMonthDay.split('-')[1];
      var day = yearMonthDay.split('-')[2];
      str = month+'月'+day+'日';
      return str;
    },
    linkTo(item) {
      this.addClickCountById(item.articleId)
      if(item.clickState == '0'){
          this.changeStatus(item)
          item.clickState = '1'
         }
      uni.navigateTo({
        url: `/pages-b/announcement/detail?articleId=${item.articleId}`
      })
    },
    async addClickCountById(articleId) {
      const params = {
        data:{
          articleId,
          userId: this.memberId
        }
      }
      await addClickCountById(params)
    },
    changeStatus(item) {
        const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = Utils.storageAction({ key: O_USER_INFO, action: 'get' });
            let params = {
                data: {
                    phone:phoneNumber,
                    relationPush:"1",  //关联推送1-通知公告，2-问卷调查，3-活动，4-群发通知
                    relationPushId:item.articleId  //关联推送ID
                },
                hideLoading: true
            }
            changeUpdateStatus(params).then(res => {
                if (res.status == '200') {
                  console.log(144,res,'已阅')
                }else {
                  console.log(109,res)
                }
            })

        }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  // padding: 20px 15px 0;
  background-color: #f5f5f5;
  box-sizing: border-box;
}
.card-panel-list{
  padding: 0 30rpx;
}
.card-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 20rpx 20rpx 0 0;
  margin-bottom: 30rpx;
  overflow: hidden;
  background-color: #fff;

  // .u-loading-icon {
  //   background-image: url("@/static/theme-default/activity/small-photo.png") !important;

  // }
}
.card-tag {
  position: absolute;
  top: 0;
  right: 10px;
  display: inline-block;
  z-index: 10;
  font-size: 12px;
  background-color: var(--app-primary-color);
  color: #fff;
  padding: 0 5px;
  line-height: 20px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.card-content {
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}
.u-text {
  word-break: break-all;
}
.btn-box{
  display: inline-block;
  padding: 6rpx 14rpx;
  border-radius: 24rpx;
  border: 1px solid var(--app-primary-color);
  color: var(--app-primary-color);
  font-size: 26rpx;
}
.nodata {
    height: calc(100vh - 60rpx);
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
.btn-box-icon{
	border: none;
	color: red;
}
.itemImage {
  overflow: hidden;
  
}

.itemImage ::v-deep .u-image__loading {
  background-color: rgb(240, 240, 240) !important;
}

.page-panel ::v-deep .u-tabs__wrapper__nav__line{
  width: 50rpx !important;
  height: 18rpx !important;
}
</style>