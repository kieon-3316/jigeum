-- 지금 뭐하니 — 3단계: 사진 공유 + 아빠 메시지
-- Supabase 대시보드 > SQL Editor > New query 에 전부 붙여넣고 Run 하세요. (한 번만)

------------------------------------------------------------
-- 1) 메시지
------------------------------------------------------------
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  from_member text not null check (from_member in ('dad', 'mom', 'monet')),
  to_member   text not null check (to_member   in ('dad', 'mom', 'monet')),
  body text not null check (char_length(body) between 1 and 60),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_to_time on public.messages (to_member, created_at desc);

alter table public.messages enable row level security;
grant select, insert on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;   -- '읽었어요'만 바꿀 수 있음

drop policy if exists "auth read messages" on public.messages;
drop policy if exists "auth add messages" on public.messages;
drop policy if exists "auth mark read" on public.messages;
create policy "auth read messages" on public.messages for select to authenticated using (true);
create policy "auth add messages"  on public.messages for insert to authenticated with check (true);
create policy "auth mark read"     on public.messages for update to authenticated using (true) with check (true);

------------------------------------------------------------
-- 2) 사진 목록
------------------------------------------------------------
create table if not exists public.photos (
  id bigint generated always as identity primary key,
  path text not null unique,
  from_member text not null default 'dad',
  created_at timestamptz not null default now()
);
create index if not exists photos_time on public.photos (created_at desc);

alter table public.photos enable row level security;
grant select, insert, delete on public.photos to authenticated;

drop policy if exists "auth read photos" on public.photos;
drop policy if exists "auth add photos" on public.photos;
drop policy if exists "auth del photos" on public.photos;
create policy "auth read photos" on public.photos for select to authenticated using (true);
create policy "auth add photos"  on public.photos for insert to authenticated with check (true);
create policy "auth del photos"  on public.photos for delete to authenticated using (true);

------------------------------------------------------------
-- 3) 사진 저장소 (비공개 — 로그인한 가족만)
------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 3145728, array['image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg'];

drop policy if exists "family photos read" on storage.objects;
drop policy if exists "family photos add" on storage.objects;
drop policy if exists "family photos del" on storage.objects;
create policy "family photos read" on storage.objects for select to authenticated using (bucket_id = 'photos');
create policy "family photos add"  on storage.objects for insert to authenticated with check (bucket_id = 'photos');
create policy "family photos del"  on storage.objects for delete to authenticated using (bucket_id = 'photos');

------------------------------------------------------------
-- 4) 실시간 전송
------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.photos;
