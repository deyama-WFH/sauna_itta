import {
  moodOptions,
  saunaTypeOptions,
  setCountOptions,
} from '../constants/saunaOptions';
import type { SaunaLog } from '../types/saunaLog';

export const generateXPostText = (log: SaunaLog): string => {
  const mood = moodOptions.find((option) => option.value === log.mood);
  const setCount = setCountOptions.find(
    (option) => option.value === log.setCount,
  );
  const saunaType = saunaTypeOptions.find(
    (option) => option.value === log.saunaType,
  );
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
