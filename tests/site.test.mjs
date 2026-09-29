// Static checks for the portfolio. Run with: node --test tests/site.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

// Project screenshots may be missing: the page draws a cover in their place
// until the files are added.
const OPTIONAL = new Set([
  'assets/img/excellence-hub.png',
  'assets/img/oneten-exporter.png'
]);

// Every src, href and srcset value that points at a file in this repository.
function localRefs(source) {
  const refs = [];
  for (const match of source.matchAll(/\b(src|href|srcset)="([^"]*)"/g)) {
    const candidates = match[1] === 'srcset'
      ? match[2].split(',').map((part) => part.trim().split(/\s+/)[0])
      : [match[2]];
    for (const value of candidates) {
      if (!value || /^(?:[a-z]+:|#|\/\/)/i.test(value)) continue;
      refs.push(posix.normalize(decodeURI(value.split(/[?#]/)[0])));
    }
  }
  return refs;
}

const refs = localRefs(html);

test('every local file the page references exists', () => {
  assert.ok(refs.length > 0, 'no local references found');
  const missing = refs.filter((ref) => !OPTIONAL.has(ref) && !existsSync(join(root, ref)));
  assert.deepEqual(missing, []);
});

test('the page only references files inside assets/', () => {
  const outside = refs.filter((ref) => !ref.startsWith('assets/'));
  assert.deepEqual(outside, []);
});

test('index.html is plain ASCII', () => {
  const offenders = [...html].filter((ch) => ch.charCodeAt(0) > 127);
  assert.deepEqual(offenders, []);
});

test('.gitignore publishes only allowlisted site files', () => {
  const lines = readFileSync(join(root, '.gitignore'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim());
  const firstRule = lines.find((line) => line && !line.startsWith('#'));
  assert.equal(firstRule, '/*', 'the first rule must ignore everything');
  for (const entry of ['!/index.html', '!/assets/']) {
    assert.ok(lines.includes(entry), entry + ' is missing from .gitignore');
  }
});
