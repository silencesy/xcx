// pages/shop-details/shop-details.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    shopData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shopData.name,
      path: 'pages/shop-details/shop-details?id=' + this.data.shopData.id,
      imageUrl: this.data.shopData.pic
    }
  },
  // 获取数据
  getData() {
    let that = this;
    let params = {
      id: that.data.id
    }
    util.request("post", "Brand/detail", params, function (res) {
      that.setData({
        shopData: res.data
      },function () {
        wx.setNavigationBarTitle({
          title: that.data.shopData.name
        })
      })
    }, false);
  },
  bindGoAllGoods() {
    let that = this;
    wx.navigateTo({
      url: '../shop-goods-list/shop-goods-list?class=all&id=' + that.data.id,
    })
  },
  binGoNewGoods() {
    let that = this;
    wx.navigateTo({
      url: '../shop-goods-list/shop-goods-list?class=new&id=' + that.data.id,
    })
  },
  bindShopSearch() {
    wx.navigateTo({
      url: '../shop-search/shop-search?id=' + this.data.id,
    })
  },
  bindGoHome() {
    console.log(123);
  },
  // 收藏商户
  bindSaveShop() {
    let that = this;
    let shopData = that.data.shopData;
    let isCollect = that.data.shopData.isCollect == 1 ? 0 : 1;
    let id = that.data.shopData.id;
    let params = {
      type: 2,
      contentId: id,
      isCollect: isCollect
    }
    if (util.privilegeJump()) {
      util.request("post", util.api.collect, params, function (res) {
        shopData.isCollect = isCollect;
        that.setData({
          shopData: shopData
        })
      }, false);
    }
  },
  goHome() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  goDetails(e) {
    let { currentTarget: { dataset: { flag } } } = e;
    util.swiperToDetails(flag);
  }
})