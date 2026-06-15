/**
 * 常量定义文件
 * 集中管理应用中的常量配置
 */

// 餐次类型
const MEAL_TYPES = {
  breakfast: { label: '早餐', icon: '🌅', time: '07:00-09:00' },
  lunch: { label: '午餐', icon: '☀️', time: '11:30-13:30' },
  dinner: { label: '晚餐', icon: '🌙', time: '17:30-19:30' },
  snack: { label: '加餐', icon: '🍎', time: '随时' }
};

// 运动类型
const EXERCISE_TYPES = {
  running: { label: '跑步', icon: '🏃', intensity: 'high' },
  walking: { label: '快走', icon: '🚶', intensity: 'low' },
  cycling: { label: '骑行', icon: '🚴', intensity: 'medium' },
  swimming: { label: '游泳', icon: '🏊', intensity: 'high' },
  yoga: { label: '瑜伽', icon: '🧘', intensity: 'low' },
  fitness: { label: '健身', icon: '🏋️', intensity: 'high' },
  hiit: { label: 'HIIT', icon: '🔥', intensity: 'veryHigh' },
  dancing: { label: '舞蹈', icon: '💃', intensity: 'medium' },
  hiking: { label: '徒步', icon: '🥾', intensity: 'medium' },
  ball: { label: '球类运动', icon: '⚽', intensity: 'high' },
  other: { label: '其他', icon: '⭐', intensity: 'medium' }
};

// 运动强度对应的热量消耗系数（千卡/分钟/70kg体重）
const EXERCISE_CALORIES = {
  low: 4,
  medium: 7,
  high: 10,
  veryHigh: 12
};

// 食谱标签
const RECIPE_TAGS = {
  highProtein: { label: '高蛋白', color: '#E74C3C' },
  lowGI: { label: '低GI', color: '#3498DB' },
  lowFat: { label: '低脂', color: '#2ECC71' },
  quick: { label: '快手', color: '#F39C12' },
  vegetarian: { label: '素食', color: '#9B59B6' },
  highFiber: { label: '高纤维', color: '#1ABC9C' },
  lowCalorie: { label: '低卡', color: '#E67E22' }
};

// 热量区间筛选
const CALORIE_RANGES = [
  { min: 0, max: 200, label: '200卡以下' },
  { min: 200, max: 300, label: '200-300卡' },
  { min: 300, max: 400, label: '300-400卡' },
  { min: 400, max: 500, label: '400-500卡' },
  { min: 500, max: 9999, label: '500卡以上' }
];

// 食材类型
const INGREDIENT_TYPES = [
  { value: 'meat', label: '肉类' },
  { value: 'seafood', label: '海鲜' },
  { value: 'vegetable', label: '蔬菜' },
  { value: 'fruit', label: '水果' },
  { value: 'grain', label: '谷物' },
  { value: 'dairy', label: '乳制品' },
  { value: 'egg', label: '蛋豆制品' },
  { value: 'other', label: '其他' }
];

// 本地存储键名
const STORAGE_KEYS = {
  SETTINGS: 'user_settings',
  WEIGHT_RECORDS: 'weight_records',
  DIET_RECORDS: 'diet_records',
  EXERCISE_RECORDS: 'exercise_records',
  FAVORITE_RECIPES: 'favorite_recipes',
  FIRST_LAUNCH: 'first_launch'
};

// 健康建议模板
const HEALTH_ADVICE_TEMPLATES = {
  calorieTooLow: '您的热量摄入偏低，建议适当增加优质碳水和蛋白质摄入，避免代谢下降',
  calorieTooHigh: '您的热量摄入偏高，建议控制油脂和精制糖的摄入，增加蔬菜比例',
  proteinLow: '蛋白质摄入不足，建议每餐加入鸡蛋、鸡胸肉、鱼类或豆制品',
  carbsHigh: '碳水化合物比例偏高，建议减少精制米面，增加粗粮和蔬菜',
  fatHigh: '脂肪摄入偏高，建议减少油炸食品和肥肉，选择优质脂肪如坚果、橄榄油',
  exerciseLow: '运动量不足，建议每天进行30分钟以上中等强度运动',
  weightDropFast: '体重下降过快，建议适当增加热量摄入，保护肌肉量',
  weightRise: '体重呈上升趋势，建议检查饮食记录是否完整，控制零食摄入',
  goodJob: '各项指标都很棒！继续保持健康的生活方式'
};

module.exports = {
  MEAL_TYPES,
  EXERCISE_TYPES,
  EXERCISE_CALORIES,
  RECIPE_TAGS,
  CALORIE_RANGES,
  INGREDIENT_TYPES,
  STORAGE_KEYS,
  HEALTH_ADVICE_TEMPLATES
};
