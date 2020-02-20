// components/base/order-item/order-item.js
Component({
  externalClasses: ['ordericon'],
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGoDetails(e) {
      let orderNumber = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.status;
      wx.navigateTo({
        url: '../../pages/order/order-details?id=' + orderNumber + '&status=' + status
      })
    },
    bindGopay(e) {
      let orderNumber = e.currentTarget.dataset.ordernumber;
      wx.navigateTo({
        url: '../../pages/order/pay?orderNumber=' + orderNumber + '&newpay=1'
      });
    },
    deleteOrder(e) {
      // console.log(e);
      let orderNumber = e.currentTarget.dataset.ordernumber
      this.triggerEvent('deleteorder', { orderNumber: orderNumber});
    },
    bindGoSpell(e) {
      console.log()
      const { currentTarget: { dataset: { ordernumber } } } = e;
      wx.navigateTo({
        url: '../../pages/spell/spell?orderNumber=' + ordernumber
      });
    }
  }
})
