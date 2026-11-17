const api = require("../../utils/api");
const { todayStr, mealLabel } = require("../../utils/date");

Page({
  data: {
    loading: true,
    source: "mock",
    modeText: "演示数据（mock）",
    stats: [],
    byMeal: [],
  },

  onShow() {
    this.load();
  },

  onPullDownRefresh() {
    this.load().finally(() => wx.stopPullDownRefresh());
  },

  async load() {
    this.setData({ loading: true });
    const { data, source } = await api.listDietRecords(todayStr());
    const records = Array.isArray(data) ? data : [];
    const sum = api.summarizeNutrition(records);
    const groups = {};
    records.forEach((r) => {
      const key = mealLabel(r.meal_type);
      if (!groups[key]) groups[key] = { meal: key, count: 0, calories: 0, protein: 0, carbs: 0, fat: 0 };
      groups[key].count += 1;
      groups[key].calories += Number(r.calories) || 0;
      groups[key].protein += Number(r.protein) || 0;
      groups[key].carbs += Number(r.carbs) || 0;
      groups[key].fat += Number(r.fat) || 0;
    });
    this.setData({
      loading: false,
      source,
      modeText: api.modeLabel(source),
      stats: [
        { key: "cal", label: "热量 kcal", value: Math.round(sum.calories) },
        { key: "p", label: "蛋白质 g", value: Math.round(sum.protein * 10) / 10 },
        { key: "c", label: "碳水 g", value: Math.round(sum.carbs * 10) / 10 },
        { key: "f", label: "脂肪 g", value: Math.round(sum.fat * 10) / 10 },
      ],
      byMeal: Object.values(groups).map((g) => ({
        ...g,
        calories: Math.round(g.calories),
        protein: Math.round(g.protein * 10) / 10,
        carbs: Math.round(g.carbs * 10) / 10,
        fat: Math.round(g.fat * 10) / 10,
      })),
    });
  },
});
