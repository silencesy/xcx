// pages/spell/spell.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spellInfo: null,
    flag: null,
    expiredvisible: false, //拼单是否过期
    inviteModal: true,
    goodsData: null,
    number: 1,
    type: 'all',
    couponVisible: false,
    commodityAttr: null,
    attrValueList: [],
    skuInfoData: null,
    chooseSkuVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      orderNumber: options.orderNumber
    },function(){
      // 判断是否登录
      if (util.isRegister) {
        //（checkSpell判断该拼单是否过期，状态码1 过期  2已经拼过单则应该显示邀请好友 3则是加入拼单）
        that.checkSpell();
      } else {
        that.getData();
      }
      that.getHotData();
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
  checkSpell() {
    var that = this;
    util.request("post", util.api.checkOrderSpell, { orderNumber: that.data.orderNumber }, function (res) {
      var data = res.data;
      console.log(data);
      // 拼单过期
      if (data == 1) {
        that.setData({
          expiredvisible: true
        })
      // 自己发起的拼单 或者 自己已将加入拼单
      } else if (data == 2) {
        that.setData({
          flag: 'shareSpell'
        })
      // 加入拼单
      } else if (data == 3) {
        that.setData({
          flag: 'joinSpell'
        })
      }
      that.getData();
    }, false);
  },
  getData() {
    var that = this;
    util.request("post", util.api.orderSpellDetail, { orderNumber: that.data.orderNumber}, function (res) {
      that.setData({
        spellInfo: res.data,
      })
      if (res.data.number_left <= 0) {
        that.setData({
          flag: 'startSpell'
        })
      } else {
        if (that.data.flag != 'shareSpell') {
          that.setData({
            flag: 'joinSpell'
          })
        }
      }
      that.getGoodsData();
    }, false);
  },
  // 获取数据
  getGoodsData() {
    let that = this;
    let params = {
      id: that.data.spellInfo.goods_info.id
    }
    util.request("post", "Item/detail", params, function (res) {
      console.log(res)
      that.setData({
        goodsData: res.data
      });
      that.skuInitData();
      that.initSku();
    }, false);
  },

  // 初始化sku列表
  skuInitData() {
    let skuData = this.data.goodsData.skuList;
    let data = [];
    skuData.forEach((v) => {
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


  handleCancel() {
    this.setData({
      chooseSkuVisible: false
    });
  },
  // 加入拼单sku选择
  bindJoinNow() {
    if (util.privilegeJump){
      this.setData({
        chooseSkuVisible: true
      })
    }
  },
  // 获取热销商品列表
  getHotData() {
    let that = this;
    const params = {
      pageSize: 30,
      page: 1
    }
    util.request("post", "Item/hotProducts", params, function (res) {
      that.setData({
        hotData: res.data.data
      });
    }, false);
  },
  handleChangeNumber({ detail }) {
    this.setData({
      number: detail.value
    })
  },
  // 去首页
  goGoodsDetails() {
    wx.navigateTo({
      url: "../goods-details/goods-details?id=" + this.data.goodsData.id
    })
  },
  bindSpell() {
    let that = this;
    let spellInfo = that.data.skuInfoData;
    if (spellInfo) {
      //加入拼单
      wx.navigateTo({
        url: '../order/order-preview?skuid=' + that.data.skuInfoData.id + "&number=" + that.data.number + "&isSpell=1" + "&spellId=" + that.data.spellInfo.id
      })
    } else {
      wx.showToast({
        title: 'Please select goods!',
        icon: 'none',
        duration: 1000
      });
    }
    
  }
})