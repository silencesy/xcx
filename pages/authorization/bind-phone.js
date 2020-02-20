// pages/authorization/bind-phone.js
const util = require('../../utils/util.js');
const app = getApp();
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
    console.log(app);
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

  bindgetphonenumber(e) {
    // console.log(e);
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    let source = 'xcx';
    let openid = wx.getStorageSync('openid');
    let session_key = wx.getStorageSync('session_key');
    let headimgurl = app.globalData.userInfo.avatarUrl;
    let nickname = app.globalData.userInfo.nickName;
    let params = {
      iv: iv,
      encryptedData: encryptedData,
      source: source,
      openid: openid,
      headimgurl: headimgurl,
      nickname: nickname,
      session_key: session_key
    }
    console.log(params);
    let that = this;
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
      wx.navigateBack({
        delta: 2
      })
    }, false);
  }
})