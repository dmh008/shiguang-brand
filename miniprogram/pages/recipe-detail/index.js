const api = require("../../utils/api");

Page({
  data: {
    recipe: null,
    source: "mock",
    modeText: "演示数据（mock）",
  },

  onLoad(query) {
    this.recipeId = query.id;
    this.load();
  },

  async load() {
    if (!this.recipeId) return;
    try {
      const { data, source } = await api.getRecipe(this.recipeId);
      this.setData({
        recipe: data,
        source,
        modeText: api.modeLabel(source),
      });
    } catch (e) {
      wx.showToast({ title: "菜谱加载失败", icon: "none" });
    }
  },

  async logFromRecipe() {
    const r = this.data.recipe;
    if (!r) return;
    await api.createDietRecord({
      meal_type: "午餐",
      food_name: r.title,
      amount: "1 份",
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      recorded_at: new Date().toISOString(),
      image_url: null,
    });
    wx.showToast({ title: "已记入今日", icon: "success" });
  },
});
