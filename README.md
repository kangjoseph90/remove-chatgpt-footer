# Remofe ChatGPT Footer

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

CSS로 `[data-testid="thread-disclaimer"]` 요소를 숨깁니다.

## 파일 구성

- `manifest.json`: Manifest V3 확장 설정
- `content.css`: 확장 프로그램용 숨김 스타일
- `user-script.js`: Tampermonkey용 독립 실행 버전
- `icons/`: 확장 프로그램 아이콘
