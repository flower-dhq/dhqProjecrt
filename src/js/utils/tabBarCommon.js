import Vue from 'vue'
import util from '@/js/utils';
import constant from '@/js/constant';
import {getUserRole, syncCrmEmployeeInfo,selectTboMemberInfo,getAppByCode} from '../../service/community'

//获取用户身份角色
const setIdentity =() => {
  const { PROJECT_ID, O_USER_INFO } = constant;
  const {id, companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
  const projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
  let params = {
    data: {
      memberId: id,
      // projectId: projectId,
      companyId: companyId
    },
    hideLoading: true
  }
  getUserRole(params).then(res => {
    if (res.status == '200') {
      let state = res.data.supremePosition;
      let userTypes = '';
      switch (state) {
        case 1:
          userTypes = '租户'
          break;
        case 2:
          userTypes = '业主'
          break;
        case 3:
          userTypes = '家属'
          break;
        case 4:
          userTypes = '企业联系人'
          break;
        case 5:
          userTypes = '家政'
          break;
        case 6:
          userTypes = '企业员工'
          break;
        case 8:
          userTypes = '会员'
            break;
        case 9:
          userTypes = '企业联系人'
            break;
        case 10:
          userTypes = '业主'
            break;
        case 11:
          userTypes = '家人'
            break;
        case 12:
          userTypes = '家政'
            break;
        case 13:
          userTypes = '租客'
            break;
        case 14:
          userTypes = '业主'
            break;
        case 15:
              userTypes = '家人'
                break;
        case 16:
              userTypes = '家政'
                break;
        default:
          userTypes = '游客'
          break;
      }
      const { USER_TYPE, USER_TYPE_NUM } = constant;
      util.storageAction({ key: USER_TYPE, action: 'set', value: userTypes });
      util.storageAction({ key: USER_TYPE_NUM, action: 'set', value: state });
    //   if (userTypes == '游客') {
    //     Vue.prototype.$refs.rzModal.showModal({ modalType: 'rz' });
    // }
    }else{
      if(res.status=='400'){
        //会员数据不存在,清空会员数据
        // util.storageAction({ key: O_USER_INFO, action: 'set', value:null });
      }
    }
  })

}

//判断是否认证
const isJoinEnterprise =() =>{
  const { PROJECT_ID,O_USER_INFO } = constant;
  const {id, companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
  const projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
  let params = {
    data:{
      memberId:id,
      companyId:companyId,
      projectId: projectId
    },
    hideLoading: true
  }
  syncCrmEmployeeInfo(params).then(res =>{
    if(res.status=='200'){
      let v = res.data
      console.log(78,res.data)
      if(v=='-1'){
        
      }else {


        // const { IS_ASSOCIATION } = constant;
        // util.storageAction({ key: IS_ASSOCIATION, action: 'set', value: v });
      }
    }
  })
  const { MEMBER_ID } = constant;
  const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
  const args = {
      pathParams: `/${memberId}`,
      hideLoading:true,
  };
  selectTboMemberInfo(args).then(res => {
    if (res.status == '200') {
      const data = res.data || {}
      const { IS_ASSOCIATION } = constant
      util.storageAction({ key: IS_ASSOCIATION, action: 'set', value: data.isAssociation || 0})
     }else{
       if(res.status=='400'){
         //会员数据不存在,清空会员数据
       }
     }
       })
}
// 获取用户菜单
const getUserNarbar = ()=>{ 
  const { PROJECT_ID,O_USER_INFO } = constant;
  if(!util.storageAction({ key: "O_USER_INFO", action: 'get' })){
    return
  }
  const {id} = util.storageAction({ key: O_USER_INFO, action: 'get' });
  const projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
  var params = {
    data:{
      configCode: "wechatBarConfig",
      projectId: projectId,
      memberId: id
    },
    hideLoading: false,
    responseToast: false
  }
  getAppByCode(params).then(res=>{
    if(res.status == 200 && res.data.configDesc){
       //  设置底部缓存菜单
      let configDesc = res.data.configDesc;
      const { NAV_BAR_MENUS } = constant;
      util.storageAction({ key: NAV_BAR_MENUS, action: 'set', value: configDesc});
  		uni.$emit('setNavbar');
     }
  })
}

export default {
  setIdentity,
  isJoinEnterprise,
  getUserNarbar
};
  