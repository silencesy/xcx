// components/home/floor/floor.js
Component({
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
    goDetails(e) {
      let id = e.currentTarget.dataset.id;
      console.log(id);
      wx.navigateTo({
        url: "../../pages/shop-details/shop-details?id=" + id
      })
    },
    bindGoList() {
      wx.navigateTo({
        url: "../../pages/shop-list/shop-list"
      })
    }
  }
})
