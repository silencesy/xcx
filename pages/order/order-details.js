// pages/order/order-details.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    isShowLayer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      status: options.status
    })
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
      orderNumber: that.data.id
    }
    util.request("post", util.api.orderDetail, params, function (res) {
      that.setData({
        data: res.data
      });
    }, false);
  },
  bindGoPay() {
    let orderNumber = this.data.id;
    wx.navigateTo({
      url: './pay?orderNumber=' + orderNumber
    });
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },
  // 复制剪切板
  copy(e) {
    let orderNumber = e.currentTarget.dataset.ordernumber;
    wx.setClipboardData({
      data: orderNumber,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: 'Successful'
            })
          }
        })
      }
    });
  },
  deliveryConfirmed({ detail: { id, shopname}}) {
    let data = this.data.data;
    data.data.brand.forEach((element)=>{
      console.log(element)
      if (element.brandName === shopname) {
        element.data.forEach((item)=>{
          if (item.id === id) {
            item.confirmtime = true
          }
        })
      }
    })
    this.setData({
      data
    })
  }
})