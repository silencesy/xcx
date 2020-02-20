// pages/guide/guide.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showId: 0,
    duration: 200,
    params: {
      pageSize: 20,
      page: 0,
      id: 0,
      hasPic: 0
    },
    totalPage: -1,
    allData: [],
    status: 'loading',
    params2: {
      pageSize: 20,
      page: 0,
      id: 0,
      hasPic: 1
    },
    totalPage2: -1,
    imgData: [],
    status2: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    var params = this.data.params;
    params.id = id;
    var params2 = this.data.params2;
    params2.id = id;
    this.setData({
      params,
      params2
    },function(){
      this.getData();
      this.getData2();
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

  },

  bindchange: function (e) {
    var current = e.detail.current;
    this.setData({
      showId: current
    })
  },
  tab: function (e) {
    this.setData({
      duration: 0
    });
    if (this.data.showId != e.target.id) {
      var showId = e.target.id;
      this.setData({
        showId: showId
      })
    }
    this.setData({
      duration: 200
    });
  },
  getData() {
    let that = this;
    that.data.params.page++;
    if (that.data.params.page <= that.data.totalPage || that.data.totalPage == -1) {
      util.request("post", util.api.commentList, that.data.params, function (res) {
        that.setData({
          allData: that.data.allData.concat(res.data.data),
          totalPage: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.params.page == that.data.totalPage) {
          that.setData({
            status: 'end'
          });
        }
        console.log(res);
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
  getData2() {
    let that = this;
    that.data.params2.page++;
    if (that.data.params2.page <= that.data.totalPage2 || that.data.totalPage2 == -1) {
      util.request("post", util.api.commentList, that.data.params2, function (res) {
        that.setData({
          imgData: that.data.imgData.concat(res.data.data),
          totalPage2: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.params2.page == that.data.totalPage2) {
          that.setData({
            status2: 'end'
          });
        }
      }, false, function () {
        that.setData({
          status2: 'end'
        });
      });
    } else {
      that.setData({
        status2: 'end'
      });
    }
  }
})