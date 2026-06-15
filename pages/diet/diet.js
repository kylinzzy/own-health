/**
 * 饮食记录页面
 * 按餐次分类展示每日饮食，支持食谱选择和手动输入
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const { MEAL_TYPES } = require('../../utils/constants');

Page({
  data: {
    currentDate: '',
    dietRecords: [],
    mealTypes: MEAL_TYPES,
    mealOrder: ['breakfast', 'lunch', 'dinner', 'snack'],
    dailyStats: {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    }
  },

  onLoad() {
    const today = dateUtil.getToday();
    const currentWeekDay = dateUtil.getWeekDay(today);
    this.setData({ currentDate: today, today, currentWeekDay });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    const { currentDate } = this.data;
    const allRecords = storage.get('diet_records', []);
    
    // 筛选当前日期的记录
    const dietRecords = allRecords.filter(r => r.date === currentDate);
    
    this.setData({ dietRecords });
    this.calculateDailyStats();
  },

  /**
   * 计算每日统计
   */
  calculateDailyStats() {
    const { dietRecords } = this.data;
    
    const stats = dietRecords.reduce((acc, record) => {
      acc.totalCalories += record.calories || 0;
      acc.totalProtein += record.protein || 0;
      acc.totalCarbs += record.carbs || 0;
      acc.totalFat += record.fat || 0;
      return acc;
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    });

    const proteinPercent = Math.min(100, Math.round((stats.totalProtein / 60) * 100));
    const carbsPercent = Math.min(100, Math.round((stats.totalCarbs / 250) * 100));
    const fatPercent = Math.min(100, Math.round((stats.totalFat / 60) * 100));
    
    this.setData({ dailyStats: stats, proteinPercent, carbsPercent, fatPercent });
  },

  /**
   * 日期选择
   */
  onDateChange(e) {
    const date = e.detail.value;
    const currentWeekDay = dateUtil.getWeekDay(date);
    this.setData({ currentDate: date, currentWeekDay });
    this.loadData();
  },

  /**
   * 切换到前一天
   */
  prevDay() {
    const { currentDate } = this.data;
    const prevDate = dateUtil.addDays(new Date(currentDate), -1);
    const currentWeekDay = dateUtil.getWeekDay(prevDate);
    this.setData({ currentDate: prevDate, currentWeekDay });
    this.loadData();
  },

  /**
   * 切换到后一天
   */
  nextDay() {
    const { currentDate } = this.data;
    const today = dateUtil.getToday();
    
    // 不能选择未来日期
    if (currentDate >= today) {
      wx.showToast({ title: '不能选择未来日期', icon: 'none' });
      return;
    }
    
    const nextDate = dateUtil.addDays(new Date(currentDate), 1);
    const currentWeekDay = dateUtil.getWeekDay(nextDate);
    this.setData({ currentDate: nextDate, currentWeekDay });
    this.loadData();
  },

  /**
   * 获取某餐次的记录
   */
  getMealRecords(mealType) {
    const { dietRecords } = this.data;
    return dietRecords.filter(r => r.mealType === mealType);
  },

  /**
   * 获取某餐次的总热量
   */
  getMealCalories(mealType) {
    const records = this.getMealRecords(mealType);
    return records.reduce((sum, r) => sum + (r.calories || 0), 0);
  },

  /**
   * 添加饮食记录
   */
  addDietRecord(e) {
    const { mealType } = e.currentTarget.dataset;
    const { currentDate } = this.data;
    
    wx.showActionSheet({
      itemList: ['从食谱库选择', '手动输入'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 从食谱库选择
          wx.navigateTo({
            url: `/pages/recipes/recipes?mealType=${mealType}&date=${currentDate}&selectMode=true`
          });
        } else {
          // 手动输入
          wx.navigateTo({
            url: `/pages/diet-record/diet-record?mealType=${mealType}&date=${currentDate}`
          });
        }
      }
    });
  },

  /**
   * 删除记录
   */
  deleteRecord(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条饮食记录吗？',
      success: (res) => {
        if (res.confirm) {
          let records = storage.get('diet_records', []);
          records = records.filter(r => r.id !== id);
          storage.set('diet_records', records);
          
          this.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { currentDate, dailyStats } = this.data;
    return {
      title: `${currentDate} 饮食记录 - 共${dailyStats.totalCalories}千卡`,
      path: '/pages/diet/diet'
    };
  }
});
