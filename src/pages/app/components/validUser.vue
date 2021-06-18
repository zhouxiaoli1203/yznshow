<template>
  <div>
    <van-search
      class="pb0 bt10"
      v-model="searchName"
      placeholder="请输入姓名、联系电话"
      @search="onSearch"
      @clear="
        isSearch = false;
        refreshing = true;
        onRefresh();
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

      <!-- 拼团筛选 -->
      <div
        v-if="activityType == 3"
        class="c_f_center"
        :class="[activitySuccess ? 'c13C2C2' : '']"
        @click="
          sheetShowClick({ action: 'actions_group', key: 'activitySuccess' })
        "
      >
        <span class="mr4">{{ activitySuccess_name }}</span>
        <van-icon name="arrow-down" />
      </div>
      <!-- 助力筛选 -->
      <div
        v-if="activityType == 5"
        :class="[activitySuccess ? 'c13C2C2' : '']"
        class="c_f_center"
        @click="
          sheetShowClick({ action: 'actions_help', key: 'activitySuccess' })
        "
      >
        <span class="mr4">{{ activitySuccess_name }}</span>
        <van-icon name="arrow-down" />
      </div>
    </div>

    <div class="c_f_center" style="background-color: #fff">
      <div class="totalNum c_f_center">
        有效用户共
        <span>{{ list.length }}</span>
        人
      </div>
    </div>
    <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        loading-text="加载中"
        :finished-text="!list.length ? '' : '到底啦'"
        @load="onLoad"
        :error.sync="error"
      > -->
    <!-- <van-empty
      v-if="!list.length"
      style="height: 380px"
      :image="require('../../../assets/img/app/empty_user.png')"
      description="此处空空如也"
    /> -->
    <van-empty
      style="height: 380px"
      v-if="!list.length"
      :image="
        isSearch
          ? require('../../../assets/img/app/empty_user.png')
          : require('../../../assets/img/app/empty.png')
      "
      :description="isSearch ? '搜索为空，换个关键词试试吧' : '此处空空如也'"
    />
    <div class="boxWrap">
      <div v-for="(item, index) in list" :key="index" class="box">
        <div class="c_f_row">
          <span class="c1F1F1F f15 fbold">{{ item.studentName }}</span
          ><span v-if="item.potentialCustomerType == 1" class="potenType"
            >新</span
          ><span
            v-if="activityType > 3 && item.paymentFlag == 1"
            style="color: #13b5c2"
            >（已支付）</span
          >
        </div>
        <div class="c_f_row f13">
          <span class="mr10">{{ item.phone | phone334 }}</span>
          <span>报名时间：</span>
          <span>{{ moment(item.createTime).format("YYYY.MM.DD HH:mm") }}</span>
        </div>
        <!-- 拼团 -->
        <div
          v-if="activityType == 3"
          class="tag"
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
        <!-- <div class="f15">{{ item.productName }}</div> -->
        <!-- 砍价 -->
        <template v-if="activityType == 4">
          <my-progress :precent="item.precent"></my-progress>
          <div v-if="item.precent !== 100">
            <span
              >已砍{{ (item.originalPrice - item.currentPrice) | qf }}元 /
              当前{{ item.currentPrice | qf }}元</span
            >
          </div>
          <div v-else>已砍至底价{{ item.floorPrice | qf }}元</div>
        </template>

        <!-- 助力 -->
        <template v-if="activityType == 5">
          <my-progress :precent="item.precent" :type="true"></my-progress>
          <div v-if="item.precent !== 100">
            <span>{{ item.currentNumber }} / {{ item.totalNumber }}助力包</span>
          </div>
          <div v-else>助力成功</div>
        </template>
      </div>
    </div>
    <!-- </van-list>
    </van-pull-refresh> -->
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
import myProgress from "../components/myProgress";
export default {
  name: "validUser",
  components: { myProgress },
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
      actions_help: [
        { name: "全部", name_: "全部状态" },
        { name: "助力成功", value: 1 },
        { name: "助力中", value: 2 },
        { name: "助力失败", value: 3 },
      ],
      searchName: "",
      start: 0,
      count: 10,
      list: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      potentialCustomerType_name: "全部潜客",
      potentialCustomerType: "", //1新潜客 2老潜客
      activitySuccess: "", //状态 1成功 2进行中 -1失败  (3 助力专用)
      activitySuccess_name: this.activityType == 3 ? "全部拼团" : "全部状态",
    };
  },
  props: {
    activityId: {
      type: String | Number,
    },
    activityType: {
      type: String | Number,
    },
    tab: {
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
      console.log(val);
      this[key] = val.value;
      this[key + "_name"] = val.value === undefined ? val.name_ : val.name;
      this.refreshing = true;
      this.isSearch = false;
      this.onRefresh();
    },
    onSearch(val) {
      this.refreshing = true;
      this.isSearch = true;
      this.searchName = val;
      console.log(this.searchName);
      this.onRefresh();
    },
    onLoad() {
      let cloak = false; //防闪屏
      this.loading = true;
      if (this.refreshing) {
        cloak = true;
        this.refreshing = false;
      }
      this.start = cloak ? 0 : this.list.length;
      this.getList(cloak);
    },
    getList(cloak) {
      this.yznReq("get", "api/oa/show/listJoin", {
        activityId: this.activityId,
        searchName: this.searchName ? this.searchName : undefined,
        potentialCustomerType: this.potentialCustomerType
          ? this.potentialCustomerType
          : undefined,
        activitySuccess: this.activitySuccess
          ? this.activitySuccess
          : undefined,
      })
        .then((res) => {
          if (res.status == 200) {
            // this.loading = false;
            res.context.map((item) => {
              if (item.activityType == 4) {
                item.precent =
                  item.currentPrice == item.floorPrice
                    ? 100
                    : (item.currentPrice / item.originalPrice) * 100;
              }
              if (item.activityType == 5) {
                item.precent = (item.currentNumber / item.totalNumber) * 100;
              }
            });
            console.log(res.context);
            this.list = res.context;
            // this.list = cloak
            //   ? res.context.items
            //   : this.list.concat(res.context.items);
            // // 数据全部加载完成
            // if (this.list.length >= res.context.totalNum) {
            //   this.finished = true;
            // }
          }
        })
        .catch((err) => {
          // this.error = true;
          // this.loading = false;
        });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.onLoad();
    },
  },
  mounted() {
    this.getList();
    // this.yznReq("get", "api/oa/chargeStandard/listSchoolTerm", {
    //   pageType: 0,
    // }).then((res) => {
    //   if (res.status == 200) {
    //     this.terms = res.context;
    //     this.terms.forEach((item) => {
    //       this.terms_[item.schoolTermId] = item.schoolTermName;
    //     });
    //   }
    // });
  },
};
</script>

<style  lang="less" scoped>
.screen {
  height: 42px;
  background-color: #fff;
  font-size: 13px;
  .c_f_center:nth-of-type(2) {
    margin-left: 40px;
  }
}
.totalNum {
  width: #f8f8f8;
  background-color: #f8f8f8;
  border-radius: 2px;
  height: 24px;
  font-size: 13px;
  color: #595959;
  padding: 0 10px;
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
  overflow: auto;
  .box {
    line-height: 22px;
    margin-top: 10px;
    padding: 5px 16px 10px;
    box-shadow: 0 0 4px 2px #f0f0f0;
    border-radius: 2px;
    color: #595959;
    position: relative;
    > div {
      margin-top: 5px;
    }
    .tag {
      position: absolute;
      top: 10px;
      right: 0;
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
