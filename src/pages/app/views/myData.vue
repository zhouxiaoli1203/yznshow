<template>
  <div style="background-color: #fff; over-flow: auto">
    <div class="list_wrap" @click="skip(activity, 'preview')">
      <div class="c_f_row_">
        <img
          v-if="activity.activityStatus !== undefined"
          class="tag"
          :src="
            require('../../../assets/img/app/aStatus_' +
              activity.activityStatus +
              '.png')
          "
        />
        <van-image
          radius="4"
          class="c_f_shrink"
          fit="cover"
          :src="activity.top && activity.top.fileUrl"
          width="70"
          height="70"
        >
        </van-image>
        <div class="c_f_column">
          <div>
            <span class="tagA">{{
              activity.activityType == 1
                ? "微传单"
                : activity.activityType == 2
                ? "抢购"
                : activity.activityType == 3
                ? "拼团"
                : activity.activityType == 4
                ? "砍价"
                : "助力"
            }}</span>
            <span class="activityName">{{ activity.activityName }}</span>
          </div>
          <div class="activityTime mt2">
            <span>活动时间 </span
            ><span>{{
              moment(activity.beginTime).format("YYYY.MM.DD HH:mm")
            }}</span>
            -
            <span>{{ moment(activity.endTime).format("MM.DD HH:mm") }}</span>
          </div>
        </div>
      </div>
    </div>

    <van-tabs
      title-active-color="#13c2c2"
      line-width="23"
      v-model="type"
      @change="type == 4 ? getdisData() : ''"
    >
      <van-tab title="数据明细" :name="1"></van-tab>
      <van-tab title="有效用户" :name="2"></van-tab>
      <van-tab
        v-if="activity.activityType == 3"
        title="拼团列表"
        :name="3"
      ></van-tab>
      <van-tab
        v-if="activity.distSwitch == 1"
        title="分销汇总"
        :name="4"
      ></van-tab>
    </van-tabs>
    <template v-if="activity.activityId !== undefined">
      <dataDetail
        :activityId="activity.activityId"
        :activity="activity"
        :activityType="activity.activityType"
        v-if="type == 1"
      />
      <validUser
        v-if="type == 2"
        :activityId="activity.activityId"
        :activityType="activity.activityType"
      />
      <groupList
        v-if="type == 3"
        :activityId="activity.activityId"
        :activityType="activity.activityType"
      />
      <!-- 分销汇总 -->
      <div v-if="type == 4">
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
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            loading-text="加载中"
            :finished-text="!disContentlist.length ? '' : '到底啦'"
            @load="onLoad"
            :error.sync="error"
          > -->
        <van-empty
          style="height: 470px"
          v-if="!disContentlist.length"
          :image="
            isSearch
              ? require('../../../assets/img/app/empty_user.png')
              : require('../../../assets/img/app/empty.png')
          "
          :description="
            isSearch ? '搜索为空，换个关键词试试吧' : '此处空空如也'
          "
        />
        <div class="boxWrap">
          <div v-for="(item, index) in disContentlist" :key="index" class="box">
            <div>
              <div class="people">
                <span>{{ item.studentName }} / </span>
                <span>{{ item.phoneNum | phone334 }}</span>
              </div>
              <div v-if="item.potentialCustomerStr">
                关联学员：{{ item.potentialCustomerStr }}
              </div>
              <div>
                推广时间：{{
                  moment(item.createTime).format("YYYY.MM.DD HH:mm")
                }}
              </div>
              <div>浏览人次：{{ item.views }}</div>
              <div class="division" style="margin-top: 10px"></div>
              <div class="c_f_between">
                <div class="c_f_column_center" @click="dialogClick(true, item)">
                  <span>{{ item.inviteNumber }}</span>
                  <span>有效邀请</span>
                </div>
                <div
                  class="c_f_column_center"
                  @click="dialogClick(false, item)"
                >
                  <span>{{ item.recommendedNumber }}</span>
                  <span>推荐报课</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </van-list>
        </van-pull-refresh> -->
      </div>
    </template>
    <!-- //有效邀请 报课推荐 -->
    <van-dialog
      v-model="show"
      :show-cancel-button="false"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
    >
      <div class="title">
        {{ dialogInfo.type ? "有效邀请" : "推荐报课" }}
        <van-icon name="cross" class="close" @click="show = false" />
      </div>
      <ul class="dialogUl">
        <li v-for="(item, index) in dialogInfo.list" :key="index">
          <template v-if="dialogInfo.type">
            <div class="c_f_between">
              <div class="c_f_row">
                <span class="userName textEllipsis mainText">{{
                  item.studentName
                }}</span>
                <span class="c_f_shrink mainText">{{
                  item.phoneNum | phone334
                }}</span>
              </div>
              <span class="c_f_shrink"
                >{{
                  moment(item.createTime).format("YYYY.MM.DD HH:mm")
                }}提交</span
              >
            </div>
          </template>
          <template v-else>
            <div class="c_f_between">
              <div class="c_f_column">
                <div class="c_f_row">
                  <span
                    class="mainText textEllipsis"
                    style="min-width: 40px; max-width: 80px"
                    >{{ item.studentName }}</span
                  >
                  <span class="mainText">{{ item.phoneNum | phone334 }}</span>
                </div>
                <span class="mt10"
                  >{{
                    moment(item.signTime).format("YYYY.MM.DD HH:mm")
                  }}提交</span
                >
              </div>
              <div class="c_f_row" style="text-align: right">
                <span class="mainText mr5">报课费 </span>
                <span class="redText">{{ item.amount | qf }}元</span>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
import dataDetail from "../components/dataDetail";
import validUser from "../components/validUser";
import groupList from "../components/groupList";
import moment from "moment";

export default {
  name: "myData",
  components: {
    dataDetail,
    validUser,
    groupList,
  },
  data() {
    return {
      type: 1,
      isSearch: false,
      activity: { distSwitch: 1 },
      searchName: "",
      start: 0,
      count: 10,
      disContentlist: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      show: false,
      dialogInfo: {},
    };
  },
  methods: {
    moment,
    dialogClick(fl, data) {
      this.show = true;
      this.dialogInfo = {
        type: fl, // true 有效邀请
        list: [],
      };
      this.getDiaList(data);
    },
    getDiaList(data) {
      this.yznReq("get", "api/oa/referral/listEffectiveInviterActivity", {
        activityId: data.activityId,
        referrerId: data.potentialCustomerId,
        type: this.dialogInfo.type ? 1 : 2,
        signed: this.dialogInfo.type ? undefined : 1,
      }).then((res) => {
        if (res.status == 200) {
          this.dialogInfo.list = res.context;
        }
      });
    },
    onSearch(val) {
      this.refreshing = true;
      this.searchName = val;
      this.isSearch = true;
      console.log(this.searchName);
      this.onRefresh();
    },
    skip(data, router) {
      this.$router.push({
        path: "/" + router,
        query: { id: data.activityId, st: data.activityStatus, tl: "活动详情" },
      });
    },
    onLoad() {
      let cloak = false; //防闪屏
      this.loading = true;
      if (this.refreshing) {
        cloak = true;
        this.refreshing = false;
      }
      this.start = cloak ? 0 : this.disContentlist.length;
      this.getdisData(cloak);
    },
    getdisData(cloak) {
      this.yznReq(
        "get",
        "api/oa/referral/listReferralRecord",
        {
          searchType: "appSearchName",
          searchName: this.searchName,
          newVersion: true,
          activityId: this.activity.activityId || 1922,
        },
        true
      )
        .then((res) => {
          if (res.status == 200) {
            res.context.map((item) => {
              item.potentialCustomerStr = "";
              item.potentialCustomerList.map((ceil, index) => {
                item.potentialCustomerStr +=
                  ceil.name +
                  (index == item.potentialCustomerList.length - 1 ? "" : ",");
              });
            });
            this.disContentlist = res.context;
            // this.loading = false;
            // this.disContentlist = cloak
            //   ? res.context.items
            //   : this.disContentlist.concat(res.context.items);
            // // 数据全部加载完成
            // if (this.disContentlist.length >= res.context.totalNum) {
            //   this.finished = true;
            // }
          }
        })
        .catch(() => {
          this.error = true;
          this.loading = false;
        });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.onLoad();
    },
  },
  mounted() {
    this.yznReq("get", "api/oa/show/activityDetail", {
      activityId: this.$route.query.id,
    }).then((res) => {
      if (res.status == 200) {
        this.activity = res.context;
        console.log(this.activity.activityStatus);
      }
    });
  },
};
</script>
<style lang="less" scoped>
/deep/.van-tabs .van-tabs__nav--line .van-tabs__line {
  background-color: #13c2c2;
}
.list_wrap {
  height: 90px;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
  .c_f_row_ {
    padding: 10px 14px 0;
    height: 105px;
    position: relative;
    .tag {
      width: 46px;
      height: 24px;
      position: absolute;
      top: 14px;
      left: 10px;
      z-index: 1;
    }
    .c_f_shrink {
      display: inline-block;
      margin-right: 10px;
      position: relative;
    }
    .c_f_column {
      > div {
        line-height: 22px;
        span {
          line-height: 0;
        }
      }
      .tagA {
        border: 1px solid #13c2c2;
        height: 16px;
        padding: 0 3px;
        border-radius: 4px;
        text-align: center;
        line-height: 16px;
        color: #595959;
        font-size: 12px;
        margin-right: 6px;
      }
      .activityName {
        color: #1f1f1f;
        font-size: 15px;
        font-weight: bold;
        word-break: break-all;
      }
      .activityTime {
        span {
          color: #595959;
          font-size: 12px;
        }
      }
    }
  }
}
.boxWrap {
  overflow: auto;
  padding: 0 14px 16px;
  background-color: #fff;
  .box {
    line-height: 22px;
    margin-top: 10px;
    padding: 10px 16px;
    box-shadow: 0 0 4px 2px #f0f0f0;
    border-radius: 2px;
    font-size: 13px;
    color: #595959;
    > div {
      .people {
        font-size: 16px;
        color: #1f1f1f;
        font-weight: bold;
      }
      > div {
        margin-top: 4px;
      }
      .c_f_column_center {
        flex: 1;
        &:nth-of-type(1) {
          border-right: 1px solid #f0f0f0;
        }
        span:nth-of-type(1) {
          color: #13c2c2;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }
  }
}
.title {
  text-align: center;
  font-size: 15px;
  color: #292929;
  font-weight: bold;
  height: 40px;
  border-bottom: 1px solid #f5f5f5;
  line-height: 40px;
  position: relative;
  .close {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 20px;
  }
}
.dialogUl {
  min-height: 200px;
  max-height: 380px;
  overflow: auto;
  font-size: 12px;
  color: #1f1f1f;
  li {
    > div {
      height: 100%;
    }
    padding: 0 15px;
    height: 58px;
    &:nth-child(even) {
      background-color: #fff;
    }
    &:nth-child(odd) {
      background-color: #f5f7fc;
    }
    .userName {
      display: inline-block;
      width: 60px;
    }
  }
  .mainText {
    color: #1f1f1f;
    font-weight: bold;
  }
  .redText {
    color: #d45656;
  }
}
</style>
