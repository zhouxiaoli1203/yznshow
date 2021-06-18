<template>
  <div class="bg">
    <div class="choice-info">
      <div class="stu-img">
        <van-image round width="60" height="60" :src="getImg(getSelectedStu)" />
        <img
          class="stu-gender"
          src="@/assets/img/weChat/nv.png"
          v-if="getSelectedStu.sex * 1 === 0"
        />
        <img
          class="stu-gender"
          src="@/assets/img/weChat/nan.png"
          v-if="getSelectedStu.sex * 1 === 1"
        />
      </div>

      <div class="stu-info">
        <div>
          {{ getSelectedStu.name }}
          <span v-if="getSelectedStu.birthday"
            >/ {{ getAge(getSelectedStu.birthday) }}</span
          >
        </div>
        <div>{{ getSelectedStu.potentialCustomerParentPhone }}</div>
      </div>
    </div>

    <div class="bgCourse">
      <div
        :key="index"
        v-for="(item, index) in getSelectedCourse"
        class="info-block"
      >
        <package-name
          :forRecord="1"
          :nameInfo="item"
          :activeType="getActiveType"
          :activeContent="getActiveContent"
          :currentPrice="currentPrice"
        />
        <!-- <content-custom
          :content="item.productDesc"
          v-if="getActiveType == 1 && item.productDesc"
        /> -->
        <content-custom
          :content="item.productDesc"
          v-if="getActiveContent == 1 && item.productDesc"
        />
        <content-package
          :course="item.courseInfo"
          v-if="getActiveContent == 2 && item.courseInfo"
        />
        <content-package
          stype="2"
          :course="item.showActivityCourseList"
          v-if="getActiveContent == 2 && item.showActivityCourseList"
        />
        <content-rule
          v-if="
            getActiveType == 3 &&
            item.showContentRuleList &&
            item.showContentRuleList.length > 1
          "
          :type="1"
          :rules="item.showContentRuleList"
        />
        <!-- :isFirst="getIsFirst" -->
        <user-group
          :comfirm="1"
          :groupId="groupId"
          :myGroup="getMyGroup(item)"
          :acJoinList="[]"
          :rule="item.showContentRuleList"
          :type="getType"
          v-if="getActiveType == 3"
        />

        <!--    :currentIndex="getUserRuleIndex(item)" :groupRule="item.showContentRuleList" -->
        <!-- :headImg="getSelectedStu.faceImgUrl" -->
      </div>

      <!-- <p class="offline" v-if="payType && getActiveType != 4">
        注: 本商品需线下付款，报名成功后请联系机构完成报名事宜
      </p> -->
    </div>
    <div class="payType">
      <span>支付方式</span>
      <div class="payImg">
        <img src="@/assets/img/weChat/wx.png" />
        <span>微信支付</span>
      </div>
    </div>

    <!-- <div class="tips-zuli" v-if="getActiveType == 4">
      注:本商品需砍价后才可付款哦，快去邀请好友帮你砍价吧！
    </div> -->

    <div class="lesson-total">
      <!-- <div v-if="totalPrice > 0 && (getActiveType != 3 || payType != 2)">
        <span class="num" v-if="getActiveType == 2">共{{ getSelectedCourse.length }}件，</span>
        <span class="price" v-if="getActiveType == 2">合计<b>￥{{ totalPrice }}</b></span>

        <span class="price" v-if="getActiveType != 2">应付<b>￥{{ totalPrice }}</b></span>
      </div>
      <div v-if="totalPrice > 0 && getActiveType == 3 && payType == 2">
        <span class="price"
          >拼团价<b>￥{{ totalPrice }}</b></span
        >
      </div> -->
      <div v-if="totalPrice > 0">
        <span class="price" v-if="getActiveType != 2"
          >应付:<b>￥{{ totalPrice }}</b></span
        >
      </div>
      <div>
        <van-button
          @click="comfirmPay"
          class="lesson-btn"
          color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >确认付款</van-button
        >
      </div>
    </div>

    <!-- <div class="lesson-total" v-if="getActiveType == 5 && helpType == 2">
      <van-button
        @click="comfirmPay"
        class="lesson-btn"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >确认报名</van-button
      >
    </div>

    <div class="lesson-total" v-if="getActiveType == 5 && helpType == 1">
      <div v-if="totalPrice > 0">
        <span class="num">共{{ getSelectedCourse.length }}件，</span>
        <span class="price"
          >合计<b>￥{{ totalPrice }}</b></span
        >
      </div>
      <div>
        <van-button
          @click="comfirmPay"
          class="lesson-btn"
          color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >确认付款</van-button
        >
      </div>
    </div>

    <div class="lesson-join" v-if="getActiveType == 4 && !barType">
      <van-button
        @click="comfirmPay"
        class="lesson-join-btn"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >确认报名</van-button
      >
    </div> -->
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import { mapGetters, mapMutations, mapActions } from "vuex";
import ContentPackage from "@/components/ContentPackage.vue";
import PackageName from "./components/PackageName";
import ContentCustom from "./components/ContentCustom.vue";
import ContentRule from "./components/ContentRule.vue";
import UserGroup from "./components/UserGroup.vue";
import { yznReq } from "@/utils/yznhttp";
import { ysbPay } from "@/utils/ysbPay.js";
import { getAge } from "@/utils/utils.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      name: "李晓丽",
      age: "4岁8个月",
      phone: "13111115554",
      packages: [],

      activeType: "",
      activeContent: "",
      showSucc: false,
      groupId: "",
      myGroup: [],
      ruleType: 1,

      helpType: 2, // 助力时候判断 1 需要付钱  2 不需要付钱

      //barType: "", // 1  已经参加了活动  空  没参加
      payType: false,
      // pingPaySet: "",

      referralDataId: "",
      fromOpenid: "",

      currentPrice: "",
      joinId: "",
    };
  },
  created() {
    if (this.$route.query.groupId) {
      this.groupId = this.$route.query.groupId;
    } else {
      let stu = this.getSelectedStu;
      this.myGroup.push({
        name: stu.name,
        headimgurl: localStorage.getItem("wx_img"),
      });
    }

    if (this.$route.query.currentPrice) {
      this.currentPrice = this.$route.query.currentPrice;
    }
    if (this.$route.query.joinId) {
      this.joinId = this.$route.query.joinId;
    }
    // if (this.$route.query.barType == 1) {
    //   this.barType = this.$route.query.barType;
    // }
  },
  mounted() {
    // if (this.getActiveType == 5) {
    //   if (!this.getSelectedStu.potentialCustomerId) {
    //     // 不存在潜客id  一定不需要付钱
    //     this.helpType == 2;
    //   } else {
    //     // 存在潜客id 需要判断接口付钱
    //     this.yznReq("get", "/api/oa/show/getPayStatus", {
    //       contentId: this.getSelectedCourse[0].contentId,
    //       potentialCustomerId: this.getSelectedStu.potentialCustomerId,
    //     }).then((res) => {
    //       if (res.status == 200) {
    //         this.helpType = res.context;
    //       }
    //     });
    //   }
    // }
    // if (this.getActiveType == 3) {
    //   this.pingPaySet = this.getSelectedCourse[0].paySet;
    // }
    this.payType = this.getSelectedCourse[0].paySet;
    if (this.$route.query.referralDataId) {
      this.referralDataId = this.$route.query.referralDataId;
    }
    if (this.$route.query.fromOpenid) {
      this.fromOpenid = this.$route.query.fromOpenid;
    }
  },
  methods: {
    getAge,
    getImg(item) {
      if (item.faceImgUrl) {
        return item.faceImgUrl;
      } else if (item.sex === 0) {
        return require("@/assets/img/weChat/defaultNv.png");
      } else {
        return require("@/assets/img/weChat/defaultNan.png");
      }
    },
    getMyGroup(item) {
      //console.log(111,this.$route.query.groupId)
      if (
        this.$route.query.groupId &&
        this.$route.query.groupId != "undefined"
      ) {
        let li = this.getSelectedCourse[0].activityJoinList;
        let cur_li = li.find((i) => i.groupId == this.$route.query.groupId);
        return [
          {
            ...cur_li,
            showActivityJoinList: cur_li.showActivityJoinList,
          },
        ];
      } else {
        return [
          {
            headimgurl: localStorage.getItem("wx_img"),
          },
        ];
      }
    },

    comfirmPay: throttle(async function () {
      if (this.joinId) {
        // joinId 存在   立即付款
        yznReq("post", "api/oa/show/activityPay", {
          joinId: this.joinId,
          openid: localStorage.getItem("yzn_openid"),
        }).then((res) => {
          if (res.status == 200) {
            ysbPay(res.context.orderId, res.context.appId);
          }
        });
      } else {
        let open = localStorage.getItem("yzn_openid");
        let conIds = [];
        this.getSelectedCourse.map((i) => {
          conIds.push(i.contentId);
        });

        let params = {
          groupId:
            this.groupId && this.groupId != "undefined"
              ? this.groupId
              : undefined,
          activityId: this.getActivityId,
          openid: open, // 微信ID
          referralDataId:
            this.referralDataId && this.referralDataId != "undefined"
              ? this.referralDataId
              : undefined,
          fromOpenid: this.fromOpenid ? this.fromOpenid : undefined,
          potentialCustomer: {
            // 学员对象
            potentialCustomerId:
              this.getSelectedStu.potentialCustomerId || undefined, // 老学员要传
            name: this.getSelectedStu.name, // 学员信息
            potentialCustomerParentPhone: this.getSelectedStu
              .potentialCustomerParentPhone, // 电话
            birthday: this.getSelectedStu.birthday,
            sex: this.getSelectedStu.sex,
            grade: this.getSelectedStu.grade,
            age: this.getSelectedStu.age,
            schoolName: this.getSelectedStu.schoolName,
          },
          contentIds: conIds,
        };

        if (this.getSelectedStu.old) {
          params.potentialCustomer[
            "potentialCustomerId"
          ] = this.getSelectedStu.potentialCustomerId;
        }
        let res = await yznReq("post", "api/oa/show/joinActivity", params);
        if (res && res.status == 200) {
          if (res.context && res.context.appId) {
            ysbPay(res.context.orderId, res.context.appId);
          } else {
            if (this.getActiveType == 1 || this.getActiveType == 2) {
              this.setIndexPop({
                show: true,
                btn: "我知道了",
                type: "1",
                title: "恭喜您！报名成功",
                desc: "您已报名，我们将会尽快与您联系完善入学事宜",
              });
            } else if (this.getActiveType == 4) {
              Toast("报名成功，先自砍一刀试试手气吧");
            }

            this.$router.push({
              path: "/index",
              query: { id: this.getActivityId },
            });
          }
        }
      }
    }, 1000),

    // getPayType() {
    //   let c = this.getSelectedCourse;
    //   for (let i of c) {
    //     if (i.paySwitch) {
    //       return true;
    //     }
    //   }
    // },
    ...mapMutations("common", ["setIndexPop"]),
  },
  computed: {
    totalPrice() {
      let p = 0;
      this.getSelectedCourse.map((i) => {
        if (this.getActiveType == 3 && i.paySet == 2) {
          let r = this.getSelectedCourse[0].showContentRuleList[0];
          p = r.price;
        } else if (i.paySet == 3) {
          p += i.prepaidAmount;
        } else {
          p += i.floorPrice;
        }
      });
      return p;
    },
    getType() {
      if (
        this.$route.query.groupId &&
        this.$route.query.groupId != "undefined"
      ) {
        return 8;
      } else {
        return 2;
      }
    },
    // getIsFirst() {
    //   return this.$route.query.contentId ? false : true;
    // },
    ...mapGetters([
      "getActivityId",
      "getActiveType",
      "getActiveContent",
      "getSelectedCourse",
      "getSelectedStu",
    ]),
  },
  components: {
    PackageName,
    ContentCustom,
    ContentPackage,
    ContentRule,
    UserGroup,
  },
};
</script>

<style lang="less" scoped>
.choice-info {
  display: flex;
  border-radius: 4px;
  padding: 12px 16px 12px 14px;
  border: 1px solid #eaeaea;
  // height: 86px;
  background: #fff;
  .stu-img {
    position: relative;
    width: 60px;
    height: 60px;
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
  box-sizing: border-box;
  margin: 9px auto 10px;

  background: #ffffff;

  border: 1px solid #f0f0f0;
  border-radius: 4px;
  // min-height: 100px;
  padding: 18px 10px 6px 10px;

  display: flex;
  flex-direction: column;
}

.lesson-total {
  display: flex;
  width: 100%;
  height: 50px;
  background: #fff;
  position: fixed;
  bottom: 0;
  > div {
    text-align: center;
    flex: 1;
    span {
      line-height: 50px;
    }
  }
  .num {
    font-size: 13px;
    color: #23150c;
  }
  .price {
    font-size: 16px;
    b {
      color: #dc2a2a;
    }
  }
  .lesson-btn {
    width: 100%;
    height: 100%;
    font-size: 18px;
  }
}
.payType {
  display: flex;
  padding: 0 14px;
  line-height: 40px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: #fff;
  margin-top: 11px;
  box-sizing: border-box;
}
.payImg {
  img {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }
  display: flex;
  align-items: center;
}
.bg {
  min-height: 100vh;
  padding-bottom: 55px;
  background: #f8f8f8;
}
.tips-zuli {
  color: #dc2a2a;
  background: #ffeaea;
  margin: 8px 14px 0;
  line-height: 26px;
  background: #ffeaea;
  border-radius: 4px;
  padding: 0 11px;
  font-size: 12px;
}
.lesson-join {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  .lesson-join-btn {
    width: 100%;
    height: 100%;
    font-size: 18px;
  }
}
.offline {
  background: #ffeaea;
  // height: 26px;
  line-height: 26px;
  width: 343px;
  margin: 8px auto 16px;
  color: #dc2a2a;
  font-size: 12px;
  padding: 0 6px;
}
.bgCourse {
  background: #fff;
  overflow: hidden;
}
</style>