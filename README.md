# cloud_deploy_on_vercel

示範在 vercel 上部署。

## 內容

- `index.html` — Hello World 風格的首頁，純 HTML / CSS / JS，不需要建置流程。

## 本機預覽

直接用瀏覽器開啟 `index.html`，或啟動一個簡易伺服器：

```bash
python3 -m http.server 3000
# 瀏覽 http://localhost:3000
```

## 部署到 Vercel

把這個 repo 匯入 Vercel，Framework Preset 選 **Other**，Build Command 與
Output Directory 都留空即可；Vercel 會直接把根目錄當成靜態網站服務。

也可以用 CLI：

```bash
npx vercel deploy --prod
```
