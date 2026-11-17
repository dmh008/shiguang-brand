const api = require("../../utils/api");

Page({
  data: {
    mealTypes: ["早餐", "午餐", "晚餐", "加餐"],
    mealIndex: 1,
    food_name: "",
    amount: "1 份",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    submitting: false,
  },

  onMeal(e) {
    this.setData({ mealIndex: Number(e.detail.value) });
  },
  onFood(e) {
    this.setData({ food_name: e.detail.value });
  },
  onAmount(e) {
    this.setData({ amount: e.detail.value });
  },
  onCal(e) {
    this.setData({ calories: e.detail.value });
  },
  onP(e) {
    this.setData({ protein: e.detail.value });
  },
  onC(e) {
    this.setData({ carbs: e.detail.value });
  },
  onF(e) {
    this.setData({ fat: e.detail.value });
  },

  async submit() {
    if (this.data.submitting) return;
    const food_name = (this.data.food_name || "").trim();
    if (!food_name) {
      wx.showToast({ title: "请填写食物名称", icon: "none" });
      return;
    }
    this.setData({ submitting: true });
    const input = {
      meal_type: this.data.mealTypes[this.data.mealIndex],
      food_name,
      amount: this.data.amount || "1 份",
      calories: this.data.calories === "" ? null : Number(this.data.calories),
      protein: this.data.protein === "" ? null : Number(this.data.protein),
      carbs: this.data.carbs === "" ? null : Number(this.data.carbs),
      fat: this.data.fat === "" ? null : Number(this.data.fat),
      recorded_at: new Date().toISOString(),
      image_url: null,
    };
    try {
      const { source } = await api.createDietRecord(input);
      wx.showToast({
        title: source === "api" ? "已同步后端" : "已写入本地演示",
        icon: "success",
      });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 500);
    } catch (e) {
      wx.showToast({ title: "保存失败", icon: "none" });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
