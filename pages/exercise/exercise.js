/**
 * 运动记录页面
 * 记录每日运动项目、时长、消耗热量
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const { EXERCISE_TYPES, EXERCISE_CALORIES } = require('../../utils/constants');

Page({
  data: {
    currentDate: '',
    exerciseRecords: [],
    exerciseTypes: EXERCISE_TYPES,
    weeklyStats: {
      totalDuration: 0,
      totalBurn: 0,
      totalCount: 0
    },
    calorieDeficit: 0
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
    const allRecords = storage.get('exercise_records', []);
    const dietRecords = storage.get('diet_records', []);
    const settings = storage.get('user_settings', {});
    
    // 筛选当前日期的记录
    const exerciseRecords = allRecords.filter(r => r.date === currentDate);
    
    this.setData({ exerciseRecords });
    
    // 计算今日热量缺口
    this.calculateCalorieDeficit(dietRecords, exerciseRecords, settings);
    
    // 计算周统计
    this.calculateWeeklyStats(allRecords);
  },

  /**
   * 计算热量缺口
   */
  calculateCalorieDeficit(dietRecords, exerciseRecords, settings) {
    const todayDiet = dietRecords.filter(r => r.date === this.data.currentDate);
    const totalIntake = todayDiet.reduce((sum, r) => sum + (r.calories || 0), 0);
    const totalBurn = exerciseRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
    const bmr = settings.baseMetabolism || 1500;
    
    const deficit = totalIntake - bmr - totalBurn;
    this.setData({ calorieDeficit: deficit });
  },

  /**
   * 计算周统计
   */
  calculateWeeklyStats(allRecords) {
    const weekRange = dateUtil.getWeekRange(new Date());
    const weekRecords = allRecords.filter(r => r.date >= weekRange.start && r.date <= weekRange.end);
    
    const totalDuration = weekRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
    const totalBurn = weekRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
    
    this.setData({
      weeklyStats: {
        totalDuration,
        totalBurn,
        totalCount: weekRecords.length
      }
    });
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
   * 跳转到运动录入
   */
  goToRecord() {
    const { currentDate } = this.data;
    wx.navigateTo({
      url: `/pages/exercise-record/exercise-record?date=${currentDate}`
    });
  },

  /**
   * 删除记录
   */
  deleteRecord(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条运动记录吗？',
      success: (res) => {
        if (res.confirm) {
          let records = storage.get('exercise_records', []);
          records = records.filter(r => r.id !== id);
          storage.set('exercise_records', records);
          
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
    const { currentDate, exerciseRecords } = this.data;
    const totalBurn = exerciseRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
    return {
      title: `${currentDate} 运动消耗 ${totalBurn}千卡 - 健康瘦身`,
      path: '/pages/exercise/exercise'
    };
  }
});
