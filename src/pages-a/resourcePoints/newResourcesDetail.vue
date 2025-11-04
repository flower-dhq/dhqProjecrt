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
	box-sizing: border-box;
	padding: 24rpx 20rpx 0;
	.top{
		width: 100%;
		background-color: #fff;
		border-radius: 5rpx;
		margin-bottom: 24rpx;
		padding: 22rpx 0;
		.cell-box-pd{
			width: 100%;
			display: flex;
			align-items: center;
			// min-height: 56rpx;
			padding: 8rpx 0;
			.title{
				width: 228rpx;
				box-sizing: border-box;
				padding-left: 30rpx;
				font-size: 28rpx;
				font-weight: unset;
				color: #666666;
			}
			.img-list{
				image{
					width: 160rpx;
					height: 160rpx;
				}
			}
			.txt{
				flex: 1;
				font-size: 28rpx;
				font-weight: unset;
				color: #666666;
			}
		}
	}
}
</style>
<template>
    <view class="page">
				<view class="all-detail">
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
							<view class="txt">{{editItem.resourceTypeName}}</view>
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
								<image mode="aspectFill" :src="editItem.path"></image>
							</view>
						</view>
						<view class="cell-box-pd">
							<view class="title">资源排序：</view>
							<view class="txt">{{editItem.sort}}</view>
						</view>
					</view>
				</view>
        <view class="foot-btn">
						<view class="btn-edit" @click="goSubmit">编辑</view>
            <view class="btn-delete" @click="deleteResource">删除</view>
        </view>     

    </view>
</template>

<script>
import {getResourceByResourceId, getResourceMenuMangerDetailById, deleteResourceManger } from '@/service/leasing'
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
            radio: "",
            switchVal: false,
            categoriesList: [],
						isShowType:'',
						isGoEdit:false,
        };
    },
    onReady() {
        //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
        // this.$refs.uForm.setRules(this.rules);
    },
		onShow(){
			if(this.isGoEdit){
				this.isGoEdit = false
				this.getResourcesDetail();
			}
		},
    onLoad(option) {
        if (option.resourceId) {
            uni.setNavigationBarTitle({
                title: '资源详情'
            });
						this.isGoEdit = false
            this.isEdit = true;
            this.showEdit = false;
            this.resourceId = option.resourceId;
            this.resourceMenuId = option.resourceMenuId;
            this.getResourceMenu();
            this.getResourcesDetail();
        }
    },
    methods: {
				goSubmit(){
					this.isGoEdit = true
					let url = `/pages-a/resourcePoints/newResources`
					url = url + `?resourceId=${this.resourceId}&resourceMenuId=${this.resourceMenuId}`
					uni.navigateTo({ url: url,animationType:'none',animationDuration:0, });
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
                    that.editItem.resourceTypeName = info.resourceTypeName
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