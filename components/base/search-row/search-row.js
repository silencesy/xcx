// components/base/search-row/search-row.js
Component({
  externalClasses: ['icon-sousuo'],
  /**
   * 组件的属性列表
   */
  properties: {
    bottomline: {
      type: Boolean,
      value: true
    },
    searchClass: {
      type: String,
      value: "goods"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGoSearch() {
      wx.navigateTo({
        url: '../../pages/global-search/global-search?id=' + this.data.searchClass,
      })
    }
  }
})
