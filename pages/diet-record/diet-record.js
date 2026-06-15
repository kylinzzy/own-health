/**
 * 饮食录入页面
 * 支持手动输入菜品和营养信息
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const { MEAL_TYPES } = require('../../utils/constants');

Page({
  data: {
    date: '',
    mealType: 'breakfast',
    mealTypes: MEAL_TYPES,
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  },

  onLoad(options) {
    const { mealType, date } = options;
    
    this.setData({
      mealType: mealType || 'breakfast',
      date: date || dateUtil.getToday()
    });
  },

  /**
   * 菜品名称输入
   */
  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  /**
   * 热量输入
   */
  onCaloriesInput(e) {
    this.setData({ calories: e.detail.value });
  },

  /**
   * 蛋白质输入
   */
  onProteinInput(e) {
    this.setData({ protein: e.detail.value });
  },

  /**
   * 碳水输入
   */
  onCarbsInput(e) {
    this.setData({ carbs: e.detail.value });
  },

  /**
   * 脂肪输入
   */
  onFatInput(e) {
    this.setData({ fat: e.detail.value });
  },

  /**
   * 保存记录
   */
  saveRecord() {
    const { date, mealType, name, calories, protein, carbs, fat } = this.data;

    // 验证
    if (!name.trim()) {
      wx.showToast({ title: '请输入菜品名称', icon: 'none' });
      return;
    }

    if (!calories || parseFloat(calories) <= 0) {
      wx.showToast({ title: '请输入有效热量', icon: 'none' });
      return;
    }

    const records = storage.get('diet_records', []);
    
    const newRecord = {
      id: `${date}-${mealType}-${Date.now()}`,
      date,
      mealType,
      name: name.trim(),
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      source: 'manual',
      timestamp: Date.now()
    };

    records.push(newRecord);
    storage.set('diet_records', records);

    wx.showToast({
      title: '记录成功',
      icon: 'success'
    });

    // 返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  /**
   * 取消
   */
  cancel() {
    wx.navigateBack();
  }
});
