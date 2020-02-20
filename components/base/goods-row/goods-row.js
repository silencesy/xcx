// components/base/goods-row/goods-row.js
// rows 2 一行两个  rows 4 caregories页面一行两个
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: []
    },
    rows: {
      type: Number,
      value: 3
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
    goDetails(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "../../pages/goods-details/goods-details?id=" + id
      })
    }
  }
})
