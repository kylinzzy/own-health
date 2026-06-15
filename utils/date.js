/**
 * 日期处理工具函数
 * 提供日期格式化、计算、比较等常用功能
 */

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  if (!date) date = new Date();
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期为 MM月DD日
 * @param {Date|string|number} date 
 * @returns {string}
 */
function formatDateCN(date) {
  if (!date) date = new Date();
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

/**
 * 格式化日期为 YYYY年MM月DD日
 * @param {Date|string|number} date 
 * @returns {string}
 */
function formatDateFull(date) {
  if (!date) date = new Date();
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 获取星期几
 * @param {Date|string|number} date 
 * @returns {string}
 */
function getWeekDay(date) {
  if (!date) date = new Date();
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
}

/**
 * 获取今天的日期字符串
 * @returns {string} YYYY-MM-DD
 */
function getToday() {
  return formatDate(new Date());
}

/**
 * 获取指定日期的前后N天
 * @param {Date|string} date - 基准日期
 * @param {number} days - 天数（正数为后，负数为前）
 * @returns {string} YYYY-MM-DD
 */
function addDays(date, days) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
}

/**
 * 获取指定日期所在周的起止日期
 * @param {Date|string} date 
 * @returns {Object} {start: string, end: string}
 */
function getWeekRange(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 周一开始
  
  const start = new Date(date.setDate(diff));
  const end = new Date(date.setDate(start.getDate() + 6));
  
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}

/**
 * 获取指定日期所在月的起止日期
 * @param {Date|string} date 
 * @returns {Object} {start: string, end: string}
 */
function getMonthRange(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}

/**
 * 获取两个日期之间的所有日期
 * @param {string} startDate - 开始日期 YYYY-MM-DD
 * @param {string} endDate - 结束日期 YYYY-MM-DD
 * @returns {Array<string>} 日期数组
 */
function getDatesBetween(startDate, endDate) {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  while (start <= end) {
    dates.push(formatDate(start));
    start.setDate(start.getDate() + 1);
  }
  
  return dates;
}

/**
 * 获取最近N天的日期数组
 * @param {number} n - 天数
 * @returns {Array<string>} 日期数组（从近到远）
 */
function getRecentDays(n) {
  const dates = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
}

/**
 * 计算两个日期相差的天数
 * @param {string} date1 - YYYY-MM-DD
 * @param {string} date2 - YYYY-MM-DD
 * @returns {number}
 */
function diffDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 判断是否为今天
 * @param {string} date - YYYY-MM-DD
 * @returns {boolean}
 */
function isToday(date) {
  return date === getToday();
}

/**
 * 判断日期是否为本周
 * @param {string} date - YYYY-MM-DD
 * @returns {boolean}
 */
function isThisWeek(date) {
  const weekRange = getWeekRange(new Date());
  return date >= weekRange.start && date <= weekRange.end;
}

/**
 * 判断日期是否为本月
 * @param {string} date - YYYY-MM-DD
 * @returns {boolean}
 */
function isThisMonth(date) {
  const monthRange = getMonthRange(new Date());
  return date >= monthRange.start && date <= monthRange.end;
}

/**
 * 获取友好时间显示
 * @param {string} date - YYYY-MM-DD
 * @returns {string}
 */
function getFriendlyDate(date) {
  if (isToday(date)) {
    return '今天';
  }
  
  const yesterday = addDays(new Date(), -1);
  if (date === yesterday) {
    return '昨天';
  }
  
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

module.exports = {
  formatDate,
  formatDateCN,
  formatDateFull,
  getWeekDay,
  getToday,
  addDays,
  getWeekRange,
  getMonthRange,
  getDatesBetween,
  getRecentDays,
  diffDays,
  isToday,
  isThisWeek,
  isThisMonth,
  getFriendlyDate
};
