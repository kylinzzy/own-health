/**
 * 减脂食谱数据
 * 收录热门减脂食谱，含小红书主流低卡餐、快手餐等
 */

const RECIPES = [
  {
    id: 'recipe-001',
    name: '鸡胸肉蔬菜沙拉',
    mealType: 'lunch',
    calories: 320,
    protein: 35,
    carbs: 15,
    fat: 12,
    tags: ['highProtein', 'lowFat', 'quick'],
    ingredients: [
      { name: '鸡胸肉', amount: '150g' },
      { name: '生菜', amount: '100g' },
      { name: '小番茄', amount: '50g' },
      { name: '黄瓜', amount: '50g' },
      { name: '橄榄油', amount: '5ml' },
      { name: '柠檬汁', amount: '适量' }
    ],
    steps: [
      '鸡胸肉洗净，用少许盐和黑胡椒腌制10分钟',
      '平底锅刷少许油，中火煎鸡胸肉至两面金黄，约5-6分钟',
      '生菜洗净撕小块，小番茄对半切，黄瓜切片',
      '将蔬菜铺在盘底，放上切好的鸡胸肉',
      '淋上橄榄油和柠檬汁，撒少许黑胡椒即可'
    ],
    tips: '鸡胸肉不要煎太久，保持嫩滑口感',
    prepTime: 15,
    difficulty: '简单',
    ingredientTypes: ['meat', 'vegetable']
  },
  {
    id: 'recipe-002',
    name: '燕麦蓝莓酸奶杯',
    mealType: 'breakfast',
    calories: 280,
    protein: 12,
    carbs: 45,
    fat: 6,
    tags: ['highFiber', 'lowFat', 'quick'],
    ingredients: [
      { name: '即食燕麦', amount: '40g' },
      { name: '无糖酸奶', amount: '150g' },
      { name: '蓝莓', amount: '30g' },
      { name: '香蕉', amount: '半根' },
      { name: '奇亚籽', amount: '5g' }
    ],
    steps: [
      '在杯底铺一层燕麦',
      '倒入一半酸奶',
      '铺一层切好的香蕉片',
      '再倒入剩余酸奶',
      '顶部放上蓝莓和奇亚籽',
      '冷藏10分钟口感更佳'
    ],
    tips: '可前一晚做好放冰箱，第二天早上直接吃',
    prepTime: 5,
    difficulty: '简单',
    ingredientTypes: ['dairy', 'fruit', 'grain']
  },
  {
    id: 'recipe-003',
    name: '清蒸鲈鱼',
    mealType: 'dinner',
    calories: 180,
    protein: 28,
    carbs: 2,
    fat: 6,
    tags: ['highProtein', 'lowFat', 'lowCalorie'],
    ingredients: [
      { name: '鲈鱼', amount: '200g' },
      { name: '姜丝', amount: '10g' },
      { name: '葱丝', amount: '10g' },
      { name: '蒸鱼豉油', amount: '10ml' },
      { name: '料酒', amount: '5ml' }
    ],
    steps: [
      '鲈鱼处理干净，两面划几刀',
      '鱼身抹少许料酒，铺上姜丝',
      '水开后上锅蒸8-10分钟',
      '倒掉蒸出的汤汁',
      '铺上葱丝，淋上蒸鱼豉油',
      '烧热少许油浇在葱丝上即可'
    ],
    tips: '蒸鱼时间根据鱼的大小调整，不要蒸过头',
    prepTime: 20,
    difficulty: '中等',
    ingredientTypes: ['seafood']
  },
  {
    id: 'recipe-004',
    name: '全麦蔬菜三明治',
    mealType: 'breakfast',
    calories: 350,
    protein: 15,
    carbs: 40,
    fat: 14,
    tags: ['highFiber', 'quick', 'vegetarian'],
    ingredients: [
      { name: '全麦面包', amount: '2片' },
      { name: '生菜', amount: '2片' },
      { name: '番茄', amount: '2片' },
      { name: '黄瓜', amount: '4片' },
      { name: '鸡蛋', amount: '1个' },
      { name: '低脂沙拉酱', amount: '10g' }
    ],
    steps: [
      '鸡蛋煮熟切片',
      '全麦面包稍微烤一下',
      '面包片上抹薄薄一层沙拉酱',
      '依次铺上生菜、番茄、黄瓜、鸡蛋',
      '盖上另一片面包，对角切开即可'
    ],
    tips: '可加入鸡胸肉或火腿片增加蛋白质',
    prepTime: 10,
    difficulty: '简单',
    ingredientTypes: ['grain', 'vegetable', 'egg']
  },
  {
    id: 'recipe-005',
    name: '番茄鸡蛋荞麦面',
    mealType: 'lunch',
    calories: 380,
    protein: 18,
    carbs: 55,
    fat: 10,
    tags: ['quick', 'lowGI', 'vegetarian'],
    ingredients: [
      { name: '荞麦面', amount: '80g' },
      { name: '鸡蛋', amount: '2个' },
      { name: '番茄', amount: '2个' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '少许' },
      { name: '香油', amount: '3ml' }
    ],
    steps: [
      '番茄切块，鸡蛋打散',
      '锅中少许油，炒鸡蛋至凝固盛出',
      '锅中再加油，炒番茄出汁',
      '加入适量水烧开',
      '放入荞麦面煮熟',
      '倒入炒好的鸡蛋，调味即可'
    ],
    tips: '荞麦面煮的时间比普通面条稍长',
    prepTime: 15,
    difficulty: '简单',
    ingredientTypes: ['grain', 'vegetable', 'egg']
  },
  {
    id: 'recipe-006',
    name: '蒜蓉西兰花虾仁',
    mealType: 'dinner',
    calories: 220,
    protein: 25,
    carbs: 12,
    fat: 8,
    tags: ['highProtein', 'lowCalorie', 'quick'],
    ingredients: [
      { name: '虾仁', amount: '150g' },
      { name: '西兰花', amount: '200g' },
      { name: '蒜末', amount: '15g' },
      { name: '生抽', amount: '5ml' },
      { name: '料酒', amount: '5ml' }
    ],
    steps: [
      '虾仁去虾线，用料酒腌制5分钟',
      '西兰花掰小朵，焯水1分钟捞出',
      '锅中少许油，爆香蒜末',
      '放入虾仁炒至变色',
      '加入西兰花翻炒',
      '淋入生抽调味即可'
    ],
    tips: '西兰花焯水时加少许盐和油，保持翠绿',
    prepTime: 15,
    difficulty: '简单',
    ingredientTypes: ['seafood', 'vegetable']
  },
  {
    id: 'recipe-007',
    name: '紫薯燕麦粥',
    mealType: 'breakfast',
    calories: 240,
    protein: 6,
    carbs: 48,
    fat: 2,
    tags: ['highFiber', 'lowFat', 'lowGI'],
    ingredients: [
      { name: '紫薯', amount: '100g' },
      { name: '燕麦', amount: '30g' },
      { name: '小米', amount: '20g' },
      { name: '水', amount: '400ml' }
    ],
    steps: [
      '紫薯去皮切小块',
      '燕麦和小米洗净',
      '所有材料放入锅中',
      '大火煮开后转小火煮20分钟',
      '煮至粥稠即可'
    ],
    tips: '可提前一晚用电饭煲预约煮粥',
    prepTime: 25,
    difficulty: '简单',
    ingredientTypes: ['grain', 'vegetable']
  },
  {
    id: 'recipe-008',
    name: '香煎三文鱼配芦笋',
    mealType: 'dinner',
    calories: 350,
    protein: 30,
    carbs: 8,
    fat: 20,
    tags: ['highProtein', 'lowGI', 'lowCarb'],
    ingredients: [
      { name: '三文鱼', amount: '150g' },
      { name: '芦笋', amount: '100g' },
      { name: '柠檬', amount: '2片' },
      { name: '黑胡椒', amount: '适量' },
      { name: '海盐', amount: '少许' }
    ],
    steps: [
      '三文鱼用厨房纸吸干水分',
      '两面撒上海盐和黑胡椒',
      '平底锅不放油，三文鱼皮朝下煎至金黄',
      '翻面继续煎2-3分钟',
      '芦笋焯水或煎熟',
      '摆盘，挤上柠檬汁'
    ],
    tips: '三文鱼本身油脂丰富，煎的时候不需要额外加油',
    prepTime: 15,
    difficulty: '中等',
    ingredientTypes: ['seafood', 'vegetable']
  },
  {
    id: 'recipe-009',
    name: '蔬菜豆腐汤',
    mealType: 'dinner',
    calories: 150,
    protein: 12,
    carbs: 10,
    fat: 6,
    tags: ['lowCalorie', 'vegetarian', 'quick'],
    ingredients: [
      { name: '嫩豆腐', amount: '200g' },
      { name: '白菜', amount: '100g' },
      { name: '香菇', amount: '3朵' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '少许' }
    ],
    steps: [
      '豆腐切小块，白菜切段，香菇切片',
      '锅中加水烧开',
      '放入香菇煮2分钟',
      '加入豆腐和白菜',
      '煮5分钟，调味撒葱花即可'
    ],
    tips: '可加入少量虾皮提鲜',
    prepTime: 10,
    difficulty: '简单',
    ingredientTypes: ['vegetable', 'egg']
  },
  {
    id: 'recipe-010',
    name: '希腊酸奶水果碗',
    mealType: 'snack',
    calories: 200,
    protein: 15,
    carbs: 25,
    fat: 5,
    tags: ['highProtein', 'quick', 'lowFat'],
    ingredients: [
      { name: '希腊酸奶', amount: '150g' },
      { name: '草莓', amount: '50g' },
      { name: '猕猴桃', amount: '1个' },
      { name: '坚果碎', amount: '10g' },
      { name: '蜂蜜', amount: '5g' }
    ],
    steps: [
      '希腊酸奶倒入碗中',
      '草莓切片，猕猴桃切块',
      '水果摆放在酸奶上',
      '撒上坚果碎',
      '淋上少许蜂蜜'
    ],
    tips: '希腊酸奶蛋白质含量高，饱腹感强',
    prepTime: 5,
    difficulty: '简单',
    ingredientTypes: ['dairy', 'fruit']
  },
  {
    id: 'recipe-011',
    name: '黑椒牛柳炒意面',
    mealType: 'lunch',
    calories: 420,
    protein: 28,
    carbs: 48,
    fat: 14,
    tags: ['highProtein', 'quick'],
    ingredients: [
      { name: '牛里脊', amount: '120g' },
      { name: '意面', amount: '60g' },
      { name: '青椒', amount: '50g' },
      { name: '洋葱', amount: '30g' },
      { name: '黑胡椒酱', amount: '15g' }
    ],
    steps: [
      '牛肉切条，用少许生抽腌制',
      '意面煮熟捞出备用',
      '锅中少许油，快炒牛肉至变色盛出',
      '炒青椒和洋葱',
      '倒入牛肉和意面',
      '加入黑胡椒酱翻炒均匀'
    ],
    tips: '牛肉不要炒太久，保持嫩滑',
    prepTime: 20,
    difficulty: '中等',
    ingredientTypes: ['meat', 'grain', 'vegetable']
  },
  {
    id: 'recipe-012',
    name: '蒸蛋羹',
    mealType: 'breakfast',
    calories: 160,
    protein: 14,
    carbs: 3,
    fat: 10,
    tags: ['highProtein', 'lowCarb', 'quick'],
    ingredients: [
      { name: '鸡蛋', amount: '2个' },
      { name: '温水', amount: '150ml' },
      { name: '盐', amount: '少许' },
      { name: '香油', amount: '3ml' },
      { name: '葱花', amount: '适量' }
    ],
    steps: [
      '鸡蛋打散，加入温水和盐搅匀',
      '过筛去除泡沫',
      '盖上保鲜膜，扎几个小孔',
      '水开后蒸8-10分钟',
      '出锅淋香油撒葱花'
    ],
    tips: '蛋液和水的比例1:1.5，蒸出来最嫩滑',
    prepTime: 12,
    difficulty: '简单',
    ingredientTypes: ['egg']
  }
];

module.exports = {
  RECIPES
};
