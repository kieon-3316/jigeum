-- 지금 뭐하니 — Supabase 테이블 만들기
-- Supabase 대시보드 > SQL Editor > New query 에 전부 붙여넣고 Run 하세요. (한 번만)

-- 1) 지금 뭐하는지 (상태)
create table if not exists public.status (
  id bigint generated always as identity primary key,
  member text not null check (member in ('dad', 'mom', 'monet')),
  action text not null check (char_length(action) <= 20),
  created_at timestamptz not null default now()
);

-- 2) 마음 전달 (하트)
create table if not exists public.hearts (
  id bigint generated always as identity primary key,
  from_member text not null check (from_member in ('dad', 'mom', 'monet')),
  to_member   text not null check (to_member   in ('dad', 'mom', 'monet')),
  kind text not null check (char_length(kind) <= 20),
  created_at timestamptz not null default now()
);

create index if not exists status_member_time on public.status (member, created_at desc);
create index if not exists hearts_to_time on public.hearts (to_member, created_at desc);

-- 3) 접근 권한: 읽기·추가만 허용 (수정·삭제는 불가)
alter table public.status enable row level security;
alter table public.hearts enable row level security;

grant select, insert on public.status to anon;
grant select, insert on public.hearts to anon;

drop policy if exists "family read status" on public.status;
drop policy if exists "family add status" on public.status;
drop policy if exists "family read hearts" on public.hearts;
drop policy if exists "family add hearts" on public.hearts;

create policy "family read status" on public.status for select to anon using (true);
create policy "family add status"  on public.status for insert to anon with check (true);
create policy "family read hearts" on public.hearts for select to anon using (true);
create policy "family add hearts"  on public.hearts for insert to anon with check (true);

-- 4) 실시간 전송 켜기
alter publication supabase_realtime add table public.status;
alter publication supabase_realtime add table public.hearts;
