const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 封装request
const request = (method, path, para, backfun, layer = true, failedfun, mustlogin = false ) => {
  if (layer) {
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
  }
  var token = wx.getStorageSync('token') || null;
  // const url = 'https://proj6.thatsmags.com/thmartApi/';
  
  const url = 'https://api.mall.thatsmags.com/thmartApi/';
  if (mustlogin && !token) {
    return false;
  }
  wx.request({
    url: url + path,
    data: para,
    header: {
      TOKEN: token
    },
    method: method,
    // dataType: 'json',
    // responseType: 'text',
    success: function (res) {
      if (layer) {
        wx.hideToast();
      }
      if (res.code == 0) {
        // 错误处理

      } else {
        // 用户token处理
        if (res.data && res.data.token) {
          wx.setStorageSync("token", res.data.token);
        }
        if (backfun) {
          backfun(res.data);
        }
      }
    },
    fail: function (res) {
      if (layer) {
        wx.hideToast();
      }
      if (failedfun) {
        failedfun(data);
      }
      else {
        console.log(res);
      }
    }
    // complete: function(res) {},
  })
}

// 封装request
const request2 = (method, path, para, backfun, layer = true, failedfun, mustlogin = false) => {
  if (layer) {
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
  }
  var token = wx.getStorageSync('token') || null;
  // const url = 'https://proj6.thatsmags.com/thmartApi/';

  const url = 'https://gzh.thmart.com.cn/api/v1/';
  if (mustlogin && !token) {
    return false;
  }
  wx.request({
    url: url + path,
    data: para,
    header: {
      TOKEN: token
    },
    method: method,
    // dataType: 'json',
    // responseType: 'text',
    success: function (res) {
      if (layer) {
        wx.hideToast();
      }
      if (res.code == 0) {
        // 错误处理

      } else {
        // 用户token处理
        if (res.data && res.data.token) {
          wx.setStorageSync("token", res.data.token);
        }
        if (backfun) {
          backfun(res.data);
        }
      }
    },
    fail: function (res) {
      if (layer) {
        wx.hideToast();
      }
      if (failedfun) {
        failedfun(data);
      }
      else {
        console.log(res);
      }
    }
    // complete: function(res) {},
  })
}

// 是否登录函数
const isRegister = ()=>{
  let isRegisterFlag;
  const value = wx.getStorageSync('isRegister')
  isRegisterFlag = value==1?true:false;
  return isRegisterFlag;
}
const privilegeJump = () => {
  if (!isRegister()) {
    if (getSignOut() == 1) {
      wx.navigateTo({
        url: '../authorization/authorized-login',
      })
    } else {
      wx.navigateTo({
        url: '../authorization/authorization',
      })
    }
    return false;
  } else {
    return true;
  }
}
// 获取openid
const getOpenId = () => {
  const openid = wx.getStorageSync('openid')
  return openid;
}
// 获取getSignOut
const getSignOut = () => {
  const signOut = wx.getStorageSync('signOut') || '';
  return signOut;
}
// 以下JS函数用于获取url参数:
const getUrlArgObject = (url)=>{

  var searchUrl = url.split('?');
  var url = searchUrl[1];//获取查询串  
  var theRequest = new Object();
  if (url.indexOf("?") == -1) {
    var strs = url.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  return theRequest;
}


const swiperToDetails = (url)=>{
  var flag = {};
  switch (true) {
    case url.indexOf('GoodsDetails') != -1:   //商品详情页
      flag.type = "GoodsDetails";
      flag.id = getUrlArgObject(url).id;
      wx.navigateTo({
        url: "../goods-details/goods-details?id=" + flag.id
      })
      break;
    case url.indexOf('ShopHome') != -1:       //商户详情页
      flag.type = "ShopHome";
      flag.id = getUrlArgObject(url).id;
      wx.navigateTo({
        url: "../shop-details/shop-details?id=" + flag.id
      })
      break;
    case url.indexOf('HomeSearch') != -1:     //搜索页面
      flag.type = "ShopHome";
      flag.keywords = getUrlArgObject(url).keywords;
      wx.navigateTo({
        url: '../global-search/global-search?id=goods&keywords=' + flag.keywords
      })
      break;
    case url.indexOf('CategoriesGoodsList') != -1:   //分类页面
      flag.type = "CategoriesGoodsList";
      flag.id = getUrlArgObject(url).id;
      wx.navigateTo({
        url: "../categories/goodsList?id=" + flag.id
      })
      break;
    case url.indexOf('ShopGoodsList') != -1:         //商户商品列表页
      flag.type = "ShopGoodsList";
      flag.id = getUrlArgObject(url).id;
      flag.goodsFlag = getUrlArgObject(url).flag;
      if (flag.goodsFlag == 'all') {
        wx.navigateTo({
          url: '../shop-goods-list/shop-goods-list?class=all&id=' + flag.id,
        })
      } else {
        wx.navigateTo({
          url: '../shop-goods-list/shop-goods-list?class=new&id=' + flag.id,
        })
      }
      break;
  }
}

const evenItem = function(data) {
  var data = data;
  if (data.length>8) {
    data.length = parseInt(data.length / 2) * 2;
  }
  return data;
}

// 接口集合
const api = {
  home: 'Ads/Home/list', //首页
  ads: 'Ads/list', //配置广告位置
  group: 'Item/groupBuying', //团购
  goodsList: 'Item/list', //商品列表
  article: 'Article/list', //文章列表
  category: 'Category/loopList', //分类列表
  login: 'User/Wx/miniProgram', //小程序登录
  // 商品详情页
  skuInfo: 'Sku/detail',
  // 购物车
  addCart: 'Cart/edit',
  cartList: 'Cart/list', //购物车列表
  cartDelete: 'Cart/delete', //购物车删除
  cartEditNumber: 'Cart/editNumber', //购物车编辑
  cartSelect: 'Cart/changeSelectAndTotalPrice', //购物车选择
  //地址
  addressList: 'User/Address/list', //地址列表
  changeDefault: 'User/Address/changeDefault', //设置默认地址
  deleteAddress: 'User/Address/delete', //删除地址
  addressDetails: 'User/Address/detail', //地址详情
  addressEdit: 'User/Address/edit', //编辑地址
  // 收藏
  collectList: 'Collect/list',
  collect: 'Collect/collect',
  // 订单
  orderList: 'Order/list',
  orderDetail: 'Order/detail',
  ordersskuconfirm: 'Order/ordersskuconfirm',
  orderDelete: 'Order/delete',
  prepareOrder: 'Order/prepareOrder',
  payOrderDetail: 'Order/payOrderDetail',
  orderaPlaceOrder: 'Order/placeOrder', //生成订单
  pay: 'Wx/miniProgramParam', //支付
  // 物流
  logistics: 'Logistics/detail',
  // 优惠券列表页
  couponList: 'Coupon/list',
  couponGoods: 'Coupon/itemList',
  getCoupon: 'Coupon/get',
  // 授权登录(创建用户)
  createUser: 'User/Wx/wxBindMobile',
  //用户信息
  userDetail: 'User/detail',
  //小程序支付
  miniPay: 'Wx/wewxaddorders',
  // 评论，获取sku详情页
  ordersSkuDetail: 'Order/ordersSkuDetail',
  // 评论上传图片
  xcxfile: 'xcxfile',
  //添加评论
  addReviews: 'Comment/add',
  // 评论列表
  commentList: 'Comment/list',
  // 首页底部上拉加载商品
  hotProducts: 'Item/hotProducts',
  // 拼单分享详情页
  shareDetails: 'OrderSpell/detail',
  //拼单分享详情判断是否已经拼单
  checkOrderSpell: 'OrderSpell/check',
  // 一个用户自己不能拼自己的单（商品详情页进行拼单时使用）
  checkTwo: 'OrderSpell/checkTwo',
  // 一个用户48小时内不能对一个商品发起两次拼单
  checkThree: 'OrderSpell/checkThree',
  // 拼单详情页
  orderSpellDetail:'OrderSpell/detail',
  // 优惠券广告页面
  discountlist: 'Ads/Home/discountlist',
  // 商品小程序码
  wxqrcode: 'wxqrcode',
  // 春运提示
  getmessage: 'getmessage'
}


module.exports = {
  formatTime,
  request,
  request2,
  api,
  isRegister,
  privilegeJump,
  getOpenId,
  swiperToDetails,
  getSignOut,
  evenItem
}
