// pages/guide/guide.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showId: 0,
    duration: 200,
    scrollLeft: 0,
    // 所有
    params: {
      pageSize: 10,
      page: 0,
      status: ''
    },
    totalPage: -1,
    allData: [],
    status: 'loading',
    // 未支付
    params2: {
      pageSize: 10,
      page: 0,
      status: [0, 5]
    },
    totalPage2: -1,
    unpaidData: [],
    status2: 'loading',
    // 未发货
    params3: {
      pageSize: 10,
      page: 0,
      status: [1, 6, 7]
    },
    totalPage3: -1,
    unShippedData: [],
    status3: 'loading',
    // 运输中
    params4: {
      pageSize: 10,
      page: 0,
      status: [2]
    },
    totalPage4: -1,
    inProgressData: [],
    status4: 'loading',
    // 已到货
    params5: {
      pageSize: 10,
      page: 0,
      status: [3],
      xcx: 2
    },
    totalPage5: -1,
    shippedDta: [],
    status5: 'loading',
    isShowLayer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showId: options.id || 0,
      paidOver: options.paidOver || null
    });
    if (this.data.showId == 0) {
      this.getData();
    }
  },
  // 获取数据函数
  getDataFun(status) {
    if (status == 0) {
      this.getData();
    } else if (status == 1) {
      this.getData2();
    } else if (status == 2) {
      this.getData3();
    } else if (status == 3) {
      this.getData4();
    } else if (status == 4) {
      this.getData5();
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
    console.log(123);
    if (this.data.paidOver) {
      wx.switchTab({
        url: '../index/index'
      })
    }
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
    console.log('change');
    var current = e.detail.current;
    this.setData({
      showId: current
    })
    if (current == 4) {
      this.setData({
        scrollLeft: 100
      })
    }
    if (current == 0 || current == 1 || current == 2) {
      this.setData({
        scrollLeft: 0
      })
    }
    this.getDataFun(this.data.showId);
  },
  tab: function (e) {
    console.log('tab');
    this.setData({
      duration: 0
    });
    if (this.data.showId != e.target.id) {
      var showId = e.target.id;
      this.setData({
        showId: showId
      })
      if (showId == 4) {
        this.setData({
          scrollLeft: 100
        })
      }
      if (showId == 0 || showId == 1 || showId == 2) {
        this.setData({
          scrollLeft: 0
        })
      }
    }
    this.setData({
      duration: 200
    });
  },
  getData() {
    let that = this;
    that.data.params.page++;
    if (that.data.params.page <= that.data.totalPage || that.data.totalPage == -1) {
      util.request("post", util.api.orderList, that.data.params, function (res) {
        that.setData({
          allData: that.data.allData.concat(res.data.data),
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
  getData2() {
    let that = this;
    that.data.params2.page++;
    if (that.data.params2.page <= that.data.totalPage2 || that.data.totalPage2 == -1) {
      util.request("post", util.api.orderList, that.data.params2, function (res) {
        that.setData({
          unpaidData: that.data.unpaidData.concat(res.data.data),
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
  },
  getData3() {
    let that = this;
    that.data.params3.page++;
    if (that.data.params3.page <= that.data.totalPage3 || that.data.totalPage3 == -1) {
      util.request("post", util.api.orderList, that.data.params3, function (res) {
        that.setData({
          unShippedData: that.data.unShippedData.concat(res.data.data),
          totalPage3: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.params3.page == that.data.totalPage3) {
          that.setData({
            status3: 'end'
          });
        }
      }, false, function () {
        that.setData({
          status3: 'end'
        });
      });
    } else {
      that.setData({
        status3: 'end'
      });
    }
  },
  getData4() {
    let that = this;
    that.data.params4.page++;
    if (that.data.params4.page <= that.data.totalPage4 || that.data.totalPage4 == -1) {
      util.request("post", util.api.orderList, that.data.params4, function (res) {
        that.setData({
          inProgressData: that.data.inProgressData.concat(res.data.data),
          totalPage4: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.params4.page == that.data.totalPage4) {
          that.setData({
            status4: 'end'
          });
        }
      }, false, function () {
        that.setData({
          status4: 'end'
        });
      });
    } else {
      that.setData({
        status4: 'end'
      });
    }
  },
  getData5() {
    let that = this;
    that.data.params5.page++;
    if (that.data.params5.page <= that.data.totalPage5 || that.data.totalPage5 == -1) {
      util.request("post", util.api.orderList, that.data.params5, function (res) {
        that.setData({
          shippedDta: that.data.shippedDta.concat(res.data.data),
          totalPage5: res.data.totalPage
        });
        if (res.data.totalPage == 0 || that.data.params5.page == that.data.totalPage5) {
          that.setData({
            status5: 'end'
          });
        }
      }, false, function () {
        that.setData({
          status5: 'end'
        });
      });
    } else {
      that.setData({
        status5: 'end'
      });
    }
  },
  // 展示删除弹出框
  bindShowLayer({ detail }) {
    this.setData({
      isShowLayer: true,
      deleteOrderNumber: detail.orderNumber
    });
  },
  // 确认删除  子组件传入id 当前组件showId决定删除那个数据数组
  bindDone() {
    let that = this;
    let params = {
      orderNumber: that.data.deleteOrderNumber
    }
    util.request("post", util.api.orderDelete, params, function (res) {
      
      if (that.data.showId == 0) {
        let data = that.data.allData;
        data.forEach((v,i)=>{
          console.log(v,i);
          if (v.orderNumber == that.data.deleteOrderNumber) {
            data.splice(i, 1);
          }
        });
        that.setData({
          allData: data,
          isShowLayer: false
        })
      } else if (that.data.showId == 4) {
        let data = that.data.shippedDta;
        data.forEach((v, i) => {
          console.log(v, i);
          if (v.orderNumber == that.data.deleteOrderNumber) {
            data.splice(i, 1);
          }
        });
        that.setData({
          shippedDta: data,
          isShowLayer: false
        })
      }
    }, false)
  },
  // 取消删除
  bindCancle() {
    this.setData({
      isShowLayer: false
    });
  },
})