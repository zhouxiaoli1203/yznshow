<template>
  <div class="all-group">
    <div class="group-title">
      <span class="left"></span>
      <span class="text">{{ title }}</span>
      <span class="right"></span>
    </div>

    <p v-if="type == -1">很遗憾您未达成拼团人数，下次再接再厉哟！</p>
    <p v-if="type == 2">
      还差 <b>{{ need_num }}</b> 人到达最高梯度团
    </p>
    <p v-if="type == 1">
      您最终的拼团价格为： <b>{{ need_num }}</b>
    </p>

    <div class="joins">
      <div class="head">
        <img :src="headImg" />
        <span>团长</span>
      </div>
      <div class="items" :style="{ width: getListLen(rule[rule.length - 1].number) }">
        <!--  -->
        <div
          v-for="(item, index) in filtersGroup(myGroup, rule)"
          :key="index"
          class="teams"
          :style="{ left: index * 32 + 'px', zIndex: 10 + index }"
        >
          <div v-if="!item.headimgurl && !item.name">
            <span>?</span>
          </div>
          <div v-if="item.headimgurl">
            <img :src="item.headimgurl" />
          </div>
          <div v-if="item.name" class="names">
            <span class="name">{{item.name}} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: [
    // "isFirst",
    // "type",
    // "acJoinList",
    "myGroup",
    // "fromOpenid",
    // "showShare",
    // "signed",
    "rule",
    "type",
  ],
  data() {
    return {
      list: [{}, {}, {}, {}],
      statusList: [
        {
          type: 1,
          txt: "拼团成功",
        },
        {
          type: -1,
          txt: "拼团失败",
        },
        {
          type: 2,
          txt: "拼团中",
        },
      ],
      // need_txt: "",

      // active_succ: "",
      // max_num: "",
      need_num: "",
      headImg: "",
    };
  },
  mounted() {
    //this.getNeedNum();
    this.getNeedTxt();
    this.findHead();
  },
  methods: {
    getNeedTxt() {
      if (this.type == 2) {
        // 进行中
        let r = this.rule[this.rule.length - 1];
        let num = r.number;
        if (this.myGroup) {
          let myNum = this.myGroup.length;
          this.need_num = num - myNum;
        }
      } else if (this.type == 1) {
        // 拼团成功
        let r = this.rule[this.rule.length - 1];
        this.need_num = `${r.number}人团￥${r.price}`;
      }
    },
    filtersGroup(list, rule) {
      if (!list || !list.length) {
        return;
      }
      let arr = [];
      arr = list.filter((i) => {
        return i.headFlag != 1;
      });
      let total = rule[rule.length - 1].number;
      arr.forEach((i) => {
        i.img = i.headimgurl;
      });
      for (let i = arr.length; i < total - 1; i++) {
        arr.push({});
      }
      if (arr.length > 4) {
        let n = arr.length;
        arr = arr.slice(0, 3);
        arr.push({
          name: `等${n + 1}人`,
        });
      }

      return arr;
    },

    findHead() {
      let obj = this.myGroup.find((i) => {
        return i.headFlag == 1;
      });
      this.headImg = obj.headimgurl;
    },
  },
  computed: {
    title() {
      let obj = this.statusList.find((i) => i.type == this.type);
      return obj && obj.txt;
    },
    getListLen() {
      return (x) => {
        if (x > 4) {
          return 3 * 32 + 40 + "px";
        } else if (x > 2) {
          return (x - 1) * 32 + 40 + "px";
        } else {
          return 40 + "px";
        }
      };
    },
    ...mapGetters(["getActivityId"]),
  },
};
</script>

<style lang="less" scoped>
.all-group {
  border-top: 1px dotted #f2ebeb;
  padding: 14px 22px 8px;
  margin-top: 10px;
  p {
    margin-bottom: 0;
    color: #23150c;
    font-size: 12px;
    text-align: center;
    b {
      font-weight: normal;
      color: #dc2a2a;
    }
  }
  .share {
    width: 303px;
    height: 36px;
    line-height: 36px;
    margin-top: 12px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
.group-title {
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
.joins {
  display: flex;
  align-items: center;
  overflow: hidden;
  min-height: 60px;
  justify-content: center;
  .head {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    line-height: 1;
    position: relative;
    margin-right: 8px;
    img {
      width: 40px;
      height: 40px;
      border: 1px solid #fba233;
      border-radius: 50%;
    }
    span {
      text-align: center;
      bottom: -8px;
      left: 0px;
      right: 0;
      margin: 0 auto;
      border-radius: 8px;
      position: absolute;
      background: #fba233;
      width: 35px;
      height: 16px;
      font-size: 12px;
      color: #ffffff;
      line-height: 16px;
    }
  }
  .items {
    position: relative;
    display: flex;
    height: 40px;
    // flex-grow: 1;
    // overflow: hidden;
  }
  .teams {
    width: 40px;
    height: 40px;
    position: absolute;
    span {
      background: #dddddd;
      color: #fff;
      font-size: 26px;
      text-align: center;
      display: inline-block;
      height: 38px;
      width: 38px;
      line-height: 38px;
      border-radius: 50%;
      border: 1px dashed #e18888;
    }
    .total > span {
      font-size: 10px;
      color: #dc2a2a;
      background: #f2ebeb;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .name {
      font-size: 10px;
      color: #dc2a2a;
      line-height: 38x;
      text-align: center;
    }
    .names > span {
      border: 1px solid #f2ebeb;
      background: #f2ebeb;
    }
  }
  .right-txt {
    font-size: 12px;
    color: #4c1b1b;
  }
  .join-list {
    margin-right: 15px;
    &:last-child {
      margin-right: 0;
    }
    .tips {
      margin-top: 17px;
      text-align: center;
      font-size: 12px;
      display: block;
      width: 40px;
    }
  }
}
.join-tip {
  color: #b3b3b3;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
}
</style>