const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    chooseText: 'All',
    activeIndex: 0,
    data: [],
    status: 'loading',
    categoriesData: [
      
    ],
    params: {
      catOneId: 160,
      catTwoId: 161,
      catThreeId:'',
      page: 0,
      pageSize: 20,
      sort: 'createTime_desc',
    },
    totalPage: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategrios();
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
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * 
   */
  getCategrios() {
    let that = this;
    let params = {
      fname: 161
    }
    util.request("post", util.api.category, params, function (res) {
      console.log(res);
      const data = res.data;
      data.unshift({
        id: '',
        title: "All"
      });
      that.setData({
        categoriesData: res.data
      })
    },false);
  },

  getData() {
    let that = this;
    that.data.params.page++;
    console.log(that.data.params.page);
    console.log(that.data.totalPage);
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
      status: 'loading',
      data: []
    });
    // 重新获取数据
    this.getData();
  },
  bindPickerChange({ detail }) {
    let index = detail.value[0];
    this.setData({
      activeIndex: index
    })
  },
  bindShowActions() {
    this.setData({
      show: true
    })
  },
  confirm() {
    let chooseText = this.data.categoriesData[this.data.activeIndex].title;
    let chooseCategoriesId = this.data.categoriesData[this.data.activeIndex].id;
    if (chooseText != this.data.chooseText) {
      let params = this.data.params;
      params.page = 0;
      params.catThreeId = chooseCategoriesId;
      this.setData({
        params: params,
        totalPage: -1,
        status: 'loading',
        data: [],
        show: false,
        chooseText: chooseText
      });
      // 重新获取数据
      this.getData();
    } else {
      this.setData({
        show: false
      });
    }
  },
  cancel(e) {
    this.setData({
      show: false
    })
  },
  close() {
    this.setData({
      show: false
    })
  }
})