<template>
  <div>
    <div class="item-head">
      <div>{{ nameInfo.productName }}</div>
      <img
        src="@/assets/newIcon.png"
        v-if="nameInfo.limitItems == 1 && activeType != 3"
      />
      <img
        src="@/assets/lodIcon.png"
        v-if="nameInfo.limitItems == 2 && activeType != 3"
      />
    </div>
    <div class="item-pay">
      <!-- 原价 -->
      <!-- <s v-if="nameInfo.originalPrice  && activeType != 2  && (activeType == 3 && activeContent == 1)" >￥{{ nameInfo.originalPrice }}</s> -->
      <s v-if="nameInfo.originalPrice && activeContent == 1"
        >￥{{ nameInfo.originalPrice }}</s
      >
      <!-- 活动价 -->
      <!-- <s v-if="activeType == 2 && activeContent == 2 && oldPrice">￥{{ oldPrice }}</s> -->

      <!-- 拼团,抢购 计算后的原价 -->
      <s
        v-if="
          (activeType == 3 ||
            activeType == 2 ||
            activeType == 4 ||
            activeType == 5) &&
          activeContent == 2 &&
          oldPrice
        "
        >￥{{ oldPrice }}</s
      >
      <!-- 拼团 计算后的活动价 -->
      <span class="floorPrice" v-if="activeType == 3 && groupPrice">
        {{ groupPrice }}
      </span>
      <!--活动价 或者砍价助力当前价-->
      <span class="floorPrice" v-if="nameInfo.floorPrice && !currentPrice"
        >￥{{ nameInfo.floorPrice }}</span
      >
      <span class="floorPrice" v-if="currentPrice"
        >￥{{ currentPrice }}</span
      >

      <span class="floorPrice" v-if="activeType == 1 && nameInfo.paySwitch">
        <span v-if="nameInfo.paySet == 3">预付款:</span>
        <span v-if="nameInfo.places">￥{{ nameInfo.prepaidAmount }}</span>
      </span>
      <span class="paySet" v-if="nameInfo.paySet == 3 && activeType == 3"
        >预付￥{{ nameInfo.prepaidAmount }}</span
      >
      <!-- <span class="paySet" v-if="nameInfo.paySet == 1 && activeType != 2">线下支付</span>
      <span class="paySet" v-if="nameInfo.paySet == 2 && activeType == 3"
        >付拼团价</span
      >
      <span class="paySet" v-if="nameInfo.paySet == 2 && activeType == 4"
        >砍付结果价</span
      >
       <span class="paySet" v-if="nameInfo.paySet == 2 && activeType == 5"
        >付活动价</span
      > -->

      <span
        class="amount"
        v-if="
          !client &&
          nameInfo.placesLimit == 1 &&
          nameInfo.remainingAllowed > 0 &&
          !forRecord
        "
        >仅剩<b>{{ nameInfo.remainingAllowed }}</b
        >个</span
      >
      <span
        class="amount"
        v-if="
          client == 'oa' &&
          nameInfo.placesLimit == 1 &&
          nameInfo.places > 0 &&
          !forRecord
        "
        >仅剩<b>{{ nameInfo.places }}</b
        >个</span
      >
      <!-- 报名记录里面显示拼团状态  只在记录里用 -->
      <!-- <span 
          class="amount"
          v-if="(getActiveType == 3 && groupInfo && groupInfo[0] && groupInfo[0].activitySuccess == 1)">
          拼团成功
        </span>
        <span 
          class="amount"
          v-if="(getActiveType == 3 && groupInfo && groupInfo[0] && groupInfo[0].activitySuccess == -1)">
          拼团失败
        </span>
        <span 
          class="amount"
          v-if="(getActiveType == 3 && groupInfo && groupInfo[0] && groupInfo[0].activitySuccess == 2)">
          拼团中
        </span> -->
      <!-- 报名记录里面显示拼团状态  只在记录里用 -->

      <!-- <span v-if="nameInfo.signed && type !=2 && !nameInfo.myGroup  && !groupInfo.length"  class="amount">
        已报名
      </span> -->
      <span
        class="amount"
        v-if="
          nameInfo.placesLimit == 1 &&
          nameInfo.remainingAllowed <= 0 &&
          !groupInfo.length && !forRecord
        "
        >已售罄</span
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    nameInfo: {
      default: function () {
        return {};
      },
      type: Object,
    },
    activeType: {
      default: "",
      type: Number,
    },
    activeContent: {
      default: "",
      type: Number,
    },
    type: {
      default: 0,
      type: Number,
    },
    groupInfo: {
      default: function () {
        return [];
      },
      type: Array,
    },
    client: {
      type: String,
    },
    forRecord: {
      default: 0,
      type: Number,
    },
    currentPrice: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      oldPrice: "",
      groupPrice: "",
    };
  },
  mounted() {
    let val = this.nameInfo;
    if (val.course && val.course.length) {
      // 抢购原价总和
      let num = 0;
      for (let item of val.course) {
        if (item.coursePrice) {
          num += Number(item.coursePrice);
        }
      }
      this.oldPrice = num;
    } else if (val.courseInfo && val.courseInfo.length) {
      // 拼团原价总和
      let num = 0;
      for (let item of val.courseInfo) {
        if (item.coursePrice) {
          num += Number(item.coursePrice);
        }
      }
      this.oldPrice = num;
    } else if (
      val.showActivityCourseList &&
      val.showActivityCourseList.length
    ) {
      let num = 0;
      for (let item of val.showActivityCourseList) {
        if (item.coursePrice) {
          num += Number(item.coursePrice);
        }
      }
      this.oldPrice = num;
    }
    if (val.showContentRuleList) {
      // 拼团中显示最低价格
      if (val.showContentRuleList.length == 1) {
        this.groupPrice = `${val.showContentRuleList[0].number}人团${val.showContentRuleList[0].price}元`;
      } else {
        let list = val.showContentRuleList;
        let p = Math.min.apply(
          Math,
          list.map((item) => {
            return item.price;
          })
        );
        this.groupPrice = `拼团最低￥${p}`;
      }
    }
  },
  computed: {
    ...mapGetters(["getActiveJoin", "getActiveType"]),
  },
};
</script>

<style lang="less" scoped>
.item-pay {
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  s {
    font-size: 13px;
    color: #c9c9c9;
  }
  .floorPrice {
    color: #dc2a2a;
    font-size: 16px;
    padding: 0 1px;
  }
  .paySet {
    border: 1px solid #dc2a2a;
    border-left: none;
    margin-left: 15px;
    font-size: 13px;
    line-height: 19px;
    color: #dc2a2a;
    font-weight: 500;
    padding-right: 3px;
    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      height: 13px;
      width: 13px;
      transform: rotate(135deg) translateX(7px) translateY(4px);
      border: solid #dc2a2a;
      border-width: 0 1px 1px 0;
      vertical-align: -2px;
    }
  }
  .amount {
    color: #23150c;
    font-size: 13px;
    line-height: 21px;
    flex-grow: 1;
    text-align: right;
    padding-right: 9px;
    b {
      color: #dc2a2a;
    }
  }
}
.item-head {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  width: 80px;
  height: 35px;
}
</style>