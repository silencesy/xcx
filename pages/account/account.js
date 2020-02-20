// pages/account/account.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    signOutvisible: false,
    isRegister: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (util.isRegister()) {
      this.setData({
        isRegister: true
      })
      this.getData();
    } else {
      this.setData({
        isRegister: false
      })
    }
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
  bindGoOrder(e) {
    if (util.privilegeJump()) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../order/order-list?id=' + id,
      })
    }
  },
  bindGoAddress() {
    if (util.privilegeJump()) {
      wx.navigateTo({
        url: '../address-module/address-list',
      })
    }
  },
  bindGoWishList() {
    if (util.privilegeJump()) {
      wx.navigateTo({
        url: '../wishlist/wishlist',
      })
    }
  },
  bindGoCoupons() {
    if (util.privilegeJump()) {
      wx.navigateTo({
        url: '../coupons/coupons',
      })
    }
  },
  bindGoContact() {
    wx.navigateTo({
      url: '../contact/contact',
    })
  },
  getData() {
    let that = this;
    util.request("post", util.api.userDetail, {}, function (res) {
      console.log(res);
      that.setData({
        data: res.data
      });
    },false);
  },
  // 去登陆
  bindGoLogIn() {
    util.privilegeJump();
  },
  //退出登录
  bindSignOut() {
    wx.removeStorage({
      key: 'token',
      success(res) {
        wx.removeStorage({
          key: 'isRegister',
          success(res) {
            wx.setStorage({
              key: 'signOut',
              data: 1
            });
          }
        })
      }
    })
    this.setData({
      signOutvisible: false,
      data: null,
      isRegister: false
    })
  },
  //取消登录
  cancelSignOut() {
    this.setData({
      signOutvisible: false
    })
  },
  goSignOut() {
    this.setData({
      signOutvisible: true
    })
  }
})