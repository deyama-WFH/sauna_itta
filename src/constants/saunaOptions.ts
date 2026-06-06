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
