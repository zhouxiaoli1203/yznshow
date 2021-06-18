 import moment from "moment";
 import { Dialog } from "vant";
 import Vue from 'vue'
 const Fns = {
     //  防抖
     $debounce(fn, delay) {
         var timeout = null;
         return function() {
             if (timeout) {
                 clearTimeout(timeout);
             }
             timeout = setTimeout(function() {
                 fn.apply(this, arguments);
             }, delay);
         }
     },
     //  节流
     $throttle(fn, delay) {
         var hasRun = false;
         return function() {
             if (hasRun) {
                 return;
             }
             hasRun = true;
             setTimeout(function() {
                 hasRun = false;
                 fn.apply(this, arguments);
             }, delay);
         }
     },
     $GenNonDuplicateID(randomLength) {
         return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
     },
     $preview() {

     },
     $alert() {
         alert('fky')
     },
     //获取n个月后的指定日期
     $getNextMonth_(date, length) {
         //指定年月该月份的天数
         function monthDay_(year, month) {
             month = parseInt(month, 10);
             var d = new Date(year, month, 0); //这个是都可以兼容的
             return d.getDate();
         }
         var yy = date.getFullYear();
         var mm = date.getMonth();
         var dd = date.getDate();
         var nm = 0; //目标月份
         nm = mm + (length * 1);
         var nd = 0 //目标天数
         if (monthDay_(yy, nm + 1) < dd) {
             nd = monthDay_(yy, nm + 1);
         } else {
             nd = dd - 1;
         }
         date.setDate(1)
         date.setMonth(nm)
         date.setDate(nd)
         return date
     },
     $getFrom2017(name, num) {
         var arr = [];
         var s = moment(new Date()).format(
             "YYYY"
         ) - 1;
         var l = num + 1;
         for (var i = 0; i < l + 1; i++) {
             if (name) {
                 arr.push({ year: s + i });
             } else {
                 arr.push(s + i);
             }
         }
         return arr;
     },
     //  保留2位小数
     //  $formatter(value) {
     //      if (value.indexOf(".") != -1) {
     //          return Math.floor((value * 1) * 100) / 100 * 1;
     //          //  return (value * 1).toFixed(2) * 1;
     //      } else {
     //          return value;
     //      }
     //  },
     $formatter(value) {
         let fval;
         if (value.indexOf(".") != -1) {
             fval = Math.floor((value * 1) * 100) / 100 * 1;
             //  return Math.floor((value * 1) * 100) / 100 * 1;
         } else {
             fval = value;
             //  return value;
         }
         if (fval === '') {
             return ''
         } else {
             return fval * (fval < 0 ? -1 : 1)
         }
     },
     //  活动预览、活动提交
     $activitySub(source, options) {
         let params = JSON.parse(JSON.stringify(source)),
             rejectParam = [
                 "limitNum_",
                 "content_1",
                 "content_2",
                 "content_copy_1",
                 "content_copy_2",
                 "isedit",
                 "editType",
                 "percent",
                 "shareImage",
                 'dataBack'
             ],
             { router, upDownStatus, checkTime, url } = options;
         console.log(options)
         if (params.activityType < 4) {
             rejectParam = rejectParam.concat(["payDeadline"]);
         } else {
             params["payDeadline"] =
                 params["payDeadline"] && params["payDeadline"] + " 23:59:59";
         }
         // 新增复制活动剔除模板自带activityId
         if (!params.editType) {
             rejectParam = rejectParam.concat(["activityId"]);
         }
         params["showContentList"] = params["content_" + params.contentType];
         params["showContentList"].map((item) => {
             //微传单线下开关
             if (params.activityType == 1) {
                 item.paySwitch = item.paySwitch ? 1 : 0;
             }
             //拼团报名限制开关
             if (params.activityType == 3) {
                 item.limitItems = item.limitItems ? 1 : 0;
             }
             //清除编辑时留下的额外字段places_、placesLimit_
             if (params.editType) {
                 delete item.places_;
                 delete item.placesLimit_;
             }
             // 当商品为课包类型 删除前端套餐字段
             if (params.contentType == 2) {
                 item.showActivityCourseList.map((ceil) => {
                     if (ceil.feeType == 2) {
                         ceil.endTime =
                             moment(ceil.beginTime).format("YYYY-MM-DD") + " 23:59:59";
                     }
                     delete ceil.packages;
                 });
             }
         });
         params["distSwitch"] = params["distSwitch"] ? 1 : 0;
         params["signUpLimit"] = params["signUpLimit"] ? 1 : 0;
         params["syncWebStatus"] = params["syncWebStatus"] ? 1 : 0;
         params["beginTime"] = params["beginTime"] + " 00:00:00";
         params["endTime"] = params["endTime"] + " 23:59:59";
         params["bgId"] = params["bg"].libId;
         params["blockId"] = params["block"].libId;
         params["musicId"] = params["music"].libId;
         params["topId"] = params["top"].libId;
         params["content"] = JSON.stringify(params["content"]);
         params["distContent"] = JSON.stringify(params["distContent"]);
         console.log(typeof upDownStatus === 'boolean' && upDownStatus)
         if (typeof upDownStatus === 'boolean') { //新增
             params["upDownStatus"] = upDownStatus ? 1 : 0; //0 待发布 1已发布
         }
         // 除抢购外剔除限购字段
         if (params.activityType != 2) {
             rejectParam = rejectParam.concat(["signUpLimit", "limitNum"]);
         }
         //返回206报错额外参数checkTime
         params['checkTime'] = checkTime ? checkTime : undefined;
         // 剔除接口外参数
         rejectParam.forEach((item) => {
             delete params[item];
         });
         Vue.prototype.yznReq("post", `api/oa/show/${url}`, params, "206").then((res) => {
             if (res.status == 200) {
                 switch (url) {
                     case 'savePreview':
                         localStorage.setItem(
                             "previewData",
                             JSON.stringify(this.acitivityParams)
                         );
                         router.push({
                             path: "/preview",
                             query: Object.assign({
                                 id: res.context.activityId,
                                 pre: 1,
                                 tem: 1,
                                 tl: "预览活动",
                             }),
                         });
                         break;
                     case 'modifyActivity':
                     case 'addActivity':
                         this.$router.replace({ path: "/mine" });
                         break;
                 }

             }
             if (res.status == 206) {
                 Dialog.confirm({
                         title: "提示",
                         message: "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
                     })
                     .then(() => {
                         options['checkTime'] = -1;
                         this.$activitySub(JSON.parse(JSON.stringify(source)), options);
                     })
                     .catch(() => {});
             }
         });
     }
 }

 export default Fns