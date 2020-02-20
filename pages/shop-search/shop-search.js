// pages/shop-search/shop-search.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      id: 0,
      page: 0,
      pageSize: 10,
      sort: "createTime_desc",
      search: '',
      brandId: 32
    },
    status: '',
    totalPage: -1,
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = this.data.params;
    params.brandId = options.id;
    this.setData({
      params: params
    });
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
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindInputValue(e) {
    let value = e.detail.value;
    let params = this.data.params;
    params.search = value
    this.setData({
      params: params
    })
  },
  // 获取数据
  getData() {
    console.log(123);
    let that = this;
    that.data.params.page++;
    that.setData({
      status: 'loading'
    });
    if (that.data.params.page <= that.data.totalPage || that.data.totalPage == -1) {
      util.request("post", util.api.goodsList, that.data.params, function (res) {
        console.log(res);
        that.setData({
          data: that.data.data.concat(res.data.data),
          totalPage: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.params.page == that.data.totalPage) {
          that.setData({
            status: 'end'
          });
        }
      }, false, function () {
        that.setData({
          status: 'end'
        });
      });
    } else {
      that.setData({
        status: 'end'
      });
    }
  },
  sortevent(e) {
    let sort = e.detail.active;
    // 切换排序，初始化数据
    let params = this.data.params;
    params.sort = sort;
    params.page = 0;
    this.setData({
      params: params,
      totalPage: -1,
      data: []
    });
    // 重新获取数据 
    if (this.data.params.search) {
      this.getData();
    }
  },
  bindSearch() {
    let params = this.data.params;
    params.page = 0;
    this.setData({
      params: params,
      totalPage: -1,
      data: []
    })
    if (this.data.params.search) {
      this.getData();
    }
  }
})