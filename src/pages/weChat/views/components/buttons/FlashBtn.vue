<template>
  <div>

    <div class="fix-join end" v-if="upDownStatus === 0">活动未发布</div>
    <div class="fix-join end" v-if="status == 1">活动未开始</div>
    <div class="fix-join end" v-if="upDownStatus === -1">活动已下架</div>
    <div class="fix-join end" v-if="status == 3 && !join">活动已结束</div>
    

    <div class="fix-record"  v-if="(status == 3 || status == 2) && join">
      <div class="txt" @click="toRecord" >报名记录</div>
    </div>

    <!-- <div class="fix-record"  v-if="status == 2 && join ">
      <div class="txt" @click="toRecord" >报名记录</div>
    </div> -->

 
    <div
      class="fix-join"
      @click="joinActive"
      v-if="status == 2 && !join && type == 1 && (pack && !pack.paySwitch) &&
       ( pack.placesLimit != 1 || pack.remainingAllowed)"
    >
      我要报名
    </div>

    <div
      class="fix-join end"
      v-if="status == 2 && !join && type == 1  && (pack.placesLimit == 1 && pack.remainingAllowed < 1)"
    >
      活动名额已满，下次记得早点来呦
    </div>

    <div class="fix-pay"
       v-if="status == 2 && !join && type == 1 && (pack && pack.paySwitch)"
    >
      <div class="left">
        <span v-if="pack && pack.paySet == 3">预付款：</span>
        ￥{{pack.prepaidAmount}}</div>
      <div class="right" @click="joinActive">我要报名</div>
    </div>

    <div
      class="fix-join"
      @click="joinActive"
      v-if="status == 2 && !join && type == 2"
    >
      我要抢购
    </div>


  </div>
</template>

<script>
export default {
  props: ["status", "fromOpenid", "join", "lessonNum", "upDownStatus", "pack", "type"],
  mounted() {},
  methods: {
    joinActive(d) {
      this.$emit("joinActive");
    },
    toRecord () {
      this.$router.push({ path: "/record" });
    },
  },
};
</script>

<style lang="less" scoped>
.fix-join {
  // width: 375px;
  height: 50px;
  background: linear-gradient(180deg, #ff5c0a 0%, #e42a02 100%);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 200;
  line-height: 50px;
  color: #fff;
  font-size: 18px;
  text-align: center;
  &.end {
    background: #aca4a4;
    color: #fff;
    z-index: 9999;
  }
}

.fix-record {
  height: 50px;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 200;
  line-height: 50px;
  display: flex;

  .txt {
    background: #f8f8f8;
    flex: 1;
    color: #dc2e2e;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
  }
  .txt2 {
    font-size: 16px;
  }
  .record-btn {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 0;
    color: #ffffff;
    font-size: 18px;
    &.bt2 {
      font-size: 16px;
    }
    .bot {
      font-size: 12px;
      color: #ffd2d2;
    }
  }
}

.fix-pay {
  height: 50px;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 200;
  line-height: 50px;
  font-size: 18px;
  display: flex;
  align-items: center;
  .left {
    width: 50%;
    color: #F34507;
    background: #fff;
    text-align: center;
    span {
      font-size: 16px;
    }
  }
  .right {
    width: 50%;
    color: #fff;
    text-align: center;
    background: linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%);
  }
}
</style>