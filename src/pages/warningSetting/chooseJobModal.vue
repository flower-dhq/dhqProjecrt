<template>
    <div v-if="isVisible" class="full-screen-modal">
        <Card class="modal-content">
            <template #title>
                <div class="topTitle">选择岗位</div> 
            </template>
            <template #extra>
                <Button icon="md-close" @click="$emit('close')"></Button>
            </template>
            <Transfer
                :data="allJobs"
                :target-keys="targetKeys"
                :render-format="render"
                :titles="['岗位列表','已关联岗位']"
                :operations="['移除','关联']"
                :list-style="{width: '315px', height:'400px'}"
                @on-change="handleChange"></Transfer>
            </Card>
    </div>
</template>

<script>
import {postGroupList} from "@/service/landcrm.js"
export default {
    name:'chooseJobModal',
    props:{
        isVisible: Boolean,
        isWarnPosition: Boolean,//是否为预警岗位，如果不是则为汇报岗位
        associatedJobs:Array,
    },
    computed:{
        targetKeys(){
            let result = this.associatedJobs.map(item=>item.id);
            return result;
        },
    },
    data() {
            return {
                allJobs:[],
            }
    },
    mounted(){
        const { USER_INFO } = window.GlobalProperties.$constant || {};
        const { storageAction } = window.GlobalProperties.$utils || {};
        const { userid} = storageAction({ action: 'get', key: USER_INFO }) || {};
        let params = {
            data:{
                userId: userid,
            }
        }
        let self = this
        postGroupList(params).then(res =>{
            if(res.resultCode==200){
                let jobs = res.data[0].postList ?? []
                self.allJobs = jobs.map(item=>{
                    let result = item;
                    result.id = item.postId;
                    result.name = item.postName;
                    result.key = item.postId;
                    return result;
                })
                
            }
            console.log("self.allJobs",self.allJobs)
        })
    },
    methods:{
        render(item){
            return item.name;
        },
        handleChange(newTargetKeys, direction, moveKeys){
            console.log(newTargetKeys);
            console.log(direction);
            console.log(moveKeys);
            
            let result = this.allJobs.filter(item=>{
                let isIncluded = newTargetKeys.includes(item.id)
                return isIncluded
            })
            this.$emit("changeAssociatedJobs",result)
             
        }
    }
}
</script>

<style lang="scss" scoped>
.full-screen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  }
  .modal-content {
    width: 1000px; /* 或任何适合的宽度 */
    background-color: white;
  }
  .topTitle{
    font-size: 24px;
    font-weight: bold;
  }
</style>