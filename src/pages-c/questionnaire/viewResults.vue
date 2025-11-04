<style scoped lang="scss">
.page-box {
    background: rgb(247, 247, 247);
    box-sizing: border-box;
    padding: 60rpx 20rpx 20rpx;
}
.box { 
    position: relative;
    background: #ffffff;
    padding: 56rpx 20rpx 20rpx;
}
.time {
    font-size: 24rpx;
    // color: #767676;
    color: #333;
    @include flx-dsp($jsc: center, $ali: center);
    height: 34px;
    background: #F5F5F5;
    border: 1px solid #E7E6EA;
    border-radius: 19px;
    width: 40%;
    position: absolute;
    left: 0;
    right: 0;
    top: -19px;
    margin: auto;
}
.content {
    .title {
        padding-bottom: 20rpx;
        font-weight: 700;
        font-size: 28rpx;
        color: #333;
        font-family: vant-icon, "source han sans", sans-serif;
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
.test ::v-deep .uni-textarea-placeholder {
    font-size: 28rpx;
}
.test ::v-deep .uni-textarea-textarea {
    font-size: 28rpx;
}
.disabledBox ::v-deep .u-radio__text {
    color: rgb(51, 51, 51) !important;
}
.disabledBox ::v-deep .uicon-checkbox-mark {
    color: #ffffff !important;
}
.disabledBox ::v-deep .u-checkbox uni-text:nth-child(2) {
    color: rgb(51, 51, 51) !important;
}
.form-box-img-box{
	margin-right: 20rpx;
	.form-box-img{
		width: 88rpx;
		height: 80rpx;
	}
}	
</style>
<template>
    <view class="page-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="box">
            <view class="time">{{formatTime(detail.postTime)}}</view>
            <view class="content">
                <view class="title">{{detail.name}}</view>
                <view class="ques-box" v-for="(item,index) in question" :key="index">
                    <view class="ques-title">{{index+1}}. {{item.title}}
                        <text v-if="item.type == 0">（单选）</text>
                        <text v-if="item.type == 1">（多选）</text>
                        <text v-if="item.required == 1" class="required">*</text>
                    </view>
                    <view style="margin-top: 10px;">
                        <u-radio-group  disabled v-if="item.type == 0"  :activeColor="blue" v-model="item.answerValue" placement="column">
                            <u-radio size="14" labelSize="14" :customStyle="{marginBottom: '8px', height:'40rpx'}" v-for="(item, kindex) in item.elementList" :key="kindex" :label="item.title" :name="item.id">
                            </u-radio>
                        </u-radio-group>
                        <u-checkbox-group  disabled v-if="item.type == 1"  :activeColor="blue" v-model="item.answerValue" placement="column">
                            <u-checkbox size="14" labelSize="14" :customStyle="{marginBottom: '8px', height:'40rpx'}" v-for="(item, yindex) in item.elementList" :key="yindex" :label="item.title" :name="item.id">
                            </u-checkbox>
                        </u-checkbox-group>
                        <u--textarea class="test" disabled v-if="item.type == 2" v-model="item.answerValue" placeholder="请输入内容"></u--textarea>

                        <u-rate v-if="item.type == 3" readonly v-model="item.answerValue" activeColor="rgb(255, 204, 102)" count="5"></u-rate>
												<view v-if="item.type == 4" class="accessory">
													<view class="upload-box">
														<image :src="item.answerValue" mode="widthFix" class="upload-img" @click="previewImg(item.answerValue)"></image>
													</view>
												</view>
										</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import util from '../../js/utils';
import {
    viewWxQuestionnaireAnswer,
    updateQuestionnaireVisitorsNum,

} from '../../service/wxmanage'
export default {
    data() {
        return {
            detail: {},
            question: [],
            answer: [],
            mpqId: '',//问卷id 
            relateId: '',//房间id/活动id/任务id
        }
    },
    onLoad(e) {
        if (e.id) { //问卷id
            this.mpqId = e.id;
        }
        if (e.relateId) { //房间id/活动id/任务id
            this.relateId = e.relateId;
        }
        this.init();
    },
    methods: {
				previewImg(url){
					uni.previewImage({
					  urls: [url],
					});
				},
        init() {
            let that = this;
            that.visitsNumber();
            const { MEMBER_ID } = this.$constant;
            const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            var params = {
                data: {
                    mpqId: that.mpqId,
                    userId: memberId,
                    relateId: that.relateId, //关联的报事、活动的id
                },
            }
            viewWxQuestionnaireAnswer(params).then(res => {
                if (res.statusCode == 200) {
                    // 格式化日期
                    that.detail = res.data.questionnaireMpqExtend;
                    that.question = res.data.questionnaireMpqExtend.subjectsList;
                    // that.answer = res.data.questionnaireAnswerValues;
                    let setArr = new Set();
                    res.data.questionnaireAnswerValues.forEach(element => {
                        setArr[element.subjectsId] = element;
                    });
                    console.log('答案', setArr)
                    that.question.forEach(element => {
                        let info = setArr[element.id];
                        if (element.type == 0) {
                            // 单选 
                            element.answerValue = info.elements;

                        } else if (element.type == 1) {
                            // 多选
                            element.answerValue = info.elements.split(',');


                        } else {
                            element.answerValue = info.text;

                        }
                    });
                }
            })
        },
        formatTime(time) {
            return time ? uni.$u.timeFormat(new Date(time * 1000), 'yyyy-mm-dd hh:MM') : ''
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
        }

    }

}
</script>
 