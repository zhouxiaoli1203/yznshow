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
    <van-cell-group
      class="mt10"
      v-if="!edit || (edit && item.placesLimit == 0)"
    >
      <div class="custum_van-cell-group mt10 needDisable">
        <span>活动名额</span>
        <van-radio-group
          v-model="item.placesLimit"
          direction="horizontal"
          :disabled="edit && item.placesLimit == 0"
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
        class="needDisable custom_required"
        :readonly="edit"
        type="digit"
        input-align="right"
        placeholder="请输入限额数量"
        :rules="[{ required: true, message: '请输入限额数量' }]"
      />
    </van-cell-group>

    <van-cell-group class="mt10">
      <div class="custum_van-cell-group needDisable">
        <span>线上支付</span>
        <van-switch
          :disabled="edit"
          v-model="item.paySwitch"
          active-color="#16C6C6"
          inactive-color="#E2E2E2"
          size="24px"
        />
      </div>

      <div class="custum_van-cell-group needDisable" v-if="item.paySwitch">
        <span
          class="myTip"
          @click="
            $dialog
              .alert({
                title: '支付设置说明',
                message:
                  '线下支付：商品不需要线上进行付款，仅在活动中进行报名登记。\n预付：用户参与活动所需支付的定金，最小为0.01元，最大不可超过活动价。',
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
          <van-radio :name="1"
            >全额<template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? checked : unchecked"
              /> </template
          ></van-radio>
          <van-radio :name="3" class="nomargin"
            >预付款<template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? checked : unchecked"
              /> </template
          ></van-radio>
        </van-radio-group>
      </div>
      <div
        class="custum_van-cell-group border_b bgcfff needDisable"
        v-if="item.paySwitch"
      >
        <span class="required c_f_shrink">支付金额</span>
        <div class="c_f_center">
          <van-field
            v-if="item.paySwitch"
            v-model="item.prepaidAmount"
            class="custom_required needDisable"
            type="number"
            :readonly="edit"
            :formatter="$formatter"
            format-trigger="onBlur"
            input-align="right"
            placeholder="请输入金额"
            :rules="[{ required: true, message: '请输入金额' }]"
          />
          <span>元</span>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group class="mt10 needDisable">
      <div
        class="custum_van-cell-group"
        @click="!edit && (popupShow = !popupShow)"
      >
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
    <!-- </van-form> -->
    <van-popup closeable round v-model="popupShow" position="bottom">
      <div class="popupTitle">
        <span>新老生参与限制</span>
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
export default {
  name: "Leaflet",
  data() {
    return {
      limitItems: [
        { label: "不限制", type: 0 },
        { label: "仅允许新生参与活动", type: 1 },
        { label: "仅允许老生参与活动", type: 2 },
      ],
      popupShow: false,
      checked: require("../../../assets/img/app/checked.png"),
      unchecked: require("../../../assets/img/app/unchecked.png"),
    };
  },
  props: {
    item: {
      type: Object,
    },
    edit: {
      type: Boolean,
    },
  },
  // watch: {
  //   item: {
  //     handler(newV) {
  //       if (this.edit) return;
  //       if (newV) {
  //         this.$emit("itemChange", this.item);
  //       }
  //     },
  //     deep: true,
  //   },
  //   showData: {
  //     handler(newV) {
  //       if (newV) {
  //         this.item = Object.assign({}, this.item, newV);
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  methods: {
    next() {
      if (this.item.floorPrice * 1 >= this.item.originalPrice * 1) {
        Toast("商品活动价须小于原价");
        return;
      }
      if (
        this.item.paySet == 3 &&
        this.item.prepaidAmount * 1 > this.item.floorPrice * 1
      ) {
        Toast("商品预付金额须小于等于活动价");
        return;
      }
      localStorage.setItem("item", JSON.stringify(this.item));
      this.$router.go(-1);
    },
  },
  mounted() {
    // this.item = Object.assign({}, this.item, this.showData);
  },
};
</script>

<style lang="less" scoped>
/deep/.van-cell--required::before {
  line-height: 30px; /*no*/
}
</style>
