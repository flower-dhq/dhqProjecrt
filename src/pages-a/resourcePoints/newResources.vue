<style lang="scss" scoped>
.page {
    background: #F9F9F9;
    height: 100vh;
    box-sizing: border-box;
}

.form-bg {
    background: #FFFFFF;
}

.u-form {
    background: #FFFFFF;

}

::v-deep .u-form .u-form-item {
    padding: 0 15px !important;

}

::v-deep .u-form .u-form-item__body__left__content__required {
    right: -9px !important;
    left: auto !important;
}

::v-deep .u-radio-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.foot-btn {
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    gap: 10px;
    padding: 20px;

    .btn-edit {
        height: 80rpx;
        line-height: 80rpx;
        color: #1989F7;
        border: 1px solid #1989F7;
        flex: 1;
        border-radius: 8rpx;
    }

    .btn-delete {
        height: 80rpx;
        line-height: 80rpx;
        color: #FFFFFF;
        background: #1989F7;
        border: 1px solid #1989F7;
        flex: 1;
        border-radius: 8rpx;
    }
}
.all-detail{
	width: 100%;
	min-height:1214rpx;
}
</style>
<template>
    <view class="page">
				<view class="all-detail" v-if="false">
					<view class="top">
						<view class="cell-box-pd">
							<view class="title">所属项目：</view>
							<view class="txt">{{editItem.projectName}}</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源分类：</view>
							<view class="txt">{{editItem.resourceMenuName}}</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源属性：</view>
							<view class="txt">{{editItem.resourceType}}</view>
						</view>
					</view>
					<view class="top">
						<view class="cell-box-pd">
							<view class="title">资源编码：</view>
							<view class="txt">{{editItem.resourceCode}}</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源名称：</view>
							<view class="txt">{{editItem.resourceName}}</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源面积(m²)：</view>
							<view class="txt">{{editItem.leaseArea}}</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源图片：</view>
							<view class="img-list">
								<!-- <image></image> -->
							</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源排序：</view>
							<view class="txt">{{editItem.sort}}</view>
						</view>
					</view>
				</view>
        <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
        <view class="form-bg">
            <u--form class="uForm" labelPosition="left" labelWidth="auto" :model="editItem" :rules="rules" ref="uForm">
                <u-form-item label="所属项目" required prop="projectId" borderBottom ref="item1"
                    @click="!canNotSelectPorject?jump('select-project'):''">
                    <u--input inputAlign="right" readonly v-model="editItem.projectName" placeholder="请选择"
                        border="none"></u--input>
                    <u-icon v-if="!isGoEdit" slot="right" name="arrow-right" color="#999999" style="left:0;right: -5px;"></u-icon>

                </u-form-item>
                <u-form-item label="资源分类" required prop="resourceMenuId" borderBottom ref="item1"
                    @click="!canNotSelectPorject?jump('select-category'):''">
                    <u--input inputAlign="right" v-model="editItem.resourceMenuName" disabled disabledColor="#ffffff"
                        placeholder="请选择" border="none"></u--input>
                    <u-icon  v-if="!isGoEdit"  slot="right" name="arrow-right" color="#999999"></u-icon>
                </u-form-item>
                <u-form-item label="资源属性" required prop="resourceType" ref="item1">
                    <u-radio-group v-model="editItem.resourceType" placement="row">
                        <u-radio name="1" style="margin-right:20rpx;" label="单一资源" :disabled="!isGoEdit"></u-radio>
                        <u-radio name="2" label="公共资源" :disabled="!isGoEdit"></u-radio>
                    </u-radio-group>
                </u-form-item>
								<u-form-item label="资源状态" v-if="!isGoEdit" required prop="resourceType" :borderBottom="false" ref="item1">
								    <u--input inputAlign="right" v-model="editItem.usingStateName" disabled disabledColor="#ffffff"
								        placeholder="请选择" border="none"></u--input>
								</u-form-item>
                <u-gap height="10" bgColor="#F9F9F9"></u-gap>
                <u-form-item label="资源编码" required prop="resourceCode" borderBottom ref="item1">
                    <u--input inputAlign="right" :disabled="!isGoEdit" v-model="editItem.resourceCode" placeholder="请输入" border="none"></u--input>
                </u-form-item>
                <u-form-item label="资源名称" required prop="resourceName" borderBottom ref="item1">
                    <u--input inputAlign="right" :disabled="!isGoEdit" v-model="editItem.resourceName" placeholder="请输入" border="none"></u--input>
                </u-form-item>
                <u-form-item label="资源面积(㎡)" prop="leaseArea" borderBottom ref="item1">
                    <u--input inputAlign="right" :disabled="!isGoEdit" v-model="editItem.leaseArea" placeholder="请输入" border="none"></u--input>
                </u-form-item>
                <u-form-item labelPosition="top" label="资源图片" :borderBottom="false" ref="item1">
                    <u-upload style="margin-top: 20px;" name="upload" :fileList="fileList" :maxCount="9" previewFullImage sizeType="compressed"
                        @afterRead="afterRead" @delete="deletePic"  :disabled="!isGoEdit"/>
                </u-form-item>
                <u-gap height="10" bgColor="#F9F9F9"></u-gap>

                <u-form-item label="资源排序"  required prop="sort" borderBottom ref="item1">
                    <u--input inputAlign="right" :disabled="!isGoEdit" v-model="editItem.sort" placeholder="请输入" border="none" type="number"></u--input>
                </u-form-item>
            </u--form>
        </view>
        
				<u-button v-if="!isEdit" text="确定" color="#1989F7"
            :customStyle="{ flex: '0 0 240rpx', width: '90%',  height: '88rpx', margin: '40rpx auto' }" @click="submit" />
        <view class="foot-btn" v-if="isEdit && !isGoEdit">
						<view class="btn-edit" @click="goSubmit">编辑</view>
            <view class="btn-delete" @click="deleteResource">删除</view>
        </view>
        <view class="foot-btn" v-if="isEdit && isGoEdit">
            <view class="btn-edit" @click="submit">保存</view>
            <view class="btn-delete" @click="goBack">取消</view>
        </view>        

    </view>
</template>

<script>
import { uploadMutiFile } from '@/service/landcrm'
import { addResourceManger, editResourceManger, getResourceByResourceId, getResourceMenuMangerDetailById, deleteResourceManger } from '@/service/leasing'
export default {
    data() {
        return {
            showSex: false,
            fileList: [],
            extraParameters: { //额外的参数

            },
            isEdit: false,
						isGoEdit:false,
            showEdit: true,
            resourceMenuId: '',//分类ID
            resourceId: '',//资源ID
            editItem: {
                areaId: '',
                areaName: '',
                projectId: '',
                projectName: '',
                resourceType: '1', //资源类型1:单一资源 2 公共资源
                resourceMenuId: '', //分类ID
                resourceMenuName: '',//分类名称
                sapNumber: '',
                resourceName: '',//资源名称
                resourceCode: '',//资源编码
                leaseArea: '',//面积
                sort: '',//排序
                path: '',//资源图片 
								usingStateName:'',//资源状态
            },
            model1: {
                userInfo: {
                    name: "",
                    sex: "",
                },
            },
            rules: {
                "projectId": {
                    type: "string",
                    required: true,
                    message: "请选择项目",
                    trigger: ["blur", "change"],
                },
                "resourceMenuId": {
                    type: "string",
                    required: true,
                    message: "请选择资源分类",
                    trigger: ["blur", "change"],
                },

                "resourceType": {
                    type: "string",
                    max: 1,
                    required: true,
                    message: "请选择资源属性",
                    trigger: ["blur", "change"],
                },
                "resourceCode": {
                    type: "string",
                    required: true,
                    message: "请填写资源编码",
                    trigger: ["blur", "change"],
                },
                "resourceName": {
                    type: "string",
                    required: true,
                    message: "请填写资源名称",
                    trigger: ["blur", "change"],
                },
                "leaseArea": {
                    type: "string",
                    required: false,
                    message: "请填写面积",
                    trigger: ["blur", "change"],
                },
                "sort": {
                    type: "string",
                    required: true,
                    message: "请填写资源排序",
                    trigger: ["blur", "change"],
                }
            },
            radio: "",
            switchVal: false,
            categoriesList: [],
						isShowType:'',
						canNotSelectPorject:false,
        };
    },
    onReady() {
        //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
        this.$refs.uForm.setRules(this.rules);
    },
    onLoad(option) {
        if (option.resourceId) {
            uni.setNavigationBarTitle({
                title: '编辑资源'
            });
						this.isGoEdit = true
						this.canNotSelectPorject = true
            this.isEdit = true;
            this.showEdit = false;
            this.resourceId = option.resourceId;
            this.resourceMenuId = option.resourceMenuId;
            this.getResourceMenu();
            this.getResourcesDetail();

        }else{
					this.isGoEdit = true
				}
        this.onUniEvent();
    },
    methods: {
				goSubmit(){
					this.isGoEdit = true
					uni.setNavigationBarTitle({
					    title: '编辑资源'
					});
				},
				goBack(){
					this.isGoEdit = false
					// uni.setNavigationBarTitle({
					//     title: '资源详情'
					// });
					uni.navigateBack({animationType:'none'})
				},			
        // 删除图片
        deletePic(event) {
            debugger;
            this.fileList = [];
            this.editItem.path = "";
        },
        // 新增图片
        async afterRead(evt) {
            this.fileList = [];
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
            uploadMutiFile({ filePath: evt.file.url, name: 'file' }).then((res) => {
                if (res.success) {
                    const file = res.fileInfo || {};
                    this.fileList.push({ ...file, url: file.resPath });
                    this.editItem.path = file.resPath;
                }
            });
        },
        jump(key) {
            // 跳转页面
            if (key == 'select-project') {
                // 选择项目
                uni.navigateTo({ url: `/pages-a/related-submission/select-project?goback=1` });

            } else if (key == 'select-category') {
                // 选择分类
                if (!this.editItem.projectId || this.editItem.projectId == '') {
                    uni.showToast({
                        title: '请选择项目',
                        none: 'none',
                        duration: 2000
                    });
                    return;
                }
                uni.navigateTo({ url: `/pages-a/resourcePoints/resourceCategories?projectId=${this.editItem.projectId}` });


            }

        },
        submit() {
            this.$refs.uForm.validate().then(res => {
                var params = {
                    data: {
                        resourceMessage: JSON.stringify({
                            resourceType: this.editItem.resourceType, //资源类型1:单一资源 2 公共资源
                            resourceMenuId: this.editItem.resourceMenuId, //分类ID
                            sapNumber: '',
                            resourceName: this.editItem.resourceName,//资源名称
                            resourceCode: this.editItem.resourceCode,//资源编码
                            leaseArea: this.editItem.leaseArea,//面积
                            sort: this.editItem.sort,//排序
                            path: this.editItem.path,//资源图片
                        })
                    }
                }
                if (this.isEdit) {
                    // 编辑
                    params = {
                        data: {
                            resourceMessage: JSON.stringify({
                                resourceId: this.resourceId,
                                resourceType: this.editItem.resourceType, //资源类型1:单一资源 2 公共资源
                                resourceMenuId: this.editItem.resourceMenuId, //分类ID
                                sapNumber: '',
                                resourceName: this.editItem.resourceName,//资源名称
                                resourceCode: this.editItem.resourceCode,//资源编码
                                leaseArea: this.editItem.leaseArea,//面积
                                sort: this.editItem.sort,//排序
                                path: this.editItem.path,//资源图片
                            })
                        }
                    }
                }
                let result = this.isEdit ? editResourceManger(params) : addResourceManger(params);
                result.then(res => {
                    if (res.status == 200) {
                        uni.showToast({
                            title: '操作成功！',
                            duration: 2000,
                            icon: 'none',
                        });
                        setTimeout(() => {
                            uni.redirectTo({
                                url: `/pages-a/resourcePoints/list`
                            });
                        }, 300);
                    }else{
											uni.showToast({
											    title: res.message,
											    duration: 2000,
											    icon: 'none',
											});
										}
                })
            })
        },
        deleteResource() {
            var that = this;
            uni.showModal({
                title: '提示',
                content: '是否删除，删除后无法找回！',
                success: function (res) {
                    if (res.confirm) {
                        var params = {
                            data: {
                                resourceIds: that.resourceId
                            }
                        }
                        deleteResourceManger(params).then(res => {
                            if (res.status == 200) {
                                uni.showToast({
                                    title: '操作成功！',
                                    duration: 2000,
                                    icon: 'none',
                                });
                                setTimeout(() => {
                                    uni.navigateBack({
                                        url: `/pages-a/resourcePoints/list`
                                    });
                                }, 300);
                            }
                        });
                    }
                }
            });
        },
        // 监听事件
        onUniEvent() {
            // 监听选择项目
            uni.$on('select-project', ({ type, data }) => {
                const { areaName, projectName, areaId, projectId } = data;
                this.editItem.projectId = projectId;
                this.editItem.areaId = areaId;
                this.editItem.projectName = projectName;
                this.editItem.areaName = areaName;
            });
            // 监听选择资源类型

            uni.$on('select-category', ({ data }) => {
                const { resourceMenuId, resourceMenuName } = data;
                this.editItem.resourceMenuId = resourceMenuId + '';
                this.editItem.resourceMenuName = resourceMenuName;

            });
        },
        getResourceMenu() {
            var that = this;
            var params = {
                data: {
                    resourceMenuId: that.resourceMenuId
                },
                hideLoading: true,
                responseToast: false,
            }
            getResourceMenuMangerDetailById(params).then(res => {
                if (res.status == 200) {
                    const { projectId, projectName, resourceMenuId, resourceName } = res.data.resource;
                    that.editItem.projectId = projectId + '';
                    that.editItem.projectName = projectName;
                }

            })
        },
        // 查询详情
        getResourcesDetail() {
            let that = this;
            var params = {
                data: {
                    resourceId: that.resourceId
                },
                hideLoading: true,
                responseToast: false,
            }
            getResourceByResourceId(params).then(res => {
                if (res.status == 200) {
                    let info = res.data;
                    that.editItem.resourceType = info.resourceType + '';
                    that.editItem.resourceMenuName = info.resourceMenuPath;
                    that.editItem.resourceMenuId = info.resourceMenuId + '';
                    that.editItem.resourceName = info.resourceName;
                    that.editItem.resourceCode = info.resourceCode;
                    that.editItem.leaseArea = info.leaseArea + '';
                    that.editItem.sort = info.sort + '';
                    that.editItem.usingStateName = info.usingStateName + '';
                    if (info.path) {
                        that.editItem.path = info.path;
                        that.fileList.push({ url: info.path });
                    }


                }
            })
        }
    },

};
</script>