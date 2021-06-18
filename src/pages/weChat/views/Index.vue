<template>
  <div :style="bgStyle" class="relative">
    <!--头图  活动计时-->
    <div style="position: relative">
      <img :src="topUrl" class="topImg" />
      <active-title
        :activeStatus="status"
        :name="name"
        :beginTime="beginTime"
        :endTime="endTime"
        :color="topColor"
        v-if="upDownStatus != -1"
        :client="client"
      />
    </div>

    <div class="blank"></div>
    <!--课程块-->
    <div v-if="activeType !== 1">
      <div :key="index" v-for="(item, index) in packages" class="infoBlock">
        <package-name
          :nameInfo="item"
          :activeType="activeType"
          :activeContent="activeContent"
          :client="client"
        />
        <content-custom
          :content="item.productDesc"
          v-if="activeContent == 1 && item.productDesc"
        />
        <content-package
          :course="item.courseInfo"
          v-if="activeContent == 2 && item.courseInfo"
        />
        <content-package
          stype="2"
          :course="item.showActivityCourseList"
          v-if="activeContent == 2 && item.showActivityCourseList"
        />
        <content-rule
          v-if="
            activeType == 3 &&
            item.showContentRuleList &&
            item.showContentRuleList.length > 1
          "
          :rules="item.showContentRuleList"
          :type="ruleType == 1 ? 1 : item.signed ? 2 : 1"
          :currentIndex="getUserRuleIndex(item)"
        />
        <!-- :type="getUserGroupType(item)"
          :acJoinList="item.activityJoinList || []"
         -->
        <user-group
          :key="index"
          v-if="activeType == 3 && !client"
          :signed="item.signed"
          :fromOpenid="fromOpenid"
          :myGroup="item.myGroup"
          :rule="item.showContentRuleList"
          :contentId="item.contentId"
          @toShowShare="toShowShare"
          @toJoinNow="toJoinNow"
          @showLog="showLog"
        />
        <span class="help-tips" v-if="activeType == 5"
          >每人每次可随机获得 1-8 个助力包，累计 100 个助力包后助力成功</span
        >
        <help-progress
          v-if="activeType == 5"
          @toShowHelp="toShowHelp"
          @toPayHelp="toPayHelp"
          @toShowShare="toShowShare"
          :isMul="getSelectedStu.length > 1"
          :joinList="joinList"
        />
        <bargain
          v-if="activeType == 4"
          :joinList="joinList"
          :fromOpenid="fromOpenid"
          @toPayHelp="toPayHelp"
          @showLog="showLog"
          @cutPay="cutPay"
        />
      </div>
    </div>

    <!-- 他们正在拼 -->
    <active-group
      @toJoinNow="toJoinNow"
      v-if="
        activeType == 3 &&
        packages &&
        packages[0] &&
        packages[0].activityJoinList &&
        packages[0].activityJoinList.length &&
        status == 2
      "
      :acJoinList="packages && packages[0] && packages[0].activityJoinList"
    />

    <!--砍价帮-->
    <bargain-user
      v-if="activeType == 4 && joinList && joinList.length == 1"
      :joinList="joinList"
      @showLog="showLog"
    />

    <!-- 下方区块 -->
    <div
      class="boxWrap"
      v-for="(item, index) in list"
      :key="'getContent_' + index"
    >
      <!-- 标题盒子 -->
      <div class="title" :style="title_style">
        <img
          style="width: 100%; display: block"
          :src="content.titleBackground"
        />
        <div class="titleContent" :style="titleZoom">
          <img :src="content.titleFrame1" alt="" ref="t1" style="left: 0" />
          <div class="titleTxt" :style="titleTxtStyle">{{ item.title }}</div>
          <img :src="content.titleFrame3" alt="" ref="t3" style="right: 0" />
        </div>
      </div>
      <!-- 内容盒子 -->
      <div class="box" :style="box_style">
        <div class="forBg"></div>
        <!-- 上 -->
        <div class="rowTop" :style="contentStyleTop">
          <div class="corner_l"></div>
          <div class="center"></div>
          <div class="corner_r"></div>
        </div>
        <!-- 中 -->
        <div class="rowCen">
          <div>
            <div v-for="(con, i) in item.body" :key="i">
              <div
                class="rowTxt"
                v-if="con.content"
                style="white-space: pre-line; word-break: break-all"
              >
                <span>{{ con.content }}</span>
              </div>
              <img :src="con.url" v-if="con.url" />
            </div>
          </div>
        </div>
        <!-- 下 -->
        <div class="rowBot" :style="contentStyleBottom">
          <div class="corner_l"></div>
          <div class="center"></div>
          <div class="corner_r"></div>
        </div>
      </div>
    </div>

    <!-- 活动规则 -->
    <div class="bottom-rule" @click="toRule">
      <!-- <div @click="isRuleOpen = true" v-if="!client">活动规则</div>
      <div v-if="client">活动规则</div> -->
      <p>本活动由易知鸟提供技术支持 >></p>
    </div>

    <!--选学生 弹框-->
    <van-popup
      v-model="choiceStu"
      round
      position="bottom"
      :style="{ height: '80%' }"
      close-icon-position="top-left"
      closeable
    >
      <div class="choice-title">选择学员</div>

      <div class="choice-group">
        <div class="tips" v-if="currentStu && currentStu.length">
          当前在读学员
        </div>
        <div class="choice-info" v-for="item in currentStu" :key="item.id">
          <div class="stu-img">
            <van-image
              round
              width="60"
              height="60"
              :src="item.imgUrl"
              v-if="item.imgUrl"
            />
            <van-image
              round
              width="60"
              height="60"
              :src="require('@/assets/img/weChat/defaultNv.png')"
              v-if="!item.imgUrl && item.sex == 0"
            />
            <van-image
              round
              width="60"
              height="60"
              :src="require('@/assets/img/weChat/defaultNan.png')"
              v-if="!item.imgUrl && item.sex != 0"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nv.png"
              v-if="item.sex == 0"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nan.png"
              v-if="item.sex == 1"
            />
          </div>

          <div class="stu-info">
            <div>
              {{ item.name
              }}<span v-if="item.birthday"> / {{ getAge(item.birthday) }}</span>
            </div>
            <div>{{ item.potentialCustomerParentPhone }}</div>
          </div>
          <van-checkbox
            @click="setCurrentStuId(item, currentStu, 'currentStu')"
            v-model="item.checkedStatus"
            icon-size="22px"
            checked-color="#DC2A2A"
          ></van-checkbox>
        </div>
        <div class="tips" v-if="latentStu && latentStu.length">
          未在机构报读学员
        </div>
        <div class="choice-info" v-for="item in latentStu" :key="item.id">
          <div class="stu-img">
            <!-- <van-image round width="60" height="60" :src="item.imgUrl" /> -->
            <van-image
              round
              width="60"
              height="60"
              :src="item.imgUrl"
              v-if="item.imgUrl"
            />
            <van-image
              round
              width="60"
              height="60"
              :src="require('@/assets/img/weChat/defaultNv.png')"
              v-if="!item.imgUrl && item.sex == 0"
            />
            <van-image
              round
              width="60"
              height="60"
              :src="require('@/assets/img/weChat/defaultNan.png')"
              v-if="!item.imgUrl && item.sex != 0"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nv.png"
              v-if="item.sex == 0"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nan.png"
              v-if="item.sex == 1"
            />
          </div>

          <div class="stu-info">
            <div>
              {{ item.name }}
              <span v-if="item.birthday">/{{ getAge(item.birthday) }}</span>
            </div>
            <div>{{ item.potentialCustomerParentPhone }}</div>
          </div>
          <van-checkbox
            @click="setCurrentStuId(item, latentStu, 'latentStu')"
            v-model="item.checkedStatus"
            icon-size="22px"
            checked-color="#DC2A2A"
          ></van-checkbox>
        </div>
        <div class="tips" v-if="historyStu && historyStu.length">
          曾在机构报读学员
        </div>
        <div class="choice-info" v-for="item in historyStu" :key="item.id">
          <div class="stu-img">
            <!-- <van-image round width="60" height="60" :src="item.imgUrl" /> -->
            <van-image
              round
              width="60"
              height="60"
              :src="item.imgUrl"
              v-if="item.imgUrl"
            />
            <van-image
              round
              width="60"
              height="60"
              :src="require('@/assets/img/weChat/defaultNv.png')"
              v-if="!item.imgUrl && item.sex == 0"
            />
            <van-image
              round
              width="60"
              height="60"
              :src="require('@/assets/img/weChat/defaultNan.png')"
              v-if="!item.imgUrl && item.sex != 0"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nv.png"
              v-if="item.sex == 0"
            />
            <img
              class="stu-gender"
              src="@/assets/img/weChat/nan.png"
              v-if="item.sex == 1"
            />
          </div>

          <div class="stu-info">
            <div>
              {{ item.name
              }}<span v-if="item.birthday">/{{ getAge(item.birthday) }}</span>
            </div>
            <div>{{ item.potentialCustomerParentPhone }}</div>
          </div>
          <van-checkbox
            @click="setCurrentStuId(item, historyStu, 'historyStu')"
            v-model="item.checkedStatus"
            icon-size="22px"
            checked-color="#DC2A2A"
          ></van-checkbox>
        </div>
        <div class="choice-add" @click="toRegister">登记新学员</div>
      </div>

      <div class="fix-join" @click="submitChoiceStu">确认</div>
    </van-popup>

    <!--选课程 弹框-->
    <van-popup
      v-model="choiceLesson"
      round
      position="bottom"
      :style="{ height: '80%' }"
      close-icon-position="top-left"
      closeable
    >
      <div class="choice-title">选择商品</div>
      <div class="lesson-body">
        <div class="lesson-list">
          <div
            v-for="(item, index) in allowPackages"
            :key="index"
            class="infoBlock lesson-item"
          >
            <package-name
              :type="2"
              :nameInfo="item"
              :activeType="activeType"
              :activeContent="activeContent"
            />
            <content-custom
              :content="item.productDesc"
              v-if="activeContent == 1 && item.productDesc"
            />
            <content-package
              :course="item.courseInfo"
              v-if="activeContent == 2 && item.courseInfo"
            />
            <content-package
              stype="2"
              :course="item.showActivityCourseList"
              v-if="activeContent == 2 && item.showActivityCourseList"
            />
            <content-rule
              v-if="
                activeType == 3 &&
                item.showContentRuleList &&
                item.showContentRuleList.length > 1
              "
              :rules="item.showContentRuleList"
              :type="1"
            />
            <img
              src="@/assets/img/weChat/shop.png"
              v-if="
                item.isSelected && (!item.placesLimit || item.remainingAllowed)
              "
              @click="removeShopCart(item)"
            />
            <img
              src="@/assets/img/weChat/addShop.png"
              v-if="
                !item.isSelected && (!item.placesLimit || item.remainingAllowed)
              "
              @click="addShopCart(item)"
            />

            <img
              src="@/assets/img/weChat/addShopDis.png"
              v-if="item.placesLimit && item.remainingAllowed < 1"
            />
          </div>
          <p v-if="rejectPackages.length >= 1">以下商品不满足购买条件</p>
          <div v-if="rejectPackages.length >= 1">
            <div
              v-for="(item, index) in rejectPackages"
              :key="index"
              class="infoBlock lesson-item disable"
            >
              <package-name
                :nameInfo="item"
                :activeType="activeType"
                :activeContent="activeContent"
              />
              <content-custom
                :content="item.productDesc"
                v-if="activeContent == 1 && item.productDesc"
              />
              <content-package
                :course="item.courseInfo"
                v-if="activeContent == 2 && item.courseInfo"
              />
              <content-package
                stype="2"
                :course="item.showActivityCourseList"
                v-if="activeContent == 2 && item.showActivityCourseList"
              />

              <content-rule
                v-if="
                  activeType == 3 &&
                  item.showContentRuleList &&
                  item.showContentRuleList.length > 1
                "
                :type="1"
                :rules="item.showContentRuleList"
              />
              <img src="@/assets/img/weChat/addShopDis.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="lesson-total">
        <div v-if="activeType !== 3 && activeType != 4" class="lesson-l">
          <span class="num">共{{ getSelectedCourse.length }}件</span>
          <span class="price" v-if="totalPrice"
            >，合计<b>￥{{ totalPrice }}</b></span
          >
        </div>
        <div
          class="lesson-l"
          v-if="
            activeType == 3 &&
            getSelectedCourse &&
            getSelectedCourse[0] &&
            getSelectedCourse[0].paySet == 3
          "
        >
          <span class="num">预付</span>
          <span class="price"
            ><b
              >￥{{
                getSelectedCourse[0] && getSelectedCourse[0].prepaidAmount
              }}</b
            ></span
          >
        </div>
        <div
          class="lesson-l"
          v-if="
            activeType == 3 &&
            getSelectedCourse &&
            getSelectedCourse[0] &&
            getSelectedCourse[0].paySet == 2
          "
        >
          <span class="num">拼团价</span>
          <span class="price">
            <b
              >￥{{
                getSelectedCourse[0] &&
                getSelectedCourse[0].showContentRuleList[0].price
              }}</b
            >
          </span>
        </div>
        <div>
          <van-button
            v-if="activeType != 3 && totalPrice"
            @click="toComfirm"
            class="lesson-btn"
            color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >
            <span>去付款</span>
          </van-button>
          <van-button
            v-if="activeType != 3 && !totalPrice"
            @click="toComfirm"
            class="lesson-btn"
            color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >
            <span>去确认</span>
          </van-button>
          <van-button
            v-if="activeType == 3 && getSelectedCourse.length"
            @click="showPin"
            class="lesson-btn"
            color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
          >
            <span>下一步</span>
          </van-button>
        </div>
      </div>
    </van-popup>

    <!--助力 未开始 已结束-->

    <!-- <div
      class="fix-join end"
      v-if="getActiveType == 5 && status == 3 && !showActivityJoin && !client"
    >
      活动已结束
    </div>
    <div
      class="fix-record"
      v-if="
        getActiveType == 5 &&
        status == 3 &&
        showActivityJoin &&
        !client &&
        (showActivityJoin.paymentFlag == 1 || packages[0].paySet != 1)
      "
    >
      <div class="txt" @click="toRecord">报名记录</div>
    </div>

    <div
      class="fix-record"
      v-if="
        getActiveType == 5 &&
        status == 3 &&
        joinList &&
        joinList.length == 1 &&
        upDownStatus != -1 &&
        !client &&
        showActivityJoin.paymentFlag != 1 &&
        packages[0].paySet != 1 &&
        deadTime
      "
    >
      <div class="txt" @click="toRecord" v-if="showActivityJoin">报名记录</div>
      <van-button
        @click="toPayHelp(joinList && joinList[0].joinId)"
        class="record-btn"
        color="linear-gradient(180deg, #00A1DF 0%, #0082D4 100%)"
        >立即付款</van-button
      >
    </div>

    <div
      class="fix-join end"
      v-if="getActiveType == 5 && status == 1 && !client"
    >
      活动未开始
    </div> -->

    <!--未报名页面下显示助力-->
    <!-- <div
      class="fix-join"
      @click="joinActive"
      v-if="
        status == 2 &&
        getActiveType == 5 &&
        !joinList.length &&
        upDownStatus != -1 &&
        !client
      "
    >
      我要报名
    </div> -->
    <!--单学员时页面下显示助力-->
    <!-- <div
      class="fix-record"
      v-if="
        getActiveType == 5 &&
        status == 2 &&
        joinList &&
        joinList.length == 1 &&
        upDownStatus != -1 &&
        !client
      "
    >
      <div class="txt" @click="toRecord" v-if="showActivityJoin">报名记录</div>
      <div class="txt" @click="joinActive()" v-if="!showActivityJoin">
        我也要报名
      </div>
      <van-button
        v-if="joinList && joinList[0].activitySuccess == 2"
        @click="toShowHelp()"
        class="record-btn"
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        >助力</van-button
      >
      <van-button
        v-if="
          showActivityJoin &&
          showActivityJoin.activitySuccess == 1 &&
          packages &&
          packages[0] &&
          packages[0].paySet != 1 &&
          showActivityJoin.paymentFlag != 1 &&
          deadTime
        "
        @click="toPayHelp(joinList && joinList[0].joinId)"
        class="record-btn"
        color="linear-gradient(180deg, #00A1DF 0%, #0082D4 100%)"
        >立即付款</van-button
      >
    </div> -->
    <!--多学员助力时页面下显示我也要报名-->
    <!-- <div
      class="fix-record"
      v-if="
        getActiveType == 5 &&
        status == 2 &&
        joinList &&
        joinList.length > 1 &&
        !showActivityJoin &&
        upDownStatus != -1 &&
        !client
      "
    >
      <div class="txt txt2" @click="joinActive()">我也要报名</div>
    </div>
 -->

    <!-- 拼团  砍价  抢购 底部按钮 -->
    <group-btn
      @toShowShare="toShowShare"
      @toJoinNow="toJoinNow"
      @joinActive="joinActive"
      v-if="getActiveType == 3 && !client"
      :fromOpenid="fromOpenid"
      :upDownStatus="upDownStatus"
      :showActivityJoin="showActivityJoin"
      :status="status"
      :pack="packages[0] || {}"
      :myGroup="packages[0] && packages[0].myGroup"
      :openid="openid"
    />

    <flash-btn
      :fromOpenid="fromOpenid"
      :upDownStatus="upDownStatus"
      :pack="packages[0] || {}"
      @joinActive="joinActive"
      :type="getActiveType"
      v-if="(getActiveType == 1 || getActiveType == 2) && !client"
      :status="status"
      :join="showActivityJoin ? 1 : 0"
    />

    <help-btn
      v-if="getActiveType == 5 && !client"
      :status="status"
      :upDownStatus="upDownStatus"
      :fromOpenid="fromOpenid"
      :openid="openid"
      :showActivityJoin="showActivityJoin"
      :joinList="joinList"
      :pack="packages[0] || {}"
      @joinActive="joinActive"
      @toShowHelp="toShowHelp"
      @toPayHelp="toPayHelp"
      @toShowShare="toShowShare"
    />

    <!-- :paySet="packages && packages[0] && packages[0].paySet"
    :deadTimeTxt="deadTime"
     @toRecord="toRecord"
      :deadTime="payDeadline" -->
    <bargain-btn
      v-if="getActiveType == 4 && !client"
      :status="status"
      :upDownStatus="upDownStatus"
      :join="joinList && joinList.length"
      :joinList="joinList"
      :fromOpenid="fromOpenid"
      :openid="openid"
      :showActivityJoin="showActivityJoin"
      :pack="packages[0] || {}"
      @toPayHelp="toPayHelp"
      @joinActive="joinActive"
      @cutPay="cutPay"
      @toShowShare="toShowShare"
    />

    <!--助力 弹框-->
    <van-overlay :show="showHelp" @click="closeHelp">
      <div
        v-show="helpType == 1"
        @click.stop="showHelp = false"
        style="width: 100%; height: 100%"
      >
        <Luck ref="luck" @rollEnd="rollEnd" />
      </div>
      <div class="help-share" v-show="helpType != 1">
        <div class="help-info" @click.stop>
          <p class="tit">-助力成功-</p>
          <p class="des" v-if="helpType == 2">
            <span
              v-if="
                (!fromOpenid || fromOpenid == openid) &&
                curJoin.currentNumber - helpPackage < 1
              "
              >恭喜您，为自己助力成功啦。赶快去享受活动优惠吧。</span
            >
            <span v-if="fromOpenid && fromOpenid != openid">
              哇！为Ta助力{{ helpPackage }}个助力包。赶快告诉好友吧！
            </span>
            <span
              v-if="
                (!fromOpenid || fromOpenid == openid) &&
                curJoin.currentNumber - helpPackage > 0
              "
            >
              当前活动需要{{ curJoin.totalNumber }}次助力，还需{{
                curJoin.currentNumber - helpPackage
              }}次,快去邀请好友帮你助力吧</span
            >
          </p>
          <p class="des" v-if="helpType == 4">您已经为好友助力过了</p>
        </div>
        <van-button
          @click.stop="showHelp = false"
          v-if="helpType == 2"
          class="help-btn"
          color="linear-gradient(180deg, #FFCD69 0%, #F88B16 100%)"
        >
          确定
        </van-button>
        <van-button
          @click.stop="toShowShare"
          v-if="helpType == 3 || helpType == 4"
          class="help-btn"
          color="linear-gradient(180deg, #FFCD69 0%, #F88B16 100%)"
        >
          立即邀请
        </van-button>
      </div>
    </van-overlay>

    <!--提示信息 弹框-->
    <van-overlay :show="getIndexPop.show" @click="closeShowSucPop">
      <div class="succ-wrapper">
        <div
          class="succ-block"
          @click.stop
          :style="{
            background: `url(${popImg}) center center/ 100% 100% no-repeat `,
          }"
        >
          <div class="succ-close" @click="closeShowSucPop">
            <van-icon name="cross" size="20" color="#fff" />
          </div>
          <div class="succ-tit">{{ getIndexPop.title }}</div>
          <div class="succ-desc">{{ getIndexPop.desc }}</div>
          <van-button
            class="share-btn"
            color="#F9BB02"
            @click="toShowShare"
            v-if="getIndexPop.type == 2"
            >{{ getIndexPop.btn }}</van-button
          >
          <van-button
            class="share-btn t"
            color="#F9BB02"
            @click="closeShowSucPop"
            v-if="getIndexPop.type == 1"
            >{{ getIndexPop.btn }}</van-button
          >
        </div>
      </div>
    </van-overlay>

    <!--砍价帮 弹框-->
    <van-overlay :show="showHelpLog" @click="showLogClose" :lock-scroll="false">
      <bargain-user-modal
        :type="detailJoinType"
        :list="detailJoinList"
        :total="detailJoinTotal"
        @showLogClose="showLogClose"
        @toShowShare="toShowShare"
      />
    </van-overlay>

    <!--他们正在拼 弹框-->
    <van-overlay
      :show="showGroupLog"
      @click="groupLogClose"
      :lock-scroll="false"
    >
      <active-group-modal
        @toJoinComfirm="toJoinComfirm"
        @groupLogClose="groupLogClose"
        :acJoinList="packages && packages[0] && packages[0].activityJoinList"
      />
    </van-overlay>

    <!--去分享  遮罩-->
    <van-overlay :show="showShare" @click="showShare = false">
      <div class="share-wrapper">
        <img
          src="@/assets/img/weChat/yaoqing_.png"
          alt=""
          v-if="shareSty == 1"
        />
        <img
          src="@/assets/img/weChat/yaoqing.png"
          alt=""
          v-if="shareSty == 2"
        />
        <img
          src="@/assets/img/weChat/yaoqing(1).png"
          alt=""
          v-if="shareSty == 3"
        />
      </div>
    </van-overlay>

    <!-- 右边按钮 -->
    <div class="rightBtns" v-if="!client">
      <div
        v-if="curMusic"
        class="rightFix music"
        @click="videoChange"
        :class="{ paused: isPaused }"
      ></div>
      <div class="rightFix yq" v-if="distSwitch" @click="toInvite">
        <img src="@/assets/img/weChat/invite.png" />
      </div>
      <div class="rightFix hb" @click="getPost">
        <span>活动海报</span>
      </div>

      <div class="rightFix jg" v-if="getShopPhone">
        <a class="btn-call" :href="`tel: ${getShopPhone}`">
          <span>联系机构</span>
        </a>
      </div>
      <div
        class="rightFix"
        @click="joinActive()"
        v-if="
          upDownStatus != -1 && status == 2 && packages[0] && packages[0].signed
        "
      >
        <!-- v-if="getStuList.length > 1 && !fromOpenid" -->
        <span
          v-if="getActiveType == 1 || getActiveType == 4 || getActiveType == 5"
          >再报一个</span
        >
        <span v-if="getActiveType == 2">再抢一个</span>
        <span v-if="getActiveType == 3">再拼一个</span>
      </div>
    </div>

    <div class="rightBtns" v-if="client">
      <div v-if="curMusic && !terminal" class="rightFix music"></div>

      <div
        v-if="curMusic && terminal"
        class="rightFix music"
        @click="videoChange"
        :class="{ paused: isPaused }"
      ></div>
      <div class="rightFix yq" v-if="distSwitch">
        <img src="@/assets/img/weChat/invite.png" />
      </div>
      <div class="rightFix hb">
        <span>活动海报</span>
      </div>

      <div class="rightFix jg" v-if="getShopPhone">
        <a class="btn-call">
          <span>联系机构</span>
        </a>
      </div>
    </div>

    <!--二维码-->
    <template v-if="id">
      <qrcode-vue
        v-show="false"
        id="myCode"
        :value="BASEURL + '/show_h5/#/index?id=' + id + '&url_openid' + openid"
      ></qrcode-vue>
    </template>

    <!--海报-->
    <van-overlay :show="showImg" @click="showImg = false">
      <div class="post-img">
        <img :src="img" alt="" class="post-img" @click.stop />
        <div class="photo-btn" @click.stop>长按图片保存至相册</div>
      </div>
    </van-overlay>

    <!--活动规则 弹框-->
    <!-- <van-overlay :show="isRuleOpen" @click="isRuleOpen = false">
      <div class="rule" @click.stop>
        <div class="rule-top">
          <span>活动规则</span>
          <van-icon
            name="cross"
            class="rule-close"
            @click.stop="isRuleOpen = false"
          />
        </div>
        <div v-if="activeType == 1" class="content">
          1. 用户可在商品名额限制内，根据商品的新老生限购条件购买。 <br />
          2. 每种可购买商品，每名用户限购一份，不可重复购买同一件商品。<br />
          3. 高峰时段，如果同时下单的用户数过多，以下单成功先后顺序为准。<br />
          4. 可以在“报名记录”中查看活动订单。<br />
          5. 用户不能主动取消订单，如需退单，请联系机构。<br />
          6. 活动商品不参与机构的其他优惠（优惠券、订单推送等）
        </div>
        <div v-if="activeType == 2" class="content">
          1. 用户可在商品名额限制内，根据商品的新老生限购条件购买。<br />
          2. 每种可购买商品，每名用户限购一份，不可重复购买同一件商品。<br />
          3. 高峰时段，如果同时下单的用户数过多，以下单成功先后顺序为准。 <br />
          4. 可以在“报名记录”中查看活动订单。<br />
          5. 用户不能主动取消订单，如需退单，请联系机构。<br />
          6. 活动商品不参与机构的其他优惠（优惠券、订单推送等）
        </div>
        <div v-if="activeType == 3" class="content">
          1.
          参与用户自开团之时起；活动结束时间前，达到成团人数要求即拼团成功，在商品名额限制内下单成功的用户才算成功参团。<br />
          2. 在活动有效期内未达到成团人数要求，或商品提前售罄时均为拼团失败。<br />
          3. 高峰时段，如果同时下单的用户数过多，以下单成功先后顺序为准。<br />
          4. 可以在“报名记录”中查看活动订单。 <br />
          5. 用户不能主动退团或取消订单，如需退单，请联系机构。<br />
          6.
          拼团失败时，所付款项将在24小时内自动退款，实际退款时间以到账时间为准。<br />
          7. 活动商品不参与机构的其他优惠（优惠券、订单推送等）
        </div>
        <div v-if="activeType == 4" class="content">
          1. 用户可在活动名额限制内，根据活动的新老生限购条件购买。<br />
          2. 活动商品设有底价，用户砍到底价后或活动时间截止即结束。<br />
          3. 用户参与的砍价结束后，可以按照砍价结果进行支付。<br />
          4. 高峰时段，如果同时下单的用户数过多，以下单成功先后顺序为准。<br />
          5. 可以在“报名记录”中查看活动订单。 <br />
          6. 用户不能主动取消订单，如需退单，请联系机构。<br />
          7. 活动商品不参与机构的其他优惠（优惠券、订单推送等）
        </div>
        <div v-if="activeType == 5" class="content">
          1. 用户可在活动名额限制内，根据活动的新老生限购条件购买。<br />
          2.
          参与用户自参与之时起；活动结束时间前，达到助力成功所需助力包数即助力成功。<br />
          3. 在活动有效期内未达到助力包数要求则助力失败。 <br />
          4. 高峰时段，如果同时下单的用户数过多，以下单成功先后顺序为准。<br />
          5. 可以在“报名记录”中查看活动订单。<br />
          6. 用户不能主动取消订单，如需退单，请联系机构。<br />
          7. 活动商品不参与机构的其他优惠（优惠券、订单推送等）
        </div>
      </div>
    </van-overlay> -->

    <!--浏览数据-->
    <div class="viewer" v-if="!client">
      <span
        >浏览量： <b> {{ totalViewer }}</b></span
      >
      <span
        >分享：<b> {{ totalShare }}</b></span
      >
      <span
        >报名：<b> {{ userNum }}</b></span
      >
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import moment from "moment";
import { Notify, Toast } from "vant";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { yznReq } from "@/utils/yznhttp";
import { ysbPay } from "@/utils/ysbPay.js";
import ActiveTitle from "./components/ActiveTitle";
import ContentPackage from "@/components/ContentPackage.vue";
import PackageName from "./components/PackageName";
import ContentCustom from "./components/ContentCustom.vue";
import ContentRule from "./components/ContentRule.vue";
import UserGroup from "./components/UserGroup.vue";
import Bargain from "./components/Bargain.vue";
import HelpProgress from "./components/HelpProgress.vue";
import BargainUser from "./components/BargainUser.vue";
import BargainUserModal from "./components/BargainUserModal";
import ActiveGroup from "./components/ActiveGroup";
import ActiveGroupModal from "./components/ActiveGroupModal";
import Luck from "./components/Luck.vue";
import GroupBtn from "./components/buttons/GroupBtn.vue";
import FlashBtn from "./components/buttons/FlashBtn.vue";
import BargainBtn from "./components/buttons/BargainBtn.vue";
import HelpBtn from "./components/buttons/HelpBtn.vue";
import QrcodeVue from "qrcode.vue";
import { getShareData, getAge, getWxAuthorize } from "@/utils/utils.js";

import Group from "../../admin/views/components/group.vue";
export default {
  name: "index",
  created() {
    // alert(1)
    // alert(this.$route.query.url_openid)
    // return
    let id = this.$route.query.id;
    let referralDataId = this.$route.query.referralDataId;
    let groupId = this.$route.query.groupId;
    let openid = localStorage.getItem("yzn_openid");
    let phone = localStorage.getItem(`yzn_show_phone${id}`);
    let from_openid = this.$route.query.url_openid;
    let client = this.$route.query.client;

    this.terminal = this.$route.query.terminal;
    this.client = client;
    this.id = id;
    this.openid = openid;
    this.phone = phone;
    if (
      client ||
      this.$route.query.showChoiceLesson ||
      this.$route.query.showChoiceStu
    ) {
      // 不去授权
    } else {
      getWxAuthorize(id, from_openid, referralDataId, groupId);
    }

    if (from_openid !== "undefined" && from_openid) {
      this.fromOpenid = from_openid;
    }

    if (referralDataId && referralDataId != "undefined") {
      this.referralDataId = referralDataId;
    }

    if (groupId && groupId != "undefined") {
      this.groupId = this.$route.query.groupId;
    }
    if (
      this.$route.query.isJoinNow &&
      this.$route.query.isJoinNow != "undefined"
    ) {
      this.isJoinNow = this.$route.query.isJoinNow;
    }
    this.setActivityId(id);

    // if (!this.$route.query.fromRegis && !client && this.id && openid) {
    //   this.getPotentiaList();
    // }
    if (!phone) {
      this.setStuList([]);
    } else if (phone && this.id && !client && !this.$route.query.fromRegis) {
      this.getPotentiaList();
    }

    if ((this.id && openid) || client) {
      this.getDetail(true);
    }
  },
  destroyed: function () {
    if (this.mp3) this.mp3.pause();
    this.mp3 = null;
    this.setIndexPop({
      show: false,
    })
  },
  data() {
    return {
      terminal: "", // 只有pc端扫码预览才传 pc
      client: "", // 不传   微信端  oa  OA端
      fromOpenid: "",
      //fromContentId: "",
      status: 2, // 1 未开始 2 进行中 3 已结束 4 已下架

      id: "",
      openid: "",
      phone: "", // 用户电话号码

      allData: {},
      bgStyle: "",
      topUrl: "",

      name: "",
      endTime: "",
      beginTime: "",
      packages: [],
      allowPackages: [],
      rejectPackages: [],

      activeType: "",
      activeContent: "",
      list: [],

      choiceStu: false,
      stuList: [],
      latentStu: [], // 潜客
      historyStu: [], // 历史客户
      currentStu: [], // 当前客户

      currentStuItem: {},

      choiceLesson: false,

      lessonForbid: [],
      chooseLogin: false,
      choicePin: false,
      // showSucc: false,
      // showSuccText: '',

      showShare: false,
      shareSty: 1,

      popImg: "",
      pinLists: [{}],

      userGroupType: 1,
      //groupType: "", // 默认空  传入1代表从发起拼团点击时要显示课程选择
      ruleType: 1, // 1 多学员梯度样式  2.单学员梯度样式

      showHelp: false, // 助力包框显示
      helpType: 2, // 助力框类型 1 转盘  2 结果文字
      helpPackage: 0,
      curJoin: {},
      //deadTime: "", // 付款截至时间文字  （xx天xxx小时）
      //payDeadline: "",

      joinList: [],
      showHelpLog: false,
      showGroupLog: false,

      detailJoinList: [], // 砍价 助力 详情列表
      detailJoinType: "",
      detailJoinTotal: 0,

      isPaused: true,
      curMusic: "",

      activityInfo: {}, // 用于海报图的活动信息
      img: "", // 海报图
      showImg: false, // 分享海报图开关
      distSwitch: false,
      topColor: "",
      upDownStatus: 1, // 活动是否下架   -1 下架

      box_style: {},
      content: {},
      title_style: {},
      titleZoom: {},
      titleTxtStyle: {},
      contentStyleTop: {},
      contentStyleBottom: {},

      groupId: "",
      isJoinNow: "", // 分享拼团时 点击页面中的立即参团
      showGroupLog: false,
      limit: {
        // 参与限制
        signUpLimit: "",
        limitNum: "",
      },
      referralDataId: "",

      totalViewer: "",
      totalShare: "",
      userNum: "",
      showActivityJoin: "",
      mp3: "",

      // isRuleOpen: false,
    };
  },
  mounted() {
    const that = this;
    window.addEventListener("shareEvent", function (event) {
      that.showShare = false;
      that.showHelp = false;
    });
  },

  methods: {
    getAge,
    showPop() {
      let showChoiceLesson = this.$route.query.showChoiceLesson;
      let showChoiceStu = this.$route.query.showChoiceStu;
      if (showChoiceLesson) {
        this.choiceLesson = true;
        this.cleanSelectedCourse();
      }
      if (showChoiceStu) {
        this.choiceStu = true;
      }
    },
    closeHelp() {
      if (this.helpType == 1) {
        return;
      } else {
        this.showHelp = false;
      }
    },
    audioAutoPlay() {
      this.mp3 = new Audio(this.curMusic);
      let p = localStorage.getItem("yzn_music");
      if (p == 1 || !p) {
        this.mp3.play();
        this.isPaused = false;
      } else {
        this.isPaused = true;
      }
    },
    clean() {
      localStorage.removeItem("yzn_openid");
      if (process.env.NODE_ENV == "development") {
        window.location.replace(`/weChat.html#/index?id=${this.id}`);
      } else if (process.env.NODE_ENV == "test") {
        window.location.replace(`/show_h5/#/index?id=${this.id}`);
      }
    },
    toChoiceLesson() {
      this.choiceLesson = true;
    },
    async getPotentiaList() {
      let res = await yznReq("get", "api/oa/show/listPotentialCustomer", {
        activityId: this.id,
        // openid: localStorage.getItem("yzn_openid") || undefined,
        phone: this.phone,
      });
      if (res.status == 200) {
        this.stuList = res.context;
        this.setStuList(res.context);

        let latentStu = [],
          historyStu = [],
          currentStu = [];
        res.context.map((i) => {
          if (i.studentStatus * 1 === 0 && i.contractStatus * 1 === 0) {
            latentStu.push(i);
          } else if (i.studentStatus * 1 === 0 && i.contractStatus * 1 === 1) {
            currentStu.push(i);
          } else if (i.studentStatus * 1 === 1 && i.contractStatus * 1 === 1) {
            historyStu.push(i);
          }
        });
        this.latentStu = latentStu;
        this.historyStu = historyStu;
        this.currentStu = currentStu;

        if (res.context && res.context.length == 1) {
          // 单学员直接选中学员
          this.setSelectedStu(res.context[0]);
          let cur = res.context[0];
          cur.checkedStatus = true;
          let listName = "";
          if (cur.studentStatus * 1 === 0 && cur.contractStatus * 1 === 0) {
            listName = "latentStu";
          } else if (
            cur.studentStatus * 1 === 0 &&
            cur.contractStatus * 1 === 1
          ) {
            listName = "currentStu";
          } else if (
            cur.studentStatus * 1 === 1 &&
            cur.contractStatus * 1 === 1
          ) {
            listName = "historyStu";
          }
          this[listName] = res.context;
          this.currentStuItem = cur;
        }
        if (res.context && !res.context.length) {
          // 无学员清空选中学员
          this.clearSelectedStu();
        }
      }
    },
    async getDetail(fl, isComfirm) {
      let res = await yznReq("get", "api/oa/show/detailH5", {
        activityId: this.id,
        openid: localStorage.getItem("yzn_openid") || undefined,
        fromOpenid: this.fromOpenid || undefined,
        groupId: this.groupId || undefined,
      });
      if (res && res.status == 200) {
        res = res.context;

        this.totalViewer = res.totalViewer;
        this.totalShare = res.totalShare;
        this.userNum = res.userNum;

        this.upDownStatus = res.upDownStatus;
        if (res.upDownStatus == -1) {
          Toast("活动已下架");
        }
        this.status = res.activityStatus;

        this.distSwitch = res.distSwitch;

        this.showActivityJoin = res.showActivityJoin;
        if (!this.curMusic) {
          this.curMusic = res.music && res.music.fileUrl;
        }
        this.joinList = res.joinList || [];
        let pho, phoNum;
        // let own = res.showActivityJoin ? res.showActivityJoin : res.owner;

        // if (res.showActivityJoin) {
        //   phoNum = res.showActivityJoin.phone
        //   pho = res.showActivityJoin.phone;
        //   pho = pho.slice(0, 3) + " **** " + pho.slice(7, 11);
        // } else if (res.owner) {
        //   if (res.activityType == 3) {
        //     pho = "爱拼才会赢，一起来拼，享受活动优惠吧~";
        //   } else if (res.activityType == 4) {
        //     pho = "江湖救急，帮我砍一刀~";
        //   } else {
        //     pho =
        //       res.owner.phone.slice(0, 3) +
        //       " **** " +
        //       res.owner.phone.slice(7, 11);
        //   }
        // }
        let own = res.owner ? res.owner : res.showActivityJoin;
        if (res.showActivityJoin) {
          phoNum = res.showActivityJoin.phone;
        }
        if (res.owner) {
          if (res.activityType == 3) {
            pho = "爱拼才会赢，一起来拼，享受活动优惠吧~";
          } else if (res.activityType == 4) {
            pho = "江湖救急，帮我砍一刀~";
          } else {
            pho =
              res.owner.phone.slice(0, 3) +
              " **** " +
              res.owner.phone.slice(7, 11);
          }
        } else if (res.showActivityJoin) {
          pho =
            res.showActivityJoin.phone.slice(0, 3) +
            " **** " +
            res.showActivityJoin.phone.slice(7, 11);
        }
        this.activityInfo = {
          shareImageUrl: res.shareImageUrl,
          activityName: res.shareTitle,
          shareDesc: res.shareDesc,
        };
        this.setActiveJoin({
          nickname: own ? own.nickname : "",
          headimgurl: own ? own.headimgurl : "",
          phone: pho,
          phoneNum: phoNum,
          openid: own ? own.openid : "",
          //isJoinSelf: res.showActivityJoin ? 1 : 0,
        });

        this.setActiveType(res.activityType);
        this.setActiveContent(res.contentType);
        this.setContentStyle(res);
        this.setInfo(res.info);
        this.setPhone(res.shopPhone);

        this.name = res.activityName;
        this.beginTime = moment(res.beginTime);
        this.endTime = moment(res.endTime);

        this.activeType = res.activityType;
        this.activeContent = res.contentType;

        this.packages = res.showContentList;
        this.setPackageLen(res.showContentList && res.showContentList.length);

        if (this.getSelectedStu) {
          this.checkLessons();
        }
        if (this.getActiveType !== 2 || this.packages.length == 1) {
          this.cleanSelectedCourse();
          this.addSelectedCourse(this.packages[0]);
        } else {
          this.cleanSelectedCourse();
        }

        this.limit = {
          limitNum: res.limitNum,
          signUpLimit: res.signUpLimit,
        };

        this.detailH5 = res;

        let joininfo = {
          activityId: res.activityId,
          activityType: res.activityType,
          openid: localStorage.getItem("yzn_openid"),
          shopId: res.shopId,
        };
        this.joininfo = joininfo;

        getShareData(
          res.shareTitle,
          res.shareDesc,
          res.shareImageUrl,
          joininfo,
          fl ? this.audioAutoPlay : ""
        );
        if (!isComfirm) {
          this.showPop();
        }
      }
    },
    // 拼团相关状态
    getGroupStatus(res) {
      console.log(res.showActivityJoin);
      if (res.showActivityJoin && res.showActivityJoin.joinId) {
        this.userGroupType = 3;
      } else {
        this.userGroupType = 1;
      }
    },
    getUserRuleIndex(item) {
      if (item.myGroup && item.myGroup.length > 1) {
        this.ruleType = 1;
        return -2;
      } else if (item.myGroup && item.myGroup.length == 1) {
        this.ruleType = 2;
        return item.myGroup[0].index;
      }
    },
    // 我要报名
    joinActive(type) {
      // 再报一个
      if (type == "contin") {
        this.isContinue = true;
      } else {
        this.isContinue = false;
      }


      if (this.packages.length == 1 && this.packages[0].placesLimit == 1 && this.packages[0].remainingAllowed <= 0) {
        Toast('活动名额已满')
        return
      }

      if (this.$route.query.showChoiceLesson) {
        this.choiceLesson = true;
      } else if (this.getStuList && this.getStuList.length >= 1) {
        this.clearCurStuId();
        this.isJoinNow = false;
        this.choiceStu = true;
      } else {
        this.isJoinNow = false;
        this.toLogin();
      }
    },
    // 立即参团(从页面上方课程中点击)
    toJoinNow(obj) {
      let course = this.packages.find((i) => i.contentId == obj.contentId);
      this.addSelectedCourse(course);
      this.groupId = obj.groupId;
      this.fromOpenid = this.fromOpenid;
      if (this.getStuList && this.getStuList.length) {
        this.clearCurStuId();
        this.isJoinNow = true;
        this.choiceStu = true;
      } else {
        this.isJoinNow = true;
        this.toLogin(1);
      }
    },
    // 选学员确定
    submitChoiceStu() {
      if (!this.currentStuItem || !this.currentStuItem.id) {
        Notify("请选择学员");
        return;
      }
      if (this.currentStuItem && this.currentStuItem.id) {
        this.setSelectedStu(this.currentStuItem);
      }

      // 抢购 选课程
      if (this.getActiveType == 2 && this.packages.length > 1) {
        this.choiceStu = false;
        this.choiceLesson = true;
      } else if (
        (this.getActiveType == 1 && this.packages[0].paySwitch) ||
        (this.getActiveType == 2 && this.packages.length == 1) ||
        this.getActiveType == 3
      ) {
        // 要付钱的要确认订单
        // 1.微传单线上付款的 2.抢购 3.拼团
        if (this.isJoinNow && this.getActiveType == 3) {
          this.$router.push({
            path: "/comfirm",
            query: {
              fromOpenid: this.openid,
              groupId: this.groupId,
              referralDataId: this.referralDataId,
            },
          });
        } else {
          this.$router.push({
            path: "/comfirm",
            query: {
              fromOpenid: this.fromOpenid,
              referralDataId: this.referralDataId,
            },
          });
        }
      } else if (
        (this.getActiveType == 1 && !this.packages[0].paySwitch) ||
        this.getActiveType == 4 ||
        this.getActiveType == 5
      ) {
        // 微传单线下付款  抢购  助力  参加活动
        this.comfirmPay();
        this.choiceStu = false;
      }

      //  else if (this.getActiveType == 2 && this.packages.length > 1) {
      //   this.choiceStu = false;
      //   this.choiceLesson = true;
      // }
    },
    // 设置区块样式
    setContentStyle(res) {
      this.bgStyle = {
        background: `url(${res.bg && res.bg.fileUrl})`,
      };
      this.topUrl = res.top.fileUrl;
      this.topColor = res.top.topColor;
      let b = JSON.parse(res.block.content);
      this.list = JSON.parse(res.content);
      this.popImg = b.popPic;

      this.titleZoom = {};
      b.titleAlign == 1
        ? ((this.titleZoom["left"] = "50%"),
          (this.titleZoom["transform"] = "translateX(-50%)"))
        : (this.titleZoom["left"] = b.titleAlignDis * 2 + "px");

      //title主题top值
      this.titleZoom["top"] = Number(b.titleFrameMarginTop / 37.5) + "rem";
      this.titleZoom["--minWidth"] = b.minWidth / 37.5 + "rem";
      this.titleZoom[
        "--background"
      ] = `url(${b.titleFrame2}) center center/auto 100%`;
      this.content = b;
      // 标题样式汇总
      this.title_style = {
        "--background": `url(${b.titleFrame2}) center center/auto 100%`,
        "--titlePadding": "0 " + b.titleSides / 37.5 + "rem", //标题框左右padding值
        "--titleTop": Number(b.titleMarginTop / 37.5) + "rem ", //标题文字距顶高度
        "--titleColor": b.titleColor, //标题文字颜色
        "--titleSize": b.titleFontsize / 37.5 + "rem", //标题字体大小
      };
      // box样式汇总
      this.box_style = {
        "margin-top": b.frameMarginTop / 37.5 + "rem", //内容区块距顶
        "--contentFrame4": `url('${b.contentFrame4}') center center/100% repeat`, //左
        "--contentFrame5": `url('${b.contentFrame5}') center center/100% repeat`, //中
        "--contentFrame6": `url('${b.contentFrame6}') center center/100% repeat`, //右
        "--left": -b.contentSizes / 37.5 + "rem",
        "--right": -b.contentSizes / 37.5 + "rem",
        "--contentColor": b.contentColor, //文字颜色
        "--contentSize": b.contentFontsize / 37.5 + "rem",
        //内容区块padding值
        padding:
          b.contentMarginTop / 37.5 +
          "rem " +
          (b.contentSizes / 37.5 + "rem ") +
          (b.contentMarginBottom / 37.5 + "rem"),
      };

      this.titleTxtStyle = {
        "padding-top": Number(b.titleMarginTop / 37.5) + "rem",
        "font-size": b.titleFontsize / 37.5 + "rem",
        color: b.titleColor,
      };

      this.contentStyleTop = {
        "--contentFrame_center": `url('${b.contentFrame2}') center center/100% 100%`,
        "--contentFrame3": `url('${b.contentFrame3}') center center/100% 100% no-repeat`,
        "--contentFrame1": `url('${b.contentFrame1}') center center/100% 100% no-repeat`,
      };
      this.contentStyleBottom = {
        "--contentFrame_center": `url('${b.contentFrame8}') center center/100% 100%`,
        "--contentFrame7": `url('${b.contentFrame7}') center center/100% 100%`,
        "--contentFrame9": `url('${b.contentFrame9}') center center/100% 100%`,
      };
    },
    continueJoin() {
      if (this.getStuList && this.getStuList.length > 1) {
        this.clearCurStuId();
        this.choiceStu = true;
      } else if (this.getStuList && this.getStuList.length == 1) {
        this.choiceLesson = true;
      } else if (!this.getStuList || !this.getStuList.length) {
        this.chooseLogin = true;
      }
      this.cleanSelectedCourse();
    },
    toRegister() {
      this.$router.push({
        path: "/register",
        query: {
          //contentId: this.fromContentId,
          fromOpenid: this.fromOpenid,
          groupId: this.groupId,
          isJoinNow: this.isJoinNow,
          referralDataId: this.referralDataId,
        },
      });
    },
    toInvite() {
      this.$router.push({
        path: "/invite",
        query: {
          id: this.id,
        },
      });
    },
    toLogin(isJoinNow) {
      if (isJoinNow) {
        this.$router.push({
          path: "/login",
          query: {
            fromOpenid: this.fromOpenid,
            groupId: this.groupId,
            isJoinNow: true,
            referralDataId: this.referralDataId,
          },
        });
      } else {
        this.$router.push({
          path: "/login",
          query: {
            fromOpenid: this.fromOpenid,
            groupId: this.groupId,
            referralDataId: this.referralDataId,
          },
        });
      }
    },
    // 选课程确定
    toComfirm() {
      if (!this.getSelectedCourse.length) {
        Notify("请选择课程");
        return;
      }
      this.choiceLesson = false;
      this.choiceStu = false;
      this.$router.push({
        path: "/comfirm",
        query: {
          fromOpenid: this.fromOpenid,
          referralDataId: this.referralDataId,
        },
      });
    },
    // 凑团
    toJoinComfirm(item) {
      this.choiceLesson = false;
      this.choiceStu = false;
      this.$router.push({
        path: "/comfirm",
        query: {
          fromOpenid: item.openid,
          groupId: item.groupId,
          referralDataId: this.referralDataId,
        },
      });
    },
    showPin() {
      let id = this.getSelectedCourse[0].contentId;
      let curlist = this.packages.find((item) => item.contentId == id);
      this.pinLists = curlist.activityJoinList;
      this.choiceLesson = false;
      this.choicePin = true;
    },
    toRecord() {
      this.$router.push({ path: "/record" });
    },
    // 检查课程是否允许用户报名
    checkLessons() {
      let arr = [],
        rejectArr = [];
      if (this.getActiveType == 3) {
        this.packages.map((i) => {
          arr.push(i);
        });
      } else {
        this.packages.map((i) => {
          if (i.limitItems == 0) {
            // 不限制
            arr.push(i);
          } else {
            if (this.getSelectedStu.old) {
              if (i.limitItems == 1) {
                rejectArr.push(i);
              } else {
                arr.push(i);
              }
            } else {
              if (i.limitItems == 2) {
                rejectArr.push(i);
              } else {
                arr.push(i);
              }
            }
          }
        });
      }
      this.allowPackages = this.checkIsSelected(arr);
      this.rejectPackages = rejectArr;
    },
    // 检查课程是否加入购物车
    checkIsSelected(list) {
      list.forEach((i) => {
        let is = this.getSelectedCourse.some((val) => {
          return val.contentId == i.contentId;
        });
        if (is) {
          i.isSelected = true;
        } else {
          i.isSelected = false;
        }
      });
      return list;
    },
    // 加入购物车
    addShopCart(item) {
      if (this.limit.signUpLimit == 1) {
        let n = this.limit.limitNum;
        if (this.getSelectedCourse.length >= n) {
          Toast(`每人最多报${n}门`);
          return;
        }
      }
      this.addSelectedCourse(item);
    },
    removeShopCart(item) {
      this.removeSelectedCourse(item.contentId);
    },
    comfirmPay: throttle(async function () {
      let id = this.packages[0].contentId;
      let conIds = [id];
      let params = {
        // groupId: this.groupId ? this.groupId : undefined,
        activityId: this.id,
        openid: this.openid, // 微信ID
        referralDataId:
          this.referralDataId && this.referralDataId != "undefined"
            ? this.referralDataId
            : undefined,
        fromOpenid: this.fromOpenid ? this.fromOpenid : undefined,
        potentialCustomer: {
          // 学员对象
          potentialCustomerId:
            this.getSelectedStu.potentialCustomerId || undefined, // 老学员要传
          name: this.getSelectedStu.name, // 学员信息
          potentialCustomerParentPhone: this.getSelectedStu
            .potentialCustomerParentPhone, // 电话
        },
        contentIds: conIds,
      };

      if (this.getSelectedStu.old) {
        params.potentialCustomer[
          "potentialCustomerId"
        ] = this.getSelectedStu.potentialCustomerId;
      }
      let res = await yznReq("post", "api/oa/show/joinActivity", params);
      if (res && res.status == 200) {
        this.getDetail(true, true);
        this.$router.replace({
          path: "/index",
          query: {
            url_openid: this.fromOpenid,
            groupId: this.groupId,
            referralDataId: this.referralDataId,
            id: this.id,
          },
        });
        if (this.getActiveType == 1) {
          this.setIndexPop({
            show: true,
            btn: "我知道了",
            type: "1",
            title: "恭喜您！报名成功",
            desc: "您已报名，我们将会尽快与您联系完善入学事宜",
          });
        } else if (this.getActiveType == 4) {
          Toast("报名成功，先自砍一刀试试手气吧");
          this.$router.push({
            path: "/index",
            query: {
              id: this.id,
              referralDataId: this.$route.query.referralDataId,
            },
          });
          window.location.reload();
        } else if (this.getActiveType == 5) {
          Toast("报名成功，先为自己助力试试手气吧！");
          this.$router.push({
            path: "/index",
            query: {
              id: this.id,
              referralDataId: this.$route.query.referralDataId,
            },
          });
          window.location.reload();
        }
      }
    }, 1000),
    setCurrentStuId(item, list, name) {
      this.clearCurStuId(name);
      let arr = list;
      arr.forEach((i) => {
        if (i.id != item.id) {
          i.checkedStatus = false;
        }
      });
      this[name] = arr;
      if (item.checkedStatus) {
        this.currentStuItem = item;
      } else {
        this.currentStuItem = {};
      }
      this.$forceUpdate();
    },
    // 清空列表， 默认全清空， 输入内容的话只保留输入的列表
    clearCurStuId(listName) {
      let arrLat = [],
        arrHis = [],
        arrCur = [];
      if (!listName || listName !== "latentStu") {
        this.latentStu.map((i) => {
          i.checkedStatus = false;
          arrLat.push(i);
        });
      }
      if (!listName || listName !== "historyStu") {
        this.historyStu.map((i) => {
          i.checkedStatus = false;
          arrHis.push(i);
        });
      }
      if (!listName || listName !== "currentStu") {
        this.currentStu.map((i) => {
          i.checkedStatus = false;
          arrCur.push(i);
        });
      }
      this.latentStu = arrLat;
      this.historyStu = arrHis;
      this.currentStu = arrCur;
    },
    // 打开分享引导
    toShowShare(item) {
      // 拼团 分享时候传入contentId
      let join = Object.assign({}, this.joininfo, {
        groupId: item && item.groupId,
      });

      getShareData(
        this.detailH5.shareTitle,
        this.detailH5.shareDesc,
        this.detailH5.shareImageUrl,
        join
      );
      this.showSucc = false;
      this.showShare = true;
      item.shareSty ? (this.shareSty = item.shareSty) : (this.shareSty = 1);
    },
    // 关闭成功弹框
    closeShowSucPop() {
      this.setIndexPop({
        show: false,
      });
    },
    // 助力弹框
    toShowHelp(i) {
      this.getDetail();
      let joinId = "";
      let curJoin = {};
      if (i) {
        joinId = i.joinId;
        curJoin = i;
      } else {
        if (this.joinList) {
          joinId = this.joinList[0].joinId;
          curJoin = this.joinList[0];
        } else {
        }
      }

      if (this.fromOpenid && this.fromOpenid != this.openid) {
        // 点击他人助力
        yznReq(
          "post",
          "api/oa/show/helped",
          {
            joinId,
            openid: localStorage.getItem("yzn_openid"),
          },
          "205",
          true
        )
          .then((res) => {
            if (res.status == 200) {
              this.helpType = 1;
              setTimeout(() => {
                this.showHelp = true;
                this.helpPackage = String(res.context.downNumber);
                this.$refs.luck.onStart(String(res.context.downNumber));
                this.curJoin = curJoin;
              }, 500);
            } else {
              this.helpType = 4;
              this.showHelp = true;
            }
          })
          .catch((err) => {
            this.helpType = 4;
            this.showHelp = true;
          });
      } else {
        // 自己点击助力
        if (!joinId) {
          if (this.getStuList.length) {
            this.clearCurStuId();
            this.choiceStu = true;
          } else {
            this.chooseLogin = true;
          }
        } else {
          yznReq(
            "post",
            "api/oa/show/helped",
            {
              joinId,
              openid: localStorage.getItem("yzn_openid"),
            },
            "205",
            true
          )
            .then((res) => {
              if (res.status == 200) {
                this.helpType = 1;
                setTimeout(() => {
                  this.showHelp = true;
                  this.helpPackage = String(res.context.downNumber);
                  this.$refs.luck.onStart(String(res.context.downNumber));
                  this.curJoin = curJoin;
                }, 500);
              } else {
                this.helpType = 3;
                this.curJoin = curJoin;
                this.showHelp = true;
              }
            })
            .catch((err) => {
              this.showHelp = true;
              this.helpType = 3;
              this.curJoin = curJoin;
            });
        }
      }
      return;
    },
    // 立刻付款 (助力)
    toPayHelp(join) {
      // yznReq("post", "api/oa/show/activityPay", {
      //   joinId: joinid,
      //   openid: localStorage.getItem("yzn_openid"),
      // }).then((res) => {
      //   if (res.status == 200) {
      //     ysbPay(res.context.orderId, res.context.appId);
      //   }
      // });
      // console.log(join)
      this.setSelectedStu(join.potentialCustomer)

      this.$router.push({
        path: "/comfirm",
        query: {
          joinId:join.joinId,
          currentPrice: join.currentPrice
        },
      });
    },
    rollEnd() {
      setTimeout(() => {
        this.helpType = 2;
        this.getDetail();
      }, 1000);
    },
    // 砍价
    cutPay(item) {
      if (
        item.selfCutStatus != -1 ||
        !this.fromOpenid ||
        this.fromOpenid == this.openid
      ) {
        yznReq(
          "post",
          "api/oa/show/cutPrice",
          {
            joinId: item.joinId,
            openid: localStorage.getItem("yzn_openid"),
          },
          "205"
        ).then((res) => {
          if (res.status == 200) {
            if (res.context.activitySuccess == 1) {
              // 砍价成功
              if (!this.fromOpenid || this.fromOpenid == this.openid) {
                this.setIndexPop({
                  show: true,
                  btn: "我知道了",
                  type: "1",
                  title: "恭喜您,已砍到底价!",
                  desc: "赶快去享受优惠活动吧。",
                });
              } else {
                this.setIndexPop({
                  show: true,
                  btn: "确定",
                  type: "1",
                  title: `好友已砍价成功啦!`,
                });
              }
            } else {
              if (!this.fromOpenid || this.fromOpenid == this.openid) {
                this.setIndexPop({
                  show: true,
                  btn: "邀请好友帮砍",
                  type: "2",
                  title: `已砍${res.context.downPrice}元,还剩${res.context.remainPrice}元`,
                  desc: "您还可以邀请好友帮砍！",
                });
              } else {
                this.setIndexPop({
                  show: true,
                  btn: "确定",
                  type: "1",
                  title: `哇!帮助好友砍了${res.context.downPrice}元`,
                  desc: "赶快告诉好友吧!",
                });
              }
            }
          } else if (res.status == 205) {
            this.setIndexPop({
              show: true,
              btn: "确定",
              type: "1",
              title: res.message,
            });
          }
          this.getDetail();
        });
      } else if (item.selfCutStatus == -1) {
        this.setIndexPop({
          show: true,
          btn: "邀请好友砍价",
          type: "2",
          title: `自砍次数用完`,
          desc: "邀请好友砍价即可有机会享受最低价哦~",
        });
      }
    },
    //
    videoChange() {
      if (this.isPaused) {
        this.mp3.play();
        this.isPaused = false;
        localStorage.setItem("yzn_music", 1);
      } else {
        this.mp3.pause();
        this.isPaused = true;
        localStorage.setItem("yzn_music", 2);
      }
    },
    showLog(obj) {
      this.showHelpLog = true;
      this.detailJoinType = obj.type;
      this.detailJoinList = obj.list;
      this.detailJoinTotal = obj.total || 0;
    },
    showLogClose() {
      this.showHelpLog = false;
    },
    groupLogClose() {
      this.showGroupLog = false;
    },
    getPost() {
      this.makePost((src) => {
        this.img = src;
        this.showImg = true;
        console.log("图片生成成功", src);
      });
    },
    toRule() {
      if (!this.client) {
        window.location.href =
          "https://www.chosien.com/mWeb/index.html?id=8#/Templates?id=8";
      }
    },
    // 生成海报
    makePost(fn) {
      let that = this,
        userInfo = JSON.parse(localStorage.getItem("userInfo"));

      try {
        //圆角矩形
        function roundRect(context, x, y, w, h, r, fn, options) {
          context.save();
          if (w < 2 * r) r = w / 2;
          if (h < 2 * r) r = h / 2;
          context.moveTo(x + r, y);
          context.arcTo(
            x + w,
            y,
            x + w,
            y + h,
            !options || options.rightTop ? r : 0
          );
          context.arcTo(
            x + w,
            y + h,
            x,
            y + h,
            !options || options.rightBot ? r : 0
          );
          context.arcTo(x, y + h, x, y, !options || options.leftBot ? r : 0);
          context.arcTo(x, y, x + w, y, !options || options.leftTop ? r : 0);
          context.clip();
          if (fn) {
            fn();
            ctx.restore();
          }
        }
        function getCirclePic(ctx, x, y, r, pic, dx, dy, dWidth, dHeight) {
          //  x:圆心x轴位置
          //  y:圆心x轴位置
          //  r:圆半径
          //  pic:图片
          //  dx:图片左上角x轴位置
          //  dy:图片左上角y轴位置
          //  dWidth:图片的宽
          //  dHeight:图片的高
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.clip();
          ctx.drawImage(pic, dx, dy, dWidth, dHeight);
          ctx.restore();
        }
        function canvasTextAutoLine(str, canvas, initX, initY, lineHeight) {
          let ctx = canvas.getContext("2d");
          let lineWidth = 0;
          let canvasWidth = canvas.width;
          let lastSubStrIndex = 0;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > (canvasWidth / 8) * 6.1) {
              ctx.fillText(
                str.substring(lastSubStrIndex, i),
                canvasWidth / 2,
                initY
              );
              initY += lineHeight;
              lineWidth = 0;
              lastSubStrIndex = i;
            }
            if (i == str.length - 1) {
              ctx.fillText(
                str.substring(lastSubStrIndex, i + 1),
                canvasWidth / 2,
                initY
              );
            }
          }
          return initY;
        }
        function convertCanvasToImage(canvas) {
          let img_ = new Image();
          img_.src = canvas.toDataURL("image/png", 1);
          return img_;
        }
        //默认canvas宽高为 300 * 430;
        let currentW = ((300 * 2) / 375) * document.documentElement.clientWidth,
          currentH = (currentW * 518 * 2) / (300 * 2),
          imgone = new Image(),
          imgQrcode = new Image(),
          imgHead = new Image(),
          zoom = document.documentElement.clientWidth / 375;
        let mycanvas = document.createElement("canvas"); //海报画布
        imgone.crossOrigin = "Anonymous";
        imgQrcode.crossOrigin = "Anonymous";
        imgHead.crossOrigin = "Anonymous";
        // 获取二维码地址
        imgQrcode = convertCanvasToImage(document.getElementById("myCode"));
        imgone.src = that.activityInfo.shareImageUrl;
        imgHead.src = userInfo.headimgurl;

        mycanvas.width = currentW;
        mycanvas.height = currentH;
        mycanvas.style.display = "none";
        let ctx = mycanvas.getContext("2d");
        let promiseAll = [
          new Promise(function (resolve, reject) {
            imgone.onload = function () {
              resolve(imgone);
            };
          }),
          new Promise(function (resolve, reject) {
            imgQrcode.onload = function () {
              resolve(imgQrcode);
            };
          }),
          new Promise(function (resolve, reject) {
            imgHead.onload = function () {
              resolve(imgHead);
            };
          }),
        ];

        Promise.all(promiseAll).then((item) => {
          roundRect(ctx, 0, 0, currentW, currentH, 4 * 2 * zoom, function () {
            // 白色背景
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, currentW, currentH);
          });
          // 微信头像
          getCirclePic(
            ctx,
            35 * 2 * zoom,
            36 * 2 * zoom,
            20 * 2 * zoom,
            imgHead,
            15 * 2 * zoom,
            16 * 2 * zoom,
            40 * 2 * zoom,
            40 * 2 * zoom
          );
          // 昵称
          ctx.fillStyle = "#282828";
          ctx.font = 12 * 2 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText(userInfo.nickname, 60 * 2 * zoom, 33 * 2 * zoom);

          ctx.fillStyle = "#AAA1A1";
          ctx.font = 11 * 2 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText(
            "我发现一个很棒的活动，邀请你一起来参加！",
            60 * 2 * zoom,
            51 * 2 * zoom
          );

          // 活动顶部图
          roundRect(
            ctx,
            15 * 2 * zoom,
            66 * 2 * zoom,
            270 * 2 * zoom,
            270 * 2 * zoom,
            4 * 2 * zoom,
            function () {
              ctx.drawImage(
                imgone,
                15 * 2 * zoom,
                66 * 2 * zoom,
                270 * 2 * zoom,
                270 * 2 * zoom
              );
            },
            {
              rightTop: true,
              leftBot: false,
              rightBot: false,
              leftTop: true,
            }
          );

          // 活动名称
          roundRect(
            ctx,
            15 * 2 * zoom,
            336 * 2 * zoom,
            270 * 2 * zoom,
            34 * 2 * zoom,
            4 * 2 * zoom,
            function () {
              ctx.fillStyle = "#FB9542";
              ctx.fillRect(
                15 * 2 * zoom,
                336 * 2 * zoom,
                270 * 2 * zoom,
                34 * 2 * zoom
              );
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#fff";
              ctx.font = 13 * 2 * zoom + "px PingFang-SC-Heavy";
              ctx.fillText(
                that.activityInfo.activityName,
                currentW / 2,
                353 * 2 * zoom
              );
            },
            {
              rightTop: false,
              leftBot: true,
              rightBot: true,
              leftTop: false,
            }
          );
          // 三角形
          ctx.beginPath();
          ctx.moveTo(currentW / 2 - 7 * 2 * zoom, 370 * 2 * zoom);
          ctx.lineTo(currentW / 2 + 7 * 2 * zoom, 370 * 2 * zoom);
          ctx.lineTo(currentW / 2, 378 * 2 * zoom);
          ctx.closePath();
          ctx.fillStyle = "#FB9542";
          ctx.strokeStyle = "#FB9542";
          ctx.fill();
          ctx.stroke();
          // 二维码
          ctx.drawImage(
            imgQrcode,
            currentW / 2 - 50 * 2 * zoom,
            388 * 2 * zoom,
            100 * 2 * zoom,
            100 * 2 * zoom
          );
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#FB9542";
          ctx.font = 12 * 2 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText("长按识别二维码进入活动", currentW / 2, 503 * 2 * zoom);
          // 生成base64海报地址
          let img = convertCanvasToImage(mycanvas);
          fn(img.src);
          // document.body.insertBefore(img, document.body.firstElementChild);
        });
      } catch (e) {
        console.log(e);
        Toast("生成海报失败，请重试！");
      }
    },
    ...mapMutations("common", [
      "setActiveType",
      "setActiveContent",
      "addSelectedCourse",
      "removeSelectedCourse",
      "setInfo",
      "setActivityId",
      "setSelectedStu",
      "setStuList",
      "clearSelectedStu",
      "cleanSelectedCourse",
      "setActiveJoin",
      "setIndexPop",
      "setPhone",
      "setPackageLen",
    ]),
  },
  computed: {
    totalPrice() {
      let p = 0;
      this.getSelectedCourse.map((i) => {
        if (this.getActiveType == 4) {
          return p;
        }
        if ((i.paySet == 2 || i.paySet == 3) && this.getActiveType != 4) {
          p += i.prepaidAmount;
        }
        if (this.getActiveType == 2) {
          p += i.floorPrice;
        }
      });
      return p;
    },
    ...mapGetters([
      "getSelectedStu",
      "getSelectedCourse",
      "getStuList",
      "getActiveType",
      "getActiveJoin",
      "getIndexPop",
      "getShopPhone",
    ]),
  },
  components: {
    ActiveTitle,
    PackageName,
    ContentCustom,
    ContentPackage,
    ContentRule,
    UserGroup,
    HelpProgress,
    Bargain,
    BargainUser,
    Luck,
    BargainUserModal,
    QrcodeVue,
    GroupBtn,
    Group,
    FlashBtn,
    BargainBtn,
    HelpBtn,
    ActiveGroup,
    ActiveGroupModal,
    // ContentRule,
  },
  watch: {
    getSelectedCourse: function (val) {
      this.allowPackages = this.checkIsSelected(this.allowPackages);
      this.$forceUpdate();
    },
    getSelectedStu: function (val) {
      this.checkLessons();
    },
  },
  //音乐播放问题，首页外的路由返回无法播放，刷下页面
  beforeRouteEnter(to, from, next) {
    next(() => {
      if (to.name == "Index" && from.name) {
        window.location.reload();
      }
    });
  },
};
</script>
<style  lang="less" scoped>
@import "index.less";
</style>
