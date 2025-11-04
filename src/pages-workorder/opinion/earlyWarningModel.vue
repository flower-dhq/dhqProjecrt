<!--  -->
<template>
    <view class='page' :style="[THEME_CSS_VAR]">
        <!-- 预警区域 预警项目 进展详情 处理附件
汇报进展 进展详情
关闭类型 关闭备注 关闭附件 -->
        <u--form labelPosition="left" labelWidth="100" :borderBottom="false" :model="params" :rules="rules" ref="uForm">
            <u-form-item v-if="type == 1" label="预警项目" :required="true" prop="userInfo.name" borderBottom ref="item1">
                <view @click="navigate" class="cell-box">{{ params.projectName }}</view>
                <u-icon slot="right" name="arrow-right"></u-icon>
            </u-form-item>
            <u-form-item v-if="type == 3" label="关闭类型" :required="true" prop="userInfo.name" borderBottom ref="item1">
                <u-radio-group v-model="params.closeType" placement="row">
                    <u-radio :customStyle="{ marginRight: '8px' }" name="1" label="1">预警误报</u-radio>
                    <u-radio label="0" name="0">正常关闭</u-radio>
                </u-radio-group>
            </u-form-item>
            <u-form-item :label="type == 3 ? '关闭备注' : '进展详情'" :required="true" prop="userInfo.name" borderBottom
                slot-scope="" ref="item1">
                <u--textarea v-model="params.remark" placeholder="请输入汇报内容(200字以内)"></u--textarea>
            </u-form-item>
            <u-form-item :label="type == 3 ? '关闭附件' : '处理附件'" :borderBottom="false" prop="userInfo.name" ref="item1">
            </u-form-item>
            <u-upload name="upload" :fileList="fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
                @delete="deleteImg" />
        </u--form>
        <view class="button-box">
            <text class="storage" @click="cancel()">取消</text>
            <text class="submit" @click="clickButton(1)">确认</text>
        </view>
        <!-- 处理预警 -->


        <!-- 汇报进展 -->
        <!-- 关闭预警 -->

        <!-- 所有功能通用附件上传 -->
    </view>
</template>

<script>
import { uploadMutiFile } from '@/service/landcrm'
import { confirmreportProgress, reportProgress, closeProgress } from '@/service/wechatguanjia'

export default {
    components: {},
    data() {
        return {
            type: 0,
            params: {
                recordId: '',
                areaId: '',
                areaName: '',
                projectId: '',
                projectName: '',
                closeType: '0',//关闭类型：1预警误报，0正常关闭
                remark: '',
                attachmentUrl: '',
            },
            fileList: [],
            rules: {
                // 'userInfo.name': {
                //     type: 'string',
                //     required: true,
                //     message: '请填写姓名',
                //     trigger: ['blur', 'change']
                // },
                // 'userInfo.sex': {
                //     type: 'string',
                //     max: 1,
                //     required: true,
                //     message: '请选择男或女',
                //     trigger: ['blur', 'change']
                // },
            },
        };
    },
    computed: {},
    watch: {},
    onReady() {
        this.$refs.uForm.setRules(this.rules)

    },
    onLoad(options) {
        this.params.recordId = options.recordId;
        this.type = options.type;
        if( options.areaId && options.areaId != "null" && options.areaName  && options.areaName != "null" 
            && options.projectId && options.projectId != "null" && options.projectName && options.projectName != "null"){
            this.params.areaId = options.areaId
            this.params.areaName = options.areaName
            this.params.projectId = options.projectId
            this.params.projectName = options.projectName
          }
        this.onUniEvent();
    },
    methods: {
        sexSelect(e) {
            this.model1.userInfo.sex = e.name
            this.$refs.uForm.validateField('userInfo.sex')
        },
        navigate() {
            uni.navigateTo({ url: `/pages-a/related-submission/select-project?goback=1` });

        },
        // 监听事件
        onUniEvent() {
            // 监听选择项目
            uni.$on('select-project', ({ type, data }) => {
                const { areaName, projectName, areaId, projectId } = data
                this.params.areaId = areaId;
                this.params.areaName = areaName;
                this.params.projectId = projectId;
                this.params.projectName = projectName;
            });
        },
        // 上传图片
        afterRead(evt) {
            uploadMutiFile({ filePath: evt.file.url, name: 'file' }).then((res) => {
                if (res.success) {
                    const file = res.fileInfo || {};
                    this.fileList.push({ ...file, url: file.resPath });
                }
            });
        },
        // 删除图片
        deleteImg(evt) {
            this.fileList.splice(evt.index, 1);
        },
        clickButton(type) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];//上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.$vm.customFun(true)
            if (type != 0) {
                let url = [];
                this.fileList.forEach(item => {
                    url.push(item.url);
                })
                this.params.attachmentUrl = url.join(';');
            }
            console.log('图片',this.params.attachmentUrl);
            if (this.type == 1) {
                // 处理预警 
                this.submitProgress();
            } else if (this.type == 2) {
                // 汇报进展
                this.report();

            } else if (this.type == 3) {
                // 关闭预警
                this.close();
            } else if (type == 0) {
                // 取消
                this.cancel();
            }
        },
        submitProgress() {
            if (!this.params.remark) {
                uni.showToast({
                    title: '请填写进展详情',
                    icon: 'none'
                })
                return false
            }
            var params = {
                data: {
                    areaId: this.params.areaId,
                    areaName: this.params.areaName,
                    projectId: this.params.projectId,
                    projectName: this.params.projectName,
                    remark: this.params.remark,
                    attachmentUrl: this.params.attachmentUrl,
                    recordId: this.params.recordId
                },
                hideLoading: true,
                // responseToast: false
            }
            confirmreportProgress(params).then(res => {
                if (res.status == 200) {
                    uni.showToast({
                        title: '操作成功！',
                        duration: 2000,
                        icon: 'none',
                    });
                    setTimeout(() => {
                        setTimeout(() => {
                            uni.navigateBack({
                                url: `/pages-workorder/opinion/detail?recordId=${this.params.recordId}`
                            });
                        }, 300);
                    }, 300);
                }else {
                    uni.showToast({
                    title: res.message,
                    icon: 'none'
                  })
                }
            })
        },
        close() {
            if (!this.params.remark) {
                uni.showToast({
                    title: '请填写关闭备注',
                    icon: 'none'
                })
                return false
            }
            var params = {
                data: {
                    remark: this.params.remark,
                    attachmentUrl: this.params.attachmentUrl,
                    recordId: this.params.recordId,
                    closeType: this.params.closeType,//关闭类型：1预警误报，0正常关闭
                },
                hideLoading: true
            }
            closeProgress(params).then(res => {
                if (res.status == 200) {
                    uni.showToast({
                        title: '操作成功！',
                        duration: 2000,
                        icon: 'none',
                    });
                    setTimeout(() => {
                        setTimeout(() => {
                            uni.navigateBack({
                                url: `/pages-workorder/opinion/detail?recordId=${this.params.recordId}`
                            });
                        }, 300);
                    }, 300);
                }else {
                    uni.showToast({
                    title: res.message,
                    icon: 'none'
                  })
                }
            })
        },
        report() {
            if (!this.params.remark) {
                uni.showToast({
                    title: '请填写进展详情',
                    icon: 'none'
                })
                return false
            }
            var params = {
                data: {
                    remark: this.params.remark,
                    attachmentUrl: this.params.attachmentUrl,
                    recordId: this.params.recordId,
                },
                hideLoading: true
            }
            reportProgress(params).then(res => {
                if (res.status == 200) {
                    uni.showToast({
                        title: '操作成功！',
                        duration: 2000,
                        icon: 'none',
                    });
                    setTimeout(() => {
                        uni.navigateBack({
                            url: `/pages-workorder/opinion/detail?recordId=${this.params.recordId}`
                        });

                    }, 300);
                }
            })
        },
        cancel() {
            let id = this.params.recordId;
            this.fileList = [];
            this.params = {
                recordId: '',
                areaId: '',
                areaIdName: '',
                projectId: '',
                projectName: '',
                closeType: '0',//关闭类型：1预警误报，0正常关闭
                remark: '',
                attachmentUrl: '',
            };

            uni.navigateBack({
                url: `/pages-workorder/opinion/detail?recordId=${id}`
            });
        }


    },
    created() {

    },
    mounted() {

    },
}
</script>
<style scoped lang="scss">
.page {
    padding: 0 30rpx;
}

.cell-box {
    width: 100%;
    // border: 1px solid
    height: 18px;
}

.button-box {
    margin: 60rpx auto 0 auto;
    padding-bottom: 30rpx;
    width: 640rpx;

    @include flx-dsp($jsc: center, $ali: center);

    text {
        @include flx-dsp($jsc: center, $ali: center);
        width: 320rpx;
        height: 80rpx;
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: 400;
        border-radius: 6rpx;
        border: 1rpx solid var(--app-primary-color);
    }

    .storage {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        color: var(--app-primary-color);
        background-color: transparent;
    }

    .submit {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        color: #fff;
        background-color: var(--app-primary-color);
    }
}
</style>