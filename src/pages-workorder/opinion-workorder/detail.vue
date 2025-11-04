<!--  -->
<template>
    <view class='page' :style="[THEME_CSS_VAR]">
        <view class="page-box" :style="{ height: getTypeStyle.id == 0 || getTypeStyle.id == 1 ? 'calc(100% - 80rpx)' : '100%' }">
            <view class="content">
                <view class="item-title">
                    <view class="item-caption">{{ taskDetail.quesDesc }}</view>
                    <view class="item-status" :style="[{ color: getTypeStyle.color }]">{{ taskDetail.quseTaskState }}</view>
                </view>
                <view class="item-tag">
                    <view class="tags">{{ taskDetail.biProblemCategory }}</view>

                </view>
                <view class="item-addr">
                    {{ taskDetail.projectName }} | {{ taskDetail.startDate }}
                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
            <view class="progress">
                <view class="progress-title">工单进度</view>
                <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>
                <view v-for="i in 3" :key="i" class="progress-content">
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">跟进编码:</text>
                            <text class="pc-val">YB2135435884786</text>
                        </view>
                        <view class="pc-Status">已完结</view>
                    </view>
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">跟进人:</text>
                            <text class="pc-name-val">谢霉霉</text>
                        </view>
                    </view>
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">跟进时间:</text>
                            <text class="pc-name">2023-01-23 13:09</text>
                        </view>
                    </view>
                    <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>
                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
            <view class="log">
                <view class="log-title">操作记录</view>
                <view class="log-steps">
                    <u-steps current="0" dot direction="column">
                        <u-steps-item v-for="(item, index) in logList" :key="index">
                            <view slot="desc">
                                <view class="logLeft">
                                    <view class="logcell1">{{ item.status }}</view>
                                    <view class="logcell2">{{ item.time }}</view>
                                </view>
                                <view>
                                    <view class="logcell1">{{ item.name }}</view>
                                    <view class="logcell2">编码：{{ item.bm }}</view>
                                </view>

                            </view>
                        </u-steps-item>
                    </u-steps>

                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
        </view>
        <view class="page-footer" v-if="getTypeStyle.id == 0 || getTypeStyle.id == 1">
            <view v-if="getTypeStyle.id == 1">
              <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/add.png`)" />
              <text>创建工单</text>
            </view>
            <view v-if="getTypeStyle.id == 1" @click="reportShow = true">
              <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/progress.png`)" />
              <text>汇报进展</text>
            </view>
            <view v-if="getTypeStyle.id == 0">
              <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/add.png`)" />
              <text>预警处理</text>
            </view>
            <view v-if="getTypeStyle.id == 0 || getTypeStyle.id == 1" @click="closeShow = true">
              <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/close.png`)" />
              <text>关闭预警</text>
            </view>
        </view>

      <!-- 关闭预警 -->
      <u-modal :show="closeShow" content="确认关闭预警" showCancelButton @confirm="closeShow = false" @cancel="closeShow = false" />
      <!-- 汇报进展 -->
      <opinion-model :show.sync="reportShow" />
    </view>
</template>

<script>
import OpinionModel from '@/pages/modules/opinion-model.vue'
import { findQuestionTaskList } from '@/service/landcrm'

export default {
    components: {
      OpinionModel
    },
    data() {
        return {
            value1: 0,
            logList: [{
                name: '谢霉霉',
                bm: 'YB86768837457',
                status: '已完结',
                time: '02-06 17:34'
            }, {
                name: '周翡',
                bm: 'YB86768837457',
                status: '处理工单',
                time: '02-06 17:34'
            }, {
                name: '谢允',
                bm: 'YB86768837457',
                status: '确认工单',
                time: '02-06 17:34'
            }, {
                name: '谢允',
                bm: 'YB86768837457',
                status: '生成工单',
                time: '02-06 17:34'
            }],
          quesTaskCode: '',
          taskDetail: {},
          closeShow: false,
          reportShow: false
        };
    },
    computed: {
      getTypeStyle() {
        switch (this.taskDetail.quseTaskState) {
          case '待确认':
            return {
              color: '#FA6400',
              id: 0
            }
          case '处理中':
            return {
              color: '#2761FF',
              id: 1
            }
          case '已关闭':
            return {
              color: '#33BA73',
              id: 2
            }
          default:
            return {
              color: '#33BA73',
              id: -1
            }
        }
      }
    },
    async onLoad(options) {
      this.quesTaskCode = options.quesTaskCode || ''
      await this.getTaskDetail()
      this.handleLog()
    },
    methods: {
      async getTaskDetail() {
        if (!this.quesTaskCode) return
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        const params = {
          data: {
            userId: userInfo.userId,
            quesTaskCode: this.quesTaskCode
          },
          hideLoading: true
        }
        const res = await findQuestionTaskList(params)
        this.taskDetail = (res.data??[])[0]??{}
      },
      // 操作记录
      handleLog() {
        let oldList = this.logList
        const type = this.getTypeStyle.id
        if (type == 0) {
          this.logList = oldList.slice(3, 4)
        } else if (type == 1) {
          this.logList = oldList.slice(1, 4)
        } else if (type == 2) {
          this.logList = oldList.slice(0, 4)
        }
      }
    },
}
</script>
<style scoped lang="scss">
.page {
    box-sizing: border-box;
    background-color: #F3F4F7;
    width: 100%;
    height: 100%;
    padding: 24rpx 0;
}

.page-box {
    height: calc(100% - 80rpx);
    overflow: auto;
    margin: 0 20rpx;
}

.content {
    background: #FFFFFF;
    border-radius: 12rpx;

    .item-title {
        display: flex;
        padding: 24rpx 30rpx;
        justify-content: space-between;



        .item-caption {
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #222222;
        }

        .item-status {
            font-size: 28rpx;
            color: #33BA73;
            width: 20%;
            padding-top: 2px;
            text-align: right;
        }
    }

    .item-content {
        padding: 12rpx 30rpx;

        font-size: 30rpx;
        font-weight: bold;
        color: #222222;
    }

    .item-tag {
        padding: 12rpx 30rpx;

        display: flex;

        .tags {
            font-size: 22rpx;
            color: #2761FF;
            margin: 0 10rpx 0 0;
            padding: 10rpx;
            text-align: center;
            background: rgba(39, 97, 255, 0.1);
            border-radius: 4rpx;
        }

    }

    .item-addr {
        padding: 24rpx 30rpx;
        font-size: 24rpx;
        color: #999999;

    }
}

.progress {
    background: #FFFFFF;
    border-radius: 12rpx;

    .progress-title {
        padding: 24rpx 30rpx;
    }

    .progress-content {
        .pc-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10rpx 30rpx;
            font-size: 26rpx;
            // height: 38px;

            .pc-name {
                color: #333333;
                margin-right: 10rpx;
            }

            .pc-val {
                color: #2761FF;
            }
            .pc-name-val {
                color: #333333;
            }

            .pc-Status {
                color: #33BA73;

            }
        }
    }
}

.log {
    background: #FFFFFF;
    border-radius: 12rpx;
    padding: 24rpx 30rpx;

    .log-title {
        font-size: 30rpx;
        font-weight: bold;
        line-height: 60rpx;
        color: #333333;
    }
}

.logLeft {
    position: absolute;
    left: -80px;
    text-align: center;
}

.logcell1 {
    font-size: 26rpx;
    color: #333333;
    padding: 16rpx 0;
}

.logcell2 {

    font-size: 24rpx;
    color: #999999;
}

.log-steps {
    margin-left: 80px;
}

.page-footer {
    color: #2761FF;
    height: 100rpx;
    line-height: 100rpx;
    flex: 0 0 100rpx;
    background-color: #FFFFFF;
    font-size: 30rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .footer-img {
        height: 32rpx;
        width: 32rpx;
        margin: 0 10rpx 0 0;
    }

    view {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 65%;
    }

    .view-border {
        border-left: 1px solid #F3F4F7;
        border-left: 1px solid #F3F4F7;
    }

}</style>