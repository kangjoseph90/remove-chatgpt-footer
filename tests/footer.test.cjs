const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const { JSDOM } = require('jsdom');

const css = readFileSync('content.css', 'utf8');
const userscript = readFileSync('user-script.js', 'utf8');
let userscriptCSS;
runInNewContext(userscript, { GM_addStyle: value => { userscriptCSS = value; } });

// Sanitized structural fixture observed on chatgpt.com on 2026-10-12.
// No conversation or account data is included.
const currentFooter = `<div class="sticky bottom-0 min-w-0 self-end">
  <div id="followup"><button>Follow up</button></div>
  <div id="disclaimer" class="text-center text-xs text-pretty text-codex-description select-none min-h-6 px-toolbar pb-2" data-markdown-copy="exclude">ChatGPT는 실수할 수 있습니다. 중요한 정보는 확인하세요.</div>
</div>`;

function page(style, body) {
  const dom = new JSDOM(`<html><head><style>${style}</style></head><body>${body}</body></html>`);
  return {
    dom,
    document: dom.window.document,
    display: id => dom.window.getComputedStyle(dom.window.document.getElementById(id)).display,
  };
}

for (const [name, style] of [['extension', css], ['userscript', userscriptCSS]]) {
  test(`${name}: reproduces the old selector failure and hides the current footer`, () => {
    const before = page('[data-testid="thread-disclaimer"] { display: none !important; }', currentFooter);
    assert.notEqual(before.display('disclaimer'), 'none');
    before.dom.window.close();
    const after = page(style, currentFooter);
    assert.equal(after.display('disclaimer'), 'none');
    assert.notEqual(after.display('followup'), 'none');
    after.dom.window.close();
  });

  test(`${name}: retains support for the legacy footer`, () => {
    const p = page(style, '<div id="legacy" data-testid="thread-disclaimer">Disclaimer</div>');
    assert.equal(p.display('legacy'), 'none');
    p.dom.window.close();
  });

  test(`${name}: preserves messages, composer, and unrelated copy-excluded elements`, () => {
    const p = page(style, `${currentFooter}
      <article id="message">ChatGPT는 실수할 수 있습니다. 중요한 정보는 확인하세요.</article>
      <textarea id="composer"></textarea>
      <div id="outside" class="text-center text-xs text-codex-description" data-markdown-copy="exclude">Other notice</div>
      <div class="sticky bottom-0">
        <div id="control" data-markdown-copy="exclude"><button>Send</button></div>
        <div id="description" class="text-xs text-codex-description" data-markdown-copy="exclude">Other description</div>
        <article><div id="nested" class="text-center text-xs text-codex-description" data-markdown-copy="exclude">Message annotation</div></article>
      </div>`);
    for (const id of ['message', 'composer', 'outside', 'control', 'description', 'nested']) {
      assert.notEqual(p.display(id), 'none', id);
    }
    p.dom.window.close();
  });

  test(`${name}: handles late insertion, replacement, and translated text`, () => {
    const p = page(style, '<main id="thread"></main>');
    const thread = p.document.getElementById('thread');
    thread.innerHTML = currentFooter;
    assert.equal(p.display('disclaimer'), 'none');
    thread.innerHTML = currentFooter.replace('ChatGPT는 실수할 수 있습니다. 중요한 정보는 확인하세요.', 'ChatGPT can make mistakes. Check important info.');
    assert.equal(p.display('disclaimer'), 'none');
    p.dom.window.close();
  });
}

test('extension and userscript ship the same CSS rules and version', () => {
  const normalizedRules = style => style.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
  assert.equal(normalizedRules(css), normalizedRules(userscriptCSS));
  const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
  assert.match(userscript, new RegExp(`@version\\s+${manifest.version.replaceAll('.', '\\.')}(?:\\s|$)`));
  assert.equal(require('../package.json').version, manifest.version);
  assert.deepEqual(manifest.content_scripts[0].css, ['content.css']);
  assert.equal(manifest.content_scripts[0].run_at, 'document_start');
  assert.equal(manifest.permissions, undefined);
});
