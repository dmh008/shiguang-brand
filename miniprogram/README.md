# 食光烙记 · 微信小程序（原生）

原生微信小程序客户端，对齐仓库内 Go API（`/api/v1/diet-records`、`/api/v1/recipes`、`/api/v1/meal-plans`、`/api/v1/auth/login`）。默认 **mock**，不需 AppID 密钥或后端即可在开发者工具预览。

方案选择见 Project 文档 `docs/wechat-miniprogram-plan.md`（原生小程序，不引入 Taro/uni-app）。

## 导入路径

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. **导入项目** → 目录选择本仓库的 **`miniprogram/`**（含 `project.config.json` 的这一层）
3. AppID：`project.config.json` 中默认为占位 `touristappid`（测试号 / 游客模式）。正式预览请改成你的小程序 AppID
4. 详情 → 本地设置：勾选「不校验合法域名…」（连本地 `server-go :9090` 时需要）

## 预览

- 打开后默认四个 Tab：**今日 / 营养 / 计划 / 我的**
- 顶部横幅显示「演示数据（mock）」即本地数据；连上后端后变为「已连接后端」
- 「我的」页可改 API Base URL、关闭强制 mock、登录写入 JWT

## 对接真实后端

```text
1. 本机或可访问环境启动 Go API（仓库根目录 pnpm dev 或 server-go 单独启动，默认 :9090）
2. 小程序「我的」：
   - API Base URL = http://127.0.0.1:9090（真机请改为局域网 IP 或已备案 HTTPS 域名）
   - 关闭「强制使用 mock」
   - 使用已有账号登录，或粘贴 JWT
3. 公众平台配置 request 合法域名（正式环境）
```

## 目录

```text
miniprogram/
├── app.js / app.json / app.wxss
├── project.config.json   # appid 占位 touristappid
├── config.js             # 默认 forceMock: true
├── utils/api.js          # 请求 + mock 回落
├── utils/mock.js
└── pages/                # 今日、营养、计划、我的、记一餐、菜谱/计划详情
```

## 与主 App 的关系

不引入 Taro/uni-app；Expo `client/` 仍是主客户端。本目录独立运行，契约对齐 `client/services/api`，便于后续加深对接（库存、烹饪闭环等）。
