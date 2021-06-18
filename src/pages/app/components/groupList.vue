<template>
  <div>
    <van-search
      class="pb0 bt10"
      v-model="searchName"
      placeholder="请输入姓名、联系电话"
      @search="onSearch"
      @clear="
        isSearch = false;
        getList();
      "
      :left-icon="require('../../../assets/img/app/search.png')"
      clearable
    >
    </van-search>
    <div class="c_f_center screen">
      <!-- 新老潜客筛选 -->
      <div
        class="c_f_center"
        :class="[potentialCustomerType ? 'c13C2C2' : '']"
        @click="
          sheetShowClick({
            action: 'actions_type',
            key: 'potentialCustomerType',
          })
        "
      >
        <span class="mr4">{{ potentialCustomerType_name }}</span>
        <van-icon name="arrow-down" />
      </div>
      <div
        class="c_f_center"
        :class="[activitySuccess ? 'c13C2C2' : '']"
        @click="
          sheetShowClick({ action: 'actions_group', key: 'activitySuccess' })
        "
      >
        <span class="mr4">{{ activitySuccess_name }}</span>
        <van-icon name="arrow-down" />
      </div>
    </div>
    <div class="c_f_center" style="background-color: #fff">
      <div class="totalNum c_f_center">
        共<span class="c13C2C2 fbold">{{ myList.totalGroup }}</span
        >个团 / 拼团成功<span class="c13C2C2 fbold">{{
          myList.successGroup
        }}</span
        >个计<span class="c13C2C2 fbold">{{ myList.totaNumber }}</span
        >人
        <!-- <span>{{ list.length }}</span> -->
      </div>
    </div>
    <van-empty
      style="height: 380px"
      v-if="!myList.list.length"
      :image="
        isSearch
          ? require('../../../assets/img/app/empty_user.png')
          : require('../../../assets/img/app/empty.png')
      "
      :description="isSearch ? '搜索为空，换个关键词试试吧' : '此处空空如也'"
    />
    <div class="boxWrap">
      <div v-for="(item, index) in myList.list" :key="index" class="box">
        <div class="c_f_column">
          <span class="f15 textEllipsis" style="width: 220px"
            >编号：{{ item.groupId }}</span
          >
          <!-- 团成员 -->
          <div class="tagWrap">
            <span
              class="tip"
              :class="[
                item.activitySuccess == 1
                  ? 'success'
                  : item.activitySuccess == 2
                  ? 'ing'
                  : '',
              ]"
              v-if="item.activitySuccess != -1"
              >{{
                item.activitySuccess == 1
                  ? `${item.currentStep}人团`
                  : item.activitySuccess == 2
                  ? `还差${item.lackNumber}人`
                  : ""
              }}</span
            >
            <div
              class="tag c_f_center"
              :class="[
                item.activitySuccess == 1
                  ? 'success'
                  : item.activitySuccess == 2
                  ? 'ing'
                  : '',
              ]"
            >
              {{
                item.activitySuccess == 1
                  ? "拼团成功"
                  : item.activitySuccess == 2
                  ? "拼团中"
                  : "拼团失败"
              }}
            </div>
          </div>
        </div>

        <div
          class="f15"
          v-for="(ceil, index) in item.showActivityJoinList"
          :key="index"
        >
          <div class="division mt5" v-if="index"></div>
          <div class="mt5">
            <span class="c1F1F1F f15 fbold"
              >{{ ceil.studentName
              }}{{ ceil.headFlag == 1 ? "（团长）" : "" }}</span
            >
            <span v-if="ceil.potentialCustomerType == 1" class="potenType"
              >新</span
            >
          </div>
          <div class="f13">
            <span class="mr15">{{ ceil.phone | phone334 }}</span>
            <span>报名时间：</span>
            <span>{{
              moment(item.createTime).format("YYYY.MM.DD HH:mm")
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 操作面板 -->
    <van-action-sheet
      v-model="sheetShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect($event, sheetObj.key)"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import moment from "moment";
export default {
  name: "groupList",
  data() {
    return {
      sheetShow: false,
      isSearch: false,
      sheetObj: {},
      actions: [],
      actions_type: [
        { name: "全部", name_: "全部潜客" },
        { name: "新潜客", value: 1 },
        { name: "老潜客", value: 2 },
      ],
      actions_group: [
        { name: "全部", name_: "全部拼团" },
        { name: "拼团成功", value: 1 },
        { name: "拼团中", value: 2 },
        { name: "拼团失败", value: -1 },
      ],
      searchName: "",
      start: 0,
      count: 10,
      myList: {
        list: [],
        successGroup: 0,
        totaNumber: 0,
        totalGroup: 0,
      },
      list: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,

      potentialCustomerType_name: "全部潜客",
      potentialCustomerType: "", //1新潜客 2老潜客
      activitySuccess: "", //状态 1成功 2进行中 -1失败
      activitySuccess_name: "全部拼团",
    };
  },
  props: {
    activityId: {
      type: String | Number,
    },
    activityType: {
      type: String | Number,
    },
  },
  watch: {
    showActivityCourseList: {
      handler(newV, oldV) {
        if (newV) {
          this.$emit("courseListChange", this.showActivityCourseList);
        }
      },
      deep: true,
    },
  },
  methods: {
    moment,
    sheetShowClick(options) {
      this.sheetShow = true;
      this.sheetObj = options;
      this.actions = this[options.action];
    },
    onSelect(val, key) {
      this[key] = val.value;
      this.isSearch = false;
      this[key + "_name"] = val.value === undefined ? val.name_ : val.name;
      this.getList();
    },
    onSearch(val) {
      this.searchName = val;
      this.isSearch = true;
      this.getList();
    },
    getList() {
      this.yznReq("get", "api/oa/show/listGroup", {
        activityId: this.activityId,
        searchName: this.searchName ? this.searchName : undefined,
        potentialCustomerType: this.potentialCustomerType
          ? this.potentialCustomerType
          : undefined,
        activitySuccess: this.activitySuccess
          ? this.activitySuccess
          : undefined,
      }).then((res) => {
        if (res.status == 200) {
          this.myList = res.context;
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style  lang="less" scoped>
.screen {
  height: 42px;
  background-color: #fff;
  font-size: 13px;
  .c_f_center:nth-of-type(1) {
    margin-right: 40px;
  }
}
.totalNum {
  background-color: #f8f8f8;
  border-radius: 2px;
  height: 24px;
  font-size: 13px;
  color: #595959;
  padding: 0 14px;
  margin: 10px auto 0;
  span {
    font-size: 15px;
    color: #13c2c2;
    font-weight: bold;
  }
}
.boxWrap {
  padding: 0 14px 14px;
  background-color: #fff;
  .box {
    line-height: 22px;
    margin-top: 10px;
    padding-bottom: 10px;
    box-shadow: 0 0 4px 2px #f0f0f0;
    border-radius: 2px;
    color: #595959;
    position: relative;
    overflow: auto;
    > div {
      // margin-top: 5px;
      padding: 0 16px;
    }
    .c_f_column {
      box-sizing: border-box;
      height: 50px;
      justify-content: center;
      border-bottom: 1px solid #f0f0f0;
      position: relative;
    }
    .tagWrap {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      .tip {
        &.success {
          color: #13b5c2;
        }
        &.ing {
          color: #42c532;
        }
      }
      .tag {
        display: inline-flex;
        margin-left: 6px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        padding: 0 4px 0 10px;
        border-radius: 18px 0 0 18px;
        background-color: #b8b8b8;
        color: #fff;
        font-size: 11px;
        &.success {
          background-color: #13b5c2;
        }
        &.ing {
          background-color: #42c532;
        }
      }
    }

    .potenType {
      border: 1px solid #54d045;
      width: 18px;
      height: 18px;
      display: inline-block;
      border-radius: 4px;
      color: #54d045;
      text-align: center;
      line-height: 18px;
      font-size: 11px;
      margin-left: 5px;
    }
  }
}
</style>
