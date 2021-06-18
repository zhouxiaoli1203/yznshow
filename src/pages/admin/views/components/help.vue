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
              :disabled="isDisable()"
              :maxLength="20"
              size="large"
              placeholder="请填写课包名称"
              @change="setValue('productName', $event.target.value)"
              :value="getHelpItem('productName')"
            />
            <div
              class="form-err"
              v-if="!getValidate('productName') && !isValueNew('productName')"
            >
              课包名称不能为空
            </div>
          </div>
        </a-row>

        <div class="course" v-for="(i, k) in getHelp.course" :key="k">
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
          <span class="txt">
            <span class="txt"
              >共{{ getHelp.course.length }}个课程 | 总价{{
                getTotal(getHelp.course)
              }}元</span
            ></span
          >
        </div>
        <div class="label">活动价(元)<b>*</b></div>
        <div
          :class="{
            'form-err-group':
              !getValidate('floorPrice') && !isValueNew('floorPrice'),
          }"
        >
          <a-input
            :maxLength="7"
            :disabled="isDisable()"
            size="large"
            placeholder="请填写活动价"
            @change="setValue('floorPrice', $event.target.value)"
            :value="getHelpItem('floorPrice')"
          />
          <div
            class="form-err"
            v-if="!getValidate('floorPrice') && !isValueNew('floorPrice')"
          >
            商品活动价不能为空
          </div>
        </div>
        <div class="col-tips">
          (注：助力活动，用户助力成功后，才能以活动价下单购买)
        </div>
        <div class="label">需获得的助力包数量<b>*</b></div>
        <div
          :class="{
            'form-err-group':
              !getPackageValidate('packagesNumber') &&
              !isValueNew('packagesNumber'),
          }"
        >
          <a-input
            :maxLength="4"
            :disabled="isDisable()"
            size="large"
            placeholder="请填写助力包数量"
            @change="setValue('packagesNumber', $event.target.value)"
            :value="getHelpItem('packagesNumber')"
          />
          <div
            class="form-err"
            v-if="
              !getPackageValidate('packagesNumber') &&
              !isValueNew('packagesNumber')
            "
          >
            助力包数量不能为空
          </div>
        </div>
        <div class="col-tips">(注：达到助力包数量后，表示助力成功)</div>
        <div class="label">每人最多助力包数<b>*</b></div>
        <div
          :class="{
            'form-err-group':
              !getPackageValidate('maxNumber') && !isValueNew('maxNumber'),
          }"
        >
          <a-select
            :disabled="isDisable()"
            size="large"
            placeholder="单次最大助力包数"
            @change="setValue('maxNumber', $event)"
            :value="getHelpItem('maxNumber')"
          >
            <a-select-option :value="1">1</a-select-option>
            <a-select-option :value="2">2</a-select-option>
            <a-select-option :value="3">3</a-select-option>
            <a-select-option :value="4">4</a-select-option>
            <a-select-option :value="5">5</a-select-option>
            <a-select-option :value="6">6</a-select-option>
            <a-select-option :value="7">7</a-select-option>
            <a-select-option :value="8">8</a-select-option>
          </a-select>
          <div
            class="form-err"
            v-if="!getPackageValidate('maxNumber') && !isValueNew('maxNumber')"
          >
            请选择单次最大助力
          </div>
        </div>
        <div class="col-tips">(注：最多可设置8个助力包)</div>
        <div class="col-tips t2">(建议设置2～8 , 例如：设置6，则好友助力时，会在1-6范围内，随机获得助力包)</div>
      
      </div>
    </div>

    <a-row class="mt20">
      <a-col span="6">
        新老生参与限制
        <a-tooltip>
          <template slot="title">新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template>
          <a-icon type="question-circle" class="limitIcon" theme="filled" />
        </a-tooltip>
      </a-col>
      <a-col span="12">
        <a-switch
          class="stuLimit"
          :disabled="isDisable()"
          :checked="Boolean(getHelpItem('limitItems'))"
          @change="setValue('limitItems', Number($event))"
        />
      </a-col>
    </a-row>
    <a-row v-if="getHelpItem('limitItems')" class="mt20">
      <a-col class="hei">
        <a-radio-group
          :disabled="isDisable()"
          name="radioGroup"
          @change="setValue('limitItems', $event.target.value)"
          :value="getHelpItem('limitItems')"
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
          :value="getHelpItem('placesLimit')"
        >
          <a-radio :value="0">
            <span
              :class="{
                'ac-text': getHelpItem('placesLimit') === 0,
              }"
              >不限</span
            >
          </a-radio>
          <a-radio :value="1">
            <span
              :class="{
                'ac-text': getHelpItem('placesLimit') == 1,
              }"
              >仅限</span
            >
            <!-- @blur="checkNumber($event, 0)" -->
            <a-input
              type="number"
              :disabled="isDisable('places')"
              style="width: 60px; height: 26px"
              @change="setValue('places', $event.target.value)"
              :value="getHelpItem('places')"
            />
            <span
              :class="{
                'ac-text': getHelpItem('placesLimit') == 1,
              }"
              >名</span
            >
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
   
  </div>
</template>

<script>
import SetCourse from "./base/setCourse.vue";
import {
  validateInteger,
  validateRequire,
  validateFloat,
  validateStringLen,
} from "@/utils/validate.js";
import cloneDeep from "lodash/cloneDeep";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  created() {
    let copy = JSON.parse(JSON.stringify(this.getHelp));
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
      this.packages = cloneDeep(this.getHelp);
    }, 800);
  },
  data() {
    return {
      isChecked: true,
      oldPlaces: "",
      packages: {},
    };
  },
  methods: {
    getPackageValidate(name) {
      let c = this.getHelpItem(name);
      if (name == "maxNumber" || name == "packagesNumber") {
        return validateInteger(c);
      }
    },
    getIsNew(k) {
      let p = this.isNew;
      if (p && p.course && p.course.length) {
        return p.course[k];
      }
    },
    getValidate(name) {
      let c = this.getHelpItem(name);
      if (!c) {
        if (c === 0 || c === "0") {
          this.isChecked = true;
          return true;
        }
        this.isChecked = false;
        return false;
      } else {
        this.isChecked = true;
        return true;
      }
    },
    isValueNew(name) {
      if (this.isNew[name] !== false) {
        return true;
      }
    },
    setValue(name, value) {
      // 两位小数
      if (name == "floorPrice") {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      // 整数
      if (name == "places" || name == "packagesNumber") {
        value = value.replace(/\D/g, "");
      }

      if (name == "places") {
        this.oldPlaces = this.getHelpItem("places");
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
      this.setHelp({
        name,
        value,
      });
      this.$forceUpdate();
      let isnew = this.isNew;
      isnew[name] = false;
      this.isNew = isnew;
    },
    addCourse() {
      this.helpAdd();
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
      let obj = this.getHelp;
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
        this.$message.error("活动价必须小于原价");
        return false;
      }
      if (!validateInteger(obj.maxNumber)) {
        return false;
      }
      if (!validateInteger(obj.packagesNumber)) {
        return false;
      }
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
      //     this.$message.error("预付价必须小于活动价");
      //     return false;
      //   }
      // }
      return checkStatus;
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
    isDisable(name) {
      if (name == "places") {
        if (this.getHelpItem("placesLimit") == 0) {
          return true;
        }
      }
      // if (name == "prepaidAmount") {
      //   if (this.getHelpItem("paySet") != 3) {
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
          if (this.getHelpItem("placesLimit") == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
    },
    ...mapActions("help", {
      helpAdd: "addCourse",
    }),
    ...mapMutations("help", ["setHelp"]),
  },
  computed: {
    getTotal() {
      return (c) => {
        let t = 0;
        for (let cour of c) {
          t += cour.coursePrice * 1;
        }
        return t;
      };
    },
    ...mapGetters([
      "getHelp",
      "getHelpItem",
      "getActivityStatus",
      "getActiveType",
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
.ant-select {
  width: 100%;
}
.col-input {
  width: 209px;
}
.smallInput {
  width: 60px;
  height: 26px;
  position: relative;
  top: 2px;
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
  > .title {
    height: 36px;
    background: #eafafa;
    display: flex;
    padding: 0 10px;
    line-height: 36px;
    justify-content: space-between;
  }
  .add-course {
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .txt {
      font-size: 13px;
      color: #595959;
      text-align: right;
    }
  }
  .help-number {
    display: flex;
  }
}
.row-top {
  margin-top: 16px;
  display: flex;
  line-height: 1;
  align-items: center;
  .name {
    margin-right: 24px;
    b {
      font-weight: normal;
      color: #f84f43;
    }
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
  &.t2 {
    color: #595959;
  }
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
  color: #d8d8d8;
}
</style>
