<template>
  <div style="padding-bottom: 35px">
    <van-form
      class="ofauto"
      validate-first
      ref="form"
      @submit="next"
      error-message-align="right"
      :scroll-to-error="true"
      :show-error-message="false"
      v-if="cstype == 2"
    >
      <van-field
        v-model="item.productName"
        class="mt10 custom_required"
        :label="cstype == 2 ? '课包名称' : '商品名称'"
        maxlength="20"
        input-align="right"
        :placeholder="cstype == 2 ? '请输入课包名称' : '请输入商品名称'"
        :rules="[
          {
            required: true,
            message: cstype == 2 ? '请输入课包名称' : '请输入商品名称',
          },
        ]"
      />
      <div class="titleItem" style="margin-bottom: -10px;">课程设置</div>
      <template v-if="cstype == 2">
        <add-course
          :showActivityCourseList="item.showActivityCourseList"
          @courseListChange="change"
        ></add-course>
      </template>

      <van-cell-group>
        <van-field
          v-model="item.floorPrice"
          label="活动价"
          class="custom_required mt10"
          :class="[item.floorPrice ? 'obvious' : '']"
          type="number"
          :formatter="$formatter"
          format-trigger="onBlur"
          input-align="right"
          placeholder="请输入活动价"
          :rules="[
            {
              required: true,
              pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/,
              message: '请输入活动价',
            },
          ]"
        />
      </van-cell-group>

      <div class="titleItem">名额设置</div>

      <van-cell-group>
        <div class="custum_van-cell-group nb">
          <span>活动名额</span>
          <van-radio-group v-model="item.placesLimit" direction="horizontal">
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
          :class="[item.places ? 'obvious' : '']"
          label="限额"
          class="custom_required"
          type="digit"
          input-align="right"
          placeholder="请输入限额数量"
          :rules="[{ required: true, message: '请输入限额数量' }]"
        />
      </van-cell-group>
      <div
        class="operateFixed"
        v-if="item.showActivityCourseList && item.showActivityCourseList.length"
      >
        <div class="c_f_center">
          <span>共{{ item.showActivityCourseList.length }}个课程</span>
          <span
            >原价{{ item.showActivityCourseList | add("coursePrice") }}元</span
          >
        </div>
      </div>
    </van-form>
    <van-form
      class="ofauto"
      validate-first
      ref="form"
      @submit="next"
      error-message-align="right"
      :scroll-to-error="true"
      :show-error-message="false"
      v-else
    >
      <van-field
        v-model="item.productName"
        label="商品名称"
        class="mt10 custom_required"
        input-align="right"
        maxlength="20"
        placeholder="请输入商品名称"
        :rules="[{ required: true, message: '请输入商品名称' }]"
      />
      <div class="custum_van-cell-group needDisable" style="height: 34px">
        <span class="required">商品描述</span>
      </div>
      <van-field
        v-model="item.productDesc"
        type="textarea"
        class="custom_required pt0"
        rows="2"
        autosize
        show-word-limit
        maxlength="200"
        input-align="left"
        placeholder="请输入商品描述"
        :rules="[{ required: true, message: '请输入商品描述' }]"
      />
      <van-cell-group class="mt10">
        <van-field
          v-model="item.originalPrice"
          label="原价"
          class="custom_required"
          type="number"
          :formatter="$formatter"
          format-trigger="onBlur"
          input-align="right"
          placeholder="请输入原价"
          :rules="[
            {
              required: true,
              message: '请输入原价',
            },
          ]"
        />
        <van-field
          v-model="item.floorPrice"
          label="活动价"
          class="custom_required"
          type="number"
          :formatter="$formatter"
          format-trigger="onBlur"
          input-align="right"
          placeholder="请输入活动价"
          :rules="[
            {
              required: true,
              message: '请输入活动价',
            },
          ]"
        />
      </van-cell-group>

      <van-cell-group class="mt10">
        <div class="custum_van-cell-group mt10">
          <span>活动名额</span>
          <van-radio-group v-model="item.placesLimit" direction="horizontal">
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
          input-align="right"
          placeholder="请输入限额数量"
          :rules="[{ required: true, message: '请输入限额数量' }]"
        />
      </van-cell-group>
    </van-form>
    <van-cell-group class="mt10">
      <div class="custum_van-cell-group mt10" @click="popupShow = true">
        <!-- <span>新老生参与限制</span> -->
        <span
          class="myTip"
          @click.stop="
            $dialog
              .alert({
                title: '参与限制说明',
                message:
                  '新生表示从未在机构报读过的学员，老生表示在读学员和历史学员。',
                showConfirmButton: false,
                messageAlign: 'left',
                closeOnClickOverlay: true,
                className: 'toastDialog',
              })
              .catch(() => {})
          "
          >新老生参与限制</span
        >
        <div class="c_f_center">
          <span class="f15 fbold">{{
            item.limitItems == 1
              ? "仅允许新生参与活动"
              : item.limitItems == 2
              ? "仅允许老生参与活动"
              : "不限制"
          }}</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </van-cell-group>
    <!-- 弹出层 -->
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
  name: "Rubbuy",
  components: { addCourse },
  data() {
    return {
      item: {},
      cstype: "",
      limitItems: [
        { label: "不限制", type: 0 },
        { label: "仅允许新生参与活动", type: 1 },
        { label: "仅允许老生参与活动", type: 2 },
      ],
      key: "",
      popupShow: false,
      checked: require("../../../assets/img/app/checked.png"),
      unchecked: require("../../../assets/img/app/unchecked.png"),
    };
  },
  props: {
    showData: {
      type: Object,
    },
    cs: {
      type: String,
    },
  },
  methods: {
    change(val) {
      console.log(val);
    },
    next() {
      console.log(this.item);
      if (this.cstype == 2) {
        if (!this.item.showActivityCourseList.length) {
          return Toast("请新增课程");
        } else {
          let str = "",
            totalPrice = 0;
          this.item.showActivityCourseList.forEach((item, index) => {
            totalPrice += (item["coursePrice"] ? item["coursePrice"] : 0) * 1;
            if (
              !str &&
              item.feeType == 2 &&
              moment(item.endTime) < moment(item.beginTime)
            ) {
              str += "课程" + (index + 1) + "：课程结束时间不能小于开始时间";
            }
          });
          if (str) {
            return Toast(str);
          }
          if (this.item.floorPrice * 1 >= totalPrice) {
            return Toast("课包总价不能小于活动价");
          }
        }
      } else {
        if (this.item.floorPrice * 1 >= this.item.originalPrice * 1) {
          Toast("商品活动价须小于原价");
          return;
        }
      }
      localStorage.setItem("item", JSON.stringify(this.item));
      this.$router.go(-1);
    },
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
      }
    },
  },
  mounted() {
    this.item = Object.assign({}, this.showData, this.item);
    this.cstype = this.cs;
    console.log(this.cs);
    console.log(this.showData);
    console.log(this.item);
  },
};
</script>

<style lang="less" scoped>
.titleItem {
  font-size: 15px;
  font-weight: bold;
  padding: 18px 14px 6px;
}
.van-popup--bottom {
  height: auto !important;
  max-height: 500px !important;
  min-height: 30%;
}
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
