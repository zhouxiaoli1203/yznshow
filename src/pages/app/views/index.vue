<template>
  <div>
    <div class="toTop" v-if="scrollTop > 660" @click="toTop"></div>
    <div class="msk" v-if="step < 4" @click="step++">
      <img
        class="step1"
        v-if="step == 1"
        :src="require('../../../assets/img/app/lead_1.png')"
      />
      <img
        class="step2"
        v-if="step == 2"
        :src="require('../../../assets/img/app/lead_2.png')"
      />
      <img
        class="step3"
        v-if="step == 3"
        :src="require('../../../assets/img/app/lead_3.png')"
      />
    </div>
    <van-sticky>
      <van-tabs
        title-active-color="#13c2c2"
        line-width="23"
        @change="
          refreshing = true;
          onRefresh();
        "
        v-model="activityType"
      >
        <van-tab
          v-for="(item, index) in activityTypes"
          :key="index"
          :title="item.name"
          :name="item.type"
        ></van-tab>
      </van-tabs>
    </van-sticky>

    <van-tabs
      class="vanTabs_2"
      v-model="tagId"
      @change="
        refreshing = true;
        onRefresh();
      "
    >
      <van-tab
        v-for="(item, index) in activityStypes"
        :key="index"
        :title="item.tagName"
        :name="item.tagId"
      ></van-tab>
    </van-tabs>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      style="padding-bottom: 60px"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        loading-text="加载中"
        :finished-text="!list.length || list.length < 5 ? '' : '到底啦'"
        @load="onLoad"
        :error.sync="error"
      >
        <div class="list_wrap">
          <div
            v-for="(item, index) in list"
            :key="index"
            :title="item.activityName"
            @click="goPreview(item.activityId)"
          >
            <div class="imgWrap">
              <van-image
                fit="cover"
                :src="item.top.fileUrl"
                width="100%"
                height="100%"
                style="position: absolute"
              ></van-image>
            </div>
            <div class="c_f_center">
              {{ item.activityName }}
            </div>
          </div>
        </div>
        <van-empty
          v-if="!list.length"
          style="height: 480px"
          :image="require('../../../assets/img/app/empty.png')"
          description="此处空空如也"
        />
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
let throttle;
export default {
  name: "index",
  components: {},
  data() {
    return {
      step: 4,
      list: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      start: 0,
      count: 10,
      clalk: false,
      tagId: null,
      activityType: null,
      entry: "1",
      activityTypes: [
        { name: "全部", type: null },
        { name: "微传单", type: 1 },
        { name: "拼团", type: 3 },
        { name: "抢购", type: 2 },
        { name: "砍价", type: 4 },
        { name: "助力", type: 5 },
      ],
      activityStypes: [],
      scrollTop: 0,
    };
  },
  methods: {
    tabClick(a, b) {
      console.log(a);
      console.log(b);
    },
    goPreview(id) {
      this.$router.push({
        path: "/preview",
        query: { id: id, tem: 1, tl: "模板预览" },
      });
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
      this.yznReq(
        "get",
        "api/oa/show/listTemp",
        {
          start: this.start,
          count: this.count,
          tagId: this.tagId == 0 ? undefined : this.tagId,
          activityType: this.activityType == 0 ? undefined : this.activityType,
        },
        true
      )
        .then((res) => {
          if (res.status == 200) {
            this.loading = false;
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
    },
    getlistTag() {
      this.yznReq("get", "api/oa/show/listTag", {}).then((res) => {
        if (res.status == 200) {
          res.context.unshift({ tagName: "全部", tagId: null });
          this.activityStypes = res.context;
        }
      });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.onLoad();
    },
    toTop() {
      document.body.scrollIntoView();
    },
  },
  mounted() {
    if (!localStorage.getItem("firstLoad")) {
      this.step = 1;
      localStorage.setItem("firstLoad", 1);
    }
    this.getlistTag();
    let that = this;
    // 滚动防抖
    throttle = this.$debounce(function () {
      let scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      console.log(scrollTop);
      that.scrollTop = scrollTop;
    }, 100);
    window.addEventListener("scroll", throttle);
  },
  destroyed() {
    window.removeEventListener("scroll", throttle);
  },
};
</script>
<style lang="less" scoped>
.toTop {
  width: 50px;
  height: 50px;
  background: url("../../../assets/img/app/totTop.png") no-repeat;
  background-size: contain;
  position: fixed;
  bottom: 50px;
  right: 10px;
  z-index: 1;
}
.msk {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1993;
  background-color: rgba(0, 0, 0, 0.6);
  .step1 {
    width: 360px;
    height: 260px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .step2 {
    width: 319px;
    height: 352px;
    position: absolute;
    top: 60px;
    left: 14px;
  }
  .step3 {
    width: 317px;
    height: 338px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
.swiper {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1993;
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
    img {
      width: 100%;
      display: block;
    }
    .van-button {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      height: 40px;
      border-radius: 4px;
    }
  }
}

.list_wrap {
  width: 100%;
  padding: 0 4px 0 14px;
  overflow: auto;
  > div {
    width: 50%;
    float: left;
    padding-right: 10px;
    padding-bottom: 10px;
    .imgWrap {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      overflow: hidden;
      margin: 0;
      position: relative;
      border: 1px solid #f0f0f0;
      border-bottom: none;
    }
    .c_f_center {
      width: 100%;
      height: 28px;
      background-color: #fff;
      border: 1px solid #f0f0f0;
      border-top: none;
      border-radius: 0 0 4px 4px;
    }
    img {
      display: inline-block;
      border-radius: 4px 4px 0 0;
      width: 100%;
    }
  }
}
/deep/.van-sticky {
  padding-bottom: 2px;
  top: -1px;
  .van-tabs {
    box-shadow: 0 0 2px 0px #efefef;
    .van-tabs__nav--line {
      padding: 0 2px;
      .van-tabs__line {
        background-color: #13c2c2;
        bottom: 0;
      }
    }
  }
}

/deep/.vanTabs_2 {
  .van-tabs__nav--line {
    padding: 0 9px;
    .van-tab {
      // flex: inherit;
      padding: 0 5px;
      span {
        display: inline-block;
        background-color: #f0f0f0;
        color: #595959;
        padding: 0 9px;
        height: 22px;
        line-height: 22px;
        border-radius: 11px;
        transition: all 0.2s;
      }
    }
    .van-tab--active {
      padding: 0 5px;
      span {
        display: inline-block;
        background-color: #13c2c2;
        color: #fff;
        padding: 0 9px;
        height: 22px;
        line-height: 22px;
        border-radius: 11px;
        transition: all 0.2s;
      }
    }
    .van-tabs__line {
      display: none;
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
