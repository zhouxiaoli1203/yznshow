<template>
  <div>
    <div
      class="course-package"
      v-for="(item, index) in getPackages"
      :key="index"
    >
      <div class="title">
        <span>课包{{ index + 1 }}</span>
        <a-popconfirm
          v-if="!isDisable('delete', getPackages.length)"
          title="确定删除吗?"
          ok-text="是"
          cancel-text="否"
          @confirm="deletePackageNow(index)"
        >
          <a-icon type="delete" />
        </a-popconfirm>
      </div>
      <div class="context">
        <a-form :form="formPackage" class="inputForm">
          <!-- <a-form-item label="课包名称" required> -->
          <a-row>
            <p class="formLabel">课包名称<span>(20字)</span><b> *</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('productName', index) &&
                  !isValueNew('productName', index),
              }"
            >
              <a-input
                :maxLength="20"
                :disabled="isDisable()"
                size="large"
                placeholder="请填写课包名称"
                @change="setValue(index, 'productName', $event.target.value)"
                :value="getPackageItem('productName', index)"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('productName', index) &&
                  !isValueNew('productName', index)
                "
              >
                课包名称不能为空
              </div>
            </div>
          </a-row>
          <a-row>
            <p class="formLabel" style="margin-bottom: 4px; margin-top: 12px">
              课程设置<b> *</b>
            </p>
            <div class="course" v-for="(i, k) in item.course" :key="k">
              <set-course
                :index="index"
                :courseIndex="k"
                :isNew="getIsNew(index, k)"
                ref="setCourse"
              />
            </div>
          </a-row>
          <!-- </a-form-item> -->
          <div class="add-course">
            <a-button
              icon="plus"
              type="primary"
              ghost
              @click="addCourse(index)"
              :disabled="isDisable()"
              >新增课程</a-button
            >
            <span class="txt"
              >共{{ item.course && item.course.length }}个课程 | 总价{{
                getTotalCourse(item.course)
              }}元</span
            >
          </div>
          <a-row class="lineBot pb10">
            <p class="formLabel">活动价<span>(元)</span><b> *</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('floorPrice', index) &&
                  !isValueNew('floorPrice', index),
              }"
            >
              <a-input
                :disabled="isDisable()"
                size="large"
                style="width: 70%"
                placeholder="请输入活动价"
                @change="setValue(index, 'floorPrice', $event.target.value)"
                :value="getPackageItem('floorPrice', index)"
              />
              <div
                class="form-err"
                style="right: 50%"
                v-if="
                  !getPackageValidate('floorPrice', index) &&
                  !isValueNew('floorPrice', index)
                "
              >
                商品活动价不能为空
              </div>
            </div>
          </a-row>
          <!-- </a-form-item> -->

          <!-- <a-form-item
            label="新老生参与限制"
            style="padding-top: 13px; padding-bottom: 12px"
          >
            <a-select
              :disabled="isDisable()"
              size="large"
              @change="setValue(index, 'limitItems', $event)"
              :value="getPackageItem('limitItems', index)"
              style="width: 50%"
            >
              <a-select-option :value="1">仅允许新生参与活动</a-select-option>
              <a-select-option :value="2">仅允许老生参与活动</a-select-option>
              <a-select-option :value="0">不限制</a-select-option>
            </a-select>
          </a-form-item> -->
          <a-row class="stulimit">
            <a-col span="6">
              <p class="formLabel">
                新老生参与限制
                <a-tooltip>
                  <template slot="title">新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template>
                  <a-icon type="question-circle" class="limitIcon" theme='filled'/>
                </a-tooltip>
              </p>
            </a-col>
            <a-col span="12">
              <a-switch
                class="stuLimit"
                :disabled="isDisable()"
                :checked="Boolean(getPackageItem('limitItems', index))"
                @change="setValue(index, 'limitItems', Number($event))"
              />
            </a-col>
          </a-row>
          <a-row v-if="getPackageItem('limitItems', index)">
            <a-col class="hei">
              <a-radio-group
                :disabled="isDisable()"
                name="radioGroup"
                @change="setValue(index, 'limitItems', $event.target.value)"
                :value="getPackageItem('limitItems', index)"
              >
                <a-radio :value="1">仅允许新生参与活动</a-radio>
                <a-radio :value="2">仅允许老生参与活动</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
          <a-form-item
            label="活动名额"
            :labelCol="{ span: 3 }"
            class="activeNum no-bottom lineTop"
          >
            <a-radio-group
              style="margin-left: 16px"
              :disabled="isDisable('placesLimit', index)"
              name="radioGroup"
              @change="setValue(index, 'placesLimit', $event.target.value)"
              :value="getPackageItem('placesLimit', index)"
            >
              <a-radio :value="0">
                <span
                  :class="{
                    'ac-text': getPackageItem('placesLimit', index) === 0,
                  }"
                  >不限</span
                >
              </a-radio>
              <a-radio :value="1">
                <span
                  :class="{
                    'ac-text': getPackageItem('placesLimit', index) == 1,
                  }"
                  >仅限</span
                >
                <!-- @blur="checkNumber($event, index)" -->
                <a-input
                  :maxLength="7"
                  :disabled="isDisable('places', index)"
                  style="width: 60px; height: 26px"
                  @change="setValue(index, 'places', $event.target.value)"
                  :value="getPackageItem('places', index)"
                />
                <span
                  :class="{
                    'ac-text': getPackageItem('placesLimit', index) == 1,
                  }"
                  >名</span
                >
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <div>
      <a-button
        :disabled="isDisable()"
        type="primary"
        icon="plus"
        class="add-package"
        ghost
        @click="addPackageNow"
        >新增抢购课包</a-button
      >
    </div>

    <a-row class="bottomLimit">
      <a-col span="4">
        <p>开启每人限购</p>
      </a-col>
      <a-col span="20">
        <a-switch
          :disabled="isDisable()"
          :checked="Boolean(getSignUpLimit)"
          @change="setSignUpLimit($event)"
        />
      </a-col>
    </a-row>

    <a-row class="maxSign" v-if="getSignUpLimit">
      <a-col span="5" class="label">报名限制</a-col>
      <a-col span="18">
        <span>每个学员最多报</span>
        <a-input
          type="number"
          ref="sss"
          :disabled="isDisable()"
          @change="setLimitNum($event.target.value.replace(/\D/g, ''))"
          :value="getLimitNum"
        />
        <span>节</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import SetCourse from "./base/setCourse.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";
import {
  validateFloat,
  validateRequire,
  validateStringLen,
} from "../../../../utils/validate";

export default {
  beforeCreate() {
    this.formPackage = this.$form.createForm(this, {
      name: "validate_package",
    });
  },
  created() {
    //this.getTerms()
    let copy = JSON.parse(JSON.stringify(this.getPackages));
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
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getPackages);
    }, 800);
  },
  data() {
    return {
      // oldPlaces: {},
      packages: [],
    };
  },
  computed: {
    ...mapGetters([
      // "getActiveType",
      // "getActiveContent",
      "getPackages",
      "getPackageItem",
      "getSignUpLimit",
      "getLimitNum",
      "getActivityStatus",
      "getMode",
      // "getPackageCourseItem",
    ]),
    getTotalCourse() {
      return (c) => {
        let t = 0;
        for (let cour of c) {
          t += cour.coursePrice * 1;
        }
        return t.toFixed(2);
      };
    },
  },
  methods: {
    getPackageValidate(name, index) {
      let c = this.getPackageItem(name, index);
      if (name == "floorPrice" && c) {
        return true;
      } else if (name == "productName") {
        return validateStringLen(c, 20);
      }
    },
    isValueNew(name, index) {
      return this.isNew[index][name];
    },
    addCourse(id) {
      this.addCourseByIndex(id);
      let news = this.isNew;
      news[id].course.push({
        courseId: true,
        courseName: true,
        packageId: true,
        feeType: true,
        coursePrice: true,
        buyTime: true,
        giveTime: true,
      });
      this.isNew = news;
    },
    setValue(index, name, value) {
      // 两位小数
      if (name == "floorPrice") {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      // 整数
      if (name == "places") {
        value = String(value).replace(/\D/g, "");

        // this.oldPlaces[index] = this.getPackageItem("places", index)
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
      let isnew = this.isNew;
      let pack = isnew[index];
      pack[name] = false;
      this.isNew = isnew;
    },
    addPackageNow() {
      this.addPackage();
      let news = this.isNew;
      news.push({
        course: [
          {
            courseId: true,
            courseName: true,
            packageId: true,
            feeType: true,
            coursePrice: true,
            buyTime: true,
            giveTime: true,
          },
        ],
        productName: true,
        packageName: true,
        floorPrice: true,
        limitItems: true,
        placesLimit: true,
        places: true,
      });
      this.isNew = news;
    },
    deletePackageNow(index) {
      let news = this.isNew;
      news.splice(index, 1);
      this.isNew = news;
      this.deletePackageByIndex(index);
    },
    getIsNew(index, cIndex) {
      if (this.isNew && this.isNew.length) {
        let p = this.isNew[index];
        if (p && p.course && p.course.length) {
          return p.course[cIndex];
        }
      }
    },

    validate() {
      let arr = [];
      this.isNew.map((item) => {
        let obj = {};
        for (let key in item) {
          if (!Array.isArray(item[key])) {
            obj[key] = false;
          } else {
            obj[key] = item[key];
          }
        }
        arr.push(obj);
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
      let p = this.getPackages;
      for (let i = 0; i < p.length; i++) {
        let obj = p[i];
        if (!validateRequire(obj.floorPrice)) {
          return false;
        }
        if (!validateStringLen(obj.productName, 20)) {
          return false;
        }
        let course = obj.course;
        let pr = 0;
        course.forEach((i) => {
          pr = pr + Number(i.coursePrice);
        });
        if (Number(obj.floorPrice) >= pr) {
          this.$message.error("活动价必须小于原价");
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
          if (this.getActivityStatus == 2 && this.getMode == 2) {
            if (obj.places * 1 < this.getPackageItem("oldPlaces", i) * 1) {
              this.$message.error("开始后名额不能减少");
              this.setValue(i, "places", this.getPackageItem("oldPlaces"));
              return false;
            }
          }
        }
      }
      if (this.getSignUpLimit && !this.getLimitNum) {
        this.$message.error("参与限制数最不能为空");
        return false;
      }
      if (this.getSignUpLimit && this.getLimitNum > p.length) {
        this.$message.error("参与限制数最大不能超过商品总数");
        this.setLimitNum();
        this.$refs.sss.focus();
        return false;
      }
      return checkStatus;
    },
    // checkNumber(e, index) {
    //   let n = e.target.value;
    //   if (n && !/(^[0-9]\d*$)/.test(n)) {
    //     this.$message.error("活动名额需是正整数");
    //     this.setValue(index, "places", this.oldPlaces);
    //     return;
    //   }
    //   if (this.getActivityStatus == 2) {
    //     if (n >= this.oldPlaces) {
    //       this.setValue(index, "places", n);
    //     } else {
    //       this.$message.error("开始后名额不能减少");
    //       this.setValue(index, "places", this.oldPlaces);
    //     }
    //   }
    // },
    isDisable(name, index) {
      if (name == "places") {
        if (this.getPackageItem("placesLimit", index) == 0) {
          return true;
        }
      }
      if (name == "delete" && index <= 1) {
        return true;
      }

      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        if (name == "placesLimit") {
          return false;
        } else if (name == "places") {
          if (this.getPackageItem("placesLimit", index) == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
      
    },
    ...mapActions("flash", [
      "addPackage",
      "addCourseByIndex",
      "deletePackageByIndex",
      // "deleteCourseByIndex",
      "setPackagesItemByName",
    ]),
    ...mapMutations("common", ["setLimitNum", "setSignUpLimit"]),
  },
  components: {
    SetCourse,
  },
};
</script>

<style lang="less" scoped>
.no-bottom {
  margin-bottom: 6px;
}
.course-package {
  width: 100%;
  min-height: 200px;

  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
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
  .context {
    margin: 16px 30px;
    .activeNum /deep/ .ant-form-item-control-wrapper {
      margin-top: 3px;
    }
    .activeNum /deep/ .ant-form-item-label {
      margin-top: 4px;
    }
    .course {
      min-height: 100px;
      background: #f9f9f9;
      margin-bottom: 8px;
    }
    p {
      span {
        font-weight: normal;
        font-size: 14px;
        color: #595959;
      }
    }
    .add-course {
      margin-top: 8px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      .txt {
        font-size: 13px;
        color: #595959;
        line-height: 32px;
        text-align: right;
      }
    }
  }
  .ant-form-item {
    margin-bottom: 0;
  }
}
.add-package {
  margin-bottom: 20px;
  box-shadow: none;
}
.maxSign {
  line-height: 32px;
  padding-bottom: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  /deep/ .ant-input {
    width: 60px;
  }
}
.border-line {
  border-bottom: 1px solid #f0f0f0;
}
.next-btn {
  text-align: center;
  margin-top: 20px;
  margin-left: 50%;
  transform: translateX(-50%);
}
.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}
.inputForm {
  b {
    font-weight: normal;
    color: #f84f43;
  }
  p {
    margin-bottom: 4px;
  }
}
.ant-switch {
  margin-left: 18px;
}
.lineBot {
  border-bottom: 1px solid #f0f0f0;
}
.lineTop {
  border-top: 1px solid #f0f0f0;
}
.pb10 {
  padding-bottom: 10px;
}
.stulimit {
  padding-top: 10px;
  padding-bottom: 6px;
}
.hei {
  line-height: 40px;
}
.bottomLimit {
  .ant-input {
    width: 60px;
  }
  margin-bottom: 8px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  p {
    color: #262626;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0;
  }
}
.limitIcon {
  font-size: 14px;
  color: #d8d8d8;
}
</style>