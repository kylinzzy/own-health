/**
 * 减脂食谱库页面
 * 支持分类筛选、搜索、收藏功能
 */

const { RECIPES } = require('../../data/recipe-data');
const { MEAL_TYPES, CALORIE_RANGES, RECIPE_TAGS } = require('../../utils/constants');
const storage = require('../../utils/storage');

Page({
  data: {
    recipes: [],
    filteredRecipes: [],
    favorites: [],
    mealTypes: [
      { key: 'all', label: '全部' },
      { key: 'breakfast', label: '早餐' },
      { key: 'lunch', label: '午餐' },
      { key: 'dinner', label: '晚餐' },
      { key: 'snack', label: '加餐' }
    ],
    activeMealType: 'all',
    calorieRanges: [
      { key: 'all', label: '全部热量' },
      ...CALORIE_RANGES.map((r, i) => ({ key: `range-${i}`, label: r.label, ...r }))
    ],
    activeCalorieRange: 'all',
    tags: [
      { key: 'all', label: '全部' },
      ...Object.entries(RECIPE_TAGS).map(([key, value]) => ({ key, label: value.label }))
    ],
    activeTag: 'all',
    searchKeyword: '',
    showFilters: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadFavorites();
    this.applyFilters();
  },

  /**
   * 加载数据
   */
  loadData() {
    const favorites = storage.get('favorite_recipes', []);
    this.setData({
      recipes: RECIPES,
      favorites,
      filteredRecipes: RECIPES
    });
  },

  /**
   * 加载收藏
   */
  loadFavorites() {
    const favorites = storage.get('favorite_recipes', []);
    this.setData({ favorites });
  },

  /**
   * 切换餐次筛选
   */
  selectMealType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ activeMealType: type });
    this.applyFilters();
  },

  /**
   * 切换热量筛选
   */
  selectCalorieRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ activeCalorieRange: range });
    this.applyFilters();
  },

  /**
   * 切换标签筛选
   */
  selectTag(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ activeTag: tag });
    this.applyFilters();
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ searchKeyword: keyword });
    this.applyFilters();
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.applyFilters();
  },

  /**
   * 应用筛选条件
   */
  applyFilters() {
    const { recipes, activeMealType, activeCalorieRange, activeTag, searchKeyword } = this.data;
    
    let filtered = [...recipes];

    // 餐次筛选
    if (activeMealType !== 'all') {
      filtered = filtered.filter(r => r.mealType === activeMealType);
    }

    // 热量筛选
    if (activeCalorieRange !== 'all') {
      const rangeIndex = parseInt(activeCalorieRange.replace('range-', ''));
      const range = CALORIE_RANGES[rangeIndex];
      if (range) {
        filtered = filtered.filter(r => r.calories >= range.min && r.calories <= range.max);
      }
    }

    // 标签筛选
    if (activeTag !== 'all') {
      filtered = filtered.filter(r => r.tags.includes(activeTag));
    }

    // 搜索筛选
    if (searchKeyword) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchKeyword) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(searchKeyword))
      );
    }

    this.setData({ filteredRecipes: filtered });
  },

  /**
   * 切换筛选面板显示
   */
  toggleFilters() {
    this.setData({ showFilters: !this.data.showFilters });
  },

  /**
   * 查看食谱详情
   */
  viewRecipeDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    });
  },

  /**
   * 切换收藏
   */
  toggleFavorite(e) {
    const { id } = e.currentTarget.dataset;
    let favorites = [...this.data.favorites];
    
    if (favorites.includes(id)) {
      favorites = favorites.filter(fid => fid !== id);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      favorites.push(id);
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }
    
    storage.set('favorite_recipes', favorites);
    this.setData({ favorites });
  },

  /**
   * 获取标签中文名
   */
  getTagLabel(tagKey) {
    const tag = RECIPE_TAGS[tagKey];
    return tag ? tag.label : tagKey;
  },

  /**
   * 获取餐次中文名
   */
  getMealTypeLabel(type) {
    const meal = MEAL_TYPES[type];
    return meal ? meal.label : type;
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '减脂食谱库 - 健康瘦身',
      path: '/pages/recipes/recipes'
    };
  }
});
