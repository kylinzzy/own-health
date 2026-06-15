/**
 * 体重录入页面
 * 支持录入体重、体脂率、备注
 */

const storage = require('../../utils/storage');
const dateUtil = require('../../utils/date');

Page({
  data: {
    date: '',
    weight: '',
    bodyFat: '',
    note: '',
    today: ''
  },

  onLoad() {
    const today = dateUtil.getToday();
    this.setData({
      date: today,
      today
    });

    // 检查今天是否已有记录
    this.checkTodayRecord(today);
  },

  /**
   * 检查今天是否已有记录
   */
  checkTodayRecord(date) {
    const records = storage.get('weight_records', []);
    const todayRecord = records.find(r => r.date === date);
    
    if (todayRecord) {
      this.setData({
        weight: String(todayRecord.weight),
        bodyFat: todayRecord.bodyFat ? String(todayRecord.bodyFat) : '',
        note: todayRecord.note || ''
      });
    }
  },

  /**
   * 日期选择
   */
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({ date });
    this.checkTodayRecord(date);
  },

  /**
   * 体重输入
   */
  onWeightInput(e) {
    this.setData({ weight: e.detail.value });
  },

  /**
   * 体脂率输入
   */
  onBodyFatInput(e) {
    this.setData({ bodyFat: e.detail.value });
  },

  /**
   * 备注输入
   */
  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  /**
   * 保存记录
   */
  saveRecord() {
    const { date, weight, bodyFat, note } = this.data;

    // 验证
    if (!weight || parseFloat(weight) <= 0) {
      wx.showToast({ title: '请输入有效体重', icon: 'none' });
      return;
    }

    const weightValue = parseFloat(weight);
    const bodyFatValue = bodyFat ? parseFloat(bodyFat) : null;

    // 获取现有记录
    let records = storage.get('weight_records', []);
    
    // 检查是否已有该日期的记录
    const existingIndex = records.findIndex(r => r.date === date);
    
    const record = {
      id: date,
      date,
      weight: weightValue,
      bodyFat: bodyFatValue,
      note: note.trim(),
      timestamp: new Date(date).getTime()
    };

    if (existingIndex >= 0) {
      // 更新现有记录
      records[existingIndex] = record;
    } else {
      // 添加新记录
      records.push(record);
    }

    // 保存
    storage.set('weight_records', records);

    wx.showToast({
      title: existingIndex >= 0 ? '更新成功' : '记录成功',
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
