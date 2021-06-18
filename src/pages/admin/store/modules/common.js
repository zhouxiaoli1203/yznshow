import { yznReq } from '@/utils/yznhttp'
import { message } from 'ant-design-vue'
import { uuid } from '@/utils/utils'
import moment from 'moment'
import Vue from 'vue'

const state = {
  mode: 1,        // 1 新增 2 编辑
  systemType: 1,  // 1 admin 2 oa
  activityId: '',

  activityStatus: '0', // 0 待发布 1未开始 2进行中 3已结束 4 已下架
  activeType: 1,  //活动类型
  activeContent: 1,  // 活动内容 1自定义 2 课程
  name: '',
  startTime: '',
  endTime: '',
  firstEndTime: '',  // 保存第一次的结束时间  用于对比
  //payDeadline: '',


  // content: [{
  //   title: '标题111',
  //   body: [{
  //     content: '内容供电公司第三个第四个',
  //   }, {
  //     url: 'https://cdntest.yizhiniao.com/1606117154739_eg_tulip.jpg'
  //   }]
  // }],

  content: [{
    title: '',
    body: [
      {
        content: '',
        index:  uuid()
      }
    ]
  }],

  limitNum: '',// 微传单、抢购、拼团参与限制项目数
  signUpLimit: 0,// 微传单、抢购、拼团参与限制 0：不限制 1：限制


  topItem: {
    id: '',
    url: '',
    topColor: ''
  },// 顶图ID(对应show_lib表主键)

  blockItem: {
    id: '',
    content: '',
    fileUrl: ''
  },
  bgItem: {
    id: '',
    url: ''
  },
  musicItem: {
    id: '',
    url: ''
  },
  // musicUrl: '',
  // blockId: 9,// 区块ID(对应show_lib表主键)
  // bgId: 7,// 背景ID(对应show_lib表主键)
  // musicId: 8,// 音乐ID(对应show_lib表主键)
  shopPhone: '',
  info: 'name,phone',// 报名必填信息


  // distContent: [{
  //   title: '分销123',
  //   body: [{
  //     content: '内容供电公司第三个第四个',
  //   }, {
  //     url: 'https://cdntest.yizhiniao.com/1606117154739_eg_tulip.jpg'
  //   }]
  // }],

  distContent: [{
    title: '',
    body: [
      {
        content: '',
        index:  uuid()
      }
    ]
  }],

  shareImageUrl: '', // 封面图

  shareTitle: "",// 分享标题
  shareDesc: "",// 分享描述
  syncWebStatus: 0,// 同步微官网 0：不同步 1：同步
  upDownStatus: 0,// 上下架 0：待发布 1：已发布 -1：已下架

  distSwitch: 0, // 分销开关

  activityOrder: '',// 顺序
  showTagList: [],

  contentIds: [],

  showSuccModal: false,
  showSuccTemp: false
}

const mutations = {
  setMode(state, mode) {
    state.mode = mode
  },
  setActivityId(state, id) {
    state.activityId = id
  },
  setSystemType(state, type) {
    state.systemType = type
  },
  setActiveType(state, name) {
    state.activeType = name;//将传参设置给state的city
  },
  setActiveContent(state, name) {
    state.activeContent = name;//将传参设置给state的city
  },
  setName(state, name) {
    return state.name = name
  },
  setStartTime(state, time) {
    return state.startTime = time
  },
  setEndTime(state, time) {
    return state.endTime = time
  },
  // setPayDeadline(state, time) {
  //   return state.payDeadline = time
  // },
  setLimitNum(state, val) {
    return state.limitNum = val
  },
  setSignUpLimit(state, val) {
    return state.signUpLimit = val
  },
  setDistSwitch(state, val) {
    return state.distSwitch = val
  },
  setShowSuccModal(state, val) {
    return state.showSuccModal = val
  },
  setShowSuccTemp (state, val) {
    return state.showSuccTemp = val
  },
  setTopItem(state, payload) {
    const { id, url, color, type } = payload
    if (type == 1) {
      return state.topItem = { id, url, color }
    } else {
      return state.topItem = { id: '', url: '', color: '' }
    }

  },
  setBlockItem(state, payload) {
    const { id, content, url, type } = payload
    if (type == 1) {
      return state.blockItem = { id, content, url }
    } else {
      return state.blockItem = { id: '', content: '', url: '' }
    }
  },
  setBgItem(state, payload) {
    const { id, url, type } = payload
    if (type == 1) {
      return state.bgItem = { id, url }
    } else {
      return state.bgItem = { id: '', url: '' }
    }
  },
  setMusicItem(state, payload) {
    const { id, url } = payload
    state.musicItem = {
      id, url
    }
  },
  setShowTagList(state, payload) {
    state.showTagList = payload
  },
  // setMusicId(state, val) {
  //   return state.musicId = val
  // },
  setShopPhone(state, val) {
    return state.shopPhone = val
  },
  setInfo(state, val) {
    return state.info = val
  },
  setShareTitle(state, val) {
    return state.shareTitle = val
  },
  setShareDesc(state, val) {
    return state.shareDesc = val
  },
  setSyncWebStatus(state, val) {
    return state.syncWebStatus = val
  },
  setUpDownStatus(state, val) {
    return state.upDownStatus = val
  },
  setActivityOrder(state, val) {
    state.activityOrder = val
  },


  setContentTitle(state, payload) {
    const { val, cIndex, category } = payload
    let c = state[category]
    c[cIndex].title = val
    return state[category] = c
  },
  setContentBody(state, payload) {
    const { val, cIndex, bIndex, category } = payload
    let c = state[category]
    let body = c[cIndex].body
    let obj = body[bIndex]
    Object.keys(obj).forEach(function (key) {
      if (key != 'index') {
        obj[key] = val
      }
    });
    return state[category] = c
  },
  addContent(state) {
    let c = state.content
    c.push({
      title: '',
      index: uuid(),
      body: [{
        content: '',
        index: uuid()
      }]
    })
    return state.content = [...c]
  },
  addDistContent(state) {
    let c = state.distContent
    c.push({
      index: uuid(),
      title: '',
      body: [{
        content: '',
        index: uuid()
      }]
    })
    return state.distContent = [...c]
  },
  addBody(state, payload) {
    const { type, index, category } = payload
    let c = state[category]
    let body = c[index].body
    body.push({
      [type]: '',
      index: uuid()
    })
    return state[category] = c
  },
  moveInContent(state, payload) {
    const { type, index, category } = payload
    let c = state[category]
    if (type == 'up' && index > 0) {
      c.splice(index - 1, 0, (c[index]))
      c.splice(index + 1, 1)
    } else if (type == 'down' && index < c.length) {
      c.splice(index + 2, 0, (c[index]))
      c.splice(index, 1)
    }
    return state[category] = c
  },
  moveInBody(state, payload) {
    const { type, index, i, category } = payload
    let c = state[category]
    let body = c[index].body
    if (type == 'up' && i > 0) {
      body.splice(i - 1, 0, (body[i]))
      body.splice(i + 1, 1)
    } else if (type == 'down' && i < body.length) {
      body.splice(i + 2, 0, (body[i]))
      body.splice(i, 1)
    }
    return state[category] = c
  },
  deleteContent(state, payload) {
    const { index, category } = payload
    let c = state[category]
    c.splice(index, 1)
    return state[category] = c
  },
  deleteBody(state, payload) {
    const { index, i, category } = payload
    let c = state[category]
    let body = c[index].body
    body.splice(i, 1)
    return state[category] = c
  },
  setShareImageUrl(state, url) {
    return state.shareImageUrl = url
  },


  initCommon(state, payload) {
    state.activeType = payload.activityType
    state.activeContent = payload.contentType
    state.name = payload.activityName
    if (payload.systemType == 2 && payload.mode == 1) {
      // 新建活动时候
      state.startTime = moment().startOf('day')
      state.endTime = moment().add(29, 'd').endOf('day')
      //state.payDeadline = moment().add(36, 'd').endOf('day')
    } else {
      state.startTime = moment(payload.beginTime)
      state.endTime = moment(payload.endTime)
      state.firstEndTime = moment(payload.endTime)
      //state.payDeadline = moment(payload.payDeadline)
    }

    if (payload.systemType == 2 ) {
      state.upDownStatus = payload.upDownStatus
    }

    if (payload.content && JSON.parse(payload.content)) {
      let c = JSON.parse(payload.content)
      c.forEach((i, ci) => {
        i.index = uuid()
        if (i && i.body && i.body.length) {
          i.body.forEach((b, index) => {
            b.index = uuid()
          })
        }
      })
      state.content = c
    }
    // state.content = payload.content && JSON.parse(payload.content)
    state.distSwitch = payload.distSwitch && Boolean(payload.distSwitch)
    if (payload.distContent && JSON.parse(payload.distContent)) {
      let c = JSON.parse(payload.distContent)
      c.forEach((i, ci) => {
        i.index = uuid()
        if (i && i.body && i.body.length) {
          i.body.forEach((b, index) => {
            b.index = uuid()
          })
        }
      })
      state.distContent = c
    }
    //state.distContent = payload.distContent && JSON.parse(payload.distContent)
    state.limitNum = payload.limitNum
    state.signUpLimit = payload.signUpLimit
    // state.payDeadline = moment(payload.payDeadline)
    state.contentIds = payload.contentIds
    state.activityStatus = payload.activityStatus
    if (payload.top) {
      state.topItem = {
        id: payload.top.libId,
        url: payload.top.fileUrl,
        color: payload.top.topColor
      }
    }
    if (payload.bg) {
      state.bgItem = {
        id: payload.bg.libId,
        url: payload.bg.fileUrl
      }
    }
    if (payload.block) {
      state.blockItem = {
        id: payload.block.libId,
        content: payload.block.content,
        url: payload.block.fileUrl
      }
    }
    if (payload.music) {
      state.musicItem = {
        id: payload.music.libId,
        url: payload.music.fileUrl
      }
    }
    state.shopPhone = payload.shopPhone
    state.info = payload.info
    // state.distContent = payload.distContent && JSON.parse(payload.distContent)
    state.shareImageUrl = payload.shareImageUrl
    state.shareTitle = payload.shareTitle
    state.shareDesc = payload.shareDesc
    state.syncWebStatus = payload.syncWebStatus
   
    state.showTagList = payload.showTagList
    state.activityOrder = payload.activityOrder
  }
}

const actions = {
  async getPreviewTemp({ commit, state, rootState, dispatch }, { id, systemType, mode }) {
    let res = await yznReq("get", "api/admin/show/previewTemp", {
      activityId: id
    })
    if (res.status == 200) {
      let ctx = res.context
      let contentIds = []
      ctx.showContentList && ctx.showContentList.map(i => {
        contentIds.push(i.contentId)
      })
      ctx.contentIds = contentIds
      ctx.systemType = systemType
      ctx.mode = mode
      commit('initCommon', ctx)
      if (ctx.showContentList) {
        dispatch('leaflet/setProductName', ctx.activityName, { root: true })
        if (ctx.activityType == 1) {
          dispatch('leaflet/initPackage', ctx.showContentList, { root: true })
        } else if (ctx.contentType == 1 && ctx.activityType == 2) {
          // commit('flashCustom/setPackages', ctx.showContentList, { root: true })
          dispatch('flashCustom/initPackage', ctx.showContentList, { root: true })
        } else if (ctx.contentType == 2 && ctx.activityType == 2) {
          dispatch('flash/initPackage', ctx.showContentList, { root: true })
        } else if (ctx.contentType == 1 && ctx.activityType == 3) {
          dispatch('groupCustom/initPackage', ctx.showContentList, { root: true })
          // commit('groupCustom/setPackages', ctx.showContentList, { root: true })
        } else if (ctx.contentType == 2 && ctx.activityType == 3) {
          dispatch('group/initPackage', ctx.showContentList, { root: true })
        } else if (ctx.contentType == 1 && ctx.activityType == 4) {
          commit('bargainCustom/setPackages', ctx.showContentList[0], { root: true })
        } else if (ctx.contentType == 2 && ctx.activityType == 4) {
          commit('bargain/setPackages', ctx.showContentList[0], { root: true })
        } else if (ctx.contentType == 1 && ctx.activityType == 5) {
          commit('helpCustom/setPackages', ctx.showContentList[0], { root: true })
        } else if (ctx.contentType == 2 && ctx.activityType == 5) {
          commit('help/setPackages', ctx.showContentList[0], { root: true })
        }
      }
    }
  },
  async addTemp({ commit, state, rootState }, payload) {
    let params = {
      "beginTime": moment(state.startTime).format('YYYY-MM-DD') + ' 00:00:00',// 开始时间
      "endTime": moment(state.endTime).format('YYYY-MM-DD') + ' 23:59:59',// 结束时间 
      "activityName": state.name,// 活动名称
      "activityType": state.activeType,// 活动类型 1：微传单、2：抢购、3：拼团、4：砍价、5：助力
      "contentType": state.activeContent,// 活动内容 1：自定义 2：课程
      "signUpLimit": Number(state.signUpLimit),// 微传单、抢购、拼团参与限制 0：不限制 1：限制
      "limitNum": state.limitNum,// 微传单、抢购、拼团参与限制项目数
      "topId": state.topItem.id,// 顶图ID(对应show_lib表主键)
      "blockId": state.blockItem.id,// 区块ID(对应show_lib表主键)
      "bgId": state.bgItem.id,// 背景ID(对应show_lib表主键)
      "musicId": state.musicItem.id,// 音乐ID(对应show_lib表主键)
      "info": state.info,// 报名必填信息
      "shopPhone": state.shopPhone,// 机构电话
      "distSwitch": Number(state.distSwitch),// 分销开关 0：关 1：开
      "activityOrder": state.activityOrder,// 排序
      "shareImageUrl": state.shareImageUrl,// 分享封面图片地址
      "shareTitle": state.shareTitle,// 分享标题
      "shareDesc": state.shareDesc,// 分享描述
      "syncWebStatus": Number(state.syncWebStatus),// 同步微官网 0：不同步 1：同步
      "upDownStatus": state.upDownStatus,// 上下架 0：待发布 1：已发布 -1：已下架
      // "payDeadline": state.payDeadline ? moment(state.payDeadline).format('YYYY-MM-DD') + ' 23:59:59' : undefined, // 截至时间
      "content": JSON.stringify(state.content),
      "distContent": JSON.stringify(state.distContent),
      "showTagList": state.showTagList,
      "checkTime": (payload && payload.checkTime) ? payload.checkTime : undefined
    }
    if (state.activeType == 1) {
      let showlist = rootState.leaflet.packages
      let arr = showlist.map(i => {
        if (!state.activityId) {
          delete i.contentId;
        }
        delete i.oldPlaces
        return i
      })
      //delete params.payDeadline
      params.contentType = 1
      params['showContentList'] = arr
    } else if (state.activeType == 2) {
      let showlist = rootState.flashCustom.packages
      let arr = showlist.map(i => {
        if (!state.activityId) {
          delete i.contentId;
        }
        delete i.oldPlaces
        return i
      })
      params['showContentList'] = arr
    } else if (state.activeType == 3) {
      let showlist = rootState.groupCustom.packages
      if (!state.activityId) {
        let arr = showlist.map(i => {
          delete i.contentId;
          return i
        })
        params['showContentList'] = arr
      } else {
        params['showContentList'] = showlist
      }
    } else if (state.activeType == 4) {
      let show = Object.assign({}, rootState.bargainCustom)
      if (!state.activityId) {
        delete show.contentId;
        params['showContentList'] = [show]
      } else {
        params['showContentList'] = [show]
      }
    } else if (state.activeType == 5) {
      // let show = rootState.helpCustom
      let show = Object.assign({}, rootState.helpCustom)
      if (!state.activityId) {
        delete show.contentId
        params['showContentList'] = [show]
      } else {
        params['showContentList'] = [show]
      }
    }
    if (!state.activityId) {
      try {
        let res = await yznReq("post", "api/admin/show/addTemp", params)
        if (res.status == 200) {
          state.showSuccTemp = true
          state.activityId = res.context.activityId
          message.success('创建成功')
        }
      } catch (error) {
        message.error(error.message)
      }

    } else {
      try {
        params["activityId"] = state.activityId
        let res = await yznReq('post', 'api/admin/show/modifyTemp', params)
        if (res.status == 200) {
          state.showSuccTemp = true
          state.activityId = res.context.activityId
          message.success('修改成功')
        }
      } catch (error) {
        message.error(error.message)
      }
    }

  },
  async addActivity({ commit, state, rootState }, payload) {
    const self = this;
    let params = {                       
      "beginTime": moment(state.startTime).format('YYYY-MM-DD') + ' 00:00:00',// 开始时间
      "endTime": moment(state.endTime).format('YYYY-MM-DD') + ' 23:59:59',// 结束时间 
      //"payDeadline": state.payDeadline ? moment(state.payDeadline).format('YYYY-MM-DD') + ' 23:59:59' : undefined, // 截至时间
      "activityName": state.name,// 活动名称
      "activityType": state.activeType,// 活动类型 1：微传单、2：抢购、3：拼团、4：砍价、5：助力
      "contentType": state.activeContent,// 活动内容 1：自定义 2：课程
      "signUpLimit": Number(state.signUpLimit),// 微传单、抢购、拼团参与限制 0：不限制 1：限制
      "limitNum": state.limitNum,// 微传单、抢购、拼团参与限制项目数
      "topId": state.topItem.id,// 顶图ID(对应show_lib表主键)
      "blockId": state.blockItem.id,// 区块ID(对应show_lib表主键)
      "bgId": state.bgItem.id,// 背景ID(对应show_lib表主键)
      "musicId": state.musicItem.id,// 音乐ID(对应show_lib表主键)
      "info": state.info,// 报名必填信息
      "shopPhone": state.shopPhone,// 机构电话
      "distSwitch": Number(state.distSwitch),// 分销开关 0：关 1：开
      // "activityOrder": state.activityOrder,// 排序
      "shareImageUrl": state.shareImageUrl,// 分享封面图片地址
      "shareTitle": state.shareTitle,// 分享标题
      "shareDesc": state.shareDesc,// 分享描述
      "syncWebStatus": Number(state.syncWebStatus),// 同步微官网 0：不同步 1：同步
      "upDownStatus": (payload && payload.status !== undefined)? payload.status : state.upDownStatus ,// 上下架 0：待发布 1：已发布 -1：已下架
      // "showContentList":'',
      "content": JSON.stringify(state.content),
      "distContent": JSON.stringify(state.distContent),
      // "showTagList": state.showTagList,
      // activityOrder: 11212
      "checkTime": (payload && payload.checkTime) ? payload.checkTime : undefined
    }
    if (state.activeType == 1) {
      let showlist = rootState.leaflet.packages
      let arr = showlist.map((i,idx) => {
        if (state.mode == 1) {
          delete i.contentId;
        } else {
          i["contentId"] = state.contentIds[idx]
        }
        delete i.oldPlaces;
        return i
      })
      //delete params.payDeadline
      params.contentType = 1
      params['showContentList'] = arr
    } else if (state.activeType == 2 && state.activeContent == 1) {
      let showlist = rootState.flashCustom.packages
      let arr = showlist.map((i,idx) => {
        if (state.mode == 1) {
          delete i.contentId;
        } else {
          i["contentId"] = state.contentIds[idx]
        }
        delete i.oldPlaces
        return i
      })
      params['showContentList'] = arr
    } else if (state.activeType == 2 && state.activeContent == 2) {
      let showlist = rootState.flash.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "paySet": i.paySet,
            "showActivityCourseList": []
          }

          i.course.forEach(item => {
            let obj = removePropertyOfNull(item)
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      } else {
        let arr = showlist.map((i, index) => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "paySet": i.paySet,
            "showActivityCourseList": [],
            "contentId": state.contentIds[index]
          }

          i.course.forEach(item => {
            let obj = removePropertyOfNull(item)
            delete obj.courseName
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      }
    } else if (state.activeType == 3 && state.activeContent == 1) {
      let showlist = rootState.groupCustom.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          delete i.contentId;
          delete i.activityId
          i.showContentRuleList && i.showContentRuleList.map(one => {
            delete one.ruleId
          })
          return i
        })
        params['showContentList'] = arr
      } else {
        let arr = showlist.map((i, idx) => {
          i["contentId"] = state.contentIds[idx]
          return i
        })
        params['showContentList'] = arr
      }
    } else if (state.activeType == 3 && state.activeContent == 2) {
      let showlist = rootState.group.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "paySet": i.paySet,
            "prepaidAmount": i.prepaidAmount,
            // "virtualGroup": i.virtualGroup,
            "showContentRuleList": i.showContentRuleList,
            "showActivityCourseList": []
          }

          i.courseInfo.forEach(item => {
            let obj = removePropertyOfNull(item)
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      } else {
        let arr = showlist.map((i, index) => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "paySet": i.paySet,
            "prepaidAmount": i.prepaidAmount,
            // "virtualGroup": i.virtualGroup,
            "showActivityCourseList": [],
            "showContentRuleList": i.showContentRuleList,
            "contentId": state.contentIds[index]
          }
          i.courseInfo.forEach(item => {
            let obj = removePropertyOfNull(item)
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      }
    } else if (state.activeType == 4 && state.activeContent == 1) {
      let show = Object.assign({}, rootState.bargainCustom)
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      } else {
        show['contentId'] = state.contentIds[0]
      }
      params['showContentList'] = [show]
    } else if (state.activeType == 4 && state.activeContent == 2) {
      let show = Object.assign({}, rootState.bargain)
      show.course.forEach(i => {
        i = removePropertyOfNull(i)
      })
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      } else {
        show['contentId'] = state.contentIds[0]
      }
      show.showActivityCourseList = show.course
      delete show.course
      params['showContentList'] = [show]
    } else if (state.activeType == 5 && state.activeContent == 1) {
      let show = Object.assign({}, rootState.helpCustom)
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      } else {
        show['contentId'] = state.contentIds[0]
      }
      params['showContentList'] = [show]
    } else if (state.activeType == 5 && state.activeContent == 2) {
      let show = Object.assign({}, rootState.help)
      show.course.forEach(i => {
        i = removePropertyOfNull(i)
      })
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      } else {
        show['contentId'] = state.contentIds[0]
      }
      show.showActivityCourseList = show.course
      delete show.course
      params['showContentList'] = [show]
    }
    if (state.mode == 1) {
      params["tempId"] = state.activityId          // 统计模板使用量
      try {
        let res = await yznReq("post", "api/oa/show/addActivity", params, '205206')
        if (res.status == 200) {
          state.activityId = res.context.activityId
          state.upDownStatus = res.context.upDownStatus
          state.showSuccModal = true
          message.success('创建成功')
        } else if (res.status == 206) {
          Vue.prototype.$confirm({
            content: "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
            onOk() {
              actions.addActivity({ commit, state, rootState }, {checkTime: -1, status: 1});
              state.upDownStatus = 1
            },
            okText: "确定",
            cancelText: "取消",
            onCancel() {
              Vue.prototype.$destroyAll();
            },
          });
        } else if (res.status == 205) {
          message.error(res.message)
        }
      } catch (error) {
        message.error(error.message)
      }
    } else {
      params["activityId"] = state.activityId
      try {
        let res = await yznReq('post', 'api/oa/show/modifyActivity', params, '205206')
        if (res.status == 200) {
          state.upDownStatus = res.context.upDownStatus
          state.activityId = res.context.activityId
          state.showSuccModal = true
          message.success('修改成功')
        } else if (res.status == 206) {
          Vue.prototype.$confirm({
            content: "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
            onOk() {
              actions.addActivity({ commit, state, rootState }, {checkTime: -1, status: 1});
              state.upDownStatus = 1
            },
            okText: "确定",
            cancelText: "取消",
            onCancel() {
              Vue.prototype.$destroyAll();
            },
          });
        } else if (res.status == 205) {
          message.error(res.message)
        }
      } catch (error) {
        message.error(error.message)
      }
    }

    function removePropertyOfNull(obj) {
      Object.keys(obj).forEach(item => {
        if (obj[item] === '' || obj[item] === undefined) {
          delete obj[item]
        }
        if (item == 'beginTime' && obj[item]) {
          obj[item] = moment(obj[item]).format('YYYY-MM-DD') + ' 00:00:00'
        } else if (item == 'endTime' && obj[item]) {
          obj[item] = moment(obj[item]).format('YYYY-MM-DD') + ' 23:59:59'
        } else if (item == 'payDeadline' && obj[item]) {
          obj[item] = moment(obj[item]).format('YYYY-MM-DD') + ' 23:59:59'
        }
      })
      return obj;
    }
  },
  async getPrePhone({ commit, state, rootState }, payload) {
    const self = this;
    let params = {
      "beginTime": moment(state.startTime).format('YYYY-MM-DD') + ' 00:00:00',// 开始时间
      "endTime": moment(state.endTime).format('YYYY-MM-DD') + ' 23:59:59',// 结束时间 
      //"payDeadline": state.payDeadline ? moment(state.payDeadline).format('YYYY-MM-DD') + ' 23:59:59' : undefined, // 截至时间
      "activityName": state.name,// 活动名称
      "activityType": state.activeType,// 活动类型 1：微传单、2：抢购、3：拼团、4：砍价、5：助力
      "contentType": state.activeContent,// 活动内容 1：自定义 2：课程
      "signUpLimit": Number(state.signUpLimit),// 微传单、抢购、拼团参与限制 0：不限制 1：限制
      "limitNum": state.limitNum,// 微传单、抢购、拼团参与限制项目数
      "topId": state.topItem.id,// 顶图ID(对应show_lib表主键)
      "blockId": state.blockItem.id,// 区块ID(对应show_lib表主键)
      "bgId": state.bgItem.id,// 背景ID(对应show_lib表主键)
      "musicId": state.musicItem.id,// 音乐ID(对应show_lib表主键)
      "info": state.info,// 报名必填信息
      "shopPhone": state.shopPhone,// 机构电话
      "distSwitch": Number(state.distSwitch),// 分销开关 0：关 1：开
      // "activityOrder": state.activityOrder,// 排序
      "shareImageUrl": state.shareImageUrl,// 分享封面图片地址
      "shareTitle": state.shareTitle,// 分享标题
      "shareDesc": state.shareDesc,// 分享描述
      "syncWebStatus": Number(state.syncWebStatus),// 同步微官网 0：不同步 1：同步
      "upDownStatus": state.upDownStatus,// 上下架 0：待发布 1：已发布 -1：已下架
      // "showContentList":'',
      "content": JSON.stringify(state.content),
      "distContent": JSON.stringify(state.distContent),
      // "showTagList": state.showTagList,
      // activityOrder: 11212
      "checkTime": (payload && payload.checkTime) ? payload.checkTime : undefined,


      "top": {
        libId: state.topItem.id,
        fileUrl: state.topItem.url,
        topColor: state.topItem.color
      },
      "block": {
        libId: state.blockItem.id,
        fileUrl: state.blockItem.fileUrl,
        content: state.blockItem.content
      },
      "bg": {
        libId: state.bgItem.id,
        fileUrl: state.bgItem.url
      },
      "music": {
        libId: state.musicItem.id,
        fileUrl: state.musicItem.url
      }
    }
    if (state.activeType == 1 && state.activeContent == 1) {
      let showlist = rootState.leaflet.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          delete i.contentId;
          delete i.oldPlaces;
          return i
        })
        params['showContentList'] = arr
      } else {
        let arr = showlist.map(i => {
          delete i.oldPlaces;
          return i
        })
        params['showContentList'] = arr
      }
    } else if (state.activeType == 2 && state.activeContent == 1) {
      let showlist = rootState.flashCustom.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          delete i.contentId;
          return i
        })
        params['showContentList'] = arr
      } else {
        params['showContentList'] = showlist
      }
    } else if (state.activeType == 2 && state.activeContent == 2) {
      let showlist = rootState.flash.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "showActivityCourseList": []
          }

          i.course.forEach(item => {
            let obj = removePropertyOfNull(item)
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      } else {
        let arr = showlist.map((i, index) => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "showActivityCourseList": [],
            "contentId": state.contentIds[index]
          }

          i.course.forEach(item => {
            let obj = removePropertyOfNull(item)
            delete obj.courseName

            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      }
    } else if (state.activeType == 3 && state.activeContent == 1) {
      let showlist = rootState.groupCustom.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          delete i.contentId;
          delete i.activityId
          i.showContentRuleList && i.showContentRuleList.map(one => {
            delete one.ruleId
          })
          return i
        })
        params['showContentList'] = arr
      } else {
        params['showContentList'] = showlist
      }
    } else if (state.activeType == 3 && state.activeContent == 2) {
      let showlist = rootState.group.packages
      if (state.mode == 1) {
        let arr = showlist.map(i => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "paySet": i.paySet,
            "prepaidAmount": i.prepaidAmount,
            // "virtualGroup": i.virtualGroup,
            "showContentRuleList": i.showContentRuleList,
            "showActivityCourseList": []
          }

          i.courseInfo.forEach(item => {
            let obj = removePropertyOfNull(item)
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      } else {
        let arr = showlist.map((i, index) => {
          let showListItem = {
            "productName": i.productName,
            "floorPrice": i.floorPrice,
            "limitItems": i.limitItems,
            "placesLimit": i.placesLimit,
            "places": i.places,
            "paySet": i.paySet,
            "prepaidAmount": i.prepaidAmount,
            // "virtualGroup": i.virtualGroup,
            "showActivityCourseList": [],
            "showContentRuleList": i.showContentRuleList,
            "contentId": state.contentIds[index]
          }
          i.courseInfo.forEach(item => {
            let obj = removePropertyOfNull(item)
            showListItem['showActivityCourseList'].push(obj)
          })

          return showListItem
        })
        params['showContentList'] = arr
      }
    } else if (state.activeType == 4 && state.activeContent == 1) {
      let show = Object.assign({}, rootState.bargainCustom)
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId

      }
      params['showContentList'] = [show]
    } else if (state.activeType == 4 && state.activeContent == 2) {
      let show = Object.assign({}, rootState.bargain)
      show.course.forEach(i => {
        i = removePropertyOfNull(i)
      })
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      }
      show.showActivityCourseList = show.course
      delete show.course
      params['showContentList'] = [show]
    } else if (state.activeType == 5 && state.activeContent == 1) {
      let show = Object.assign({}, rootState.helpCustom)
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      }
      params['showContentList'] = [show]
    } else if (state.activeType == 5 && state.activeContent == 2) {
      let show = Object.assign({}, rootState.help)
      show.course.forEach(i => {
        i = removePropertyOfNull(i)
      })
      if (state.mode == 1) {
        delete show.contentId;
        delete show.activityId
      }



      show.showActivityCourseList = show.course
      delete show.course
      params['showContentList'] = [show]
    }

    try {
      let res = await yznReq("post", "api/oa/show/savePreview", params)
      if (res.status == 200) {
        return res.context.activityId
      }
    } catch (error) {
      message.error(error.message)
    }

    function removePropertyOfNull(obj) {
      Object.keys(obj).forEach(item => {
        if (obj[item] === '' || obj[item] === undefined) {
          delete obj[item]
        }
        if (item == 'beginTime' && obj[item]) {
          obj[item] = moment(obj[item]).format('YYYY-MM-DD') + ' 00:00:00'
        } else if (item == 'endTime' && obj[item]) {
          obj[item] = moment(obj[item]).format('YYYY-MM-DD') + ' 23:59:59'
        } 
        
        // else if (item == 'payDeadline' && obj[item]) {
        //   obj[item] = moment(obj[item]).format('YYYY-MM-DD') + ' 23:59:59'
        // }
      })
      return obj;
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}