<template>
  <div>
    <div class="block">
      <div class="title">
        <span>课包</span>
      </div>
      <div class="content">
        <a-row>
          <p class="label">课包名称<span>（20字）</span> <b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getValidate('productName') && !isValueNew('productName'),
            }"
          >
            <a-input
              :maxLength="20"
              :disabled="isDisable()"
              size="large"
              placeholder="请填写课包名称"
              @change="setValue('productName', $event.target.value)"
              :value="getBargainItem('productName')"
            />
            <div
              class="form-err"
              v-if="!getValidate('productName') && !isValueNew('productName')"
            >
              课包名称不能为空
            </div>
          </div>
        </a-row>
        <div class="course" v-for="(i, k) in getBargain.course" :key="k">
          <set-course :courseIndex="k" :isNew="getIsNew(k)" ref="setCourse" />
        </div>
        <div class="add-course">
          <a-button
            icon="plus"
            type="primary"
            ghost
            @click="addCourse"
            :disabled="isDisable()"
            >新增课程</a-button
          >
          <span class="txt"
            >共{{ getBargain.course.length }}个课程 | 总价{{
              getTotal(getBargain.course)
            }}元</span
          >
        </div>
        <a-row>
          <p class="label">砍价底价(元)<b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getValidate('floorPrice') && !isValueNew('floorPrice'),
            }"
          >
            <a-input
              :maxLength="6"
              :disabled="isDisable()"
              size="large"
              placeholder="请填写砍价底价"
              @change="setValue('floorPrice', $event.target.value)"
              :value="getBargainItem('floorPrice')"
            />
            <div
              class="form-err"
              v-if="!getValidate('floorPrice') && !isValueNew('floorPrice')"
            >
              砍价底价不能为空
            </div>
          </div>
          <div class="col-tips">
            (注：用户未砍至底价，仍可以按砍价结果价下单购买)
          </div>
        </a-row>
        <a-row>
          <p class="label">砍价次数<b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getValidate('totalNum') && !isValueNew('totalNum'),
            }"
          >
            <a-input
              :maxLength="4"
              :disabled="isDisable()"
              size="large"
              placeholder="请填写砍价次数"
              @change="setValue('totalNum', $event.target.value)"
              :value="getBargainItem('totalNum')"
            />
            <div
              class="form-err"
              v-if="!getValidate('totalNum') && !isValueNew('totalNum')"
            >
              砍价次数不能为空
            </div>
          </div>
          <div class="col-tips">
            (注：砍价次数为从原价到底价一共要砍价的次数)
          </div>
        </a-row>
      </div>
    </div>
    <a-row class="mt20">
      <a-col span="6">
        新老生参与限制
        <a-tooltip>
          <template slot="title">新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template>
          <a-icon type="question-circle" theme='filled' class="limitIcon"/>
        </a-tooltip>
      </a-col>
      <a-col span="12">
        <a-switch
          class="stuLimit"
          :disabled="isDisable()"
          :checked="Boolean(getBargainItem('limitItems'))"
          @change="setValue('limitItems', Number($event))"
        />
      </a-col>
    </a-row>
    <a-row v-if="getBargainItem('limitItems')" class="mt20">
      <a-col class="hei">
        <a-radio-group
          :disabled="isDisable()"
          name="radioGroup"
          @change="setValue('limitItems', $event.target.value)"
          :value="getBargainItem('limitItems')"
        >
          <a-radio :value="1">仅允许新生参与活动</a-radio>
          <a-radio :value="2">仅允许老生参与活动</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="mt15 pt15 lineTop">
      <a-col span="4" class="mt2">活动名额</a-col>
      <a-col span="20">
        <a-radio-group
          class="rowTop"
          size="large"
          :disabled="isDisable('placesLimit')"
          @change="setValue('placesLimit', $event.target.value)"
          :value="getBargainItem('placesLimit')"
        >
          <a-radio :value="0">
            <span
              :class="{
                'ac-text': getBargainItem('placesLimit') === 0,
              }"
              >不限</span
            >
          </a-radio>
          <a-radio :value="1">
            <span
              :class="{
                'ac-text': getBargainItem('placesLimit') == 1,
              }"
              >仅限</span
            >
            <!-- @blur="checkNumber($event, 0)" -->
            <a-input
              type="number"
              :disabled="isDisable('places')"
              style="width: 60px; height: 26px"
              @change="setValue('places', $event.target.value)"
              :value="getBargainItem('places')"
            />
            <span
              :class="{
                'ac-text': getBargainItem('placesLimit') == 1,
              }"
              >名</span
            >
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <!-- <div class="line"></div>
    <p class="label">参与限制</p>
    <a-select
      size="large"
      :disabled="isDisable()"
      placeholder="请选择课程"
      style="width: 50%"
      @change="setValue('limitItems', $event)"
      :value="getBargainItem('limitItems')"
    >
      <a-select-option :value="1">仅允许未签约的学员参与活动</a-select-option>
      <a-select-option :value="2">仅允许已签约的学员参与活动</a-select-option>
      <a-select-option :value="0">不限制</a-select-option>
    </a-select>
    <div class="row-top">
      <span class="name">活动名额</span>
      <a-radio-group
        :disabled="isDisable('placesLimit')"
        @change="setValue('placesLimit', $event.target.value)"
        :value="getBargainItem('placesLimit')"
      >
        <a-radio :value="0">
          <span :class="{ 'ac-text': getBargainItem('placesLimit') === 0 }"
            >不限</span
          >
        </a-radio>
        <a-radio :value="1">
          <span :class="{ 'ac-text': getBargainItem('placesLimit') == 1 }"
            >仅限</span
          >
          <a-input
            type="number"
            :maxLength="7"
            @blur="checkNumber"
            :disabled="isDisable('places')"
            class="smallInput"
            @change="setValue('places', $event.target.value)"
            :value="getBargainItem('places')"
          ></a-input>

          <span :class="{ 'ac-text': getBargainItem('placesLimit') == 1 }"
            >名</span
          >
        </a-radio>
      </a-radio-group>
    </div>
    <div class="row-top">
      <span class="name">支付设置</span>
      <a-radio-group
        :disabled="isDisable()"
        @change="setValue('paySet', $event.target.value)"
        :value="getBargainItem('paySet')"
      >
        <a-radio :value="1">
          <span :class="{ 'ac-text': getBargainItem('paySet') == 1 }"
            >线下支付</span
          >
        </a-radio>
        <a-radio :value="2">
          <span :class="{ 'ac-text': getBargainItem('paySet') == 2 }"
            >付砍价结果价</span
          ></a-radio
        >
        <a-radio :value="3">
          <span :class="{ 'ac-text': getBargainItem('paySet') == 3 }"
            >预付</span
          >
          <a-input
            type="number"
            :maxLength="7"
            :disabled="isDisable('prepaidAmount')"
            class="smallInput"
            @change="setValue('prepaidAmount', $event.target.value)"
            :value="getBargainItem('prepaidAmount')"
          ></a-input>
          <span :class="{ 'ac-text': getBargainItem('paySet') == 3 }">元</span>
        </a-radio>
      </a-radio-group>
    </div> -->
  </div>
</template>

<script>
import {
  validateInteger,
  validateRequire,
  validateFloat,
  validateStringLen,
} from "@/utils/validate.js";
import SetCourse from "./base/setCourse.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
export default {
  created() {
    let copy = JSON.parse(JSON.stringify(this.getBargain));
    for (let i in copy) {
      if (Array.isArray(copy[i])) {
        for (let one of copy[i]) {
          for (let j in one) {
            one[j] = true;
          }
        }
      } else {
        copy[i] = true;
      }
    }
    this.isNew = copy;
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getBargain);
    }, 800);
  },
  data() {
    return {
      isChecked: true,
      oldPlaces: "",
      packages: {},
      // oldPre: ''
    };
  },
  methods: {
    getIsNew(k) {
      let p = this.isNew;
      if (p && p.course && p.course.length) {
        return p.course[k];
      }
    },
    getValidate(name) {
      let c = this.getBargainItem(name);
      if (name == "floorPrice") {
        return validateRequire(c);
      } else if (name == "productName") {
        return validateStringLen(c, 20);
      } else if (name == "totalNum") {
        return validateInteger(c);
      }
    },
    isValueNew(name) {
      if (this.isNew[name] !== false) {
        return true;
      }
    },
    // checkNumber(e) {
    //   let n = e.target.value;
    //   if (n && !/(^[0-9]\d*$)/.test(n)) {
    //     this.$message.error("活动名额需是正整数");
    //     this.setValue("places", n);
    //     return;
    //   }
    //   if (this.getActivityStatus == 2) {
    //     if (n >= this.oldPlaces) {
    //       this.setValue("places", n);
    //     } else {
    //       this.$message.error("开始后名额不能减少");
    //       this.setValue("places", this.oldPlaces);
    //     }
    //   }
    // },
    setValue(name, value) {
      if (
        name == "places" ||
        // name == "helpNum" ||
        // name == "selfNum" ||
        name == "totalNum"
      ) {
        value = value.replace(/\D/g, "");
      }
      if (name == "floorPrice") {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      if (name == "places") {
        this.oldPlaces = this.getBargainItem("places");
      }
      if (
        name == "placesLimit" &&
        this.getActivityStatus == 2 &&
        this.getMode == 2
      ) {
        let oldLimit = this.packages[name];
        if (oldLimit == 0 && value == 1) {
          this.$message.error("开始后名额不能由不限改限制");
          return;
        }
      }

      this.setBargain({
        name,
        value,
      });
      this.$forceUpdate();
      let isnew = this.isNew;
      isnew[name] = false;
      this.isNew = isnew;
    },
    // checkPre(val) {
    //   if (val > this.getBargainItem("floorPrice")) {
    //     this.$message.error("预付价不能大于活动价");
    //     this.setBargain({ name: "prepaidAmount", value: this.getBargainItem('floorPrice') });
    //   }
    // },
    addCourse() {
      this.bargainAdd();
      let isnew = this.isNew;
      isnew.course.push({
        courseId: true,
        courseName: true,
        packageId: true,
        feeType: true,
        coursePrice: true,
        buyTime: true,
        giveTime: true,
        schoolYear: true,
        schoolTermId: true,
        beginTime: true,
        endTime: true,
      });
      this.isNew = isnew;
    },
    validate() {
      let arr = {};
      Object.keys(this.isNew).forEach((i) => {
        if (Array.isArray(this.isNew[i])) {
          arr[i] = [];
          for (let one of this.isNew[i]) {
            for (let j in one) {
              one[j] = false;
            }
            arr[i].push(one);
          }
        } else {
          arr[i] = false;
        }
      });
      this.isNew = arr;
      this.$forceUpdate();

      let checkStatus = true;
      let refs = this.$refs.setCourse;
      for (let r of refs) {
        if (!r.validate()) {
          checkStatus = false;
        }
      }
      let obj = this.getBargain;
      if (!validateStringLen(obj.productName, 20)) {
        return false;
      }
      if (!validateRequire(obj.floorPrice)) {
        return false;
      }

      let course = obj.course;
      let p = 0;
      course.forEach((i) => {
        p = p + Number(i.coursePrice);
      });
      if (Number(obj.floorPrice) >= p) {
        this.$message.error("砍价底价必须小于原价");
        return false;
      }
      if (!validateInteger(obj.totalNum)) {
        return false;
      }
      // if (!validateInteger(obj.selfNum)) {
      //   return false;
      // }
      // if (!validateInteger(obj.helpNum)) {
      //   return false;
      // }
      if (obj.placesLimit == 1) {
        if (obj.places == undefined || obj.places == "") {
          this.$message.error("活动名额不能为空");
          return false;
        }
      }
      // if (obj.paySet == 3) {
      //   if (obj.prepaidAmount == undefined || obj.prepaidAmount == "") {
      //     this.$message.error("预付金额不能为空");
      //     return false;
      //   } else if (obj.prepaidAmount * 1 > obj.floorPrice * 1) {
      //     this.$message.error("预付价不能大于砍价底价");
      //     return false;
      //   }
      // }
      return checkStatus;
    },
    isDisable(name) {
      if (name == "places") {
        if (this.getBargainItem("placesLimit") == 0) {
          return true;
        }
      }
      // if (name == "prepaidAmount") {
      //   if (this.getBargainItem("paySet") != 3) {
      //     return true;
      //   }
      // }
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        if (name == "placesLimit") {
          return false;
        } else if (name == "places") {
          if (this.getBargainItem("placesLimit") == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
    },
    ...mapActions("bargain", {
      bargainAdd: "addCourse",
    }),
    ...mapMutations("bargain", ["setBargain"]),
  },
  computed: {
    getTotal() {
      return (c) => {
        let t = 0;
        for (let cour of c) {
          t += cour.coursePrice * 1;
        }
        return t.toFixed(2);
      };
    },
    ...mapGetters([
      "getBargain",
      "getBargainItem",
      "getActiveType",
      "getActivityStatus",
      "getMode",
    ]),
  },
  components: {
    SetCourse,
  },
};
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 0;
  margin-top: 18px;
  border-bottom: 1px solid #f0f0f0;
}
.smallInput {
  width: 60px;
  height: 26px;
  position: relative;
  top: 2px;
}
.label {
  margin-bottom: 6px;
  margin-top: 16px;
  color: #262626;
  font-size: 16px;
  font-weight: 500;
  span {
    font-weight: normal;
    font-size: 14px;
    color: #595959;
  }
}
.block {
  width: 100%;
  min-height: 200px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  b {
    font-weight: normal;
    color: #f84f43;
  }

  > .title {
    height: 36px;
    background: #eafafa;
    display: flex;
    padding: 0 10px;
    line-height: 36px;
    justify-content: space-between;
  }
  .content {
    padding: 0 30px 16px 30px;
  }
  .course {
    background: #f9f9f9;
    min-height: 200px;
    margin-top: 18px;
    margin-bottom: 16px;
    // padding: 0 23px 0 18px;
    .course-title {
      display: flex;
      padding: 0 23px 0 18px;
      justify-content: space-between;
      height: 31px;
      line-height: 32px;
      color: #595959;
      font-size: 14px;
      border-bottom: 1px solid #ededed;
      i {
        color: #acacac;
        font-size: 16px;
        margin-top: 7px;
      }
    }
    .course-body {
      padding: 6px 17px 16px 17px;
    }
    .course-time {
      display: flex;
      > div:first-child {
        margin-right: 16px;
      }
    }
  }
  .add-course {
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    .txt {
      font-size: 13px;
      color: #595959;
      text-align: right;
    }
  }
}
.text {
  position: relative;
  span {
    color: #bfbfbf;
    position: absolute;
    bottom: 4px;
    right: 10px;
    s {
      color: #13c2c2;
      text-decoration: none;
    }
  }
}
.ant-select {
  width: 434px;
}
.col-input {
  width: 208px;
}
.row-top {
  margin-top: 16px;
  display: flex;
  line-height: 1;
  align-items: center;
  .name {
    margin-right: 24px;
  }
}
.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}
.col-tips {
  font-size: 12px;
  color: #d45656;
  margin-top: 5px;
}
.mt15 {
  margin-top: 15px;
}
.pt15 {
  padding-top: 15px;
}
.mt20 {
  margin-top: 20px;
}
.mt2 {
  margin-top: 2px;
}
.lineTop {
  border-top: 1px solid #f0f0f0;
}
.limitIcon {
  font-size: 14px;
  color: #D8D8D8;
}
</style>