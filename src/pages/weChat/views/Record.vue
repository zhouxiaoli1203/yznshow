<template>
  <div class="bg">
    <div class="frame">
      <div class="stu-record" v-for="(item, index) in recordList" :key="index">
        <div class="choice-info">
          <div class="stu-img">
            <van-image
              round
              width="60"
              height="60"
              :src="getImg(item.potentialCustomer)"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nv.png"
              v-if="item.potentialCustomer.sex * 1 === 0"
            />
            <img class="stu-gender" src="@/assets/img/weChat/nan.png" v-else />
          </div>
          <div class="stu-info">
            <div>
              {{ item.potentialCustomer.name }}
              <span v-if="item.potentialCustomer.birthday"
                >/ {{ getAge(item.potentialCustomer.birthday) }}</span
              >
            </div>
            <div>{{ item.potentialCustomer.potentialCustomerParentPhone }}</div>
          </div>
        </div>
        <div class="info-block">
          <package-name
            :forRecord="1"
            :groupInfo="item.showActivityJoinList"
            :nameInfo="item.showContent"
            :activeType="getActiveType"
            :activeContent="getActiveContent"
          />
          <content-custom
            :content="item.showContent.productDesc"
            v-if="getActiveType == 1 && item.showContent.productDesc"
          />
          <content-package
            :course="item.showContent.courseInfo"
            v-if="getActiveContent == 2 && item.showContent.courseInfo"
          />
          <content-package
            stype="2"
            :course="item.showContent.showActivityCourseList"
            v-if="
              getActiveContent == 2 && item.showContent.showActivityCourseList
            "
          />
          <!-- <content-rule
            v-if="
              getActiveType == 3 &&
              item.showContent.showContentRuleList &&
              item.showContent.showContentRuleList.length > 1
            "
            :rules="item.showContent.showContentRuleList"
            :type="1"
          /> -->
          <user-group-record
            v-if="getActiveType == 3"
            :type="item.activitySuccess"
            :myGroup="item.showActivityJoinList"
            :rule="item.showContent.showContentRuleList"
          />
          <bargain
            v-if="getActiveType == 4"
            :joinList="[item]"
            :fromRecord="true"
          />
          <help-progress
            v-if="getActiveType == 5"
            :isMul="false"
            :joinList="[item]"
          />
        </div>
        <div class="record-info">
          <div class="record-txt">
            <span class="label">报名时间</span>
            <span class="num">{{
              moment(item.createTime).format("YYYY.MM.DD HH:mm")
            }}</span>
          </div>
          <div class="record-txt" v-if="item.paymentFlag">
            <span class="label">实付金额</span>
            <span class="num">¥{{item.paymentMoney}}</span>

            <!-- <span class="label" v-if="item.showContent.paySet == 1 || item.showContent.paySet == 2"
              >应付金额</span
            > -->
            <!-- <span class="num" v-if="item.showContent.paySet == 3"
              >预付¥{{ item.showContent.prepaidAmount }}
              <b v-if="getActiveType != 3"
                >(待付¥{{
                  (
                    item.showContent.floorPrice * 1 -
                    item.showContent.prepaidAmount * 1
                  ).toFixed(2)
                }})</b
              >
            </span> -->
            <!-- <span
              class="num"
              v-if="
                item.showContent.paySet != 3
              "
              >¥{{ item.showContent.floorPrice }}</span
            >

            <span class="num" v-if="item.showContent.paySet == 2">
              <span v-if="item.activityType == 4 && item.paymentFlag"
                >¥{{ item.currentPrice }}</span
              >
              <span v-if="item.activityType == 4 && !item.paymentFlag"
                ><b>待付(¥{{ item.currentPrice }})</b></span
              >
              <span v-if="item.activityType == 5 && item.paymentFlag == 1"
                >¥{{ item.showContent.floorPrice }}</span
              >
              <span v-if="item.activityType == 5 && !item.paymentFlag"
                ><b>待付(¥{{ item.showContent.floorPrice }})</b></span
              >
              <span v-if="item.activityType == 3"
                >¥{{ getRulePrice(item) }}</span
              >
            </span> -->
          </div>
          <div class="record-txt" v-if="item.paymentFlag">
            <span class="label">支付方式</span>
            <span class="num">微信支付</span>
          </div>
          <!-- <div v-if="item.showContent.paySet == 1" class="offline">
            注: 本商品需线下付款，请联系机构完成报名事宜
          </div> -->
        </div>
      </div>
    </div>

    <a class="btn-call" :href="tel" v-if="getShopPhone">
      <img src="@/assets/img/weChat/phone.png" />
      <span>联系机构</span>
    </a>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { yznReq } from "@/utils/yznhttp";
import ContentPackage from "@/components/ContentPackage.vue";
import PackageName from "./components/PackageName";
import ContentCustom from "./components/ContentCustom.vue";
import ContentRule from "./components/ContentRule.vue";
import UserGroupRecord from "./components/UserGroupRecord.vue";
import Bargain from "./components/Bargain.vue";
import HelpProgress from "./components/HelpProgress.vue";
import { Toast } from "vant";
import { getAge } from "@/utils/utils.js";
import moment from "moment";
export default {
  data() {
    return {
      // name: "李晓丽",
      // age: "4岁8个月",
      // phone: "13111115554",
      // userImg: '',
      // //packages: [],
      // gender: 1,

      recordList: [],
      courseList: [],
      tel: "",

      // activeType: "",
      // activeContent: "",
    };
  },
  computed: {
    ...mapGetters([
      "getActiveType",
      "getActiveContent",
      "getSelectedCourse",
      "getActivityId",
      "getShopPhone",
    ]),
  },
  mounted() {
    this.tel = "tel: " + this.getShopPhone;
    this.getRecord();
  },
  methods: {
    getAge,
    moment,
    getImg(item) {
      if (item.imgUrl) {
        return item.imgUrl;
      } else if (item.sex * 1 === 0) {
        return require("@/assets/img/weChat/defaultNv.png");
      } else {
        return require("@/assets/img/weChat/defaultNan.png");
      }
    },
    async getRecord() {
      let res = await yznReq("get", "api/oa/show/listJoinRecord", {
        activityId: this.getActivityId,
        openid: localStorage.getItem("yzn_openid"),
      });
      if (res.status) {
        this.recordList = res.context;
      }
    },
    getRulePrice(item) {
      return item.showContent.showContentRuleList[0].price;
    },
  },
  components: {
    PackageName,
    ContentCustom,
    ContentPackage,
    ContentRule,
    UserGroupRecord,
    Bargain,
    HelpProgress,
  },
};
</script>

<style lang='less' scoped>
.bg {
  background: #f8f8f8;
  min-height: 100vh;
  .frame {
    padding-bottom: 50px;
  }
}
.stu-record {
  background: #fff;
  width: 100%;
  padding-bottom: 16px;
  margin-bottom: 9px;
}
.choice-info {
  display: flex;
  border-radius: 4px;
  padding: 10px 16px 10px 14px;
  // height: 86px;
  background: #fff;
  .stu-img {
    width: 60px;
    height: 60px;
    position: relative;
    .stu-gender {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .stu-info {
    margin-left: 12px;
    flex-grow: 1;
    margin-top: 7px;
    font-size: 15px;
    color: #292929;
    > div {
      margin-bottom: 8px;
    }
    span {
      font-size: 13px;
    }
  }
}
.info-block {
  width: 359px;
  margin: 0 auto 10px;

  background: #ffffff;

  border: 1px solid #f0f0f0;
  border-radius: 4px;
  min-height: 100px;
  padding: 18px 10px 6px 10px;

  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.record-info {
  width: 100%;
  margin-top: 14px;
  padding: 0 14px 0 14px;
  box-sizing: border-box;
  .record-txt {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    &:last-child {
      margin-bottom: 0;
    }
    .label {
      font-size: 15px;
      color: #595959;
    }
    .num {
      font-size: 15px;
      color: #23150c;
      b {
        color: #dc2a2a;
        font-size: 12px;
        font-weight: normal;
      }
    }
  }
  .offline {
    color: #dc2a2a;
    background: #ffeaea;
    padding: 4px 11px 5px;
    border-radius: 4px;
  }
}
.btn-call {
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  z-index: 99;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
  span {
    font-size: 18px;
    color: #dc2e2e;
  }
}
</style>