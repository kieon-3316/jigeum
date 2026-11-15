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
