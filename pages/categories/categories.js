const util = require('../../utils/util.js');
Page({
  data: {
    data: [],
    categoryData: [],
    hotParams: {
      pageSize: 30,
      page: 1
    },
  },
  onLoad: function (options) {
    this.getCategory();
    this.getHotGoods();
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function () {
    
  },
  getCategory() {
    // 获取数据
    let that = this;
    util.request("post", util.api.category, { fname: 0 }, function (res) {
      that.setData({
        categoryData: res.data
      });
    }, false);
  },
  // 获取数据
  getHotGoods() {
    let that = this;
    util.request("post", "Item/hotProducts", that.data.hotParams, function (res) {
      that.setData({
        data: res.data.data,
      });
    }, false);
  },
  goDetails({ currentTarget }) {
    let id = currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../pages/categories/goodsList?id=" + id
    })
  }
})