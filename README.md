# cloud_deploy_on_vercel

示範在 vercel 上部署。網站本身就是一份講「怎麼部署到 Vercel」的網頁簡報。

## 內容

```
├── index.html      → /         簡報目錄：分組列出每一張，點擊直接跳頁
├── slides.html     → /slides   簡報本體，共 15 張
└── vercel.json                 乾淨網址與安全性標頭
```

純 HTML / CSS / JavaScript，零相依套件、零建置流程。

## 簡報操作

| 操作 | 按鍵 |
|---|---|
| 翻頁 | `←` `→`、`Space`、`PageUp` / `PageDown` |
| 跳到頭尾 | `Home` / `End` |
| 總覽（縮圖跳頁） | `O`，`Esc` 關閉 |
| 全螢幕 | `F` |

手機可左右滑動翻頁。網址列會帶頁碼（例如 `/slides#12`），可以直接分享到特定某一頁。
瀏覽器列印時每張投影片各自成頁，可輸出成 PDF。

## 本機預覽

```bash
python3 -m http.server 3000
# 目錄頁 http://localhost:3000
# 簡報   http://localhost:3000/slides.html
```

註：`vercel.json` 的 `cleanUrls` 讓線上網址是 `/slides`，但本機的簡易伺服器沒有這項功能，
要加上 `.html` 才開得起來。用 `npx vercel dev` 則與線上行為一致。

## 部署到 Vercel

1. 到 <https://vercel.com/new> 登入，Import 這個 repo。
2. Framework Preset 選 `Other`，Build Command 與 Output Directory 留空。
3. Deploy。

之後 push 到 `main` 會自動部署到正式站，開 PR 會產生 Preview 部署。
