// pages/coupons/get-coupons.js
const util = require('../../utils/util.js');
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
  },
  getData() {
    // 获取数据
    let that = this;
    util.request("post", util.api.discountlist, {id: that.data.id}, function (res) {
      let detailsdata = res.data.detail;
      WxParse.wxParse('detailsdata', 'html', detailsdata, that, 12);
      that.setData({
        data: res.data
      })
    }, false);
  },
  bindUseCoupon({ currentTarget: { dataset: { id } } }) {
    if (util.privilegeJump()) {
      wx.navigateTo({
        url: './coupon-goods?id=' + id
      })
    }
    
  },
  bindGetCoupon({ currentTarget: { dataset: { id,index } } }) {
    var that = this;
    if (util.privilegeJump()) {
      let params = {
        id: id
      }
      util.request("post", util.api.getCoupon, params, function (res) {
        if (res.code == 1) {
          let data = that.data.data;
          data.data[index].isdiscount = 1;
          that.setData({
            data: data
          })
        } else if (res.code == 129) {
          wx.showToast({
            title: 'Sorry, the coupon collection is closed now.!',
            icon: 'none',
            duration: 1000
          });
        } else if (res.code == 130) {
          wx.showToast({
            title: 'The coupon is expired.!',
            icon: 'none',
            duration: 1000
          });
        }
        
      }, true);
    }
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
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})