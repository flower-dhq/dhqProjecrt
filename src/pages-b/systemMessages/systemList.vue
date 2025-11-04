
<style lang="scss" scoped>
.ykodList {
    height: calc(100vh - 220px);
    background: #F5F5F5;
    padding: 20rpx 0 40rpx 0;
}
.ykodList2 {
    height: 100vh ;
    padding: 20rpx 20rpx;
    background-color: #f7f7f7;
    box-sizing: border-box;

}

.nodata {
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

.messages_list_container {
  padding: 12px 0px 0px 0px;
  background: #ffffff;
    margin-bottom: 10px;
    border-radius: 8px;
    font-family: PingFang SC;
}
.message_type {
  font-size: 12px;
  color: #000000;
  word-break: break-all;
  padding: 0 15px;
}

.click_detail {
  font-size: 12px;
  color: #000000;
  line-height: 30px;
  word-break: break-all;
}
.message-content {
  width: 100%;
  font-size: 12px;
  color: #000000;
  padding: 0px 15px 10px 15px;
  word-wrap: word-break;
  word-break: break-all;
	overflow: hidden;				//溢出内容隐藏
	text-overflow: ellipsis;		//文本溢出部分用省略号表示
	display: -webkit-box;			//特别显示模式
	-webkit-line-clamp: 2;			//行数
	line-clamp: 2;
  -webkit-box-orient: vertical;
  box-sizing: border-box;
}
.message_detail {
  width: 100%;
  padding: 8px 15px 10px 15px;
  color: #999999;
  font-size: 11px;
}
</style>
<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]"> 
         <scroll-view :class="[showTopImg?'ykodList':'ykodList2',shopNodata?'':'nodata']" scroll-y="true" @scrolltolower="scrolltolower">
            <view v-for="(item, index) in myMessagesLists" :key="index">
                  <div class="messages_list_container" style="position: relative;" >
                    <div style="border-bottom:1px solid #D9DCE7;">
                      <view v-show=" item.clickState == '0' " style="width: 8px;height: 8px;background: #FF2300;border-radius: 50%;position: absolute;right: 30rpx;top: 24rpx;" ></view>
                      <div class="message_type">消息通知</div>
                      <div class="message_detail">{{ item.pushDate }}</div>
                      <div class="message-content">{{ item.textTitle }}</div>
                    </div>
                    <div style="display: flex;justify-content: space-between;padding: 10px 15px;align-items: baseline;"  @click="turnToMessageDetail(item)">
                      <div class="click_detail">查看详情</div>
                      <u-icon name="arrow-right" size="15" color="#363636"></u-icon>

                    </div>
                  </div>
            </view>
            <u-divider style="margin: 15px 40px;" v-if="page===pageIndex && shopNodata" text="已无其他内容"></u-divider>

        </scroll-view>
     </view>
</template>

<script>
import {  changeUpdateStatus ,getMasspushList } from '../../service/wxmanage'
import util from '../../js/utils'
import appConfig from '@/app-config';
export default {
    data() {
        return {
            current: 0,
            isimage: false,
            myMessagesList: [],
            pageSize: 15,
            pageIndex: 1,
            areaId: '',
            projectId: '',
            page: 1,//总页数
            myMessagesLists:[]
        }
    },
    onLoad() {
        const { AREA_ID, PROJECT_ID} = this.$constant;
        this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
        this.getMasspushLists();
    },
    computed: {
        "shopNodata"(){
            console.log('11',this.myMessagesList.length>0)
            return this.myMessagesList.length>0
        }
    },
    methods: {
         //推阅
         changeUpdateStatus(item) {
        const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            let params = {
                data: {
                    phone:phoneNumber,
                    relationPush:"3",  //关联推送1-通知公告，2-问卷调查，3-活动，4-群发通知
                    relationPushId:item.id //关联推送ID
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

        },
        scrolltolower() {
            if (this.pageIndex < this.page) {
                this.pageIndex++;
                this.getMasspushLists()

            }

        },
        getMasspushLists() {
            let that = this;
            const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    areaId: that.areaId,
                    auditStatus: "",
                    current: that.pageIndex,
                    endDate: "",
                    projectId: that.projectId,
                    scope: "",
                    size: that.pageSize,
                    startDate: "",
                    phone:phoneNumber,
                    pushStatus:"1"
                },
                "hideLoading": true
            }
            getMasspushList(params).then(res => {
                if (res.status == 200) {
                    if (that.pageIndex == 1) {
                        that.myMessagesList = res.data.list;
                    } else {
                        that.myMessagesList = that.myMessagesList.concat(res.data.list)
                    }
                    // for (let i = 0; i < res.data.list.length; i++) {
                    //   if(res.data.list[i].pushDate){
                    //     res.data.list[i].pushDate = that.formatDuring(parseInt(res.data.list[i].pushDate)) || ''
                    //     console.log(194, res.data.list[i].pushDate)
                    //   }
                    // }
                    that.page = res.data.pages
                    that.myMessagesLists = JSON.parse(JSON.stringify(that.myMessagesList))
                }

            })
        },
        getDateDiff(setdateTimeStamp) {
            let minute = 1000 * 60;
            let hour = minute * 60;
            let day = hour * 24;

            let dateTimeStamp = new Date(setdateTimeStamp.replace(/-/g, "/"));
            let now = new Date().getTime();
            let diffValue = now - dateTimeStamp;
            if (diffValue < 0) {
                //若日期不符则弹出窗口告之
                return "结束日期不能小于开始日期！";
            }
            let dayC = diffValue / day;
            let hourC = diffValue / hour;
            let minC = diffValue / minute;
            let result = '';
            let checkDate = (date) => {
                return date < 10 ? '0' + date : date
            }
            if (dayC >= 1) {
                // result=(dateTimeStamp.getMonth()+1)+'-'+dateTimeStamp.getDate();
                result = dateTimeStamp.getFullYear() + '-' + checkDate(dateTimeStamp.getMonth() + 1) + '-' + checkDate(dateTimeStamp.getDate());
            }
            else if (hourC >= 1) {
                result = parseInt(hourC) + "个小时前";
            }
            else if (minC >= 1) {
                result = parseInt(minC) + "分钟前";
            } else {
                result = "刚刚发表";
            }
            return result;
        },
  
      
        turnToMessageDetail(item) {
      let self = this;
      if(item.clickState == '0'){
          this.changeUpdateStatus(item)
          item.clickState = '1'
      }
      if(item.msgtype === 1){
        // uni.navigateTo({ url: '/pages-b/systemMessages/systemDetail?para=' + encodeURIComponent(JSON.stringify(item))});
        uni.navigateTo({ url: '/pages-b/systemMessages/systemDetail?id=' + item.id});

      }else {
        if(item.href!=undefined&&item.href!=''){
          // const { DOMAIN_PRO } = appConfig;
          // let returnUrl = DOMAIN_PRO + `${item.href}`
          // uni.navigateTo({
          //             url: `/pages-d/webview/webview?url=${returnUrl}`
          //           })
          uni.navigateTo({
             url: `/pages-b/systemMessages/systemNewDetail?articleId=${item.msgid}&param=${item}`
          })
        }else {
        uni.navigateTo({ url: '/pages-b/systemMessages/systemDetail?id=' + item.id});
        }
      }
    },
    add0(m){ // 将后台毫秒转换成时间和日期;
        return m < 10 ? '0' + m : m;
      },
      formatDuring(date){  // 将后台毫秒转换成时间和日期;
        let time = new Date(date);
        let y = time.getFullYear();
        let m = time.getMonth()+1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm)+ ':' + this.add0(s);
      },
      changeUpdateStatus(item){
        const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        let params={
          data:{
            phone:phoneNumber,
            relationPush:"4",  //关联推送1-通知公告，2-问卷调查，3-活动，4-群发通知
            relationPushId:item.id  //关联推送ID
          }
          
        };
        return new Promise(resolve => {
          changeUpdateStatus(params).then(res =>{
            if(res.status == "200"){
              console.log(144,res)
              resolve()
            }else{
              console.log(147,'res')
              resolve({})
            }
          })
        })
    },
    }
}
</script>
 