const api = require("../../utils/api");

Page({
  data: {
    tab: "plans",
    loading: true,
    source: "mock",
    modeText: "演示数据（mock）",
    plans: [],
    recipes: [],
  },

  onShow() {
    this.load();
  },

  onPullDownRefresh() {
    this.load().finally(() => wx.stopPullDownRefresh());
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.tab) return;
    this.setData({ tab });
    this.load();
  },

  async load() {
    this.setData({ loading: true });
    if (this.data.tab === "plans") {
      const { data, source } = await api.listMealPlans();
      const plans = (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        itemCount: (p.items && p.items.length) || 0,
      }));
      this.setData({
        plans,
        loading: false,
        source,
        modeText: api.modeLabel(source),
      });
    } else {
      const { data, source } = await api.listRecipes("?pageSize=30");
      const recipes = Array.isArray(data) ? data : data && data.items ? data.items : [];
      this.setData({
        recipes,
        loading: false,
        source,
        modeText: api.modeLabel(source),
      });
    }
  },

  openPlan(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/meal-plan-detail/index?id=${encodeURIComponent(id)}` });
  },

  openRecipe(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` });
  },
});
