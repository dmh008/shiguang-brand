const api = require("../../utils/api");

Page({
  data: {
    apiBaseUrl: "",
    token: "",
    forceMock: true,
    identifier: "",
    password: "",
  },

  onShow() {
    const s = getApp().getSettings();
    this.setData({
      apiBaseUrl: s.apiBaseUrl || "",
      token: s.token || "",
      forceMock: !!s.forceMock,
    });
  },

  onBaseUrl(e) {
    this.setData({ apiBaseUrl: e.detail.value });
  },
  onToken(e) {
    this.setData({ token: e.detail.value });
  },
  onForceMock(e) {
    this.setData({ forceMock: e.detail.value });
  },
  onId(e) {
    this.setData({ identifier: e.detail.value });
  },
  onPassword(e) {
    this.setData({ password: e.detail.value });
  },

  save() {
    getApp().updateSettings({
      apiBaseUrl: (this.data.apiBaseUrl || "").trim(),
      token: (this.data.token || "").trim(),
      forceMock: !!this.data.forceMock,
    });
    wx.showToast({ title: "已保存", icon: "success" });
  },

  async doLogin() {
    const identifier = (this.data.identifier || "").trim();
    const password = this.data.password || "";
    if (!identifier || !password) {
      wx.showToast({ title: "请填写账号密码", icon: "none" });
      return;
    }
    // Temporarily allow live login if base URL set
    if (this.data.forceMock && !this.data.apiBaseUrl) {
      wx.showToast({ title: "mock 模式写入演示 token", icon: "none" });
    }
    getApp().updateSettings({
      apiBaseUrl: (this.data.apiBaseUrl || "").trim(),
      forceMock: !!this.data.forceMock,
    });
    const { data, source } = await api.login(identifier, password);
    const token = data && (data.token || data.accessToken || data.access_token);
    if (!token) {
      wx.showToast({ title: "登录响应无 token", icon: "none" });
      return;
    }
    getApp().updateSettings({ token });
    this.setData({ token });
    wx.showToast({ title: source === "api" ? "登录成功" : "已写入 mock token", icon: "success" });
  },

  clearAuth() {
    getApp().updateSettings({ token: "" });
    this.setData({ token: "" });
    wx.showToast({ title: "已清除", icon: "none" });
  },
});
