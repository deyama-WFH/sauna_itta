import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  moodOptions,
  saunaTypeOptions,
  setCountOptions,
} from '../constants/saunaOptions';
import type { RootStackParamList } from '../navigation/types';
import { getSaunaLogs } from '../storage/saunaLogStorage';
import type { SaunaLog } from '../types/saunaLog';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const formatDate = (date: string): string => date.replaceAll('-', '/');

const SaunaLogCard = ({
  log,
  onPress,
}: {
  log: SaunaLog;
  onPress: () => void;
}) => {
  const mood = moodOptions.find((option) => option.value === log.mood);
  const setCount = setCountOptions.find(
    (option) => option.value === log.setCount,
  );
  const saunaType = saunaTypeOptions.find(
    (option) => option.value === log.saunaType,
  );
  const details = [setCount?.label, saunaType?.label]
    .filter(Boolean)
    .join(' / ');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Text style={styles.date}>{formatDate(log.date)}</Text>
      <Text numberOfLines={1} style={styles.facilityName}>
        {log.facilityName}
      </Text>
      <Text style={styles.mood}>
        {mood?.icon} {mood?.label}
      </Text>
      {details ? <Text style={styles.details}>{details}</Text> : null}
    </Pressable>
  );
};

export const HomeScreen = ({ navigation }: Props) => {
  const [logs, setLogs] = useState<SaunaLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      setLogs(await getSaunaLogs());
    } catch {
      setErrorMessage('記録を読み込めませんでした。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLogs();
    }, [loadLogs]),
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={[
          styles.content,
          logs.length === 0 && styles.emptyContent,
        ]}
        data={logs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>サウナ行った</Text>
            <Text style={styles.description}>
              サウナ後でもかんたんに記録できる、ととのいログ
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('CreateLog')}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.addButtonText}>＋ 今日のサウナを記録</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>最近の記録</Text>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color="#c96f45" size="large" />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {errorMessage ?? 'まだ記録がありません'}
              </Text>
              <Text style={styles.emptyDescription}>
                {errorMessage
                  ? 'もう一度読み込んでください。'
                  : '最初のサウナを気軽に残してみましょう。'}
              </Text>
              {errorMessage ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void loadLogs()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>もう一度読み込む</Text>
                </Pressable>
              ) : null}
            </View>
          )
        }
        renderItem={({ item }) => (
          <SaunaLogCard
            log={item}
            onPress={() =>
              navigation.navigate('LogDetail', { logId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f4ee',
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 36,
  },
  title: {
    color: '#2f3a34',
    fontSize: 32,
    fontWeight: '700',
  },
  description: {
    color: '#667069',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#c96f45',
    borderRadius: 14,
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  sectionTitle: {
    color: '#2f3a34',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 36,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 18,
  },
  cardPressed: {
    opacity: 0.7,
  },
  date: {
    color: '#7b827d',
    fontSize: 13,
  },
  facilityName: {
    color: '#2f3a34',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 6,
  },
  mood: {
    color: '#3f4943',
    fontSize: 16,
    marginTop: 12,
  },
  details: {
    color: '#667069',
    fontSize: 14,
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#3f4943',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#7b827d',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    borderColor: '#c96f45',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#c96f45',
    fontSize: 14,
    fontWeight: '700',
  },
});
