import assert from 'node:assert/strict';
import test from 'node:test';
import { renderWordmark, WORDMARK_WIDTH, type ShadowPaint } from './wordmark';

const FRONT = [
  '██████▄  ███████  ██████   ██████  ██████ ',
  '██▄▄▄██  ██▄▄▄██  ██▄▄▄██  ██  ██    ██   ',
  '██▀███   ██▀▀▀██  ██▀▀▀██  ██  ██    ██   ',
  '██  ▀██  ██   ██  ██████   ██████    ██   ',
];

const tagged: ShadowPaint = {
  foreground: (text) => `<${text}>`,
  background: (text) => `[${text}]`,
};

test('draws only the front layer when there is no shadow paint', () => {
  assert.deepEqual(renderWordmark(null), FRONT);
});

test('is four rows of 42 cells', () => {
  assert.equal(WORDMARK_WIDTH, 42);
  assert.deepEqual(renderWordmark(null).map((row) => row.length), [42, 42, 42, 42]);
});

test('shadows the cell to the right of every filled edge', () => {
  assert.deepEqual(renderWordmark(tagged), [
    '██████[▄]<▄> ███████<█> ██████<█>  ██████<█> ██████<█>',
    '██[▄]▄▄██<█> ██[▄]▄▄██<█> ██[▄]▄▄██<█> ██<█> ██<█>   ██<█>  ',
    '██[▀]███<█>  ██[▀]▀▀██<█> ██[▀]▀▀██<█> ██<█> ██<█>   ██<█>  ',
    '██<█> ▀██<█> ██<█>  ██<█> ██████<█>  ██████<█>   ██<█>  ',
  ]);
});

test('painting the shadow leaves the front layer where it was', () => {
  const erased: ShadowPaint = { foreground: () => ' ', background: (text) => text };
  assert.deepEqual(renderWordmark(erased), FRONT);
});
