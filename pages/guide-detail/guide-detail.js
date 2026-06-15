/**
 * 指南详情页面
 * 展示特定人群的饮食原则详情
 */

const { DIETARY_GUIDE } = require('../../data/guide-data');

Page({
  data: {
    category: null,
    type: ''
  },

  onLoad(options) {
    const { type, id } = options;
    
    if (type === 'group' && id) {
      const category = DIETARY_GUIDE.groups.categories.find(c => c.id === id);
      if (category) {
        this.setData({ category, type });
        wx.setNavigationBarTitle({ title: category.name });
      }
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  }
});
