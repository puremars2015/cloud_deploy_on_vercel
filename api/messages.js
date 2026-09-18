import { neon } from "@neondatabase/serverless";

const MAX_NAME_LENGTH = 40;
const MAX_BODY_LENGTH = 500;
const LIST_LIMIT = 20;

// neon() 走 HTTP，不需要維護連線池，很適合 serverless 的短生命週期。
// 模組層級只建立一次，同一個實例的後續請求可以重複使用。
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "伺服器尚未設定 DATABASE_URL" });
  }

  try {
    if (req.method === "GET") {
      const rows = await sql`
        select id, name, body, created_at
        from messages
        order by created_at desc
        limit ${LIST_LIMIT}
      `;
      // 留言板內容會變動，不要讓 CDN 或瀏覽器快取舊資料。
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ messages: rows });
    }

    if (req.method === "POST") {
      const payload =
        typeof req.body === "string" ? safeParse(req.body) : req.body;

      if (!payload) {
        return res.status(400).json({ error: "請求內容不是合法的 JSON" });
      }

      const name = String(payload.name ?? "").trim();
      const body = String(payload.body ?? "").trim();

      if (!name || !body) {
        return res.status(400).json({ error: "名字和留言都不能空白" });
      }
      if (name.length > MAX_NAME_LENGTH) {
        return res.status(400).json({ error: `名字請控制在 ${MAX_NAME_LENGTH} 字以內` });
      }
      if (body.length > MAX_BODY_LENGTH) {
        return res.status(400).json({ error: `留言請控制在 ${MAX_BODY_LENGTH} 字以內` });
      }

      // 標籤樣板會自動轉成參數化查詢，字串不會被拼進 SQL，沒有注入風險。
      const [created] = await sql`
        insert into messages (name, body)
        values (${name}, ${body})
        returning id, name, body, created_at
      `;
      return res.status(201).json({ message: created });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: `不支援 ${req.method} 方法` });
  } catch (error) {
    // 詳細錯誤只留在 Vercel 的 Runtime Logs，不回給前端。
    console.error("[/api/messages]", error);
    return res.status(500).json({ error: "伺服器發生錯誤，請稍後再試" });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
