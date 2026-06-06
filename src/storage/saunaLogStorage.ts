import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SaunaLog, SaunaLogInput } from '../types/saunaLog';

const STORAGE_KEY = '@sauna-itta/sauna-logs';

const sortByNewest = (logs: SaunaLog[]): SaunaLog[] =>
  [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const saveSaunaLogs = async (logs: SaunaLog[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortByNewest(logs)));
};

const createId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const getSaunaLogs = async (): Promise<SaunaLog[]> => {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  const logs: unknown = JSON.parse(storedValue);

  if (!Array.isArray(logs)) {
    throw new Error('保存されたサウナ記録の形式が正しくありません。');
  }

  return sortByNewest(logs as SaunaLog[]);
};

export const getSaunaLogById = async (
  id: string,
): Promise<SaunaLog | undefined> => {
  const logs = await getSaunaLogs();
  return logs.find((log) => log.id === id);
};

export const createSaunaLog = async (
  input: SaunaLogInput,
): Promise<SaunaLog> => {
  const logs = await getSaunaLogs();
  const now = new Date().toISOString();
  const newLog: SaunaLog = {
    ...input,
    id: createId(),
    createdAt: now,
    updatedAt: now,
  };

  await saveSaunaLogs([newLog, ...logs]);
  return newLog;
};

export const updateSaunaLog = async (
  id: string,
  input: SaunaLogInput,
): Promise<SaunaLog> => {
  const logs = await getSaunaLogs();
  const existingLog = logs.find((log) => log.id === id);

  if (!existingLog) {
    throw new Error('更新するサウナ記録が見つかりません。');
  }

  const updatedLog: SaunaLog = {
    ...existingLog,
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  };

  await saveSaunaLogs(
    logs.map((log) => (log.id === id ? updatedLog : log)),
  );

  return updatedLog;
};

export const deleteSaunaLog = async (id: string): Promise<void> => {
  const logs = await getSaunaLogs();
  await saveSaunaLogs(logs.filter((log) => log.id !== id));
};
