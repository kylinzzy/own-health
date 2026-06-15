/**
 * 膳食指南页面
 * 展示《中国居民膳食指南》核心内容
 */

const { DIETARY_GUIDE } = require('../../data/guide-data');

Page({
  data: {
    activeTab: 'pagoda',
    tabs: [
      { key: 'pagoda', label: '膳食宝塔', icon: '🏗️' },
      { key: 'nutrients', label: '营养素', icon: '📊' },
      { key: 'groups', label: '人群原则', icon: '👥' },
      { key: 'taboos', label: '饮食禁忌', icon: '🚫' }
    ],
    guideData: DIETARY_GUIDE,
    searchKeyword: '',
    searchResults: []
  },

  onLoad() {
    this.setData({
      guideData: DIETARY_GUIDE
    });
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ searchKeyword: keyword });
    
    if (keyword) {
      this.performSearch(keyword);
    } else {
      this.setData({ searchResults: [] });
    }
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    const results = [];
    const { guideData } = this.data;

    // 搜索膳食宝塔
    guideData.pagoda.levels.forEach(level => {
      if (level.name.includes(keyword) || level.recommendation.includes(keyword)) {
        results.push({
          type: 'pagoda',
          title: level.name,
          content: level.recommendation,
          tips: level.tips,
          icon: level.icon
        });
      }
    });

    // 搜索营养素
    guideData.nutrients.items.forEach(item => {
      if (item.name.includes(keyword) || item.note.includes(keyword)) {
        results.push({
          type: 'nutrients',
          title: item.name,
          content: `${item.male}${item.unit}（男）/ ${item.female}${item.unit}（女）`,
          note: item.note,
          icon: item.icon
        });
      }
    });

    // 搜索人群原则
    guideData.groups.categories.forEach(cat => {
      if (cat.name.includes(keyword)) {
        results.push({
          type: 'groups',
          title: cat.name,
          content: cat.principles.join('；'),
          icon: cat.icon
        });
      }
      cat.principles.forEach(principle => {
        if (principle.includes(keyword)) {
          results.push({
            type: 'groups',
            title: cat.name,
            content: principle,
            icon: cat.icon
          });
        }
      });
    });

    // 搜索禁忌
    guideData.taboos.items.forEach(item => {
      if (item.category.includes(keyword)) {
        results.push({
          type: 'taboos',
          title: item.category,
          content: item.items.join('；'),
          icon: item.icon
        });
      }
      item.items.forEach(subItem => {
        if (subItem.includes(keyword)) {
          results.push({
            type: 'taboos',
            title: item.category,
            content: subItem,
            icon: item.icon
          });
        }
      });
    });

    this.setData({ searchResults: results });
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchKeyword: '',
      searchResults: []
    });
  },

  /**
   * 查看人群详情
   */
  viewGroupDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/guide-detail/guide-detail?type=group&id=${id}`
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '中国居民膳食指南 - 科学饮食参考',
      path: '/pages/guide/guide'
    };
  }
});
