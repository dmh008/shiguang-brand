const api = require("../../utils/api");
const { todayStr, formatTime, mealLabel } = require("../../utils/date");

Page({
  data: {
    today: todayStr(),
    records: [],
    summary: { calories: 0, count: 0 },
    loading: true,
    source: "mock",
    modeText: "演示数据（mock）",
  },

  onShow() {
    this.load();
  },

  onPullDownRefresh() {
    this.load().finally(() => wx.stopPullDownRefresh());
  },

  async load() {
    this.setData({ loading: true, today: todayStr() });
    const { data, source } = await api.listDietRecords(this.data.today);
    const records = (Array.isArray(data) ? data : []).map((r) => ({
      ...r,
      mealLabel: mealLabel(r.meal_type),
      timeLabel: formatTime(r.recorded_at),
    }));
    const nutrition = api.summarizeNutrition(records);
    this.setData({
      records,
      summary: { calories: Math.round(nutrition.calories), count: nutrition.count },
      loading: false,
      source,
      modeText: api.modeLabel(source),
    });
  },

  goLog() {
    wx.navigateTo({ url: "/pages/diet-log/index" });
  },
});
