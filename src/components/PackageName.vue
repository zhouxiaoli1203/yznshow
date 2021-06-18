<template>
  <div>
    <div class="item-head">
      <div>{{ nameInfo.productName }}</div>
      <img src="../assets/newIcon.png" v-if="nameInfo.limitItems == 1 && getActiveType != 3" />
      <img src="../assets/lodIcon.png" v-if="nameInfo.limitItems == 2 && getActiveType != 3" />
    </div>
    <div class="item-pay">
      <s v-if="nameInfo.originalPrice  && getActiveContent == 1" >￥{{ nameInfo.originalPrice }}</s> 
      <!-- 原价 -->
      <!-- <s
        v-if="
          nameInfo.originalPrice &&
          (getActiveType != 2 || getActiveContent == 1)
          && (getActiveType == 3 && getActiveContent == 1)
        "
      >
        ￥{{ nameInfo.originalPrice }}
      </s> -->
      <!-- 活动价 -->
      <!-- <s v-if="getActiveType == 2 && getActiveContent == 2 && oldPrice">￥{{ oldPrice }}</s> -->

      <!-- 拼团,抢购 计算后的原价 -->
      <s
        v-if="
          (getActiveType == 3 || getActiveType == 2 || getActiveType == 4 || getActiveType == 5) &&
          getActiveContent == 2 &&
          oldPrice
        "
        >￥{{ oldPrice }}</s
      >
      <!-- 拼团 计算后的活动价 -->
      <span class="floorPrice" v-if="getActiveType == 3 && groupPrice">
        {{ groupPrice }}
      </span>
      <!--活动价-->
      <span class="floorPrice" v-if="nameInfo.floorPrice"
        >￥{{ nameInfo.floorPrice }}</span
      >

      <span class="paySet" v-if="nameInfo.paySet == 3 && getActiveType == 3"
        >预付￥{{ nameInfo.prepaidAmount }}</span
      >
      <!-- <span class="paySet" v-if="nameInfo.paySet == 1 && getActiveType != 2">线下支付</span>
      <span class="paySet" v-if="nameInfo.paySet == 2 && getActiveType == 3"
        >付拼团价</span
      >
      <span class="paySet" v-if="nameInfo.paySet == 2 && getActiveType == 5"
        >付活动价</span
      >
      <span class="paySet" v-if="nameInfo.paySet == 2 && getActiveType == 4"
        >砍付结果价</span
      > -->
      <span
        class="amount"
        v-if="nameInfo.placesLimit == 1 && nameInfo.places > 0"
        >仅剩<b>{{ nameInfo.places }}</b
        >个</span
      >
      <span
        class="amount"
        v-if="nameInfo.placesLimit == 1 && nameInfo.places <= 0"
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
  },
  mounted() {
    let val = this.nameInfo;
    this.init(val)
  },
  data() {
    return {
      oldPrice: "",
      groupPrice: "",
    };
  },
  methods: {
    init(val) {
      if (val.course && val.course.length) {
        let num = 0;
        for (let item of val.course) {
          if (item.coursePrice) {
            num += Number(item.coursePrice);
          }
        }
        this.oldPrice = num;
      } else if (val.courseInfo && val.courseInfo.length) {
        let num = 0;
        for (let item of val.courseInfo) {
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
  },
  computed: {
    ...mapGetters(["getActiveType", "getActiveContent"]),
  },
  watch: {
    nameInfo: {
      handler: function (val, newVal) {
        this.init(val)
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.item-pay {
  display: flex;
  align-items: center;
  margin-top: 10px;
  s {
    font-size: 26px;
    color: #c9c9c9;
  }
  .floorPrice {
    color: #dc2a2a;
    font-size: 32px;
    padding: 0 3px;
  }
  .paySet {
    border: 2px solid #dc2a2a;
    border-left: none;
    margin-left: 30px;
    font-size: 26px;
    line-height: 38px;
    color: #dc2a2a;
    font-weight: 500;
    padding-right: 5px;
    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      height: 28px;
      width: 28px;
      transform: rotate(135deg) translateX(13px) translateY(7px);
      border: solid #dc2a2a;
      border-width: 0 1px 1px 0;
      vertical-align: -4px;
    }
  }
  .amount {
    color: #23150c;
    font-size: 26px;
    line-height: 42px;
    flex-grow: 1;
    text-align: right;
    padding-right: 18px;
    b {
      color: #dc2a2a;
    }
  }
}
.item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  width: 160px;
  height: 70px;
}
</style>