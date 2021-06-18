<template>
  <div>
    <div class="bargain" v-for="(item, index) in joinList" :key="index">
      <div class="bargain-title">
        <span class="left"></span>
        <span class="text">{{ getTitle(item) }}</span>
        <span class="right"></span>
      </div>
      <div class="bargain-pro">
        <div class="line-box">
          <div
            :style="{
              '--left': (item.currentPrice * 100) / item.originalPrice + '%',
              '--move': -((item.currentPrice * 100) / item.originalPrice) + '%',
            }"
            :class="{ d: (item.currentPrice * 100) / item.originalPrice > 60 }"
            class="line-txt move"
          >
            <span v-if="item.activitySuccess == 2"
              >当前:￥{{ item.currentPrice }}</span
            >
            <span v-if="item.activitySuccess == 1">恭喜你！砍至底价</span>
          </div>
        </div>
        <van-progress
          :class="{ 'pro-suc': item.activitySuccess == 1 }"
          :percentage="(item.currentPrice * 100) / item.originalPrice"
          :stroke-width="10"
          pivot-text=""
          pivot-color="#7232dd"
          color="linear-gradient(to right, #F87E7E, #C63434)"
        />
        <div class="x">
          <img
            v-if="item.activitySuccess == 2"
            :style="{ left: '10%' }"
            src="@/assets/img/weChat/di.png"
            alt=""
          />
          <img
            :style="{
              left: (item.currentPrice * 100) / item.originalPrice + '%',
            }"
            src="@/assets/img/weChat/jia.png"
            alt=""
          />
        </div>
        <div class="price">
          <span>底价￥{{ item.floorPrice }}</span>
          <span>原价￥{{ item.originalPrice }}</span>
        </div>
      </div>
      <div
        class="bargain-info"
        v-if="joinList && joinList.length > 1 && !fromRecord"
      >
        <img :src="item.headimgurl" />
        <span class="name"
          >{{ item.potentialCustomer.name }}/{{
            getAge(item.potentialCustomer.birthday)
          }}</span
        >
        <span
          class="more"
          @click="toMore(item)"
          v-if="item.activityHelpList && item.activityHelpList.length"
          >查看砍价帮>></span
        >
      </div>
      <div
        class="bar-btn"
        v-if="joinList && joinList.length > 1 && !fromRecord"
      >
        <div v-if="item.activitySuccess == 2 && !fromOpenid" class="btns">
          <van-button
            v-if="item.selfCutStatus != -1"
            @click="cutPay(item)"
            class="lesson-btn"
            color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >
            <span>自砍一刀</span>
          </van-button>
          <van-button
            v-else
            class="lesson-btn"
            color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >
            <span>邀请好友帮砍</span>
          </van-button>
          <van-button
            v-if="!item.paymentFlag"
            @click="toPayHelp(item)"
            class="lesson-btn"
            color="linear-gradient(180deg, #00A1DF 0%, #0082D4 100%)"
          >
            <span>立即付款</span>
          </van-button>
        </div>
        <van-button
          v-if="item.activitySuccess == 1 && !item.paymentFlag && !fromOpenid"
          @click="toPayHelp(item)"
          class="lesson-btn"
          color="linear-gradient(180deg, #00A1DF 0%, #0082D4 100%)"
        >
          <span>立即付款</span>
        </van-button>
        <van-button
          disabled
          color="#F3F3F3"
          v-if="item.activitySuccess == 1 && item.paymentFlag && !fromOpenid"
          class="sucBtn"
        >
          <van-icon name="checked" class="ic" />
          <span>付款成功</span>
        </van-button>
        <van-button
          v-if="item.activitySuccess == 2 && fromOpenid"
          @click="cutPay(item)"
          color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >
          <span>帮TA砍价</span>
        </van-button>

        <van-button
          v-if="item.activitySuccess == -1 && !item.paymentFlag && !fromOpenid"
          @click="toPayHelp(item)"
          class="lesson-btn"
          color="linear-gradient(180deg, #00A1DF 0%, #0082D4 100%)"
        >
          <span>立即付款</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
let aclist = [
  {
    id: 1,
    txt: "砍价完成",
  },
  {
    id: 2,
    txt: "砍价进行中",
  },
  {
    id: -1,
    txt: "砍价截止",
  },
];
export default {
  props: {
    joinList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fromOpenid: {
      type: String,
      default: "",
    },
    fromRecord: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    //console.log(this.joinList);
  },
  data() {
    return {
      title: "砍价进行中",
      percent: 60,
    };
  },
  methods: {
    toMore(item) {
      this.$emit("showLog", {
        type: "bargain",
        //share: false,
        list: item.activityHelpList,
      });
    },
    cutPay(item) {
      this.$emit("cutPay", item);
    },
    toPayHelp(item) {
      this.$emit("toPayHelp", item);
    },
    getTitle(item) {
      if (item.paymentFlag == 1) {
        return "报名成功";
      } else {
        let obj = aclist.find((i) => i.id == item.activitySuccess);
        return obj && obj.txt;
      }
    },
    getAge(birthday) {
      let m = moment.duration(moment().diff(birthday));
      return this.formatDuration(m);
    },
    formatDuration(duration) {
      let years = duration.years();
      let months = duration.months();
      let days = duration.days();
      let result = "";
      if (years === 1) {
        result += "1岁";
      } else if (years > 1) {
        result += years + "岁";
      }
      if (months === 1) {
        result += "1个月";
      } else if (months > 1) {
        result += months + "个月";
      }
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
.bargain {
  padding-top: 14px;
  border-top: 1px dotted #f2ebeb;
}
.pro-suc {
  background: #ffdfaf;
}

.bargain-title {
  display: flex;
  font-size: 16px;
  color: #595959;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  .left {
    width: 43px;
    height: 6px;
    background: url("../../../../assets/img/weChat/zuo.png") center center/100%
      100% no-repeat;
  }
  .right {
    width: 43px;
    height: 6px;
    background: url("../../../../assets/img/weChat/you.png") center center/100%
      100% no-repeat;
  }
  .text {
    padding: 0 9px;
  }
}
.bargain-pro {
  position: relative;
  width: 90%;
  margin: 0 auto 10px;
  .x {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      position: absolute;
      width: 40px;
      height: 40px;
      z-index: 160;
      bottom: 8px;
      margin-left: -20px;
    }
  }
  .line-box {
    width: 100%;
    margin: 0 auto;
    .line-txt {
      margin-bottom: 16px;
      position: relative;
      z-index: 108;
      font-size: 11px;
      background: #c63434;
      display: inline-block;
      color: #fff;
      padding: 0 2px;
      border-radius: 4px;
      &.move {
        left: var(--left);
        transform: translateX(var(--move));
      }
      &::after {
        content: "";
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 6px solid #c63434;
        position: absolute;
        bottom: -4px;
        left: var(--left);
      }
      &.d::after {
        margin-left: -6px;
      }
    }
  }
  .price {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #23150c;
    margin-top: 5px;
    :last-child {
      color: #595959;
    }
  }
}
.bargain-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 6px;
  }
  .name {
    color: #292929;
    font-size: 12px;
    flex-grow: 1;
  }
  .more {
    font-size: 12px;
    color: #777777;
  }
}
.bar-btn {
  height: 36px;
  display: flex;
  margin-top: 12px;
  margin-bottom: 16px;
  .btns {
    display: flex;
    width: 100%;
    > :nth-child(1) {
      margin-right: 11px;
    }
  }
  > :nth-child(2) {
    margin-left: 11px;
  }
  button {
    text-align: center;
    height: 36px;
    flex: 1;
  }
  .ic {
    vertical-align: middle;
    margin-right: 3px;
  }
}
.sucBtn {
  /deep/ .van-button__text {
    color: #0089d6;
  }
}
.sucBtn.van-button--disabled {
  opacity: 1;
}
</style>