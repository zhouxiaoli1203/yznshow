const state = {
  packages: [{
    productName: '',
    // productDesc: '',
    // originalPrice: '',
    // floorPrice: '',


    paySwitch: 0,
    limitItems: 0,
    placesLimit: 1,
    places: 40,
    oldPlaces: '',

    paySet: 1,
    prepaidAmount: '',
  }],
}

const mutations = {

  setPackages(state, packages) {
    return state.packages = [...packages]
  },
}

const actions = {
  initPackage({commit, state}, payload) {
    let arr = []
    for (let i of payload) {
      let p = {
        productName: state.packages[0].productName,
        // productName: name,
        // productDesc: i.productDesc,
        // originalPrice: i.originalPrice,
        // floorPrice: i.floorPrice,
        limitItems: i.limitItems,
        placesLimit: i.placesLimit,
        places: i.places,
        oldPlaces: i.places,
        paySet: i.paySet,
        paySwitch: i.paySwitch,
        prepaidAmount: i.prepaidAmount,
      }
      arr.push(p)
    }
    commit('setPackages', arr)
  },
  setPackagesItemByName({ commit, state }, payload) {
    const { index, name, value } = payload
    let p = state.packages
    let obj = p[index]
    obj[name] = value
    commit('setPackages', p)
  },
  addPackage({ commit, state, rootGetters }) {
    let p = [...state.packages]
    p.push({
      productName: '',
      productDesc: '',
      originalPrice: '',
      floorPrice: '',
      limitItems: 0,
      placesLimit: 0,
      places: '',

      paySet: 1,
      prepaidAmount: '',
    })
    commit('setPackages', p)
  },
  deletePackageByIndex({ commit, state }, packageIndex) {
    let p = state.packages
    if (p.length <= 1) {
      return
    } else {
      p.splice(packageIndex, 1)
      commit('setPackages', p)
    }
  },
  setProductName ({commit, state}, payload) {
    let p = state.packages
    p[0].productName  = payload
    commit('setPackages', p)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}