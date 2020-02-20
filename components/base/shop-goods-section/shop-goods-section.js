// components/base/shop-goods-section/shop-goods-section.js
const util = require('../../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   * status 设置显示物流或者价格  
   * data 数据
   * isgo 是否进入商品详情
   */
  externalClasses: ['shopicon'],
  properties: {
    data: {
      type: Object,
      value: {}
    },
    status: {
      type: String,
      value: ''
    },
    isgo: {
      type: Boolean,
      value: true
    },
    orderNumber: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowLayer: false,
    id: null,
    shopname: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tracking(e) {
      console.log(e)
      let logistics = e.currentTarget.dataset.logistics;
      let company = e.currentTarget.dataset.company;
      wx.navigateTo({
        url: '../../pages/order/logistics?logistics=' + logistics + '&company=' + company
      })
    },
    review(e) {
      const { currentTarget: { dataset: { id,comment } } } = e;
      if ( comment==1 ) {
        wx.showToast({
          title: 'You already submitted the comment!',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      } else {
        wx.navigateTo({
          url: "../../pages/comment/comment?id=" + id
        })
      }
    },
    goDetail(e) {
      console.log(e);
      let id = e.currentTarget.dataset.id;
      if(this.data.isgo) {
        wx.navigateTo({
          url: "../../pages/goods-details/goods-details?id=" + id
        })
      }
    },
    deliveryConfirmed({ currentTarget: { dataset: { id, shopname} } }) {
      this.setData({
        id,
        shopname,
        isShowLayer: true
      });
      // this.triggerEvent('deliveryConfirmed', { id, shopname });
    },
    bindCancle() {
      this.setData({
        isShowLayer: false
      });
    },
    bindDone() {
      let that = this;
      let id = that.data.id;
      let shopname = that.data.shopname;
      let orderNumber = that.data.orderNumber;
      console.log(that.data.orderNumber);
      let params = {
        orderNumber,
        id
      }
      let params2 = {
        shopname,
        id
      }
      util.request("post", util.api.ordersskuconfirm, params, function (res) {
        that.setData({
          isShowLayer: false
        });
        that.triggerEvent('deliveryConfirmed', params2);
      }, true);
      // let id = this.data.id;
      // let shopname = this.data.shopname;
      // let params = {
      //   shopname,
      //   id
      // }
      // this.setData({
      //   isShowLayer: false
      // });
      // this.triggerEvent('deliveryConfirmed', params);
    }
  }
})
