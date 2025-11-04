<template>
    <!-- 选择车牌 -->
    <view class="pages" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="flexBody">
            <view class="flexItem" :style="{ marginBottom: getmarginBottomHeight }">
                <view class="centerBg">
                    <view style="font-size: 18px;font-weight: 550;">添加车牌</view>
                    <view class="InputBody">
                        <view 
                            class="InputItem" 
                            v-for="(item, index) in carNumberList"
                            :key="index"
                        >
                            <input
                                v-model="item.label"
                                :ref="'input' + index"
                                :disabled="index == 7 && checkboxValue1.length < 1"
                                maxlength="1"
                                @input="numberChange(index)"
                                @focus="openCarModal(index)"
                            />
                        </view>
                    </view>
                    <view class="checkboxBody">
                        <u-checkbox-group v-model="checkboxValue1" @change="changeNewEnergy">
                            <u-checkbox 
                                name="isNewEnergy" 
                                activeColor="var(--app-primary-color)" 
                                labelSize="14"
                                label="特殊车牌"
                            ></u-checkbox>
                        </u-checkbox-group>
                        <u-button 
                            text="确认" 
                            color="var(--app-primary-color)"
                            @click="submit"
                        ></u-button>
                    </view>
                </view>
            </view>
        </view>
        <u-keyboard
            mode="car"
            :autoChange="true" 
            :show="carObj.isShow" 
            :showTips="false"
            :overlay="false"
            safeAreaInsetBottom 
            @change="carValChange"
            @backspace="carDel" 
            @close="carCancel" 
            @cancel="carCancel"
            @confirm="carObj.isShow = false"
        />
    </view>
</template>

<script>
export default {
    data(){
        return{
            carNumberList: [
                {label: ''},
                {label: ''},
                {label: ''},
                {label: ''},
                {label: ''},
                {label: ''},
                {label: ''},
                {label: ''},
            ],
            checkboxValue1: [],
            carObj: {
                isShow: false,
                value: '', // 存储旧值
                index: 0
            },
        }
    },
    onLoad(){

    },

    onShow(){

    },

    computed:{
        getmarginBottomHeight() {
            return this.carObj.isShow ? 1000 + 'rpx' : 0;
        },
    },

    methods:{
        //  输入参数更改
        numberChange(index) {
            if ((this.carNumberList[index].label || this.carNumberList[index].label == 0) && 
                this.carNumberList.length != index + 1){
                this.$refs['input' + (index + 1)][0].focus = true;   //自动获取焦点
            }
            this.postData()
            if (!this.verificationCarNumber()) {
                this.carObj.isShow = false
            }
        },

        //  返回双向绑定
        postData(){
            let number = this.carNumberList.map(site => {
                return site.label
            })
            console.log('车牌', number)
        },

        openCarModal(index) {
            this.carObj.value = this.carNumberList[index]
            this.carObj.index = index
            this.carObj.isShow = true
        },

        carValChange(val) {
            const index = this.carObj.index
            this.carNumberList[index].label = val.toString();
            this.numberChange(index);
        },

        // 车牌号键盘的删除操作
        carDel() {
            const index = this.carObj.index
            this.carNumberList[index].label = "";
        },
        // 车牌号键盘的取消操作
        carCancel() {
            const index = this.carObj.index
            this.carNumberList.splice(index, 1, this.carObj.value)
            this.carObj.isShow = false
        },

        //选择新能源
        changeNewEnergy(val){
            this.carNumberList[7].label = "";
        },

        //校验车牌
        verificationCarNumber(){
            let self = this;
            let result = false;
            self.carNumberList.forEach((item, index)=>{
                if(self.checkboxValue1.length > 0 ){
                    if(item.label == ""){
                        result = true;
                    }
                }else{
                    if(index < 7 && item.label == ""){
                        result = true;
                    }
                }
            })
            return result
        },

        submit(){
            let self = this;
            if(self.verificationCarNumber()){
                self.toastWord({ text: "请输入完整车牌" })
                return false;
            }
            this.carObj.isShow = false
            let arr = this.carNumberList.map(item => {
                return item.label
            });  //["苏","B","1","2","3","4","5"]
            let str = arr.join("");    //车牌：苏B12345
            console.log("车牌："+str)
            this.$emit('tokeyboardshow',str)
        },

        // 提示文字
        toastWord(params) {
            const { text } = params;
            if (!text) return;
            uni.showToast({ title: text, icon: 'none' });
        },
    }
}
</script>

<style lang="scss" scoped>
.pages {
    // height: 100vh;
    padding-top: 0rpx;
    background-color: #f5f5f5;
}
.flexBody{
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // height: 100vh;
}
.flexItem{
    background: #fff;
    border-radius: 14rpx;
    width: 100%;
}
.centerBg{
    padding: 30rpx;
}
.InputBody{
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;
}
.InputItem{
    width: 10%;
}
.InputItem ::v-deep uni-input{
    display: inline;
}
.InputItem ::v-deep .uni-input-input{
    border: 1px solid #ececec !important;
    height: 96rpx;
    border-radius: 14rpx;
    text-align: center;
}
.InputItem ::v-deep .uni-input-input:focus{
    border: 1px solid var(--app-primary-color) !important;
}
.InputItem ::v-deep .uni-input-input:disabled{
    background: #f5f7fa;
}
.checkboxBody{
    margin-top: 30rpx;
}
.checkboxBody ::v-deep .u-checkbox-group--row{
    justify-content: flex-end;
}
.checkboxBody ::v-dee .u-button{
    width: 50%;
    margin-top: 30rpx;
}
</style>