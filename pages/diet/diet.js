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
    const { currentDate, mealOrder, mealTypes } = this.data;
    const allRecords = storage.get('diet_records', []);

    // 筛选当前日期的记录
    const dietRecords = allRecords.filter(r => r.date === currentDate);

    // 预计算每个餐次的数据（WXML中不能调用方法）
    const mealData = {};
    mealOrder.forEach(mealType => {
      const records = dietRecords.filter(r => r.mealType === mealType);
      const calories = records.reduce((sum, r) => sum + (r.calories || 0), 0);
      mealData[mealType] = {
        records,
        calories,
        icon: mealTypes[mealType] ? mealTypes[mealType].icon : '',
        label: mealTypes[mealType] ? mealTypes[mealType].label : mealType,
        time: mealTypes[mealType] ? mealTypes[mealType].time : ''
      };
    });

    this.setData({ dietRecords, mealData });
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

  // getMealRecords和getMealCalories已合并到loadData中的mealData预计算

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
   * 触摸开始
   */
  touchStart(e) {
    const { id } = e.currentTarget.dataset;
    this.touchStartX = e.touches[0].clientX;
    this.touchRecordId = id;
  },

  /**
   * 触摸移动
   */
  touchMove(e) {
    if (!this.touchStartX) return;
    const moveX = e.touches[0].clientX;
    const diff = moveX - this.touchStartX;
    // 限制滑动范围 -80 到 0
    const translateX = Math.max(-80, Math.min(0, diff));

    const { mealData } = this.data;
    const newMealData = {};
    Object.keys(mealData).forEach(key => {
      newMealData[key] = {
        ...mealData[key],
        records: mealData[key].records.map(r => ({
          ...r,
          translateX: r.id === this.touchRecordId ? translateX : (r.translateX || 0)
        }))
      };
    });
    this.setData({ mealData: newMealData });
  },

  /**
   * 触摸结束
   */
  touchEnd(e) {
    const { mealData } = this.data;
    const newMealData = {};
    Object.keys(mealData).forEach(key => {
      newMealData[key] = {
        ...mealData[key],
        records: mealData[key].records.map(r => {
          const currentX = r.translateX || 0;
          // 滑动超过一半显示删除按钮，否则收起
          const translateX = currentX < -40 ? -80 : 0;
          return { ...r, translateX };
        })
      };
    });
    this.setData({ mealData: newMealData });
    this.touchStartX = null;
    this.touchRecordId = null;
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
