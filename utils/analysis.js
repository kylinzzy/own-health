/**
 * 健康分析算法工具
 * 提供基础代谢计算、健康评分、建议生成等核心算法
 */

/**
 * 计算基础代谢率 (BMR) - Mifflin-St Jeor公式
 * @param {number} weight - 体重(kg)
 * @param {number} height - 身高(cm)
 * @param {number} age - 年龄
 * @param {string} gender - 性别 male/female
 * @returns {number} 基础代谢率(千卡)
 */
function calculateBMR(weight, height, age, gender) {
  if (gender === 'female') {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
}

/**
 * 计算每日总能量消耗 (TDEE)
 * @param {number} bmr - 基础代谢率
 * @param {string} activityLevel - 活动水平
 * @returns {number} TDEE(千卡)
 */
function calculateTDEE(bmr, activityLevel = 'moderate') {
  const multipliers = {
    sedentary: 1.2,      // 久坐不动
    light: 1.375,        // 轻度活动
    moderate: 1.55,      // 中度活动
    active: 1.725,       // 高度活动
    veryActive: 1.9      // 极高活动
  };
  
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

/**
 * 计算BMI
 * @param {number} weight - 体重(kg)
 * @param {number} height - 身高(cm)
 * @returns {number} BMI值
 */
function calculateBMI(weight, height) {
  const heightInM = height / 100;
  return parseFloat((weight / (heightInM * heightInM)).toFixed(1));
}

/**
 * 获取BMI分类
 * @param {number} bmi 
 * @returns {Object} {category: string, color: string}
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return { category: '偏瘦', color: '#3498DB', advice: '建议适当增加营养摄入，配合力量训练增加肌肉量' };
  } else if (bmi < 24) {
    return { category: '正常', color: '#2ECC71', advice: '保持良好的饮食和运动习惯，维持当前状态' };
  } else if (bmi < 28) {
    return { category: '偏胖', color: '#F39C12', advice: '建议控制饮食热量，增加有氧运动频率' };
  } else {
    return { category: '肥胖', color: '#E74C3C', advice: '建议制定科学的减重计划，必要时咨询专业医生' };
  }
}

/**
 * 计算热量缺口
 * @param {number} intake - 摄入热量
 * @param {number} bmr - 基础代谢
 * @param {number} exerciseBurn - 运动消耗
 * @returns {number} 热量缺口（负数为缺口，正数为盈余）
 */
function calculateCalorieDeficit(intake, bmr, exerciseBurn) {
  return intake - bmr - exerciseBurn;
}

/**
 * 计算营养素占比评分
 * @param {number} protein - 蛋白质(g)
 * @param {number} carbs - 碳水化合物(g)
 * @param {number} fat - 脂肪(g)
 * @returns {Object} 评分结果
 */
function calculateNutritionScore(protein, carbs, fat) {
  const total = protein + carbs + fat;
  if (total === 0) return { score: 0, assessment: '暂无数据' };
  
  const proteinRatio = (protein / total) * 100;
  const carbsRatio = (carbs / total) * 100;
  const fatRatio = (fat / total) * 100;
  
  // 理想比例：蛋白质20-30%，碳水45-55%，脂肪20-30%
  const idealProtein = 25;
  const idealCarbs = 50;
  const idealFat = 25;
  
  const proteinDiff = Math.abs(proteinRatio - idealProtein);
  const carbsDiff = Math.abs(carbsRatio - idealCarbs);
  const fatDiff = Math.abs(fatRatio - idealFat);
  
  const score = Math.max(0, 100 - (proteinDiff + carbsDiff + fatDiff) * 2);
  
  let assessment = '营养均衡';
  if (score < 60) assessment = '营养比例需要调整';
  else if (score < 80) assessment = '营养比例基本合理';
  
  return {
    score: Math.round(score),
    assessment,
    ratios: {
      protein: Math.round(proteinRatio),
      carbs: Math.round(carbsRatio),
      fat: Math.round(fatRatio)
    },
    ideal: { protein: idealProtein, carbs: idealCarbs, fat: idealFat }
  };
}

/**
 * 计算体重变化健康度
 * @param {Array} weightRecords - 体重记录数组
 * @returns {Object} 评估结果
 */
function calculateWeightHealth(weightRecords) {
  if (!weightRecords || weightRecords.length < 2) {
    return { score: 0, assessment: '数据不足' };
  }
  
  const sorted = [...weightRecords].sort((a, b) => a.timestamp - b.timestamp);
  const firstWeight = sorted[0].weight;
  const lastWeight = sorted[sorted.length - 1].weight;
  const totalChange = lastWeight - firstWeight;
  
  // 计算周变化速率
  const daysDiff = (sorted[sorted.length - 1].timestamp - sorted[0].timestamp) / (1000 * 60 * 60 * 24);
  const weeksDiff = daysDiff / 7 || 1;
  const weeklyChange = totalChange / weeksDiff;
  
  let score = 80;
  let assessment = '体重变化正常';
  let advice = '继续保持当前的节奏';
  
  // 健康减重速率：每周0.5-1kg
  if (weeklyChange < -1.5) {
    score = 40;
    assessment = '减重过快';
    advice = '减重速度偏快，建议适当增加热量摄入，避免肌肉流失和代谢下降';
  } else if (weeklyChange < -1) {
    score = 70;
    assessment = '减重稍快';
    advice = '减重速度略快，可适当增加蛋白质摄入保护肌肉';
  } else if (weeklyChange >= -1 && weeklyChange <= 0.5) {
    score = 90;
    assessment = '减重节奏理想';
    advice = '当前的减重速度很健康，继续保持';
  } else if (weeklyChange > 1) {
    score = 50;
    assessment = '体重上升';
    advice = '体重呈上升趋势，建议检查饮食热量控制情况';
  }
  
  return {
    score,
    assessment,
    advice,
    totalChange: parseFloat(totalChange.toFixed(1)),
    weeklyChange: parseFloat(weeklyChange.toFixed(2))
  };
}

/**
 * 计算热量摄入评分
 * @param {number} intake - 实际摄入
 * @param {number} target - 目标摄入
 * @param {number} bmr - 基础代谢
 * @returns {Object} 评分结果
 */
function calculateCalorieScore(intake, target, bmr) {
  if (!intake) return { score: 0, assessment: '暂无数据' };
  
  const diff = Math.abs(intake - target);
  const diffPercent = diff / target;
  
  let score = Math.max(0, 100 - diffPercent * 100);
  let assessment = '热量控制良好';
  let advice = '继续保持当前的热量摄入水平';
  
  if (intake < bmr * 0.8) {
    score = 30;
    assessment = '热量摄入过低';
    advice = '摄入热量低于基础代谢的80%，可能影响健康和代谢，建议适当增加';
  } else if (intake > target * 1.2) {
    score = 40;
    assessment = '热量摄入偏高';
    advice = '摄入热量超过目标的20%，建议适当控制食量';
  } else if (diffPercent < 0.1) {
    score = 95;
    assessment = '热量控制精准';
    advice = '热量摄入非常接近目标，继续保持';
  } else if (diffPercent < 0.2) {
    score = 80;
    assessment = '热量控制良好';
    advice = '热量摄入在合理范围内';
  }
  
  return {
    score: Math.round(score),
    assessment,
    advice,
    intake,
    target,
    diff: Math.round(diff)
  };
}

/**
 * 计算运动评分
 * @param {Array} exerciseRecords - 运动记录
 * @param {number} targetBurn - 目标消耗
 * @returns {Object} 评分结果
 */
function calculateExerciseScore(exerciseRecords, targetBurn = 300) {
  if (!exerciseRecords || exerciseRecords.length === 0) {
    return { score: 0, assessment: '暂无运动数据', advice: '建议每周进行至少150分钟中等强度运动' };
  }
  
  const totalDuration = exerciseRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
  const totalBurn = exerciseRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
  
  const burnScore = Math.min(100, (totalBurn / targetBurn) * 100);
  const durationScore = Math.min(100, (totalDuration / 30) * 100);
  
  const score = Math.round((burnScore * 0.6 + durationScore * 0.4));
  
  let assessment = '运动量适中';
  let advice = '继续保持当前的运动频率';
  
  if (score < 40) {
    assessment = '运动量不足';
    advice = '建议增加运动时间或强度，每周至少运动3次，每次30分钟以上';
  } else if (score > 90) {
    assessment = '运动量充足';
    advice = '运动量很充足，注意适当休息，避免过度训练';
  }
  
  return {
    score,
    assessment,
    advice,
    totalDuration,
    totalBurn
  };
}

/**
 * 生成综合健康报告
 * @param {Object} data - 包含weightRecords, dietRecords, exerciseRecords, settings
 * @returns {Object} 综合报告
 */
function generateHealthReport(data) {
  const { weightRecords, dietRecords, exerciseRecords, settings } = data;
  
  // 计算各项评分
  const weightHealth = calculateWeightHealth(weightRecords);
  
  // 今日饮食统计
  const today = new Date().toISOString().split('T')[0];
  const todayDiet = dietRecords.filter(r => r.date === today);
  const todayIntake = todayDiet.reduce((sum, r) => sum + (r.calories || 0), 0);
  const todayProtein = todayDiet.reduce((sum, r) => sum + (r.protein || 0), 0);
  const todayCarbs = todayDiet.reduce((sum, r) => sum + (r.carbs || 0), 0);
  const todayFat = todayDiet.reduce((sum, r) => sum + (r.fat || 0), 0);
  
  const calorieScore = calculateCalorieScore(todayIntake, settings.dailyCalorieTarget, settings.baseMetabolism);
  const nutritionScore = calculateNutritionScore(todayProtein, todayCarbs, todayFat);
  
  // 今日运动
  const todayExercise = exerciseRecords.filter(r => r.date === today);
  const exerciseScore = calculateExerciseScore(todayExercise);
  
  // 综合评分
  const overallScore = Math.round(
    (weightHealth.score * 0.3 + calorieScore.score * 0.25 + nutritionScore.score * 0.25 + exerciseScore.score * 0.2)
  );
  
  // 生成综合建议
  const suggestions = [];
  if (weightHealth.score < 60) suggestions.push(weightHealth.advice);
  if (calorieScore.score < 60) suggestions.push(calorieScore.advice);
  if (nutritionScore.score < 60) suggestions.push('建议调整饮食结构，增加蛋白质和蔬菜比例');
  if (exerciseScore.score < 60) suggestions.push(exerciseScore.advice);
  
  if (suggestions.length === 0) {
    suggestions.push('各项指标良好，继续保持健康的生活方式！');
  }
  
  return {
    overallScore,
    date: today,
    dimensions: {
      weight: weightHealth,
      calorie: calorieScore,
      nutrition: nutritionScore,
      exercise: exerciseScore
    },
    summary: {
      todayIntake,
      todayBurn: todayExercise.reduce((sum, r) => sum + (r.calories || 0), 0),
      todayExercise: todayExercise.reduce((sum, r) => sum + (r.duration || 0), 0),
      currentWeight: weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : null
    },
    suggestions
  };
}

/**
 * 生成周总结报告
 * @param {Object} data - 周数据
 * @returns {Object} 周总结
 */
function generateWeeklyReport(data) {
  const { weightRecords, dietRecords, exerciseRecords, settings } = data;
  
  if (!weightRecords || weightRecords.length === 0) {
    return { hasData: false, message: '本周暂无数据记录' };
  }
  
  const sortedWeights = [...weightRecords].sort((a, b) => a.timestamp - b.timestamp);
  const weights = sortedWeights.map(r => r.weight);
  
  const avgWeight = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1);
  const maxWeight = Math.max(...weights).toFixed(1);
  const minWeight = Math.min(...weights).toFixed(1);
  const firstWeight = weights[0];
  const lastWeight = weights[weights.length - 1];
  const change = (lastWeight - firstWeight).toFixed(1);
  
  // 饮食统计
  const totalIntake = dietRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
  const avgDailyIntake = dietRecords.length > 0 ? Math.round(totalIntake / 7) : 0;
  
  // 运动统计
  const totalExerciseTime = exerciseRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
  const totalBurn = exerciseRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
  
  // 进度评估
  const targetDiff = settings.targetWeight ? (lastWeight - settings.targetWeight).toFixed(1) : null;
  const progressPercent = settings.targetWeight && settings.targetWeight < firstWeight
    ? Math.round(((firstWeight - lastWeight) / (firstWeight - settings.targetWeight)) * 100)
    : 0;
  
  return {
    hasData: true,
    avgWeight,
    maxWeight,
    minWeight,
    change,
    changeDirection: change < 0 ? 'down' : change > 0 ? 'up' : 'stable',
    avgDailyIntake,
    totalExerciseTime,
    totalBurn,
    targetDiff,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    assessment: change <= 0 ? '本周体重呈下降趋势，继续保持！' : '本周体重有所上升，建议适当调整饮食和运动计划'
  };
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  getBMICategory,
  calculateCalorieDeficit,
  calculateNutritionScore,
  calculateWeightHealth,
  calculateCalorieScore,
  calculateExerciseScore,
  generateHealthReport,
  generateWeeklyReport
};
