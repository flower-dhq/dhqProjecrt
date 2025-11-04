<style scoped lang="scss"> 
.page-box {
    background: rgb(247, 247, 247);
    padding: 60rpx 20rpx 20rpx;
    box-sizing: border-box;
    min-height: 100vh;
    height: initial;
}
.box {
    position: relative;
    background: #ffffff;
    padding: 56rpx 20rpx 20rpx;
}
.time {
    font-size: 12px;
    color: #767676;
    @include flx-dsp($jsc: center, $ali: center);
    height: 68rpx;
    background: #f5f5f5;
    border: 1px solid #e7e6ea;
    border-radius: 19px;
    width: 40%;
    position: absolute;
    left: 0;
    right: 0;
    top: -4%;
    margin: auto;
}
.content {
    .title {
        padding-bottom: 20rpx;
        font-weight: 700;
        font-size: 30rpx;
        color: #333;
    }
    .ques-box {
        .ques-title {
            font-size: 28rpx;
            color: rgb(51, 51, 51);
            border-bottom: 1px solid #e7e6ea;
            padding: 10px 0;
            .required {
                color: red;
            }
        }
    }
}
.btn {
    height: 68rpx;
    text-align: center;
    line-height: 68rpx;
    border-radius: 34rpx;
    width: 40%;
    margin: auto;
    margin-top: 20rpx;
    border: 1px solid var(--app-primary-color);
    color: #fff;
    background-color: var(--app-primary-color);
}
.test ::v-deep .uni-textarea-placeholder {
    font-size: 28rpx;
}
.test ::v-deep .uni-textarea-textarea {
    font-size: 28rpx;
}
.form-box-img-box{
	margin-right: 20rpx;
	.form-box-img{
		width: 88rpx;
		height: 80rpx;
	}
}	
.upload-box{
	width: 130rpx;
	height: 120rpx;
	position: relative;
	display: inline-block;
	overflow: unset;
	.upload-img{
		width: 90%;
		height: 110rpx;
		padding:0 5%;
	}
	.del-img{
		position: absolute;
		right: 0;
		top: -10rpx;
		background: #ffffff;
		border-radius: 100%;
	}
}
</style>
<template>
    <view class="page-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="box">
            <view class="time" v-if="detail.postTime">{{formatTime(detail.postTime)}}</view>
            <view class="content">
                <view class="title">{{detail.name}}</view>
                <view class="ques-box" v-for="(item,index) in question" :key="index" v-if="item.display == '1'">
                    <view class="ques-title">{{index+1}}. {{item.title}}
                        <text v-if="item.type == 0">（单选）</text>
                        <text v-if="item.type == 1">（多选）</text>
                        <text v-if="item.required == 1" class="required">*</text>
                    </view>
                    <view style="margin-top: 10px;">
                        <u-radio-group v-if="item.type == 0" v-model="item.answerValue" placement="column" :disabled="item.disabled">
                            <u-radio size="14" labelSize="14" :customStyle="{marginBottom: '8px', height:'40rpx'}" v-for="(item, kindex) in item.elementList" :key="kindex" :label="item.title" :name="item.id">
                            </u-radio>
                        </u-radio-group>
                        <u-checkbox-group v-if="item.type == 1" v-model="item.answerValue" placement="column" :disabled="item.disabled">
                            <u-checkbox size="14" labelSize="14" :customStyle="{marginBottom: '8px', height:'40rpx'}" v-for="(item, yindex) in item.elementList" :key="yindex" :label="item.title" :name="item.id">
                            </u-checkbox>
                        </u-checkbox-group>
                        <u--textarea class="test" v-if="item.type == 2" v-model="item.answerValue" placeholder="请输入内容" count maxlength="200"  :disabled="item.disabled"></u--textarea>

                        <u-rate v-if="item.type == 3" v-model="item.answerValue" activeColor="rgb(255, 204, 102)" count="5"  :disabled="item.disabled"></u-rate>
												<view v-if="item.type == 4" class="accessory">
													<view class="form-box-img-box" v-if="!item.answerValue">
														<image :src="uploadcamera" class="form-box-img" @click="uploadImgData(index)"></image>
													</view>
													<view class="upload-box" v-else>
														<image :src="item.answerValue" class="upload-img" @click="previewImg(item.answerValue)"></image>
														<view class="del-img">
															<u-icon name="close-circle-fill" color="red" @click="delUploadImg(index)"></u-icon>
														</view>
													</view>
												</view>
										</view>
                </view>
            </view>
        </view>
        <view class="btn" @click="submit" v-if="!isDisabled">提交</view>
        <u-toast ref="uToast"></u-toast>
        <u-modal :show="show" title="提示" content='该问卷您已做过评价！' :width="260" style="text-align: center;" @confirm="goback"></u-modal>
        <u-modal :show="submitTips" title="提示" :width="260" @confirm="goback">
            <view class="slot-content">
                <text>{{submitTipsText}}</text>
            </view>
        </u-modal>
    </view>
</template>

<script>
import util from '../../js/utils';
import commLogic from '@/js/comm-logic';
import {
    getQuestionnaireById,
    updateQuestionnaireVisitorsNum,
    addQuestionnaireAnswer,
    viewWxQuestionnaireAnswer,
    updateStatus
} from '../../service/wxmanage'
	import {fileDownload,fileUpload} from '@/service/community';
export default {
    data() {
        return {
            show: false,
            submitTips: false,
            submitTipsText: '',
            title: '',
            msg: '',
            detail: {},
            question: [],
            mpqId: '',//问卷id 
            relateId: '',//房间id/活动id/任务id
            domain:'',
            isDisabled: false,
        }
    },
    onLoad(e) {
				
        if (e.id) { //问卷id
            this.mpqId = e.id;
        }
        if (e.relateId) { //房间id/活动id/任务id
            this.relateId = e.relateId;
        }
        
        const { O_USER_INFO, IS_ASSOCIATION } = this.$constant;
        let userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
        console.log('userInfo===============',userInfo)
        console.log('e===================[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]',e)
        if(e.scene){
            this.mpqId = e.scene;
            if(!userInfo){
                setTimeout(() => {
                    uni.showToast({
                         title: '未授权,请稍后再试',
                         duration: 2000,
                         icon:'none',
                     });
                     setTimeout(() => {
                        uni.switchTab({ url: '/pages/index/index'});
                     }, 2000)
                }, 1000)
            }
        }
        this.init();
		const { DOMAIN_PRO } = this.$appConfig;
		this.domain = DOMAIN_PRO;
        this.updateArticle();
    },
    mounted() {
        this.chaeckQuestionState()
    },
		computed: {
			uploadcamera(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/upload_camera.png`
			},
		},
    methods: {
        init() {
            let that = this;
            that.visitsNumber();
            var params = {
                data: {
                    id: that.mpqId
                },
            }
            getQuestionnaireById(params).then(res => {
                if (res.statusCode == 200) {
                    // 格式化日期
                    that.detail = res.data;
                    res.data.subjectsList.forEach(item => {
                        item.answerValue =item.type ==1?[]: "";
                    })
                    that.question = res.data.subjectsList;
                    that.anwers = res.data.subjectsList
                    console.log(156,res)
                    let time=new Date().getTime()
					let start=res.data.startTime*1000;
					let end=res.data.endTime*1000;
					if((typeof res.data.limitNum != "undefined") && (res.data.limitNum==res.data.participantsNum)){
                        this.submitTips = true;
                        this.submitTipsText = '问卷参与人数已达上限';
						return
					}else if(time<start){
                        this.submitTips = true;
                        this.submitTipsText = '该问卷尚未开始！';
						return
					}
                }
            })
        },
        formatTime(time) {
            return time ? uni.$u.timeFormat(new Date(time * 1000), 'yyyy-mm-dd hh:MM') : ''
        },
        updateArticle() {
            var that = this;
            const { O_USER_INFO } = this.$constant;
            const { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    relationPushId: that.mpqId,
                    relationPush: 2,
                    phone: phoneNumber
                },
            }
            updateStatus(params)
        },
				// 图片上传
				async uploadImgData(index){
					const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera', 'readStorage']})
					if (code !== 1 && code !== -2) return
					uni.chooseImage({
					//   count: 1, //默认9
					  count: 1, 
					  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					  success: async (res) => {
						console.log(683,res)
					    const { tempFilePaths, tempFiles } = res;
					    let filePath = tempFilePaths[0];
					    let fileData = tempFiles[0];
							this.uploadAvatar({ filePath, fileData },index)
					  },
					});
				},
				previewImg(url){
					uni.previewImage({
					  urls: [url],
					});
				},
				delUploadImg(index){
					this.question[index].answerValue = ''
				},
				// 上传文件
				async uploadAvatar(uploadObj,imgIndex) {
				  const uuid = util.uuid();
				  const { name, size, path} = uploadObj.fileData
				  const { uniPlatform } = uni.getSystemInfoSync();
				  const mpWeixinApp = uniPlatform === 'mp-weixin' || uniPlatform === 'app'
				  const suffix = () => {
				    const [ suffix ] = typeof path === 'string'  && path.match(/\.[a-z]+$/) || []
				    return suffix
				  }
				  const filename = mpWeixinApp ? `${uuid}${suffix() || '.png'}` : name;
				  await fileUpload({
				    filePath: uploadObj.filePath,
				    name: 'file',
				    header: {
				      fileid: uuid,
				      filename,
				      type: 1,
				      range: 0,
				      source: 's1',
				      totalsize: size,
				      filecreatetime: util.formatDate({ value: new Date().getTime(), type: 's2d' }),
				    },
				    hideLoading: true,
				  });
					let url = this.domain+'/filemanager/previewFile?fileId='+uuid+'&type=filedatabase/'+filename
					console.log(url,'url')
					this.question[imgIndex].answerValue = url
					console.log(this.question,'this.question')
					this.$forceUpdate()
				  return fileDownload({
				    header: {
				      fileid: uuid,
				      type: 2,
				    },
						hideLoading: true,
				  });
				},
        //检查该问卷当前用户是否已提交
        async chaeckQuestionState() {
            const { MEMBER_ID } = this.$constant;
            const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            var that = this;
            var params = {
                data: {
                    mpqId: that.mpqId,
                    userId: memberId,
                    relateId: that.relateId, //关联的报事、活动的id
                },
                // 快捷调试
                // data: {
                //     mpqId: 311,
                //     userId: '3778788d-66b4-466c-813e-a6812b8810bc',
                //     relateId: '', //关联的报事、活动的id
                // },
            }
            let res = await viewWxQuestionnaireAnswer(params)
            if (res.data && res.data.questionnaireAnswerValues && res.data.questionnaireAnswerValues.length > 0) {
                let question = this.question
                let data = res.data.questionnaireAnswerValues
                // 重复提交回显显示
                question.forEach((item,index) => {
                    if (data[index].subjectsId == item.id) {
                        console.log(item)
                        if (item.type == '0') {
                            item.answerValue = data[index].elements
                        }else if(item.type == 1) {
                            item.answerValue = data[index].elements.split(',')
                        }else {
                            item.answerValue = data[index].text
                        }
                        item.disabled = true
                        // item.type ==1?item.answerValue = [data[index].elements]: item.answerValue = data[index].text
                    }
                })
                this.question = question
                this.isDisabled = true
                
                that.show = true;
            }
        },
        visitsNumber() {
            //    更新问卷访问人数
            let that = this;
            var params = {
                data: {
                    mpqId: that.mpqId
                },
                hideLoading: true
            }
            updateQuestionnaireVisitorsNum(params)
        },
        submit() {
            let that = this;
            let anwers = [];
            for (var i = 0; i < that.question.length; i++) {
                let item = that.question[i]
                // 必填
                if (item.required == 1 && item.display == 1) {
                    if (!item.answerValue || item.answerValue == '' || item.answerValue.length == 0) {
                        that.$refs.uToast.show({
                            type: 'default',
                            message: item.type == 2 ? `请填写${item.title}` : `请选择${item.title}`,
                        })
                        return;
                    }
                }
                let elementsIds = [];
                let text = [];
                // 单选、多选 答案
                item.elementList.forEach(element => {
                    if (item.type != 1) {
                        if (item.answerValue == element.id) {
                            elementsIds.push(element.id);
                            text.push(element.title)
                        }
                    } else {
                        // 多选
                        if (item.answerValue.includes(element.id)) {
                            elementsIds.push(element.id);
                            text.push(element.title)
                        }
                    }

                });
                // 评分、填空 答案
                if (!item.elementList || item.elementList.length == 0) {
                    text.push(item.answerValue)
                }
                anwers.push({
                    elements: elementsIds ? elementsIds.join(',') : '',
                    subjectsId: item.id,
                    text: text ? text.join(',') : ''
                })
            }
            const { PROJECT_ID, MEMBER_ID, PROJECT_NAME, O_USER_INFO } = this.$constant;
            const projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
            const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            const projectName = util.storageAction({ key: PROJECT_NAME, action: 'get' });
            const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
            console.log(userInfo)

            let answerData = {
                mpqId: that.mpqId, //问卷id
                relateId: that.relateId, //房间id/活动id/任务id
                //questaskId: '', //任务ID（报事评价需用到）
                submitName: userInfo.fullName || userInfo.nickname,
                name: userInfo.fullName || userInfo.nickname, //联系人
                phone: userInfo.phoneNumber, //联系电话
                userId: memberId, //用户id
                projectId: projectId, //项目id
                projectName: projectName, //项目name
                answerValueList: anwers,
                memberId: memberId
            };
            var params = {
                data: answerData,
                responseToast:false
            }
            addQuestionnaireAnswer(params).then(res => {
                 if (res.status == 200) {
                    this.submitTips = true;
                    this.submitTipsText = '提交成功';
                } else {
                    this.submitTips = true;
                    this.submitTipsText = res.message;
                }

            })

        },
        goback() {
            this.submitTips = false
            if (this.isDisabled) {
               this.show = false 
            }else {
                this.isDisabled = true
                uni.navigateBack({
                    delta: 1
                });
            }
        }
    }

}
</script>
 