import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  moodOptions,
  saunaTypeOptions,
  setCountOptions,
} from '../constants/saunaOptions';
import type { RootStackParamList } from '../navigation/types';
import {
  deleteSaunaLog,
  getSaunaLogById,
} from '../storage/saunaLogStorage';
import type { SaunaLog } from '../types/saunaLog';

type Props = NativeStackScreenProps<RootStackParamList, 'LogDetail'>;

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export const LogDetailScreen = ({ navigation, route }: Props) => {
  const [log, setLog] = useState<SaunaLog>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadLog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const storedLog = await getSaunaLogById(route.params.logId);

      if (!storedLog) {
        setErrorMessage('この記録は見つかりませんでした。');
        return;
      }

      setLog(storedLog);
    } catch {
      setErrorMessage('記録を読み込めませんでした。');
    } finally {
      setIsLoading(false);
    }
  }, [route.params.logId]);

  useFocusEffect(
    useCallback(() => {
      void loadLog();
    }, [loadLog]),
  );

  const confirmDelete = () => {
    Alert.alert(
      'この記録を削除しますか？',
      '削除すると元に戻せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await deleteSaunaLog(route.params.logId);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              } catch {
                Alert.alert(
                  '削除できませんでした',
                  'もう一度お試しください。',
                );
              }
            })();
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#c96f45" size="large" />
      </View>
    );
  }

  if (!log || errorMessage) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void loadLog()}
          style={styles.outlineButton}
        >
          <Text style={styles.outlineButtonText}>もう一度読み込む</Text>
        </Pressable>
      </View>
    );
  }

  const mood = moodOptions.find((option) => option.value === log.mood);
  const setCount = setCountOptions.find(
    (option) => option.value === log.setCount,
  );
  const saunaType = saunaTypeOptions.find(
    (option) => option.value === log.saunaType,
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.date}>{log.date.replaceAll('-', '/')}</Text>
      <Text style={styles.facilityName}>{log.facilityName}</Text>
      <Text style={styles.mood}>
        {mood?.icon} {mood?.label}
      </Text>

      <View style={styles.details}>
        {setCount ? (
          <DetailItem label="セット数" value={setCount.label} />
        ) : null}
        {saunaType ? (
          <DetailItem label="サウナの種類" value={saunaType.label} />
        ) : null}
        {log.memo ? <DetailItem label="メモ" value={log.memo} /> : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('EditLog', { logId: route.params.logId })
          }
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>編集する</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={confirmDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.deleteButtonText}>削除する</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  date: {
    color: '#7b827d',
    fontSize: 15,
  },
  facilityName: {
    color: '#2f3a34',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
  },
  mood: {
    color: '#3f4943',
    fontSize: 22,
    marginTop: 20,
  },
  details: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 28,
    padding: 20,
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    color: '#7b827d',
    fontSize: 13,
    marginBottom: 6,
  },
  detailValue: {
    color: '#2f3a34',
    fontSize: 17,
    lineHeight: 25,
  },
  actions: {
    gap: 12,
    marginTop: 32,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#c96f45',
    borderRadius: 14,
    padding: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    alignItems: 'center',
    borderColor: '#bd3d3d',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  deleteButtonText: {
    color: '#bd3d3d',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  errorMessage: {
    color: '#667069',
    fontSize: 16,
    textAlign: 'center',
  },
  outlineButton: {
    borderColor: '#c96f45',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  outlineButtonText: {
    color: '#c96f45',
    fontWeight: '700',
  },
});
