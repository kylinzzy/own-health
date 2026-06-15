/**
 * 运动录入页面
 * 支持选择运动类型、输入时长，自动计算消耗热量
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');
const { EXERCISE_TYPES, EXERCISE_CALORIES } = require('../../utils/constants');

Page({
  data: {
    date: '',
    selectedType: '',
    exerciseTypes: EXERCISE_TYPES,
    typeKeys: [],
    customName: '',
    duration: '',
    intensity: 'medium',
    calculatedCalories: 0
  },

  onLoad(options) {
    const { date } = options;
    
    // 获取运动类型键
    const typeKeys = Object.keys(EXERCISE_TYPES);
    
    this.setData({
      date: date || dateUtil.getToday(),
      typeKeys
    });
  },

  /**
   * 选择运动类型
   */
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    const exerciseType = EXERCISE_TYPES[type];
    
    this.setData({
      selectedType: type,
      customName: exerciseType ? exerciseType.label : '',
      intensity: exerciseType ? exerciseType.intensity : 'medium'
    });
    
    this.calculateCalories();
  },

  /**
   * 自定义名称输入
   */
  onNameInput(e) {
    this.setData({ customName: e.detail.value });
  },

  /**
   * 时长输入
   */
  onDurationInput(e) {
    this.setData({ duration: e.detail.value });
    this.calculateCalories();
  },

  /**
   * 强度选择
   */
  selectIntensity(e) {
    const intensity = e.currentTarget.dataset.intensity;
    this.setData({ intensity });
    this.calculateCalories();
  },

  /**
   * 计算消耗热量
   */
  calculateCalories() {
    const { duration, intensity } = this.data;
    
    if (!duration || parseFloat(duration) <= 0) {
      this.setData({ calculatedCalories: 0 });
      return;
    }

    const durationNum = parseFloat(duration);
    const calorieRate = EXERCISE_CALORIES[intensity] || 7;
    const calories = Math.round(durationNum * calorieRate);
    
    this.setData({ calculatedCalories: calories });
  },

  /**
   * 保存记录
   */
  saveRecord() {
    const { date, selectedType, customName, duration, intensity, calculatedCalories } = this.data;

    // 验证
    if (!customName.trim()) {
      wx.showToast({ title: '请输入运动名称', icon: 'none' });
      return;
    }

    if (!duration || parseFloat(duration) <= 0) {
      wx.showToast({ title: '请输入有效时长', icon: 'none' });
      return;
    }

    const records = storage.get('exercise_records', []);
    
    const newRecord = {
      id: `${date}-ex-${Date.now()}`,
      date,
      type: selectedType || 'other',
      name: customName.trim(),
      duration: parseFloat(duration),
      calories: calculatedCalories,
      intensity,
      timestamp: Date.now()
    };

    records.push(newRecord);
    storage.set('exercise_records', records);

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
