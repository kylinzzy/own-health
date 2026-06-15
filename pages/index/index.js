/**
 * 首页 - 数据概览
 * 展示今日关键数据和健康状态
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const analysisUtil = require('../../utils/analysis');

Page({
  data: {
    today: '',
    settings: null,
    todayDiet: [],
    todayExercise: [],
    latestWeight: null,
    dailyStats: {
      intake: 0,
      burn: 0,
      deficit: 0
    },
    quickActions: [
      { icon: '⚖️', label: '记体重', path: '/pages/weight-record/weight-record' },
      { icon: '🍽️', label: '记饮食', path: '/pages/diet/diet' },
      { icon: '🏃', label: '记运动', path: '/pages/exercise/exercise' },
      { icon: '📊', label: '看分析', path: '/pages/analysis/analysis' }
    ],
    featureCards: [
      { icon: '📖', title: '膳食指南', desc: '科学饮食参考', path: '/pages/guide/guide', color: '#3498DB' },
      { icon: '🥗', title: '减脂食谱', desc: '低卡美味食谱', path: '/pages/recipes/recipes', color: '#2ECC71' }
    ]
  },

  onLoad() {
    const today = dateUtil.getToday();
    this.setData({ today });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    const today = this.data.today;
    const settings = storage.get('user_settings', {});
    
    // 今日饮食
    const allDiet = storage.get('diet_records', []);
    const todayDiet = allDiet.filter(r => r.date === today);
    
    // 今日运动
    const allExercise = storage.get('exercise_records', []);
    const todayExercise = allExercise.filter(r => r.date === today);
    
    // 最新体重
    const weightRecords = storage.get('weight_records', []);
    const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1] : null;

    // 计算今日统计
    const intake = todayDiet.reduce((sum, r) => sum + (r.calories || 0), 0);
    const burn = todayExercise.reduce((sum, r) => sum + (r.calories || 0), 0);
    const bmr = settings.baseMetabolism || 1500;
    const deficit = intake - bmr - burn;

    this.setData({
      settings,
      todayDiet,
      todayExercise,
      latestWeight,
      dailyStats: { intake, burn, deficit }
    });
  },

  /**
   * 快捷操作
   */
  onQuickAction(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({ url: path });
  },

  /**
   * 功能卡片
   */
  onFeatureCard(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({ url: path });
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
    return {
      title: '健康瘦身 - 个人健康管理',
      path: '/pages/index/index'
    };
  }
});
