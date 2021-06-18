<template>
  <div>
    <div style="background-color: #fff; padding-bottom: 10px">
      <div class="activityTabs bt10">
        <div
          class="tab c_f_column_center"
          v-for="(item, index) in overviewList"
          :key="index"
          :class="[current == item.tab ? 'active' : '']"
          @click="operate('switch', item.tab)"
        >
          <span class="f15 fbold">{{ item.number }}</span>
          <span class="f12 mt8">{{ item.name }}</span>
        </div>
      </div>
      <div class="c_f_row timeSel">
        <div class="c_f_row">
          <van-field
            readonly
            v-model="screenTime"
            @click="calendarSHow = true"
            placeholder="日期区间"
          />
          <van-icon name="arrow" />
        </div>
        <div class="c_f_row">
          <van-field
            v-model="screenType.name"
            readonly
            @click="sheetShow = true"
            placeholder="类型"
          />
          <van-icon name="arrow" />
        </div>
      </div>
      <div
        id="myEchart"
        class="mt8"
        style="width: 100%; height: 300px; padding: 0 14px"
      ></div>
    </div>

    <div class="bt10 boxWrap" v-if="activityType == 2 && listEnroll.length">
      <div>课程报名情况</div>
      <template v-if="activityType == 1 || activityType == 2">
        <div class="box" v-for="(item, index) in listEnroll" :key="index">
          <p class="f15 fbold l24">{{ item.productName }}</p>
          <div class="c_f_between mt6">
            <span>{{ item.floorPrice | qf }}元/人</span>
            <span v-if="activityType == 2"></span>
            <span
              v-else
              class="tip c_f_center"
              :class="[item.paySet == 1 ? 'on' : '']"
              >{{
                activityType > 2
                  ? activityType == 3
                    ? "拼团价"
                    : activityType == 4
                    ? "结果价"
                    : "活动价"
                  : item.paySet == 1
                  ? "线下支付"
                  : "预付" + item.prepaidAmount + "元"
              }}</span
            >
          </div>
          <div class="division"></div>
          <p class="mt8 c1F1F1F">
            已报名
            <span class="cD45656"
              >{{ item.soldCopies
              }}{{ item.places !== undefined ? "/" + item.places : "" }}</span
            >
            人
          </p>
        </div>
      </template>
      <template v-else>
        <div class="box" v-for="(item, index) in listEnroll" :key="index">
          <p class="f15 fbold l24">{{ item.productName }}</p>
          <div class="division"></div>
          <p class="mt8 c1F1F1F">
            已报名
            <span class="cD45656"
              >{{ item.soldCopies
              }}{{ item.places !== undefined ? "/" + item.places : "" }}</span
            >
            人
          </p>
          <!-- 拼团 -->
          <template v-if="activityType == 3">
            <div
              v-for="(ceil, index) in item.showContentRuleList"
              :key="index"
              class="group"
            >
              <p>{{ ceil.number }}人成团</p>
              <div class="c_f_between">
                <span>{{ ceil.price | qf }} / 人</span>
                <span
                  class="tip c_f_center"
                  :class="[ceil.paySet == 1 ? 'on' : '']"
                  >{{
                    activityType > 2
                      ? activityType == 3
                        ? "拼团价"
                        : activityType == 4
                        ? "结果价"
                        : "活动价"
                      : ceil.paySet == 1
                      ? "线下支付"
                      : "预付" + ceil.prepaidAmount + "元"
                  }}</span
                >
              </div>
            </div>
          </template>
          <!-- 砍价 & 助力 -->
          <template v-if="activityType > 3">
            <div class="c_f_between">
              <div class="">
                <span>原价{{ item.originalPrice | qf }}元</span>
                <span>&nbsp;/&nbsp;</span>
                <span
                  >{{ activityType == 4 ? "砍价底价" : "活动价"
                  }}{{ item.floorPrice | qf }}元</span
                >
              </div>
              <span
                class="tip c_f_center"
                :class="[item.paySet == 1 ? 'on' : '']"
                >{{
                  activityType > 2
                    ? activityType == 3
                      ? "拼团价"
                      : activityType == 4
                      ? "结果价"
                      : "活动价"
                    : item.paySet == 1
                    ? "线下支付"
                    : "预付" + item.prepaidAmount + "元"
                }}</span
              >
            </div>
            <div v-if="activityType == 4">
              <span>砍价次数：{{ item.totalNum }}次</span>
              <!-- <span class="cut"> | </span>
              <span>自砍次数：{{ item.selfNum }}次</span>
              <span class="cut"> | </span>
              <span>帮砍次数：{{ item.helpNum }}次</span> -->
            </div>
            <div v-else>
              <span>助力成功数：{{ item.packagesNumber }}次</span>
              <span class="cut"> | </span>
              <span>单次助力数：{{ item.maxNumber }}次</span>
            </div>
          </template>
        </div>
      </template>
    </div>

    <van-calendar
      :minDate="minDate"
      :maxDate="maxDate"
      :default-date="currentDate"
      v-model="calendarSHow"
      type="range"
      color="#13c2c2"
      @confirm="timeConfirm"
    />
    <van-action-sheet
      v-model="sheetShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>
<script>
// import echarts from "echarts";
// 加载echarts，注意引入文件的路径
import echarts from "echarts/lib/echarts";
// import * as echarts from 'echarts/lib/echarts'
// 再引入你需要使用的图表类型，标题，提示信息等
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/dataZoom";

import { Toast } from "vant";
import moment from "moment";
export default {
  name: "dataDetail",
  data() {
    return {
      screenTime: "",
      screenType: { name: "按日", type: 0 },
      calendarSHow: false,
      sheetShow: false,
      actions: [
        { name: "按日", type: 0 },
        { name: "按周", type: 1 },
        // { name: "按月", type: 2 },
      ],
      current: 0,
      overviewList: [
        { name: "有效用户", tab: 0, number: 0, key: "totalUsers" },
        { name: "总浏览量", tab: 1, number: 0, key: "totalPV" },
        { name: "总访客", tab: 3, number: 0, key: "totalVisitors" },
        { name: "总分享", tab: 2, number: 0, key: "totalShares" },
      ],
      listEnroll: [],
      //
      //
      //
      datePickerShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2050, 1, 1),
      currentDate: [],
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
      checked: require("../../../assets/img/app/checked.png"),
      unchecked: require("../../../assets/img/app/unchecked.png"),
    };
  },
  props: {
    activityId: {
      type: String | Number,
    },
    activityType: {
      type: String | Number,
    },
    activity: {
      type: Object,
    },
  },
  watch: {
    showActivityCourseList: {
      handler(newV, oldV) {
        if (newV) {
          this.$emit("courseListChange", this.showActivityCourseList);
        }
      },
      deep: true,
    },
  },
  methods: {
    timeConfirm(date) {
      this.calendarSHow = false;
      this.screenTime =
        moment(date[0]).format("YYYY-MM-DD") +
        " 至 " +
        moment(date[1]).format("YYYY-MM-DD");
      this.currentDate = [new Date(date[0]), new Date(date[1])];
      this.getChartData();
    },
    onSelect(a) {
      this.screenType = a;
      this.getChartData();
    },
    operate(type, data, val, val_) {
      switch (type) {
        case "switch":
          this.current = data;
          this.getChartData();
          break;
      }
    },
    theTimeMd(thedate) {
      return moment(thedate).format("MM") + "." + moment(thedate).format("D");
    },
    theTimeMC(thedate) {
      return moment(thedate).format("MM") * 1 + "月";
    },
    echartInit(data) {
      console.log(data);
      let myEchart = echarts.init(document.getElementById("myEchart"));
      let options = {
        backgroundColor: "#F8F8F8",
        color: ["#0BB4B4"],
        title: {
          textStyle: {
            color: "#595959",
            fontSize: 11,
            fontWeight: "normal",
          },
          text: "数量",
          padding: [
            10, // 上
            0, // 右
            10, // 下
            10, // 左
          ],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            label: {
              backgroundColor: "#283b56",
            },
          },
          textStyle: {
            align: "left",
          },
          extraCssText: "z-index: 9",
          confine: true,
        },
        grid: {
          top: "40",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: data.dataAxis,
          axisLine: {
            lineStyle: { color: "#f0f0f0" },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#595959",
              fontSize: 12,
            },
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLine: {
            lineStyle: { color: "#f0f0f0" },
          },
          // 分割线
          splitLine: {
            lineStyle: { color: "#f0f0f0" },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#595959",
              fontSize: 12,
            },
          },
        },
        series: [
          {
            data: data.dataseries,
            type: "bar",
            barMaxWidth: "40",
            itemStyle: {
              color: "#0BB4B4",
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
        dataZoom: {
          type: "inside",
          filterMode: "filter",
          startValue: 0,
          endValue: 10,
          xAxisIndex: [0],
          zoomLock: true,
          moveOnMouseMove: true,
          preventDefaultMouseMove: false,
          zoomOnMouseWheel: false,
          rangeMode: "value",
        },
      };
      // 按周旋转X轴
      if (this.screenType.type == 1) {
        options.xAxis.axisLabel.rotate = 45;
      }
      //清空画布
      myEchart.clear();
      // 绘制图表
      myEchart.setOption(options);
    },
    // 表格数据
    getChartData() {
      this.yznReq("get", "api/oa/show/overviewByDate", {
        activityId: this.activityId,
        beginTime: this.screenTime.split(" 至 ")[0] + " 00:00:00",
        endTime: this.screenTime.split(" 至 ")[1] + " 23:59:59",
        timeType: this.screenType.type,
        type: this.current,
      }).then((res) => {
        if (res.status == 200) {
          let chartData = {
              dataAxis: [],
              dataseries: [],
            },
            data = res.context;
          data.forEach((item, index) => {
            // item.num = index * 10;
            switch (this.screenType.type * 1) {
              case 0:
                chartData.dataAxis.push(moment(item.date).format("M.D"));
                break;
              case 1:
                chartData.dataAxis.push(
                  this.theTimeMd(item.weekBeginDate) +
                    "-" +
                    this.theTimeMd(item.weekEndDate)
                );
                break;
              case 2:
                chartData.dataAxis.push(this.theTimeMC(item.date));
                break;
              default:
                break;
            }
            chartData.dataseries.push(item.num);
          });
          this.echartInit(chartData);
        }
      });
    },
    //报课情况
    getlistEnroll() {
      this.yznReq("get", "api/oa/show/listEnroll", {
        activityId: this.activityId,
      }).then((res) => {
        if (res.status == 200) {
          this.listEnroll = res.context;
        }
      });
    },
  },
  mounted() {
    this.screenTime =
      moment(this.activity.beginTime).format("YYYY-MM-DD") +
      " 至 " +
      moment(
        moment(this.activity.endTime) > moment(new Date())
          ? new Date()
          : this.activity.endTime
      ).format("YYYY-MM-DD");
    this.currentDate = [
      new Date(this.screenTime.split(" 至 ")[0]),
      new Date(this.screenTime.split(" 至 ")[1]),
    ];
    // 概览数据
    this.yznReq("get", "api/oa/show/overview", {
      activityId: this.activityId,
    }).then((res) => {
      if (res.status == 200) {
        this.overviewList.map((item) => {
          item["number"] = res.context[item.key];
        });
      }
    });
    this.getChartData();
    this.getlistEnroll();
  },
};
</script>

<style  lang="less" scoped>
.division {
  width: 100%;
  height: 0;
  border-top: 1px dashed #f0f0f0;
  margin-top: 6px;
}
.boxWrap {
  padding: 14px 10px;
  background-color: #fff;
  .box {
    line-height: 22px;
    margin-top: 10px;
    padding: 10px 10px;
    box-shadow: 0 0 4px 2px #f0f0f0;
    border-radius: 2px;
    color: #595959;
    .cut {
      margin: 0 5px;
    }
    .c1F1F1F {
      color: #1f1f1f;
    }
    .cD45656 {
      color: #d45656;
    }
    .group {
      border: 1px solid #c9f1f1;
      border-radius: 2px;
      height: 65px;
      padding: 8px 12px;
      margin-top: 10px;
    }
    .warn {
      color: #ff9537;
      background-color: #fff7ef;
      border: #ff9537;
      border-radius: 4px;
      padding: 0 4px;
      height: 18px;
      font-size: 12px;
    }
    .tip {
      color: #ff9537;
      background-color: #fff7ef;
      border: 1px solid #ff9537;
      border-radius: 4px;
      padding: 0 4px;
      height: 18px;
      font-size: 12px;
      &.on {
        color: #13c2c2;
        background-color: #ecffff;
        border: 1px solid #13c2c2;
      }
    }
  }
}
.timeSel {
  margin-top: 16px;
  padding-left: 14px;
  > .c_f_row {
    border: 1px solid #f0f0f0;
    position: relative;
    height: 34px;
    overflow: hidden;
    .van-cell {
      font-size: 12px !important;
    }
    .van-icon-arrow {
      position: absolute;
      top: 0;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
    }
    &:nth-of-type(1) {
      width: 202px;
      margin-right: 16px;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
  }
}
.activityTabs {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border-bottom: 1px solid #f8f8f8;
  .tab {
    &.active {
      color: #13c2c2;
    }
    &.active:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      width: 65px;
      height: 8px;
      background: url("../../../assets/img/app/setting_tip.png") no-repeat;
      background-size: contain;
    }
    flex: 1;
    position: relative;
    font-size: 15px;
    height: 69px;
    background-color: #fff;
    padding: 0 20px;
  }
}
</style>
