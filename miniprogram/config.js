/**
 * Runtime config for the WeChat mini program.
 * Defaults to mock mode so the project opens in 微信开发者工具 without secrets.
 *
 * Aligns with Expo client: EXPO_PUBLIC_BACKEND_BASE_URL → Go API :9090
 * Endpoints mirror client/services/api (diet, health, recipes, meal-plans, auth).
 */
const DEFAULTS = {
  /** Empty or unset → mock. Set to e.g. https://api.example.com or http://127.0.0.1:9090 */
  apiBaseUrl: "",
  /** When true, never hit the network (even if apiBaseUrl is set). */
  forceMock: true,
  /** App display name (must match product naming: 食光烙记). */
  appName: "食光烙记",
};

module.exports = DEFAULTS;
