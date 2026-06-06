import assert from 'node:assert/strict';
import test from 'node:test';

import type { SaunaLog } from '../types/saunaLog';
import { generateXPostText } from './generateXPostText';

const baseLog: SaunaLog = {
  id: 'log-1',
  date: '2026-06-06',
  facilityName: '〇〇温泉',
  mood: 'totonotta',
  createdAt: '2026-06-06T12:00:00.000Z',
  updatedAt: '2026-06-06T12:00:00.000Z',
};

test('選択した項目からX投稿文を生成する', () => {
  const text = generateXPostText({
    ...baseLog,
    setCount: '3',
    saunaType: 'dry',
  });

  assert.equal(
    text,
    [
      'サウナ行った。',
      '今日は🫠 ととのった。',
      '',
      '〇〇温泉 / 3セット / ドライサウナ',
      '',
      '#サウナ #ととのい',
    ].join('\n'),
  );
});

test('任意項目が未選択なら施設名だけを詳細行に表示する', () => {
  const text = generateXPostText(baseLog);

  assert.match(text, /\n〇〇温泉\n/);
  assert.doesNotMatch(text, /undefined/);
});

test('メモはX投稿文に含めない', () => {
  const text = generateXPostText({
    ...baseLog,
    memo: '外気浴がよかった',
  });

  assert.doesNotMatch(text, /外気浴がよかった/);
});
