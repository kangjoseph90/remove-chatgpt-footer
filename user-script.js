// ==UserScript==
// @name         Remove ChatGPT Footer
// @namespace    https://github.com/kangjoseph90
// @version      1.0.1
// @description  ChatGPT 대화 하단의 footer를 숨깁니다.
// @author       kangjoseph90
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
  [data-testid="thread-disclaimer"],
  .sticky.bottom-0 > div[data-markdown-copy="exclude"].text-center.text-xs.text-codex-description {
    display: none !important;
  }
`);
