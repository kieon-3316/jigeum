-- 지금 뭐하니 — 2단계: 가족 로그인 전용 + 모네 할 일 + 일정표
-- Supabase 대시보드 > SQL Editor > New query 에 전부 붙여넣고 Run 하세요. (한 번만)
-- ⚠️ 실행하기 전에 Authentication > Users 에서 가족 계정을 먼저 만들어 두세요.

------------------------------------------------------------
-- 1) 기존 상태·하트: 로그인한 가족만 보고 쓸 수 있게
------------------------------------------------------------
drop policy if exists "family read status" on public.status;
drop policy if exists "family add status" on public.status;
drop policy if exists "family read hearts" on public.hearts;
drop policy if exists "family add hearts" on public.hearts;
revoke all on public.status, public.hearts from anon;
grant select, insert on public.status, public.hearts to authenticated;

drop policy if exists "auth read status" on public.status;
drop policy if exists "auth add status" on public.status;
drop policy if exists "auth read hearts" on public.hearts;
drop policy if exists "auth add hearts" on public.hearts;
create policy "auth read status" on public.status for select to authenticated using (true);
create policy "auth add status"  on public.status for insert to authenticated with check (true);
create policy "auth read hearts" on public.hearts for select to authenticated using (true);
create policy "auth add hearts"  on public.hearts for insert to authenticated with check (true);

------------------------------------------------------------
-- 2) 새 테이블
------------------------------------------------------------
create table if not exists public.todo_items (
  id bigint generated always as identity primary key,
  slot text not null check (slot in ('morning', 'evening')),
  sort int not null default 0,
  emoji text not null default '⭐',
  title text not null,
  sub text,
  weekday_only boolean not null default false,   -- true면 주말에는 숨김
  active boolean not null default true
);

create table if not exists public.todo_done (
  item_id bigint not null references public.todo_items(id) on delete cascade,
  day date not null,
  by_member text not null default 'monet',
  done_at timestamptz not null default now(),
  primary key (item_id, day)
);

create table if not exists public.lessons (
  id bigint generated always as identity primary key,
  day date not null,
  seq numeric not null,          -- 순서 (쉬는 시간은 4.5, 7.5)
  label text,                    -- 표시용 교시 (예: '2~4교시')
  subject text not null,
  topic text,
  kind text not null default 'class' check (kind in ('class', 'break', 'event')),
  starts time,
  ends time
);
create index if not exists lessons_day on public.lessons (day, seq);

create table if not exists public.day_info (
  day date primary key,
  leader text,
  wdf text
);

create table if not exists public.extras (
  id bigint generated always as identity primary key,
  dow int not null check (dow between 0 and 6),   -- 0=일 1=월 … 6=토
  emoji text not null,
  title text not null,
  starts time,
  ends time,
  sort int not null default 0
);

alter table public.todo_items enable row level security;
alter table public.todo_done  enable row level security;
alter table public.lessons    enable row level security;
alter table public.day_info   enable row level security;
alter table public.extras     enable row level security;

grant select on public.todo_items, public.todo_done, public.lessons, public.day_info, public.extras to authenticated;
grant insert, delete on public.todo_done to authenticated;

drop policy if exists "auth read todo_items" on public.todo_items;
drop policy if exists "auth read todo_done" on public.todo_done;
drop policy if exists "auth add todo_done" on public.todo_done;
drop policy if exists "auth del todo_done" on public.todo_done;
drop policy if exists "auth read lessons" on public.lessons;
drop policy if exists "auth read day_info" on public.day_info;
drop policy if exists "auth read extras" on public.extras;
create policy "auth read todo_items" on public.todo_items for select to authenticated using (true);
create policy "auth read todo_done"  on public.todo_done  for select to authenticated using (true);
create policy "auth add todo_done"   on public.todo_done  for insert to authenticated with check (true);
create policy "auth del todo_done"   on public.todo_done  for delete to authenticated using (true);
create policy "auth read lessons"    on public.lessons    for select to authenticated using (true);
create policy "auth read day_info"   on public.day_info   for select to authenticated using (true);
create policy "auth read extras"     on public.extras     for select to authenticated using (true);

alter publication supabase_realtime add table public.todo_done;

------------------------------------------------------------
-- 3) 모네 할 일 목록
------------------------------------------------------------
delete from public.todo_items;
insert into public.todo_items (slot, sort, emoji, title, sub, weekday_only) values
  ('morning', 1, '🚽', '화장실 다녀오기', null, false),
  ('morning', 2, '🧼', '손 씻기', null, false),
  ('morning', 3, '🍚', '밥 먹기', null, false),
  ('morning', 4, '🦷', '양치하기', null, false),
  ('morning', 5, '🧴', '로션 바르기', null, false),
  ('morning', 6, '👕', '옷 입기', null, false),
  ('morning', 7, '💃', '춤추기', null, false),
  ('morning', 8, '🎒', '가방 정리하기', null, true),
  ('evening', 1, '👟', '신발 정리하기', null, false),
  ('evening', 2, '🧼', '손 씻기', null, false),
  ('evening', 3, '🎒', '가방 정리하기', null, true),
  ('evening', 4, '📚', '숙제하기', '오럴리딩 · LLI · paper works', false),
  ('evening', 5, '🍽️', '저녁식사', null, false),
  ('evening', 6, '🛁', '씻기', null, false),
  ('evening', 7, '🧴', '로션 바르기', null, false),
  ('evening', 8, '🦷', '양치하기', null, false),
  ('evening', 9, '👚', '옷 정리하기', null, false);

------------------------------------------------------------
-- 4) 학원 끝나고 (매주 반복)
------------------------------------------------------------
delete from public.extras;
insert into public.extras (dow, emoji, title, sort) values
  (1, '🎻', '바이올린', 1),
  (4, '🏊', '수영', 1),
  (5, '🎻', '바이올린', 1);

------------------------------------------------------------
-- 5) 이번 주 학원 일정 (11/16 ~ 11/20)
------------------------------------------------------------
delete from public.lessons where day between '2026-11-16' and '2026-11-20';
delete from public.day_info where day between '2026-11-16' and '2026-11-20';

insert into public.day_info (day, leader, wdf) values
  ('2026-11-16', 'Anna',    'There are important jobs in the sky. The people who do these jobs work hard to help us.'),
  ('2026-11-17', 'Chelsea', 'A pilot flies airplane and helps people travel long distance.'),
  ('2026-11-18', 'Ewon',    'A flight attendant helps people inside a plane and gives them food and blankets so they are comfortable.'),
  ('2026-11-19', 'Joy',     'An astronaut rides in a rocket and travel in space. Astronauts study and work in space.'),
  ('2026-11-20', null, null);

insert into public.lessons (day, seq, label, subject, topic, kind) values
  -- 월
  ('2026-11-16', 1, null, 'Thematic Project', 'My Community', 'class'),
  ('2026-11-16', 2, null, 'Reading Street / My Show and Tell', 'The Stone Garden', 'class'),
  ('2026-11-16', 3, null, 'Speak More', 'Learning Together at School', 'class'),
  ('2026-11-16', 4, null, 'Math', 'Identify Geometric Figures', 'class'),
  ('2026-11-16', 4.5, null, 'Lunch Time & Free Time', null, 'break'),
  ('2026-11-16', 5, null, 'Leveled Literacy Intervention', 'Stone Soup', 'class'),
  ('2026-11-16', 6, null, 'Oral Reading', null, 'class'),
  ('2026-11-16', 7, null, 'National Geography Discussion', 'Unit 1-3 Extended Reading: A Son for Geppetto', 'class'),
  ('2026-11-16', 7.5, null, 'Milk Time & Break', null, 'break'),
  ('2026-11-16', 8, null, '이안서가', '이야기 돌아보기', 'class'),
  ('2026-11-16', 9, null, 'PE', '스펀지볼 놀이', 'class'),
  -- 화
  ('2026-11-17', 1, null, 'Science', 'Color Hand Fan', 'class'),
  ('2026-11-17', 2, null, 'Reading Street', 'The Stone Garden', 'class'),
  ('2026-11-17', 3, null, 'Art', 'Scarecrows', 'class'),
  ('2026-11-17', 4, null, 'Logical Creative Thinking', 'Thinking Power Puzzle', 'class'),
  ('2026-11-17', 4.5, null, 'Lunch Time & Free Time', null, 'break'),
  ('2026-11-17', 5, null, 'Leveled Literacy Intervention', 'Best New Friends', 'class'),
  ('2026-11-17', 6, null, 'Oral Reading', null, 'class'),
  ('2026-11-17', 7, null, 'Musical Drama', 'Rumpelstiltskin', 'class'),
  ('2026-11-17', 7.5, null, 'Milk Time & Break', null, 'break'),
  ('2026-11-17', 8, null, '다비수', '동수 가르기 (2)', 'class'),
  ('2026-11-17', 9, null, 'Toefl', 'mock test3', 'class'),
  -- 수
  ('2026-11-18', 1, null, 'Thematic Project', 'Rocket Races', 'class'),
  ('2026-11-18', 2, null, 'Reading Street / My Show and Tell', 'Chieri Uegaki', 'class'),
  ('2026-11-18', 3, null, 'Speak More', 'Learning Together at School', 'class'),
  ('2026-11-18', 4, null, 'Math', 'Identify Geometric Figures', 'class'),
  ('2026-11-18', 4.5, null, 'Lunch Time & Free Time', null, 'break'),
  ('2026-11-18', 5, null, 'Leveled Literacy Intervention', 'Best New Friends', 'class'),
  ('2026-11-18', 6, null, 'Oral Reading', null, 'class'),
  ('2026-11-18', 7, null, 'Ollo Robot', '식충식물2', 'class'),
  ('2026-11-18', 7.5, null, 'Milk Time & Break', null, 'break'),
  ('2026-11-18', 8, null, 'National Geography Discussion', 'Unit 1-3 Extended Reading: A Son for Geppetto', 'class'),
  ('2026-11-18', 9, null, 'Grammar', 'Practice Test', 'class'),
  -- 목
  ('2026-11-19', 1, null, 'Worwick Good Character', 'Remember to Share', 'class'),
  ('2026-11-19', 2, null, 'Reading Street', 'Poem', 'class'),
  ('2026-11-19', 3, null, 'World Painting Art', 'Decorate My Clothes!', 'class'),
  ('2026-11-19', 4, null, 'Leadership Chess', 'Castling', 'class'),
  ('2026-11-19', 4.5, null, 'Lunch Time & Free Time', null, 'break'),
  ('2026-11-19', 5, null, 'Leveled Literacy Intervention', 'The Missing Cat', 'class'),
  ('2026-11-19', 6, null, 'Oral Reading / Library Reading', null, 'class'),
  ('2026-11-19', 7, null, 'Reading Street', 'Poem', 'class'),
  ('2026-11-19', 7.5, null, 'Milk Time & Break', null, 'break'),
  ('2026-11-19', 8, null, 'New Sports', '데굴데굴 짐볼 굴리기', 'class'),
  ('2026-11-19', 9, null, 'Comprehension', 'Animals and the Seasons', 'class'),
  -- 금
  ('2026-11-20', 1, null, 'Oral Reading', null, 'class'),
  ('2026-11-20', 2, '2~4교시', 'T.B.F.A', 'Fall Glamping', 'event'),
  ('2026-11-20', 4.5, null, 'Lunch Time & Free Time', null, 'break'),
  ('2026-11-20', 5, null, 'Fun & Play', null, 'class'),
  ('2026-11-20', 6, '6~7교시', '숲 선생님과 함께하는 숲 체험', null, 'event'),
  ('2026-11-20', 7.5, null, 'Milk Time & Break', null, 'break'),
  ('2026-11-20', 8, null, 'Toefl', 'Practice Test', 'class'),
  ('2026-11-20', 9, null, 'Library Reading', null, 'class');
