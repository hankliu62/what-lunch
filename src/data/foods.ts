/**
 * 食物数据配置文件
 * 使用 Unsplash 免费图片
 * 图片 URL 格式: https://images.unsplash.com/photo-{ID}?w=800&q=80
 */

// 食物分类和对应数据
export interface FoodItem {
  name: string; // 食物名称
  category: string; // 分类
  image: string; // 预设图片 URL
  fallbackKeyword: string; // 图库搜索关键词（用于获取随机图片）
}

// 食物数据列表
export const foodsData: FoodItem[] = [
  // 🍜 面食类
  {
    name: "馄饨",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "wonton soup",
  },
  {
    name: "拉面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "ramen noodles",
  },
  {
    name: "烩面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80",
    fallbackKeyword: "noodle soup",
  },
  {
    name: "热干面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "asian noodles",
  },
  {
    name: "刀削面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "hand cut noodles",
  },
  {
    name: "油泼面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "noodles",
  },
  {
    name: "炸酱面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "noodles",
  },
  {
    name: "炒面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "fried noodles",
  },
  {
    name: "重庆小面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "spicy noodles",
  },
  {
    name: "米线",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "rice noodles",
  },
  {
    name: "酸辣粉",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "sour spicy noodles",
  },
  {
    name: "土豆粉",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "potato noodles",
  },
  {
    name: "螺蛳粉",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "luosifen",
  },
  {
    name: "凉皮",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "cold noodles",
  },

  // 🍲 川菜/热菜类
  {
    name: "川菜",
    category: "川菜",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80",
    fallbackKeyword: "chinese food",
  },
  {
    name: "麻辣香锅",
    category: "川菜",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80",
    fallbackKeyword: "malasiloguo",
  },
  {
    name: "火锅",
    category: "川菜",
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80",
    fallbackKeyword: "hotpot",
  },
  {
    name: "酸菜鱼",
    category: "川菜",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
    fallbackKeyword: "fish dish",
  },
  {
    name: "烤串",
    category: "烧烤",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    fallbackKeyword: "bbq skewers",
  },
  {
    name: "烤鸭",
    category: "川菜",
    image:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=80",
    fallbackKeyword: "roast duck",
  },

  // 🍕 西餐类
  {
    name: "披萨",
    category: "西餐",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    fallbackKeyword: "pizza",
  },
  {
    name: "汉堡",
    category: "西餐",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    fallbackKeyword: "burger",
  },
  {
    name: "炸鸡",
    category: "西餐",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a72c6b5bdd?w=800&q=80",
    fallbackKeyword: "fried chicken",
  },
  {
    name: "寿司",
    category: "日料",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    fallbackKeyword: "sushi",
  },

  // 🥟 小吃类
  {
    name: "蟹黄包",
    category: "小吃",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    fallbackKeyword: "soup dumpling",
  },
  {
    name: "煎饼果子",
    category: "小吃",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
    fallbackKeyword: "chinese crepe",
  },
  {
    name: "生煎",
    category: "小吃",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    fallbackKeyword: "pan fried dumpling",
  },
  {
    name: "炒年糕",
    category: "小吃",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "fried rice cake",
  },

  // 🍜 新增面食
  {
    name: "担担面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "dandan noodles",
  },
  {
    name: "biangbiang面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "biangbiang noodles",
  },
  {
    name: "牛肉面",
    category: "面食",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    fallbackKeyword: "beef noodles",
  },
  {
    name: "砂锅",
    category: "热菜",
    image:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe1?w=800&q=80",
    fallbackKeyword: "casserole",
  },
  {
    name: "麻辣烫",
    category: "川菜",
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80",
    fallbackKeyword: "malatang",
  },

  // 🥗 其他
  {
    name: "饺子",
    category: "小吃",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    fallbackKeyword: "dumplings",
  },
  {
    name: "包子",
    category: "小吃",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    fallbackKeyword: "baozi",
  },
  {
    name: "粥",
    category: "主食",
    image:
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80",
    fallbackKeyword: "congee",
  },
  {
    name: "盖浇饭",
    category: "主食",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    fallbackKeyword: "rice bowl",
  },
  {
    name: "炒饭",
    category: "主食",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    fallbackKeyword: "fried rice",
  },
];

// 获取所有食物名称（兼容旧代码）
export const foods = foodsData.map((f) => f.name);

// 根据名称获取食物数据
export function getFoodByName(name: string): FoodItem | undefined {
  return foodsData.find((f) => f.name === name);
}

// 随机获取一个食物
export function getRandomFood(): FoodItem {
  const randomIndex = Math.floor(Math.random() * foodsData.length);
  return foodsData[randomIndex];
}

// 按分类获取食物
export function getFoodsByCategory(category: string): FoodItem[] {
  return foodsData.filter((f) => f.category === category);
}

// 获取所有分类
export function getCategories(): string[] {
  return [...new Set(foodsData.map((f) => f.category))];
}

// 备用图片源 - 使用 Lorem Picsum（无需 API key）
export const fallbackImageService = {
  // 使用 picsum.photos 作为备用
  getRandomImage: (seed?: string) => {
    const randomSeed = seed || Math.random().toString(36).substring(7);
    return `https://picsum.photos/seed/${randomSeed}/800/600`;
  },

  // 使用固定的美食图片
  getUnsplashImage: () => {
    const foodImages = [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    ];
    return foodImages[Math.floor(Math.random() * foodImages.length)];
  },
};
