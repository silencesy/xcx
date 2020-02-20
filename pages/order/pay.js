// pages/order/pay.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNumber: options.orderNumber,
      isSpell: options.isSpell || false,
      newpay: options.newpay || 2
    },function(){
      this.getData();
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
    const that = this;
    if (!this.data.isPay) {
      wx.navigateTo({
        url: './unpaid?orderNumber=' + that.data.data.orderNumber,
      });
    }
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
    var openid =util.getOpenId();
    console.log(openid);
    let params = {
      orderNumber: that.data.orderNumber,
      openid: openid,
      newpay: that.data.newpay
    }
    util.request("post", util.api.miniPay, params, function (res) {
      console.log(res);
      that.setData({
        data: res.data
      })
    });
  },
  // 支付成功页面
  goPayed() {
    const that = this;
    wx.requestPayment(
      {
        'timeStamp': that.data.data.jsApiParameters.timeStamp,
        'nonceStr': that.data.data.jsApiParameters.nonceStr,
        'package': that.data.data.jsApiParameters.package,
        'signType': 'MD5',
        'paySign': that.data.data.jsApiParameters.paySign,
        'success': function (res) {
          that.setData({
            isPay: true
          },function(){
            if (that.data.isSpell) {
              wx.reLaunch({
                url: '../spell/spell?orderNumber=' + that.data.data.orderNumber,
              });
            } else {
              wx.reLaunch({
                url: './payed?orderNumber=' + that.data.data.orderNumber,
              });
            }
          })
          
         }
      })
    }
})