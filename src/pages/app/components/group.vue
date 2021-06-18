<template>
  <div>
    <!-- <van-form
      class="ofauto"
      validate-first
      ref="form"
      @submit="next"
      error-message-align="right"
      :scroll-to-error="true"
      :show-error-message="false"
    > -->

    <div class="titleItem">{{ cs != 1 ? "课包设置" : "自定义设置" }}</div>
    <van-field
      v-model="item.productName"
      class="custom_required needDisable"
      :readonly="edit"
      :label="cs != 1 ? '课包名称' : '商品名称'"
      maxlength="20"
      input-align="right"
      :placeholder="cs != 1 ? '请输入课包名称' : '请输入商品名称'"
      :rules="[
        {
          required: true,
          message: cs != 1 ? '请输入课包名称' : '请输入商品名称',
        },
      ]"
    />
    <add-course
      v-if="cs != 1"
      :showActivityCourseList="item.showActivityCourseList"
    ></add-course>
    <template v-else>
      <van-cell-group class="mt10">
        <div
          class="custum_van-cell-group needDisable border_b"
          style="height: 34px"
        >
          <span class="required">商品描述</span>
        </div>
        <van-field
          v-model="item.productDesc"
          type="textarea"
          class="custom_required pt0 needDisable"
          :readonly="edit"
          rows="2"
          autosize
          show-word-limit
          maxlength="200"
          input-align="left"
          placeholder="请输入商品描述"
          :rules="[{ required: true, message: '请输入商品描述' }]"
        />
      </van-cell-group>

      <van-field
        v-model="item.originalPrice"
        label="原价"
        type="number"
        :formatter="$formatter"
        format-trigger="onBlur"
        class="mt10 custom_required needDisable"
        :readonly="edit"
        input-align="right"
        placeholder="请输入原价"
        :rules="[{ required: true }]"
    /></template>

    <div
      class="titleItem myTip"
      @click="
        $dialog
          .alert({
            title: '拼团梯度说明',
            message:
              '当团队人数大于等于梯度所需人数时，参与此团的团长及团员即可享受此梯度的商品价格。',
            showConfirmButton: false,
            messageAlign: 'left',
            closeOnClickOverlay: true,
            className: 'toastDialog',
          })
          .catch(() => {})
      "
    >
      梯度设置<span class="f12 c595959">（最多可增加4档梯度）</span>
    </div>

    <!-- 梯度列表 -->
    <van-cell-group
      v-for="(ceil, index) in item.showContentRuleList"
      :key="index"
      class="mt10 needDisable"
    >
      <div class="custum_van-cell-group border_b" style="height: 30px">
        <span class="obvious c595959">梯度{{ index + 1 }}</span>
        <span
          v-if="!edit && item.showContentRuleList.length > 1"
          class="del"
          @click="operate('del', item.showContentRuleList, index, true)"
        ></span>
      </div>
      <div class="custum_van-cell-group border_b">
        <span class="required c_f_shrink">几人成团</span>
        <div class="c_f_center">
          <van-field
            :border="false"
            class="needDisable"
            :class="[ceil.number ? 'obvious' : '']"
            v-model="ceil.number"
            type="digit"
            :readonly="edit"
            input-align="right"
            placeholder="请输入成团数量"
            :rules="[{ required: true, message: '请输入成团数量' }]"
            @blur="inputChange($event, index, 'number', true)"
          />
          <span>人</span>
        </div>
      </div>
      <div class="custum_van-cell-group border_b">
        <span class="required c_f_shrink">成团价格</span>
        <div class="c_f_center">
          <van-field
            :border="false"
            class="needDisable"
            :class="[ceil.price ? 'obvious' : '']"
            v-model="ceil.price"
            input-align="right"
            type="number"
            :readonly="edit"
            :formatter="$formatter"
            format-trigger="onBlur"
            placeholder="请输入成团价格"
            @blur="inputChange($event, index, 'price')"
            :rules="[{ required: true, message: '请输入成团价格' }]"
          />
          <span class="c_f_shrink">元/人</span>
        </div>
      </div>
    </van-cell-group>

    <div
      style="padding: 0 14px"
      v-if="
        !edit && item.showContentRuleList && item.showContentRuleList.length < 4
      "
    >
      <div
        class="common_btn"
        @click="operate('add', item.showContentRuleList)"
      >
        <span class="add mr8"></span>新增梯度
      </div>
    </div>

    <!-- <div class="titleItem">名额设置</div> -->

    <van-cell-group class="mt10 needDisable">
      <div class="custum_van-cell-group mt10">
        <span>活动名额</span>
        <van-radio-group
          v-model="item.placesLimit"
          direction="horizontal"
          :disabled="edit"
        >
          <van-radio :name="0"
            >不限<template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? checked : unchecked"
              /> </template
          ></van-radio>
          <van-radio :name="1" class="nomargin"
            >限额<template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? checked : unchecked"
              /> </template
          ></van-radio>
        </van-radio-group>
      </div>
      <van-field
        v-if="item.placesLimit == 1"
        v-model="item.places"
        label="限额"
        class="custom_required"
        type="digit"
        :readonly="edit"
        input-align="right"
        placeholder="请输入限额数量"
        :rules="[{ required: true, message: '请输入限额数量' }]"
      />
    </van-cell-group>
    <van-cell-group class="mt10 needDisable">
      <div class="custum_van-cell-group">
        <!-- <span>支付设置</span> -->
        <span
          class="myTip"
          @click.stop="
            $dialog
              .alert({
                title: '支付设置说明',
                message:
                  '预付：用户参与活动所需支付的定金，最小为0.01元，最大不可超过拼团价。\n付拼团价：用户参与活动直接支付商品全款，具体支付金额视商品活动价而定。梯度拼团商品仅支持预付。',
                showConfirmButton: false,
                messageAlign: 'left',
                closeOnClickOverlay: true,
                className: 'toastDialog',
              })
              .catch(() => {})
          "
          >支付设置</span
        >
        <van-radio-group
          v-model="item.paySet"
          direction="horizontal"
          :disabled="edit"
        >
          <van-radio :name="3"
            >预付<template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? checked : unchecked"
              /> </template
          ></van-radio>
          <van-radio
            :name="2"
            class="nomargin"
            :disabled="
              item.showContentRuleList && item.showContentRuleList.length > 1
            "
            >付拼团价<template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? checked : unchecked"
              /> </template
          ></van-radio>
        </van-radio-group>
      </div>
      <span class="inputErr"
        >(注：若拼团失败，金额将自动原路退回，无需线下退款。)</span
      >
      <van-field
        v-if="item.paySet == 3"
        v-model="item.prepaidAmount"
        label="预付金额"
        class="custom_required needDisable"
        type="number"
        :readonly="edit"
        :formatter="$formatter"
        format-trigger="onBlur"
        input-align="right"
        placeholder="请输入预付金额"
        :rules="[{ required: true, message: '请输入预付金额' }]"
      />
    </van-cell-group>
    <van-cell-group class="mt10 needDisable">
      <div class="custum_van-cell-group mt10">
        <!-- @click="!edit && (popupShow = !popupShow)" -->
        <!-- <span>老生参与限制</span> -->
        <span
          class="myTip"
          @click.stop="
            $dialog
              .alert({
                title: '参与限制说明',
                message: '老带新拼团专用，老生表示在读学员和历史学员。',
                showConfirmButton: false,
                messageAlign: 'left',
                closeOnClickOverlay: true,
                className: 'toastDialog',
              })
              .catch(() => {})
          "
          >老生只能开团不能参团</span
        >
        <!-- <div class="c_f_center">
          <span class="f15 fbold">{{
            item.limitItems == 1 ? "老生只能开团不能参团" : "不限制"
          }}</span>
          <van-icon name="arrow" />
        </div> -->
        <van-switch
          :disabled="edit"
          v-model="item.limitItems"
          active-color="#16C6C6"
          inactive-color="#E2E2E2"
          size="24px"
        />
      </div>
    </van-cell-group>
    <!-- <van-cell-group>
        <div class="custum_van-cell-group mt10">
          <span>虚拟成团</span>
          <van-switch
            v-model="item.virtualGroup"
            active-color="#16C6C6"
            inactive-color="#E2E2E2"
            size="24px"
          />
        </div>
      </van-cell-group> -->
    <!-- </van-form> -->
    <!-- <div
      class="operateFixed"
      v-if="item.showActivityCourseList && item.showActivityCourseList.length"
    >
      <div class="c_f_center">
        <span>共{{ item.showActivityCourseList.length }}个课程</span>
        <span
          >原价{{ item.showActivityCourseList | add("coursePrice") }}元</span
        >
      </div>
    </div> -->

    <van-popup closeable round v-model="popupShow" position="bottom">
      <div class="popupTitle">
        <span>参与限制</span>
      </div>
      <ul class="popup">
        <li
          v-for="(ceil, index) in limitItems"
          @click="
            item.limitItems = ceil.type;
            popupShow = !popupShow;
          "
          :key="index"
          :class="[item.limitItems == ceil.type ? 'active' : '']"
        >
          <span>{{ ceil.label }}</span
          ><var></var>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import moment from "moment";
import addCourse from "./addCourse";
export default {
  name: "Group",
  components: { addCourse },
  data() {
    return {
      // item: {},
      limitItems: [
        { label: "不限制", type: 0 },
        { label: "老生只能开团不能参团", type: 1 },
      ],
      types: [
        { name: "按课时报名", feeType: 0 },
        { name: "按期报名", feeType: 1 },
        { name: "按月报名", feeType: 2 },
      ],
      years: this.$getFrom2017(true, 8),
      key: "",
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
          courseName: "新版秀_按月课程",
          courseId: "11023",
          courseFromStatus: "0",
          courseStatus: "1",
          courseTypeName: "其他",
          courseTypeId: "13",
          chargeStandardId: "6678",
          auditionRecordTime: "30",
          taskStatus: "1",
          absentDeleteTimeStatus: "0",
          leaveDeleteTimeStatus: "0",
          warnTimeStatus: "1",
          courseType: "0",
          displayStatus: "1",
          reviewStatus: "1",
          annexStatus: "1",
          taskLookStatus: "0",
          color: "#F68657",
          courseGoodsRS: [],
          teachingMethod: 2,
          packages: [
            // {
            //   packagePrice: "50.00",
            //   chargeStandardId: "6678",
            //   packageTime: "22.00",
            //   giveTime: 22.0,
            //   packageId: "19073",
            //   packageStatus: "1",
            //   packageName: "普通课时",
            //   packageDate: "2020-12-29T16:19:43.000+0800",
            //   packageUnitPrice: 2.27,
            //   feeType: 0,
            //   validNum: 0,
            // },
            {
              packagePrice: "11.00",
              chargeStandardId: "6678",
              schoolTermId: 3134,
              packageTime: "11.00",
              giveTime: 11.0,
              packageId: "19074",
              packageStatus: "1",
              packageName: "寒假套餐",
              packageDate: "2020-12-29T16:19:43.000+0800",
              packageUnitPrice: 1.0,
              feeType: 1,
              validNum: 0,
            },
            {
              packagePrice: "1000.00",
              chargeStandardId: "6678",
              packageTime: "1.00",
              giveTime: 1.0,
              packageId: "19075",
              packageStatus: "1",
              packageName: "1个月",
              packageDate: "2020-12-29T16:19:43.000+0800",
              packageUnitPrice: 1000.0,
              feeType: 2,
              validNum: 0,
            },
            {
              packagePrice: "20000.00",
              chargeStandardId: "6678",
              packageTime: "2.00",
              giveTime: 2.0,
              packageId: "19076",
              packageStatus: "1",
              packageName: "2个月",
              packageDate: "2020-12-29T16:19:43.000+0800",
              packageUnitPrice: 10000.0,
              feeType: 2,
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
    item: {
      type: Object,
    },
    cs: {
      type: String | Number,
    },
    edit: {
      type: Boolean,
    },
  },
  // watch: {
  //   item: {
  //     // handler(newV,oldV) {
  //     //   if (this.edit) return;
  //     //   if (newV) {
  //     //     console.log(JSON.stringify(newV));
  //     //     console.log(JSON.stringify(oldV));
  //     //     this.$emit("itemChange", this.item);
  //     //   }
  //     // },
  //     // deep: true,
  //   },

  //   showData: {
  //     handler(newV, oldV) {
  //       console.log(111)
  //       if (newV) {
  //         console.log(JSON.stringify(newV));
  //         console.log(JSON.stringify(oldV));
  //         this.item = Object.assign({}, this.item, newV);
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  methods: {
    inputChange(e, index, key, fl) {
      let compare = this.item.showContentRuleList,
        val = e.target.value,
        mistake = false;

      if (fl) {
        compare.forEach((item, ind) => {
          if (index == 0) {
            if (item.number) {
              if (ind > index && item.number * 1 <= val) {
                // mistake = "低价格成团数量不能高于高价格成团";
                mistake = true;
              }
            }
          } else if (index == compare.length - 1) {
            if (item.number) {
              if (ind < index && item.number * 1 >= val) {
                // mistake = "高价格成团数量不能低于低价格成团";
                mistake = true;
              }
            }
          } else {
            if (item.number) {
              if (ind > index && item.number * 1 <= val) {
                // mistake = "高价格成团数量不能低于低价格成团";
                mistake = true;
              }
              if (ind < index && item.number * 1 >= val) {
                // mistake = "低价格成团数量不能高于高价格成团";
                mistake = true;
              }
            }
          }
        });
        mistake = mistake ? "下一梯度成团人数必须大于上一梯度人数" : "";
      } else {
        compare.forEach((item, ind) => {
          if (index == 0) {
            if (item.price) {
              if (ind > index && item.price * 1 >= val) {
                // mistake = "低人数成团金额不能低于高人数成团";
                mistake = true;
              }
            }
          } else if (index == compare.length - 1) {
            if (item.price) {
              if (ind < index && item.price * 1 <= val) {
                // mistake = "高人数成团金额不能高于低人数成团";
                mistake = true;
              }
            }
          } else {
            if (item.price) {
              if (ind > index && item.price * 1 >= val) {
                // mistake = "高人数成团金额不能高于低人数成团";
                mistake = true;
              }
              if (ind < index && item.price * 1 <= val) {
                // mistake = "低人数成团金额不能低于高人数成团";
                mistake = true;
              }
            }
          }
        });
        mistake = mistake ? "下一梯度成团价格必须小于上一梯度价格" : "";
      }
      if (mistake) {
        this.item.showContentRuleList[index][key] = "";
        return Toast(mistake);
      }
    },
    // next() {
    //   if (!this.item.showContentRuleList.length) {
    //     return Toast("请新增最少一个梯度");
    //   }
    //   if (this.cs == 2) {
    //     if (!this.item.showActivityCourseList.length) {
    //       return Toast("请新增课程");
    //     } else {
    //       let str = "";
    //       this.item.showActivityCourseList.map((item, index) => {
    //         if (
    //           !str &&
    //           item.feeType == 2 &&
    //           moment(item.endTime) < moment(item.beginTime)
    //         ) {
    //           str += "课程" + (index + 1) + "：课程结束时间不能小于开始时间";
    //         }
    //       });
    //       if (str) {
    //         return Toast(str);
    //       }
    //     }
    //   }
    //   if (
    //     this.item.paySet == 3 &&
    //     this.item.prepaidAmount * 1 >
    //       this.item.showContentRuleList[
    //         this.item.showContentRuleList.length - 1
    //       ].price *
    //         1
    //   ) {
    //     Toast("商品预付金额须小于等于最低梯度价");
    //     return;
    //   }
    //   localStorage.setItem("item", JSON.stringify(this.item));
    //   this.$router.go(-1);
    // },
    operate(type, data, val, val_) {
      switch (type) {
        case "del":
          if (data) {
            if (val_ && data.length == 1) {
              return Toast("最少存在一项");
            }
            data.splice(val, 1);
          }
          break;
        case "add":
          if (data) {
            data.push({});
            if (data.length > 1) {
              this.item.paySet = 3;
            }
          }
          break;
      }
    },
  },

  mounted() {
    console.log(this.item)
    // this.item = Object.assign({}, this.item, this.showData);
    this.yznReq("get", "api/oa/chargeStandard/listSchoolTerm", {
      pageType: 0,
    }).then((res) => {
      if (res.status == 200) {
        this.terms = res.context;
        this.terms.forEach((item) => {
          this.terms_[item.schoolTermId] = item.schoolTermName;
        });
      }
    });
  },
};
</script>

<style lang="less" scoped>
.del {
  display: inline-block;
  width: 15px;
  height: 16px;
  background: url("../../../assets/img/app/setting_del.png") no-repeat;
  background-size: contain;
}
ul.popup_ {
  li {
    > div {
      &.title {
        height: 50px;
        font-size: 18px;
        justify-content: center;
        align-items: center;

        span {
          font-weight: bold;
        }
      }
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
