// components/base/spell-item/spell-item.js
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
    joinNow(e) {
      const { currentTarget: { dataset: {id}}} = e;
      console.log(id)
      this.triggerEvent('showSpell', { id: id });
    }
  }
})
