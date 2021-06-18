<template>
  <div>
    <div class="help" v-for="(item, index) in joinList" :key="index">
      <div class="help-title">
        <span class="left"></span>
        <span class="text">{{ getTitle(item.activitySuccess) }}</span>
        <span class="right"></span>
      </div>
      <div class="help-name" v-if="isMul">
        <img :src="item.headimgurl" />
        <span>{{ item.potentialCustomer.name }}</span>
        <span>{{ getAge(item.potentialCustomer.birthday) }}</span>
      </div>
      <div class="help-pro" :class="{ fail: item.activitySuccess == 3 }">
        <div class="line-box">
          <div
            :style="{
              '--left': (item.currentNumber * 100) / item.totalNumber + '%',
              '--move': (-item.currentNumber * 100) / item.totalNumber + '%',
            }"
            :class="{ d: (item.currentNumber * 100) / item.totalNumber > 60 }"
            class="help-num move"
          >
            <span v-if="item.activitySuccess != 3"
              >已助力{{ item.currentNumber || 0 }}/
              {{ item.totalNumber }}</span
            >
            <span v-if="item.activitySuccess == 3">很遗憾，助力失败</span>
          </div>
        </div>
        <van-progress
          :style="{
            '--left':
              item.currentNumber / item.totalNumber < 0.12
                ? '-5px'
                : item.currentNumber / item.totalNumber > 0.88
                ? '5px'
                : '0',
          }"
          :percentage="(item.currentNumber * 100) / item.totalNumber"
          :stroke-width="10"
          pivot-text=" "
          :pivot-color="item.activitySuccess == 3 ? '#BBBBBB' : '#7232dd'"
          color="linear-gradient(to right, #F87E7E, #C63434)"
        />
        <div class="help-result" v-if="item.activitySuccess != 1">
          还差{{ item.totalNumber - item.currentNumber }}个助力包成功
        </div>
        <div class="help-result" v-if="item.activitySuccess == 1">
          助力成功
        </div>
      </div>
      <div v-if="isMul && item.activitySuccess == 2 && fromOpenid " class="shart-box">
        <van-button
          @click="openSharHelp(item)"
          class="share"
          color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >
          <span>助力</span>
        </van-button>
      </div>
      <div v-if="isMul && item.activitySuccess == 2 && !fromOpenid " class="shart-box">
        <van-button
          @click="openSharHelp(item)"
          class="share"
          color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >
          <span>助力</span>
        </van-button>
      </div>
      <div v-if="isMul && item.activitySuccess == 1 && !fromOpenid && item.paymentFlag == 0" class="shart-box">
        <van-button
          @click="openPayHelp(item)"
          class="share"
          color="linear-gradient(180deg, #00A1DF 0%, #0082D4 100%)"
        >
          <span>立即付款</span>
        </van-button>
      </div>
      <div v-if="isMul && item.activitySuccess == 1 && !fromOpenid && item.paymentFlag == 1" class="shart-box">
        <van-button
          disabled
          class="share payed"
          color="#F3F3F3"
        >
          <van-icon name="checked" class="ic"/>
          <span>付款成功</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
let aclist = [{
  id: 1,
  txt: '助力成功'
}, {
  id: 2,
  txt: '助力进行中'
}, {
  id: -1,
  txt: '助力失败'
}]
export default {
  props: {
    joinList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  mounted() {
    this.fromOpenid = this.$route.query.fromOpenid
    console.log(this.joinList);
  },
  data() {
    return {
      fromOpenid: '',
      // title: "助力进行中",
      percent: 50,
      isEnd: true,
      //isMul: true,
    };
  },
  computed: {
    isMul() {
      return this.joinList.length > 1;
    },
  },
  methods: {
    // toShowShare (e) {
    //   this.$emit("toShowShare",e)
    // },
    openSharHelp(e) {
      this.$emit("toShowHelp", e);
    },
    openPayHelp (e) {
      this.$emit("toPayHelp", e);
    },
    getAge(birthday) {
      let m = moment.duration(moment().diff(birthday))
      return this.formatDuration(m);
    },
    getTitle (id) {
      let obj = aclist.find(i => i.id == id)
      return obj && obj.txt
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
      // if (days === 1) {
      //   result += "one day ";
      // } else if (days > 1) {
      //   result += days + " days ";
      // }
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
.help {
  padding-top: 14px;
  border-top: 1px dotted #f2ebeb;
  /deep/ .van-progress__pivot {
    width: 35px;
    height: 34px;
    background: url("../../../../assets/img/weChat/gift.png") center center/150%
      150% no-repeat !important;
    top: 2px;
    z-index: 99;
    margin-left: var(--left);
  }
  // /deep/ .van-progress::before {
  //   content: "";
  //   display: block;
  //   height: 10px;
  //   position: absolute;
  //   width: 20px;
  //   background: #fff;
  //   z-index: 9;
  // }
  // /deep/ .van-progress::after {
  //   content: "";
  //   display: block;
  //   height: 10px;
  //   position: absolute;
  //   width: 20px;
  //   right: 0;
  //   background: #fff;
  //   z-index: 9;
  // }
  /deep/ .van-progress {
    width: 90%;
    margin: auto;
    background: #fbe2a4;
  }
}
.help-name {
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 12px;
  color: #292929;
  margin-bottom: 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  span {
    margin-left: 6px;
  }
}
.help-title {
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
.help-pro {
  position: relative;
  margin-bottom: 10px;
  .line-box {
    width: 90%;
    margin: 0 auto;
  }
  .help-num {
    margin-bottom: 20px;
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
  &.fail .help-num {
    background: #a3a3a3;
    &::after {
      content: "";
      border-top: 6px solid #a3a3a3;
    }
  }
  &.fail {
    /deep/ .van-progress {
      background: #eaeaea;
    }
    /deep/ .van-progress__pivot {
      background: url("../../../../assets/img/weChat/gift2.png") center
        center/100% 100% no-repeat !important;
    }
  }
}
.help-result {
  font-size: 11px;
  color: #595959;
  text-align: right;
  margin: 6px auto 0;
  width: 90%;
}
.shart-box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.share {
  width: 303px;
  height: 36px;
  line-height: 36px;
  &.payed /deep/ .van-button__text {
    color: #0089D6;
  }
  .ic {
    vertical-align: middle;
    margin-right: 3px;
  }
}
</style>