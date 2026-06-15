/**
 * 健康瘦身小程序 - 应用入口
 * 纯本地数据存储，无需后端服务
 */

const storage = require('./utils/storage');
const { calculateBMR } = require('./utils/analysis');

App({
  globalData: {
    userInfo: null,
    settings: null,
    isFirstLaunch: false
  },

  onLaunch() {
    console.log('健康瘦身小程序启动');
    this.initApp();
  },

  onShow() {
    // 每次显示时刷新全局数据
    this.refreshGlobalData();
  },

  /**
   * 初始化应用
   * 检查首次启动，初始化默认数据
   */
  initApp() {
    const isFirstLaunch = storage.get('first_launch', true);
    
    if (isFirstLaunch) {
      this.globalData.isFirstLaunch = true;
      this.initDefaultData();
      storage.set('first_launch', false);
    }

    this.refreshGlobalData();
  },

  /**
   * 初始化默认数据
   * 设置默认用户信息和示例数据
   */
  initDefaultData() {
    // 默认用户设置
    const defaultSettings = {
      targetWeight: 60,
      currentHeight: 170,
      age: 25,
      gender: 'male',
      baseMetabolism: 1500,
      dailyCalorieTarget: 1800,
      createdAt: Date.now()
    };
    storage.set('user_settings', defaultSettings);

    // 初始化示例体重记录（最近7天）
    const sampleWeightRecords = this.generateSampleWeightData();
    storage.set('weight_records', sampleWeightRecords);

    // 初始化示例饮食记录
    const sampleDietRecords = this.generateSampleDietData();
    storage.set('diet_records', sampleDietRecords);

    // 初始化示例运动记录
    const sampleExerciseRecords = this.generateSampleExerciseData();
    storage.set('exercise_records', sampleExerciseRecords);

    // 初始化收藏
    storage.set('favorite_recipes', ['recipe-001', 'recipe-003']);
  },

  /**
   * 生成示例体重数据
   */
  generateSampleWeightData() {
    const records = [];
    const baseWeight = 68.5;
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      
      // 模拟体重波动下降趋势
      const weightChange = (6 - i) * 0.15 + (Math.random() - 0.5) * 0.3;
      
      records.push({
        id: dateStr,
        date: dateStr,
        weight: parseFloat((baseWeight - weightChange).toFixed(1)),
        bodyFat: parseFloat((22 - weightChange * 0.3).toFixed(1)),
        note: i === 0 ? '今天感觉不错' : '',
        timestamp: date.getTime()
      });
    }
    
    return records;
  },

  /**
   * 生成示例饮食数据
   */
  generateSampleDietData() {
    const today = new Date();
    const dateStr = this.formatDate(today);
    
    return [
      {
        id: `${dateStr}-breakfast-001`,
        date: dateStr,
        mealType: 'breakfast',
        name: '燕麦牛奶+水煮蛋',
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 12,
        source: 'manual',
        timestamp: today.getTime()
      },
      {
        id: `${dateStr}-lunch-001`,
        date: dateStr,
        mealType: 'lunch',
        name: '鸡胸肉沙拉',
        calories: 450,
        protein: 35,
        carbs: 25,
        fat: 15,
        source: 'recipe',
        recipeId: 'recipe-001',
        timestamp: today.getTime() + 3600000
      },
      {
        id: `${dateStr}-dinner-001`,
        date: dateStr,
        mealType: 'dinner',
        name: '清蒸鱼+蔬菜',
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 10,
        source: 'manual',
        timestamp: today.getTime() + 7200000
      }
    ];
  },

  /**
   * 生成示例运动数据
   */
  generateSampleExerciseData() {
    const today = new Date();
    const dateStr = this.formatDate(today);
    
    return [
      {
        id: `${dateStr}-ex-001`,
        date: dateStr,
        type: 'running',
        name: '晨跑',
        duration: 30,
        calories: 280,
        intensity: 'medium',
        timestamp: today.getTime() + 1800000
      }
    ];
  },

  /**
   * 刷新全局数据
   */
  refreshGlobalData() {
    this.globalData.settings = storage.get('user_settings', {});
  },

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
