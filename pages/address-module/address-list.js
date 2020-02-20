const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'loading',
    isShowLayer: false,
    params: {
      page: 0,
      pageSize: 10,
    },
    totalPage: -1,
    data: [],
    flag: false,
    tickting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.flag) {
      this.setData({
        flag: options.flag
      })
    }
    if (options.tickting) {
      this.setData({
        tickting: options.tickting
      })
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
    this.setData({
      status: 'loading',
      isShowLayer: false,
      params: {
        page: 0,
        pageSize: 10,
      },
      totalPage: -1,
      data: []
    })
    this.getData();
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
  // 获取地址列表
  getData() {
    let that = this;
    that.data.params.page++;
    if (that.data.params.page <= that.data.totalPage || that.data.totalPage == -1) {
      util.request("post", util.api.addressList, that.data.params, function (res) {
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
  // 设置默认地址
  bindSetDefault(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let params = {
      id: id
    }
    util.request("post", util.api.changeDefault, params, function (res) {
      let data = that.data.data;
      data.forEach((value,index)=>{
        value.isDefault = 0;
      });
      data[index].isDefault = 1;
      that.setData({
        data: data
      })
    },false)
  },
  // 删除地址
  bindDelete(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let deleteParams = {
      id: id,
      index: index
    }
    // 设置删除参数
    // 显示删除模态框
    that.setData({
      deleteParams: deleteParams,
      isShowLayer: true
    });
  },
  bindEdit(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './add-address?id=' + id,
    })
  },
  bindGoAddAddress() {
    if (this.data.tickting) {
      wx.navigateTo({
        url: './add-address?tickting=true',
      })
    } else {
      wx.navigateTo({
        url: './add-address',
      })
    }
    
  },
  // 确认删除
  bindDone() {
    let that = this;
    let params = {
      id: that.data.deleteParams.id
    }
    util.request("post", util.api.deleteAddress, params, function (res) {
      let data = that.data.data;
      data.splice(that.data.deleteParams.index,1);
      // 如果删除的地址id和支付页面确认页地址id相同则 支付确认页面的地址会变化
      if (app.globalData.addressId == that.data.deleteParams.id) {
        app.globalData.addressId = null;
      }
      that.setData({
        data: data,
        isShowLayer: false
      })
    }, false)
  },
  // 取消删除
  bindCancle() {
    this.setData({
      isShowLayer: false
    });
  },
  // 选择地址
  choose(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let flag = this.data.flag;
    if (flag) {
      app.globalData.addressId = id;
      wx.navigateBack({
        delta: 1
      });
    }
  }
})