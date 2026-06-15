/**
 * 食谱详情页面
 * 展示单条食谱的完整信息，支持收藏和添加到饮食记录
 */

const { RECIPES } = require('../../data/recipe-data');
const { MEAL_TYPES, RECIPE_TAGS } = require('../../utils/constants');
const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');

Page({
  data: {
    recipe: null,
    isFavorite: false,
    favorites: []
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadRecipe(id);
    }
  },

  onShow() {
    this.loadFavorites();
  },

  /**
   * 加载食谱详情
   */
  loadRecipe(id) {
    const recipe = RECIPES.find(r => r.id === id);
    if (recipe) {
      const mealTypeLabel = MEAL_TYPES[recipe.mealType] ? MEAL_TYPES[recipe.mealType].label : recipe.mealType;
      const tagLabels = {};
      recipe.tags.forEach(tag => {
        tagLabels[tag] = RECIPE_TAGS[tag] ? RECIPE_TAGS[tag].label : tag;
      });
      this.setData({ recipe, mealTypeLabel, tagLabels });
      wx.setNavigationBarTitle({ title: recipe.name });
    }
  },

  /**
   * 加载收藏状态
   */
  loadFavorites() {
    const favorites = storage.get('favorite_recipes', []);
    const isFavorite = favorites.includes(this.data.recipe?.id);
    this.setData({ favorites, isFavorite });
  },

  /**
   * 切换收藏
   */
  toggleFavorite() {
    const { recipe, favorites } = this.data;
    if (!recipe) return;

    let newFavorites = [...favorites];
    
    if (newFavorites.includes(recipe.id)) {
      newFavorites = newFavorites.filter(id => id !== recipe.id);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      newFavorites.push(recipe.id);
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }
    
    storage.set('favorite_recipes', newFavorites);
    this.setData({
      favorites: newFavorites,
      isFavorite: newFavorites.includes(recipe.id)
    });
  },

  /**
   * 添加到饮食记录
   */
  addToDietRecord() {
    const { recipe } = this.data;
    if (!recipe) return;

    wx.showActionSheet({
      itemList: ['添加到早餐', '添加到午餐', '添加到晚餐', '添加到加餐'],
      success: (res) => {
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        const selectedMeal = mealTypes[res.tapIndex];

        this.saveDietRecord(recipe, selectedMeal);
      },
      fail: () => {
        // 用户取消，默认添加到当前餐次
        this.saveDietRecord(recipe, recipe.mealType || 'lunch');
      }
    });
  },

  /**
   * 保存饮食记录
   */
  saveDietRecord(recipe, mealType) {
    const today = dateUtil.getToday();
    const records = storage.get('diet_records', []);

    const newRecord = {
      id: `${today}-${mealType}-${Date.now()}`,
      date: today,
      mealType: mealType,
      name: recipe.name,
      calories: recipe.calories || 0,
      protein: recipe.protein || 0,
      carbs: recipe.carbs || 0,
      fat: recipe.fat || 0,
      source: 'recipe',
      recipeId: recipe.id,
      timestamp: Date.now()
    };

    records.push(newRecord);
    storage.set('diet_records', records);

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    // 添加成功后返回饮食记录页面
    setTimeout(() => {
      wx.navigateBack({
        success: () => {
          // 尝试刷新上一页数据
          const pages = getCurrentPages();
          if (pages.length >= 2) {
            const prevPage = pages[pages.length - 2];
            if (prevPage && prevPage.loadData) {
              prevPage.loadData();
            }
          }
        }
      });
    }, 1000);
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
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { recipe } = this.data;
    return {
      title: recipe ? `${recipe.name} - ${recipe.calories}千卡` : '减脂食谱',
      path: `/pages/recipe-detail/recipe-detail?id=${recipe?.id}`
    };
  }
});
