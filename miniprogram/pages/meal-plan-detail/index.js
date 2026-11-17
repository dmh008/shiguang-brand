const api = require("../../utils/api");

Page({
  data: {
    plan: null,
    items: [],
    source: "mock",
    modeText: "演示数据（mock）",
  },

  onLoad(query) {
    this.planId = query.id ? decodeURIComponent(query.id) : "";
    this.load();
  },

  async load() {
    const { data, source } = await api.getMealPlan(this.planId);
    const items = (data && data.items) || [];
    this.setData({
      plan: data,
      items: items.map((it) => ({
        ...it,
        nutrition: it.nutrition || {},
      })),
      source,
      modeText: api.modeLabel(source),
    });
  },

  openRecipe(e) {
    const rid = e.currentTarget.dataset.rid;
    if (!rid) return;
    wx.navigateTo({ url: `/pages/recipe-detail/index?id=${rid}` });
  },
});
