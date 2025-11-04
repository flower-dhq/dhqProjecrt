<template>
  <view class="index" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]" style="height: 100%">
    <view class="main-page">
      <view class="header-panel">
        <!-- 任务描述，工单状态 -->
        <cell-text customClass="auto-width header-title" :label="basicInfo.taskDesc" border="none" padding="0 0 8px">{{ basicInfo.taskStateName }}</cell-text>
        <view class="header-tag">
          <view class="header-tag-left">
            <yb-tag v-if="basicInfo.taskSubTypeName" :text="basicInfo.taskSubTypeName" size="mini" plain plainFill type="primary" customStyle="border-color: rgba(0,0,0,0); margin-right: 10rpx;" />
            <yb-tag v-if="basicInfo.emergencyLevel" :text="basicInfo.emergencyLevelName" size="mini" plain plainFill :type="basicInfo.emergencyLevel == 'emergency' ? 'error' : 'warning'" customStyle="border-color: rgba(0,0,0,0);" />
          </view>
        <view class="header-tag-right">
          <yb-tag v-if="!!getChildStateText" :text="getChildStateText" size="mini" type="error" customStyle="background-color: #E71E1E;border-color: #E71E1E;" />
        </view>
        </view>
        <cell-text customStyle="font-size: 28rpx;" labelWidth="0" border="none" padding="16rpx 0 0">{{ basicInfo.location }}</cell-text>
        <view class="desc-tag-panel" v-if="!show">
          <u--text prefixIcon="phone" text="联系反馈人" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="callPhone" />
          <u--text :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" text="发起会话" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="openChat" />
          <u--text v-if="isShareBtn || isDev" prefixIcon="share-square" text="分享" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="handleShare" />
        </view>
      </view>

      <view class="main-box">
        <view class="white-box content">
          <template v-if="commonFieldInfo.keys.includes('areaName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['areaName'].name }}：</view>
              <view class="dd">{{ basicInfo.areaName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('projectName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['projectName'].name }}：</view>
              <view class="dd">{{ basicInfo.projectName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('orignSource')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['orignSource'].name }}：</view>
              <view class="dd">{{ basicInfo.orignSourceName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('contactName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['contactName'].name }}：</view>
              <view class="dd">{{ basicInfo.contactName || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('contactPhone')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['contactPhone'].name }}：</view>
              <view class="dd dtel" @click="dialTel(basicInfo.contactPhone)">{{ basicInfo.contactPhone }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('ownerName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['ownerName'].name }}：</view>
              <view class="dd">{{ basicInfo.ownerName || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('taskCode')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['taskCode'].name }}：</view>
              <view class="dd">{{ basicInfo.taskCode }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('taskState')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['taskState'].name }}：</view>
              <view class="dd">{{ basicInfo.taskStateName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('taskSubTypeName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['taskSubTypeName'].name }}：</view>
              <view class="dd">{{ basicInfo.taskSubTypeName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('location')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['location'].name }}：</view>
              <view class="dd">{{ basicInfo.location || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('taskSource')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['taskSource'].name }}：</view>
              <view class="dd">{{ basicInfo.taskSourceName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('emergencyLevelName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['emergencyLevelName'].name }}：</view>
              <view class="dd">{{ basicInfo.emergencyLevelName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('appointmentDate')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['appointmentDate'].name }}：</view>
              <view class="dd">{{ basicInfo.appointmentDate }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('orignUserName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['orignUserName'].name }}：</view>
              <view class="dd">{{ basicInfo.orignUserName || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('followUserName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['followUserName'].name }}：</view>
              <view class="dd">
                {{ followUserName }}
                <text class="dd-more" v-if="showMoreFollowUsers" @click="viewMoreFollowUsers">查看更多</text>
              </view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('finishUserName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['finishUserName'].name }}：</view>
              <view class="dd">{{ basicInfo.finishUserName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('approvalUserName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['approvalUserName'].name }}：</view>
              <view class="dd">{{ basicInfo.approvalUserName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('relatetask')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['relatetask'].name }}：</view>
              <view class="dd"></view>
            </view>
            <view class="relate-task-wrap">
              <view class="task-wrap" v-for="(item, index) in relateTasks" :key="index" @click="goToTask(item)">
                <uni-icons type="link" size="40rpx" color="#999999"></uni-icons>
                <view class="task-code" >{{ item.taskCode }}</view>
                <view class="task-status" >{{ item.taskState }}</view>
              </view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('visitTaskNum')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['visitTaskNum'].name }}：</view>
              <view class="dd">{{ basicInfo.visitTaskNum || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('visitTypeName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['visitTypeName'].name }}：</view>
              <view class="dd">{{ basicInfo.visitTypeName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('cancelDate')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['cancelDate'].name }}：</view>
              <view class="dd">{{ basicInfo.cancelDate }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('cancelStateName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['cancelStateName'].name }}：</view>
              <view class="dd">{{ basicInfo.cancelStateName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('cancelReason')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['cancelReason'].name }}：</view>
              <view class="dd">{{ basicInfo.cancelReason || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('pauseStateName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['pauseStateName'].name }}：</view>
              <view class="dd">{{ basicInfo.pauseStateName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('pauseDeadline')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['pauseDeadline'].name }}：</view>
              <view class="dd">{{ basicInfo.pauseDeadline }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('isPublicName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['isPublic'].name }}：</view>
              <view class="dd">{{ basicInfo.isPaidName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('payTypeName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['payType'].name }}：</view>
              <view class="dd">{{ basicInfo.payTypeName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('zhuangXiuDanHao')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['zhuangXiuDanHao'].name }}：</view>
              <view class="dd">{{ basicInfo.zhuangXiuDanHao || ''}}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('isNeedMaterialName')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['isNeedMaterial'].name }}：</view>
              <view class="dd">{{ basicInfo.isNeedMaterialName }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('taskDesc')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['taskDesc'].name }}：</view>
              <view class="dd">{{ basicInfo.taskDesc }}</view>
            </view>
          </template>
					<template v-if="commonFieldInfo.keys.includes('associatedDevice')">
					  <view class="content-li">
					    <view class="dt">{{ commonFieldInfo['associatedDevice'].name }}：</view>
					    <view class="dd">
								<span style="margin-right: 10px;" v-for="(item,index) in associatedList" :key="index">{{item.facilityName}};</span>
								<text v-if="basicInfo.taskState!=4" class="dd-more" @click="selectDevice">选择设备</text>
							</view>
					  </view>
					</template>
          <template v-if="commonFieldInfo.keys.includes('actualPrice')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['actualPrice'].name }}：</view>
              <view class="dd">{{ basicInfo.actualPrice || '' }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('jiashiDate')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['jiashiDate'].name }}：</view>
              <view class="dd">{{ basicInfo.jiashiDate }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('jiashiMoney')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['jiashiMoney'].name }}：</view>
              <view class="dd">{{ basicInfo.jiashiMoney }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('jiashiOriginalTime')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['jiashiOriginalTime'].name }}：</view>
              <view class="dd">{{ basicInfo.jiashiOriginalTime }}</view>
            </view>
          </template>
          <template v-if="commonFieldInfo.keys.includes('jiashiRealityTime')">
            <view class="content-li">
              <view class="dt">{{ commonFieldInfo['jiashiRealityTime'].name }}：</view>
              <view class="dd">{{ basicInfo.jiashiRealityTime }}</view>
            </view>
          </template>

          <!-- 自定义字段 -->
          <u-collapse v-if="customFieldsData.length" :value="activeNames" accordion @change="onCollapseChange">
            <template v-for="(item, index) in customFieldsData">
              <view v-if="item.rule && item.rule.length">
                <u-collapse-item :title="item.groupName" :name="index">
                    <text slot="value" style="font-size: 13px;">{{ index === activeNames  ? '收起' : '展开'}}</text>
                    <view class="content-li" v-for="(rule, i) in item.rule" :key="i">
                      <view class="dt">{{ rule.title }}：</view>
                      <view class="line_files" v-if="rule.type == 'upload' && customInfo[rule.field]">
                        <template v-for="(item1, index1) in formatFile2(customInfo[rule.field],'img') " >
                          <image v-if="item1.type == 'img'"  :key="index1" class="line-img" @click="previewImg(item1.path)" :src="item1.path"></image>
                        </template>
                        <template v-for="(item1, index1) in formatFile2(customInfo[rule.field],'file') " >
                          <view :key="index1" @click="previewFile(item1)" class="line-file">{{(item1.fileName)}}</view>
                        </template>
                      </view>
                      <!-- <template v-if="rule.type == 'upload' && customInfo[rule.field]">
                        <view class="line_files">
                          <view> <image v-for="(info, j) in customInfo[rule.field]" :key="j" class="line-img" @click="previewImg(info)" :src="info"></image></view>  
                        </view>
                      </template> -->
                      <template v-else>
                        <view class="dd">{{ customInfo[rule.field] }}</view>
                      </template>
                    </view>
                </u-collapse-item>				 
              </view>
            </template>
          </u-collapse>
          
         <!-- <view v-for="(item, index) in customFieldsData" :key="index">
            <view class="content-li">
              <view class="dt">{{ item.title }}：</view>
              <template v-if="item.type == 'upload' && customInfo[item.field]">
                <view class="line_files">
                  <image v-for="(item1, index1) in customInfo[item.field]" :key="index1" class="line-img" @click="previewImg(item1)" :src="item1"></image>
                </view>
              </template>
              <template v-else>
                <view class="dd">{{ customInfo[item.field] }}</view>
              </template>
            </view>
          </view> -->

          <material-select :materials="materialsList" :taskDetail="basicInfo" @updateNeeds="updateNeeds" @on-update="getDetail" @on-changeOther="changeMaterial"></material-select>

          <template>
            <view class="content-li">
              <view class="dt">经办时间：</view>
              <view class="dd">{{ taskProcessingTime.submitDate }}</view>
            </view>
          </template>
          <template>
            <view class="content-li">
              <view class="dt">派单时间：</view>
              <view class="dd">{{ taskProcessingTime.giveoutDate }}</view>
            </view>
          </template>
          <template>
            <view class="content-li">
              <view class="dt">接单时间：</view>
              <view class="dd">{{ taskProcessingTime.acceptDate }}</view>
            </view>
          </template>
          <template>
            <view class="content-li">
              <view class="dt">处理时间：</view>
              <view class="dd">{{ taskProcessingTime.dealDate }}</view>
            </view>
          </template>
          <template>
            <view class="content-li">
              <view class="dt">审批时间：</view>
              <view class="dd">{{ taskProcessingTime.approveDate }}</view>
            </view>
          </template>
          <template>
            <view class="content-li">
              <view class="dt">确认时间：</view>
              <view class="dd">{{ taskProcessingTime.finishDate }}</view>
            </view>
          </template>
          <template>
            <view class="content-li">
              <view class="dt">关闭时间：</view>
              <view class="dd">{{ taskProcessingTime.closeDate }}</view>
            </view>
          </template>
        </view>
        <view class="line"></view>
        <view class="white-box" style="padding: 30rpx; background-color: #fff;">
          <e-time-line v-for="(item, index) in dataOperation" :key="index">
            <e-time-line-item>
              <template v-slot:content>
                <view>
                  <view class="line-desc line-color"
                    >{{ item.userName }}<text style="margin-left: 10px">{{ item.operationName }}</text></view
                  >
                  <view class="line-desc">{{ item.recordDesc }}</view>
                  <view class="line-desc line-color">{{ item.createDate }}</view>
                  <view class="line_files" v-if="item.fileUrl">
                    <template v-for="(item1, index1) in formatFile(item.fileInfoList,'img') " >
                      <image :key="index1" class="line-img" @click="previewImg(item1.path)" :src="item1.path"></image>
                    </template>
                    <template v-for="(item1, index1) in formatFile(item.fileInfoList,'file') " >
                      <view :key="index1" @click="previewFile(item1)" class="line-file">{{item1.fileName}}</view>
                    </template>
                   </view>
                </view>
              </template>
            </e-time-line-item>
          </e-time-line>
        </view>
      </view>
      <view class="bot-btn" v-if="buttons.length > 0 && showOptionBtn && !show">
        <u-row :gutter="0">
          <u-col v-for="(item, index) in buttons" :key="index" v-if="index < 2 || buttons.length < 4" :span="buttons.length == '1' ? 12 : buttons.length > 2 ? 4 : 6" class="hdCellCenter">
            <view style="text-align: center;" :class="[{ leftBtn: buttons.length > 1 && index == 0, rightBtn: buttons.length == 1 || index == 1 }]" @click="handleSubmit(item)">{{ item.btnName }}</view>
          </u-col>
          <u-col span="4" v-if="buttons.length > 2" class="hdCellCenter">
            <view style="text-align: center;"  id="more-btn" class="more-btn" @click="showMore">更多</view>
          </u-col>
        </u-row>
      </view>
      <view class="bot-btn" v-if="isBtn">
        <view style="text-align: center" class="rightBtn" @click="handleSubmit">激活</view>
      </view>
    </view>
    <u-action-sheet @close="moreShow = false" :actions="moreBtns" :show="moreShow" @select="handleSubmit"> </u-action-sheet>
    <e-poptip v-model="poptipShow" :popData="moreBtns" @tapPopup="handleSubmit" :x="poptipX" :y="poptipY" placement="bottom-center"> </e-poptip>
		<u-popup :show="rateShow" mode="center" closeOnClickOverlay duration="0" class="list-search">
			<view class="rateMax">
				<view class="rate-title">请您对本次服务作出评价？</view>
				<view class="rate-rt"><u-rate v-model="satisfied" size="26" color="#ffd21e"></u-rate></view>
				<view class="rate-btn">
				  <u-row :gutter="10">
				   <u-col span="6" class="hdCellCenter">
				     <view class="leftBtn" @click="rateShow=false;">取消</view>
				   </u-col>
				    <u-col span="6" class="hdCellCenter">
				      <view class="rightBtn" @click="saveRate">提交</view>
				    </u-col>
				  </u-row>
				</view>
			</view>
			
		</u-popup>
  </view>
</template>

<script>
import { getQuestionTaskDetailByQuesTaskId, getServerSettingFiledInfoByOperate, getServerSettingBtnByTaskNodeKey, getQuesRecordList, getTbiMaterialList, getFollowUserList,queryByTaskId } from '@/service/crm6.0'
import { saveAndUpdateQuestionTask } from '@/service/wuyecrm.js'
import { mapGetters, mapMutations } from 'vuex'
import uTimeLine from '../components/u-time-line/u-time-line.vue'
import uTimeLineItem from '../components/u-time-line-item/u-time-line-item.vue'
import ePoptip from '../components/ePoptip/index.vue'
import materialSelect from './component/materialSelect'
import { getQYInfoByOwnerId, getQYInfoByUserId, syncOwnerInfo, getCompanyAgentMaterialList  } from '@/service/api-gateway'
import CellText from '@/components/cell-text.vue'
import YbTag from '@/components/yb-tag/yb-tag.vue'
import YbComplete from '@/components/yb-complete/yb-complete.vue'

export default {
  components: {
    'e-time-line': uTimeLine,
    'e-time-line-item': uTimeLineItem,
    'material-select': materialSelect,
    ePoptip,
    CellText,
    YbTag,
    YbComplete
  },
  data() {
    return {
      quesTaskId: '',
      formData: {},
      commonFieldsData: [],
      customFieldsData: [],
      dataOperation: [],
      basicInfo: {},
      customInfo: {},
      relateTasks: [],
      taskProcessingTime: {},
      moreShow: false,
      buttons: [],
      moreBtns: [],
      title: '表单',
      materialsInfo: {},
      showMatrialLayout: false,
      materialsList: [],
      isBtn: false, //是否只有一个激活按钮
      followUserData: [],
      showOptionBtn: false,
      isMaterial: false,
      materialLen: 0,
      isNoSelect: false,
      poptipShow: false,
      optionData: [
        {
          title: '创建群聊',
          icon: '../../static/chuangjianqunliao-lan.png',
          disabled: true
        },
        {
          title: '加好友/群',
          icon: '../../static/tianjiahaoyou.png'
        }
      ],
      poptipX: 0,
      poptipY: 0,
      userInfo: {},
      isShareBtn: false, // 分享按钮
      isDev: process.env.NODE_ENV != 'production',
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      },
      ownerModal: {
        isShow: false
      },
      processList:[],
			isShowRate:false,
			rateShow:false,
			satisfied:0,
			jdpjFlag:'',
			jdczlxFlag:'',
			isShowProcessBtn:false,
      associatedList:[],//关联的设备
      activeNames: 0,
      show: '',
      fromPage: '',
      createdData: '',
    }
  },
  onLoad(option) {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    this.show = option.show || ''; 
    this.quesTaskId = option.quesTaskId
    this.fromPage = option.fromPage || ''
    this.createdData = option.createdData || ''
    // this.getDetail();
  },
  computed: {
    commonFieldInfo() {
      let res = {
        keys: []
      }
      this.commonFieldsData.forEach((item) => {
        res[item.fieldCode] = {
          name: item.fieldName
        }
        res.keys.push(item.fieldCode)
      })
      return res
    },
    followUserName() {
      if (this.followUserData.length > 0) {
        return this.followUserData[0].user_name
      } else {
        return ''
      }
    },
    showMoreFollowUsers() {
      return this.followUserData.length > 1
    },
    getChildStateText() {
      const taskState = this.basicInfo.taskState
      const giveoutDeadline = this.taskProcessingTime.giveoutDeadline
      const acceptDeadline = this.taskProcessingTime.acceptDeadline
      const finishDeadline = this.taskProcessingTime.finishDeadline
      const closeDeadline = this.taskProcessingTime.closeDeadline
      const approveDeadline = this.taskProcessingTime.approveDeadline

      if (taskState == 0 && giveoutDeadline && this.$dayjs().isAfter(this.$dayjs(giveoutDeadline))) {
        // 待派单
        return '派单超期'
      }
      if (taskState == 1 && acceptDeadline && this.$dayjs().isAfter(this.$dayjs(acceptDeadline))) {
        // 待接单
        return '接单超期'
      }
      if (taskState == 2 && finishDeadline && this.$dayjs().isAfter(this.$dayjs(finishDeadline))) {
        // 待处理
        return '处理超期'
      }
      if (taskState == 3 && closeDeadline && this.$dayjs().isAfter(this.$dayjs(closeDeadline))) {
        // 待关闭
        return '关闭超期'
      }
      if (taskState == 6 && approveDeadline && this.$dayjs().isAfter(this.$dayjs(approveDeadline))) {
        // 待审核
        return '审核超期'
      }
      return ''
    },
  },
  onShow() {
    this.getShareConfig()
    this.BtnOptAuth()
    this.getDetail()
		this.queryByTaskId();
  },
  methods: {
    ...mapMutations('repair', ['clearRepairsInfo']),
    // ...mapState({
    //     materialStoreBean: state => state.personSelectStore.materialStore,
    // }),
		selectDevice(){
			let params = {
			  areaId: this.basicInfo.areaId,
			  projectId: this.basicInfo.projectId,
				type:'detail',
				quesTaskId:this.quesTaskId,
			}
			if(this.associatedList){
        uni.setStorageSync('btnInfo', JSON.stringify(this.associatedList));
			}else{
        uni.setStorageSync('selectDatas', '[]');
			}		
			uni.navigateTo({
			  url: this.$utils.spliceGetUrl('/pages-order/select/selectDevice', params),
			  events: {
			    dataEvent: (data) => {
						
			    }
			  }
			})
		},
		queryByTaskId(){
			let params1 = {
			  data: {
			    quesTaskId:this.quesTaskId,
					type:2,
			  }
			}
		  queryByTaskId(params1).then(res=>{
		    if(res.status=="200"){
		      this.associatedList=res.data;
		    }
		  })
		},
		saveRate(){
      let self = this;
		  let params={
		    evaluationScore:this.satisfied,
		    jdpjFlag:this.jdpjFlag,
		    quesTaskId:this.quesTaskId,
		    jobInfo:"",
		  };
      if (this.satisfied == 0) return uni.showToast({title: '请打分', icon: 'none'})
		  this.processList.forEach(item=>{
		    if(this.satisfied<=3&&item.btnName=='返工'){
		      params.conditionExpression=item.conditionExpression;
		      params.operationCode=item.btnCode;
		      params.operationName=item.btnName;
		    }else if(this.satisfied>=4&&item.btnName=='关闭'){
		      params.conditionExpression=item.conditionExpression;
		      params.operationCode=item.btnCode;
		      params.operationName=item.btnName;
		    }
		  })
			let params1 = {
			  data: {
			    ...params
			  }
			}
		  saveAndUpdateQuestionTask(params1).then(res => {
		    if (res.status == 200) {
					uni.showToast({
					  title: '操作成功',
					  duration: 1000,
					  icon: 'success'
					})
		      this.rateShow=false;
		      setTimeout(function () {
		        self.getDetail()
		      }, 1000)
		    }else{
		      uni.showToast({ title: res.message, icon: 'none' })
		    }
		  })
		
		},
    showMore() {
      let view2 = uni.createSelectorQuery().in(this).select('.main-page')
      view2
        .boundingClientRect((mainData) => {
          console.log(JSON.parse(JSON.stringify(mainData)))
          let view = uni.createSelectorQuery().in(this).select('.more-btn')
          view
            .boundingClientRect((data) => {
              console.log(JSON.parse(JSON.stringify(data)))
              this.poptipX = mainData.width - (data.width / 2)
              this.poptipY = mainData.height - data.height
              console.log(this.poptipX, this.poptipY)
              this.poptipShow = true
            })
            .exec()
        })
        .exec()
    },
    previewImg(url) {
      console.log(url)
      uni.previewImage({
        urls: [url]
      })
    },
    previewFile(url) { 
      uni.downloadFile({
        url: url.path,
        success: function (res) {
          var filePath = res.tempFilePath;
          let fileType = ''
          if(url.path){
            fileType = url.path.split('.').pop().toLowerCase()
          }
          let fileTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']
          uni.openDocument({
            filePath: filePath,
            showMenu: true,
            fileType: fileTypes.includes(fileType) ? fileType : '',
            success: function (res) {
              console.log('打开文档成功');
            },
            fail: function (res) {
              uni.showToast({
                title: '暂不支持预览的文件',
                duration: 1500,
                icon: 'none'
              })
            }
          });
        }
      });

        // try{
        //   uni.showLoading({
				// 	title: '加载中'
				// })
        // uni.downloadFile(url.path,url.id, url.fileName,()=>{
        //   uni.hideLoading();
        //   uni.previewFile(url.id,()=>{
        //   },(err)=>{
        //     uni.hideLoading();
        //      uni.showToast({
        //       title: '预览失败',
        //       duration: 1000,
        //       icon: 'none'
        //     })
        //   });
        // },()=>{
        //   uni.hideLoading();
        //    uni.showToast({
        //       title: '下载失败',
        //       duration: 1000,
        //       icon: 'none'
        //     })
        // });
        // }catch(err){
        //   console.log(err)
        // }
      },
    updateNeeds(isNeeds, mGoodInfos) {
      // this.isNeeds = isNeeds;
      // this.mGoodInfos = mGoodInfos;
    },
    changeMaterial(num, info) {
      if (num == '1') {
        if (info.index == 1) {
          this.isMaterial = true
        } else if (info.index == 2) {
          this.isNoSelect = true
        }
      } else if (num == '2') {
        this.isNoSelect = true
        this.materialLen = info
      }
    },
    handleSubmit(btnInfo) {
      let self = this
			if(btnInfo.btnCode=='pingjia'){
				self.rateShow=true;
				 return false
			}
      if (self.basicInfo.taskState != '2') {
        self.toBatchOperation(btnInfo)
        return false
      }
      if (btnInfo.btnCode == 'reporttask' || btnInfo.btnCode == 'pausetasksubscribe' || btnInfo.btnCode == 'active' || btnInfo.btnCode == 'canceltasksubscribe' || btnInfo.btnCode == 'abnormalclosetasksubscribe' || self.basicInfo.pauseState == 'paused') {
        self.toBatchOperation(btnInfo)
      } else {
        // if (!self.isNoSelect) {
        //   if (!self.isMaterial) {
        //     uni.showToast({
        //       title: '请选择是否需要材料',
        //       duration: 1000,
        //       icon: 'none'
        //     })
        //     return false
        //   }
        //   if (self.materialLen == 0) {
        //     uni.showToast({
        //       title: '请选择需要的材料',
        //       duration: 1000,
        //       icon: 'none'
        //     })
        //     return false
        //   }
        // } else {
          self.toBatchOperation(btnInfo)
        // }
      }
    },
    toBatchOperation(btnInfo) {
      const { btnCode } = btnInfo
      let self = this
      if(btnInfo.btnCode=='processBtn'){
				this.clearRepairsInfo()
        uni.setStorageSync('processList', JSON.stringify(this.processList));
				uni.navigateTo({
				  url: '/pages-order/order/batchOperation?quesTaskId=' + this.quesTaskId+'&isProcess=1'+'&jdczlxFlag='+this.jdczlxFlag+'&fromPage='+this.fromPage+'&createdData='+this.createdData
				})
			}else if (btnInfo.btnName) {
        this.clearRepairsInfo()
        uni.setStorageSync('btnInfo', JSON.stringify(btnInfo));
        uni.navigateTo({
          url: '/pages-order/order/batchOperation?quesTaskId=' + this.quesTaskId + `&btnCode=${btnCode}`+'&fromPage='+this.fromPage+'&createdData='+this.createdData
        })
      } else {
        //激活操作
        let params = {
          data: {
            quesTaskId: this.quesTaskId,
            operationCode: 'active',
            operationName: '激活'
          }
        }
        saveAndUpdateQuestionTask(params).then((res) => {
          if (res.status == 200) {
            uni.showToast({
              title: '激活成功',
              duration: 1000,
              icon: 'success'
            })
            setTimeout(function () {
              self.getDetail()
            }, 1000)
          } else {
            uni.showToast({ title: res.message, icon: 'none' })
          }
        })
      }
    },
    getDetail() {
      let params = {
        data: {
          quesTaskId: this.quesTaskId,
          userId: this.userInfo.userId
        }
      }
      getQuestionTaskDetailByQuesTaskId(params).then((res) => {
        if (res.status == 200) {
          const { basicInfo = {} } = res.data || {}
          const { followUserId } = basicInfo
          this.basicInfo = res.data.basicInfo
          this.relateTasks = res.data.relateTasks || []
          this.customInfo = JSON.parse(res.data.customInfo || '{}')
          this.taskProcessingTime = res.data.taskProcessingTime
          this.materialsList = res.data.materialInfo //物料信息
          this.getFields()
          //暂停按钮默认显示激活
          if (res.data.basicInfo.pauseState != 'paused') {
            this.isBtn = false
            this.getButtons()
          } else {
            this.isBtn = true
            this.buttons = []
          }
          const { O_USER_INFO } = this.$constant;
          const { jobInfo: jbif, userId: usid } = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
          const jobInfo = uni.getStorageSync('jobInfo') || jbif || ''
          const userId = uni.getStorageSync('userId') || usid || '' 
          const showOptionBtn = jobInfo.indexOf('系统管理员') > -1 || jobInfo.indexOf('公司管理员') > -1 || jobInfo.indexOf('工单管理员') > -1 || followUserId.indexOf(userId) > -1
          this.showOptionBtn = !!showOptionBtn
          // this.getMaterialList();
        } else {
          this.$Message.error(res.message)
        }
      })
      getQuesRecordList(params).then((res) => {
        if (res.status == 200) {
          this.dataOperation = res.data
        } else {
          this.dataOperation = []
        }
      })
      //获取跟进人列表
      getFollowUserList(params).then((res) => {
        if (res.status == 200) {
          this.followUserData = res.data
        } else {
          this.followUserData = []
        }
      })
    },
    goToTask(item){
      uni.navigateTo({
        url: '/pages-order/order/detail?show=1&quesTaskId=' + item.quesTaskId,
      });
    },
    getMaterialList() {
      let params = {
        data: {
          quesTaskId: this.quesTaskId
        }
      }
      this.materialsList = []
      getTbiMaterialList(params).then((res) => {
        if (res.status == '200' && res.data.length > 0) {
          this.materialsList = res.data
        }
      })
    },
    viewMoreFollowUsers() {
      uni.navigateTo({
        url: '/pages-order/order/followUser?quesTaskId=' + this.quesTaskId
      })
    },
    getFields() {
      let params = {
        data: {
          operateType: 2,
          taskSubTypeId: this.basicInfo.taskSubTypeId,
          serverSettingId: this.basicInfo.serverSettingId,
          areaId: this.basicInfo.areaId,
          projectId: this.basicInfo.projectId,
          userId: this.userInfo.userId,
          companyId: this.userInfo.companyId
        }
      }
      getServerSettingFiledInfoByOperate(params).then((res) => {
        if (res.status == 200) {
          this.commonFieldsData = res.data.commFormFieldJson
          this.customFieldsData = JSON.parse(res.data.customFormFieldJson)
          this.customFieldsData.forEach(item => {
            if (item.rule && Array.isArray(item.rule)) item.rule.sort((a, b) => a.title.localeCompare(b.title))
          })
        }
      })
    },
    getButtons() {
      let params = {
        data: {
          serverId: this.basicInfo.taskSubTypeId,
          serverSettingId: this.basicInfo.serverSettingId,
          taskNodeKey: this.basicInfo.nodeCode,
          areaId: this.basicInfo.areaId,
          projectId: this.basicInfo.projectId,
          userId: this.userInfo.userId,
          companyId: this.userInfo.companyId,
          processKey: this.basicInfo.processKey || ''
        }
      }
      this.moreBtns = []
      getServerSettingBtnByTaskNodeKey(params).then((res) => {
        if (res.status == 200 && res.data.nodeInfo.nodeOperateBtnList) {
					this.buttons =[];
					this.processList=[];
					if(res.data.nodeInfo.jdczlxFlag=='1'||res.data.nodeInfo.jdczlxFlag=='2'){
					  this.jdczlxFlag=res.data.nodeInfo.jdczlxFlag;
					  res.data.nodeInfo.nodeOperateBtnList.forEach(item=>{
					    if(!item.conditionExpression){
					      this.buttons.push(item);
					    }else{
					      this.processList.push(item);
					      this.isShowProcessBtn=true;
					    }
					  })
						if(this.isShowProcessBtn){
							this.buttons.push({btnName:'处理流程分支',btnCode:'processBtn'});							
						}
					}else if(res.data.nodeInfo.jdpjFlag=='1'){
					  this.jdpjFlag=res.data.nodeInfo.jdpjFlag;
					  res.data.nodeInfo.nodeOperateBtnList.forEach(item=>{
					    if(!item.conditionExpression){
					      this.buttons.push(item);
					    }else{
					      this.processList.push(item);
					      this.isShowRate=true;
					    }
					  })
						if(this.isShowRate){
							this.buttons.push({btnName:'评价',btnCode:'pingjia'});							
						}
					}else{
					  this.buttons = res.data.nodeInfo.nodeOperateBtnList;
					}
					
          if (this.buttons.length > 2) {
            this.buttons.forEach((item, index) => {
              if (index > 1) {
                item.name = item.btnName
                item.title = item.btnName
                this.moreBtns.push(item)
              }
            })
          }
        } else {
          this.buttons = []
          this.moreBtns = []
        }
      })
    },
    dialTel(tel) {
      //拨打电话
      uni.makePhoneCall({
        phoneNumber: tel
      })
    },
        /** 获取按钮权限 */
    BtnOptAuth() {
      // #ifdef MP-WEIXIN
      // 分享按钮
      const wxInfo = wx.getSystemInfoSync()
      if (wxInfo.environment) {
        // 必须是企业微信的小程序，不是工单审批页面，才能分享工单详情
        this.isShareBtn = true
      }
      // #endif
    },
    callPhone() {
      if (this.basicInfo.contactPhone) {
        uni.makePhoneCall({
          phoneNumber: this.basicInfo.contactPhone,
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
      }
    },
    /**
     * 根据反馈人，在企微上打开 当前登录人 与 反馈人 的会话
     * 自查下单，反馈人是员工，在企微上开通的是企业成员(即企微名字后面不带 @微信 标志)
     * 客户下单，反馈人是业主，在企微上开通的是外部联系人（即企微名字后面带 @微信 标志，也叫客户）
     */
    async openChat() {
      const isSelf = this.basicInfo.orignSource == 'internalTask' ? true : false // true: 自查工单; false: 客户工单
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

      if (isSelf) {
        const staffId = this.basicInfo.orignUserId // 反馈人员工id
        if (staffId == userInfo.userId) {
          // 反馈人跟当前登录人一致
          this.$refs.completeMsgEl.showMessage('不支持与自己发起会话')
          return
        }

        const res = await getQYInfoByUserId(staffId) // 获取反馈人在企微上的信息
        const data = res.data || {}
        if (data.isEnableQw != 1) {
          // 员工没有开通企微
          this.$refs.completeMsgEl.showMessage('员工未开通企微，暂时无法直接发起会话')
          return
        }

        // 打开与企业成员的单聊会话
        wx.qy.openEnterpriseChat({
          userIds: data.wechatUserId,
          success: (res) => { }
        })
      } else {
        const ownerId = this.basicInfo.ownerId || '' // 反馈人业主id
        if (!ownerId) {
          // 业主没有开通业主端（一般不存在，因为新建工单可以选择当前业主客户，就证明已经注册过业主端了）
          this.ownerModal.isShow = true
          return
        }

        const res = await getQYInfoByOwnerId(ownerId) // 获取反馈人在企微上的信息
        const data = res.data || {}
        if (!data.userId) {
          // 如果不存在外部联系人id
          this.ownerModal.isShow = true
          return
        }

        // 需要先根据外部联系人id同步企微外部联系人信息
        await syncOwnerInfo(data.userId)
        // 打开与客户的单聊会话
        wx.qy.openEnterpriseChat({
          externalUserIds: data.userId,
          success: (res) => {}
        })
      }
    },
    /** 分享工单 */
    handleShare() {
      if (!this.shareConfig.materialUrl) {
        uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
        return
      }

      const params = {
        orderId: this.quesTaskId
      }

      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            // 从单聊进入

            if (this.shareConfig.type == 1) {
              // 发送 H5
              wx.qy.sendChatMessage({
                msgtype: 'news', //消息类型，必填
                enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
                news: {
                  title: '点击可查看该工单处理详情',
                  desc: this.shareConfig.materialDesc || '',
                  imgUrl: this.shareConfig.materialPicUrl,
                  link: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params))
                },
              })
            } else if (this.shareConfig.type == 2) {
              // 发送 小程序
              wx.qy.sendChatMessage({
                msgtype: 'miniprogram', //消息类型，必填
                enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
                miniprogram: {
                  appid: this.shareConfig.appId,
                  title: '点击可查看该工单处理详情',
                  imgUrl: this.shareConfig.materialPicUrl,
                  page: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params)), // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
                }
              })
            }

          } else {

            let attachments = []
            if (this.shareConfig.type == 1) {
              // 发送 H5
              attachments.push({
                msgtype: 'link',
                link: {
                  title: '点击可查看该工单处理详情',
                  desc: this.shareConfig.materialDesc || '',
                  imgUrl: this.shareConfig.materialPicUrl,
                  url: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params))
                }
              })
            } else if (this.shareConfig.type == 2) {
              // 发送 小程序
              attachments.push({
                msgtype: 'miniprogram',
                miniprogram: {
                  appid: this.shareConfig.appId,
                  title: '点击可查看该工单处理详情',
                  imgUrl: this.shareConfig.materialPicUrl,
                  page: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params))
                }
              })
            }

            wx.qy.shareToExternalContact({
              text: {
                content: this.basicInfo.taskSubTypeName + ' ' + this.basicInfo.taskCode,
              },
              attachments
            })

          }
        },
      })
    },
    /** 获取“分享工单”的配置 */
    async getShareConfig() {
      const params = {
        data: {
					pageNum: 1,
					pageSize: 100,
					title: '分享工单'
				},
        hideLoading: true
      }
      const res = await getCompanyAgentMaterialList(params)

      const data = res?.data?.records?.[0]
      if (!data) {
        this.shareConfig = {}
        return
      }

      this.shareConfig = data
    },
    /** 选择外部联系人（客户） */
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.ownerModal.content = ''
          this.ownerModal.isShow = false

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
    },
    // 增加附件类型，便于展示txt类型的附件
    formatFile(arr,fileType){
      let img = ['jpg','png','gif', 'jpeg']
       let list = [];
      arr.forEach(item=>{
        if(item){
          let type = item.fileName.split('.');
          let typeName = '';        

          if(img.includes(type[type.length-1].toLowerCase())){
          typeName = 'img';
        }else{
          typeName = 'file';
        }
        if(typeName==fileType){
          list.push({
            ...item,
            type: typeName
          })
        }
      }
      })

     
      console.log('测试1',list);
      
      return list;


    },
    onCollapseChange(evt) {
      const i = evt.findIndex(item => item.status == 'open')
      this.activeNames = i == -1 ? '' : i
    },

    //格式化文件
    formatFile2(arr,fileType){
      let myList = []
      if(arr && typeof arr=="string"){
        myList = arr.split(',')
      }else{
        myList = arr
      }
      let img = ['jpg','png','gif', 'jpeg']
      let list = [];
      myList.forEach(item =>{
        let type = item.split('.');
        let typeName = '';        
        if(img.includes(type[type.length-1].toLowerCase())){
          typeName = 'img';
        }else{
          typeName = 'file';
        }
        if(fileType==typeName){
          list.push({
            path:item,
            type: typeName,
            fileName:item.match(/\/([^\/]*)$/)[1]
          })
        }
      })
      return list
    }
  }
}
</script>
<style lang="scss" scoped>
.main-page {
  // position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: #f3f3f3;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.header-panel {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 24rpx 30rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 24rpx;
}
::v-deep .auto-width {
  .cell-text-label {
    flex: 1 1 auto;
  }
  .cell-text-content {
    flex: 0 0 auto;
  }
}
::v-deep .header-title {
  .cell-text-label {
    font-size: 30rpx;
    font-weight: bold;
    color: #222;
  }
  .cell-text-content {
    font-size: 28rpx;
    color: var(--app-primary-color);
  }
}
.header-tag {
  @include flx-dsp(space-between, flex-start);
  width: 100%;

  .header-tag-left {
    @include flx-dsp(flex-start, flex-start);
  }
}
.desc-tag-panel {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #EBEBEB;
  padding-top: 20rpx;
  margin-top: 16rpx;

  ::v-deep .u-text {
    flex: 1 1 auto;
    display: flex;
    justify-content: center !important;
  }
}
.main-box {
  box-sizing: border-box;
  padding: 0 10px 10px;
  flex: 1;
  overflow: auto;
}

.white-box {
  width: 100%;
  // padding: 14rpx 30rpx;
  box-sizing: border-box;
  // background: #ffffff;
  // border-radius: 12rpx;
  overflow: hidden;
  .line-desc {
    font-size: 28rpx !important;
    color: #666666 !important;
    padding: 8rpx 0 4rpx;
  }
  .line-color {
    color: #999999 !important;
  }
  .line_files {
    width: 390rpx;
    overflow-x: auto;
    // display: flex;
    align-items: flex-start;
    padding: 0 20rpx 30rpx 0;
    margin-top: 10rpx;
    white-space: nowrap;
    .line-img {
      width: 120rpx;
      height: 120rpx;
      margin: 0 10rpx 12rpx;
    }
    .line-file{ 
      margin: 10rpx 0;
      font-size: 12px;
      color: #759aff;
      white-space:normal;
      display: block;
    }
  }

  .content-li {
    width: 100%;
    overflow: hidden;
    // margin: 16rpx 0;
    padding: 16rpx 30rpx;
    font-size: 28rpx;
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    background-color: #fff;
    .dt {
      color: #999999;
      width: 200rpx;
    }
    .dd {
      flex: 1;
      color: #333333;
      text {
        text-decoration: underline;
      }
      .dd-more {
        text-decoration: inherit;
        margin-left: 16rpx;
        color: var(--app-primary-color);
      }
    }
    .dtel {
      color: var(--app-primary-color);
    }
  }
  ::v-deep .u-time-axis:first-child {
    &::before {
      top: 12rpx;
      border-left: 1px solid #fe9901;
    }
    .u-time-axis-item .u-dot {
      background: #fe9901;
    }
  }
  ::v-deep .u-time-axis:last-child {
    &::before {
      height: 12rpx;
    }
    .u-time-axis-item {
      border-bottom: 0px solid #eaeaea;
    }
  }
}

.line {
  border-top: 20rpx solid #f2f4f6;
}

.bot-btn {
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background-color: #fff;
  font-size: 28rpx !important;
  color: #333333;
}

.hdCellCenter {
  text-align: center !important;
  padding: 0 !important;
}

.leftBtn {
  background: #759aff;
  color: #ffffff;
}
.rightBtn {
  background: #2761ff;
  color: #ffffff;
}
::v-deep .u-popup__content{
	// transform: translate(-50%, -50%);
}
.rateMax{
	width: 300px;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	.rate-title{
		border-bottom: 2rpx solid #e8eaec;
		padding: 30rpx;
		text-align: center;
	}
	.rate-rt{
		padding: 100rpx 25%;
		border-bottom: 2rpx solid #e8eaec;
	}
	.rate-btn{
		line-height: 80rpx;
		height: 80rpx;
		width: 100%;
		background-color: #fff;
		font-size: 28rpx !important;
		color: #333333;
		::v-deep .u-row{
			margin: 0 !important;
		}
		.hdCellCenter {
		  text-align: center !important;
		  padding: 0 !important;
			.leftBtn {
			  color: #759aff;
				background-color: #FFFFFF;
			}
			.rightBtn {
			  background: #2761ff;
			  color: #ffffff;
			}
		}
		
	}
}
// ::v-deep .u-rate{
// 	display: block;
// 	justify-items:center;
// }
// ::v-deep .u-rate__content{
// 	display: flex;
// 	flex-direction: row;
// 	justify-items: center;
// }

::v-deep .u-collapse {
  background: #fff;
  margin: 20rpx 0;
  .u-cell__title-text {
    font-size: 28rpx;
    color: #999;
  }
}
.relate-task-wrap {
  padding: 0 30rpx 8rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  .task-wrap {
    padding: 12rpx 20rpx;
    background: #f6f6f6;
    border-radius: 8rpx;
    margin-bottom: 8rpx;
    display: flex;
    align-items: center;
    .task-code {
      font-size: 30rpx;
      color: #2761ff;
      padding: 0 16rpx;
      flex: 1;
    }
    .task-status {
      font-size: 30rpx;
      padding-right: 16rpx;
      color: #333333;
    }
  }
}
</style>
