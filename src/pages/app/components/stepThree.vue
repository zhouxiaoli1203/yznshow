<template>
  <div>
    <van-form
      validate-first
      ref="form"
      @submit="next"
      error-message-align="right"
      :scroll-to-error="true"
      :show-error-message="false"
    >
      <van-cell-group>
        <div class="custum_van-cell-group needDisable">
          <!-- <span>开启分销</span> -->
          <span
            class="myTip"
            @click.stop="
              $dialog
                .alert({
                  title: '分销说明',
                  message:
                    '通过设置奖励说明，吸引老学员转发邀请新学员参与活动。',
                  showConfirmButton: false,
                  messageAlign: 'left',
                  closeOnClickOverlay: true,
                  className: 'toastDialog',
                })
                .catch(() => {})
            "
            >开启分销</span
          >
          <van-switch
            :disabled="acitivityParams.editType && acitivityParams.activityStatus != 0 "
            v-model="acitivityParams.distSwitch"
            active-color="#16C6C6"
            inactive-color="#E2E2E2"
            size="24px"
          />
        </div>
        <div class="custum_van-cell-group" style="height: auto; padding-top: 0">
          <span class="f13 l20" style="color: #bfbfbf"
            >开启分销后，系统会记录推荐人邀请了多少个新学员参与活动以及多少个被推荐学员最终完成报课</span
          >
        </div>

        <!-- <div
          class="custum_van-cell-group"
          @click="routerSkip('lib', acitivityParams.musicId, 2)"
          style="border-top: 1px solid #f8f8f8; height: 32px"
        >
          <span>分销功能使用攻略</span>
          <van-icon name="arrow" />
        </div> -->
      </van-cell-group>
      <!-- 活动展示 -->
      <add-content
        v-if="acitivityParams.distSwitch"
        :content="acitivityParams.distContent"
        @contentChange="change"
        @reUpload="reUpload"
        :isedit="false"
      />
    </van-form>
  </div>
</template>
<script>
import addContent from "../components/addContent";
import { Toast } from "vant";
export default {
  name: "stepThree",
  data() {
    return {
      reup: {},
    };
  },
  components: { addContent },
  props: {
    acitivityParams: {
      type: Object,
    },
  },
  watch: {},
  methods: {
    next() {
      console.log("通过");
    },
    change(val) {},
    reUpload(val) {
      this.reup = val;
    },
  },
};
</script>

<style scoped lang="less">
.contentWrap {
  padding: 0 14px 10px;
  margin-top: 10px;
  background-color: #fff;
  .contentTitle {
    .c_f_shrink {
      .c_f_center:nth-of-type(2) {
        margin-left: 10px;
      }
    }
    .titleInput {
      width: 200px;
      padding-left: 0;
      /deep/.van-field__value {
        background-color: #f0f0f0;
        border-radius: 4px;
        padding: 0 6px;
      }
    }
    widows: 100%;
    height: 40px;
    border-bottom: 1px solid #f8f8f8;
  }
  .content {
    .contentItem {
      .van-image {
        border: 1px solid #f0f0f0;
      }
      video {
        width: 100%;
        display: block;
      }
      margin-top: 10px;
      position: relative;
      .c_f_center {
        width: 52px;
        height: 28px;
        border: 1px solid #f0f0f0;
        border-bottom: none;
      }
      .contentTextarea {
        border: 1px solid #f0f0f0;
      }
    }
  }

  .down {
    transform: rotate(90deg);
    color: #13c2c2;
  }
  .up {
    transform: rotate(-90deg);
    color: #13c2c2;
  }

  .contentBtns {
    display: flex;
    flex-direction: row;
    > div {
      color: #595959;
      &:nth-of-type(1) {
        margin-right: 14px;
        span {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url("../../../assets/img/app/add_text.png") no-repeat;
          background-size: contain;
        }
      }
      &:nth-of-type(2) {
        position: relative;
        .myupload {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          /deep/.van-uploader__upload {
            width: 100%;
            height: 100%;
            margin: 0;
            height: 40px;
          }
        }
        span {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url("../../../assets/img/app/add_media.png") no-repeat;
          background-size: contain;
        }
      }
      flex: 1;
      height: 40px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
    }
  }
  .del {
    display: inline-block;
    width: 15px;
    height: 16px;
    background: url("../../../assets/img/app/setting_del.png") no-repeat;
    background-size: contain;
  }
}
</style>
