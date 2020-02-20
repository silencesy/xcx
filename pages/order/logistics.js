// pages/order/logistics.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      logistics: options.logistics,
      company: options.company
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

  // 获取数据
  getData() {
    let that = this;
    let params = {
      logistics: that.data.logistics,
      company: that.data.company
    }
    util.request("post", util.api.logistics, params, function (res) {
      console.log(res);
      var data = res.data;
      if(data.status==1) {
        data.list = data.list.reverse();
      }
      that.setData({
        data: data
      });
    }, false);
  }
})