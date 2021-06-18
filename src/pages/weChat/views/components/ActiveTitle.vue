<template>
  <div
    class="actitle"
    :class="{
      join: getActiveJoin.phone && getActiveType != 1 && getActiveType != 2,
    }"
    :style="{ background: color }"
  >
    <div
      v-if="getActiveJoin.phone && getActiveType != 1 && getActiveType != 2"
      class="join-info"
    >
      <img :src="getActiveJoin.headimgurl" />
      <div>
        <div class="join-name">{{ getActiveJoin.nickname }}</div>
        <div class="join-phone">{{ getActiveJoin.phone }}</div>
      </div>
    </div>
    <div class="name" :class="{ join: getActiveJoin.phone }">{{ name }}</div>
    <div class="time" v-if="client == 'oa' || !client">
      <!-- : activeStatus == 0
            ? "活动未发布" -->
      <span>
        {{
          activeStatus == 1 || (activeStatus == 0 && moment().diff(endTime, "seconds") >= 0)
            ? "距活动开始"
            : activeStatus == 2 ||
              (activeStatus == 0 &&
                endTime.diff(moment(), "seconds") > 0 &&
                moment().diff(beginTime, "seconds") >= 0)
            ? "距活动结束"
            : activeStatus == 3 ||
              (activeStatus == 0 && moment().diff(beginTime, "seconds") < 0)
            ? "当前活动已结束,下次记得早点来呀"
            : "活动已下架"
        }}
        <span
          v-if="activeStatus == 1 || activeStatus == 2 || activeStatus == 0"
        >
          <b>{{ diffDay }}</b
          >天 <b>{{ diffHour }}</b
          >时 <b>{{ diffMin }}</b
          >分 <b>{{ diffSec }}</b
          >秒
        </span>
      </span>
    </div>
    <div class="time" v-if="client == 'tem'">
      <span>
        距活动结束
        <span> <b>00</b>天 <b>00</b>时 <b>00</b>分 <b>00</b>秒 </span>
      </span>
    </div>
  </div>
</template>

<script>
let timer;
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";
export default {
  props: ["name", "beginTime", "endTime", "color", "activeStatus", "client"],
  data() {
    return {
      // activeName: "",
      // beginTime: "",
      // endTime: "",
      diffDay: "",
      diffHour: "",
      diffMin: "",
      diffSec: "",

      previewState: 1,

      //activeStatus: 1, // 1未开始  2已开始 3 结束
    };
  },
  created() {
    // this.activeName = "抢暑期芭蕾舞课程，最低仅需600元";
    // this.beginTime = this.getStartTime;
    // this.endTime = this.getEndTime;
  },
  mounted() {
    this.getDiffTime();

    timer = setInterval(() => {
      this.getDiffTime();
    }, 1000);
  },
  methods: {
    moment,
    getDiffTime() {
      let time = moment();
      if (!this.endTime || !this.beginTime) {
        return;
      }

      if (time.diff(this.endTime, "seconds") >= 0) {
        this.previewState = 3;
        // this.activeStatus = 3;
      } else if (
        this.endTime.diff(time, "seconds") > 0 &&
        time.diff(this.beginTime, "seconds") >= 0
      ) {
        // this.activeStatus = 2;
        this.previewState = 2;
        this.diffDay = this.endTime.diff(time, "days");
        this.diffHour = this.endTime.diff(time, "hours") % 24;
        this.diffMin = (this.endTime.diff(time, "minutes") % (24 * 60)) % 60;
        this.diffSec =
          (this.endTime.diff(time, "seconds") % (24 * 60 * 60)) % 60;
      } else {
        // this.activeStatus = 1;
        this.previewState = 1;
        this.diffDay = this.beginTime.diff(time, "days");
        this.diffHour = this.beginTime.diff(time, "hours") % 24;
        this.diffMin = (this.beginTime.diff(time, "minutes") % (24 * 60)) % 60;
        this.diffSec =
          (this.beginTime.diff(time, "seconds") % (24 * 60 * 60)) % 60;
      }
    },
  },
  destroyed() {
    clearInterval(timer);
  },
  computed: {
    ...mapGetters(["getActiveJoin", "getActiveType"]),
  },
};
</script>

<style lang="less" scoped>
.actitle {
  width: 359px;
  // height: 112px;
  // margin: 0 auto;
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -56px;
  // transform: translateY(-50%);
  margin: auto;
  //background: rgba(235, 97, 7, 0.85);
  border-radius: 8px;
  box-shadow: 0px 3px 21px 0px rgba(0, 0, 0, 0.09);
  padding-bottom: 10px;
  &.join {
    height: 169px;
  }
}
.join-info {
  // height: 50px;
  margin-top: 10px;

  border-bottom: 1px dotted #ffa464;
  margin-left: 8px;
  margin-right: 8px;
  display: flex;
  img {
    width: 50px;
    height: 50px;
    margin-left: 4px;
    margin-bottom: 10px;
    border-radius: 50%;
  }
  > div {
    margin-left: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 10px;
    .join-name {
      font-size: 15px;
      line-height: 21px;
      margin-bottom: 3px;
    }
    .join-phone {
      font-size: 13px;
      line-height: 18px;
    }
  }
}
.name {
  font-size: 18px;

  font-weight: 600;
  color: #ffffff;
  line-height: 25px;
  text-shadow: 0px 3px 21px rgba(0, 0, 0, 0.09);
  text-align: center;
  margin-top: 20px;
  margin-bottom: 12px;
  &.join {
    margin-top: 13px;
  }
}

.time {
  width: 315px;
  height: 30px;
  border-radius: 4px;
  background: #ffffff;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 6px 42px 0px rgba(0, 0, 0, 0.09);
  span {
    font-size: 11px;
    color: #555555;
    text-align: center;
    display: flex;
    align-items: center;
    b {
      background: #de4e39;
      color: #fff;
      width: 22px;
      height: 22px;
      line-height: 22px;
      display: inline-block;
      border-radius: 4px;
      margin: 0 3px;
    }
  }
}
</style>