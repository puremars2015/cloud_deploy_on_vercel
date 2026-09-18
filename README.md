# cloud_deploy_on_vercel

示範在 vercel 上部署。

## 內容

- `index.html` — Hello World 風格的首頁，純 HTML / CSS / JS，不需要建置流程。
- `vercel.json` — Vercel 設定：乾淨網址（`/about` 而非 `/about.html`）與基本安全性標頭。

## 本機預覽

直接用瀏覽器開啟 `index.html`，或啟動一個簡易伺服器：

```bash
python3 -m http.server 3000
# 瀏覽 http://localhost:3000
```

## 部署到 Vercel（Git 整合）

用 Vercel 的 Git 整合，push 之後就會自動部署，不需要自己跑 CLI。

1. 到 <https://vercel.com/new> 登入（用 GitHub 帳號登入最省事）。
2. 在 **Import Git Repository** 找到 `puremars2015/cloud_deploy_on_vercel` 按 **Import**。
   - 沒看到這個 repo 的話，點 **Adjust GitHub App Permissions**，把 Vercel 的存取權限加到這個 repo。
3. 設定頁面保持預設即可：
   - **Framework Preset**：`Other`
   - **Root Directory**：`./`
   - **Build Command**、**Output Directory**、**Install Command**：全部留空
     （本專案是純靜態網站，Vercel 會直接服務根目錄）
4. 按 **Deploy**，約十幾秒後會拿到 `https://<專案名>.vercel.app`。

### 之後的流程

- push 到 `main` → 自動部署到正式站（Production）。
- 開 PR 或 push 到其他分支 → 自動產生 Preview 部署，Vercel bot 會把預覽網址留言在 PR 上。

### 自訂網域（選用）

專案頁 → **Settings** → **Domains** → 輸入網域 → 依畫面指示在你的 DNS 服務商加上
`A` 或 `CNAME` 紀錄，驗證通過後 Vercel 會自動簽發 HTTPS 憑證。

### 環境變數（選用）

專案頁 → **Settings** → **Environment Variables**，可分別設定 Production / Preview /
Development。純靜態頁面用不到，未來加上 API Routes 或 Serverless Function 時才需要。
