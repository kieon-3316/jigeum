# 지금 뭐하니

가족이 지금 뭘 하는지 미니미 애니메이션으로 보여 주고, 버튼만으로 마음을 주고받는 보드입니다.

## 파일
| 파일 | 역할 |
|---|---|
| `board.html` | 스탠바이미에 띄우는 보드 (모네가 터치로 하트 보냄) |
| `input.html` | 아빠 휴대폰 입력 페이지 (상태 버튼 + 하트 버튼) |
| `family.js` / `family.css` | 미니미, 장면 13종, 데이터 연결 공통 코드 |
| `config.js` | Supabase 주소와 키 (여기만 수정) |
| `schema.sql` | Supabase 테이블 만들기 (한 번만 실행) |

## 연결 순서
1. **Supabase > SQL Editor > New query**: `schema.sql` 내용을 전부 붙여넣고 Run
2. **Supabase > Project Settings > API Keys**: Publishable key(또는 anon public 키)를 복사해서 `config.js`의 `PASTE_YOUR_PUBLISHABLE_KEY_HERE` 자리에 붙여넣기
3. **GitHub**: 새 저장소 `jigeum` 만들기(Public) → Add file > Upload files로 파일 7개 전부 올리기
4. **GitHub 저장소 > Settings > Pages**: Branch를 `main` / `(root)`로 두고 Save → 1~2분 뒤 주소 생성
5. 접속
   - 스탠바이미: `https://아이디.github.io/jigeum/board.html`
   - 아빠 폰: `https://아이디.github.io/jigeum/input.html` → 공유 버튼 > 홈 화면에 추가

## 주소 옵션 (나중에 엄마·모네 확장용)
- `input.html?me=mom&to=monet`: 엄마 입력 페이지
- `board.html?show=mom`: 엄마 상태 보드
- `board.html?demo`: 연결된 상태에서도 미리보기 버튼 표시

## 참고
- 키를 넣기 전에는 서버 없이 **데모 모드**로 동작합니다. 보드 위쪽 버튼으로 장면을 미리 볼 수 있어요.
- Supabase 무료 플랜은 7일 동안 사용이 없으면 일시정지됩니다. 매일 쓰면 문제없어요.
- 주소를 아는 사람은 보드를 볼 수 있습니다. 사진 기능을 붙일 때 로그인을 추가할 예정이에요.

## 2단계 업데이트 (로그인 · 할 일 · 일정)
1. Supabase > Authentication > Users > Add user > Create new user: 가족 공용 이메일·비밀번호, "Auto Confirm User" 체크
2. Supabase > Authentication > Sign In / Providers: "Allow new users to sign up" 끄기 (모르는 사람 가입 차단)
3. SQL Editor에서 `schema2.sql` 실행
4. GitHub에 `board.html`, `input.html`, `family.js` 다시 올리기 (덮어쓰기)
5. 스탠바이미와 휴대폰에서 각각 한 번 로그인

### 매주 학원 일정 바꾸기
일정표 사진을 Claude에게 보내면 그 주의 SQL을 만들어 줍니다. SQL Editor에서 실행만 하면 끝.

### 할 일 사용법
- 안 한 일: 한 번 톡 → 도장 + 별
- 실수로 누른 일: 1초 꾹 누르면 취소, 또는 아빠 폰에서 항목을 눌러 취소
- 아침 6~9시, 저녁 5~9시에는 3분 동안 아무도 안 만지면 자동으로 할 일 화면으로 돌아와요

## 3단계 업데이트 (사진 · 메시지)
1. SQL Editor에서 `schema3.sql` 실행
2. GitHub에 `board.html`, `input.html`, `family.js` 다시 올리기
- 사진: 폰에서 원본 그대로 고르면 자동으로 줄여서 올림 (긴 변 1600px JPG). 7일 지나면 폰 페이지를 열 때 자동 삭제
- 메시지: 40자까지. 보드 아빠 탭에 말풍선으로 뜨고, 모네가 '읽었어요'를 누르면 폰에 알림

## 지금 모네는? (오늘 일정 탭 맨 위)
시계 + 일정표 + 할 일 진행 상황으로 지금 하는 일을 추측해서 보여줍니다.
학원 시간은 기본값 09:30~15:30으로 잡고 교시를 고르게 나눠 '예상'으로 표시해요.
실제 등원·하원 시간이 다르면 config.js에 두 줄만 추가하세요:
  ACADEMY_START: '09:00',
  ACADEMY_END: '15:40',
