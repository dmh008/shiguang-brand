const { todayStr } = require("./date");

function mockDietRecords(date = todayStr()) {
  return [
    {
      id: 1001,
      meal_type: "早餐",
      food_name: "燕麦牛奶杯",
      amount: "1 份",
      calories: 320,
      protein: 14,
      carbs: 42,
      fat: 9,
      recorded_at: `${date}T08:10:00`,
      image_url: null,
    },
    {
      id: 1002,
      meal_type: "午餐",
      food_name: "番茄炒蛋配米饭",
      amount: "1 碗",
      calories: 520,
      protein: 22,
      carbs: 68,
      fat: 16,
      recorded_at: `${date}T12:30:00`,
      image_url: null,
    },
    {
      id: 1003,
      meal_type: "加餐",
      food_name: "苹果",
      amount: "1 个",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      recorded_at: `${date}T16:00:00`,
      image_url: null,
    },
  ];
}

function mockRecipes() {
  return {
    items: [
      {
        id: 1,
        title: "蒜香西兰花",
        description: "快手清炒，临期蔬菜优先。",
        image_url: null,
        cook_time: 15,
        difficulty: "简单",
        calories: 180,
        protein: 8,
        carbs: 12,
        fat: 10,
        category: "素菜",
        tags: ["临期救援", "快手"],
        steps: ["焯水西兰花", "蒜末爆香", "大火快炒调味"],
        ingredients: [
          { name: "西兰花", amount: "300g" },
          { name: "蒜", amount: "3 瓣" },
        ],
        quality_status: "estimated",
        nutrition_basis: "ingredient_estimate",
        nutrition_is_estimated: true,
      },
      {
        id: 2,
        title: "番茄鸡蛋面",
        description: "库存常见食材一锅出。",
        image_url: null,
        cook_time: 20,
        difficulty: "简单",
        calories: 450,
        protein: 18,
        carbs: 58,
        fat: 14,
        category: "主食",
        tags: ["家常"],
        steps: ["煮面", "炒番茄鸡蛋", "浇汁装盘"],
        ingredients: [
          { name: "挂面", amount: "100g" },
          { name: "番茄", amount: "2 个" },
          { name: "鸡蛋", amount: "2 个" },
        ],
        quality_status: "trusted",
        nutrition_basis: "source",
        nutrition_is_estimated: false,
      },
      {
        id: 3,
        title: "清蒸鲈鱼",
        description: "低油蛋白，适合晚餐。",
        image_url: null,
        cook_time: 25,
        difficulty: "中等",
        calories: 280,
        protein: 32,
        carbs: 2,
        fat: 15,
        category: "海鲜",
        tags: ["高蛋白"],
        steps: ["处理鱼", "铺姜葱", "蒸 8–10 分钟", "淋热油葱油"],
        ingredients: [
          { name: "鲈鱼", amount: "1 条" },
          { name: "姜", amount: "适量" },
          { name: "葱", amount: "适量" },
        ],
        quality_status: "trusted",
        nutrition_basis: "source",
        nutrition_is_estimated: false,
      },
    ],
    total: 3,
    nextCursor: null,
  };
}

function mockMealPlans() {
  const day = todayStr();
  return [
    {
      id: "plan-demo-1",
      title: "本周轻量家常",
      startDate: day,
      endDate: day,
      status: "active",
      source: "manual",
      version: 1,
      items: [
        {
          id: "item-1",
          planId: "plan-demo-1",
          plannedDate: day,
          mealType: "午餐",
          title: "番茄鸡蛋面",
          recipeId: 2,
          recipeAvailable: true,
          cookTime: 20,
          difficulty: "简单",
          nutrition: { calories: 450, protein: 18, carbs: 58, fat: 14 },
          status: "planned",
          version: 1,
        },
        {
          id: "item-2",
          planId: "plan-demo-1",
          plannedDate: day,
          mealType: "晚餐",
          title: "蒜香西兰花",
          recipeId: 1,
          recipeAvailable: true,
          cookTime: 15,
          difficulty: "简单",
          nutrition: { calories: 180, protein: 8, carbs: 12, fat: 10 },
          status: "planned",
          version: 1,
        },
      ],
    },
  ];
}

let localRecords = null;

function getLocalRecords(date) {
  if (!localRecords) localRecords = mockDietRecords(date);
  return localRecords.filter((r) => String(r.recorded_at || "").startsWith(date) || !date);
}

function addLocalRecord(input) {
  if (!localRecords) localRecords = mockDietRecords(todayStr());
  const id = Date.now();
  const row = {
    id,
    meal_type: input.meal_type || "加餐",
    food_name: input.food_name || "未命名",
    amount: input.amount || "1 份",
    calories: Number(input.calories) || 0,
    protein: Number(input.protein) || 0,
    carbs: Number(input.carbs) || 0,
    fat: Number(input.fat) || 0,
    recorded_at: input.recorded_at || new Date().toISOString(),
    image_url: null,
  };
  localRecords = [row, ...localRecords];
  return row;
}

function summarizeNutrition(records) {
  return records.reduce(
    (acc, r) => {
      acc.calories += Number(r.calories) || 0;
      acc.protein += Number(r.protein) || 0;
      acc.carbs += Number(r.carbs) || 0;
      acc.fat += Number(r.fat) || 0;
      acc.count += 1;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
  );
}

module.exports = {
  mockDietRecords,
  mockRecipes,
  mockMealPlans,
  getLocalRecords,
  addLocalRecord,
  summarizeNutrition,
};
