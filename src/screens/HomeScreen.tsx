import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>サウナ行った</Text>
    <Text style={styles.description}>
      サウナ後でもかんたんに記録できる、ととのいログ
    </Text>
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.navigate('CreateLog')}
      style={styles.button}
    >
      <Text style={styles.buttonText}>＋ 今日のサウナを記録</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ee',
    paddingHorizontal: 24,
    paddingTop: 96,
  },
  title: {
    color: '#2f3a34',
    fontSize: 32,
    fontWeight: '700',
  },
  description: {
    color: '#667069',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#c96f45',
    borderRadius: 14,
    marginTop: 36,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
