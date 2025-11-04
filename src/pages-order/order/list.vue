<template>
  <view class="order-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="list-search-bar">
      <search-bar :filters="[1, 2, 3, 4]" @onSearch="handleSetSearchData"></search-bar>
    </view>

    <mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" height="100%" top="100px">
      <list-item v-for="item in listData" :key="item.quesTaskId" :itemData="item"></list-item>
    </mescroll-uni>
  </view>
</template>

<script>
import MescrollMixin from 'mescroll-uni/mescroll-mixins.js';
import MescrollUni from 'mescroll-uni/mescroll-uni.vue';
import { mapGetters, mapMutations } from 'vuex';
import { getAreaList } from '@/service/landcrm.js';
import { getProjectAndQuesRange } from '@/service/wuyecrm.js';
import searchBar from '../components/list-header/search-bar.vue';
import listItem from './component/list-item.vue';
import { findMyTaskListByPage, getAllQuesTaskServerTypes } from '@/service/wuyecrm';
export default {
  name: 'order-list',
  components: { 'search-bar' : searchBar, 'list-item' : listItem, 'mescroll-uni' : MescrollUni },
  mixins: [MescrollMixin],
  data() {
    return {
      listData: [],
      searchData: {
        companyId: '',
        userId: '',
        pageNum: 1,
        pageSize: 10,
      },
      downOption: {
        auto: false,
      },
      upOption: {
        auto: true,
        page: {
          num: 0,
          size: 10,
        },
        textNoMore: '无更多数据了',
      },
      mescroll: null,
      userInfo: {}
    };
  },
  onLoad() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.searchData.companyId = this.userInfo.companyId
    this.searchData.userId = this.userInfo.userId
    this.getAreas();
    this.requestLastQuesTaskServerTypeList();
  },
  onShow() {},
  onHide() {
  },

  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo',
    }),
  },
  methods: {
    ...mapMutations('searchBar', ['setDataInfo']),

    // 上拉加载的回调
    upCallback(page) {
      this.searchData.pageNum = page.num || 1;
      this.requestData();
    },

    getAreas() {
      let params = {
        data: {
          userId: this.userInfo.userId,
        },
      };
      getAreaList(params).then((result) => {
        if (result && result.items && result.items.length > 0) {
          result.items.unshift({
            areaId: '-1',
            areaName: '全部',
          });
          this.setDataInfo({ areaList: result.items, areaId: result.items[0].areaId, areaName: result.items[0].areaName });
        }
      });
    },
    selectArea(areaId) {
      let params = {
        data: {
          userId: this.userInfo.userId,
          areaId: areaId,
        },
      };
      getProjectAndQuesRange(params).then((res) => {
        if (res.resultCode == '200' && res.data && res.data.length > 0) {
          this.setDataInfo({ projectList: res.data, projectId: res.data[0].id, projectName: res.data[0].title });
          this.requestData();
        }
      });
    },
    requestData() {
      this.searchData.tabType = 4;
      this.searchData.areaId = this.dataInfo.areaId;
      this.searchData.projectId = this.dataInfo.projectId;
      this.searchData.orignSource = this.dataInfo.orignSource;
      this.searchData.taskTypeId = this.dataInfo.selectServerIds[this.dataInfo.selectServerIds.length - 1] || '';
      this.searchData.startDate = this.dataInfo.beginDate ? this.dataInfo.beginDate + ' 00:00:00' : '';
      this.searchData.endDate = this.dataInfo.endDate ? this.dataInfo.endDate + ' 23:59:59' : '';

      let params = {
        data: this.searchData,
      };
      findMyTaskListByPage(params)
        .then((res) => {
          this.mescroll.endByPage(res.data.list.length, res.data.pages);
          if (res.status == 200 && res.data.list && res.data.list.length > 0) {
            if (this.searchData.pageNum == 1) this.listData = [];
            this.$nextTick(() => {
              this.listData = this.listData.concat(res.data.list);
            });
            console.log('列表数据', this.listData);
          } else {
            this.listData = [];
          }
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
    setData(data, baseData) {
      data.forEach((a) => {
        a.children = baseData.filter((b) => {
          return b.parentId == a.serverId;
        });
        if (a.children.length > 0) {
          this.setData(a.children, baseData);
        }
      });
    },
    requestLastQuesTaskServerTypeList() {
      let params = {
        data: {
          companyId: this.userInfo.companyId,
        },
      };
      getAllQuesTaskServerTypes(params).then((res) => {
        if ((res.status = 200)) {
          if (res.data && res.data.length && res.data[0].children && res.data[0].children.length) {
            this.setDataInfo({ treeData: [res.data[0].children] });
          } else {
            this.treeData = [];
          }
        }
      });
    },
    handleScrolltolower() {
      console.log('tolower');
    },
    handleScrolltoupper() {
      console.log('toupper');
    },
    handleSetSearchData(condition) {
      if (condition) {
        this.searchData.condition = condition;
      } else {
        this.searchData.condition = '';
      }
      this.$nextTick(() => {
        this.mescroll.resetUpScroll();
        this.mescroll.scrollTo(0, 0);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-list {
  background-color: #f5f5f5;

  .list-search-bar {
    position: fixed;
    width: 100%;
    height: 100px;
    z-index: 999;
  }
}
</style>
