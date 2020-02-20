// pages/order/order-preview.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      page: 1,
      pageSize: 1000,
    },
    params2: {
      skuId: null,
      number: null,
      couponId: null,
      isSpell: null,
      spellId: null
    },
    data: null,
    chooseCouponData: null,
    couponVisible: false,
    addressData: null,
    buyerRemark: '',
    springTips: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let params2 = this.data.params2;
    params2.skuId = options.skuid || '';
    params2.number = options.number || '';
    if (options.isSpell) {
      params2.isSpell = 1;
    }
    if (options.spellId) {
      params2.spellId = options.spellId;
    }
    this.setData({
      params2: params2
    });
    this.getData();
    this.getmessage();
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
    console.log(app.globalData.addressId);
    if (app.globalData.addressId) {
      console.log('chooseAddress');
      this.getSingleAddr();
    } else {
      this.getAddress();
    }
  },
  getSingleAddr() {
    let that = this;
    let params = {
      id: app.globalData.addressId
    }
    util.request("post", util.api.addressDetails, params, function (res) {
      that.setData({
        addressData: res.data
      })
    }, false);
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
  // 获取春运提示
  getmessage() {
    var that = this;
    util.request("get", util.api.getmessage, {}, function (res) {
      console.log(res);
      that.setData({
        springTips: res.data.data
      })
    });
  },
  // 获取数据
  getData() {
    let that = this;
    util.request("post", util.api.prepareOrder, that.data.params2, function (res) {
      console.log(res);
      let data = res.data;
      if (data.brandArray) {
        data.brandArray.forEach((v) => {
          v.data.forEach((vv) => {
            vv.title = vv.goodsName
          });
        });
      }
      
      data.userCouponList.forEach((v,i)=>{
        if(i==0) {
          v['checked'] = true;
        } else {
          v['checked'] = false;
        }
      });
      that.setData({
        data: res.data
      });
      
      that.setCoupon();
      if (res.data.userCouponList.length > 0) {
        that.getPrice();
      }
    }, false);
  },
  getAddress() {
    let that = this;
    util.request("post", util.api.addressList, that.data.params, function (res) {
      console.log(res);
      // 如果地址不为空则设置第一个地址为默认选中的地址（因为后台会把第一个地址设置为默认地址）
      if (res.data.data.length>0) {
        let data = res.data.data[0];
        that.setData({
          addressData: data
        })
      } else {
      // 如果地址为空则设置地址信息为空
        that.setData({
          addressData: null
        })
      }
      
    }, false);
  },
  goAddressList() {
    if (this.data.data.isaddress==2) {
      wx.navigateTo({
        url: '../address-module/address-list?flag=true&tickting=true',
      });
    } else {
      wx.navigateTo({
        url: '../address-module/address-list?flag=true',
      });
    }
  },
  // 显示选择优惠券
  showCouponList() {
    this.setData({
      couponVisible: true
    });
  },
  // 隐藏选择优惠券
  handleCancelCoupon() {
    this.setData({
      couponVisible: false
    });
  },
  // 设置coupon
  setCoupon() {
    let fullReduction = {};
    this.data.data.userCouponList.forEach((v)=>{
      if(v.checked) {
        fullReduction['reduce'] = v.reduce;
        fullReduction['couponId'] = v.couponId;
      }
    });
    this.setData({
      fullReduction: fullReduction
    });
  },
  // 选择coupon
  changeChooseCoupons(e) {
    let id = e.currentTarget.dataset.id;
    let data = this.data.data;
    data.userCouponList.forEach((v)=>{
      if (v.couponId == id && v.checked == true) {
        v.checked = false;
      } else {
        v.checked = false;
        if (v.couponId == id) {
          v.checked = true;
        }
      }
    });
    this.setData({
      data: data
    });
    this.setCoupon();
    this.getPrice();
  },
  getPrice() {
    let that = this;
    let params2 = that.data.params2;
    params2.couponId = that.data.fullReduction.couponId ? that.data.fullReduction.couponId : 0;
    util.request("post", util.api.prepareOrder, params2, function (res) {
      let data = that.data.data;
      data.total = res.data.total
      that.setData({
        data: data
      });
    }, false);
  },
  // 输入备注
  remakeInput(e) {
    this.setData({
      buyerRemark: e.detail.value
    });
  },
  // 生成订单 去支付页面
  goPay() {
    let that = this;
    let addressData = that.data.addressData;
    if (!addressData) {
      console.log('请添加地址');
      wx.showToast({
        title: 'Add Shipping Address!',
        icon: 'none',
        duration: 1000
      });
    } else if (that.data.data.isaddress == 1 && addressData.province=='N/A') {
      wx.showToast({
        title: 'Please fill in your detailed address information!',
        icon: 'none',
        duration: 1000
      });
    } else {
      let addressId = that.data.addressData.id || '';
      let skuId = that.data.params2.skuId || '';
      let number = that.data.params2.number || '';
      let couponId = that.data.fullReduction.couponId || 0;
      let isSpell = that.data.params2.isSpell;
      let spellId = that.data.params2.spellId;
      let buyerRemark = that.data.buyerRemark;
      let xcx = 2;
      let params = {
        addressId: addressId,
        skuId: skuId,
        number: number,
        couponId: couponId,
        addressId: addressId,
        isSpell: isSpell,
        spellId: spellId,
        buyerRemark: buyerRemark,
        xcx: xcx
      }
      console.log(params);
      util.request("post", util.api.orderaPlaceOrder, params, function (res) {
        console.log(res);
        let orderNumber = res.data.orderNumber;
        if(that.data.params2.isSpell) {
          wx.navigateTo({
            url: './pay?orderNumber=' + orderNumber + '&isSpell=1'
          });
        } else {
          wx.navigateTo({
            url: './pay?orderNumber=' + orderNumber
          });
        }
        
      }, false);
    }
    
    
  }
})