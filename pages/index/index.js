//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索渐变颜色
    backgroundColor: 'rgba(246,67,44,0)',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    boxshaow: true,
    homeData: null,
    hotData: [],
    totalPage: -1,
    hotParams: {
      pageSize: 15,
      page: 0
    },
    showLoading: true,
    isRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.getHotData();
    this.getUserinfoFun();
    wx.getUserInfo({
      withCredentials: true,
      success(res) {
        // console.log(res.userInfo)
      },fail(res) {
        // console.log(res);
      }
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
    // console.log(0);
    var that = this;
    that.setData({
      hotParams: {
        pageSize: 15,
        page: 0
      },
      showLoading: true,
      totalPage: -1,
      hotData: [],
      isRefresh: true
    })
    this.getData();
    this.getHotData();
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getHotData();
  },
  // 顶部搜索栏背景渐变
  onPageScroll: function(e) {
    var scrollTop = e.scrollTop;
    var distance = 250;
    if (scrollTop == 0) {
      this.setData({
        boxshaow: true
      });
    } else {
      this.setData({
        boxshaow: false
      });
    }
    if (scrollTop > distance) {
      this.setData({
        backgroundColor: "rgba(246,67,44,1)"
      });
    }
    else {
      var opacity = 0.95 * (scrollTop / distance);
      this.setData({
        backgroundColor: "rgba(246,67,44," + opacity + ")"
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  // 获取数据
  getData() {
    let that = this;
    util.request("post", "Ads/Home/list", {}, function (res) {
      var homeData = res.data;
      if (that.data.isRefresh) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
      homeData.deal.data = util.evenItem(homeData.deal.data);
      homeData.pditem.data = util.evenItem(homeData.pditem.data);
      homeData.shop.data = util.evenItem(homeData.shop.data);
      homeData.exploreChina.data = util.evenItem(homeData.exploreChina.data);
      homeData.groupBuying.data = util.evenItem(homeData.groupBuying.data);
      Object.keys(homeData.category).forEach((key)=> {
        homeData.category[key].data = util.evenItem(homeData.category[key].data);
      });
      that.setData({
        homeData: homeData
      });
    });
  },
  // 获取热销商品列表
  getHotData() {
    let that = this;
    that.data.hotParams.page++;
    if (that.data.hotParams.page <= that.data.totalPage || that.data.totalPage == -1) {
      util.request("post", "Item/hotProducts", that.data.hotParams, function (res) {
        that.setData({
          hotData: that.data.hotData.concat(res.data.data),
          totalPage: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.hotParams.page == that.data.totalPage) {
          that.setData({
            showLoading: false
          });
        }
      },false,function(){
        that.setData({
          showLoading: false
        });
      });
    } else {
      that.setData({
        showLoading: false
      });
    }
  },
  bindGoSearch() {
    wx.navigateTo({
      url: '../../pages/global-search/global-search?id=goods',
    })
  },
  getUserinfoFun() {
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country
        // console.log(res);
      }
    },{
      withCredentials: false,
        success(res) {
          // const userInfo = res.userInfo
          // const nickName = userInfo.nickName
          // const avatarUrl = userInfo.avatarUrl
          // const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          // const province = userInfo.province
          // const city = userInfo.city
          // const country = userInfo.country
          // console.log(res);
        }
    })
  },
  bindGetUserInfo(e) {
    // console.log(e.detail.userInfo)
  }
})
