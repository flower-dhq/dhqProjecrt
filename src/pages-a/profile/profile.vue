<style lang="scss" scoped>
.profile {
    padding-top: 40rpx;
    @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
    padding-left: 34rpx;
    padding-right: 34rpx;
    .form {
        margin-top: 10rpx;
        width: 100%;
        height: 100%;
        .slot-icon {
            margin-left: 10rpx;
        }
        ::v-deep .slot-content {
            // width: 552rpx;
            display: flex;
            .uni-input-input {
                text-align: right;
            }
            .uni-input-placeholder {
                text-align: right;
            }
            & > text {
                display: block;
                text-align: right;
            }
        }
        ::v-deep input,
        ::v-deep .u-input__content__field-wrapper__field {
            text-align: right !important;
        }
        ::v-deep .pdr .u-input__content__field-wrapper__field {
              /* #ifdef H5 */
         padding-right: 14rpx;
	        /* #endif */
	        /* #ifdef MP-WEIXIN */
             padding-right: 14rpx;
             /* #endif */
              /* #ifdef APP-PLUS */
              padding-right: 5rpx;
              /* #endif */
        }
       
        ::v-deep .pdr {
            padding-right: 32rpx;
        }
       
        ::v-deep .shorter {
            // width: 508rpx;
            flex: 1;
        }
        ::v-deep .u-icon__icon--info {
            color: #566075 !important;
        }
      ::v-deep  .u-cell__body {
        position: relative;
        .iconRigh {
            position: absolute;
            color: red;
            left: 134rpx;
             /* #ifdef APP-PLUS */
            left: 125rpx;
         /* #endif */
        }
      } 
        .iconRighs {
            color: red;
            position: relative;
            right: 61rpx;
             /* #ifdef APP-PLUS */
            right: 3rpx;
         /* #endif */
        }
       
    }
    .submit-Box {
        display: flex;
        width: 87.88%;
        ::v-deep .u-button {
           height: 68rpx !important;
        }
    }
    .submit-button {
        flex: 1;
    }
    ::v-deep .submit-Box .u-button{
        margin: 80rpx 20rpx 0 20rpx;
        flex: 1;
    }
    ::v-deep .slot-content .u-button{
        margin-left:  20rpx;
        width: 46% !important;
        // flex: 1;
    }
    .code-button {
        width: 50%;
        margin-left: 10rpx;
    }
}
::v-deep .u-cell-group  .u-cell__body {
    padding: 22rpx 6rpx !important;
}
.user-icon {
    height: 200rpx;
    width: 200rpx;
    border-radius: 200rpx;
    image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 100rpx;
    }
}
</style>

<template>
    <view class="profile" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <!-- 头像 -->
        <view class="user-icon">
            <image :src=" form.headImg ? form.headImg : require(`@/static/${[THEME_NAME]}/index/default-photo.png`)" mode="scaleToFill" @click="previewImage(form.headImg)"></image>
        </view>
        <!-- 表单 -->
        <view class="form">
            <u-cell-group :border="false" style="padding:0 20px;">
                <u-cell title="头像" :isLink="true" arrow-direction="right" @click="uploadAvatarShow"></u-cell>
                <u-cell title="昵称" :required="true">
                    <view class="slot-content pdr" slot="value">
                        <u--input v-model="form.nickname" placeholder="请输入昵称" border="none" ></u--input>
                        <u-icon @click="form.nickname = ''" v-show="form.nickname.trim() !== ''" class="slot-icon" name="close-circle-fill" color="#C6C7D2" size="20"></u-icon>
                    </view>
                </u-cell>
                <u-cell title="真实姓名">
                    <text slot="value" class="iconRigh" >*</text>
                    <view class="slot-content pdr" slot="value">
                        <u--input v-model="form.realName" placeholder="请输入真实姓名" border="none" ></u--input>
                        <u-icon @click="form.realName = ''" v-show="form.realName.trim() !== ''" class="slot-icon" name="close-circle-fill" color="#C6C7D2" size="20"></u-icon>
                    </view>
                </u-cell>
                <u-cell title="性别" :isLink="true" arrow-direction="right" @click="sexShow = true">
                    <view class="slot-content shorter" slot="value">
                        <u--input v-model="form.sex" border="none" readonly></u--input>

                    </view>
                </u-cell>
                <u-cell title="生日" :isLink="true" arrow-direction="right" @click="birthShow = true">
                    <view class="slot-content shorter" slot="value">
                        <u--input v-model="form.birthday" border="none" readonly></u--input>
                    </view>
                </u-cell>
                <u-cell title="联系电话" :required="true">
                    <text slot="value" class="iconRigh">*</text>
                    <view class="slot-content pdr" slot="value">
                        <u--input v-model="form.phone" type="number" @change="changePhone" placeholder="请输入联系电话" border="none"></u--input>
                        <u-icon @click="form.phone = '',phoneFalg=true" v-show="form.phone.trim() !== ''" class="slot-icon" name="close-circle-fill" color="#C6C7D2" size="20"></u-icon>
                    </view>
                </u-cell>
                <u-cell v-if="phoneFalg" title="验证码" :required="true">
                    <text slot="value" class="iconRighs">*</text>
                    <view class="slot-content" slot="value">
                        <u--input border="none" v-model="smsCode"  :maxlength="6" placeholder="请填写验证码"></u--input>
                        <u-button class="code-button" @tap="getCode" :readonly="codeDisable" :text="codeTitle" type="success" size="small"></u-button>
                    </view>
                </u-cell>
            </u-cell-group>
        </view>
        <!-- 提交按钮 -->
        <view class="submit-Box">
            <u-button class="submit-button" type="primary" :plain="true" shape="circle" text="取消" @click="toMine"></u-button>
            <u-button class="submit-button" type="primary" shape="circle" text="保存" @click="saveButton"></u-button>

        </view>
        <!-- 选照片 -->
        <u-action-sheet :actions="list" :show="avatarShow" @close="avatarShow = false" @select="select"></u-action-sheet>
        <!-- 选择性别 -->
        <u-picker closeOnClickOverlay @close="sexShow = false" @cancel="sexShow = false" :show="sexShow" :columns="sexList" @confirm="sexConfirm"></u-picker>
        <!-- 生日 -->
        <u-datetime-picker closeOnClickOverlay @close="birthShow = false" :show="birthShow" v-model="birthModel" mode="date" :minDate="minDate" :maxDate="maxDate" @cancel="birthShow = false" @confirm="confirmDate"></u-datetime-picker>
        <!-- 提交前确认 -->
        <u-modal width="280" :show="confirmShow" content="您确认要保存个人信息吗？" @cancel="confirmShow = false" showCancelButton @confirm="saveUserInfo"></u-modal>
        <!-- toast提示 -->
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
import { selectTboMemberInfo, fileUpload, fileDownload, editTboMemberInfo, getSmsCode, checkCode } from '@/service/community';
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
export default {
    data() {
        return {
            form: {
                headImg: '',
                nickname: '',
                realName: '',
                sex: '',
                birthday: '',
                phone: '',
                oldPhone: '',
            },
            fileObj: null,
            avatarShow: false,
            list: [
                {
                    name: '相机拍照',
                    value: 'camera',
                },
                {
                    name: '从相册中选择',
                    value: 'album',
                },
            ],
            sexShow: false,
            sexList: [['男', '女']],
            birthShow: false,
            birthModel: Number(new Date()),
            confirmShow: false,
            saving: false,
            uuid: '',
            phoneFalg: false,
            smsCode: '',
            codeTitle: '获取验证码',
            codeDisable: false, //获取验证码是否可点击
            timeNum: 60,
        };
    },
    computed: {
        minDate() {
            return utils.formatDate({ value: '1800-01-01', type: 'd2s' });
        },
        maxDate() {
            return  utils.formatDate({ value: Number(new Date()), type: 'd2s' });
        }
    },
    onLoad() {
        this.getProfile();
    },
    methods: {
			async uploadAvatarShow(){
				const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera', 'readStorage']})
				if (code !== 1 && code !== -2) {
					return
				}
				this.avatarShow = true
			},
        // 保存按钮
        saveButton() {
            const stop = this.verifyForm();
            if (stop || this.saving) return;
            if (this.phoneFalg && this.smsCode) {
                var params = {
                    data: {
                        mobile: this.form.phone,
                        code: this.smsCode,
                        model: 2 //1.登录  2.验证码
                    }
                }
                checkCode(params).then(result => {
                    if (result.status != '200') {
                        if (invalidMsg) this.$refs.uToast.show({ message: "验证码错误" });
                    } else {
                        this.confirmShow = true;
                    }
                })
            } else {
                this.confirmShow = true;

            }
        },
        // 校验表单
        verifyForm() {
            const { realName, phone } = this.form;
            const phoneNumber = phone.trim();
            const realNameInvalid = realName.trim() === '' ? '请填写真实姓名' : '';
            const phoneInvalid = phoneNumber === '' ? '请选择填写联系电话' : !/\d{11}/.test(phoneNumber) ? '请输入正确的手机号码' : '';
            let invalidMsg = '';
            if (!invalidMsg && realNameInvalid) invalidMsg = realNameInvalid;
            if (!invalidMsg && phoneInvalid) invalidMsg = phoneInvalid;
            if (!invalidMsg && this.phoneFalg && !this.smsCode) invalidMsg = "请填写验证码";
            if (invalidMsg) this.$refs.uToast.show({ message: invalidMsg });
            return !!invalidMsg;

        },
        // 获取用户信息
        getProfile() {
            const { MEMBER_ID } = this.$constant;
            const memberId = utils.storageAction({ key: MEMBER_ID, action: 'get' });
            const args = {
                pathParams: `/${memberId}`,
            };
            selectTboMemberInfo(args).then((res) => {
                if (res.success) {
                    const { headimg, nickname, fullName, sex, birthDay, phoneNumber } = res.data;

                    this.form = {
                        headImg: headimg || require(`@/static/${[this.THEME_NAME]}/index/default-photo.png`),
                        nickname: nickname || '',
                        realName: fullName || '',
                        sex: sex || '',
                        birthday: birthDay || '',
                        phone: phoneNumber || '',
                        oldPhone: phoneNumber || ''
                    };
                }
            });
        },
        // 保存信息
        async saveUserInfo() {
            const { nickname, realName, sex, birthday, phone } = this.form;
            const { companyId } = commLogic.getProjectConfig();
            const { MEMBER_ID } = this.$constant;
            const memberId = utils.storageAction({ key: MEMBER_ID, action: 'get' });


            this.confirmShow = false;
            this.saving = true;
            uni.showLoading({ title: '加载中' });

            const args = {
                data: {
                    nickname,
                    fullName: realName,
                    sex,
                    birthDay: birthday,
                    phoneNumber: phone,
                    memberId,
                    companyId,
                },
                hideLoading: true,
				responseToast: false

            };

            if (this.fileObj) {
                const { data } = await this.uploadAvatar().catch((_) => { });
                const url = this.parseXml(data);

                if (url) {
                    args.data.headimg = url;
                    this.fileObj = null
                } else {
                    this.$refs.uToast.show({ message: '图片上传失败' });
                }
            }
            console.log(219, this.fileObj, args.data.headimg)

            editTboMemberInfo(args)
                .then((res) => {
                    this.saving = false;
                    uni.hideLoading();
                    if (res.success) {
                        const { O_USER_INFO } = this.$constant;
                        const userInfo = commLogic.setOwerUserInfo('profile', this.form)
                        utils.storageAction({ key: O_USER_INFO, action: 'set', value: userInfo });
                        this.$refs.uToast.show({ message: '保存成功'});
                        this.phoneFalg = false;
                        this.smsCode = "";
                    }else {
                        this.$refs.uToast.show({ message: res.message});

                    }
                })
                .catch((_) => {
                    this.saving = false;
                    uni.hideLoading();
                });
        },
        // 选择头像
        select({ value }) {
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: [value], //从相册选择
                success: async (res) => {
                    const { tempFilePaths, tempFiles } = res;
                    this.form.headImg = tempFilePaths[0];
                    this.fileObj = tempFiles[0];
                },
            });
        },
        // 解析图片
        parseXml(data) {
            let url = '';
            if (typeof data === 'string') {
                const [path] = data.match(/<fileWebPath>.+<\/fileWebPath>/) || [];
                url = typeof path === 'string' && path.replace('<fileWebPath>', '').replace('</fileWebPath>', '');
            }
            return url;
        },
        // 预览头像
        previewImage(src) {
            // debugger;
            uni.previewImage({
                urls: [this.form.headImg],
            });
        },
        // 上传头像
        async uploadAvatar() {
            const uuid = utils.uuid();
            const { name, size, path } = this.fileObj
            const { uniPlatform } = uni.getSystemInfoSync();
            const mpWeixinApp = uniPlatform === 'mp-weixin' || uniPlatform === 'app'
            const suffix = () => {
                const [suffix] = typeof path === 'string' && path.match(/\.[a-z]+$/) || []
                return suffix
            }
            const filename = mpWeixinApp ? `${uuid}${suffix() || '.png'}` : name;
            await fileUpload({
                filePath: this.form.headImg,
                name: 'file',
                header: {
                    fileid: uuid,
                    filename,
                    type: 1,
                    range: 0,
                    source: 's1',
                    totalsize: size,
                    filecreatetime: utils.formatDate({ value: new Date().getTime(), type: 's2d' }),
                },
                hideLoading: true,
            });
            return fileDownload({
                header: {
                    fileid: uuid,
                    type: 2,
                },
            });
        },
        // 确认生日
        confirmDate({ value }) {
            const dateStr = utils.formatDate({ value, format: 'YY-MM-DD', type: 's2d' });
            this.form.birthday = dateStr;
            this.birthShow = false;
        },
        // 性别选择
        sexConfirm({ value }) {
            this.form.sex = value[0];
            this.sexShow = false;
        },
        // 手机号码
        changePhone(value) {
            if (this.form.oldPhone === value) {
                this.phoneFalg = false;
            } else {
                this.phoneFalg = true;
            }
        },
        codeChange(text) {
            this.tips = text;
        },
        getCode() {
            var self = this;
            
          if(self.form.phone == '') {
            uni.showToast({
            title: '请输入手机号码',
            icon: 'none',
             }) 
              return
          }
           if(!/\d{11}/.test(self.form.phone)){
            uni.showToast({
            title: '请输入正确的手机号码',
            icon: 'none',
             }) 
            return 
          }
            const { PROJECT_TYPE } = self.$appConfig
            var params = {
                data: {
                    mobiles: self.form.phone,
                    model: 2, //1.登录  2.验证码
                    projectType: PROJECT_TYPE
                }
            }
            getSmsCode(params).then(res => {
                if (res.status == 200) {
                    self.countdown();
                } else {

                }
            })
        },
        countdown() { //倒计时
            var self = this;
            if (!self.codeDisable) {
                self.codeDisable = true;
                var time = self.timeNum;
                self.codeTitle = time + "s";
                var myTimes = setInterval(() => {
                    if (time > 0) {
                        time--;
                        self.codeTitle = time + "s";
                    }
                    else {
                        time = self.timeNum;
                        self.codeDisable = false;
                        self.codeTitle = '重新获取';
                        clearInterval(myTimes); //停止循环
                    }
                }, 1000);
            }
        },
        toMine() {
            uni.navigateBack({ delta: 1 })
        }
    },
};
</script> 