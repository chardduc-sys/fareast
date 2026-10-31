# 동방열국지 β (베타 채널)

`python3 geo/build_html.py` 를 `CHANNEL=beta` 로 돌리면 만들어짐. 배포 위치 `chardduc-sys/fareast` 의 `beta/` 폴더 → https://chardduc-sys.github.io/fareast/beta/

- 라이브와 같은 출처라 localStorage 게임 키는 `beta:` 접두사, 클라우드 세이브는 `beta_` 접두사로 분리. 로그인(Firebase)·해금 기록은 공유.
- 서비스 워커 캐시 `dongbang-beta-<VER>` — 라이브 SW(`dongbang-v<VER>`)와 서로 지우지 않음.
- 두뇌 서버 AI는 라이브와 같은 Worker(ai-core 실험은 베타만으로 못 함).
