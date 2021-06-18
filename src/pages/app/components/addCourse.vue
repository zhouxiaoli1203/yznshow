<template>
  <div>
    <!-- 课程列表 -->
    <van-cell-group
      v-for="(ceil, index) in showActivityCourseList"
      :key="index"
      class="needDisable mt10"
    >
      <div class="custum_van-cell-group border_b" style="height: 30px">
        <span class="obvious c595959">课程{{ index + 1 }}</span>
        <span
          v-if="!isedit && showActivityCourseList.length > 1"
          class="del"
          @click="operate('del', showActivityCourseList, index, true)"
        ></span>
      </div>

      <div
        class="custum_van-cell-group border_b"
        @click="
          getPopup({
            key: 'courseList',
            name: 'courseName', //显示字段
            id: 'courseId', //唯一值
            title: '选择课程',
            index: index,
            ided: ceil.courseId,
          })
        "
      >
        <span class="required c_f_shrink">活动课程</span>
        <div class="c_f_center">
          <van-field
            :border="false"
            :class="[ceil.courseName ? 'obvious' : '']"
            v-model="ceil.courseName"
            class="pr0 needDisable"
            readonly
            input-align="right"
            placeholder="请选择课程"
            :rules="[{ required: true, message: '请选择活动课程' }]"
          />
          <van-icon name="arrow" />
        </div>
      </div>
      <div
        class="custum_van-cell-group border_b"
        @click="
          getPopup({
            key: 'types',
            name: 'name', //显示字段
            id: 'feeType', //唯一值
            title: '选择收费方式',
            index: index,
            ided: ceil.feeType,
          })
        "
      >
        <span class="required c_f_shrink">收费方式</span>
        <div class="c_f_center">
          <van-field
            :border="false"
            v-show="ceil.feeType == undefined"
            v-model="ceil.feeType"
            class="pr0 needDisable"
            readonly
            input-align="right"
            placeholder="请选择收费方式"
            :rules="[{ required: true, message: '请选择收费方式' }]"
          />
          <span class="obvious">{{
            ceil.feeType == 1
              ? "按期报名"
              : ceil.feeType == 2
              ? "按月报名"
              : ceil.feeType == 0
              ? "按课时报名"
              : ""
          }}</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <div
        class="custum_van-cell-group border_b"
        @click="
          getPopup({
            key: 'packages',
            name: 'packageName', //显示字段
            id: 'packageId', //唯一值
            title: '选择套餐',
            index: index,
            ided: ceil.packageId,
            data: ceil,
          })
        "
      >
        <span class="c_f_shrink">选择套餐</span>
        <div class="c_f_center">
          <van-field
            v-model="ceil.packageName"
            class="pr0 needDisable"
            :class="[ceil.packageName ? 'obvious' : '']"
            readonly
            input-align="right"
            placeholder="请选择套餐"
          />
          <van-icon name="arrow" />
        </div>
      </div>

      <div
        class="custum_van-cell-group border_b"
        v-if="ceil.feeType == 1"
        @click="
          getPopup({
            key: 'years',
            name: 'year', //显示字段
            id: 'year', //唯一值
            title: '选择学年',
            index: index,
            ided: ceil.schoolYear,
          })
        "
      >
        <span class="required c_f_shrink">学年</span>
        <div class="c_f_center">
          <van-field
            v-model="ceil.schoolYear"
            :class="[ceil.schoolYear ? 'obvious' : '']"
            class="pr0 needDisable"
            readonly
            input-align="right"
            placeholder="请选择学年"
            :rules="[{ required: true, message: '请选择学年' }]"
          />
          <van-icon name="arrow" />
        </div>
      </div>
      <div
        class="custum_van-cell-group border_b"
        v-if="ceil.feeType == 1"
        @click="
          getPopup({
            key: 'terms',
            name: 'schoolTermName', //显示字段
            id: 'schoolTermId', //唯一值
            title: '选择学期',
            index: index,
            ided: ceil.schoolTermId,
          })
        "
      >
        <span class="required c_f_shrink">学期</span>
        <div class="c_f_center">
          <van-field
            v-show="ceil.schoolTermId == undefined"
            v-model="ceil.schoolTermId"
            class="pr0 needDisable"
            readonly
            input-align="right"
            placeholder="请选择学期"
            :rules="[{ required: true, message: '请选择学期' }]"
          />
          <span class="obvious">{{
            ceil.schoolTermName || terms_[ceil.schoolTermId]
          }}</span>
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="custum_van-cell-group border_b" v-if="ceil.feeType != 2">
        <span class="required c_f_shrink">购买课时</span>
        <div class="c_f_center">
          <van-field
            v-model="ceil.buyTime"
            :class="[ceil.buyTime ? 'obvious' : '']"
            class="pr0 needDisable"
            type="number"
            :readonly="isedit"
            @input="outPackage($event, ceil)"
            @focus="isfocus = true"
            @blur="isfocus = false"
            :formatter="$formatter"
            format-trigger="onBlur"
            input-align="right"
            placeholder="请输入购买课时"
            :rules="[{ required: true, message: '购买课时不能为空' }]"
          />
        </div>
      </div>
      <div class="custum_van-cell-group border_b" v-if="ceil.feeType != 2">
        <span class="c_f_shrink">赠送课时</span>
        <div class="c_f_center">
          <van-field
            v-model="ceil.giveTime"
            :class="[ceil.giveTime !== undefined ? 'obvious' : '']"
            class="pr0 needDisable"
            :readonly="isedit"
            type="number"
            :formatter="$formatter"
            format-trigger="onBlur"
            input-align="right"
            placeholder="请输入赠送课时"
          />
        </div>
      </div>

      <div
        class="custum_van-cell-group border_b"
        v-if="ceil.feeType == 2"
        @click="timeSel('beginTime', index)"
      >
        <span class="required c_f_shrink">开始时间</span>
        <div class="c_f_center">
          <van-field
            v-show="!ceil.beginTime || ceil.beginTime.indexOf('T') == -1"
            v-model="ceil.beginTime"
            :class="[ceil.beginTime ? 'obvious' : '']"
            class="pr0 needDisable"
            readonly
            input-align="right"
            placeholder="请选择开始时间"
            :rules="[{ required: true, message: '请选择开始时间' }]"
          />
          <span
            class="obvious"
            v-show="ceil.beginTime && ceil.beginTime.indexOf('T') != -1"
            >{{ moment(ceil.beginTime).format("YYYY-MM-DD") }}</span
          >
          <van-icon name="arrow" />
        </div>
      </div>
      <div
        class="custum_van-cell-group border_b"
        v-if="ceil.feeType == 2"
        @click="timeSel('endTime', index)"
      >
        <span class="required c_f_shrink">结束时间</span>
        <div class="c_f_center">
          <van-field
            v-show="!ceil.endTime || ceil.endTime.indexOf('T') == -1"
            v-model="ceil.endTime"
            :class="[ceil.endTime ? 'obvious' : '']"
            class="pr0 needDisable"
            readonly
            input-align="right"
            placeholder="请选择结束时间"
            :rules="[{ required: true, message: '请选择结束时间' }]"
          />
          <span
            class="obvious"
            v-show="ceil.endTime && ceil.endTime.indexOf('T') != -1"
            >{{ moment(ceil.endTime).format("YYYY-MM-DD") }}</span
          >
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="custum_van-cell-group border_b" v-if="ceil.feeType == 2">
        <span class="c_f_shrink">赠送天数</span>
        <div class="c_f_center">
          <van-field
            v-model="ceil.giveTime"
            :class="[ceil.giveTime ? 'obvious' : '']"
            class="pr0 needDisable"
            :readonly="isedit"
            type="digit"
            input-align="right"
            placeholder="请输入赠送天数"
          />
        </div>
      </div>
      <div class="custum_van-cell-group">
        <span class="required c_f_shrink">原价</span>
        <div class="c_f_center">
          <van-field
            v-model="ceil.coursePrice"
            :class="[ceil.coursePrice ? 'obvious' : '']"
            class="pr0 needDisable"
            :readonly="isedit"
            type="number"
            :formatter="$formatter"
            format-trigger="onBlur"
            @input="outPackage($event, ceil)"
            @focus="isfocus = true"
            @blur="isfocus = false"
            input-align="right"
            placeholder="请输入原价"
            :rules="[{ required: true, message: '课程原价不能为空' }]"
          />
        </div>
      </div>
    </van-cell-group>
    <div v-if="showActivityCourseList.length" class="textC mt10">
      {{ `共${showActivityCourseList.length}门课程 | ` }}总原价{{
        showActivityCourseList | add("coursePrice") | qf
      }}元
    </div>
    <div style="padding: 0 14px" v-if="!isedit">
      <div
        class="common_btn mt10"
        @click="
          showActivityCourseList.push({});
          $forceUpdate();
        "
      >
        <span class="add mr8"></span>新增课程
      </div>
    </div>

    <!-- 弹出层 -->
    <van-popup closeable round v-model="popupShow" position="bottom">
      <div class="popupTitle">
        <span>{{ popupObj.title }}</span>
      </div>
      <ul class="popup_">
        <template>
          <li
            v-for="(ceil, index) in popupData"
            @click="popupClick(showActivityCourseList, ceil)"
            :key="index"
          >
            <div :class="[popupObj.ided == ceil[popupObj.id] ? 'active' : '']">
              <span>{{ ceil[popupObj.name] }}</span
              ><var></var>
            </div>
          </li>
        </template>
      </ul>
    </van-popup>
    <!-- 时间选择 -->
    <van-calendar
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="currentDate"
      v-model="datePickerShow"
      color="#13c2c2"
      @confirm="timeConfirm"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";
import moment from "moment";
export default {
  name: "addCourse",
  data() {
    return {
      isfocus: false,
      datePickerShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2050, 1, 1),
      currentDate: new Date(),
      timeCeilIndex: "",
      limitItems: [
        { label: "不限制", type: 0 },
        { label: "仅允许未签约的学员参与活动", type: 1 },
        { label: "仅允许已签约的学员参与活动", type: 2 },
      ],
      types: [
        { name: "按课时报名", feeType: 0 },
        { name: "按期报名", feeType: 1 },
        { name: "按月报名", feeType: 2 },
      ],
      years: this.$getFrom2017(true, 8),
      courseList: [
        {
          shopId: "851",
          courseName: "APP端秀测试课程",
          courseId: "10963",
          courseFromStatus: "0",
          courseStatus: "1",
          courseTypeName: "其他",
          courseTypeId: "13",
          chargeStandardId: "6619",
          auditionRecordTime: "30",
          taskStatus: "1",
          absentDeleteTimeStatus: "0",
          leaveDeleteTimeStatus: "0",
          warnTimeStatus: "1",
          courseType: "0",
          displayStatus: "0",
          reviewStatus: "0",
          annexStatus: "0",
          taskLookStatus: "1",
          color: "#F68657",
          courseGoodsRS: [],
          teachingMethod: 2,
          packages: [
            {
              packagePrice: "1000.00",
              chargeStandardId: "6619",
              packageTime: "10.00",
              giveTime: 0.0,
              packageId: "19037",
              packageStatus: "1",
              packageName: "普通课时套餐",
              packageDate: "2020-12-16T15:33:40.000+0800",
              packageUnitPrice: 100.0,
              feeType: 0,
              validNum: 0,
            },
            {
              packagePrice: "9.00",
              chargeStandardId: "6619",
              schoolTermId: 3134,
              schoolTermName: "春季",
              packageTime: "9.00",
              giveTime: 0.0,
              packageId: "19039",
              packageStatus: "1",
              packageName: "寒假套餐",
              packageDate: "2020-12-16T15:43:52.000+0800",
              packageUnitPrice: 1.0,
              feeType: 1,
              validNum: 0,
            },
            {
              packagePrice: "2.00",
              chargeStandardId: "6619",
              schoolTermId: 3137,
              packageTime: "2.00",
              giveTime: 0.0,
              packageId: "19072",
              packageStatus: "1",
              packageName: "暑假套餐",
              packageDate: "2020-12-29T15:33:51.000+0800",
              packageUnitPrice: 1.0,
              feeType: 1,
              validNum: 0,
            },
            {
              packagePrice: "111.00",
              chargeStandardId: "6619",
              packageTime: "1.00",
              giveTime: 1.0,
              packageId: "19077",
              packageStatus: "1",
              packageName: "1个月",
              packageDate: "2020-12-29T16:37:15.000+0800",
              packageUnitPrice: 111.0,
              feeType: 2,
              validNum: 0,
            },
            {
              packagePrice: "333.00",
              chargeStandardId: "6619",
              packageTime: "2.00",
              giveTime: 2.0,
              packageId: "19078",
              packageStatus: "1",
              packageName: "2个月",
              packageDate: "2020-12-29T16:37:15.000+0800",
              packageUnitPrice: 166.5,
              feeType: 2,
              validNum: 0,
            },
          ],
          activityStatus: "0",
          unitPrice: 0.0,
          deleteStatus: 0,
        },
        {
          shopId: "851",
          courseName: "测试课程",
          courseId: "10146",
          courseFromStatus: "0",
          courseStatus: "1",
          chargeStandardId: "6145",
          auditionRecordTime: "30",
          taskStatus: "1",
          absentDeleteTimeStatus: "0",
          leaveDeleteTimeStatus: "0",
          warnTimeStatus: "1",
          courseType: "0",
          displayStatus: "0",
          reviewStatus: "1",
          annexStatus: "1",
          taskLookStatus: "0",
          color: "#F68657",
          courseGoodsRS: [],
          teachingMethod: 2,
          packages: [
            {
              packagePrice: "100.00",
              chargeStandardId: "6145",
              packageTime: "20.00",
              giveTime: 0.0,
              packageId: "18247",
              packageStatus: "1",
              packageName: "20课时",
              packageDate: "2020-06-24T10:35:41.000+0800",
              packageUnitPrice: 5.0,
              feeType: 0,
              validNum: 0,
            },
            {
              packagePrice: "0.00",
              chargeStandardId: "6145",
              packageTime: "30.00",
              giveTime: 0.0,
              packageId: "19083",
              packageStatus: "1",
              packageName: "30课时",
              packageDate: "2021-01-05T15:22:10.000+0800",
              packageUnitPrice: 0.0,
              feeType: 0,
              validNum: 0,
            },
          ],
          activityStatus: "0",
          unitPrice: 0.0,
          deleteStatus: 0,
        },
      ],
      terms: [],
      terms_: {},
      packages: [],
      popupShow: false,
      popupData: [],
      popupObj: {},
      checked: require("../../../assets/img/app/checked.png"),
      unchecked: require("../../../assets/img/app/unchecked.png"),
    };
  },
  props: {
    showActivityCourseList: {
      type: Array,
    },
    isedit: {
      type: Boolean,
    },
  },
  watch: {
    showActivityCourseList: {
      handler(newV, oldV) {
        if (newV) {
          console.log(this.showActivityCourseList);
        }
      },
      deep: true,
    },
  },
  methods: {
    moment,
    timeSel(key, index) {
      if (this.isedit) return;
      this.timeCeilIndex = index;
      this.currentDate = this.showActivityCourseList[this.timeCeilIndex][key]
        ? new Date(this.showActivityCourseList[this.timeCeilIndex][key])
        : new Date();
      this.datePickerFor = key;
      this.datePickerShow = true;
    },
    timeConfirm(date) {
      this.datePickerShow = false;
      let temTime = this.showActivityCourseList[this.timeCeilIndex][
        this.datePickerFor
      ];
      this.showActivityCourseList[this.timeCeilIndex][
        this.datePickerFor
      ] = moment(date).format("YYYY-MM-DD");
      // 按月修改时间脱套餐
      if (
        temTime !=
          this.showActivityCourseList[this.timeCeilIndex][this.datePickerFor] &&
        this.showActivityCourseList[this.timeCeilIndex].packageId
      ) {
        console.log(1);
        this.showActivityCourseList[this.timeCeilIndex].packageId = undefined;
        this.showActivityCourseList[this.timeCeilIndex].packageName = undefined;
      }
    },
    // 脱套餐
    outPackage(e, data) {
      console.log(e);
      if (this.isfocus) {
        data.packageId = undefined;
        data.packageName = undefined;
        // if (data.feeType == 1) {
        //   data.schoolTermId = undefined;
        // }
      }
    },
    getPopup(options) {
      if (this.isedit) return;
      this.popupObj = options;
      if (options.id == "courseId") {
        this.callAPP(); //课程无需 调老师端桥接
        // let data = this.courseList[1],
        //   that = this;
        // console.log("手机端返回数据：" + data);
        // let tem = that.showActivityCourseList[that.popupObj.index];
        // if (tem["courseId"] != data["courseId"]) {
        //   //切换课程
        //   that.$set(that.showActivityCourseList, that.popupObj.index, {});
        //   tem = that.showActivityCourseList[that.popupObj.index];
        // }
        // that.collectVals(tem, data, [
        //   that.popupObj.id,
        //   that.popupObj.name,
        //   "packages",
        // ]);
        // that.defaultfeeType(data, tem);
        return;
      }
      if (options.id == "packageId") {
        let arr = [];
        if (options.data.packages && options.data.packages.length) {
          options.data.packages.map((item) => {
            if (item.feeType == options.data["feeType"]) {
              arr.push(item);
            }
          });
        }
        this.packages = arr;
      }
      this.popupData = this[options.key];
      if (!this.popupData.length) {
        Toast("此课程在当前收费方式下暂无套餐");
        return;
      }
      this.popupShow = true;
    },
    collectVals(obj, data, arr) {
      if (!arr) return;
      Object.keys(data).forEach((key) => {
        if (arr.indexOf(key) != -1) {
          // 套餐字段和提交字段不一致处理
          if (key == "packagePrice") {
            // obj["coursePrice"] = data[key];
            this.$set(obj, "coursePrice", data[key]);
            return;
          }
          if (key == "packageTime") {
            if (data.feeType == 2) {
              // obj["beginTime"] = moment(new Date()).format("YYYY-MM-DD");
              // obj["endTime"] = moment(
              //   this.$getNextMonth_(new Date(), data[key])
              // ).format("YYYY-MM-DD");
              this.$set(
                obj,
                "beginTime",
                moment(new Date()).format("YYYY-MM-DD")
              );
              this.$set(
                obj,
                "endTime",
                moment(this.$getNextMonth_(new Date(), data[key])).format(
                  "YYYY-MM-DD"
                )
              );
            } else {
              // obj["buyTime"] = data[key];
              this.$set(obj, "buyTime", data[key]);
            }
            return;
          }
          // obj[key] = data[key];
          this.$set(obj, key, data[key]);
        }
      });
    },
    //弹出框选择操作
    popupClick(source, data) {
      let tem = source[this.popupObj.index]; //当前操作的课程
      //选择套餐
      if (this.popupObj.id == "packageId") {
        this.collectVals(tem, data, [
          "packageId",
          "packagePrice",
          "packageName",
        ]);
        if (data.feeType == 0) {
          //课时套餐
          this.collectVals(tem, data, ["packageTime", "giveTime"]);
        } else if (data.feeType == 1) {
          //按期
          this.collectVals(tem, data, [
            "schoolTermId",
            "giveTime",
            "packageTime",
          ]);
        } else {
          //按月 tip packageTime 需要转成 开始时间结束时间
          this.collectVals(tem, data, ["packageTime", "giveTime"]);
        }
      }

      //选择课程
      if (this.popupObj.id == "courseId") {
        if (tem["courseId"] != data["courseId"]) {
          //切换课程
          // source.showActivityCourseList[this.popupObj.index] = {};
          this.$set(source, this.popupObj.index, {});
          tem = source[this.popupObj.index];
        }

        this.collectVals(tem, data, [this.popupObj.id, this.popupObj.name]);
        this.defaultfeeType(data, tem);
      }

      //切换收费方式
      if (this.popupObj.id == "feeType" && data["feeType"] != tem["feeType"]) {
        this.$set(source, this.popupObj.index, {
          courseId: tem.courseId,
          courseName: tem.courseName,
          packages: tem.packages ? tem.packages : [],
        });
        source[this.popupObj.index]["feeType"] = data["feeType"];
        if (
          source[this.popupObj.index].packages &&
          source[this.popupObj.index].packages.length
        ) {
          let arr = [];
          source[this.popupObj.index].packages.map((item) => {
            if (item.feeType == data["feeType"]) {
              arr.push(item);
            }
          });
          this.packages = arr;
        }
      }

      //选择学年
      if (this.popupObj.id == "year") {
        tem["schoolYear"] = data["year"];
      }
      //选择学期
      if (this.popupObj.id == "schoolTermId") {
        // 按期修改学期脱套餐
        if (tem.schoolTermId != data.schoolTermId && tem.packageId) {
          console.log(1);
          tem.packageId = undefined;
          tem.packageName = undefined;
        }
        this.collectVals(tem, data, [this.popupObj.id]);
      }
      //选择参与限制
      if (this.popupObj.id == "type") {
        this.item["limitItems"] = data[this.popupObj.id];
      }

      this.popupShow = !this.popupShow;
    },
    // 默认选中收费方式
    defaultfeeType(list, source) {
      let t_0 = 0,
        t_1 = 0,
        t_2 = 0;
      if (list.packages && list.packages.length) {
        list.packages.map((item) => {
          item.feeType == 0 ? t_0++ : item.feeType == 1 ? t_1++ : t_2++;
        });
        source["feeType"] = t_0 ? 0 : t_1 ? 1 : t_2 ? 2 : 0;
      } else {
        source["feeType"] = 0;
      }
      if (list.packages && list.packages.length) {
        let arr = [];
        list.packages.map((item) => {
          if (item.feeType == source["feeType"]) {
            arr.push(item);
          }
        });
        this.packages = arr;
      }
    },
    operate(type, data, val, val_) {
      switch (type) {
        case "del":
          if (data) {
            if (val_ && data.length == 1) {
              return Toast("最少存在一项");
            }
            Dialog.confirm({
              title: "提示",
              message: "确认删除？",
            })
              .then(() => {
                data.splice(val, 1);
              })
              .catch(() => {});
          }
          break;
      }
    },
    callAPP() {
      console.log("呼唤app");
      let param = {}; // JS给APP传得参数
      this.$bridge.callHandler("JSCallApp_course_sel", param, (res) => {
        console.log("获取app响应数据:" + res);
      });
    },
    appCall() {
      let that = this;
      this.$bridge.registerHandler(
        "appCallJS_course_res",
        (data, responseCallback) => {
          console.log("手机端返回数据：" + data);
          data = JSON.parse(data);
          let tem = that.showActivityCourseList[that.popupObj.index];
          if (tem["courseId"] != data["courseId"]) {
            //切换课程
            that.$set(that.showActivityCourseList, that.popupObj.index, {});
            tem = that.showActivityCourseList[that.popupObj.index];
          }
          that.collectVals(tem, data, [
            that.popupObj.id,
            that.popupObj.name,
            "packages",
          ]);
          that.defaultfeeType(data, tem);
        }
      );
    },
  },
  mounted() {
    //注册事件
    this.appCall();
    console.log(this.showActivityCourseList);
    this.yznReq("get", "api/oa/chargeStandard/listSchoolTerm", {
      pageType: 0,
    }).then((res) => {
      if (res.status == 200) {
        this.terms = res.context;
        this.terms.forEach((item) => {
          this.terms_[item.schoolTermId] = item.schoolTermName;
        });
        this.$forceUpdate();
      }
    });
  },
};
</script>

<style  lang="less" scoped>
.titleItem {
  font-size: 15px;
  font-weight: bold;
  padding: 18px 14px 6px;
}
.del {
  display: inline-block;
  width: 15px;
  height: 16px;
  background: url("../../../assets/img/app/setting_del.png") no-repeat;
  background-size: contain;
}
ul.popup_ {
  max-height: 200px;
  min-height: 120px;
  overflow: auto;
  li {
    > div {
      &.active {
        span {
          color: #13c2c2;
        }

        var {
          background: url("../../../assets/img/app/selected.png") no-repeat;
          background-size: contain;
        }
      }
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 14px;
      height: 40px;
      border-bottom: 1px solid #f5f5f5;
      span {
        font-size: 15px;
        color: #292929;
      }
      var {
        width: 24px;
        height: 18px;
        background: none;
      }
    }
  }
}
</style>
