// pages/comment/comment.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    imgData: [],
    article_images: [],
    value: '',
    reviews_images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    this.setData({
      id: id
    },function(){
      this.getData();
    });
  },
  getData() {
    const that = this;
    const params = {
      id: that.data.id
    }
    util.request("post", util.api.ordersSkuDetail, params , function (res) {
      const data = res.data.data[0];
      that.setData({
        data: data
      })
    });
  },
  bindinputcontent({ detail }) {
    let value = detail.value;
    this.setData({
      value: value
    })
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 5-that.data.imgData.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var imgData = that.data.imgData;
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgData: imgData.concat(tempFilePaths)
        })
      }
    })
  },
  deleteImg({ currentTarget }) {
    const index = currentTarget.dataset.index;
    const imgData = this.data.imgData;
    imgData.splice(index, 1);
    this.setData({
      imgData: imgData
    })
  },
  submitReivews() {
    const that = this;
    if(that.data.value.length>4) {
      const promiseArr = []
      that.data.imgData.forEach(function (element, index) {
        let filePath = element;
        promiseArr.push(new Promise((reslove, reject) => {
          wx.uploadFile({
            url: 'https://api.mall.thatsmags.com/thmartApi/'+util.api.xcxfile,
            filePath: filePath,
            name: 'reviews',
            success(res) {
              console.log(res);
              that.setData({
                reviews_images: that.data.reviews_images.concat(res.data)
              })
              reslove()
            }
          })
        }))
      });
      Promise.all(promiseArr).then(res => {
        var commentpic = that.data.reviews_images.join('|');
        var params = {
          comment: that.data.value,
          picList: [],
          commentpic: commentpic,
          type: 'xcx',
          id: that.data.id
        };
        util.request("post", util.api.addReviews, params, function (res) {
          wx.showToast({
            title: 'Successful',
            duration: 2000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },2000);
        });
      });
    } else {
      wx.showToast({
        title: 'Your comment must contain at least 5 characters!',
        icon: 'none',
        duration: 2000
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

  }
})