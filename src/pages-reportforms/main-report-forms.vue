<template>
  <view class="report-page">
    <view class="top-box">
      <view class="top-cont">
        <title-info-box :titleInfo='titleInfo'></title-info-box>
        <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        <view class="nav-list">
          <u-tabs :list="showTabs" :scrollable="false" :current="tabsl.current1" :itemStyle="{ height: '88rpx' }"
            :inactiveStyle="{ color: '#666666', fontSize: '26rpx' }"
            :activeStyle="{ color: '#2761FF', fontSize: '26rpx' }" @click="change"></u-tabs>

        </view>
      </view>
    </view>
    <scroll-view class="scrollContent" :enhanced="true" :bounces="false" @scroll="onScroll" scroll-y="true" :scroll-into-view="intoView"
      scroll-with-animation="true">
      <view class="chart-item" v-for="(item, i) in modulesData" :key="i" :id="'box' + item.canvasId">
        <data-chart-box :reportType="reportType" :title="item.title" :chartTitle="item.chartTitle" :canvasId="item.canvasId"
          :itemList="item.itemList" :optionData="item.optionData" :optsType="item.optsType"
          @jumpDetail="jumpDetail"></data-chart-box>
        <u-gap height="10" bg-color="#F3F4F7"></u-gap>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import titleBox from './modules/title-box.vue'
import titleInfoBox from './modules/title-info-box.vue'
import uchartBox from './modules/uchart-box.vue'
import dataChartBox from './modules/data-chart-box.vue'
import {
  operationsLogWorkOrder,
  operationsLogComprehensivePatrol,
  operationsLogDevicePatrol,
  operationsLogCharge,
  updatePushLogRead
} from '@/service/datawarehouse'
export default {
  components: {
    titleBox,
    titleInfoBox,
    uchartBox,
    dataChartBox
  },
  data() {
    return {
      intoView: '',
      isScroll:true,
      distanceArr: [],
      tabsl: {
        current1: 0
      },
      reportType: false,
      showTabs:[],
      listTabs: [
        { name: '工单', id: 'boxorderSituation',index:0 },
        { name: '综合巡检', id: 'boxcomprehensivePatrol' ,index:1},
        { name: '设备巡检', id: 'boxdevicePatrol',index:2 },
        { name: '收费', id: 'boxcharge',index:3 }],
      titleInfo: {
        name: '',
        time: '',
      },
      modulesData: [],
      modulesDataBase: [
        {          
          tabName:'工单',
          title: '工单情况',
          chartTitle: '工单趋势图',
          canvasId: 'orderSituation',
          optsType: 'line',
          itemList: [
            { label: '新下单数', value: 0 },
            { label: '总下单数', value: 0 },
            { label: '工单完成率', value: '0.00%' },
            { label: '工单关闭率', value: '0.00%' },
          ],
          optionData: {
            categories: [],
            xAxis: {
              fontSize: 10,
            },
            series: [
              {
                name: "工单完成率",
                data: [],
              },
              {
                name: "工单关闭率",
                data: [],
              }
            ]
          }
        },
        {          
          tabName:'综合巡检',
          title: '综合巡检',
          chartTitle: '综合巡检趋势图',
          canvasId: 'comprehensivePatrol',
          optsType: 'mix',
          itemList: [
            { label: '总任务数', value: 0 },
            { label: '任务完成数', value: 0 },
            { label: '任务完成率', value: '0.00%' },
            { label: '过期任务数', value: 0 },
          ],
          optionData: {
            categories: [],
            series: [
              {
                name: "任务完成数",
                index: 1,
                color: "#2761FF",
                type: "column",
                data: [],
              },
              {
                name: "任务完成率",
                type: "line",
                color: "#FA6400",
                addPoint: true,
                data: []
              },
            ]
          }
        },
        {
          tabName:'设备巡检',
          title: '设备巡检',
          chartTitle: '设备巡检趋势图',
          canvasId: 'devicePatrol',
          optsType: 'mix',
          itemList: [
            { label: '总任务数', value: 0 },
            { label: '任务完成数', value: 0 },
            { label: '任务完成率', value: '0.00%' },
            { label: '过期任务数', value: 0 },
          ],
          optionData: {
            categories: [],
            series: [
              {
                name: "任务完成数",
                index: 1,
                color: "#2761FF",
                type: "column",
                data: [],
              },
              {
                name: "任务完成率",
                type: "line",
                color: "#FA6400",
                addPoint: true,
                data: []
              },
            ]
          }
        },
        {
          tabName:'收费',
          title: '收费',
          chartTitle: '收费趋势图',
          canvasId: 'charge',
          optsType: 'line',
          itemList: [
            { label: '收费记录数', value: 0 },
          ],
          optionData: {
            categories: [],
            series: [
              {
                name: "收费记录数",
                data: [],
              }
            ]
          }
        }
      ],
      modulesDataYear: [
        {
          tabName:'工单',
          title: '工单情况',
          chartTitle: '工单趋势图',
          canvasId: 'orderSituation',
          optsType: 'column',
          itemList: [
            { label: '新下单数', value: 0 },
            { label: '总下单数', value: 0 },
            { label: '工单完成率', value: '0.00%' },
            { label: '工单关闭率', value: '0.00%' },
          ],
          optionData: {
            categories: ['工单完成率', '工单关闭率'],
            series: []
          }
        },
        {
          tabName:'综合巡检',
          title: '综合巡检',
          chartTitle: '综合巡检趋势图',
          canvasId: 'comprehensivePatrol',
          optsType: 'column',
          itemList: [
            { label: '总任务数', value: 0 },
            { label: '任务完成数', value: 0 },
            { label: '任务完成率', value: '0.00%' },
            { label: '过期任务数', value: 0 },
          ],
          optionData: {
            categories: ['任务完成数', '任务完成率'],
            series: []
          }
        },
        { 
          tabName:'设备巡检',
          title: '设备巡检',
          chartTitle: '设备巡检趋势图',
          canvasId: 'devicePatrol',
          optsType: 'column',
          itemList: [
            { label: '总任务数', value: 0 },
            { label: '任务完成数', value: 0 },
            { label: '任务完成率', value: '0.00%' },
            { label: '过期任务数', value: 0 },
          ],
          optionData: {
            categories: ['任务完成数', '任务完成率'],
            series: []
          }
        },
        {  
          tabName:'收费',
          title: '收费',
          chartTitle: '收费趋势图',
          canvasId: 'charge',
          optsType: 'column',
          itemList: [
            { label: '收费记录数', value: 0 },
          ],
          optionData: {
            categories: ['收费记录数'],
            series: []
          }
        }
      ],
      //接口参数
      params: {
        data: {
          diaryId: 5 //1,2,3,4,5 对应着日 周  月 季  年
        }
      },
      showTabName:'',
    }
  },

  onLoad(option) {
    this.modulesData = this.modulesDataBase //初始化默认值
    this.titleInfo.time = option.statisticDate
    this.params.data.diaryId = option.pushLogId
    this.getOrder()
    this.comprehensivePatrol()
    this.devicePatrol()
    this.charge()
    this.updatePushLogRead() //标记已读
  },

  methods: {
    // 监听页面滚动
    onScroll(event) {
       var that = this;
      if (this.isScroll) {
      let mapList = new Map();;
      let ids = this.listTabs;
      ids.map((element) => { 
        const query = uni.createSelectorQuery().in(that);
         query.select('#'+element.id).boundingClientRect(data => {
           mapList[element.id] = { id: element.id,index:element.index, top: data.top - 140 };
         }).exec();
      });
      
      setTimeout(() => {
        let list = [];
         for (var key in mapList) {
          list.push(mapList[key])
        }
        that.distanceArr = list;
        that.$nextTick(() => {
          let x = 0;
          var arr = that.distanceArr;
          let s = arr.sort((a, b) => Math.abs(x - a.top) - Math.abs(x - b.top));
          
          if (s && s.length > 0) {
             that.$set(this.tabsl, 'current1', s[0].index);
          }
        })
      }, 100);

      }
    },
    change(item) {
      this.isScroll = false;
      // if (this.current === 0) {
      //   this.intoView = `content${item.id}`
      // } else {
      //   this.intoView = item.id;
      // }
      this.intoView = item.id;
      this.$nextTick(() => {
        setTimeout(() => {
          this.isScroll = true;
        }, 2000)
      })

    },
    updatePushLogRead(){
      let params = {
        data:{
          pushLogId:this.params.data.diaryId
        }
      }
      updatePushLogRead(params).then(res=>{})
    },
    //获取工单情况
    getOrder() {
      operationsLogWorkOrder(this.params).then(res => {
        if (res.status == '200') {
          let list = ['newTaskNum', 'taskTotalNum', 'complateRate', 'closedRate'] //该顺序需和this.modulesData.itemList数组对应
          this.dealData('orderSituation', res.data, list, 'complateRate', 'closedRate');

        }
      })
    },

    //获取综合巡检
    comprehensivePatrol() {
      operationsLogComprehensivePatrol(this.params).then(res => {
        if (res.status == '200') {
          let list = ['ruleTaskCount', 'finishNum', 'finishRate', 'outFinishNum']
          this.dealData('comprehensivePatrol', res.data, list, 'finishNum', 'finishRate')
        }
      })
    },

    //获取设备巡检
    devicePatrol() {
      operationsLogDevicePatrol(this.params).then(res => {
        if (res.status == '200') {
          let list = ['ruleTaskCount', 'finishNum', 'finishRate', 'outFinishNum']
          this.dealData('devicePatrol', res.data, list, 'finishNum', 'finishRate')
        }
      })
    },

    //获取收费
    charge() {
      operationsLogCharge(this.params).then(res => {
        if (res.status == '200') {
          let list = ['recordsCount']
          this.dealData('charge', res.data, list, 'recordsCount', '')
        }
      })
    },

    //返回的数据处理
    dealData(id, data, list, name1, name2) {
      let numList = []
      list.forEach(item => {
        numList.push(data[item])
      });
      let subscribeContentName = data.subscribeContentName.split(',');
      this.showTabs = this.listTabs.filter(item => subscribeContentName.includes(item.name) ).map((m,index)=>{
        return {
          ...m,
          index:index
        }
      }) ;
      this.showTabName = subscribeContentName;
      let xList = []
      let yList = []
      let yList2 = [];
       data.list.forEach(item => {
        this.titleInfo.name = data.businessTypeName;
        switch (data.businessTypeName) {
          case '日报':
            this.reportType = '1';           
            xList.push(this.countDate(item.totalStartDate));
            break;
          case '周报':
          this.reportType = '2';
            xList.push(this.countWeek(item.totalStartDate))
            break;
          case '月报':
          this.reportType = '3';
            xList.push(this.countMonth(item.totalStartDate))
            break;
          case '季报':
            this.reportType = '4';
            xList.push(this.countQuarter(item.totalEndDate))
            break;
        }
        if (name1) {
          yList.push(item[name1])
        }
        if (name2) {
          yList2.push(item[name2])
        }
      })
      let modulesData = data.businessTypeName == '年报' ? this.modulesDataYear.filter(item => subscribeContentName.includes(item.tabName)) : this.modulesDataBase.filter(item => subscribeContentName.includes(item.tabName))
       modulesData.forEach(item => {
        if (item.canvasId == id) {
          //图表上方总数
          item.itemList.forEach((v, i) => {
            v.value = numList[i]
          })

          //图标横纵坐标赋值
          if (data.businessTypeName == '年报') {
            // 年度报告
            let series = []
            data.list.forEach(v => {
              series.push({
                name: v.totalEndDate.split('-')[0],
                data: name2 ? [v[name1], v[name2]] : [v[name1]]
              })
            })
            console.log('modulesData', modulesData)
            console.log('item.optionData', item.optionData)
            item.optionData.series = series
          } else {
            let optionData = JSON.parse(JSON.stringify(item.optionData))
            optionData.categories = xList
            optionData.series[0].data = yList
            if (yList2.length > 0) optionData.series[1].data = yList2

            item.optionData = optionData
          }
        }
      })

      this.modulesData = modulesData
    },

    jumpDetail(code) {
       uni.navigateTo({ url: `/pages-reportforms/log/OperationLog?diaryId=${this.params.data.diaryId}&time=${this.titleInfo.time}&name=${this.titleInfo.name}&code=${code}&showTabName=${this.showTabName}` })
    },

    // 计算日期--日报
    countDate(date) {
      let str = date.split(' ')[0].split('-')[2]
      return str
    },
    countWeek(date = '') {
      const [ymd] = date.split(' ')
      const getMonthDays = (ymd) => {
        const today = new Date(ymd);
        const year = today.getFullYear();
        const month = today.getMonth();
        const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
        const daysInMonth = getDaysInMonth(year, month);

        const dates = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          dates.push(formattedDate);
        }

        return dates;
      };
      
      const weekCount = [];
      const monthDays = getMonthDays(ymd);
      const currentDate = new Date(ymd);
      let index = -1;
      let weekIndex = '';

      monthDays.forEach((dateStr, i) => {
        const empty = weekCount.length == 0;
        const date = new Date(dateStr);
        if (date.getDay() === 1 || empty) {
          index++;
          weekCount[index] = [dateStr];
        } else {
          weekCount[index].push(dateStr);
        }
      });

      weekCount.some((week, i) => {
        let isBreak = false;
        week.some((dateStr) => {
          const eachDate = new Date(dateStr);
          const sameYear = currentDate.getFullYear() == eachDate.getFullYear();
          const sameMonth = currentDate.getMonth() == eachDate.getMonth();
          const sameDay = currentDate.getDate() == eachDate.getDate();
          const sameYmd = sameYear && sameMonth && sameDay;
          if (sameYmd) {
            const m = eachDate.getMonth();
            const isAWeek = weekCount[0].length == 7;
            isBreak = true;
            if (i == 0) {
              weekIndex = `${isAWeek ? m + 1 : m == 0 ? 12 : String(m).padStart(2, '0')}月(${isAWeek ? 1 : 4})周`;
            } else {
              const mstr = String(m + 1).padStart(2, '0');
              weekIndex = `${mstr}月(${ isAWeek ? i + 1 : i})周`;
            }
          }
          return isBreak;
        });
        return isBreak
      });
      return weekIndex;
    },
    // 计算日期--周报  
    countWeek1(date) {
      let str = date.split(' ')[0].split('-')[2];
      let mon = date.split(' ')[0].split('-')[1];
       // 获取当月第几周 当前日期/7 有余数+1
      // var pages=parseInt(str)%7==0?(parseInt(str)/7):(Math.floor(parseInt(str)/7)+1);  
      // console.log(mon+'月',pages)
       // 创建一个Date对象表示当前日期
      let d = date.replaceAll('-','/')
      var currentDate = new Date(d); 
      // 获取当前的月份和星期几
      var month = currentDate.getMonth();
      var dayOfWeek = currentDate.getDay();

      // 获取当前的日期和年份
      var date = currentDate.getDate();
      var year = currentDate.getFullYear();

      // 创建一个新的Date对象设置为当月的1号
      var firstDayOfMonth = new Date(year, month, 1);

      // 获取1号是星期几
      var firstDayOfWeek = firstDayOfMonth.getDay();

      // 计算当前日期是第几个星期
      var weekNumber = Math.ceil((date + firstDayOfWeek) / 7);
      console.log("当前日期：" + date);
      console.log("当前月份：" + (month + 1));
      console.log("当前年份：" + year);
      console.log("当前星期：" + dayOfWeek);
      console.log("当前日期是第" + weekNumber + "个星期");

      return `${mon}月(${weekNumber}周)`
    },
    // 计算日期--月报
    countMonth(date) {
      let str = date.split('-')[1]
      return str
    },
    // 计算日期--季报
    countQuarter(date) {
      let num = date.split('-')[1]
      let list = ['一', '二', '三', '四']
      let str = `第${list[num / 3 - 1]}季度`
      return str
    },
  }
}
</script>
<style lang="scss" scoped>
.report-page {
  min-height: 100vh;
  background-color: #F9F9F9;
  padding: 292rpx 20rpx 24rpx;
  box-sizing: border-box;
}

.top-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  padding: 24rpx 20rpx 0;
  box-sizing: border-box;
  background-color: #F9F9F9;
}

.nav-list {
  height: 88rpx;
  background-color: #fff;
  border-bottom: 1px solid #EBEBEB;
  // .nav-item{
  //   width: 25%;
  //   float: left;
  //   text-align: center;
  //   line-height: 88rpx;;
  // }
}

.scrollContent {
    overflow: auto;
    height: calc(100vh - 300rpx);
 
} 
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

</style>
