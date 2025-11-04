<!--  -->
<template>
	<view class='page'>
		<u-cell-group class="whitebgColor">
			<u-cell :isLink="true" class="cell-item">
				<view slot="title"  >区域项目<text class="required">*</text></view>
				<view slot="value" class="cell-value">
					<input class="uni-input" placeholder="请选择" />
				</view>
			</u-cell>
			<u-cell :isLink="true" class="cell-item">
				<view slot="title"  >问题类型<text class="required">*</text></view>
				<view slot="value" class="cell-value">
					<input class="uni-input" placeholder="请选择" />
				</view>
			</u-cell>
			<u-cell :isLink="true" v-if="isRepair" class="cell-item">
				<view slot="title"  >位置<text class="required">*</text></view>
				<view slot="value" class="cell-value">
					<input class="uni-input" placeholder="请选择" />
				</view>
			</u-cell>
			<u-gap height="12" bg-color="#F3F4F7"></u-gap>
			<u-cell  :isLink="true" class="cell-item">
				<view slot="title" >紧急程序</view>
				<view slot="value" class="cell-value">
					<input class="uni-input" placeholder="请选择" />
				</view>
			</u-cell>
			<u-cell title="是否有偿" :isLink="false" v-if="isRepair" class="cell-item">
 				<view class="cell-value" slot="value">
					<u-radio-group v-model="radiovalue1" placement="row" size="15" @change="groupChange">
						<u-radio customStyle="marginBottom: 8px" v-for="(item, index) in radiolist1" :key="index"
							:label="item.name" :name="item.name" @change="radioChange">
						</u-radio>
					</u-radio-group>
				</view>

			</u-cell>
			<u-cell title="管理设备" :isLink="false" class="cell-item"> 
				<view slot="right-icon">
					<u-icon name="scan" size="25" color="#2761FF"></u-icon>
				</view>
				<view slot="value" class="cell-value"></view>
			</u-cell>
			<u-cell :isLink="true" class="cell-item">
				<view slot="title"   >报修人<text class="required">*</text></view>
				<view slot="value" class="cell-value">
					<input class="uni-input" placeholder="请选择" />
				</view>
			</u-cell>
			<u-cell :isLink="false" class="cell-item">
				<view slot="title" >联系电话</view> 

				<view slot="value" class="cell-value">
					<input class="uni-input" placeholder="请输入" />
				</view>
			</u-cell>
		</u-cell-group>
		<u-gap height="12" bg-color="#F3F4F7"></u-gap>
		<view class="whitebgColor textbox">
			<textarea class="utext" placeholder-style="color:#CCCCCC" placeholder="请输入详细描述">
											</textarea>
			<view class="text-plus">
				<u-icon name="plus" color="#CCCCCC" size="60"></u-icon>
			</view>
		</view>
		<view class="button-box">
			<view class="bt-zc">暂存</view>
			<view class="bt-tj">提交</view>
		</view>
	</view>
</template>

<script>

export default {
	components: {},
	data() {
		return {
			isRepair: true,//是否报修
			// 基本案列数据
			radiolist1: [{
				name: '有偿维修',
				disabled: false
			},
			{
				name: '无偿维修',
				disabled: false
			}
			],
			// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
			radiovalue1: '有偿维修',
		};
	},
	computed: {},
	watch: {},
	methods: {
		groupChange(n) {
			console.log('groupChange', n);
		},
		radioChange(n) {
			console.log('radioChange', n);
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
	box-sizing: border-box;
	background-color: #F3F4F7;
	width: 100%;
	height: 100%;
}

.whitebgColor {
	background: #FFFFFF;
	&::deep .u-cell{
		border: 1px solid;
	}
}
.whitebgColor ::deep .u-cell-group__wrapper{
	border: 1px solid;
}

.required {
	color: red;
}

.textbox {
	padding: 10px;
}

.utext {
	width: 100%;
}

.text-plus {
	border: 1px dashed #BDBDBD;
	width: 148rpx;
	height: 148rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.button-box {

	font-size: 32rpx;
	display: flex;
	text-align: center;
	padding: 40rpx 40rpx;

	.bt-zc {
		color: #2761FF;
		border: 1px solid #2761FF;
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;

	}

	.bt-tj {
		border: 1px solid #2761FF;
		color: #FFFFFF;
		background: #2761FF;
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;

	}
}

.cell-value {
	width: 68%;
 } 
.cell-item ::v-deep .u-cell__body__content{
	flex: none !important;
	width: 25%;
 	} 
</style>