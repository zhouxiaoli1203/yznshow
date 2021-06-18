<template>
  <div class="all-group">
    <div v-for="(myGroupItem, index) in myGroup" :key="index">
      <div class="group-title">
        <span class="left"></span>
        <span class="text">{{ getTitle(myGroupItem) }}</span>
        <span class="right"></span>
      </div>
      <div v-if="myGroup.length > 1" class="potential_info">
        <div class="headImg">
          <img
            :src="myGroupItem.potentialCustomer.imgUrl"
            class="head"
            v-if="myGroupItem.potentialCustomer.imgUrl"
          />
          <img
            :src="require('@/assets/img/weChat/defaultNv.png')"
            v-else-if="myGroupItem.potentialCustomer.sex === 0"
            class="head"
          />
          <img
            :src="require('@/assets/img/weChat/defaultNan.png')"
            v-else
            class="head"
          />

          <img
            class="gender"
            src="@/assets/img/weChat/nv.png"
            v-if="myGroupItem.potentialCustomer.sex === 0"
          />
          <img class="gender" src="@/assets/img/weChat/nan.png" v-else />
        </div>

        <span>
          {{ myGroupItem.potentialCustomer.name }}
          <span v-if="myGroupItem.potentialCustomer.birthday"
            >/ {{ getAge(myGroupItem.potentialCustomer.birthday) }}</span
          >
        </span>
      </div>
      <p v-if="getType(myGroupItem) == 6 || getType(myGroupItem) == 8 || getType(myGroupItem) == 7">
        还差<b>{{ getNeedNum(myGroupItem) }}</b
        >人达到最高梯度团
      </p>
      <p v-if="getType(myGroupItem) == 4">
        您最终的拼团价格为 <b>{{ getGroupPrice(myGroupItem) }}</b>
      </p>
      <p v-if="getType(myGroupItem) == 5">
        很遗憾您未达成拼团人数，下次再接再厉哟！
      </p>
      <div class="joins" v-if="getType(myGroupItem) !== 1">
        <div class="head" @click="showGroupList(myGroupItem)">
          <img :src="findHead(myGroupItem)" />
          <span>团长</span>
        </div>
        <div
          @click="showGroupList(myGroupItem)"
          class="items"
          :style="{ width: getListLen(myGroupItem.totalNumber) }"
        >
          <div
            v-for="(item, index) in filtersGroup(
              myGroupItem.showActivityJoinList,
              myGroupItem
            )"
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
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <span class="right-txt" v-if=" getType() ==2 "
          >开团后可以邀请好友</span
        >
      </div>

      <!-- v-if="getType(myGroupItem) == 3 || (getType(myGroupItem) == 7 && signed == 1)" -->
      <van-button
        v-if="getType(myGroupItem) == 6 && myGroup.length > 1"
        class="share"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        @click="toShare(myGroupItem.groupId)"
      >
        <img src="@/assets/img/weChat/weixin.png" />
        <span>邀请好友参团</span>
      </van-button>

      <van-button
        v-if="getType(myGroupItem) == 7  && myGroup.length > 1"
        class="share"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        @click="toJoinNow(myGroupItem)"
      >
        <span>立即参团</span>
      </van-button>
    </div>

    <!-- <div class="group-title"  v-if="getType() == 1">
      <span class="left"></span>
      <span class="text">{{ getTitle(myGroupItem) }}</span>
      <span class="right"></span>
    </div>
    <div class="joins" v-if="getType() == 1 && acJoinList.length">
      <div class="join-list" v-for="(item, index) in acJoinList" :key="index">
        <div class="head">
          <img :src="item && item.headimgurl" />
          <span>团长</span>
        </div>
        <div class="tips">差{{ item.totalNumber - item.currentNumber }}人</div>
      </div>
    </div>
    <div class="join-tip" v-if="getType() == 1 && !acJoinList.length">
      快发起拼团吧~
    </div> -->
  </div>
</template>

<script>
import { getAge } from "@/utils/utils.js";
import { mapGetters } from "vuex";
export default {
  props: [
    // "isFirst",
    "type", // 如果传了type 值   getType()直接返回type 的值
    // "acJoinList",
    "myGroup",
    "fromOpenid",
    "contentId",
    "signed",
    "rule",
    "comfirm",
    "groupId",
  ],
  data() {
    return {
      list: [{}, {}, {}, {}],
      statusList: [
        {
          type: 1,
          txt: "TA们正在拼",
        },
        {
          type: 2,
          txt: "发起拼团",
        },
        // {
        //   type: 3,
        //   txt: "我的拼团",
        // },
        {
          type: 4,
          txt: "拼团成功",
        },
        {
          type: 5,
          txt: "拼团失败",
        },
        {
          type: 6,
          txt: "拼团中",
        },
        {
          type: 7,
          txt: "好友邀你拼",
        },
        {
          type: 8,
          txt: "我的参团",
        },
      ],
      active_succ: "",
      max_num: "",
      need_num: "",
    };
  },
  mounted() {
    //this.handleGroupList();
    // this.teamList = list
    //this.handleMyGroup()
    //this.getNeedNum()
  },
  methods: {
    getAge,
    showGroupList(item) {
      if (item && item.showActivityJoinList) {
        this.$emit("showLog", {
          list: item.showActivityJoinList,
          type: "group",
          total: item.totalNumber,
        });
      }
    },
    // getNeedNum () {
    //   let lastRule = this.rule[this.rule.length - 1]
    //   let num = lastRule.number
    //   console.log('rule', num, this.myGroup)
    //   if (this.myGroup) {
    //     let myNum = this.myGroup.showActivityJoinList.length
    //     this.need_num = num - myNum
    //   }
    // },
    getGroupPrice(item) {
      let index = item.index;
      let cRule = this.rule[index];
      return `${cRule.number}人团￥${cRule.price}元`;
    },
    getNeedNum(item) {
      let lastRule = this.rule[this.rule.length - 1];
      let num = lastRule.number;
      let cur_num = item.showActivityJoinList.length;
      return num - cur_num;
    },
    // handleGroupList() {
    //   console.log(this.myGroupList, 'myGL')
    //   let active_succ = this.myGroupList &&
    //   this.myGroupList[0] && this.myGroupList[0].activitySuccess;

    //   let list = this.myGroupList.slice(1);
    //   let rule = this.groupRule;
    //   let num = "";
    //   if (rule && rule.length) {
    //     num = rule[rule.length - 1].number;
    //     this.max_num = num;
    //     this.need_num = num - this.myGroupList.length - 1;
    //     for (let i = list.length; i < num - 1; i++) {
    //       list.push({});
    //     }
    //   }
    //   if (list.length > 4) {
    //     let n = list.length;
    //     list = list.slice(0, 3);
    //     list.push({
    //       name: `等${n}人`,
    //     });
    //   }
    //   this.list = list;
    //   this.active_succ = active_succ;
    // },

    // async getContent () {
    //   let res = await yznReq("get", "api/oa/show/getContent", {
    //     activityId: this.getActivityId,
    //     openid: localStorage.getItem("yzn_openid"),
    //     fromOpenid: this.fromOpenid
    //   });
    //   console.log(res)
    // },
    filtersGroup(list, aa) {
      if (!list || !list.length) {
        let num = this.rule[this.rule.length - 1].number;
        let arr = [];
        if (num > 4) {
          num = 4;
        }
        for (let i = 1; i < num; i++) {
          arr.push({});
        }
        // console.log(this.isFirst)
        return arr;
      }
      let arr = [];
      arr = list.filter((i) => {
        return i.headFlag != 1;
      });
      let total = aa.totalNumber;
      arr.forEach((i) => {
        i.img = i.headimgurl;
      });

      // if(total > 4) {
      //   total = 5
      // }

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

    findHead(myGroupItem) {
      if (this.getType(myGroupItem) != 2) {
        let list = myGroupItem.showActivityJoinList;
        let obj = list.find((i) => {
          return i.headFlag == 1;
        });
        return obj.headimgurl;
      } else {
        return myGroupItem.headimgurl;
      }
    },

    toShare(groupId) {
      this.$emit("toShowShare", {groupId});
    },
    toJoinNow(item) {
      this.$emit("toJoinNow", {
        groupId: item.groupId,
        contentId: item.contentId,
      });
    },
    getType(item) {
      if (this.type) {
        return this.type;
      }
      if (item) {
        if (item.activitySuccess == 1) {
          return 4;
        } else if (item.activitySuccess == 2) {
          if (
            this.fromOpenid &&
            this.fromOpenid != localStorage.getItem("yzn_openid")
          ) {
            return 7;
          } else {
            return 6;
          }
        } else if (item.activitySuccess == -1) {
          return 5;
        }
      } else {
        //return 1;
      }
    },
  },
  computed: {
    // title() {
    //   let obj = this.statusList.find((i) => i.type == this.type);
    //   return obj && obj.txt;
    // },
    getTitle() {
      return (item) => {
        let type = this.getType(item);
        let obj = this.statusList.find((i) => i.type == type);
        return obj && obj.txt;
      };
    },
    getListLen() {
      return (x) => {
        if (x > 4) {
          return 3 * 32 + 40 + "px";
        } else if (x > 2) {
          return (x - 2) * 32 + 40 + "px";
        } else if (x == 1) {
          return 40 + "px";
        } else {
          let rule = this.rule[this.rule.length - 1];
          if (rule.number >= 4) {
            return 32 * (4 - 2) + 40 + "px";
          } else if (rule.number > 2) {
            return 32 * (rule.number - 2) + 40 + "px";
          } else {
            return 40 + "px";
          }
        }
      };
    },
    ...mapGetters(["getActivityId"]),
  },
  watch: {
    myGroupList: {
      handler: function (val) {
        this.handleGroupList();
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.all-group {
  // border-top: 1px dotted #f2ebeb;
  // padding: 14px 16px 8px;
  >div {
    border-top: 1px dotted #F2EBEB ;
    padding: 14px 16px 8px;
  }
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
    width: 100%;
    height: 36px;
    line-height: 36px;
    margin-top: 12px;
    margin-bottom: 10px;
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
    margin-left: 4px;
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
.potential_info {
  display: flex;
  align-items: center;
  justify-content: center;
  .headImg {
    width: 30px;
    height: 30px;
    margin-right: 5px;
    .head {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
    }
    .gender {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>