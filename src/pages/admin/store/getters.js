  
const getters = {
  getMode: (state) => {
    return state.common.mode
  },
  getActivityId:(state) => {
    return state.common.activityId
  },
  getSystemType:(state) => {
    return state.common.systemType
  },
  getActiveType: (state) => {
    return state.common.activeType;
  },
  getActiveContent: (state) => {
    return state.common.activeContent
  },
  getName: (state) => {
    return state.common.name
  },
  getStartTime: (state) => {
    return state.common.startTime
  },
  getEndTime: (state) => {
    return state.common.endTime
  },
  getFirstEndTime: (state) => {
    return state.common.firstEndTime
  },
  // getPayDeadline: (state) => {
  //   return state.common.payDeadline
  // },
  getActivityStatus: (state) => {
    return state.common.activityStatus
  },
  getContent: (state) => {
    return state.common.content
  },
  getDistContent: (state) => {
    return state.common.distContent
  },
  getDisSwitch: (state) => {
    return state.common.distSwitch
  },
  getShowSuccModal: (state) => {
    return state.common.showSuccModal
  },
  getShowSuccTemp: (state) => {
    return state.common.showSuccTemp
  },
  getLimitNum: (state) => {
    return state.common.limitNum
  },
  getSignUpLimit: (state) => {
    return state.common.signUpLimit
  },
  getTopItem: (state) => {
    return state.common.topItem
  },
  getBlockItem: (state) => {
    return state.common.blockItem
  },
  getBgItem: (state) => {
    return state.common.bgItem
  },
  getMusicItem: (state) => {
    return state.common.musicItem
  },
  getShopPhone: (state) => {
    return state.common.shopPhone
  },
  getInfo: (state) => {
    return state.common.info
  },
  getShareImageUrl: (state) => {
    return state.common.shareImageUrl
  },
  getShareTitle: (state) => {
    return state.common.shareTitle
  },
  getShareDesc: (state) => {
    return state.common.shareDesc
  },
  getSyncWebStatus: (state) => {
    return state.common.syncWebStatus
  },
  getUpDownStatus: (state) => {
    return state.common.upDownStatus
  },
  getActivityOrder: (state) => {
    return state.common.activityOrder
  },
  getShowTag: (state) => {
    return state.common.showTagList
  },


  // 微传单
  getLeaflet: (state) => {
    return state.leaflet.packages
  },
  getLeafletItem: (state) => {
    return (type)=>{
      return state.leaflet[type]
    }
  },
  getLeafletPackageItem: (state) => {
    return (type, index) => {
      let p = state.leaflet.packages[index]
      return p[type]
    }
  },

  // 抢购课程
  getPackages: (state) => {
    return state.flash.packages
  },
  getPackageItem: (state) => {
    return (type, index) => {
      let p = state.flash.packages[index]
      return p[type]
    }
  },
  getPackageCourseItem: (state) => {
    return (type, index, courseIndex) => {
      let p = state.flash.packages[index]
      let c = p.course[courseIndex]
      return c[type]
    }
  },
  // 抢购自定义
  getFlashCustom: (state) => {
    return state.flashCustom.packages
  },
  getFlashCustomItem: (state) => {
    return (type)=>{
      return state.flashCustom[type]
    }
  },
  getFlashCustomPackageItem: (state) => {
    return (type, index) => {
      let p = state.flashCustom.packages[index]
      return p[type]
    }
  },
  // 拼团课程 自定义
  getGroup: (state) => {
    return state.group.packages
  },
  getGroupItem: (state) => {
    return (type, index)=>{
      let p = state.group.packages[index]
      return p[type]
    }
  },
  getGroupCourseItem: (state) => {
    return (type, index, courseIndex) => {
      let p = state.group.packages[index]
      let c = p.courseInfo[courseIndex]
      return c[type]
    }
  },
  getGroupRuleItem: (state) => {
    return (type, index, ruleIndex) => {
      let p = state.group.packages[index]
      let c = p.showContentRuleList[ruleIndex]
      return c[type]
    }
  },
  getGroupCustom: (state) => {
    return state.groupCustom.packages
  },
  getGroupCustomItem: (state) => {
    return (type, index)=>{
      let p = state.groupCustom.packages[index]
      return p[type]
    }
  },
  getGroupCustomRuleItem: (state) => {
    return (type, index, ruleIndex) => {
      let p = state.groupCustom.packages[index]
      let c = p.showContentRuleList[ruleIndex]
      return c && c[type]
    }
  },
  // 砍价自定义  课程
  getBargainCustom: (state) => {
    return state.bargainCustom
  },
  getBargainCustomItem: (state) => {
    return (type) => {
      let p = state.bargainCustom
      return p[type]
    }
  },
  getBargain: (state) => {
    return state.bargain
  },
  getBargainItem: (state) => {
    return (type) => {
      let p = state.bargain
      return p[type]
    }
  },
  getBargainCourse: (state) => {
    return (type, courseIndex) => {
      let c = state.bargain.course[courseIndex]
      return c && c[type]
    }
  },
  // 助力
  getHelp: (state)=>{
    return state.help
  },
  getHelpItem: (state) => {
    return (type) => {
      return state.help[type]
    }
  },
  getHelpCourse: (state) => {
    return (type, courseIndex) => {
      let c = state.help.course[courseIndex]
      return c && c[type]
    }
  },
  getHelpCustom: (state) => {
    return state.helpCustom
  },
  getHelpCustomItem: (state) => {
    return (type) => {
      let p = state.helpCustom
      return p[type]
    }
  },
}
export default getters