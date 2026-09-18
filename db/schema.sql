-- 留言板資料表。
-- 在 Neon Dashboard 的 SQL Editor 貼上執行一次即可（可重複執行，不會出錯）。

create table if not exists messages (
  id         bigint generated always as identity primary key,
  name       text        not null,
  body       text        not null,
  created_at timestamptz not null default now()
);

-- 首頁只撈最新的幾筆，建個索引讓排序走索引而不是全表掃描。
create index if not exists messages_created_at_idx on messages (created_at desc);
