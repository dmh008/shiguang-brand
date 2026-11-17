const SETTINGS_KEY = "sg_mp_settings";

function getSettings() {
  try {
    return wx.getStorageSync(SETTINGS_KEY) || {};
  } catch (e) {
    return {};
  }
}

function saveSettings(settings) {
  try {
    wx.setStorageSync(SETTINGS_KEY, settings || {});
  } catch (e) {
    // ignore quota / private mode
  }
}

module.exports = { getSettings, saveSettings, SETTINGS_KEY };
