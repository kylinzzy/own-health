/**
 * 体重管理页面
 * 体重趋势图表、周总结、记录列表
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const chartUtil = require('../../utils/chart');
const analysisUtil = require('../../utils/analysis');

Page({
  data: {
    weightRecords: [],
    chartData: [],
    timeRange: 'week', // week, month
    weeklyReport: null,
    stats: {
      current: null,
      highest: null,
      lowest: null,
      change: null
    },
    settings: null
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
    const records = storage.get('weight_records', []);
    const settings = storage.get('user_settings', {});
    
    // 按日期排序
    const sortedRecords = [...records].sort((a, b) => a.timestamp - b.timestamp);
    
    this.setData({
      weightRecords: sortedRecords,
      settings
    });

    this.prepareChartData();
    this.calculateStats();
    this.generateWeeklyReport();
  },

  /**
   * 准备图表数据
   */
  prepareChartData() {
    const { weightRecords, timeRange } = this.data;
    
    let filteredRecords = [];
    const today = new Date();
    
    if (timeRange === 'week') {
      // 最近7天
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      filteredRecords = weightRecords.filter(r => new Date(r.date) >= weekAgo);
    } else if (timeRange === 'month') {
      // 最近30天
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 29);
      filteredRecords = weightRecords.filter(r => new Date(r.date) >= monthAgo);
    }

    // 如果数据不足，补充空数据
    const chartData = filteredRecords.map(r => ({
      date: r.date,
      value: r.weight
    }));

    this.setData({ chartData });

    // 绘制图表
    if (chartData.length > 0) {
      this.drawChart();
    }
  },

  /**
   * 绘制图表
   */
  drawChart() {
    const { chartData } = this.data;
    const systemInfo = wx.getSystemInfoSync();
    const width = systemInfo.windowWidth - 32;
    
    setTimeout(() => {
      chartUtil.drawWeightChart({
        canvasId: 'weightChart',
        data: chartData,
        width: width,
        height: 220
      });
    }, 100);
  },

  /**
   * 切换时间范围
   */
  switchTimeRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ timeRange: range });
    this.prepareChartData();
  },

  /**
   * 计算统计数据
   */
  calculateStats() {
    const { weightRecords } = this.data;
    
    if (weightRecords.length === 0) {
      this.setData({
        stats: { current: null, highest: null, lowest: null, change: null }
      });
      return;
    }

    const weights = weightRecords.map(r => r.weight);
    const current = weightRecords[weightRecords.length - 1].weight;
    const highest = Math.max(...weights);
    const lowest = Math.min(...weights);
    const first = weights[0];
    const change = parseFloat((current - first).toFixed(1));
    const targetDiff = settings.targetWeight ? parseFloat((current - settings.targetWeight).toFixed(1)) : null;

    this.setData({
      stats: { current, highest, lowest, change, targetDiff }
    });
  },

  /**
   * 生成周总结
   */
  generateWeeklyReport() {
    const { weightRecords, settings } = this.data;
    
    // 获取本周记录
    const weekRange = dateUtil.getWeekRange(new Date());
    const weekRecords = weightRecords.filter(r => r.date >= weekRange.start && r.date <= weekRange.end);
    
    const weekDietRecords = storage.get('diet_records', []).filter(r => r.date >= weekRange.start && r.date <= weekRange.end);
    const weekExerciseRecords = storage.get('exercise_records', []).filter(r => r.date >= weekRange.start && r.date <= weekRange.end);

    const report = analysisUtil.generateWeeklyReport({
      weightRecords: weekRecords,
      dietRecords: weekDietRecords,
      exerciseRecords: weekExerciseRecords,
      settings
    });

    this.setData({ weeklyReport: report });
  },

  /**
   * 跳转到体重录入
   */
  goToRecord() {
    wx.navigateTo({
      url: '/pages/weight-record/weight-record'
    });
  },

  /**
   * 删除记录
   */
  deleteRecord(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条体重记录吗？',
      success: (res) => {
        if (res.confirm) {
          let records = storage.get('weight_records', []);
          records = records.filter(r => r.id !== id);
          storage.set('weight_records', records);
          
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
    const { stats } = this.data;
    return {
      title: stats.current ? `当前体重 ${stats.current}kg - 健康瘦身` : '体重管理 - 健康瘦身',
      path: '/pages/weight/weight'
    };
  }
});
