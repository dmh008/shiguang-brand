const defaults = require("./config");
const { getSettings, saveSettings } = require("./utils/storage");

App({
  globalData: {
    settings: null,
    user: null,
  },

  onLaunch() {
    const stored = getSettings();
    this.globalData.settings = {
      apiBaseUrl: stored.apiBaseUrl || defaults.apiBaseUrl || "",
      forceMock: typeof stored.forceMock === "boolean" ? stored.forceMock : defaults.forceMock,
      token: stored.token || "",
      appName: defaults.appName,
    };
    if (!stored || Object.keys(stored).length === 0) {
      saveSettings(this.globalData.settings);
    }
  },

  getSettings() {
    return this.globalData.settings || { ...defaults, token: "" };
  },

  updateSettings(patch) {
    const next = { ...this.getSettings(), ...patch };
    this.globalData.settings = next;
    saveSettings(next);
    return next;
  },
});
