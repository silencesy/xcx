// components/base/sort/sort.js
/**
	 * active当前索引 用于选中当前项 
	 * lift升降序 向上和向下箭头高亮
	 * frist 当选择了price之后再切换latest和sale栏  然后再切回price的时候保持之前的price升降序
   * 
   * 
   * borderBottom 是否显示底部线条
	 */
Component({
  externalClasses: ['top', 'down'],
  /**
   * 组件的属性列表
   */
  properties: {
    borderBottom: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 'createTime_desc',
    lift: 'price_desc',
    frist: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tab(e) {
      let active = e.currentTarget.id;
      var that = this;
      if (that.data.active != active) {
        that.setData({
          active: active
        });
        if (active == 'createTime_desc' || active == 'sellNumber_desc') {
          that.triggerEvent('sortevent', { active: active});
        } else {
          that.setData({
            frist: true
          });
        }
      }
      if (that.data.frist) {
        that.setData({
          frist: false
        })
        that.triggerEvent('sortevent', { active: that.data.lift });
      } else if (that.data.active == 'price_desc' && active == 'price_desc') {
        if (that.data.lift == 'price_desc') {
          that.setData({
            lift: 'price_asc'
          })
          that.triggerEvent('sortevent', { active: that.data.lift });
        } else {
          // that.data.lift = 'price_desc';
          that.setData({
            lift: 'price_desc'
          })
          that.triggerEvent('sortevent', { active: that.data.lift });
        }
      }
    }
  }
})
