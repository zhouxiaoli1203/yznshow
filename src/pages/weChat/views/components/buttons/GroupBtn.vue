<template>
  <div>
    <div class="fix-join end" v-if="upDownStatus === 0">活动未发布</div>
    <div class="fix-join end" v-if="upDownStatus === -1">活动已下架</div>
    <div class="fix-join end" v-if="status == 3 && !showActivityJoin">活动已结束</div>
    <div class="fix-join end" v-if="status == 1">活动未开始</div>

    <!-- 未参与活动   未从分享进入 -->
    <div
      class="fix-join"
      @click="joinActive"
      v-if="status == 2 &&  !showActivityJoin
        && (pack.placesLimit != 1 || pack.remainingAllowed )
      "
    >
      我要开团
    </div>

    <div
      class="fix-join end"
      v-if="status == 2 && (!fromOpenid || fromOpenid == openid) && !showActivityJoin
        && (pack.placesLimit == 1 && pack.remainingAllowed < 1)
      "
    >
      活动名额已满，下次记得早点来呦
    </div>

    <!-- 参与1人   未从分享进入 -->
    <div
      class="fix-join"
      @click="showShare"
      v-if="status == 2 && (!fromOpenid || fromOpenid == openid) && showActivityJoin && myGroup && myGroup.length == 1 && myGroup[0].activitySuccess == 2"
    >
      邀请好友参团
    </div>
    
    <div
      class="fix-record"
      @click="toRecord"
      v-if="(!fromOpenid || fromOpenid == openid) &&( 
        (myGroup && myGroup.length > 1) || 
        (myGroup && myGroup.length == 1 && (myGroup[0].activitySuccess !=2 || status == 3) )
      )
      "
    >
      报名记录 
    </div>

    <!-- 已参与   从分享进入 -->
    <div
      class="fix-join"
      @click='toMyGroup'
      v-if="status == 2 && (fromOpenid && fromOpenid != openid) && showActivityJoin"
    >
      查看我的团
    </div>

    <!-- 未参与   从分享进入 分享者只有一个项目 -->
    <div
      v-if="status == 2  && !showActivityJoin && (fromOpenid && fromOpenid != openid) && (myGroup && myGroup.length == 1)"
      class="fix-record"
    >
      <div class="txt" @click="joinActive" >自己开团</div>
      <van-button
        @click="toJoinNow"
        class="record-btn"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
      >
        参加TA的团
      </van-button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex"; 
export default {
  // join
  props: ["status", "fromOpenid", "showActivityJoin", "upDownStatus", 'myGroup', "pack", "openid"],
  mounted() {},
  methods: {
    // getD() {
    //   console.log("status (状态) = " + this.status);
    //   console.log("fromOpenid = " + this.fromOpenid);
     
    //   //console.log("lessonNum(是否多课程) = " + this.lessonNum);
    // },
    joinActive(d) {
      // if (d) {
      //   this.$emit("joinActive");
      // } else {
      //   this.$emit("joinActive", d);
      // }
      this.$emit("joinActive");
    },
    toRecord () {
      this.$router.push({ path: "/record" });
    },
    toJoinNow() {
      this.$emit("toJoinNow", {
        groupId: this.myGroup[0].groupId,
        contentId: this.myGroup[0].contentId,
      });
    },
    toMyGroup () {
      this.$router.push({
        path: "/index",
        query: {
          id: this.getActivityId,
          referralDataId: this.$route.query.referralDataId,
        }
      })
      window.location.reload()
    },
    showShare () {
      // this.$parent.showShare = true
      // this.$parent.shareSty = 1
      this.$emit('toShowShare', {groupId: this.showActivityJoin.groupId})
    }
  },
  computed : {
    ...mapGetters(["getActivityId"])
  }
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
  text-align: center;
  font-size: 18px;
  color: #DC2E2E;
  background: #F8F8F8;
  justify-content: center;
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