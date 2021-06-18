<template>
  <div>
    <div class="title">
      <span>课程{{ courseIndex + 1 }}</span>
      <a-popconfirm
        v-if="!isDisable('delete')"
        title="确定删除吗?"
        ok-text="是"
        cancel-text="否"
        @confirm="deleteCourse"
      >
        <a-icon type="delete" />
      </a-popconfirm>
    </div>
    <div class="courseDetail">
      <a-row>
        <a-col>
          <p class="formLabel buy">活动课程<b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getCourseValidate('courseName') &&
                !isCourseValueNew('courseName'),
            }"
          >
            <a-select
              :disabled="isDisable()"
              class="global-search"
              size="large"
              style="width: 100%"
              show-search
              :value="getPackageCourseItemChild('courseName') || undefined"
              placeholder="输入关键字查询"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="getCourse"
              @change="onSelect"
              @focus="focusSearch"
            >
              <a-select-option
                v-for="item in courseList"
                :key="item.courseId"
                :title="item.courseName"
              >
                {{ item.courseName }}
              </a-select-option>
            </a-select>
            <div
              class="form-err"
              v-if="
                !getCourseValidate('courseName') &&
                !isCourseValueNew('courseName')
              "
            >
              请选择课程
            </div>
          </div>
        </a-col>
      </a-row>
      <a-form-item label="收费方式" :labelCol="{ span: 4 }" class="fee">
        <a-radio-group
          :disabled="isDisable()"
          name="radioGroup"
          @change="changeFeeType"
          :value="getPackageCourseItemChild('feeType')"
        >
          <a-radio :value="0">按课时报名</a-radio>
          <a-radio :value="1">按期收费</a-radio>
          <a-radio :value="2">按月收费</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="选择套餐" class="no-bottom pac">
        <a-select
          :disabled="isDisable()"
          class="select-col"
          size="large"
          notFoundContent="当前没有可选套餐"
          placeholder="请选择套餐"
          @change="choosePackage('packageId', $event)"
          :value="getPackageCourseItemChild('packageId')"
        >
          <a-select-option
            :disabled="isDisable()"
            :value="item.packageId"
            v-for="(item, index) in activeList"
            :key="index"
            >{{ item.packageName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-row
        class="no-bottom"
        v-if="getPackageCourseItemChild('feeType') == 1"
        :gutter="24"
      >
        <a-col :span="12">
          <p class="formLabel buy">学年<b> *</b></p>
          <div
            :class="{
              'form-err-group':
                !getCourseValidate('schoolYear') &&
                !isCourseValueNew('schoolYear'),
            }"
          >
            <a-select
              :disabled="isDisable()"
              size="large"
              placeholder="请选择学年"
              @change="setValue('schoolYear', $event)"
              :value="getPackageCourseItemChild('schoolYear')"
            >
              <a-select-option value="2019">2019</a-select-option>
              <a-select-option value="2020">2020</a-select-option>
              <a-select-option value="2021">2021</a-select-option>
              <a-select-option value="2022">2022</a-select-option>
              <a-select-option value="2023">2023</a-select-option>
              <a-select-option value="2024">2024</a-select-option>
            </a-select>
            <div
              class="form-err"
              v-if="
                !getCourseValidate('schoolYear') &&
                !isCourseValueNew('schoolYear')
              "
            >
              请选择学年
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <p class="formLabel buy">学期<b> *</b></p>
          <div
            :class="{
              'form-err-group':
                !getCourseValidate('schoolTermId') &&
                !isCourseValueNew('schoolTermId'),
            }"
          >
            <a-select
              :disabled="isDisable()"
              size="large"
              placeholder="请选择学期"
              @change="setValue('schoolTermId', $event)"
              :value="getPackageCourseItemChild('schoolTermId')"
            >
              <a-select-option
                :value="item.schoolTermId"
                v-for="item in terms"
                :key="item.schoolTermId"
              >
                {{ item.schoolTermName }}
              </a-select-option>
            </a-select>
            <div
              class="form-err"
              v-if="
                !getCourseValidate('schoolTermId') &&
                !isCourseValueNew('schoolTermId')
              "
            >
              请选择学期
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row
        class="no-bottom"
        v-if="getPackageCourseItemChild('feeType') == 2"
        :gutter="24"
      >
        <a-col :span="12">
          <p class="formLabel buy">开始时间<b> *</b></p>
          <div
            :class="{
              'form-err-group':
                !getCourseValidate('beginTime') &&
                !isCourseValueNew('beginTime'),
            }"
          >
            <a-date-picker
              :disabled="isDisable()"
              size="large"
              placeholder="请选择开始时间"
              @change="setValue('beginTime', $event)"
              :value="getPackageCourseItemChild('beginTime')"
            />
            <div
              class="form-err"
              v-if="
                !getCourseValidate('beginTime') &&
                !isCourseValueNew('beginTime')
              "
            >
              课程开始时间不能为空
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <p class="formLabel buy">结束时间<b> *</b></p>
          <div
            :class="{
              'form-err-group':
                !getCourseValidate('endTime') && !isCourseValueNew('endTime'),
            }"
          >
            <a-date-picker
              :disabled="isDisable()"
              size="large"
              placeholder="请选择结束时间"
              @change="setValue('endTime', $event)"
              :value="getPackageCourseItemChild('endTime')"
            />
            <div
              class="form-err"
              v-if="
                !getCourseValidate('endTime') && !isCourseValueNew('endTime')
              "
            >
              课程结束时间不能为空
            </div>
          </div>
          <!-- </a-form-item> -->
        </a-col>
      </a-row>
      <a-row v-if="getPackageCourseItemChild('feeType') != 2" :gutter="24">
        <a-col :span="12">
          <p class="formLabel buy">购买课时<b> *</b></p>
          <div
            :class="{
              'form-err-group':
                !getCourseValidate('buyTime', { rule: 'float' }) &&
                !isCourseValueNew('buyTime'),
            }"
          >
            <a-input
              type="number"
              :disabled="isDisable()"
              size="large"
              placeholder="请输入购买课时"
              @change="setValue('buyTime', $event.target.value)"
              :value="getPackageCourseItemChild('buyTime')"
            />
            <div
              class="form-err"
              v-if="
                !getCourseValidate('buyTime', { rule: 'float' }) &&
                !isCourseValueNew('buyTime')
              "
            >
              购买课时不能为空
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <p class="formLabel buy">赠送课时</p>
          <a-input
            type="number"
            :disabled="isDisable()"
            size="large"
            @change="setValue('giveTime', $event.target.value)"
            :value="getPackageCourseItemChild('giveTime')"
            placeholder="请输入赠送课时"
          />
        </a-col>
      </a-row>
      <a-row v-if="getPackageCourseItemChild('feeType') == 2">
        <a-col>
          <p class="formLabel buy">赠送天数</p>
          <a-input
            :disabled="isDisable()"
            size="large"
            placeholder="请输入赠送天数"
            @change="setValue('giveTime', $event.target.value)"
            :value="getPackageCourseItemChild('giveTime')"
          />
        </a-col>
      </a-row>
      <p class="formLabel">原价<span>(元)</span> <b> *</b></p>
      <div
        :class="{
          'form-err-group':
            !getCourseValidate('coursePrice', { rule: 'float' }) &&
            !isCourseValueNew('coursePrice'),
        }"
      >
        <a-input
          type="number"
          :maxLength="7"
          :disabled="isDisable()"
          size="large"
          placeholder="请输入课程价格"
          @change="setValue('coursePrice', $event.target.value)"
          :value="getPackageCourseItemChild('coursePrice')"
        />
        <div
          class="form-err"
          v-if="
            !getCourseValidate('coursePrice', { rule: 'float' }) &&
            !isCourseValueNew('coursePrice')
          "
        >
          课程原价不能为空
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  validateInteger,
  validateRequire,
  validateFloat,
  validateStringLen,
} from "../../../../../utils/validate.js";
import { yznReq } from "@/utils/yznhttp";
import moment from "moment";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  props: ["courseIndex", "index", "isNew"],
  created() {},
  data() {
    return {
      courseList: [],
      curCourse: {},
      activeList: [],
      allActiveList: [],
      terms: [],
    };
  },
  mounted() {
    this.isN = JSON.parse(JSON.stringify(this.isNew));
    if (this.getPackageCourseItemChild("courseId")) {
      this.getCourseDetail(this.getPackageCourseItemChild("courseId"));
    }
    this.getSchoolTermList();
  },
  methods: {
    async getCourseDetail(id) {
      let params = {
        courseId: id,
      };
      let res = await yznReq("get", "api/oa/course/getCourseDetail", params);
      if (res.status == 200) {
        let defaultName = res.context.courseName;
        this.setValue("courseName", defaultName);
        res.context.packages.forEach((i) => {
          i.packageId = i.packageId * 1;
        });
        this.allActiveList = res.context.packages;
        this.activeList = this.allActiveList.filter(
          (i) => i.feeType == this.getPackageCourseItemChild("feeType")
        );
      }
    },
    async getCourse(search) {
      let params = {
        start: 0,
        count: 10,
        searchName: search,
        searchType: "courseName",
        packageStatus: 1,
      };
      this.setValue("courseName", search);
      this.setValue("courseId", "");
      let res = await yznReq("get", "api/oa/course/getCoursesList", params);
      if (res.status == 200) {
        this.courseList = res.context.items;
        this.activeList = [];
        this.setValue("packageId", "");
      }
    },
    async focusSearch() {
      let params = {
        start: 0,
        count: 10,
        searchName: "",
        searchType: "courseName",
        packageStatus: 1,
      };
      let res = await yznReq("get", "api/oa/course/getCoursesList", params);
      if (res.status == 200) {
        this.courseList = res.context.items;
        this.activeList = [];
      }
    },
    onSelect(v) {
      let p = this.courseList.find((i) => i.courseId == v);
      this.curCourse = p;
      if (p) {
        p = p.packages;
      } else {
        return;
      }
      this.allActiveList = p;
      this.setValue("courseId", v);
      let selectItem = this.courseList.find((i) => i.courseId == v);
      this.setValue("courseName", selectItem.courseName);
      if (this.getPackageCourseItemChild("feeType") === 0) {
        this.activeList = p.filter((i) => {
          return i.feeType === 0;
        });
      } else if (this.getPackageCourseItemChild("feeType") === 1) {
        this.activeList = p.filter((i) => {
          return i.feeType === 1;
        });
      } else if (this.getPackageCourseItemChild("feeType") === 2) {
        this.activeList = p.filter((i) => {
          return i.feeType === 2;
        });
      }
      this.activeList.unshift({
        packageId: "",
        packageName: "请选择套餐",
      });
      this.setValue("packageId", "");
    },
    choosePackage(type, val) {
      let p = this.activeList.find((i) => i.packageId == val);
      let coursePrice = p.packagePrice;
      let giveTime = p.giveTime;
      let buyTime = p.packageTime;
      let schoolTermId = p.schoolTermId;
      let schoolYear = p.schoolYear;

      this.setValue("coursePrice", Number(coursePrice) || 0);
      this.setValue("giveTime", Number(giveTime) || 0);
      this.setValue("buyTime", Number(buyTime) || 0);
      this.setValue("schoolYear", Number(schoolYear) || "2021");
      this.setValue("schoolTermId", Number(schoolTermId) || "");

      if (p.packageTime && p.feeType == 2) {
        this.setValue("beginTime", moment().format("YYYY-MM-DD"));
        this.setValue(
          "endTime",
          moment().add(p.packageTime, "M").format("YYYY-MM-DD")
        );
      }

      this.setValue(type, val);
    },
    changeFeeType(e) {
      this.setValue("feeType", e.target.value);
      this.setValue("coursePrice", "");
      this.setValue("giveTime", "");
      this.setValue("buyTime", "");
      this.setValue("schoolYear", "2021");
      this.setValue("schoolTermId", "");

      this.isN = {
        courseName: true,
        courseId: true, // 课程id
        packageId: true, // 套餐id
        feeType: true, // 收费方式
        coursePrice: true, // 原价
        buyTime: true, // 购买课时
        giveTime: true, // 赠送课时
        schoolYear: true, // 学年
        schoolTermId: true, // 学期
        beginTime: true, // 开始时间
        endTime: true, // 结束时间
      };

      // let index = this.index;
      // let courseIndex = this.courseIndex;

      this.activeList = this.allActiveList.filter((i) => {
        return i.feeType === e.target.value;
      });

      if (this.activeList.length) {
        this.activeList.unshift({
          packageId: "",
          packageName: "请选择套餐",
        });
      }
    },
    getCourseValidate(name, rule) {
      let index = this.index;
      let courseIndex = this.courseIndex;
      let c;
      if (this.getActiveType == 2) {
        c = this.getPackageCourseItem(name, index, courseIndex);
      } else if (this.getActiveType == 3) {
        c = this.getGroupCourseItem(name, index, courseIndex);
      } else if (this.getActiveType == 4) {
        c = this.getBargainCourse(name, courseIndex);
      } else if (this.getActiveType == 5) {
        c = this.getHelpCourse(name, courseIndex);
      }

      if (!rule) {
        return validateRequire(c);
      } else if (rule.rule == "float") {
        return validateFloat(c);
      } else if (rule.rule == "str") {
        return validateStringLen(c, rule.len);
      } else if (rule.rule == "int") {
        return validateInteger(c);
      }
    },
    isCourseValueNew(name) {
      if (!this.isN) {
        return true;
      }
      if (this.getActiveType == 2) {
        return this.isN[name];
      } else if (this.getActiveType == 3) {
        return this.isN[name];
      } else if (this.getActiveType == 4) {
        return this.isN[name];
      } else if (this.getActiveType == 5) {
        return this.isN[name];
      }
    },

    setValue(name, value) {
      if (
        this.getPackageCourseItemChild("feeType") == 2 &&
        name == "giveTime"
      ) {
        value = value && value.replace(/\D/g, "");
      } else if (
        name == "buyTime" ||
        name == "giveTime" ||
        name == "coursePrice"
      ) {
        value = String(value).match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }

      let index = this.index;
      let courseIndex = this.courseIndex;
      // if (name == "feeType") {
      //   this.isN = JSON.parse(JSON.stringify(this.isNew));
      // }
      if (
        name != "feeType" &&
        name != "courseId" &&
        name != "courseName" &&
        name != "giveTime"
      ) {
        if (this.getActiveType == 2) {
          this.flashPackClean({ index, courseIndex });
        } else if (this.getActiveType == 3) {
          this.groupPackClean({ index, courseIndex });
        } else if (this.getActiveType == 4) {
          this.bargainSetCourse({
            index: courseIndex,
            name: "packageId",
            value: "",
          });
        } else if (this.getActiveType == 5) {
          this.helpSetCourse({
            index: courseIndex,
            name: "packageId",
            value: "",
          });
        }
      }
      if (this.getActiveType == 2) {
        // 有课程序号  设置课包中课程内容
        this.flashSetCourseItem({
          index,
          name,
          value,
          courseIndex,
        });
        let isnew = this.isN;
        isnew[name] = false;
        this.isN = isnew;
      } else if (this.getActiveType == 3) {
        this.groupSetCourseItem({
          index,
          courseIndex,
          name,
          value,
        });
        let isnew = this.isN;
        isnew[name] = false;
        this.isN = isnew;
      } else if (this.getActiveType == 4) {
        this.bargainSetCourse({
          index: courseIndex,
          name,
          value,
        });
        let isnew = this.isN;
        isnew[name] = false;
        this.isN = isnew;
      } else if (this.getActiveType == 5) {
        this.helpSetCourse({
          index: courseIndex,
          name,
          value,
        });
        let isnew = this.isN;
        isnew[name] = false;
        this.isN = isnew;
      }
      this.$forceUpdate();
    },
    getPackageCourseItemChild(name) {
      if (this.getActiveType == 2) {
        return this.getPackageCourseItem(name, this.index, this.courseIndex);
      } else if (this.getActiveType == 3) {
        return this.getGroupCourseItem(name, this.index, this.courseIndex);
      } else if (this.getActiveType == 4) {
        return this.getBargainCourse(name, this.courseIndex);
      } else if (this.getActiveType == 5) {
        return this.getHelpCourse(name, this.courseIndex);
      }
    },
    deleteCourse() {
      if (this.getActiveType == 2) {
        this.flashDeleteCourse({
          packageIndex: this.index,
          courseIndex: this.courseIndex,
        });
      } else if (this.getActiveType == 3) {
        this.groupDeleteCourse({
          packageIndex: this.index,
          courseIndex: this.courseIndex,
        });
      } else if (this.getActiveType == 4) {
        this.bargainDeleteCourse(this.courseIndex);
      } else if (this.getActiveType == 5) {
        this.helpDeleteCourse(this.courseIndex);
      }
    },
    validate() {
      let arr = this.isN;
      for (let key in arr) {
        arr[key] = false;
      }
      this.isN = arr;
      this.$forceUpdate();
      let feeType = this.getPackageCourseItemChild("feeType");
      if (feeType === 0) {
        if (!this.getCourseValidate("buyTime", { rule: "float" })) {
          return false;
        }
      } else if (feeType == 1) {
        if (!this.getCourseValidate("schoolYear")) {
          return false;
        }
        if (!this.getCourseValidate("schoolTermId")) {
          return false;
        }
        if (!this.getCourseValidate("buyTime", { rule: "float" })) {
          return false;
        }
      } else if (feeType == 2) {
        if (!this.getCourseValidate("endTime")) {
          return false;
        }
        if (!this.getCourseValidate("beginTime")) {
          return false;
        }
      }

      // 课程原价验证
      if (!this.getCourseValidate("coursePrice", { rule: "float" })) {
        return false;
      }
      // 课程名称选择验证
      if (!this.getCourseValidate("courseId", { rule: "float" })) {
        return false;
      }
      return true;
    },

    // 进行中时能否修改
    isDisable(name) {
      if (name == "delete") {
        let arr = [];
        if (this.getActiveType == 2) {
          arr = this.getPackageItem("course", this.index);
        } else if (this.getActiveType == 3) {
          arr = this.getGroupItem("courseInfo", this.index);
        } else if (this.getActiveType == 4) {
          arr = this.getBargainItem("course", this.index);
        } else if (this.getActiveType == 5) {
          arr = this.getHelpItem("course", this.index);
        }
        if (arr.length <= 1) {
          return true;
        }
      }
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        return true;
      }
    },

    //获取学期列表
    async getSchoolTermList(schoolTermId, obj) {
      let res = await yznReq("get", "api/oa/chargeStandard/listSchoolTerm", {
        pageType: 0,
      });
      if (res.status == 200) {
        this.terms = res.context;
      }
    },

    ...mapActions("flash", {
      flashSetCourseItem: "setPackageCourseItemByName",
      flashDeleteCourse: "deleteCourseByIndex",
      //flashClean: "cleanCourse",
      flashPackClean: "cleanPackage",
    }),
    ...mapActions("group", {
      groupSetCourseItem: "setPackageCourseItemByName",
      groupDeleteCourse: "deleteCourseByIndex",
      //groupClean: "cleanCourse",
      groupPackClean: "cleanPackage",
    }),
    ...mapActions("bargain", {
      bargainSetCourse: "setCourse",
      bargainDeleteCourse: "deleteCourse",
    }),
    ...mapActions("help", {
      helpSetCourse: "setCourse",
      helpDeleteCourse: "deleteCourse",
    }),
  },
  computed: {
    ...mapGetters([
      "getActiveType",
      // 抢购
      "getPackageCourseItem",
      "getPackageItem",
      // "getPackages",
      // 拼团
      // "getGroup",
      // "getGroupItem",
      "getGroupItem",
      "getGroupCourseItem",
      // 砍价
      "getBargainCourse",
      "getBargainItem",
      // 助力
      "getHelpCourse",
      "getHelpItem",

      "getActivityStatus",
      "getMode",
    ]),
  },
};
</script>

<style lang="less" scoped>
.title {
  line-height: 32px;
  height: 32px;
  border-bottom: 1px solid #ededed;
  background: transparent;
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  i {
    line-height: 32px;
    color: #acacac;
    &:hover,
    &:active {
      color: #ff9537;
      cursor: pointer;
    }
  }
}

.courseDetail {
  padding: 14px 16px;
  // .select-wid {
  //   width: 200px;
  // }
  .ant-calendar-picker {
    width: 100%;
  }
  .fee /deep/ .ant-form-item-label label {
    float: left;
  }
  .fee {
    margin-top: 5px;
  }
  P {
    // margin-bottom: 6px;
    b {
      font-weight: normal;
      color: #f84f43;
    }
  }
}
.ant-form-item {
  margin-bottom: 0;
}
.select-col {
  width: 100%;
}
.form-err {
  line-height: 1.5;
}
.ant-select {
  width: 100%;
}
.formLabel {
  line-height: 39px;
  margin-bottom: 0px;
  span {
    font-weight: normal;
    font-size: 14px;
    color: #595959;
  }
}
.no-bottom {
  padding-bottom: 0;
}
.pac /deep/ .ant-form-item-label {
  margin-top: -5px;
}
</style>