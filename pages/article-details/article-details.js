// pages/article-details/article-details.js
const util = require('../../utils/util.js');
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    articleData: null
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

  },
  // 获取数据
  getData() {
    let that = this;
    let params = {
      id: that.data.id
    }
    util.request("post", "Article/detail", params, function (res) {
      let detailsdata = res.data.article_content;
      WxParse.wxParse('detailsdata', 'html', detailsdata, that, 12);
      that.setData({
        articleData: res.data
      })
    }, false);
  },
  goGoodsDetails(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../pages/goods-details/goods-details?id=" + id
    })
  }
})