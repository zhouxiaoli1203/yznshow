<template>
  <div class="actitle" :style="{background: getTopItem.color}">
    <div class="name" >{{ activeName }}</div>
    <div class="time">
      <span>
        {{
          activeStatus == 1
            ? "距活动开始"
            : activeStatus == 2
            ? "距活动结束"
            : "当前活动已结束,下次记得早点来呀"
        }}
        <span v-if="activeStatus !== 3">
          <b>{{ diffDay }}</b
          >天 <b>{{ diffHour }}</b
          >时 <b>{{ diffMin }}</b
          >分 <b>{{ diffSec }}</b
          >秒
        </span>
      </span>
    </div>
  </div>
</template>

<script>
let timer;
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeName: "",
      beginTime: "",
      endTime: "",
      diffDay: "",
      diffHour: "",
      diffMin: "",
      diffSec: "",

      activeStatus: 1, // 1未开始  2已开始 3 结束
    };
  },
  created() {
    this.activeName = "抢暑期芭蕾舞课程，最低仅需600元";
    this.beginTime = this.getStartTime;
    this.endTime = this.getEndTime;
    this.getDiffTime();

    timer = setInterval(() => {
      this.getDiffTime();
    }, 1000);
  },
  methods: {
    getDiffTime() {
      let time = moment();
      if (!this.endTime || !this.beginTime) {
        return;
      }
      if (time.diff(this.endTime, "seconds") >= 0) {
        this.activeStatus = 3;
      } else if (
        this.endTime.diff(time, "seconds") > 0 &&
        time.diff(this.beginTime, "seconds") >= 0
      ) {
        this.activeStatus = 2;
        this.diffDay = this.endTime.diff(time, "days");
        this.diffHour = this.endTime.diff(time, "hours") % 24;
        this.diffMin = (this.endTime.diff(time, "minutes") % (24 * 60)) % 60;
        this.diffSec =
          (this.endTime.diff(time, "seconds") % (24 * 60 * 60)) % 60;
      } else {
        this.activeStatus = 1;
        this.diffDay = this.beginTime.diff(time, "days");
        this.diffHour = this.beginTime.diff(time, "hours") % 24;
        this.diffMin = (this.beginTime.diff(time, "minutes") % (24 * 60)) % 60;
        this.diffSec =
          (this.beginTime.diff(time, "seconds") % (24 * 60 * 60)) % 60;
      }
    },
  },
  computed: {
    ...mapGetters(["getName", "getEndTime", "getStartTime", "getTopItem"]),
  },
  watch: {
    getName(val) {
      this.activeName = val;
    },
    getStartTime(val) {
      this.beginTime = val;
      clearInterval(timer);
      timer = setInterval(() => {
        this.getDiffTime();
      }, 1000);
    },
    getEndTime(val) {
      this.endTime = val;
      //this.getDiffTime();
      clearInterval(timer);
      timer = setInterval(() => {
        this.getDiffTime();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.actitle {
  width: 718px;
  min-height: 224px;
  padding-bottom:40px;
  // margin: 0 auto;
  overflow: hidden;
  position: absolute;
  // bottom: -112px;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin: auto;
  //background: rgba(235, 97, 7, 0.85);
  border-radius: 8px;
  box-shadow: 0px 6px 42px 0px rgba(0, 0, 0, 0.09);
  &.isTop {
    bottom: 0;
  }
}

.name {
  font-size: 36px;
  font-weight: 600;
  color: #ffffff;
  line-height: 50px;
  min-height: 50px;
  text-shadow: 0px 6px 42px rgba(0, 0, 0, 0.09);
  text-align: center;
  width: 80%;
  margin:40px auto 24px;
}

.time {
  width: 630px;
  height: 60px;
  border-radius: 8px;
  background: #ffffff;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 6px 42px 0px rgba(0, 0, 0, 0.09);
  span {
    font-size: 22px;
    color: #555555;
    text-align: center;
    display: flex;
    align-items: center;
    b {
      background: #de4e39;
      color: #fff;
      width: 44px;
      height: 44px;
      line-height: 44px;
      display: inline-block;
      border-radius: 8px;
      margin: 0 6px;
    }
  }
}
</style>