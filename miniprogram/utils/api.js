/**
 * Thin client aligned with client/services/api paths against server-go :9090.
 * Falls back to mock when forceMock, empty base URL, or network/auth failure.
 */
const mock = require("./mock");
const { todayStr } = require("./date");

function appSettings() {
  const app = getApp();
  return app && app.getSettings ? app.getSettings() : { apiBaseUrl: "", forceMock: true, token: "" };
}

function useMock() {
  const s = appSettings();
  return s.forceMock || !s.apiBaseUrl;
}

function apiUrl(path) {
  const base = (appSettings().apiBaseUrl || "").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function request(path, options = {}) {
  const s = appSettings();
  if (useMock()) {
    return Promise.reject(new Error("MOCK_MODE"));
  }
  const header = {
    "Content-Type": "application/json",
    ...(options.header || {}),
  };
  if (s.token) header.Authorization = `Bearer ${s.token}`;

  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl(path),
      method: options.method || "GET",
      data: options.data,
      header,
      timeout: options.timeoutMs || 15000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          const err = new Error((res.data && (res.data.message || res.data.error)) || `HTTP ${res.statusCode}`);
          err.status = res.statusCode;
          err.body = res.data;
          reject(err);
        }
      },
      fail(err) {
        reject(err || new Error("network fail"));
      },
    });
  });
}

async function withFallback(live, fallback) {
  if (useMock()) return { data: fallback(), source: "mock" };
  try {
    const data = await live();
    return { data, source: "api" };
  } catch (e) {
    return { data: fallback(), source: "mock", error: e };
  }
}

function listDietRecords(date = todayStr()) {
  return withFallback(
    () => request(`/api/v1/diet-records?date=${encodeURIComponent(date)}`),
    () => mock.getLocalRecords(date),
  );
}

function createDietRecord(input) {
  return withFallback(
    () =>
      request("/api/v1/diet-records", {
        method: "POST",
        data: input,
      }),
    () => mock.addLocalRecord(input),
  );
}

function listRecipes(query = "?pageSize=30") {
  return withFallback(
    () => request(`/api/v1/recipes${query}`),
    () => mock.mockRecipes(),
  );
}

function getRecipe(id) {
  return withFallback(
    () => request(`/api/v1/recipes/${id}`),
    () => {
      const page = mock.mockRecipes();
      const found = (page.items || []).find((r) => String(r.id) === String(id));
      if (!found) throw new Error("recipe not found in mock");
      return found;
    },
  );
}

function listMealPlans() {
  return withFallback(
    () => request("/api/v1/meal-plans?includeArchived=false"),
    () => mock.mockMealPlans(),
  );
}

function getMealPlan(id) {
  return withFallback(
    () => request(`/api/v1/meal-plans/${encodeURIComponent(id)}`),
    () => {
      const plans = mock.mockMealPlans();
      const found = plans.find((p) => p.id === id) || plans[0];
      return found;
    },
  );
}

function login(identifier, password) {
  return withFallback(
    () =>
      request("/api/v1/auth/login", {
        method: "POST",
        data: { identifier, password },
      }),
    () => ({
      token: "mock-token",
      user: { id: 0, username: identifier || "演示用户" },
    }),
  );
}

function modeLabel(source) {
  if (source === "api") return "已连接后端";
  return "演示数据（mock）";
}

module.exports = {
  useMock,
  listDietRecords,
  createDietRecord,
  listRecipes,
  getRecipe,
  listMealPlans,
  getMealPlan,
  login,
  modeLabel,
  summarizeNutrition: mock.summarizeNutrition,
};
