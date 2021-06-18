const getters = {
  getActiveType: (state) => state.common.activeType,
  getActiveContent: (state) => state.common.activeContent,
  getSelectedCourse: (state) => state.common.selectedCourse,
  getInfo: (state) => state.common.info,
  getActivityId: (state) => state.common.activityId,
  getSelectedStu: (state) => state.common.selectedStu,
  getStuList: (state) => state.common.stuList,
  getActiveJoin: (state) => state.common.activeJoin,
  getIndexPop: (state) => state.common.indexPop,
  getShopPhone: (state) => state.common.shopPhone,
  
  getPackageLen: (state) => state.common.packageLen
}
export default getters