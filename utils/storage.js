/**
 * 本地存储封装工具
 * 统一封装 wx.storage 操作，支持数据版本管理和异常处理
 */

const STORAGE_VERSION = '1.0.0';
const VERSION_KEY = '_storage_version';

/**
 * 检查存储版本，必要时进行数据迁移
 */
function checkVersion() {
  const currentVersion = wx.getStorageSync(VERSION_KEY);
  if (currentVersion !== STORAGE_VERSION) {
    // 版本升级时的数据迁移逻辑
    wx.setStorageSync(VERSION_KEY, STORAGE_VERSION);
  }
}

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {*} value - 缓存值
 * @param {number} expire - 过期时间（毫秒），0表示永不过期
 */
function set(key, value, expire = 0) {
  try {
    const data = {
      value,
      expire: expire > 0 ? Date.now() + expire : 0,
      timestamp: Date.now()
    };
    wx.setStorageSync(key, data);
    return true;
  } catch (e) {
    console.error('Storage set error:', e);
    return false;
  }
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @param {*} defaultValue - 默认值
 * @returns {*} 缓存值或默认值
 */
function get(key, defaultValue = null) {
  try {
    const data = wx.getStorageSync(key);
    
    // 无缓存返回默认值
    if (!data) return defaultValue;
    
    // 检查是否过期
    if (data.expire > 0 && Date.now() > data.expire) {
      remove(key);
      return defaultValue;
    }
    
    return data.value;
  } catch (e) {
    console.error('Storage get error:', e);
    return defaultValue;
  }
}

/**
 * 移除缓存
 * @param {string} key - 缓存键
 */
function remove(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error('Storage remove error:', e);
    return false;
  }
}

/**
 * 清空所有缓存
 */
function clear() {
  try {
    wx.clearStorageSync();
    return true;
  } catch (e) {
    console.error('Storage clear error:', e);
    return false;
  }
}

/**
 * 获取缓存信息
 */
function info() {
  try {
    return wx.getStorageInfoSync();
  } catch (e) {
    console.error('Storage info error:', e);
    return {};
  }
}

/**
 * 批量设置缓存
 * @param {Object} data - 键值对对象
 */
function setBatch(data) {
  const results = {};
  for (const [key, value] of Object.entries(data)) {
    results[key] = set(key, value);
  }
  return results;
}

/**
 * 批量获取缓存
 * @param {Array} keys - 键数组
 * @returns {Object} 键值对对象
 */
function getBatch(keys) {
  const result = {};
  for (const key of keys) {
    result[key] = get(key);
  }
  return result;
}

// 初始化版本检查
checkVersion();

module.exports = {
  set,
  get,
  remove,
  clear,
  info,
  setBatch,
  getBatch
};
