<template>
  <!-- 公物交接 -->
  <!-- 详情 -->
 <div style="margin-top: 10px;" v-if="specialtyCode=='kefu'">
    <div class="leftline"></div><span class="titles">今日业务办理情况</span>
  <Row >
           <Col span="24" v-for="(item, index) in payloaddata" :key="index">
              <table>
                <tr :class="index==(payloaddata.length-1)?'tr':''">
                  <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%">{{item.title}}</td>
                  <td class="titlestd" style="width:37.5%">{{item.value}}</td>
                 </tr>
                 <tr v-for="(name, key) in item.children" v-if="item.children&&item.children.length>0">
                   <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%;padding-left: 80px;">{{name.title}}</td>
                   <td class="titlestd" style="width:37.5%">{{name.value}}</td>
                  </tr>
              </table>
            </Col>
    </Row>
  </div>
</template>

<script>
  import { ref, onMounted,onBeforeMount ,computed, defineProps} from 'vue';
  
  const props = defineProps({
    stage: String,
    payload: Object,
    specialtyCode: String,
  })
  let  selectItems = ref([])
  let  takeremark = ref('')
  let  handremark = ref('')
  let  tool = ref([])
  let  switched = ref(false)
  let  payloaddata = ref([])
  let  checkboxdata = ref([])
  let  inputtext = ref('')
 
  const switchChange = (value) =>{
        console.log(this.payload)
        this.$forceUpdate()
      }
  const addGood =() => {
        let id = new Date().valueOf();
        this.payload.children.push({
          id: id,
          title: "",
          isAdd: true,
          value: 1,
        });
        this.selectItems.push(id);
      }
  const changeCheck =(id) => {
        if (this.payload.children.indexOf(id) > -1) {
          this.selectItems.splice(this.selectItems.indexOf(id), 1);
        } else {
          this.selectItems.push(id);
        }
      }
  onMounted(()=> {
    let tooldata = []
      this.payload.children.forEach((item)=>{
        if(item.groupElementType=="jjb_group_type_kefu_work_item"){//当班事项及处理意见
          this.payloaddata = item.children
        }

      })
  })

  const title = computed({
        get: () => {   
        },
        set: ( param ) => {  
          if(props.stage == 4){
            return '交接班详情'  
          }
        },
      })
</script>

<style scoped="">

  table{
    width: 100%;
  }
  .left-td{
    width: 15%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    background-color: rgb(248,249,251);
    text-align: center;
  }
  .right-td{
    width: 35%;
    height: 40px;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    text-align: left;
    padding-left: 10px;
  }
  .tr>td{
    border-bottom:1px solid rgb(236,236,236)
  }
  .top-td{
    width: 20%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    background-color: rgb(248,249,251);
    text-align: center;
  }
  .titlestd{
    width: 20%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-right:1px solid rgb(236,236,236) ;
    text-align: center;
  }
  .leftline{
    width: 2px;
    height: 15px;
    background-color: rgb(24,144,255);
    position: relative;
    top: 10px;
  }
  .titles{
    position: relative;
    top: -5px;
    left: 12px;
  }

</style>
