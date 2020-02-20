// pages/cart/cart.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: false,
    isShowLayer: false,
    cartDeleteParams: null,
    data: null,
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
    if (util.isRegister()){
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
  // 获取数据
  getData() {
    let that = this;
    util.request("post", "Cart/list", {}, function (res) {
      that.setData({
        data: res.data
      });
      that.isAll();
    },false);
  },
  // 判断所有商品是否选中
  isAll() {
    let that = this;
    let data = that.data.data;
    let allGoodsLength = 0;
    let checkedGoodsLength = 0;
    data.data.forEach((item, index) => {
      item.data.forEach((item2, index) => {
        allGoodsLength++;
        if (item2.isSelect==1) {
          checkedGoodsLength++;
        }
        // // 所有商品选中
        // item2.isSelect = !all ? 1 : 0;
      })
    })
    if (allGoodsLength == checkedGoodsLength) {
      that.setData({
        all: true
      })
    } else {
      that.setData({
        all: false
      })
    }
  },
  // 去商户
  bindGoShop(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop-details/shop-details?id='+id
    })
  },
  // 去商品
  bindGoGoods(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods-details/goods-details?id=' + id
    })
  },
  // 改变数量
  handleChangeNumber(e) {
    // console.log(e);
    var that = this;
    let shopId = e.currentTarget.dataset.shopid;
    let skuId = e.currentTarget.dataset.skuid;
    let cartId = e.currentTarget.dataset.cartid;
    let number = e.detail.value;
    let params = {
      cartId: cartId,
      number: number
    }
    util.request("post", util.api.cartEditNumber, params, function (res) {
      let data = that.data.data;
      let shopData = data.data.find(item => item.brandId == shopId);
      let goodsData = shopData.data.find(item => item.skuId == skuId);
      // 改变单个商品的数量
      goodsData.number = number;
      // 设置总价和满减价格以及关闭弹出框
      data.total = res.data.total;
      data.reduceTotal = res.data.reduceTotal;
      
      that.setData({
        data:data
      })
    }, false);
  },
  // 选择商品
  bindChecked(e) {
    let that = this;
    let shopId = e.currentTarget.dataset.shopid;
    let skuId = e.currentTarget.dataset.skuid;
    let cartId = e.currentTarget.dataset.cartid;
    let isSelect = e.currentTarget.dataset.isselect;
    let data = that.data.data;
    let number = 0;
    let params = {
      isSelect: isSelect == 1 ? 0 : 1,
      cartIdArray: [cartId]
    }
    util.request("post", util.api.cartSelect, params, function (res) {
      let shopData = data.data.find(item => item.brandId == shopId);
      let goodsData = shopData.data.find(item => item.skuId == skuId);
      // 商品选中
      goodsData.isSelect = isSelect==1?0:1;
      // 选中个数计数
      shopData.data.map(n=>{
        if (n.isSelect==1) {
          number++;
        }
      });
      // 商品所有选中，商户选中
      if (number == shopData.data.length) {
        shopData.shopAll = true;
      } else {
        shopData.shopAll = false;
      }
      data.total = res.data.total;
      data.reduceTotal = res.data.reduceTotal;
      data.ispay = res.data.ispay;
      that.setData({
        data: data
      })
      that.isAll();
    }, false);
  },
  // 选择商户
  bindCheckedShop(e) {
    let that = this;
    let shopId = e.currentTarget.dataset.shopid;
    let isSelect = e.currentTarget.dataset.isselect;
    let data = that.data.data;
    let shopData = data.data.find(item => item.brandId == shopId);
    let cartIdArray = [];

    shopData.data.map(n => {
      cartIdArray.push(n.cartId);
    })
    let params = {
      isSelect: isSelect ? 0 : 1,
      cartIdArray: cartIdArray
    }
    util.request("post", util.api.cartSelect, params, function (res) {
      let shopData = data.data.find(item => item.brandId == shopId);
      // 选中商户,该商户的所有商品选中
      shopData.data.map(n => {
        n.isSelect = isSelect ? 0 : 1;
      })
      // 商户选中
      shopData.shopAll = isSelect ? false : true;
      data.total = res.data.total;
      data.reduceTotal = res.data.reduceTotal;
      data.ispay = res.data.ispay;
      that.setData({
        data: data
      })
      that.isAll();
    }, false);

    
  },
  // 删除商品
  bindDeleteCart(e) {
    let shopId = e.currentTarget.dataset.shopid;
    let skuId = e.currentTarget.dataset.skuid;
    let index = e.currentTarget.dataset.index;
    let cartId = e.currentTarget.dataset.cartid;
    let shopIndex = e.currentTarget.dataset.shopindex;
    let cartDeleteParams = {
      shopId: shopId,
      skuId: skuId,
      index: index,
      cartId: cartId,
      shopIndex: shopIndex
    }
    // 展示模态框并且设置删除的参数给bindDone调用
    this.setData({
      cartDeleteParams: cartDeleteParams,
      isShowLayer: true
    });
  },
  // 全选
  bindCheckedAll() {
    let that = this;
    let all = this.data.all;
    let data = this.data.data;
    let params = {
      allSelect: !all ? 1 : 0
    }
    util.request("post", util.api.cartSelect, params, function (res) {
      data.data.forEach((item, index) => {
        // 设置所有商户选中
        item.shopAll = !all;
        item.data.forEach((item2, index) => {
          // 所有商品选中
          item2.isSelect = !all ? 1 : 0;
        })
      })
      data.total = res.data.total;
      data.reduceTotal = res.data.reduceTotal;
      data.ispay = res.data.ispay;
      that.setData({
        all: !all,
        data: data
      })
    }, false);
    
  },
  // 确认删除
  bindDone() {
    let that = this;
    let number = 0;
    let params = {
      cartId: that.data.cartDeleteParams.cartId
    }
    util.request("post", util.api.cartDelete, params, function (res) {
      console.log(res);
      let data = that.data.data;
      let shopData = data.data.find(item => item.brandId == that.data.cartDeleteParams.shopId);
      // 删除商品
      shopData.data.splice(that.data.cartDeleteParams.index,1);
      // 该商户所有商品删除完了，删除商户
      if (shopData.data.length == 0) {
        data.data.splice(that.data.cartDeleteParams.shopIndex, 1);
      }

      // 选中个数计数
      shopData.data.map(n => {
        if (n.isSelect == 1) {
          number++;
        }
      });
      // 商品所有选中，商户选中
      if (number == shopData.data.length) {
        shopData.shopAll = true;
      } else {
        shopData.shopAll = false;
      }

      // 设置总价和满减价格以及关闭弹出框
      data.total = res.data.total;
      data.reduceTotal = res.data.reduceTotal;
      data.ispay = res.data.ispay;
      that.setData({
        data: data,
        isShowLayer: false
      })
      that.isAll();
    }, false);
  },
  // 取消删除
  bindCancle() {
    this.setData({
      isShowLayer: false
    });
  },
  // 去登陆
  bindGoLogIn() {
    util.privilegeJump();
  },
  bindCheckout() {
    let data = this.data.data;
    if (data.total != 0 && data.ispay == 1) {
      wx.navigateTo({
        url: '../order/order-preview',
      })
    } else if (data.ispay == 0) {
      wx.showToast({
        title: 'To purchase eTickets, please submit your order separately.',
        icon: 'none',
        duration: 1000
      });
    } else {
      wx.showToast({
        title: 'Please select at least one goods before the payment!',
        icon: 'none',
        duration: 1000
      });
    }
  },
  goshopping() {
    wx.switchTab({
      url: '../index/index',
    })
  }
})