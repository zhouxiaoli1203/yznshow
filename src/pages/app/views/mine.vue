<template>
  <div style="background-color: #fff">
    <van-search
      class="mysearch"
      v-model="searchName"
      placeholder="请输入活动名称"
      @search="onSearch($event)"
      @clear="
        refreshing = true;
        onRefresh();
      "
      :left-icon="require('../../../assets/img/app/search.png')"
      show-action
      clearable
    >
      <template #action>
        <div @click="van_popup = !van_popup" class="c_f_center">
          <span class="mr5">筛选</span><span class="arrow down"></span>
        </div>
      </template>
    </van-search>

    <van-popup v-model="van_popup" position="top">
      <div class="myvan_popup">
        <div style="padding: 0 12px; border-top: 1px solid #f5f5f5">
          <div class="mt10">活动类型</div>
          <ul class="mt10">
            <li
              v-for="(item, index) in types"
              :key="index"
              :class="[screen_type.name == item.name ? 'active' : '']"
              @click="operate('sel', item, 'screen_type')"
            >
              <span>{{ item.name }}</span>
            </li>
          </ul>
          <div class="mt10">分销</div>
          <ul class="mt10">
            <li
              v-for="(ceil, index) in dis"
              :key="index"
              :class="[screen_dis.name == ceil.name ? 'active' : '']"
              @click="operate('sel', ceil, 'screen_dis')"
            >
              <span>{{ ceil.name }}</span>
            </li>
          </ul>
          <div class="mt10">活动状态</div>
          <ul class="mt10">
            <li
              v-for="(ceil, index) in status"
              :key="index"
              :class="[screen_status.name == ceil.name ? 'active' : '']"
              @click="operate('sel', ceil, 'screen_status')"
            >
              <span>{{ ceil.name }}</span>
            </li>
          </ul>
        </div>

        <div class="c_f_center">
          <div class="f15 fbold" @click="operate('reset')">重置</div>
          <div class="c13C2C2 f15 fbold" @click="operate('confirm')">确定</div>
        </div>
      </div>
    </van-popup>

    <van-pull-refresh
      v-model="refreshing"
      @refresh="onSearch($event, false)"
      style="padding-bottom: 60px"
      class="bt10"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        loading-text="加载中"
        :finished-text="!list.length || list.length < 4 ? '' : '到底啦'"
        @load="onLoad"
        :error.sync="error"
      >
        <van-empty
          v-if="!list.length"
          :image="
            isSearch
              ? require('../../../assets/img/app/empty.png')
              : isNodata
              ? require('../../../assets/img/app/empty_mine.png')
              : require('../../../assets/img/app/empty_user.png')
          "
          :description="
            isSearch
              ? '搜索为空，换个关键词试试吧'
              : isNodata
              ? '您当前还没有创建活动哦 \n快去模版库创建吧～'
              : '此处空空如也'
          "
        />
        <div class="list_wrap">
          <div
            v-for="(item, index) in list"
            :key="index"
            :title="item.activityName"
          >
            <div class="c_f_row_">
              <img
                class="tag"
                :src="
                  require('../../../assets/img/app/aStatus_' +
                    item.activityStatus +
                    '.png')
                "
              />
              <van-image
                radius="4"
                class="c_f_shrink"
                fit="cover"
                :src="item.top && item.top.fileUrl"
                width="84"
                height="84"
              >
              </van-image>
              <div class="c_f_column" @click="skip(item, 'preview')">
                <div>
                  <span class="tagA">{{
                    item.activityType == 1
                      ? "微传单"
                      : item.activityType == 2
                      ? "抢购"
                      : item.activityType == 3
                      ? "拼团"
                      : item.activityType == 4
                      ? "砍价"
                      : "助力"
                  }}</span>
                  <span class="activityName">{{ item.activityName }}</span>
                </div>
                <div class="activityTime mt2">
                  <span>活动时间 </span
                  ><span>{{
                    moment(item.beginTime).format("YYYY.MM.DD HH:mm")
                  }}</span>
                  -
                  <span>{{ moment(item.endTime).format("MM.DD HH:mm") }}</span>
                </div>
                <div class="activityVaild mt2">
                  <span>有效用户：</span
                  ><span>{{ item.userNum ? item.userNum : 0 }}</span>
                </div>
              </div>
            </div>
            <div class="operate_wrap">
              <div class="c_f_center" @click="skip(item, 'preview')">
                <img
                  :src="require('../../../assets/img/app/mine_preview.png')"
                />
                <span>预览</span>
              </div>
              <div
                class="c_f_center"
                @click="
                  skip(
                    item,
                    item.activityStatus == 0
                      ? ''
                      : item.activityStatus == 1
                      ? 'setting'
                      : 'myData'
                  )
                "
              >
                <img
                  :src="
                    require('../../../assets/img/app/mine_' +
                      (item.activityStatus == 0
                        ? 'on'
                        : item.activityStatus == 1
                        ? 'edit'
                        : 'data') +
                      '.png')
                  "
                />
                <span>{{
                  item.activityStatus == 0
                    ? "发布"
                    : item.activityStatus == 1
                    ? "编辑"
                    : "活动数据"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-tabbar route>
      <van-tabbar-item icon="home-o" replace to="/index">
        <span>模板库</span>
        <template #icon="props">
          <img
            :src="
              require(props.active
                ? '../../../assets/img/app/index_active.png'
                : '../../../assets/img/app/index.png')
            "
          /> </template
      ></van-tabbar-item>
      <van-tabbar-item icon="search" replace to="/mine"
        ><span>我的活动</span>
        <template #icon="props">
          <img
            :src="
              require(props.active
                ? '../../../assets/img/app/mine_active.png'
                : '../../../assets/img/app/mine.png')
            "
          /> </template
      ></van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import moment from "moment";
import { Dialog } from "vant";
export default {
  name: "index",
  components: {},
  data() {
    return {
      van_popup: false,
      start: 0,
      count: 10,
      list: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      searchName: "",
      screen_status: {},
      screen_type: {},
      screen_dis: {},
      isSearch: false,
      isNodata: false,
      isEmpty: false,
      types: [
        { name: "微传单", type: 1, key: "activityType" },
        { name: "拼团", type: 3, key: "activityType" },
        { name: "抢购", type: 2, key: "activityType" },
        { name: "砍价", type: 4, key: "activityType" },
        { name: "助力", type: 5, key: "activityType" },
      ],
      dis: [{ name: "分销", type: 1, key: "distSwitch" }],
      status: [
        { name: "待发布", type: 0, key: "upDownStatus" },
        { name: "未开始", type: 1, key: "activityStatus" },
        { name: "进行中", type: 2, key: "activityStatus" },
        { name: "已下架", type: -1, key: "upDownStatus" },
        { name: "已结束", type: 3, key: "activityStatus" },
      ],
    };
  },
  methods: {
    moment,
    operate(type, data, key) {
      switch (type) {
        case "confirm": //确定
          this.van_popup = false;
          this.refreshing = true;
          this.onRefresh();
          this.isEmpty = true;
          this.isSearch = false;
          this.isNodata = false;
          break;
        case "sel": //选择
          this[key] = this[key].name !== data.name ? data : {};
          break;
        case "reset": //重置
          this.screen_status = {};
          this.screen_type = {};
          this.screen_dis = {};
          break;
      }
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
      // setTimeout(function () {
      this.yznReq(
        "get",
        "api/oa/show/listActivity",
        Object.assign(
          {
            start: this.start,
            count: this.count,
            activityName: this.searchName ? this.searchName : undefined,
          },
          this.screen_status["key"]
            ? {
                [this.screen_status["key"]]: this.screen_status["type"],
              }
            : {},
          this.screen_type["key"]
            ? {
                [this.screen_type["key"]]: this.screen_type["type"],
              }
            : {},
          this.screen_dis["key"]
            ? {
                [this.screen_dis["key"]]: this.screen_dis["type"],
              }
            : {}
        ),
        true
      )
        .then((res) => {
          if (res.status == 200) {
            this.loading = false;
            if (res.context.items == 0 && !this.isSearch && !this.isEmpty) {
              this.isNodata = true;
              this.isSearch = false;
              this.isEmpty = false;
            }
            this.list = cloak
              ? res.context.items
              : this.list.concat(res.context.items);
            // 数据全部加载完成
            if (this.list.length >= res.context.totalNum) {
              this.finished = true;
            }
          }
        })
        .catch(() => {
          this.error = true;
          this.loading = false;
        });
      // }, 1000000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.onLoad();
    },
    skip(data, router) {
      if (router) {
        if (router == "setting") {
          this.$store.commit("MODIFY", {
            key: "STEP1_INIT",
            value: true,
          });
        }
        this.$router.push({
          path: "/" + router,
          query: Object.assign(
            { id: data.activityId },
            router == "preview"
              ? { st: data.activityStatus, tl: "活动详情" }
              : router == "setting"
              ? { edit: 1 }
              : {}
          ),
        });
      } else {
        Dialog.confirm({
          title: "提示",
          message: "活动发布后内容无法更改，确认正式发布此活动吗？",
        })
          .then(() => {
            this.upDownActivity(data.activityId);
          })
          .catch(() => {});
      }
    },
    upDownActivity(id, checkTime) {
      let params = {
        activityId: id,
        upDownStatus: 1,
      };
      if (checkTime) {
        params["checkTime"] = -1;
      }
      this.yznReq("post", "api/oa/show/upDownActivity", params, "206").then(
        (res) => {
          if (res.status == 200) {
            this.refreshing = true;
            this.onRefresh();
          }
          if (res.status == 206) {
            Dialog.confirm({
              title: "提示",
              message:
                "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
            })
              .then(() => {
                this.upDownActivity(id, "checkTime");
              })
              .catch(() => {});
          }
        }
      );
    },
    onSearch(val) {
      this.isSearch = true;
      this.isNodata = false;
      this.isEmpty = false;
      this.refreshing = true;
      this.searchName = val;
      if (this.van_popup) {
        this.van_popup = false;
      }
      this.onRefresh();
    },
    onCancel() {},
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "setting") {
        document.body.scrollIntoView();
        vm.onSearch("");
      }
    });
  },
};
</script>
<style lang="less" scoped>
.van-empty {
  height: 560px;
  white-space: pre-wrap;
  text-align: center;
}
.mysearch {
  position: relative;
  z-index: 19931221;
  .c_f_center {
    width: 50px;
    span:nth-of-type(2) {
      margin-top: -4px;
    }
  }
}
/deep/.myvan_popup {
  padding-top: 56px; /*no*/
  li {
    display: inline-block;
    font-size: 13px;
    padding: 0 10px;
    height: 24px;
    line-height: 22px;
    border-radius: 12px;
    background-color: #fff;
    border: 1px solid #bfbfbf;
    margin-right: 8px;
    &.active {
      background-color: #13c2c2;
      color: #fff;
      border-color: #13c2c2;
    }
  }
  .c_f_center {
    margin-top: 23px;
    border-top: 1px solid #f5f5f5;
    > div {
      flex: 1;
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      &:nth-of-type(1) {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.list_wrap {
  overflow: auto;
  > div {
    &:first-child {
      margin-top: 0;
      border-top: none;
      height: 146px;
    }
    height: 156px;
    background-color: #fff;
    border-top: 10px solid #f8f8f8;
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
        .activityVaild {
          span {
            color: #595959;
            font-size: 13px;
            font-weight: bold;
          }
        }
      }
    }
    .operate_wrap {
      height: 40px;
      border-top: 1px solid #f5f5f5;
      display: flex;
      flex-direction: row;
      position: relative;
      &:after {
        content: "";
        display: block;
        border-left: 1px solid #f0f0f0;
        width: 0;
        height: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      > div {
        flex: 1;
        span {
          color: #1f1f1f;
          font-size: 15px;
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}
/deep/.van-tabbar-item {
  font-size: 15px;
  &.van-tabbar-item--active {
    color: #1f1f1f;
  }
  .van-tabbar-item__icon {
    img {
      display: inline-block;
      width: 32px;
      height: 32px;
    }
    margin-bottom: 0;
  }
  flex-direction: row;
}
</style>
