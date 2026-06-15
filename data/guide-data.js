/**
 * 膳食指南数据
 * 收录《中国居民膳食指南》权威核心内容
 */

const DIETARY_GUIDE = {
  // 膳食宝塔
  pagoda: {
    title: '中国居民平衡膳食宝塔',
    description: '膳食宝塔共分五层，包含每天应摄入的主要食物种类',
    levels: [
      {
        level: 5,
        name: '烹调油和盐',
        icon: '🛢️',
        recommendation: '烹调油 25-30g，食盐 < 5g',
        tips: ['选择植物油，如橄榄油、茶油', '减少隐形盐摄入', '少用油炸、煎烤']
      },
      {
        level: 4,
        name: '奶及奶制品、大豆及坚果',
        icon: '🥛',
        recommendation: '奶及奶制品 300-500g，大豆及坚果 25-35g',
        tips: ['每天一杯牛奶或酸奶', '豆腐、豆浆交替食用', '坚果适量，每天一小把']
      },
      {
        level: 3,
        name: '畜禽肉、水产品、蛋类',
        icon: '🥩',
        recommendation: '动物性食物 120-200g，每周2次水产品',
        tips: ['优选鱼禽类', '少吃肥肉和烟熏肉', '鸡蛋每天1个不弃蛋黄']
      },
      {
        level: 2,
        name: '蔬菜、水果',
        icon: '🥬',
        recommendation: '蔬菜 300-500g，水果 200-350g',
        tips: ['深色蔬菜占一半', '天天吃水果', '果汁不能代替鲜果']
      },
      {
        level: 1,
        name: '谷薯类',
        icon: '🌾',
        recommendation: '谷类 200-300g，薯类 50-100g',
        tips: ['全谷物和杂豆 50-150g', '粗细搭配', '主食多样化']
      }
    ]
  },

  // 营养素推荐
  nutrients: {
    title: '每日营养素推荐摄入量',
    description: '成年人（18-49岁）每日推荐摄入量参考',
    items: [
      {
        name: '能量',
        unit: 'kcal',
        male: 2250,
        female: 1800,
        note: '轻体力活动水平',
        icon: '⚡'
      },
      {
        name: '蛋白质',
        unit: 'g',
        male: 65,
        female: 55,
        note: '占总能量10-15%',
        icon: '🥜'
      },
      {
        name: '碳水化合物',
        unit: 'g',
        male: 300,
        female: 240,
        note: '占总能量50-65%',
        icon: '🍞'
      },
      {
        name: '脂肪',
        unit: 'g',
        male: 75,
        female: 60,
        note: '占总能量20-30%',
        icon: '🥑'
      },
      {
        name: '膳食纤维',
        unit: 'g',
        male: 25,
        female: 25,
        note: '促进肠道健康',
        icon: '🌾'
      },
      {
        name: '钙',
        unit: 'mg',
        male: 800,
        female: 800,
        note: '奶制品、豆制品补充',
        icon: '🦴'
      },
      {
        name: '铁',
        unit: 'mg',
        male: 12,
        female: 20,
        note: '女性需求量更高',
        icon: '🩸'
      },
      {
        name: '维生素C',
        unit: 'mg',
        male: 100,
        female: 100,
        note: '新鲜蔬果补充',
        icon: '🍊'
      },
      {
        name: '水',
        unit: 'ml',
        male: 1700,
        female: 1500,
        note: '不包括食物中的水',
        icon: '💧'
      }
    ]
  },

  // 不同人群饮食原则
  groups: {
    title: '不同人群饮食原则',
    categories: [
      {
        id: 'weight-loss',
        name: '减脂人群',
        icon: '🔥',
        principles: [
          '控制总热量摄入，每日减少300-500kcal',
          '蛋白质摄入增加至1.2-1.5g/kg体重',
          '选择低GI碳水化合物，避免精制糖',
          '增加膳食纤维摄入，提高饱腹感',
          '少食多餐，避免暴饮暴食',
          '保证充足饮水，每天2000ml以上'
        ],
        warnings: ['避免极端节食', '不要完全断碳', '注意营养均衡']
      },
      {
        id: 'muscle-building',
        name: '增肌人群',
        icon: '💪',
        principles: [
          '适当增加热量盈余，每日增加200-300kcal',
          '蛋白质摄入1.6-2.0g/kg体重',
          '训练后30分钟内补充蛋白质和碳水',
          '保证充足优质脂肪摄入',
          '多吃富含维生素和矿物质的食物',
          '注意训练前后的营养补充'
        ],
        warnings: ['避免过量蛋白质增加肾脏负担', '不要忽视蔬菜摄入']
      },
      {
        id: 'elderly',
        name: '中老年人群',
        icon: '👴',
        principles: [
          '食物多样化，保证营养均衡',
          '适当增加优质蛋白质摄入',
          '多吃富含钙的食物预防骨质疏松',
          '控制盐和油的摄入',
          '食物要细软易消化',
          '少量多餐，避免一次进食过多'
        ],
        warnings: ['注意食物安全', '关注慢性病饮食禁忌']
      },
      {
        id: 'pregnant',
        name: '孕期/哺乳期',
        icon: '🤰',
        principles: [
          '孕中期起每日增加300kcal',
          '增加优质蛋白质和铁摄入',
          '补充叶酸、钙、DHA',
          '避免生冷、未煮熟食物',
          '控制咖啡因摄入',
          '保证充足水分'
        ],
        warnings: ['遵医嘱补充营养素', '避免高糖高脂食物']
      },
      {
        id: 'diabetes',
        name: '血糖管理',
        icon: '🩺',
        principles: [
          '选择低GI食物，控制血糖波动',
          '定时定量进餐',
          '增加膳食纤维摄入',
          '控制总热量和碳水化合物',
          '避免含糖饮料和甜食',
          '监测餐后血糖反应'
        ],
        warnings: ['遵医嘱用药', '定期监测血糖']
      },
      {
        id: 'hypertension',
        name: '血压管理',
        icon: '❤️',
        principles: [
          '严格控盐，每日<5g',
          '多吃富含钾的食物',
          '限制饮酒',
          '保持健康体重',
          '增加蔬果摄入',
          '选择低脂乳制品'
        ],
        warnings: ['遵医嘱用药', '定期监测血压']
      }
    ]
  },

  // 饮食禁忌
  taboos: {
    title: '常见饮食禁忌',
    items: [
      {
        category: '减脂期禁忌',
        icon: '🚫',
        items: [
          '含糖饮料：奶茶、可乐、果汁',
          '油炸食品：炸鸡、薯条、油条',
          '精制甜点：蛋糕、饼干、糖果',
          '加工肉制品：香肠、培根、火腿',
          '高热量零食：薯片、坚果过量'
        ]
      },
      {
        category: '空腹禁忌',
        icon: '⏰',
        items: [
          '不宜空腹喝牛奶（乳糖不耐者）',
          '不宜空腹吃柿子',
          '不宜空腹喝浓茶咖啡',
          '不宜空腹吃香蕉（肾功能不全者）',
          '不宜空腹饮酒'
        ]
      },
      {
        category: '搭配禁忌',
        icon: '⚠️',
        items: [
          '牛奶不宜与药物同服',
          '菠菜不宜与豆腐同食（草酸钙）',
          '海鲜不宜与维生素C过量同食',
          '豆浆不宜冲鸡蛋',
          '蜂蜜不宜用开水冲服'
        ]
      }
    ]
  }
};

module.exports = {
  DIETARY_GUIDE
};
