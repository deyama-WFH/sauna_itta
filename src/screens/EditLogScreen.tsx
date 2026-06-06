import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SaunaLogForm } from '../components/SaunaLogForm';
import type { RootStackParamList } from '../navigation/types';
import {
  getSaunaLogById,
  updateSaunaLog,
} from '../storage/saunaLogStorage';
import type { SaunaLog } from '../types/saunaLog';

type Props = NativeStackScreenProps<RootStackParamList, 'EditLog'>;

export const EditLogScreen = ({ navigation, route }: Props) => {
  const [log, setLog] = useState<SaunaLog>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadLog = async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const storedLog = await getSaunaLogById(route.params.logId);

      if (!storedLog) {
        setErrorMessage('編集する記録が見つかりませんでした。');
        return;
      }

      setLog(storedLog);
    } catch {
      setErrorMessage('記録を読み込めませんでした。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLog();
  }, [route.params.logId]);

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

  return (
    <SaunaLogForm
      initialValues={log}
      onSubmit={async (input) => {
        await updateSaunaLog(route.params.logId, input);
        navigation.goBack();
      }}
      submitLabel="保存する"
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
