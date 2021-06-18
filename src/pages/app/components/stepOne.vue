<template>
  <div
    :style="{
      'padding-bottom':
        (acitivityParams.activityType > 3 && acitivityParams.contentType == 2
          ? 35
          : 0) + 'px',
    }"
  >
    <van-form
      validate-first
      ref="form"
      @submit="next"
      error-message-align="right"
      :scroll-to-error="true"
      :show-error-message="false"
    >
      <!-- 活动名称,开始、结束、截止时间 -->
      <van-cell-group class="mt10">
        <van-field
          v-model="acitivityParams.activityName"
          label="活动名称"
          class="custom_required"
          clearable
          maxlength="25"
          input-align="right"
          placeholder="请输入活动名称"
          @blur="acitivityParams.shareTitle = acitivityParams.activityName"
          :rules="[{ required: true, message: '活动名称不能为空' }]"
        />
        <van-field
          v-model="acitivityParams.beginTime"
          label="开始时间"
          class="custom_required needDisable"
          readonly
          clickable
          input-align="right"
          placeholder="请选择开始时间"
          :rules="[{ required: true }]"
          @click="timeSel('beginTime')"
        />
        <van-field
          v-model="acitivityParams.endTime"
          label="结束时间"
          class="custom_required"
          readonly
          clickable
          @click="timeSel('endTime')"
          input-align="right"
          placeholder="请选择结束时间"
          :rules="[{ required: true }]"
        />
      </van-cell-group>
      <!-- 编辑状态名额限制字段前移 窒息操作 -->
      <!-- 抢购 拼团 根据源数据中showContentList的 placesLimit状态来是否显示 places  -->
      <template v-if="acitivityParams.isedit">
        <div
          v-for="(x, index) in acitivityParams[
            'content_' + acitivityParams.contentType
          ]"
          :key="'places_' + index"
          class="mt10"
        >
          <template v-if="x.placesLimit_ == 1">
            <div class="titleItem" v-if="acitivityParams.activityType == 2">
              {{ x.productName }}
            </div>
            <van-cell-group>
              <div class="custum_van-cell-group">
                <span>活动名额</span>
                <van-radio-group v-model="x.placesLimit" direction="horizontal">
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
              <van-cell-group class="maxLabel" v-if="x.placesLimit == 1">
                <div class="custum_van-cell-group border_b">
                  <span class="required c_f_shrink">限额</span>
                  <div class="numDiv c_f_center">
                    <div
                      class="minus c_f_center"
                      :class="[x.places > x.places_ ? '' : 'dis']"
                      @click="x.places > x.places_ && x.places--"
                    >
                      <van-icon name="minus" />
                    </div>
                    <van-field
                      v-model="x.places"
                      @blur="editLimitNum($event, x, 'places')"
                      input-align="center"
                      type="digit"
                      :rules="[{ required: true, message: '请输入限制数量' }]"
                    />
                    <div class="plus c_f_center" @click="x.places++">
                      <van-icon name="plus" />
                    </div>
                  </div>
                </div>
              </van-cell-group>
            </van-cell-group>
          </template>
        </div>
      </template>
      <!-- 砍价助力 根据源数据中 'showContentList[0]' 的placesLimit状态来是否显示 places 单独+-操作  -->
      <!-- <template
        v-if="
          acitivityParams.activityType > 3 &&
          acitivityParams.isedit &&
          acitivityParams['content_' + acitivityParams.contentType][0]
            .placesLimit_ == 1
        "
      >
        <div class="titleItem">名额设置</div>
        <van-cell-group>
          <div class="custum_van-cell-group">
            <span>活动名额</span>
            <van-radio-group
              v-model="
                acitivityParams['content_' + acitivityParams.contentType][0]
                  .placesLimit
              "
              direction="horizontal"
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
          <van-cell-group
            class="maxLabel"
            v-if="
              acitivityParams['content_' + acitivityParams.contentType][0]
                .placesLimit == 1
            "
          >
            <div class="custum_van-cell-group border_b">
              <span class="required c_f_shrink">限额</span>
              <div class="numDiv c_f_center">
                <div
                  class="minus c_f_center"
                  :class="[
                    acitivityParams['content_' + acitivityParams.contentType][0]
                      .places >
                    acitivityParams['content_' + acitivityParams.contentType][0]
                      .places_
                      ? ''
                      : 'dis',
                  ]"
                  @click="
                    acitivityParams['content_' + acitivityParams.contentType][0]
                      .places >
                      acitivityParams[
                        'content_' + acitivityParams.contentType
                      ][0].places_ &&
                      acitivityParams[
                        'content_' + acitivityParams.contentType
                      ][0].places--
                  "
                >
                  <van-icon name="minus" />
                </div>
                <van-field
                  v-model="
                    acitivityParams['content_' + acitivityParams.contentType][0]
                      .places
                  "
                  @blur="
                    editLimitNum(
                      $event,
                      acitivityParams[
                        'content_' + acitivityParams.contentType
                      ][0],
                      'places'
                    )
                  "
                  input-align="center"
                  type="digit"
                  :rules="[{ required: true, message: '请输入限制数量' }]"
                />
                <div
                  class="plus c_f_center"
                  @click="
                    acitivityParams['content_' + acitivityParams.contentType][0]
                      .places++
                  "
                >
                  <van-icon name="plus" />
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-cell-group>
      </template> -->
      <!-- 编辑提醒warn文案 -->
      <div class="editWarn" v-if="acitivityParams.isedit">
        由于活动已发布，以下内容不可修改
      </div>
      <div
        class="titleItem myTip"
        @click="
          $dialog
            .alert({
              title: '活动类型说明',
              message:
                '微传单：可用于日常活动报名登记，支持开启线上支付。\n抢购：允许多个商品同时售卖的活动，抢购活动商品必须线上支付全款。\n拼团：由多人一起拼单购买的团购活动，支持多梯度拼团，仅支持单个商品。\n砍价：通过转发，他人帮助砍价来降低参与价格的活动，仅支持单个商品。\n助力：通过转发，他人帮助助力来达成固定目标的活动，仅支持单个商品。',
              showConfirmButton: false,
              messageAlign: 'left',
              closeOnClickOverlay: true,
              className: 'toastDialog',
            })
            .catch(() => {})
        "
      >
        活动类型
      </div>
      <!-- 活动类型切换 -->
      <div
        class="activityTabs"
        :class="[
          acitivityParams.editType && acitivityParams.activityStatus != 0
            ? 'needDisable'
            : '',
        ]"
      >
        <div
          class="tab"
          v-for="(item, index) in types"
          :key="index"
          :class="[
            acitivityParams.activityType == item.type ? 'active' : '',
            acitivityParams.editType && acitivityParams.activityStatus != 0
              ? 'active_disable'
              : '',
          ]"
          @click="operate('switch', item.type)"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- 自定义/课包切换 -->
      <van-cell-group v-if="acitivityParams.activityType != 1">
        <div class="custum_van-cell-group needDisable">
          <span>活动内容</span>
          <van-radio-group
            v-model="acitivityParams.contentType"
            direction="horizontal"
            :disabled="acitivityParams.isedit"
          >
            <van-radio :name="1"
              >自定义<template #icon="props">
                <img
                  class="img-icon"
                  :src="props.checked ? checked : unchecked"
                /> </template
            ></van-radio>
            <van-radio :name="2" class="nomargin"
              >课程<template #icon="props">
                <img
                  class="img-icon"
                  :src="props.checked ? checked : unchecked"
                /> </template
            ></van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <!-- 活动内容-微传单 -->
      <template
        v-if="acitivityParams.dataBack && acitivityParams.activityType == 1"
      >
        <Leaflet
          :item="acitivityParams['content_1'][0]"
          :edit="acitivityParams.isedit"
        />
      </template>
      <!-- 活动内容-抢购 -->
      <template v-if="acitivityParams.activityType == 2">
        <!-- 课包形式 -->
        <div class="boxWrap" v-if="acitivityParams.contentType == 2">
          <div
            v-for="(item, index) in acitivityParams[
              'content_' + acitivityParams.contentType
            ]"
            :key="index"
            class="box needDisable"
          >
            <div class="boxTitle c_f_between">
              <span>课包{{ index + 1 }}</span>
              <div class="c_f_row needNone">
                <span
                  @click="
                    operate(
                      'del',
                      acitivityParams['content_' + acitivityParams.contentType],
                      index,
                      true
                    )
                  "
                ></span>
                <span
                  @click="goFactory(2, '编辑课包' + (index + 1), item, index)"
                ></span>
              </div>
            </div>

            <p class="name">{{ item.productName }}</p>

            <div
              class="c_f_row limit mt6"
              v-if="item.placesLimit == 1 || item.limitItems != 0"
            >
              <span v-if="item.placesLimit == 1"
                >名额仅限{{ item.places }}人</span
              >
              <span v-if="item.limitItems == 1"
                >仅允许未签约的学员参与活动</span
              >
              <span v-if="item.limitItems == 2"
                >仅允许已签约的学员参与活动</span
              >
            </div>
            <!-- 课包内容 -->
            <div
              v-for="(ceil, index_) in item.showActivityCourseList"
              :key="index_"
              class="coursePkg"
            >
              <div class="c_f_between">
                <span class="obvious">{{ ceil.courseName }}</span>
                <span class="feeTip c_f_center">{{
                  ceil.feeType == 1
                    ? "按期"
                    : ceil.feeType == 2
                    ? "按月"
                    : "课时"
                }}</span>
              </div>
              <div v-if="ceil.packageId">{{ ceil.packageName }}</div>
              <div v-if="ceil.feeType == 1">
                {{ `${ceil.schoolYear + "年" + ceil.schoolTermId}` }}
              </div>
              <div v-if="ceil.feeType != 2">
                <span>{{ `${"购" + ceil.buyTime + "课时"}` }}</span>
                <template v-if="ceil.giveTime && ceil.giveTime != 0">
                  <span class="giveTip c_f_center">赠</span>
                  <span class="redText">{{ ceil.giveTime }}课时</span>
                </template>
              </div>
              <div v-if="ceil.feeType == 2">
                <span
                  >{{ moment(ceil.beginTime).format("YYYY/MM/DD") }} 至
                  {{ moment(ceil.endTime).format("YYYY/MM/DD") }}</span
                >
                <template v-if="ceil.giveTime && ceil.giveTime != 0">
                  <span class="giveTip c_f_center">赠</span>
                  <span class="redText">{{ ceil.giveTime }}天</span>
                </template>
              </div>
              <div>原价{{ ceil.coursePrice | qf }}</div>
            </div>

            <div class="c_f_center f13 mt15">
              <div>
                共<span class="redText">{{
                  item.showActivityCourseList.length
                }}</span
                >门课程
              </div>
              <span class="cut">|</span>
              <div>
                总价<span class="redText">{{
                  item.showActivityCourseList | add("coursePrice") | qf
                }}</span
                >元
              </div>
              <span class="cut">|</span>
              <div>
                活动价<span class="redText">{{ item.floorPrice | qf }}</span
                >元
              </div>
            </div>
          </div>
          <div
            class="common_btn mt10"
            v-if="!acitivityParams.isedit"
            @click="goFactory(2, '新增抢购课程')"
          >
            <span class="add mr8"></span>新增抢购课包
          </div>
        </div>
        <!-- 自定义 -->
        <div class="boxWrap" v-else>
          <div
            v-for="(item, index) in acitivityParams[
              'content_' + acitivityParams.contentType
            ]"
            :key="index"
            class="box needDisable"
          >
            <div class="boxTitle c_f_between">
              <span>自定义{{ index + 1 }}</span>
              <div class="c_f_row needNone">
                <span
                  @click="
                    operate(
                      'del',
                      acitivityParams['content_' + acitivityParams.contentType],
                      index,
                      true
                    )
                  "
                ></span>
                <span
                  @click="goFactory(2, '编辑自定义' + (index + 1), item, index)"
                ></span>
              </div>
            </div>
            <p class="name">{{ item.productName }}</p>
            <p class="desc">{{ item.productDesc }}</p>
            <div class="division"></div>
            <div class="c_f_row mt10">
              <span class="redText mr10"
                >活动价{{ item.floorPrice | qf }}元</span
              >
              <span class="throughText mr10"
                >原价{{ item.originalPrice | qf }}元</span
              >
              <span class="redText" v-if="item.paySet == 3"
                >预付{{ item.prepaidAmount | qf }}元</span
              >
            </div>
            <div
              class="c_f_row limit mt6"
              v-if="item.placesLimit == 1 || item.limitItems != 0"
            >
              <span v-if="item.placesLimit == 1">限额{{ item.places }}人</span>
              <span v-if="item.limitItems == 1"
                >仅允许未签约的学员参与活动</span
              >
              <span v-if="item.limitItems == 2"
                >仅允许已签约的学员参与活动</span
              >
            </div>
          </div>
          <div
            v-if="!acitivityParams.isedit"
            class="common_btn mt10"
            @click="goFactory(2, '新增抢购自定义项')"
          >
            <span class="add mr8"></span>新增抢购自定义项
          </div>
        </div>
      </template>
      <!-- 活动内容-拼团 -->
      <template
        v-if="acitivityParams.dataBack && acitivityParams.activityType == 3"
      >
        <!-- <Group
          :showData="
            acitivityParams[`content_${acitivityParams.contentType}`][0]
          "
          :edit="acitivityParams.isedit"
          :cs="acitivityParams.contentType"
          @itemChange="
            (val) => {
              acitivityParams[
                `content_${acitivityParams.contentType}`
              ][0] = val;
            }
          "
        /> -->
        <Group
          :item="acitivityParams[`content_${acitivityParams.contentType}`][0]"
          :edit="acitivityParams.isedit"
          :cs="acitivityParams.contentType"
        />
        <div class="boxWrap" v-if="false">
          <div
            v-for="(item, index) in acitivityParams[
              'content_' + acitivityParams.contentType
            ]"
            :key="'content_' + index"
            class="box needDisable"
          >
            <div class="boxTitle c_f_between">
              <span
                >{{ acitivityParams.contentType == 1 ? "自定义" : "课包"
                }}{{ index + 1 }}</span
              >
              <div class="c_f_row needNone">
                <span
                  @click="
                    operate(
                      'del',
                      acitivityParams['content_' + acitivityParams.contentType],
                      index,
                      true
                    )
                  "
                ></span>
                <span
                  @click="goFactory(3, '编辑课包' + (index + 1), item, index)"
                ></span>
              </div>
            </div>
            <p class="name">{{ item.productName }}</p>
            <p v-if="acitivityParams.contentType != 2" class="desc">
              {{ item.productDesc }}
            </p>
            <div
              class="c_f_row limit mt6"
              v-if="item.placesLimit == 1 || item.limitItems != 0"
            >
              <span v-if="item.placesLimit == 1"
                >名额仅限{{ item.places }}人</span
              >
              <span v-if="item.limitItems == 1"
                >已签约学员只能开团不能参团</span
              >
              <span v-if="item.limitItems == 2"
                >已有潜客、已签约学员只能开团不能参团</span
              >
            </div>
            <!-- 课包课程 -->
            <template v-if="acitivityParams.contentType == 2">
              <div
                v-for="(ceil, index) in item.showActivityCourseList"
                :key="'showActivityCourseList' + index"
                class="coursePkg"
              >
                <div class="c_f_between">
                  <span class="obvious">{{ ceil.courseName }}</span>
                  <span class="feeTip c_f_center">{{
                    ceil.feeType == 1
                      ? "按期"
                      : ceil.feeType == 2
                      ? "按月"
                      : "课时"
                  }}</span>
                </div>
                <div v-if="ceil.packageId">{{ ceil.packageName }}</div>

                <div v-if="ceil.feeType == 1">
                  {{ `${ceil.schoolYear + "年" + ceil.schoolTermId}` }}
                </div>
                <div v-if="ceil.feeType != 2">
                  <span>{{ `${"购" + ceil.buyTime + "课时"}` }}</span>
                  <template v-if="ceil.giveTime && ceil.giveTime != 0">
                    <span class="giveTip c_f_center">赠</span>
                    <span class="redText">{{ ceil.giveTime }}课时</span>
                  </template>
                </div>
                <div v-if="ceil.feeType == 2">
                  <span
                    >{{ moment(ceil.beginTime).format("YYYY/MM/DD") }} 至
                    {{ moment(ceil.endTime).format("YYYY/MM/DD") }}</span
                  >
                  <template v-if="ceil.giveTime && ceil.giveTime != 0">
                    <span class="giveTip c_f_center">赠</span>
                    <span class="redText">{{ ceil.giveTime }}天</span>
                  </template>
                </div>
                <div>原价{{ ceil.coursePrice | qf }}</div>
              </div>
            </template>

            <div class="mt8" v-if="acitivityParams.contentType == 2">
              原价总价
              {{ item.showActivityCourseList | add("coursePrice") | qf }}元
            </div>
            <div class="mt8" v-else>原价{{ item.originalPrice | qf }}元</div>

            <!-- 梯度 -->
            <div class="division"></div>
            <div
              class="c_f_between grads"
              v-for="(pice, index) in item.showContentRuleList"
              :key="'showContentRuleList' + index"
            >
              <div class="c_f_row">
                <span>团</span>
                <span class="c595959 f17 fbold">{{ pice.number }}人成团</span>
              </div>
              <span class="c595959 f17 fbold">{{ pice.price | qf }}元/人</span>
            </div>
            <div class="mt8">
              <span>支付设置：</span
              ><span class="redText" v-if="item.paySet == 3"
                >预付{{ item.prepaidAmount | qf }}元</span
              >
              <span class="redText" v-else>付拼团价</span>
            </div>
          </div>
          <div
            v-if="!acitivityParams.isedit"
            class="common_btn mt10"
            @click="
              goFactory(
                3,
                acitivityParams.contentType == 2
                  ? '新增拼团课程'
                  : '新增拼团自定义项'
              )
            "
          >
            <span class="add mr8"></span
            >{{
              acitivityParams.contentType == 2
                ? "新增拼团课包"
                : "新增自定义拼团"
            }}
          </div>
        </div>
      </template>
      <!-- 活动内容-砍价 -->
      <template v-if="acitivityParams.activityType == 4">
        <div
          v-for="(item, index) in acitivityParams[
            'content_' + acitivityParams.contentType
          ]"
          :key="index"
        >
          <div class="titleItem">
            {{ acitivityParams.contentType == 2 ? "课包设置" : "自定义设置" }}
          </div>
          <template v-if="acitivityParams.contentType == 2">
            <van-field
              label-width="auto"
              v-model="item.productName"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              label="课包名称"
              maxlength="20"
              input-align="right"
              placeholder="请输入课包名称"
              :rules="[{ required: true, message: '请输入课包名称' }]"
            />
            <add-course
              :showActivityCourseList="item.showActivityCourseList"
              :isedit="acitivityParams.isedit"
            ></add-course>
            <div
              class="operateFixed"
              v-if="
                item.showActivityCourseList &&
                item.showActivityCourseList.length
              "
            >
              <div class="c_f_center">
                <span>共{{ item.showActivityCourseList.length }}个课程</span>
                <span
                  >原价{{
                    item.showActivityCourseList | add("coursePrice")
                  }}元</span
                >
              </div>
            </div>
          </template>
          <!-- <div class="titleItem">砍价设置</div> -->
          <template v-if="acitivityParams.contentType == 1">
            <van-field
              v-model="item.productName"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              label="商品名称"
              input-align="right"
              maxlength="20"
              placeholder="请输入商品名称"
              :rules="[{ required: true, message: '请输入商品名称' }]"
            />
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
                class="custom_required needDisable pt0"
                :readonly="acitivityParams.isedit"
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
              class="mt10 custom_required needDisable"
              :readonly="acitivityParams.isedit"
              input-align="right"
              placeholder="请输入课程原价"
              type="number"
              :formatter="$formatter"
              format-trigger="onBlur"
              :rules="[{ required: true, message: '请输入课程原价' }]"
            />
          </template>

          <van-cell-group class="mt10">
            <van-field
              v-model="item.floorPrice"
              label="砍价底价"
              type="number"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              input-align="right"
              :formatter="$formatter"
              format-trigger="onBlur"
              placeholder="请输入砍价底价"
              :rules="[{ required: true, message: '请输入砍价底价' }]"
            />
            <span class="inputErr needDisable"
              >（注：用户未砍至底价，仍可以按砍价结果价下单购买）</span
            >
          </van-cell-group>

          <van-cell-group class="mt10">
            <van-field
              v-model="item.totalNum"
              label="砍价次数"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              type="digit"
              input-align="right"
              placeholder="从原价到底价一共要砍价的次数"
              :rules="[{ required: true, message: '砍价次数不能为空' }]"
            />
            <span class="inputErr needDisable"
              >（注：砍价次数为从原价到底价一共要砍价的次数）</span
            >
            <!-- <van-field
              v-model="item.selfNum"
              label="自砍次数"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              type="digit"
              input-align="right"
              placeholder="自己每日能砍次数，每日0点更新"
              :rules="[{ required: true, message: '自砍次数不能为空' }]"
            />
            <van-field
              v-model="item.helpNum"
              label="帮砍次数"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              type="digit"
              input-align="right"
              placeholder="朋友每日帮砍次数，每日0点更新"
              :rules="[{ required: true, message: '帮砍次数不能为空' }]"
            /> -->
          </van-cell-group>
          <template v-if="!acitivityParams.isedit || item.placesLimit_ == 0">
            <van-cell-group class="needDisable mt10">
              <div class="custum_van-cell-group">
                <span>活动名额</span>
                <van-radio-group
                  v-model="item.placesLimit"
                  direction="horizontal"
                  :disabled="acitivityParams.isedit"
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
                input-align="right"
                placeholder="请输入限额数量"
                :rules="[{ required: true, message: '限额数量不能为空' }]"
              />
            </van-cell-group>
          </template>
          <!-- <div
            class="titleItem myTip"
            @click="
              $dialog
                .alert({
                  title: '支付设置说明',
                  message:
                    '线下支付：商品不需要线上进行付款，仅在活动中进行报名登记。\n付砍价结果价：用户参与活动支付砍价后最终结果价格。\n预付：用户参与活动所需支付的定金，最小为0.01元，最大不可超过砍价底价。',
                  showConfirmButton: false,
                  messageAlign: 'left',
                  closeOnClickOverlay: true,
                  className: 'toastDialog',
                })
                .catch(() => {})
            "
          >
            <span>支付设置</span>
          </div>
          <van-cell-group>
            <div class="custum_van-cell-group needDisable">
              <van-radio-group
                v-model="item.paySet"
                direction="horizontal"
                :disabled="acitivityParams.isedit"
              >
                <van-radio :name="1" v-if="acitivityParams.contentType != 2"
                  >线下支付<template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? checked : unchecked"
                    /> </template
                ></van-radio>
                <van-radio :name="2"
                  >付砍价结果价<template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? checked : unchecked"
                    /> </template
                ></van-radio>
                <van-radio :name="3"
                  >预付<template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? checked : unchecked"
                    /> </template
                ></van-radio>
              </van-radio-group>
            </div>
            <van-field
              v-if="item.paySet == 3"
              v-model="item.prepaidAmount"
              label="预付金额"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              type="number"
              :formatter="$formatter"
              format-trigger="onBlur"
              input-align="right"
              placeholder="请输入预付金额"
              :rules="[{ required: true, message: '预付金额不能为空' }]"
            />
            <van-field
              label-width="auto"
              v-if="item.paySet != 1"
              v-model="acitivityParams.payDeadline"
              label="付款截止时间"
              class="custom_required needDisable"
              readonly
              clickable
              @click="timeSel('payDeadline')"
              input-align="right"
              placeholder="请选择付款截止时间"
              :rules="[{ required: true, message: '付款截止时间不能为空' }]"
            />
          </van-cell-group> -->
          <!-- 参与限制 -->
          <van-cell-group class="mt10 needDisable">
            <div
              class="custum_van-cell-group mt10"
              @click="
                getPopup({
                  key: 'limitItems',
                  name: 'label', //显示字段
                  id: 'limitItems', //唯一值
                  title: '新老生参与限制',
                  ided: item.limitItems,
                  index: index,
                })
              "
            >
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
        </div>
      </template>
      <!-- 活动内容-助力 -->
      <template v-if="acitivityParams.activityType == 5">
        <div
          v-for="(item, index) in acitivityParams[
            'content_' + acitivityParams.contentType
          ]"
          :key="index"
        >
          <div class="titleItem">
            {{ acitivityParams.contentType == 2 ? "课包设置" : "自定义设置" }}
          </div>
          <template v-if="acitivityParams.contentType == 2">
            <van-field
              label-width="auto"
              v-model="item.productName"
              class="custom_required needDisable"
              label="课包名称"
              :readonly="acitivityParams.isedit"
              input-align="right"
              maxlength="20"
              placeholder="请输入课包名称"
              :rules="[
                {
                  required: true,
                  message: '请输入课包名称',
                },
              ]"
            />
            <add-course
              :showActivityCourseList="item.showActivityCourseList"
              :isedit="acitivityParams.isedit"
            ></add-course>
            <!-- <div
              class="operateFixed"
              v-if="
                item.showActivityCourseList &&
                item.showActivityCourseList.length
              "
            >
              <div class="c_f_center">
                <span>共{{ item.showActivityCourseList.length }}个课程</span>
                <span
                  >原价{{
                    item.showActivityCourseList | add("coursePrice")
                  }}元</span
                >
              </div>
            </div> -->
          </template>
          <!-- <div class="titleItem">助力设置</div> -->
          <template v-if="acitivityParams.contentType == 1">
            <van-field
              v-model="item.productName"
              class="custom_required needDisable"
              label="商品名称"
              maxlength="20"
              :readonly="acitivityParams.isedit"
              input-align="right"
              placeholder="请输入商品名称"
              :rules="[{ required: true, message: '请输入商品名称' }]"
            />
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
                class="custom_required needDisable pt0"
                rows="2"
                autosize
                show-word-limit
                maxlength="200"
                :readonly="acitivityParams.isedit"
                input-align="left"
                placeholder="请输入商品描述"
                :rules="[{ required: true, message: '请输入商品描述' }]"
              />
            </van-cell-group>

            <van-cell-group class="mt10">
              <van-field
                v-model="item.originalPrice"
                label="原价"
                :readonly="acitivityParams.isedit"
                class="custom_required needDisable"
                input-align="right"
                type="number"
                :formatter="$formatter"
                format-trigger="onBlur"
                placeholder="请输入课程原价"
                :rules="[{ required: true }]"
              />
            </van-cell-group>
          </template>

          <van-cell-group class="mt10">
            <van-field
              v-model="item.floorPrice"
              label="活动价"
              class="custom_required needDisable"
              input-align="right"
              type="number"
              :formatter="$formatter"
              format-trigger="onBlur"
              :readonly="acitivityParams.isedit"
              placeholder="请输入活动价"
              :rules="[{ required: true, message: '请输入活动价' }]"
            />
            <span class="inputErr needDisable"
              >(注：助力活动，用户助力成功后，才能以活动价下单购买)</span
            >
          </van-cell-group>

          <van-cell-group class="mt10">
            <van-field
              v-model="item.packagesNumber"
              label="需获得的助力包数量"
              label-width="160"
              type="digit"
              :readonly="acitivityParams.isedit"
              class="custom_required needDisable"
              input-align="right"
              placeholder="请输入助力包数"
              :rules="[{ required: true, message: '助力包数量不能为空' }]"
            />
            <span class="inputErr needDisable"
              >(注：达到助力包数量后，表示助力成功)</span
            >
          </van-cell-group>

          <van-cell-group class="mt10">
            <div
              class="custum_van-cell-group border_b needDisable"
              @click="
                getPopup({
                  key: 'eachNum',
                  name: 'name', //显示字段
                  id: 'maxNumber', //唯一值
                  title: '每人最多助力包数',
                  ided: item.maxNumber,
                  index: index,
                })
              "
            >
              <span class="c_f_shrink required">每人最多助力包数</span>
              <div class="c_f_center" style="width: 80px">
                <van-field
                  class="needDisable"
                  style="padding-right: 0"
                  :border="false"
                  readonly
                  v-model="item.maxNumber"
                  type="digit"
                  input-align="right"
                  placeholder="个数"
                  :rules="[
                    { required: true, message: '单次最大助力包数不能为空' },
                  ]"
                />
                <span v-show="item.maxNumber">个</span>
                <van-icon name="arrow" />
              </div>
            </div>
            <span class="inputErr needDisable"
              >(注：最多可设置8个助力包)<br /><span style="color: #bfbfbf"
                >(建议设置2～8 ,
                例如：设置6，则好友助力时，会在1-6范围内，随机获得助力包)</span
              ></span
            >
          </van-cell-group>
          <template v-if="!acitivityParams.isedit || item.placesLimit_ == 0">
            <van-cell-group class="needDisable mt10">
              <div class="custum_van-cell-group">
                <span>活动名额</span>
                <van-radio-group
                  v-model="item.placesLimit"
                  direction="horizontal"
                  :disabled="acitivityParams.isedit"
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
                input-align="right"
                placeholder="请输入限额数量"
                :rules="[{ required: true, message: '限额数量不能为空' }]"
              />
            </van-cell-group>
          </template>

          <!-- <div
            class="titleItem myTip"
            @click="
              $dialog
                .alert({
                  title: '支付设置说明',
                  message:
                    '线下支付：商品不需要线上进行付款，仅在活动中进行报名登记。\n付活动价：用户参与活动，在助力成功之后支付商品全款，具体支付金额视商品活动价而定。\n预付：用户参与活动所需支付的定金，最小为0.01元，最大不可超过活动价。',
                  showConfirmButton: false,
                  messageAlign: 'left',
                  closeOnClickOverlay: true,
                  className: 'toastDialog',
                })
                .catch(() => {})
            "
          >
            <span>支付设置</span>
          </div>
          <van-cell-group class="needDisable">
            <div class="custum_van-cell-group">
              <van-radio-group
                v-model="item.paySet"
                direction="horizontal"
                :disabled="acitivityParams.isedit"
              >
                <van-radio :name="1" v-if="acitivityParams.contentType != 2"
                  >线下支付<template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? checked : unchecked"
                    /> </template
                ></van-radio>
                <van-radio :name="2"
                  >付活动价<template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? checked : unchecked"
                    /> </template
                ></van-radio>
                <van-radio :name="3"
                  >预付<template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? checked : unchecked"
                    /> </template
                ></van-radio>
              </van-radio-group>
            </div>
            <van-field
              v-if="item.paySet == 3"
              v-model="item.prepaidAmount"
              label="预付金额"
              class="custom_required needDisable"
              :readonly="acitivityParams.isedit"
              type="number"
              :formatter="$formatter"
              format-trigger="onBlur"
              input-align="right"
              placeholder="请输入预付金额"
              :rules="[{ required: true, message: '预付金额不能为空' }]"
            />
            <van-field
              label-width="auto"
              v-if="item.paySet != 1"
              v-model="acitivityParams.payDeadline"
              label="付款截止时间"
              class="custom_required needDisable"
              readonly
              clickable
              @click="timeSel('payDeadline')"
              input-align="right"
              placeholder="请选择付款截止时间"
              :rules="[{ required: true, message: '付款截止时间不能为空' }]"
            />
          </van-cell-group> -->
          <!-- 参与限制 -->
          <van-cell-group class="mt10 needDisable">
            <div
              class="custum_van-cell-group mt10"
              @click="
                getPopup({
                  key: 'limitItems',
                  name: 'label', //显示字段
                  id: 'limitItems', //唯一值
                  title: '新老生参与限制',
                  ided: item.limitItems,
                  index: index,
                })
              "
            >
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
        </div>
      </template>

      <!--抢购限购-->
      <template v-if="acitivityParams.activityType == 2">
        <van-cell-group>
          <div class="custum_van-cell-group mt15 needDisable">
            <span
              class="myTip"
              @click="
                $dialog
                  .alert({
                    title: '限购说明',
                    message:
                      '指用户参与活动，选购商品的数量限制，最小为1，最大不可超过活动中售卖的商品种类。',
                    showConfirmButton: false,
                    messageAlign: 'left',
                    closeOnClickOverlay: true,
                    className: 'toastDialog',
                  })
                  .catch(() => {})
              "
              >每人限购</span
            >
            <van-switch
              :disabled="acitivityParams.isedit"
              v-model="acitivityParams.signUpLimit"
              active-color="#16C6C6"
              inactive-color="#E2E2E2"
              size="24px"
            />
          </div>
        </van-cell-group>

        <div
          class="custum_van-cell-group border_b bgcfff needDisable"
          v-if="acitivityParams.signUpLimit"
        >
          <span class="required c_f_shrink">每个学员最多选报</span>
          <div class="c_f_center">
            <van-field
              :border="false"
              v-model="acitivityParams.limitNum"
              class="pr0 needDisable mr4"
              input-align="right"
              :readonly="acitivityParams.isedit"
              type="digit"
              placeholder="请输入限制数量"
              :rules="[
                {
                  required: true,
                  message: (value, rule) =>
                    value == '0' ? '限制数量不能为0' : '请输入限制数量',
                  pattern: /^[1-9]\d*$/,
                },
              ]"
            />
            <span>项</span>
          </div>
        </div>
      </template>
    </van-form>
    <!-- 时间选择 -->
    <van-calendar
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="currentDate"
      v-model="datePickerShow"
      color="#13c2c2"
      @confirm="timeConfirm"
    />
    <!-- 弹出层 -->
    <van-popup closeable round v-model="popupShow" position="bottom">
      <div class="popupTitle">
        <span>{{ popupObj.title }}</span>
      </div>
      <ul class="popup">
        <template>
          <li
            v-for="(ceil, index) in popupData"
            @click="
              popupClick(
                acitivityParams['content_' + acitivityParams.contentType],
                ceil
              )
            "
            :key="index"
            :class="[popupObj.ided == ceil[popupObj.id] ? 'active' : '']"
          >
            <span>{{ ceil[popupObj.name] }}</span
            ><var></var>
          </li>
        </template>
      </ul>
    </van-popup>
  </div>
</template>
<script>
import moment from "moment";
import { Toast } from "vant";
import { Dialog } from "vant";
import addCourse from "./addCourse";
import Leaflet from "../components/leaflet";
import Group from "../components/group";
export default {
  name: "stepOne",
  components: { addCourse, Leaflet, Group },
  data() {
    return {
      popupShow: false,
      eachNum: [
        { maxNumber: 1, name: "1个" },
        { maxNumber: 2, name: "2个" },
        { maxNumber: 3, name: "3个" },
        { maxNumber: 4, name: "4个" },
        { maxNumber: 5, name: "5个" },
        { maxNumber: 6, name: "6个" },
        { maxNumber: 7, name: "7个" },
        { maxNumber: 8, name: "8个" },
      ],
      popupData: {},
      popupObj: {},
      limitItems: [
        { label: "不限制", limitItems: 0 },
        { label: "仅允许新生参与活动", limitItems: 1 },
        { label: "仅允许老生参与活动", limitItems: 2 },
      ],
      types: [
        { name: "微传单", type: 1 },
        { name: "拼团", type: 3 },
        { name: "抢购", type: 2 },
        { name: "砍价", type: 4 },
        { name: "助力", type: 5 },
      ],
      datePickerShow: false,
      datePickerFor: "",
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2050, 1, 1),
      currentDate: new Date(),
      checked: require("../../../assets/img/app/checked.png"),
      unchecked: require("../../../assets/img/app/unchecked.png"),
    };
  },
  props: {
    acitivityParams: {
      type: Object,
    },
  },
  watch: {
    $route(to, from) {
      if (from.name === "factory") {
        let item = JSON.parse(localStorage.getItem("item"));
        if (item) {
          if (item.edit_index || item.edit_index == "0") {
            let index = item.edit_index;
            delete item.edit_index;
            this.acitivityParams["content_" + this.acitivityParams.contentType][
              index
            ] = item;
            this.$forceUpdate();
          } else {
            this.acitivityParams[
              "content_" + this.acitivityParams.contentType
            ].push(JSON.parse(localStorage.getItem("item")));
          }
          localStorage.removeItem("item");
        }
      }
    },
  },
  methods: {
    editLimitNum(e, data, key) {
      if (e.target.value * 1 < data[key + "_"] * 1) {
        data[key] = data[key + "_"];
        Toast("活动发布后，商品名额只能增加，不能减少。");
      }
    },
    getPopup(options) {
      if (this.acitivityParams.isedit) return;
      this.popupData = this[options.key];
      if (!this.popupData.length) return;
      this.popupObj = options;
      this.popupShow = true;
    },
    //弹出框选择操作
    popupClick(source, data) {
      let tem = source[this.popupObj.index];
      tem[this.popupObj.id] = data[this.popupObj.id];
      this.popupShow = !this.popupShow;
    },
    goFactory(type, title, item, index) {
      //活动类型 title  是否自定义
      if (item) {
        item.edit_index = index;
        localStorage.setItem("item", JSON.stringify(item));
      }
      this.$router.push({
        path: "/factory",
        query: { tp: type, tl: title, cs: this.acitivityParams.contentType },
      });
    },
    next() {
      console.dir(this.acitivityParams);
    },
    moment,
    timeSel(key) {
      if (this.acitivityParams.isedit && key !== "endTime") return;
      this.currentDate = this.acitivityParams[key]
        ? new Date(this.acitivityParams[key])
        : new Date();
      this.datePickerFor = key;
      this.datePickerShow = true;
    },
    timeConfirm(date) {
      this.datePickerShow = false;
      this.acitivityParams[this.datePickerFor] = moment(date).format(
        "YYYY-MM-DD"
      );
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
        case "switch":
          //编辑(活动已发布)不可切换
          if (
            this.acitivityParams.editType &&
            this.acitivityParams.activityStatus != 0
          )
            return;
          if (this.acitivityParams.activityType == data) return;
          // console.log(JSON.stringify(this.acitivityParams["content_1"]))
          // console.log(JSON.stringify(this.acitivityParams["content_copy_1"]))
          // console.log(JSON.stringify(this.acitivityParams["content_2"]))
          // console.log(JSON.stringify(this.acitivityParams["content_copy_2"]))
          if (
            JSON.stringify(this.acitivityParams["content_1"]) ==
              JSON.stringify(this.acitivityParams["content_copy_1"]) &&
            JSON.stringify(this.acitivityParams["content_2"]) ==
              JSON.stringify(this.acitivityParams["content_copy_2"])
          ) {
            init.call(this);
          } else {
            Dialog.confirm({
              title: "提示",
              message: "切换类型/内容后，当前已填充项将会被重置，是否切换？",
            })
              .then(() => {
                init.call(this);
              })
              .catch(() => {});
          }
          // 参数初始化
          function init() {
            this.acitivityParams.activityType = data;
            this.acitivityParams.contentType = 1;
            this.acitivityParams["content_1"] = [];
            this.acitivityParams["content_2"] = [];
            if (data == 1) {
              //微传单默认数据
              this.acitivityParams["content_1"].push({
                placesLimit: 1,
                places: "40",
                paySwitch: false,
                paySet: 1,
              });
            }
            if (data == 2) {
              //抢购默认数据
              this.acitivityParams["signUpLimit"] = false;
            }
            if (data == 3) {
              //拼团默认数据
              this.acitivityParams["content_1"].push({
                showContentRuleList: [],
                paySet: 3,
                placesLimit: 1,
                places: "40",
                limitItems: false,
              });
              this.acitivityParams["content_2"].push({
                placesLimit: 1,
                places: "40",
                paySet: 3,
                showActivityCourseList: [],
                showContentRuleList: [],
                limitItems: false,
              });
            }
            if (data > 3) {
              this.acitivityParams["content_1"].push({
                placesLimit: 1,
                places: "40",
                showActivityCourseList: [],
                limitItems: 0,
              });
              this.acitivityParams["content_2"].push({
                placesLimit: 1,
                places: "40",
                showActivityCourseList: [],
                limitItems: 0,
              });
              if (data == 5) {
                this.acitivityParams["content_1"][0].maxNumber = "8";
                this.acitivityParams["content_2"][0].maxNumber = "8";
              }
            }
            this.acitivityParams["content_copy_1"] = JSON.parse(
              JSON.stringify(this.acitivityParams["content_1"])
            );
            this.acitivityParams["content_copy_2"] = JSON.parse(
              JSON.stringify(this.acitivityParams["content_2"])
            );
          }
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.numDiv {
  overflow: hidden;
  width: 100px;
  background-color: #fff;
  border-radius: 30px;
  border: 1px solid #c5c2c2;
  height: 30px;
  .minus {
    width: 30px;
    height: 30px;
    border-radius: 30px 0 0 30px;
    &.dis {
      background-color: #f8f8f8;
    }
  }
  .van-cell {
    height: 30px;
    line-height: 30px;
    padding: 0;
    width: 40px;
    border-left: 1px solid #c5c2c2;
    border-right: 1px solid #c5c2c2;
    background-color: #f8f8f8;
    /deep/input {
      font-size: 15px;
      color: #13c2c2;
      font-weight: bold;
    }
  }
  .plus {
    width: 30px;
    height: 30px;
    border-radius: 0 30px 30px 0;
  }
}
.editWarn {
  width: 346px;
  margin: 16px auto 0;
  height: 30px;
  border-radius: 2px;
  background-color: #ffead8;
  color: #ff9537;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
}
.leafletWarn {
  background-color: #ffecec;
  border-radius: 2px;
  line-height: 17px;
  padding: 5px 8px;
  color: #d45656;
  font-size: 12px;
  margin-top: 10px;
}
.boxWrap {
  padding: 0 14px;
  .box {
    font-size: 12px;
    width: 100%;
    margin-top: 10px;
    padding: 0 12px 10px;
    background-color: #fff;
    line-height: 22px;
    color: #595959;
    border-radius: 4px;
    .boxTitle {
      height: 30px;
      border-bottom: 1px solid #f8f8f8;
      > span {
        font-size: 13px;
      }
      div {
        span:nth-of-type(1) {
          display: inline-block;
          width: 15px;
          height: 16px;
          background: url("../../../assets/img/app/setting_del.png") no-repeat;
          background-size: contain;
          margin-right: 30px;
        }
        span:nth-of-type(2) {
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url("../../../assets/img/app/srtting_edit.png") no-repeat;
          background-size: contain;
          margin-right: 20px;
        }
      }
    }
    .name {
      font-size: 15px;
      font-weight: bold;
      color: #1f1f1f;
      margin-top: 10px;
    }
    .desc {
      color: #bfbfbf;
      margin-top: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .division {
      width: 100%;
      height: 0;
      border-top: 1px dashed #f0f0f0;
      margin-top: 6px;
    }
    .limit {
      span:nth-of-type(2):before {
        content: "";
        display: inline-block;
        margin: 0 6px -2px;
        width: 1px;
        height: 12px;
        background-color: #bfbfbf;
      }
    }
    .redText {
      color: #d45656;
      font-weight: bold;
    }
    .cut {
      margin: 0 5px;
    }
    .coursePkg {
      padding: 14px 10px;
      box-shadow: 0 0 4px 2px #f0f0f0;
      border-radius: 2px;
      margin-top: 10px;
      > div:not(:first-child) {
        margin-top: 5px;
      }
      .giveTip {
        width: 18px;
        height: 18px;
        display: inline-flex;
        background-color: #d45656;
        color: #fff;
        font-size: 12px;
        border-radius: 2px;
        margin: 0 4px;
      }
      .feeTip {
        width: 36px;
        height: 20px;
        display: inline-flex;
        border: 1px solid #13c2c2;
        color: #13c2c2;
        border-radius: 2px;
      }
    }
  }
}

.activityTabs {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  .tab {
    &.active {
      font-weight: bold;
      color: #13c2c2;
    }
    &.active.active_disable {
      font-weight: bold;
      color: #353535;
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
    &.active.active_disable:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      width: 65px;
      height: 8px;
      background: url("../../../assets/img/app/setting_tip_disable.png")
        no-repeat;
      background-size: contain;
    }
    position: relative;
    font-size: 15px;
    line-height: 50px;
    text-align: center;
    height: 50px;
    padding: 0 20px;
  }
}
.grads {
  border: 1px solid #c9f1f1;
  border-radius: 2px;
  height: 44px;
  padding: 0 10px 0 6px;
  margin-top: 8px;
  .c_f_row {
    > span:nth-of-type(1) {
      display: inline-block;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      margin-right: 10px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 2px;
      color: #fff;
      background: -moz-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
      background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        color-stop(0%, #2be3e3),
        color-stop(100%, #13c2c2)
      );
      background: -webkit-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
      background: -o-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
      background: -ms-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
      background: linear-gradient(to bottom, #2be3e3 0%, #13c2c2 100%);
    }
  }
}
</style>
