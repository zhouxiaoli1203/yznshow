<template>
  <div>
    <div
      v-for="(item, index) in currentData"
      :key="index"
      class="course-package"
    >
      <div class="title">
        <span v-if="getActiveContent == 1">自定义</span>
        <span v-if="getActiveContent == 2">课包</span>
      </div>
      <div class="context">
        <a-row>
          <p v-if="getActiveContent == 1">商品名称<span>(20字)</span><b>*</b></p>
          <p v-if="getActiveContent == 2">课包名称<span>(20字)</span><b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getPackageValidate('productName', index) &&
                !isValueNew('productName', index),
            }"
          >
            <a-input
              :disabled="isDisable()"
              size="large"
              :maxLength="20"
              placeholder="请填写商品名称"
              @change="setValue(index, 'productName', $event.target.value)"
              :value="getGroupItemAll('productName', index)"
            />
            <div
              class="form-err"
              v-if="
                !getPackageValidate('productName', index) &&
                !isValueNew('productName', index)
              "
            >
              商品名称不能为空
            </div>
          </div>
        </a-row>
        <slot :groupPackageIndex="index"></slot>
        <a-row>
          <p>
            梯度设置<span>（最多可增加4档梯度）</span>
            <span style="float: right"
              >什么是梯度设置
              <a-tooltip>
                <template slot="title">当团队人数大于等于梯度所需人数时，参与此团的团长及团员即可享受此梯度的成团价格</template>
                <a-icon type="question-circle" theme='filled' class="limitIcon"/>
              </a-tooltip>
            </span>
          </p>
          <div
            class="course"
            v-for="(rule, ruleIndex) in item.showContentRuleList"
            :key="ruleIndex"
          >
            <div class="title">
              梯度{{ ruleIndex + 1 }}
              <a-popconfirm
                v-if="!isDisable('delete', item.showContentRuleList.length)"
                title="确定删除吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteRule(index, ruleIndex)"
              >
                <a-icon type="delete" />
              </a-popconfirm>
            </div>
            <div class="course-item">
              <a-row :gutter="16">
                <a-col span="12">
                  <span class="courseTitleRow">几人成团<b>*</b></span>
                  <div
                    :class="{
                      'form-err-group':
                        !getRuleValidate('number', ruleIndex, index) &&
                        !isRuleValueNew('number', ruleIndex, index),
                    }"
                  >
                    <a-input
                      size="large"
                      :disabled="isDisable()"
                      @change="
                        setRuleInfo(
                          $event.target.value,
                          index,
                          ruleIndex,
                          'number'
                        )
                      "
                      :value="getRuleInfo('number', index, ruleIndex)"
                    />
                    <div
                      class="form-err"
                      v-if="
                        !getRuleValidate('number', ruleIndex, index) &&
                        !isRuleValueNew('number', ruleIndex, index)
                      "
                    >
                      请填写人数(大于前梯度)
                    </div>
                  </div>
                </a-col>
                <a-col span="12">
                  <span class="courseTitleRow">成团价格<span>(元)</span></span>
                  <div
                    :class="{
                      'form-err-group':
                        !getRuleValidate('price', ruleIndex, index) &&
                        !isRuleValueNew('price', ruleIndex, index),
                    }"
                  >
                    <a-input
                      :disabled="isDisable()"
                      size="large"
                      @change="
                        setRuleInfo(
                          $event.target.value,
                          index,
                          ruleIndex,
                          'price'
                        )
                      "
                      :value="getRuleInfo('price', index, ruleIndex)"
                    />
                    <div
                      class="form-err"
                      style="top: -30px; right: -10px"
                      v-if="
                        !getRuleValidate('price', ruleIndex, index) &&
                        !isRuleValueNew('price', ruleIndex, index)
                      "
                    >
                      请填写价格(小于前梯度)
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-row>
        <div class="add-course">
          <a-button
            class="add-btn"
            icon="plus"
            type="primary"
            ghost
            @click="addRule(index)"
            :disabled="isDisable()"
            >新增梯度</a-button
          >
        </div>
        <a-row class="row-top">
          <a-col :span="8">
            <span>老生只能开团不能参团&nbsp;</span>
            <a-tooltip>
              <template slot="title">老带新拼团专用，老生表示在读学员和历史学员</template>
              <a-icon type="question-circle" class="limitIcon" theme='filled'/>
            </a-tooltip>
          </a-col>
          <a-col :span="14">
            <a-switch
              class="switch"
              :disabled="isDisable()"
              :checked="Boolean(getGroupItemAll('limitItems', index))"
              @change="switchLimit(index, $event)"
            />
          </a-col>
        </a-row>
        <a-row class="row-top">
          <span class="col-title">活动名额</span>
          <a-radio-group
            :disabled="isDisable('placesLimit', index)"
            @change="setValue(index, 'placesLimit', $event.target.value)"
            :value="getGroupItemAll('placesLimit', index)"
          >
            <a-radio :value="0">
              <span
                :class="{
                  'ac-text': getGroupItemAll('placesLimit', index) === 0,
                }"
                >不限</span
              >
            </a-radio>
            <a-radio :value="1">
              <span
                :class="{
                  'ac-text': getGroupItemAll('placesLimit', index) == 1,
                }"
                >仅限</span
              >

              <a-input
                type="number"
                :maxLength="7"
                @blur="checkNumber($event, index)"
                :disabled="isDisable('places', index)"
                style="width: 60px; height: 26px"
                @change="setValue(index, 'places', $event.target.value)"
                :value="getGroupItemAll('places', index)"
              /><span
                :class="{
                  'ac-text': getGroupItemAll('placesLimit', index) == 1,
                }"
                >人</span
              >
            </a-radio>
          </a-radio-group>
        </a-row>
        <a-row class="row-top">
          <span class="col-title">支付设置</span>
          <a-radio-group
            name="radioGroup"
            :disabled="isDisable()"
            @change="setValue(index, 'paySet', $event.target.value)"
            :value="getGroupItemAll('paySet', index)"
          >
            <a-radio :value="2" :disabled="isDisabled(index)">
              <span
                :class="{ 'ac-text': getGroupItemAll('paySet', index) == 2 }"
                >拼团价</span
              >
            </a-radio>
            <a-radio :value="3">
              <span
                :class="{ 'ac-text': getGroupItemAll('paySet', index) == 3 }"
                >预付</span
              >
              <!-- @blur="checkPre(index, $event.target.value)" -->
              <a-input
                type="number"
                :maxLength="7"
                :disabled="isDisable('prepaidAmount', index)"
                style="width: 60px; height: 26px"
                @change="setValue(index, 'prepaidAmount', $event.target.value)"
                :value="getGroupItemAll('prepaidAmount', index)"
              />
              <span
                :class="{ 'ac-text': getGroupItemAll('paySet', index) == 3 }"
                >元</span
              >
            </a-radio>
          </a-radio-group>
        </a-row>
        <div class="col-tips">注：若拼团失败，金额将自动原路退回，无需线下退款。</div>
      </div>
    </div>
    <!-- <div class="add-course">
      <a-button
        class="add-btn"
        icon="plus"
        type="primary"
        ghost
        @click="addGroup"
        :disabled="isDisable()"
      >
        {{ getActiveContent == 1 ? "新增自定义项" : "新增拼团课程包" }}
      </a-button>
    </div>
    <a-row class="row-top">
      <span class="col-title">拼团数量限制</span>
      每个学员最多拼
      <a-input
        type="number"
        ref="sss"
        :disabled="isDisable()"
        style="width: 60px; height: 26px"
        @change="setLimitNum($event.target.value.replace(/\D/g, ''))"
        :value="getLimitNum"
      ></a-input
      >节
      <a-switch
        :checked="Boolean(getSignUpLimit)"
        @change="setSignUpLimit($event)"
        :disabled="isDisable()"
      />
    </a-row> -->
  </div>
</template>

<script>
import {
  validateFloat,
  validateRequire,
  validateStringLen,
} from "../../../../utils/validate";
import cloneDeep from "lodash/cloneDeep";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  created() {
    let copy;
    if (this.getActiveContent == 1) {
      copy = JSON.parse(JSON.stringify(this.getGroupCustom));
    } else if (this.getActiveContent == 2) {
      copy = JSON.parse(JSON.stringify(this.getGroup));
    }

    for (let i of copy) {
      for (let item in i) {
        if (Array.isArray(i[item])) {
          for (let one of i[item]) {
            for (let j in one) {
              one[j] = true;
            }
          }
        } else {
          i[item] = true;
        }
      }
    }
    this.isNew = copy;

    if (this.getActiveContent == 1) {
      this.currentData = this.getGroupCustom;
    } else if (this.getActiveContent == 2) {
      this.currentData = this.getGroup;
    }
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getGroup);
      this.customPackages = cloneDeep(this.getGroupCustom);
    }, 800);
  },
  data() {
    return {
      oldPlaces: "",
      packages: [],
      customPackages: [],
      currentData: [],
    };
  },
  methods: {
    switchLimit(index, e) {
      if (e) {
        e = 3;
      } else {
        e = 0;
      }
      this.setValue(index, "limitItems", e);
    },
    getPackageValidate(name, index) {
      let c;
      if (this.getActiveContent == 2) {
        c = this.getGroupItem(name, index);
      } else {
        c = this.getGroupCustomItem(name, index);
      }
      if (!c) {
        return false;
      } else {
        return true;
      }
    },
    isValueNew(name, index) {
      return this.isNew[index][name];
    },
    getRuleValidate(name, ruleIndex, index) {
      // 梯度人数不能小于前梯度
      // 梯度价格不能大于前梯度
      let c, prev;
      if (this.getActiveContent == 2) {
        c = this.getGroupRuleItem(name, index, ruleIndex);
        if (ruleIndex > 0) {
          prev = this.getGroupRuleItem(name, index, ruleIndex - 1);
        } else {
          if (name == "price") {
            let p = this.getGroupItem("courseInfo", index);
            let num = 0;
            for (let item of p) {
              num += Number(item.coursePrice || 0);
            }
            if (c * 1 >= num * 1) {
              return false;
            }
          }
        }
      } else {
        c = this.getGroupCustomRuleItem(name, index, ruleIndex);
        if (ruleIndex > 0) {
          prev = this.getGroupCustomRuleItem(name, index, ruleIndex - 1);
        } else {
          if (name == "price") {
            let p = this.getGroupCustomItem("originalPrice", index);
            if (c * 1 >= p * 1) {
              return false;
            }
          }
        }
      }
      if (!validateRequire(c)) {
        return false;
      }

      if (prev && c) {
        if (name == "price") {
          if (prev * 1 <= c * 1) {
            return false;
          }
        } else if (name == "number") {
          if (prev * 1 >= c * 1) {
            return false;
          }
        }
      }
      return true;
    },
    isRuleValueNew(name, ruleIndex, index) {
      return this.isNew[index].showContentRuleList[ruleIndex][name];
    },
    setValue(index, name, value) {
      if (name == "prepaidAmount") {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      if (name == "places") {
        value = value.replace(/\D/g, "");
      }
      if (this.getActiveContent == 2) {
        if (name == "places") {
          this.oldPlaces = this.getGroupItem("places", index);
        }
        if (
          name == "placesLimit" &&
          this.getActivityStatus == 2 &&
          this.getMode == 2
        ) {
          let oldLimit = this.packages[index][name];
          if (oldLimit == 0 && value == 1) {
            this.$message.error("开始后名额不能由不限改限制");
            return;
          }
        }
        this.setPackagesItemByName({
          index,
          name,
          value,
        });
      } else {
        if (name == "places") {
          this.oldPlaces = this.getGroupCustomItem("places", index);
        }
        if (
          name == "placesLimit" &&
          this.getActivityStatus == 2 &&
          this.getMode == 2
        ) {
          let oldLimit = this.customPackages[index][name];
          if (oldLimit == 0 && value == 1) {
            this.$message.error("开始后名额不能由不限改限制");
            return;
          }
        }
        this.customSetPackagesItemByName({
          index,
          name,
          value,
        });
      }
      let isnew = this.isNew;
      let pack = isnew[index];
      pack[name] = false;
      this.isNew = isnew;
    },
    // addGroup() {
    //   let news = this.isNew;
    //   news.push({
    //     courseInfo: [
    //       {
    //         courseId: true, // 课程id
    //         packageId: true, // 套餐id
    //         feeType: true, // 收费方式
    //         coursePrice: true, // 原价
    //         buyTime: true, // 购买课时
    //         giveTime: true, // 赠送课时
    //         schoolYear: true, // 学年
    //         schoolTermId: true, // 学期
    //         beginTime: true, // 开始时间
    //         endTime: true, // 结束时间
    //       },
    //     ],
    //     // 梯度
    //     showContentRuleList: [
    //       {
    //         number: true,
    //         price: true,
    //       },
    //     ],
    //     productName: true, // 商品名称
    //     productDesc: true, // 商品描述
    //     limitItems: true, // 拼团限制
    //     placesLimit: true, // 名额限制
    //     places: true, // 名额人数
    //     paySet: true, // 拼团限制
    //     prepaidAmount: true, // 预付金额
    //     virtualGroup: true, // 虚拟成团
    //   });
    //   this.isNew = news;

    //   if (this.getActiveContent == 2) {
    //     this.addPackage();
    //   } else if (this.getActiveContent == 1) {
    //     this.customAddPackage();
    //     this.$emit("addGroupCustom", news);
    //   }
    // },
    checkNumber(e, index) {
      let n = e.target.value;
      if (n && !/(^[0-9]\d*$)/.test(n)) {
        this.$message.error("活动名额需是正整数");
        if (this.getActiveContent == 2) {
          this.setPackagesItemByName({
            index,
            name: "places",
            value: this.oldPlaces,
          });
        } else {
          this.customSetPackagesItemByName({
            index,
            name: "places",
            value: this.oldPlaces,
          });
        }
        return;
      }
      if (this.getActivityStatus == 2) {
        if (n >= this.oldPlaces) {
          this.setValue(index, "places", n);
        } else {
          this.$message.error("开始后名额不能减少");
          if (this.getActiveContent == 2) {
            this.setPackagesItemByName({
              index,
              name: "places",
              value: this.oldPlaces,
            });
          } else {
            this.customSetPackagesItemByName({
              index,
              name: "places",
              value: this.oldPlaces,
            });
          }
        }
      }
    },
    addRule(index) {
      if (this.getActiveContent == 1) {
        if (this.getGroupCustomItem("showContentRuleList", index).length >= 4) {
          this.$message.warning("规则条数不能超过4个");
          return;
        }
      } else if (this.getActiveContent == 2) {
        if (this.getGroupItem("showContentRuleList", index).length >= 4) {
          this.$message.warning("规则条数不能超过4个");
          return;
        }
      }

      let news = this.isNew;
      let rules = news[index].showContentRuleList;
      rules.push({
        number: true,
        price: true,
      });
      this.isNew = news;
      if (this.getActiveContent == 2) {
        this.addRuleByIndex(index);
      } else if (this.getActiveContent == 1) {
        this.customAddRule(index);
      }
      this.setValue(index, "paySet", 3);
    },
    // deletePackage(index) {
    //   let news = this.isNew;
    //   news.splice(index, 1);
    //   this.isNew = news;
    //   if (this.getActiveContent == 2) {
    //     this.deletePackageByIndex(index);
    //   } else if (this.getActiveContent == 1) {
    //     this.customDeletePackageByIndex(index);
    //   }
    // },
    deleteRule(index, ruleIndex) {
      let news = this.isNew;
      let r = news[index].showContentRuleList;
      r.splice(ruleIndex, 1);
      this.isNew = news;
      if (this.getActiveContent == 1) {
        this.customDeleteRule({
          packageIndex: index,
          ruleIndex,
        });
      } else if (this.getActiveContent == 2) {
        this.deleteRuleByIndex({
          packageIndex: index,
          ruleIndex,
        });
      }
    },
    setRuleInfo(val, index, ruleIndex, type) {
      let number = "",
        price = "";
      if (type == "number") {
        number = val.replace(/\D/g, "");
        price = undefined;
      } else if (type == "price") {
        price = val.match(/^\d*(\.?\d{0,2})/g)[0] || null;
        number = undefined;
      }
      if (this.getActiveContent == 1) {
        this.customSetRule({ index, ruleIndex, number, price });
      } else if (this.getActiveContent == 2) {
        this.setRule({ index, ruleIndex, number, price });
      }
      let isnew = this.isNew;
      let pack = isnew[index];
      let rule = pack.showContentRuleList[ruleIndex];
      rule[type] = false;
      this.isNew = isnew;
    },
    getRuleInfo(name, index, ruleIndex) {
      if (this.getActiveContent == 1) {
        return this.getGroupCustomRuleItem(name, index, ruleIndex);
      } else if (this.getActiveContent == 2) {
        return this.getGroupRuleItem(name, index, ruleIndex);
      }
    },
    getGroupItemAll(type, index) {
      if (this.getActiveContent == 1) {
        return this.getGroupCustomItem(type, index);
      } else if (this.getActiveContent == 2) {
        return this.getGroupItem(type, index);
      }
    },
    validate() {
      let arr = this.isNew;
      arr.forEach((i) => {
        Object.keys(i).forEach((k) => {
          if (Array.isArray(i[k])) {
            for (let one of i[k]) {
              Object.keys(one).forEach((key) => {
                one[key] = false;
              });
            }
          } else {
            i[k] = false;
          }
        });
      });
      this.isNew = arr;
      this.$forceUpdate();
      let p = [];
      if (this.getActiveContent == 2) {
        p = this.getGroup;
      } else if (this.getActiveContent == 1) {
        p = this.getGroupCustom;
      }
      for (let i = 0; i < p.length; i++) {
        let obj = p[i];
        if (!validateStringLen(obj.productName, 20)) {
          return false;
        }
        if (obj.placesLimit == 1) {
          if (obj.places == undefined || obj.places == "") {
            this.$message.error("活动名额不能为空");
            return false;
          } else {
            if (obj.places && !/(^[0-9]\d*$)/.test(obj.places)) {
              this.$message.error("活动名额需是正整数");
              return false;
            }
          }
        }
        for (let j = 0; j < obj.showContentRuleList.length; j++) {
          if (!this.getRuleValidate("number", j, i)) {
            return false;
          }
          if (!this.getRuleValidate("price", j, i)) {
            return false;
          }
        }
        if (obj.paySet == 3) {
          if (obj.prepaidAmount == "") {
            this.$message.error("预付金额不能为空");
            return false;
          } else if (
            obj.prepaidAmount * 1 >
            obj.showContentRuleList[obj.showContentRuleList.length - 1].price
          ) {
            this.$message.error("预付价不能大于拼团最低价");
            return false;
          }
        }
      }
      // if (this.getSignUpLimit && !this.getLimitNum) {
      //   this.$message.error("拼团数量限制数不能为空");
      //   return false;
      // }
      // if (this.getLimitNum > p.length) {
      //   this.$message.error("拼团数量限制数最大不能超过商品总数");
      //   this.setLimitNum();
      //   this.$refs.sss.focus();
      //   return false;
      // }
      return true;
    },
    // 进行中时能否修改
    isDisable(name, index) {
       if (name == "delete" && index <= 1) {
        return true;
      }
      if (name == "places") {
        if (this.getGroupItemAll("placesLimit", index) == 0) {
          return true;
        }
      }
      if (name == "prepaidAmount") {
        if (this.getGroupItemAll("paySet", index) != 3) {
          return true;
        }
      }
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        if (name == "placesLimit") {
          return false;
        } else if (name == "places") {
          let p;
          if (this.getActiveContent == 1) {
            p = this.getGroupCustomItem("placesLimit", index);
          } else {
            p = this.getGroupItem("placesLimit", index);
          }
          if (p == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
     
    },
    ...mapActions("group", [
      // "addPackage",
      "addCourseByIndex",
      "addRuleByIndex",

      "setPackagesItemByName",
      "setPackageCourseItemByName",
      "setPackageRuleByName",

      // "deletePackageByIndex",
      "deleteRuleByIndex",

      "setRule",
    ]),
    ...mapActions("groupCustom", {
      customSetRule: "setRule",
      customDeleteRule: "deleteRuleByIndex",
      customAddRule: "addRuleByIndex",

      customSetPackagesItemByName: "setPackagesItemByName",
      // customAddPackage: "addPackage",
      // customDeletePackageByIndex: "deletePackageByIndex",
    }),
    // ...mapMutations("common", ["setLimitNum", "setSignUpLimit"]),
  },
  computed: {
    // 单梯度时可以选付拼团价  多梯度时只能选预付
    isDisabled() {
      return (index) => {
        if (this.getActiveContent == 1) {
          if (
            this.getGroupCustomItem("showContentRuleList", index) &&
            this.getGroupCustomItem("showContentRuleList", index).length > 1
          ) {
            return true;
          }
        } else if (this.getActiveContent == 2) {
          if (
            this.getGroupItem("showContentRuleList", index) &&
            this.getGroupItem("showContentRuleList", index).length > 1
          ) {
            return true;
          }
        }
        return false;
      };
    },
    ...mapGetters([
      "getActiveContent",
      "getGroup",
      "getGroupItem",
      "getGroupCourseItem",
      "getGroupRuleItem",
      "getGroupCustomRuleItem",
      "getGroupCustomItem",
      "getGroupCustom",

      "getLimitNum",
      "getSignUpLimit",
      "getActivityStatus",
      "getMode",
    ]),
  },
  watch: {
    getGroupCustom(val) {
      this.currentData = val;
    },
    getGroup(val) {
      this.currentData = val;
    },
  },
};
</script>

<style lang="less" scoped>
.course-package {
  width: 100%;
  min-height: 200px;

  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
  b {
    font-weight: normal;
    color: #f84f43;
  }
  .title {
    height: 36px;
    background: #eafafa;
    display: flex;
    padding: 0 10px;
    line-height: 36px;
    justify-content: space-between;
    i {
      line-height: 36px;
      color: #acacac;
      &:hover,
      &:active {
        color: #ff9537;
        cursor: pointer;
      }
    }
  }
  // .form-err {
  //   top: inherit;
  // }
  .context {
    margin: 0 30px 16px;
    p {
      margin-bottom: 6px;
      margin-top: 16px;
      color: #262626;
      font-size: 16px;
      font-weight: 500;
      span {
        font-weight: normal;
        font-size: 12px;
        color: #595959;
      }
    }
    .course {
      .course-item {
        padding: 0 20px;
      }
      background: #f9f9f9;
      padding-bottom: 17px;
      margin-bottom: 10px;
      .title {
        height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #595959;
        line-height: 32px;
        border-bottom: 1px solid #ededed;
        background: #f9f9f9;
        margin-bottom: 24px;
      }

      .courseTitle {
        font-size: 16px;
        line-height: 22px;
        margin-right: 24px;
      }
    }

    .courseTitleRow {
      font-size: 16px;
      margin-bottom: 6px;
      display: block;
      span {
        font-weight: normal;
        font-size: 14px;
        color: #595959;
      }
      b {
        font-weight: normal;
        color: #f84f43;
      }
    }
  }

  .col-info {
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
    line-height: 22px;
  }
}
.add-course {
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  .txt {
    font-size: 13px;
    color: #595959;
  }
}
.tips {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  background: #13c2c2;

  margin-left: 4px;

  color: #fff;
  line-height: 16px;
  text-align: center;
  text-decoration: none;
}
.row-top {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.col-title {
  margin-right: 28px;
  line-height: 22px;
  display: inline-block;
}
.col-tips {
  font-size: 12px;
  color: #D45656;
  margin-top: 5px;
  padding-left: 97px;
}
.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}
.add-btn {
  box-shadow: none;
}
.ant-switch {
  margin-left: 18px;
}
.limitIcon {
  font-size: 14px;
  color: #d8d8d8;
}
</style>