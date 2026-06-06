# Codex実装指示書

## プロジェクト名

サウナ行った

## 目的

サウナ後でもかんたんに記録できる、超シンプルなととのいログアプリを実装する。

このプロジェクトでは、まずMVP完成を最優先にする。

## 最重要コンセプト

サウナ記録をがんばらない。

ユーザーがサウナ後のぼんやりした状態でも使えるように、手動入力をできるだけ減らし、選択式の入力を中心にする。

## Codexへの基本方針

実装では、以下を必ず守ること。

- まずMVP仕様書に沿って実装する
- 余計な機能を追加しない
- ログイン、クラウド同期、施設検索、画像投稿は実装しない
- UIはシンプルにする
- 手動入力を増やしすぎない
- 型定義を先に整える
- 小さな単位で実装する
- 変更後は必ず動作確認しやすい状態にする
- 可能であればテストまたは型チェックを通す

## 想定技術

まだプロジェクトが作成されていない場合は、以下の構成を推奨する。

- React Native
- Expo
- TypeScript
- AsyncStorage
- React Navigation

## 推奨ディレクトリ構成

```text
sauna-itta/
├── README.md
├── docs/
│   ├── MVP仕様書.md
│   ├── Codex実装指示書.md
│   ├── 実装タスク一覧.md
│   └── Codex初回プロンプト.md
├── app/
│   └── 必要に応じてExpo Router構成
├── src/
│   ├── components/
│   ├── constants/
│   │   └── saunaOptions.ts
│   ├── features/
│   │   └── saunaLogs/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CreateLogScreen.tsx
│   │   ├── LogDetailScreen.tsx
│   │   └── EditLogScreen.tsx
│   ├── storage/
│   │   └── saunaLogStorage.ts
│   ├── types/
│   │   └── saunaLog.ts
│   └── utils/
│       └── generateXPostText.ts
└── package.json
```

既存のテンプレートやExpo Routerを使う場合は、上記に完全一致しなくてもよい。

ただし、以下は分離すること。

- 型定義
- 選択肢定数
- ローカル保存処理
- X投稿文生成処理
- 画面コンポーネント

## 実装対象の画面

### 1. ホーム画面

役割:

- 過去のサウナ記録を新しい順で表示する
- 記録追加画面へ移動できる

表示するもの:

- アプリ名「サウナ行った」
- 「今日のサウナを記録」ボタン
- 最近の記録一覧

一覧カードに表示するもの:

- 日付
- 施設名
- ととのい度
- セット数
- サウナの種類

### 2. 記録追加画面

役割:

- 新しいサウナ記録を追加する

入力項目:

- 日付
- 施設名
- ととのい度
- セット数
- サウナの種類
- ひとことメモ

仕様:

- 日付は今日の日付を初期値にする
- 施設名は必須
- ととのい度は必須
- セット数は任意
- サウナの種類は任意
- メモは任意
- メモ欄のプレースホルダーは「書かなくてもOK」

### 3. 記録詳細画面

役割:

- 1件の記録を詳しく表示する
- X投稿
- 編集
- 削除

表示するもの:

- 日付
- 施設名
- ととのい度
- セット数
- サウナの種類
- メモ
- 「Xに投稿する」ボタン
- 「編集する」ボタン
- 「削除する」ボタン

### 4. 記録編集画面

役割:

- 既存の記録を編集する

仕様:

- 記録追加画面と同じ入力項目を表示する
- 既存データを初期値にする
- 保存時にupdatedAtを更新する

## 型定義

`src/types/saunaLog.ts` に定義する。

```ts
export type SaunaMood = 'bad' | 'normal' | 'good' | 'totonotta' | 'space';

export type SetCount = '1' | '2' | '3' | '4' | '5_or_more' | 'unknown';

export type SaunaType =
  | 'dry'
  | 'steam'
  | 'mist'
  | 'self_loyly'
  | 'auto_loyly'
  | 'salt'
  | 'ganbanyoku'
  | 'unknown';

export type SaunaLog = {
  id: string;
  date: string;
  facilityName: string;
  mood: SaunaMood;
  setCount?: SetCount;
  saunaType?: SaunaType;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};
```

## 選択肢定数

`src/constants/saunaOptions.ts` に定義する。

```ts
import type { SaunaMood, SaunaType, SetCount } from '../types/saunaLog';

export const moodOptions: ReadonlyArray<{
  value: SaunaMood;
  label: string;
  icon: string;
}> = [
  { value: 'bad', label: 'しょんぼり', icon: '😵' },
  { value: 'normal', label: 'ふつう', icon: '🙂' },
  { value: 'good', label: 'まあまあ', icon: '😌' },
  { value: 'totonotta', label: 'ととのった', icon: '🫠' },
  { value: 'space', label: '宇宙', icon: '🪐' },
];

export const setCountOptions: ReadonlyArray<{
  value: SetCount;
  label: string;
}> = [
  { value: '1', label: '1セット' },
  { value: '2', label: '2セット' },
  { value: '3', label: '3セット' },
  { value: '4', label: '4セット' },
  { value: '5_or_more', label: '5セット以上' },
  { value: 'unknown', label: '覚えてない' },
];

export const saunaTypeOptions: ReadonlyArray<{
  value: SaunaType;
  label: string;
}> = [
  { value: 'dry', label: 'ドライサウナ' },
  { value: 'steam', label: 'スチームサウナ' },
  { value: 'mist', label: 'ミストサウナ' },
  { value: 'self_loyly', label: 'セルフロウリュ' },
  { value: 'auto_loyly', label: 'オートロウリュ' },
  { value: 'salt', label: '塩サウナ' },
  { value: 'ganbanyoku', label: '岩盤浴' },
  { value: 'unknown', label: 'よくわからん' },
];
```

## X投稿文生成

`src/utils/generateXPostText.ts` に定義する。

```ts
import { moodOptions, saunaTypeOptions, setCountOptions } from '../constants/saunaOptions';
import type { SaunaLog } from '../types/saunaLog';

export const generateXPostText = (log: SaunaLog): string => {
  const mood = moodOptions.find((item) => item.value === log.mood);
  const setCount = setCountOptions.find((item) => item.value === log.setCount);
  const saunaType = saunaTypeOptions.find((item) => item.value === log.saunaType);

  const details = [log.facilityName, setCount?.label, saunaType?.label]
    .filter(Boolean)
    .join(' / ');

  return [
    'サウナ行った。',
    `今日は${mood?.icon ?? ''} ${mood?.label ?? ''}。`,
    '',
    details,
    '',
    '#サウナ #ととのい',
  ].join('\n');
};
```

## ローカル保存

MVPではAsyncStorageを使う。

`src/storage/saunaLogStorage.ts` に以下の処理を用意する。

- getSaunaLogs
- getSaunaLogById
- createSaunaLog
- updateSaunaLog
- deleteSaunaLog

保存キー例:

```ts
const SAUNA_LOGS_STORAGE_KEY = 'sauna-itta:sauna-logs';
```

## バリデーション

記録追加・編集時は以下を確認する。

| 条件 | エラー |
|---|---|
| 施設名が空 | 施設名を入力してください |
| ととのい度が未選択 | ととのい度を選んでください |

## X投稿実装方針

MVPではX API連携はしない。

React NativeのShare APIを使い、投稿文を共有できるようにする。

投稿前にユーザーが編集できる流れを優先する。

## 実装しないこと

以下はMVPでは実装しない。

- ログイン
- 会員登録
- クラウド同期
- サウナ施設検索
- 位置情報取得
- X APIによる自動投稿
- 画像投稿
- グラフ表示
- カレンダー表示
- ランキング表示

## 完了条件

MVPの完了条件は以下。

- サウナ記録を追加できる
- 記録がローカルに保存される
- アプリを再起動しても記録が残る
- 記録一覧を新しい順で見られる
- 記録詳細を見られる
- 記録を編集できる
- 記録を削除できる
- X投稿文を生成できる
- 共有機能を開ける
- TypeScriptの型エラーがない
- README.mdとMVP仕様書.mdの内容と大きく矛盾していない
