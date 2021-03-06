// components/base/base-article/base-article.js
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
      wx.navigateTo({
        url: "../../pages/article-details/article-details?id=" + id
      })
    },
    bindGoList() {
      wx.switchTab({
        url: '../../pages/guide/guide',
      })
    },
    bindGoArticleList() {
      wx.switchTab({
        url: '../../pages/guide/guide'
      })
    }
  }
})
