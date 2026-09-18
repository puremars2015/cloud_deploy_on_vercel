# cloud_deploy_on_vercel

示範在 vercel 上部署：靜態首頁 + Serverless API + Neon Postgres 留言板。

## 內容

```
├── index.html          → /              首頁（靜態 HTML／CSS／JS，無建置流程）
├── api/messages.js     → /api/messages  留言板 API（GET 列出最新 20 筆、POST 新增）
├── db/schema.sql                        資料表定義，到 Neon 執行一次
├── vercel.json                          乾淨網址與安全性標頭
└── package.json                         唯一相依：@neondatabase/serverless
```

## 部署步驟

### 1. 匯入專案到 Vercel

1. 到 <https://vercel.com/new> 登入（用 GitHub 帳號登入最省事）。
2. 在 **Import Git Repository** 找到 `puremars2015/cloud_deploy_on_vercel` 按 **Import**。
   - 沒看到這個 repo 的話，到 <https://github.com/apps/vercel/installations/select_target>
     把 Vercel 的存取權限加到這個 repo。
3. 設定保持預設：**Framework Preset** 選 `Other`，Build Command／Output Directory／
   Install Command 全部留空。Vercel 會服務根目錄的靜態檔，並自動把 `api/` 編譯成
   Serverless Function。
4. 按 **Deploy**。

### 2. 接上 Neon Postgres

1. 專案頁 → **Storage** 分頁 → **Create Database** → 選 **Neon**（Serverless Postgres）。
2. 依畫面建立資料庫並連結到這個專案。連結後 Vercel 會自動把 `DATABASE_URL` 等
   環境變數注入專案，**不需要手動設定**。
3. 到 Neon Dashboard 的 **SQL Editor**，貼上 `db/schema.sql` 的內容執行一次，建立
   `messages` 資料表。
4. 回到 Vercel 的 **Deployments**，對最新一筆部署點 **Redeploy**，讓新的環境變數生效。

完成後開首頁就能留言，資料會存進 Neon。

### 之後的流程

- push 到 `main` → 自動部署到正式站（Production）。
- 開 PR 或 push 到其他分支 → 自動產生 Preview 部署，網址會留言在 PR 上。

## API

### `GET /api/messages`

回傳最新 20 筆留言。

```json
{ "messages": [ { "id": 2, "name": "小明", "body": "哈囉", "created_at": "2026-09-18T02:59:43.479Z" } ] }
```

### `POST /api/messages`

```bash
curl -X POST https://<你的站>.vercel.app/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"小明","body":"哈囉"}'
```

成功回 `201` 與新增的那筆資料。名字上限 40 字、留言上限 500 字，空白或超長回 `400`。

## 本機開發

```bash
npm install
cp .env.example .env          # 填入 Neon 連線字串
npx vercel dev                # 同時跑靜態頁與 /api，預設 http://localhost:3000
```

`vercel dev` 會一起跑前端和 Serverless Function。只想看畫面的話，
`python3 -m http.server 3000` 也可以，但留言板會因為沒有 `/api` 而顯示錯誤。

## 安全性備註

- SQL 全部走 `@neondatabase/serverless` 的標籤樣板，會編譯成參數化查詢，
  使用者輸入不會被拼進 SQL。
- 前端用 `textContent` 渲染留言，內容不會被當成 HTML 執行。
- 目前**沒有**防灌水機制（rate limiting）。真的要公開使用，建議加上
  Upstash Redis 做 IP 層級的限流，或加上身分驗證。
