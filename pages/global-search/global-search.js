// pages/global-search/global-search.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'goods',
    status: '',
    data: [],
    showSort: false,
    params: {
      id: 0,
      page: 0,
      pageSize: 10,
      sort: 'createTime_desc',
      search: ''
    },
    totalPage: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var active = options.id || 'goods';
    var keywords = options.keywords || null;
    if(active=='goods') {
      var url = util.api.goodsList;
      var params = this.data.params;
      params.sort = 'createTime_desc';
      params.id = 0;
    } else if (active == 'shops') {
      var params = this.data.params;
      params.id = 5;
      params.sort = 'order_asc';
      var url = util.api.ads;

    }
    if (keywords) {
      params.search = keywords;
    }
    this.setData({
      active: active,
      url: url,
      params: params
    });
    // 如果页面进来带有搜索词就直接加载数据
    if (keywords) {
      this.bindSearch();
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
  tab(e) {
    var active = e.currentTarget.dataset.id;
    if (active == 'goods') {
      var url = util.api.goodsList;
      var params = this.data.params;
      params.page = 0;
      params.id = 0;
      params.sort = 'createTime_desc';
    } else if (active == 'shops') {
      var url = util.api.ads;
      var params = this.data.params;
      params.id = 5;
      params.page = 0;
      params.sort ='order_asc';
    } else if (active == 'articles') {
      var url = util.api.article;
      var params = this.data.params;
      params.sort = 'createTime_desc';
      params.page = 0;
    }
    this.setData({
      active: active,
      url: url,
      totalPage: -1,
      data: []
    })
    if (this.data.params.search) {
      this.getData();
    }
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
      util.request("post", that.data.url, that.data.params, function (res) {
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
  bindSearch() {
    
    if (this.data.params.search) {
      var params = this.data.params;
      params.page = 0;
      this.setData({
        params: params,
        totalPage: -1,
        data: []
      });
      this.getData();
    }
  },
  bindInputValue(e) {
    let value = e.detail.value;
    let params = this.data.params;
    params.search = value
    this.setData({
      params: params
    })
  }
})