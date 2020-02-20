// pages/goods-details/goods-details.js
const util = require('../../utils/util.js');
const WxParse = require('../../wxParse/wxParse.js');

const posterConfig = {
  jdConfig: {
    width: 750,
    height: 1200,
    backgroundColor: '#fff',
    debug: false,
    pixelRatio: 1,
    blocks: [
      {
        width: 690,
        height: 820,
        x: 30,
        y: 100,
        borderWidth: 1,
        borderColor: '#f6442b',
        borderRadius: 20,
      },
      {
        width: 634,
        height: 74,
        x: 59,
        y: 770,
        backgroundColor: '#fff',
        opacity: 0.5,
        zIndex: 100,
      },
    ],
    texts: [
      {
        x: 30,
        y: 30,
        baseLine: 'top',
        text: 'Share with your friends!',
        fontSize: 38,
        color: '#080808',
      },
      {
        x: 92,
        y: 810,
        fontSize: 38,
        baseLine: 'middle',
        text: '11111111',
        width: 570,
        lineNum: 1,
        color: '#8d8d8d',
        zIndex: 200,
      },
      {
        x: 59,
        y: 870,
        baseLine: 'middle',
        text: [
          {
            text: '¥99',
            fontSize: 36,
            color: '#ec1731',
            marginLeft: 30,
          }
        ]
      },
      {
        x: 300,
        y: 1050,
        baseLine: 'top',
        text: 'Long press & extract the code',
        fontSize: 28,
        color: '#080808',
      },
    ],
    images: [
      {
        width: 634,
        height: 634,
        x: 59,
        y: 120,
        url: '',
      },
      {
        width: 220,
        height: 220,
        x: 60,
        y: 950,
        url: '',
      }
    ]
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clearTimer: false,
    targetTime: new Date().getTime() + 5000,
    id: 0,
    goodsData: null,
    visible: false,
    number: 1,
    type: 'all',
    couponVisible: false,
    commodityAttr: null,
    attrValueList: [],
    skuInfoData: null,
    groupVisible: false,
    isSpellSinglePrice: false,  //选中的是否为拼单价格
    spellVisible: false,
    spellId: null,
    posterConfig: posterConfig.jdConfig
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      targetTimes: new Date().getTime() + 5000
    });
    this.setData({
      id: options.id || options.scene
    });
    this.getData();
  },
  onPosterSuccess(e) {
    const { detail } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  onPosterFail() {

  },
  posterData(e) {
    console.log(e);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.goodsData.title,
      path: '/pages/goods-details/goods-details?id=' + this.data.goodsData.id,
      imageUrl: this.data.goodsData.pic
    }
  },
  // 获取数据
  getData() {
    let that = this;
    let params = {
      id: that.data.id
    }
    let params2 = {
      id: that.data.id,
      page: 1,
      pageSize: 2,
      hasPic: 0
    }
    util.request("post", "Item/detail", params, function (res) {
      let detailsdata = res.data.detail;
      WxParse.wxParse('detailsdata', 'html', detailsdata, that, 12);
      var shareData = that.data.posterConfig;

      // 海报参数需要的参数 从商品接口返回函数中设置
      shareData.images[0].url = res.data.pic;
      shareData.images[1].url = `https://gzh.thmart.com.cn/wxqrcode/${res.data.id}.png`;
      shareData.texts[1].text = res.data.title;
      shareData.texts[2].text[0].text = `￥${res.data.minPrice}`;

      that.setData({
        goodsData: res.data,
        posterConfig: shareData
      },function(){
        wx.setNavigationBarTitle({
          title: that.data.goodsData.title
        })
      });
      that.skuInitData();
      that.initSku();
    },false);
    util.request("post", util.api.commentList, params2, function (res) {
      that.setData({
        reviews: res.data.data
      });
    }, false);
  },
  handleCancel() {
    this.setData({
      visible: false,
      spellId: null
    });
  },
  // 隐藏获取优惠券
  handleCancelCoupon() {
    this.setData({
      couponVisible: false
    });
  },
  // 展示获取优惠券
  getCoupon() {
    this.setData({
      couponVisible: true
    });
  },
  // 获取优惠券
  getCoupons(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let data = that.data.goodsData;
    let params = {
      id: id
    }
    if (util.privilegeJump()) {
      util.request("post", util.api.getCoupon, params, function (res) {
        if (res.code == 1) {
          data.couponList.forEach((v) => {
            if (v.couponId == id) {
              v.isGet = 1;
            }
          });
          that.setData({
            goodsData: data
          });
        } else if (res.code == 129) {
          wx.showToast({
            title: 'Sorry, the coupon collection is closed now.',
            icon: 'none',
            duration: 1000
          });
        } else if (res.code == 130) {
          wx.showToast({
            title: 'The coupon is expired.',
            icon: 'none',
            duration: 1000
          });
        }
        
      }, false);
    }
  },
  openBuyInfo(e) {
    console.log(e);
    // 加入拼单
    if (e.detail.id) {
      this.setData({
        visible: true,
        type: 'spell',
        isSpellSinglePrice: true,
        spellId: e.detail.id
      });
    } else {
      let type = e.currentTarget.dataset.type;
      // 发起拼单
      if (type == 'spell') {
        this.setData({
          visible: true,
          type: type,
          isSpellSinglePrice: true,
          spellId: null
        });
      } else {
        // 原价购买
        this.setData({
          visible: true,
          type: type,
          isSpellSinglePrice: false,
          spellId: null
        });
      }
    }
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },
  handleChangeNumber({ detail }) {
    this.setData({
      number: detail.value
    })
  },
  // 去购物车页面
  bindGoCart() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  // 收藏商品
  bindsSaveGoods() {
    let that = this;
    if (util.privilegeJump()) {
      let goodsData = that.data.goodsData;
      let isCollect = that.data.goodsData.isCollect == 1 ? 0 : 1;
      let id = that.data.goodsData.id;
      let params = {
        type: 1,
        contentId: id,
        isCollect: isCollect
      }
      util.request("post", util.api.collect, params, function (res) {
        goodsData.isCollect = isCollect;
        that.setData({
          goodsData: goodsData
        })
      }, false);
    }
    
  },
  // 购买
  bindBuy() {
    let that = this;
    let number = that.data.number;
    let skuInfoData = that.data.skuInfoData;
    if (util.privilegeJump()) {
      if (skuInfoData) {
        that.setData({
          visible: false
        });
        wx.navigateTo({
          url: '../order/order-preview?skuid=' + skuInfoData.id + "&number=" + number
        })
      } else {
        wx.showToast({
          title: 'Please select goods!',
          icon: 'none',
          duration: 1000
        });
      }
    }
  },
  // 拼单购买
  bindSpell() {
    let that = this;
    let number = that.data.number;
    let skuInfoData = that.data.skuInfoData;
    if (util.privilegeJump()) {
      if (skuInfoData) {
        that.setData({
          visible: false
        });
        // 加入拼单
        if(that.data.spellId) {
          util.request("post", util.api.checkTwo, { spellId: that.data.spellId}, function (res) {
            console.log(res);
            if(res.code==1) {
              //加入拼单
              wx.navigateTo({
                url: '../order/order-preview?skuid=' + skuInfoData.id + "&number=" + number + "&isSpell=1" + "&spellId=" + that.data.spellId
              })
            } else if(res.code == 123) {
              wx.showToast({
                title: 'You cannot join group buys issued by yourself!',
                icon: 'none'
              })
            }
          }, false);
          
        } else {
          util.request("post", util.api.checkThree, { itemId: that.data.id}, function (res) {
            if(res.code == 1) {
              // 发起拼单
              wx.navigateTo({
                url: '../order/order-preview?skuid=' + skuInfoData.id + "&number=" + number + "&isSpell=1"
              })
            } else if (res.code == 124) {
              wx.showToast({
                title: 'You cannot initiate two group buys for the same item within 48 hours!',
                icon: 'none'
              })
            } 
          }, false);
          
        }
        
      } else {
        wx.showToast({
          title: 'Please select goods!',
          icon: 'none',
          duration: 1000
        });
      }
    }
  },
  // 加入购物车
  bindAddCart() {
    let that = this;
    let goodsData = that.data.goodsData;
    let number = that.data.number;
    let skuInfoData = that.data.skuInfoData;
    if (util.privilegeJump()) {
      if (skuInfoData) {
        let params = {
          goodsId: goodsData.id,
          skuId: skuInfoData.id,
          number: number
        }
        util.request("post", util.api.addCart, params, function (res) {
          that.setData({
            visible: false
          });
          wx.showToast({
            title: 'Successfully!',
            icon: 'none',
            duration: 1000
          });
        }, false);
      } else {
        wx.showToast({
          title: 'Please select goods!',
          icon: 'none',
          duration: 1000
        });
      }
    }
  },


  // 初始化sku列表
  skuInitData() {
    let skuData = this.data.goodsData.skuList;
    let data = [];
    skuData.forEach((v)=>{
      let skuItem = {};
      skuItem.skuId = v.id;
      skuItem.attrValueList = [];
      for (let key in v.propName) {
        let obj = {};
        obj['attrKey'] = key;
        obj['attrValue'] = v.propName[key][0];
        skuItem.attrValueList.push(obj);
        // skuItem[key] = v.propName[key][0];
      }
      data.push(skuItem);
    });
    this.setData({
      commodityAttr: data
    })
  },
  initSku() {
    this.setData({
      includeGroup: this.data.commodityAttr
    });
    this.distachAttrValue(this.data.commodityAttr);
    // 只有一个属性组合的时候默认选中 
    console.log(this.data.attrValueList); 
    if (this.data.commodityAttr.length == 1) {
      for (var i = 0; i < this.data.commodityAttr[0].attrValueList.length; i++) {
        this.data.attrValueList[i].selectedValue = this.data.commodityAttr[0].attrValueList[i].attrValue;
      }
      this.setData({
        attrValueList: this.data.attrValueList
      });
      let id = this.data.includeGroup[0].skuId;
      this.getSkuAxios(id);
    }
  },
   /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /** 
    将后台返回的数据组合成类似 
    { 
    attrKey:'型号', 
    attrValueList:['1','2','3'] 
    } 
    */
    // 把数据对象的数据（视图使用），写到局部内 
    var attrValueList = this.data.attrValueList;
    // 遍历获取的数据 
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
        // console.log('属性索引', attrIndex); 
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置 
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理 
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }
    // console.log('result', attrValueList) 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },
  getAttrIndex: function (attrName, attrValueList) {
    // 判断数组中的attrKey是否有该属性值 
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值 
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    /* 
    点选属性值，联动判断其他属性值是否可选 
    { 
    attrKey:'型号', 
    attrValueList:['1','2','3'], 
    selectedValue:'1', 
    attrValueStatus:[true,true,true] 
    } 
    console.log(e.currentTarget.dataset); 
    */
    var attrValueList = this.data.attrValueList;
    var index = e.currentTarget.dataset.index;//属性索引 
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        // 取消选中 
        this.disSelectValue(attrValueList, index, key, value);
      } else {
        // 选中 
        this.selectValue(attrValueList, index, key, value);
      }
 
    }
    this.getSkuInfo();
  },
  /* 选中 */
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    // console.log('firstIndex', this.data.firstIndex); 
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选 
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空 
      // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus); 
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }
 
    // console.log('选中', commodityAttr, index, key, value); 
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;
 
    // 判断属性是否可选 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = false;
      }
    }
    for (var k = 0; k < attrValueList.length; k++) {
      for (var i = 0; i < includeGroup.length; i++) {
        for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
          if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
            for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
              if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
                attrValueList[k].attrValueStatus[m] = true;
              }
            }
          }
        }
      }
    }
    // console.log('结果', attrValueList); 
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });
 
    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) {// 第一次选中，同属性的值都可选 
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
  },
  /* 取消选中 */
  disSelectValue: function (attrValueList, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';
 
    // 判断属性是否可选 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });
 
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
  },
  getSkuInfo: function () {
    var value = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      value.push(this.data.attrValueList[i].selectedValue);
    }
    if (!(i < this.data.attrValueList.length)) {
      console.log(this.data.includeGroup[0].skuId);
      let id = this.data.includeGroup[0].skuId;
      this.getSkuAxios(id);
    } else {
      this.setData({
        skuInfoData: null
      });
    }
  },
  getSkuAxios(id) {
    let that = this;
    let params = {
      id: id
    }
    util.request("post", util.api.skuInfo, params, function (res) {
      that.setData({
        skuInfoData: res.data,
        number: 1
      });
    }, false);
  },
  goHome() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  myLinsterner() {
    this.setData({
      groupVisible: true
    });
  },
  refreshPage() {
    this.setData({
      groupVisible: false,
      visible: false,
      skuInfoData: null
    });
    this.getData();
  },
  goReviews() {
    if (this.data.reviews.length > 0) {
      wx.navigateTo({
        url: '../comment/comment-list?id=' + this.data.id
      })
    } else {
      wx.showToast({
        title: 'Be the first to review!',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    }
  },
  // 取消显示拼单列表模态框
  handleCancelSpell() {
    this.setData({
      spellVisible: false
    });
  },
  showSpellList() {
    if (this.data.goodsData.spellInfo.spellList.length >= 2) {
      this.setData({
        spellVisible: true
      });
    }
    
  }

})