<template>
  <div>
    <div class="fix-join end" v-if="upDownStatus === 0">活动未发布</div>
    <div class="fix-join end" v-if="status == 1">活动未开始</div>
    <div class="fix-join end" v-if="upDownStatus === -1">活动已下架</div>

    <div
      class="fix-join"
      @click="joinActive"
      v-if="
        status == 2 &&
        !showActivityJoin &&
        (!fromOpenid || fromOpenid == openid) && 
        (pack.placesLimit != 1 || pack.remainingAllowed )
      "
    >
      我要参与
    </div>

    <div
      class="fix-join"
      @click="joinActive"
      v-if="
        status == 2 &&
        !showActivityJoin &&
        (fromOpenid && fromOpenid != openid) &&
        (pack.placesLimit != 1 || pack.remainingAllowed ) && (!joinList || !joinList.length)

      "
    >
      我要参与
    </div>

    <div
      class="fix-join end"
      v-if="
        status == 2 &&
        !showActivityJoin &&
        (!fromOpenid || fromOpenid == openid)
        && (pack.placesLimit == 1 && pack.remainingAllowed < 1)
       
      "
    >
      活动名额已满，下次记得早点来呦
    </div>

    <!-- && (!fromOpenid || fromOpenid == openid)
&& (!fromOpenid || fromOpenid == openid) -->
    <div
      class="fix-join"
      @click="toShowHelp"
      v-if="
        status == 2 &&
        showActivityJoin &&
        showActivityJoin.selfCutStatus != -1 && showActivityJoin.activitySuccess == 2
        
      "
    >
      为自己助力
    </div>

    <div
      class="fix-join"
      @click="showShare"
      v-if="
        status == 2 &&
        showActivityJoin &&
        showActivityJoin.selfCutStatus == -1 && showActivityJoin.activitySuccess == 2
        
      "
    >
      邀请好友助力
    </div>

    <div
      class="fix-join"
      @click="toPayHelp(showActivityJoin)"
      v-if="
        status == 2 &&
        showActivityJoin &&
        showActivityJoin.activitySuccess == 1 &&
        (!fromOpenid || fromOpenid == openid) &&
        showActivityJoin.paymentFlag != 1
      "
    >
      立即付款
    </div>

    <div
      class="fix-record"
      @click="toRecord"
      v-if="
        (showActivityJoin &&
          showActivityJoin.paymentFlag == 1 &&
          (!fromOpenid || fromOpenid == openid)) ||
        (joinList && joinList.length > 1 && (!fromOpenid || fromOpenid == openid))
      "
    >
      <div class="txt">报名记录</div>
    </div>

    <div
      class="fix-record"
      v-if="status == 2 && fromOpenid && fromOpenid != openid && joinList && joinList.length"
    >
      <div class="txt" @click="joinActive" v-if="!showActivityJoin">
        我也要参与
      </div>
      <div class="txt" @click="toMy" v-if="showActivityJoin">
        查看我的活动
      </div>
      <van-button
        v-if="joinList && joinList[0].activitySuccess == 2"
        @click="toShowHelp"
        class="record-btn"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
      >
        为TA助力
      </van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; 
export default {
  props: [
    "upDownStatus",
    "status",
    "fromOpenid",
    "openid",
    "showActivityJoin",
    "joinList",
    "pack"
  ],
  methods: {
    joinActive() {
      this.$emit("joinActive");
    },
    toMy () {
      this.$router.push({
        path: "/index",
        query: {
          id: this.getActivityId,
          referralDataId: this.$route.query.referralDataId,
        }
      })
      window.location.reload()
    },
    toShowHelp () {
      this.$emit("toShowHelp");
    },
    toRecord () {
      this.$router.push({ path: "/record" });
    },
    toPayHelp (e) {
      this.$emit("toPayHelp", e);
    },
    showShare () {
      this.$emit("toShowShare", {shareSty: 3});
    }
  },
  computed : {
    ...mapGetters(["getActivityId"])
  }
};
</script>

<style lang="less" scoped>
.fix-join {
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
</style>