// pages/authorization/authorized-login.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
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

  login() {
    const params = {
      source: 'xcx',
      openid: util.getOpenId(),
      headimgurl: this.data.userInfo.avatarUrl || '',
      nickname: this.data.userInfo.nickName || ''
    }
    util.request("post", util.api.createUser, params, function (res) {
      let token = res.data.token;
      wx.setStorage({
        key: 'isRegister',
        data: 1
      });
      wx.setStorage({
        key: 'token',
        data: token
      });
      wx.setStorage({
        key: 'signOut',
        data: 0
      });
      wx.navigateBack({
        delta: 1
      })
    }, true);
  }
})