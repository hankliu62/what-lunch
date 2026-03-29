import { getRoutePrefix } from "../utils/route";

/**
 * 食物数据配置文件
 * 本地图片存放于 public/foot 目录
 */

// 食物分类和对应数据
export interface FoodItem {
  name: string; // 食物名称
  category: string; // 分类
  image: string; // 图片 URL
  fallbackKeyword: string; // 图库搜索关键词
}

// 图片名称到扩展名的映射（key 为 getFoodImage 的参数，value 为本地图片扩展名）
// 格式：图片名称: 扩展名（含 _compressed 表示压缩后的图片）
const imageExtensions: Record<string, string> = {
  // 🍜 面食类
  "wonton-soup": ".webp", // 馄饨
  "ramen-noodles": ".webp", // 拉面
  "noodle-soup": ".webp", // 烩面
  "asian-noodles": ".webp", // 热干面
  "hand-cut-noodles": ".webp", // 刀削面
  "oil-pull-noodles": "_compressed.webp", // 油泼面
  "zhajiang-noodles": ".webp", // 炸酱面
  "fried-noodles": ".webp", // 炒面
  "spicy-noodles": ".webp", // 重庆小面
  "rice-noodles": ".webp", // 米线
  "sour-spicy-noodles": ".webp", // 酸辣粉
  "potato-noodles": "_compressed.webp", // 土豆粉
  luosifen: ".webp", // 螺蛳粉
  liangpi: ".webp", // 凉皮

  // 🍲 川菜/热菜类
  "chuan-food": ".webp", // 川菜
  malaxiangguo: "_compressed.webp", // 麻辣香锅
  hotpot: ".avif", // 火锅
  suancaiyu: ".webp", // 酸菜鱼
  "bbq-skewers": ".avif", // 烤串
  "roast-duck": ".avif", // 烤鸭

  // 🍕 西餐类
  pizza: ".avif", // 披萨
  burger: ".avif", // 汉堡
  "fried-chicken": ".avif", // 炸鸡
  sushi: ".avif", // 寿司

  // 🥟 小吃类
  "soup-dumpling": ".avif", // 蟹黄包
  "chinese-crepe": ".webp", // 煎饼果子
  "pan-fried-dumpling": ".avif", // 生煎
  "fried-rice-cake": ".avif", // 炒年糕

  // 🍜 新增面食
  "dandan-noodles": ".webp", // 担担面
  "biangbiang-noodles": ".webp", // biangbiang面
  "beef-noodles": ".webp", // 牛肉面
  shaguo: ".jpg", // 砂锅
  malatang: "_compressed.webp", // 麻辣烫

  // 🥗 其他
  dumplings: ".avif", // 饺子
  baozi: ".avif", // 包子
  congee: ".webp", // 粥
  "rice-bowl": ".avif", // 盖浇饭
  "fried-rice": ".avif", // 炒饭

  // 🥘 家常菜
  "braised-pork": ".avif", // 红烧肉
  "sweet-sour-ribs": ".webp", // 糖醋排骨
  "kung-pao-chicken": ".webp", // 宫保鸡丁
  "yuxiang-pork": ".webp", // 鱼香肉丝
  "twice-cooked-pork": ".avif", // 回锅肉
  maoxuewang: ".webp", // 毛血旺
  "sichuan-boiled-fish": ".avif", // 水煮鱼
  "mapo-tofu": ".webp", // 麻婆豆腐
  roujiamo: ".webp", // 肉夹馍
  "yangrou-paomo": ".webp", // 羊肉泡馍
  "cold-noodles": ".avif", // 凉面
  "heluo-noodles": ".webp", // 饸烙面
  zhuanoodles: ".webp", // 拽面
  maoerduo: "_compressed.webp", // 猫耳朵
  ticun: ".webp", // 剔尖
  boboji: ".webp", // 钵钵鸡
  kaolengmian: "_compressed.webp", // 烤冷面
  jidanguanbing: ".webp", // 鸡蛋灌饼
  shouzhuabing: ".webp", // 手抓饼
  takoyaki: ".avif", // 章鱼小丸子
  oden: ".avif", // 关东煮
  "shaxian-snacks": "_compressed.webp", // 沙县小吃
  "braised-chicken": ".webp", // 黄焖鸡
  "pork-rice": ".webp", // 隆江猪脚饭

  // 🍜 日料
  ramen: ".avif", // 日式拉面
  "tonkotsu-ramen": ".avif", // 豚骨拉面
  "miso-ramen": ".avif", // 味噌拉面
  udon: ".avif", // 乌冬面
  soba: ".avif", // 荞麦面

  // 🍚 韩餐
  jajangmyeon: ".webp", // 韩式炸酱面
  naengmyeon: ".webp", // 韩式冷面
  "budae-jjigae": ".avif", // 部队火锅
  bibimbap: ".avif", // 石锅拌饭

  // 🍝 西餐
  pasta: ".avif", // 意面
  steak: ".avif", // 牛排
  sandwich: ".avif", // 三明治
  "hot-dog": ".avif", // 热狗
  burrito: ".avif", // 墨西哥卷饼

  // 🍛 日式
  "curry-rice": ".avif", // 咖喱饭

  // 🍚 快餐/粤菜
  "brisket-rice": ".webp", // 牛腩饭
  "char-siu-rice": ".webp", // 烧腊饭
  "char-siu-fan": ".webp", // 叉烧饭
  "clay-pot-rice": ".webp", // 煲仔饭
  "zhusheng-noodles": ".webp", // 竹升面
  "wonton-noodles": ".webp", // 云吞面
  "sampan-congee": ".webp", // 艇仔粥
  "rice-rolls": ".webp", // 肠粉
  "lotus-leaf-rice": ".webp", // 荷叶饭
  "char-kway-teow": ".webp", // 炒河粉
  "pork-belly-chicken": ".webp", // 猪肚鸡
  "white-cut-chicken": ".webp", // 白切鸡
  "salt-baked-chicken": ".webp", // 盐焗鸡
  "roast-goose": ".webp", // 烧鹅
};

// 获取本地图片路径
function getFoodImage(name: string): string {
  const ext = imageExtensions[name];
  if (ext) {
    return getRoutePrefix() + "/foot/" + name + ext;
  }
  // 如果没有本地图片，使用备用的随机图片
  const seed = Math.abs(hashCode(name)) % 10000;
  return `https://picsum.photos/seed/${seed}/800/600`;
}

// 简单的 hash 函数，用于生成稳定的随机索引
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// 食物数据列表
export const foodsData: FoodItem[] = [
  // 🍜 面食类 - 本地图片
  {
    name: "馄饨",
    category: "面食",
    image: getFoodImage("wonton-soup"),
    fallbackKeyword: "wonton soup",
  },
  {
    name: "拉面",
    category: "面食",
    image: getFoodImage("ramen-noodles"),
    fallbackKeyword: "ramen noodles",
  },
  {
    name: "烩面",
    category: "面食",
    image: getFoodImage("noodle-soup"),
    fallbackKeyword: "noodle soup",
  },
  {
    name: "热干面",
    category: "面食",
    image: getFoodImage("asian-noodles"),
    fallbackKeyword: "asian noodles",
  },
  {
    name: "刀削面",
    category: "面食",
    image: getFoodImage("hand-cut-noodles"),
    fallbackKeyword: "hand cut noodles",
  },
  {
    name: "油泼面",
    category: "面食",
    image: getFoodImage("oil-pull-noodles"),
    fallbackKeyword: "oil pull noodles",
  },
  {
    name: "炸酱面",
    category: "面食",
    image: getFoodImage("zhajiang-noodles"),
    fallbackKeyword: "zhajiang noodles",
  },
  {
    name: "炒面",
    category: "面食",
    image: getFoodImage("fried-noodles"),
    fallbackKeyword: "fried noodles",
  },
  {
    name: "重庆小面",
    category: "面食",
    image: getFoodImage("spicy-noodles"),
    fallbackKeyword: "spicy noodles",
  },
  {
    name: "米线",
    category: "面食",
    image: getFoodImage("rice-noodles"),
    fallbackKeyword: "rice noodles",
  },
  {
    name: "酸辣粉",
    category: "面食",
    image: getFoodImage("sour-spicy-noodles"),
    fallbackKeyword: "sour spicy noodles",
  },
  {
    name: "土豆粉",
    category: "面食",
    image: getFoodImage("potato-noodles"),
    fallbackKeyword: "potato noodles",
  },
  {
    name: "螺蛳粉",
    category: "面食",
    image: getFoodImage("luosifen"),
    fallbackKeyword: "luosifen",
  },
  {
    name: "凉皮",
    category: "面食",
    image: getFoodImage("liangpi"),
    fallbackKeyword: "liangpi",
  },

  // 🍲 川菜/热菜类
  {
    name: "川菜",
    category: "川菜",
    image: getFoodImage("chuan-food"),
    fallbackKeyword: "chuan food",
  },
  {
    name: "麻辣香锅",
    category: "川菜",
    image: getFoodImage("malaxiangguo"),
    fallbackKeyword: "malasiloguo",
  },
  {
    name: "火锅",
    category: "川菜",
    image: getFoodImage("hotpot"),
    fallbackKeyword: "hotpot",
  },
  {
    name: "酸菜鱼",
    category: "川菜",
    image: getFoodImage("suancaiyu"),
    fallbackKeyword: "suancaiyu",
  },
  {
    name: "烤串",
    category: "烧烤",
    image: getFoodImage("bbq-skewers"),
    fallbackKeyword: "bbq skewers",
  },
  {
    name: "烤鸭",
    category: "川菜",
    image: getFoodImage("roast-duck"),
    fallbackKeyword: "roast duck",
  },

  // 🍕 西餐类
  {
    name: "披萨",
    category: "西餐",
    image: getFoodImage("pizza"),
    fallbackKeyword: "pizza",
  },
  {
    name: "汉堡",
    category: "西餐",
    image: getFoodImage("burger"),
    fallbackKeyword: "burger",
  },
  {
    name: "炸鸡",
    category: "西餐",
    image: getFoodImage("fried-chicken"),
    fallbackKeyword: "fried chicken",
  },
  {
    name: "寿司",
    category: "日料",
    image: getFoodImage("sushi"),
    fallbackKeyword: "sushi",
  },

  // 🥟 小吃类
  {
    name: "蟹黄包",
    category: "小吃",
    image: getFoodImage("soup-dumpling"),
    fallbackKeyword: "soup dumpling",
  },
  {
    name: "煎饼果子",
    category: "小吃",
    image: getFoodImage("chinese-crepe"),
    fallbackKeyword: "chinese crepe",
  },
  {
    name: "生煎",
    category: "小吃",
    image: getFoodImage("pan-fried-dumpling"),
    fallbackKeyword: "pan fried dumpling",
  },
  {
    name: "炒年糕",
    category: "小吃",
    image: getFoodImage("fried-rice-cake"),
    fallbackKeyword: "fried rice cake",
  },

  // 🍜 新增面食
  {
    name: "担担面",
    category: "面食",
    image: getFoodImage("dandan-noodles"),
    fallbackKeyword: "dandan noodles",
  },
  {
    name: "biangbiang面",
    category: "面食",
    image: getFoodImage("biangbiang-noodles"),
    fallbackKeyword: "biangbiang noodles",
  },
  {
    name: "牛肉面",
    category: "面食",
    image: getFoodImage("beef-noodles"),
    fallbackKeyword: "beef noodles",
  },
  {
    name: "砂锅",
    category: "热菜",
    image: getFoodImage("shaguo"),
    fallbackKeyword: "casserole",
  },
  {
    name: "麻辣烫",
    category: "川菜",
    image: getFoodImage("malatang"),
    fallbackKeyword: "malatang",
  },

  // 🥗 其他
  {
    name: "饺子",
    category: "小吃",
    image: getFoodImage("dumplings"),
    fallbackKeyword: "dumplings",
  },
  {
    name: "包子",
    category: "小吃",
    image: getFoodImage("baozi"),
    fallbackKeyword: "baozi",
  },
  {
    name: "粥",
    category: "主食",
    image: getFoodImage("congee"),
    fallbackKeyword: "congee",
  },
  {
    name: "盖浇饭",
    category: "主食",
    image: getFoodImage("rice-bowl"),
    fallbackKeyword: "rice bowl",
  },
  {
    name: "炒饭",
    category: "主食",
    image: getFoodImage("fried-rice"),
    fallbackKeyword: "fried rice",
  },

  // 🥘 新增家常菜
  {
    name: "红烧肉",
    category: "家常菜",
    image: getFoodImage("braised-pork"),
    fallbackKeyword: "braised pork",
  },
  {
    name: "糖醋排骨",
    category: "家常菜",
    image: getFoodImage("sweet-sour-ribs"),
    fallbackKeyword: "sweet sour ribs",
  },
  {
    name: "宫保鸡丁",
    category: "川菜",
    image: getFoodImage("kung-pao-chicken"),
    fallbackKeyword: "kung pao chicken",
  },
  {
    name: "鱼香肉丝",
    category: "川菜",
    image: getFoodImage("yuxiang-pork"),
    fallbackKeyword: "yuxiang pork",
  },
  {
    name: "回锅肉",
    category: "川菜",
    image: getFoodImage("twice-cooked-pork"),
    fallbackKeyword: "twice cooked pork",
  },
  {
    name: "毛血旺",
    category: "川菜",
    image: getFoodImage("maoxuewang"),
    fallbackKeyword: "maoxuewang",
  },
  {
    name: "水煮鱼",
    category: "川菜",
    image: getFoodImage("sichuan-boiled-fish"),
    fallbackKeyword: "sichuan boiled fish",
  },
  {
    name: "麻婆豆腐",
    category: "川菜",
    image: getFoodImage("mapo-tofu"),
    fallbackKeyword: "mapo tofu",
  },
  {
    name: "肉夹馍",
    category: "小吃",
    image: getFoodImage("roujiamo"),
    fallbackKeyword: "roujiamo",
  },
  {
    name: "羊肉泡馍",
    category: "西北",
    image: getFoodImage("yangrou-paomo"),
    fallbackKeyword: "yangrou paomo",
  },
  {
    name: "凉面",
    category: "面食",
    image: getFoodImage("cold-noodles"),
    fallbackKeyword: "cold noodles",
  },
  {
    name: "饸烙面",
    category: "面食",
    image: getFoodImage("heluo-noodles"),
    fallbackKeyword: "heluo noodles",
  },
  {
    name: "拽面",
    category: "面食",
    image: getFoodImage("zhuanoodles"),
    fallbackKeyword: "zhuanoodles",
  },
  {
    name: "猫耳朵",
    category: "面食",
    image: getFoodImage("maoerduo"),
    fallbackKeyword: "maoerduo",
  },
  {
    name: "剔尖",
    category: "面食",
    image: getFoodImage("ticun"),
    fallbackKeyword: "ticun",
  },
  {
    name: "钵钵鸡",
    category: "小吃",
    image: getFoodImage("boboji"),
    fallbackKeyword: "boboji",
  },
  {
    name: "烤冷面",
    category: "小吃",
    image: getFoodImage("kaolengmian"),
    fallbackKeyword: "kaolengmian",
  },
  {
    name: "鸡蛋灌饼",
    category: "小吃",
    image: getFoodImage("jidanguanbing"),
    fallbackKeyword: "jidanguanbing",
  },
  {
    name: "手抓饼",
    category: "小吃",
    image: getFoodImage("shouzhuabing"),
    fallbackKeyword: "shouzhuabing",
  },
  {
    name: "章鱼小丸子",
    category: "小吃",
    image: getFoodImage("takoyaki"),
    fallbackKeyword: "takoyaki",
  },
  {
    name: "关东煮",
    category: "小吃",
    image: getFoodImage("oden"),
    fallbackKeyword: "oden",
  },
  {
    name: "沙县小吃",
    category: "快餐",
    image: getFoodImage("shaxian-snacks"),
    fallbackKeyword: "shaxian snacks",
  },
  {
    name: "黄焖鸡",
    category: "快餐",
    image: getFoodImage("braised-chicken"),
    fallbackKeyword: "braised chicken",
  },
  {
    name: "隆江猪脚饭",
    category: "快餐",
    image: getFoodImage("pork-rice"),
    fallbackKeyword: "pork rice",
  },
  {
    name: "日式拉面",
    category: "日料",
    image: getFoodImage("ramen"),
    fallbackKeyword: "ramen",
  },
  {
    name: "豚骨拉面",
    category: "日料",
    image: getFoodImage("tonkotsu-ramen"),
    fallbackKeyword: "tonkotsu ramen",
  },
  {
    name: "味噌拉面",
    category: "日料",
    image: getFoodImage("miso-ramen"),
    fallbackKeyword: "miso ramen",
  },
  {
    name: "乌冬面",
    category: "日料",
    image: getFoodImage("udon"),
    fallbackKeyword: "udon",
  },
  {
    name: "荞麦面",
    category: "日料",
    image: getFoodImage("soba"),
    fallbackKeyword: "soba",
  },
  {
    name: "韩式炸酱面",
    category: "韩餐",
    image: getFoodImage("jajangmyeon"),
    fallbackKeyword: "jajangmyeon",
  },
  {
    name: "韩式冷面",
    category: "韩餐",
    image: getFoodImage("naengmyeon"),
    fallbackKeyword: "naengmyeon",
  },
  {
    name: "部队火锅",
    category: "韩餐",
    image: getFoodImage("budae-jjigae"),
    fallbackKeyword: "budae jjigae",
  },
  {
    name: "石锅拌饭",
    category: "韩餐",
    image: getFoodImage("bibimbap"),
    fallbackKeyword: "bibimbap",
  },
  {
    name: "意面",
    category: "西餐",
    image: getFoodImage("pasta"),
    fallbackKeyword: "pasta",
  },
  {
    name: "牛排",
    category: "西餐",
    image: getFoodImage("steak"),
    fallbackKeyword: "steak",
  },
  {
    name: "三明治",
    category: "西餐",
    image: getFoodImage("sandwich"),
    fallbackKeyword: "sandwich",
  },
  {
    name: "热狗",
    category: "西餐",
    image: getFoodImage("hot-dog"),
    fallbackKeyword: "hot dog",
  },
  {
    name: "墨西哥卷饼",
    category: "西餐",
    image: getFoodImage("burrito"),
    fallbackKeyword: "burrito",
  },
  {
    name: "咖喱饭",
    category: "日式",
    image: getFoodImage("curry-rice"),
    fallbackKeyword: "curry rice",
  },
  {
    name: "牛腩饭",
    category: "快餐",
    image: getFoodImage("brisket-rice"),
    fallbackKeyword: "brisket rice",
  },
  {
    name: "烧腊饭",
    category: "粤菜",
    image: getFoodImage("char-siu-rice"),
    fallbackKeyword: "char siu rice",
  },
  {
    name: "叉烧饭",
    category: "粤菜",
    image: getFoodImage("char-siu-fan"),
    fallbackKeyword: "char siu fan",
  },
  {
    name: "煲仔饭",
    category: "粤菜",
    image: getFoodImage("clay-pot-rice"),
    fallbackKeyword: "clay pot rice",
  },
  {
    name: "竹升面",
    category: "粤菜",
    image: getFoodImage("zhusheng-noodles"),
    fallbackKeyword: "zhusheng noodles",
  },
  {
    name: "云吞面",
    category: "粤菜",
    image: getFoodImage("wonton-noodles"),
    fallbackKeyword: "wonton noodles",
  },
  {
    name: "艇仔粥",
    category: "粤菜",
    image: getFoodImage("sampan-congee"),
    fallbackKeyword: "sampan congee",
  },
  {
    name: "肠粉",
    category: "粤菜",
    image: getFoodImage("rice-rolls"),
    fallbackKeyword: "rice rolls",
  },
  {
    name: "荷叶饭",
    category: "粤菜",
    image: getFoodImage("lotus-leaf-rice"),
    fallbackKeyword: "lotus leaf rice",
  },
  {
    name: "炒河粉",
    category: "粤菜",
    image: getFoodImage("char-kway-teow"),
    fallbackKeyword: "char kway teow",
  },
  {
    name: "猪肚鸡",
    category: "粤菜",
    image: getFoodImage("pork-belly-chicken"),
    fallbackKeyword: "pork belly chicken",
  },
  {
    name: "白切鸡",
    category: "粤菜",
    image: getFoodImage("white-cut-chicken"),
    fallbackKeyword: "white cut chicken",
  },
  {
    name: "盐焗鸡",
    category: "粤菜",
    image: getFoodImage("salt-baked-chicken"),
    fallbackKeyword: "salt baked chicken",
  },
  {
    name: "烧鹅",
    category: "粤菜",
    image: getFoodImage("roast-goose"),
    fallbackKeyword: "roast goose",
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
