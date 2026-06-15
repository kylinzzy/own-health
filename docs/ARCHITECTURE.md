# 健康减肥健身微信小程序 - 架构设计文档

## 一、项目概述

纯私人自用的健康减肥健身微信小程序，无商业化、无多用户体系，主打个人数据本地留存。

## 二、技术选型

| 技术项 | 选型 | 说明 |
|--------|------|------|
| 框架 | 微信原生小程序 | 保证运行流畅，无重型依赖 |
| 数据存储 | wx.storage + 本地缓存 | 无需后端，数据不上传 |
| 图表方案 | 自研轻量canvas图表 | 体重趋势曲线，支持手势缩放 |
| 样式方案 | WXSS + CSS变量 | 简约清新风格 |
| 状态管理 | App.globalData + 页面间通信 | 轻量级方案 |

## 三、目录结构

```
health-miniapp/
├── app.js                    # 应用生命周期、全局数据
├── app.json                  # 全局配置（页面路由、窗口、tabBar）
├── app.wxss                  # 全局样式、CSS变量、工具类
├── sitemap.json              # 微信搜索索引配置
├── project.config.json       # 项目配置
├── pages/                    # 页面目录
│   ├── index/                # 首页（数据概览）
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── guide/                # 膳食指南
│   │   ├── guide.js
│   │   ├── guide.json
│   │   ├── guide.wxml
│   │   └── guide.wxss
│   ├── guide-detail/         # 指南详情
│   │   ├── guide-detail.js
│   │   ├── guide-detail.json
│   │   ├── guide-detail.wxml
│   │   └── guide-detail.wxss
│   ├── recipes/              # 减脂食谱库
│   │   ├── recipes.js
│   │   ├── recipes.json
│   │   ├── recipes.wxml
│   │   └── recipes.wxss
│   ├── recipe-detail/        # 食谱详情
│   │   ├── recipe-detail.js
│   │   ├── recipe-detail.json
│   │   ├── recipe-detail.wxml
│   │   └── recipe-detail.wxss
│   ├── weight/               # 体重管理
│   │   ├── weight.js
│   │   ├── weight.json
│   │   ├── weight.wxml
│   │   └── weight.wxss
│   ├── weight-record/        # 体重录入
│   │   ├── weight-record.js
│   │   ├── weight-record.json
│   │   ├── weight-record.wxml
│   │   └── weight-record.wxss
│   ├── diet/                 # 饮食记录
│   │   ├── diet.js
│   │   ├── diet.json
│   │   ├── diet.wxml
│   │   └── diet.wxss
│   ├── diet-record/          # 饮食录入
│   │   ├── diet-record.js
│   │   ├── diet-record.json
│   │   ├── diet-record.wxml
│   │   └── diet-record.wxss
│   ├── exercise/             # 运动记录
│   │   ├── exercise.js
│   │   ├── exercise.json
│   │   ├── exercise.wxml
│   │   └── exercise.wxss
│   ├── exercise-record/      # 运动录入
│   │   ├── exercise-record.js
│   │   ├── exercise-record.json
│   │   ├── exercise-record.wxml
│   │   └── exercise-record.wxss
│   └── analysis/             # 智能健康分析
│       ├── analysis.js
│       ├── analysis.json
│       ├── analysis.wxml
│       └── analysis.wxss
├── components/               # 公共组件
│   ├── chart/                # 轻量图表组件
│   │   ├── chart.js
│   │   ├── chart.json
│   │   ├── chart.wxml
│   │   └── chart.wxss
│   ├── stat-card/            # 统计卡片
│   │   ├── stat-card.js
│   │   ├── stat-card.json
│   │   ├── stat-card.wxml
│   │   └── stat-card.wxss
│   ├── meal-section/         # 餐次展示组件
│   │   ├── meal-section.js
│   │   ├── meal-section.json
│   │   ├── meal-section.wxml
│   │   └── meal-section.wxss
│   └── recipe-card/          # 食谱卡片
│       ├── recipe-card.js
│       ├── recipe-card.json
│       ├── recipe-card.wxml
│       └── recipe-card.wxss
├── utils/                    # 工具函数
│   ├── storage.js            # 本地存储封装
│   ├── date.js               # 日期处理工具
│   ├── chart.js              # 图表绘制工具
│   ├── analysis.js           # 健康分析算法
│   └── constants.js          # 常量定义
├── data/                     # 静态数据
│   ├── guide-data.js         # 膳食指南数据
│   └── recipe-data.js        # 食谱初始数据
└── docs/                     # 文档
    ├── ARCHITECTURE.md       # 架构设计
    └── DEPLOY.md             # 部署说明
```

## 四、页面路由设计

| 页面路径 | 说明 | tabBar |
|----------|------|--------|
| pages/index/index | 首页-数据概览 | 是 |
| pages/weight/weight | 体重管理 | 是 |
| pages/diet/diet | 饮食记录 | 是 |
| pages/exercise/exercise | 运动记录 | 是 |
| pages/analysis/analysis | 健康分析 | 是 |
| pages/guide/guide | 膳食指南 | 否 |
| pages/guide-detail/guide-detail | 指南详情 | 否 |
| pages/recipes/recipes | 减脂食谱库 | 否 |
| pages/recipe-detail/recipe-detail | 食谱详情 | 否 |
| pages/weight-record/weight-record | 体重录入 | 否 |
| pages/diet-record/diet-record | 饮食录入 | 否 |
| pages/exercise-record/exercise-record | 运动录入 | 否 |

## 五、数据模型设计

### 5.1 用户基础设置
```javascript
{
  targetWeight: 60,           // 目标体重(kg)
  currentHeight: 170,         // 身高(cm)
  age: 25,                    // 年龄
  gender: 'male',             // 性别
  baseMetabolism: 1500,       // 基础代谢(自动计算或手动设置)
  dailyCalorieTarget: 1800    // 每日热量目标
}
```

### 5.2 体重记录
```javascript
{
  id: '20240115',
  date: '2024-01-15',
  weight: 65.5,               // 体重(kg)
  bodyFat: 20.5,              // 体脂率(%)
  note: '今天感觉不错',
  timestamp: 1705315200000
}
```

### 5.3 饮食记录
```javascript
{
  id: '20240115-breakfast-001',
  date: '2024-01-15',
  mealType: 'breakfast',      // breakfast/lunch/dinner/snack
  name: '燕麦牛奶',
  calories: 350,
  protein: 15,
  carbs: 45,
  fat: 8,
  source: 'recipe',           // recipe/manual
  recipeId: 'recipe-001',     // 关联食谱ID
  timestamp: 1705315200000
}
```

### 5.4 运动记录
```javascript
{
  id: '20240115-ex-001',
  date: '2024-01-15',
  type: 'running',            // 运动类型
  name: '慢跑',
  duration: 30,               // 时长(分钟)
  calories: 300,              // 消耗热量
  intensity: 'medium',        // 强度
  timestamp: 1705315200000
}
```

### 5.5 食谱收藏
```javascript
{
  recipeId: 'recipe-001',
  collectedAt: 1705315200000
}
```

## 六、本地存储方案

| 存储Key | 数据类型 | 说明 |
|---------|----------|------|
| user_settings | Object | 用户基础设置 |
| weight_records | Array | 体重记录列表 |
| diet_records | Array | 饮食记录列表 |
| exercise_records | Array | 运动记录列表 |
| favorite_recipes | Array | 收藏食谱ID列表 |
| first_launch | Boolean | 是否首次启动 |

## 七、核心算法

### 7.1 基础代谢计算（Mifflin-St Jeor公式）
```
男性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5
女性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161
```

### 7.2 热量缺口计算
```
热量缺口 = 每日摄入热量 - 基础代谢 - 运动消耗
```

### 7.3 健康度评分算法
- 热量摄入合理性：与目标热量对比
- 营养素均衡度：蛋白质20-30%、碳水45-55%、脂肪20-30%
- 体重变化速率：每周0.5-1kg为健康范围
- 运动适配度：根据减重目标评估运动强度

## 八、UI设计规范

### 8.1 配色方案
- 主色：#2ECC71（健康绿）
- 辅色：#3498DB（信息蓝）
- 强调色：#E74C3C（警示红）
- 背景色：#F8F9FA（浅灰白）
- 文字主色：#2C3E50（深灰）
- 文字次色：#7F8C8D（中灰）

### 8.2 字体规范
- 大标题：20px, bold
- 页面标题：18px, bold
- 卡片标题：16px, bold
- 正文：14px, normal
- 辅助文字：12px, normal

### 8.3 间距规范
- 页面边距：16px
- 卡片间距：12px
- 元素间距：8px
- 圆角：12px（卡片）、8px（按钮）、4px（标签）

## 九、性能优化策略

1. **setData优化**：合并数据更新，减少调用次数
2. **图片优化**：使用CDN压缩图片，懒加载
3. **列表优化**：长列表使用虚拟滚动
4. **存储优化**：数据分页加载，避免单次存储过大
5. **启动优化**：延迟加载非核心模块

## 十、开发规范

1. 所有页面使用Page构造器，组件使用Component构造器
2. 异步操作统一使用Promise封装
3. 数据操作统一通过storage.js工具函数
4. 日期处理统一通过date.js工具函数
5. 注释规范：函数级JSDoc，关键逻辑行注释
