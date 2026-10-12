# Remove ChatGPT Footer

ChatGPT 대화 하단의 footer를 숨기는 Chrome/Edge 확장 프로그램과
Tampermonkey 유저 스크립트입니다.

## 확장 프로그램 설치

1. Chrome에서 `chrome://extensions`를 엽니다.
2. **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다**를 누릅니다.
4. 이 프로젝트 폴더를 선택합니다.

Edge에서는 `edge://extensions`에서 같은 방식으로 설치할 수 있습니다.

## 유저 스크립트 설치

Tampermonkey에서 새 스크립트를 만들고 `user-script.js`의 내용을 붙여
넣은 뒤 저장합니다.

## 동작 방식

CSS로 기존 `[data-testid="thread-disclaimer"]` 요소와 최신 화면의 sticky
footer 안에 있는 disclaimer를 숨깁니다. 최신 화면은 test id가 없어져,
`data-markdown-copy="exclude"` 속성과 footer의 위치·스타일을 함께 확인합니다.
문구의 언어에 의존하지 않으며 대화 본문과 입력창은 그대로 유지합니다.
CSS가 적용되므로 대화 전환이나 footer 재생성 시에도 자동으로 숨겨집니다.

확장 프로그램 업데이트 후 이미 열려 있던 ChatGPT 탭은 새로고침하세요.
압축해제 설치에서는 확장 프로그램 관리 화면의 **새로고침**도 먼저 누르세요.

## 검증 및 웹스토어 패키지

Node.js 24 이상과 `zip` 명령이 필요합니다.

```sh
npm ci
npm test
npm run package
```

`dist/remove-chatgpt-footer-1.0.1.zip`을 Chrome 웹스토어의 기존 항목에
업로드하고 심사를 제출합니다. 패키지에는 manifest, CSS, 사용하는 아이콘만
들어갑니다. 테스트와 개발 의존성은 포함하지 않습니다.

## 파일 구성

- `manifest.json`: Manifest V3 확장 설정
- `content.css`: 확장 프로그램용 숨김 스타일
- `user-script.js`: Tampermonkey용 독립 실행 버전
- `icons/`: 확장 프로그램 아이콘
- `tests/`: 구·신규 footer, 본문 보존, 동적 재생성 회귀 검증
