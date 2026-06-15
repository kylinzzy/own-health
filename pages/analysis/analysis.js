/**
 * 智能健康分析页面
 * 基于饮食、运动、体重数据生成健康评估报告
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const analysisUtil = require('../../utils/analysis');

Page({
  data: {
    reportType: 'daily', // daily, weekly
    healthReport: null,
    weeklyReport: null,
    settings: null,
    bmi: null,
    bmiCategory: null
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    const settings = storage.get('user_settings', {});
    const weightRecords = storage.get('weight_records', []);
    const dietRecords = storage.get('diet_records', []);
    const exerciseRecords = storage.get('exercise_records', []);

    this.setData({ settings });

    // 计算BMI
    if (settings.currentHeight && weightRecords.length > 0) {
      const currentWeight = weightRecords[weightRecords.length - 1].weight;
      const bmi = analysisUtil.calculateBMI(currentWeight, settings.currentHeight);
      const bmiCategory = analysisUtil.getBMICategory(bmi);
      this.setData({ bmi, bmiCategory });
    }

    // 生成健康报告
    this.generateDailyReport(weightRecords, dietRecords, exerciseRecords, settings);
    this.generateWeeklyReport(weightRecords, dietRecords, exerciseRecords, settings);
  },

  /**
   * 生成日报
   */
  generateDailyReport(weightRecords, dietRecords, exerciseRecords, settings) {
    const today = dateUtil.getToday();
    
    // 筛选今日数据
    const todayDiet = dietRecords.filter(r => r.date === today);
    const todayExercise = exerciseRecords.filter(r => r.date === today);
    
    // 获取最近体重
    const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1] : null;
    
    const report = analysisUtil.generateHealthReport({
      weightRecords: latestWeight ? [latestWeight] : [],
      dietRecords: todayDiet,
      exerciseRecords: todayExercise,
      settings
    });

    this.setData({ healthReport: report });
  },

  /**
   * 生成周报
   */
  generateWeeklyReport(weightRecords, dietRecords, exerciseRecords, settings) {
    const weekRange = dateUtil.getWeekRange(new Date());
    
    const weekWeightRecords = weightRecords.filter(r => r.date >= weekRange.start && r.date <= weekRange.end);
    const weekDietRecords = dietRecords.filter(r => r.date >= weekRange.start && r.date <= weekRange.end);
    const weekExerciseRecords = exerciseRecords.filter(r => r.date >= weekRange.start && r.date <= weekRange.end);

    const report = analysisUtil.generateWeeklyReport({
      weightRecords: weekWeightRecords,
      dietRecords: weekDietRecords,
      exerciseRecords: weekExerciseRecords,
      settings
    });

    this.setData({ weeklyReport: report });
  },

  /**
   * 切换报告类型
   */
  switchReportType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ reportType: type });
  },

  /**
   * 获取评分颜色
   */
  getScoreColor(score) {
    if (score >= 80) return '#2ECC71';
    if (score >= 60) return '#F39C12';
    return '#E74C3C';
  },

  /**
   * 获取评分等级
   */
  getScoreLevel(score) {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 60) return '一般';
    return '需改善';
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
    const { healthReport } = this.data;
    return {
      title: healthReport ? `健康评分 ${healthReport.overallScore}分 - 健康瘦身` : '智能健康分析',
      path: '/pages/analysis/analysis'
    };
  }
});
