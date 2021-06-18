<template>
  <div>
    <div class="fix-join end" v-if="upDownStatus === 0">活动未发布</div>
    <!-- <div class="fix-join end" v-if="status == 3 && !join">活动已结束</div> -->
    <div class="fix-join end" v-if="upDownStatus === -1">活动已下架</div>
    <div class="fix-join end" v-if="status == 1">活动未开始</div>
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
      v-if="status == 2 && !showActivityJoin && (pack.placesLimit == 1 && pack.remainingAllowed < 1) && (!fromOpenid && fromOpenid != openid) "
    >
      活动名额已满，下次记得早点来呦
    </div>
     <!-- &&(!fromOpenid || fromOpenid == openid) -->
    <div
      class="fix-record"
      v-if="
        status == 2 &&
        showActivityJoin &&
        showActivityJoin.activitySuccess == 2 &&
        join == 1 
      "
    >
      <div class="txt txt2" v-if="joinList[0].selfCutStatus != -1">
        <span @click="cutPay(showActivityJoin)">自砍一刀</span>
      </div>
      <div class="txt txt2" v-else>
        <span @click="showShare">邀请好友砍价</span>
      </div>
      <van-button
        @click="toPayHelp(showActivityJoin)"
        class="record-btn bt2"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
      >
        <span>立即付款<br /></span>
        <span class="bot">当前价:￥{{ showActivityJoin.currentPrice }}</span>
      </van-button>
    </div>

    <div
      class="fix-record"
      v-if="showActivityJoin &&
        ((status == 2 && showActivityJoin.activitySuccess == 1) || 
        (status == 3 && showActivityJoin.activitySuccess == -1) )
        &&
        (!fromOpenid || fromOpenid == openid) &&
        showActivityJoin.paymentFlag != 1
      "
    >
      <van-button
        @click="toPayHelp(showActivityJoin)"
        class="record-btn bt2"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
      >
        <span>立即付款<br /></span>
        <span class="bot" v-if="status == 3"
          >当前价:￥{{ showActivityJoin.currentPrice }}</span
        >
      </van-button>
    </div>

    <div
      v-if="
        (showActivityJoin &&
          showActivityJoin.paymentFlag == 1 &&
          (!fromOpenid || fromOpenid == openid)) ||
        (join > 1 && (!fromOpenid || fromOpenid == openid))
      "
      class="fix-record"
    >
      <div class="txt" @click="toRecord">报名记录</div>
    </div>

    <div
      class="fix-record"
      v-if="status == 2 && fromOpenid && fromOpenid != openid && joinList && joinList.length"
    >
      <div class="txt txt2" @click="joinActive()" v-if="!showActivityJoin">
        我也要参与
      </div>
      <div class="txt txt2" @click="toMy()" v-if="showActivityJoin">
        查看我的砍价
      </div>
      <van-button
        v-if="joinList.length == 1"
        @click="cutPay(joinList && joinList[0])"
        class="record-btn bt2"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >帮TA砍价</van-button
      >
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  props: [
    "status",
    "joinList",
    "join",
    "fromOpenid",
    "showActivityJoin",
    "upDownStatus",
    "openid",
    "pack"
  ],
  data() {
    return {
      //isSelfCut: true,
    };
  },
  mounted() {
    //console.log(this.paySet)
  },
  methods: {
    cutPay(e) {
      // if (status == 3) {
      //   this.setIndexPop({
      //     show: true,
      //     title: "活动已结束",
      //     type: "1",
      //     btn: `确定`,
      //     desc: "下次记得早点来哦~",
      //   });
      // } else if (e.paymentFlag && this.fromOpenid) {
      //   this.setIndexPop({
      //     show: true,
      //     btn: "确定",
      //     type: "1",
      //     title: `好友已成功购买啦!`,
      //   });
      // } else if (e.activitySuccess == 1 && this.fromOpenid) {
      //   this.setIndexPop({
      //     show: true,
      //     btn: "确定",
      //     type: "1",
      //     title: `好友已砍价成功啦!`,
      //   });
      // } else {
      this.$emit("cutPay", e);
      //}
    },
    joinActive() {
      // this.$router.push({
      //   path: "/index",
      //   query: {
      //     id: this.getActivityId,
      //     referralDataId: this.$route.query.referralDataId,
      //   },
      // });
      // window.location.reload();
      this.$emit("joinActive");
    },
    toPayHelp(e) {
      this.$emit("toPayHelp", e);
    },
    toRecord() {
      this.$router.push({ path: "/record" });
    },
    toMy() {
      this.$router.push({
        path: "/index",
        query: {
          id: this.getActivityId,
          referralDataId: this.$route.query.referralDataId,
        },
      });
      window.location.reload();
    },
    showShare() {
      this.$emit("toShowShare", { shareSty: 2 });
    },
    //...mapMutations("common", ["setIndexPop"]),
  },
  computed : {
    ...mapGetters(["getActivityId"])
  }
  // computed: {
  //   isDeadTimeBefore () {
  //     let d = this.deadTime
  //     return moment().isBefore(moment(d))
  //   }
  // }
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
</style>